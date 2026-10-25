import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { BRAND, PRODUCTS } from './brand'

import HeroParticles from './HeroParticles'
import ScrollReveal from './ScrollReveal'

const productCards = [
  {
    index: '01',
    name: PRODUCTS.skill.name,
    category: PRODUCTS.skill.kind,
    title: '让 AI 产出的能力，可被组织信任。',
    description:
      '能力在进入组织之前先过一道检查：不运行其中任何代码，只看内容，给出风险与质量结论；没过关的不会出现在公开列表里。',
    features: ['发布前先检查', '发出去的版本改不了', '不过关就不公开'],
    type: 'skill',
    route: '/products/skillnavigator',
  },
  {
    index: '02',
    name: PRODUCTS.knode.name,
    category: PRODUCTS.knode.kind,
    title: '让 AI 读得到你的知识，而知识不出你的边界。',
    description:
      '企业的知识集中放在自己的机器上，不在我们的云里：看得见、改得动、带得走。AI 用到了哪一份、答得对不对，你随时能核对。',
    features: ['打开就能看，不藏在黑箱里', '答案能回到原文那一段', '换 AI 不用搬数据'],
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
    heroSlides: [
      {
        id: 'home',
        src: '/images/products/skillnavigator-hero.webp',
        alt: 'SkillNavigator 首页示例图',
      },
      {
        id: 'skills',
        src: '/images/products/skills-marketplace.webp',
        alt: 'SkillNavigator Skills 示例图',
        copy: {
          headline: '让合适的 Skill，',
          highlight: '在需要时被找到。',
          intro:
            '按领域、名称、发布者或使用场景浏览已发布的 Skill；评分、下载量和安全状态集中呈现，复用前先看清楚。',
        },
      },
      {
        id: 'creators',
        src: '/images/products/creators.webp',
        alt: 'SkillNavigator 创作者示例图',
        copy: {
          headline: '让每一份 Skill，',
          highlight: '都有来处可查。',
          intro:
            '发布者的代表 Skill、发布数量和下载表现集中呈现。认识贡献者，也能了解一份能力从谁而来。',
        },
      },
      {
        id: 'leaderboard',
        src: '/images/products/leaderboard.webp',
        alt: 'SkillNavigator 榜单示例图',
        copy: {
          headline: '让 Skill 的表现，',
          highlight: '一目了然。',
          intro:
            '按下载次数、用户评分或最近更新时间排序。把热度、反馈与活跃度放在同一处，选择更有依据。',
        },
      },
      {
        id: 'inspections',
        src: '/images/products/inspections.webp',
        alt: 'SkillNavigator 审查中心示例图',
        copy: {
          headline: '让每一次发布，',
          highlight: '都有依据可查。',
          intro:
            '汇总每个 Skill 最新版本的发布时间、安全与质量评分；按需要排序并导出，最新发布状态随时可核对。',
        },
      },
    ],
  },
  knode: {
    heroSrc: '', // '/images/products/knode-hero.webp'
    cardSrc: '', // '/images/products/knode-card.webp'
    alt: 'Knode 产品界面截图',
    heroFile: 'public/images/products/knode-hero.webp',
    cardFile: 'public/images/products/knode-card.webp',
  },
}

/** 与 .product-preview__carousel-slide 的 transform 过渡一致 */
const SKILL_HERO_CAROUSEL_TRANSITION_MS = 360
const SKILL_HERO_COPY_SWAP_MS = SKILL_HERO_CAROUSEL_TRANSITION_MS / 2

