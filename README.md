# EtiketFarmasi

Dokumentasi aplikasi frontend untuk pengelolaan data farmasi dan pencetakan etiket obat.

> [!WARNING]
> Aplikasi ini adalah prototype frontend. Data akun, data farmasi, pengaturan label, logo, dan session disimpan di `localStorage` browser. Jangan gunakan aplikasi ini sebagai sistem produksi tanpa backend, database, autentikasi server-side, HTTPS, audit log, backup, dan kontrol akses yang sesuai.

## Ringkasan

EtiketFarmasi berjalan sebagai aplikasi HTML, CSS, dan JavaScript statis tanpa proses build. Aplikasi menyediakan:

- Login, pendaftaran akun yang langsung masuk aplikasi, logout, dan reset password mandiri.
- Halaman tutorial awal sekali per akun sebelum masuk ke aplikasi utama.
- Dashboard ringkas untuk data pasien, obat, poli, status instansi, dan mode print.
- Pengelolaan data pasien, obat, serta poli atau ruangan.
- Import dan export Excel untuk data master.
- Pengaturan identitas instansi, data apoteker, SIPA, dan logo.
- Preview label sebelum dicetak.
- Mode cetak landscape, portrait, dan template label farmasi.
- Antrian print untuk mencetak beberapa label sekaligus.
- Pengaturan ukuran label dan tipografi label.

## Struktur Folder

```text
FARMASI/
|-- index.html          # Halaman login, daftar akun, dan reset password
|-- app.html            # Validasi session dan tutorial awal sebelum masuk aplikasi
|-- user.html           # Halaman utama aplikasi etiket
|-- server.js           # Helper server lokal Node.js
|-- index.zip           # Arsip distribusi, bukan bagian runtime utama
|-- README.md           # Dokumentasi proyek
|-- css/
|   |-- auth.css        # Styling halaman autentikasi
|   `-- user.css        # Styling dashboard, form, preview, antrian, dan print label
`-- js/
    |-- storage.js      # Helper akun dan session berbasis localStorage
    |-- auth.js         # Login, registrasi, reset password, dan proteksi session
    `-- user.js         # Logika aplikasi etiket, data master, preview, dan cetak
```

Tidak ada halaman `admin.html`. Semua pengguna memakai halaman `user.html`.

## Tanggung Jawab File

| File | Tanggung Jawab |
|---|---|
| `index.html` | Markup halaman autentikasi, tab login/daftar/reset, dan shortcut Enter. |
| `app.html` | Validasi session, tutorial onboarding, status loading, dan redirect ke aplikasi utama. |
| `user.html` | Markup dashboard, form cetak, data master, pengaturan instansi, preview, antrian, dan template label. |
| `server.js` | Server HTTP lokal sederhana untuk membuka file statis dari folder proyek. |
| `css/auth.css` | Tampilan login, daftar akun, reset password, dan style kompatibilitas lama. |
| `css/user.css` | Tampilan aplikasi utama, ukuran label, tipografi, antrian, dan aturan print. |
| `js/storage.js` | Penyimpanan akun, session, dan hash password. |
| `js/auth.js` | Interaksi autentikasi, registrasi, reset password, dan redirect session. |
| `js/user.js` | Data farmasi, pengaturan instansi, preview, validasi, import/export, tipografi, antrian, dan print. |

## Menjalankan Aplikasi

Aplikasi dapat dibuka sebagai situs statis. Cara yang disarankan adalah memakai helper server lokal:

```powershell
node server.js
```

Lalu buka:

```text
http://localhost:8000/index.html
```

Server berjalan di host `127.0.0.1` dan memakai port `8000` secara default. Port dapat diganti dengan environment variable `PORT`:

```powershell
$env:PORT=8080
node server.js
```

Koneksi internet diperlukan untuk memuat Google Fonts, Font Awesome, JsBarcode, dan SheetJS dari CDN.

## Alur Halaman

```text
index.html
  -> login atau daftar berhasil
  -> app.html
  -> validasi isset/session
  -> tutorial awal jika akun belum pernah melihat tutorial
  -> user.html
