
const tombolBuka = document.getElementById("tombol-buka");
const isiUndangan = document.getElementById("isi-undangan");
const musik = document.getElementById("musik");
const tombolMusik = document.getElementById("tombol-musik");
const formUcapan = document.getElementById("form-ucapan");

// Buka undangan dan coba putar musik
tombolBuka.addEventListener("click", async function () {
    isiUndangan.hidden = false;
    isiUndangan.scrollIntoView({ behavior: "smooth" });

    try {
        await musik.play();
        tombolMusik.textContent = "♫ Jeda Lagu";
    } catch (error) {
        console.error("Musik tidak dapat diputar:", error);
        tombolMusik.textContent = "♫ Putar Lagu";
    }
});

// Tombol putar/jeda musik
tombolMusik.addEventListener("click", async function () {
    if (musik.paused) {
        try {
            await musik.play();
            tombolMusik.textContent = "♫ Jeda Lagu";
        } catch (error) {
            console.error("Musik gagal diputar:", error);
            alert("Lagu belum bisa diputar. Periksa file musik kamu.");
        }
    } else {
        musik.pause();
        tombolMusik.textContent = "♫ Putar Lagu";
    }
});

// Kirim ucapan ke server
formUcapan.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const pilihanKehadiran = document.querySelector(
        'input[name="kehadiran"]:checked'
    );
    const ucapan = document.getElementById("ucapan").value.trim();

    if (!nama || !pilihanKehadiran || !ucapan) {
        alert("Mohon lengkapi semua kolom.");
        return;
    }

    const tombolKirim = formUcapan.querySelector(
        'button[type="submit"]'
    );

    tombolKirim.disabled = true;
    tombolKirim.textContent = "Mengirim...";

    try {
        const response = await fetch("/api/ucapan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nama: nama,
                kehadiran: pilihanKehadiran.value,
                ucapan: ucapan
            })
        });

        const hasil = await response.json();

        if (!response.ok || !hasil.success) {
            throw new Error(hasil.message || "Pengiriman gagal.");
        }

        alert(hasil.message);
        formUcapan.reset();
    } catch (error) {
        console.error("Gagal mengirim ucapan:", error);

        alert(
            "Ucapan gagal dikirim ke server. " +
            "Pastikan server Node.js sedang berjalan."
        );
    } finally {
        tombolKirim.disabled = false;
        tombolKirim.textContent = "Kirim Ucapan";
    }
});

const pilihanKehadiran = document.querySelectorAll(
    'input[name="kehadiran"]'
);

const bagianQris = document.getElementById("bagian-qris");

pilihanKehadiran.forEach((pilihan) => {
    pilihan.addEventListener("change", function () {
        bagianQris.hidden = this.value !== "Berhalangan";
    });
});
