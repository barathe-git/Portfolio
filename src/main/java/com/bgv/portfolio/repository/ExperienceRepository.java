package com.bgv.portfolio.repository;

import com.bgv.portfolio.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    @Query("SELECT DISTINCT e FROM Experience e LEFT JOIN FETCH e.projects")
    List<Experience> findAllWithEagerProjects();

    @Query("SELECT e FROM Experience e LEFT JOIN FETCH e.projects WHERE e.id = :id")
    Optional<Experience> findByIdWithEagerProjects(Long id);
}