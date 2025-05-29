package com.project.Kat.responses;
import com.project.Kat.models.Store;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StoreResponse {
    public Long storeId;
    public String storeName;
    private String image;
    private String storeAddress;
    private String openingHours;
    private String closingTime;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public static StoreResponse fromStore(Store store) {
        StoreResponse storeResponse = StoreResponse.builder()
                .storeId(store.getStoreId())
                .storeName(store.getStoreName())
                .image(store.getImage())
                .storeAddress(store.getStoreAddress())
                .openingHours(store.getOpeningHours().toString())
                .closingTime(store.getClosingTime().toString())
                .latitude(store.getLatitude())
                .longitude(store.getLongitude())
                .build();
        return storeResponse;
    }
}
