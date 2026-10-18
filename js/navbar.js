/*
 * =========================================================
 * SITTA PRAKTIK
 * File: js/navbar.js
 * Fungsi: Menandai tab aktif dan mengatur menu burger di ponsel
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".app-navbar");

    if (!navbar) return;

    // =====================================================
    // 1. TANDAI TAB AKTIF BERDASARKAN NAMA FILE
    // =====================================================

    const halamanAktif =
        window.location.pathname.split("/").pop() || "dashboard.html";

    navbar.querySelectorAll(".app-navbar-nav a").forEach(function (link) {
        const aktif = link.getAttribute("href") === halamanAktif;

        link.classList.toggle("active", aktif);

        if (aktif) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // =====================================================
    // 2. MENU BURGER UNTUK UKURAN PONSEL
    // =====================================================

    const toggle = navbar.querySelector(".nav-toggle");

    if (!toggle) return;

    function aturMenu(buka) {
        navbar.classList.toggle("nav-open", buka);
        toggle.setAttribute("aria-expanded", String(buka));
        toggle.setAttribute(
            "aria-label",
            buka ? "Tutup menu navigasi" : "Buka menu navigasi"
        );
    }

    toggle.addEventListener("click", function () {
        aturMenu(!navbar.classList.contains("nav-open"));
    });

    // Tutup menu saat klik di luar navbar.
    document.addEventListener("click", function (event) {
        if (navbar.classList.contains("nav-open") && !navbar.contains(event.target)) {
            aturMenu(false);
        }
    });

    // Tutup menu dengan tombol Escape.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && navbar.classList.contains("nav-open")) {
            aturMenu(false);
            toggle.focus();
        }
    });

    // Reset menu saat layar kembali ke ukuran desktop.
    window.matchMedia("(min-width: 769px)").addEventListener("change", function (event) {
        if (event.matches) aturMenu(false);
    });
});