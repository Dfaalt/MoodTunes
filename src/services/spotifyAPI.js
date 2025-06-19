// src/services/spotifyAPI.js
import axios from "axios"; // 🚀 Library HTTP untuk request ke Spotify API

// 🔐 Ambil client ID & secret dari environment (file .env)
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

let accessToken = ""; // 💾 Menyimpan token akses setelah login

// 🔐 Fungsi untuk mendapatkan access token dari Spotify menggunakan Client Credentials Flow
export const getSpotifyAccessToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials"); // ⚙️ Jenis autentikasi

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`), // 🔑 Encode ke base64
  };

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token", // 🎯 Endpoint untuk mendapatkan token
      params,
      { headers }
    );

    accessToken = response.data.access_token; // ✅ Simpan token
    return accessToken;
  } catch (error) {
    console.error(
      "❌ Error getting Spotify token:",
      error.response?.data || error.message
    );
    return null; // ❗ Return null kalau gagal
  }
};

// 🎵 Fungsi untuk mendapatkan playlist berdasarkan keyword mood (misal: "happy", "sad", "angry")
export const getPlaylistByMood = async (mood) => {
  try {
    if (!accessToken) await getSpotifyAccessToken(); // ✅ Pastikan ada token dulu

    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        mood
      )}&type=playlist&limit=1`, // 🔍 Cari playlist berdasarkan keyword mood
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 🪪 Token akses
        },
      }
    );

    const playlist = response.data.playlists.items[0]; // 🎯 Ambil playlist pertama dari hasil pencarian
    return playlist || null; // 🔙 Return playlist atau null jika tidak ada
  } catch (error) {
    console.error(
      "❌ Error fetching playlist:",
      error.response?.data || error.message
    );
    return null;
  }
};

// 🎶 Fungsi untuk mengambil daftar lagu dari sebuah playlist
export const getTracksFromPlaylist = async (playlistId) => {
  try {
    if (!accessToken) await getSpotifyAccessToken(); // ✅ Pastikan token siap

    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, // 🔗 Endpoint untuk daftar lagu di playlist
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.items || []; // 🔙 Return daftar track
  } catch (error) {
    console.error(
      "❌ Error fetching tracks:",
      error.response?.data || error.message
    );
    return []; // 🔙 Return array kosong kalau error
  }
};

// 🆕 🔍 Fungsi pencarian umum (playlist dan track)
export const searchSpotify = async (query) => {
  try {
    if (!accessToken) await getSpotifyAccessToken(); // ✅ Pastikan token siap

    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=playlist,track&limit=5`, // 🔍 Cari playlist dan track
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data; // 🔙 Return semua hasil
  } catch (error) {
    console.error(
      "❌ Error searching Spotify:",
      error.response?.data || error.message
    );
    return null;
  }
};
