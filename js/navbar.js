/*
 * =========================================================
 * SITTA PRAKTIK
 * File: js/navbar.js
 * Fungsi: Menandai tab aktif dan mengatur dropdown Laporan
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

            // Jika halaman aktif ada di submenu, tandai juga tab "Laporan".
            const dropdown = link.closest(".nav-dropdown");

            if (dropdown) {
                dropdown.querySelector("summary").classList.add("active");
            }
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // =====================================================
    // 2. TUTUP DROPDOWN SAAT KLIK DI LUAR ATAU TEKAN ESCAPE
    // =====================================================

    const dropdown = navbar.querySelector(".nav-dropdown");

    if (!dropdown) return;

    document.addEventListener("click", function (event) {
        if (dropdown.open && !dropdown.contains(event.target)) {
            dropdown.open = false;
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && dropdown.open) {
            dropdown.open = false;
            dropdown.querySelector("summary").focus();
        }
    });
});