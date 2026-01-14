package com.labs.copilot.controller;

import com.labs.copilot.dto.ErrorResponse;
import com.labs.copilot.dto.PaginatedResponse;
import com.labs.copilot.dto.ResponseMetadata;
import com.labs.copilot.model.Product;
import com.labs.copilot.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Product controller for product search and retrieval endpoints.
 * 
 * This controller implements the read-only product API for the Java service.
 * It routes to: GET /api/v1/products and GET /api/v1/search
 * 
 * All endpoints return paginated responses with metadata about data freshness and source.
 */
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Products", description = "Product search and retrieval endpoints")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Get all products with pagination and sorting.
     * 
     * GET /api/v1/products?page=1&pageSize=20&sortBy=name&sortOrder=asc
     *
     * @param page      page number (1-based, default: 1)
     * @param pageSize  items per page (default: 20, max: 100)
     * @param sortBy    sort field (name, price, created; default: name)
     * @param sortOrder sort order (asc or desc; default: asc)
     * @return paginated product list
     */
    @GetMapping("/products")
    @Operation(summary = "Get all products", description = "Retrieve all active products with pagination and sorting support")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved products",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<Product>> getAllProducts(
            @Parameter(description = "Page number (1-based)", example = "1")
            @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "Items per page (max 100)", example = "20")
            @RequestParam(defaultValue = "20") Integer pageSize,
            @Parameter(description = "Sort field: name, price, or created", example = "name")
            @RequestParam(defaultValue = "name") String sortBy,
            @Parameter(description = "Sort order: asc or desc", example = "asc")
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        // Validate pagination parameters
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        try {
            ProductService.SearchResult result = productService.searchProducts(page, pageSize, sortBy, sortOrder);

            PaginatedResponse<Product> response = new PaginatedResponse<>();
            response.setData(result.products);
            response.setPagination(new PaginatedResponse.PaginationInfo(
                    result.page,
                    result.pageSize,
                    result.totalCount,
                    result.totalPages
            ));

            ResponseMetadata metadata = new ResponseMetadata();
            metadata.setCached(result.cached);
            metadata.setCacheAge("120s");
            metadata.setSource(result.source);
            metadata.setTimestamp(LocalDateTime.now());
            response.set_metadata(metadata);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get a product by ID.
     * 
     * GET /api/v1/products/{productId}
     *
     * @param productId product UUID
     * @return product details or 404 if not found
     */
    @GetMapping("/products/{productId}")
    @Operation(summary = "Get product by ID", description = "Retrieve a specific product by its UUID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found"),
            @ApiResponse(responseCode = "400", description = "Invalid product ID format"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> getProductById(
            @Parameter(description = "Product UUID", example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable String productId) {
        try {
            UUID id = UUID.fromString(productId);
            Optional<Product> product = productService.getProductById(id);

            if (product.isPresent()) {
                ResponseMetadata metadata = new ResponseMetadata();
                metadata.setCached(true);
                metadata.setCacheAge("300s");
                metadata.setSource("redis");
                
                return ResponseEntity.ok(product.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(
                                "Product not found",
                                "PRODUCT_NOT_FOUND",
                                "/api/v1/products/" + productId
                        ));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(
                            "Invalid product ID format",
                            "INVALID_ID_FORMAT",
                            "/api/v1/products/" + productId
                    ));
        }
    }

    /**
     * Search products with filters.
     * 
     * GET /api/v1/search?query=laptop&category=Electronics&minPrice=500&maxPrice=1500&inStock=true
     *
     * @param query     search query (searches name and description)
     * @param category  filter by category
     * @param minPrice  minimum price filter
     * @param maxPrice  maximum price filter
     * @param inStock   filter by stock availability (true = in stock only)
     * @param page      page number (default: 1)
     * @param pageSize  items per page (default: 20)
     * @return search results with pagination
     */
    @GetMapping("/search")
    @Operation(summary = "Search products", description = "Full-text search products with optional category, price, and stock filters")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search completed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid filter parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<Product>> searchProducts(
            @Parameter(description = "Search query (searches name and description)", example = "laptop")
            @RequestParam(required = false) String query,
            @Parameter(description = "Product category filter", example = "Electronics")
            @RequestParam(required = false) String category,
            @Parameter(description = "Minimum price filter", example = "500")
            @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price filter", example = "1500")
            @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Filter by stock availability", example = "true")
            @RequestParam(required = false) Boolean inStock,
            @Parameter(description = "Page number (1-based)", example = "1")
            @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "Items per page (max 100)", example = "20")
            @RequestParam(defaultValue = "20") Integer pageSize) {

        long startTime = System.currentTimeMillis();
        
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        try {
            ProductService.SearchResult result = productService.searchByFilters(
                    query, category, minPrice, maxPrice, inStock, page, pageSize
            );

            PaginatedResponse<Product> response = new PaginatedResponse<>();
            response.setData(result.products);
            response.setPagination(new PaginatedResponse.PaginationInfo(
                    result.page,
                    result.pageSize,
                    result.totalCount,
                    result.totalPages
            ));

            ResponseMetadata metadata = new ResponseMetadata();
            metadata.setCached(result.cached);
            metadata.setSource(result.source);
            metadata.setSearchTime((System.currentTimeMillis() - startTime) + "ms");
            metadata.setDataFreshness("current");
            response.set_metadata(metadata);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search products by category.
     * 
     * GET /api/v1/products/category/{category}
     *
     * @param category category name
     * @param page     page number
     * @param pageSize items per page
     * @return products in category
     */
    @GetMapping("/products/category/{category}")
    @Operation(summary = "Get products by category", description = "Retrieve all products in a specific category with pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved category products"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<Product>> getByCategory(
            @Parameter(description = "Category name", example = "Electronics")
            @PathVariable String category,
            @Parameter(description = "Page number (1-based)", example = "1")
            @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "Items per page (max 100)", example = "20")
            @RequestParam(defaultValue = "20") Integer pageSize) {

        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        try {
            ProductService.SearchResult result = productService.getByCategory(category, page, pageSize);

            PaginatedResponse<Product> response = new PaginatedResponse<>();
            response.setData(result.products);
            response.setPagination(new PaginatedResponse.PaginationInfo(
                    result.page,
                    result.pageSize,
                    result.totalCount,
                    result.totalPages
            ));

            ResponseMetadata metadata = new ResponseMetadata();
            metadata.setCached(result.cached);
            metadata.setSource(result.source);
            response.set_metadata(metadata);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Health check endpoint.
     * 
     * GET /api/v1/health
     */
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the product service is running")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Service is running")
    })
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Product search service is running");
    }
}
