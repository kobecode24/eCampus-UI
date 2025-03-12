"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, BookOpen, Code, Package, Server, Database, Layout, Search, Home, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme } from "@/contexts/theme-context"

// The structured sidebar data
const sidebarData = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: Home,
    items: [
      { id: "introduction", label: "Introduction", isActive: true },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start Guide" },
      { id: "architecture", label: "Architecture Overview" },
    ],
  },
  {
    id: "core-concepts",
    label: "Core Concepts",
    icon: BookOpen,
    items: [
      { id: "components", label: "Components" },
      { id: "data-model", label: "Data Model" },
      { id: "state-management", label: "State Management" },
      { id: "routing", label: "Routing" },
    ],
  },
  {
    id: "api-reference",
    label: "API Reference",
    icon: Server,
    items: [
      { id: "rest-api", label: "REST API" },
      { id: "graphql", label: "GraphQL" },
      { id: "webhooks", label: "Webhooks" },
      { id: "authentication", label: "Authentication" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    icon: Layout,
    items: [
      { id: "ui-components", label: "UI Components" },
      { id: "styling", label: "Styling" },
      { id: "animations", label: "Animations" },
      { id: "forms", label: "Forms" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: Database,
    items: [
      { id: "database", label: "Database" },
      { id: "server", label: "Server" },
      { id: "authentication", label: "Authentication" },
      { id: "deployment", label: "Deployment" },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: Code,
    items: [
      { id: "optimization", label: "Optimization" },
      { id: "security", label: "Security" },
      { id: "testing", label: "Testing" },
      { id: "monitoring", label: "Monitoring" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    icon: Package,
    items: [
      { id: "examples", label: "Examples" },
      { id: "tutorials", label: "Tutorials" },
      { id: "faqs", label: "FAQs" },
      { id: "community", label: "Community" },
    ],
  },
]

export function DocSidebar() {
  const [isClient, setIsClient] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["getting-started"])
  const [filterText, setFilterText] = useState("")
  const { state } = useSidebar()
  const { theme } = useTheme()

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
  }, [])

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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
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

  return (
    <Sidebar
      className={`border-r border-border overflow-hidden ${theme === "dark" ? "bg-background/80" : "bg-background/90"}`}
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
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8.5rem)]">
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
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent/50 rounded-md transition-all">
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedCategories.includes(category.id) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {category.items.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton isActive={item.isActive} className="pl-8 py-1.5 text-sm transition-all">
                            <a href={`#${item.id}`}>{item.label}</a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex flex-col space-y-2">
          <div className="text-xs text-muted-foreground">
            <span className="block">Last updated: April 2024</span>
            <span className="block mt-1">Documentation version 2.0</span>
          </div>

          <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
            <Eye className="h-3 w-3" />
            <span>View on GitHub</span>
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

