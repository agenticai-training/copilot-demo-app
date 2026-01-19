import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProductStore } from './productStore'
import * as productService from '../services/productService'
import {
  mockProduct,
  mockPaginatedResponse,
  mockEmptyPaginatedResponse,
} from '../test/mocks/productMocks'

vi.mock('../services/productService', () => ({
  getAllProducts: vi.fn(),
  getProductById: vi.fn(),
  searchProducts: vi.fn(),
  getByCategory: vi.fn(),
}))

describe('useProductStore (Zustand)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store to initial state
    useProductStore.setState({
      products: [],
      currentProduct: null,
      loading: false,
      error: null,
      page: 1,
      pageSize: 12,
      totalPages: 1,
      totalCount: 0,
      sortBy: 'name',
      sortOrder: 'asc',
      searchQuery: '',
      selectedCategory: null,
      minPrice: null,
      maxPrice: null,
      inStock: null,
    })
  })

  describe('Initial State', () => {
    it('should have all state values initialized correctly', () => {
      const state = useProductStore.getState()

      expect(state.products).toEqual([])
      expect(state.currentProduct).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.page).toBe(1)
      expect(state.pageSize).toBe(12)
      expect(state.totalPages).toBe(1)
      expect(state.totalCount).toBe(0)
      expect(state.sortBy).toBe('name')
      expect(state.sortOrder).toBe('asc')
      expect(state.searchQuery).toBe('')
      expect(state.selectedCategory).toBeNull()
    })
  })

  describe('fetchProducts - General Fetch', () => {
    it('should call getAllProducts with correct parameters', async () => {
      productService.getAllProducts.mockResolvedValueOnce(
        mockPaginatedResponse
      )

      await useProductStore.getState().fetchProducts()

      expect(productService.getAllProducts).toHaveBeenCalled()
    })

    it('should set loading to true on start', async () => {
      productService.getAllProducts.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve(mockPaginatedResponse), 100))
      )

      const promise = useProductStore.getState().fetchProducts()
      let state = useProductStore.getState()
      expect(state.loading).toBe(true)

      await promise
    })

    it('should clear error on start', async () => {
      useProductStore.setState({ error: 'Previous error' })
      productService.getAllProducts.mockResolvedValueOnce(
        mockPaginatedResponse
      )

      await useProductStore.getState().fetchProducts()

      const state = useProductStore.getState()
      expect(state.error).toBeNull()
    })

    it('should update products array on success', async () => {
      productService.getAllProducts.mockResolvedValueOnce(
        mockPaginatedResponse
      )

      await useProductStore.getState().fetchProducts()

      const state = useProductStore.getState()
      expect(state.products).toEqual(mockPaginatedResponse.data)
    })

    it('should update pagination info on success', async () => {
      productService.getAllProducts.mockResolvedValueOnce(
        mockPaginatedResponse
      )

      await useProductStore.getState().fetchProducts()

      const state = useProductStore.getState()
      expect(state.totalCount).toBe(mockPaginatedResponse.pagination.totalCount)
      expect(state.totalPages).toBe(mockPaginatedResponse.pagination.totalPages)
    })

    it('should set loading to false on success', async () => {
      productService.getAllProducts.mockResolvedValueOnce(
        mockPaginatedResponse
      )

      await useProductStore.getState().fetchProducts()

      const state = useProductStore.getState()
      expect(state.loading).toBe(false)
    })

    it('should set error and loading on failure', async () => {
      productService.getAllProducts.mockRejectedValueOnce(
        new Error('API Error')
      )

      await useProductStore.getState().fetchProducts()

      const state = useProductStore.getState()
      expect(state.error).toBeTruthy()
      expect(state.loading).toBe(false)
    })
  })

  describe('fetchProducts - Conditional Logic', () => {
    it('should call searchProducts when searchQuery is set', async () => {
      useProductStore.setState({ searchQuery: 'laptop' })
      productService.searchProducts.mockResolvedValueOnce(
        mockPaginatedResponse
      )

      await useProductStore.getState().fetchProducts()

      expect(productService.searchProducts).toHaveBeenCalled()
      expect(productService.getAllProducts).not.toHaveBeenCalled()
    })

    it('should call getByCategory when selectedCategory is set', async () => {
      useProductStore.setState({ selectedCategory: 'electronics' })
      productService.getByCategory.mockResolvedValueOnce(
        mockPaginatedResponse
      )

      await useProductStore.getState().fetchProducts()

      expect(productService.getByCategory).toHaveBeenCalled()
      expect(productService.getAllProducts).not.toHaveBeenCalled()
    })

    it('should prioritize search over category', async () => {
      useProductStore.setState({
        searchQuery: 'laptop',
        selectedCategory: 'electronics',
      })
      productService.searchProducts.mockResolvedValueOnce(
        mockPaginatedResponse
      )

      await useProductStore.getState().fetchProducts()

      expect(productService.searchProducts).toHaveBeenCalled()
      expect(productService.getByCategory).not.toHaveBeenCalled()
    })

    it('should use default getAllProducts when no filters set', async () => {
      productService.getAllProducts.mockResolvedValueOnce(
        mockPaginatedResponse
      )

      await useProductStore.getState().fetchProducts()

      expect(productService.getAllProducts).toHaveBeenCalled()
    })
  })

  describe('fetchProductById', () => {
    it('should call productService.getProductById with correct ID', async () => {
      productService.getProductById.mockResolvedValueOnce(mockProduct)

      await useProductStore.getState().fetchProductById('123')

      expect(productService.getProductById).toHaveBeenCalledWith('123')
    })

    it('should set currentProduct on success', async () => {
      productService.getProductById.mockResolvedValueOnce(mockProduct)

      await useProductStore.getState().fetchProductById('123')

      const state = useProductStore.getState()
      expect(state.currentProduct).toEqual(mockProduct)
    })

    it('should set error and loading on failure', async () => {
      productService.getProductById.mockRejectedValueOnce(
        new Error('Not Found')
      )

      await useProductStore.getState().fetchProductById('999')

      const state = useProductStore.getState()
      expect(state.error).toBeTruthy()
      expect(state.loading).toBe(false)
    })
  })

  describe('Filter Setters', () => {
    it('setSearchQuery updates state and resets page to 1', () => {
      useProductStore.setState({ page: 5 })

      useProductStore.getState().setSearchQuery('laptop')

      const state = useProductStore.getState()
      expect(state.searchQuery).toBe('laptop')
      expect(state.page).toBe(1)
    })

    it('setCategory updates state and resets page to 1', () => {
      useProductStore.setState({ page: 3 })

      useProductStore.getState().setCategory('electronics')

      const state = useProductStore.getState()
      expect(state.selectedCategory).toBe('electronics')
      expect(state.page).toBe(1)
    })

    it('setPriceRange updates min/max and resets page', () => {
      useProductStore.setState({ page: 2 })

      useProductStore.getState().setPriceRange(100, 500)

      const state = useProductStore.getState()
      expect(state.minPrice).toBe(100)
      expect(state.maxPrice).toBe(500)
      expect(state.page).toBe(1)
    })

    it('setStockFilter updates state and resets page', () => {
      useProductStore.setState({ page: 2 })

      useProductStore.getState().setStockFilter(true)

      const state = useProductStore.getState()
      expect(state.inStock).toBe(true)
      expect(state.page).toBe(1)
    })

    it('setSorting updates sort params and resets page', () => {
      useProductStore.setState({ page: 3 })

      useProductStore.getState().setSorting('price', 'desc')

      const state = useProductStore.getState()
      expect(state.sortBy).toBe('price')
      expect(state.sortOrder).toBe('desc')
      expect(state.page).toBe(1)
    })
  })

  describe('Pagination Setters', () => {
    it('setPage updates page without resetting', () => {
      useProductStore.setState({ page: 1 })

      useProductStore.getState().setPage(3)

      const state = useProductStore.getState()
      expect(state.page).toBe(3)
    })

    it('setPageSize updates size and resets page', () => {
      useProductStore.setState({ page: 2 })

      useProductStore.getState().setPageSize(24)

      const state = useProductStore.getState()
      expect(state.pageSize).toBe(24)
      expect(state.page).toBe(1)
    })
  })

  describe('Utility Functions', () => {
    it('clearFilters resets all filters to initial state', () => {
      useProductStore.setState({
        searchQuery: 'test',
        selectedCategory: 'electronics',
        minPrice: 100,
        maxPrice: 500,
        inStock: true,
        page: 3,
      })

      useProductStore.getState().clearFilters()

      const state = useProductStore.getState()
      expect(state.searchQuery).toBe('')
      expect(state.selectedCategory).toBeNull()
      expect(state.minPrice).toBeNull()
      expect(state.maxPrice).toBeNull()
      expect(state.inStock).toBeNull()
      expect(state.page).toBe(1)
    })

    it('resetCurrentProduct clears product', () => {
      useProductStore.setState({ currentProduct: mockProduct })

      useProductStore.getState().resetCurrentProduct()

      const state = useProductStore.getState()
      expect(state.currentProduct).toBeNull()
    })
  })
})
