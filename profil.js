/* ==========================================================
   profil.js - Halaman profil (profil.html)
   - Mengisi dan menyimpan data penyewa di browser (localStorage)
   - Data dibaca oleh script_katalog.js saat mengirim pesanan
   - Tombol kembali ke atas
   ========================================================== */

const KUNCI_PROFIL = "rennProfil";


/* ==========================================================
   SECTION 1: Data profil
   ========================================================== */
function initProfil() {
    // 1. Ambil elemen dari HTML
    const form = document.getElementById("profileForm");
    const inputNama = document.getElementById("fullName");
    const inputEmail = document.getElementById("email");
    const inputTelepon = document.getElementById("phone");
    const inputNik = document.getElementById("nik");
    const inputAlamat = document.getElementById("address");
    const displayName = document.getElementById("display-name");
    const displayEmail = document.getElementById("display-email");
    const profileError = document.getElementById("profileError");
    const profileStatus = document.getElementById("profileStatus");

    // 2. Baca dan simpan profil
    function bacaProfil() {
        try {
            const data = JSON.parse(localStorage.getItem(KUNCI_PROFIL));
            return data && typeof data === "object" ? data : null;
        } catch (error) {
            return null;
        }
    }

    function simpanProfil(profil) {
        localStorage.setItem(KUNCI_PROFIL, JSON.stringify(profil));
    }

    // 3. Tampilkan data di kartu atas halaman
    function tampilkanKartu(profil) {
        displayName.textContent = profil && profil.nama ? profil.nama : "Belum ada nama";
        displayEmail.textContent = profil && profil.email
            ? profil.email
            : "Lengkapi data identitas di bawah";
    }

    // 4. Isi form dari data yang tersimpan
    function isiForm(profil) {
        if (!profil) return;
        inputNama.value = profil.nama || "";
        inputEmail.value = profil.email || "";
        inputTelepon.value = profil.telepon || "";
        inputNik.value = profil.nomorId || "";
        inputAlamat.value = profil.alamat || "";
    }

    function tampilkanError(pesan, elemen) {
        profileStatus.hidden = true;
        profileError.textContent = pesan;
        profileError.hidden = false;
        if (elemen) elemen.focus();
    }

    // 5. Saat tombol "Simpan Perubahan" ditekan
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        profileError.hidden = true;

        const nama = inputNama.value.trim();
        const telepon = inputTelepon.value.trim();
        const nik = inputNik.value.replace(/\s/g, "");

        if (nama === "") {
            tampilkanError("Isi nama lengkap.", inputNama);
            return;
        }

        if (telepon.replace(/\D/g, "").length < 9) {
            tampilkanError("Isi nomor WhatsApp / HP yang valid.", inputTelepon);
            return;
        }

        if (nik !== "" && !/^\d{16}$/.test(nik)) {
            tampilkanError("NIK harus 16 digit angka.", inputNik);
            return;
        }

        const lama = bacaProfil() || {};

        const profil = {
            nama: nama,
            email: inputEmail.value.trim(),
            telepon: telepon,
            alamat: inputAlamat.value.trim(),
            jenisId: lama.jenisId || "KTP",
            nomorId: nik
        };

        try {
            simpanProfil(profil);
        } catch (error) {
            tampilkanError("Profil gagal disimpan. Periksa pengaturan browser kamu.");
            return;
        }

        tampilkanKartu(profil);
        profileStatus.textContent =
            "Profil tersimpan. Data ini dipakai otomatis saat kamu memesan lewat keranjang.";
        profileStatus.hidden = false;
    });

    // 6. Saat halaman dibuka
    const profilTersimpan = bacaProfil();
    isiForm(profilTersimpan);
    tampilkanKartu(profilTersimpan);
}


/* ==========================================================
   SECTION 2: Tombol kembali ke atas
   ========================================================== */
function initTombolAtas() {
    const scrollToTopButton = document.getElementById("scrollToTop");
    if (!scrollToTopButton) return;

    scrollToTopButton.hidden = true;

    window.addEventListener("scroll", function() {
        scrollToTopButton.hidden = window.scrollY < 200;
    });

    scrollToTopButton.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


initProfil();
initTombolAtas();