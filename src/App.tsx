import React, { useEffect, useRef, useState } from "react";
import '@logseq/libs'

import { useAppVisible } from "./utils";
import './style.scss'

const App: React.FC = () => {
  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();

  const [words, setWords] = useState(0)
  const [currentPageWords, setCurrentPageWords] = useState<number | null>(null)
  const [pages, setPages] = useState(0)
  const [blocks, setBlocks] = useState(0)
  const [currnetPageBlocks, setCurrentPageBlocks] = useState<number | null>(null)

  const getWords = async () => {
    const blocks = await logseq.DB.datascriptQuery(`
      [:find (pull ?b [*])
        :where
        [?b :block/uuid _]
        [?b :block/content]
      ]
    `)

    const count = blocks.map(i => i[0].content || '').reduce((pre, cur) => {
      return pre + (cur?.length || 0)
    }, 0)

    setBlocks(blocks.length)
    setWords(count)
  }

  const getCurrentPageWords = async () => {
    const currentPage = await logseq.Editor.getCurrentPage()
    const uuid = currentPage?.uuid

    if (!uuid) {
      setCurrentPageWords(null)
      setCurrentPageBlocks(null)
      return
    }

    const blocks = await logseq.DB.datascriptQuery(`
      [:find (pull ?b [*])
        :where
        [?p :block/uuid #uuid "${uuid}"]
        [?b :block/page ?p]
        [?b :block/content]
      ]
    `)

    const count = blocks.map(i => i[0].content || '').reduce((pre, cur) => {
      return pre + (cur?.length || 0)
    }, 0)

    setCurrentPageBlocks(blocks.length)
    setCurrentPageWords(count)
  }

  const getPages = async () => {
    // FIXME: 过滤掉 Logseq 默认的页面
    const pages = await logseq.Editor.getAllPages()

    setPages(pages?.length || 0)
  }

  const fn = async () => {
    getWords()
    getCurrentPageWords()
    getPages()
  }

  useEffect(() => {
    console.log('vivsible', visible)

    if (visible) {
      // 用 setTimeout 包裹的原因：让样式先渲染出来，然后才进行计算
      setTimeout(() => {
        fn()
      }, 100)
    }
  }, [visible])

  return (
    <main
      className="main"
      onClick={(e: { target: any; }) => {
        if (!innerRef.current?.contains(e.target as any)) {
          console.log('ref',)
          logseq.hideMainUI();
        }
      }}
    >
      <div ref={innerRef} className="dashboard">
        {currentPageWords !== null && <p>当前页面字数: {currentPageWords}</p>}
        {currnetPageBlocks !== null && <p>当前页面块数: {currnetPageBlocks}</p>}
        <p>总字数: {words}</p>
        <p>总页面数: {pages}</p>
        <p>总块数: {blocks}</p>
      </div>
    </main>
  )
}

export default App;
