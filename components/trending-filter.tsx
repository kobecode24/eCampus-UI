"use client"

import { Button } from "@/components/ui/button"
import { Flame, Clock, Star } from 'lucide-react'

// Define the filter options type to match the sort options
type FilterOption = "trending" | "latest" | "most-commented";

// Create a mapping between filter names and sort options
const filterToSortMap: Record<string, FilterOption> = {
  "Hot": "trending",
  "New": "latest",
  "Top Commented": "most-commented"
};

// Reverse mapping for displaying the correct filter when sort changes
const sortToFilterMap: Record<string, string> = {
  "trending": "Hot",
  "latest": "New",
  "most-commented": "Top Commented"
};

const trendingFilters = [
  { name: 'Hot', icon: Flame, color: 'text-orange-500', value: 'trending' },
  { name: 'New', icon: Clock, color: 'text-blue-500', value: 'latest' },
  { name: 'Top Commented', icon: Star, color: 'text-yellow-500', value: 'most-commented' },
];

interface TrendingFilterProps {
  activeSort: FilterOption;
  onFilterChange: (value: FilterOption) => void;
}

export function TrendingFilter({ activeSort, onFilterChange }: TrendingFilterProps) {
  // Calculate active filter name based on sort value
  const activeFilter = sortToFilterMap[activeSort] || 'Hot';

  return (
    <nav className="mb-8">
      <ul className="flex space-x-2 overflow-x-auto pb-2">
        {trendingFilters.map((filter) => (
          <li key={filter.name}>
            <Button
              variant={activeFilter === filter.name ? "default" : "outline"}
              onClick={() => onFilterChange(filter.value as FilterOption)}
              className={`rounded-full ${activeFilter === filter.name ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white' : 'text-white border-white hover:bg-white hover:text-purple-900'}`}
            >
              <filter.icon className={`mr-2 h-4 w-4 ${filter.color}`} />
              {filter.name}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

