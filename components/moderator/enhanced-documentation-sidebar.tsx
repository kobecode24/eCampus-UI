"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronDown,
  ChevronRight,
  FileText,
  FolderPlus,
  FilePlus,
  Search,
  Settings,
  Home,
  BookOpen,
  Users,
  Shield,
  BarChart,
  HelpCircle,
  PanelLeft,
  Sparkles,
} from "lucide-react"

export function EnhancedDocumentationSidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Apply parallax effect to sidebar content
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5

        const elements = sidebarRef.current.querySelectorAll(".parallax-element")
        elements.forEach((el) => {
          const depth = Number.parseFloat(el.getAttribute("data-depth") || "0")
          const translateX = x * depth * 10
          const translateY = y * depth * 10
          ;(el as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px)`
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={sidebarRef}
      className={`border-r border-indigo-500/20 bg-indigo-900/30 backdrop-blur-md transition-all duration-500 ease-in-out ${isExpanded ? "w-64" : "w-16"}`}
    >
      <div className="p-3 border-b border-indigo-500/20 flex items-center justify-between">
        {isExpanded ? (
          <>
            <h2 className="font-semibold text-indigo-100 glow-text">Documentation</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-7 w-7 p-0 text-indigo-300 hover:text-white hover:bg-indigo-700/30 animated-button"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="h-7 w-7 p-0 mx-auto text-indigo-300 hover:text-white hover:bg-indigo-700/30 animated-button"
          >
            <PanelLeft className="h-4 w-4 transform rotate-180" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="p-3 border-b border-indigo-500/20">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-indigo-800/30 border-indigo-500/30 text-white placeholder:text-indigo-400 focus-visible:ring-indigo-500/50 animated-button"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col h-[calc(100vh-180px)]">
        <ScrollArea className="flex-1 custom-scrollbar">
          {isExpanded ? (
            <div className="p-3">
              <EnhancedDocumentTree />
            </div>
          ) : (
            <div className="flex flex-col items-center pt-4 gap-4">
              <EnhancedIconButton icon={<FileText />} tooltip="Documents" />
              <EnhancedIconButton icon={<FolderPlus />} tooltip="New Folder" />
              <EnhancedIconButton icon={<FilePlus />} tooltip="New Document" />
            </div>
          )}
        </ScrollArea>

        {isExpanded ? (
          <div className="p-3 border-t border-indigo-500/20">
            <div className="flex flex-col gap-1">
              <EnhancedNavButton icon={<Home />} label="Dashboard" />
              <EnhancedNavButton icon={<BookOpen />} label="Documentation" isActive />
              <EnhancedNavButton icon={<Users />} label="Collaborators" />
              <EnhancedNavButton icon={<Shield />} label="Moderation" />
              <EnhancedNavButton icon={<BarChart />} label="Analytics" />
              <EnhancedNavButton icon={<HelpCircle />} label="Help" />
              <EnhancedNavButton icon={<Settings />} label="Settings" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 border-t border-indigo-500/20">
            <EnhancedIconButton icon={<Home />} tooltip="Dashboard" />
            <EnhancedIconButton icon={<BookOpen />} tooltip="Documentation" isActive />
            <EnhancedIconButton icon={<Settings />} tooltip="Settings" />
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-4 left-4 opacity-30 parallax-element" data-depth="0.5">
        <Sparkles className="h-6 w-6 text-indigo-300" />
      </div>
      <div className="absolute top-20 right-4 opacity-20 parallax-element" data-depth="0.8">
        <Sparkles className="h-4 w-4 text-indigo-300" />
      </div>
    </div>
  )
}

function EnhancedDocumentTree() {
  return (
    <div className="space-y-1">
      <EnhancedDocumentFolder
        name="Platform Guidelines"
        isOpen={true}
        documents={[
          { id: "1", name: "Core Documentation", isActive: true },
          { id: "2", name: "Moderation Policies", isActive: false },
          { id: "3", name: "Content Standards", isActive: false },
        ]}
      />
      <EnhancedDocumentFolder
        name="User Documentation"
        isOpen={false}
        documents={[
          { id: "4", name: "Getting Started", isActive: false },
          { id: "5", name: "Advanced Features", isActive: false },
        ]}
      />
      <EnhancedDocumentFolder
        name="API Documentation"
        isOpen={false}
        documents={[
          { id: "6", name: "Authentication", isActive: false },
          { id: "7", name: "Endpoints", isActive: false },
          { id: "8", name: "Rate Limits", isActive: false },
        ]}
      />
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-indigo-300 hover:text-white hover:bg-indigo-700/30 pl-3 animated-button"
      >
        <FolderPlus className="h-4 w-4 mr-2" />
        New Folder
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-indigo-300 hover:text-white hover:bg-indigo-700/30 pl-3 animated-button"
      >
        <FilePlus className="h-4 w-4 mr-2" />
        New Document
      </Button>
    </div>
  )
}

function EnhancedDocumentFolder({ name, isOpen, documents }) {
  const [open, setOpen] = useState(isOpen)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="w-full justify-start text-indigo-100 hover:text-white hover:bg-indigo-700/30 animated-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {open ? (
          <ChevronDown
            className={`h-4 w-4 mr-2 transition-transform duration-300 ${isHovered ? "text-indigo-400" : ""}`}
          />
        ) : (
          <ChevronRight
            className={`h-4 w-4 mr-2 transition-transform duration-300 ${isHovered ? "text-indigo-400" : ""}`}
          />
        )}
        {name}
      </Button>

      <div
        className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {documents.map((doc) => (
          <Button
            key={doc.id}
            variant="ghost"
            size="sm"
            className={`w-full justify-start pl-6 transition-all duration-300 ${
              doc.isActive
                ? "bg-indigo-700/40 text-white glow-text"
                : "text-indigo-300 hover:text-white hover:bg-indigo-700/30"
            }`}
          >
            <FileText className={`h-4 w-4 mr-2 transition-all duration-300 ${doc.isActive ? "text-indigo-400" : ""}`} />
            {doc.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

function EnhancedNavButton({ icon, label, isActive = false }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`w-full justify-start transition-all duration-300 ${
        isActive ? "bg-indigo-700/40 text-white glow-text" : "text-indigo-300 hover:text-white hover:bg-indigo-700/30"
      } ${isHovered ? "translate-x-1" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {React.cloneElement(icon, {
        className: `h-4 w-4 mr-2 transition-all duration-300 ${isActive ? "text-indigo-400" : ""} ${isHovered ? "scale-110" : ""}`,
      })}
      {label}
    </Button>
  )
}

function EnhancedIconButton({ icon, tooltip, isActive = false }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 transition-all duration-300 ${
          isActive ? "bg-indigo-700/40 text-white" : "text-indigo-300 hover:text-white hover:bg-indigo-700/30"
        } ${isHovered ? "scale-110" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {React.cloneElement(icon, {
          className: `h-4 w-4 transition-all duration-300 ${isActive ? "text-indigo-400" : ""}`,
        })}
      </Button>
      <div className="absolute left-full ml-2 px-2 py-1 bg-indigo-900 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 glass-panel">
        {tooltip}
      </div>
    </div>
  )
}

