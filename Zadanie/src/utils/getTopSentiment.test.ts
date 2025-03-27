/// <reference types="vitest" />
import { describe, it, expect } from 'vitest'

function getTopSentiment(data: any): string {
    if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) return 'LABEL_0'
    const predictions = data[0]
    const top = predictions.reduce((prev, curr) =>
        curr.score > prev.score ? curr : prev
    )
    return top.label || 'LABEL_0'
}

describe('getTopSentiment', () => {
    it('returns label with highest score', () => {
        const data = [
            [
                { label: 'LABEL_0', score: 0.3 },
                { label: 'LABEL_1', score: 0.7 }
            ]
        ]
        expect(getTopSentiment(data)).toBe('LABEL_1')
    })
})
