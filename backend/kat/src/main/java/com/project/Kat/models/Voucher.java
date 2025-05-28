package com.project.Kat.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voucher_id")
    private Long voucherId;

    @Column(name = "name")
    private String voucherName;

    private String image;

    private String type;

    @Column(name = "discount_value")
    private Float discountValue;

    @Column(name = "end_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm", timezone = "UTC")
    private OffsetDateTime endDate;

    @Lob
    @Column(name = "conditions", columnDefinition = "LONGTEXT")
    @Convert(converter = StringListConverter.class)
    private List<String> conditions;
}
