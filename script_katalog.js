// Daftar produk (products) sekarang ada di data.js

let selectedCategory = "Semua";
const NOMOR_WA = "6285707360233";
const KUNCI_KERANJANG = "rennKeranjang";
const KUNCI_PROFIL = "rennProfil";

let cart = loadCart();
let notificationTimer;

// =====================================
// NOTIFIKASI POP-UP
// =====================================
function showNotification() {
    const notification = document.getElementById("notification");

    if (!notification) return;

    notification.textContent =
        "✓ Barang berhasil disimpan ke keranjang!";

    notification.classList.add("show");

    clearTimeout(notificationTimer);

    notificationTimer = setTimeout(function() {
        notification.classList.remove("show");
    }, 1500);
}

// =====================================
// PENYIMPANAN KERANJANG DAN PROFIL (localStorage)
// Keranjang dibagikan dengan halaman beranda lewat kunci yang sama
// =====================================
function loadCart() {
    try {
        const data = JSON.parse(localStorage.getItem(KUNCI_KERANJANG));
        if (!Array.isArray(data)) return [];

        return data
            .filter(function(item) {
                return item && typeof item.name === "string";
            })
            .map(function(item) {
                return {
                    id: item.id,
                    name: String(item.name),
                    price: Number(item.price) || 0,
                    duration: Math.max(parseInt(item.duration, 10) || 1, 1),
                    quantity: Math.max(parseInt(item.quantity, 10) || 1, 1)
                };
            });
    } catch (error) {
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(KUNCI_KERANJANG, JSON.stringify(cart));
    } catch (error) {
        // penyimpanan penuh atau diblokir: keranjang tetap jalan di halaman ini
    }
}

function loadProfil() {
    try {
        const data = JSON.parse(localStorage.getItem(KUNCI_PROFIL));
        return data && typeof data === "object" ? data : null;
    } catch (error) {
        return null;
    }
}

