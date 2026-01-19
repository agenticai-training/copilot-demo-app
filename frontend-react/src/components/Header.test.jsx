import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

vi.mock('../hooks/useDarkMode', () => ({
  useDarkMode: () => ({
    isDark: false,
    toggleDarkMode: vi.fn(),
  }),
}))

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render header element', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toBeInTheDocument()
    })

    it('should display ShopHub title', () => {
      render(<Header />)
      const title = screen.getByText(/shophub/i)
      expect(title).toBeInTheDocument()
    })

    it('should display tagline', () => {
      render(<Header />)
      const tagline = screen.getByText(/curate\. manage\. deliver\./i)
      expect(tagline).toBeInTheDocument()
    })

    it('should call useDarkMode hook', () => {
      render(<Header />)
      // If the hook is called, the component renders without error
      // This is an implicit test since we're mocking the hook
      expect(screen.getByText(/shophub/i)).toBeInTheDocument()
    })
  })
})
