# 🏛️ Galeri Kemenhaj Boven Digoel — `galeri.kemenhajbovendigoel.id`

Portal galeri visual dan dokumentasi resmi kegiatan **Kantor Kementerian Haji dan Umrah Kabupaten Boven Digoel** (Papua Selatan).

---

## 🏛️ Arsitektur Sistem

Aplikasi ini adalah portal publik **Read-Only** (tanpa form upload / tanpa autentikasi admin) yang terhubung langsung ke basis data utama **Media Vault**:

- **Database Katalog:** Supabase (Read-Only via Publishable Key `sb_publishable_...` dengan filter `organization_id = 'kemenhaj'`).
- **Penyimpanan Foto Fisik:** Google Blogger Core CDN (`lh3.googleusercontent.com`).
- **Pengelolaan & Upload:** Dikelola dari dashboard pusat **Media Vault** (`boven-image.vercel.app`).
- **Domain Publik:** `https://galeri.kemenhajbovendigoel.id`

---

## 🚀 Fitur Unggulan

1. **Ecosystem Navigation:** Terhubung ke ekosistem situs `kemenhajbovendigoel.id`, `tracking`, `manasik`, `skm`, dan `berita`.
2. **Koleksi Album Kegiatan (Grid 16:9):** Tampilan album program dinamis (*Perekaman Paspor Haji 2027*, *Pelantikan IPHI*, *Bimbingan Manasik*, dll) dengan banner sampul custom.
3. **Pencarian Live:** Cari foto berdasarkan nama kegiatan, acara, atau tahun.
4. **Bandwidth-Efficient:** Menampilkan thumbnail kartu teroptimasi (`w480-h360`) dan resolusi tinggi saat foto dibuka.
5. **Lightbox Interaktif:** Pratinjau detail, tombol unduh resolusi asli `s0`, dan tombol bagikan langsung ke WhatsApp.
6. **Paginasi Halus:** Memuat 24 foto per halaman dengan tombol *Muat Lebih Banyak*.

---

## ⚙️ Menjalankan Lokal

```bash
# 1. Masuk direktori
cd D:\01.APPS\galeri.kemenhajbovendigoel.id

# 2. Install dependensi
npm install

# 3. Jalankan server lokal
npm run dev
```

Buka `http://localhost:3000` di browser Anda.

---

## ☁️ Deployment Vercel (`galeri.kemenhajbovendigoel.id`)

1. Hubungkan repositori ke Vercel.
2. Tambahkan Environment Variable di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://ruxmomhgycsbhxjpkenv.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: `sb_publishable_jARIHPCX8F2iqjyR-uLfcg_Neqf8_kI`
   - `NEXT_PUBLIC_ORG_ID`: `kemenhaj`
3. Di tab **Settings ➔ Domains**, hubungkan domain `galeri.kemenhajbovendigoel.id` (arahkan CNAME `galeri` ke `cname.vercel-dns.com` pada DNS manager domain `kemenhajbovendigoel.id`).
