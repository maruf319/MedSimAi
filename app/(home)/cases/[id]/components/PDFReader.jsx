'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function PDFReader({ file }) {
  const containerRef = useRef(null)

  const [numPages, setNumPages] = useState(null)
  const [pageWidth, setPageWidth] = useState(null)
  
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width

      setPageWidth(width - 48)
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <div className="card flex h-full flex-col overflow-hidden">

      <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">

        <div className="font-display text-[17px] font-bold">
          Case Document
        </div>

        <div className="flex items-center gap-3 text-[13px] text-ink-3">
          {numPages ? `${numPages} ${numPages === 1 ? 'page' : 'pages'}` : 'Loading...'}
          <a href={file} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center rounded-full bg-surface px-[15px] text-[13px] font-semibold text-ink shadow-[0_0_0_1px_var(--line)] hover:bg-surface-2">
            Open
          </a>
        </div>

      </div>


      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-surface-2 p-6"
      >

        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}

          loading={
            <div className="flex h-40 items-center justify-center text-sm text-ink-3">
              Loading PDF...
            </div>
          }

          error={
            <div className="flex h-40 items-center justify-center text-sm text-bad">
              Failed to load PDF.
            </div>
          }
        >

          {numPages &&
            Array.from({ length: numPages }, (val, index) => (
              <div
                key={index}
                className="mb-6 flex justify-center overflow-hidden rounded-xl"
              >
                {pageWidth && (
                  <Page
                    pageNumber={index + 1}
                    width={pageWidth}
                  />
                )}
              </div>
            ))
          }

        </Document>

      </div>

    </div>
  )
}