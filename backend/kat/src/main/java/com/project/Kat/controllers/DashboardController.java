package com.project.Kat.controllers;
import com.project.Kat.services.IDashBoardService;
import com.project.Kat.services.IOrderService;
import com.project.Kat.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.project.Kat.dtos.CategoryStatsDTO;
import com.project.Kat.dtos.RecentOrderDTO;
import com.project.Kat.dtos.RevenueDTO;
import com.project.Kat.models.Order;

@RestController
@RequestMapping("${api.prefix}/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final IOrderService orderService;
    private final IUserService customerService;
    private final IDashBoardService dashboardService;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        // Lấy ngày hiện tại
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime yesterday = today.minusDays(1);
        
        // 1. Lấy doanh thu và đơn hàng hôm nay
        double todayRevenue = orderService.calculateRevenueForDate(today);
        int todayOrders = orderService.countOrdersForDate(today);
        int todayProductsSold = orderService.countProductsSoldForDate(today);
        int todayNewCustomers = customerService.countNewCustomersForDate(today);
        
        // 2. Lấy dữ liệu hôm qua để tính % thay đổi
        double yesterdayRevenue = orderService.calculateRevenueForDate(yesterday);
        int yesterdayOrders = orderService.countOrdersForDate(yesterday);
        int yesterdayProductsSold = orderService.countProductsSoldForDate(yesterday);
        int yesterdayNewCustomers = customerService.countNewCustomersForDate(yesterday);
        
        // 3. Tính phần trăm thay đổi
        double revenueChange = calculatePercentageChange(todayRevenue, yesterdayRevenue);
        double ordersChange = calculatePercentageChange(todayOrders, yesterdayOrders);
        double customersChange = calculatePercentageChange(todayNewCustomers, yesterdayNewCustomers);
        double productsChange = calculatePercentageChange(todayProductsSold, yesterdayProductsSold);
        
        // 4. Tạo response
        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", todayRevenue);
        response.put("totalOrders", todayOrders);
        response.put("newCustomers", todayNewCustomers);
        response.put("totalProductsSold", todayProductsSold);
        
        Map<String, Double> percentageChanges = new HashMap<>();
        percentageChanges.put("revenue", revenueChange);
        percentageChanges.put("orders", ordersChange);
        percentageChanges.put("customers", customersChange);
        percentageChanges.put("products", productsChange);
        
        response.put("percentageChanges", percentageChanges);
        
        return ResponseEntity.ok(response);
    }
    
    private double calculatePercentageChange(double current, double previous) {
        if (previous == 0) return 100;
        return ((current - previous) / previous) * 100;
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueDTO>> getRevenue(@RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(dashboardService.getRevenueData(period));
    }

    @GetMapping("/category-stats")
    public ResponseEntity<List<CategoryStatsDTO>> getCategoryStats() {
        return ResponseEntity.ok(dashboardService.getCategoryStats());
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<RecentOrderDTO>> getRecentOrders() {
        List<RecentOrderDTO> orders = dashboardService.getRecentOrders();
        return ResponseEntity.ok(orders);
    }
    
}
