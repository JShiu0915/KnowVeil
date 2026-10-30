import React, { useEffect, useState } from 'react'

export const BASE_URL = import.meta.env.BASE_URL

export function normalisePath(pathname) {
  const path = pathname.replace(/\/+$/, '')
  return path || '/'
}

export function toAppPath(pathname) {
  const base = BASE_URL.replace(/\/$/, '')
  let path = pathname

  if (base && (path === base || path.startsWith(`${base}/`))) {
    path = path.slice(base.length) || '/'
  }

  return normalisePath(path)
}

export function toHref(appPath) {
  const [pathPart, hash] = appPath.split('#')
  const path = normalisePath(pathPart)
  const suffix = hash ? `#${hash}` : ''

  if (path === '/') {
    return `${BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`}${suffix}`
  }

  const base = BASE_URL.replace(/\/$/, '')
  return `${base}${path}${suffix}`
}

export function publicAsset(path) {
  if (!path) {
    return ''
  }

  return `${BASE_URL}${path.replace(/^\//, '')}`
}

export function useAppRoute() {
  const [path, setPath] = useState(() => toAppPath(window.location.pathname))

  useEffect(() => {
    const updatePath = () => setPath(toAppPath(window.location.pathname))
    window.addEventListener('popstate', updatePath)
    return () => window.removeEventListener('popstate', updatePath)
  }, [])

  const navigate = (to) => {
    const [pathPart, hash = ''] = to.split('#')
    const target = normalisePath(pathPart)
    const sameRoute =
      target === toAppPath(window.location.pathname) && `#${hash}` === (window.location.hash || '#')

    if (!sameRoute) {
      window.history.pushState({}, '', toHref(to))
    }
    setPath(target)

    // 带 #小节 的链接由目标页面在渲染后自己滚到那一节
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  return { path, navigate }
}

export function AppLink({ to, navigate, onNavigate, children, ...props }) {
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
