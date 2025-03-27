import { useState } from 'react'

const MAX_LENGTH = 500
const API_URL =
    'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english'
const API_KEY = import.meta.env.VITE_HF_API_KEY

type Sentiment = 'POSITIVE' | 'NEGATIVE'

function validateText(text: string): string | null {
    if (!text.trim()) return 'Tekst nie może być pusty.'
    if (text.length > MAX_LENGTH) return `Tekst nie może przekraczać ${MAX_LENGTH} znaków.`
    return null
}

function getTopSentiment(data: any): string {
    if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
        console.warn('⚠️ Nieoczekiwany format odpowiedzi:', data)
        return 'LABEL_0'
    }

    const predictions = data[0]
    const top = predictions.reduce((prev, curr) =>
        curr.score > prev.score ? curr : prev
    )

    return top.label || 'LABEL_0'
}

function normalizeLabel(raw: string | undefined): Sentiment {
    if (raw === 'LABEL_1' || raw?.toUpperCase() === 'POSITIVE') return 'POSITIVE'
    if (raw === 'LABEL_0' || raw?.toUpperCase() === 'NEGATIVE') return 'NEGATIVE'
    return 'NEGATIVE'
}

export default function SentimentAnalyzer() {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [result, setResult] = useState<Sentiment | null>(null)
    const [showModal, setShowModal] = useState(false)

    const analyze = async () => {
        console.log('⬆️ Przycisk został kliknięty')
        console.log('📝 Tekst:', text)

        const validationError = validateText(text)
        if (validationError) {
            console.warn('❌ Błąd walidacji:', validationError)
            setError(validationError)
            return
        }

        setError('')
        setResult(null)
        setShowModal(false)
        setLoading(true)

        try {
            console.log('📡 Wysyłam zapytanie do API...')
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: text }),
            })

            if (!response.ok) throw new Error(`Błąd API: ${response.status}`)

            const data = await response.json()
            console.log('📥 Odpowiedź z API:', data)

            const rawLabel = getTopSentiment(data)
            console.log('🏷️ Ustalony label:', rawLabel)

            const normalized = normalizeLabel(rawLabel)
            console.log('✅ Znormalizowany:', normalized)

            setResult(normalized)
            setShowModal(true)
        } catch (err: any) {
            console.error('💥 Błąd w analizie:', err)
            setError(err.message || 'Wystąpił błąd podczas analizy.')
        } finally {
            setLoading(false)
        }
    }

    const sentimentIcon = {
        POSITIVE: '😊',
        NEGATIVE: '😞',
    }

    const sentimentDescription = {
        POSITIVE: 'To pozytywny sentyment — super wiadomość! 👌',
        NEGATIVE: 'To negatywny sentyment — może warto złagodzić ton? 🧐',
    }

    const sentimentBgColor = {
        POSITIVE: 'bg-green-100',
        NEGATIVE: 'bg-red-100',
    }

    return (
        <div className="max-w-xl w-full mx-auto mt-10 p-4 bg-white rounded-xl shadow">
      <textarea
          className="w-full border border-gray-300 rounded p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={MAX_LENGTH}
          placeholder="Wpisz tekst do analizy (max 500 znaków)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
      />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <span>{text.length}/{MAX_LENGTH}</span>
                {error && <span className="text-red-500">{error}</span>}
            </div>
            <button
                onClick={analyze}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Analizuję...' : 'Analizuj'}
            </button>

            {showModal && result && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className={`p-6 rounded-xl max-w-sm text-center shadow-xl ${sentimentBgColor[result]} bg-white`}>
                        <div className="text-5xl mb-2">{sentimentIcon[result]}</div>
                        <h2 className="text-2xl font-bold mb-2">{result}</h2>
                        <p className="text-gray-700">{sentimentDescription[result]}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                        >
                            Zamknij
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
