import axiosClient from './axiosClient';

export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  role: UserRole;
  isActive: boolean;
  position?: string;
  createdAt: string;
  lastLogin: string | null;
}

export interface CreateUserRequest {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  role: UserRole;
  position?: string;
}

export interface UpdateUserRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  isActive?: boolean;
  position?: string;
}

export interface ResetPasswordRequest {
  userId: string;
  newPassword: string;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  query?: string;
  isActive?: boolean;
  position?: string;
  lastLoginRange?: {
    from?: string;
    to?: string;
  };
}

const userService = {
  getAll: async (params: GetUsersParams = {}): Promise<GetUsersResponse> => {
    return await axiosClient.get('/users', { params });
  },

  getById: async (id: string): Promise<User> => {
    return await axiosClient.get(`/users/${id}`);
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    return await axiosClient.post('/users', userData);
  },

  update: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    return await axiosClient.put(`/users/${id}`, userData);
  },

  delete: async (id: string): Promise<void> => {
    return await axiosClient.delete(`/users/${id}`);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return await axiosClient.post(`/users/reset-password`, data);
  },

  toggleStatus: async (id: string, isActive: boolean): Promise<User> => {
    return await axiosClient.patch(`/users/${id}/status`, { isActive });
  }
};

export default userService; 