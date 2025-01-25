"use client"

import { useState } from "react"
import { ForumHeader } from "@/components/forum-header"
import { CourseDiscoveryBanner } from "@/components/course-discovery-banner"
import { CourseGrid } from "@/components/course-grid"
import { CourseFilterSidebar } from "@/components/course-filter-sidebar"
import { LearningPathIntegration } from "@/components/learning-path-integration"
import { CourseStats } from "@/components/course-stats"
import { Button } from "@/components/ui/button"
import { Grid, List, ArrowUpDown } from "lucide-react"

export function CoursesCatalogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("popularity")

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ForumHeader />
      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">
          Course Catalog
        </h1>
        <CourseDiscoveryBanner />
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="lg:w-1/4">
            <CourseFilterSidebar />
          </div>
          <div className="lg:w-3/4">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <select
                  className="bg-white bg-opacity-10 text-white rounded-md px-2 py-1"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="latest">Latest</option>
                  <option value="xp_value">XP Value</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
              <Button variant="outline" className="text-white">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Compare Courses
              </Button>
            </div>
            <CourseGrid viewMode={viewMode} sortOption={sortOption} />
          </div>
        </div>
        <LearningPathIntegration />
        <CourseStats />
      </main>
    </div>
  )
}

