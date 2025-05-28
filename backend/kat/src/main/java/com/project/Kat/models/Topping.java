package com.project.Kat.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "toppings")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Topping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topping_id")
    private Long toppingId;

    @ManyToOne
    @JoinColumn(name = "order_detail_id")
    private OrderDetail orderDetail;

    @Column(name = "name")
    private String toppingName;

    @Column(name = "price")
    private Float toppingPrice;

    @Column(name = "image")
    private String image;

    @Column(name = "description")
    private String description;
}
