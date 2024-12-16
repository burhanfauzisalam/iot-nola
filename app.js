const express = require("express");
const mqtt = require("mqtt");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Konfigurasi broker MQTT
const mqttBrokerUrl = "mqtt://34.68.99.84"; // Ganti dengan URL broker Anda
const mqttPort = 8883; // Port default MQTT tanpa SSL
const mqttClient = mqtt.connect(mqttBrokerUrl, {
  port: mqttPort,
});

// Middleware
app.use(cors({
  origin: '*',  // Ganti dengan IP atau domain frontend Anda
  methods: ['GET', 'POST', 'OPTIONS'],  // Pastikan metode OPTIONS diizinkan
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
}));

app.use(bodyParser.json());

// Event handler MQTT
mqttClient.on("connect", () => {
  console.log("Terhubung ke broker MQTT");
});

mqttClient.on("error", (err) => {
  console.error("Gagal terhubung ke broker MQTT:", err);
});

// API Endpoint untuk mengontrol lampu
app.post("/lamp-control", (req, res) => {
  const { status } = req.body;

  if (!status || (status !== "ON" && status !== "OFF")) {
    return res.status(400).json({
      success: false,
      message: "Status harus 'ON' atau 'OFF'",
    });
  }

  // Publish status ke topik MQTT
  const topic = "light/status";
  mqttClient.publish(topic, status, (err) => {
    if (err) {
      console.error("Gagal mengirim pesan ke broker MQTT:", err);
      return res.status(500).json({
        success: false,
        message: "Gagal mengirim pesan ke broker MQTT",
      });
    }

    console.log(`Pesan '${status}' berhasil dikirim ke topik ${topic}`);
    res.json({
      success: true,
      message: `Lampu ${status === "ON" ? "menyala" : "mati"}`,
    });
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
