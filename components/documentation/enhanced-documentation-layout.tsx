"use client"

import { useState, useEffect, useRef, createContext, useContext } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValueEvent } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import {
  Search,
  BookOpen,
  Star,
  Sun,
  Moon,
  Menu,
  X,
  BookMarked,
  Clock,
  Settings,
  ChevronRight,
  Lightbulb,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EnhancedDocSidebar } from "./enhanced-doc-sidebar"
import { EnhancedDocContent } from "./enhanced-doc-content"
import { EnhancedDocRightPanel } from "./enhanced-doc-right-panel"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// Documentation context for sharing state between components
type DocContextType = {
  activeSection: string
  setActiveSection: (section: string) => void
  activePath: string[]
  setActivePath: (path: string[]) => void
  bookmarkedSections: string[]
  toggleBookmark: (sectionId: string) => void
  readSections: string[]
  markSectionAsRead: (sectionId: string) => void
  expandedSections: string[]
  toggleSectionExpansion: (sectionId: string) => void
  viewMode: "default" | "focused" | "presentation"
  setViewMode: (mode: "default" | "focused" | "presentation") => void
  scrollProgress: number
  isSearchOpen: boolean
  setIsSearchOpen: (isOpen: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  cursorVariant: "default" | "link" | "text" | "button" | "copy"
  setCursorVariant: (variant: "default" | "link" | "text" | "button" | "copy") => void
  useStandardScrolling: boolean
  setUseStandardScrolling: (useStandard: boolean) => void
}

const DocContext = createContext<DocContextType | undefined>(undefined)

export const useDocContext = () => {
  const context = useContext(DocContext)
  if (!context) {
    throw new Error("useDocContext must be used within a DocContextProvider")
  }
  return context
}

export function EnhancedDocumentationLayout() {
  const [isClient, setIsClient] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState("introduction")
  const [activePath, setActivePath] = useState<string[]>(["getting-started", "introduction"])
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([])
  const [readSections, setReadSections] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview"])
  const [viewMode, setViewMode] = useState<"default" | "focused" | "presentation">("default")
  const [cursorVariant, setCursorVariant] = useState<"default" | "link" | "text" | "button" | "copy">("default")
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCustomCursor, setShowCustomCursor] = useState(false)
  const [useStandardScrolling, setUseStandardScrolling] = useState(false)

  const mainRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  })

  // Smooth scroll progress for animations
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Background animation based on scroll - make it more subtle
  const backgroundOpacity = useTransform(smoothScrollProgress, [0, 0.5, 1], [0.05, 0.07, 0.1]) // Reduced values
  const backgroundSize = useTransform(smoothScrollProgress, [0, 1], ["100%", "105%"]) // Reduced from 120% to 105%
  const backgroundPosition = useTransform(smoothScrollProgress, [0, 1], ["0% 0%", "2% 2%"]) // Reduced from 10% to 2%

  // Update reading progress as user scrolls - keep this functionality but make it less intrusive
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only update when significant changes occur to reduce re-renders
    if (Math.abs(latest - scrollProgress) > 0.01) {
      setScrollProgress(latest)
    }
  })

  // Toggle bookmark
  const toggleBookmark = (sectionId: string) => {
    setBookmarkedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  // Mark section as read
  const markSectionAsRead = (sectionId: string) => {
    if (!readSections.includes(sectionId)) {
      setReadSections((prev) => [...prev, sectionId])
    }
  }

  // Toggle section expansion
  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  // Handle resize for mobile detection
  useEffect(() => {
    setIsClient(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Try to restore state from localStorage
    try {
      const savedBookmarks = localStorage.getItem("doc-bookmarked-sections")
      if (savedBookmarks) {
        setBookmarkedSections(JSON.parse(savedBookmarks))
      }

      const savedReadSections = localStorage.getItem("doc-read-sections")
      if (savedReadSections) {
        setReadSections(JSON.parse(savedReadSections))
      }

      const savedExpandedSections = localStorage.getItem("doc-expanded-sections")
      if (savedExpandedSections) {
        setExpandedSections(JSON.parse(savedExpandedSections))
      }

      const savedViewMode = localStorage.getItem("doc-view-mode")
      if (savedViewMode) {
        setViewMode(JSON.parse(savedViewMode))
      }
    } catch (error) {
      console.error("Failed to restore state from localStorage:", error)
    }

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Save state to localStorage
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("doc-bookmarked-sections", JSON.stringify(bookmarkedSections))
        localStorage.setItem("doc-read-sections", JSON.stringify(readSections))
        localStorage.setItem("doc-expanded-sections", JSON.stringify(expandedSections))
        localStorage.setItem("doc-view-mode", JSON.stringify(viewMode))
      } catch (error) {
        console.error("Failed to save state to localStorage:", error)
      }
    }
  }, [bookmarkedSections, readSections, expandedSections, viewMode, isClient])

  // Custom cursor effect
  useEffect(() => {
    if (!isClient) return

    const updateCursorPosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => {
      setShowCustomCursor(true)
    }

    const handleMouseLeave = () => {
      setShowCustomCursor(false)
    }

    window.addEventListener("mousemove", updateCursorPosition)
    document.body.addEventListener("mouseenter", handleMouseEnter)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition)
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isClient])

  // Disable custom cursor on mobile
  useEffect(() => {
    if (isMobile) {
      setShowCustomCursor(false)
    }
  }, [isMobile])

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  // Custom cursor variants
  const cursorVariants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: "rgba(var(--primary-rgb), 0.2)",
      border: "2px solid rgba(var(--primary-rgb), 0.5)",
      x: cursorPosition.x - 16,
      y: cursorPosition.y - 16,
    },
    link: {
      width: 40,
      height: 40,
      backgroundColor: "rgba(var(--primary-rgb), 0.3)",
      border: "2px solid rgba(var(--primary-rgb), 0.8)",
      x: cursorPosition.x - 20,
      y: cursorPosition.y - 20,
    },
    button: {
      width: 48,
      height: 48,
      backgroundColor: "rgba(var(--primary-rgb), 0.4)",
      border: "2px solid rgba(var(--primary-rgb), 1)",
      x: cursorPosition.x - 24,
      y: cursorPosition.y - 24,
    },
    text: {
      width: 8,
      height: 32,
      backgroundColor: "rgba(var(--primary-rgb), 0.8)",
      border: "none",
      x: cursorPosition.x - 4,
      y: cursorPosition.y - 16,
    },
    copy: {
      width: 36,
      height: 36,
      backgroundColor: "rgba(var(--primary-rgb), 0.3)",
      border: "2px solid rgba(var(--primary-rgb), 0.8)",
      x: cursorPosition.x - 18,
      y: cursorPosition.y - 18,
    },
  }

  return (
    <DocContext.Provider
      value={{
        activeSection,
        setActiveSection,
        activePath,
        setActivePath,
        bookmarkedSections,
        toggleBookmark,
        readSections,
        markSectionAsRead,
        expandedSections,
        toggleSectionExpansion,
        viewMode,
        setViewMode,
        scrollProgress,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        cursorVariant,
        setCursorVariant,
        useStandardScrolling,
        setUseStandardScrolling,
      }}
    >
      <div
        className={`documentation-container min-h-screen ${viewMode === "focused" ? "focused-mode" : ""} ${useStandardScrolling ? "standard-scroll" : ""}`}
      >
        {/* Custom cursor */}
        {showCustomCursor && !isMobile && (
          <motion.div
            ref={cursorRef}
            className="fixed top-0 left-0 rounded-full pointer-events-none z-50 mix-blend-difference"
            variants={cursorVariants}
            animate={cursorVariant}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 28,
              mass: 0.5,
            }}
          />
        )}

        {/* Animated background */}
        <motion.div
          className={`fixed inset-0 z-[-1] bg-gradient-radial ${
            theme === "dark" ? "from-background to-accent/10" : "from-background to-accent/20"
          }`}
          style={{
            opacity: backgroundOpacity,
            backgroundSize,
            backgroundPosition,
          }}
        />

        {/* Subtle background pattern */}
        <div
          className={`fixed inset-0 z-[-2] opacity-[0.03] pointer-events-none ${theme === "dark" ? "invert" : ""}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Navigation bar */}
        <header
          className={cn(
            "sticky top-0 z-30 w-full backdrop-blur-md border-b border-border",
            theme === "dark" ? "bg-background/80 text-foreground" : "bg-background/80 text-foreground",
            viewMode === "focused" && "opacity-0 pointer-events-none",
          )}
        >
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setCursorVariant("link")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("link")}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <a
                href="/dev-forum"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                onMouseEnter={() => setCursorVariant("link")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl hidden md:inline-block">DevDocs</span>
              </a>
            </motion.div>

            {/* Breadcrumb navigation */}
            <motion.div
              className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <a
                href="/dev-forum"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onMouseEnter={() => setCursorVariant("link")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                Home
              </a>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <a
                href="/dev-forum/documentation"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onMouseEnter={() => setCursorVariant("link")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                Documentation
              </a>
              {activePath.length > 0 && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{activePath[activePath.length - 1]}</span>
                </>
              )}
            </motion.div>

            {/* Search and actions */}
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <Search className="h-5 w-5" />
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="transition-transform hover:scale-110 active:scale-95"
                      onMouseEnter={() => setCursorVariant("button")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Switch to {theme === "dark" ? "light" : "dark"} mode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUseStandardScrolling(!useStandardScrolling)}
                      className="transition-transform hover:scale-110 active:scale-95"
                      onMouseEnter={() => setCursorVariant("button")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      {useStandardScrolling ? <Zap className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{useStandardScrolling ? "Enable enhanced scrolling" : "Use standard scrolling"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex transition-transform hover:scale-110 active:scale-95"
                      onMouseEnter={() => setCursorVariant("button")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <BookMarked className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Your bookmarks</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex transition-transform hover:scale-110 active:scale-95"
                      onMouseEnter={() => setCursorVariant("button")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <Clock className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Reading history</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex transition-transform hover:scale-110 active:scale-95"
                      onClick={() => setViewMode(viewMode === "focused" ? "default" : "focused")}
                      onMouseEnter={() => setCursorVariant("button")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      {viewMode === "focused" ? <Settings className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{viewMode === "focused" ? "Exit focused mode" : "Enter focused mode"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                className="hidden md:flex gap-2 items-center transition-all hover:shadow-md active:scale-95"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <Star className="h-4 w-4" />
                <span>Contribute</span>
              </Button>
            </motion.div>
          </div>

          {/* Reading progress indicator */}
          <motion.div
            className="h-1 bg-primary/80"
            style={{ width: `${scrollProgress * 100}%` }}
            initial={{ width: "0%" }}
            transition={{ ease: "easeOut" }}
          />

          {/* Search overlay */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border z-20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="container mx-auto p-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search documentation..."
                      className="w-full pl-10 pr-10 py-2 rounded-full bg-background border-input focus:ring-2 focus:ring-primary/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      onMouseEnter={() => setCursorVariant("text")}
                      onMouseLeave={() => setCursorVariant("default")}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        onClick={() => setSearchQuery("")}
                        onMouseEnter={() => setCursorVariant("button")}
                        onMouseLeave={() => setCursorVariant("default")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Quick search results */}
                  {searchQuery && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-sm font-medium">Quick Results</h3>
                      <ul className="space-y-1">
                        <li>
                          <a
                            href="#introduction"
                            className="block p-2 rounded-md hover:bg-accent/50 transition-colors"
                            onClick={() => setIsSearchOpen(false)}
                            onMouseEnter={() => setCursorVariant("link")}
                            onMouseLeave={() => setCursorVariant("default")}
                          >
                            <div className="font-medium">Introduction</div>
                            <div className="text-sm text-muted-foreground">Getting started with our platform</div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="#installation"
                            className="block p-2 rounded-md hover:bg-accent/50 transition-colors"
                            onClick={() => setIsSearchOpen(false)}
                            onMouseEnter={() => setCursorVariant("link")}
                            onMouseLeave={() => setCursorVariant("default")}
                          >
                            <div className="font-medium">Installation</div>
                            <div className="text-sm text-muted-foreground">How to install and set up the platform</div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main content */}
        <div className="container mx-auto px-0 flex flex-col md:flex-row">
          <SidebarProvider>
            <EnhancedDocSidebar />
            <main
              ref={mainRef}
              className={cn(
                "flex-1 min-h-[calc(100vh-4rem)] pt-6 pb-20 md:px-8 transition-all duration-500",
                viewMode === "focused" && "md:px-16 lg:px-32",
              )}
            >
              <EnhancedDocContent />
            </main>
            {viewMode !== "focused" && <EnhancedDocRightPanel />}
          </SidebarProvider>
        </div>

        {/* Quick actions floating button (visible in focused mode) */}
        {viewMode === "focused" && (
          <motion.div
            className="fixed bottom-6 right-6 z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg"
                    onClick={() => setViewMode("default")}
                    onMouseEnter={() => setCursorVariant("button")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    <Zap className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Exit focused mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </div>
    </DocContext.Provider>
  )
}

