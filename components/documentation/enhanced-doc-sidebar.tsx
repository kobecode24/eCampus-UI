"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Server, Database, Layout, Search, Home, Eye, Layers, Cpu, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme } from "@/contexts/theme-context"
import { useDocContext } from "./enhanced-documentation-layout"
import { cn } from "@/lib/utils"

// Enhanced sidebar data with icons and metadata
const sidebarData = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: Home,
    description: "Introduction and setup guides",
    items: [
      { id: "introduction", label: "Introduction", isNew: false, isUpdated: false },
      { id: "installation", label: "Installation", isNew: false, isUpdated: true },
      { id: "quick-start", label: "Quick Start Guide", isNew: false, isUpdated: false },
      { id: "architecture", label: "Architecture Overview", isNew: true, isUpdated: false },
    ],
  },
  {
    id: "core-concepts",
    label: "Core Concepts",
    icon: Layers,
    description: "Fundamental concepts and principles",
    items: [
      { id: "components", label: "Components", isNew: false, isUpdated: false },
      { id: "data-model", label: "Data Model", isNew: false, isUpdated: false },
      { id: "state-management", label: "State Management", isNew: false, isUpdated: true },
      { id: "routing", label: "Routing", isNew: false, isUpdated: false },
    ],
  },
  {
    id: "api-reference",
    label: "API Reference",
    icon: Server,
    description: "Detailed API documentation",
    items: [
      { id: "rest-api", label: "REST API", isNew: false, isUpdated: false },
      { id: "graphql", label: "GraphQL", isNew: true, isUpdated: false },
      { id: "webhooks", label: "Webhooks", isNew: false, isUpdated: false },
      { id: "authentication", label: "Authentication", isNew: false, isUpdated: true },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    icon: Layout,
    description: "User interface components and design",
    items: [
      { id: "ui-components", label: "UI Components", isNew: false, isUpdated: false },
      { id: "styling", label: "Styling", isNew: false, isUpdated: false },
      { id: "animations", label: "Animations", isNew: true, isUpdated: false },
      { id: "forms", label: "Forms", isNew: false, isUpdated: false },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: Database,
    description: "Server-side implementation details",
    items: [
      { id: "database", label: "Database", isNew: false, isUpdated: false },
      { id: "server", label: "Server", isNew: false, isUpdated: true },
      { id: "authentication", label: "Authentication", isNew: false, isUpdated: false },
      { id: "deployment", label: "Deployment", isNew: false, isUpdated: false },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: Cpu,
    description: "Advanced techniques and optimizations",
    items: [
      { id: "optimization", label: "Optimization", isNew: false, isUpdated: false },
      { id: "security", label: "Security", isNew: false, isUpdated: true },
      { id: "testing", label: "Testing", isNew: false, isUpdated: false },
      { id: "monitoring", label: "Monitoring", isNew: true, isUpdated: false },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    icon: Globe,
    description: "Additional resources and references",
    items: [
      { id: "examples", label: "Examples", isNew: false, isUpdated: false },
      { id: "tutorials", label: "Tutorials", isNew: false, isUpdated: false },
      { id: "faqs", label: "FAQs", isNew: false, isUpdated: false },
      { id: "community", label: "Community", isNew: false, isUpdated: false },
    ],
  },
]

export function EnhancedDocSidebar() {
  const [isClient, setIsClient] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["getting-started"])
  const [filterText, setFilterText] = useState<string>("")
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { state } = useSidebar()
  const { theme } = useTheme()
  const { activeSection, setActiveSection, activePath, setActivePath, readSections, viewMode, setCursorVariant } =
    useDocContext()

  // Refs for keyboard navigation
  const sidebarRef = useRef<HTMLDivElement>(null)
  const focusedItemRef = useRef<HTMLAnchorElement>(null)

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)

    // Try to restore expanded categories from local storage
    try {
      const savedCategories = localStorage.getItem("doc-expanded-categories")
      if (savedCategories) {
        setExpandedCategories(JSON.parse(savedCategories))
      }
    } catch (error) {
      console.error("Failed to restore expanded categories:", error)
    }

    // Set up keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sidebarRef.current || !document.activeElement) return

      // Only handle keyboard navigation when sidebar is focused
      if (!sidebarRef.current.contains(document.activeElement)) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          navigateVertically(1)
          break
        case "ArrowUp":
          e.preventDefault()
          navigateVertically(-1)
          break
        case "ArrowRight":
          e.preventDefault()
          if (document.activeElement.getAttribute("aria-expanded") === "false") {
            ;(document.activeElement as HTMLElement).click()
          }
          break
        case "ArrowLeft":
          e.preventDefault()
          if (document.activeElement.getAttribute("aria-expanded") === "true") {
            ;(document.activeElement as HTMLElement).click()
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Keyboard navigation helper
  const navigateVertically = (direction: number) => {
    const focusableElements = Array.from(
      sidebarRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') || [],
    ) as HTMLElement[]

    const currentIndex = focusableElements.findIndex((el) => el === document.activeElement)
    if (currentIndex === -1) return

    const nextIndex = (currentIndex + direction + focusableElements.length) % focusableElements.length
    focusableElements[nextIndex].focus()
  }

  // Save expanded categories to local storage
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("doc-expanded-categories", JSON.stringify(expandedCategories))
      } catch (error) {
        console.error("Failed to save expanded categories:", error)
      }
    }
  }, [expandedCategories, isClient])

  // Handle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Handle item selection
  const handleItemClick = (categoryId: string, itemId: string) => {
    setActiveSection(itemId)
    setActivePath([categoryId, itemId])
  }

  // Filter categories based on search text
  const filteredCategories = sidebarData
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.label.toLowerCase().includes(filterText.toLowerCase())),
    }))
    .filter((category) => category.items.length > 0)

  if (!isClient) {
    return null
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  // If in focused mode, hide the sidebar
  if (viewMode === "focused") {
    return null
  }

  return (
    <Sidebar
      ref={sidebarRef}
      className={`border-r border-border overflow-hidden transition-all duration-300 ${
        theme === "dark" ? "bg-background/80" : "bg-background/90"
      }`}
      variant="sidebar"
      collapsible="offcanvas"
    >
      <SidebarHeader className="border-b border-border">
        <div className="flex flex-col space-y-2 p-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter docs..."
              className="w-full pl-9 h-9"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8.5rem)]">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="py-2">
            {filteredCategories.map((category) => (
              <Collapsible
                key={category.id}
                open={expandedCategories.includes(category.id)}
                onOpenChange={(isOpen) => {
                  if (isOpen) {
                    setExpandedCategories((prev) => [...prev, category.id])
                  } else {
                    setExpandedCategories((prev) => prev.filter((id) => id !== category.id))
                  }
                }}
                className="group transition-all duration-200"
              >
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger
                      className={cn(
                        "flex w-full items-center justify-between p-2 rounded-md transition-all",
                        "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                        hoveredCategory === category.id && "bg-accent/30",
                      )}
                      onMouseEnter={() => {
                        setHoveredCategory(category.id)
                        setCursorVariant("button")
                      }}
                      onMouseLeave={() => {
                        setHoveredCategory(null)
                        setCursorVariant("default")
                      }}
                      aria-expanded={expandedCategories.includes(category.id)}
                    >
                      <motion.div className="flex items-center gap-2" variants={itemVariants}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-md",
                            activePath[0] === category.id ? "bg-primary/20 text-primary" : "text-muted-foreground",
                          )}
                        >
                          <category.icon className="h-4 w-4" />
                        </motion.div>
                        <span className="text-sm font-medium">{category.label}</span>
                      </motion.div>
                      <motion.div
                        animate={{
                          rotate: expandedCategories.includes(category.id) ? 180 : 0,
                          scale: hoveredCategory === category.id ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>

                  <CollapsibleContent>
                    <AnimatePresence>
                      {expandedCategories.includes(category.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <SidebarGroupContent>
                            <div className="pl-8 pr-2 py-1 text-xs text-muted-foreground">{category.description}</div>
                            <SidebarMenu>
                              {category.items.map((item) => {
                                const isActive = activeSection === item.id
                                const isRead = readSections.includes(item.id)

                                return (
                                  <SidebarMenuItem key={item.id}>
                                    <motion.div whileHover={{ x: 4 }} className="relative">
                                      {/* Active indicator line */}
                                      {isActive && (
                                        <motion.div
                                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"
                                          layoutId="activeIndicator"
                                          initial={{ height: 0 }}
                                          animate={{ height: "100%" }}
                                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                      )}

                                      <a
                                        href={`#${item.id}`}
                                        ref={isActive ? focusedItemRef : null}
                                        className={cn(
                                          "flex items-center gap-2 pl-8 py-1.5 text-sm rounded-md transition-all",
                                          "focus:outline-none focus:ring-2 focus:ring-primary/20",
                                          isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-accent/30 hover:text-foreground",
                                          hoveredItem === item.id && "bg-accent/20",
                                          isRead && !isActive && "text-muted-foreground/70",
                                        )}
                                        onClick={() => handleItemClick(category.id, item.id)}
                                        onMouseEnter={() => {
                                          setHoveredItem(item.id)
                                          setCursorVariant("link")
                                        }}
                                        onMouseLeave={() => {
                                          setHoveredItem(null)
                                          setCursorVariant("default")
                                        }}
                                      >
                                        <span className="relative">
                                          {item.label}

                                          {/* Status indicators */}
                                          <span className="flex absolute -right-6 top-0">
                                            {item.isNew && (
                                              <Badge
                                                variant="outline"
                                                className="text-[0.6rem] h-4 px-1 border-green-500 text-green-500 font-medium"
                                              >
                                                NEW
                                              </Badge>
                                            )}
                                            {item.isUpdated && !item.isNew && (
                                              <Badge
                                                variant="outline"
                                                className="text-[0.6rem] h-4 px-1 border-blue-500 text-blue-500 font-medium"
                                              >
                                                UPDATED
                                              </Badge>
                                            )}
                                          </span>
                                        </span>
                                      </a>
                                    </motion.div>
                                  </SidebarMenuItem>
                                )
                              })}
                            </SidebarMenu>
                          </SidebarGroupContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ))}
          </motion.div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex flex-col space-y-2">
          <div className="text-xs text-muted-foreground">
            <span className="block">Last updated: April 2024</span>
            <span className="block mt-1">Documentation version 2.0</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 gap-2"
            onMouseEnter={() => setCursorVariant("button")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <Eye className="h-3 w-3" />
            <span>View on GitHub</span>
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

