"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import img1 from "../../public/flow.png"

// Process steps based on the flowchart
const processSteps = [
  {
    id: 1,
    image: "/placeholder.svg?height=200&width=200",
    caption: "PDF to Image",
    description: "Converting PDF documents into image format for processing",
    color: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=200&width=200",
    caption: "Table Detection",
    description: "Identifying and locating tables within the document",
    color: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=200&width=200",
    caption: "Structure Recognition",
    description: "Analyzing the document structure and layout",
    color: "bg-amber-50",
    borderColor: "border-amber-200",
    pauseHere: true,
  },
  {
    id: 4,
    image: "/placeholder.svg?height=200&width=200",
    caption: "OCR",
    description: "Extracting text from images using Optical Character Recognition",
    color: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=200&width=200",
    caption: "Form Prompt",
    description: "Creating structured prompts based on document content",
    color: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=200&width=200",
    caption: "CSV Export",
    description: "Exporting structured data to CSV format",
    color: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: 7,
    image: "/placeholder.svg?height=200&width=200",
    caption: "LLM Processing",
    description: "Using Large Language Models to interpret document content",
    color: "bg-green-50",
    borderColor: "border-green-200",
  },
]

// Sample document structure images for the carousel at step 3
const documentStructureImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Document Header Structure",
    caption: "Header Structure",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Document Body Structure",
    caption: "Body Structure",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Document Footer Structure",
    caption: "Footer Structure",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Document Layout Analysis",
    caption: "Layout Analysis",
  },
]
const stepPositions = [
    { left: "12.5%", width: "105px", height: "87px",top : 217 },  // PDF to Image
    { left: "29.3%", width: "128px", height: "141px",top : 243 },  // Table Detection
    { left: "47.2%", width: "130px", height: "90px",top : 218 },  // Structure Recognition
    { left: "62.5%", width: "82px", height: "86px",top : 216 },   // OCR
    { left: "75.0%", width: "92px", height: "85px",top : 216 },  // Form Prompt
    { left: "75.1%", width: "125px", height: "80px",top : 421 },   // USER
  ];

//   const activeBoxStyle = {
//     position: "absolute",
//     top: 240, // consistent Y to simulate linear left-to-right
//     left: stepPositions[activeStep]?.left,
//     width: stepPositions[activeStep]?.width,
//     height: stepPositions[activeStep]?.height,
//     opacity: 0.7,
//     boxShadow: "0 0 0 4px rgba(30, 58, 138, 0.3)",
//     transform: "translate(-50%, -50%)",
//     transition: "all 0.4s ease-in-out",
//   };

interface ProcessVisualizationProps {
  fileName: string
  onProcessComplete: () => void
}

