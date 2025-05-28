import axiosClient from './axiosClient';
export interface StaffUser {
  id?: number;
  userId?: number;
  fullname?: string;
  fullName?: string;
  phone_number?: string;
  phoneNumber?: string;
  email: string | null;
  gender: string;
  active: boolean;
  created_at?: string;
  createdAt?: any[];
  updated_at?: string;
  updatedAt?: any[];
  role?: string | { roleId: number; name: string };
  username?: string;
  authorities?: any[];
  enabled?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
}

export interface CreateStaffRequest {
  fullname: string;
  phone_number: string | null;
  email: string | null;
  gender: string;
  referralCode: string;
  password: string;
  retype_password: string;
  role_id: number;
}

export interface UpdateStaffRequest {
  fullname: string;
  phone_number: string;
  email: string;
  gender: string;
  role_id: number;
  active: number;
}

export interface StaffFilters {
  role?: string;
  isActive?: boolean;
  position?: string;
  query?: string;
  [key: string]: any;
}

export interface GetStaffResponse {
  staff: StaffUser[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// Hàm kiểm tra token
const hasValidToken = (): boolean => {
  const token = localStorage.getItem('accessToken');
  return !!token; // Convert to boolean
};

// Lỗi khi không có token
class AuthError extends Error {
  constructor(message = 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn') {
    super(message);
    this.name = 'AuthError';
  }
}

const staffService = {
  // Get all staff with pagination and filters
  getStaffs: async (page: number, size: number, filters: StaffFilters = {}): Promise<GetStaffResponse> => {
    try {
      if (!hasValidToken()) {
        console.warn('Không tìm thấy token xác thực, request có thể bị từ chối');
      }
      
      const params = {
        page: page - 1,
        size,
        sortBy: 'userId',
        sortDir: 'desc',
        ...filters
      };
      
      const queryString = new URLSearchParams(params as any).toString();
      
      const response = await axiosClient.get<any, any>(`/admin/staff?${queryString}`);
      
      // Kiểm tra và xử lý các định dạng response khác nhau
      let processedResponse: GetStaffResponse;
      
      if (Array.isArray(response)) {
        console.log('[staffService] Processing response as array');
        processedResponse = {
          staff: response,
          totalItems: response.length,
          totalPages: 1,
          currentPage: 0
        };
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.staff)) {
          processedResponse = response as GetStaffResponse;
        } else if (response.content && Array.isArray(response.content)) {
          processedResponse = {
            staff: response.content,
            totalItems: response.totalElements || response.content.length,
            totalPages: response.totalPages || 1,
            currentPage: response.number || 0
          };
        } else if (Array.isArray(response.data)) {
          processedResponse = {
            staff: response.data,
            totalItems: response.totalCount || response.total || response.data.length,
            totalPages: response.totalPages || Math.ceil((response.totalCount || response.total || response.data.length) / size),
            currentPage: page - 1
          };
        } else if (typeof response === 'object' && !Array.isArray(response) && Object.keys(response).length > 0) {
          console.log('[staffService] Checking if response is a single staff object');
          const hasStaffProperties = 'id' in response && 'fullname' in response;
          
          if (hasStaffProperties) {
            console.log('[staffService] Processing response as a single staff object');
            processedResponse = {
              staff: [response as StaffUser],
              totalItems: 1,
              totalPages: 1,
              currentPage: 0
            };
          } else {
            console.error('[staffService] Unknown response format. Response structure:', JSON.stringify(response, null, 2));
            throw new Error('Định dạng phản hồi không được hỗ trợ');
          }
        } else {
          console.error('[staffService] Invalid response. Type:', typeof response, 'Value:', response);
          throw new Error('Phản hồi không hợp lệ từ API');
        }
      } else {
        console.error('[staffService] Invalid response. Type:', typeof response, 'Value:', response);
        throw new Error('Phản hồi không hợp lệ từ API');
      }
      
      console.log('[staffService] Processed response:', processedResponse);
      return processedResponse;
    } catch (error) {
      console.error('[staffService] Error fetching staff:', error);
      if ((error as any).response) {
        console.error('[staffService] Error response:', (error as any).response?.status, (error as any).response?.data);
      }
      throw error;
    }
  },

