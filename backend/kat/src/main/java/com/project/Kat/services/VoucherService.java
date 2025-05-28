package com.project.Kat.services;
import com.project.Kat.dtos.VoucherDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.Voucher;
import com.project.Kat.repositories.VoucherRepository;
import com.project.Kat.responses.StoreResponse;
import com.project.Kat.responses.VoucherResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class VoucherService implements IVoucherService{
    private final VoucherRepository voucherRepository;
    @Override
    public Voucher createVoucher(VoucherDTO voucherDTO)
            throws DataNotFoundException, IOException {
        Voucher newVoucher = Voucher.builder()
                .voucherName(voucherDTO.getVoucherName())
                .image(voucherDTO.getImage())
                .type(voucherDTO.getType())
                .discountValue(voucherDTO.getDiscountValue())
                .conditions(voucherDTO.getConditions())
                .endDate(OffsetDateTime.from(voucherDTO.getEndDate()))
                .build();
        return voucherRepository.save(newVoucher);
    }

    @Override
    public Voucher getVoucherById(long voucherId) throws Exception {
        return voucherRepository.findById(voucherId).
                orElseThrow(()-> new DataNotFoundException(
                        "Cannot find voucher with id = "+voucherId));
    }

    @Override
    public Page<VoucherResponse> getAllVouchers(PageRequest pageRequest) {
        return voucherRepository
                .findAll(pageRequest)
                .map(VoucherResponse::fromVoucher);
    }

    @Override
    public Voucher updateVoucher(long id, VoucherDTO voucherDTO) throws Exception {
        return null;
    }

    @Override
    public void deleteVoucher(long id) {

    }
}
