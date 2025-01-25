import { CourseCard } from "@/components/course-card"

interface CourseGridProps {
  viewMode: "grid" | "list"
  sortOption: string
}

const courses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    description: "Master advanced React patterns and build scalable applications.",
    thumbnail: "/course-thumbnails/react.png",
    difficulty: "Advanced",
    xpReward: 5000,
    instructor: "Jane Doe",
    instructorReputation: "Expert",
    progress: 0,
    completionRate: 85,
    studentCount: 1500,
    rating: 4.8,
    duration: "4 weeks",
    techTokens: 500,
    techStack: ["React", "Redux", "TypeScript"],
    prerequisites: ["Intermediate React", "Basic TypeScript"],
  },
  // Add more course objects here...
]

export function CourseGrid({ viewMode, sortOption }: CourseGridProps) {
  const sortedCourses = [...courses].sort((a, b) => {
    if (sortOption === "popularity") return b.studentCount - a.studentCount
    if (sortOption === "latest") return 0 // Assume all courses are latest for this example
    if (sortOption === "xp_value") return b.xpReward - a.xpReward
    if (sortOption === "difficulty") return a.difficulty.localeCompare(b.difficulty)
    if (sortOption === "duration") return a.duration.localeCompare(b.duration)
    return 0
  })

  return (
    <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
      {sortedCourses.map((course) => (
        <CourseCard key={course.id} course={course} viewMode={viewMode} />
      ))}
    </div>
  )
}

