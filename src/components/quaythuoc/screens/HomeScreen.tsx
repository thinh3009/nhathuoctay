import { s } from '../data'
import NewsCard from '../NewsCard'
import ProductSlider from '../ProductSlider'
import type { StorefrontHub } from '../use-storefront'

/** Trang chủ storefront: hero, danh mục, các dãy sản phẩm, combo, tin tức, cam kết. */
export default function HomeScreen({ hub }: { hub: StorefrontHub }) {
  const { catCards, bestSellers, supps, skincare, devices, combos, newsHome, trustBadges, goCatScreen, goNews, openRx } = hub

  return (
    <div className="qt-home">
      {/* HERO */}
      <div style={s('max-width:1180px;margin:16px auto 0;padding:0 24px;width:100%')}>
        <div className="qt-hero" style={s('background:#eaf7ef;border-radius:22px;padding:48px 52px;display:flex;align-items:center;gap:40px;overflow:hidden')}>
          <div style={s('flex:1;min-width:0')}>
            <div style={s('display:inline-block;background:#fff;color:#1c7a45;font-size:12.5px;font-weight:600;padding:6px 13px;border-radius:20px;margin-bottom:16px')}>Nhà thuốc trực tuyến · Chính hãng 100%</div>
            <h1 style={s('font-size:42px;line-height:1.12;font-weight:800;color:#14532d;margin:0 0 14px')}>
              Chăm sóc sức khỏe
              <br />
              cho cả gia đình bạn
            </h1>
            <p style={s('font-size:16px;color:#4a564e;margin:0 0 26px;max-width:440px;line-height:1.6')}>Hơn 5.000 sản phẩm thuốc, thực phẩm chức năng và thiết bị y tế. Dược sĩ tư vấn miễn phí, giao tận nơi.</p>
            <div style={s('display:flex;gap:12px;flex-wrap:wrap')}>
              <button onClick={() => goCatScreen('thuoc')} style={s('background:#2e9e5b;color:#fff;border:none;padding:14px 26px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer')}>Mua thuốc ngay</button>
              <button onClick={openRx} style={s('background:#fff;color:#1c7a45;border:1.5px solid #cfe6da;padding:14px 24px;border-radius:12px;font-weight:600;font-size:15px;cursor:pointer')}>Đặt thuốc theo toa</button>
            </div>
            <div style={s('display:flex;gap:26px;margin-top:30px')}>
              <div><div style={s('font-size:22px;font-weight:800;color:#14532d')}>5.000+</div><div style={s('font-size:12.5px;color:#8a948e')}>Sản phẩm</div></div>
              <div><div style={s('font-size:22px;font-weight:800;color:#14532d')}>2 giờ</div><div style={s('font-size:12.5px;color:#8a948e')}>Giao nội thành</div></div>
              <div><div style={s('font-size:22px;font-weight:800;color:#14532d')}>24/7</div><div style={s('font-size:12.5px;color:#8a948e')}>Dược sĩ tư vấn</div></div>
            </div>
          </div>
          <div className="qt-hero-img" style={s('width:340px;flex-shrink:0;background:repeating-linear-gradient(135deg,#d7eede,#d7eede 11px,#cde7d6 11px,#cde7d6 22px);border-radius:18px;height:300px;display:flex;align-items:center;justify-content:center;color:#5a8a6e;font:600 12px ui-monospace,monospace;text-align:center')}>
            ảnh hero
            <br />
            (sản phẩm / dược sĩ)
          </div>
        </div>
      </div>

      {/* category cards */}
      <div className="qt-hide-mobile" style={s('max-width:1180px;margin:46px auto 0;padding:0 24px;width:100%')}>
        <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0 0 18px')}>Danh mục sản phẩm</h2>
        <div style={s('display:grid;grid-template-columns:repeat(4,1fr);gap:14px')}>
          {catCards.map((c, i) => (
            <div key={i} onClick={c.onClick} className="qt-card" style={s('background:#fff;border:1px solid #e7efe9;border-radius:18px;padding:24px;cursor:pointer;display:flex;align-items:center;gap:18px;transition:box-shadow .15s')}>
              <div style={{ ...s('width:62px;height:62px;border-radius:16px;position:relative;flex-shrink:0'), background: c.tintBg }}>
                <div style={{ ...s('position:absolute;left:38%;top:24%;width:24%;height:52%;border-radius:5px'), background: c.tintFg }} />
                <div style={{ ...s('position:absolute;top:38%;left:24%;height:24%;width:52%;border-radius:5px'), background: c.tintFg }} />
              </div>
              <div>
                <div style={s('font-size:17px;font-weight:700;color:#1f2a24')}>{c.label}</div>
                <div style={s('font-size:13px;color:#8a948e;margin-top:3px')}>{c.desc}</div>
                <div style={s('font-size:12.5px;color:#2e9e5b;font-weight:600;margin-top:8px')}>{c.countText} →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* best sellers */}
      <ProductSlider title="🔥 Bán chạy nhất" cards={bestSellers} actionLabel="Xem tất cả →" onAction={() => goCatScreen('thuoc')} />

      {/* combos */}
      <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
        <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0 0 18px')}>💚 Combo tiết kiệm</h2>
        <div className="qt-slider" style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:18px')}>
          {combos.map((k, i) => (
            <div key={i} style={s('background:#fff;border:1px solid #e7efe9;border-radius:18px;overflow:hidden;display:flex;flex-direction:column')}>
              <div style={s('background:#2e9e5b;color:#fff;padding:9px 18px;font-size:13px;font-weight:600;display:flex;justify-content:space-between')}><span>{k.tag}</span><span>{k.saveText}</span></div>
              <div style={s('padding:20px;display:flex;flex-direction:column;gap:12px;flex:1')}>
                <div style={s('font-size:17px;font-weight:700;color:#14532d')}>{k.title}</div>
                <div style={s('display:flex;flex-direction:column;gap:7px;flex:1')}>
                  {k.items.map((it, j) => (
                    <div key={j} style={s('font-size:13.5px;color:#4a564e;display:flex;gap:8px')}><span style={s('color:#2e9e5b')}>✓</span>{it}</div>
                  ))}
                </div>
                <div style={s('display:flex;align-items:flex-end;justify-content:space-between;margin-top:6px')}>
                  <div><div style={s('font-size:20px;font-weight:800;color:#1c7a45')}>{k.priceText}</div><div style={s('font-size:12.5px;color:#b3bdb6;text-decoration:line-through')}>{k.oldPriceText}</div></div>
                  <button onClick={k.onAdd} style={s('background:#eaf6ef;color:#1c7a45;border:none;padding:11px 18px;border-radius:10px;font-weight:700;font-size:13.5px;cursor:pointer')}>Mua combo</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* supplements */}
      <ProductSlider title="Thực phẩm chức năng nổi bật" cards={supps} actionLabel="Xem tất cả →" onAction={() => goCatScreen('tpcn')} />

      {/* skincare */}
      <ProductSlider title="✨ Chăm sóc da" cards={skincare} actionLabel="Xem tất cả →" onAction={() => goCatScreen('skincare')} />

      {/* prescription band */}
      <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
        <div className="qt-band" style={s('background:#eaf7ef;border-radius:20px;padding:36px 44px;display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap')}>
          <div style={s('display:flex;align-items:center;gap:22px')}>
            <div style={s('font-size:46px')}>📋</div>
            <div><div style={s('font-size:24px;font-weight:800;color:#14532d')}>Có toa của bác sĩ?</div><div style={s('font-size:15px;color:#4a564e;margin-top:6px')}>Chụp ảnh toa thuốc, dược sĩ soạn đơn và giao tận nhà cho bạn.</div></div>
          </div>
          <button onClick={openRx} style={s('background:#2e9e5b;color:#fff;border:none;padding:15px 30px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer')}>Đặt thuốc theo toa</button>
        </div>
      </div>

      {/* devices */}
      <ProductSlider title="Thiết bị y tế" cards={devices} actionLabel="Xem tất cả →" onAction={() => goCatScreen('thietbi')} />

      {/* news */}
      <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
        <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px')}>
          <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0')}>📰 Tin tức sức khỏe</h2>
          <span onClick={goNews} style={s('font-size:13.5px;color:#2e9e5b;font-weight:600;cursor:pointer')}>Xem tất cả →</span>
        </div>
        <div className="qt-slider" style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:18px')}>
          {newsHome.map((a, i) => (
            <NewsCard key={i} article={a} />
          ))}
        </div>
      </div>

      {/* trust strip */}
      <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
        <div className="qt-grid2" style={s('background:#fff;border:1px solid #e7efe9;border-radius:18px;padding:26px;display:grid;grid-template-columns:repeat(4,1fr);gap:18px')}>
          {trustBadges.map((t, i) => (
            <div key={i} style={s('display:flex;align-items:center;gap:13px')}>
              <div style={s('width:46px;height:46px;background:#eaf6ef;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#2e9e5b;font-size:20px;flex-shrink:0')}>{t.icon}</div>
              <div><div style={s('font-size:14px;font-weight:700;color:#1f2a24')}>{t.title}</div><div style={s('font-size:12.5px;color:#8a948e')}>{t.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
