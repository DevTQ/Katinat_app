package com.project.Kat.services;

import com.project.Kat.dtos.ProductDTO;
import com.project.Kat.dtos.StoreDTO;
import com.project.Kat.models.Product;
import com.project.Kat.models.Store;
import com.project.Kat.responses.ProductResponse;
import com.project.Kat.responses.StoreResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface IStoreService {
    Store createStore(StoreDTO storeDTO) throws Exception;
    Store getStoreById(long id) throws Exception;
    Page<StoreResponse> getAllStores(PageRequest pageRequest);
    Store updateStore(long id, StoreDTO storeDTO) throws Exception;
    void deleteStore(long id);
}
