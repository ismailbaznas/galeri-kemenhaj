"use client";

import { useEffect, useState, useMemo } from "react";
import { bloggerVariant, bloggerSrcSet } from "@/lib/image";

type Media = {
  id: string;
  filename: string;
  title: string;
  blogger_url: string;
  blogger_url_s1600?: string;
  metadata?: {
    program?: string;
    tanggal?: string;
    lokasi?: string;
    organisasi?: string;
  };
  created_at: string;
};

type Program = {
  id: string;
  name: string;
  slug: string;
  count: number;
  cover?: string | null;
  date?: string | null;
};

function formatDisplayDate(manualDate?: string | null, fallbackCreatedAt?: string, full = false): string {
  if (manualDate) {
    const parts = String(manualDate).split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: full ? "long" : "short",
          year: "numeric",
        });
      }
    }
    const d = new Date(manualDate);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: full ? "long" : "short",
        year: "numeric",
      });
    }
  }

  if (fallbackCreatedAt) {
    const d = new Date(fallbackCreatedAt);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: full ? "long" : "short",
        year: "numeric",
      });
    }
  }

  return "—";
}

export default function KemenhajGalleryPage() {
  const [items, setItems] = useState<Media[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeProg, setActiveProg] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalMedia, setTotalMedia] = useState<number>(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  async function fetchGallery(progId = "", search = "", pageNum = 1, append = false) {
    if (pageNum === 1 && !append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: "24",
      });
      if (progId) params.set("prog", progId);
      if (search) params.set("q", search);

      const res = await fetch(`/api/gallery?${params.toString()}`);
      const json = await res.json();

      if (json.programs) {
        setPrograms(json.programs);
      }
      if (json.total_media !== undefined) {
        setTotalMedia(json.total_media);
      }

      if (append) {
        setItems((prev) => [...prev, ...(json.data || [])]);
      } else {
        setItems(json.data || []);
      }

      setPage(pageNum);
      setHasMore(json.pagination?.has_more || false);
    } catch (err) {
      console.error("Gagal memuat galeri:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchGallery(activeProg, searchQuery, 1, false);
  }, [activeProg]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchGallery(activeProg, searchQuery, 1, false);
  }

  function handleSelectProgram(progId: string) {
    setActiveProg(progId);
    setSearchQuery("");
    window.scrollTo({ top: 380, behavior: "smooth" });
  }

  function handleBackToAllAlbums() {
    setActiveProg("");
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLoadMore() {
    if (loadingMore || !hasMore) return;
    fetchGallery(activeProg, searchQuery, page + 1, true);
  }

  function handleShareWhatsApp(photo: Media) {
    const title = photo.title || photo.filename;
    const prog = photo.metadata?.program || "Dokumentasi";
    const date = formatDisplayDate(photo.metadata?.tanggal, photo.created_at, true);
    const text = `*Dokumentasi Kemenhaj Boven Digoel*\n*${title}*\nProgram: ${prog}\nTanggal: ${date}\nLihat foto: ${photo.blogger_url}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  const activeProgramObj = useMemo(() => {
    if (!activeProg) return null;
    return programs.find((p) => p.id === activeProg) || null;
  }, [activeProg, programs]);

  return (
    <div className="page-shell">
      {/* 1. Official Government Topbar */}
      <div className="gov-topbar">
        <div className="gov-topbar-inner">
          <div className="gov-topbar-left">
            <span>🏛️</span>
            <strong>Kantor Kementerian Haji dan Umrah</strong>
            <span>— Kabupaten Boven Digoel, Papua Selatan</span>
          </div>
          <nav className="gov-topbar-links">
            <a href="https://kemenhajbovendigoel.id" target="_blank" rel="noreferrer">Beranda Utama</a>
            <a href="https://kemenhajbovendigoel.id/tracking" target="_blank" rel="noreferrer">Tracking Berkas</a>
            <a href="https://kemenhajbovendigoel.id/manasik" target="_blank" rel="noreferrer">Jadwal Manasik</a>
            <a href="https://kemenhajbovendigoel.id/berita" target="_blank" rel="noreferrer">Berita</a>
            <a href="https://kemenhajbovendigoel.id/skm" target="_blank" rel="noreferrer">Survei SKM</a>
          </nav>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="header-main">
        <div className="header-inner">
          <div className="brand-group" onClick={handleBackToAllAlbums} style={{ cursor: "pointer" }}>
            <img src="/logo.png" alt="Logo Kemenhaj Boven Digoel" className="brand-logo" />
            <div className="brand-text">
              <h1>GALERI KEMENHAJ BOVEN DIGOEL</h1>
              <span>Dokumentasi Pelayanan Haji & Umrah Boven Digoel</span>
            </div>
          </div>
          <div className="header-nav">
            {/* Quick Program Jump Dropdown */}
            <select
              className="program-select-dropdown"
              value={activeProg}
              onChange={(e) => handleSelectProgram(e.target.value)}
              aria-label="Pilih Album Program"
            >
              <option value="">📁 Semua Album Kegiatan ({programs.length})</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.count} foto)
                </option>
              ))}
            </select>

            <a href="https://kemenhajbovendigoel.id/tracking" target="_blank" rel="noreferrer" className="header-btn">
              <span>📋</span> Cek Porsi / Tracking
            </a>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">ARSIP DOKUMENTASI RESMI</div>
          <h2 className="hero-title">Galeri Visual & Dokumentasi Kegiatan</h2>
          <p className="hero-desc">
            Koleksi foto resmi pelayanan pendaftaran porsi haji, perekaman paspor, bimbingan manasik, pelantikan IPHI, dan kegiatan Kantor Kementerian Haji dan Umrah Kabupaten Boven Digoel.
          </p>
          <form className="hero-search-box" onSubmit={handleSearchSubmit}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Cari dokumentasi kegiatan, paspor, manasik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setSearchQuery("");
                  fetchGallery(activeProg, "", 1, false);
                }}
              >
                ×
              </button>
            )}
          </form>
        </div>
      </section>

      {/* 4. Main Gallery Section */}
      <main className="main-wrap">
        {/* TIER 1: BERANDA KOLEKSI ALBUM PROGRAM (Jika activeProg belum dipilih) */}
        {!activeProg && !searchQuery && (
          <section className="album-folders-section">
            <div className="section-title-wrap">
              <div>
                <h3 className="section-title">📁 Koleksi Album Kegiatan</h3>
                <span className="section-subtitle">
                  Pilih album kegiatan resmi di bawah untuk membuka dokumentasi lengkap
                </span>
              </div>
              <span className="album-count-badge">{programs.length} Album Terdaftar</span>
            </div>

            <div className="album-folder-grid">
              {programs.map((prog) => (
                <article
                  key={prog.id}
                  className="album-folder-card"
                  onClick={() => handleSelectProgram(prog.id)}
                >
                  <div className="album-cover-wrap">
                    {prog.cover ? (
                      <img
                        src={bloggerVariant(prog.cover, "card")}
                        alt={prog.name}
                        loading="lazy"
                        className="album-cover-img"
                      />
                    ) : (
                      <div className="album-cover-placeholder">
                        <span>📁</span>
                      </div>
                    )}
                    <div className="album-badge-overlay">
                      <span className="album-badge-photos">📷 {prog.count} Foto</span>
                      {prog.date && (
                        <span className="album-badge-date">
                          📅 {formatDisplayDate(prog.date)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="album-card-body">
                    <h4 className="album-card-title">{prog.name}</h4>
                    <div className="album-card-meta">
                      <span>Buka Album Foto</span>
                      <span className="album-arrow">➔</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* TIER 2: HEADER BANNER SAAT MEMBUKA SALAH SATU ALBUM */}
        {activeProg && activeProgramObj && (
          <div className="active-album-banner">
            <div className="active-album-top">
              <button
                type="button"
                className="back-to-albums-btn"
                onClick={handleBackToAllAlbums}
              >
                ← Kembali ke Semua Album
              </button>
              <span className="album-badge-photos">
                📁 {activeProgramObj.count} Foto Tersedia
              </span>
            </div>
            <h2 className="active-album-title">{activeProgramObj.name}</h2>
            <div className="active-album-info">
              {activeProgramObj.date && (
                <span>📅 <strong>Tanggal Kegiatan:</strong> {formatDisplayDate(activeProgramObj.date, undefined, true)}</span>
              )}
              <span>📍 <strong>Lokasi:</strong> Tanah Merah, Kabupaten Boven Digoel</span>
            </div>
          </div>
        )}

        {/* Heading Galeri Foto */}
        <div className="gallery-meta-row">
          <div>
            <strong>
              {activeProg
                ? `Dokumentasi ${activeProgramObj?.name || ""}`
                : searchQuery
                ? `Hasil Pencarian "${searchQuery}"`
                : "✨ Dokumentasi Foto Terbaru"}
            </strong>
          </div>
          <div>
            Menampilkan {items.length} {activeProg ? `dari ${activeProgramObj?.count || items.length}` : ""} foto
          </div>
        </div>

        {/* Grid Photos */}
        {loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>⏳</div>
            <p>Memuat koleksi dokumentasi Kemenhaj...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", border: "1px dashed var(--line)", borderRadius: "16px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
            <h3 style={{ margin: "0 0 4px" }}>Belum Ada Foto</h3>
            <p style={{ color: "var(--muted)", fontSize: "12px", margin: 0 }}>
              Tidak ada dokumentasi foto yang sesuai dengan pilihan ini.
            </p>
          </div>
        ) : (
          <div className="gallery-grid">
            {items.map((photo) => {
              const thumbSmall = bloggerVariant(photo.blogger_url, "thumb");
              const thumbCard = bloggerVariant(photo.blogger_url, "card");
              return (
                <article
                  key={photo.id}
                  className="photo-card"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="photo-thumb-wrap">
                    <img
                      src={thumbSmall}
                      srcSet={`${thumbSmall} 240w, ${thumbCard} 480w`}
                      sizes="(max-width: 620px) 180px, 320px"
                      alt={photo.title || photo.filename}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="photo-overlay">
                      <span>Buka detail ↗</span>
                    </div>
                  </div>
                  <div className="photo-meta">
                    <span className="photo-program-tag">
                      {photo.metadata?.program || "Kemenhaj"}
                    </span>
                    <h3 className="photo-title">
                      {photo.title || photo.filename}
                    </h3>
                    <div className="photo-sub-row">
                      <span>📍 {photo.metadata?.lokasi || "Tanah Merah"}</span>
                      <span>{formatDisplayDate(photo.metadata?.tanggal, photo.created_at)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="load-more-wrap">
            <button
              type="button"
              className="load-more-btn"
              disabled={loadingMore}
              onClick={handleLoadMore}
            >
              {loadingMore ? "Memuat foto berikutnya..." : "⬇️ Muat Lebih Banyak Foto"}
            </button>
          </div>
        )}
      </main>

      {/* 5. Lightbox Modal */}
      {selectedPhoto && (
        <div className="lightbox-backdrop" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-side">
              <img
                src={bloggerVariant(selectedPhoto.blogger_url, "medium")}
                srcSet={bloggerSrcSet(selectedPhoto.blogger_url)}
                sizes="(max-width: 768px) 100vw, 700px"
                alt={selectedPhoto.title || selectedPhoto.filename}
              />
            </div>
            <div className="lightbox-content-side">
              <div className="lightbox-header">
                <div>
                  <span style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 800 }}>DOKUMENTASI KEMENHAJ</span>
                  <h3>{selectedPhoto.title || selectedPhoto.filename}</h3>
                </div>
                <button
                  type="button"
                  className="lightbox-close-btn"
                  onClick={() => setSelectedPhoto(null)}
                  aria-label="Tutup"
                >
                  ×
                </button>
              </div>

              <dl className="lightbox-dl">
                <div>
                  <dt>Kegiatan / Program</dt>
                  <dd>{selectedPhoto.metadata?.program || "Kemenhaj Boven Digoel"}</dd>
                </div>
                <div>
                  <dt>Tanggal Pelaksanaan</dt>
                  <dd>{formatDisplayDate(selectedPhoto.metadata?.tanggal, selectedPhoto.created_at, true)}</dd>
                </div>
                <div>
                  <dt>Lokasi</dt>
                  <dd>{selectedPhoto.metadata?.lokasi || "Tanah Merah, Boven Digoel"}</dd>
                </div>
                <div>
                  <dt>Kode Arsip</dt>
                  <dd style={{ fontFamily: "monospace", fontSize: "11px" }}>{selectedPhoto.id}</dd>
                </div>
              </dl>

              <div className="lightbox-actions">
                <a
                  href={selectedPhoto.blogger_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-original-btn"
                >
                  <span>⬇️</span> Unduh Foto Resolusi Asli (s0)
                </a>
                <button
                  type="button"
                  className="share-wa-btn"
                  onClick={() => handleShareWhatsApp(selectedPhoto)}
                >
                  <span>💬</span> Bagikan ke WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Official Footer */}
      <footer className="footer-main">
        <div className="footer-inner">
          <div className="footer-col">
            <h4>KANTOR KEMENTERIAN HAJI DAN UMRAH</h4>
            <p style={{ margin: "0 0 8px" }}>
              Kabupaten Boven Digoel, Provinsi Papua Selatan, Indonesia.
            </p>
            <p style={{ margin: 0, color: "#8cbfae" }}>
              Melayani pendaftaran porsi haji, perekaman paspor biometrik, pembinaan manasik, dan pelimpahan porsi resmi.
            </p>
          </div>

          <div className="footer-col">
            <h4>LAYANAN & PORTAL RESMI</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "6px" }}>
              <li><a href="https://kemenhajbovendigoel.id" target="_blank" rel="noreferrer">Website Utama (kemenhajbovendigoel.id)</a></li>
              <li><a href="https://kemenhajbovendigoel.id/tracking" target="_blank" rel="noreferrer">Tracking Berkas Haji</a></li>
              <li><a href="https://kemenhajbovendigoel.id/manasik" target="_blank" rel="noreferrer">Jadwal Bimbingan Manasik</a></li>
              <li><a href="https://kemenhajbovendigoel.id/skm" target="_blank" rel="noreferrer">Survei Kepuasan Masyarakat (SKM)</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>ARSIP & PELAPORAN</h4>
            <p style={{ margin: "0 0 6px" }}>
              Seluruh foto dokumentasi disinkronkan secara aman dengan basis data pusat Media Vault dan disajikan melalui Core CDN Google berkecepatan tinggi.
            </p>
            <p style={{ margin: 0, color: "#a2d4c3" }}>
              © {new Date().getFullYear()} Kemenhaj Boven Digoel.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Kantor Kementerian Haji dan Umrah Kabupaten Boven Digoel. Terhubung ke Arsip Visual Media Vault.
        </div>
      </footer>
    </div>
  );
}
