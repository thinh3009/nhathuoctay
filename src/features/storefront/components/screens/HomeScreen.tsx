import { s } from '../../data'
import HeroCarousel from '../HeroCarousel'
import NewsCard from '../NewsCard'
import ProductSlider from '../ProductSlider'
import type { StorefrontHub } from '../../use-storefront'

/** Trang chủ storefront: hero, danh mục, các dãy sản phẩm, combo, tin tức, cam kết. */
export default function HomeScreen({ hub }: { hub: StorefrontHub }) {
  const { catCards, bestSellers, supps, skincare, devices, combos, heroImages, newsHome, trustBadges, goCatScreen, goNews, openRx, openConsult, ctaImage } = hub

  // Nền dải CTA: ảnh admin đặt (phủ lớp mờ để chữ dễ đọc) hoặc nền xanh ngọc mặc định.
  const ctaBandStyle = ctaImage
    ? { ...s('border-radius:var(--radius-xl);border:1px solid var(--teal-100);padding:36px 44px;display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap'), backgroundImage: `linear-gradient(rgba(255,255,255,0.82), rgba(255,255,255,0.82)), url(${ctaImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : s('background:var(--teal-50);border-radius:var(--radius-xl);border:1px solid var(--teal-100);padding:36px 44px;display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap')

  return (
    <div className="qt-home">
      {/* HERO */}
      <div style={s('max-width:1180px;margin:16px auto 0;padding:0 24px;width:100%')}>
        <div className="qt-hero" style={s('background:var(--teal-50);border-radius:var(--radius-xl);padding:48px 52px;display:flex;align-items:center;gap:40px;overflow:hidden')}>
          <div style={s('flex:1;min-width:0')}>
            <div style={s('display:inline-block;background:var(--neutral-0);color:var(--color-brand-primary);font-size:12.5px;font-weight:600;padding:6px 13px;border-radius:var(--radius-pill);margin-bottom:16px')}>Nhà thuốc trực tuyến · Chính hãng 100%</div>
            <h1 style={s('font:var(--text-display-lg);color:var(--color-text-heading);margin:0 0 14px')}>
              Chăm sóc sức khỏe
              <br />
              cho cả gia đình bạn
            </h1>
            <p style={s('font:var(--text-body-lg);color:var(--color-text-body);margin:0 0 26px;max-width:440px')}>Hơn 5.000 sản phẩm thuốc, thực phẩm chức năng và thiết bị y tế. Dược sĩ tư vấn miễn phí, giao tận nơi.</p>
            <div style={s('display:flex;gap:12px;flex-wrap:wrap')}>
              <button onClick={() => goCatScreen('thuoc')} style={s('background:var(--color-brand-primary);color:#fff;border:none;padding:14px 26px;border-radius:var(--radius-pill);font-weight:700;font-size:15px;cursor:pointer')}>Mua thuốc ngay</button>
              <button onClick={openConsult} style={s('display:flex;align-items:center;gap:8px;background:var(--color-brand-accent);color:#fff;border:none;padding:14px 24px;border-radius:var(--radius-pill);font-weight:700;font-size:15px;cursor:pointer;box-shadow:0 8px 20px rgba(240,147,13,0.35)')}><i className="ph-fill ph-stethoscope" style={s('font-size:18px')} /> Tư vấn bác sĩ</button>
              <button onClick={openRx} style={s('background:var(--neutral-0);color:var(--color-brand-primary);border:1.5px solid var(--color-brand-primary);padding:14px 24px;border-radius:var(--radius-pill);font-weight:600;font-size:15px;cursor:pointer')}>Đặt thuốc theo toa</button>
            </div>
            <div style={s('display:flex;gap:26px;margin-top:30px')}>
              <div><div style={s('font:var(--text-heading-lg);color:var(--color-text-heading)')}>5.000+</div><div style={s('font-size:12.5px;color:var(--color-text-muted)')}>Sản phẩm</div></div>
              <div><div style={s('font:var(--text-heading-lg);color:var(--color-text-heading)')}>2 giờ</div><div style={s('font-size:12.5px;color:var(--color-text-muted)')}>Giao nội thành</div></div>
              <div><div style={s('font:var(--text-heading-lg);color:var(--color-text-heading)')}>24/7</div><div style={s('font-size:12.5px;color:var(--color-text-muted)')}>Dược sĩ tư vấn</div></div>
            </div>
          </div>
          <div className="qt-hero-img" style={s('width:340px;flex-shrink:0;border-radius:var(--radius-lg);height:300px;overflow:hidden;border:1px solid var(--teal-200)')}>
            <HeroCarousel images={heroImages} />
          </div>
        </div>
      </div>

      {/* trust strip — nổi lên mép dưới hero, giống feature bar trong design */}
      <div className="qt-hide-mobile" style={s('max-width:1180px;margin:-28px auto 0;padding:0 24px;width:100%;position:relative;z-index:1')}>
        <div className="qt-grid2" style={s('background:var(--neutral-0);border-radius:var(--radius-lg);box-shadow:var(--shadow-md);padding:22px 12px;display:grid;grid-template-columns:repeat(4,1fr)')}>
          {trustBadges.map((t, i) => (
            <div key={i} style={{ ...s('display:flex;align-items:center;gap:13px;padding:0 18px'), borderRight: i < trustBadges.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
              <div style={s('width:44px;height:44px;background:var(--teal-50);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--color-brand-primary);font-size:21px;flex-shrink:0')}><i className={'ph ' + t.icon} /></div>
              <div><div style={s('font-size:14px;font-weight:700;color:var(--color-text-heading)')}>{t.title}</div><div style={s('font-size:12.5px;color:var(--color-text-muted)')}>{t.desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* category cards */}
      <div className="qt-hide-mobile" style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
        <h2 style={s('font:var(--text-heading-lg);color:var(--color-text-heading);margin:0 0 18px')}>Danh mục sản phẩm</h2>
        <div style={s('display:grid;grid-template-columns:repeat(4,1fr);gap:14px')}>
          {catCards.map((c, i) => (
            <div key={i} onClick={c.onClick} className="qt-card" style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:24px;cursor:pointer;display:flex;align-items:center;gap:18px;transition:box-shadow var(--duration-base)')}>
              <div style={{ ...s('width:62px;height:62px;border-radius:var(--radius-md);position:relative;flex-shrink:0'), background: c.tintBg }}>
                <div style={{ ...s('position:absolute;left:38%;top:24%;width:24%;height:52%;border-radius:5px'), background: c.tintFg }} />
                <div style={{ ...s('position:absolute;top:38%;left:24%;height:24%;width:52%;border-radius:5px'), background: c.tintFg }} />
              </div>
              <div>
                <div style={s('font-size:17px;font-weight:700;color:var(--color-text-heading)')}>{c.label}</div>
                <div style={s('font-size:13px;color:var(--color-text-muted);margin-top:3px')}>{c.desc}</div>
                <div style={s('font-size:12.5px;color:var(--color-brand-primary);font-weight:600;margin-top:8px')}>{c.countText} →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* best sellers */}
      <ProductSlider title="Bán chạy nhất" cards={bestSellers} actionLabel="Xem tất cả →" onAction={() => goCatScreen('thuoc')} />

      {/* combos — chỉ hiện khi admin đã tạo combo (không còn dữ liệu giả) */}
      {combos.length > 0 ? (
      <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
        <h2 style={s('font:var(--text-heading-lg);color:var(--color-text-heading);margin:0 0 18px')}>Combo tiết kiệm</h2>
        <div className="qt-slider qt-combos" style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:18px')}>
          {combos.map((k, i) => (
            <div key={i} style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);overflow:hidden;display:flex;flex-direction:column')}>
              <div style={s('background:var(--color-brand-primary);color:#fff;padding:9px 18px;font-size:13px;font-weight:600;display:flex;justify-content:space-between')}><span>{k.tag}</span><span>{k.saveText}</span></div>
              <div style={s('padding:20px;display:flex;flex-direction:column;gap:12px;flex:1')}>
                <div style={s('font-size:17px;font-weight:700;color:var(--color-text-heading)')}>{k.title}</div>
                <div style={s('display:flex;flex-direction:column;gap:7px;flex:1')}>
                  {k.items.map((it, j) => (
                    <div key={j} style={s('font-size:13.5px;color:var(--color-text-body);display:flex;gap:8px')}><i className="ph-bold ph-check" style={s('color:var(--color-brand-primary)')} />{it}</div>
                  ))}
                </div>
                <div className="qt-combo-foot" style={s('display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-top:6px')}>
                  <div><div style={{ ...s('font:var(--text-heading-md)'), color: 'var(--color-brand-accent)' }}>{k.priceText}</div><div style={s('font-size:12.5px;color:var(--neutral-400);text-decoration:line-through')}>{k.oldPriceText}</div></div>
                  <button className="qt-combo-btn" onClick={k.onAdd} style={s('background:var(--teal-50);color:var(--teal-800);border:none;padding:11px 18px;border-radius:var(--radius-pill);font-weight:700;font-size:13.5px;cursor:pointer;white-space:nowrap;flex-shrink:0')}>Mua combo</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      ) : null}

      {/* supplements */}
      <ProductSlider title="Thực phẩm chức năng nổi bật" cards={supps} actionLabel="Xem tất cả →" onAction={() => goCatScreen('tpcn')} />

      {/* skincare */}
      <ProductSlider title="Chăm sóc da" cards={skincare} actionLabel="Xem tất cả →" onAction={() => goCatScreen('skincare')} />

      {/* prescription band */}
      <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
        <div className="qt-band" style={ctaBandStyle}>
          <div style={s('display:flex;align-items:center;gap:22px')}>
            <div style={s('width:64px;height:64px;border-radius:50%;background:var(--teal-100);color:var(--teal-700);display:flex;align-items:center;justify-content:center;flex-shrink:0')}><i className="ph ph-first-aid-kit" style={s('font-size:32px')} /></div>
            <div><div style={s('font:var(--text-heading-md);color:var(--color-text-heading)')}>Có toa của bác sĩ?</div><div style={s('font-size:15px;color:var(--color-text-body);margin-top:6px')}>Chụp ảnh toa thuốc, dược sĩ soạn đơn và giao tận nhà cho bạn.</div></div>
          </div>
          <div style={s('display:flex;gap:12px;flex-wrap:wrap')}>
            <button onClick={openConsult} style={s('display:flex;align-items:center;gap:8px;background:var(--color-brand-accent);color:#fff;border:none;padding:15px 26px;border-radius:var(--radius-pill);font-weight:700;font-size:15px;cursor:pointer;box-shadow:0 8px 20px rgba(240,147,13,0.35)')}><i className="ph-fill ph-stethoscope" style={s('font-size:18px')} /> Tư vấn bác sĩ</button>
            <button onClick={openRx} style={s('background:var(--color-brand-primary);color:#fff;border:none;padding:15px 26px;border-radius:var(--radius-pill);font-weight:700;font-size:15px;cursor:pointer')}>Đặt thuốc theo toa</button>
          </div>
        </div>
      </div>

      {/* devices */}
      <ProductSlider title="Thiết bị y tế" cards={devices} actionLabel="Xem tất cả →" onAction={() => goCatScreen('thietbi')} />

      {/* news */}
      <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
        <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px')}>
          <h2 style={s('font:var(--text-heading-lg);color:var(--color-text-heading);margin:0')}>Tin tức sức khỏe</h2>
          <span onClick={goNews} style={s('font-size:13.5px;color:var(--color-text-link);font-weight:600;cursor:pointer')}>Xem tất cả →</span>
        </div>
        <div className="qt-slider" style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:18px')}>
          {newsHome.map((a, i) => (
            <NewsCard key={i} article={a} />
          ))}
        </div>
      </div>
    </div>
  )
}
