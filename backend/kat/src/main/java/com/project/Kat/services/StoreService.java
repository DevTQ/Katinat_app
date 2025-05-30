package com.project.Kat.services;
import com.project.Kat.dtos.StoreDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.Store;
import com.project.Kat.repositories.StoreRepository;
import com.project.Kat.responses.StoreResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
@Service
@RequiredArgsConstructor
public class StoreService implements IStoreService {
    private final StoreRepository storeRepository;
    @Override
    public Store createStore(StoreDTO storeDTO)
            throws DataNotFoundException, IOException {
        Store newStore = Store.builder()
                .storeName(storeDTO.getStoreName())
                .image(storeDTO.getImage())
                .storeAddress(storeDTO.getStoreAddress())
                .openingHours(storeDTO.getOpeningHours())
                .closingTime(storeDTO.getClosingTime())
                .isActive(true)
                .build();

        return storeRepository.save(newStore);
    }

    @Override
    public Store getStoreById(long storeId) throws Exception {
        return storeRepository.findById(storeId).
                orElseThrow(()-> new DataNotFoundException(
                        "Cannot find store with id ="+storeId));
    }

    @Override
    public Page<StoreResponse> getAllStores(PageRequest pageRequest) {
        return storeRepository
                .findAll(pageRequest)
                .map(StoreResponse::fromStore);
    }

    @Override
    public Store updateStore(long id, StoreDTO storeDTO) throws Exception {
        return null;
    }

    @Override
    public void deleteStore(long id) {

    }
}
