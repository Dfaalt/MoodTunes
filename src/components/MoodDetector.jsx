import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image"; // Import library Teachable Machine untuk image classification

// Komponen utama: menerima props `onMoodChange` untuk mengirim mood ke parent
const MoodDetector = ({ onMoodChange }) => {
  // State untuk menyimpan model, hasil deteksi, akurasi, status kamera, cooldown, dan animasi kamera
  const [model, setModel] = useState(null);
  const [mood, setMood] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [cameraAnimation, setCameraAnimation] = useState(false);

  // Ref untuk menyimpan instance webcam, interval prediksi, animasi frame, dan countdown timer
  const webcamRef = useRef(null); // Tempat canvas webcam
  const webcamInstance = useRef(null); // Instance webcam itu sendiri
  const intervalRef = useRef(null); // Interval prediksi
  const animationRef = useRef(null); // RequestAnimationFrame untuk update webcam
  const cooldownMap = useRef({}); // Map untuk menyimpan waktu cooldown tiap mood
  const countdownIntervalRef = useRef(null); // Interval untuk countdown waktu cooldown

  // Path ke folder model Teachable Machine
  const URL = "/model/";
  const COOLDOWN_DURATION = 60000; // 1 menit

  // Cleanup saat komponen di-unmount
  useEffect(() => {
    return () => {
      stopCamera(); // matikan kamera
      clearInterval(countdownIntervalRef.current); // hentikan timer countdown
    };
  }, []);

  // Fungsi untuk memulai kamera dan memuat model
  const startCamera = async () => {
    try {
      // Load model dan metadata dari Teachable Machine
      const loadedModel = await tmImage.load(
        URL + "model.json",
        URL + "metadata.json"
      );
      setModel(loadedModel);

      // Setup webcam: ukuran 300x300, kamera depan
      const webcam = new tmImage.Webcam(300, 300, true);
      await webcam.setup(); // minta izin kamera
      await webcam.play(); // nyalakan webcam

      webcamInstance.current = webcam; // simpan instance

      // Tampilkan canvas webcam di halaman
      if (webcamRef.current) {
        webcamRef.current.innerHTML = "";
        webcamRef.current.appendChild(webcam.canvas);
        webcam.canvas.classList.add(
          "img-fluid",
          "border",
          "rounded",
          "shadow-sm",
          "mb-3"
        );
      }

      // Loop untuk update frame webcam (diperlukan oleh Teachable Machine)
      const loop = () => {
        webcam.update();
        animationRef.current = requestAnimationFrame(loop);
      };
      loop();

      // Lakukan prediksi setiap 2 detik
      intervalRef.current = setInterval(
        () => predict(webcam, loadedModel),
        2000
      );

      // Tampilkan animasi dan tandai bahwa kamera menyala
      setCameraAnimation(true);
      setIsCameraOn(true);
    } catch (err) {
      console.error("❌ Gagal memulai kamera:", err);
    }
  };

  // Fungsi untuk mematikan kamera dan bersihkan semua loop/timer
  const stopCamera = () => {
    if (webcamInstance.current) webcamInstance.current.stop(); // stop webcam
    if (intervalRef.current) clearInterval(intervalRef.current); // stop prediksi
    if (animationRef.current) cancelAnimationFrame(animationRef.current); // stop animasi
    if (webcamRef.current) webcamRef.current.innerHTML = ""; // hapus canvas
    setCameraAnimation(false);
    setIsCameraOn(false);
  };

  // Fungsi toggle kamera saat tombol diklik
  const toggleCamera = () => {
    isCameraOn ? stopCamera() : startCamera();
  };

  // Fungsi untuk menghitung mundur waktu cooldown
  const startCooldownCountdown = (endTime) => {
    clearInterval(countdownIntervalRef.current); // bersihkan timer sebelumnya
    countdownIntervalRef.current = setInterval(() => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      setCooldownTime(remaining > 0 ? remaining : 0);
      if (remaining <= 0) clearInterval(countdownIntervalRef.current); // jika selesai, hentikan
    }, 1000);
  };

  // Fungsi utama prediksi mood dari frame webcam
  const predict = async (webcam, model) => {
    const prediction = await model.predict(webcam.canvas); // deteksi dari canvas
    const highest = prediction.reduce((prev, curr) =>
      prev.probability > curr.probability ? prev : curr
    ); // cari hasil dengan probabilitas tertinggi

    const newMood = highest.className;
    const confidenceValue = highest.probability;
    const now = Date.now();
    const cooldownUntil = cooldownMap.current[newMood] || 0;

    // Jika belum cooldown dan mood berbeda dengan sebelumnya
    if (now >= cooldownUntil && newMood !== mood) {
      setMood(newMood);
      setConfidence(confidenceValue);
      onMoodChange(newMood); // kirim mood ke parent

      // Atur cooldown untuk mood ini
      cooldownMap.current[newMood] = now + COOLDOWN_DURATION;
      startCooldownCountdown(now + COOLDOWN_DURATION);

      stopCamera(); //  Kamera otomatis mati setelah mendeteksi mood
    } else {
      setConfidence(confidenceValue); // jika mood sama, hanya update confidence
    }
  };

  // UI komponen
  return (
    <div className="text-center my-2">
      {/* Tampilan hasil deteksi */}
      <div className="alert alert-info w-100 mx-auto" role="alert">
        <strong>Detected Mood:</strong> {mood || "Belum terdeteksi"} <br />
        <small>Accuracy: {(confidence * 100).toFixed(2)}%</small>
        <br />
        {cooldownTime > 0 && (
          <span className="text-white">
            Cooldown for Mood: {cooldownTime} detik
          </span>
        )}
      </div>

      {/* Tampilan kamera */}
      <div
        ref={webcamRef}
        className={`d-flex justify-content-center align-items-center mb-3 ${
          !isCameraOn ? "d-none" : ""
        } ${cameraAnimation ? "animate__animated animate__fadeIn" : ""}`}
        style={isCameraOn ? { minHeight: "300px", width: "100%" } : {}}
      />

      {/* Tombol toggle kamera */}
      <button
        className={`btn ${isCameraOn ? "btn-danger" : "btn-success"}`}
        onClick={toggleCamera}
      >
        {isCameraOn ? "Matikan Kamera" : "Hidupkan Kamera"}
      </button>
    </div>
  );
};

export default MoodDetector;
