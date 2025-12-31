package com.phaseone.repository;

import com.phaseone.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    boolean existsBySlug(String slug);
}
