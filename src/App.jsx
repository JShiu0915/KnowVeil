import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { BRAND, PRODUCTS } from './brand'

import HeroParticles from './HeroParticles'

import ScrollReveal from './ScrollReveal'

const productCards = [
  {
    name: PRODUCTS.skill.name,
    category: PRODUCTS.skill.kind,
    type: 'skill',
    route: '/products/skillnavigator',
  },
  {
    name: PRODUCTS.knode.name,
    category: PRODUCTS.knode.kind,
    type: 'knode',
    route: '/products/knode',
  },
]

/** 产品截图：将文件放入 public/images/products/ 后，取消对应 heroSrc / cardSrc 的注释即可 */
const productPreviewImages = {
  skill: {
    heroSrc: '/images/products/skillnavigator-hero.webp', // '/images/products/skillnavigator-hero.webp'
    cardSrc: '/images/products/skillnavigator-card.webp', // '/images/products/skillnavigator-card.webp'
    alt: 'SkillNavigator 产品界面截图',
    heroFile: 'public/images/products/skillnavigator-hero.webp',
    cardFile: 'public/images/products/skillnavigator-card.webp',
  },
  knode: {
    heroSrc: '', // '/images/products/knode-hero.webp'
    cardSrc: '', // '/images/products/knode-card.webp'
    alt: 'Knode 产品界面截图',
    heroFile: 'public/images/products/knode-hero.webp',
    cardFile: 'public/images/products/knode-card.webp',
  },
}

const skillVerdicts = {
  pass: '通过',
  review: '需复核',
  reject: '拒绝',
}

/** 文案对应截图里真实可见的功能；换截图时一并核对 */
const skillScreens = [
  {
    id: 'home',
    name: '首页',
    src: '/images/products/skillnavigator-hero.webp',
    text: '同事从这里查找公开的 Skill，也从这里发布自己的。',
  },
  {
    id: 'skills',
    name: 'Skill 广场',
    src: '/images/products/skills-marketplace.webp',
    text: '按领域、名称或发布者查找 Skill，评分、下载量和审查状态一并列出。',
  },
  {
    id: 'creators',
    name: '发布者',
    src: '/images/products/creators.webp',
    text: '每位发布者发布过哪些 Skill，被下载了多少次，都列在这里。',
  },
  {
    id: 'leaderboard',
    name: '榜单',
    src: '/images/products/leaderboard.webp',
    text: '按下载次数、评分或更新时间排序，看大家都在用什么。',
  },
  {
    id: 'inspections',
    name: '审查中心',
    src: '/images/products/inspections.webp',
    text: '每个 Skill 最新版本的检查结果，列在一张表里，可以排序、导出。',
  },
]

/** 需复核的 Skill 仍会出现在检索结果里（带标记），见 Skill 广场截图 */
const skillSubmissions = [
  {
    id: 'contract',
    name: '合同审查助手',
    version: 'v1.2.0',
    previousVersion: 'v1.1.0',
    team: '法务部',
    submitter: '陈思远',
    date: '4 月 2 日',
    checks: [
      { label: '格式', result: '符合要求' },
      { label: '质量', result: '2 条修改建议' },
      { label: '安全', result: '未发现风险' },
    ],
    verdict: 'pass',
    outcome: '出现在公开检索中，同事可以按版本安装。',
  },
  {
    id: 'daily-report',
    name: '经营日报生成',
    version: 'v0.9.0',
    team: '财务部',
    submitter: '李然',
    date: '3 月 28 日',
    checks: [
      { label: '格式', result: '符合要求' },
      { label: '质量', result: '符合要求' },
      { label: '安全', result: '1 项需要人工复核', tone: 'review' },
    ],
    verdict: 'review',
    outcome: '出现在检索结果中，带着需复核的标记。',
  },
  {
    id: 'bulk-export',
    name: '批量导出工具',
    version: 'v2.1.0',
    team: '运营部',
    submitter: '王蔚',
    date: '3 月 20 日',
    checks: [
      { label: '格式', result: '符合要求' },
      { label: '质量', result: '1 条修改建议' },
      { label: '安全', result: '1 项高危风险', tone: 'reject' },
    ],
    verdict: 'reject',
    outcome: '不出现在公开检索中。问题清单已经列出，处理后可以重新提交。',
  },
]

const skillInspectionFacts = [
  {
    title: '只看内容，不运行程序',
    text: '检查只读取送审的内容，不会在你的环境里运行它。',
  },
  {
    title: '没有外网也能完成',
    text: '检查在企业自己的机器上进行，不连外网也能给出问题清单和结论。',
  },
  {
    title: '结论留档，随时能查',
    text: '每一次检查的问题清单和结论都会保留，之后随时可以回看。',
  },
]

const productDetails = {
  knode: {
    headline: '让 AI 读得到你的知识，',
    highlight: '而知识不出你的边界。',
    intro:
      'Knode 是企业的知识底账：知识集中放在你自己的电脑或服务器上，由人来维护，AI 直接使用。你能随时看到它用了哪些资料、答得对不对——而不是只收到一个看起来很有道理的答案。',
    capabilities: [
      {
        number: '01',
        title: '结构清楚，一眼找得到',
        text: '按项目与主题分层整理，打开就知道东西放在哪、哪一块还空着。',
      },
      {
        number: '02',
        title: '答案能回到原文',
        text: 'AI 引用某段内容时，出处会精确到原文的哪一节。要核对，点回去看原文。',
      },
      {
        number: '03',
        title: '改一处，立刻生效',
        text: '发现写错了，直接改；下一次提问用的就是新内容，不用等同步、不用重新导入。',
      },
    ],
    steps: ['建好自己的知识目录', '接入常用的 AI', '边用边改，错了就修', '把成熟做法做成能力'],
    notes: [
      ['东西在你手上', '放在你的机器上，随时能整包带走'],
      ['改动有记录', '谁在什么时候改了什么，可回溯'],
      ['换 AI 不搬数据', '常用客户端随便换'],
    ],
  },
}

