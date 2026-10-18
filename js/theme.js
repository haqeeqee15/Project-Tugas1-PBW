/*
 * =========================================================
 * SITTA PRAKTIK
 * File: js/theme.js
 * Fungsi: Mengatur mode terang/gelap dan menyimpan pilihan
 * Catatan: dimuat tanpa defer agar tema langsung diterapkan
 *          sebelum halaman tampil (tidak berkedip).
 * =========================================================
 */

(function () {
    const KUNCI_TEMA = "sittaTheme";
    const root = document.documentElement;

    function ambilTemaTersimpan() {
        try {
            return localStorage.getItem(KUNCI_TEMA);
        } catch (error) {
            return null;
        }
    }

    function simpanTema(tema) {
        try {
            localStorage.setItem(KUNCI_TEMA, tema);
        } catch (error) {
            // Abaikan jika browser tidak mengizinkan penyimpanan.
        }
    }

    // Jika belum pernah memilih, ikuti pengaturan perangkat.
    const temaAwal =
        ambilTemaTersimpan() ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    root.setAttribute("data-theme", temaAwal);

    // =====================================================
    // TOMBOL TOGGLE DI NAVBAR
    // =====================================================

    document.addEventListener("DOMContentLoaded", function () {
        const toggle = document.querySelector(".theme-toggle");

        if (!toggle) return;

        function perbaruiTombol() {
            const gelap = root.getAttribute("data-theme") === "dark";

            toggle.setAttribute("aria-checked", String(gelap));
            toggle.setAttribute(
                "aria-label",
                gelap ? "Ganti ke mode terang" : "Ganti ke mode gelap"
            );
            toggle.title = gelap ? "Mode terang" : "Mode gelap";
        }

        toggle.addEventListener("click", function () {
            const temaBaru =
                root.getAttribute("data-theme") === "dark" ? "light" : "dark";

            root.setAttribute("data-theme", temaBaru);
            simpanTema(temaBaru);
            perbaruiTombol();
        });

        perbaruiTombol();
    });
})();
