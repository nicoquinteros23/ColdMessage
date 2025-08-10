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
  
    return `
  Genera EXACTAMENTE 3 icebreakers para LinkedIn en español.
  Requisitos:
  - Máximo 280 caracteres por mensaje.
  - Tono humano, natural y directo. Sin emojis, sin hashtags, sin enlaces.
  - Cada mensaje debe invitar a responder (pregunta o CTA suave).
  - Varía los enfoques: 
    (1) pregunta sobre un post si existe, 
    (2) mención/observación del perfil, 
    (3) felicitación + CTA breve.
  - No repitas frases.
  
  Contexto del emisor:
  - Nombre: ${senderName}
  - ${senderStyle}
  - Problema que resuelvo: ${problem}
  - Solución que ofrezco: ${solution}
  
  Contexto del destinatario:
  - Nombre: ${recName}
  - ${recHeadline}
  - ${postsBlock}
  
  Devuelve SOLO un JSON con este formato exacto:
  {
    "messages": ["...", "...", "..."]
  }
  `.trim();
  }
  