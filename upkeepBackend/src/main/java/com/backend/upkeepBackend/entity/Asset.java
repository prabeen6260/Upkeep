package com.backend.upkeepBackend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Data;

@Data
@Entity
@Table(name = "assets")
public class Asset {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;
    // link to Auth0 user
    @Column(nullable = false, name = "user_id")
    private String userId;
    @Column(nullable = false)
    private String name;
    private String category;
    private String description;
    @Column(name = "maint_interval")
    private int interval; // 'interval' is a reserved keyword in SQL

    @Column(name = "last_maintenance")
    private LocalDate lastMaintenance;

    @Column(name = "next_maintenance")
    private LocalDate nextMaintenance;

}
