export interface Word {
  id?: string;
  wordFr: string;
  wordTarifit: string;
  wordTifinagh: string;
  phonetic: string;
  synonyms: string[];
  acronyms: string[];
  examples: string[];
  imageUrl?: string;
  audioUrl?: string;
}
