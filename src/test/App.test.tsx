import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('visar startsidan med rubrik', () => {
    render(<App />)
    expect(screen.getByText('WordsNstuff')).toBeInTheDocument()
  })

  it('visar skapa lobby-knapp', () => {
    render(<App />)
    expect(screen.getByText('Skapa lobby')).toBeInTheDocument()
  })
})
