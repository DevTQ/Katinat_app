package com.project.Kat.repositories;

import com.project.Kat.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c.name as category, COUNT(p) as value " +
           "FROM Category c LEFT JOIN c.products p " +
           "GROUP BY c.name")
    List<Object[]> getCategoryStats();
}
