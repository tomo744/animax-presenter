const KEY = 'animax-presenter:decks';

export function loadDecks() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDecks(decks) {
  localStorage.setItem(KEY, JSON.stringify(decks));
}

export function upsertDeck(deck) {
  const compact = { ...deck };
  if (compact.posterDataUrl?.startsWith('data:') && compact.posterUrl) {
    compact.posterDataUrl = compact.posterUrl;
  }
  const decks = loadDecks();
  const idx = decks.findIndex((d) => d.id === compact.id);
  if (idx >= 0) {
    decks[idx] = compact;
  } else {
    decks.unshift(compact);
  }
  try {
    saveDecks(decks);
  } catch {
    const lite = decks.map(({ synopsis, ...rest }) => rest);
    saveDecks(lite);
    return lite;
  }
  return decks;
}

export function removeDeck(id) {
  const decks = loadDecks().filter((d) => d.id !== id);
  saveDecks(decks);
  return decks;
}
