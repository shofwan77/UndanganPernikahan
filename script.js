const tombolBuka = document.getElementById("tombol-buka");
const isiUndangan = document.getElementById("isi-undangan");
const musik = document.getElementById("musik");
const tombolMusik = document.getElementById("tombol-musik");

tombolBuka.addEventListener("click", function () {
    isiUndangan.hidden = false;

    isiUndangan.scrollIntoView({
        behavior: "smooth"
    });

    
const tombolBuka = document.getElementById("tombol-buka");
const isiUndangan = document.getElementById("isi-undangan");
const musik = document.getElementById("musik");
const tombolMusik = document.getElementById("tombol-musik");

// Membuka undangan dan memutar musik
tombolBuka.addEventListener("click", async function () {
    isiUndangan.hidden = false;

    isiUndangan.scrollIntoView({
        behavior: "smooth"
    });

    try {
        await musik.play();
        tombolMusik.textContent = "♫ Jeda Lagu";
    } catch (error) {
        tombolMusik.textContent = "♫ Putar Lagu";
        console.error("Musik gagal diputar:", error);
    }
});

// Tombol putar dan jeda
tombolMusik.addEventListener("click", async function () {
    if (musik.paused) {
        try {
            await musik.play();
            tombolMusik.textContent = "♫ Jeda Lagu";
        } catch (error) {
            tombolMusik.textContent = "♫ Musik tidak tersedia";
            console.error("Musik gagal diputar:", error);
        }
    } else {
        musik.pause();
        tombolMusik.textContent = "♫ Putar Lagu";
    }
});

// Memperbarui tulisan tombol ketika lagu selesai atau dijeda
musik.addEventListener("pause", function () {
    tombolMusik.textContent = "♫ Putar Lagu";
});

musik.addEventListener("play", function () {
    tombolMusik.textContent = "♫ Jeda Lagu";
});

});
// Formulir ucapan
const formUcapan = document.getElementById("form-ucapan");

formUcapan.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const pilihan = formUcapan.querySelector(
        'input[name="kehadiran"]:checked'
    );
    const ucapan = document.getElementById("ucapan").value.trim();

    if (!nama || !pilihan || !ucapan) {
        alert("Lengkapi formulir terlebih dahulu.");
        return;
    }

    try {
        const respons = await fetch("/api/ucapan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nama: nama,
                kehadiran: pilihan.value,
                pesan: ucapan
            })
        });

        const hasil = await respons.json();

        if (!respons.ok) {
            throw new Error(hasil.pesan || "Gagal menyimpan ucapan.");
        }

        alert("Terima kasih!.");
        formUcapan.reset();

    } catch (error) {
        alert("Ucapan yang anda kirim gagal.");
        console.error(error);
    }
});


