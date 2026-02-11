package com.bgv.portfolio.repository;

import com.bgv.portfolio.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    @Query("SELECT p FROM Profile p LEFT JOIN FETCH p.experiences LEFT JOIN FETCH p.educationList WHERE p.id = :id")
    Optional<Profile> findByIdWithEagerLoading(Long id);
}