import { cn } from '@mac/tailwind-config/utils'
import type { MenuItemFilters } from '@mac/validators/menu-item'
import { Button } from '@mac/web-ui/button'
import { Input } from '@mac/web-ui/input'
import { Label } from '@mac/web-ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mac/web-ui/select'
import { FilterX, Search } from 'lucide-react'
import { useState } from 'react'

interface MenuFiltersProps {
  filters: MenuItemFilters
  onFiltersChange: (filters: MenuItemFilters) => void
  categories?: { id: string; name: string }[]
  className?: string
}

export function MenuFilters({
  filters,
  onFiltersChange,
  categories = [],
  className,
}: MenuFiltersProps) {
  const [searchInput, setSearchInput] = useState('')

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    onFiltersChange({ ...filters })
  }

  function handleClearFilters() {
    const clearedFilters: MenuItemFilters = {
      pageIndex: 0,
      pageSize: filters.pageSize || 12,
    }
    onFiltersChange(clearedFilters)
    setSearchInput('')
  }

  function updateFilter<K extends keyof MenuItemFilters>(key: K, value: MenuItemFilters[K]) {
    onFiltersChange({
      ...filters,
      [key]: value,
      pageIndex: 0, // Reset to first page when filters change
    })
  }

  const hasActiveFilters =
    !!(
      filters.categoryId //||
      // filters.availableOnly ||
      // filters.popular ||
      // filters.vegetarian ||
      // filters.vegan ||
      // filters.glutenFree ||
      // filters.minPrice ||
      // filters.maxPrice
    )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <form className="flex gap-2" onSubmit={handleSearchSubmit}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search menu items..."
            value={searchInput}
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category-select">Category</Label>
          <Select
            onValueChange={(value) =>
              updateFilter('categoryId', value === 'all' ? undefined : value)
            }
            value={filters.categoryId || 'all'}
          >
            <SelectTrigger id="category-select">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* 
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex gap-2">
            <Input
              className="w-full"
              min="0"
              onChange={(e) =>
                updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Min"
              step="0.01"
              type="number"
              value={filters.minPrice || ''}
            />
            <Input
              className="w-full"
              min="0"
              onChange={(e) =>
                updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Max"
              step="0.01"
              type="number"
              value={filters.maxPrice || ''}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Quick Filters</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.availableOnly || false}
                id="available-only"
                onCheckedChange={(checked) =>
                  updateFilter('availableOnly', checked ? true : undefined)
                }
              />
              <Label className="text-sm" htmlFor="available-only">
                Available only
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.popular || false}
                id="popular"
                onCheckedChange={(checked) => updateFilter('popular', checked ? true : undefined)}
              />
              <Label className="text-sm" htmlFor="popular">
                Popular items
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Dietary Preferences</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.vegetarian || false}
                id="vegetarian"
                onCheckedChange={(checked) =>
                  updateFilter('vegetarian', checked ? true : undefined)
                }
              />
              <Label className="text-sm" htmlFor="vegetarian">
                Vegetarian
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.vegan || false}
                id="vegan"
                onCheckedChange={(checked) => updateFilter('vegan', checked ? true : undefined)}
              />
              <Label className="text-sm" htmlFor="vegan">
                Vegan
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.glutenFree || false}
                id="gluten-free"
                onCheckedChange={(checked) =>
                  updateFilter('glutenFree', checked ? true : undefined)
                }
              />
              <Label className="text-sm" htmlFor="gluten-free">
                Gluten-Free
              </Label>
            </div>
          </div>
        </div> */}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {Object.values(filters).filter(Boolean).length - 2} filter(s) applied
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={handleClearFilters}
            size="sm"
            variant="ghost"
          >
            <FilterX className="h-4 w-4" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
