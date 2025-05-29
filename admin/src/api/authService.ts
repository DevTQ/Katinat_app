import axiosClient from './axiosClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string | null;
    phone_number: string;
    fullname: string;
  };
  role?: string;
  permissions: {
    permissions: string[];
  };
}


function isAuthResponse(obj: any): obj is AuthResponse {
  return obj 
    && typeof obj.token === 'string'
    && obj.user
    && typeof obj.user.id === 'number'
    && typeof obj.user.fullname === 'string'
    && typeof obj.user.phone_number === 'string'
    && obj.permissions 
    && Array.isArray(obj.permissions.permissions);
}


const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/users/login', credentials);
    console.log("Login response:", response);
    
    if (isAuthResponse(response)) {
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Lưu permissions nếu có
      if (response.permissions && response.permissions.permissions) {
        const permissionsArray = response.permissions.permissions;
        console.log('Saving permissions to localStorage:', permissionsArray);
        localStorage.setItem('permissions', JSON.stringify(permissionsArray));
      }
      
      return response;
    }
    throw new Error('Invalid response format');
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/register', userData);
    if (isAuthResponse(response)) {
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    }
    throw new Error('Invalid response format');
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    localStorage.removeItem('role');
    
    // Để đảm bảo tất cả dữ liệu phiên làm việc được xóa
    sessionStorage.clear();
    
    // Dispatch một sự kiện để thông báo cho các component khác
    window.dispatchEvent(new Event('storage'));
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  }
};

export default authService; 