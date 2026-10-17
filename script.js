
const tombolBuka = document.getElementById("tombol-buka");
const isiUndangan = document.getElementById("isi-undangan");
const musik = document.getElementById("musik");
const tombolMusik = document.getElementById("tombol-musik");

const linkGoogleForms =
    "https://forms.gle/RPRcbFsQ8x5bZWr1A";

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

// Tombol Kirim Ucapan membuka Google Forms
const tombolUcapan = document.querySelector(".tombol-ucapan");

if (tombolUcapan) {
    tombolUcapan.addEventListener("click", function (event) {
        event.preventDefault();
        window.open(
            linkGoogleForms,
            "_blank",
            "noopener,noreferrer"
        );
    });
}

// Tampilkan QRIS jika tamu memilih Berhalangan
const pilihanKehadiran = document.querySelectorAll(
    'input[name="kehadiran"]'
);

const bagianQris = document.getElementById("bagian-qris");

if (bagianQris) {
    bagianQris.hidden = true;

    pilihanKehadiran.forEach((pilihan) => {
        pilihan.addEventListener("change", function () {
            bagianQris.hidden = this.value !== "Berhalangan";
        });
    });
}