const documentGroups = [
  {
    label: 'GETTING STARTED',
    title: '开始使用 KnowVeil',
    items: ['两个产品怎么配合', '部署在哪、谁维护', '接入常用的 AI 客户端'],
  },
  {
    label: 'SKILLNAVIGATOR',
    title: '能力的检查与分发',
    items: ['一个能力包长什么样', '检查规则与结论含义', '版本、标签与下架'],
  },
  {
    label: 'KNODE',
    title: '知识底账怎么用',
    items: ['知识目录怎么组织', '引用的出处怎么核对', '备份、迁移与对外分享'],
  },
]

/** 首页按主句的顺序排列：先「温故」，后「知新」 */
const homeProductOrder = ['knode', 'skill']

const homeProductTexts = {
  knode: '知识按项目与主题分层整理，打开就知道放在哪；由人来维护，AI 直接使用。',
  skill: '能力在发布前先过一道检查，结论决定它能不能被公开检索到；发出去的版本不能偷改，要改只能发新版本。',
}

const citationDemo = {
  question: '给同类客户做尽调，我们以往重点查哪些事项？',
  answer: [
    { text: '以往同类项目重点核查三类事项：股权结构的历次变更', source: 1 },
    { text: '、对外担保与资产抵押', source: 2 },
    { text: '，以及核心合同里的控制权变更条款', source: 3 },
    { text: '。' },
  ],
  sources: [
    {
      id: 1,
      document: '尽调工作清单（2025 修订）',
      section: '第 2 节',
      sectionTitle: '股权与历史沿革',
      passage: [
        '自设立起的',
        '每一次增资与股权转让，都要逐笔对照工商登记和股东会决议',
        '；材料缺失的部分，单独列出待补清单。',
      ],
    },
    {
      id: 2,
      document: '华东某制造业项目复盘',
      section: '第 4 节',
      sectionTitle: '担保核查',
      passage: [
        '这个项目的主要风险，来自一笔没有披露的对外担保。此后，',
        '对外担保与资产抵押列为同类项目的必查项',
        '。',
      ],
    },
    {
      id: 3,
      document: '合同审查要点',
      section: '第 3.1 节',
      sectionTitle: '控制权变更',
      passage: [
        '核心客户与供应商合同，',
        '逐份检查控制权变更条款',
        '，判断交易完成后是否需要取得对方的书面同意。',
      ],
    },
  ],
}

const assetLoop = [
  { step: '存', text: '把知识整理进企业自己的目录', by: PRODUCTS.knode.name },
  { step: '取', text: 'AI 按需读取它该读的那一部分', by: PRODUCTS.knode.name },
  { step: '用', text: '在你选的那款 AI 里完成推理和回答', by: '你选的 AI' },
  { step: '鉴', text: '把验证过的做法做成能力，检查过再发给全组织', by: PRODUCTS.skill.name },
]

const aiClientLogos = [
  { name: 'Claude', logo: 'claude.svg' },
  { name: 'Codex', logo: 'codex.svg' },
  { name: 'Cursor', logo: 'cursor.svg' },
  { name: 'CodeBuddy', logo: 'codebuddy.svg' },
  { name: 'Cline', logo: 'cline.svg' },
  { name: 'Kilo Code', logo: 'kilocode.svg' },
  { name: 'OpenCode', logo: 'opencode.svg' },
  { name: 'Cherry Studio', logo: 'cherrystudio.svg' },
  { name: 'OpenClaw', logo: 'openclaw.svg' },
  { name: 'Hermes Agent', logo: 'hermesagent.svg' },
  { name: 'MiMo Code', logo: 'mimo.svg' },
  { name: 'Qwen Code', logo: 'qwen.svg' },
]

const boundaryFacts = [
  { title: '放在自己的机器上', text: '知识就在你的电脑或服务器里，随时能整包带走。' },
  { title: '改动都有记录', text: '谁在什么时候改了什么，都能回溯。' },
  { title: 'AI 只走受控入口', text: 'AI 不能直接改动你的知识，改动只能经过受控的入口。' },
  { title: '检查不运行代码', text: '能力审查只看内容，不运行其中的程序，也可以完全离线进行。' },
]