function profilLengkap(profil) {
    return Boolean(
        profil &&
        profil.nama &&
        profil.telepon &&
        String(profil.telepon).replace(/\D/g, "").length >= 9
    );
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// =====================================
// FORMAT RUPIAH
// =====================================
function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

// =====================================
// MENAMPILKAN PRODUK
// =====================================
function displayProducts() {
    const productGrid = document.getElementById("productGrid");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");
    const emptyMessage = document.getElementById("emptyMessage");

    const keyword = searchInput.value.toLowerCase().trim();

    let filteredProducts = products.filter(function(product) {
        const matchesCategory =
            selectedCategory === "Semua" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword) ||
            product.description.toLowerCase().includes(keyword);

        return matchesCategory && matchesSearch;
    });

    // MENGURUTKAN PRODUK
    if (sortSelect.value === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortSelect.value === "name") {
        filteredProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    productGrid.innerHTML = "";

    emptyMessage.hidden = filteredProducts.length !== 0;

    filteredProducts.forEach(function(product) {
        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">
                <span class="product-status">TERSEDIA</span>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-price">
                    ${formatRupiah(product.price)}
                    <small>/ hari</small>
                </div>

                <label
                    class="duration-label"
                    for="duration-${product.id}"
                >
                    Durasi Sewa
                </label>

                <select
                    class="duration-input"
                    id="duration-${product.id}"
                >
                    <option value="1">1 hari</option>
                    <option value="2">2 hari</option>
                    <option value="3">3 hari</option>
                    <option value="4">4 hari</option>
                    <option value="5">5 hari</option>
                    <option value="7">7 hari</option>
                </select>

                <div class="product-actions">
                    <button
                        class="detail-button"
                        data-detail="${product.id}"
                    >
                        Lihat Detail
                    </button>

                    <button
                        class="rent-button"
                        data-rent="${product.id}"
                    >
                        + Sewa
                    </button>
                </div>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

// =====================================
// MEMILIH KATEGORI
// =====================================
document.querySelectorAll(".category-button").forEach(
    function(button) {
        button.addEventListener("click", function() {
            document.querySelectorAll(".category-button").forEach(
                function(item) {
                    item.classList.remove("active");
                }
            );

            button.classList.add("active");
            selectedCategory = button.dataset.category;

            displayProducts();
        });
    }
);

// =====================================
// PENCARIAN DAN PENGURUTAN
// =====================================
document.getElementById("searchInput").addEventListener(
    "input",
    displayProducts
);

document.getElementById("sortSelect").addEventListener(
    "change",
    displayProducts
);

// =====================================
// TOMBOL LIHAT DETAIL DAN SEWA
// =====================================
document.getElementById("productGrid").addEventListener(
    "click",
    function(event) {
        const detailButton = event.target.closest("[data-detail]");
        const rentButton = event.target.closest("[data-rent]");

        // LIHAT DETAIL
        if (detailButton) {
            const productId = Number(detailButton.dataset.detail);

            const product = products.find(
                item => item.id === productId
            );

            if (product) {
                alert(
                    product.name + "\n\n" +
                    product.description + "\n\n" +
                    "Kategori: " + product.category + "\n" +
                    "Harga sewa: " +
                    formatRupiah(product.price) + " / hari"
                );
            }
        }

        // TAMBAH BARANG KE KERANJANG
        if (rentButton) {
            const productId = Number(rentButton.dataset.rent);

            const product = products.find(
                item => item.id === productId
            );

            const durationInput = document.getElementById(
                "duration-" + productId
            );

            if (!product || !durationInput) return;

            const duration = Number(durationInput.value);

            if (!Number.isInteger(duration) || duration < 1) {
                return;
            }

            const existingItem = cart.find(function(item) {
                return item.id === productId &&
                    item.duration === duration;
            });

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    duration: duration,
                    quantity: 1
                });
            }

            updateCart();
            showNotification();
        }
    }
);

// =====================================
// MEMPERBARUI TAMPILAN KERANJANG
// =====================================
function updateCart() {
    saveCart();

    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutButton = document.getElementById("checkoutButton");

    // TOTAL JUMLAH BARANG
    const totalQuantity = cart.reduce(function(total, item) {
        return total + item.quantity;
    }, 0);

    // TOTAL HARGA SEMUA BARANG
    const totalPrice = cart.reduce(function(total, item) {
        return total +
            item.price * item.duration * item.quantity;
    }, 0);

    cartCount.textContent = totalQuantity;
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            "<p>Keranjang kamu masih kosong.</p>";
    }

    // MENAMPILKAN SETIAP BARANG BESERTA TOMBOL + DAN -
    cart.forEach(function(item, index) {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";

        itemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${escapeHtml(item.name)}</h4>

                <p>Durasi: ${item.duration} hari</p>

                <p class="cart-item-price">
                    ${formatRupiah(
                        item.price * item.duration * item.quantity
                    )}
                </p>

                <div class="quantity-control">
                    <button
                        class="quantity-button"
                        data-decrease="${index}"
                        aria-label="Kurangi jumlah"
                        ${item.quantity <= 1 ? "disabled" : ""}
                    >
                        −
                    </button>

                    <span class="quantity-number">
                        ${item.quantity}
                    </span>

                    <button
                        class="quantity-button"
                        data-increase="${index}"
                        aria-label="Tambah jumlah"
                    >
                        +
                    </button>
                </div>
            </div>

            <button
                class="remove-button"
                data-remove="${index}"
            >
                Hapus
            </button>
        `;

        cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = formatRupiah(totalPrice);
    checkoutButton.disabled = cart.length === 0;
}

// =====================================
// MEMBUKA KERANJANG
// =====================================
const cartModal = document.getElementById("cartModal");

document.getElementById("cartButton").addEventListener(
    "click",
    function() {
        updateCart();
        tampilkanProfil();
        cartModal.classList.add("show");
    }
);

// =====================================
// MENUTUP KERANJANG
// =====================================
document.getElementById("closeCart").addEventListener(
    "click",
    function() {
        cartModal.classList.remove("show");
    }
);

cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.classList.remove("show");
    }
});

// =====================================
// TOMBOL TAMBAH, KURANG, DAN HAPUS
// =====================================
document.getElementById("cartItems").addEventListener(
    "click",
    function(event) {
        const increaseButton = event.target.closest("[data-increase]");
        const decreaseButton = event.target.closest("[data-decrease]");
        const removeButton = event.target.closest("[data-remove]");

        // MENAMBAH JUMLAH SATU BARANG
        if (increaseButton) {
            const index = Number(increaseButton.dataset.increase);

            if (cart[index]) {
                cart[index].quantity += 1;
                updateCart();
            }

            return;
        }

        // MENGURANGI JUMLAH SATU BARANG
        if (decreaseButton) {
            const index = Number(decreaseButton.dataset.decrease);

            if (cart[index] && cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                updateCart();
            }

            return;
        }

        // MENGHAPUS SELURUH ITEM
        if (removeButton) {
            const index = Number(removeButton.dataset.remove);

            if (cart[index]) {
                cart.splice(index, 1);
                updateCart();
            }
        }
    }
);

// =====================================
// DATA PEMESAN (DARI PROFIL) DAN TANGGAL MULAI
// =====================================
const startDateInput = document.getElementById("startDate");
const checkoutError = document.getElementById("checkoutError");
const profileNote = document.getElementById("profileNote");

// Tanggal mulai tidak boleh sebelum hari ini
(function aturTanggalMinimum() {
    const sekarang = new Date();
    const dua = function(n) { return String(n).padStart(2, "0"); };
    startDateInput.min =
        sekarang.getFullYear() + "-" +
        dua(sekarang.getMonth() + 1) + "-" +
        dua(sekarang.getDate());
})();

function parseTanggal(teks) {
    const bagian = teks.split("-").map(Number);
    return new Date(bagian[0], bagian[1] - 1, bagian[2]);
}

function formatTanggal(date) {
    return date.toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
}

function formatTanggalPendek(date) {
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

// Menampilkan ringkasan pemesan dan link ke halaman profil
function tampilkanProfil() {
    profileNote.replaceChildren();

    const profil = loadProfil();
    const link = document.createElement("a");
    link.href = "profil.html";

    if (profilLengkap(profil)) {
        profileNote.append("Pemesan: " + profil.nama + " (" + profil.telepon + ") · ");
        link.textContent = "Ubah profil";
    } else {
        profileNote.append("Profil belum lengkap. ");
        link.textContent = "Lengkapi profil";
    }

    profileNote.append(link);
}

function tampilkanErrorCheckout(pesan) {
    checkoutError.textContent = pesan;
    checkoutError.hidden = false;
}

// Menyusun isi pesan WhatsApp dari keranjang dan profil
function susunPesanWA(profil) {
    const mulai = parseTanggal(startDateInput.value);

    const total = cart.reduce(function(jumlah, item) {
        return jumlah + item.price * item.duration * item.quantity;
    }, 0);

    const daftarBarang = cart.map(function(item) {
        const kembali = new Date(mulai);
        kembali.setDate(kembali.getDate() + item.duration);

        return "- " + item.quantity + " × " + item.name +
            " (" + item.duration + " hari, kembali " +
            formatTanggalPendek(kembali) + ") = " +
            formatRupiah(item.price * item.duration * item.quantity);
    });

    const nomorAsli = profil.nomorId ? String(profil.nomorId).trim() : "";
    // Hanya 4 digit terakhir yang dikirim lewat WhatsApp
    const nomorId = nomorAsli.length > 4
        ? "*".repeat(nomorAsli.length - 4) + nomorAsli.slice(-4)
        : nomorAsli;
    const jenisId = profil.jenisId || "KTP";

    return [
        "Halo ReNN Outdoor, saya ingin memesan:",
        "",
        "*Barang*",
        ...daftarBarang,
        "",
        "*Tanggal mulai*: " + formatTanggal(mulai),
        "*Total*: " + formatRupiah(total),
        "",
        "*Data penyewa*",
        "Nama: " + profil.nama,
        "Telepon: " + profil.telepon,
        profil.alamat ? "Alamat: " + profil.alamat : null,
        "",
        "*Jaminan*: " + jenisId +
            (nomorId ? " (" + nomorId + ")" : " (nomor diserahkan saat pengambilan)"),
        "",
        "Mohon dicek ketersediaannya. Terima kasih!"
    ].filter(function(baris) { return baris !== null; }).join("\n");
}

// =====================================
// TOMBOL KIRIM PESANAN LEWAT WHATSAPP
// =====================================
document.getElementById("checkoutButton").addEventListener(
    "click",
    function() {
        checkoutError.hidden = true;

        if (cart.length === 0) {
            tampilkanErrorCheckout("Keranjang kamu masih kosong.");
            return;
        }

        if (!startDateInput.value) {
            tampilkanErrorCheckout("Pilih tanggal mulai sewa dulu.");
            startDateInput.focus();
            return;
        }

        const profil = loadProfil();

        if (!profilLengkap(profil)) {
            tampilkanErrorCheckout(
                "Lengkapi profil dulu agar data pemesan terisi otomatis."
            );
            return;
        }

        const url = "https://wa.me/" + NOMOR_WA +
            "?text=" + encodeURIComponent(susunPesanWA(profil));

        window.open(url, "_blank", "noopener");
    }
);

// =====================================
// MENAMPILKAN PRODUK SAAT HALAMAN DIBUKA
// =====================================
// Dari beranda: katalog.html?q=kata langsung mengisi kolom pencarian
const kataKunciAwal = new URLSearchParams(window.location.search).get("q");
if (kataKunciAwal) {
    document.getElementById("searchInput").value = kataKunciAwal;
}

displayProducts();
updateCart();

// Dari beranda: katalog.html#keranjang langsung membuka keranjang
if (window.location.hash === "#keranjang") {
    tampilkanProfil();
    cartModal.classList.add("show");
}