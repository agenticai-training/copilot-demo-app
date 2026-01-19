import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from './useDarkMode'

describe('useDarkMode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.resetModules()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  describe('Initialization', () => {
    it('should return isDark=false initially', () => {
      localStorage.getItem.mockReturnValueOnce(null)
      window.matchMedia.mockReturnValueOnce({ matches: false })

      const { result } = renderHook(() => useDarkMode())

      expect(result.current.isDark).toBe(false)
    })

    it('should read from localStorage if available', () => {
      localStorage.getItem.mockReturnValueOnce('true')

      const { result } = renderHook(() => useDarkMode())

      expect(result.current.isDark).toBe(true)
    })

    it('should use system preference if no localStorage', () => {
      localStorage.getItem.mockReturnValueOnce(null)
      window.matchMedia.mockReturnValueOnce({ matches: true })

      const { result } = renderHook(() => useDarkMode())

      expect(result.current.isDark).toBe(true)
    })

    it('should parse localStorage boolean correctly', () => {
      localStorage.getItem.mockReturnValueOnce('false')

      const { result } = renderHook(() => useDarkMode())

      expect(result.current.isDark).toBe(false)
    })
  })

  describe('DOM Updates', () => {
    it('should add dark class when isDark=true', () => {
      localStorage.getItem.mockReturnValueOnce('true')

      renderHook(() => useDarkMode())

      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should remove dark class when isDark=false', () => {
      document.documentElement.classList.add('dark')
      localStorage.getItem.mockReturnValueOnce('false')

      renderHook(() => useDarkMode())

      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('Persistence', () => {
    it('should save to localStorage on toggle', () => {
      localStorage.getItem.mockReturnValueOnce(null)
      window.matchMedia.mockReturnValueOnce({ matches: false })

      const { result } = renderHook(() => useDarkMode())

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true')
    })
  })

  describe('Toggle Function', () => {
    it('should toggle isDark state', () => {
      localStorage.getItem.mockReturnValueOnce(null)
      window.matchMedia.mockReturnValueOnce({ matches: false })

      const { result } = renderHook(() => useDarkMode())

      expect(result.current.isDark).toBe(false)

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(result.current.isDark).toBe(true)

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(result.current.isDark).toBe(false)
    })
  })
})
