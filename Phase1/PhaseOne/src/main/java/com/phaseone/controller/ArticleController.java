package com.phaseone.controller;

import com.phaseone.entity.Article;
import com.phaseone.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService service;

    @PostMapping
    public Article create(@RequestBody Article article) {
        return service.save(article);
    }
}
