package com.phaseone.controller;

import com.phaseone.entity.Article;
import com.phaseone.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/articles")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService service;

    @PostMapping
    public Article create(@RequestBody Article article) {
        return service.saveNew(article); // Use specific save for new articles
    }

    // Standard REST update: PUT /api/articles/1
    @PutMapping("/{id}")
    public Article update(@PathVariable Long id, @RequestBody Article article) {
        article.setId(id); // Ensure we update the correct ID
        return service.updateExisting(article);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Deleted Successfully ...");
    }

    @GetMapping("/{id}")
    public Article getById(@PathVariable Long id) {
        return service.getById(id);
    }
}