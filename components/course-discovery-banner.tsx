import { Search, Zap, Map, BarChart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CourseDiscoveryBanner() {
  return (
    <Card className="bg-gradient-to-r from-purple-700 to-pink-600 text-white p-6 rounded-lg shadow-lg">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4 text-white">Discover Your Next Learning Adventure</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow">
            <Input
              type="text"
              placeholder="Search courses..."
              className="w-full bg-white bg-opacity-20 border-none text-white placeholder-gray-300"
            />
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-purple-700 font-semibold"
          >
            <Zap className="mr-2 h-4 w-4" /> AI Recommendations
          </Button>
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-purple-700 font-semibold"
          >
            <Map className="mr-2 h-4 w-4" /> Learning Paths
          </Button>
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-purple-700 font-semibold"
          >
            <BarChart className="mr-2 h-4 w-4" /> Skill Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

