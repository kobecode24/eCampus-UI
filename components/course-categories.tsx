import { Button } from "@/components/ui/button"

const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cybersecurity",
]

export function CourseCategories() {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button key={category} variant="outline" size="sm">
          {category}
        </Button>
      ))}
    </div>
  )
}

