// ALCO Flow — Guided Setup Data Model
// Scope: Meta Ads Setup, Scalev Setup, Meta × Scalev Integration, Tracking & Supporting Tools

window.DEFAULT_GUIDES = [
  {
    id: "meta-ads",
    title: "Meta Ads Setup",
    badge: "Fondasi Wajib",
    badgeType: "primary",
    icon: "fa-brands fa-meta",
    shortDescription: "Siapkan akun personal, Facebook Page, Business Portfolio, Ad Account, pembayaran, dan Dataset/Pixel sebelum beriklan.",
    estimatedTotalTime: "25-35 menit",
    stages: [
      {
        id: "meta-foundation",
        title: "Stage 1 — Meta Foundation",
        description: "Menyiapkan fondasi akun Facebook personal, Fanpage bisnis, dan Meta Business Portfolio.",
        steps: [
          {
            id: "meta-personal-account",
            title: "Amankan Akun Personal Facebook & 2FA",
            estimatedTime: "3-5 menit",
            objective: "Memastikan akun personal Facebook aktif, menggunakan nama asli, dan 2-Factor Authentication (2FA) aktif agar terhindar dari pembatasan (checkpoint).",
            explanation: "Meta mewajibkan identitas asli dan verifikasi dua langkah (2FA) untuk setiap pengelola aset bisnis. Akun tanpa 2FA sangat rentan terkena pembatasan permanen saat mulai membuat Business Portfolio atau Ad Account.",
            instructions: [
              "Buka aplikasi Facebook di HP atau kunjungi facebook.com melalui browser.",
              "Buka menu Pengaturan & Privasi (Settings & Privacy) → Pusat Akun (Accounts Center).",
              "Pilih menu Kata Sandi & Keamanan (Password & Security) → Autentikasi Dua Faktor (Two-Factor Authentication).",
              "Pilih akun personal Anda, lalu aktifkan metode autentikasi menggunakan Aplikasi Autentikasi (Google Authenticator / Duo Mobile) atau SMS cadangan.",
              "Simpan kode pemulihan cadangan (recovery codes) di tempat yang aman."
            ],
            checklist: [
              { id: "c1", text: "Akun Facebook personal menggunakan nama asli dan foto profil jelas", checked: false, checkedAt: null },
              { id: "c2", text: "Two-Factor Authentication (2FA) sudah aktif di Accounts Center", checked: false, checkedAt: null },
              { id: "c3", text: "Kode pemulihan cadangan sudah disimpan di catatan aman", checked: false, checkedAt: null }
            ],
            expectedResult: "Di menu Accounts Center → Password & Security, status Two-Factor Authentication tertera aktif (centang hijau) dengan nomor atau aplikasi terdaftar.",
            verification: { id: "v1", text: "2FA sudah aktif dan akun personal dapat login tanpa hambatan", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "SMS kode 2FA tidak masuk ke nomor HP saya?",
                solution: "Gunakan opsi 'Aplikasi Autentikasi' seperti Google Authenticator. Aplikasi ini menghasilkan 6 digit kode secara offline dan jauh lebih stabil dibanding SMS operator."
              },
              {
                problem: "Akun Facebook baru dibuat langsung terkena checkpoint?",
                solution: "Gunakan akun personal yang sudah berumur (minimal 1-3 bulan) dan aktif berinteraksi secara organik. Hindari membuat akun baru hanya untuk langsung beriklan."
              }
            ],
            externalLink: "https://accountscenter.facebook.com/password_and_security",
            externalLinkLabel: "Buka Akun & Keamanan Facebook",
            aiContext: {
              overview: "Langkah ini adalah fondasi mutlak. Meta menilai reputasi profil personal Anda sebelum memberi izin mengelola anggaran iklan.",
              missingMenuTip: "Ketik langsung di address bar browser: accountscenter.facebook.com lalu pilih Password & Security.",
              fieldExamples: "Pilih Google Authenticator atau Microsoft Authenticator untuk 2FA.",
              errorSolutions: "Jika nomor HP tidak bisa verifikasi, periksa apakah nomor sudah pernah dipakai di akun Facebook lain.",
              verificationCheck: "Pastikan ada tanda centang hijau pada 2FA Anda."
            }
          },
          {
            id: "meta-page-creation",
            title: "Buat Facebook Fanpage Bisnis",
            estimatedTime: "5-7 menit",
            objective: "Membuat Fanpage resmi bisnis yang akan menjadi wajah pengiklan di feed Facebook dan Instagram.",
            explanation: "Iklan Meta Ads tidak bisa berjalan dari profil personal, melainkan harus memiliki Fanpage sebagai identitas publik di feed, stories, dan reels pengguna.",
            instructions: [
              "Buka halaman facebook.com/pages atau klik ikon Menu di Facebook lalu pilih 'Halaman' (Pages).",
              "Klik tombol 'Buat Halaman Baru' (Create new Page).",
              "Isi Nama Halaman sesuai brand atau penawaran Anda (misal: 'Koleksi Herbal Alami' atau 'Toko Sepatu Nyaman').",
              "Pilih Kategori yang relevan (misal: Toko Ritel, Kesehatan & Kecantikan, Produk/Layanan).",
              "Tulis Bio singkat (1-2 kalimat) yang menjelaskan manfaat toko Anda bagi calon pelanggan.",
              "Upload Foto Profil berupa logo brand dan Foto Sampul (Cover Banner) yang relevan dan rapi.",
              "Lengkapi detail kontak (opsional nomor WhatsApp bisnis atau alamat website jika ada)."
            ],
            checklist: [
              { id: "c1", text: "Halaman bisnis berhasil dibuat dengan nama brand yang jelas", checked: false, checkedAt: null },
              { id: "c2", text: "Kategori bisnis sudah dipilih sesuai niche produk", checked: false, checkedAt: null },
              { id: "c3", text: "Foto profil logo dan foto sampul sudah terpasang rapi", checked: false, checkedAt: null }
            ],
            expectedResult: "Halaman Fanpage berhasil terbit, dapat diakses publik dengan URL unik facebook.com/nama-halaman, serta memiliki profil dan sampul aktif.",
            verification: { id: "v1", text: "Fanpage berstatus aktif dan Anda berstatus sebagai Administrator Halaman", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Nama Halaman ditolak oleh Facebook?",
                solution: "Hindari penggunaan huruf kapital semua (misal: 'TOKO HEBAT'), hindari simbol berlebihan, dan hindari kata 'Facebook' atau klaim berlebihan di nama halaman."
              },
              {
                problem: "Tombol buat halaman tidak bisa diklik?",
                solution: "Periksa apakah profil Anda terkena limit pembuatan halaman harian. Tunggu 24 jam atau coba ganti browser."
              }
            ],
            externalLink: "https://www.facebook.com/pages/create",
            externalLinkLabel: "Buka Pembuat Halaman Facebook",
            aiContext: {
              overview: "Fanpage ini yang nantinya akan dikaitkan ke Meta Business Portfolio dan menjadi identitas sponsor iklan Anda.",
              missingMenuTip: "Jika menu Pages tidak kelihatan di sidebar Facebook, buka langsung facebook.com/pages/create.",
              fieldExamples: "Nama: [Nama Brand Anda], Kategori: Pakaian / Produk Konsumen, Bio: Solusi perlengkapan harian berkualitas.",
              errorSolutions: "Jika nama halaman terlalu mirip dengan brand ternama, sesuaikan agar unik dan otentik.",
              verificationCheck: "Kunjungi halaman baru Anda dari jendela incognito untuk memastikan bisa dibuka publik."
            }
          },
          {
            id: "meta-business-portfolio",
            title: "Buat Meta Business Portfolio (Business Manager)",
            estimatedTime: "5-8 menit",
            objective: "Membuat wadah resmi Meta Business Portfolio untuk mengelola aset iklan, Fanpage, hak akses tim, dan Dataset/Pixel secara terstruktur.",
            explanation: "Business Portfolio (dulu disebut Business Manager) adalah wadah bisnis resmi dari Meta. Tanpa Business Portfolio, Anda tidak bisa menggunakan integrasi Conversion API ke Scalev atau membagikan akses secara profesional.",
            instructions: [
              "Buka business.facebook.com/overview di browser desktop/laptop.",
              "Klik tombol 'Buat Akun' (Create an account) di pojok kanan atas.",
              "Masukkan Nama Bisnis Anda (sesuai nama brand atau badan usaha).",
              "Masukkan Nama Lengkap Anda (harus cocok dengan nama di KTP/profil Facebook).",
              "Masukkan Alamat Email Bisnis aktif yang Anda kelola.",
              "Klik tombol Kirim (Submit).",
              "Buka inbox email Anda, cari email dari Meta dengan subjek konfirmasi email bisnis, lalu klik tautan 'Konfirmasi Sekarang' (Confirm Now)."
            ],
            checklist: [
              { id: "c1", text: "Meta Business Portfolio berhasil dibuat melalui business.facebook.com/overview", checked: false, checkedAt: null },
              { id: "c2", text: "Email verifikasi dari Meta sudah dibuka dan link konfirmasi sudah diklik", checked: false, checkedAt: null },
              { id: "c3", text: "Dashboard Meta Business Settings dapat dibuka tanpa error", checked: false, checkedAt: null }
            ],
            expectedResult: "Halaman Pengaturan Bisnis (business.facebook.com/settings) terbuka, dan pada menu 'Info Bisnis' (Business Info) status email tertera 'Terkonfirmasi'.",
            verification: { id: "v1", text: "Business Portfolio siap dan email pengelola sudah terverifikasi resmi", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Muncul pesan 'Anda telah mencapai batas bisnis'?",
                solution: "Meta membatasi 2 Business Portfolio per akun personal baru. Gunakan Business Portfolio yang sudah ada, atau minta rekan/partner membuat dan menambahkan Anda sebagai Admin."
              },
              {
                problem: "Email konfirmasi dari Meta tidak kunjung masuk?",
                solution: "Periksa folder Spam atau Promosi. Di Business Settings → Business Info, Anda bisa klik 'Kirim Ulang Email Verifikasi'."
              }
            ],
            externalLink: "https://business.facebook.com/overview",
            externalLinkLabel: "Buka Meta Business Overview",
            aiContext: {
              overview: "Business Portfolio adalah payung utama semua aset periklanan Anda di ekosistem Meta.",
              missingMenuTip: "Setelah membuat, Anda bisa mengakses pengaturan lengkap di business.facebook.com/settings.",
              fieldExamples: "Nama Bisnis: Aladzan Store Group, Email: admin@tokosaya.com atau email Gmail aktif Anda.",
              errorSolutions: "Pastikan Anda login ke akun personal Facebook yang tepat sebelum membuka tautan overview.",
              verificationCheck: "Status email terkonfirmasi di menu Info Bisnis."
            }
          }
        ]
      },
      {
        id: "meta-advertising-account",
        title: "Stage 2 — Advertising Account",
        description: "Membuat akun iklan, menetapkan mata uang & zona waktu, memasang metode pembayaran, serta memeriksa status kesehatan akun.",
        steps: [
          {
            id: "meta-ad-account-create",
            title: "Buat Ad Account Baru",
            estimatedTime: "3-5 menit",
            objective: "Menyiapkan akun iklan (Ad Account) di dalam Business Portfolio Anda.",
            explanation: "Ad Account adalah entitas tempat Anda membuat campaign iklan, menentukan audiens, menyetel anggaran harian, dan membayar tagihan iklan ke Meta.",
            instructions: [
              "Buka business.facebook.com/settings.",
              "Di bilah menu kiri, buka bagian Akun (Accounts) → Akun Iklan (Ad Accounts).",
              "Klik tombol biru '+ Tambahkan' (Add) → pilih 'Buat akun iklan baru' (Create a new ad account).",
              "Masukkan Nama Akun Iklan (misal: 'Ad Account - Toko Utama').",
              "Pilih 'Bisnis Saya' (My Business) pada pertanyaan untuk siapa akun iklan ini dibuat.",
              "Klik Buat (Create), lalu centang nama Anda untuk memberikan Akses Penuh (Full Control), dan klik Tetapkan (Assign)."
            ],
            checklist: [
              { id: "c1", text: "Ad Account baru berhasil dibuat di dalam Business Portfolio", checked: false, checkedAt: null },
              { id: "c2", text: "Hak akses Full Control / Administrator sudah diberikan ke profil Anda", checked: false, checkedAt: null },
              { id: "c3", text: "Nomor ID Akun Iklan (Ad Account ID) tercatat dengan aman", checked: false, checkedAt: null }
            ],
            expectedResult: "Ad Account muncul dalam daftar Akun Iklan di Business Settings dengan ID unik (15-16 digit angka, misal: act_1234567890).",
            verification: { id: "v1", text: "Ad Account aktif dan Anda memiliki hak kelola penuh atas akun tersebut", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Tombol 'Buat akun iklan baru' berwarna abu-abu (tidak bisa diklik)?",
                solution: "Kemungkinan email Business Portfolio belum dikonfirmasi, atau limit pembuatan akun iklan portfolio Anda masih 1. Selesaikan verifikasi email di Business Info terlebih dahulu."
              }
            ],
            externalLink: "https://business.facebook.com/settings/ad-accounts",
            externalLinkLabel: "Buka Pengaturan Akun Iklan",
            aiContext: {
              overview: "Satu Business Portfolio bisa memiliki beberapa Ad Account seiring pertumbuhan histori pembayaran Anda.",
              missingMenuTip: "Klik ikon gear di kiri bawah dashboard Meta untuk langsung masuk ke Business Settings.",
              fieldExamples: "Nama Akun Iklan: Iklan Penjualan Produk 01.",
              errorSolutions: "Jika limit akun tercapai, hubungi tim support Meta atau gunakan akun iklan yang sudah ada.",
              verificationCheck: "Ad Account ID muncul di pojok atas Ads Manager."
            }
          },
          {
            id: "meta-currency-timezone",
            title: "Atur Mata Uang (IDR) & Zona Waktu (WIB)",
            estimatedTime: "2-3 menit",
            objective: "Menetapkan mata uang Rupiah (IDR) dan zona waktu Indonesia agar pembukuan dan jam tayang iklan akurat.",
            explanation: "Pengaturan mata uang dan zona waktu pada Ad Account bersifat PERMANEN setelah dibuat. Jika salah memilih USD, Anda akan terkena kurs bank internasional dan biaya konversi mata uang setiap transaksi.",
            instructions: [
              "Saat formulir pembuatan Ad Account terbuka (atau via Pengaturan Pembayaran Akun Iklan):",
              "Pastikan kolom Zona Waktu (Time zone) dipilih: (GMT+07:00) Waktu Jakarta (atau zona domisili Anda di WITA / WIT).",
              "Pastikan kolom Mata Uang (Currency) dipilih: IDR - Indonesian Rupiah.",
              "Simpan pengaturan dan pastikan tidak memilih mata uang asing kecuali Anda memang memiliki kartu dalam valuta tersebut."
            ],
            checklist: [
              { id: "c1", text: "Zona waktu telah disetel ke Asia/Jakarta (GMT+7) atau zona Indonesia", checked: false, checkedAt: null },
              { id: "c2", text: "Mata uang akun iklan adalah IDR - Indonesian Rupiah (Rp)", checked: false, checkedAt: null }
            ],
            expectedResult: "Saat membuka Ads Manager, kolom anggaran dan pembelanjaan tertera dengan simbol 'Rp' dan pergantian hari terjadi tepat jam 00:00 WIB.",
            verification: { id: "v1", text: "Mata uang IDR dan zona waktu GMT+7 terkonfirmasi di Ad Account Settings", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Terlanjur memilih USD saat membuat Ad Account?",
                solution: "Jika belum ada campaign yang berjalan, buat Ad Account baru di Business Portfolio dan pastikan memilih IDR. Ad Account yang sudah terlanjur USD tidak bisa diubah mata uangnya secara langsung."
              }
            ],
            externalLink: "https://adsmanager.facebook.com/adsmanager/manage/campaigns",
            externalLinkLabel: "Buka Meta Ads Manager",
            aiContext: {
              overview: "Penyesuaian zona waktu GMT+7 penting agar reporting harian Meta cocok dengan laporan pesanan di Scalev.",
              missingMenuTip: "Dapat diperiksa di menu Ad Account Settings → Time Zone & Currency.",
              fieldExamples: "Timezone: Asia/Jakarta, Currency: IDR (Rupiah).",
              errorSolutions: "Jangan buat campaign sebelum memastikan currency sudah IDR.",
              verificationCheck: "Simbol mata uang di Ads Manager tertulis Rp."
            }
          },
          {
            id: "meta-payment-method",
            title: "Tambahkan Metode Pembayaran",
            estimatedTime: "4-6 menit",
            objective: "Menghubungkan kartu debit/kredit atau metode pembayaran yang sah agar iklan dapat berjalan tanpa penolakan tagihan.",
            explanation: "Meta menagih biaya iklan secara berkala berdasarkan batas tagihan (billing threshold) atau tanggal jatuh tempo bulanan. Jika metode pembayaran gagal diproses, iklan akan langsung berhenti tayang.",
            instructions: [
              "Buka business.facebook.com/billing_hub/payment_settings atau di Business Settings → Penagihan & Pembayaran (Billing & Payments).",
              "Pilih akun iklan target Anda.",
              "Klik tombol 'Tambahkan Metode Pembayaran' (Add Payment Method).",
              "Pilih Lokasi & Mata Uang (Indonesia - Rupiah).",
              "Pilih opsi Kartu Debit atau Kredit (Visa / Mastercard dengan fitur transaksi online aktif, seperti Jenius BTPN, Bank Jago, BCA Mastercard, Mandiri Visa, dll.).",
              "Masukkan nomor kartu, masa berlaku (MM/YY), dan kode CVV di belakang kartu.",
              "Lakukan otorisasi OTP yang dikirimkan bank ke HP Anda.",
              "Pastikan kartu disetel sebagai Metode Pembayaran Utama (Primary)."
            ],
            checklist: [
              { id: "c1", text: "Fitur transaksi debit online internasional di aplikasi perbankan sudah aktif", checked: false, checkedAt: null },
              { id: "c2", text: "Saldo rekening mencukupi untuk uji hold otorisasi Meta (Rp15.000 - Rp50.000)", checked: false, checkedAt: null },
              { id: "c3", text: "Kartu berhasil ditambahkan dan berstatus Utama (Primary) tanpa peringatan merah", checked: false, checkedAt: null }
            ],
            expectedResult: "Metode pembayaran tersimpan dengan tanda 4 digit terakhir kartu Anda dan ada badge centang hijau atau status 'Metode Utama' di Billing Settings.",
            verification: { id: "v1", text: "Metode pembayaran terdaftar aktif dan tidak ada peringatan pembayaran gagal", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Kartu debit ditolak dengan pesan 'Card Declined'?",
                solution: "Buka aplikasi mobile banking Anda (misal Bank Jago / Jenius / BCA Mobile). Pastikan fitur 'Transaksi Online / E-Commerce' diaktifkan dan limit transaksi online harian diatur di atas Rp500.000."
              },
              {
                problem: "Ada potongan kecil saat memasang kartu?",
                solution: "Itu adalah temporary pre-authorization hold dari Meta (sekitar Rp15.000 - Rp30.000) untuk memvalidasi keaktifan kartu, yang akan dikembalikan secara otomatis dalam beberapa jam hingga hari."
              }
            ],
            externalLink: "https://business.facebook.com/billing_hub/payment_settings",
            externalLinkLabel: "Buka Pengaturan Pembayaran Meta",
            aiContext: {
              overview: "Gunakan kartu debit perbankan digital modern yang mendukung 3D-Secure seperti Bank Jago, Jenius BTPN, atau kartu kredit berlogo Visa/Mastercard.",
              missingMenuTip: "Jika menu billing sulit dicari, buka link langsung: business.facebook.com/billing_hub.",
              fieldExamples: "Nomor kartu 16 digit, Nama sesuai di kartu, Masa berlaku MM/YY, CVV 3 digit belakang.",
              errorSolutions: "Pastikan saldo minimal ada Rp50.000 di rekening saat proses validasi.",
              verificationCheck: "Muncul kartu Anda dengan keterangan 'Utama'."
            }
          },
          {
            id: "meta-account-quality",
            title: "Periksa Kualitas Akun (Account Quality)",
            estimatedTime: "2-3 menit",
            objective: "Memastikan profil Facebook, Fanpage, dan Ad Account dalam kondisi sehat bebas dari pembatasan periklanan.",
            explanation: "Sebelum mulai membuat aset tracking atau campaign, Anda wajib memastikan tidak ada bendera merah pembatasan (restriction) dari sistem otomasi Meta. Mengetahui status akun lebih awal mencegah frustrasi di tengah jalan.",
            instructions: [
              "Buka business.facebook.com/accountquality.",
              "Periksa bagian 'Status Akun Meta' (Meta Account Status).",
              "Cek kolom Akun Personal Facebook Anda, Business Portfolio, dan Akun Iklan.",
              "Pastikan tertera status 'Tidak Ada Masalah Periklanan' (No Advertising Issues) atau 'Semua Berjalan Normal'."
            ],
            checklist: [
              { id: "c1", text: "Membuka halaman Account Quality di browser", checked: false, checkedAt: null },
              { id: "c2", text: "Memeriksa status akun personal: Tidak ada pembatasan", checked: false, checkedAt: null },
              { id: "c3", text: "Memeriksa status Ad Account: Tidak ada pembatasan atau penolakan", checked: false, checkedAt: null }
            ],
            expectedResult: "Seluruh aset berstatus hijau tanpa pesan peringatan 'Akses beriklan Anda dibatasi'.",
            verification: { id: "v1", text: "Kualitas akun bersih dan siap menjalankan aktivitas periklanan", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Muncul pesan 'Minta Tinjauan' (Request Review) karena pembatasan?",
                solution: "Siapkan foto KTP/SIM yang jernih dan cocok dengan nama akun personal Anda. Klik tombol 'Minta Tinjauan' dan ikuti verifikasi identitas Meta. Biasanya selesai dalam 24-48 jam."
              }
            ],
            externalLink: "https://business.facebook.com/accountquality",
            externalLinkLabel: "Buka Meta Account Quality",
            aiContext: {
              overview: "Account Quality adalah klinik kesehatan akun Meta Ads Anda. Pantau halaman ini secara berkala.",
              missingMenuTip: "Bisa juga diakses dari menu kiri Ads Manager → ikon perisai dengan tanda centang (Kualitas Akun).",
              fieldExamples: "Status ideal: 'Tidak ada pembatasan beriklan'.",
              errorSolutions: "Jika ada restriction, jangan buat akun baru secara terburu-buru, selesaikan review akun utama terlebih dahulu.",
              verificationCheck: "Semua indikator bertanda centang hijau."
            }
          }
        ]
      },
      {
        id: "meta-tracking-foundation",
        title: "Stage 3 — Tracking Foundation",
        description: "Menyiapkan Dataset (Pixel) di Events Manager dan menghubungkan aset data ke akun iklan.",
        steps: [
          {
            id: "meta-dataset-create",
            title: "Buat Dataset / Pixel di Events Manager",
            estimatedTime: "4-6 menit",
            objective: "Menyiapkan Dataset (Pixel) untuk merekam tindakan calon pembeli di landing page toko Anda.",
            explanation: "Dataset (dulu dikenal sebagai Facebook Pixel) adalah identitas pelacak digital yang bertugas merekam pengunjung, klik tombol checkout, hingga pembelian sukses. Data ini krusial agar algoritma Meta bisa mencari pembeli potensial.",
            instructions: [
              "Buka business.facebook.com/events_manager2.",
              "Pastikan Business Portfolio yang dipilih di pojok kiri atas sudah benar.",
              "Klik ikon '+' berwarna hijau di sebelah kiri ('Hubungkan Sumber Data' / Connect Data Sources).",
              "Pilih opsi 'Web' → klik Hubungkan (Connect).",
              "Masukkan Nama Dataset (misal: 'Dataset Toko Utama' atau 'Pixel Scalev 01') → klik Buat (Create).",
              "Jika muncul popup meminta URL website atau integrasi partner, Anda dapat menutup popup (X) karena integrasi akan dipasang via Scalev.",
              "Salin nomor Dataset ID (15-16 digit angka yang tertera di bawah nama Dataset Anda)."
            ],
            checklist: [
              { id: "c1", text: "Dataset baru berhasil dibuat di Meta Events Manager", checked: false, checkedAt: null },
              { id: "c2", text: "Dataset ID (15-16 digit angka) sudah dicatat atau disalin", checked: false, checkedAt: null }
            ],
            expectedResult: "Dataset terdaftar di daftar Sumber Data Events Manager dengan nomor Dataset ID unik.",
            verification: { id: "v1", text: "Dataset ID siap digunakan untuk diintegrasikan ke Scalev", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Saya mencari menu 'Pixel' tapi yang ada hanya 'Dataset'?",
                solution: "Meta telah memperbarui istilah Facebook Pixel menjadi 'Dataset'. Keduanya adalah hal yang sama. Gunakan Dataset ID untuk semua tempat yang meminta Pixel ID."
              }
            ],
            externalLink: "https://eventsmanager.facebook.com/events_manager2",
            externalLinkLabel: "Buka Meta Events Manager",
            aiContext: {
              overview: "Dataset adalah wadah data sinyal pelanggan Anda. Catat ID-nya untuk langkah integrasi Scalev nanti.",
              missingMenuTip: "Buka eventsmanager.facebook.com di browser desktop.",
              fieldExamples: "Nama Dataset: Pixel Penjualan Produk Utama.",
              errorSolutions: "Jika popup menanyakan partner, cukup klik silang (tutup), kita akan menghubungkan via token Scalev.",
              verificationCheck: "Terdapat deretan angka Dataset ID di tab Pengaturan."
            }
          },
          {
            id: "meta-dataset-assign",
            title: "Hubungkan Dataset ke Ad Account (Assign Asset)",
            estimatedTime: "2-4 menit",
            objective: "Memberikan izin kepada Ad Account agar dapat memilih dan menggunakan Dataset ini saat membuat iklan.",
            explanation: "Jika Dataset tidak dihubungkan ke Akun Iklan di Business Settings, Dataset tersebut tidak akan muncul di pilihan opsi konversi saat Anda menyetel kampanye iklan di Ads Manager.",
            instructions: [
              "Buka business.facebook.com/settings.",
              "Di menu sebelah kiri, buka Sumber Data (Data Sources) → pilih Kumpulan Data (Datasets).",
              "Pilih nama Dataset yang baru saja Anda buat.",
              "Klik tab 'Aset yang Terhubung' (Connected Assets).",
              "Klik tombol 'Tetapkan Aset' (Assign Assets).",
              "Centang Akun Iklan (Ad Account) Anda yang sudah dibuat sebelumnya → klik Tambahkan (Add).",
              "Beralih ke tab 'Orang' (People) pada Dataset tersebut, klik 'Tetapkan Orang' (Assign People), pilih nama Anda, aktifkan 'Kelola Kumpulan Data' (Full Control), lalu klik Tetapkan."
            ],
            checklist: [
              { id: "c1", text: "Akun Iklan Anda sudah ditambahkan ke Connected Assets pada Dataset", checked: false, checkedAt: null },
              { id: "c2", text: "Profil Anda memiliki izin Full Control atas Dataset tersebut", checked: false, checkedAt: null }
            ],
            expectedResult: "Ad Account Anda muncul di tab Connected Assets Dataset, dan nama Anda muncul di tab People.",
            verification: { id: "v1", text: "Dataset terhubung penuh dengan Ad Account dan siap melacak konversi", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Ad Account tidak muncul di pilihan Assign Assets?",
                solution: "Pastikan Ad Account berada dalam Business Portfolio yang sama dengan Dataset tersebut."
              }
            ],
            externalLink: "https://business.facebook.com/settings/datasets",
            externalLinkLabel: "Buka Pengaturan Dataset Meta",
            aiContext: {
              overview: "Langkah penautan aset ini sering terlewat oleh pemula dan menyebabkan error 'Dataset tidak ditemukan' saat beriklan.",
              missingMenuTip: "Lokasi: Business Settings → Data Sources → Datasets → Connected Assets.",
              fieldExamples: "Pilih Ad Account Utama Anda.",
              errorSolutions: "Pastikan Anda berstatus admin di Business Portfolio untuk melakukan assign aset.",
              verificationCheck: "Ad Account terdaftar di tab Connected Assets."
            }
          }
        ]
      },
      {
        id: "meta-verification",
        title: "Stage 4 — Final Verification",
        description: "Validasi checklist kesiapan seluruh fondasi Meta Ads sebelum lanjut ke Scalev.",
        steps: [
          {
            id: "meta-ready-check",
            title: "Checklist Kesiapan Meta Ads (Meta Ads Ready)",
            estimatedTime: "2-3 menit",
            objective: "Memverifikasi seluruh pilar fondasi Meta Ads telah lengkap dan siap beroperasi.",
            explanation: "Sebelum berpindah menyiapkan toko di Scalev, mari pastikan seluruh komponen fondasi Meta Ads Anda sudah berstatus hijau. Fondasi yang benar sejak awal akan menghindarkan Anda dari pembatasan akun saat campaign berjalan.",
            instructions: [
              "Periksa kembali checklist verifikasi berikut satu per satu.",
              "Pastikan akun personal aman, Fanpage siap, Business Portfolio terverifikasi email, Ad Account ber-currency IDR, pembayaran aktif, dan Dataset ID sudah tersimpan.",
              "Centang semua item verifikasi di bawah ini jika sudah sesuai."
            ],
            checklist: [
              { id: "c1", text: "Akun personal Facebook memiliki 2FA aktif dan nama asli", checked: false, checkedAt: null },
              { id: "c2", text: "Fanpage bisnis memiliki foto profil, cover, dan URL publik", checked: false, checkedAt: null },
              { id: "c3", text: "Meta Business Portfolio memiliki email terkonfirmasi", checked: false, checkedAt: null },
              { id: "c4", text: "Ad Account memiliki mata uang IDR dan zona waktu GMT+7", checked: false, checkedAt: null },
              { id: "c5", text: "Metode pembayaran aktif dan bebas penolakan transaksi", checked: false, checkedAt: null },
              { id: "c6", text: "Dataset / Pixel ID sudah terbuat dan di-assign ke Ad Account", checked: false, checkedAt: null }
            ],
            expectedResult: "Semua checklist terisi penuh. Status fondasi periklanan Anda: META ADS READY!",
            verification: { id: "v1", text: "Seluruh fondasi Meta Ads lengkap dan siap digunakan", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Ada satu langkah yang masih ragu?",
                solution: "Gunakan tombol 'Sebelumnya' untuk memeriksa kembali langkah terkait, atau gunakan tombol bantuan AI di samping kanan."
              }
            ],
            externalLink: "https://adsmanager.facebook.com",
            externalLinkLabel: "Buka Ads Manager",
            aiContext: {
              overview: "Selamat! Jika seluruh checklist ini selesai, Anda telah menyelesaikan fondasi Meta Ads dengan standar industri profesional.",
              missingMenuTip: "Langkah berikutnya adalah menyiapkan sistem penjualan di Scalev.",
              fieldExamples: "Semua checklist harus tercentang.",
              errorSolutions: "Jika ada kendala pembayaran, selesaikan sebelum beriklan.",
              verificationCheck: "Status akhir: META ADS READY."
            }
          }
        ]
      }
    ]
  },
  {
    id: "scalev-setup",
    title: "Scalev Setup",
    badge: "Sistem Penjualan",
    badgeType: "info",
    icon: "fas fa-store",
    shortDescription: "Buat toko online, konfigurasi produk & bundle, siapkan landing page, dan aktifkan sistem order checkout di Scalev.",
    estimatedTotalTime: "25-35 menit",
    stages: [
      {
        id: "scalev-account-stage",
        title: "Stage 1 — Scalev Account",
        description: "Mendaftarkan akun resmi Scalev dan memahami tata letak navigasi dasbor.",
        steps: [
          {
            id: "scalev-register-login",
            title: "Registrasi Akun Scalev & Login",
            estimatedTime: "3-5 menit",
            objective: "Mendaftarkan akun resmi Scalev dan masuk ke panel workspace.",
            explanation: "Scalev adalah platform e-commerce & funnel builder lokal Indonesia yang dirancang khusus untuk conversion rate tinggi, checkout instan, dan integrasi kurir lokal.",
            instructions: [
              "Buka website app.scalev.id di browser Anda.",
              "Klik tombol 'Daftar Akun Baru' jika belum memiliki akun, atau masukkan email dan kata sandi jika sudah terdaftar.",
              "Lengkapi formulir pendaftaran: Nama lengkap, alamat email aktif, nomor WhatsApp, dan nama brand bisnis Anda.",
              "Buka inbox email untuk melakukan verifikasi akun jika diminta.",
              "Login ke dashboard app.scalev.id."
            ],
            checklist: [
              { id: "c1", text: "Berhasil mendaftar dan memverifikasi email di Scalev", checked: false, checkedAt: null },
              { id: "c2", text: "Berhasil login dan melihat dashboard utama Scalev", checked: false, checkedAt: null }
            ],
            expectedResult: "Tampilan dashboard utama Scalev terbuka dengan nama akun Anda di pojok layar.",
            verification: { id: "v1", text: "Akun Scalev aktif dan siap digunakan", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Email verifikasi tidak masuk?",
                solution: "Cek folder Spam atau Promosi di email Anda. Pastikan tidak ada salah ketik pada alamat email saat mendaftar."
              }
            ],
            externalLink: "https://app.scalev.id/login",
            externalLinkLabel: "Buka Dashboard Scalev",
            aiContext: {
              overview: "Scalev menjadi rumah toko online Anda di mana seluruh pesanan dan formulir checkout dioperasikan.",
              missingMenuTip: "Akses login langsung di app.scalev.id/login.",
              fieldExamples: "Nama Bisnis: Toko Berkah Mandiri.",
              errorSolutions: "Pastikan kata sandi aman dan nomor WhatsApp aktif untuk notifikasi.",
              verificationCheck: "Masuk ke halaman dashboard overview."
            }
          },
          {
            id: "scalev-dashboard-tour",
            title: "Kenali Navigasi Dashboard Scalev",
            estimatedTime: "2-3 menit",
            objective: "Memahami letak menu Toko (Store), Produk, Landing Page, Pesanan, dan Integrasi.",
            explanation: "Mengetahui tata letak menu utama Scalev akan mempercepat alur kerja Anda saat mengatur penawaran, melihat pesanan masuk, dan menghubungkan tracking.",
            instructions: [
              "Perhatikan bilah menu di sebelah kiri dashboard Scalev:",
              "1. Menu 'Toko' (Stores): Tempat membuat dan mengatur profil toko serta subdomain.",
              "2. Menu 'Produk' (Products): Tempat memasukkan item barang, harga, varian, dan stok.",
              "3. Menu 'Landing Page': Tempat mendesain halaman penawaran dengan drag-and-drop builder.",
              "4. Menu 'Pesanan' (Orders): Tempat memproses order pembeli, mencetak label resi, dan cek COD.",
              "5. Menu 'Integrasi' (Integrations): Tempat memasukkan Meta Ads Pixel, Conversion API, dan script eksternal."
            ],
            checklist: [
              { id: "c1", text: "Membuka dan meninjau setiap menu utama di sidebar Scalev", checked: false, checkedAt: null },
              { id: "c2", text: "Memahami fungsi menu Produk, Landing Page, dan Integrasi", checked: false, checkedAt: null }
            ],
            expectedResult: "Anda familiar dengan navigasi Scalev dan siap mengisi data toko.",
            verification: { id: "v1", text: "Navigasi dasbor telah dipahami dengan baik", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Tampilan di HP terlihat padat?",
                solution: "Sangat disarankan mengatur konfigurasi awal Scalev menggunakan browser laptop atau komputer desktop untuk kemudahan mendesain landing page."
              }
            ],
            externalLink: "https://app.scalev.id",
            externalLinkLabel: "Jelajahi Menu Scalev",
            aiContext: {
              overview: "Pahami bahwa alurnya berurutan: Toko → Produk → Landing Page → Integrasi.",
              missingMenuTip: "Sidebar kiri bisa diperkecil atau diperluas dengan ikon panah di pojok dasbor.",
              fieldExamples: "Fokus ke 3 menu: Produk, Landing Page, dan Integrasi.",
              errorSolutions: "Jika menu tidak tampil, refresh halaman browser Anda.",
              verificationCheck: "Semua menu terlihat jelas di bilah navigasi."
            }
          }
        ]
      },
      {
        id: "scalev-store-stage",
        title: "Stage 2 — Store (Toko)",
        description: "Membuat profil toko baru, menentukan nama toko, kontak WhatsApp CS, dan alamat pengiriman.",
        steps: [
          {
            id: "scalev-create-store",
            title: "Buat Store Baru & Lengkapi Informasi Bisnis",
            estimatedTime: "4-6 menit",
            objective: "Membuat entitas toko di Scalev dengan data kontak dan alamat asal pengiriman untuk ongkir.",
            explanation: "Data asal pengiriman (kecamatan/kota asal) wajib diisi dengan tepat karena Scalev menggunakannya untuk menghitung tarif ongkos kirim ekspedisi secara real-time ke alamat pembeli.",
            instructions: [
              "Buka menu 'Toko' (Stores) di dashboard Scalev.",
              "Klik tombol '+ Tambah Toko' (+ Create Store).",
              "Isi Nama Toko (misal: 'Nusantara Style Official').",
              "Tentukan Subdomain toko (misal: nusantarastyle.scalev.id) atau biarkan default.",
              "Masukkan nomor WhatsApp Customer Service (CS) yang aktif melayani pembeli.",
              "Pilih Lokasi Asal Pengiriman (Provinsi, Kota/Kabupaten, dan Kecamatan tempat gudang/stok barang Anda berada).",
              "Klik Simpan Toko (Save)."
            ],
            checklist: [
              { id: "c1", text: "Nama toko dan subdomain berhasil disimpan", checked: false, checkedAt: null },
              { id: "c2", text: "Nomor WhatsApp CS terisi dengan format internasional (misal: 62812xxxx)", checked: false, checkedAt: null },
              { id: "c3", text: "Kecamatan asal pengiriman sudah diisi sesuai gudang stok", checked: false, checkedAt: null }
            ],
            expectedResult: "Toko baru aktif terdaftar di daftar Toko Scalev dengan status aktif.",
            verification: { id: "v1", text: "Toko berhasil dibuat dengan alamat pengiriman lengkap", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Subdomain yang diinginkan sudah dipakai orang lain?",
                solution: "Tambahkan kata unik seperti 'official', 'id', atau 'store' pada subdomain Anda (misal: brandku-id.scalev.id)."
              }
            ],
            externalLink: "https://app.scalev.id/stores",
            externalLinkLabel: "Buka Pengaturan Toko Scalev",
            aiContext: {
              overview: "Alamat asal pengiriman adalah dasar kalkulasi ongkir ekspedisi seperti J&T, SiCepat, JNE, dll.",
              missingMenuTip: "Menu Toko berada di urutan kedua sidebar Scalev.",
              fieldExamples: "Asal pengiriman: DKI Jakarta, Kota Jakarta Selatan, Kebayoran Baru.",
              errorSolutions: "Pastikan nomor WA diawali 62 atau 08 sesuai ketentuan formulir.",
              verificationCheck: "Toko muncul aktif di menu daftar toko."
            }
          }
        ]
      },
      {
        id: "scalev-product-stage",
        title: "Stage 3 — Product (Produk)",
        description: "Menambahkan produk baru, mengatur harga, varian, dan paket bundling penawaran.",
        steps: [
          {
            id: "scalev-add-product",
            title: "Tambah Produk Baru ke Katalog",
            estimatedTime: "5-7 menit",
            objective: "Memasukkan produk yang akan dijual ke dalam sistem inventori Scalev.",
            explanation: "Setiap penawaran di landing page wajib dihubungkan ke produk di katalog agar inventori, rincian harga, dan data laporan pesanan dapat tercatat otomatis.",
            instructions: [
              "Buka menu 'Produk' (Products) → klik tombol '+ Tambah Produk' (+ Add Product).",
              "Pilih Toko tempat produk ini dijual.",
              "Masukkan Nama Produk (misal: 'Minyak Herbal Sapu Jagat 100ml').",
              "Upload foto produk utama yang jernih dan beresolusi tajam.",
              "Masukkan Berat Produk dalam satuan gram (misal: 250 gram). *Penting untuk kalkulasi ongkir kurir.*",
              "Masukkan Harga Jual Dasar (misal: Rp149.000) dan Harga Coret/Modal bila diperlukan.",
              "Tentukan stok awal atau aktifkan toggle 'Tanpa Batas Stok' jika stok selalu tersedia.",
              "Klik Simpan Produk."
            ],
            checklist: [
              { id: "c1", text: "Nama produk terisi jelas dan menarik", checked: false, checkedAt: null },
              { id: "c2", text: "Berat produk dalam gram sudah diinput dengan akurat", checked: false, checkedAt: null },
              { id: "c3", text: "Harga produk sudah ditentukan dan foto produk terupload", checked: false, checkedAt: null }
            ],
            expectedResult: "Produk baru muncul di katalog produk Scalev dengan status 'Aktif' (Publish).",
            verification: { id: "v1", text: "Produk tersimpan di katalog dan memiliki harga aktif", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Ongkir pesanan nantinya menjadi tidak akurat?",
                solution: "Periksa berat produk di menu ini. Pastikan berat sudah memperhitungkan bubble wrap dan kotak packing (misal botol 100g + kardus 100g = 200g)."
              }
            ],
            externalLink: "https://app.scalev.id/products",
            externalLinkLabel: "Buka Katalog Produk Scalev",
            aiContext: {
              overview: "Produk ini yang nantinya ditarik ke dalam form order checkout di landing page.",
              missingMenuTip: "Menu Produk berada di bawah menu Toko.",
              fieldExamples: "Berat: 250 gram, Harga: Rp150.000.",
              errorSolutions: "Jika foto gagal upload, kompres ukuran gambar di bawah 2MB.",
              verificationCheck: "Produk terdaftar dengan badge Aktif."
            }
          },
          {
            id: "scalev-product-bundle",
            title: "Atur Varian & Paket Penawaran (Offer / Bundle)",
            estimatedTime: "4-6 menit",
            objective: "Mengatur varian (ukuran/warna) serta paket bundling promo untuk menaikkan Average Order Value (AOV).",
            explanation: "Menyediakan opsi bundle (misal: Beli 1 Rp149.000, Beli 2 Rp249.000 Hemat Rp49.000) adalah strategi teruji untuk menaikkan nilai belanja pembeli dan menutup biaya iklan Meta Ads.",
            instructions: [
              "Di dalam halaman edit produk (atau tab Varian & Harga):",
              "Jika produk memiliki varian (misal ukuran S, M, L atau warna Hitam, Navy), tambahkan opsi varian.",
              "Jika ingin membuat opsi paket kuantitas (bundling): Buat penawaran paket 1 pcs, paket 2 pcs (Best Seller), dan paket 3 pcs (Paling Hemat).",
              "Tentukan harga diskon khusus untuk paket bundling tersebut.",
              "Simpan perubahan."
            ],
            checklist: [
              { id: "c1", text: "Varian produk sudah ditambahkan (jika relevan)", checked: false, checkedAt: null },
              { id: "c2", text: "Paket penawaran kuantitas/bundling sudah disetel dengan harga menarik", checked: false, checkedAt: null }
            ],
            expectedResult: "Pilihan varian atau paket bundle siap dipilih calon pembeli di formulir pemesanan.",
            verification: { id: "v1", text: "Varian dan harga penawaran sudah siap ditampilkan", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Hanya ingin jual 1 jenis produk tanpa varian?",
                solution: "Cukup gunakan 1 harga tunggal. Anda tidak wajib membuat varian jika produk memang satu ukuran/model."
              }
            ],
            externalLink: "https://app.scalev.id/products",
            externalLinkLabel: "Atur Varian Produk",
            aiContext: {
              overview: "Bundling adalah kunci profitabilitas advertiser e-commerce.",
              missingMenuTip: "Pengaturan varian berada di dalam halaman detail produk.",
              fieldExamples: "Paket 1: 1 Pcs Rp149.000. Paket 2: 2 Pcs Rp249.000 (Gratis Ongkir).",
              errorSolutions: "Pastikan stok varian tidak 0.",
              verificationCheck: "Terdapat pilihan paket saat checkout."
            }
          }
        ]
      },
      {
        id: "scalev-selling-system-stage",
        title: "Stage 4 — Selling System (Landing Page & Checkout)",
        description: "Mendesain landing page, memasang formulir pemesanan otomatis, dan mengatur opsi pembayaran pembeli.",
        steps: [
          {
            id: "scalev-landing-page",
            title: "Buat & Publikasikan Landing Page",
            estimatedTime: "8-12 menit",
            objective: "Membangun halaman penawaran produk menggunakan page builder Scalev dan mempublikasikannya.",
            explanation: "Landing page adalah ruang pamer utama di mana calon pembeli yang mengklik iklan Meta Ads Anda akan diarahkan untuk membaca keunggulan produk dan melakukan pembelian.",
            instructions: [
              "Buka menu 'Landing Page' di dashboard Scalev → klik '+ Buat Landing Page' (+ Create Landing Page).",
              "Pilih Toko target dan masukkan Judul Landing Page (misal: 'Promo Spesial Sepatu Ergonomis').",
              "Gunakan template yang tersedia atau susun section menggunakan blok:",
              "- Header & Headline: Judul penawaran yang memikat.",
              "- Gambar/Video: Tampilkan produk sedang digunakan.",
              "- Manfaat & Keunggulan: 3-4 poin alasan mengapa produk ini solusi terbaik.",
              "- Bukti Sosial / Testimoni: Screenshot review pembeli asli.",
              "Klik tombol 'Publish' (Publikasikan) di pojok kanan atas untuk menerbitkan halaman secara online."
            ],
            checklist: [
              { id: "c1", text: "Landing page memiliki headline penawaran yang jelas", checked: false, checkedAt: null },
              { id: "c2", text: "Foto produk dan manfaat utama ditampilkan dengan baik", checked: false, checkedAt: null },
              { id: "c3", text: "Halaman sudah di-publish dan URL publik dapat dibuka", checked: false, checkedAt: null }
            ],
            expectedResult: "Halaman landing page aktif dan dapat diakses publik melalui browser di HP maupun komputer.",
            verification: { id: "v1", text: "Landing page terbit dan dapat dibuka dengan lancar", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Tampilan landing page berantakan di layar HP?",
                solution: "Gunakan fitur 'Mobile View Preview' di bagian atas builder Scalev untuk memastikan ukuran font dan gambar pas saat dibuka di smartphone."
              }
            ],
            externalLink: "https://app.scalev.id/landing-pages",
            externalLinkLabel: "Buka Builder Landing Page",
            aiContext: {
              overview: "Pastikan halaman fokus pada solusi masalah pelanggan, bukan sekadar spesifikasi teknis.",
              missingMenuTip: "Menu Landing Page berada di sidebar kiri Scalev.",
              fieldExamples: "URL: [namatoko].scalev.id/promo-spesial.",
              errorSolutions: "Klik tombol Publish di kanan atas agar perubahan tersimpan di server.",
              verificationCheck: "Buka link landing page di tab incognito untuk menguji loading."
            }
          },
          {
            id: "scalev-order-form",
            title: "Konfigurasi Order Form & Checkout Otomatis",
            estimatedTime: "5-7 menit",
            objective: "Menanamkan formulir checkout pemesanan langsung di bawah penawaran landing page.",
            explanation: "Formulir checkout instan di landing page (single page checkout) mempercepat proses belanja pembeli tanpa harus pindah ke halaman keranjang belanja yang rumit.",
            instructions: [
              "Di dalam editor Landing Page Scalev, tambahkan blok komponen 'Formulir Pemesanan' (Order Form).",
              "Hubungkan form tersebut dengan Produk yang sudah dibuat di katalog.",
              "Atur field input formulir:",
              "- Nama Lengkap (Wajib)",
              "- Nomor WhatsApp (Wajib untuk follow up & resi)",
              "- Alamat Lengkap & Kecamatan Penerima (Wajib untuk kalkulasi ongkir ekspedisi)",
              "- Catatan Tambahan (Opsional).",
              "Aktifkan pilihan opsi kurir/ekspedisi yang ingin Anda gunakan (misal: J&T Express, SiCepat, JNE).",
              "Simpan dan publish ulang landing page."
            ],
            checklist: [
              { id: "c1", text: "Blok Form Pemesanan sudah terpasang di bawah landing page", checked: false, checkedAt: null },
              { id: "c2", text: "Field nama, WhatsApp, dan kecamatan penerima sudah aktif", checked: false, checkedAt: null },
              { id: "c3", text: "Kalkulator ongkir ekspedisi berfungsi saat kecamatan penerima dipilih", checked: false, checkedAt: null }
            ],
            expectedResult: "Formulir checkout interaktif muncul di landing page dan otomatis menghitung total harga + ongkir saat pembeli memilih alamat.",
            verification: { id: "v1", text: "Order form terhubung ke produk dan kalkulasi ongkir aktif", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Kecamatan pembeli tidak memunculkan pilihan ongkir kurir?",
                solution: "Pastikan di pengaturan Toko asal pengiriman (kecamatan gudang Anda) sudah terisi lengkap dan kurir di pengaturan toko sudah dicentang aktif."
              }
            ],
            externalLink: "https://app.scalev.id/landing-pages",
            externalLinkLabel: "Atur Form Checkout Scalev",
            aiContext: {
              overview: "Semakin sedikit kolom yang harus diisi pembeli, semakin tinggi rasio konversi checkout Anda.",
              missingMenuTip: "Blok Order Form bisa digeser posisinya di page builder Scalev.",
              fieldExamples: "Field: Nama, No WA, Provinsi, Kota, Kecamatan, Alamat Jalan.",
              errorSolutions: "Pastikan produk sudah di-assign ke dalam form.",
              verificationCheck: "Opsi ongkir kurir otomatis keluar saat kecamatan dipilih."
            }
          },
          {
            id: "scalev-payment-config",
            title: "Pengaturan Metode Pembayaran Toko (COD / Transfer)",
            estimatedTime: "4-6 menit",
            objective: "Mengaktifkan metode pembayaran bagi pembeli (Bayar di Tempat / COD, Transfer Bank, atau Payment Gateway).",
            explanation: "Di pasar online Indonesia, metode pembayaran Bayar di Tempat (COD) dan Transfer Bank instan merupakan metode dengan volume transaksi tertinggi.",
            instructions: [
              "Buka menu Toko (Stores) → pilih Pengaturan Pembayaran (Payment Settings) di Scalev.",
              "Aktifkan metode pembayaran yang Anda sediakan:",
              "- Bayar di Tempat (COD): Aktifkan jika Anda bekerja sama dengan ekspedisi yang mendukung COD.",
              "- Transfer Bank Manual: Masukkan nomor rekening, nama bank (BCA, Mandiri, BRI, BNI), dan nama pemilik rekening.",
              "- Pembayaran Otomatis / Payment Gateway: Hubungkan Tripay, Xendit, atau Midtrans jika memiliki akun.",
              "Simpan pengaturan toko."
            ],
            checklist: [
              { id: "c1", text: "Metode pembayaran aktif (COD atau Transfer Bank) sudah dipilih", checked: false, checkedAt: null },
              { id: "c2", text: "Nomor rekening dan nama bank sudah diverifikasi kebenarannya", checked: false, checkedAt: null }
            ],
            expectedResult: "Saat calon pembeli sampai di akhir formulir pemesanan, opsi pembayaran muncul jelas dan tombol 'Pesan Sekarang' aktif.",
            verification: { id: "v1", text: "Metode pembayaran toko siap menerima transaksi pembeli", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Ingin pakai COD tapi belum punya akun ekspedisi?",
                solution: "Scalev memiliki fitur integrasi kurir internal atau Anda bisa mendaftar akun ekspedisi aggregator seperti Mengantar, Komship, atau langsung ke agen J&T setempat."
              }
            ],
            externalLink: "https://app.scalev.id/stores",
            externalLinkLabel: "Atur Pembayaran Toko",
            aiContext: {
              overview: "Beri tahu pembeli estimasi waktu pengiriman dan cara pembayaran yang aman.",
              missingMenuTip: "Dapat diakses via Menu Toko → Tab Pembayaran.",
              fieldExamples: "BCA 1234567890 an Nama Bisnis Anda.",
              errorSolutions: "Periksa kembali nomor rekening agar tidak terjadi salah transfer dari pembeli.",
              verificationCheck: "Opsi pembayaran tampil di formulir order."
            }
          }
        ]
      },
      {
        id: "scalev-verification-stage",
        title: "Stage 5 — Verification (Scalev Ready)",
        description: "Melakukan simulasi order uji coba untuk memastikan seluruh alur transaksi berjalan tanpa kendala.",
        steps: [
          {
            id: "scalev-test-order",
            title: "Uji Coba Order Simulasi (Test Order)",
            estimatedTime: "4-6 menit",
            objective: "Melakukan tes pemesanan langsung dari landing page untuk memastikan order masuk sempurna ke dashboard Scalev.",
            explanation: "Sebelum mengeluarkan biaya iklan di Meta Ads, Anda wajib melakukan uji coba pembelian sendiri untuk memastikan form, kalkulasi ongkir, tombol submit, dan halaman Thank You bekerja 100%.",
            instructions: [
              "Buka link URL publik landing page Anda di jendela baru (atau tab incognito).",
              "Scroll ke formulir pemesanan di bagian bawah.",
              "Isi data uji coba:",
              "- Nama: Test Order ALCO",
              "- Nomor WhatsApp: nomor WA Anda sendiri",
              "- Pilih Provinsi, Kota, dan Kecamatan sembarang",
              "- Pilih salah satu opsi kurir dan metode pembayaran transfer.",
              "Klik tombol 'Pesan Sekarang' (Submit Order).",
              "Pastikan Anda diarahkan ke Halaman Sukses / Thank You Page yang memuat rincian pesanan.",
              "Buka tab dashboard Scalev → Menu 'Pesanan' (Orders), periksa apakah pesanan 'Test Order ALCO' tercatat."
            ],
            checklist: [
              { id: "c1", text: "Berhasil mengisi form pemesanan uji coba di landing page", checked: false, checkedAt: null },
              { id: "c2", text: "Halaman Thank You Page terbuka menampilkan rincian invoice", checked: false, checkedAt: null },
              { id: "c3", text: "Order uji coba muncul di menu Pesanan Scalev dengan status pending", checked: false, checkedAt: null },
              { id: "c4", text: "Hapus atau tandai selesai order uji coba agar tidak mengacaukan pembukuan", checked: false, checkedAt: null }
            ],
            expectedResult: "Alur pembelian dari landing page hingga dashboard pesanan Scalev berjalan mulus tanpa error. Status toko Anda: SCALEV READY!",
            verification: { id: "v1", text: "Seluruh sistem penjualan Scalev siap menerima pesanan nyata", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Tombol 'Pesan Sekarang' berputar terus (loading tiada henti)?",
                solution: "Periksa koneksi internet Anda, dan pastikan tidak ada field wajib yang kosong atau ada script pihak ketiga yang menyebabkan JavaScript crash."
              }
            ],
            externalLink: "https://app.scalev.id/orders",
            externalLinkLabel: "Buka Menu Pesanan Scalev",
            aiContext: {
              overview: "Selamat! Toko Scalev dan landing page Anda telah terbukti berfungsi dan siap menerima calon pembeli nyata.",
              missingMenuTip: "Menu Pesanan memuat seluruh histori pembelian pelanggan.",
              fieldExamples: "Nama pembeli tes: Test Order Admin.",
              errorSolutions: "Jika order tidak masuk, periksa apakah form sudah benar-benar tertaut ke produk aktif.",
              verificationCheck: "Order tercatat di menu Pesanan Scalev."
            }
          }
        ]
      }
    ]
  },
  {
    id: "meta-scalev-integration",
    title: "Meta × Scalev Integration",
    badge: "Pelacakan Sinyal",
    badgeType: "primary",
    icon: "fas fa-arrows-split-up-and-left",
    shortDescription: "Hubungkan Ad Account, pasang Pixel/Dataset, dan konfigurasi Conversion API token ke Scalev untuk tracking akurat.",
    estimatedTotalTime: "20-30 menit",
    stages: [
      {
        id: "integration-connect-stage",
        title: "Stage 1 — Hubungkan Akun Meta",
        description: "Menautkan otorisasi akun Meta ke panel integrasi Scalev.",
        steps: [
          {
            id: "integration-connect-account",
            title: "Koneksikan Akun Meta Ads ke Scalev",
            estimatedTime: "3-5 menit",
            objective: "Memberikan otorisasi akun Meta Ads ke panel integrasi Scalev untuk sinkronisasi aset.",
            explanation: "Menghubungkan akun Meta di panel integrasi Scalev memungkinkan Scalev mengenali akun iklan Anda dan menyederhanakan pengelolaan aset pelacakan.",
            instructions: [
              "Buka dashboard Scalev di app.scalev.id.",
              "Di menu sidebar kiri, klik 'Integrasi' (Integrations).",
              "Cari kartu integrasi 'Meta Ads' (atau 'Facebook Pixel & CAPI') → klik 'Hubungkan' (Connect) atau Kelola.",
              "Klik tombol 'Hubungkan Akun Facebook' (Connect Facebook Account).",
              "Akan muncul jendela popup otorisasi Facebook. Login dan berikan izin akses untuk mengelola aset bisnis Anda.",
              "Pilih Ad Account dan Business Portfolio utama Anda yang sudah disiapkan pada Guide 1."
            ],
            checklist: [
              { id: "c1", text: "Menu Integrasi Meta dibuka di panel Scalev", checked: false, checkedAt: null },
              { id: "c2", text: "Otorisasi popup akun Facebook berhasil diselesaikan", checked: false, checkedAt: null },
              { id: "c3", text: "Akun Meta terhubung dengan tanda centang hijau di Scalev", checked: false, checkedAt: null }
            ],
            expectedResult: "Status integrasi Meta di Scalev menunjukkan keterangan 'Terhubung' (Connected) dengan nama profil Anda.",
            verification: { id: "v1", text: "Akun Meta Ads berhasil terhubung ke Scalev", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Popup Facebook tertutup sendiri atau terblokir browser?",
                solution: "Periksa bilah address bar browser Anda. Izinkan 'Pop-ups and redirects' untuk domain app.scalev.id, lalu coba klik tombol hubungkan kembali."
              }
            ],
            externalLink: "https://app.scalev.id/integrations",
            externalLinkLabel: "Buka Integrasi Scalev",
            aiContext: {
              overview: "Integrasi ini menjadi jembatan antara landing page Scalev dan mesin pelacak Meta.",
              missingMenuTip: "Menu Integrasi berada di bagian bawah navigasi Scalev.",
              fieldExamples: "Pilih Ad Account utama yang currency-nya IDR.",
              errorSolutions: "Pastikan Anda login di browser dengan akun Facebook yang memiliki hak admin.",
              verificationCheck: "Muncul nama akun Facebook Anda di kartu integrasi."
            }
          }
        ]
      },
      {
        id: "integration-pixel-stage",
        title: "Stage 2 — Pasang Pixel / Dataset",
        description: "Menanamkan Dataset ID ke toko dan landing page Scalev.",
        steps: [
          {
            id: "integration-insert-dataset-id",
            title: "Masukkan Dataset / Pixel ID ke Scalev",
            estimatedTime: "3-5 menit",
            objective: "Memasukkan 15-16 digit Dataset ID ke pengaturan integrasi Meta di Scalev.",
            explanation: "Dengan memasukkan Dataset ID, Scalev akan otomatis memasang kode script pelacak di landing page dan thank you page tanpa perlu Anda mengutak-atik kode HTML secara manual.",
            instructions: [
              "Di menu Integrasi Meta Scalev, klik tombol '+ Tambah Pixel' (+ Add Pixel).",
              "Pilih Toko yang ingin dipasangi pixel ini.",
              "Beri label nama (misal: 'Pixel Toko Utama').",
              "Tempelkan 15-16 digit Dataset ID yang Anda buat di Events Manager pada Guide 1 (Langkah 8).",
              "Pilih target penempatan: 'Semua Landing Page' atau pilih spesifik landing page produk Anda.",
              "Pastikan event standar aktif: ViewContent (saat buka LP), InitiateCheckout (saat klik form order), dan Purchase (saat berhasil pesan).",
              "Klik Simpan (Save)."
            ],
            checklist: [
              { id: "c1", text: "Dataset ID 15-16 digit sudah ditempelkan dengan benar tanpa spasi tambahan", checked: false, checkedAt: null },
              { id: "c2", text: "Toko dan landing page target sudah dipilih", checked: false, checkedAt: null },
              { id: "c3", text: "Pengaturan Pixel berhasil disimpan di Scalev", checked: false, checkedAt: null }
            ],
            expectedResult: "Dataset ID terdaftar aktif di daftar Pixel Scalev dan statusnya bertanda hijau.",
            verification: { id: "v1", text: "Dataset ID terpasang rapi pada toko Scalev", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Di mana saya bisa melihat kembali Dataset ID saya?",
                solution: "Buka business.facebook.com/events_manager2, pilih Kumpulan Data (Dataset) Anda, buka tab Pengaturan (Settings), nomor ID tertera di bawah nama Dataset."
              }
            ],
            externalLink: "https://app.scalev.id/integrations",
            externalLinkLabel: "Kelola Pixel di Scalev",
            aiContext: {
              overview: "Pastikan nomor ID hanya berisi angka tanpa tanda petik atau spasi.",
              missingMenuTip: "Tombol tambah pixel ada di dalam detail integrasi Meta Scalev.",
              fieldExamples: "Contoh ID: 123456789012345.",
              errorSolutions: "Jika salah input ID, klik tombol Edit di sebelah kanan daftar pixel.",
              verificationCheck: "Pixel ID terdaftar aktif di Scalev."
            }
          }
        ]
      },
      {
        id: "integration-capi-stage",
        title: "Stage 3 — Konfigurasi Conversion API (CAPI)",
        description: "Mengambil CAPI Access Token dari Meta dan menghubungkannya ke Scalev untuk pelacakan server-to-server.",
        steps: [
          {
            id: "integration-generate-capi-token",
            title: "Generate Conversion API Access Token di Meta",
            estimatedTime: "4-6 menit",
            objective: "Mengambil token API rahasia dari Meta Events Manager untuk komunikasi pelacakan langsung server-ke-server.",
            explanation: "Browser Pixel biasa sering terblokir oleh AdBlocker atau proteksi privasi iOS. Conversion API (CAPI) mengirimkan data pesanan langsung dari server Scalev ke server Meta, menjamin pelacakan pembelian 100% akurat.",
            instructions: [
              "Buka business.facebook.com/events_manager2.",
              "Pilih Dataset Anda dari daftar di sebelah kiri.",
              "Klik tab 'Pengaturan' (Settings) di bagian atas.",
              "Scroll ke bawah hingga menemukan bagian 'Conversions API' (API Konversi).",
              "Di bawah sub-judul 'Siapkan secara manual' (Set up manually), klik tautan biru 'Buat token akses' (Generate access token).",
              "Meta akan menampilkan deretan karakter acak yang panjang (Access Token).",
              "Klik tombol 'Salin' (Copy) untuk menyalin token tersebut ke clipboard Anda."
            ],
            checklist: [
              { id: "c1", text: "Membuka tab Settings pada Dataset di Events Manager", checked: false, checkedAt: null },
              { id: "c2", text: "Menemukan bagian Conversions API dan klik 'Generate access token'", checked: false, checkedAt: null },
              { id: "c3", text: "Token akses yang panjang sudah disalin ke clipboard", checked: false, checkedAt: null }
            ],
            expectedResult: "Access token CAPI berhasil dibuat dan tersalin siap ditempelkan ke Scalev pada langkah berikutnya.",
            verification: { id: "v1", text: "Token CAPI berhasil di-generate dari Events Manager", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Tautan 'Generate access token' tidak bisa diklik atau tidak ada?",
                solution: "Pastikan profil Anda memiliki izin Full Control (Kelola) pada Dataset tersebut di Business Settings → Datasets → People."
              }
            ],
            externalLink: "https://eventsmanager.facebook.com/events_manager2",
            externalLinkLabel: "Buka Events Manager Settings",
            aiContext: {
              overview: "Token ini bersifat rahasia dan berfungsi sebagai kunci otentikasi server Scalev ke Meta.",
              missingMenuTip: "Letaknya ada di tab Settings Dataset, gulir ke bagian tengah halaman.",
              fieldExamples: "Token berawalan EAAB... atau EAAQ... dengan panjang puluhan karakter.",
              errorSolutions: "Jika hilang, Anda bisa generate token baru kapan saja di halaman yang sama.",
              verificationCheck: "Token tersalin utuh di clipboard."
            }
          },
          {
            id: "integration-paste-capi-token",
            title: "Tempelkan Token CAPI ke Scalev",
            estimatedTime: "2-4 menit",
            objective: "Memasukkan Access Token CAPI ke konfigurasi Pixel di Scalev untuk mengaktifkan pelacakan ganda.",
            explanation: "Setelah token CAPI terpasang, setiap kali pembeli menyelesaikan order, server Scalev akan mengirimkan data Purchase langsung ke Meta secara otomatis.",
            instructions: [
              "Kembali ke tab dashboard Scalev di menu 'Integrasi' → Meta Ads.",
              "Klik 'Edit' pada Pixel yang sudah Anda tambahkan sebelumnya.",
              "Aktifkan toggle 'Conversion API' (CAPI) ke posisi ON / Aktif.",
              "Tempelkan (Paste) Access Token yang tadi Anda salin dari Events Manager ke kolom 'Access Token'.",
              "Klik Simpan Pengaturan (Save Changes)."
            ],
            checklist: [
              { id: "c1", text: "Toggle Conversion API di Scalev sudah diaktifkan (ON)", checked: false, checkedAt: null },
              { id: "c2", text: "Access Token CAPI sudah ditempelkan ke kolom yang tersedia", checked: false, checkedAt: null },
              { id: "c3", text: "Pengaturan berhasil disimpan dengan notifikasi sukses", checked: false, checkedAt: null }
            ],
            expectedResult: "Status Pixel di Scalev menampilkan ikon ganda (Browser + CAPI) dengan status Aktif.",
            verification: { id: "v1", text: "CAPI aktif terhubung antara Scalev dan Meta", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Muncul pesan 'Token tidak valid' saat disimpan?",
                solution: "Pastikan seluruh karakter token tersalin lengkap tanpa terpotong dari huruf awal 'EAA...' sampai huruf terakhir."
              }
            ],
            externalLink: "https://app.scalev.id/integrations",
            externalLinkLabel: "Simpan CAPI di Scalev",
            aiContext: {
              overview: "Kombinasi Browser Pixel + Server CAPI adalah standar emas tracking Meta Ads modern.",
              missingMenuTip: "Edit pixel ada di menu Integrasi → Meta Ads di Scalev.",
              fieldExamples: "Paste token utuh tanpa menambahkan spasi.",
              errorSolutions: "Pastikan toggle CAPI sudah berwarna biru/aktif.",
              verificationCheck: "Badge CAPI tertera aktif di samping nama pixel."
            }
          }
        ]
      },
      {
        id: "integration-testing-stage",
        title: "Stage 4 — Event Verification & Testing",
        description: "Menguji transmisi event secara langsung menggunakan fitur Test Events di Meta.",
        steps: [
          {
            id: "integration-test-events",
            title: "Uji Coba Pengiriman Event di Test Events Tool",
            estimatedTime: "5-7 menit",
            objective: "Memvalidasi bahwa sinyal PageView, ViewContent, InitiateCheckout, dan Purchase masuk secara real-time ke Meta.",
            explanation: "Dengan tool Uji Peristiwa (Test Events), Anda dapat melihat secara live apakah event belanja yang dilakukan di Scalev benar-benar diterima oleh sistem Meta.",
            instructions: [
              "Buka business.facebook.com/events_manager2 → pilih Dataset Anda.",
              "Buka tab 'Uji Peristiwa' (Test Events) di bagian atas.",
              "Pilih tab 'Konfirmasikan bahwa peristiwa situs web disiapkan dengan benar' (Confirm website events).",
              "Masukkan URL landing page Scalev Anda ke kolom 'Masukkan URL situs web'.",
              "Klik tombol 'Buka Situs Web' (Open Website).",
              "Di tab landing page yang terbuka: scroll halaman, isi form order simulasi, dan klik tombol Pesan Sekarang.",
              "Kembali ke tab Test Events Meta: perhatikan tabel log event yang masuk.",
              "Pastikan event: PageView, ViewContent, InitiateCheckout, dan Purchase tercatat dengan status 'Diproses' (Processed)."
            ],
            checklist: [
              { id: "c1", text: "Membuka tab Test Events di Meta Events Manager", checked: false, checkedAt: null },
              { id: "c2", text: "Membuka landing page melalui tombol Open Website di Test Events", checked: false, checkedAt: null },
              { id: "c3", text: "Event PageView dan ViewContent berhasil masuk di log", checked: false, checkedAt: null },
              { id: "c4", text: "Event InitiateCheckout dan Purchase berhasil tercatat", checked: false, checkedAt: null }
            ],
            expectedResult: "Tabel Test Events menampilkan event PageView, InitiateCheckout, dan Purchase dengan status hijau 'Diproses' dan sumber 'Browser' serta 'Server'.",
            verification: { id: "v1", text: "Sinyal tracking terverifikasi masuk secara real-time ke Meta", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Event tidak muncul di tab Test Events?",
                solution: "Nonaktifkan ekstensi AdBlocker di browser Anda saat melakukan tes. Jika menggunakan CAPI, ada jeda sekitar 10-30 detik sebelum data server masuk."
              }
            ],
            externalLink: "https://eventsmanager.facebook.com/events_manager2",
            externalLinkLabel: "Buka Test Events Meta",
            aiContext: {
              overview: "Jika event Purchase sudah muncul di sini, Anda sudah 100% siap menjalankan iklan konversi.",
              missingMenuTip: "Tab Test Events berada di samping tab Overview dan History.",
              fieldExamples: "Masukkan URL landing page: https://[toko].scalev.id/produk.",
              errorSolutions: "Pastikan Anda benar-benar menyelesaikan form checkout saat uji coba.",
              verificationCheck: "Muncul tulisan hijau 'Processed' di samping event Purchase."
            }
          }
        ]
      },
      {
        id: "integration-ready-stage",
        title: "Stage 5 — Integration Check",
        description: "Validasi checklist akhir kesiapan integrasi Meta Ads dan Scalev.",
        steps: [
          {
            id: "integration-final-check",
            title: "Checklist Akhir Integrasi Meta × Scalev",
            estimatedTime: "2-3 menit",
            objective: "Memastikan seluruh pipa data dari Scalev ke Meta terhubung tanpa kebocoran sinyal.",
            explanation: "Semua pilar pelacakan kini telah tersambung. Checklist ini adalah gerbang terakhir sebelum Anda mulai membuat kampanye iklan.",
            instructions: [
              "Periksa kembali 4 parameter pelacakan utama:",
              "1. Akun Meta terhubung di panel Integrasi Scalev.",
              "2. Dataset ID di Scalev cocok persis dengan yang ada di Meta Events Manager.",
              "3. Conversion API aktif dengan Access Token yang valid.",
              "4. Test Events membuktikan sinyal Purchase berhasil diterima Meta.",
              "Centang semua item verifikasi di bawah ini jika telah selesai."
            ],
            checklist: [
              { id: "c1", text: "Akun Meta terhubung di Scalev", checked: false, checkedAt: null },
              { id: "c2", text: "Dataset ID cocok dengan Events Manager", checked: false, checkedAt: null },
              { id: "c3", text: "CAPI aktif dan mengirimkan sinyal server", checked: false, checkedAt: null },
              { id: "c4", text: "Event Purchase terverifikasi di tab Test Events", checked: false, checkedAt: null }
            ],
            expectedResult: "Semua checklist terisi lengkap. Status integrasi Anda: META × SCALEV READY!",
            verification: { id: "v1", text: "Integrasi Meta × Scalev selesai 100% dan siap melacak penjualan", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Data Purchase belum muncul di laporan Ads Manager?",
                solution: "Laporan di Ads Manager baru akan mencatat event saat ada campaign iklan nyata yang berjalan dan menghasilkan konversi."
              }
            ],
            externalLink: "https://app.scalev.id/integrations",
            externalLinkLabel: "Periksa Integrasi Scalev",
            aiContext: {
              overview: "Fondasi periklanan dan sistem penjualan Anda kini telah terhubung sempurna!",
              missingMenuTip: "Lanjutkan ke Guide 4 untuk memasang tools optimasi seperti Clarity dan PageSpeed.",
              fieldExamples: "Semua checklist harus tercentang.",
              errorSolutions: "Jika ada yang terlewat, ulangi langkah CAPI.",
              verificationCheck: "Status akhir: META × SCALEV READY."
            }
          }
        ]
      }
    ]
  },
  {
    id: "tracking-tools",
    title: "Tracking & Supporting Tools",
    badge: "Tool Pendukung",
    badgeType: "secondary",
    icon: "fas fa-chart-line",
    shortDescription: "Pasang Microsoft Clarity untuk merekam video sesi pengunjung & heatmaps, serta uji performa kecepatan di PageSpeed Insights.",
    estimatedTotalTime: "15-20 menit",
    stages: [
      {
        id: "clarity-stage",
        title: "Stage 1 — Microsoft Clarity",
        description: "Memasang tool analitik perilaku pengunjung gratis dari Microsoft untuk melihat rekaman layar dan peta klik pembeli.",
        steps: [
          {
            id: "clarity-create-project",
            title: "Buat Project Microsoft Clarity",
            estimatedTime: "3-5 menit",
            objective: "Menyiapkan akun dan project baru di Microsoft Clarity untuk toko landing page Anda.",
            explanation: "Microsoft Clarity adalah tool 100% gratis dari Microsoft yang merekam video saat pengunjung membuka landing page Anda (Session Recording) dan melihat bagian mana yang paling sering mereka klik (Heatmaps). Ini sangat berharga untuk mengetahui mengapa pembeli batal beli.",
            instructions: [
              "Buka clarity.microsoft.com di browser.",
              "Klik tombol 'Sign In' atau 'Sign Up' (bisa menggunakan akun Google, Microsoft, atau Facebook).",
              "Klik tombol '+ Add new project' (Tambah project baru).",
              "Masukkan Nama Project (misal: 'Landing Page Toko Utama').",
              "Masukkan URL Situs Web (Website URL) sesuai alamat landing page Scalev Anda.",
              "Klik 'Add new project'."
            ],
            checklist: [
              { id: "c1", text: "Berhasil login ke portal Microsoft Clarity", checked: false, checkedAt: null },
              { id: "c2", text: "Project baru berhasil dibuat dengan memasukkan URL landing page", checked: false, checkedAt: null }
            ],
            expectedResult: "Project Clarity baru terbuat dan Anda diarahkan ke halaman petunjuk instalasi tracking code.",
            verification: { id: "v1", text: "Project Clarity terdaftar aktif di dashboard Clarity", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Apakah Microsoft Clarity berbayar?",
                solution: "Microsoft Clarity sepenuhnya gratis tanpa batasan kuota kunjungan, selamanya."
              }
            ],
            externalLink: "https://clarity.microsoft.com",
            externalLinkLabel: "Buka Microsoft Clarity",
            aiContext: {
              overview: "Clarity adalah mata Anda untuk melihat langsung perilaku calon pembeli di toko.",
              missingMenuTip: "Kunjungi clarity.microsoft.com di desktop.",
              fieldExamples: "Name: LP Promo Sepatu, URL: https://toko.scalev.id/promo.",
              errorSolutions: "Pastikan URL diawali https://.",
              verificationCheck: "Halaman setup script terbuka."
            }
          },
          {
            id: "clarity-copy-code",
            title: "Salin Tracking Code Script Clarity",
            estimatedTime: "2-3 menit",
            objective: "Mengambil kode pelacak JavaScript unik dari dashboard Clarity.",
            explanation: "Kode script ini bertugas mengirimkan rekaman scroll dan klik pengunjung ke server Clarity secara anonim dan ringan.",
            instructions: [
              "Di halaman project Clarity Anda, buka tab 'Settings' → pilih menu 'Setup' di sebelah kiri.",
              "Di bawah bagian 'Installation methods', pilih opsi 'Install manually' (Pasang manual).",
              "Klik tombol 'Copy to clipboard' pada kotak kode tracking JavaScript.",
              "Atau catat Project ID Clarity Anda (kombinasi 10 karakter unik)."
            ],
            checklist: [
              { id: "c1", text: "Menemukan menu Setup di dalam project Clarity", checked: false, checkedAt: null },
              { id: "c2", text: "Kode JavaScript tracking script sudah disalin ke clipboard", checked: false, checkedAt: null }
            ],
            expectedResult: "Kode tracking `<script type=\"text/javascript\">...` tersalin utuh di clipboard Anda.",
            verification: { id: "v1", text: "Kode script Clarity siap ditempelkan", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Tidak sengaja ter-close?",
                solution: "Buka kembali menu Settings → Setup di dashboard Clarity kapan saja untuk menyalin kode ulang."
              }
            ],
            externalLink: "https://clarity.microsoft.com",
            externalLinkLabel: "Buka Setup Code Clarity",
            aiContext: {
              overview: "Kode script ini aman dan tidak memperlambat loading website secara signifikan.",
              missingMenuTip: "Menu Setup berada di bawah tab Settings project Clarity.",
              fieldExamples: "Kode diawali (function(c,l,a,r,i,t,y)...).",
              errorSolutions: "Salin seluruh blok script tanpa ada baris yang terlewat.",
              verificationCheck: "Script tersalin di clipboard."
            }
          },
          {
            id: "clarity-paste-scalev",
            title: "Pasang Script Clarity di Scalev",
            estimatedTime: "3-5 menit",
            objective: "Menanamkan script Clarity pada bagian Header landing page di Scalev dan mempublikasikannya.",
            explanation: "Dengan menaruh script di Header, Clarity akan langsung aktif merekam sejak detik pertama pengunjung membuka halaman Anda.",
            instructions: [
              "Buka dashboard Scalev → menu 'Landing Page'.",
              "Buka dan edit landing page target Anda.",
              "Buka menu Pengaturan Halaman (ikon gear di pojok editor atau tab Script & Tracking).",
              "Cari kolom 'Header Script' (atau 'Custom Script <head>').",
              "Tempelkan (Paste) kode script Clarity yang tadi Anda salin ke kolom tersebut.",
              "Klik tombol Simpan & Publikasikan (Publish) landing page."
            ],
            checklist: [
              { id: "c1", text: "Script Clarity berhasil ditempelkan di kolom Header Script Scalev", checked: false, checkedAt: null },
              { id: "c2", text: "Landing page sudah di-publish ulang setelah penambahan script", checked: false, checkedAt: null }
            ],
            expectedResult: "Landing page ter-publish ulang dengan kode pelacak Clarity aktif di dalam struktur halamannya.",
            verification: { id: "v1", text: "Script Clarity terpasang dan landing page ter-publish", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Tidak menemukan kolom Header Script?",
                solution: "Di Scalev, buka menu Pengaturan Toko atau di builder Landing Page klik tombol Pengaturan (Page Settings) → Custom Code / Tracking."
              }
            ],
            externalLink: "https://app.scalev.id/landing-pages",
            externalLinkLabel: "Pasang Script di Scalev",
            aiContext: {
              overview: "Ingat untuk selalu klik tombol Publish ulang setiap kali menambahkan script baru.",
              missingMenuTip: "Pengaturan kode ada di dalam editor halaman Scalev.",
              fieldExamples: "Paste di kolom Header Script.",
              errorSolutions: "Pastikan script berada di dalam tag <script>...</script>.",
              verificationCheck: "Landing page berstatus Published."
            }
          },
          {
            id: "clarity-verification-check",
            title: "Verifikasi Pemasangan Clarity (Clarity Ready)",
            estimatedTime: "3-5 menit",
            objective: "Memastikan sinyal rekaman mulai masuk ke dashboard Microsoft Clarity.",
            explanation: "Verifikasi ini memastikan script bekerja dengan benar sebelum campaign iklan Anda mulai mendatangkan ratusan pengunjung.",
            instructions: [
              "Buka URL landing page Anda di browser di HP atau tab baru, lakukan scroll ke atas dan ke bawah, serta klik beberapa tombol.",
              "Kembali ke dashboard Microsoft Clarity.",
              "Buka tab Dashboard atau Recordings.",
              "Status project biasanya akan berubah dari 'Waiting for data' menjadi 'Active' (membutuhkan waktu 5-15 menit untuk video sesi pertama diproses).",
              "Periksa apakah ada rekaman sesi baru yang muncul."
            ],
            checklist: [
              { id: "c1", text: "Membuka landing page dan melakukan interaksi klik/scroll", checked: false, checkedAt: null },
              { id: "c2", text: "Status project di Clarity berubah menjadi aktif merekam", checked: false, checkedAt: null }
            ],
            expectedResult: "Dashboard Clarity aktif dan rekaman sesi pengunjung pertama mulai tercatat. Status: CLARITY READY!",
            verification: { id: "v1", text: "Microsoft Clarity aktif merekam aktivitas pengunjung landing page", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Belum ada rekaman yang muncul setelah 5 menit?",
                solution: "Clarity memerlukan sedikit waktu kompresi video sesi. Tunggu 10-15 menit dan pastikan Anda sudah mengklik beberapa elemen saat membuka landing page."
              }
            ],
            externalLink: "https://clarity.microsoft.com",
            externalLinkLabel: "Cek Rekaman Clarity",
            aiContext: {
              overview: "Selamat! Sekarang Anda bisa menonton video rekaman setiap pengunjung toko Anda.",
              missingMenuTip: "Tab Recordings memuat daftar video pengunjung.",
              fieldExamples: "Filter rekaman berdasarkan perangkat HP atau Laptop.",
              errorSolutions: "Buka halaman dari HP Anda sendiri untuk memancing sesi baru masuk.",
              verificationCheck: "Status project Clarity aktif."
            }
          }
        ]
      },
      {
        id: "pagespeed-stage",
        title: "Stage 2 — PageSpeed Insights",
        description: "Menguji kecepatan loading landing page dan melakukan optimasi kompresi gambar.",
        steps: [
          {
            id: "pagespeed-test-check",
            title: "Uji Kecepatan Landing Page di Google PageSpeed",
            estimatedTime: "3-5 menit",
            objective: "Memeriksa skor performa kecepatan landing page di Google PageSpeed Insights.",
            explanation: "Lebih dari 80% calon pembeli membuka iklan Meta Ads lewat smartphone. Jika landing page loading lebih dari 3 detik, lebih dari 50% calon pembeli akan langsung menutup halaman sebelum sempat melihat produk Anda.",
            instructions: [
              "Buka website pagespeed.web.dev di browser Anda.",
              "Ketik atau tempelkan URL landing page Scalev Anda pada kolom input.",
              "Klik tombol 'Analyze' (Analisis).",
              "Tunggu sekitar 20-40 detik hingga Google selesai menganalisis halaman.",
              "Periksa skor performa untuk tab 'Mobile' (Ponsel) dan 'Desktop'.",
              "Perhatikan metrik LCP (Largest Contentful Paint) dan saran perbaikan di bawahnya."
            ],
            checklist: [
              { id: "c1", text: "Membuka Google PageSpeed Insights di pagespeed.web.dev", checked: false, checkedAt: null },
              { id: "c2", text: "Menjalankan analisis untuk URL landing page Scalev", checked: false, checkedAt: null },
              { id: "c3", text: "Mencatat skor performa Mobile dan melihat saran optimasi gambar", checked: false, checkedAt: null }
            ],
            expectedResult: "Google menampilkan kartu laporan performa lengkap dengan skor warna hijau (90-100), oranye (50-89), atau merah (<50).",
            verification: { id: "v1", text: "Laporan skor kecepatan loading landing page berhasil diperiksa", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Skor Mobile berwarna oranye atau merah?",
                solution: "Penyebab paling umum adalah ukuran foto produk yang terlalu besar (di atas 1-2 MB). Ikuti langkah berikutnya untuk mengompres gambar."
              }
            ],
            externalLink: "https://pagespeed.web.dev",
            externalLinkLabel: "Buka Google PageSpeed Insights",
            aiContext: {
              overview: "Targetkan skor Mobile di atas 70 dan waktu loading LCP di bawah 3 detik.",
              missingMenuTip: "Gunakan tools resmi Google di pagespeed.web.dev.",
              fieldExamples: "Input URL: https://namatoko.scalev.id/promo-produk.",
              errorSolutions: "Pastikan URL publik dapat dibuka tanpa login password.",
              verificationCheck: "Laporan Core Web Vitals ditampilkan."
            }
          },
          {
            id: "pagespeed-optimize-images",
            title: "Optimasi Gambar & Aset Landing Page",
            estimatedTime: "5-7 menit",
            objective: "Mengompresi foto dan aset visual agar landing page terbuka sangat cepat di koneksi internet HP.",
            explanation: "Mengompres foto dari ukuran 2 MB menjadi di bawah 200 KB dapat melipatgandakan kecepatan buka landing page Anda tanpa mengurangi ketajaman visual di layar HP.",
            instructions: [
              "Kunjungi website kompresi gambar online gratis seperti tinypng.com atau iloveimg.com.",
              "Upload foto-foto produk dan banner yang digunakan di landing page Anda.",
              "Download hasil kompresi yang ukurannya sudah menyusut 60-80%.",
              "Kembali ke builder Landing Page Scalev, ganti gambar lama dengan gambar hasil kompresi yang baru.",
              "Publikasikan (Publish) ulang landing page Anda.",
              "Jalankan kembali tes di Google PageSpeed Insights untuk melihat lonjakan skor kecepatan."
            ],
            checklist: [
              { id: "c1", text: "Foto produk utama dikompres hingga ukurannya ramah mobile (< 250 KB)", checked: false, checkedAt: null },
              { id: "c2", text: "Gambar yang sudah dioptimasi diupload ulang ke landing page Scalev", checked: false, checkedAt: null },
              { id: "c3", text: "Landing page di-publish ulang dan terasa lebih ringan saat dibuka di HP", checked: false, checkedAt: null }
            ],
            expectedResult: "Landing page loading jauh lebih kencang di smartphone dan skor performa meningkat signifikan. Status: PAGESPEED OPTIMIZED!",
            verification: { id: "v1", text: "Aset landing page teroptimasi dan siap menyambut pengunjung iklan", checked: false, checkedAt: null },
            troubleshooting: [
              {
                problem: "Gambar terlihat pecah setelah dikompres?",
                solution: "Pastikan resolusi lebar gambar dipertahankan di kisaran 1080px atau 800px dengan kompresi kualitas 80% (format WebP atau JPEG optimal)."
              }
            ],
            externalLink: "https://tinypng.com",
            externalLinkLabel: "Buka Tool Kompresi TinyPNG",
            aiContext: {
              overview: "Landing page yang cepat sama dengan tingkat penjualan yang lebih tinggi dan biaya iklan yang lebih efisien.",
              missingMenuTip: "Gunakan tinypng.com atau tool kompresor favorit Anda.",
              fieldExamples: "Target ukuran file per foto: 100 KB - 250 KB.",
              errorSolutions: "Simpan dalam format WebP untuk kompresi terbaik.",
              verificationCheck: "Status akhir: TRACKING & TOOLS READY."
            }
          }
        ]
      }
    ]
  }
];
