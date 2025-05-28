import axiosClient from './axiosClient';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
  totalProductsSold: number;
  percentageChanges?: {
    revenue?: number;
    orders?: number;
    customers?: number;
    products?: number;
  }
}

export interface RevenueData {
  date: string;
  value: number;
}

export interface CategoryStats {
  category: string;
  value: number;
}

export interface BestSellingProduct {
  name: string;
  sold: number;
  revenue: number;
  growth: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  items: number;
  totalMoney: number;  
  status: string;
  time: string;
}

export interface HourlyStats {
  hour: number;
  value: number;
}

const dashboardService = {  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await axiosClient.get('/admin/dashboard/stats');
      
      // Type guard function to check if response matches DashboardStats interface
      const isDashboardStats = (data: any): data is DashboardStats => {
        return data 
          && typeof data.totalRevenue === 'number'
          && typeof data.totalOrders === 'number'
          && typeof data.newCustomers === 'number'
          && typeof data.totalProductsSold === 'number';
      };

      if (isDashboardStats(response)) {
        return response;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values on error
      return {
        totalRevenue: 0,
        totalOrders: 0,
        newCustomers: 0,
        totalProductsSold: 0,
        percentageChanges: {
          revenue: 0,
          orders: 0,
          customers: 0,
          products: 0
        }
      };
    }
  },
  getRevenueData: async (period: string = 'month'): Promise<RevenueData[]> => {
    try {
      const response = await axiosClient.get(`/admin/dashboard/revenue?period=${period}`);
      
      // Tạo dữ liệu mẫu cho 30 ngày
      const sampleData: RevenueData[] = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 1000000) + 100000
        };
      });

      if (Array.isArray(response) && response.length > 0) {
        // Đảm bảo dữ liệu trả về đúng định dạng
        return response.map(item => ({
          date: item.date,
          value: Number(item.value) || 0
        }));
      }
      
      return sampleData;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      return [];
    }
  },

  getCategoryStats: async (): Promise<CategoryStats[]> => {
    try {
      const response = await axiosClient.get('/admin/dashboard/category-stats');
      console.log('Category stats response:', response);
      
      // Dữ liệu mẫu cho phân bố danh mục
      const sampleData: CategoryStats[] = [
        { category: 'Cà phê', value: 35 },
        { category: 'Trà sữa', value: 25 },
        { category: 'Nước ép', value: 20 },
        { category: 'Bánh ngọt', value: 20 }
      ];

      if (Array.isArray(response) && response.length > 0) {
        // Đảm bảo dữ liệu trả về đúng định dạng
        return response.map(item => ({
          category: item.category,
          value: Number(item.value) || 0
        }));
      }
      
      return sampleData;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      return [];
    }
  },

  getBestSellingProducts: async (period: string = 'day'): Promise<BestSellingProduct[]> => {
    try {
      const response = await axiosClient.get(`/admin/dashboard/best-selling?period=${period}`);
      console.log('Best selling products response:', response);
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Error fetching best selling products:', error);
      return [];
    }
  },
  getRecentOrders: async (page: number = 0, size: number = 5): Promise<RecentOrder[]> => {
    try {
      const response = await axiosClient.get(`/admin/dashboard/recent-orders?page=${page}&size=${size}`);
      console.log('Recent orders response:', response);
      
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  },
  getHourlyStats: async (): Promise<HourlyStats[]> => {
    try {
      const response = await axiosClient.get('/admin/dashboard/hourly-stats');
      console.log('Hourly stats response:', response);
      
      // Tạo dữ liệu mẫu cho 24 giờ
      const sampleData: HourlyStats[] = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        value: Math.floor(Math.random() * 15) + 1 
      }));

      if (Array.isArray(response) && response.length > 0) {
        // Đảm bảo dữ liệu trả về đúng định dạng
        return response.map(item => ({
          hour: Number(item.hour) || 0,
          value: Number(item.value) || 0
        }));
      }
      
      return sampleData;
    } catch (error) {
      console.error('Error fetching hourly stats:', error);
      return []; 
    }
  }
};

export default dashboardService;
