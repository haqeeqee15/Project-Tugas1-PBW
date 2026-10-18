
document.addEventListener("DOMContentLoaded", function () {
    // Validasi sesi login.
    let pengguna;

    try {
        pengguna = JSON.parse(localStorage.getItem("sittaUser"));
    } catch (error) {
        pengguna = null;
    }

    if (!pengguna || !pengguna.email) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("userInfo").textContent =
        `${pengguna.nama} | ${pengguna.role}`;

    const daftarDO = Object.values(dataTracking);
    const tableBody = document.getElementById("monitoringTableBody");
    const monitoringCount = document.getElementById("monitoringCount");
    const searchInput = document.getElementById("searchDO");

    // Format tanggal agar lebih mudah dibaca.
    function formatTanggal(tanggal) {
        if (!tanggal) return "-";

        const date = new Date(tanggal.replace(" ", "T"));

        if (Number.isNaN(date.getTime())) {
            return tanggal;
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    function buatSel(nilai) {
        const cell = document.createElement("td");
        cell.textContent = nilai ?? "-";
        return cell;
    }

    function buatStatus(status) {
        const cell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = "status-badge";
        badge.textContent = status || "Tidak diketahui";

        if (status === "Dalam Perjalanan") {
            badge.classList.add("status-transit");
        } else if (status === "Dikirim") {
            badge.classList.add("status-delivered");
        }

        cell.appendChild(badge);
        return cell;
    }

    // Tombol detail membuka halaman Tracking untuk nomor DO tersebut.
    function buatTombolDetail(nomorDO) {
        const cell = document.createElement("td");
        const link = document.createElement("a");

        link.className = "btn-detail";
        link.href = "tracking.html?do=" + encodeURIComponent(nomorDO);
        link.textContent = "Lihat Detail";
        link.setAttribute("aria-label", `Lihat detail pengiriman ${nomorDO}`);

        cell.appendChild(link);
        return cell;
    }

    function tampilkanRingkasan() {
        document.getElementById("totalDO").textContent = daftarDO.length;

        document.getElementById("totalTransit").textContent = daftarDO.filter(
            (item) => item.status === "Dalam Perjalanan"
        ).length;

        document.getElementById("totalDikirim").textContent = daftarDO.filter(
            (item) => item.status === "Dikirim"
        ).length;
    }

    function tampilkanTabel(kataKunci = "") {
        tableBody.replaceChildren();

        const keyword = kataKunci.trim().toLowerCase();

        const hasilFilter = daftarDO.filter(function (item) {
            const nomor = String(item.nomorDO || "").toLowerCase();
            const nama = String(item.nama || "").toLowerCase();

            return nomor.includes(keyword) || nama.includes(keyword);
        });

        monitoringCount.textContent =
            `Menampilkan ${hasilFilter.length} dari ${daftarDO.length} data DO`;

        if (hasilFilter.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 7;
            cell.className = "table-empty";
            cell.textContent = "Data DO tidak ditemukan.";

            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        hasilFilter.forEach(function (item, index) {
            const row = document.createElement("tr");

            row.appendChild(buatSel(index + 1));
            row.appendChild(buatSel(item.nomorDO));
            row.appendChild(buatSel(item.nama));
            row.appendChild(buatSel(item.ekspedisi));
            row.appendChild(buatSel(formatTanggal(item.tanggalKirim)));
            row.appendChild(buatStatus(item.status));
            row.appendChild(buatTombolDetail(item.nomorDO));

            tableBody.appendChild(row);
        });
    }

    document.getElementById("monitoringSearchForm").addEventListener("submit", function (event) {
        event.preventDefault();
        tampilkanTabel(searchInput.value);
    });

    document.getElementById("resetSearch").addEventListener("click", function () {
        searchInput.value = "";
        tampilkanTabel();
        searchInput.focus();
    });

    searchInput.addEventListener("input", function () {
        tampilkanTabel(searchInput.value);
    });

    tampilkanRingkasan();
    tampilkanTabel();

    // Logout.
    document.getElementById("logoutBtn").addEventListener("click", function () {
        if (window.confirm("Apakah Anda yakin ingin keluar dari SITTA Praktik?")) {
            localStorage.removeItem("sittaUser");
            window.location.href = "index.html";
        }
    });
});
