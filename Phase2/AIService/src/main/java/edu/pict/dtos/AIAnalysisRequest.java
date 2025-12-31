package edu.pict.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.util.Map;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@ToString
public class AIAnalysisRequest {

    private String prediction;
    private double confidence;
    private Map<String, Object> features;

    private String extractedText;
    private Map<String, Object> metadata;

    private String fileName;
    private long fileSize;
}
