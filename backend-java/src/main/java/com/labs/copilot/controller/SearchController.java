package com.labs.copilot.controller;

import com.labs.copilot.dto.PaginatedResponse;
import com.labs.copilot.dto.ResponseMetadata;
import com.labs.copilot.model.Product;
import com.labs.copilot.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Search controller for root-level /search endpoint.
 * 
 * This controller provides search functionality at the root path /search
 * to support the API contract for product search queries.
 */
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {

    @Autowired
    private ProductService productService;

    /**
     * Search products with filters at root level.
     * 
     * GET /search?query=laptop&category=Electronics&minPrice=500&maxPrice=1500&inStock=true
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
    public ResponseEntity<PaginatedResponse<Product>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {

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
            metadata.setCacheAge("60s");
            metadata.setSource(result.source);
            metadata.setTimestamp(LocalDateTime.now());
            response.set_metadata(metadata);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
