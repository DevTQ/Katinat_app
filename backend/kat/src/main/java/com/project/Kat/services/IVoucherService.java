package com.project.Kat.services;
import com.project.Kat.dtos.VoucherDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.Voucher;
import com.project.Kat.responses.VoucherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;


public interface IVoucherService {
    Voucher createVoucher(VoucherDTO voucherDTO) throws Exception;
    Voucher getVoucherById(long id) throws Exception;
    Page<VoucherResponse> getAllVouchers(PageRequest pageRequest);
    Voucher updateVoucher(long id, VoucherDTO voucherDTO) throws Exception;
    void deleteVoucher(long id) throws DataNotFoundException;
}
