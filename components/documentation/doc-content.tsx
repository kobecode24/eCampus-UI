"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Copy, Check, ChevronRight, ChevronDown, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/theme-context"

export function DocContent() {
  const { theme } = useTheme()
  const [isClient, setIsClient] = useState(false)
  const [activeSection, setActiveSection] = useState("introduction")
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([])
  const contentRef = useRef<HTMLDivElement>(null)

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)

    // Try to restore bookmarked sections from local storage
    try {
      const savedBookmarks = localStorage.getItem("doc-bookmarked-sections")
      if (savedBookmarks) {
        setBookmarkedSections(JSON.parse(savedBookmarks))
      }
    } catch (error) {
      console.error("Failed to restore bookmarked sections:", error)
    }
  }, [])

  // Save bookmarked sections to local storage
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("doc-bookmarked-sections", JSON.stringify(bookmarkedSections))
      } catch (error) {
        console.error("Failed to save bookmarked sections:", error)
      }
    }
  }, [bookmarkedSections, isClient])

  const toggleBookmark = (sectionId: string) => {
    setBookmarkedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  // Code block component with copy functionality
  const CodeBlock = ({
    language = "javascript",
    code,
    filename,
  }: { language: string; code: string; filename?: string }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div
        className={`relative mt-4 mb-6 rounded-lg overflow-hidden ${theme === "dark" ? "bg-zinc-900" : "bg-zinc-50"} border border-border`}
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
            className={`p-4 overflow-x-auto text-sm font-mono ${theme === "dark" ? "text-zinc-200" : "text-zinc-700"}`}
          >
            <code>{code}</code>
          </pre>
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className={`h-8 w-8 rounded-md transition-all ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-200"}`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Section component with animation
  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })
    const isBookmarked = bookmarkedSections.includes(id)

    return (
      <motion.section
        id={id}
        ref={ref}
        className="mb-12 scroll-mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleBookmark(id)}
            className="transition-all hover:scale-110 active:scale-95"
          >
            {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
          </Button>
        </div>
        {children}
      </motion.section>
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
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <a href="/dev-forum" className="hover:text-foreground transition-colors">
          Home
        </a>
        <ChevronRight className="h-4 w-4 mx-1" />
        <a href="/dev-forum/documentation" className="hover:text-foreground transition-colors">
          Documentation
        </a>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground">Getting Started</span>
      </nav>

      {/* Title and metadata */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Getting Started</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Everything you need to know to get up and running with our platform.
        </p>
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <Badge variant="outline" className="px-2 py-0.5">
            Updated 2 days ago
          </Badge>
          <span className="text-muted-foreground">Reading time: 8 min</span>
          <span className="text-muted-foreground">•</span>
          <a href="#" className="text-primary hover:underline">
            Edit on GitHub
          </a>
        </div>
      </div>

      {/* Table of contents */}
      <div className={`p-4 mb-8 rounded-lg border border-border ${theme === "dark" ? "bg-card/50" : "bg-card/80"}`}>
        <h3 className="font-medium mb-2">On this page</h3>
        <ul className="space-y-1">
          <li>
            <a
              href="#introduction"
              className={`text-sm hover:text-primary transition-colors ${activeSection === "introduction" ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              Introduction
            </a>
          </li>
          <li>
            <a
              href="#installation"
              className={`text-sm hover:text-primary transition-colors ${activeSection === "installation" ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              Installation
            </a>
          </li>
          <li>
            <a
              href="#quick-start"
              className={`text-sm hover:text-primary transition-colors ${activeSection === "quick-start" ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              Quick Start Guide
            </a>
          </li>
          <li>
            <a
              href="#architecture"
              className={`text-sm hover:text-primary transition-colors ${activeSection === "architecture" ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              Architecture Overview
            </a>
          </li>
        </ul>
      </div>

      {/* Content sections */}
      <Section id="introduction" title="Introduction">
        <p className="leading-7 mb-4">
          Welcome to our comprehensive documentation. This guide will help you understand how to use our platform
          effectively and get the most out of its features.
        </p>
        <p className="leading-7 mb-4">
          Our platform is designed to help developers build, deploy, and scale applications with ease. Whether you're a
          beginner or an experienced developer, you'll find everything you need to get started.
        </p>

        <div
          className={`p-4 my-6 rounded-lg border border-border ${theme === "dark" ? "bg-primary/10" : "bg-primary/5"}`}
        >
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-primary mb-1">Note</h4>
              <p className="text-sm leading-6">
                This documentation is continuously updated. Make sure you're viewing the latest version by checking the
                version indicator at the bottom of the sidebar.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="installation" title="Installation">
        <p className="leading-7 mb-4">
          Getting started with our platform is easy. You can install it using npm, yarn, or pnpm.
        </p>

        <Tabs defaultValue="npm" className="my-6">
          <TabsList>
            <TabsTrigger value="npm">npm</TabsTrigger>
            <TabsTrigger value="yarn">yarn</TabsTrigger>
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          </TabsList>
          <TabsContent value="npm">
            <CodeBlock language="bash" code="npm install @our-platform/core @our-platform/ui" />
          </TabsContent>
          <TabsContent value="yarn">
            <CodeBlock language="bash" code="yarn add @our-platform/core @our-platform/ui" />
          </TabsContent>
          <TabsContent value="pnpm">
            <CodeBlock language="bash" code="pnpm add @our-platform/core @our-platform/ui" />
          </TabsContent>
        </Tabs>

        <p className="leading-7 mb-4">
          After installation, you'll need to configure your project to use our platform. Create a configuration file in
          the root of your project:
        </p>

        <CodeBlock
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
      </Section>

      <Section id="quick-start" title="Quick Start Guide">
        <p className="leading-7 mb-4">
          Let's create a simple application to demonstrate how to use our platform. First, initialize your project:
        </p>

        <CodeBlock
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

        <div
          className={`p-4 my-6 rounded-lg border border-yellow-200 ${theme === "dark" ? "bg-yellow-900/20" : "bg-yellow-50"}`}
        >
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-yellow-500 dark:text-yellow-400 mb-1">Important</h4>
              <p className="text-sm leading-6">
                Make sure to set up your environment variables before running your application. You can create a{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">.env</code> file in the root of your project.
              </p>
            </div>
          </div>
        </div>
      </Section>

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

        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="#"
                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    <span>Previous: Overview</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Platform Overview</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="#"
                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>Next: Core Concepts</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Core Concepts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Section>
    </div>
  )
}

