"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Play,
  Info,
  AlertTriangle,
  CheckCircle,
  LinkIcon,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Maximize,
  Minimize,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/theme-context"
import { useDocContext } from "./enhanced-documentation-layout"
import { cn } from "@/lib/utils"
import type React from "react"

// Sample code for demo purposes
const sampleCode = `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;`

// Sample diagram data
const diagramData = {
  nodes: [
    { id: "app", label: "Application", x: 50, y: 20 },
    { id: "ui", label: "UI Layer", x: 20, y: 50 },
    { id: "service", label: "Service Layer", x: 50, y: 50 },
    { id: "data", label: "Data Layer", x: 80, y: 50 },
    { id: "api", label: "API", x: 50, y: 80 },
  ],
  edges: [
    { from: "app", to: "ui" },
    { from: "app", to: "service" },
    { from: "app", to: "data" },
    { from: "ui", to: "service" },
    { from: "service", to: "data" },
    { from: "data", to: "api" },
  ],
}

export function EnhancedDocContent() {
  const { theme } = useTheme()
  const {
    activeSection,
    setActiveSection,
    bookmarkedSections,
    toggleBookmark,
    markSectionAsRead,
    expandedSections,
    toggleSectionExpansion,
    viewMode,
    setCursorVariant,
    useStandardScrolling,
  } = useDocContext()

  const [isClient, setIsClient] = useState(false)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [expandedCodeBlocks, setExpandedCodeBlocks] = useState<string[]>([])
  const [activeCodeTab, setActiveCodeTab] = useState("preview")
  const [diagramHover, setDiagramHover] = useState<string | null>(null)
  const [readingTime, setReadingTime] = useState(5)
  const [readingProgress, setReadingProgress] = useState(0)

  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Get scroll progress for animations
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"],
  })

  // Transform values for parallax effects - make them more subtle if standard scrolling is enabled
  const titleY = useTransform(scrollYProgress, [0, 0.1], useStandardScrolling ? [0, 0] : [0, -10])
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.05, 0.1], useStandardScrolling ? [1, 1, 1] : [1, 0.8, 0])

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)

    // Set up intersection observer to track active section
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -60% 0px",
      threshold: 0.1,
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id)
          markSectionAsRead(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all section headers
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section)
      sectionRefs.current[section.id] = section as HTMLElement
    })

    // Calculate reading time based on content length
    if (contentRef.current) {
      const text = contentRef.current.textContent || ""
      const wordCount = text.split(/\s+/).length
      const wordsPerMinute = 200
      setReadingTime(Math.ceil(wordCount / wordsPerMinute))
    }

    // Update reading progress as user scrolls
    const updateReadingProgress = () => {
      if (!contentRef.current) return

      const scrollTop = window.scrollY
      const scrollHeight = contentRef.current.scrollHeight
      const clientHeight = window.innerHeight

      const progress = scrollTop / (scrollHeight - clientHeight)
      setReadingProgress(Math.min(Math.max(progress, 0), 1))
    }

    window.addEventListener("scroll", updateReadingProgress)
    updateReadingProgress()

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", updateReadingProgress)
    }
  }, [setActiveSection, markSectionAsRead])

  // Toggle code block expansion
  const toggleCodeBlockExpansion = (blockId: string) => {
    setExpandedCodeBlocks((prev) => (prev.includes(blockId) ? prev.filter((id) => id !== blockId) : [...prev, blockId]))
  }

  // Copy code to clipboard
  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedStates({ ...copiedStates, [id]: true })
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [id]: false })
    }, 2000)
  }

  // Simulate running code
  const runCode = (id: string) => {
    console.log(`Running code ${id}`)
    // In a real implementation, this would actually execute the code
  }

  // Scroll to section with animation
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section) {
      const yOffset = -80 // Header height + some padding
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({
        top: y,
        behavior: useStandardScrolling ? "auto" : "smooth",
      })
    }
  }

  // Code block component with animations and expandable view
  const CodeBlock = ({
    id,
    language = "javascript",
    code,
    filename,
    showLineNumbers = true,
  }: {
    id: string
    language: string
    code: string
    filename?: string
    showLineNumbers?: boolean
  }) => {
    const isExpanded = expandedCodeBlocks.includes(id)
    const blockRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(blockRef, { once: true, amount: 0.2 })

    return (
      <motion.div
        ref={blockRef}
        className={cn(
          "relative mt-4 mb-6 rounded-lg overflow-hidden border border-border transition-all duration-300",
          theme === "dark" ? "bg-zinc-900" : "bg-zinc-50",
          isExpanded && "scale-[1.02] shadow-xl z-10",
        )}
        initial={useStandardScrolling ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={useStandardScrolling ? { opacity: 1, y: 0 } : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={useStandardScrolling ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
      >
        {filename && (
          <div
            className={`px-4 py-2 text-xs font-mono border-b border-border ${theme === "dark" ? "bg-zinc-800" : "bg-zinc-100"}`}
          >
            {filename}
          </div>
        )}
        <div className="relative">
          <pre
            className={cn(
              "p-4 overflow-x-auto text-sm font-mono transition-all duration-300",
              theme === "dark" ? "text-zinc-200" : "text-zinc-700",
              isExpanded && "max-h-[80vh] overflow-y-auto",
            )}
          >
            <code>
              {code.split("\n").map((line, i) => (
                <div key={i} className="line">
                  {showLineNumbers && (
                    <span className="inline-block w-8 text-right mr-4 text-muted-foreground select-none">{i + 1}</span>
                  )}
                  {line || " "}
                </div>
              ))}
            </code>
          </pre>
          <div className="absolute top-2 right-2 flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleCodeBlockExpansion(id)}
                    className={`h-8 w-8 rounded-md transition-all ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-200"}`}
                    onMouseEnter={() => setCursorVariant("button")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    {isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{isExpanded ? "Collapse" : "Expand"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => runCode(id)}
                    className={`h-8 w-8 rounded-md transition-all ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-200"}`}
                    onMouseEnter={() => setCursorVariant("button")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Run code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyCode(id, code)}
                    className={`h-8 w-8 rounded-md transition-all ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-200"}`}
                    onMouseEnter={() => setCursorVariant("copy")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    {copiedStates[id] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{copiedStates[id] ? "Copied!" : "Copy code"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>
    )
  }

  // Interactive diagram component
  const InteractiveDiagram = () => {
    return (
      <motion.div
        className={cn(
          "relative my-8 p-6 rounded-lg border border-border transition-all duration-300",
          theme === "dark" ? "bg-background/50" : "bg-background/80",
        )}
        initial={useStandardScrolling ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={useStandardScrolling ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={useStandardScrolling ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
        onMouseEnter={() => setCursorVariant("link")}
        onMouseLeave={() => setCursorVariant("default")}
      >
        <h4 className="text-center font-medium mb-4">Architecture Diagram</h4>
        <div className="relative h-[300px] w-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
            {/* Draw edges first so they appear behind nodes */}
            {diagramData.edges.map((edge, index) => {
              const fromNode = diagramData.nodes.find((n) => n.id === edge.from)
              const toNode = diagramData.nodes.find((n) => n.id === edge.to)

              if (!fromNode || !toNode) return null

              const isHighlighted = diagramHover === edge.from || diagramHover === edge.to

              return (
                <motion.line
                  key={`edge-${index}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={theme === "dark" ? "#666" : "#999"}
                  strokeWidth={isHighlighted ? 3 : 1.5}
                  strokeOpacity={isHighlighted ? 1 : 0.6}
                  strokeDasharray={isHighlighted ? "none" : "4,2"}
                  initial={useStandardScrolling ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={useStandardScrolling ? { duration: 0 } : { duration: 1, delay: index * 0.1 }}
                />
              )
            })}

            {/* Draw nodes on top of edges */}
            {diagramData.nodes.map((node) => (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={diagramHover === node.id ? 6 : 5}
                  fill={
                    diagramHover === node.id
                      ? theme === "dark"
                        ? "#818cf8"
                        : "#4f46e5"
                      : theme === "dark"
                        ? "#475569"
                        : "#cbd5e1"
                  }
                  stroke={theme === "dark" ? "#1e293b" : "#f8fafc"}
                  strokeWidth={1.5}
                  initial={useStandardScrolling ? { scale: 1 } : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={
                    useStandardScrolling
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 25, delay: node.id.length * 0.1 }
                  }
                  onMouseEnter={() => setDiagramHover(node.id)}
                  onMouseLeave={() => setDiagramHover(null)}
                  style={{ cursor: "pointer" }}
                />
                <motion.text
                  x={node.x}
                  y={node.y + 15}
                  textAnchor="middle"
                  fontSize="3"
                  fill={theme === "dark" ? "#e2e8f0" : "#334155"}
                  fontWeight={diagramHover === node.id ? "bold" : "normal"}
                  initial={useStandardScrolling ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={
                    useStandardScrolling ? { duration: 0 } : { duration: 0.5, delay: node.id.length * 0.1 + 0.3 }
                  }
                >
                  {node.label}
                </motion.text>
              </g>
            ))}
          </svg>
        </div>
        <div className="text-sm text-center text-muted-foreground mt-4">Hover over nodes to see relationships</div>
      </motion.div>
    )
  }

  // Section component with animations and sticky headers
  const Section = ({
    id,
    title,
    children,
    level = 2,
  }: {
    id: string
    title: string
    children: React.ReactNode
    level?: number
  }) => {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
    const isBookmarked = bookmarkedSections.includes(id)
    const isExpanded = expandedSections.includes(id)

    // Register section ref
    useEffect(() => {
      if (sectionRef.current) {
        sectionRefs.current[id] = sectionRef.current
      }
    }, [id])

    // Only apply sticky header behavior if standard scrolling is disabled
    useEffect(() => {
      if (useStandardScrolling || !headerRef.current) return

      const header = headerRef.current
      const originalStyles = {
        position: header.style.position,
        top: header.style.top,
        zIndex: header.style.zIndex,
        backgroundColor: header.style.backgroundColor,
        boxShadow: header.style.boxShadow,
        width: header.style.width,
      }

      const handleScroll = () => {
        if (!sectionRef.current || !headerRef.current) return

        const sectionRect = sectionRef.current.getBoundingClientRect()
        const headerHeight = headerRef.current.offsetHeight

        // Make header sticky when section top is above viewport but section bottom is still visible
        if (sectionRect.top < 60 && sectionRect.bottom > headerHeight + 60) {
          header.style.position = "fixed"
          header.style.top = "60px"
          header.style.zIndex = "10"
          header.style.backgroundColor = theme === "dark" ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)"
          header.style.backdropFilter = "blur(8px)"
          header.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"
          header.style.width = `${sectionRef.current.offsetWidth}px`
        } else {
          // Reset styles when section is not in the sticky range
          header.style.position = originalStyles.position
          header.style.top = originalStyles.top
          header.style.zIndex = originalStyles.zIndex
          header.style.backgroundColor = originalStyles.backgroundColor
          header.style.backdropFilter = "none"
          header.style.boxShadow = originalStyles.boxShadow
          header.style.width = originalStyles.width
        }
      }

      window.addEventListener("scroll", handleScroll)
      handleScroll() // Initial check

      return () => {
        window.removeEventListener("scroll", handleScroll)
        // Reset styles on cleanup
        Object.assign(header.style, originalStyles)
      }
    }, [theme, useStandardScrolling])

    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

    return (
      <motion.section
        id={id}
        ref={sectionRef}
        className="mb-12 scroll-mt-20"
        initial={useStandardScrolling ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={useStandardScrolling ? { opacity: 1, y: 0 } : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={useStandardScrolling ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
      >
        <div
          ref={headerRef}
          className={cn(
            "flex items-center justify-between mb-4 py-2 rounded-md transition-all",
            level > 2 && "pl-4 border-l-2 border-border",
          )}
        >
          <HeadingTag
            className={cn(
              "font-bold tracking-tight",
              level === 2 && "text-2xl",
              level === 3 && "text-xl",
              level === 4 && "text-lg",
            )}
          >
            {title}
          </HeadingTag>
          <div className="flex items-center gap-2">
            {level === 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSectionExpansion(id)}
                className="h-8 w-8 transition-all hover:scale-110 active:scale-95"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmark(id)}
              className="transition-all hover:scale-110 active:scale-95"
              onMouseEnter={() => setCursorVariant("button")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {(isExpanded || level > 2) && (
            <motion.div
              initial={useStandardScrolling ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={useStandardScrolling ? { opacity: 0, height: "auto" } : { opacity: 0, height: 0 }}
              transition={useStandardScrolling ? { duration: 0 } : { duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    )
  }

  // Note component with icon and styling
  const Note = ({
    type = "info",
    title,
    children,
  }: {
    type?: "info" | "warning" | "success" | "tip"
    title?: string
    children: React.ReactNode
  }) => {
    const icons = {
      info: <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />,
      warning: <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />,
      success: <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />,
      tip: <Lightbulb className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />,
    }

    const styles = {
      info: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20",
      warning: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20",
      success: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20",
      tip: "border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-900/20",
    }

    return (
      <motion.div
        className={`relative overflow-hidden p-4 my-6 rounded-lg border ${styles[type]}`}
        initial={useStandardScrolling ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={useStandardScrolling ? { duration: 0 } : { duration: 0.3 }}
      >
        <div className="flex gap-3">
          {icons[type]}
          <div>
            {title && <h4 className="font-medium text-sm mb-1">{title}</h4>}
            <div className="text-sm">{children}</div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div ref={contentRef} className="max-w-3xl mx-auto">
      {/* Title and metadata */}
      <motion.div className="mb-8 pb-4" style={{ y: titleY }}>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Getting Started</h1>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-0.5">
              {readingTime} min read
            </Badge>
            <Badge variant="secondary" className="px-2 py-0.5">
              Beginner
            </Badge>
          </div>
        </div>

        <motion.p className="text-xl text-muted-foreground mt-2" style={{ opacity: subtitleOpacity }}>
          Everything you need to know to get up and running with our platform.
        </motion.p>

        {/* Reading progress */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 bg-accent/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              style={{ width: `${readingProgress * 100}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${readingProgress * 100}%` }}
              transition={useStandardScrolling ? { duration: 0 } : { type: "spring", bounce: 0.2 }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{Math.round(readingProgress * 100)}%</span>
        </div>
      </motion.div>

      {/* Introduction section */}
      <Section id="introduction" title="Introduction">
        <p className="leading-7 mb-4">
          Welcome to our comprehensive documentation. This guide will help you understand how to use our platform
          effectively and get the most out of its features.
        </p>

        <p className="leading-7 mb-4">
          Our platform is designed to help developers build, deploy, and scale applications with ease. Whether you're a
          beginner or an experienced developer, you'll find everything you need to get started.
        </p>

        <Note type="tip" title="Pro Tip">
          Bookmark sections you frequently reference for quicker access in the future. Your bookmarks are saved
          automatically.
        </Note>

        <p className="leading-7 mb-4">
          This documentation is organized into logical sections that build upon each other. We recommend starting from
          the beginning if you're new to the platform, but feel free to jump to specific sections if you're looking for
          particular information.
        </p>
      </Section>

      {/* Installation section */}
      <Section id="installation" title="Installation">
        <p className="leading-7 mb-4">
          Getting started with our platform is easy. You can install it using npm, yarn, or pnpm.
        </p>

        <Tabs defaultValue="npm" className="my-6">
          <TabsList>
            <TabsTrigger
              value="npm"
              onMouseEnter={() => setCursorVariant("button")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              npm
            </TabsTrigger>
            <TabsTrigger
              value="yarn"
              onMouseEnter={() => setCursorVariant("button")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              yarn
            </TabsTrigger>
            <TabsTrigger
              value="pnpm"
              onMouseEnter={() => setCursorVariant("button")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              pnpm
            </TabsTrigger>
          </TabsList>
          <TabsContent value="npm">
            <CodeBlock
              id="npm-install"
              language="bash"
              code="npm install @our-platform/core @our-platform/ui"
              showLineNumbers={false}
            />
          </TabsContent>
          <TabsContent value="yarn">
            <CodeBlock
              id="yarn-install"
              language="bash"
              code="yarn add @our-platform/core @our-platform/ui"
              showLineNumbers={false}
            />
          </TabsContent>
          <TabsContent value="pnpm">
            <CodeBlock
              id="pnpm-install"
              language="bash"
              code="pnpm add @our-platform/core @our-platform/ui"
              showLineNumbers={false}
            />
          </TabsContent>
        </Tabs>

        <p className="leading-7 mb-4">
          After installation, you'll need to configure your project to use our platform. Create a configuration file in
          the root of your project:
        </p>

        <CodeBlock
          id="config-file"
          language="javascript"
          code={`// platform.config.js
module.exports = {
  apiKey: process.env.PLATFORM_API_KEY,
  project: 'my-awesome-project',
  features: {
    authentication: true,
    storage: true,
    analytics: false,
  },
}`}
          filename="platform.config.js"
        />

        <Section id="environment-setup" title="Environment Setup" level={3}>
          <p className="leading-7 mb-4">
            You'll need to set up environment variables for your project. Create a{" "}
            <code className="bg-accent/20 px-1 py-0.5 rounded text-sm">.env</code> file in the root of your project with
            the following variables:
          </p>

          <CodeBlock
            id="env-file"
            language="bash"
            code={`PLATFORM_API_KEY=your_api_key_here
PLATFORM_PROJECT_ID=your_project_id
PLATFORM_ENVIRONMENT=development`}
            filename=".env"
            showLineNumbers={false}
          />

          <Note type="warning" title="Security Note">
            Never commit your <code className="bg-accent/20 px-1 py-0.5 rounded text-sm">.env</code> file to version
            control. Add it to your <code className="bg-accent/20 px-1 py-0.5 rounded text-sm">.gitignore</code> file to
            prevent accidental exposure of sensitive information.
          </Note>
        </Section>
      </Section>

      {/* Quick Start section */}
      <Section id="quick-start" title="Quick Start Guide">
        <p className="leading-7 mb-4">
          Let's create a simple application to demonstrate how to use our platform. First, initialize your project:
        </p>

        <CodeBlock
          id="quick-start-code"
          language="javascript"
          code={`import { createApp } from '@our-platform/core';
import { Button, Card } from '@our-platform/ui';

const app = createApp({
  // Your configuration here
});

function MyComponent() {
  return (
    <Card>
      <h2>Hello, World!</h2>
      <Button>Click me</Button>
    </Card>
  );
}

app.render(<MyComponent />, document.getElementById('root'));`}
          filename="app.js"
        />

        <p className="leading-7 my-4">
          This simple example demonstrates how to create an application using our platform. You can extend it by adding
          more components and features.
        </p>

        <Section id="component-structure" title="Component Structure" level={3}>
          <p className="leading-7 mb-4">
            Our platform uses a component-based architecture. Here's a simple breakdown of how components work:
          </p>

          <InteractiveDiagram />

          <p className="leading-7 mt-4">
            Components can be composed together to create complex interfaces. Each component is responsible for a
            specific piece of functionality.
          </p>
        </Section>
      </Section>

      {/* Architecture section */}
      <Section id="architecture" title="Architecture Overview">
        <p className="leading-7 mb-4">
          Our platform follows a modular architecture that allows you to use only the features you need. Here's a
          high-level overview of the architecture:
        </p>

        <div className="my-8 p-6 rounded-lg border border-border bg-card/30">
          <div className="flex flex-col space-y-4">
            <div
              className={`p-4 rounded-lg ${theme === "dark" ? "bg-primary/10" : "bg-primary/5"} border border-primary/20`}
            >
              <h4 className="font-medium mb-2">Application Layer</h4>
              <p className="text-sm">Handles the core application logic and state management.</p>
            </div>

            <div className="flex justify-center">
              <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </div>

            <div
              className={`p-4 rounded-lg ${theme === "dark" ? "bg-blue-900/10" : "bg-blue-50"} border border-blue-200`}
            >
              <h4 className="font-medium mb-2">Service Layer</h4>
              <p className="text-sm">Provides services like authentication, data fetching, and storage.</p>
            </div>

            <div className="flex justify-center">
              <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </div>

            <div
              className={`p-4 rounded-lg ${theme === "dark" ? "bg-green-900/10" : "bg-green-50"} border border-green-200`}
            >
              <h4 className="font-medium mb-2">UI Layer</h4>
              <p className="text-sm">Contains reusable UI components and styling utilities.</p>
            </div>
          </div>
        </div>

        <p className="leading-7 mb-4">
          This architecture allows for a clean separation of concerns and makes it easy to test and maintain your
          application.
        </p>

        <Note type="success" title="Best Practice">
          Follow the principle of separation of concerns by keeping your UI components separate from your business
          logic. This makes your code more maintainable and easier to test.
        </Note>
      </Section>

      {/* Navigation footer */}
      <div className="border-t border-border pt-8 mt-12">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="gap-2"
            onMouseEnter={() => setCursorVariant("button")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous: Overview</span>
          </Button>

          <Button
            className="gap-2"
            onMouseEnter={() => setCursorVariant("button")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <span>Next: Core Concepts</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-8 pt-4 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-1">
            <LinkIcon className="h-4 w-4" />
            <span>Share this page:</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onMouseEnter={() => setCursorVariant("button")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              Twitter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onMouseEnter={() => setCursorVariant("button")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              GitHub
            </Button>
          </div>
          <p>This page was last updated on April 8, 2024.</p>
        </div>
      </div>
    </div>
  )
}

