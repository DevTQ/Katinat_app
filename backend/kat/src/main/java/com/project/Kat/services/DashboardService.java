package com.project.Kat.services;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

import com.project.Kat.dtos.CategoryStatsDTO;
import com.project.Kat.dtos.RecentOrderDTO;
import com.project.Kat.dtos.RevenueDTO;
import com.project.Kat.models.Order;
import com.project.Kat.models.OrderStatus;
import com.project.Kat.repositories.CategoryRepository;
import com.project.Kat.repositories.OrderRepository;

@Service
@RequiredArgsConstructor
public class DashboardService implements IDashBoardService {
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;

    @Override
    public List<RevenueDTO> getRevenueData(String period) {
        List<RevenueDTO> revenueData = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;
        int days;

        switch (period.toLowerCase()) {
            case "week":
                days = 7;
                startDate = endDate.minusDays(days - 1);
                break;
            case "month":
                days = 30;
                startDate = endDate.minusDays(days - 1);
                break;
            case "year":
                days = 365;
                startDate = endDate.minusDays(days - 1);
                break;
            default:
                days = 30; // Default là month
                startDate = endDate.minusDays(days - 1);
        }

        Random random = new Random();
        LocalDate currentDate = startDate;
        
        while (!currentDate.isAfter(endDate)) {
            double randomValue = 100000 + random.nextDouble() * 900000; // Random từ 100,000 đến 1,000,000
            revenueData.add(new RevenueDTO(
                currentDate.toString(),
                Math.round(randomValue * 100.0) / 100.0 // Làm tròn 2 chữ số thập phân
            ));
            currentDate = currentDate.plusDays(1);
        }

        return revenueData;
    }

    @Override
    public List<CategoryStatsDTO> getCategoryStats() {
        List<Object[]> rawStats = categoryRepository.getCategoryStats();

        List<CategoryStatsDTO> stats = rawStats.stream()
            .map(row -> {
                String category = (String) row[0];
                Long count = row[1] instanceof Long ? (Long) row[1] : ((Integer) row[1]).longValue();
                return new CategoryStatsDTO(category, count.intValue());
            })
            .collect(Collectors.toList());

        final int total = stats.stream().mapToInt(CategoryStatsDTO::getValue).sum();

        // Tính phần trăm
        return stats.stream()
            .map(stat -> new CategoryStatsDTO(
                stat.getCategory(),
                Math.round((float) stat.getValue() * 100 / total)
            ))
            .collect(Collectors.toList());
    }

    public List<RecentOrderDTO> getRecentOrders() {
        PageRequest pageRequest = PageRequest.of(0, 10);
        List<Order> recentOrders = orderRepository.findTop10ByOrderByOrderDateDesc(pageRequest);
        
        return recentOrders.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    private RecentOrderDTO convertToDTO(Order order) {
        return RecentOrderDTO.builder()
            .id(order.getOrderId().toString())
            .customer(order.getFullName())
            .items(order.getOrderDetails().size())
            .totalMoney(order.getTotalAmount())
            .status(mapOrderStatus(order.getStatus()))
            .time(formatOrderTime(order.getOrderDate()))
            .build();
    }

    private String mapOrderStatus(OrderStatus status) {
        return switch (status) {
            case PENDING -> "pending";
            case ORDER_CONFIRMED -> "processing";
            case COMPLETED -> "completed";
            default -> status.name().toLowerCase();
        };
    }

    private String formatOrderTime(LocalDateTime orderDate) {
        if (orderDate == null) {
            return "";
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        return orderDate.format(formatter);
    }
}
