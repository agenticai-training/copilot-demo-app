package com.labs.copilot.model;

import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Product entity representing a product in the catalog.
 * This is a read-only model synchronized from the .NET service (PostgreSQL).
 */
@Schema(description = "Product catalog item with pricing, inventory, and metadata")
public class Product implements Serializable {
    private static final long serialVersionUID = 1L;

    @Schema(description = "Unique product identifier (UUID)", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;
    
    @Schema(description = "Product name", example = "Laptop", minLength = 1, maxLength = 100)
    private String name;
    
    @Schema(description = "Product description", example = "High-performance laptop for developers", maxLength = 500)
    private String description;
    
    @Schema(description = "Product price (decimal, 2 digits max)", example = "999.99")
    private BigDecimal price;
    
    @Schema(description = "Product category", example = "Electronics", minLength = 1, maxLength = 50)
    private String category;
    
    @Schema(description = "Stock quantity available", example = "50", minimum = "0")
    private Integer stockQuantity;
    
    @Schema(description = "Stock Keeping Unit (unique identifier)", example = "LAPTOP-001")
    private String sku;
    
    @Schema(description = "Product images with URLs and metadata")
    private List<ProductImage> images;
    
    @Schema(description = "Product attributes (color, size, weight, etc.)")
    private Map<String, String> attributes;
    
    @Schema(description = "Product status (ACTIVE, INACTIVE, DISCONTINUED)", example = "ACTIVE")
    private ProductStatus status;
    
    @Schema(description = "Product creation timestamp (ISO8601 format)", example = "2026-01-13T10:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Product last update timestamp (ISO8601 format)", example = "2026-01-13T10:00:00")
    private LocalDateTime updatedAt;
    
    @Schema(description = "User ID who created the product", example = "user-123")
    private String createdBy;
    
    @Schema(description = "User ID who last updated the product", example = "user-456")
    private String updatedBy;

    // Constructors
    public Product() {
    }

    public Product(UUID id, String name, BigDecimal price, String category, String sku) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.sku = sku;
        this.status = ProductStatus.ACTIVE;
        this.stockQuantity = 0;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    public Map<String, String> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<String, String> attributes) {
        this.attributes = attributes;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", category='" + category + '\'' +
                ", sku='" + sku + '\'' +
                ", status=" + status +
                ", stockQuantity=" + stockQuantity +
                '}';
    }
}
