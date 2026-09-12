import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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

export default function App() {
  const [active, setActive] = useState('company')
  const activeIndex = Math.max(0, sections.findIndex(([id]) => id === active))
  const activePercent = (activeIndex / (sections.length - 1)) * 100

  useEffect(() => {
    const targets = sections.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="landing-shell">
      <nav className="site-nav" aria-label="报价方案章节">
        <a className="nav-brand" href="#top" aria-label="极客上线首页"><img src="./logo.svg" alt="极客上线 Logo" /></a>
        <div className="progress-nav">
          <div className="progress-labels">
            {sections.map(([id, label]) => <a key={id} className={active === id ? 'active' : ''} href={`#${id}`}>{label}</a>)}
          </div>
          <div className="progress-track"><span style={{ width: `${activePercent}%` }} /><i style={{ left: `${activePercent}%` }} />{sections.map(([id], index) => <b key={id} style={{ left: `${(index / (sections.length - 1)) * 100}%` }} />)}</div>
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
            </div>
            <div className="art" aria-hidden="true">
              <div className="art-glow"/><div className="grid-plane"/>
              <div className="chip chip-a"><Sparkles size={14}/> Brand system ready</div>
              <div className="chip chip-b"><CheckCircle2 size={14}/> Scope verified</div>
              <div className="chip chip-c"><Layers3 size={14}/> 3D direction</div>
              <div className="device"><div className="device-ring"/><img className="device-logo" src="./logo.svg" alt=""/><span className="device-caption">brand quotation</span></div>
            </div>
          </div>
          <div className="stats-frame" id="quote-data"><div className="stat-row">{stats.map(([value,label])=><div className="stat" key={label}><p className="stat-value">{value}</p><p className="stat-label">{label}</p></div>)}</div></div>
        </motion.section>
      </div>
      <div className="long-page">
        {sections.slice(1).map(([id]) => {
          const item = sectionCopy[id]
          return <section className="content-section" id={id} key={id}>
            <div className="section-inner"><p className="section-eyebrow">{item.eyebrow}</p><h2>{item.title}</h2><p className="section-body">{item.body}</p><span className="section-number">{id === 'cases' ? '02' : id === 'features' ? '03' : id === 'pricing' ? '04' : id === 'meeting' ? '05' : id === 'process' ? '06' : '07'}</span></div>
          </section>
        })}
      </div>
    </main>
  )
}
