# ColdMessage

Generador de mensajes personalizados para LinkedIn usando IA.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install
cd backend && npm install

# Levantar todo el stack (frontend + backend)
npm run dev:full

# O por separado:
npm run dev          # Frontend (puerto 3000)
npm run dev:backend  # Backend (puerto 4000)
```

## 📱 Uso

1. Completa el formulario con URLs de LinkedIn y contexto
2. **Personaliza** el mensaje usando los controles:
   - **Tono**: Neutral, Warm, Direct, Formal, Casual
   - **Longitud**: 180 o 280 caracteres
   - **Objetivo**: Conversation, Meeting, Feedback, Resource
   - **Categoría**: Auto, Question, Mention, Congratulations
   - **Idioma**: Auto, Spanish, English
   - **Temperatura**: 0.0 (conservador) a 1.0 (creativo)
3. Haz clic en "Generate Messages"
4. Recibe 3 mensajes personalizados generados por OpenAI
5. **Regenera** mensajes individuales o **copia** al portapapeles

## 🛠️ Stack

- **Frontend**: Next.js + React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **IA**: OpenAI GPT
- **API**: LinkedIn Data API (RapidAPI)

## 🌐 URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API Docs: http://localhost:4000/health