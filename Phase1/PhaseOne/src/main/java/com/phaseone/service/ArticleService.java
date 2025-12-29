package com.phaseone.service;

import com.phaseone.entity.Article;
import com.phaseone.repository.ArticleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleService {

    private final ArticleRepository repo;

    public ArticleService(ArticleRepository repo) {
        this.repo = repo;
    }

    public List<Article> getAll() {
        return repo.findAll();
    }

    public Article getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public Article save(Article article) {
        return repo.save(article);
    }

    public Article update(Long id, Article updated) {
        Article article = getById(id);
        article.setTitle(updated.getTitle());
        article.setContent(updated.getContent());
        article.setExcerpt(updated.getExcerpt());
        article.setUpdated(updated.isUpdated());
        return repo.save(article);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
