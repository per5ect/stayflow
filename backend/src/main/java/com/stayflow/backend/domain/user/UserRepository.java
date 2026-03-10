package com.stayflow.backend.domain.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(UserRole role);

    @Query("SELECT u FROM User u WHERE " +
            "(:role IS NULL OR CAST(u.role AS string) = :role) " +
            "AND (:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', CAST(:email AS string), '%')))")
    Page<User> findAllWithFilters(@Param("role") String role,
                                  @Param("email") String email,
                                  Pageable pageable);
}