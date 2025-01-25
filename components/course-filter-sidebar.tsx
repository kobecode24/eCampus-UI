import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function CourseFilterSidebar() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="technology">
        <AccordionTrigger>Technology Stacks</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox id="react" />
              <Label htmlFor="react" className="ml-2">
                React
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="node" />
              <Label htmlFor="node" className="ml-2">
                Node.js
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="python" />
              <Label htmlFor="python" className="ml-2">
                Python
              </Label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="difficulty">
        <AccordionTrigger>Difficulty</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox id="beginner" />
              <Label htmlFor="beginner" className="ml-2">
                Beginner
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="intermediate" />
              <Label htmlFor="intermediate" className="ml-2">
                Intermediate
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="advanced" />
              <Label htmlFor="advanced" className="ml-2">
                Advanced
              </Label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="duration">
        <AccordionTrigger>Duration</AccordionTrigger>
        <AccordionContent>
          <Slider defaultValue={[4]} max={12} step={1} />
          <div className="flex justify-between text-sm mt-1">
            <span>1 week</span>
            <span>12 weeks</span>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="xp">
        <AccordionTrigger>Tech Tokens Required</AccordionTrigger>
        <AccordionContent>
          <Slider defaultValue={[500]} max={2000} step={100} />
          <div className="flex justify-between text-sm mt-1">
            <span>0 TT</span>
            <span>2000 TT</span>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="language">
        <AccordionTrigger>Language</AccordionTrigger>
        <AccordionContent>
          <select className="w-full bg-white bg-opacity-10 rounded-md px-2 py-1">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="certification">
        <AccordionTrigger>Certification</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center">
            <Checkbox id="certification" />
            <Label htmlFor="certification" className="ml-2">
              Include certified courses
            </Label>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="rating">
        <AccordionTrigger>Minimum Rating</AccordionTrigger>
        <AccordionContent>
          <Slider defaultValue={[4]} max={5} step={0.1} />
          <div className="flex justify-between text-sm mt-1">
            <span>1 star</span>
            <span>5 stars</span>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="availability">
        <AccordionTrigger>Availability</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox id="available" />
              <Label htmlFor="available" className="ml-2">
                Currently Available
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="upcoming" />
              <Label htmlFor="upcoming" className="ml-2">
                Upcoming
              </Label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

