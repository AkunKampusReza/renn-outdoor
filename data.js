/* ==========================================================
   data.js - Data produk (dipakai oleh landingpage.html dan katalog.html)
   Ubah / tambah produk di sini.
   - products      : barang di halaman katalog.html dan landingpage.html
   ========================================================== */

const products = [
    {
        id: 1,
        name: "Tenda Camping Kapasitas 4 Orang",
        category: "Tenda",
        price: 50000,
        description: "Tenda luas dan nyaman untuk camping bersama teman.",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Carrier Eiger 45 Liter",
        category: "Carrier",
        price: 35000,
        description: "Tas carrier dengan kapasitas besar untuk perjalanan.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Sleeping Bag Eiger Mummy",
        category: "Sleeping Gear",
        price: 25000,
        description: "Kantong tidur hangat dan ringan untuk malam di alam.",
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Kompor Portable Camping",
        category: "Alat Masak",
        price: 20000,
        description: "Kompor praktis untuk memasak selama perjalanan.",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Lampu Camping LED",
        category: "Penerangan",
        price: 15000,
        description: "Lampu praktis untuk menerangi tenda pada malam hari.",
        image: "https://images.unsplash.com/photo-1500530859312-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        name: "Trekking Pole",
        category: "Aksesoris",
        price: 10000,
        description: "Tongkat bantu berjalan untuk mendukung pendakian.",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80"
    }
];

// 1500000 -> "Rp 1.500.000 / hari"
function teksHarga(angka) {
    return "Rp " + angka.toLocaleString("id-ID") + " / hari";
}

// Produk katalog untuk pencarian di beranda
const DAFTAR_PENCARIAN = [
    ...products.map(function(p) {
        return {
            nama: p.name,
            isi: p.category,
            harga: teksHarga(p.price),
            teks: p.name + " " + p.category + " " + p.description,
            diBeranda: false
        };
    })
];

// Mencari produk (harga tidak ikut dicari)
function cariDiData(keyword) {
    const k = keyword.toLowerCase().trim();
    return DAFTAR_PENCARIAN.filter(function(p) {
        return p.teks.toLowerCase().includes(k);
    });
}