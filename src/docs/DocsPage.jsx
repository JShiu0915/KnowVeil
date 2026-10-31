import React, { useEffect, useMemo, useState } from 'react'

import { BRAND } from '../brand'
import Phrases from '../Phrases'
import { AppLink } from '../router'
import { allDocs, docParts, findDoc } from './content'
import { Blocks, DocContext, plainText } from './Markdown'

/** 当前读到哪一节：最后一个越过视口上沿的小节标题 */
function useActiveSection(sections) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      let current = sections[0]?.id ?? ''

      sections.forEach((section) => {
        const heading = document.getElementById(section.id)
        if (heading && heading.getBoundingClientRect().top <= 160) {
          current = section.id
        }
      })

      setActiveId(atBottom && sections.length ? sections[sections.length - 1].id : current)
    }

    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.cancelAnimationFrame(frame)
    }
  }, [sections])

  return activeId
}

function PartHeading({ part, as: Heading }) {
  return (
    <Heading className="docs-part-title">
      {part.title}
      {part.kind && <small>{part.kind}</small>}
    </Heading>
  )
}

function DocsNav({ doc, navigate, open }) {
  return (
    <nav id="docs-nav" className={open ? 'docs-nav docs-nav--open' : 'docs-nav'} aria-label="文档目录">
      {docParts.map((part) => (
        <div className="docs-nav__part" key={part.title}>
          <PartHeading part={part} as="h2" />
          <ol className="docs-nav__list">
            {part.docs.map((item) => {
              const current = item.path === doc?.path

              return (
                <li key={item.slug}>
                  <AppLink
                    className={current ? 'docs-nav__link docs-nav__link--current' : 'docs-nav__link'}
                    to={item.path}
                    navigate={navigate}
                    aria-current={current ? 'page' : undefined}
                  >
                    <span className="docs-nav__number">{item.number}</span>
                    {item.title}
                  </AppLink>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </nav>
  )
}

/** 概览里 {{contents}} 的位置：除当前这一篇以外的全部文档 */
function DocContents({ doc, navigate }) {
  return (
    <div className="doc-contents">
      {docParts.map((part) => {
        const docs = part.docs.filter((item) => item.path !== doc.path)
        if (!docs.length) {
          return null
        }

        return (
          <section className="doc-contents__part" key={part.title}>
            <PartHeading part={part} as="h3" />
            <ol className="doc-contents__list">
              {docs.map((item) => (
                <li key={item.slug}>
                  <span className="doc-contents__number">{item.number}</span>
                  <AppLink className="doc-contents__link" to={item.path} navigate={navigate}>
                    {item.title}
                  </AppLink>
                  {item.summary && (
                    <p className="doc-contents__summary">
                      <Phrases text={item.summary} />
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )
      })}
    </div>
  )
}

function DocToc({ doc, activeId }) {
  const feedbackHref = `mailto:${BRAND.email}?subject=${encodeURIComponent(
    `文档反馈：${doc.number} ${doc.title}`,
  )}`

  return (
    <nav className="docs-toc" aria-label="本页内容">
      {doc.sections.length > 0 && (
        <>
          <p className="docs-toc__title">本页内容</p>
          <ol className="docs-toc__list">
            {doc.sections.map((section) => {
              const current = section.id === activeId

              return (
                <li key={section.id}>
                  <a
                    className={current ? 'docs-toc__link docs-toc__link--current' : 'docs-toc__link'}
                    href={`#${section.id}`}
                    aria-current={current ? 'location' : undefined}
                  >
                    <span className="docs-toc__number">{section.number}</span>
                    {plainText(section.tokens)}
                  </a>
                </li>
              )
            })}
          </ol>
        </>
      )}
      <a className="docs-toc__feedback" href={feedbackHref}>
        这一页有问题？写邮件告诉我们
      </a>
    </nav>
  )
}

function DocPager({ doc, navigate }) {
  const index = allDocs.findIndex((item) => item.path === doc.path)
  const previous = allDocs[index - 1]
  const next = allDocs[index + 1]

  if (!previous && !next) {
    return null
  }

  return (
    <nav className="doc-pager" aria-label="上一篇与下一篇">
      {previous && (
        <AppLink className="doc-pager__link" to={previous.path} navigate={navigate}>
          <span>上一篇</span>
          <strong>
            {previous.number} {previous.title}
          </strong>
        </AppLink>
      )}
      {next && (
        <AppLink className="doc-pager__link doc-pager__link--next" to={next.path} navigate={navigate}>
          <span>下一篇</span>
          <strong>
            {next.number} {next.title}
          </strong>
        </AppLink>
      )}
    </nav>
  )
}

function MissingDoc({ navigate }) {
  return (
    <article className="docs-article">
      <header className="doc-header">
        <h1 className="doc-title">没有找到这篇文档</h1>
        <p className="doc-summary">
          这篇文档可能改了名字，或者合并到了别的篇目里。从目录里找，或者回到
          <AppLink to="/docs" navigate={navigate}>
            概览
          </AppLink>
          。
        </p>
      </header>
    </article>
  )
}

export default function DocsPage({ path, navigate }) {
  const doc = findDoc(path)
  const [navOpen, setNavOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const sections = useMemo(() => doc?.sections ?? [], [doc])
  const activeId = useActiveSection(sections)

  useEffect(() => {
    setNavOpen(false)
  }, [path])

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${doc ? doc.title : '没有找到这篇文档'}｜${BRAND.name} 文档`
    return () => {
      document.title = previousTitle
    }
  }, [doc])

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
    }
  }, [doc])

  const context = useMemo(
    () => ({
      doc,
      navigate,
      announce: setAnnouncement,
      contents: doc ? <DocContents doc={doc} navigate={navigate} /> : null,
    }),
    [doc, navigate],
  )

  return (
    <main className="docs">
      <button
        className="docs-menu"
        type="button"
        aria-expanded={navOpen}
        aria-controls="docs-nav"
        onClick={() => setNavOpen((open) => !open)}
      >
        <span className="docs-menu__label">{navOpen ? '收起目录' : '目录'}</span>
        {doc && (
          <span className="docs-menu__current">
            {doc.number} {doc.title}
          </span>
        )}
      </button>

      <div className="docs__layout">
        <DocsNav doc={doc} navigate={navigate} open={navOpen} />

        {doc ? (
          <DocContext.Provider value={context}>
            <article className="docs-article" aria-labelledby="doc-title">
              <header className="doc-header">
                <h1 className="doc-title" id="doc-title">
                  <span className="doc-title__number">{doc.number}</span>
                  {doc.title}
                </h1>
                {doc.summary && (
                  <p className="doc-summary">
                    <Phrases text={doc.summary} />
                  </p>
                )}
              </header>
              <div className="doc-body">
                <Blocks tokens={doc.tokens} />
              </div>
              <footer className="doc-footer">
                {doc.updated && <p className="doc-updated">最后更新：{doc.updated}</p>}
                <DocPager doc={doc} navigate={navigate} />
              </footer>
            </article>
            <aside className="docs-aside">
              <DocToc doc={doc} activeId={activeId} />
            </aside>
          </DocContext.Provider>
        ) : (
          <MissingDoc navigate={navigate} />
        )}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>
    </main>
  )
}
