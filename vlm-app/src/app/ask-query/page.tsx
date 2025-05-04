"use client"

import { useSearchParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ChatMessage from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"

// Define message types
type MessageRole = "user" | "assistant" | "system"

interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

// Sample table data for context
const tableData = {
  headers: ["Product", "Q1 Sales", "Q2 Sales", "Growth"],
  rows: [
    ["Product A", "$245,890", "$312,580", "+27%"],
    ["Product B", "$138,450", "$162,780", "+18%"],
    ["Product C", "$97,350", "$87,620", "-10%"],
    ["Total", "$481,690", "$562,980", "+17%"],
  ],
}

export default function AskQueryPage() {
  const searchParams = useSearchParams()
  const fileName = searchParams.get("fileName") || "document.pdf"
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with a welcome message
  useEffect(() => {
    const initialMessage: Message = {
      id: "welcome-message",
      role: "assistant",
      content: `Hello! I'm your AI assistant for document "${fileName}". I can help you analyze the tables and data extracted from your document. What would you like to know?`,
      timestamp: new Date(),
    }
    setMessages([initialMessage])
  }, [fileName])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Simulate AI response with a delay
      setTimeout(() => {
        const aiResponse = generateAIResponse(content)
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error generating response:", error)
      setIsLoading(false)
    }
  }

  // Function to generate AI responses based on user queries
  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    // Simple pattern matching for demo purposes
    if (lowerQuery.includes("highest") && lowerQuery.includes("growth")) {
      return "Based on the table data, Product A has the highest growth at +27% from Q1 to Q2."
    } else if (lowerQuery.includes("total") && lowerQuery.includes("sales")) {
      return "The total sales for Q1 were $481,690 and for Q2 were $562,980, showing an overall growth of +17%."
    } else if (lowerQuery.includes("negative") || lowerQuery.includes("decline")) {
      return "Product C shows a negative growth of -10%, with sales declining from $97,350 in Q1 to $87,620 in Q2."
    } else if (lowerQuery.includes("compare") || lowerQuery.includes("comparison")) {
      return "Comparing the products:\n\n- Product A: Highest sales and growth (+27%)\n- Product B: Moderate sales and growth (+18%)\n- Product C: Lowest sales and negative growth (-10%)\n\nProduct A is the best performer in both absolute sales and growth rate."
    } else if (lowerQuery.includes("chart") || lowerQuery.includes("visualize") || lowerQuery.includes("graph")) {
      return "I can describe the data that would be in a chart:\n\nA bar chart comparing Q1 and Q2 sales would show:\n- Product A: Tallest bars with significant increase in height from Q1 to Q2\n- Product B: Medium height bars with moderate increase\n- Product C: Shortest bars with a slight decrease from Q1 to Q2"
    } else {
      return "I can help you analyze the table data from your document. You can ask about specific products, sales figures, growth rates, or request comparisons between different quarters or products."
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href={`/results?fileName=${encodeURIComponent(fileName)}`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10 mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Results
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Document AI Assistant</h1>
                <p className="text-sm text-gray-500">
                  Analyzing: <span className="font-medium">{fileName}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
