import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CourseSearchBar() {
  return (
    <div className="relative flex w-full max-w-sm items-center">
      <Input
        type="text"
        placeholder="Search courses..."
        className="pr-10 bg-white bg-opacity-10 text-white placeholder-gray-400"
      />
      <Button size="icon" className="absolute right-0 top-0 bottom-0">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}

