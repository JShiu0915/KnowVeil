import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import { BRAND } from '../brand'
import { AppLink, publicAsset, toHref } from '../router'

/** doc、navigate、announce（读屏播报）、contents（{{contents}} 处渲染的目录） */
export const DocContext = createContext({})

const calloutLabels = {
  NOTE: '说明',
  TIP: '提示',
  WARNING: '注意',
  TODO: '待补充',
}

const cjk = '\\u2E80-\\u9FFF\\uF900-\\uFAFF\\uFF00-\\uFFEF\\u3000-\\u303F'
const cjkLineBreak = new RegExp(`([${cjk}])\\n(?=[${cjk}])`, 'g')

/** Markdown 源文件里中文折行会被浏览器渲染成空格，两侧都是中文时直接接上 */
function joinLines(text) {
  return text.replace(cjkLineBreak, '$1').replace(/\n/g, ' ')
}

export function plainText(tokens = []) {
  return tokens.map((token) => (token.tokens ? plainText(token.tokens) : token.text ?? '')).join('')
}

function useCopyState() {
  const [state, setState] = useState('')
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = (text) => {
    const settle = (next) => {
      setState(next)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setState(''), 2000)
      return next
    }

    if (!navigator.clipboard) {
      return Promise.resolve(settle('failed'))
    }

    return navigator.clipboard.writeText(text).then(
      () => settle('copied'),
      () => settle('failed'),
    )
  }

  return [state, copy]
}

export function Inline({ tokens = [] }) {
  const { navigate } = useContext(DocContext)

  return tokens.map((token, index) => {
    const key = `${token.type}-${index}`

    switch (token.type) {
      case 'strong':
        return (
          <strong key={key}>
            <Inline tokens={token.tokens} />
          </strong>
        )
      case 'em':
        return (
          <em key={key}>
            <Inline tokens={token.tokens} />
          </em>
        )
      case 'del':
        return (
          <del key={key}>
            <Inline tokens={token.tokens} />
          </del>
        )
      case 'codespan':
        return <code key={key}>{token.text}</code>
      case 'br':
        return <br key={key} />
      case 'link': {
        const label = <Inline tokens={token.tokens} />
        if (token.href.startsWith('/') && !token.href.startsWith('//')) {
          return (
            <AppLink key={key} to={token.href} navigate={navigate}>
              {label}
            </AppLink>
          )
        }

        return (
          <a key={key} href={token.href}>
            {label}
          </a>
        )
      }
      case 'image':
        return (
          <img
            key={key}
            src={token.href.startsWith('/') ? publicAsset(token.href) : token.href}
            alt={token.text}
            loading="lazy"
            decoding="async"
          />
        )
      case 'text':
        return token.tokens ? (
          <Inline key={key} tokens={token.tokens} />
        ) : (
          <React.Fragment key={key}>{joinLines(token.text)}</React.Fragment>
        )
      default:
        return <React.Fragment key={key}>{token.text ?? ''}</React.Fragment>
    }
  })
}

/** 小节编号即本节的固定链接：点击跳到本节，同时把链接复制下来 */
function SectionHeading({ token }) {
  const { doc, announce } = useContext(DocContext)
  const [state, copy] = useCopyState()

  const copyLink = () => {
    const url = new URL(toHref(`${doc.path}#${token.id}`), window.location.origin).href
    copy(url).then((result) => {
      announce(result === 'copied' ? `已复制 ${token.number} 的链接` : '没能复制，地址栏里就是本节链接')
    })
  }

  return (
    <h2 className="doc-h2" id={token.id}>
      <a className="doc-anchor" href={`#${token.id}`} onClick={copyLink} title="复制本节链接">
        {token.number}
      </a>
      <Inline tokens={token.tokens} />
      {state && (
        <span className="doc-anchor__note" aria-hidden="true">
          {state === 'copied' ? '已复制链接' : '没能复制'}
        </span>
      )}
    </h2>
  )
}

function CodeBlock({ token }) {
  const [state, copy] = useCopyState()

  return (
    <div className="doc-code">
      <pre tabIndex={0}>
        <code>{token.text}</code>
      </pre>
      <button className="doc-code__copy" type="button" onClick={() => copy(token.text)}>
        {state === 'copied' ? '已复制' : state === 'failed' ? '没能复制' : '复制'}
      </button>
    </div>
  )
}

function Callout({ token }) {
  const type = token.callout
  const [first, ...rest] = token.tokens

  if (type === 'TODO' && !import.meta.env.DEV) {
    return (
      <p className="doc-pending">
        这一节还在整理。需要这部分内容，可以写邮件问我们：
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
      </p>
    )
  }

  const label = <strong className="doc-callout__label">{calloutLabels[type]}</strong>

  return (
    <div className={`doc-callout doc-callout--${type.toLowerCase()}`} role="note">
      {first?.type === 'paragraph' ? (
        <>
          <p>
            {label}
            <Inline tokens={first.tokens} />
          </p>
          <Blocks tokens={rest} />
        </>
      ) : (
        <>
          {label}
          <Blocks tokens={token.tokens} />
        </>
      )}
    </div>
  )
}

function Table({ token }) {
  const align = (index) => (token.align[index] ? { textAlign: token.align[index] } : undefined)

  return (
    <div className="doc-table">
      <table>
        <thead>
          <tr>
            {token.header.map((cell, index) => (
              <th key={index} style={align(index)}>
                <Inline tokens={cell.tokens} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {token.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, index) => (
                <td key={index} style={align(index)}>
                  <Inline tokens={cell.tokens} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Paragraph({ token }) {
  const { contents } = useContext(DocContext)
  const onlyImage = token.tokens.length === 1 && token.tokens[0].type === 'image'

  if (token.text.trim() === '{{contents}}') {
    return contents ?? null
  }

  if (onlyImage) {
    const image = token.tokens[0]
    return (
      <figure className="doc-figure">
        <Inline tokens={token.tokens} />
        {(image.title || image.text) && <figcaption>{image.title || image.text}</figcaption>}
      </figure>
    )
  }

  return (
    <p>
      <Inline tokens={token.tokens} />
    </p>
  )
}

export function Blocks({ tokens = [] }) {
  return tokens.map((token, index) => {
    const key = `${token.type}-${index}`

    switch (token.type) {
      case 'heading':
        if (token.depth <= 2) {
          return <SectionHeading key={key} token={token} />
        }
        return React.createElement(
          token.depth === 3 ? 'h3' : 'h4',
          { key, id: token.id, className: token.depth === 3 ? 'doc-h3' : 'doc-h4' },
          <Inline tokens={token.tokens} />,
        )
      case 'paragraph':
        return <Paragraph key={key} token={token} />
      case 'text':
        return <Inline key={key} tokens={token.tokens ?? [{ type: 'text', text: token.text }]} />
      case 'list': {
        const List = token.ordered ? 'ol' : 'ul'
        return (
          <List key={key} start={token.ordered && token.start !== 1 ? token.start : undefined}>
            {token.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <Blocks tokens={item.tokens} />
              </li>
            ))}
          </List>
        )
      }
      case 'table':
        return <Table key={key} token={token} />
      case 'blockquote':
        return token.callout ? (
          <Callout key={key} token={token} />
        ) : (
          <blockquote key={key}>
            <Blocks tokens={token.tokens} />
          </blockquote>
        )
      case 'code':
        return <CodeBlock key={key} token={token} />
      case 'hr':
        return <hr key={key} />
      default:
        return null
    }
  })
}
