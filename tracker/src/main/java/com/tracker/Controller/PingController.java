package com.tracker.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {
    
    @GetMapping("/api/public/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}