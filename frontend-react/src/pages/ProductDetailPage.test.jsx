import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockProduct } from '../test/mocks/productMocks'

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Unit Tests', () => {
    it('should have a test infrastructure in place', () => {
      expect(mockProduct).toBeTruthy()
      expect(mockProduct.id).toBe('1')
    })
  })
})
