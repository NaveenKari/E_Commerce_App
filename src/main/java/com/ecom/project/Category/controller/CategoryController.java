package com.ecom.project.Category.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api")
public class CategoryController {

    @GetMapping("/")
    public ResponseEntity<String> getCategory(){
        return ResponseEntity.ok("Hello World!");
    }
}
