// src/services/prompt.ts
type MiniProfile = {
    name?: string;
    headline?: string;
    latestPosts?: { text: string }[];
  };
  
  export function buildPrompt(opts: {
    sender: MiniProfile;
    recipient: MiniProfile;
    problem: string;
    solution: string;
    tone?: string;
    maxChars?: number;
    goal?: string;
    category?: string;
    language?: string;
  }) {
    const { sender, recipient } = opts;
  
    const senderName = sender.name || "yo";
    const senderStyle = sender.headline
      ? `Mi headline: "${sender.headline}".`
      : `Mi estilo: directo, amable y profesional.`;
  
    const recName = recipient.name || "allí";
    const recHeadline = recipient.headline ? `Headline del destinatario: "${recipient.headline}".` : "";
    const posts = Array.isArray(recipient.latestPosts) ? recipient.latestPosts : [];
    const postsBlock = posts.length
      ? `Últimos posts:\n${posts.slice(0, 3).map((p, i) => `- [${i + 1}] ${p.text}`).join("\n")}`
      : "No hay posts recientes disponibles.";
  
      const problem = String(opts.problem || "").slice(0, 500);
  const solution = String(opts.solution || "").slice(0, 500);
  
  // Parámetros de personalización
  const tone = opts.tone || "neutral";
  const maxChars = opts.maxChars || 280;
  const goal = opts.goal || "conversation";
  const category = opts.category || "auto";
  const language = opts.language || "auto";
  
    return `
  Genera EXACTAMENTE 3 icebreakers para LinkedIn siguiendo estas categorías específicas:
  
  CONFIGURACIÓN PERSONALIZADA:
  - Tono: ${tone === "neutral" ? "neutral y profesional" : tone === "warm" ? "cálido y amigable" : tone === "direct" ? "directo y asertivo" : tone === "formal" ? "formal y corporativo" : "casual y relajado"}
  - Longitud máxima: ${maxChars} caracteres por mensaje
  - Objetivo: ${goal === "conversation" ? "abrir conversación" : goal === "meeting" ? "programar reunión" : goal === "feedback" ? "solicitar feedback" : "compartir recursos"}
  - Categoría preferida: ${category === "auto" ? "automática (variar entre las 3)" : category === "question" ? "pregunta sobre post" : category === "mention" ? "comentar evento" : "felicitar logro"}
  - Idioma: ${language === "auto" ? "detectar automáticamente del contenido" : language === "es" ? "español" : "inglés"}

  CATEGORÍA 1: PREGUNTA SOBRE UN POST
  - Busca en las publicaciones del destinatario un tema que te interese
  - Comienza mencionando qué te generó ese post
  - Enfatiza en lo que la persona dijo y con lo que estés de acuerdo
  - Termina con una pregunta concreta sobre algo del post
  - Ejemplo: "Hola [nombre], acabo de leer tu post sobre [tema]. También creo que [énfasis en lo que la persona haya dicho y estés de acuerdo]... pero al leerlo me surgió una duda... [pregunta concreta sobre algo del post]"

  CATEGORÍA 2: COMENTAR SOBRE CHARLA O EVENTO
  - Busca si la persona fue speaker, asistió o comentó sobre un evento
  - Menciona el evento específico
  - Comenta sobre lo que te interesó de su participación
  - Termina con una pregunta sobre cómo logró algo
  - Ejemplo: "Hola [nombre], vi que participaste en [evento]. Me interesó mucho lo que comentaste sobre [tema], ¿cómo lograste que...?"

  CATEGORÍA 3: FELICITAR POR LOGRO O PUBLICACIÓN DESTACADA
  - Busca publicaciones donde comparta un logro, premio, colaboración o hitos
  - Felicita por el logro específico
  - Suma una propuesta liviana de conexión
  - Ejemplo: "Hola [nombre], felicitaciones por [logro]. Muy bueno! Justo estoy trabajando en una línea parecida y pensé que podríamos conectar."

  REQUISITOS CRÍTICOS:
  - Máximo ${maxChars} caracteres por mensaje
  - Tono humano, natural y directo. Sin emojis, sin hashtags, sin enlaces
  - Los mensajes DEBEN estar alineados con la forma de hablar del remitente (analiza su estilo de escritura en sus posts)
  - Si hay similitudes entre emisor y destinatario (misma industria, intereses, etc.), ÚSALAS en las respuestas
  - Cada mensaje debe abrir una conversación y sonar genuino
  - Personaliza usando información específica de los posts del destinatario
  - No repitas frases ni enfoques

  CONTEXTO DEL EMISOR:
  - Nombre: ${senderName}
  - ${senderStyle}
  - Posts recientes (analiza su estilo de escritura): ${Array.isArray(sender.latestPosts) ? sender.latestPosts.map((p, i) => `[${i + 1}] ${p.text}`).join(" | ") : "No hay posts disponibles"}
  - Problema que resuelvo: ${problem}
  - Solución que ofrezco: ${solution}

  CONTEXTO DEL DESTINATARIO:
  - Nombre: ${recName}
  - ${recHeadline}
  - Posts recientes: ${postsBlock}

  IMPORTANTE: Analiza el estilo de escritura del emisor en sus posts y genera mensajes que suenen como si él/ella los escribiera, manteniendo su tono, vocabulario y forma de expresarse.
  
  INSTRUCCIONES ESPECÍFICAS:
  - Si el idioma es "es", genera en español. Si es "en", genera en inglés. Si es "auto", detecta del contenido.
  - Si la categoría es "question" y no hay posts disponibles, usa las otras categorías como fallback.
  - Ajusta el tono según la configuración especificada manteniendo la naturalidad.
  - Optimiza cada mensaje para el objetivo especificado.

  Devuelve SOLO un JSON con este formato exacto:
  {
    "messages": ["...", "...", "..."]
  }
  `.trim();
  }
  