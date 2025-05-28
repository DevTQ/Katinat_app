package com.project.Kat.services;

import com.project.Kat.components.VNPayUtils;
import com.project.Kat.dtos.NotificationDTO;
import com.project.Kat.dtos.OrderDTO;
import com.project.Kat.dtos.OrderDetailDTO;
import com.project.Kat.dtos.OrderHistoryDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.*;
import com.project.Kat.repositories.*;
import com.project.Kat.responses.OrderResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService{
    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;
    private final StoreRepository storeRepository;
    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    private final VNPayUtils vnPayUtils;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final NotiService notiService;

    @Override
    public Order createOrder(OrderDTO orderDTO) throws Exception {
        User user = userRepository
                .findById(orderDTO.getUserId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id: " + orderDTO.getUserId()));

        Voucher voucher = null;
        if (orderDTO.getVoucherId() != null) {
            voucher = voucherRepository
                    .findById(orderDTO.getVoucherId())
                    .orElseThrow(() -> new DataNotFoundException("Cannot find voucher with id: " + orderDTO.getVoucherId()));
        }

        Store store = storeRepository
                .findById(orderDTO.getStoreId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find store with id: " + orderDTO.getStoreId()));

        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setOrderId));

        Order order = modelMapper.map(orderDTO, Order.class);
        order.setUser(user);
        order.setVoucher(voucher);
        order.setStore(store);
        order.setOrderDate(LocalDateTime.now());
        order.setRecipientName(orderDTO.getRecipientName());
        order.setRecipientPhone(orderDTO.getRecipientPhone());
        order.setStatus(OrderStatus.PENDING);

        LocalDate shippingDate = orderDTO.getShippingDate() == null ? LocalDate.now() : orderDTO.getShippingDate();
        if (shippingDate.isBefore(LocalDate.now())) {
            throw new DataNotFoundException("Shipping date must be at least today!");
        }
        order.setShippingDate(shippingDate);
        order.setActive(true);

        String transactionReference = vnPayUtils.getRandomNumber(8);
        order.setOrderCode(transactionReference);
        order.setOrderType(orderDTO.getOrderType());

        order = orderRepository.save(order);

        List<OrderDetail> orderDetails = new ArrayList<>();
        if (orderDTO.getOrderDetails() != null && !orderDTO.getOrderDetails().isEmpty()) {
            for (OrderDetailDTO detailDTO : orderDTO.getOrderDetails()) {
                Product product = productRepository.findById(detailDTO.getProductId())
                        .orElseThrow(() -> new DataNotFoundException("Cannot find product with id: " + detailDTO.getProductId()));
                OrderDetail orderDetail = modelMapper.map(detailDTO, OrderDetail.class);
                orderDetail.setOrder(order);
                orderDetail.setProduct(product);
                orderDetail = orderDetailRepository.save(orderDetail);
                orderDetails.add(orderDetail);
            }
        }
        order.setOrderDetails(orderDetails);
        return order;
    }

    @Override
    public Order getOrder(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public Order getOrderByOrderCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode).orElse(null);
    }

    @Override
    public Order updateOrder(Long id, OrderDTO orderDTO)
            throws DataNotFoundException {
        Order order = orderRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + id));
        User existingUser = userRepository.findById(
                orderDTO.getUserId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find user with id: " + id));
        // Tạo một luồng bảng ánh xạ riêng để kiểm soát việc ánh xạ
        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setOrderId));
        // Cập nhật các trường của đơn hàng từ orderDTO
        modelMapper.map(orderDTO, order);
        order.setUser(existingUser);
        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        if(order != null) {
            order.setActive(false);
            orderRepository.save(order);
        }
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserUserId(userId);
    }

    @Override
    public Page<OrderResponse> getAllOrders(PageRequest pageRequest) {
        return orderRepository
                .findAll(pageRequest)
                .map(OrderResponse::fromOrder);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus status) throws DataNotFoundException {
        if (status == null) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ.");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đơn hàng."));

        order.setStatus(status);

        if(status == OrderStatus.ORDER_CONFIRMED) {
            order.setConfirmAt(LocalDateTime.now());
        }
        Order saved = orderRepository.save(order);

        // Gửi thông báo qua WebSocket theo orderCode
        notificationService.notifyOrderStatus(saved);

        return saved;
    }

    @Override
    public Order updateOrderByOrderCode(String orderCode, OrderStatus status) throws DataNotFoundException {
        if (status == null)
            throw new IllegalArgumentException("Trạng thái không hợp lệ!");

        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đơn hàng"));

        order.setStatus(status);

        // Cập nhật paidAt nếu trạng thái là PAID
        if (status == OrderStatus.PAID) {
            order.setPaidAt(LocalDateTime.now());
        }

        if(status == OrderStatus.ORDER_CONFIRMED) {
            order.setConfirmAt(LocalDateTime.now());
        }

        Order saved = orderRepository.save(order);

        // Gửi thông báo qua WebSocket theo orderCode
        notificationService.notifyOrderStatus(saved);

        return saved;
    }

    @Override
    @Transactional
    public Order finishOrder(String orderCode, OrderStatus finalStatus) throws DataNotFoundException {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đơn: " + orderCode));

        if (finalStatus != OrderStatus.CANCELLED
                && finalStatus != OrderStatus.COMPLETED) {
            throw new IllegalArgumentException("finalStatus phải là CANCELLED hoặc COMPLETED");
        }

        order.setStatus(finalStatus);
        Order saved = orderRepository.save(order);

        // Build DTO
        NotificationDTO dto = NotificationDTO.builder()
                .userId(saved.getUser().getUserId())
                .orderId(saved.getOrderId())
                .title(buildTitleForFinalStatus(orderCode, finalStatus))
                .content(buildContentForFinalStatus(saved, finalStatus))
                .type(NotificationType.ORDER)
                .build();

        notiService.createNotification(dto);
        return saved;
    }

    private String buildTitleForFinalStatus(String orderCode ,OrderStatus status) {
        switch (status) {
            case CANCELLED: return String.format("Đơn hàng %s của bạn đã bị hủy", orderCode);
            case COMPLETED: return String.format("Đơn hàng %s của bạn đã hoàn thành", orderCode);
            default:        return "Đơn hàng kết thúc";
        }
    }

    private String buildContentForFinalStatus(Order order, OrderStatus status) {
        switch (status) {
            case CANCELLED:
                return
                        String.format("Đơn hàng %s của bạn đã bị hủy. Nếu đơn hàng đã thanh toán, " +
                                "số tiền đã thanh toán sẽ được hoàn vào ví của bạn với thời gian tùy vào phương thức thanh toán (ít nhất 5-7 ngày làm việc)."
                                ,order.getOrderCode());
            case COMPLETED:
                return String.format("Cảm ơn bạn! Đơn hàng %s đã hoàn thành thành công.",
                        order.getOrderCode());
            default:
                return String.format("Đơn %s đã kết thúc ở trạng thái %s.",
                        order.getOrderCode(), status);
        }
    }

    public double calculateRevenueForDate(LocalDateTime date) {
        LocalDateTime endDate = date.plusDays(1);
        List<Order> orders = orderRepository.findByCreatedAtBetweenAndStatus(
            date, 
            endDate,
            OrderStatus.COMPLETED
        );
        
        return orders.stream()
                    .mapToDouble(order -> order.getTotalMoney() != null ? order.getTotalMoney() : 0.0)
                    .sum();
    }
    
    public int countOrdersForDate(LocalDateTime date) {
        LocalDateTime endDate = date.plusDays(1);
        return orderRepository.countByCreatedAtBetween(date, endDate);
    }
    
    public int countProductsSoldForDate(LocalDateTime date) {
        LocalDateTime endDate = date.plusDays(1);
        List<Order> orders = orderRepository.findByCreatedAtBetweenAndStatus(
            date, 
            endDate,
            OrderStatus.COMPLETED
        );
        
        return orders.stream()
                    .flatMap(order -> order.getOrderDetails().stream())
                    .mapToInt(OrderDetail::getNumberOfProducts)
                    .sum();
    }

    @Override
    public List<OrderHistoryDTO> getOrderHistoryByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserUserId(userId);

        return orders.stream()
                .map((Order order) -> {
                    return OrderHistoryDTO.builder()
                            .id(order.getOrderId().toString())
                            .storeName(order.getStore().getStoreName())
                            .amount(String.format("%,.0fđ", order.getTotalMoney()))
                            .paymentMethod(order.getPaymentMethod())
                            .itemCount(order.getOrderDetails().size())
                            .time(order.getOrderDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                            .status(convertStatus(order.getStatus()))
                            .orderType(
                                    convertOrderType(order.getOrderType() != null ? order.getOrderType() : "Không rõ"))
                            .build();
                })
                .collect(Collectors.toList());

    }

    private String convertStatus(OrderStatus status) {
        if (status == null)
            return "Không rõ";
        return switch (status) {
            case PENDING -> "Chờ thanh toán";
            case FAILED -> "Thanh toán thất bại";
            case PAID -> "Đã thanh toán";
            case ORDER_CONFIRMED -> "Xác nhận đơn hàng";
            case READY -> "Sẵn sàng giao hàng";
            case REJECTED -> "Đã xác nhận đơn";
            case SHIPPING -> "Đang giao hàng";
            case COMPLETED -> "Đã hoàn tất";
            case CANCELLED -> "Đã hủy đơn hàng";
        };
    }
    private String convertOrderType(String orderType) {
        if (orderType == null || orderType.isEmpty())
            return "Không rõ";
        return switch (orderType) {
            case "pickup" -> "Mua tại cửa hàng";
            case "delivery" -> "Giao hàng";
            default -> "Không rõ";
        };
    }
}
