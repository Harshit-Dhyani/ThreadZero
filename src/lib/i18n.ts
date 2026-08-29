import type { Language, LocalizedText } from "./types.ts";

const vowels: Record<string, string> = { "अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo", "ऋ": "ri", "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "ऑ": "o", "ऍ": "e" };
const matras: Record<string, string> = { "ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "ृ": "ri", "ॄ": "ri", "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ॅ": "e", "ॉ": "o", "ॆ": "e", "ॊ": "o" };
const consonants: Record<string, string> = {
  "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "ng", "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "ny",
  "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n", "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
  "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m", "य": "y", "र": "r", "ल": "l", "व": "v", "श": "sh",
  "ष": "sh", "स": "s", "ह": "h", "क़": "q", "ख़": "kh", "ग़": "g", "ज़": "z", "ड़": "r", "ढ़": "rh", "फ़": "f", "य़": "y"
};
const nuktaConsonants: Record<string, string> = { "क": "q", "ख": "kh", "ग": "g", "ज": "z", "ड": "r", "ढ": "rh", "फ": "f", "य": "y" };

function romanizeWord(word: string) {
  let output = "";
  for (let index = 0; index < word.length; index += 1) {
    const char = word[index];
    if (consonants[char]) {
      let sound = consonants[char];
      if (word[index + 1] === "़") { sound = nuktaConsonants[char] || sound; index += 1; }
      const next = word[index + 1];
      output += sound;
      if (next === "्") index += 1;
      else if (matras[next]) { output += matras[next]; index += 1; }
      else output += "a";
    } else if (vowels[char]) output += vowels[char];
    else if (char === "ं" || char === "ँ") output += "n";
    else if (char === "ः") output += "h";
    else if (char === "।" || char === "॥") output += ".";
    else if (/[०-९]/.test(char)) output += String("०१२३४५६७८९".indexOf(char));
    else if (!/[\u0900-\u097f]/.test(char)) output += char;
  }
  return /्य$/.test(word) ? output : output.replace(/a(?=$|[\s.,!?;:।)\]])/g, "");
}

export const romanizeHindi = (value: string) => value.split(/(\s+)/).map(romanizeWord).join("");

export function romanizeCatalog<T>(value: T): T {
  if (typeof value === "string") return romanizeHindi(value) as T;
  if (Array.isArray(value)) return value.map(romanizeCatalog) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, romanizeCatalog(entry)])) as T;
  return value;
}

export function localized(value: LocalizedText | null | undefined, language: Language) {
  if (!value) return "";
  if (language === "hinglish") return value.hinglish || romanizeHindi(value.hi);
  return value[language] || value.en;
}
