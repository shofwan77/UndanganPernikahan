const tombolBuka = document.getElementById("tombol-buka");
const isiUndangan = document.getElementById("isi-undangan");
const musik = document.getElementById("musik");
const tombolMusik = document.getElementById("tombol-musik");

tombolBuka.addEventListener("click", function () {
    isiUndangan.hidden = false;

    isiUndangan.scrollIntoView({
        behavior: "smooth"
    });

    musik.play()
        .then(function () {
            tombolMusik.textContent = "♫ Jeda Lagu";
        })
        .catch(function () {
            tombolMusik.textContent = "♫ Putar Lagu";
        });
});

tombolMusik.addEventListener("click", function () {
    if (musik.paused) {
        musik.play()
            .then(function () {
                tombolMusik.textContent = "♫ Jeda Lagu";
            })
            .catch(function () {
                tombolMusik.textContent = "♫ Musik tidak tersedia";
            });
    } else {
        musik.pause();
        tombolMusik.textContent = "♫ Putar Lagu";
    }
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


