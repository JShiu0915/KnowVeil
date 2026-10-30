import React from 'react'

/** 窄栏里的短句只在标点后换行 */
export default function Phrases({ text }) {
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
