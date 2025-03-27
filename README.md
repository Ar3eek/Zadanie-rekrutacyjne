# Sentiment Analyzer – analiza sentymentu tekstu

Aplikacja frontendowa umożliwiająca analizę sentymentu tekstu na podstawie treści wpisanej przez użytkownika.  
Działa w oparciu o model AI z platformy Hugging Face.

---

## Instrukcja uruchomienia projektu

1. **Sklonuj repozytorium i zainstaluj zależności**:

```bash
git clone <link-do-repo>
cd <nazwa-folderu>
npm install
```
2. **Utwórz plik `.env` w katalogu głównym projektu** na podstawie przykładu:

   *W pliku `.env` uzupełnij swój token API z Hugging Face:

   🔐 Token uzyskasz po rejestracji tutaj:  
   👉 https://huggingface.co/settings/tokens

   Po uzyskaniu tokenu dodaj go do pliku `.env`:

   ```env
   VITE_HF_API_KEY=your_token_here
   
   ```
3. **Uruchom aplikację lokalnie w trybie developerskim:**
   ```bash
   npm run dev 
 Po chwili aplikacja powinna być dostepna pod adresem
    http://localhost:5173
 
4. **(Opcjonalnie) Uruchom testy jednostkowe:**

```bash
npm run test
```
Testy zostały napisane przy użyciu biblioteki Vitest i obejmują kluczowe funkcje aplikacji:

 * validateText – walidacja danych wejściowych użytkownika

 * getTopSentiment – wybór dominującego sentymentu z odpowiedzi API

 * normalizeLabel – tłumaczenie odpowiedzi modelu na czytelne etykiety (POSITIVE, NEGATIVE)


## 🛠 Technologie użyte w projekcie

Projekt został stworzony przy użyciu nowoczesnego stosu technologicznego:

- **React** – do budowy interfejsu użytkownika (z wykorzystaniem Vite)
- **TypeScript** – zapewnia bezpieczeństwo typów i czytelność kodu
- **TailwindCSS** – szybkie i elastyczne stylowanie interfejsu
- **Hugging Face Inference API** – zewnętrzne API do analizy sentymentu tekstu
- **Vite** – szybkie środowisko developerskie i bundler
- **Vitest** – framework do testów jednostkowych
- **.env** – przechowywanie klucza API w bezpieczny sposób

## ℹ️ Informacja o modelu AI

W projekcie wykorzystano model `distilbert-base-uncased-finetuned-sst-2-english` z Hugging Face.

Ten model zwraca tylko dwa sentymenty:
- `LABEL_0` → **NEGATIVE**
- `LABEL_1` → **POSITIVE**

 **Nie obsługuje klasy `NEUTRAL`**, dlatego interfejs aplikacji oraz logika interpretacji wyników zostały odpowiednio dostosowane.


## Wyzwania napotkane podczas realizacji

- **Zarządzanie kluczem API** – wymagało utworzenia bezpiecznego pliku `.env`, aby token Hugging Face nie trafił do repozytorium. Rozwiązaniem było dodanie `.env.example` oraz uwzględnienie `.env` w `.gitignore`.

- **Ograniczenie modelu AI** – użyty model Hugging Face (`distilbert-base-uncased-finetuned-sst-2-english`) zwraca tylko dwie klasy (`LABEL_0`, `LABEL_1`).
   Początkowo założyłem, że obsługuje również `NEUTRAL`, co wymagało korekty logiki aplikacji i testów.

- **Konfiguracja testów z Vitest** – początkowo środowisko testowe nie rozpoznawało funkcji typu `expect().toBe()`.
   Problem wynikał z braku typów `vitest` w `tsconfig`. Po dodaniu `"types": ["vitest"]` i zrestartowaniu edytora –wszystko działało poprawnie.

-  **Poprawna interpretacja danych z API** – odpowiedź z API to tablica tablic z obiektami (`data[0][0].label` itd.).
   Należało napisać logikę wybierającą wynik z najwyższym `score`, a potem go znormalizować (`LABEL_1` → `POSITIVE` itd.).