const productDetails = {
  skill: {
    headline: '让 AI 产出的能力，',
    highlight: '可被组织信任。',
    intro:
      'SkillNavigator 是 AI 能力的准入平台。能力在发布时接受一次检查——不会在你的环境里运行，给出风险与质量结论，结论决定它能不能被公开检索到。检查这件事本身，也不会把你的东西带出边界。',
    capabilities: [
      {
        number: '01',
        title: '发布前审查，而不是上传即上架',
        text: '格式、质量与安全多道检查一次完成，给出具体问题清单与结论，而不只是一句「通过」。',
        sketch: 'inspection',
      },
      {
        number: '02',
        title: '结论决定能不能被看到',
        text: '有高危安全风险的能力直接拒绝；被拒绝、审查中、审查中断的 Skill，一律不出现在公开检索结果里。',
        sketch: 'visibility',
      },
      {
        number: '03',
        title: '发出去之后不能偷改',
        text: '一个版本发布出去就是那一份；要改只能发新版本，每个版本的修改内容始终清楚。',
        sketch: 'version',
      },
    ],
    steps: ['上传能力包', '发布前检查', '按结论决定是否公开', '按版本分发'],
    notes: [
      ['检查不运行代码', '只看不跑，不碰你的环境'],
      ['不依赖外部模型', '可以完全离线，唯一的外部查毒可关'],
      ['不过关就不公开', '闸门在平台一侧'],
    ],
  },
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

const journey = [
  {
    number: '01',
    title: '存',
    text: '把知识整理进自己的目录，放在自己的机器上',
  },
  {
    number: '02',
    title: '取',
    text: 'AI 来读它该读的部分，不是把整库倒进去',
  },
  {
    number: '03',
    title: '用',
    text: '推理发生在你选的那款 AI 里，数据不跟着走',
  },
  {
    number: '04',
    title: '鉴',
    text: '把验证过的做法做成能力，检查过再发给全组织',
  },
]

const privatePoints = [
  {
    number: '01',
    title: '东西在你自己的机器上',
    text: '知识就放在你的电脑或服务器里；断网也能用，也不存在「停用之后取不回来」。',
  },
  {
    number: '02',
    title: '不绑定任何一家 AI',
    text: '换客户端不用迁移数据，换模型不用重做知识。工具的寿命，不该决定知识资产的寿命。',
  },
  {
    number: '03',
    title: '信任来自可以核对，不是来自承诺',
    text: '能力检查不会运行对方的程序，也不会把它放进你的环境；不过关的能力不会出现在公开列表里。',
  },
]

const sharedPoints = [
  {
    number: '01',
    title: '看得见',
    text: '一次回答用到了哪几份资料，列出来给你看。不满意的部分，你知道该去改哪里。',
  },
  {
    number: '02',
    title: '改得动',
    text: '发现写错了，直接改；下一次提问用的就是新内容，不用等同步、不用重新导入。',
  },
  {
    number: '03',
    title: '查得准',
    text: '每个结论都能带出处，精确到原文的哪一节。要核对，点回去看原文。',
  },
]

const aiClients = [
  {
    label: '市面上的 AI 客户端',
    items: ['CodeBuddy', 'WorkBuddy', 'Cursor', 'Claude'],
  },
  {
    label: '企业自己部署的 AI',
    items: ['内部 AI 助手', '自建模型网关', '私有化 AI 平台'],
  },
]

const aiToolCards = [
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
  { name: '你的企业 AI 客户端', enterprise: true },
]

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

function CarouselArrow({ direction }) {
  const isPrevious = direction === 'previous'

  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={isPrevious ? 'm14 5-7 7 7 7' : 'm10 5 7 7-7 7'} />
    </svg>
  )
}

