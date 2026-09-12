import { useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Layers3, Paperclip, Sparkles, Upload, X } from 'lucide-react'

const stats = [
  ['[XX 工作日]', '项目工期'],
  ['[V1.0]', '版本'],
  ['[YYYY-MM-DD]', '报价日期'],
  ['30天', '报价有效期'],
]

const sections = [
  ['company', '公司介绍'],
  ['cases', '参考案例'],
  ['features', '功能清单'],
  ['pricing', '开发报价'],
  ['meeting', '关于会议'],
  ['process', '开发流程'],
  ['support', '售后服务'],
] as const

const sectionCopy: Record<(typeof sections)[number][0], { eyebrow: string; title: string; body: string }> = {
  company: { eyebrow: '01 / COMPANY', title: '把品牌愿景，变成可执行的体验。', body: '从策略、视觉到数字产品，我们为客户公司搭建一套清晰而有生命力的品牌系统。' },
  cases: { eyebrow: '02 / CASE STUDIES', title: '每一次交付，都是一次长期合作的起点。', body: '精选品牌与数字体验案例，展示从问题洞察到落地上线的完整路径。' },
  features: { eyebrow: '03 / FEATURE LIST', title: '清晰的功能清单，让范围一目了然。', body: '将目标拆解为可验证的功能模块，减少沟通成本，让项目始终朝着同一个方向前进。' },
  pricing: { eyebrow: '04 / DEVELOPMENT QUOTE', title: '报价透明，决策更笃定。', body: '每一项投入都对应具体产出，按阶段拆分计划与预算，便于团队灵活安排。' },
  meeting: { eyebrow: '05 / WORKSHOP', title: '在一次次对话里，找到正确答案。', body: '通过结构化会议同步目标、节奏与反馈，让每个关键节点都被充分理解。' },
  process: { eyebrow: '06 / DELIVERY FLOW', title: '从第一张草图到最终上线。', body: '策略、设计、开发、测试与交付环环相扣，建立可持续迭代的工作流。' },
  support: { eyebrow: '07 / AFTER-SALES', title: '上线之后，我们仍然在场。', body: '持续维护、数据观察与体验优化，让这份报价方案真正成为业务增长的起点。' },
}

const companyCards = [
  { id: 'brand', label: '品牌定位', image: './company-value.png', body: ['我们是一支专注品牌与数字体验的创意技术团队。', '从策略到开发，以长期主义陪伴每一次重要的增长。'] },
  { id: 'tech', label: '技术与思考', image: './company-tech.png', body: ['我们紧跟前沿技术，研发占比85%的硬核团队。', '从稳定的云基础，到灵活的数据平台，再到融合AI的智能推荐，我们构建了一套可演进的技术体系，支撑项目从可用到可成长。'] },
  { id: 'challenge', label: '创作与挑战', image: './company-challenge.png', body: ['面对服务过程中的挑战，我们从不退缩。不畏惧不设限，才能推开更多可能。', '我们享受热血创作的过程，每一次都全力以赴，把未知拆成可以前进的步伐。'] },
]

const caseCards = [
  { id: 'liuda-map', brand: '溜搭', title: '地图探索', image: './case-liuda-map.png', body: '把附近的路线、互动与惊喜放在一张地图里，让每一次出发都值得期待。' },
  { id: 'liuda-style', brand: '溜搭', title: '宠物装扮', image: './case-liuda-style.png', body: '用轻松有趣的装扮体验，建立属于自己的宠物形象与社交表达。' },
  { id: 'awen-profile', brand: '阿闻宠物', title: '完善信息', image: './case-awen-profile.png', body: '档案、品种与健康信息集中管理，让科学照顾从记录开始。' },
  { id: 'awen-membership', brand: '阿闻宠物', title: '会员中心', image: './case-awen-membership.png', body: '会员权益与服务一站式呈现，为养宠生活提供持续而安心的陪伴。' },
]

const pricingSegments = [
  { label: '一期 · 40%', title: '项目启动款', detail: '第一期款40%为项目启动款，该阶段完成产品原型设计和UI设计。' },
  { label: '二期 · 30%', title: '设计确认款', detail: '第二期款30%为设计确认款，甲方签署设计确认函后，启动开发工作。' },
  { label: '三期 · 20%', title: '项目开发款', detail: '第三期款20%为项目开发款，项目开发完成并发布第一个内部版本后，启动验收工作。' },
  { label: '四期 · 10%', title: '项目尾款', detail: '第四期款10%为项目尾款，甲方支付尾款后进行项目验收和部署上线，并交付源代码。' },
] as const

