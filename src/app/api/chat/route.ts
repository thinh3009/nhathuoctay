import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { searchDrugs } from '@/db/queries/drugSearch'

// Agentic loop có thể chạy nhiều vòng tool-use → cho thêm thời gian trên serverless.
export const runtime = 'nodejs'
export const maxDuration = 60

const MODEL = 'claude-opus-4-8'
const MAX_TOKENS = 8000

const SYSTEM_PROMPT = `Bạn là trợ lý tư vấn của một nhà thuốc online tại Việt Nam. Nhiệm vụ của bạn là
giúp khách tra cứu thông tin sản phẩm (thuốc, thực phẩm chức năng, thiết bị y tế,
sản phẩm chăm sóc da) có bán tại nhà thuốc.

QUY TẮC:
- Khi khách hỏi về một sản phẩm, triệu chứng, công dụng, thành phần, giá hoặc tình
  trạng còn hàng, hãy LUÔN dùng công cụ \`search_drugs\` để tra cứu trước. Không bịa
  thông tin sản phẩm từ trí nhớ.
- Chỉ giới thiệu những sản phẩm có trong kết quả tra cứu. Nếu không tìm thấy, nói rõ
  là hiện chưa tìm thấy sản phẩm phù hợp và mời khách liên hệ dược sĩ của nhà thuốc.
- Với mỗi sản phẩm gợi ý, nêu: tên, công dụng chính, giá (định dạng tiền Việt, ví dụ
  389.000đ), tình trạng còn hàng (nếu stockQuantity > 0 là "còn hàng"), và đường dẫn
  chi tiết dạng /product/<slug>.
- Nếu sản phẩm có prescriptionRequired = true, nhắc khách rằng đây là thuốc cần kê đơn
  và cần tư vấn của bác sĩ/dược sĩ.
- KHÔNG chẩn đoán bệnh, KHÔNG đưa liều dùng cụ thể vượt quá thông tin trên sản phẩm.
  Với câu hỏi về triệu chứng, hãy gợi ý nhóm sản phẩm phù hợp và khuyên khách hỏi
  dược sĩ trước khi dùng.
- Luôn kết thúc bằng một lưu ý ngắn: thông tin chỉ mang tính tham khảo, không thay thế
  tư vấn y khoa; đọc kỹ hướng dẫn sử dụng trước khi dùng.
- Trả lời bằng tiếng Việt, ngắn gọn, thân thiện, dễ đọc.`

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_drugs',
    description:
      'Tìm sản phẩm trong cơ sở dữ liệu nhà thuốc theo tên, công dụng, triệu chứng, ' +
      'thành phần hoặc nhóm sản phẩm. Gọi công cụ này mỗi khi người dùng hỏi về một ' +
      'sản phẩm, triệu chứng, công dụng, thành phần, giá, hoặc tình trạng còn hàng — ' +
      'không trả lời từ trí nhớ.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            "Từ khoá tìm kiếm: tên thuốc, triệu chứng, công dụng, thành phần hoặc nhóm " +
            "sản phẩm. Ví dụ: 'hạ sốt', 'vitamin C', 'omega 3', 'huyết áp'.",
        },
      },
      required: ['query'],
    },
  },
]

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      }),
    )
    .min(1),
})

async function runTool(name: string, input: unknown): Promise<string> {
  if (name === 'search_drugs') {
    const query = typeof input === 'object' && input !== null ? String((input as Record<string, unknown>).query ?? '') : ''
    const results = await searchDrugs(query)
    return JSON.stringify({ results })
  }
  return JSON.stringify({ error: `Không có công cụ tên ${name}` })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Yêu cầu không hợp lệ' }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'Chưa cấu hình ANTHROPIC_API_KEY' }, { status: 500 })
  }

  const client = new Anthropic() // tự đọc ANTHROPIC_API_KEY từ môi trường
  const convo: Anthropic.MessageParam[] = parsed.data.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  const encoder = new TextEncoder()

  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Vòng lặp agentic có streaming: stream text cho client, tự chạy tool khi cần.
        // Giới hạn số vòng để tránh lặp vô hạn nếu mô hình liên tục gọi tool.
        for (let round = 0; round < 6; round += 1) {
          const stream = client.messages.stream({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: SYSTEM_PROMPT,
            tools: TOOLS,
            thinking: { type: 'adaptive' },
            output_config: { effort: 'medium' },
            messages: convo,
          })

          stream.on('text', (text) => {
            controller.enqueue(encoder.encode(text))
          })

          const final = await stream.finalMessage()

          if (final.stop_reason !== 'tool_use') {
            break
          }

          // Giữ nguyên content (gồm cả thinking block) để gửi lại đúng định dạng.
          convo.push({ role: 'assistant', content: final.content })

          const toolResults: Anthropic.ToolResultBlockParam[] = []
          for (const block of final.content) {
            if (block.type === 'tool_use') {
              const result = await runTool(block.name, block.input)
              toolResults.push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: result,
              })
            }
          }
          convo.push({ role: 'user', content: toolResults })
        }
      } catch (error) {
        console.error('Chat error:', error)
        controller.enqueue(
          encoder.encode('\n\nXin lỗi, hiện chưa kết nối được trợ lý. Vui lòng thử lại sau.'),
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(body$, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
