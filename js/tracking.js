
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

    const trackingForm = document.getElementById("trackingForm");
    const nomorDOInput = document.getElementById("nomorDO");
    const trackingResult = document.getElementById("trackingResult");
    const trackingMessage = document.getElementById("trackingMessage");
    const trackingTimeline = document.getElementById("trackingTimeline");

    document.getElementById("userInfo").textContent =
        `${pengguna.nama} | ${pengguna.role}`;

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

    // Format waktu pada timeline.
    function formatWaktu(waktu) {
        if (!waktu) return "-";

        const date = new Date(waktu.replace(" ", "T"));

        if (Number.isNaN(date.getTime())) {
            return waktu;
        }

        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
    }

    function tampilkanPesan(pesan, jenis) {
        trackingMessage.textContent = pesan;
        trackingMessage.className = jenis === "error"
            ? "alert-error"
            : "alert-success";
    }

    function hapusPesan() {
        trackingMessage.textContent = "";
        trackingMessage.className = "";
    }

    // Mencari dan menampilkan data DO.
    function cariPengiriman(nomorDO) {
        hapusPesan();

        const nomor = nomorDO.trim();

        if (!nomor) {
            trackingResult.hidden = true;
            tampilkanPesan("Masukkan nomor DO terlebih dahulu.", "error");
            return;
        }

        const data = dataTracking[nomor];

        if (!data || data.nomorDO !== nomor) {
            trackingResult.hidden = true;
            tampilkanPesan(
                "Nomor DO tidak ditemukan. Silakan periksa kembali nomor yang dimasukkan.",
                "error"
            );
            return;
        }

        // Isi informasi pengiriman.
        document.getElementById("trackingDONumber").textContent =
            `Nomor DO: ${data.nomorDO}`;

        document.getElementById("trackingNama").textContent =
            data.nama || "-";

        document.getElementById("trackingEkspedisi").textContent =
            data.ekspedisi || "-";

        document.getElementById("trackingTanggal").textContent =
            formatTanggal(data.tanggalKirim);

        document.getElementById("trackingPaket").textContent =
            data.paket || "-";

        document.getElementById("trackingTotal").textContent =
            data.total || "-";

        const statusElement = document.getElementById("trackingStatus");
        statusElement.textContent = data.status || "Status tidak tersedia";
        statusElement.className = "status-badge";

        if (data.status === "Dalam Perjalanan") {
            statusElement.classList.add("status-transit");
        } else if (data.status === "Dikirim") {
            statusElement.classList.add("status-delivered");
        }

        // Buat timeline.
        trackingTimeline.replaceChildren();

        if (Array.isArray(data.perjalanan) && data.perjalanan.length > 0) {
            data.perjalanan.forEach(function (item) {
                const timelineItem = document.createElement("div");
                timelineItem.className = "timeline-item";

                const marker = document.createElement("span");
                marker.className = "timeline-marker";
                marker.setAttribute("aria-hidden", "true");

                const content = document.createElement("div");
                content.className = "timeline-content";

                const time = document.createElement("p");
                time.className = "timeline-time";
                time.textContent = formatWaktu(item.waktu);

                const description = document.createElement("p");
                description.className = "timeline-description";
                description.textContent = item.keterangan || "-";

                content.append(time, description);
                timelineItem.append(marker, content);
                trackingTimeline.appendChild(timelineItem);
            });
        } else {
            const empty = document.createElement("p");
            empty.textContent = "Belum ada riwayat perjalanan.";
            trackingTimeline.appendChild(empty);
        }

        trackingResult.hidden = false;
        trackingResult.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    trackingForm.addEventListener("submit", function (event) {
        event.preventDefault();
        cariPengiriman(nomorDOInput.value);
    });

    // Tombol contoh DO.
    document.querySelectorAll("[data-do]").forEach(function (button) {
        button.addEventListener("click", function () {
            nomorDOInput.value = button.dataset.do;
            cariPengiriman(button.dataset.do);
        });
    });

    // =====================================================
    // RINGKASAN DAN DAFTAR DO (dulu halaman Monitoring)
    // =====================================================

    const daftarDO = Object.values(dataTracking);
    const tableBody = document.getElementById("monitoringTableBody");
    const monitoringCount = document.getElementById("monitoringCount");
    const searchInput = document.getElementById("searchDO");

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

    // Tombol detail langsung menampilkan detail di halaman ini.
    function buatTombolDetail(nomorDO) {
        const cell = document.createElement("td");
        const button = document.createElement("button");

        button.type = "button";
        button.className = "btn-detail";
        button.textContent = "Lihat Detail";
        button.setAttribute("aria-label", `Lihat detail pengiriman ${nomorDO}`);

        button.addEventListener("click", function () {
            nomorDOInput.value = nomorDO;
            cariPengiriman(nomorDO);
        });

        cell.appendChild(button);
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

    // Buka hasil secara otomatis dari parameter URL.
    const params = new URLSearchParams(window.location.search);
    const nomorDODariURL = params.get("do");

    if (nomorDODariURL) {
        nomorDOInput.value = nomorDODariURL;
        cariPengiriman(nomorDODariURL);
    }

    // Logout.
    document.getElementById("logoutBtn").addEventListener("click", function () {
        if (window.confirm("Apakah Anda yakin ingin keluar dari SITTA Praktik?")) {
            localStorage.removeItem("sittaUser");
            window.location.href = "index.html";
        }
    });

    // Menu yang belum dikembangkan.
    document.querySelectorAll("[data-placeholder]").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            window.alert("Menu ini belum tersedia pada tahap pengembangan.");
        });
    });
});