export default function ProcessVisualization({ fileName, onProcessComplete }: ProcessVisualizationProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const structureImagesRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [structureScrollPosition, setStructureScrollPosition] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [currentStructureImage, setCurrentStructureImage] = useState(0)

  const scrollAmount = 300 // Amount to scroll on each arrow click
  const structureScrollAmount = 400 // Amount to scroll for structure images

  const scrollLeft = () => {
    if (carouselRef.current) {
      const newPosition = Math.max(0, scrollPosition - scrollAmount)
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
      setScrollPosition(newPosition)
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth
      const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount)
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
      setScrollPosition(newPosition)
    }
  }

  const scrollStructureLeft = () => {
    if (structureImagesRef.current) {
      setCurrentStructureImage((prev) => Math.max(0, prev - 1))
    }
  }

  const scrollStructureRight = () => {
    if (structureImagesRef.current) {
      setCurrentStructureImage((prev) => Math.min(documentStructureImages.length - 1, prev + 1))
    }
  }

  // const resumeProcessing = () => {
  //   setIsPaused(!isPaused);
  // }

  // Simulate processing through each step
  useEffect(() => {
    if (!isProcessing || isPaused) return

    const interval = setInterval(() => {
      if (activeStep < processSteps.length) {
        setActiveStep((prev) => prev + 1)

        // Auto-scroll to keep active step visible
        if (carouselRef.current) {
          const stepWidth = 250 + 16 // card width + gap
          carouselRef.current.scrollTo({
            left: stepWidth * activeStep,
            behavior: "smooth",
          })
          setScrollPosition(stepWidth * activeStep)
        }

        // Check if we should pause at this step
        const nextStep = processSteps[activeStep]
        if (nextStep && nextStep.pauseHere) {
          setIsPaused(true)
        }
      } else {
        clearInterval(interval)
        setIsProcessing(false)

        // Wait a moment before completing
        setTimeout(() => {
          onProcessComplete()
        }, 1000)
      }
    }, 1500) // Time for each step

    return () => clearInterval(interval)
  }, [activeStep, isProcessing, isPaused, onProcessComplete])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Processing Document: {fileName}</h2>

      {/* Main Process Image */}
      <div className="relative w-full mb-10">
        <div className="aspect-[16/9] max-w-4xl mx-auto relative">
          <Image
          src={img1}
          fill
          
        //   width={1000}
            // src="../../public/flow.png"
            alt="Document Processing Workflow Diagram"
            className="object-contain"
            priority
          />

          {/* Highlight active step in the diagram */}
          {activeStep > 0 && activeStep <= processSteps.length && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-full">
                <div
                  className="absolute transition-all duration-300 border-2 border-[#1E3A8A] rounded-lg"
                  style={{
                    opacity: 0.7,
                    boxShadow: "0 0 0 4px rgba(30, 58, 138, 0.3)",
                    // Position would need to be adjusted based on the actual diagram
                    // top: `${20 + (activeStep - 1) * 5}%`,
                    // left:0,
                    left: stepPositions[activeStep-1]?.left,
                    width: stepPositions[activeStep-1]?.width,
                    height: stepPositions[activeStep-1]?.height,
                    top: stepPositions[activeStep-1]?.top,
                    // left: `${13 + (activeStep - 1) * 16}%`,
                    // width: "130px",
                    // height: "140px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Status */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold border-[#1E3A8A]/20 bg-[#1E3A8A]/10 text-[#1E3A8A]">
          {isProcessing ? (
            isPaused ? (
              <>
                <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></span>
                Paused at Step {activeStep} of {processSteps.length}: {processSteps[activeStep - 1]?.caption}
              </>
            ) : (
              <>
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Processing Step {activeStep} of {processSteps.length}
              </>
            )
          ) : (
            <>
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
              Processing Complete
            </>
          )}
        </div>
      </div>

      {/* Structure Recognition Images (only shown when paused at step 3) */}
      {isPaused && activeStep === 3 && (
        <div className="mb-10 bg-white p-6 rounded-xl border shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-[#1E3A8A]">Structure Recognition Results</h3>
          <p className="text-gray-600 mb-6">
            The document structure has been analyzed. Please review the detected structural elements below.
          </p>

          {/* Structure Images Carousel */}
          <div className="relative">
            {/* Carousel Navigation Buttons */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
              <button
                onClick={scrollStructureLeft}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
                aria-label="Previous image"
                disabled={currentStructureImage === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
              <button
                onClick={scrollStructureRight}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
                aria-label="Next image"
                disabled={currentStructureImage === documentStructureImages.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Images */}
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentStructureImage * 100}%)` }}
              >
                {documentStructureImages.map((image) => (
                  <div key={image.id} className="w-full flex-shrink-0">
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-contain" />
                    </div>
                    <div className="p-4 bg-gray-50 text-center">
                      <h4 className="font-medium text-[#1E3A8A]">{image.caption}</h4>
                      <p className="text-sm text-gray-500">
                        {image.id}/{documentStructureImages.length}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      
          </div>
      )}
          {/* Resume Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:opacity-90 transition-opacity px-8 py-6"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              {isPaused ? "Resume" : "Pause"} Processing
            </Button>
          </div>
        

      {/* Step Carousel */}
      <div className="relative">
        <h3 className="text-xl font-semibold mb-4">Process Steps</h3>

        {/* Carousel Navigation Buttons */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 z-10">
          <button
            onClick={scrollLeft}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 z-10">
          <button
            onClick={scrollRight}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-6 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {processSteps.map((step) => (
            <div key={step.id} className="flex-shrink-0 w-[250px] snap-start">
              <div
                className={`${step.color} rounded-lg shadow-md overflow-hidden border ${step.borderColor} h-full transition-all duration-300 ${
                  activeStep === step.id
                    ? "ring-2 ring-[#1E3A8A] transform scale-105"
                    : activeStep > step.id
                      ? "opacity-70"
                      : "opacity-50"
                }`}
              >
                <div className="relative h-[150px] bg-gray-100">
                  <Image src={step.image || "/placeholder.svg"} alt={step.caption} fill className="object-cover" />
                  <div
                    className={`absolute top-2 left-2 ${
                      activeStep >= step.id ? "bg-[#1E3A8A]" : "bg-gray-400"
                    } text-white text-xs font-bold px-2 py-1 rounded-full transition-colors`}
                  >
                    Step {step.id}
                  </div>
                  {activeStep > step.id && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold p-1 rounded-full">
                      ✓
                    </div>
                  )}
                  {step.pauseHere && (
                    <div className="absolute bottom-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Pause
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-1">{step.caption}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] transition-all duration-500"
            style={{ width: `${(activeStep / processSteps.length) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-500 text-center">
          {isProcessing ? (
            isPaused ? (
              <>Paused at {Math.round((activeStep / processSteps.length) * 100)}% - Waiting for user input</>
            ) : (
              <>Processing your document... {Math.round((activeStep / processSteps.length) * 100)}%</>
            )
          ) : (
            <>Processing complete! Redirecting to results...</>
          )}
        </div>
      </div>
    </div>
  )
}
