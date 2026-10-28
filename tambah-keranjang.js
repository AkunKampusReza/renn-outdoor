/* ==========================================================
   tambah-keranjang.js - Tambah produk ke keranjang dari beranda
   Membutuhkan data.js (products).
   Memakai kunci localStorage yang sama dengan script_katalog.js,
   jadi isi keranjang langsung muncul di katalog.html
   ========================================================== */

const KUNCI_KERANJANG = "rennKeranjang";

function bacaKeranjang() {
    try {
        const data = JSON.parse(localStorage.getItem(KUNCI_KERANJANG));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function simpanKeranjang(keranjang) {
    try {
        localStorage.setItem(KUNCI_KERANJANG, JSON.stringify(keranjang));
    } catch (error) {
        // penyimpanan diblokir: abaikan
    }
}

// Angka kecil di menu "Keranjang"
function perbaruiBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;

    badge.textContent = bacaKeranjang().reduce(function(total, item) {
        return total + (Number(item.quantity) || 0);
    }, 0);
}

document.addEventListener("click", function(event) {
    const tombol = event.target.closest("[data-add]");
    if (!tombol) return;

    // Nama dan harga diambil dari data.js, tombol hanya membawa id
    const barang = products.find(function(product) {
        return String(product.id) === tombol.dataset.id;
    });
    if (!barang) return;

    const keranjang = bacaKeranjang();

    // Dari beranda, durasi awal 1 hari
    const ada = keranjang.find(function(item) {
        return String(item.id) === String(barang.id) && item.duration === 1;
    });

    if (ada) {
        ada.quantity += 1;
    } else {
        keranjang.push({
            id: barang.id,
            name: barang.name,
            price: barang.price,
            duration: 1,
            quantity: 1
        });
    }

    simpanKeranjang(keranjang);
    perbaruiBadge();

    // Umpan balik singkat pada tombol
    const teksAsli = tombol.dataset.label || tombol.textContent;
    tombol.dataset.label = teksAsli;
    tombol.textContent = "✓ Ditambahkan";
    clearTimeout(tombol.timer);
    tombol.timer = setTimeout(function() {
        tombol.textContent = teksAsli;
    }, 1500);
});

perbaruiBadge();