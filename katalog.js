/* ==========================================================
   katalog.js - Pencarian di halaman Katalog Lengkap (katalog.html)
   Membutuhkan data.js (dimuat sebelum file ini)
   ========================================================== */

function initPencarianKatalog() {
    const searchInput = document.querySelector('#search');
    const searchResults = document.querySelector('#searchResults');
    const cards = document.querySelectorAll('.catalog-card');

    // Cari kartu di halaman berdasarkan judul <h3>
    function cariKartu(nama) {
        return Array.from(cards).find((card) =>
            card.querySelector('h3').textContent.trim().toLowerCase() === nama.toLowerCase()
        );
    }

    // Gulung ke kartu lalu beri sorotan oranye selama 2,5 detik
    function sorotKartu(nama) {
        const card = cariKartu(nama);
        if (!card) return;

        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('catalog-card--highlight');
        setTimeout(() => card.classList.remove('catalog-card--highlight'), 2500);
    }

    // Tampilkan hasil pencarian di bawah kolom cari
    function tampilkanHasil() {
        const keyword = searchInput.value.trim();
        searchResults.replaceChildren();

        if (keyword === '') {
            searchResults.hidden = true;
            return;
        }

        const hasil = cariDiData(keyword);
        searchResults.hidden = false;

        if (hasil.length === 0) {
            const kosong = document.createElement('div');
            kosong.className = 'results-empty';
            kosong.textContent = 'Tidak ada produk yang ditemukan.';
            searchResults.append(kosong);
            return;
        }

        hasil.forEach((p) => {
            const item = document.createElement('a');
            item.className = 'results-item';
            item.href = '#';

            const nama = document.createElement('strong');
            nama.textContent = p.nama;

            const isi = document.createElement('span');
            isi.textContent = p.isi;

            const harga = document.createElement('span');
            harga.className = 'results-price';
            harga.textContent = p.harga;

            item.append(nama, isi, harga);

            // Klik hasil: tutup daftar, lalu gulung ke kartunya
            item.addEventListener('click', (event) => {
                event.preventDefault();
                searchResults.hidden = true;
                sorotKartu(p.nama);
            });

            searchResults.append(item);
        });
    }

    searchInput.addEventListener('input', tampilkanHasil);

    // Kiriman dari beranda lewat alamat halaman
    const params = new URLSearchParams(window.location.search);

    // ?q=kata  -> isi kolom cari dan tampilkan hasilnya
    const kataKunci = params.get('q');
    if (kataKunci) {
        searchInput.value = kataKunci;
        tampilkanHasil();
    }

    // ?item=Nama -> langsung gulung ke kartu tersebut (tunggu halaman selesai dimuat)
    const namaItem = params.get('item');
    if (namaItem) {
        window.addEventListener('load', () => sorotKartu(namaItem));
    }
}

initPencarianKatalog();