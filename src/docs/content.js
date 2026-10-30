import { Lexer } from 'marked'

import { BRAND, PRODUCTS } from '../brand'

const sources = import.meta.glob('./pages/*.md', { query: '?raw', import: 'default', eager: true })

/**
 * 文档目录：分组顺序与篇目顺序以这里为准，编号（1.1、2.3）按位置自动生成。
 * 新增一篇：在 pages/ 下放一个 .md 文件，再把文件名（不含扩展名）写进对应分组。
 *
 * pages/*.md 的写法：
 * - 开头 frontmatter：title、summary、updated；第一组的第一篇就是 /docs
 * - 正文从 ## 开始，## 自动编号并列进「本页内容」；写成 `## 标题 {#anchor}` 可固定这一节的链接
 * - 提示框：> [!NOTE]、> [!TIP]、> [!WARNING]；> [!TODO] 写给作者，只在本地开发时显示，线上显示「还在整理」
 * - 品牌词写 {{brand}}、{{knode}}、{{skill}}；单独一行 {{contents}} 插入全部文档列表
 * - 站内链接写 /docs/xxx 或 /docs/xxx#anchor，图片放 public/ 下，写 /images/xxx
 */
const outline = [
  { title: '开始使用', pages: ['overview', 'how-they-fit', 'deployment', 'clients'] },
  {
    title: PRODUCTS.knode.name,
    kind: PRODUCTS.knode.kind,
    pages: ['knode-directory', 'knode-citations', 'knode-backup'],
  },
  {
    title: PRODUCTS.skill.name,
    kind: PRODUCTS.skill.kind,
    pages: ['skill-package', 'skill-checks', 'skill-versions'],
  },
  { title: '帮助', pages: ['faq'] },
]

/** 正文里的品牌词写成 {{knode}} 这样的占位，改名只改 brand.js */
const brandTokens = {
  brand: BRAND.name,
  email: BRAND.email,
  knode: PRODUCTS.knode.name,
  knodeKind: PRODUCTS.knode.kind,
  skill: PRODUCTS.skill.name,
  skillKind: PRODUCTS.skill.kind,
}

const calloutTypes = ['NOTE', 'TIP', 'WARNING', 'TODO']

function fillBrandTokens(text) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => brandTokens[key] ?? match)
}

function splitFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    return { meta: {}, body: source }
  }

  const meta = {}
  match[1].split(/\r?\n/).forEach((line) => {
    const colon = line.indexOf(':')
    if (colon > 0) {
      meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
    }
  })

  return { meta, body: source.slice(match[0].length) }
}

function headingId(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
}

/** 给标题编号、生成锚点，把 > [!NOTE] 这类引用块标成提示框 */
function prepareTokens(tokens, docNumber) {
  const sections = []
  const usedIds = new Set()

  const visit = (list) => {
    list.forEach((token) => {
      if (token.type === 'heading') {
        const explicit = token.text.match(/\s*\{#([\w-]+)\}\s*$/)
        const title = explicit ? token.text.slice(0, explicit.index) : token.text
        let id = explicit ? explicit[1] : headingId(title) || `section-${sections.length + 1}`
        while (usedIds.has(id)) {
          id = `${id}-2`
        }
        usedIds.add(id)

        token.id = id
        token.tokens = Lexer.lexInline(title)

        if (token.depth <= 2) {
          token.depth = 2
          token.number = `${docNumber}.${sections.length + 1}`
          sections.push({ id, number: token.number, tokens: token.tokens })
        }
      }

      if (token.type === 'blockquote') {
        const marker = token.text.match(/^\[!(\w+)\][ \t]*\r?\n?/)
        if (marker && calloutTypes.includes(marker[1].toUpperCase())) {
          token.callout = marker[1].toUpperCase()
          token.tokens = Lexer.lex(token.text.slice(marker[0].length))
        }
      }
    })
  }

  visit(tokens)
  return sections
}

function buildDoc(slug, partIndex, pageIndex) {
  const source = sources[`./pages/${slug}.md`]
  if (source === undefined) {
    console.error(`文档目录里写了「${slug}」，但没有找到 src/docs/pages/${slug}.md`)
    return null
  }

  const { meta, body } = splitFrontmatter(source)
  const number = `${partIndex + 1}.${pageIndex + 1}`
  const tokens = Lexer.lex(fillBrandTokens(body))
  const sections = prepareTokens(tokens, number)

  return {
    slug,
    number,
    path: partIndex === 0 && pageIndex === 0 ? '/docs' : `/docs/${slug}`,
    title: fillBrandTokens(meta.title ?? slug),
    summary: meta.summary ? fillBrandTokens(meta.summary) : '',
    updated: meta.updated ?? '',
    tokens,
    sections,
  }
}

export const docParts = outline.map((part, partIndex) => ({
  ...part,
  docs: part.pages.map((slug, pageIndex) => buildDoc(slug, partIndex, pageIndex)).filter(Boolean),
}))

export const allDocs = docParts.flatMap((part) =>
  part.docs.map((doc) => ({ ...doc, partTitle: part.title })),
)

export function findDoc(path) {
  return allDocs.find((doc) => doc.path === path) ?? null
}
