// src/services/linkedin-normalize.ts

export type LatestPost = {
    text: string;
    likes?: number;
    comments?: number;
  };
  
  export type NormalizedProfile = {
    name?: string;
    headline?: string;
    publicIdentifier?: string;
    connections?: number;
    followers?: number;
    location?: string;
    latestPost?: LatestPost[];
  };
  
  function cleanText(s?: string): string | undefined {
    if (typeof s !== "string") return undefined;
    const t = s.replace(/\s+/g, " ").trim();
    return t.length ? t : undefined;
  }
  
  /** Recibe la respuesta cruda (tal cual la API) y devuelve el primer perfil normalizado */
  export function normalizeRealtimeLinkedIn(raw: any): NormalizedProfile {
    const first = Array.isArray(raw?.data) ? raw.data[0] : undefined;
    const d = first?.data ?? {};
    const out: NormalizedProfile = {};
  
    // name
    const fullName =
      d?.fullName ||
      [d?.firstName, d?.lastName].filter(Boolean).join(" ") ||
      undefined;
    const nm = cleanText(fullName);
    if (nm) out.name = nm;
  
    // headline
    const hl = cleanText(d?.headline);
    if (hl) out.headline = hl;
  
    // public identifier
    if (d?.publicIdentifier) out.publicIdentifier = String(d.publicIdentifier);
  
    // numbers
    if (typeof d?.connections === "number") out.connections = d.connections;
    if (typeof d?.followers === "number") out.followers = d.followers;
  
    // location
    const loc = cleanText(d?.addressWithCountry || d?.addressWithoutCountry);
    if (loc) out.location = loc;
  

  
  
    // latest post: primer update con postText no vacío
    const updates = Array.isArray(d?.updates) ? d.updates : [];
  const posts: LatestPost[] = updates
    .filter((u: any) => cleanText(u?.postText))
    .slice(0, 3)
    .map((u: any) => {
      const lp: LatestPost = { text: cleanText(u.postText)! };
      if (typeof u.numLikes === "number") lp.likes = u.numLikes;
      if (typeof u.numComments === "number") lp.comments = u.numComments;
      if (lp.text.length > 800) lp.text = lp.text.slice(0, 800) + "…";
      return lp;
    });

  if (posts.length) out.latestPost = posts;

  return out;
  }
  