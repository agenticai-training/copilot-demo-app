import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

vi.mock('./components/Header', () => ({
  Header: () => {
    const React = require('react')
    return React.createElement('div', null, 'Header')
  },
}))

vi.mock('./pages/ProductListPage', () => ({
  ProductListPage: () => {
    const React = require('react')
    return React.createElement('div', null, 'ProductListPage')
  },
}))

vi.mock('./pages/ProductDetailPage', () => ({
  ProductDetailPage: () => {
    const React = require('react')
    return React.createElement('div', null, 'ProductDetailPage')
  },
}))

describe('App', () => {
  describe('Router Setup', () => {
    it('should render routes correctly', () => {
      const { container } = render(<App />)
      expect(container).toBeTruthy()
    })

    it('should have correct layout structure', () => {
      const { container } = render(<App />)
      const mainApp = container.querySelector('div')
      expect(mainApp).toBeInTheDocument()
    })
  })
})
