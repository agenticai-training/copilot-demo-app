export const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'A test product',
  price: 99.99,
  stockQuantity: 10,
  category: 'electronics',
  status: 'ACTIVE',
  sku: 'TEST-001',
  primaryImageUrl: 'https://example.com/image.jpg',
  images: [
    {
      id: 'img1',
      url: 'https://example.com/image.jpg',
      isPrimary: true,
    },
    {
      id: 'img2',
      url: 'https://example.com/image2.jpg',
      isPrimary: false,
    },
  ],
  attributes: {
    color: 'Red',
    size: 'Medium',
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
}

export const mockProductList = [
  mockProduct,
  {
    ...mockProduct,
    id: '2',
    name: 'Product 2',
    price: 49.99,
    stockQuantity: 0,
    status: 'INACTIVE',
  },
  {
    ...mockProduct,
    id: '3',
    name: 'Product 3',
    price: 199.99,
    stockQuantity: 5,
    status: 'DISCONTINUED',
  },
]

export const mockPaginatedResponse = {
  data: mockProductList,
  pagination: {
    page: 1,
    pageSize: 12,
    totalCount: 25,
    totalPages: 3,
  },
}

export const mockEmptyPaginatedResponse = {
  data: [],
  pagination: {
    page: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 0,
  },
}

export const mockProductWithoutImages = {
  ...mockProduct,
  primaryImageUrl: null,
  images: [],
}
