package com.backend.upkeepBackend.repository;
import com.backend.upkeepBackend.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    // This is a "magic" method.
    // Spring Data JPA will automatically create a query:
    // "SELECT * FROM assets WHERE user_id = ?"
    List<Asset> findByUserId(String userId);
}