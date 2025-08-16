const functions = require("firebase-functions");
const fetch = require("node-fetch");

// 🔹 Ganti dengan URL Google Apps Script kamu
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/xxx/exec";

// 🔹 Fungsi ini jalan setiap ada data baru di Firestore collection "domba"
exports.sendToGoogleSheets = functions.firestore
  .document("domba/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idDomba: data.idDomba,
          berat: data.berat,
          timestamp: data.timestamp
        }),
      });

      const result = await response.json();
      console.log("✅ Data terkirim ke Google Sheets:", result);
    } catch (error) {
      console.error("❌ Gagal kirim ke Sheets:", error);
    }
  });
