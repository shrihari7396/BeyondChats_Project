package edu.pict.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Data
@Builder
@ToString
@AllArgsConstructor
@RequiredArgsConstructor
public class AIAnalysisResponse {
    private String htmlReport;   // FULL HTML REPORT
}
