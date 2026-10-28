/* ==========================================================
   script.js - ReNN Outdoor (halaman utama: landingpage.html)
   Membutuhkan data.js (dimuat sebelum file ini)
   Tombol "Tambah ke keranjang" ada di tambah-keranjang.js
   ========================================================== */


/* ==========================================================
   SECTION 1: BERANDA - Pencarian produk
   - Barang katalog    -> hasil membuka katalog.html dengan kata kunci
   - Tidak ditemukan   -> tawarkan pencarian di katalog lengkap
   ========================================================== */
function initPencarian() {
    const searchInput = document.querySelector('#search');
    const searchResults = document.querySelector('#searchResults');

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
            const kosong = document.createElement('a');
            kosong.className = 'results-empty';
            kosong.href = 'katalog.html?q=' + encodeURIComponent(keyword);
            kosong.textContent = 'Tidak ditemukan. Cari di katalog lengkap →';
            searchResults.append(kosong);
            return;
        }

        hasil.forEach((p) => {
            const item = document.createElement('a');
            item.className = 'results-item';
            item.href = p.diBeranda
                ? '#katalog'
                : 'katalog.html?q=' + encodeURIComponent(p.nama);

            const nama = document.createElement('strong');
            nama.textContent = p.nama;

            const isi = document.createElement('span');
            isi.textContent = p.diBeranda ? p.isi : p.isi + ' • di katalog lengkap';

            const harga = document.createElement('span');
            harga.className = 'results-price';
            harga.textContent = p.harga;

            item.append(nama, isi, harga);
            searchResults.append(item);
        });
    }

    searchInput.addEventListener('input', tampilkanHasil);

    // Enter: jika tidak ada hasil, pindah ke katalog lengkap
    searchInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;

        const keyword = searchInput.value.trim();
        if (keyword === '') return;

        if (cariDiData(keyword).length === 0) {
            window.location.href = 'katalog.html?q=' + encodeURIComponent(keyword);
        }
    });
}


function tampilkanProdukBeranda() {
    const katalogList = document.querySelector('#katalogList');

    products.slice(0, 3).forEach((product) => {
        const card = document.createElement('article');
        card.className = 'catalog-card';

        const name = document.createElement('h3');
        name.textContent = product.name;

        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.name;
        image.className = 'catalog-image';

        const category = document.createElement('p');
        category.className = 'package-items';
        category.textContent = product.category;

        const price = document.createElement('p');
        price.className = 'card-price';
        price.textContent = teksHarga(product.price);

        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'button button--primary';
        addButton.dataset.add = '';
        addButton.dataset.id = String(product.id);
        addButton.textContent = 'Tambah ke keranjang';

        card.append(name, image, category, price, addButton);
        katalogList.append(card);
    });
}


/* ==========================================================
   SECTION 2-5: KEUNGGULAN, CARA MEMESAN, PRODUK, FAQ
   Tidak butuh JavaScript (ditangani HTML dan CSS).
   ========================================================== */


/* ==========================================================
   SECTION 6: GLOBAL - Tombol kembali ke atas
   ========================================================== */
function initTombolAtas() {
    const scrollToTopButton = document.querySelector('#scrollToTop');

    scrollToTopButton.hidden = true;

    window.addEventListener('scroll', () => {
        scrollToTopButton.hidden = window.scrollY < 200;
    });

    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


initPencarian();
tampilkanProdukBeranda();
initTombolAtas();