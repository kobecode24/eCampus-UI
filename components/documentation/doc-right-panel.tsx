"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, List, ExternalLink, MessageSquare, ThumbsUp, ThumbsDown, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/contexts/theme-context"

export function DocRightPanel() {
  const { theme } = useTheme()
  const [isClient, setIsClient] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["on-this-page", "related-docs"])

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)

    // Try to restore expanded sections from local storage
    try {
      const savedSections = localStorage.getItem("doc-right-panel-expanded")
      if (savedSections) {
        setExpandedSections(JSON.parse(savedSections))
      }
    } catch (error) {
      console.error("Failed to restore expanded sections:", error)
    }
  }, [])

  // Save expanded sections to local storage
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("doc-right-panel-expanded", JSON.stringify(expandedSections))
      } catch (error) {
        console.error("Failed to save expanded sections:", error)
      }
    }
  }, [expandedSections, isClient])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  if (!isClient) {
    return null
  }

  return (
    <div
      className={`hidden lg:block w-64 shrink-0 border-l border-border ${theme === "dark" ? "bg-background/80" : "bg-background/90"}`}
    >
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4">
          {/* On This Page */}
          <Collapsible
            open={expandedSections.includes("on-this-page")}
            onOpenChange={() => toggleSection("on-this-page")}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">On This Page</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.includes("on-this-page") ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="mt-2 space-y-1 pl-6">
                <li>
                  <a
                    href="#introduction"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Introduction
                  </a>
                </li>
                <li>
                  <a
                    href="#installation"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Installation
                  </a>
                </li>
                <li>
                  <a href="#quick-start" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Quick Start Guide
                  </a>
                </li>
                <li>
                  <a
                    href="#architecture"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Architecture Overview
                  </a>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          {/* Related Docs */}
          <Collapsible
            open={expandedSections.includes("related-docs")}
            onOpenChange={() => toggleSection("related-docs")}
            className="mt-4"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Related Docs</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.includes("related-docs") ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="mt-2 space-y-3 pl-6">
                <li>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    <div className="font-medium">Core Concepts</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Understanding the fundamentals</div>
                  </a>
                </li>
                <li>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    <div className="font-medium">API Reference</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Detailed API documentation</div>
                  </a>
                </li>
                <li>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    <div className="font-medium">Tutorials</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Step-by-step guides</div>
                  </a>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          {/* Feedback */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium mb-3">Was this page helpful?</h4>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>This page was helpful</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>This page needs improvement</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Leave feedback</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Share this page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Reading Stats */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium mb-3">Reading Stats</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Reading time:</span>
                <span>8 min</span>
              </div>
              <div className="flex justify-between">
                <span>Word count:</span>
                <span>1,245</span>
              </div>
              <div className="flex justify-between">
                <span>Last updated:</span>
                <span>2 days ago</span>
              </div>
            </div>
          </div>

          {/* Contributors */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium mb-3">Contributors</h4>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                JD
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium">
                MK
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-medium">
                TS
              </div>
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs font-medium">
                +2
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

