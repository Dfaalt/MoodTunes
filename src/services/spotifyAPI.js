// URL function Supabase
const URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL;
const MARKET = "ID"; // wilayah Indonesia

// Filter sederhana (hindari playlist tidak relevan)
const BLACKLIST = ["birthday", "ultah", "ulang tahun", "kids", "children"];

// Skor sederhana untuk memilih playlist terbaik
function score(p) {
  const name = (p?.name || "").toLowerCase();
  const desc = (p?.description || "").toLowerCase();
  const ownerId = (p?.owner?.id || "").toLowerCase();

  // singkirkan blacklist
  if ([name, desc].some((txt) => BLACKLIST.some((b) => txt.includes(b)))) {
    return -999;
  }

  let s = 0;
  if (ownerId === "spotify") s += 3; // prioritas playlist resmi Spotify
  if (p?.images?.length) s += 1; // ada cover image
  return s;
}

// Hilangkan duplikat kandidat query
const unique = (arr) => [...new Set(arr)];

// Kirim POST ke Edge Function + parse JSON (ringkas)
async function post(body) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

//  1) Playlist berdasarkan mood
export async function getPlaylistByMood(moodRaw) {
  const mood = (moodRaw || "").trim().toLowerCase();
  if (!mood) return null;

  // kandidat query (sederhana + tambahan per-mood)
  const candidates = unique([
    mood,
    `${mood} playlist`,
    `${mood} vibes`,
    `${mood} songs`,
    ...(mood === "happy" ? ["mood booster", "feel good", "good vibes"] : []),
    ...(mood === "sad" ? ["sad songs", "melancholy", "slow chill"] : []),
    ...(mood === "angry" ? ["rage workout", "hard rock", "pump up"] : []),
  ]);

  // coba satu per satu kandidat sampai dapat yang paling pas
  for (const q of candidates) {
    let data;
    try {
      data = await post({
        action: "search",
        query: q,
        limit: 20,
        market: MARKET,
      });
    } catch {
      continue;
    }

    const items = data?.playlists?.items || [];
    if (!items.length) continue;

    // pilih playlist dengan skor tertinggi (hindari birthday, utamakan owner spotify)
    const best = items.reduce(
      (a, b) => (score(b) > score(a) ? b : a),
      items[0]
    );
    if (score(best) > -999) return best;
  }

  // fallback: featured playlists (biar UI tidak kosong)
  try {
    const feat = await post({
      action: "featured-playlists",
      limit: 20,
      market: MARKET,
    });
    const list = (feat?.playlists?.items || []).filter((p) => score(p) > -999);
    return list[0] || null;
  } catch {
    return null;
  }
}

//  2) Ambil track dari playlist
export async function getTracksFromPlaylist(playlistId) {
  if (!playlistId) return [];
  try {
    const data = await post({
      action: "playlist",
      query: playlistId,
      market: MARKET,
    });
    return data?.tracks?.items || [];
  } catch {
    return [];
  }
}

//  3) Pencarian umum (struktur penuh)
export async function searchSpotify(query, limit = 10) {
  const q = (query || "").trim();
  if (!q) return { tracks: {}, artists: {}, albums: {}, playlists: {} };
  return post({ action: "search", query: q, limit, market: MARKET });
}
