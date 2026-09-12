import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Layers3, Sparkles } from 'lucide-react'

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

export default function App() {
  const [active, setActive] = useState('company')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [companyCard, setCompanyCard] = useState(0)
  const [cardDirection, setCardDirection] = useState(1)

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
        <a className="nav-brand" href="#top" aria-label="极客上线首页"><img src="./logo.svg" alt="极客上线 Logo" /></a>
        <div className="progress-nav">
          <div className="progress-labels">
            {sections.map(([id, label]) => <a key={id} className={active === id ? 'active' : ''} href={`#${id}`}>{label}</a>)}
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
            <h2 className="company-title">公司介绍</h2>
            <fieldset className="company-switcher"><legend className="sr-only">公司介绍主题</legend>{companyCards.map((card, index) => <label key={card.id} className={companyCard === index ? 'selected' : ''}><input type="radio" name="company-topic" checked={companyCard === index} onChange={() => { setCardDirection(index >= companyCard ? 1 : -1); setCompanyCard(index) }} />{card.label}</label>)}</fieldset>
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
          <div className="case-gallery">
            <img src="./case-reference.png" alt="溜搭与阿闻宠物案例界面展示" />
            <div className="case-gallery-caption"><span>02 / REFERENCE CASE</span><strong>案例展示</strong></div>
          </div>
          <div className="case-flow">
            <p className="section-eyebrow">PROJECT FLOW</p>
            <ol>
              <li><span className="flow-index">01</span><div><h3>溜搭</h3><p>档案、装扮、社交</p></div></li>
              <li><span className="flow-index">02</span><div><h3>阿闻宠物</h3><p>档案、会员</p></div></li>
              <li><span className="flow-index">03</span><div><h3>敬请期待</h3><p>更多案例即将发布</p></div></li>
            </ol>
          </div>
        </section>
        {sections.slice(2).map(([id]) => {
          const item = sectionCopy[id]
          return <section className="content-section" id={id} key={id}>
            <div className="section-inner"><p className="section-eyebrow">{item.eyebrow}</p><h2>{item.title}</h2><p className="section-body">{item.body}</p><span className="section-number">{id === 'cases' ? '02' : id === 'features' ? '03' : id === 'pricing' ? '04' : id === 'meeting' ? '05' : id === 'process' ? '06' : '07'}</span></div>
          </section>
        })}
      </div>
    </main>
  )
}
