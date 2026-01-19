import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProducts } from './useProducts'
import { useProductStore } from '../store/productStore'
import { mockProduct, mockPaginatedResponse } from '../test/mocks/productMocks'

vi.mock('../store/productStore', () => ({
  useProductStore: vi.fn(),
}))

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Hook Return Values', () => {
    it('should return all store products', () => {
      const mockStore = {
        products: [mockProduct],
        currentProduct: null,
        loading: false,
        error: null,
        page: 1,
        pageSize: 12,
        totalPages: 1,
        totalCount: 1,
        sortBy: 'name',
        sortOrder: 'asc',
        searchQuery: '',
        selectedCategory: null,
        minPrice: null,
        maxPrice: null,
        inStock: null,
        fetchProducts: vi.fn(),
        fetchProductById: vi.fn(),
        setSearchQuery: vi.fn(),
        setCategory: vi.fn(),
        setPriceRange: vi.fn(),
        setStockFilter: vi.fn(),
        setSorting: vi.fn(),
        setPage: vi.fn(),
        setPageSize: vi.fn(),
        clearFilters: vi.fn(),
        resetCurrentProduct: vi.fn(),
      }

      useProductStore.mockReturnValue(mockStore)

      const { result } = renderHook(() => useProducts())

      expect(result.current.products).toEqual([mockProduct])
    })

    it('should return all store state values', () => {
      const mockStore = {
        products: [mockProduct],
        currentProduct: mockProduct,
        loading: true,
        error: 'Test error',
        page: 2,
        pageSize: 24,
        totalPages: 5,
        totalCount: 100,
        sortBy: 'price',
        sortOrder: 'desc',
        searchQuery: 'test',
        selectedCategory: 'electronics',
        minPrice: 100,
        maxPrice: 500,
        inStock: true,
        fetchProducts: vi.fn(),
        fetchProductById: vi.fn(),
        setSearchQuery: vi.fn(),
        setCategory: vi.fn(),
        setPriceRange: vi.fn(),
        setStockFilter: vi.fn(),
        setSorting: vi.fn(),
        setPage: vi.fn(),
        setPageSize: vi.fn(),
        clearFilters: vi.fn(),
        resetCurrentProduct: vi.fn(),
      }

      useProductStore.mockReturnValue(mockStore)

      const { result } = renderHook(() => useProducts())

      expect(result.current.loading).toBe(true)
      expect(result.current.error).toBe('Test error')
      expect(result.current.page).toBe(2)
      expect(result.current.pageSize).toBe(24)
      expect(result.current.totalPages).toBe(5)
      expect(result.current.totalCount).toBe(100)
    })

    it('should return all action functions', () => {
      const mockStore = {
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
        fetchProducts: vi.fn(),
        fetchProductById: vi.fn(),
        setSearchQuery: vi.fn(),
        setCategory: vi.fn(),
        setPriceRange: vi.fn(),
        setStockFilter: vi.fn(),
        setSorting: vi.fn(),
        setPage: vi.fn(),
        setPageSize: vi.fn(),
        clearFilters: vi.fn(),
        resetCurrentProduct: vi.fn(),
      }

      useProductStore.mockReturnValue(mockStore)

      const { result } = renderHook(() => useProducts())

      expect(typeof result.current.fetchProducts).toBe('function')
      expect(typeof result.current.setSearchQuery).toBe('function')
      expect(typeof result.current.setCategory).toBe('function')
      expect(typeof result.current.clearFilters).toBe('function')
    })

    it('should return pagination info', () => {
      const mockStore = {
        products: [mockProduct],
        currentProduct: null,
        loading: false,
        error: null,
        page: 3,
        pageSize: 20,
        totalPages: 10,
        totalCount: 200,
        sortBy: 'name',
        sortOrder: 'asc',
        searchQuery: '',
        selectedCategory: null,
        minPrice: null,
        maxPrice: null,
        inStock: null,
        fetchProducts: vi.fn(),
        fetchProductById: vi.fn(),
        setSearchQuery: vi.fn(),
        setCategory: vi.fn(),
        setPriceRange: vi.fn(),
        setStockFilter: vi.fn(),
        setSorting: vi.fn(),
        setPage: vi.fn(),
        setPageSize: vi.fn(),
        clearFilters: vi.fn(),
        resetCurrentProduct: vi.fn(),
      }

      useProductStore.mockReturnValue(mockStore)

      const { result } = renderHook(() => useProducts())

      expect(result.current.page).toBe(3)
      expect(result.current.totalPages).toBe(10)
      expect(result.current.totalCount).toBe(200)
    })
  })

  describe('Effect Trigger', () => {
    it('should call fetchProducts on mount', () => {
      const fetchProductsMock = vi.fn()
      const mockStore = {
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
        fetchProducts: fetchProductsMock,
        fetchProductById: vi.fn(),
        setSearchQuery: vi.fn(),
        setCategory: vi.fn(),
        setPriceRange: vi.fn(),
        setStockFilter: vi.fn(),
        setSorting: vi.fn(),
        setPage: vi.fn(),
        setPageSize: vi.fn(),
        clearFilters: vi.fn(),
        resetCurrentProduct: vi.fn(),
      }

      useProductStore.mockReturnValue(mockStore)

      renderHook(() => useProducts())

      expect(fetchProductsMock).toHaveBeenCalled()
    })
  })
})
