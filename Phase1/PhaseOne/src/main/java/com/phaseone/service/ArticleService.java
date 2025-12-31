package com.phaseone.service;

import com.phaseone.entity.Article;
import com.phaseone.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository repository;

    // Logic for brand new articles
    public Article saveNew(Article article) {
        validateBasic(article);
        if (repository.existsBySlug(article.getSlug())) {
            throw new RuntimeException("Article already exists with this slug");
        }
        return repository.save(article);
    }

    // Logic for updating existing articles
    public Article updateExisting(Article article) {
        validateBasic(article);
        // Check if ID exists
        if (article.getId() == null || !repository.existsById(article.getId())) {
            throw new RuntimeException("Article ID not found");
        }
        return repository.save(article);
    }

    private void validateBasic(Article article) {
        if (article.getTitle() == null || article.getTitle().isBlank()) {
            throw new RuntimeException("Title cannot be empty");
        }
        if (article.getSlug() == null || article.getSlug().isBlank()) {
            throw new RuntimeException("Slug cannot be empty");
        }
    }

    public List<Article> getAll() { return repository.findAll(); }
    public void deleteById(Long id) { repository.deleteById(id); }
    public Article getById(Long id) { return repository.findById(id).orElse(null); }
}