```

Peran setiap halaman:

| Halaman | Fungsi |
|---|---|
| `index.html` | Login, daftar akun, reset password, shortcut Enter, dan redirect bila session sudah ada. |
| `app.html` | Memeriksa `isset/session`, menampilkan tutorial awal sekali per akun, lalu membuka `user.html`. |
| `user.html` | Menjalankan aplikasi utama. Jika session tidak tersedia, pengguna diarahkan kembali ke `index.html`. |

## Tutorial Awal

`app.html` menyimpan status tutorial per akun dengan key:

```text
tutorial_seen_{username}
```

Jika key belum ada, pengguna melihat beberapa slide tutorial dan dapat menekan **Lanjut** atau **Lewati**. Setelah selesai atau dilewati, key disimpan di `localStorage` dan pengguna diarahkan ke `user.html`.

Jika key sudah ada, `app.html` langsung mengarahkan pengguna ke `user.html` setelah loading singkat.

## Autentikasi

Autentikasi diimplementasikan sepenuhnya di browser melalui `js/storage.js` dan `js/auth.js`.

### Daftar Akun

1. Buka tab **Daftar** di `index.html`.
2. Isi username, nama lengkap, password, dan konfirmasi password.
3. Username minimal 3 karakter.
4. Password minimal 6 karakter.
5. Akun baru langsung aktif dengan role `user`.
6. Setelah daftar berhasil, aplikasi otomatis membuat session dan membuka `app.html`, lalu lanjut ke `user.html` tanpa login ulang.

Tidak ada akun admin default dan tidak ada proses persetujuan admin.

### Login

- Password disimpan sebagai hash SHA-256 frontend dengan suffix tetap `:etf-auth-v2`.
- Login berhasil membuat session di `isset/session`, lalu membuka `app.html`.
- Percobaan login gagal hanya menampilkan pesan error. Aplikasi tidak mengunci akun sementara.

### Reset Password

Menu **Lupa password?** mengizinkan pengguna membuat password baru setelah memasukkan username terdaftar. Reset tidak memerlukan persetujuan admin.

## Halaman Utama

Sidebar `user.html` menyediakan menu:

| Menu | Fungsi |
|---|---|
| Dashboard | Menampilkan statistik data, status aplikasi, status instansi, logo, dan shortcut. |
| Cetak Etiket | Mengisi data resep, pasien, obat, aturan pakai, dan tipe label. |
| Data Pasien | Kelola No. RM dan nama pasien. |
| Data Obat | Kelola nama obat. |
| Data Poli | Kelola nama poli atau ruangan. |
| Label Instansi | Simpan nama instalasi, rumah sakit, alamat, apoteker, SIPA, dan logo. |
| Pengaturan Print | Pilih mode, ukuran, tipografi, preview, antrian, dan cetak label. |

Shortcut `Ctrl+P` membuka alur persiapan cetak. Tombol **Logout** menghapus session aktif setelah konfirmasi.

## Data Master

Data pasien, obat, dan poli memiliki fitur:

- Tambah, edit, dan hapus data.
- Hapus beberapa data terpilih.
- Pencarian.
- Pagination 10 data per halaman.
- Import `.xlsx`, `.xls`, atau `.csv`.
- Export `.xlsx`.
- Datalist pada form cetak untuk memilih obat dan poli dari data master.

No. RM pada data pasien harus berupa angka. Ketika No. RM dipilih pada form cetak, nama pasien dapat terisi otomatis dari data master.

### Format Kolom Import

| Jenis Data | Kolom yang Disarankan |
|---|---|
| Pasien | `No. RM`, `Nama Pasien` |
| Obat | `Nama Obat` |
| Poli atau ruangan | `Ruangan` |

Parser juga mengenali beberapa variasi nama kolom umum, misalnya `RM`, `Nama`, `Obat`, dan `Poli`.

## Label Instansi

Menu **Label Instansi** menyimpan:

- Nama instalasi atau unit, wajib diisi.
- Nama rumah sakit, wajib diisi.
- Alamat rumah sakit, opsional.
- Nama apoteker, opsional.
- No. SIPA, opsional.
- Logo PNG, JPG, SVG, atau format gambar browser lain dengan ukuran maksimal 500 KB.

Logo disimpan sebagai data URL di `localStorage`.

## Mode Cetak

Pada menu **Pengaturan Print**, tersedia tiga mode utama:

| Mode | Ukuran Awal | Keterangan |
|---|---:|---|
| Landscape | `75 x 50 mm` | Label obat horizontal dengan data resep, pasien, obat, qty, ED/BUD, dan aturan pakai. |
| Portrait | `72 x 120 mm` | Label thermal vertikal dengan data lebih lengkap dan barcode Code 128 dari No. RM. |
| Label farmasi | Sesuai tipe label aktif | Mode template farmasi khusus yang dipilih dari dropdown pada form cetak. |

Preset ukuran tersedia untuk landscape dan portrait. Ukuran label juga dapat disesuaikan manual dari input lebar dan tinggi.

### Tipe Label Farmasi

Dropdown **Label** pada form cetak menyediakan enam pilihan:

| Tipe Label | Ukuran Default | Data Khusus |
|---|---:|---|
| Normal | Mengikuti mode cetak aktif | Form resep standar untuk landscape atau portrait. |
| Label Etiket OBAT | `75 x 50 mm` | Jadwal minum pagi, siang, sore, malam, dan dini hari; interval; hubungan makan. |
| Label HIGH ALERT | `50 x 75 mm` | Jadwal pagi, siang, sore, dan malam; instruksi HIGH ALERT. |
| Label Etiket | `75 x 50 mm` | Tanggal minum, rentang jam minum, nama waktu, dan penanda sebelum atau setelah makan. |
| Label Obat Luar | `75 x 50 mm` | Cara pakai manual dan footer `OBAT LUAR`. |
| Label Instruksi | `75 x 50 mm` | Tanggal minum, instruksi utama, dan batas harian. |

### Validasi Label

- Label instansi wajib disimpan sebelum mencetak mode landscape dan portrait.
- HIGH ALERT wajib memiliki No. RM dan nama pasien.
- Label Etiket OBAT, Label Etiket, Label Obat Luar, dan Label Instruksi wajib memiliki No. RM, nama pasien, dan nama obat.
- Label Obat Luar juga mewajibkan **Cara Pakai**.
- Label Instruksi juga mewajibkan **Tanggal Minum**, **Instruksi Utama**, dan **Batas Harian**.
- Label Obat Luar dan Label Instruksi mengecilkan teks secara bertahap sampai minimum `6pt`. Jika isi tetap tidak muat pada ukuran `75 x 50 mm`, proses tambah antrian atau print ditolak agar teks tidak terpotong.

## Pengaturan Tipografi Label

Panel tipografi di menu **Pengaturan Print** mengatur tampilan teks label:

- Skala font bagian atas, tengah, dan bawah dari `70%` sampai `150%`.
- Pilihan jenis huruf.
- Opsi bold, italic, dan underline.
- Tombol reset ke pengaturan default.

Pengaturan disimpan di `localStorage` dengan key `farmasi_etiket_typography_settings_v1` dan diterapkan ke preview serta label yang dicetak.

## Antrian Print

Selain mencetak label aktif langsung, pengguna dapat menambahkan preview label ke antrian:

- Tombol **Tambah ke Antrian** menyimpan salinan label aktif ke daftar antrian.
- Daftar antrian menampilkan 5 label per halaman.
- Setiap item dapat dihapus dari antrian.
- Tombol **Kosongkan** menghapus seluruh antrian setelah konfirmasi.
- Tombol **Print Semua** mencetak seluruh antrian.
- Antrian dapat berisi beberapa ukuran label berbeda dalam satu proses print.

Antrian print hanya berada di memori halaman saat aplikasi terbuka. Jika halaman dimuat ulang, antrian dibuat ulang dari kosong.

## Penyimpanan Browser

Seluruh data disimpan per browser dan per profile browser.

| Key localStorage | Isi |
|---|---|
| `isset/users` | Daftar akun frontend. |
| `isset/session` | Session pengguna aktif. |
| `tutorial_seen_{username}` | Status tutorial awal per akun. |
| `farmasi_etiket_pasien_data_v2` | Data pasien dan No. RM. |
| `farmasi_etiket_obat_data_v2` | Data obat. |
| `farmasi_etiket_poli_data_v2` | Data poli atau ruangan. |
| `farmasi_etiket_instansi_settings_v2` | Data instansi dan logo. |
| `farmasi_etiket_user_v2` | Profil tampilan pengguna pada aplikasi etiket. |
| `farmasi_etiket_accounts_v1` | Data kompatibilitas profil lama yang masih dibaca oleh halaman etiket. |
| `farmasi_etiket_typography_settings_v1` | Pengaturan tipografi label. |

Menghapus data situs browser akan menghapus akun, session, data master, logo, pengaturan tipografi, dan pengaturan lokal.

## Dependensi CDN

| Dependensi | Dipakai Untuk |
|---|---|
| Google Fonts | Font antarmuka halaman login dan aplikasi. |
| Font Awesome `6.5.0` | Ikon antarmuka. |
| JsBarcode `3.11.6` | Barcode Code 128 pada label portrait. |
| SheetJS `0.18.5` | Import dan export Excel. |

## Catatan Pemeliharaan

- Markup utama berada di `user.html`.
- Styling aplikasi etiket berada di `css/user.css`.
- Binding preview, validasi, localStorage data farmasi, import/export, tipografi, antrian, dan proses print berada di `js/user.js`.
- Perubahan template label biasanya perlu diperbarui bersama pada `user.html`, `css/user.css`, dan `js/user.js`.
- `app.html` menyimpan status tutorial dengan key `tutorial_seen_{username}`. Menghapus akun lewat tabel akun juga menghapus key tutorial akun tersebut.
- `auth.js` masih menyimpan beberapa stub kompatibilitas UI lama, tetapi alur aktif tidak menyediakan panel admin.
- `auth.css` masih memuat beberapa style historis untuk UI dashboard lama. Halaman aktif `app.html` tidak menghubungkan stylesheet tersebut.
- `server.js` hanya server statis lokal, bukan backend aplikasi.

## Batasan Keamanan

Prototype ini tidak cocok untuk produksi karena:

- Password diproses dan disimpan oleh frontend.
- Reset password cukup menggunakan username.
- Data tersimpan di `localStorage` tanpa enkripsi.
- Tidak ada backend, database, audit trail server, HTTPS enforcement, backup, atau session server-side.
- Tidak ada pemisahan hak akses pengguna pada server.
- Dependensi utama dimuat dari CDN eksternal.

Untuk penggunaan produksi, tambahkan backend, database, hashing password server-side seperti Argon2 atau bcrypt, session aman, role-based access control, validasi server-side, audit log, backup, dan HTTPS.
