package com.phaseone.controller;

import com.phaseone.entity.Article;
import com.phaseone.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService service;

    @GetMapping
    public List<Article> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Article getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Article create(@RequestBody Article article) {
        return service.save(article);
    }

    @PutMapping("/{id}")
    public Article update(@PathVariable Long id,
                          @RequestBody Article article) {
        return service.update(id, article);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