  // Get a staff by ID
  getStaffById: async (id: number | undefined): Promise<StaffUser> => {
    if (!hasValidToken()) {
      throw new AuthError();
    }
    
    if (id === undefined) {
      throw new Error('Staff ID is required');
    }
    
    try {
      return await axiosClient.get<any, StaffUser>(`/admin/staff/${id}`);
    } catch (error) {
      console.error(`Error fetching staff with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new staff
  createStaff: async (staff: CreateStaffRequest): Promise<StaffUser> => {
    if (!hasValidToken()) {
      throw new AuthError();
    }
    
    try {
      return await axiosClient.post<any, StaffUser>('/users/register', staff);
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },

  // Update a staff
  updateStaff: async (id: number | undefined, staff: UpdateStaffRequest): Promise<StaffUser> => {
    if (!hasValidToken()) {
      throw new AuthError();
    }
    
    if (id === undefined) {
      throw new Error('Staff ID is required');
    }
    
    try {
      return await axiosClient.put<any, StaffUser>(`/admin/staff/update/${id}`, staff);
    } catch (error) {
      console.error(`Error updating staff with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a staff
  deleteStaff: async (id: number | undefined): Promise<void> => {
    if (!hasValidToken()) {
      throw new AuthError();
    }
    
    if (id === undefined) {
      throw new Error('Staff ID is required');
    }
    
    try {
      await axiosClient.delete(`/admin/staff/${id}`);
    } catch (error) {
      console.error(`Error deleting staff with ID ${id}:`, error);
      throw error;
    }
  },

  // Toggle staff status (activate/deactivate)
  toggleStaffStatus: async (id: number | undefined, active: boolean): Promise<void> => {
    if (!hasValidToken()) {
      throw new AuthError();
    }
    
    if (id === undefined) {
      throw new Error('Staff ID is required');
    }
    
    try {
      await axiosClient.patch(`/admin/staff/${id}/status`, { active });
    } catch (error) {
      console.error(`Error toggling status for staff with ID ${id}:`, error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (id: number | undefined, newPassword: string): Promise<void> => {
    if (!hasValidToken()) {
      throw new AuthError();
    }
    
    if (id === undefined) {
      throw new Error('Staff ID is required');
    }
    
    try {
      await axiosClient.post(`/admin/staff/${id}/reset-password`, { newPassword });
    } catch (error) {
      console.error(`Error resetting password for staff with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Search staffs
  searchStaffs: async (page: number, size: number, filters: StaffFilters = {}): Promise<GetStaffResponse> => {
    try {
      if (!hasValidToken()) {
        console.warn('Không tìm thấy token xác thực, request có thể bị từ chối');
      }
  
      const params = {
        page: page - 1,
        size,
        ...filters
      };
      
      // Xử lý các roles nếu cần
      let queryString = new URLSearchParams();
      
      // Thêm các tham số cơ bản
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && key !== 'roles') {
          queryString.append(key, String(value));
        }
      });
      
      // Xử lý riêng cho roles nếu có
      if (filters.roles && Array.isArray(filters.roles)) {
        filters.roles.forEach(role => {
          queryString.append('roles', role);
        });
      } else if (filters.role) {
        queryString.append('roles', filters.role);
      }
      
      const response = await axiosClient.get<any, any>(`/admin/staff/search?${queryString.toString()}`);
  
      // Xử lý response giống như getStaffs
      let processedResponse: GetStaffResponse;
      if (Array.isArray(response)) {
        processedResponse = {
          staff: response,
          totalItems: response.length,
          totalPages: 1,
          currentPage: 0
        };
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.customer)) {
          // Chuyển đổi customer thành staff
          processedResponse = {
            staff: response.customer,
            totalItems: response.totalItems || response.customer.length,
            totalPages: response.totalPages || 1,
            currentPage: response.currentPage || 0
          };
        } else if (Array.isArray(response.staff)) {
          processedResponse = response as GetStaffResponse;
        } else if (response.content && Array.isArray(response.content)) {
          processedResponse = {
            staff: response.content,
            totalItems: response.totalElements || response.content.length,
            totalPages: response.totalPages || 1,
            currentPage: response.number || 0
          };
        } else {
          console.error('[staffService] Unsupported response format:', response);
          throw new Error('Định dạng phản hồi không được hỗ trợ');
        }
      } else {
        console.error('[staffService] Invalid response. Type:', typeof response, 'Value:', response);
        throw new Error('Phản hồi không hợp lệ từ API');
      }
      
      return processedResponse;
    } catch (error) {
      console.error('[staffService] Error searching staffs:', error);
      throw error;
    }
  }
};

export default staffService; 