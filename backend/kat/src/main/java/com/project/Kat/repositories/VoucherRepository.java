package com.project.Kat.repositories;

import com.project.Kat.models.Store;
import com.project.Kat.models.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    boolean existsByVoucherName(String Name);
    Page<Voucher> findAll(Pageable pageable);
}
