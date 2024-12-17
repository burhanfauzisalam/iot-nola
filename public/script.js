document.getElementById("lamp-toggle").addEventListener("click", function () {
  const currentStatus = this.textContent === "Matikan" ? "OFF" : "ON"; // Menggunakan "Matikan" sebagai indikator lampu menyala
  controlLamp(currentStatus);
});

function controlLamp(status) {
  fetch("http://iotserver.belajarcoding.web.id/lamp-control", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: status }),
  })
  .then(response => response.json())
  .then(data => {
    const messageElement = document.getElementById("message");
    const lampToggle = document.getElementById("lamp-toggle");

    if (data.success) {
      // Perbarui teks tombol berdasarkan status lampu
      if (status === "ON") {
        lampToggle.textContent = "Matikan";  // Jika lampu menyala, tombol berubah menjadi "Matikan"
        messageElement.textContent = "Lampu menyala";
        lampToggle.style.backgroundColor = "red"; // Tombol menjadi merah saat lampu menyala
        lampToggle.style.color = "white"; // Teks tombol menjadi putih
      } else {
        lampToggle.textContent = "Nyalakan";  // Jika lampu mati, tombol berubah menjadi "Nyalakan"
        messageElement.textContent = "Lampu mati";
        lampToggle.style.backgroundColor = "green"; // Tombol menjadi hijau saat lampu mati
        lampToggle.style.color = "white"; // Teks tombol menjadi putih
      }
    } else {
      messageElement.textContent = data.message;
      messageElement.style.color = "red";
    }
  })
  .catch(error => {
    console.error("Error:", error);
    document.getElementById("message").textContent = "Terjadi kesalahan!";
  });
}