function CitationSpecimen() {
  const { question, answer, sources } = citationDemo
  const [activeId, setActiveId] = useState(sources[0].id)
  const activeSource = sources.find((source) => source.id === activeId) ?? sources[0]
  const [passageBefore, passageQuote, passageAfter] = activeSource.passage

  const citeLabel = (source) => `查看出处 ${source.id}：${source.document}，${source.section}`

  return (
    <figure className="home-specimen">
      <div className="home-specimen__panel">
        <div className="home-specimen__dialogue">
          <div className="home-specimen__turn">
            <span className="home-specimen__speaker">问</span>
            <p className="home-specimen__question">{question}</p>
          </div>
          <div className="home-specimen__turn">
            <span className="home-specimen__speaker">答</span>
            <p className="home-specimen__answer">
              {answer.map((part) => {
                const source = sources.find((item) => item.id === part.source)

                if (!source) return <React.Fragment key={part.text}>{part.text}</React.Fragment>

                return (
                  <React.Fragment key={part.text}>
                    {part.text.slice(0, -1)}
                    <span className="home-specimen__claim-end">
                      {part.text.slice(-1)}
                      <button
                        className={
                          source.id === activeId
                            ? 'home-specimen__cite home-specimen__cite--active'
                            : 'home-specimen__cite'
                        }
                        type="button"
                        aria-pressed={source.id === activeId}
                        aria-label={citeLabel(source)}
                        onClick={() => setActiveId(source.id)}
                      >
                        {source.id}
                      </button>
                    </span>
                  </React.Fragment>
                )
              })}
            </p>
          </div>

          <div className="home-specimen__sources">
            <p>这次回答用到了 {sources.length} 份资料，点选可查看原文</p>
            <ol>
              {sources.map((source) => (
                <li key={source.id}>
                  <button
                    className={
                      source.id === activeId
                        ? 'home-specimen__source home-specimen__source--active'
                        : 'home-specimen__source'
                    }
                    type="button"
                    aria-pressed={source.id === activeId}
                    onClick={() => setActiveId(source.id)}
                  >
                    <span className="home-specimen__source-number">{source.id}</span>
                    <span className="home-specimen__source-document">{source.document}</span>
                    <span className="home-specimen__source-section">{source.section}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="home-specimen__original" aria-live="polite">
          <article className="home-specimen__sheet" key={activeSource.id}>
            <h3>{activeSource.document}</h3>
            <p className="home-specimen__sheet-section">
              {activeSource.section}
              <span>{activeSource.sectionTitle}</span>
            </p>
            <p className="home-specimen__passage">
              {passageBefore}
              <mark>{passageQuote}</mark>
              {passageAfter}
            </p>
            <p className="home-specimen__sheet-note">
              这段写错了？直接在原文里改，下一次回答就用新内容。
            </p>
          </article>
        </div>
      </div>
      <figcaption>界面示意，问答内容为虚构示例。</figcaption>
    </figure>
  )
}

function Arrow({ size = 17 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 19 19 5" />
      <path d="M8 5h11v11" />
    </svg>
  )
}

function MenuIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  )
}

function ChevronDown({ size = 22 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function Chevron({ open = false }) {
  return (
    <svg
      aria-hidden="true"
      className={open ? 'nav-chevron nav-chevron--open' : 'nav-chevron'}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function SkillPackageIcon({ size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 6.5 3.75v7.5L12 18l-6.5-3.75v-7.5z" />
      <path d="m5.5 6.75 6.5 3.75 6.5-3.75" />
      <path d="M12 10.5V18" />
    </svg>
  )
}

function CursorIcon({ size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="var(--sheet)"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <path d="m5 3 13 8-5.7 1.5L10.8 19z" />
    </svg>
  )
}

function normalisePath(pathname) {
  const path = pathname.replace(/\/+$/, '')
  return path || '/'
}

const BASE_URL = import.meta.env.BASE_URL

function toAppPath(pathname) {
  const base = BASE_URL.replace(/\/$/, '')
  let path = pathname

  if (base && (path === base || path.startsWith(`${base}/`))) {
    path = path.slice(base.length) || '/'
  }

  return normalisePath(path)
}

function toHref(appPath) {
  const path = normalisePath(appPath)

  if (path === '/') {
    return BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`
  }

  const base = BASE_URL.replace(/\/$/, '')
  return `${base}${path}`
}

function publicAsset(path) {
  if (!path) {
    return ''
  }

  return `${BASE_URL}${path.replace(/^\//, '')}`
}

function useAppRoute() {
  const [path, setPath] = useState(() => toAppPath(window.location.pathname))

  useEffect(() => {
    const updatePath = () => setPath(toAppPath(window.location.pathname))
    window.addEventListener('popstate', updatePath)
    return () => window.removeEventListener('popstate', updatePath)
  }, [])

  const navigate = (to) => {
    const target = normalisePath(to)
    const href = toHref(target)

    if (target !== toAppPath(window.location.pathname)) {
      window.history.pushState({}, '', href)
    }
    setPath(target)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return { path, navigate }
}

function AppLink({ to, navigate, onNavigate, children, ...props }) {
  const handleClick = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return
    }

    event.preventDefault()
    navigate(to)
    onNavigate?.()
  }

  return (
    <a href={toHref(to)} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

function Brand({ navigate, onNavigate }) {
  return (
    <AppLink
      className="brand"
      to="/"
      navigate={navigate}
      onNavigate={onNavigate}
      aria-label={`${BRAND.name} 首页`}
    >
      <BrandMark />
      <span>{BRAND.name.toLowerCase()}</span>
    </AppLink>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="section-label">
      <span />
      {children}
    </p>
  )
}

function ProductPreview({ type, variant = 'card' }) {
  const preview = productPreviewImages[type]
  const src = variant === 'hero' ? preview.heroSrc : preview.cardSrc
  const resolvedSrc = publicAsset(src)
  const fileHint = variant === 'hero' ? preview.heroFile : preview.cardFile
  const [loadError, setLoadError] = useState(false)

  if (resolvedSrc && !loadError) {
    return (
      <figure
        className={`product-preview product-preview--${type} product-preview--${variant}`}
      >
        <img
          className="product-preview__image"
          src={resolvedSrc}
          alt={preview.alt}
          loading={variant === 'hero' ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setLoadError(true)}
        />
      </figure>
    )
  }

  if (variant === 'hero') {
    return (
      <div
        className={`product-preview product-preview--${type} product-preview--hero product-preview--placeholder`}
      >
        <span className="product-preview__label">产品截图位</span>
        <p className="product-preview__hint">将截图放入下方路径，并在 App.jsx 中填写 heroSrc</p>
        <code className="product-preview__path">{fileHint}</code>
      </div>
    )
  }

  return <ProductSketch type={type} />
}

function ProductSketch({ type }) {
  if (type === 'skill') {
    return (
      <div className="product-sketch product-sketch--skill" aria-hidden="true">
        <div className="sketch-bar">
          <span />
          <span />
          <span />
          <b>Skill library</b>
          <i />
        </div>
        <div className="skill-sketch-body">
          <aside>
            <em />
            <em />
            <em />
            <em />
          </aside>
          <div className="skill-sketch-content">
            <div className="sketch-heading">
              <div>
                <small>团队业务能力</small>
                <strong>已沉淀的 AI Skill</strong>
              </div>
              <span>+ 新建</span>
            </div>
            <div className="skill-sketch-grid">
              {[
                ['经营日报', '数据分析', '↗'],
                ['方案生成', '文档处理', '✦'],
                ['售后助手', '客户服务', '∿'],
                ['合同审查', '风险识别', '⌁'],
              ].map(([name, category, icon]) => (
                <div className="skill-item" key={name}>
                  <b>{icon}</b>
                  <span>
                    <strong>{name}</strong>
                    <small>{category}</small>
                  </span>
                  <i />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="product-sketch product-sketch--knode" aria-hidden="true">
      <p className="knode-window__bar">知识目录</p>
      <div className="knode-window__body">
        <div className="knode-window__tree">
          {[
            ['项目', ['华东并购项目', '西南能源项目']],
            ['主题', ['尽职调查', '合同审查', '监管合规']],
          ].map(([group, folders]) => (
            <div className="knode-window__group" key={group}>
              <small>{group}</small>
              {folders.map((folder) => (
                <span
                  className={
                    folder === '尽职调查'
                      ? 'knode-window__folder knode-window__folder--active'
                      : 'knode-window__folder'
                  }
                  key={folder}
                >
                  {folder}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="knode-window__files">
          <p className="knode-window__path">主题 / 尽职调查</p>
          <div className="knode-window__row knode-window__row--head">
            <span>资料</span>
            <span>修改人</span>
            <span>修改时间</span>
          </div>
          {[
            ['尽调工作清单（2025 修订）', '王蔚', '3 天前'],
            ['合同审查要点', '陈思远', '上周'],
            ['股权变更核查底稿', '李然', '上个月'],
          ].map(([file, editor, time]) => (
            <div className="knode-window__row" key={file}>
              <span>{file}</span>
              <span>{editor}</span>
              <span>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HeroTitle() {
  const [revealed, setRevealed] = useState(false)
  const [shift, setShift] = useState(0)
  const gapRef = useRef(null)
  const tailRef = useRef(null)

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const measure = () => {
      if (!gapRef.current || !tailRef.current) return
      const offset = (gapRef.current.offsetWidth + tailRef.current.offsetWidth) / 2
      setShift(window.innerWidth >= 720 ? offset : 0)
    }

    measure()
    window.addEventListener('resize', measure)

    const timer = setTimeout(() => setRevealed(true), reduced ? 0 : 1000)

    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(timer)
    }
  }, [])

  return (
    <h1
      style={{
        transform: revealed ? 'translateX(0)' : `translateX(${shift}px)`,
        transition: 'transform 850ms cubic-bezier(0.22, 0.61, 0.21, 1)',
      }}
    >
      让 AI 温故
      <span
        ref={gapRef}
        aria-hidden="true"
        className="hero-title-gap"
        style={{ display: 'inline-block', width: '0.32em' }}
      />
      <span
        ref={tailRef}
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateX(0)' : 'translateX(22px)',
          transition:
            'opacity 750ms ease 120ms, transform 850ms cubic-bezier(0.22, 0.61, 0.21, 1) 120ms',
        }}
      >
        让组织知新
      </span>
    </h1>
  )
}

function SiteHeader({ path, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const productActive = path.startsWith('/products/')

  const closeNavigation = () => {
    setMenuOpen(false)
    setProductsOpen(false)
  }

  const toggleProducts = () => {
    if (window.matchMedia('(max-width: 720px)').matches) {
      setProductsOpen((open) => !open)
    }
  }

  return (
    <header className="site-header">
      <Brand navigate={navigate} onNavigate={closeNavigation} />
      <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="主导航">
        <AppLink
          className={path === '/' ? 'main-nav__link main-nav__link--active' : 'main-nav__link'}
          to="/"
          navigate={navigate}
          onNavigate={closeNavigation}
          aria-current={path === '/' ? 'page' : undefined}
        >
          首页
        </AppLink>
        <div className={productsOpen ? 'product-menu product-menu--open' : 'product-menu'}>
          <button
            className={productActive ? 'main-nav__product main-nav__product--active' : 'main-nav__product'}
            type="button"
            aria-expanded={productsOpen}
            aria-haspopup="true"
            onClick={toggleProducts}
          >
            产品
            <Chevron open={productsOpen} />
          </button>
          <div className="product-dropdown">
            {productCards.map((product) => (
              <AppLink
                className="product-dropdown__item"
                to={product.route}
                navigate={navigate}
                onNavigate={closeNavigation}
                key={product.name}
              >
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </div>
                <Arrow size={14} />
              </AppLink>
            ))}
          </div>
        </div>
        <AppLink
          className={path === '/docs' ? 'main-nav__link main-nav__link--active' : 'main-nav__link'}
          to="/docs"
          navigate={navigate}
          onNavigate={closeNavigation}
          aria-current={path === '/docs' ? 'page' : undefined}
        >
          文档
        </AppLink>
      </nav>
      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <MenuIcon open={menuOpen} />
      </button>
    </header>
  )
}

function HomePage({ navigate }) {
  const [scrollHintVisible, setScrollHintVisible] = useState(true)
  const consultHref = `mailto:${BRAND.email}?subject=${encodeURIComponent(`${BRAND.name} 方案咨询`)}`

  useEffect(() => {
    const updateScrollHint = () => {
      setScrollHintVisible(window.scrollY < 64)
    }

    updateScrollHint()
    window.addEventListener('scroll', updateScrollHint, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollHint)
  }, [])

  return (
    <main className="home">
      <section className="home-hero" id="top">
        <HeroParticles />
        <div className="home-hero__content">
          <HeroTitle />
          <ScrollReveal as="p" className="home-hero__promise" delay={1150}>
            {BRAND.promise}
          </ScrollReveal>
          <ScrollReveal as="a" className="action-button" href={consultHref} delay={1300}>
            预约方案沟通
          </ScrollReveal>
        </div>
        <a
          className={
            scrollHintVisible ? 'home-hero__hint' : 'home-hero__hint home-hero__hint--hidden'
          }
          href="#products"
        >
          向下探索
          <span className="home-hero__hint-icon">
            <ChevronDown />
          </span>
        </a>
      </section>

      <section
        className="page-section home-products"
        id="products"
        aria-labelledby="home-products-title"
      >
        <ScrollReveal className="page-intro" revealEarly>
          <h2 id="home-products-title">
            模型会换代，也会过期。
            <span>企业知道什么、会做什么，不会过期。</span>
          </h2>
          <p>{BRAND.name} 经营的，就是这两样。</p>
        </ScrollReveal>
        <div className="home-products__grid">
          {homeProductOrder.map((type, index) => {
            const product = productCards.find((item) => item.type === type)

            return (
              <ScrollReveal
                as="article"
                className={`home-product home-product--${type}`}
                delay={180 + index * 110}
                revealEarly
                key={type}
              >
                <h3>
                  <span className="home-product__motto">{PRODUCTS[type].motto}</span>
                  <span className="home-product__name">{product.name}</span>
                </h3>
                <p className="home-product__kind">{product.category}</p>
                <p className="home-product__line">
                  {PRODUCTS[type].line.replace(/，/g, '，\n').split('\n').map((phrase) => (
                    <span key={phrase}>{phrase}</span>
                  ))}
                </p>
                <p className="home-product__text">{homeProductTexts[type]}</p>
                <AppLink className="action-link" to={product.route} navigate={navigate}>
                  了解 {product.name}
                </AppLink>
                <ProductPreview type={type} variant="card" />
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      <section className="page-section home-verify" aria-labelledby="home-verify-title">
        <ScrollReveal className="page-intro" revealEarly>
          <h2 id="home-verify-title">
            AI 答得对不对，
            <span>你随时能查。</span>
          </h2>
          <p>
            AI 用 {PRODUCTS.knode.name} 里的知识回答时，每个结论都能带出处，精确到原文的哪一节。点开出处，对照的就是原文那一段。
          </p>
        </ScrollReveal>
        <ScrollReveal revealEarly>
          <CitationSpecimen />
        </ScrollReveal>
      </section>

      <section className="page-section home-loop" aria-labelledby="home-loop-title">
        <ScrollReveal className="page-intro" revealEarly>
          <h2 id="home-loop-title">
            每一次使用，
            <span>都在加厚这份资产。</span>
          </h2>
          <p>存、取、用、鉴是一个循环：用得越多，知识越厚；知识越厚，AI 越好用。</p>
        </ScrollReveal>
        <ScrollReveal as="ol" className="home-loop__steps" revealEarly>
          {assetLoop.map((item) => (
            <li key={item.step}>
              <h3>{item.step}</h3>
              <p>{item.text}</p>
              <small>{item.by}</small>
            </li>
          ))}
        </ScrollReveal>
      </section>

      <section className="page-section home-clients" aria-labelledby="home-clients-title">
        <ScrollReveal className="page-intro" revealEarly>
          <h2 id="home-clients-title">
            不管是哪一款 AI，
            <span>知识都不用搬家。</span>
          </h2>
          <p>
            <Phrases text="下面这些 AI 客户端可以直接接入，以及任何支持 MCP 的 AI 客户端。企业自己部署的 AI，也一样接得上。换工具，不用迁移知识。" />
          </p>
        </ScrollReveal>
        <ul className="home-clients__grid">
          {aiClientLogos.map((client, index) => (
            <ScrollReveal as="li" delay={140 + (index % 4) * 60} revealEarly key={client.name}>
              <img
                src={publicAsset(`/images/ai-clients/${client.logo}`)}
                alt=""
                width="28"
                height="28"
                loading="lazy"
                decoding="async"
              />
              {client.name}
            </ScrollReveal>
          ))}
          <ScrollReveal as="li" className="home-clients__own" delay={140} revealEarly>
            <span className="home-clients__own-mark" aria-hidden="true">
              +
            </span>
            你的企业 AI 客户端
          </ScrollReveal>
        </ul>
      </section>

      <section
        className="page-section home-boundary"
        id="private-ai"
        aria-labelledby="home-boundary-title"
      >
        <ScrollReveal className="home-boundary__layout" revealEarly>
          <div className="page-intro">
            <h2 id="home-boundary-title">
              知识的去留，
              <span>由企业自己决定。</span>
            </h2>
          </div>
          <ul className="home-boundary__facts">
            {boundaryFacts.map((fact) => (
              <li key={fact.title}>
                <h3>{fact.title}</h3>
                <p>{fact.text}</p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>

      <ContactBand
        title="让下一次业务经验，"
        titleTail="成为全组织的能力。"
        text="从一个值得做的场景开始，一起规划企业自己的私有 AI 路径。"
        consultHref={consultHref}
      />
    </main>
  )
}

function ContactBand({ title, titleTail, text, consultHref }) {
  return (
    <section className="contact-band" id="contact" aria-labelledby="contact-band-title">
      <span className="contact-band__ring contact-band__ring--inner" aria-hidden="true" />
      <span className="contact-band__ring contact-band__ring--outer" aria-hidden="true" />
      <ScrollReveal className="contact-band__intro" revealEarly>
        <h2 id="contact-band-title">
          {title}
          <span>{titleTail}</span>
        </h2>
        <p>{text}</p>
      </ScrollReveal>
      <ScrollReveal className="contact-band__actions" delay={120} revealEarly>
        <a className="action-button" href={consultHref}>
          预约方案沟通
        </a>
        <a className="action-link" href={`mailto:${BRAND.email}`}>
          {BRAND.email}
        </a>
      </ScrollReveal>
    </section>
  )
}

/** 窄栏里的短句只在标点后换行 */
function Phrases({ text }) {
  return text
    .replace(/([，；。])/g, '$1\n')
    .split('\n')
    .filter(Boolean)
    .map((phrase) => (
      <span className="phrase" key={phrase}>
        {phrase}
      </span>
    ))
}

function SkillScreens() {
  const [activeId, setActiveId] = useState(skillScreens[0].id)
  const [leavingId, setLeavingId] = useState(null)
  const [failedIds, setFailedIds] = useState([])
  const screens = skillScreens.filter((screen) => !failedIds.includes(screen.id))
  const active = screens.find((screen) => screen.id === activeId) ?? screens[0]

  if (!active) {
    return null
  }

  const select = (id) => {
    if (id === active.id) {
      return
    }

    setLeavingId(active.id)
    setActiveId(id)
  }

  return (
    <div className="skill-screens">
      <ul className="skill-screens__index" aria-label={`${PRODUCTS.skill.name} 的主要页面`}>
        {screens.map((screen) => {
          const isActive = screen.id === active.id

          return (
            <li
              className={isActive ? 'skill-screens__item skill-screens__item--active' : 'skill-screens__item'}
              key={screen.id}
            >
              <button
                className="skill-screens__name"
                type="button"
                aria-pressed={isActive}
                aria-controls="skill-screens-stack"
                onClick={() => select(screen.id)}
              >
                {screen.name}
              </button>
              <div className="skill-screens__detail">
                <p>
                  <Phrases text={screen.text} />
                </p>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="skill-screens__caption" aria-live="polite">
        <Phrases text={active.text} />
      </p>
      <figure className="skill-screens__figure">
        <div className="skill-screens__stack" id="skill-screens-stack">
          {screens.map((screen) => {
            let state = 'waiting'

            if (screen.id === active.id) {
              state = 'active'
            } else if (screen.id === leavingId) {
              state = 'leaving'
            }

            return (
              <div
                className={`skill-screens__sheet skill-screens__sheet--${state}`}
                aria-hidden={state === 'active' ? undefined : true}
                key={screen.id}
              >
                <img
                  src={publicAsset(screen.src)}
                  alt={state === 'active' ? `${PRODUCTS.skill.name}${screen.name}截图` : ''}
                  decoding="async"
                  onError={() =>
                    setFailedIds((ids) => (ids.includes(screen.id) ? ids : [...ids, screen.id]))
                  }
                />
              </div>
            )
          })}
        </div>
        <figcaption>产品界面截图，数据为演示内容。</figcaption>
      </figure>
    </div>
  )
}

function SkillFlow() {
  const [activeId, setActiveId] = useState(skillSubmissions[0].id)
  const [run, setRun] = useState(0)
  const [armed, setArmed] = useState(true)
  const figureRef = useRef(null)
  const submission = skillSubmissions.find((item) => item.id === activeId) ?? skillSubmissions[0]
  const released = submission.verdict !== 'reject'

  useEffect(() => {
    const figure = figureRef.current

    if (!figure || !('IntersectionObserver' in window)) {
      setArmed(false)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(false)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(figure)
    return () => observer.disconnect()
  }, [])

  const select = (id) => {
    setActiveId(id)
    setRun((count) => count + 1)
    setArmed(false)
  }

  return (
    <div className="skill-flow">
      <div className="skill-flow__picker" role="group" aria-labelledby="skill-flow-picker-label">
        <p id="skill-flow-picker-label">选一份送审，看它走到哪一步</p>
        <div className="skill-flow__options">
          {skillSubmissions.map((item) => (
            <button
              className="skill-flow__option"
              type="button"
              aria-pressed={item.id === activeId}
              onClick={() => select(item.id)}
              key={item.id}
            >
              {item.name}
              <span className={`skill-flow__tone skill-flow__tone--${item.verdict}`}>
                {skillVerdicts[item.verdict]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <figure className="skill-flow__figure" ref={figureRef}>
        <ol
          className={armed ? 'skill-flow__slip skill-flow__slip--armed' : 'skill-flow__slip'}
          key={`${submission.id}-${run}`}
        >
          <li className="skill-flow__step skill-flow__step--upload">
            <div className="skill-flow__head">
              <h3>
                <span aria-hidden="true">一</span>
                上传 Skill 包
              </h3>
              <p>提交一个待发布的 Skill。</p>
            </div>
            <div className="skill-flow__stage">
              <div className="skill-flow__slot">
                <span className="skill-flow__package">
                  <SkillPackageIcon />
                  <span>
                    <strong>{submission.name}</strong>
                    <small>{submission.version}</small>
                  </span>
                  <span className="skill-flow__cursor">
                    <CursorIcon />
                  </span>
                </span>
              </div>
              <p className="skill-flow__note">
                {submission.team} {submission.submitter}，{submission.date}提交
              </p>
            </div>
          </li>
          <li className="skill-flow__step skill-flow__step--inspect">
            <div className="skill-flow__head">
              <h3>
                <span aria-hidden="true">二</span>
                发布前检查
              </h3>
              <p>
                <Phrases text="格式、质量、安全三道检查一次完成，列出问题清单。" />
              </p>
            </div>
            <div className="skill-flow__stage">
              <div className="skill-flow__checks">
                <span className="skill-flow__scan" aria-hidden="true" />
                <dl>
                  {submission.checks.map((check) => (
                    <div key={check.label}>
                      <dt>{check.label}</dt>
                      <dd
                        className={
                          check.tone ? `skill-flow__tone skill-flow__tone--${check.tone}` : undefined
                        }
                      >
                        {check.result}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </li>
          <li className="skill-flow__step skill-flow__step--verdict">
            <div className="skill-flow__head">
              <h3>
                <span aria-hidden="true">三</span>
                按结论决定是否公开
              </h3>
              <p>给出通过、需复核或拒绝的结论。</p>
            </div>
            <div className="skill-flow__stage">
              <span className={`skill-flow__stamp skill-flow__stamp--${submission.verdict}`}>
                {skillVerdicts[submission.verdict]}
              </span>
            </div>
          </li>
          <li
            className={
              released
                ? 'skill-flow__step skill-flow__step--release'
                : 'skill-flow__step skill-flow__step--release skill-flow__step--held'
            }
          >
            <div className="skill-flow__head">
              <h3>
                <span aria-hidden="true">四</span>
                按版本分发
              </h3>
              <p>
                <Phrases text="同事按版本安装，发出去的版本不能再改。" />
              </p>
            </div>
            <div className="skill-flow__stage">
              {released && (
                <div
                  className={
                    submission.previousVersion
                      ? 'skill-flow__versions'
                      : 'skill-flow__versions skill-flow__versions--single'
                  }
                >
                  {submission.previousVersion && (
                    <span className="skill-flow__version skill-flow__version--previous">
                      {submission.previousVersion}
                      <small aria-hidden="true">最新</small>
                    </span>
                  )}
                  <span
                    className={`skill-flow__version skill-flow__version--current skill-flow__version--${submission.verdict}`}
                  >
                    {submission.version}
                    <small>{submission.verdict === 'pass' ? '最新' : skillVerdicts.review}</small>
                  </span>
                </div>
              )}
              <p className="skill-flow__outcome">
                <Phrases text={submission.outcome} />
              </p>
            </div>
          </li>
        </ol>
        <figcaption>界面示意，送审内容为虚构示例。</figcaption>
      </figure>
      <p className="visually-hidden" aria-live="polite">
        {`${submission.name} ${submission.version}，结论：${skillVerdicts[submission.verdict]}。${submission.outcome}`}
      </p>
    </div>
  )
}

function SkillNavigatorPage({ product }) {
  const consultHref = `mailto:${BRAND.email}?subject=${encodeURIComponent(`${product.name} 方案咨询`)}`
  const claim = PRODUCTS.skill.line.replace(/，/g, '，\n').split('\n')

  return (
    <main className="skill-page">
      <section className="skill-hero" aria-labelledby="skill-hero-title">
        <ScrollReveal as="p" className="skill-hero__product">
          <strong>{product.name}</strong>
          <span>{PRODUCTS.skill.kind}</span>
        </ScrollReveal>
        <div className="skill-hero__lead">
          <ScrollReveal as="h1" className="skill-hero__claim" id="skill-hero-title" delay={80}>
            {claim.map((phrase) => (
              <span key={phrase}>{phrase}</span>
            ))}
          </ScrollReveal>
          <ScrollReveal className="skill-hero__aside" delay={160}>
            <p>
              <span>发给全组织之前，先过这一道检查。</span>
              <span>结论决定它能不能被同事找到。</span>
            </p>
            <a className="action-button" href={consultHref}>
              预约方案沟通
            </a>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={240} revealEarly>
          <SkillScreens />
        </ScrollReveal>
      </section>

      <section className="skill-process" aria-labelledby="skill-process-title">
        <div className="skill-process__inner">
          <ScrollReveal className="page-intro" revealEarly>
            <h2 id="skill-process-title">
              从一个 Skill 包，
              <span>到一项可用能力。</span>
            </h2>
            <p>
              <Phrases text="每一份送审都走这四步，同事能找到的，都是检查过的版本。" />
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120} revealEarly>
            <SkillFlow />
          </ScrollReveal>
        </div>
      </section>

      <section className="page-section skill-facts" aria-labelledby="skill-facts-title">
        <ScrollReveal className="page-intro" revealEarly>
          <h2 id="skill-facts-title">
            检查这件事本身，
            <span>也守着企业的边界。</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal as="ul" className="skill-facts__list" delay={120} revealEarly>
          {skillInspectionFacts.map((fact) => (
            <li key={fact.title}>
              <h3>{fact.title}</h3>
              <p>
                <Phrases text={fact.text} />
              </p>
            </li>
          ))}
        </ScrollReveal>
      </section>

      <ContactBand
        title="让每一次能力发布，"
        titleTail="都有据可查。"
        text={`从一个真实场景开始，和 ${BRAND.name} 团队一起讨论适合企业的 AI 能力方案。`}
        consultHref={consultHref}
      />
    </main>
  )
}

function ProductDetailPage({ product }) {
  const detail = productDetails[product.type]

  return (
    <main className={`product-page product-page--${product.type}`}>
      <section className="product-page-hero">
        <div className="product-page-hero__inner">
          <div className="product-page-hero__grid">
            <div className="product-page-hero__copy">
              <SectionLabel>{product.category}</SectionLabel>
              <h1>
                {detail.headline}
                <span>{detail.highlight}</span>
              </h1>
              <p>{detail.intro}</p>
            </div>
            <div className="product-page-hero__visual">
              <ProductPreview type={product.type} variant="hero" />
            </div>
          </div>
          <div className="product-page-notes">
            {detail.notes.map(([title, text], index) => (
              <div key={title}>
                <span>0{index + 1}</span>
                <div className="product-page-note__main">
                  <div className="product-page-note__copy">
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-detail-capabilities" id="product-capabilities">
        <div className="product-detail-capabilities__head">
          <h2>
            让 {product.name} 成为
            <span>企业私有 AI 的一块基石。</span>
          </h2>
        </div>
        <div className="product-detail-capability-grid">
          {detail.capabilities.map((capability) => (
            <article key={capability.number}>
              <span>{capability.number}</span>
              <h3>{capability.title}</h3>
              <p>{capability.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="product-workflow">
        <div className="product-workflow__intro">
          <h2>
            从第一份资料，
            <span>到第一项可用能力。</span>
          </h2>
        </div>
        <ol>
          {detail.steps.map((step, index) => (
            <li key={step}>
              <span>0{index + 1}</span>
              <strong>{step}</strong>
              {index < detail.steps.length - 1 && <i>→</i>}
            </li>
          ))}
        </ol>
      </section>

      <section className="product-page-cta">
        <p>{product.name.toUpperCase()} FOR PRIVATE AI</p>
        <h2>从一个真实场景，开始您的企业 AI 路径。</h2>
        <a
          className="button button--dark"
          href={`mailto:${BRAND.email}?subject=${encodeURIComponent(`${product.name} 产品咨询`)}`}
        >
          与 {BRAND.name} 团队沟通
          <Arrow />
        </a>
      </section>
    </main>
  )
}

function DocsPage() {
  return (
    <main className="docs-page">
      <section className="docs-hero">
        <h1>
          从了解产品，
          <span>到构建企业 AI 能力。</span>
        </h1>
        <p>这里整理了 KnowVeil 的产品说明、部署准备与使用方法，帮助您的团队更快开始。</p>
        <div className="docs-search" aria-label="文档搜索提示">
          <span>⌕</span>
          搜索文档主题
          <kbd>⌘ K</kbd>
        </div>
      </section>

      <section className="docs-index">
        <div className="docs-index__intro">
          <h2>从最需要的内容开始。</h2>
        </div>
        <div className="docs-grid">
          {documentGroups.map((group) => (
            <article key={group.label}>
              <p>{group.label}</p>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>
                    <a href={`mailto:${BRAND.email}?subject=KnowVeil%20文档咨询`}>
                      {item}
                      <Arrow size={14} />
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="docs-help">
        <div>
          <h2>找不到需要的内容？</h2>
        </div>
        <a className="button button--dark" href={`mailto:${BRAND.email}?subject=KnowVeil%20文档咨询`}>
          联系我们
          <Arrow />
        </a>
      </section>
    </main>
  )
}

function SiteFooter({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Brand navigate={navigate} />
        <p>{BRAND.tagline}</p>
      </div>
      <div className="footer-bottom">
        <nav className="footer-nav" aria-label="页脚导航">
          <AppLink to="/" navigate={navigate}>首页</AppLink>
          {productCards.map((product) => (
            <AppLink to={product.route} navigate={navigate} key={product.type}>
              {product.name}
            </AppLink>
          ))}
          <AppLink to="/docs" navigate={navigate}>文档</AppLink>
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        </nav>
        <small>
          © {new Date().getFullYear()} {BRAND.name}
        </small>
      </div>
    </footer>
  )
}

function App() {
  const { path, navigate } = useAppRoute()
  const product = productCards.find((item) => item.route === path)

  let page = <HomePage navigate={navigate} />

  if (product?.type === 'skill') {
    page = <SkillNavigatorPage product={product} />
  } else if (product) {
    page = <ProductDetailPage product={product} />
  } else if (path === '/docs') {
    page = <DocsPage />
  }

  return (
    <div className="site">
      <SiteHeader path={path} navigate={navigate} />
      {page}
      <SiteFooter navigate={navigate} />
    </div>
  )
}

export default App
