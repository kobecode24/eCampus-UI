"use client"

import { ForumHeader } from "@/components/forum-header"
import { DocumentationPortal } from "@/components/moderator/documentation-portal"
import { AdminGuard } from "@/components/guards/AdminGuard"

export default function ModeratorDocumentationPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A192F] to-[#663399] text-white">
        <ForumHeader />
        <div className="flex-grow">
          <DocumentationPortal />
        </div>
      </div>
    </AdminGuard>
  )
}

