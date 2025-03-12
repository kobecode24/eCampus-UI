"use client"

import React from "react"

import { useState } from "react"
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
} from "lucide-react"

export function DocumentationSidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div
      className={`border-r border-indigo-500/20 bg-indigo-900/30 backdrop-blur-md transition-all duration-300 ${isExpanded ? "w-64" : "w-16"}`}
    >
      <div className="p-3 border-b border-indigo-500/20 flex items-center justify-between">
        {isExpanded ? (
          <>
            <h2 className="font-semibold text-indigo-100">Documentation</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-7 w-7 p-0 text-indigo-300 hover:text-white hover:bg-indigo-700/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="h-7 w-7 p-0 mx-auto text-indigo-300 hover:text-white hover:bg-indigo-700/30"
          >
            <ChevronRight className="h-4 w-4" />
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
              className="pl-8 bg-indigo-800/30 border-indigo-500/30 text-white placeholder:text-indigo-400 focus-visible:ring-indigo-500/50"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col h-[calc(100vh-180px)]">
        <ScrollArea className="flex-1">
          {isExpanded ? (
            <div className="p-3">
              <DocumentTree />
            </div>
          ) : (
            <div className="flex flex-col items-center pt-4 gap-4">
              <IconButton icon={<FileText />} tooltip="Documents" />
              <IconButton icon={<FolderPlus />} tooltip="New Folder" />
              <IconButton icon={<FilePlus />} tooltip="New Document" />
            </div>
          )}
        </ScrollArea>

        {isExpanded ? (
          <div className="p-3 border-t border-indigo-500/20">
            <div className="flex flex-col gap-1">
              <NavButton icon={<Home />} label="Dashboard" />
              <NavButton icon={<BookOpen />} label="Documentation" isActive />
              <NavButton icon={<Users />} label="Collaborators" />
              <NavButton icon={<Shield />} label="Moderation" />
              <NavButton icon={<BarChart />} label="Analytics" />
              <NavButton icon={<HelpCircle />} label="Help" />
              <NavButton icon={<Settings />} label="Settings" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 border-t border-indigo-500/20">
            <IconButton icon={<Home />} tooltip="Dashboard" />
            <IconButton icon={<BookOpen />} tooltip="Documentation" isActive />
            <IconButton icon={<Settings />} tooltip="Settings" />
          </div>
        )}
      </div>
    </div>
  )
}

function DocumentTree() {
  return (
    <div className="space-y-1">
      <DocumentFolder
        name="Platform Guidelines"
        isOpen={true}
        documents={[
          { id: "1", name: "Core Documentation", isActive: true },
          { id: "2", name: "Moderation Policies", isActive: false },
          { id: "3", name: "Content Standards", isActive: false },
        ]}
      />
      <DocumentFolder
        name="User Documentation"
        isOpen={false}
        documents={[
          { id: "4", name: "Getting Started", isActive: false },
          { id: "5", name: "Advanced Features", isActive: false },
        ]}
      />
      <DocumentFolder
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
        className="w-full justify-start text-indigo-300 hover:text-white hover:bg-indigo-700/30 pl-3"
      >
        <FolderPlus className="h-4 w-4 mr-2" />
        New Folder
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-indigo-300 hover:text-white hover:bg-indigo-700/30 pl-3"
      >
        <FilePlus className="h-4 w-4 mr-2" />
        New Document
      </Button>
    </div>
  )
}

function DocumentFolder({ name, isOpen, documents }) {
  const [open, setOpen] = useState(isOpen)

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="w-full justify-start text-indigo-100 hover:text-white hover:bg-indigo-700/30"
      >
        {open ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
        {name}
      </Button>

      {open && (
        <div className="ml-4 mt-1 space-y-1">
          {documents.map((doc) => (
            <Button
              key={doc.id}
              variant="ghost"
              size="sm"
              className={`w-full justify-start pl-6 ${
                doc.isActive ? "bg-indigo-700/40 text-white" : "text-indigo-300 hover:text-white hover:bg-indigo-700/30"
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              {doc.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

function NavButton({ icon, label, isActive = false }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`w-full justify-start ${
        isActive ? "bg-indigo-700/40 text-white" : "text-indigo-300 hover:text-white hover:bg-indigo-700/30"
      }`}
    >
      {React.cloneElement(icon, { className: "h-4 w-4 mr-2" })}
      {label}
    </Button>
  )
}

function IconButton({ icon, tooltip, isActive = false }) {
  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 ${
          isActive ? "bg-indigo-700/40 text-white" : "text-indigo-300 hover:text-white hover:bg-indigo-700/30"
        }`}
      >
        {React.cloneElement(icon, { className: "h-4 w-4" })}
      </Button>
      <div className="absolute left-full ml-2 px-2 py-1 bg-indigo-900 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {tooltip}
      </div>
    </div>
  )
}

function ChevronLeft(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

