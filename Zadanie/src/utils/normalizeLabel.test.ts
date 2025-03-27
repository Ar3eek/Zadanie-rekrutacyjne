/// <reference types="vitest" />
import { describe, it, expect } from 'vitest'

function normalizeLabel(raw: string | undefined): 'POSITIVE' | 'NEGATIVE' {
    if (raw === 'LABEL_1') return 'POSITIVE'
    if (raw === 'LABEL_0') return 'NEGATIVE'

    const value = raw?.toUpperCase() || ''

    if (value.includes('POS')) return 'POSITIVE'
    if (value.includes('NEG')) return 'NEGATIVE'

    return 'NEGATIVE' // fallback
}

describe('normalizeLabel', () => {
    it('returns POSITIVE for LABEL_1', () => {
        expect(normalizeLabel('LABEL_1')).toBe('POSITIVE')
    })

    it('returns NEGATIVE for LABEL_0', () => {
        expect(normalizeLabel('LABEL_0')).toBe('NEGATIVE')
    })

    it('returns POSITIVE for "POSITIVE"', () => {
        expect(normalizeLabel('POSITIVE')).toBe('POSITIVE')
    })

    it('returns NEGATIVE for undefined', () => {
        expect(normalizeLabel(undefined)).toBe('NEGATIVE')
    })

    it('returns NEGATIVE for unknown label', () => {
        expect(normalizeLabel('whatever')).toBe('NEGATIVE')
    })
})
