import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('shows the home page heading', () => {
    render(<App />)
    expect(screen.getByText('WordsNstuff')).toBeInTheDocument()
  })

  it('shows create lobby button', () => {
    render(<App />)
    expect(screen.getByText('Create Lobby')).toBeInTheDocument()
  })
})
