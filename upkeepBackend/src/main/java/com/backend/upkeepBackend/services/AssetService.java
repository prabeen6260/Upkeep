package com.backend.upkeepBackend.services;

import java.util.Map;
import org.springframework.stereotype.Service;
import com.backend.upkeepBackend.repository.AssetRepository;
import com.backend.upkeepBackend.entity.Asset;
import com.backend.upkeepBackend.dto.AssetDto;
import java.util.List;
import com.backend.upkeepBackend.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
//import java.util.Optional;
import java.time.LocalDate;
//import java.time.format.DateTimeFormatter;

@Service
public class AssetService {
    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public List<Asset> getAssetForUser(String userId) {
        return assetRepository.findByUserId(userId);
    }
    public Asset createAsset(AssetDto assetDto, String userId){
        Asset newAsset = new Asset();
        newAsset.setName(assetDto.getName());
        newAsset.setCategory(assetDto.getCategory());
        newAsset.setDescription(assetDto.getDescription());
        newAsset.setInterval(assetDto.getInterval());
        // 2. Add business logic (parse dates, set user)
        LocalDate lastMaint = LocalDate.parse(assetDto.getLastMaintenance());
        LocalDate nextMaint = lastMaint.plusMonths(assetDto.getInterval());
        
        newAsset.setLastMaintenance(lastMaint);
        newAsset.setNextMaintenance(nextMaint);
        newAsset.setUserId(userId); // <-- Set the owner
        return assetRepository.save(newAsset);

    }
    public Asset updatePartialAsset(Long id, String userId, Map<String, Object> updates) {
    
        // 1. Find the asset by ID
        Asset asset = assetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
    
        // 2. Check if the logged-in user owns this asset
        if (!asset.getUserId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to update this asset.");
        }
    
        // 3. Apply the updates from the map
        // Your React code sends 'lastMaintenance' and 'nextMaintenance'
        updates.forEach((key, value) -> {
            switch (key) {
                case "lastMaintenance":
                    asset.setLastMaintenance(LocalDate.parse(value.toString()));
                    break;
                case "nextMaintenance":
                    asset.setNextMaintenance(LocalDate.parse(value.toString()));
                    break;
                // 'status' is also sent, but we can ignore it since the
                // frontend recalculates it anyway based on the new dates.
            }
        });

    // 4. Save the updated asset
    return assetRepository.save(asset);
}
}
