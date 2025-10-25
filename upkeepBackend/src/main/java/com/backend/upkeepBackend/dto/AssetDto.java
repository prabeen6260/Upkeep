package com.backend.upkeepBackend.dto;
import lombok.Data;

@Data
public class AssetDto {
    private String name;
    private String category;
    private String description;
    private int interval;
    private String lastMaintenance;
}
