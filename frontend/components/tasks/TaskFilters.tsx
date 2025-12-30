/**
 * Task Filters Component
 */

'use client';

import { useState, useEffect } from 'react';
import { Input, Select } from '@/components/ui';
import { debounce } from '@/utils/helpers';

interface TaskFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

interface FilterValues {
  search: string;
  status: string;
  priority: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const debouncedFilter = debounce(() => {
      onFilterChange(filters);
    }, 300);

    debouncedFilter();
  }, [filters, onFilterChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
  ];

  const orderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Input
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search tasks..."
            className="h-10"
          />
        </div>

        <Select
          name="status"
          value={filters.status}
          onChange={handleChange}
          options={statusOptions}
        />

        <Select
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          options={priorityOptions}
        />

        <div className="flex gap-2">
          <Select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            options={sortOptions}
            className="flex-1"
          />
          <Select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleChange}
            options={orderOptions}
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
}
