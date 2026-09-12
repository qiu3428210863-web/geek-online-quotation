import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, CircleDollarSign, FileClock, Layers3, Sparkles } from 'lucide-react'

const stats = [
  ['[XX 工作日]', '项目工期'],
  ['[V1.0]', '版本'],
  ['[YYYY-MM-DD]', '报价日期'],
  ['30天', '报价有效期'],
]

export default function App() {
  return (
    <main className="landing-shell">
      <a className="brand-corner" href="#top" aria-label="极客上线首页"><img src="./logo.svg" alt="极客上线 Logo" /></a>
      <div className="hero-wrap" id="top">
        <motion.section initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }} className="quote-card" aria-label="售前报价方案">
          <div className="card-content">
            <div className="copy">
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .55 }} className="kicker">PRE-SALES PROPOSAL</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28, duration: .65, ease: [0.22, 1, 0.36, 1] }}>售前报价<span>方案</span></motion.h1>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, duration: .6 }} className="intro">为客户公司构建一份清晰、可执行、值得信赖的品牌与数字体验报价方案。</motion.p>
              <motion.a initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .52, duration: .6 }} className="primary" href="#quote-data">走进我们的品牌世界 <ArrowRight size={17} /></motion.a>
            </div>
            <div className="art" aria-hidden="true">
              <div className="art-glow"/><div className="grid-plane"/>
              <div className="chip chip-a"><Sparkles size={14}/> Brand system ready</div>
              <div className="chip chip-b"><CheckCircle2 size={14}/> Scope verified</div>
              <div className="chip chip-c"><Layers3 size={14}/> 3D direction</div>
              <div className="device"><div className="device-ring"/><img className="device-logo" src="./logo.svg" alt=""/><span className="device-caption">brand quotation</span></div>
            </div>
          </div>
          <div className="stat-row" id="quote-data">{stats.map(([value,label], index)=><div className="stat" key={label}><p className="stat-value">{value}</p><p className="stat-label">{label}</p></div>)}</div>
        </motion.section>
      </div>
    </main>
  )
}
