"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, FileText, ImageIcon, Table } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const fileName = searchParams.get("fileName") || "document.pdf"

  const [extractedText, setExtractedText] = useState<string>("")

  useEffect(() => {
    // Simulate loading extracted text
    setExtractedText(`# Document Title

## Section 1
This is the first section of the document. It contains important information about the topic.

## Section 2
The second section elaborates on the concepts introduced in the first section.

### Subsection 2.1
This subsection provides additional details and examples.

## Section 3
The final section summarizes the key points and provides conclusions.

* Point 1
* Point 2
* Point 3`)
  }, [])

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
      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="ml-4 text-2xl font-bold text-[#1E3A8A]">Results: {fileName}</h1>
          </div>

          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100 p-1">
              <TabsTrigger
                value="text"
                className="flex items-center gap-2 data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="flex items-center gap-2 data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white"
              >
                <ImageIcon className="h-4 w-4" />
                Images
              </TabsTrigger>
              <TabsTrigger
                value="tables"
                className="flex items-center gap-2 data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white"
              >
                <Table className="h-4 w-4" />
                Tables
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6">
              <Card className="border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[#1E3A8A]/5 to-transparent">
                  <CardTitle className="text-[#1E3A8A]">Extracted Text</CardTitle>
                  <CardDescription>
                    The following text was extracted from your document using our Visual Language Model.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose max-w-none dark:prose-invert">
                    {extractedText.split("\n\n").map((paragraph, index) => {
                      if (paragraph.startsWith("# ")) {
                        return (
                          <h1 key={index} className="text-2xl font-bold mt-4 text-[#1E3A8A]">
                            {paragraph.substring(2)}
                          </h1>
                        )
                      } else if (paragraph.startsWith("## ")) {
                        return (
                          <h2 key={index} className="text-xl font-bold mt-4 text-[#1E3A8A]">
                            {paragraph.substring(3)}
                          </h2>
                        )
                      } else if (paragraph.startsWith("### ")) {
                        return (
                          <h3 key={index} className="text-lg font-bold mt-3 text-[#1E3A8A]">
                            {paragraph.substring(4)}
                          </h3>
                        )
                      } else if (paragraph.startsWith("* ")) {
                        return (
                          <ul key={index} className="list-disc pl-5 mt-2">
                            {paragraph.split("\n").map((item, i) => (
                              <li key={i}>{item.substring(2)}</li>
                            ))}
                          </ul>
                        )
                      } else {
                        return (
                          <p key={index} className="mt-2">
                            {paragraph}
                          </p>
                        )
                      }
                    })}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button className="gap-2 bg-[#1E3A8A] hover:bg-[#152C6B]">
                    <Download className="h-4 w-4" />
                    Download Text
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <Card className="border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[#1E3A8A]/5 to-transparent">
                  <CardTitle className="text-[#1E3A8A]">Extracted Images</CardTitle>
                  <CardDescription>Images detected in your document with bounding box visualization.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 relative shadow-md hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="absolute inset-0 border-2 border-[#1E3A8A] m-4 rounded-md pointer-events-none opacity-60"></div>
                      <p className="mt-3 text-sm font-medium">Figure 1: Chart showing quarterly results</p>
                    </div>
                    <div className="border rounded-lg p-4 relative shadow-md hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="absolute inset-0 border-2 border-[#1E3A8A] m-4 rounded-md pointer-events-none opacity-60"></div>
                      <p className="mt-3 text-sm font-medium">Figure 2: Product diagram</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button className="gap-2 bg-[#1E3A8A] hover:bg-[#152C6B]">
                    <Download className="h-4 w-4" />
                    Download All Images
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="tables" className="mt-6">
              <Card className="border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[#1E3A8A]/5 to-transparent">
                  <CardTitle className="text-[#1E3A8A]">Extracted Tables</CardTitle>
                  <CardDescription>Tables detected and extracted from your document.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="border rounded-lg overflow-auto shadow-inner">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-[#1E3A8A] text-white">
                          <th className="h-12 px-4 text-left align-middle font-medium">Column 1</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Column 2</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Column 3</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Column 4</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i} className="border-b transition-colors hover:bg-gray-100">
                            <td className="p-4 align-middle font-medium">Row {i + 1}, Cell 1</td>
                            <td className="p-4 align-middle">Row {i + 1}, Cell 2</td>
                            <td className="p-4 align-middle">Row {i + 1}, Cell 3</td>
                            <td className="p-4 align-middle">Row {i + 1}, Cell 4</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button className="gap-2 bg-[#1E3A8A] hover:bg-[#152C6B]">
                    <Download className="h-4 w-4" />
                    Download as CSV
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
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
