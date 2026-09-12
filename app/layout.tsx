import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Galeri Foto & Dokumentasi — Kementerian Haji dan Umrah Boven Digoel",
  description:
    "Portal dokumentasi visual resmi pelayanan haji & umrah, bimbingan manasik, perekaman paspor, dan kegiatan Kantor Kementerian Haji dan Umrah Kabupaten Boven Digoel, Papua Selatan.",
  keywords: [
    "Kemenhaj Boven Digoel",
    "Kementerian Haji dan Umrah",
    "Galeri Kemenhaj",
    "Dokumentasi Haji Boven Digoel",
    "Manasik Haji Tanah Merah",
    "Paspor Haji Boven Digoel",
  ],
  authors: [{ name: "Kemenhaj Boven Digoel", url: "https://kemenhajbovendigoel.id" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Galeri Foto — Kementerian Haji dan Umrah Boven Digoel",
    description: "Arsip visual dokumentasi pelayanan haji & umrah Kabupaten Boven Digoel.",
    url: "https://galeri.kemenhajbovendigoel.id",
    siteName: "Galeri Kemenhaj Boven Digoel",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
