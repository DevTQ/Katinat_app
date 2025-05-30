package com.project.Kat.services;

import java.util.List;

import com.project.Kat.dtos.CategoryStatsDTO;
import com.project.Kat.dtos.RecentOrderDTO;
import com.project.Kat.dtos.RevenueDTO;

public interface IDashBoardService {
    List<RevenueDTO> getRevenueData(String period);
    List<CategoryStatsDTO> getCategoryStats();
    List<RecentOrderDTO> getRecentOrders();
}
