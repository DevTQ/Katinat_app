package com.project.Kat.services;

import com.project.Kat.dtos.OrderDetailDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.OrderDetail;

import java.util.List;

public interface IOrderDetailService {
    OrderDetail getOrderDetail(Long id) throws DataNotFoundException;
    OrderDetail updateOrderDetail(Long id, OrderDetailDTO newOrderDetailData)
            throws DataNotFoundException;
    void deleteById(Long id);
    List<OrderDetail> findByOrderId(Long orderId);


}