const costCategories = ['全部', '基础设施', '域名与证书', '存储与分发', '外部服务'] as const
const thirdPartyCosts = [
  { id: 'server', category: '基础设施', label: '服务器', price: '¥5000', unit: '/ 年 · 原文单价', tags: ['CPU：8核', '内存：16G', '硬盘：50G SSD', '网络：10Mbps', '操作系统：Ubuntu 24.04 LTS'], note: '可按需扩容，价格以阿里云、腾讯云为参考。', link: true },
  { id: 'database', category: '基础设施', label: '业务数据库', price: '¥3000', unit: '/ 年 · 原文单价', tags: ['类型：MySQL 8.0', '存储：200G', '系列：高可用', 'CPU：2核', '内存：4G', 'Max connection：4000'], note: '可按需扩容，价格以阿里云、腾讯云为参考。', link: true },
  { id: 'redis', category: '基础设施', label: '缓存数据库', price: '¥400', unit: '/ 年 · 原文单价', tags: ['类型：Redis 6.0+', '存储：100G', '系列：单节点', '分片：1', '内存：1G'], note: '可按需扩容，价格以阿里云、腾讯云为参考。', link: true },
  { id: 'domain', category: '域名与证书', label: '.com域名', price: '¥100', unit: '/ 年 · 原文单价', tags: ['.com域名'], note: '.com域名通常 100 元左右。', link: false },
  { id: 'ssl', category: '域名与证书', label: 'SSL 泛域名证书', price: '¥200', unit: '/ 年 · 原文单价', tags: ['SSL 泛域名证书'], note: 'SSL 泛域名证书在淘宝约 200 元左右。', link: false },
  { id: 'cos-storage', category: '存储与分发', label: 'COS 对象存储', price: '¥500', unit: '/ 年 · 原文单价', tags: ['COS 对象存储', '存储：500GB'], note: '可按需扩容，价格以云厂商为参考。', link: true },
  { id: 'cos-request', category: '存储与分发', label: 'COS 读写请求', price: '¥40', unit: '/ 次 · 原文单价', tags: ['COS 读写请求', '次数：500 万次'], note: '按实际请求次数计费，可在项目增长后弹性调整。', link: true },
  { id: 'cdn', category: '存储与分发', label: 'CDN 流量包', price: '¥500', unit: '/ 年 · 原文单价', tags: ['CDN 流量包'], note: '可按访问量购买不同规格的流量包。', link: true },
  { id: 'sms', category: '外部服务', label: '短信服务', price: '¥0.042', unit: '按量 · 原文单价', tags: ['按量购买'], note: '可按资源包购买，价格以阿里云、腾讯云为参考。', link: true },
  { id: 'login', category: '外部服务', label: '第三方登录', price: '¥300', unit: '/ 年 · 原文单价', tags: ['微信认证'], note: '微信登录和微信支付等场景需要用到微信企业认证。', link: false },
] as const

