import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Style từng phần tử Markdown bằng Tailwind (dự án không dùng plugin typography).
const components: Components = {
  h1: ({ node: _node, ...props }) => (
    <h1 className="mb-3 mt-6 text-2xl font-bold text-stone-900" {...props} />
  ),
  h2: ({ node: _node, ...props }) => (
    <h2 className="mb-2 mt-5 text-xl font-bold text-stone-900" {...props} />
  ),
  h3: ({ node: _node, ...props }) => (
    <h3 className="mb-2 mt-4 text-lg font-semibold text-stone-900" {...props} />
  ),
  p: ({ node: _node, ...props }) => <p className="mb-3 leading-7 text-stone-700" {...props} />,
  ul: ({ node: _node, ...props }) => (
    <ul className="mb-3 list-disc space-y-1 pl-6 text-stone-700" {...props} />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-6 text-stone-700" {...props} />
  ),
  li: ({ node: _node, ...props }) => <li className="leading-7" {...props} />,
  a: ({ node: _node, ...props }) => (
    <a className="font-medium text-emerald-700 underline hover:text-emerald-800" {...props} />
  ),
  blockquote: ({ node: _node, ...props }) => (
    <blockquote className="my-3 border-l-4 border-emerald-200 pl-4 italic text-stone-600" {...props} />
  ),
  code: ({ node: _node, ...props }) => (
    <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm text-emerald-700" {...props} />
  ),
  strong: ({ node: _node, ...props }) => (
    <strong className="font-semibold text-stone-900" {...props} />
  ),
  img: ({ node: _node, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-4 rounded-xl" loading="lazy" alt={props.alt ?? ''} {...props} />
  ),
}

export default function MarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {children}
    </ReactMarkdown>
  )
}
