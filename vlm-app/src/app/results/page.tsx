"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, FileText, ImageIcon, Table, Check, Copy } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const fileName = searchParams.get("fileName") || "document.pdf"

  const [extractedText, setExtractedText] = useState<string>("")
  const [copied, setCopied] = useState(false)

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 mx-auto">
          {/* Logo/Link Section */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] shadow-md">
              <span className="text-sm font-bold text-white">VLM</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] bg-clip-text text-transparent sm:text-xl">
              VLM Document Processor
            </span>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:bg-gray-100 hover:text-[#1E3A8A] px-3 py-1.5"
              >
                Dashboard
              </Button>
            </Link>
            <Button 
              className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white hover:opacity-90 transition-opacity px-4 py-1.5"
            >
              <span className="hidden sm:inline">New</span> Upload
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-[#1E3A8A]">Analysis Results</h1>
                <p className="text-sm text-gray-500">
                  Document: <span className="font-medium">{fileName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10">
                <Copy className="h-4 w-4" />
                Share
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:opacity-90 transition-opacity">
                <Download className="h-4 w-4" />
                Download All
              </Button>
            </div>
          </div>
          <div  className="w-full max-w-3xl"> 
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 p-1 rounded-xl bg-gray-100/80 backdrop-blur-sm">
              <TabsTrigger
                value="text"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E3A8A] data-[state=active]:to-[#3B82F6] data-[state=active]:text-white transition-all"
              >
                <FileText className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E3A8A] data-[state=active]:to-[#3B82F6] data-[state=active]:text-white transition-all"
              >
                <ImageIcon className="h-4 w-4" />
                Images
              </TabsTrigger>
              <TabsTrigger
                value="tables"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E3A8A] data-[state=active]:to-[#3B82F6] data-[state=active]:text-white transition-all"
              >
                <Table className="h-4 w-4" />
                Tables
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6">
              <Card className="border-gray-200 shadow-xl overflow-hidden ">
                <CardHeader className="bg-gradient-to-r from-[#1E3A8A]/10 to-transparent border-b pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#1E3A8A]">Extracted Text</CardTitle>
                      <CardDescription>
                        The following text was extracted from your document using our Visual Language Model.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy Text
                          </>
                        )}
                      </Button>
                      <Button size="sm" className="gap-1 bg-[#1E3A8A] hover:bg-[#152C6B]">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="prose max-w-none dark:prose-invert">
                    {extractedText.split("\n\n").map((paragraph, index) => {
                      if (paragraph.startsWith("# ")) {
                        return (
                          <h1 key={index} className="text-3xl font-bold mt-4 text-[#1E3A8A] border-b pb-2">
                            {paragraph.substring(2)}
                          </h1>
                        )
                      } else if (paragraph.startsWith("## ")) {
                        return (
                          <h2 key={index} className="text-2xl font-bold mt-6 text-[#1E3A8A]">
                            {paragraph.substring(3)}
                          </h2>
                        )
                      } else if (paragraph.startsWith("### ")) {
                        return (
                          <h3 key={index} className="text-xl font-bold mt-4 text-[#1E3A8A]">
                            {paragraph.substring(4)}
                          </h3>
                        )
                      } else if (paragraph.startsWith("* ")) {
                        return (
                          <ul key={index} className="list-disc pl-5 mt-4 space-y-2">
                            {paragraph.split("\n").map((item, i) => (
                              <li key={i} className="text-gray-700">
                                {item.substring(2)}
                              </li>
                            ))}
                          </ul>
                        )
                      } else {
                        return (
                          <p key={index} className="mt-4 text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                        )
                      }
                    })}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t p-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Processed with <span className="font-medium">98%</span> confidence
                  </p>
                  <Button className="gap-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:opacity-90 transition-opacity">
                    <Download className="h-4 w-4" />
                    Download as PDF
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <Card className="border-gray-200 shadow-xl overflow-hidden w-full">
                <CardHeader className="bg-gradient-to-r from-[#1E3A8A]/10 to-transparent border-b pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#1E3A8A]">Extracted Images</CardTitle>
                      <CardDescription>
                        Images detected in your document with bounding box visualization.
                      </CardDescription>
                    </div>
                    <Button size="sm" className="gap-1 bg-[#1E3A8A] hover:bg-[#152C6B]">
                      <Download className="h-4 w-4" />
                      Download All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
                      <div className="aspect-video bg-gray-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="absolute inset-0 border-2 border-[#1E3A8A] m-4 rounded-md pointer-events-none opacity-60"></div>
                        <div className="absolute bottom-2 right-2 bg-[#1E3A8A] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Figure 1
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-medium text-[#1E3A8A]">Chart: Quarterly Results</h3>
                        <p className="mt-1 text-sm text-gray-500">Bar chart showing quarterly financial performance</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">Confidence: 96%</span>
                          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
                      <div className="aspect-video bg-gray-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="absolute inset-0 border-2 border-[#1E3A8A] m-4 rounded-md pointer-events-none opacity-60"></div>
                        <div className="absolute bottom-2 right-2 bg-[#1E3A8A] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Figure 2
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-medium text-[#1E3A8A]">Diagram: Product Architecture</h3>
                        <p className="mt-1 text-sm text-gray-500">Technical diagram showing product components</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">Confidence: 94%</span>
                          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t p-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">2</span> images detected
                  </p>
                  <Button className="gap-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:opacity-90 transition-opacity">
                    <Download className="h-4 w-4" />
                    Download All Images
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="tables" className="mt-6">
              <Card className="border-gray-200 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#1E3A8A]/10 to-transparent border-b pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#1E3A8A]">Extracted Tables</CardTitle>
                      <CardDescription>Tables detected and extracted from your document.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Data
                      </Button>
                      <Button size="sm" className="gap-1 bg-[#1E3A8A] hover:bg-[#152C6B]">
                        <Download className="h-4 w-4" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="border rounded-lg overflow-auto shadow-inner">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white">
                          <th className="h-12 px-4 text-left align-middle font-medium">Product</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Q1 Sales</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Q2 Sales</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-gray-100">
                          <td className="p-4 align-middle font-medium">Product A</td>
                          <td className="p-4 align-middle">$245,890</td>
                          <td className="p-4 align-middle">$312,580</td>
                          <td className="p-4 align-middle text-green-600">+27%</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-gray-100">
                          <td className="p-4 align-middle font-medium">Product B</td>
                          <td className="p-4 align-middle">$138,450</td>
                          <td className="p-4 align-middle">$162,780</td>
                          <td className="p-4 align-middle text-green-600">+18%</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-gray-100">
                          <td className="p-4 align-middle font-medium">Product C</td>
                          <td className="p-4 align-middle">$97,350</td>
                          <td className="p-4 align-middle">$87,620</td>
                          <td className="p-4 align-middle text-red-600">-10%</td>
                        </tr>
                        <tr className="bg-gray-50 font-medium">
                          <td className="p-4 align-middle">Total</td>
                          <td className="p-4 align-middle">$481,690</td>
                          <td className="p-4 align-middle">$562,980</td>
                          <td className="p-4 align-middle text-green-600">+17%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium text-[#1E3A8A] mb-2">Table Analysis</h3>
                    <p className="text-sm text-gray-600">
                      This table shows quarterly sales data with Product A showing the strongest growth at 27%. Overall
                      sales increased by 17% from Q1 to Q2.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t p-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">1</span> table detected
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10">
                      <Download className="h-4 w-4" />
                      Excel
                    </Button>
                    <Button className="gap-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:opacity-90 transition-opacity">
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12 w-full">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-6 md:px-6">
        {/* Divider line */}
        <div className="h-[1px] w-full bg-gray-300"></div>
        
        {/* Content container - now properly centered */}
        <div className="mt-6 flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} VLM Document Processor. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#1E3A8A]">
              Privacy Policy
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#1E3A8A]">
              Terms of Service
            </Button>
          </div>
        </div>
      </div>
    </footer>
    </div>
  )
}
