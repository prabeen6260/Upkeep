package com.backend.upkeepBackend.controller;

import com.backend.upkeepBackend.dto.AssetDto;
import com.backend.upkeepBackend.entity.Asset;
import com.backend.upkeepBackend.services.AssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal; // <-- Spring Security magic
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins= "http://localhost:3000")
public class AssetController {
    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    /**
     * Endpoint for: GET /api/assets
     * Gets all assets for the LOGGED-IN user.
     */
    @GetMapping
    public ResponseEntity<List<Asset>> getMyAssets(Principal principal) {
        // principal.getName() will return the Auth0 'sub' (user ID)
        // This is provided by your SecurityConfig.
        String userId = principal.getName();
        List<Asset> assets = assetService.getAssetForUser(userId);
        return ResponseEntity.ok(assets);
    }

    /**
     * Endpoint for: POST /api/assets
     * Creates a new asset for the LOGGED-IN user.
     */
    @PostMapping
    public ResponseEntity<Asset> createAsset(@RequestBody AssetDto assetDto, Principal principal) {
        // Get the user ID from the token
        String userId = principal.getName();
        
        // Use the service to create the asset
        Asset newAsset = assetService.createAsset(assetDto, userId);
        
        // Return 201 Created status
        return ResponseEntity.status(201).body(newAsset);
    }
    /**
 * Endpoint for: PATCH /api/assets/{id}
 * Partially updates an asset. Used by the "Mark Complete" button.
 */
@PatchMapping("/{id}")
public ResponseEntity<Asset> updateAsset(@PathVariable Long id, 
                                         @RequestBody Map<String, Object> updates, 
                                         Principal principal) {
    String userId = principal.getName();
    
    // We'll create this 'updatePartialAsset' method in the service next
    Asset updatedAsset = assetService.updatePartialAsset(id, userId, updates); 
    
    return ResponseEntity.ok(updatedAsset);
}
}
