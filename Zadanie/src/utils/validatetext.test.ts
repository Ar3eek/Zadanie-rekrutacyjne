/// <reference types="vitest" />
import { describe, it, expect } from 'vitest'

const MAX_LENGTH = 500

function validateText(text: string): string | null {
    const cleaned = text.trim()
    if (!cleaned) return 'Tekst nie może być pusty.'
    if (cleaned.length > MAX_LENGTH) return `Tekst nie może przekraczać ${MAX_LENGTH} znaków.`
    return null
}

describe('validateText', () => {
    it('odrzuca pusty string', () => {
        expect(validateText('')).toBe('Tekst nie może być pusty.')
    })

    it('odrzuca ciąg z samych spacji', () => {
        expect(validateText('     ')).toBe('Tekst nie może być pusty.')
    })

    it('akceptuje poprawny tekst', () => {
        expect(validateText('To jest normalny tekst')).toBe(null)
    })

    it('odrzuca tekst dłuższy niż 500 znaków', () => {
        const longText = 'a'.repeat(501)
        expect(validateText(longText)).toBe(`Tekst nie może przekraczać ${MAX_LENGTH} znaków.`)
    })

    it('akceptuje dokładnie 500 znaków', () => {
        const exact = 'a'.repeat(500)
        expect(validateText(exact)).toBe(null)
    })
})
