package com.phaseone.service;

import com.phaseone.entity.Article;
import com.phaseone.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository repository;

    public Article save(Article article) {

        // 🔒 HARD VALIDATION
        if (article.getTitle() == null || article.getTitle().isBlank()) {
            throw new RuntimeException("Title cannot be empty");
        }

        if (article.getSlug() == null || article.getSlug().isBlank()) {
            throw new RuntimeException("Slug cannot be empty");
        }

        if (repository.existsBySlug(article.getSlug())) {
            throw new RuntimeException("Article already exists");
        }

        return repository.save(article);
    }
}