export default function App() {
  const [active, setActive] = useState('company')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [companyCard, setCompanyCard] = useState(0)
  const [cardDirection, setCardDirection] = useState(1)
  const [attachmentName, setAttachmentName] = useState('')
  const [caseIndex, setCaseIndex] = useState(0)
  const [casePreview, setCasePreview] = useState<{ image: string; title: string } | null>(null)
  const [costCategory, setCostCategory] = useState<(typeof costCategories)[number]>('全部')
  const [expandedCosts, setExpandedCosts] = useState<Record<string, boolean>>({})

  const handleSectionNavigate = (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    const nav = document.querySelector('.site-nav') as HTMLElement | null
    const navOffset = (nav?.getBoundingClientRect().bottom ?? 0) + 16
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navOffset
    window.history.replaceState(null, '', `#${id}`)
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' })
  }

  const changeCase = (direction: number) => {
    const pageCount = Math.ceil(caseCards.length / 2)
    const next = (caseIndex + direction + pageCount) % pageCount
    setCaseIndex(next)
  }

  const selectCompanyCard = (index: number) => {
    if (index === companyCard) return
    setCardDirection(index >= companyCard ? 1 : -1)
    setCompanyCard(index)
  }

  const visibleCosts = costCategory === '全部' ? thirdPartyCosts : thirdPartyCosts.filter((cost) => cost.category === costCategory)

  useEffect(() => {
    let frame = 0
    const updateProgress = () => {
      // Map the viewport's scroll position to the real section anchors. A
      // A whole-document ratio makes the thumb reach evenly-spaced dots early
      // when sections have different heights, so use piecewise interpolation
      // between the visual focus anchors of each chapter instead.
      const focusOffset = Math.min(window.innerHeight * 0.35, 360)
      const anchors = sections
        .map(([id]) => document.getElementById(id))
        .filter(Boolean)
        .map((element, index) => {
          const node = element as HTMLElement
          const documentTop = node.getBoundingClientRect().top + window.scrollY
          // Switch a chapter when it reaches the visual focus line below the
          // fixed nav, keeping the active label and moving thumb in lockstep.
          return index === 0 ? 0 : Math.max(0, documentTop - focusOffset)
        })

      let percent = 0
      const y = window.scrollY
      if (anchors.length > 1) {
        if (y <= anchors[0]) {
          percent = 0
        } else if (y >= anchors[anchors.length - 1]) {
          percent = 100
        } else {
          let segment = 0
          for (let index = 0; index < anchors.length - 1; index += 1) {
            if (y >= anchors[index] && y <= anchors[index + 1]) {
              segment = index
              break
            }
          }
          const start = anchors[segment]
          const end = anchors[segment + 1]
          const localProgress = end === start ? 0 : (y - start) / (end - start)
          percent = ((segment + Math.min(1, Math.max(0, localProgress))) / (anchors.length - 1)) * 100
        }
      }
      // Keep the highlighted label on the same anchor boundary as the
      // moving thumb so neither indicator appears to arrive first.
      let activeIndex = 0
      for (let index = 0; index < anchors.length; index += 1) {
        if (y >= anchors[index]) activeIndex = index
      }
      setActive(sections[Math.min(activeIndex, sections.length - 1)][0])
      setScrollProgress(percent)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <main className="landing-shell">
      <nav className="site-nav" aria-label="报价方案章节">
        <a className="nav-brand" href="#top" onClick={(event) => handleSectionNavigate(event, 'top')} aria-label="极客上线首页"><img src="./logo.svg" alt="极客上线 Logo" /></a>
        <div className="progress-nav">
          <div className="progress-labels">
            {sections.map(([id, label]) => <a key={id} className={active === id ? 'active' : ''} href={`#${id}`} onClick={(event) => handleSectionNavigate(event, id)}>{label}</a>)}
          </div>
          <div className="progress-track"><span style={{ width: `${scrollProgress}%` }} /><i style={{ left: `${scrollProgress}%` }} />{sections.map(([id], index) => <b key={id} style={{ left: `${(index / (sections.length - 1)) * 100}%` }} />)}</div>
        </div>
        <a className="primary nav-cta" href="https://www.geekonup.com/">走进我们的品牌世界 <ArrowRight size={16} /></a>
      </nav>
      <div className="hero-wrap" id="top">
        <motion.section id="company" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }} className="quote-card" aria-label="售前报价方案">
          <div className="card-content">
            <div className="copy">
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .55 }} className="kicker">PRE-SALES PROPOSAL</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28, duration: .65, ease: [0.22, 1, 0.36, 1] }}>售前报价<span>方案</span></motion.h1>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, duration: .6 }} className="brief-table" aria-label="项目信息">
                <div><b>客户名称</b><span>[客户公司]</span></div>
                <div><b>项目编号</b><span>[G-XXXX]</span></div>
                <div><b>项目名称</b><span>[项目名称]</span></div>
              </motion.div>
              <div className="stats-frame" id="quote-data"><div className="stat-row">{stats.map(([value,label])=><div className="stat" key={label}><p className="stat-value">{value}</p><p className="stat-label">{label}</p></div>)}</div></div>
            </div>
            <div className="art" aria-hidden="true">
              <div className="art-glow"/><div className="grid-plane"/>
              <div className="chip chip-a"><Sparkles size={14}/> Brand system ready</div>
              <div className="chip chip-b"><CheckCircle2 size={14}/> Scope verified</div>
              <div className="chip chip-c"><Layers3 size={14}/> 3D direction</div>
              <div className="device"><div className="device-ring"/><img className="device-logo" src="./logo.svg" alt=""/><span className="device-caption">brand quotation</span></div>
            </div>
          </div>
        </motion.section>
      </div>
      <section className="company-feature" id="company-overview" aria-label="公司介绍">
        <div className="company-panel">
          <div className="company-left">
            <div className="company-heading"><p className="company-chapter">CHAPTER 01</p><h2 className="company-title">公司介绍</h2></div>
            <fieldset className="company-switcher"><legend className="sr-only">公司介绍主题</legend>{companyCards.map((card, index) => <label key={card.id} className={companyCard === index ? 'selected' : ''} onClick={() => selectCompanyCard(index)}><input type="radio" name="company-topic" checked={companyCard === index} onChange={() => selectCompanyCard(index)} />{card.label}</label>)}</fieldset>
            <motion.div key={companyCards[companyCard].id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="company-body">{companyCards[companyCard].body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</motion.div>
          </div>
          <div className="company-right">
            <div className="company-stack" aria-live="polite">
              <AnimatePresence initial={false} custom={cardDirection} mode="popLayout">
                {companyCards.map((card, offset) => {
                  const position = (offset - companyCard + companyCards.length) % companyCards.length
                  return <motion.article key={`${card.id}-${position}`} className={`stack-card stack-card-${position}`} style={{ zIndex: 30 - position }} custom={cardDirection} initial={{ opacity: position === 0 ? 0 : 1, x: position === 0 ? cardDirection * 180 : 0, rotate: position === 0 ? cardDirection * 8 : position === 1 ? -3 : 4, y: position * 15 }} animate={{ opacity: 1, x: 0, rotate: position === 0 ? 0 : position === 1 ? -3 : 4, y: position * 15 }} exit={{ opacity: 0, x: -cardDirection * 220, rotate: -cardDirection * 10 }} transition={{ type: 'spring', stiffness: 170, damping: 20 }}><img src={card.image} alt={card.label} /></motion.article>
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      <div className="long-page">
        <section className="case-study-section" id="cases" aria-label="参考案例">
          <div className="case-heading-block">
            <p className="case-chapter">CHAPTER 02</p>
            <h2>参考案例</h2>
            <p className="case-heading-note">针对竞品调研分析的一些设计和视觉参考</p>
            <div className="case-controls"><button type="button" aria-label="上一个案例" onClick={() => changeCase(-1)}><ArrowLeft size={18} /></button><button type="button" aria-label="下一个案例" onClick={() => changeCase(1)}><ArrowRight size={18} /></button></div>
          </div>
          <div className="case-carousel-wrap">
            <div className="case-visible-pair" aria-label="案例卡片列表">
              {caseCards.slice(caseIndex * 2, caseIndex * 2 + 2).map((card, offset) => <div className="case-slot" key={card.id}>
                <article className="case-card">
                  <div className="case-card-title"><span>{card.brand}</span><h3>{card.title}</h3></div>
                  <button className="case-image-button" type="button" onClick={() => setCasePreview({ image: card.image, title: `${card.brand} · ${card.title}` })} aria-label={`点击查看${card.brand}${card.title}完整图片`}><img src={card.image} alt={`${card.brand}${card.title}案例`} /><span className="case-image-hint">点击图片查看完整案例</span></button>
                  <div className="case-card-body"><span className="case-rule">—</span><p>{card.body}</p></div>
                  <span className="case-card-index">0{caseIndex * 2 + offset + 1}</span>
                </article>
              </div>)}
            </div>
            <div className="case-carousel-footer"><span>切换案例浏览</span><div className="case-dots" aria-hidden="true">{Array.from({ length: Math.ceil(caseCards.length / 2) }, (_, index) => <i className={index === caseIndex ? 'active' : ''} key={index} />)}</div></div>
          </div>
        </section>
        {sections.slice(2).map(([id]) => {
          const item = sectionCopy[id]
          if (id === 'pricing') return <section className="content-section pricing-content" id={id} key={id}>
            <div className="pricing-inner">
              <p className="section-eyebrow">04 / DEVELOPMENT QUOTE</p>
              <h2>定制开发报价清单</h2>
              <p className="pricing-subtitle">项目付款节点</p>
              <div className="pricing-bar" aria-label="付款比例与阶段说明">
                {pricingSegments.map((segment, index) => <button className={`pricing-segment pricing-segment-${index + 1}`} type="button" key={segment.label} aria-label={`${segment.label}：${segment.detail}`}>
                  <span>{segment.label}</span>
                  <strong>{segment.title}</strong>
                  <span className="pricing-tooltip" role="tooltip">{segment.detail}</span>
                </button>)}
              </div>
              <div className="pricing-notes">
                <h3>补充说明</h3>
                <p>开发工期为技术开发时间，按原型图&amp;UI确认后开始计算；可分功能版块逐步上线，后续迭代升级。</p>
                <p>本次报价为含税1%（增值税专票），不包含服务器、第三方平台（例如人脸识别、消息推送等产生的费用）。</p>
              </div>
              <section className="cost-library" aria-labelledby="cost-library-title">
                <div className="cost-library-heading"><span>4.3</span><h3 id="cost-library-title">第三方费用</h3></div>
                <div className="cost-notice"><strong>第三方费用说明：</strong><p>云服务资费费用为第三方官方费用，由极客上线负责代购及部署，不涉及收取相关服务费，相关价格以第三方官方实时价格为准。</p></div>
                <div className="cost-filters" role="tablist" aria-label="第三方费用分类">
                  {costCategories.map((category) => <button type="button" role="tab" aria-selected={costCategory === category} className={costCategory === category ? 'active' : ''} key={category} onClick={() => setCostCategory(category)}>{category}</button>)}
                </div>
                <p className="cost-count">显示全部 {visibleCosts.length} 项资源</p>
                <div className="cost-grid">
                  {visibleCosts.map((cost) => <article className="cost-card" key={cost.id}>
                    <p className="cost-breadcrumb">{cost.category} / {cost.label}</p>
                    <h4>{cost.label}</h4>
                    <p className="cost-price">{cost.price}</p>
                    <p className="cost-unit">{cost.unit}</p>
                    <div className="cost-tags">{cost.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <button type="button" className="cost-toggle" aria-expanded={Boolean(expandedCosts[cost.id])} onClick={() => setExpandedCosts((current) => ({ ...current, [cost.id]: !current[cost.id] }))}>▼ 费用备注与选配链接</button>
                    {expandedCosts[cost.id] && <div className="cost-detail"><p>{cost.note}</p>{cost.link && <span>参考选配链接 ↗</span>}</div>}
                  </article>)}
                </div>
              </section>
            </div>
            <span className="section-number">04</span>
          </section>
          return <section className={`content-section ${id === 'features' ? 'features-content' : ''}`} id={id} key={id}>
            <div className="section-inner"><p className="section-eyebrow">{item.eyebrow}</p><h2>{item.title}</h2><p className="section-body">{id === 'features' ? '贴售前功能清单附件' : item.body}</p><span className="section-number">{id === 'features' ? '03' : id === 'meeting' ? '05' : id === 'process' ? '06' : '07'}</span></div>
            {id === 'features' && <div className="attachment-card">
              <div className="attachment-heading"><span className="attachment-icon"><FileText size={22} /></span><div><strong>售前功能清单附件</strong><small>支持 PDF、DOCX、XLSX、PNG</small></div></div>
              <label className="attachment-drop"><input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? '')} /><Upload size={18} /><span>{attachmentName || '点击选择功能清单文件'}</span><em><Paperclip size={14} /> 浏览文件</em></label>
            </div>}
          </section>
        })}
      </div>
      <AnimatePresence>
        {casePreview && <motion.div className="case-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCasePreview(null)} role="dialog" aria-modal="true" aria-label={`${casePreview.title}完整图片`}>
          <motion.div className="case-lightbox-inner" initial={{ scale: .94, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .94, y: 18 }} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="case-lightbox-close" onClick={() => setCasePreview(null)} aria-label="关闭完整图片"><X size={20} /></button>
            <img src={casePreview.image} alt={`${casePreview.title}完整案例`} />
            <p>{casePreview.title}</p>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </main>
  )
}
