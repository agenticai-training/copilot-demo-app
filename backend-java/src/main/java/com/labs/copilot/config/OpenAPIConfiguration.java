package com.labs.copilot.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI configuration for Swagger documentation.
 * Provides API metadata, contact info, and server details.
 * 
 * Access documentation at: http://localhost:8080/swagger-ui.html
 * OpenAPI JSON: http://localhost:8080/api-docs
 */
@Configuration
public class OpenAPIConfiguration {

    @Bean
    public OpenAPI defineOpenApi() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Local development server");

        Server prodServer = new Server();
        prodServer.setUrl("http://localhost:3000");
        prodServer.setDescription("API Gateway (production)");

        Contact contact = new Contact();
        contact.setName("Copilot Demo Team");
        contact.setEmail("support@copilot-demo.local");
        contact.setUrl("https://github.com/agenticai-training/copilot-demo-app");

        License mitLicense = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");

        Info info = new Info()
                .title("Product Catalog API - Search & Analytics")
                .version("1.0.0")
                .description("""
                        Product Catalog API for search, filtering, and analytics.
                        
                        **Service**: Java Backend (Read-Only)
                        **Purpose**: Product search, category navigation, and analytics
                        
                        ## Architecture
                        - **Responsibility**: Search and read-only product queries
                        - **Data Source**: MongoDB read-replica synced from .NET service
                        - **Search**: Elasticsearch-powered with full-text search
                        - **Consistency**: Eventual consistency (5-min sync lag acceptable)
                        
                        ## Authentication
                        Bearer token required for protected endpoints.
                        Token format: `Authorization: Bearer {JWT_TOKEN}`
                        
                        ## Rate Limiting
                        - **Limit**: 1000 requests per minute
                        - **Header**: `X-RateLimit-Remaining`
                        
                        ## Response Format
                        All endpoints return paginated responses with metadata:
                        - `data`: Array of product objects
                        - `pagination`: Page info (page, pageSize, totalCount, totalPages)
                        - `_metadata`: Response metadata (cached, source, searchTime, dataFreshness)
                        
                        ## Error Handling
                        Standard HTTP status codes with structured error responses.
                        """)
                .contact(contact)
                .license(mitLicense);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer));
    }
}
