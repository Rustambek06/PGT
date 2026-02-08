import { useState, useCallback, useEffect } from 'react';
import { PageResponse, User, UserRequest } from '../types';
import apiService from '../services/apiService';

export const useUsers = () => {
  const [data, setData] = useState<PageResponse<User>>({
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

  const fetchUsers = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPaginated<User>('/users', page, 12);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (user: UserRequest) => {
    try {
      setError(null);
      await apiService.create('/users', user);
      await fetchUsers(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: number, user: UserRequest) => {
    try {
      setError(null);
      await apiService.update('/users', id, user);
      await fetchUsers(data.number);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  }, [fetchUsers, data.number]);

  const deleteUser = useCallback(async (id: number) => {
    try {
      setError(null);
      await apiService.delete('/users', id);
      await fetchUsers(data.number);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    }
  }, [fetchUsers, data.number]);

  useEffect(() => {
    fetchUsers(0);
  }, [fetchUsers]);

  return {
    data,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
