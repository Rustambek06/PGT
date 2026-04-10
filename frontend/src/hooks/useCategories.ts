import { useState, useCallback, useEffect } from 'react';
import { PageResponse, Category, CategoryRequest } from '../types';
import apiService from '../services/apiService';

export const useCategories = () => {
  const [data, setData] = useState<PageResponse<Category>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 12,
    first: true,
    last: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPaginated<Category>('/categories', page, 12);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (category: CategoryRequest) => {
    try {
      setError(null);
      await apiService.create('/categories', category);
      await fetchCategories(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: number, category: CategoryRequest) => {
    try {
      setError(null);
      await apiService.update('/categories', id, category);
      await fetchCategories(data.number);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    }
  }, [fetchCategories, data.number]);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      setError(null);
      await apiService.delete('/categories', id);
      await fetchCategories(data.number);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    }
  }, [fetchCategories, data.number]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    data,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};