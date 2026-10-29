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
    steps: ['上传 Skill 包', '发布前检查', '按结论决定是否公开', '按版本分发'],
    workflowSteps: [
      {
        phase: '待检查',
        title: '上传 Skill 包',
        text: '提交一个待发布的 Skill。',
        icon: 'upload',
      },
      {
        phase: '形成结论',
        title: '发布前检查',
        text: '查看问题清单与检查结论。',
        icon: 'inspect',
      },
      {
        phase: '决定准入',
        title: '按结论决定是否公开',
        text: '结论决定它能否被公开检索。',
        icon: 'gate',
      },
      {
        phase: '组织可用',
        title: '按版本分发',
        text: '每个已发布版本都清楚可查。',
        icon: 'distribute',
      },
    ],
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

function SkillHeroNoteIcon({ variant, size = 34 }) {
  const iconSize = variant === 'offline' ? Math.min(size, 30) : size
  const svgProps = {
    'aria-hidden': true,
    width: iconSize,
    height: iconSize,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.55',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (variant === 'offline') {
    return (
      <svg {...svgProps}>
        <path d="M2.25 15C2.25 17.4853 4.26472 19.5 6.75 19.5H18C20.0711 19.5 21.75 17.8211 21.75 15.75C21.75 14.1479 20.7453 12.7805 19.3316 12.2433C19.4407 11.9324 19.5 11.5981 19.5 11.25C19.5 9.59315 18.1569 8.25 16.5 8.25C16.1767 8.25 15.8654 8.30113 15.5737 8.39575C14.9765 6.1526 12.9312 4.5 10.5 4.5C7.6005 4.5 5.25 6.85051 5.25 9.75C5.25 10.0832 5.28105 10.4092 5.3404 10.7252C3.54555 11.3167 2.25 13.0071 2.25 15Z" />
        <path d="m3 3 18 18" />
      </svg>
    )
  }

  if (variant === 'gate') {
    return (
      <svg {...svgProps}>
        <path d="M12 3 19 6v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6z" />
        <path d="m8.8 12 2.1 2.1 4.4-4.4" />
      </svg>
    )
  }

  return (
    <svg {...svgProps}>
      <path d="M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

function SkillWorkflowStepIcon({ variant, size = 25 }) {
  const svgProps = {
    'aria-hidden': true,
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.55',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (variant === 'upload') {
    return (
      <svg {...svgProps}>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4" />
        <path d="M12 17V9" />
        <path d="m9 12 3-3 3 3" />
      </svg>
    )
  }

  if (variant === 'inspect') {
    return (
      <svg {...svgProps}>
        <path d="M6 3h8l4 4v5" />
        <path d="M14 3v4h4" />
        <path d="M6 3v18h7" />
        <circle cx="13.5" cy="15.5" r="3.5" />
        <path d="m16 18 2.5 2.5" />
      </svg>
    )
  }

  if (variant === 'gate') {
    return (
      <svg {...svgProps}>
        <path d="M5 20V6h14v14" />
        <path d="M8 10h8" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    )
  }

  return (
    <svg {...svgProps}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="m7.7 7.1 3.1 8.1" />
      <path d="m16.1 8.2-2.9 6.8" />
      <path d="M8 6.2h8" />
    </svg>
  )
}

function SkillPackageIcon({ size = 17 }) {
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
      <path d="m9.5 8.95 2.5 1.55 2.5-1.55" />
    </svg>
  )
}

function WorkflowCursorIcon({ size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 3 13 8-5.7 1.5L10.8 19z" />
      <path d="m13 14 4.2 4.2" />
    </svg>
  )
}

function SkillWorkflowDemo({ variant }) {
  if (variant === 'upload') {
    return (
      <div className="skill-workflow-demo skill-workflow-demo--upload" aria-hidden="true">
        <span className="workflow-demo__upload-stage">
          <span className="workflow-demo__upload-compose">
            <span className="workflow-demo__upload-tray">
              <SkillWorkflowStepIcon variant="upload" size={19} />
            </span>
            <span className="workflow-demo__upload-review">
              <span className="workflow-demo__upload-review-track">
                <span className="workflow-demo__upload-review-fill" />
              </span>
              <span className="workflow-demo__upload-review-result">
                <span className="workflow-demo__upload-review-label">已提交审查</span>
                <span className="workflow-demo__upload-review-check">✓</span>
              </span>
            </span>
            <span className="workflow-demo__upload-drag">
              <span className="workflow-demo__upload-file">
                <SkillPackageIcon />
              </span>
              <span className="workflow-demo__upload-cursor">
                <WorkflowCursorIcon />
              </span>
            </span>
          </span>
        </span>
      </div>
    )
  }

  if (variant === 'inspect') {
    return (
      <div className="skill-workflow-demo skill-workflow-demo--inspect" aria-hidden="true">
        <span className="workflow-demo__inspection-skill">
          <SkillPackageIcon size={15} />
        </span>
        <div className="workflow-demo__inspection-stack">
          <span className="workflow-demo__scan-line" />
          <span className="workflow-demo__inspection-row workflow-demo__inspection-row--format">
            <span>格式</span>
            <span className="workflow-demo__inspection-mark">✓</span>
          </span>
          <span className="workflow-demo__inspection-row workflow-demo__inspection-row--quality">
            <span>质量</span>
            <span className="workflow-demo__inspection-mark">✓</span>
          </span>
          <span className="workflow-demo__inspection-row workflow-demo__inspection-row--security">
            <span>安全</span>
            <span className="workflow-demo__inspection-mark">✓</span>
          </span>
        </div>
        <span className="workflow-demo__inspection-result-wrap">
          <span className="workflow-demo__inspection-result">完成</span>
        </span>
      </div>
    )
  }

  if (variant === 'gate') {
    return (
      <div className="skill-workflow-demo skill-workflow-demo--gate" aria-hidden="true">
        <span className="workflow-demo__decision-stage">
          <span className="workflow-demo__decision-compose">
            <span className="workflow-demo__decision-source">
              <SkillPackageIcon size={15} />
            </span>
            <span className="workflow-demo__decision-track" />
            <span className="workflow-demo__decision-junction" />
            <svg
              className="workflow-demo__decision-branches"
              viewBox="0 0 30 90"
              preserveAspectRatio="none"
            >
              <path
                className="workflow-demo__decision-branch workflow-demo__decision-branch--block"
                d="M 0.5 45.5 H 5 C 13 45.5 14 20.5 30 20.5"
                pathLength="1"
              />
              <path
                className="workflow-demo__decision-branch workflow-demo__decision-branch--allow"
                d="M 0.5 45.5 H 5 C 13 45.5 14 69.5 30 69.5"
                pathLength="1"
              />
            </svg>
            <span className="workflow-demo__decision-outcomes">
              <span className="workflow-demo__decision-outcome workflow-demo__decision-outcome--block">
                <span className="workflow-demo__decision-signal">×</span>
                <span>有问题</span>
                <span className="workflow-demo__decision-result">不公开</span>
              </span>
              <span className="workflow-demo__decision-outcome workflow-demo__decision-outcome--allow">
                <span className="workflow-demo__decision-signal">✓</span>
                <span>无问题</span>
                <span className="workflow-demo__decision-result">公开</span>
              </span>
            </span>
          </span>
        </span>
      </div>
    )
  }

  return (
    <div className="skill-workflow-demo skill-workflow-demo--distribute" aria-hidden="true">
      <span className="workflow-demo__distribute-stage">
        <span className="workflow-demo__distribute-compose">
          <span className="workflow-demo__distribute-source">
            <SkillPackageIcon size={15} />
          </span>
          <span className="workflow-demo__distribute-source-track" />
          <span className="workflow-demo__version-stack">
            <span className="workflow-demo__version workflow-demo__version--previous">
              <span>v1.0</span>
              <small>最新</small>
            </span>
            <span className="workflow-demo__version workflow-demo__version--latest">
              <span>v2.0</span>
              <small>最新</small>
            </span>
          </span>
          <span className="workflow-demo__distribute-track" />
          <span className="workflow-demo__distribute-reconnect-track" />
          <span className="workflow-demo__distribution-target">
            <span className="workflow-demo__distribution-members">
              <i className="workflow-demo__distribution-member workflow-demo__distribution-member--one" />
              <i className="workflow-demo__distribution-member workflow-demo__distribution-member--two" />
              <i className="workflow-demo__distribution-member workflow-demo__distribution-member--three" />
            </span>
            <span className="workflow-demo__distribution-label">已发布</span>
          </span>
        </span>
      </span>
    </div>
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
          <ScrollReveal as="a" className="home-button" href={consultHref} delay={1300}>
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
        className="home-section home-products"
        id="products"
        aria-labelledby="home-products-title"
      >
        <ScrollReveal className="home-intro" revealEarly>
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
                <AppLink className="home-link" to={product.route} navigate={navigate}>
                  了解 {product.name}
                </AppLink>
                <ProductPreview type={type} variant="card" />
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      <section className="home-section home-verify" aria-labelledby="home-verify-title">
        <ScrollReveal className="home-intro" revealEarly>
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

      <section className="home-section home-loop" aria-labelledby="home-loop-title">
        <ScrollReveal className="home-intro" revealEarly>
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

      <section className="home-section home-clients" aria-labelledby="home-clients-title">
        <ScrollReveal className="home-intro" revealEarly>
          <h2 id="home-clients-title">
            不管是哪一款 AI，
            <span>知识都不用搬家。</span>
          </h2>
          <p>
            下面这些 AI 客户端可以直接接入，以及任何支持 MCP 的 AI 客户端。换工具，不用迁移知识。
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
            <span>
              <strong>你的企业 AI 客户端</strong>
              企业自己部署的 AI，也一样接得上
            </span>
          </ScrollReveal>
        </ul>
      </section>

      <section
        className="home-section home-boundary"
        id="private-ai"
        aria-labelledby="home-boundary-title"
      >
        <ScrollReveal className="home-boundary__layout" revealEarly>
          <div className="home-intro">
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

      <section className="home-contact" id="contact" aria-labelledby="home-contact-title">
        <span className="home-contact__ring home-contact__ring--inner" aria-hidden="true" />
        <span className="home-contact__ring home-contact__ring--outer" aria-hidden="true" />
        <ScrollReveal className="home-contact__intro" revealEarly>
          <h2 id="home-contact-title">
            让下一次业务经验，
            <span>成为全组织的能力。</span>
          </h2>
          <p>从一个值得做的场景开始，一起规划企业自己的私有 AI 路径。</p>
        </ScrollReveal>
        <ScrollReveal className="home-contact__actions" delay={120} revealEarly>
          <a className="home-button" href={consultHref}>
            预约方案沟通
          </a>
          <a className="home-link" href={`mailto:${BRAND.email}`}>
            {BRAND.email}
          </a>
        </ScrollReveal>
      </section>
    </main>
  )
}

function ProductDetailPage({ product }) {
  const detail = productDetails[product.type]
  const isSkillProduct = product.type === 'skill'
  const skillWorkflowSteps = isSkillProduct ? detail.workflowSteps : []
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
                <div className="product-page-note__main">
                  <div className="product-page-note__copy">
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                  {isSkillProduct && (
                    <span className="product-page-note__icon">
                      <SkillHeroNoteIcon
                        variant={['inspect', 'offline', 'gate'][index]}
                      />
                    </span>
                  )}
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

      <section
        className={
          isSkillProduct
            ? 'product-workflow product-workflow--skill'
            : 'product-workflow'
        }
      >
        {isSkillProduct ? (
          <div className="product-workflow__inner">
            <div className="product-workflow__top">
              <div className="product-workflow__intro">
                <h2>
                  从一个 Skill 包，
                  <span>到一项可用能力。</span>
                </h2>
                <p>每一次提交，都有一条看得见的发布路径。</p>
              </div>
            </div>

            <div className="skill-workflow">
              <ol className="skill-workflow__steps">
                {skillWorkflowSteps.map((step, index) => (
                  <li
                    className={`skill-workflow__step skill-workflow__step--${step.icon}`}
                    key={step.title}
                  >
                    <article className="skill-workflow__card">
                      <div className="skill-workflow__card-top">
                        <span className="skill-workflow__icon">
                          <SkillWorkflowStepIcon variant={step.icon} />
                        </span>
                        <div className="skill-workflow__card-heading">
                          <strong>{step.title}</strong>
                          <div className="skill-workflow__card-meta">
                            <span className="skill-workflow__phase">{step.phase}</span>
                            <span className="skill-workflow__number">0{index + 1}</span>
                          </div>
                        </div>
                      </div>
                      <p>{step.text}</p>
                      <SkillWorkflowDemo variant={step.icon} />
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </section>

      {isSkillProduct ? (
        <section className="product-page-cta product-page-cta--skill">
          <div className="skill-product-cta">
            <div className="skill-product-cta__content">
              <p className="skill-product-cta__eyebrow">
                <span />
                {product.name.toUpperCase()} FOR PRIVATE AI
              </p>
              <h2>
                让每一次能力发布，
                <span>都有据可查。</span>
              </h2>
              <p className="skill-product-cta__copy">
                从一个真实场景开始，和 {BRAND.name} 团队一起讨论适合企业的 AI 能力方案。
              </p>
              <a
                className="button button--dark"
                href={`mailto:${BRAND.email}?subject=${encodeURIComponent(`${product.name} 产品咨询`)}`}
              >
                与 {BRAND.name} 团队沟通
                <Arrow />
              </a>
            </div>

            <div className="skill-product-cta__art" aria-hidden="true">
              <span className="skill-product-cta__glow" />
              <span className="skill-product-cta__orbit skill-product-cta__orbit--one" />
              <span className="skill-product-cta__orbit skill-product-cta__orbit--two" />
              <svg
                className="skill-product-cta__route"
                viewBox="0 0 480 340"
                fill="none"
                preserveAspectRatio="none"
              >
                <path d="M105 118h95c27 0 44 18 44 45v17c0 22 14 37 37 37h104" />
                <path d="M105 118h95c27 0 44 18 44 45v17c0 22 14 37 37 37h104" />
                <circle cx="105" cy="118" r="4" />
                <circle cx="244" cy="180" r="4" />
                <circle cx="385" cy="217" r="4" />
              </svg>

              <div className="skill-product-cta__package">
                <div className="skill-product-cta__package-main">
                  <span className="skill-product-cta__package-icon">
                    <SkillPackageIcon size={20} />
                  </span>
                  <strong>Skill 包</strong>
                </div>
              </div>

              <div className="skill-product-cta__gate">
                <SkillWorkflowStepIcon variant="gate" size={22} />
              </div>

              <div className="skill-product-cta__version">
                <div className="skill-product-cta__version-head">
                  <strong>v2.0</strong>
                  <div className="skill-product-cta__version-meta">
                    <div className="skill-product-cta__version-status">
                      <span />
                      已发布
                    </div>
                    <small>最新版本</small>
                  </div>
                </div>
              </div>

              <div className="skill-product-cta__network">
                <span className="skill-product-cta__network-line skill-product-cta__network-line--one" />
                <span className="skill-product-cta__network-line skill-product-cta__network-line--two" />
                <span className="skill-product-cta__network-dot skill-product-cta__network-dot--one" />
                <span className="skill-product-cta__network-dot skill-product-cta__network-dot--two" />
                <span className="skill-product-cta__network-dot skill-product-cta__network-dot--three" />
              </div>
            </div>
          </div>
        </section>
      ) : (
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
      )}
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
