package com.project.Kat.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadImageFile implements IUploadImageFile {

    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        assert file.getOriginalFilename() != null;

        // Tạo public_id ngẫu nhiên để tránh ghi đè ảnh
        String publicValue = generatePublicValue(file.getOriginalFilename());

        // Chuyển file Multipart thành file tạm trên server
        File fileUpload = convert(file);
        log.info("Uploading file: {}", fileUpload);

        // Upload file lên Cloudinary
        Map uploadResult = cloudinary.uploader().upload(fileUpload, ObjectUtils.asMap("public_id", publicValue));

        // Xóa file tạm sau khi upload
        cleanDisk(fileUpload);

        // Lấy secure_url từ response của Cloudinary
        return uploadResult.get("secure_url").toString();
    }

    private File convert(MultipartFile file) throws IOException {
        assert file.getOriginalFilename() != null;
        String[] fileNameParts = getFileName(file.getOriginalFilename());
        File convertFile = new File(StringUtils.join(generatePublicValue(file.getOriginalFilename()), ".", fileNameParts[1]));

        try (InputStream is = file.getInputStream()) {
            Files.copy(is, convertFile.toPath());
        }
        return convertFile;
    }

    private String generatePublicValue(String originalName) {
        String fileName = getFileName(originalName)[0];
        return StringUtils.join(UUID.randomUUID().toString(), "_", fileName);
    }

    private String[] getFileName(String originalName) {
        int lastDot = originalName.lastIndexOf(".");
        if (lastDot == -1) {
            return new String[]{originalName, ""}; // Không có extension
        }
        return new String[]{originalName.substring(0, lastDot), originalName.substring(lastDot + 1)};
    }

    private void cleanDisk(File file) {
        try {
            Path filePath = file.toPath();
            Files.delete(filePath);
        } catch (IOException e) {
            log.error("Error deleting file: {}", e.getMessage());
        }
    }
}
