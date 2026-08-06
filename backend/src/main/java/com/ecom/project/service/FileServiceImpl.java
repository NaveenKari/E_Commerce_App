package com.ecom.project.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService{

    @Override
    public String uploadImage(String path, MultipartFile image) throws IOException {
        //File names of current/original file
        String originalFileName = image.getOriginalFilename();
        //generate a unique file name
        String randomId = UUID.randomUUID().toString();
        // adhf.jpg --> 13 --> 13.jpg
        String fileName = randomId.concat(originalFileName.substring(originalFileName.lastIndexOf('.')));
        String filePath = path + File.separator + fileName;

        //check if path exists or create
        File folder = new File(path);
        if(!folder.exists()) folder.mkdir();

        //upload to server
        Files.copy(image.getInputStream(), Paths.get(filePath));

        return fileName;
    }
}
