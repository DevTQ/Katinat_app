package com.project.Kat.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IUploadImageFile {
    String uploadImage(MultipartFile file) throws IOException;
}
