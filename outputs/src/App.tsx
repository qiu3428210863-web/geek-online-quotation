import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, ArrowLeft, ArrowRight, BellRing, CheckCircle2, FileText, Gauge, Layers3, Paperclip, RefreshCw, ShieldCheck, Sparkles, Upload, Wrench, X } from 'lucide-react'

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
  ['after-sales', '售后服务'],
] as const

const sectionCopy: Record<(typeof sections)[number][0], { eyebrow: string; title: string; body: string }> = {
  company: { eyebrow: '01 / COMPANY', title: '把品牌愿景，变成可执行的体验。', body: '从策略、视觉到数字产品，我们为客户公司搭建一套清晰而有生命力的品牌系统。' },
  cases: { eyebrow: '02 / CASE STUDIES', title: '每一次交付，都是一次长期合作的起点。', body: '精选品牌与数字体验案例，展示从问题洞察到落地上线的完整路径。' },
  features: { eyebrow: '03 / FEATURE LIST', title: '清晰的功能清单，让范围一目了然。', body: '将目标拆解为可验证的功能模块，减少沟通成本，让项目始终朝着同一个方向前进。' },
  pricing: { eyebrow: '04 / DEVELOPMENT QUOTE', title: '报价透明，决策更笃定。', body: '每一项投入都对应具体产出，按阶段拆分计划与预算，便于团队灵活安排。' },
  meeting: { eyebrow: '05 / WORKSHOP', title: '在一次次对话里，找到正确答案。', body: '通过结构化会议同步目标、节奏与反馈，让每个关键节点都被充分理解。' },
  process: { eyebrow: '06 / DELIVERY FLOW', title: '从第一张草图到最终上线。', body: '策略、设计、开发、测试与交付环环相扣，建立可持续迭代的工作流。' },
  'after-sales': { eyebrow: '07 / AFTER-SALES SERVICE', title: '上线之后，我们仍然在场。', body: '持续维护、数据观察与体验优化，让产品稳定运行并持续增长。' },
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

const supportServices = [
  { title: '生产保障', body: '生产环境 24×7 技术支持', icon: 'production' },
  { title: '可观测性', body: '日志监控、性能指标分析', icon: 'observability' },
  { title: '异常响应', body: '异常告警，接入群聊通知', icon: 'incident' },
  { title: '技术支持', body: '技术咨询、线上 BUG 修复', icon: 'technical' },
  { title: '稳定运营', body: '确保系统稳定运行，保障客户持续成功', icon: 'operations' },
  { title: '持续迭代', body: '收集用户反馈持续迭代，提升不同场景下产品的功能表现', icon: 'iteration' },
] as const

const supportIconMap = { production: ShieldCheck, observability: Activity, incident: BellRing, technical: Wrench, operations: Gauge, iteration: RefreshCw } as const

const processStages = [
  { phase: '售前', title: '需求沟通', body: '深入了解客户的业务背景与需求，提供针对性的解决思路且48小时内免费提供定制化方案。', icon: 'search' },
  { phase: '售前', title: '调研与规划', body: '通过深入需求梳理与确认，完善项目需求，并制定原型设计与项目OKR实施计划，确保项目目标与交付标准清晰可行。', icon: 'planning' },
  { phase: '售前', title: '报价确认', body: '我们会通过“售前会议”确认方案细节，确保可行性与业务逻辑的契合，并明确每个阶段的目标与交付标准。在充分理解客户需求的基础上，提供透明、详细的报价方案，结合客户预算灵活调整，确保高性价比。', icon: 'quote' },
  { phase: '售中', title: '项目管理', body: '每日站会同步目标、障碍与行动，通过燃尽图+看板实时透明进度，确保需求-进度-质量三维平衡，并通过项目里程碑验收标准提前识别并消除阻碍，降低不确定性，确保每个迭代按时高质量交付。', icon: 'management' },
  { phase: '售中', title: '原型设计', body: '高效输出功能原型图，直观展示产品结构与核心交互，确保客户对产品有清晰的预期，并提前发现可能的优化点。', icon: 'prototype' },
  { phase: '售中', title: 'UI/UX设计', body: '基于品牌调性和用户体验优化原则，进行界面设计，确保视觉与交互体验既符合用户习惯，又能强化品牌形象。', icon: 'design' },
  { phase: '售中', title: '开发与测试', body: '采用敏捷式开发，将一个大的项目拆分为多个迭代，定期向客户展示迭代进度，并通过功能、性能、安全等多维测试，确保系统的稳定性与可靠性。', icon: 'development' },
  { phase: '售中', title: '上线与交付', body: '协助完成应用市场审核与上架，确保产品顺利上线。同时，完整交付源码与技术文档，保障客户的自主可控性，并支持后续扩展开发。', icon: 'launch' },
] as const

const afterSalesGroups = [
  {
    title: '售后与运维',
    items: [
      { title: '稳定使用', body: '在系统上线运行过程中，持续收集反馈，优化系统性能，确保产品在生产环境中稳定运行。' },
      { title: '健康巡检', body: '进行健康巡检与实时告警，全天候监控系统，确保潜在风险得到及时发现与修正。' },
      { title: '技术支持', body: '提供7×24小时技术支持，随时解决客户问题，保障产品的稳定运行。' },
      { title: '监控告警', body: '通过监控指标采集系统主动发现问题，实时告警系统保证问题第一时间响应并解决。' },
    ],
  },
  {
    title: '分析与迭代',
    items: [
      { title: '增长转化可量化', body: '利用数据驱动业务优化，精准适配市场需求，确保每次增长都可以被量化。' },
      { title: '客户成功具象化', body: '从产品上线到稳定使用，提供全方位的服务支持，不断优化调整、提升业务价值。' },
      { title: '场景拓展', body: '传递行业标杆客户最佳实践，沟通新业务场景发掘，提供产品使用优化建议。' },
      { title: '定期回访', body: '按月、季、年度定期回访客户，了解业务情况并根据反馈优化服务，并提供持续支持。' },
    ],
  },
] as const

const afterSalesCategories = [
  { id: 'process', label: '售后流程详细说明' },
  { id: 'deliverables', label: '交付物说明' },
  { id: 'testing', label: '测试说明' },
  { id: 'maintenance', label: '维护说明' },
  { id: 'visual', label: '视觉维护说明' },
] as const

const deliveryRows = [
  ['售前阶段', '售前方案；竞品及行业分析资料（可选）'],
  ['实施管理', '产品需求文档（PRD）；重要会议纪要归档；阶段性Demo；Bug与优化项清单（issue列表）'],
  ['项目材料', '源代码包；上线部署文档；系统管理员操作指南；功能开发进度表'],
  ['素材资料', '原型和UI设计产物；配套音频/图像文件（如项目涉及）；品牌相关素材'],
  ['环境部署', '测试报告；巡检报告；第三方账号信息登记表（如云服务器、短信服务、API接入等）'],
] as const

const testingRows = [
  ['产品设计 / UI评审', '组织UI/UX设计评审会议，确认界面规范、交互合理性', 'PM/UI设计', 'UI初稿完成', 'UI设计图、设计规范文档'],
  ['产品研发 / 设计评审', '对接产品需求文档（PRD）与技术方案，明确接口设计和边界条件', '技术负责人', 'PRD评审通过、系统方案确定', '技术方案文档、接口文档草案'],
  ['产品测试 / 功能测试', '依据功能清单及用户路径进行功能覆盖性测试，验证业务逻辑与操作流程', '测试负责人', '开发功能提交测试环境', '功能测试报告'],
  ['产品测试 / 系统测试', '覆盖稳定性、安全性（如SQL注入/XSS/权限）、兼容性等全面测试', '测试负责人', '功能测试通过', '系统测试报告、安全测试报告'],
  ['产品测试 / 压测测试', '模拟高并发使用场景，检验服务端处理能力与响应时间', '测试负责人', '系统测试通过', '压力测试报告'],
  ['交付&部署 / 测试验收', '基于业务场景进行模拟操作，验证产品满足上线需求', '客户&PM协同', '系统测试完成', '测试验收记录、问题回归报告'],
  ['交付&部署 / 发布计划', '制定并同步上线计划、人员职责、回滚策略、安全备份方案等', 'PM', '测试通过', '发布计划表'],
  ['交付&部署 / 部署上线', '完成生产环境部署、配置数据库与域名、上线检查', '技术负责人', '发布计划执行', '上线验收文档、环境部署记录'],
] as const

const maintenanceRows = [
  ['副增性维护', '修复现有缺陷，保障系统稳定', '日志排查、故障记录、模块修复'],
  ['适应性维护', '跟进技术升级，保障系统持续运行', '框架更新、API调整适配'],
  ['完善性维护', '优化体验与功能，提升产品价值', '新功能建议、逻辑改进、结构调整'],
  ['预防性维护', '监控系统健康，提前发现风险', '日志分析、性能指标预警'],
  ['文档管理', '留存系统记录，降低交接成本', '接口文档、操作手册、API文档'],
] as const

const visualMaintenanceRows = [
  ['UI类小改动', '单页颜色调整、图标替换等', '8次以内'],
  ['数据类', '数据字段调整，无逻辑影响等', '3次以内'],
  ['功能类', '功能开关配置、排序调整等', '3次以内'],
  ['用户体验类', '步骤简化、引导优化等', '3次以内'],
] as const

const processIconMap = { search: './process-icon-01.png', planning: './process-icon-02.png', quote: './process-icon-03.png', management: './process-icon-04.png', prototype: './process-icon-05.png', design: './process-icon-06.png', development: './process-icon-07.png', launch: './process-icon-08.png' } as const

const costCategories = ['全部', '基础设施', '域名与证书', '存储与分发', '外部服务'] as const
const optionLinkUrl = 'https://cloud.tencent.com/login?s_url=https%3A%2F%2Fbuy.cloud.tencent.com%2Fredis'
const companyIntroPdfUrl = 'https://geekonup.feishu.cn/file/UdzBbfZxzoPibOxs5g4cgeRtnHc'
const thirdPartyCosts = [
  { id: 'server', category: '基础设施', label: '服务器', price: '¥5000', unit: '/ 年', tags: ['CPU：8核', '内存：16G', '硬盘：50G SSD', '网络：10Mbps', '操作系统：Ubuntu 24.04 LTS'], note: '可按需扩容，价格以阿里云、腾讯云为参考。', link: true },
  { id: 'database', category: '基础设施', label: '业务数据库', price: '¥3000', unit: '/ 年', tags: ['类型：MySQL 8.0', '存储：200G', '系列：高可用', 'CPU：2核', '内存：4G', 'Max connection：4000'], note: '可按需扩容，价格以阿里云、腾讯云为参考。', link: true },
  { id: 'redis', category: '基础设施', label: '缓存数据库', price: '¥400', unit: '/ 年', tags: ['类型：Redis 6.0+', '存储：100G', '系列：单节点', '分片：1', '内存：1G'], note: '可按需扩容，价格以阿里云、腾讯云为参考。', link: true },
  { id: 'domain', category: '域名与证书', label: '.com域名', price: '¥100', unit: '/ 年', tags: ['.com域名'], note: '.com域名通常 100 元左右。', link: false },
  { id: 'ssl', category: '域名与证书', label: 'SSL 泛域名证书', price: '¥200', unit: '/ 年', tags: ['SSL 泛域名证书'], note: 'SSL 泛域名证书在淘宝约 200 元左右。', link: false },
  { id: 'cos-storage', category: '存储与分发', label: 'COS 对象存储', price: '¥500', unit: '/ 年', tags: ['COS 对象存储', '存储：500GB'], note: '可按需扩容，价格以云厂商为参考。', link: true },
  { id: 'cos-request', category: '存储与分发', label: 'COS 读写请求', price: '¥40', unit: '/ 次', tags: ['COS 读写请求', '次数：500 万次'], note: '按实际请求次数计费，可在项目增长后弹性调整。', link: true },
  { id: 'cdn', category: '存储与分发', label: 'CDN 流量包', price: '¥500', unit: '/ 年', tags: ['CDN 流量包'], note: '可按访问量购买不同规格的流量包。', link: true },
  { id: 'sms', category: '外部服务', label: '短信服务', price: '¥0.042', unit: '按量', tags: ['按量购买'], note: '可按资源包购买，价格以阿里云、腾讯云为参考。', link: true },
  { id: 'login', category: '外部服务', label: '第三方登录', price: '¥300', unit: '/ 年', tags: ['微信认证'], note: '微信登录和微信支付等场景需要用到微信企业认证。', link: false },
] as const

export default function App() {
  const [active, setActive] = useState('company')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [companyCard, setCompanyCard] = useState(0)
  const [cardDirection, setCardDirection] = useState(1)
  const [attachmentName, setAttachmentName] = useState('')
  const [caseIndex, setCaseIndex] = useState(0)
  const [casePreview, setCasePreview] = useState<{ image: string; title: string } | null>(null)
  const [processSelected, setProcessSelected] = useState(0)
  const [afterSalesCategory, setAfterSalesCategory] = useState<(typeof afterSalesCategories)[number]['id']>('process')
  const [costCategory, setCostCategory] = useState<(typeof costCategories)[number]>('全部')
  const [expandedCosts, setExpandedCosts] = useState<Record<string, boolean>>({})
  // The track uses three copies of the service list. The middle copy is the
  // initial viewport, while the fractional index below is advanced every
  // animation frame for a continuous, constant-speed marquee.
  const [supportIndex, setSupportIndex] = useState<number>(supportServices.length)
  const [supportDragOffset, setSupportDragOffset] = useState(0)
  const [supportDragging, setSupportDragging] = useState(false)
  const [supportPointerStart, setSupportPointerStart] = useState<number | null>(null)
  const [supportStep, setSupportStep] = useState(0)
  const supportCarouselRef = useRef<HTMLDivElement | null>(null)
  const supportIndexRef = useRef<number>(supportServices.length)
  const supportAutoRafRef = useRef<number | null>(null)
  const supportAutoLastFrameRef = useRef<number | null>(null)
  const supportAutoplayActiveRef = useRef(false)
  const supportAutoResumeRef = useRef<number | null>(null)
  const supportStepRef = useRef<number>(0)
  const companyAutoIntervalRef = useRef<number | null>(null)
  const companyAutoResumeRef = useRef<number | null>(null)

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
    setCaseIndex((current) => (current + direction + pageCount) % pageCount)
  }

  const normalizeSupportIndex = (value: number) => {
    const count = supportServices.length
    let normalized = value
    while (normalized >= count * 2) normalized -= count
    while (normalized < count) normalized += count
    return normalized
  }

  const beginSupportDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    clearSupportAutoplay()
    setSupportDragging(true)
    setSupportPointerStart(event.clientX)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveSupportDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (supportPointerStart === null) return
    setSupportDragOffset(event.clientX - supportPointerStart)
  }

  const endSupportDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (supportPointerStart === null) return
    const distance = event.clientX - supportPointerStart
    if (Math.abs(distance) > 12 && supportStepRef.current > 0) {
      const nextIndex = normalizeSupportIndex(supportIndexRef.current - distance / supportStepRef.current)
      supportIndexRef.current = nextIndex
      setSupportIndex(nextIndex)
    }
    setSupportDragOffset(0)
    setSupportPointerStart(null)
    setSupportDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    scheduleSupportAutoplay()
  }

  const clearSupportAutoplay = () => {
    supportAutoplayActiveRef.current = false
    if (supportAutoRafRef.current !== null) window.cancelAnimationFrame(supportAutoRafRef.current)
    if (supportAutoResumeRef.current !== null) window.clearTimeout(supportAutoResumeRef.current)
    supportAutoRafRef.current = null
    supportAutoLastFrameRef.current = null
    supportAutoResumeRef.current = null
  }

  const startSupportAutoplay = () => {
    supportAutoplayActiveRef.current = true
    supportAutoLastFrameRef.current = null
    if (supportAutoRafRef.current !== null) return
    const tick = (timestamp: number) => {
      if (!supportAutoplayActiveRef.current) {
        supportAutoRafRef.current = null
        return
      }
      const last = supportAutoLastFrameRef.current
      supportAutoLastFrameRef.current = timestamp
      const elapsed = last === null ? 0 : Math.min(50, timestamp - last)
      const nextIndex = normalizeSupportIndex(supportIndexRef.current + (elapsed / 1000) * 0.16)
      supportIndexRef.current = nextIndex
      setSupportIndex(nextIndex)
      supportAutoRafRef.current = window.requestAnimationFrame(tick)
    }
    supportAutoRafRef.current = window.requestAnimationFrame(tick)
  }

  const scheduleSupportAutoplay = () => {
    if (supportAutoResumeRef.current !== null) window.clearTimeout(supportAutoResumeRef.current)
    supportAutoResumeRef.current = window.setTimeout(() => {
      supportAutoResumeRef.current = null
      startSupportAutoplay()
    }, 3000)
  }

  const clearCompanyAutoplay = () => {
    if (companyAutoIntervalRef.current !== null) window.clearInterval(companyAutoIntervalRef.current)
    if (companyAutoResumeRef.current !== null) window.clearTimeout(companyAutoResumeRef.current)
    companyAutoIntervalRef.current = null
    companyAutoResumeRef.current = null
  }

  const startCompanyAutoplay = () => {
    if (companyAutoIntervalRef.current !== null) window.clearInterval(companyAutoIntervalRef.current)
    companyAutoIntervalRef.current = window.setInterval(() => {
      setCardDirection(1)
      setCompanyCard((current) => (current + 1) % companyCards.length)
    }, 5200)
  }

  const deferCompanyAutoplay = () => {
    clearCompanyAutoplay()
    companyAutoResumeRef.current = window.setTimeout(startCompanyAutoplay, 2000)
  }

  useEffect(() => {
    startCompanyAutoplay()
    return clearCompanyAutoplay
  }, [])

  useEffect(() => {
    const processAutoplay = window.setInterval(() => {
      setProcessSelected((current) => (current + 1) % processStages.length)
    }, 5200)
    return () => window.clearInterval(processAutoplay)
  }, [])

  const selectCompanyCard = (index: number) => {
    deferCompanyAutoplay()
    if (index === companyCard) return
    setCardDirection(index >= companyCard ? 1 : -1)
    setCompanyCard(index)
  }

  const visibleCosts = costCategory === '全部' ? thirdPartyCosts : thirdPartyCosts.filter((cost) => cost.category === costCategory)

  useEffect(() => {
    const node = supportCarouselRef.current
    if (!node) return
    const measureStep = () => {
      const track = node.querySelector<HTMLElement>('.support-carousel-track')
      const card = track?.querySelector<HTMLElement>('.support-service-card')
      if (!track || !card) return
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '0')
      const nextStep = card.getBoundingClientRect().width + gap
      supportStepRef.current = nextStep
      setSupportStep(nextStep)
    }
    measureStep()
    const observer = new ResizeObserver(measureStep)
    observer.observe(node)
    window.addEventListener('resize', measureStep)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measureStep)
    }
  }, [])

  useEffect(() => {
    startSupportAutoplay()
    return clearSupportAutoplay
  }, [])

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
      <motion.section className="company-feature" id="company-overview" aria-label="公司介绍" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .72, ease: [.22, 1, .36, 1] }}>
        <div className="company-panel">
          <div className="company-left">
            <div className="company-heading"><p className="company-chapter">CHAPTER 01</p><h2 className="company-title">公司介绍</h2></div>
            <fieldset className="company-switcher"><legend className="sr-only">公司介绍主题</legend>{companyCards.map((card, index) => <label key={card.id} className={companyCard === index ? 'selected' : ''} onClick={() => selectCompanyCard(index)}><input type="radio" name="company-topic" checked={companyCard === index} onChange={() => selectCompanyCard(index)} />{card.label}</label>)}</fieldset>
            <motion.div key={companyCards[companyCard].id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="company-body">{companyCards[companyCard].body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</motion.div>
            <a className="primary company-more" href={companyIntroPdfUrl} target="_blank" rel="noreferrer" aria-label="打开公司介绍 PDF">了解更多 <ArrowRight size={16} /></a>
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
      </motion.section>
      <div className="long-page">
        <motion.section className="case-study-section" id="cases" aria-label="参考案例" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .72, ease: [.22, 1, .36, 1] }}>
          <div className="case-heading-block">
            <p className="case-chapter">CHAPTER 02</p>
            <h2>参考案例</h2>
            <p className="case-heading-note">针对竞品调研分析的一些设计和视觉参考</p>
            <div className="case-controls"><button type="button" aria-label="上一个案例" onClick={() => changeCase(-1)}><ArrowLeft size={18} /></button><button type="button" aria-label="下一个案例" onClick={() => changeCase(1)}><ArrowRight size={18} /></button></div>
          </div>
          <div className="case-carousel-wrap">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`case-page-${caseIndex}`} className="case-visible-pair" aria-label="案例卡片列表" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: .28, ease: [.22, 1, .36, 1] }}>
                {caseCards.slice(caseIndex * 2, caseIndex * 2 + 2).map((card, offset) => <div className="case-slot" key={card.id}>
                  <article className="case-card">
                    <div className="case-card-title"><span>{card.brand}</span><h3>{card.title}</h3></div>
                    <button className="case-image-button" type="button" onClick={() => setCasePreview({ image: card.image, title: `${card.brand} · ${card.title}` })} aria-label={`点击查看${card.brand}${card.title}完整图片`}><img src={card.image} alt={`${card.brand}${card.title}案例`} /><span className="case-image-hint">点击图片查看完整案例</span></button>
                    <div className="case-card-body"><span className="case-rule">—</span><p>{card.body}</p></div>
                    <span className="case-card-index">0{caseIndex * 2 + offset + 1}</span>
                  </article>
                </div>)}
              </motion.div>
            </AnimatePresence>
            <div className="case-carousel-footer"><span>切换案例浏览</span><div className="case-dots" aria-hidden="true">{Array.from({ length: Math.ceil(caseCards.length / 2) }, (_, index) => <i className={index === caseIndex ? 'active' : ''} key={index} />)}</div></div>
          </div>
        </motion.section>
        {sections.slice(2).map(([id]) => {
          if (id === 'after-sales') return null
          const item = sectionCopy[id]
          if (id === 'meeting') return <motion.section className="content-section meeting-content" id={id} key={id} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .72, ease: [.22, 1, .36, 1] }}>
            <div className="meeting-inner">
              <div className="meeting-section-heading">
                <p className="section-eyebrow">05 / WORKSHOP</p>
                <h2>关于会议</h2>
              </div>
              <div className="meeting-board">
                <img className="meeting-board-image" src="./meeting-board.png" alt="高效会议与执行跟进" />
              </div>
            </div>
            <span className="section-number">05</span>
          </motion.section>
          if (id === 'process') return <motion.section className="content-section process-content" id={id} key={id} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .72, ease: [.22, 1, .36, 1] }}>
            <div className="process-inner">
              <div className="process-layout">
                <div className="process-copy">
                  <div className="process-heading">
                    <p className="section-eyebrow">06 / DELIVERY FLOW</p>
                    <h2>开发流程说明</h2>
                    <p className="section-body">把每一个关键环节拆开，让协作、反馈与交付都有明确的下一步。</p>
                  </div>
                  <div className="process-detail-card" aria-live="polite">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div key={processStages[processSelected].title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .25, ease: [.22, 1, .36, 1] }}>
                        {(() => { const selectedStage = processStages[processSelected]; const selectedIconSrc = processIconMap[selectedStage.icon]; return <>
                          <div className="process-detail-top"><span>{selectedStage.phase}</span><b>0{processSelected + 1}</b></div>
                          <div className="process-detail-icon" aria-hidden="true"><img src={selectedIconSrc} alt="" /></div>
                          <h3>{selectedStage.title}</h3>
                          <p>{selectedStage.body}</p>
                        </> })()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                <div className="process-flow" aria-label="开发流程清单">
                  <svg className="process-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M16 16H84V50H16V84H84" /></svg>
                  <ol className="process-flow-list">
                    {processStages.map((stage, index) => { const processIconSrc = processIconMap[stage.icon]; return <motion.li key={stage.title} className={`process-flow-item process-flow-item-${index + 1} ${processSelected === index ? 'is-active' : ''}`} onClick={() => setProcessSelected(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setProcessSelected(index) } }} role="button" tabIndex={0} aria-pressed={processSelected === index} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ delay: .1 + index * .055, duration: .28, ease: [.22, 1, .36, 1] }}>
                      <div className="process-node-card">
                        <div className="process-card-icon" aria-hidden="true"><img src={processIconSrc} alt="" /></div>
                        <h3>{stage.title}</h3>
                      </div>
                    </motion.li>})}
                  </ol>
                </div>
              </div>
            </div>
            <span className="section-number">06</span>
          </motion.section>
          if (id === 'pricing') return <motion.section className="content-section pricing-content" id={id} key={id} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .72, ease: [.22, 1, .36, 1] }}>
            <div className="pricing-inner">
            <div className="pricing-title-wrap">
              <p className="section-eyebrow">04 / DEVELOPMENT QUOTE</p>
              <h2>定制开发报价清单</h2>
              <div className="pricing-subtitle-row"><p className="pricing-subtitle">项目付款节点</p><span className="pricing-hint"><Sparkles size={13} /> 悬停节点查看详情</span></div>
            </div>
              <div className="pricing-bar" id="pricing-payment" aria-label="付款比例与阶段说明">
                {pricingSegments.map((segment, index) => <button className={`pricing-segment pricing-segment-${index + 1}`} type="button" key={segment.label} aria-label={`${segment.label}：${segment.detail}`}>
                  <span>{segment.label}</span>
                  <strong>{segment.title}</strong>
                  <span className="pricing-tooltip" role="tooltip">{segment.detail}</span>
                </button>)}
              </div>
              <div className="pricing-notes-row">
                <div className="pricing-notes">
                  <h3>补充说明</h3>
                  <p>开发工期为技术开发时间，按原型图&amp;UI确认后开始计算；可分功能版块逐步上线，后续迭代升级。</p>
                  <p>本次报价为含税1%（增值税专票），不包含服务器、第三方平台（例如人脸识别、消息推送等产生的费用）。</p>
                </div>
                <div className="pricing-progress" aria-label="报价清单板块">
                  <div className="pricing-progress-card"><i>01</i><span>人力投入</span></div>
                  <div className="pricing-progress-card"><i>02</i><span>第三方费用</span></div>
                  <div className="pricing-progress-card"><i>03</i><span>后期维护费用</span></div>
                </div>
              </div>
              <section className="labor-details" id="pricing-labor" aria-labelledby="labor-details-title">
                <div className="labor-details-heading"><h3 id="labor-details-title">人力投入明细</h3></div>
                <div className="labor-details-panel">
                  <div className="labor-detail-group">
                    <h4>开发工期：</h4>
                    <p>项目开发工期为自设计稿确认以后，<strong>60 个工作日</strong></p>
                  </div>
                  <div className="labor-detail-group">
                    <h4>费用计算公式：</h4>
                    <p>人天合计 = 人数 × 人天/人</p>
                    <p>金额 = 人天合计 × 单价</p>
                  </div>
                </div>
              </section>
              <section className="cost-library" id="pricing-cost" aria-labelledby="cost-library-title">
                <div className="cost-library-heading"><h3 id="cost-library-title">第三方费用</h3></div>
                <div className="cost-notice"><strong>第三方费用说明：</strong><p>云服务资费费用为第三方官方费用，由极客上线负责代购及部署，不涉及收取相关服务费，相关价格以第三方官方实时价格为准。</p></div>
                <div className="cost-filters" role="tablist" aria-label="第三方费用分类">
                  {costCategories.map((category) => <button type="button" role="tab" aria-selected={costCategory === category} className={costCategory === category ? 'active' : ''} key={category} onClick={() => setCostCategory(category)}>{category}</button>)}
                </div>
                <p className="cost-count">显示全部 {visibleCosts.length} 项资源</p>
                <div className="cost-grid">
                  {visibleCosts.map((cost) => <article className={`cost-card ${expandedCosts[cost.id] ? 'is-expanded' : ''}`} key={cost.id}>
                    <p className="cost-breadcrumb">{cost.category} / {cost.label}</p>
                    <h4>{cost.label}</h4>
                    <p className="cost-price">{cost.price}<span className="cost-price-unit">/年</span></p>
                    <div className="cost-tags">{cost.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <button type="button" className="cost-toggle" aria-expanded={Boolean(expandedCosts[cost.id])} onClick={() => setExpandedCosts((current) => ({ ...current, [cost.id]: !current[cost.id] }))}>▼ 费用备注与选配链接</button>
                    <AnimatePresence initial={false}>
                      {expandedCosts[cost.id] && <motion.div className="cost-detail" initial={{ opacity: 0, height: 0, marginTop: 0, y: -5 }} animate={{ opacity: 1, height: 'auto', marginTop: 10, y: 0 }} exit={{ opacity: 0, height: 0, marginTop: 0, y: -5 }} transition={{ type: 'spring', stiffness: 420, damping: 28, mass: .45 }}><p>{cost.note}</p>{cost.link && <a href={optionLinkUrl} target="_blank" rel="noreferrer">参考选配链接 ↗</a>}</motion.div>}
                    </AnimatePresence>
                  </article>)}
                </div>
              </section>
              <section className="support-library" id="support" aria-labelledby="support-library-title">
                <div className="support-library-heading"><h3 id="support-library-title">后期维护费用</h3></div>
                <p className="support-library-description">上线之后，首年赠送一年技术运维服务，确保应用程序可正常使用。</p>
                <div className="support-inner">
                  <div className="support-panel">
                    <div className="support-panel-top"><span>服务内容</span><strong>开发费用 × 10% <em>按年</em></strong></div>
                    <div className={`support-carousel-window ${supportDragging ? 'is-dragging' : ''}`} ref={supportCarouselRef} onPointerDown={beginSupportDrag} onPointerMove={moveSupportDrag} onPointerUp={endSupportDrag} onPointerCancel={endSupportDrag}>
                      <div className="support-carousel-track" style={{ transform: `translate3d(${supportStep ? -supportIndex * supportStep + supportDragOffset : supportDragOffset}px, 0, 0)`, opacity: supportStep ? 1 : 0, transition: 'none' }}>
                        {[...supportServices, ...supportServices, ...supportServices].map((service, index) => {
                          const ServiceIcon = supportIconMap[service.icon]
                          const displayIndex = index % supportServices.length
                          return <article className="support-service-card" key={`${service.title}-${index}`} aria-hidden={index < supportServices.length || index >= supportServices.length * 2}>
                          <span className="support-service-index">0{displayIndex + 1}</span>
                          <div className="support-service-mark"><ServiceIcon size={20} strokeWidth={1.8} aria-hidden="true" /></div>
                          <h3>{service.title}</h3>
                          <p>{service.body}</p>
                        </article>
                        })}
                      </div>
                    </div>
                    <div className="support-carousel-footer"><span>左右拖动浏览服务</span></div>
                  </div>
                </div>
              </section>
            </div>
            <span className="section-number">04</span>
          </motion.section>
          return <motion.section className={`content-section ${id === 'features' ? 'features-content' : ''}`} id={id} key={id} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .72, ease: [.22, 1, .36, 1] }}>
            <div className="section-inner"><p className="section-eyebrow">{item.eyebrow}</p><h2>{id === 'features' ? '功能清单' : item.title}</h2><p className="section-body">{id === 'features' ? '贴售前功能清单附件' : item.body}</p>{id !== 'features' && <span className="section-number">07</span>}</div>
            {id === 'features' && <div className="attachment-card">
              <div className="attachment-heading"><span className="attachment-icon"><FileText size={22} /></span><div><strong>售前功能清单附件</strong><small>支持 PDF、DOCX、XLSX、PNG</small></div></div>
              <label className="attachment-drop"><input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? '')} /><Upload size={18} /><span>{attachmentName || '点击选择功能清单文件'}</span><em><Paperclip size={14} /> 浏览文件</em></label>
            </div>}
          </motion.section>
        })}
        <motion.section className="after-sales-section" id="after-sales" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .72, ease: [.22, 1, .36, 1] }}>
          <div className="after-sales-inner">
            <div className="after-sales-heading">
              <p className="section-eyebrow">07 / AFTER-SALES SERVICE</p>
              <h2>售后服务说明</h2>
            </div>
            <div className="after-sales-notice">
              <p>极客上线提供<strong>一年免费的服务</strong>。次年如需继续维护，费用为开发费用的10%。<br /><strong>所有BUG免费修复，小需求免费迭代。</strong><br />内容由客户成功团队全程负责，确保系统稳定运行与持续迭代。</p>
            </div>
            <div className="after-sales-content-grid">
              <div className="after-sales-detail-panel" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={afterSalesCategory} className="after-sales-category-content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .26, ease: [.22, 1, .36, 1] }}>
                    {afterSalesCategory === 'process' && <>
                      <h3>售后流程详细说明</h3>
                      <div className="after-sales-process-groups">
                        {afterSalesGroups.map((group) => <div className="after-sales-process-group" key={group.title}>
                          <h4>{group.title}</h4>
                          <div className="after-sales-process-items">{group.items.map((item) => <article key={item.title}><strong>{item.title}</strong><p>{item.body}</p></article>)}</div>
                        </div>)}
                      </div>
                    </>}
                    {afterSalesCategory === 'deliverables' && <>
                      <h3>交付物说明</h3>
                      <p className="after-sales-intro">根据不同阶段的任务安排，提供以下类型的阶段性交付成果。</p>
                      <div className="after-sales-data-table delivery-table"><div className="after-sales-table-head"><span>交付分类</span><span>交付细分</span></div>{deliveryRows.map(([title, detail]) => <div className="after-sales-table-row" key={title}><strong>{title}</strong><span>{detail}</span></div>)}</div>
                    </>}
                    {afterSalesCategory === 'testing' && <>
                      <h3>测试说明</h3>
                      <div className="after-sales-testing-cards">{testingRows.map(([stage, work, owner, prerequisite, output]) => <article className="after-sales-testing-card" key={`${stage}-${work}`}><div className="after-sales-testing-card-top"><strong>{stage}</strong><span>{owner}</span></div><p>{work}</p><div className="after-sales-testing-meta"><span><b>前置条件</b>{prerequisite}</span><span><b>产出物</b>{output}</span></div></article>)}</div>
                    </>}
                    {afterSalesCategory === 'maintenance' && <>
                      <h3>维护说明</h3>
                      <div className="after-sales-data-table maintenance-table"><div className="after-sales-table-head"><span>服务分类</span><span>目标</span><span>服务内容</span></div>{maintenanceRows.map(([type, goal, detail]) => <div className="after-sales-table-row" key={type}><strong>{type}</strong><span>{goal}</span><span>{detail}</span></div>)}</div>
                    </>}
                    {afterSalesCategory === 'visual' && <>
                      <h3>视觉维护说明</h3>
                      <p className="after-sales-intro">在不改变核心逻辑的前提下，提供以下轻量级体验优化支持。</p>
                      <div className="after-sales-visual-list">{visualMaintenanceRows.map(([type, detail, range], index) => <div className="after-sales-visual-row" key={type}><span className="after-sales-visual-index">0{index + 1}</span><strong>{type}</strong><p>{detail}</p><em>{range}</em></div>)}</div>
                    </>}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="after-sales-category-nav" role="tablist" aria-label="售后服务分类">
                {afterSalesCategories.map((category, index) => <button type="button" role="tab" aria-selected={afterSalesCategory === category.id} className={afterSalesCategory === category.id ? 'is-active' : ''} key={category.id} onClick={() => setAfterSalesCategory(category.id)}><span className="after-sales-category-number">0{index + 1}</span><span>{category.label}</span><span className="after-sales-category-arrow" aria-hidden="true">{afterSalesCategory === category.id ? '↘' : '→'}</span></button>)}
              </div>
            </div>
          </div>
        </motion.section>
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
