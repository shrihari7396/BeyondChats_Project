package edu.pict.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.pict.dtos.AIAnalysisRequest;
import edu.pict.dtos.AIAnalysisResponse;
import edu.pict.service.AIService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @SuppressWarnings("null")
    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(@RequestBody AIAnalysisRequest req) {

        String json = aiService.createHTMLReport(req);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(AIAnalysisResponse.builder().json(json).build());
    }
}