function LucideBarChart3({ size = 14 }) {
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
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
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

function ProductPreview({ type, variant = 'card', onSlideChange }) {
  const preview = productPreviewImages[type]
  const src = variant === 'hero' ? preview.heroSrc : preview.cardSrc
  const resolvedSrc = publicAsset(src)
  const fileHint = variant === 'hero' ? preview.heroFile : preview.cardFile
  const [loadError, setLoadError] = useState(false)

  if (variant === 'hero' && preview.heroSlides?.length > 1) {
    return (
      <ProductPreviewCarousel
        type={type}
        slides={preview.heroSlides}
        onSlideChange={onSlideChange}
      />
    )
  }

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

  if (src && loadError) {
    return <ProductSketch type={type} />
  }

  return <ProductSketch type={type} />
}

function ProductPreviewCarousel({ type, slides: configuredSlides, onSlideChange }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [unavailableSources, setUnavailableSources] = useState([])
  const [loadedSources, setLoadedSources] = useState(() => new Set())
  const slides = configuredSlides.filter(
    (slide) =>
      slide.kind === 'sketch' || (slide.src && !unavailableSources.includes(slide.src)),
  )
  const slideCount = slides.length

  if (!slideCount) {
    return <ProductSketch type={type} />
  }

  const currentIndex = Math.min(activeIndex, slideCount - 1)
  const stackedSlides = slides
    .map((slide, index) => {
      const forwardDepth = (index - currentIndex + slideCount) % slideCount
      const isPrevious = slideCount > 2 && forwardDepth === slideCount - 1

      return {
        slide,
        depth: isPrevious ? -1 : forwardDepth,
        isPrevious,
      }
    })
    .filter(({ depth }) => depth === -1 || depth < 3)
  const activeSrc = slides[currentIndex]?.src
  const foregroundReady = !activeSrc || loadedSources.has(activeSrc)
  const visibleStackedSlides = stackedSlides.filter(
    ({ depth }) => depth === 0 || foregroundReady,
  )
  const changeSlide = (direction) => {
    const nextIndex = (currentIndex + direction + slideCount) % slideCount
    setActiveIndex(nextIndex)
    onSlideChange?.(slides[nextIndex])
  }

  const markSlideLoaded = (src) => {
    if (!src) {
      return
    }

    setLoadedSources((sources) => {
      if (sources.has(src)) {
        return sources
      }

      const next = new Set(sources)
      next.add(src)
      return next
    })
  }

  const handleImageError = (src) => {
    const fallbackSlide = configuredSlides.find(
      (slide) =>
        slide.kind === 'sketch' ||
        (slide.src && slide.src !== src && !unavailableSources.includes(slide.src)),
    )
    setUnavailableSources((sources) =>
      sources.includes(src) ? sources : [...sources, src],
    )
    setActiveIndex(0)
    if (fallbackSlide) {
      onSlideChange?.(fallbackSlide)
    }
  }

  return (
    <div className={`product-page-hero__gallery product-page-hero__gallery--${type}`}>
      <div className="product-page-hero__visual">
        <figure
          className={`product-preview product-preview--${type} product-preview--hero product-preview--carousel`}
          aria-label={`${type === 'skill' ? 'SkillNavigator' : '产品'} 示例图轮播`}
          aria-roledescription="carousel"
        >
          <div className="product-preview__carousel-stage">
            {visibleStackedSlides.map(({ slide, depth, isPrevious }) => {
              const isActive = depth === 0

              return (
                <div
                  className={`product-preview__carousel-slide ${
                    isPrevious
                      ? 'product-preview__carousel-slide--previous'
                      : `product-preview__carousel-slide--depth-${depth}`
                  }`}
                  key={slide.src || slide.kind}
                  aria-hidden={isActive ? undefined : true}
                >
                  {slide.kind === 'sketch' ? (
                    <div
                      className="product-preview__carousel-sketch"
                      role={isActive ? 'img' : undefined}
                      aria-label={isActive ? slide.alt : undefined}
                    >
                      <ProductSketch type={type} />
                    </div>
                  ) : (
                    <img
                      className="product-preview__image product-preview__image--carousel"
                      ref={(node) => {
                        if (node?.complete && node.naturalWidth > 0) {
                          markSlideLoaded(slide.src)
                        }
                      }}
                      src={publicAsset(slide.src)}
                      alt={isActive ? slide.alt : ''}
                      loading={isActive ? 'eager' : 'lazy'}
                      decoding="async"
                      onLoad={() => markSlideLoaded(slide.src)}
                      onError={() => handleImageError(slide.src)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </figure>
      </div>
      <div className="product-preview__carousel-controls">
        <button
          className="product-preview__carousel-control"
          type="button"
          onClick={() => changeSlide(-1)}
          aria-label="查看上一张示例图"
        >
          <CarouselArrow direction="previous" />
        </button>
        <button
          className="product-preview__carousel-control"
          type="button"
          onClick={() => changeSlide(1)}
          aria-label="查看下一张示例图"
        >
          <CarouselArrow direction="next" />
        </button>
      </div>
    </div>
  )
}

function SkillCapabilitySketch({ variant }) {
  if (variant === 'visibility') {
    return (
      <div className="capability-sketch capability-sketch--visibility" aria-hidden="true">
        <div className="capability-sketch__bar">
          <b>Skill 广场</b>
        </div>
        <div className="capability-sketch__body">
          <div className="capability-sketch__search">⌕ 搜索已发布的Skill</div>
          <div className="capability-sketch__market">
            <div className="capability-sketch__market-item capability-sketch__market-item--live">
              <div className="capability-sketch__market-copy">
                <strong>经营日报</strong>
                <span className="capability-sketch__market-visibility">其他成员可在 Skill 广场检索到</span>
              </div>
              <small className="capability-sketch__market-badge capability-sketch__market-badge--live">
                已发布
              </small>
            </div>
            <div className="capability-sketch__market-item capability-sketch__market-item--pending">
              <div className="capability-sketch__market-copy">
                <strong>方案生成</strong>
                <span className="capability-sketch__market-visibility">审查完成前，其他人检索不到</span>
              </div>
              <small className="capability-sketch__market-badge capability-sketch__market-badge--review">
                审查中
              </small>
            </div>
            <div className="capability-sketch__market-item capability-sketch__market-item--hidden">
              <div className="capability-sketch__market-copy">
                <strong>合同审查</strong>
                <span className="capability-sketch__market-visibility">未通过审查，不在公开检索结果中</span>
              </div>
              <small className="capability-sketch__market-badge capability-sketch__market-badge--hidden">
                已拒绝
              </small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'version') {
    return (
      <div className="capability-sketch capability-sketch--version" aria-hidden="true">
        <div className="capability-sketch__bar">
          <b>版本历史</b>
        </div>
        <div className="capability-sketch__body">
          <div className="capability-sketch__version-head">
            <strong>售后助手 Skill</strong>
            <div className="capability-sketch__verdict capability-sketch__verdict--head">
              <strong>当前 v1.2</strong>
            </div>
          </div>
          <ul className="capability-sketch__timeline">
            <li>
              <em>v1.2</em>
              <div>
                <strong>优化处理流程</strong>
                <small>2026-04-02 · 96/100 · 0 项安全风险</small>
              </div>
              <div className="capability-sketch__timeline-badges">
                <i className="capability-sketch__timeline-latest">最新</i>
                <small className="capability-sketch__market-badge capability-sketch__market-badge--live">
                  已发布
                </small>
              </div>
            </li>
            <li>
              <em>v1.1</em>
              <div>
                <strong>修复已知安全风险</strong>
                <small>2026-03-12 · 86/100 · 0 项安全风险</small>
              </div>
              <small className="capability-sketch__market-badge capability-sketch__market-badge--pending">
                需复核
              </small>
            </li>
            <li>
              <em>v1.0</em>
              <div>
                <strong>初次发布</strong>
                <small>2026-02-08 · 86/100 · 2 项安全风险</small>
              </div>
              <small className="capability-sketch__market-badge capability-sketch__market-badge--hidden">
                已拒绝
              </small>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="capability-sketch capability-sketch--inspection" aria-hidden="true">
      <div className="capability-sketch__bar">
        <b>发布前审查</b>
      </div>
      <div className="capability-sketch__body">
        <div className="capability-sketch__file">
          <span className="capability-sketch__file-icon" aria-hidden="true">
            <LucideBarChart3 size={12} />
          </span>
          <div>
            <strong>contract-review-skill</strong>
            <small>上传完成 · 仅静态扫描，不运行代码</small>
          </div>
        </div>
        <div className="capability-sketch__review-stack">
          <ul className="capability-sketch__checks">
            <li className="capability-sketch__checks-ok">
              <strong>格式</strong>
              <em>通过</em>
            </li>
            <li className="capability-sketch__checks-ok">
              <strong>质量</strong>
              <em>86/100</em>
            </li>
            <li className="capability-sketch__checks-warn">
              <strong>安全</strong>
              <em>2 项安全风险</em>
            </li>
          </ul>
          <div className="capability-sketch__verdict">
            <strong>结论：需修改后发布</strong>
            <p>问题清单已列出，处理后可再次提交</p>
          </div>
        </div>
      </div>
    </div>
  )
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
      <div className="sketch-bar">
        <span />
        <span />
        <span />
        <b>Knode / 企业知识空间</b>
        <i />
      </div>
      <div className="knode-sketch-body">
        <aside className="knode-tree">
          <small>知识目录</small>
          <span className="tree-active">▣ 项目交付</span>
          <span>▣ 产品资料</span>
          <span>▣ 技术规范</span>
          <span>▣ 运营制度</span>
        </aside>
        <div className="knode-answer">
          <div className="sketch-search">⌕ 如何缩短项目交付周期？</div>
          <article>
            <p>
              <i>✦</i>
              已从 16 份企业资料中找到答案
            </p>
            <strong>
              建议按「需求确认 — 方案评审 — 里程碑复盘」建立三段式协同机制……
            </strong>
            <div>
              <span>交付手册 V3.2</span>
              <span>项目复盘 / 2025</span>
            </div>
          </article>
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

function ProductCard({ product, navigate, revealDelay = 0 }) {
  return (
    <ScrollReveal
      as="article"
      className={`product-card product-card--${product.type}`}
      delay={revealDelay}
      revealEarly
    >
      <div className="product-card__top">
        <span>{product.index}</span>
        <p>{product.category}</p>
      </div>
      <div className="product-card__copy">
        <h3>{product.name}</h3>
        <h4>{product.title}</h4>
        <p>{product.description}</p>
      </div>
      <ul>
        {product.features.map((feature) => (
          <li key={feature}>
            <span>+</span>
            {feature}
          </li>
        ))}
      </ul>
      <AppLink className="product-link" to={product.route} navigate={navigate}>
        了解 {product.name}
        <Arrow size={16} />
      </AppLink>
      <ProductPreview type={product.type} variant="card" />
    </ScrollReveal>
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
                <span>{product.index}</span>
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

  useEffect(() => {
    const updateScrollHint = () => {
      setScrollHintVisible(window.scrollY < 64)
    }

    updateScrollHint()
    window.addEventListener('scroll', updateScrollHint, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollHint)
  }, [])

  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-cross hero-cross--one" />
        <div className="hero-cross hero-cross--two" />
        <HeroParticles />
        <div className="hero-content">
          <SectionLabel>SCALE UP KNOWLEDGE THROUGH USE</SectionLabel>
          <HeroTitle />
          <p className="hero-copy">
            知识不出企业的门，资产越用越厚。
          </p>
          <div className="hero-actions">
            <a className="button button--dark" href="#contact">
              探索您的 AI 路径
              <Arrow />
            </a>
            <a className="text-action" href="#products">
              查看产品
              <span>↓</span>
            </a>
          </div>
        </div>
        <a
          className={
            scrollHintVisible
              ? 'hero-scroll-hint'
              : 'hero-scroll-hint hero-scroll-hint--hidden'
          }
          href="#capabilities"
        >
          向下探索
          <span className="hero-scroll-hint__icon">
            <ChevronDown />
          </span>
        </a>
      </section>

      <section className="manifesto" id="capabilities">
        <ScrollReveal className="manifesto-heading" revealEarly>
          <SectionLabel>THE KNOWVEIL WAY</SectionLabel>
          <h2>
            为企业提供在<span className="manifesto-em">私有化环境</span>下
            <br />
            高效<span className="manifesto-em">沉淀</span>和
            <span className="manifesto-em">使用</span>知识资产的专业工具
            <br />
            探索业务管理与实践的更多可能。
          </h2>
        </ScrollReveal>
        <ScrollReveal className="manifesto-side" delay={180}>
          <p>
            模型会换、会过期。KnowVeil 经营的是两样不会过期的东西：企业知道什么，以及企业会做什么。
          </p>
          <a className="text-action text-action--line" href="#private-ai">
            了解私有化部署
            <Arrow size={15} />
          </a>
        </ScrollReveal>
        <div className="asset-strip">
          <ScrollReveal delay={0}>
            <span>01</span>
            <strong>私有知识</strong>
            <p>放在自己机器上的底账，随时翻得到</p>
          </ScrollReveal>
          <ScrollReveal delay={90}>
            <span>02</span>
            <strong>AI 能力</strong>
            <p>经审查再分发，版本不可变</p>
          </ScrollReveal>
          <ScrollReveal delay={180}>
            <span>03</span>
            <strong>组织资产</strong>
            <p>模型换代，这两样都还在</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="shared-section" id="same-source">
        <div className="shared-intro">
          <ScrollReveal className="shared-intro__heading" revealEarly>
            <SectionLabel>CHECK IT YOURSELF</SectionLabel>
            <h2>
              AI 答得对不对，
              <span>你随时能查。</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal as="p" delay={120}>
            大多数知识库只给你一个答案，不告诉你它依据什么。Knode 把依据一并交出来：用了哪几份资料、出自原文哪里，由你自己判断。
          </ScrollReveal>
        </div>
        <div className="shared-list">
          {sharedPoints.map((point, index) => (
            <ScrollReveal as="article" delay={180 + index * 70} key={point.number}>
              <span>{point.number}</span>
              <div>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            </ScrollReveal>
          ))}
          <ScrollReveal as="p" className="shared-note" delay={180}>
            取舍也说清楚：如果只是要「大概那个意思也能搜到」，那不是我们擅长的方向。我们要的是「这一条到底对不对」——在需要担责的场景里，后者更值钱。
          </ScrollReveal>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-head">
          <ScrollReveal className="section-head__title" revealEarly>
            <SectionLabel>PRODUCTS</SectionLabel>
            <h2>两个产品，一套企业私有 AI 的底座。</h2>
          </ScrollReveal>
          <ScrollReveal as="p" delay={120}>一个让知识进得来、出不去；一个让能力出得去、回得来。</ScrollReveal>
        </div>
        <div className="product-grid">
          {productCards.map((product, index) => (
            <ProductCard
              product={product}
              navigate={navigate}
              revealDelay={180 + index * 110}
              key={product.name}
            />
          ))}
        </div>
      </section>

      <section className="journey-section">
        <div className="journey-intro">
          <ScrollReveal className="journey-intro__heading" revealEarly>
            <SectionLabel>USE MAKES IT GROW</SectionLabel>
            <h2>
              每一次使用，
              <span>都在加厚这份资产。</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal as="p" delay={120}>
            存、取、用、鉴是一个循环：用得越多，知识越厚；知识越厚，AI 越好用。而这个循环，发生在你自己的边界内。
          </ScrollReveal>
        </div>
        <ol className="journey-list">
          {journey.map((item, index) => (
            <ScrollReveal as="li" delay={180 + index * 70} key={item.number}>
              <span>{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </ol>
        <ScrollReveal className="journey-footer">
          <span>YOUR DATA</span>
          <i />
          <span>YOUR KNOWLEDGE</span>
          <i />
          <span>YOUR AI</span>
        </ScrollReveal>
      </section>

      <section className="ai-tools-wall" aria-labelledby="ai-tools-heading">
        <ScrollReveal className="ai-tools-wall__heading" revealEarly>
          <h2 id="ai-tools-heading">
            用你已经在用的 AI 工具，
            <span>接入企业自己的知识。</span>
          </h2>
        </ScrollReveal>
        <div className="ai-tools-wall__grid">
          {aiToolCards.map((tool, index) => (
            <ScrollReveal
              as="article"
              className={tool.enterprise ? 'ai-tool-card ai-tool-card--enterprise' : 'ai-tool-card'}
              delay={140 + (index % 4) * 60}
              key={tool.name}
            >
              {tool.enterprise ? (
                <span className="ai-tool-card__logo ai-tool-card__logo--enterprise" aria-hidden="true">
                  +
                </span>
              ) : (
                <span className="ai-tool-card__logo" aria-hidden="true">
                  <img
                    src={publicAsset(`/images/ai-clients/${tool.logo}`)}
                    alt=""
                    width="48"
                    height="48"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              )}
              <span className="ai-tool-card__name">{tool.name}</span>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="client-band" id="clients">
        <div className="client-band__intro">
          <ScrollReveal revealEarly>
            <SectionLabel>YOUR AI, NOT OURS</SectionLabel>
            <h2>
              不管是哪一款 AI，
              <span>知识都不用搬家。</span>
            </h2>
          </ScrollReveal>
        </div>
        <div className="client-band__body">
          {aiClients.map((group, index) => (
            <ScrollReveal className="client-group" delay={180 + index * 90} key={group.label}>
              <p className="client-group__label">{group.label}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
          <ScrollReveal as="p" delay={180}>
            接入方式遵循通用的开放标准，所以新出的客户端、或者企业自己搭的 AI，都不必等我们做适配。工具的寿命，不该决定知识资产的寿命。
          </ScrollReveal>
        </div>
      </section>

      <section className="private-section" id="private-ai">
        <div className="private-intro">
          <ScrollReveal className="private-intro__heading" revealEarly>
            <SectionLabel>PRIVATE BY DESIGN</SectionLabel>
            <h2>
              AI 的价值，
              <span>始于可控。</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal as="p" delay={120}>
            真实的企业 AI，不该以牺牲数据边界为代价。KnowVeil 让安全不是一个附加项，而是产品的形状本身。
          </ScrollReveal>
          <ScrollReveal className="private-seal" delay={180}>
            <BrandMark />
            <span>PRIVATE AI<br />FOR ENTERPRISE</span>
          </ScrollReveal>
        </div>
        <div className="private-list">
          {privatePoints.map((point, index) => (
            <ScrollReveal as="article" delay={180 + index * 70} key={point.number}>
              <span>{point.number}</span>
              <div>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-orbit contact-orbit--one" />
        <div className="contact-orbit contact-orbit--two" />
        <ScrollReveal revealEarly>
          <SectionLabel>START WITH ONE REAL SCENARIO</SectionLabel>
        </ScrollReveal>
        <ScrollReveal as="h2" delay={80} revealEarly>
          让下一次业务经验，
          <span>成为全组织的能力。</span>
        </ScrollReveal>
        <ScrollReveal as="p" delay={140}>
          从一个值得做的场景开始，一起构建企业自己的私有化 AI 路径。
        </ScrollReveal>
        <ScrollReveal
          as="a"
          className="button button--light"
          delay={200}
          href={`mailto:${BRAND.email}?subject=KnowVeil%20方案咨询`}
        >
          预约方案沟通
          <Arrow />
        </ScrollReveal>
        <ScrollReveal as="small" delay={260}>{BRAND.email}</ScrollReveal>
      </section>
    </main>
  )
}

function ProductDetailPage({ product }) {
  const detail = productDetails[product.type]
  const isSkillProduct = product.type === 'skill'
  const [activeSkillSlideId, setActiveSkillSlideId] = useState('home')
  const activeSkillSlide = productPreviewImages.skill.heroSlides.find(
    (slide) => slide.id === activeSkillSlideId,
  )
  const heroCopy =
    isSkillProduct && activeSkillSlide?.copy
      ? activeSkillSlide.copy
      : detail
  const [displayCopy, setDisplayCopy] = useState(detail)
  const [copyVisible, setCopyVisible] = useState(true)
  const skipSkillCopyFadeRef = useRef(true)
  const visibleCopy = isSkillProduct ? displayCopy : detail

  useEffect(() => {
    setActiveSkillSlideId('home')
    skipSkillCopyFadeRef.current = true
    setDisplayCopy(productDetails[product.type])
    setCopyVisible(true)
  }, [product.type])

  useEffect(() => {
    if (!isSkillProduct) {
      return undefined
    }

    if (skipSkillCopyFadeRef.current) {
      skipSkillCopyFadeRef.current = false
      setDisplayCopy(heroCopy)
      setCopyVisible(true)
      return undefined
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setDisplayCopy(heroCopy)
      setCopyVisible(true)
      return undefined
    }

    setCopyVisible(false)
    const timeoutId = window.setTimeout(() => {
      setDisplayCopy(heroCopy)
      window.requestAnimationFrame(() => {
        setCopyVisible(true)
      })
    }, SKILL_HERO_COPY_SWAP_MS)

    return () => window.clearTimeout(timeoutId)
  }, [activeSkillSlideId, heroCopy, isSkillProduct])

  return (
    <main className={`product-page product-page--${product.type}`}>
      <section className="product-page-hero">
        <div className="product-page-hero__inner">
          {product.type === 'skill' && (
            <div className="product-page-hero__product-header">
              <p className="product-page-hero__product-name">{product.name}</p>
              <div className="product-page-hero__product-kind">
                <SectionLabel>{product.category}</SectionLabel>
              </div>
            </div>
          )}
          <div className="product-page-hero__grid">
            <div
              className={`product-page-hero__copy${
                isSkillProduct ? ' product-page-hero__copy--synced' : ''
              }${isSkillProduct && copyVisible ? ' product-page-hero__copy--visible' : ''}`}
            >
              {!isSkillProduct && <SectionLabel>{product.category}</SectionLabel>}
              <h1>
                {visibleCopy.headline}
                <span>{visibleCopy.highlight}</span>
              </h1>
              <p>{visibleCopy.intro}</p>
              {isSkillProduct && (
                <p className="product-page-hero__copy-measure" aria-hidden="true">
                  {detail.intro}
                </p>
              )}
            </div>
            {isSkillProduct ? (
              <ProductPreview
                type={product.type}
                variant="hero"
                onSlideChange={(slide) => {
                  if (slide?.id) {
                    setActiveSkillSlideId(slide.id)
                  }
                }}
              />
            ) : (
              <div className="product-page-hero__visual">
                <ProductPreview type={product.type} variant="hero" />
              </div>
            )}
          </div>
          <div className="product-page-notes">
            {detail.notes.map(([title, text], index) => (
              <div key={title}>
                <span>0{index + 1}</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-detail-capabilities" id="product-capabilities">
        <div className="product-detail-capabilities__head">
          <SectionLabel>WHAT IT ENABLES</SectionLabel>
          <h2>
            让 {product.name} 成为
            <span>企业私有 AI 的一块基石。</span>
          </h2>
        </div>
        <div
          className={
            product.type === 'skill'
              ? 'product-detail-capability-grid product-detail-capability-grid--cards'
              : 'product-detail-capability-grid'
          }
        >
          {detail.capabilities.map((capability) =>
            product.type === 'skill' ? (
              <article key={capability.number} className="product-detail-capability-card">
                <div className="product-detail-capability-card__copy">
                  <span>{capability.number}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.text}</p>
                </div>
                <div
                  className={`product-detail-capability-card__media product-detail-capability-card__media--sketch product-detail-capability-card__media--${capability.sketch}`}
                >
                  <SkillCapabilitySketch variant={capability.sketch} />
                </div>
              </article>
            ) : (
              <article key={capability.number}>
                <span>{capability.number}</span>
                <h3>{capability.title}</h3>
                <p>{capability.text}</p>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="product-workflow">
        <div className="product-workflow__intro">
          <SectionLabel>HOW IT WORKS</SectionLabel>
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
        <a className="button button--dark" href={`mailto:${BRAND.email}?subject=KnowVeil%20产品咨询`}>
          与 KnowVeil 团队沟通
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
        <SectionLabel>KNOWVEIL DOCUMENTATION</SectionLabel>
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
          <SectionLabel>EXPLORE</SectionLabel>
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
          <SectionLabel>NEED HELP?</SectionLabel>
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
        <a href={`mailto:${BRAND.email}`}>
          {BRAND.email}
          <Arrow size={15} />
        </a>
      </div>
      <div className="footer-nav">
        <AppLink to="/" navigate={navigate}>首页</AppLink>
        <AppLink to={productCards[0].route} navigate={navigate}>产品</AppLink>
        <AppLink to="/docs" navigate={navigate}>文档</AppLink>
        <a href={`mailto:${BRAND.email}`}>联系我们</a>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {BRAND.name.toUpperCase()}. ALL RIGHTS RESERVED.
        </span>
        <span>PRIVATE AI · KNOWLEDGE ASSETS · HUMAN VALUE</span>
      </div>
    </footer>
  )
}

function App() {
  const { path, navigate } = useAppRoute()
  const product = productCards.find((item) => item.route === path)

  let page = <HomePage navigate={navigate} />

  if (product) {
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
