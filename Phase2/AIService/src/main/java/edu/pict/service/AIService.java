package edu.pict.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import edu.pict.dtos.AIAnalysisRequest;

@Service
@Slf4j
@RequiredArgsConstructor
public class AIService {

    private final OllamaService ollama;

    public String createHTMLReport(AIAnalysisRequest req) {

        String prompt = """
                You are a senior cybersecurity forensic analyst specializing in PDF malware detection.
                
                Generate a FULL PROFESSIONAL MALWARE ANALYSIS REPORT strictly in PURE HTML.
                
                IMPORTANT OUTPUT RULES:
                - Output MUST be exactly:
                  <div> ... full report ... </div>
                - Wrap the ENTIRE REPORT inside ONE <div>.
                - Use ONLY clean HTML.
                - No external CSS. Use inline style="" only.
                - Allowed tags: <h1>, <h2>, <p>, <ul>, <li>, <pre>, <span>.
                - Highlight:
                    Malicious → <span style='color:red; font-weight:bold'>
                    Safe → <span style='color:green; font-weight:bold'>
                - NO markdown.
                - NO backticks.
                - NO escaping HTML.
                - NO explanations outside HTML.
                - The response must contain ONLY the HTML document.
                
                -----------------------------------------
                FILE DETAILS
                -----------------------------------------
                File Name: %s
                File Size: %d bytes
                
                -----------------------------------------
                MACHINE LEARNING OUTPUT
                -----------------------------------------
                Prediction: %s
                Confidence: %.2f
                Features: %s
                
                -----------------------------------------
                PDF CONTENT (Summary - first 3000 chars)
                -----------------------------------------
                %s
                
                -----------------------------------------
                METADATA
                -----------------------------------------
                %s
                
                -----------------------------------------
                OUTPUT FORMAT REMINDER
                -----------------------------------------
                Respond ONLY with:
                
                 <div>
                      ... full professional analysis ...
                 </div>
                """
                .formatted(
                        req.getFileName(),
                        req.getFileSize(),
                        req.getPrediction(),
                        req.getConfidence(),
                        req.getFeatures(),
                        truncate(req.getExtractedText(), 3000),
                        req.getMetadata()
                );


        // Use default model from application.yml (deepseek-r1:8b or gemma3)
        return ollama.generate(prompt);
    }

    private String truncate(String s, int limit) {
        if (s == null) return "";
        return s.length() <= limit ? s : s.substring(0, limit) + "...";
    }
}
