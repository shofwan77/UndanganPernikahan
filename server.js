
require("dotenv").config();

const express = require("express");
const Database = require("better-sqlite3");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Membaca data JSON dari form
app.use(express.json({ limit: "10kb" }));

// Database ucapan
const db = new Database(path.join(__dirname, "undangan.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS ucapan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        kehadiran TEXT NOT NULL,
        pesan TEXT NOT NULL,
        dibuat_pada DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Pengaturan SMTP Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Menampilkan website
app.use(express.static(__dirname));

// Endpoint untuk mengirim ucapan
app.post("/api/ucapan", async (req, res) => {
    const nama = typeof req.body.nama === "string"
        ? req.body.nama.trim()
        : "";

    const kehadiran = typeof req.body.kehadiran === "string"
        ? req.body.kehadiran.trim()
        : "";

    const ucapan = typeof req.body.ucapan === "string"
        ? req.body.ucapan.trim()
        : "";

    // Validasi data
    if (!nama || !kehadiran || !ucapan) {
        return res.status(400).json({
            success: false,
            message: "Semua kolom wajib diisi."
        });
    }

    if (
        nama.length > 100 ||
        ucapan.length > 2000 ||
        !["Hadir", "Berhalangan"].includes(kehadiran)
    ) {
        return res.status(400).json({
            success: false,
            message: "Data tidak valid atau terlalu panjang."
        });
    }

    // Simpan ucapan ke database terlebih dahulu
    let hasil;

    try {
        const simpan = db.prepare(`
            INSERT INTO ucapan (nama, kehadiran, pesan)
            VALUES (?, ?, ?)
        `);

        hasil = simpan.run(nama, kehadiran, ucapan);
    } catch (error) {
        console.error("Gagal menyimpan ucapan:", error);

        return res.status(500).json({
            success: false,
            message: "Ucapan gagal disimpan."
        });
    }

    // Kirim notifikasi ke email
    let emailTerkirim = false;

    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.EMAIL_PENERIMA,
            subject: "Ucapan Baru - Undangan Naufal & Putri",
            text: [
                "Ada ucapan baru dari website undangan!",
                "",
                `Nama: ${nama}`,
                `Kehadiran: ${kehadiran}`,
                "",
                "Ucapan dan doa:",
                ucapan,
                "",
                `ID ucapan: ${hasil.lastInsertRowid}`
            ].join("\n")
        });

        emailTerkirim = true;
        console.log("Notifikasi email berhasil dikirim.");
    } catch (error) {
        console.error("Ucapan tersimpan, tetapi email gagal dikirim:", error);
    }

    // Data tetap dianggap tersimpan meski email gagal
    return res.status(200).json({
        success: true,
        emailSent: emailTerkirim,
        message: emailTerkirim
            ? "Ucapan berhasil disimpan dan notifikasi dikirim."
            : "Ucapan berhasil disimpan, tetapi notifikasi email gagal dikirim."
    });
});

// Penanganan JSON yang tidak valid
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400) {
        return res.status(400).json({
            success: false,
            message: "Format data tidak valid."
        });
    }

    next(error);
});

app.listen(PORT, () => {
    console.log(`Website berjalan di http://localhost:${PORT}`);
});
