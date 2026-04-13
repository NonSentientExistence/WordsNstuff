import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    // Mocka fetch — det finns ingen riktig backend under testning
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({ message: 'Hello from mock!' })
    } as Response)
  })

  it('visar en rubrik', () => {
    render(<App />)
    expect(screen.getByText('A message from our backend')).toBeInTheDocument()
  })

  it('visar meddelandet från API:et', async () => {
    render(<App />)
    expect(await screen.findByText('Hello from mock!')).toBeInTheDocument()
  })
})