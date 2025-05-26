import axiosClient from './axiosClient';

export interface Customers {
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
  username?: string;
  referralCode?: string;
  role?: any;
  authorities?: any[];
}

export interface CustomerFilters {
  role?: string;
  isActive?: boolean;
  position?: string;
  query?: string;
  [key: string]: any;
}

export interface GetCustomerResponse {
  customer: Customers[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const hasValidToken = (): boolean => {
  const token = localStorage.getItem('accessToken');
  return !!token; // Convert to boolean
};

class AuthError extends Error {
  constructor(message = 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn') {
    super(message);
    this.name = 'AuthError';
  }
}

const customerService = {
  getCustomers: async (page: number, size: number, filters: CustomerFilters = {}): Promise<GetCustomerResponse> => {
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
      
      const response = await axiosClient.get<any, any>(`/users/customer?${queryString}`);
      
      // Kiểm tra và xử lý các định dạng response khác nhau
      let processedResponse: GetCustomerResponse;
      
      if (Array.isArray(response)) {
        processedResponse = {
          customer: response,
          totalItems: response.length,
          totalPages: 1,
          currentPage: 0
        };
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.customer)) {
          processedResponse = response as GetCustomerResponse;
        } else if (Array.isArray(response.customers)) {
          processedResponse = {
            customer: response.customers,
            totalItems: response.totalItems || response.customers.length,
            totalPages: response.totalPages || 1,
            currentPage: response.currentPage || 0
          };
        } else if (Array.isArray(response.staff)) {
          processedResponse = {
            customer: response.staff,
            totalItems: response.totalItems || response.staff.length,
            totalPages: response.totalPages || 1,
            currentPage: response.currentPage || 0
          };
        } else if (response.content && Array.isArray(response.content)) {
          processedResponse = {
            customer: response.content,
            totalItems: response.totalElements || response.content.length,
            totalPages: response.totalPages || 1,
            currentPage: response.number || 0
          };
        } else if (Array.isArray(response.data)) {
          processedResponse = {
            customer: response.data,
            totalItems: response.totalCount || response.total || response.data.length,
            totalPages: response.totalPages || Math.ceil((response.totalCount || response.total || response.data.length) / size),
            currentPage: page - 1
          };
        } else if (typeof response === 'object' && !Array.isArray(response) && Object.keys(response).length > 0) {
          console.log('[staffService] Checking if response is a single staff object');
          const hasStaffProperties = 'id' in response && 'fullname' in response;
          
          if (hasStaffProperties) {
            processedResponse = {
              customer: [response as Customers],
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
  getCustomerById: async (id: number | undefined): Promise<Customers> => {
    if (!hasValidToken()) {
      throw new AuthError();
    }
    
    if (id === undefined) {
      throw new Error('Customer ID is required');
    }
    
    try {
      return await axiosClient.get<any, Customers>(`/users/customer/${id}`);
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  },
  searchCustomers: async (page: number, size: number, filters: CustomerFilters = {}): Promise<GetCustomerResponse> => {
    try {
      if (!hasValidToken()) {
        console.warn('Không tìm thấy token xác thực, request có thể bị từ chối');
      }
  
      const params = {
        page: page - 1,
        size,
        ...filters
      };
      const queryString = new URLSearchParams(params as any).toString();
      const response = await axiosClient.get<any, any>(`/users/customer/search?${queryString}`);
  
      // Xử lý response giống như getCustomers
      let processedResponse: GetCustomerResponse;
      if (Array.isArray(response)) {
        processedResponse = {
          customer: response,
          totalItems: response.length,
          totalPages: 1,
          currentPage: 0
        };
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.customer)) {
          processedResponse = response as GetCustomerResponse;
        } else if (Array.isArray(response.customers)) {
          processedResponse = {
            customer: response.customers,
            totalItems: response.totalItems || response.customers.length,
            totalPages: response.totalPages || 1,
            currentPage: response.currentPage || 0
          };
        } else {
          throw new Error('Định dạng phản hồi không được hỗ trợ');
        }
      } else {
        throw new Error('Phản hồi không hợp lệ từ API');
      }
      return processedResponse;
    } catch (error) {
      console.error('[customerService] Error searching customers:', error);
      throw error;
    }
  },
  updateCustomer: async (id: string, customerData: any) => {
    return await axiosClient.put(`/customers/${id}`, customerData); // Cập nhật thông tin khách hàng theo ID
  },
  deleteCustomer: async (id: string) => {
    return await axiosClient.delete(`/customers/${id}`); // Xóa khách hàng theo ID
  },
};

export default customerService;