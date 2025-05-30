package com.project.Kat.dtos;
import lombok.*;
@Data//toString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecentOrderDTO {
    private String id;          
    private String customer;    
    private int items;      
    private Double totalMoney;       
    private String status;      
    private String time; 
}
