/**
 * Dashboard Home Page
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button, Modal } from '@/components/ui';
import { TaskList, TaskFilters, TaskForm, TaskStats, Pagination } from '@/components/tasks';
import { getTasks, createTask, updateTask, deleteTask, getTaskStats } from '@/services/task.service';
import { Task, TaskFormData, TaskStats as TaskStatsType, Pagination as PaginationType } from '@/types';
import toast from 'react-hot-toast';

interface Filters {
  search: string;
  status: string;
  priority: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStatsType>({
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
  });
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getTasks({
        page: currentPage,
        limit: 9,
        ...filters,
      });
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch {
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await getTaskStats();
      setStats(response.data.stats);
    } catch {
      console.error('Failed to fetch stats');
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle create task
  const handleCreateTask = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await createTask(data);
      toast.success('Task created successfully');
      setIsModalOpen(false);
      fetchTasks();
      fetchStats();
    } catch {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update task
  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;

    setIsSubmitting(true);
    try {
      await updateTask(editingTask._id, data);
      toast.success('Task updated successfully');
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
      fetchStats();
    } catch {
      toast.error('Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
      fetchTasks();
      fetchStats();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  // Open edit modal
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="sm:w-auto"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <TaskStats stats={stats} />

      {/* Filters */}
      <TaskFilters onFilterChange={handleFilterChange} />

      {/* Task List */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteTask}
      />

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Create/Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
