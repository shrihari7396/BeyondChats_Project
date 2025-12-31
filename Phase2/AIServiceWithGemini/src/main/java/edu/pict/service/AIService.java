package edu.pict.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import edu.pict.dtos.AIAnalysisRequest;

@Service
@Slf4j
@RequiredArgsConstructor
public class AIService {
    private final GeminiService gemini;

    public String createHTMLReport(AIAnalysisRequest req) {
        return gemini.generate(req.getPrompt());
    }

}
