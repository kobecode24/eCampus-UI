"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, Users, History, Settings, Eye, Edit, ChevronDown, Share2, FileText, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DocumentationHeaderProps {
  title: string
  onTitleChange: (title: string) => void
  documentStatus: string
  collaborators: number
}

export function DocumentationHeader({ title, onTitleChange, documentStatus, collaborators }: DocumentationHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localTitle, setLocalTitle] = useState<string>(title || "")

  const handleTitleChange = () => {
    onTitleChange(localTitle || "")
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleChange()
    }
  }

  return (
    <header className="border-b border-indigo-500/20 bg-indigo-900/30 backdrop-blur-md p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 flex-1">
          <FileText className="h-6 w-6 text-indigo-300" />

          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={handleTitleChange}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-indigo-800/30 border border-indigo-500/30 rounded px-2 py-1 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleTitleChange}
                className="text-indigo-300 hover:text-white hover:bg-indigo-700/30"
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-white">{title}</h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-indigo-300 hover:text-white hover:bg-indigo-700/30"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-indigo-300 hover:text-white hover:bg-indigo-700/30">
            <History className="h-4 w-4 mr-1" />
            History
          </Button>

          <Button size="sm" variant="ghost" className="text-indigo-300 hover:text-white hover:bg-indigo-700/30">
            <Users className="h-4 w-4 mr-1" />
            Collaborators ({collaborators})
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="text-indigo-300 hover:text-white hover:bg-indigo-700/30">
                <Share2 className="h-4 w-4 mr-1" />
                Share
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-indigo-900/90 backdrop-blur-md border-indigo-500/30 text-white">
              <DropdownMenuLabel>Share Options</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-indigo-500/20" />
              <DropdownMenuItem className="hover:bg-indigo-700/50 focus:bg-indigo-700/50">
                Share with moderators
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-indigo-700/50 focus:bg-indigo-700/50">
                Share with admins
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-indigo-700/50 focus:bg-indigo-700/50">
                Get shareable link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" variant="ghost" className="text-indigo-300 hover:text-white hover:bg-indigo-700/30">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>

          <Button size="sm" variant="ghost" className="text-indigo-300 hover:text-white hover:bg-indigo-700/30">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>

          <Button size="sm" variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="text-indigo-300 hover:text-white hover:bg-indigo-700/30">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-indigo-900/90 backdrop-blur-md border-indigo-500/30 text-white">
              <DropdownMenuItem className="hover:bg-indigo-700/50 focus:bg-indigo-700/50">
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-indigo-700/50 focus:bg-indigo-700/50">
                Export as Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-indigo-500/20" />
              <DropdownMenuItem className="hover:bg-indigo-700/50 focus:bg-indigo-700/50">
                Duplicate document
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-indigo-700/50 focus:bg-indigo-700/50 text-red-400">
                Delete document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

