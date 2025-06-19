import React, { useEffect, useState } from "react";
import { getPlaylistByMood } from "../services/spotifyAPI"; // 🎧 Fungsi untuk mengambil playlist dari Spotify berdasarkan mood atau pencarian

// Komponen MusicPlayer menerima mood (hasil deteksi wajah atau pencarian manual) dan penanda isSearch
const MusicPlayer = ({ mood, isSearch = false }) => {
  const [playlist, setPlaylist] = useState(null); // 🎵 State untuk menyimpan data playlist yang diambil dari Spotify
  const [loading, setLoading] = useState(false); // ⏳ State untuk menandai proses pengambilan data (loading)

  // 🔁 Ambil playlist setiap kali nilai 'mood' berubah
  useEffect(() => {
    const fetchPlaylist = async () => {
      if (mood) {
        setLoading(true); // Tampilkan loading spinner
        const data = await getPlaylistByMood(mood); // 🔗 Panggil fungsi API Spotify
        setPlaylist(data); // 📥 Simpan hasilnya ke state
        setLoading(false); // Sembunyikan loading
      }
    };
    fetchPlaylist();
  }, [mood]);

  // ⚠️ Saat mood belum tersedia sama sekali
  if (!mood)
    return (
      <p className="text-light text-center">
        🧠 Deteksi ekspresi untuk mulai memutar musik...
      </p>
    );

  // ⏳ Saat sedang memuat playlist
  if (loading)
    return (
      <div className="text-center my-4">
        <div className="spinner-border text-success" role="status" />
        <p className="text-light mt-2">
          🔍 Mencari playlist untuk {isSearch ? "search" : "mood"}:{" "}
          <strong>{mood}</strong>...
        </p>
      </div>
    );

  // ❌ Saat playlist tidak ditemukan dari API
  if (!playlist)
    return (
      <p className="text-warning text-center">
        ⚠️ Tidak ditemukan playlist untuk {isSearch ? "search" : "mood"}:{" "}
        <strong>{mood}</strong>
      </p>
    );

  // ✅ Tampilkan player Spotify jika playlist berhasil didapat
  return (
    <div
      className="card mt-4 border-0 shadow-sm"
      style={{ backgroundColor: "#1e1e1e", color: "#fff" }}
    >
      <div className="card-body text-center">
        <h4 className="card-title mb-3">
          🎧 Playlist for {isSearch ? "Search" : "Mood"}:{" "}
          <span className="text-success">{mood}</span>
        </h4>
        <p className="card-text mb-4">
          <strong>{playlist.name}</strong> <br />
          oleh <em>{playlist.owner.display_name}</em>{" "}
          {/* 👤 Nama pemilik playlist */}
        </p>
        {/* 🎼 Spotify Embed untuk memutar langsung dari playlist */}
        <div className="ratio ratio-16x9">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${playlist.id}`}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Player"
            style={{ borderRadius: "12px" }}
          ></iframe>
        </div>
        {/* Tambahan tombol untuk versi mobile */}
        <div className="mt-3">
          <a
            href={`https://open.spotify.com/playlist/${playlist.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-lg d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold"
            style={{ borderRadius: "50px" }}
          >
            <i className="bi bi-spotify fs-5"></i> Buka di Spotify
          </a>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
