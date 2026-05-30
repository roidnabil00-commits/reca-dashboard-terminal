import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-6xl font-bold text-gray-100 select-none">404</p>
        <h1 className="font-display font-bold text-2xl text-navy-900 -mt-4 mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8">This page doesn&apos;t exist or you don&apos;t have access.</p>
        <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Terminal
        </Link>
      </div>
    </div>
  )
}
