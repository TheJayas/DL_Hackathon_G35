import { Upload } from "@/components/upload"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#1E3A8A] flex items-center justify-center">
              <span className="text-white font-bold text-sm">VLM</span>
            </div>
            <span className="text-xl font-bold text-[#1E3A8A]">VLM Document Processor</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-[#1E3A8A]">
                  Visual Document Processing
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Upload your documents and let our Visual Language Model extract and analyze the content with advanced
                  AI technology.
                </p>
              </div>
              <div className="w-full max-w-3xl mx-auto mt-8">
                <Upload />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:py-0">
          <p className="text-center text-sm text-gray-500 md:text-left">
            &copy; {new Date().getFullYear()} VLM Document Processor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
