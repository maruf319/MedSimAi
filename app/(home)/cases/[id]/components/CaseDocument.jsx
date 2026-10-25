'use client'

import dynamic from 'next/dynamic'

// react-pdf needs browser APIs, so render client-side only
const PDFReader = dynamic(() => import('./PDFReader'), {
    ssr: false,
    loading: () => (
        <div className='card flex h-full items-center justify-center text-sm text-ink-3'>
            Loading document...
        </div>
    ),
})

export default function CaseDocument({ file }) {
    return <PDFReader file={file} />
}
