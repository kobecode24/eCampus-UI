import { ArrowBigUp, ArrowBigDown, MessageSquare, Code, Users, Clock, Coins, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QuickCoursePreview } from "@/components/quick-course-preview"

interface CourseCardProps {
  course: {
    id: number
    title: string
    description: string
    thumbnail: string
    difficulty: string
    xpReward: number
    instructor: string
    instructorReputation: string
    progress: number
    completionRate: number
    studentCount: number
    rating: number
    duration: string
    techTokens: number
    techStack: string[]
    prerequisites: string[]
  }
  viewMode: "grid" | "list"
}

export function CourseCard({ course, viewMode }: CourseCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white ${viewMode === "list" ? "flex" : ""}`}
    >
      <div className={viewMode === "list" ? "w-1/3" : ""}>
        <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} className="w-full h-40 object-cover" />
      </div>
      <div className={viewMode === "list" ? "w-2/3" : ""}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-white">{course.title}</CardTitle>
            <Badge
              variant="default"
              className="ml-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white border-none"
            >
              {course.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4 text-white">{course.description}</p>
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{course.instructor[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-white">{course.instructor}</span>
            <Badge variant="secondary" className="text-secondary-foreground">
              {course.instructorReputation}
            </Badge>
          </div>
          <Progress value={course.progress} className="mb-2" />
          <div className="flex justify-between text-sm mb-2">
            <span>{course.completionRate}% completion rate</span>
            <span>
              <Users className="inline mr-1" size={16} />
              {course.studentCount}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>
              <Award className="inline mr-1" size={16} />
              {course.rating}
            </span>
            <span>
              <Clock className="inline mr-1" size={16} />
              {course.duration}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {course.techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-white bg-white bg-opacity-20">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="text-sm mb-2">
            <strong>Prerequisites:</strong> {course.prerequisites.join(", ")}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2">
          <div className="flex items-center text-white">
            <Coins className="mr-1" size={16} />
            <span>{course.techTokens} TT</span>
          </div>
          <div className="flex items-center text-white">
            <Code className="mr-1" size={16} />
            <span>{course.xpReward} XP</span>
          </div>
          <div className="flex space-x-2">
            <QuickCoursePreview course={course} />
            <Button className="text-white">{course.progress > 0 ? "Continue" : "Enroll"}</Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}

