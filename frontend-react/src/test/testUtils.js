import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

export function renderWithRouter(component) {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

export function renderWithRouterAndParams(component, params = {}) {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}
