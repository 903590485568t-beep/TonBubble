# TonBublle

Сайт TonBublle: вставляешь CA (Jetton master address) на TON → получаешь Bubble Map холдеров.

## Запуск

1. Создай `.env` (можно скопировать из `.env.example`)
2. Установи зависимости и запусти:

```bash
npm install
npm run dev
```

Откроется:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## TonAPI ключ

Без ключа TonAPI может ограничивать частоту запросов. Если есть ключ — положи его в `TONAPI_KEY` в `.env` (ключ хранится на сервере, во фронт не попадает).

## Deploy на Vercel

Проект уже собирается командой:

```bash
npm run build
```

### Вариант 1: через Vercel Dashboard

1. Залей проект в GitHub.
2. В Vercel нажми **Add New Project** и выбери репозиторий.
3. Framework preset: **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. В Environment Variables добавь:
   - `TONAPI_KEY` (если используешь ключ)
   - `CACHE_TTL_SECONDS` (опционально, например `120`)
7. Нажми Deploy.

### Вариант 2: через Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Как залить проект на GitHub (с нуля)

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

---

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
