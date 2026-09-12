# 📐 Arsitektur Teknis `galeri.kemenhajbovendigoel.id`

Dokumen ini menjelaskan integrasi arsitektur antara **Galeri Kemenhaj Boven Digoel** dengan **Media Vault Core Engine**.

---

## 🔗 Hubungan Antar Proyek

```
┌────────────────────────────────────────────────────────┐
│        DASHBOARD UTAMA (Media Vault / Boven Image)      │
│  - Upload Foto via Google Blogger Resumable API       │
│  - Input Organisasi, Program, Tanggal, Lokasi          │
│  - Set Sampul Album Kegiatan (cover_media_id)          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│               DATABASE & STORAGE PUSAT                 │
│  - Supabase Database: Tabel `public.media`             │
│  - Google CDN: Storage Foto Asli (s0)                  │
│  - GitHub Manifest: Disaster Recovery JSON/SQL Backup  │
└──────────────────────────┬─────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │ (Read-Only Query: kemenhaj)     │
          ▼                                 ▼
┌───────────────────────────┐    ┌──────────────────────────┐
│   Media Vault Gallery     │    │  galeri.kemenhaj...      │
│   (Seluruh Organisasi)    │    │  (Khusus Kemenhaj)       │
└───────────────────────────┘    └──────────────────────────┘
```

---

## 🔒 Keamanan & Read-Only Policy

1. **Tanpa Kunci Rahasia:** Aplikasi `galeri-kemenhaj` hanya membutuhkan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Kunci rahasia (*secret key*) tidak pernah disertakan.
2. **Filter Terisolasi:** Query hanya membaca baris data dengan `organization_id = 'kemenhaj'`.
3. **Bebas Kuota Bandwidth:** Semua file gambar disajikan langsung oleh CDN Google (`lh3.googleusercontent.com`), sehingga tidak membebani kuota server Vercel.
