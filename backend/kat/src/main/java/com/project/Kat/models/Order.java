package com.project.Kat.models;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Order extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "voucher_id", nullable = true)
    private Voucher voucher;

    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "phone_number", nullable = false, length = 100)
    private String phoneNumber;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "recipient_phone")
    private String recipientPhone;

    @Column(name = "store_address", length = 100)
    private String storeAddress;

    private String address;

    @Column(name = "note", length = 100)
    private String note;

    @Column(name = "note_ship", length = 100)
    private String noteShip;

    @Column(name="order_date")
    private LocalDateTime orderDate;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "confirm_at")
    private LocalDateTime confirmAt;

    @Column(name = "shipping_date")
    private LocalDate shippingDate;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "total_money")
    private Float totalMoney;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    @Column(name = "active")
    private Boolean Active;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<OrderDetail> orderDetails = new ArrayList<>();

    @Column(name = "order_code", unique = true)
    private String orderCode;

    @Column(name = "order_type")
    private String orderType;

    public double getTotalAmount() {
        return this.totalMoney != null ? this.totalMoney : 0.0;
    }
}

