# Decision Support System — Setup Lokal

Panduan singkat untuk menyiapkan proyek ini di mesin lokal Anda.

## Persyaratan

- Node.js 20 LTS (disarankan) atau 22
- Pengelola paket: gunakan PNPM (disarankan) atau NPM
  - Aktifkan PNPM via Corepack: `corepack enable` lalu `corepack prepare pnpm@latest --activate`

## Instalasi

Di direktori proyek (mis. `e:\dss-SAW`):

Dengan PNPM (disarankan)

```bash
pnpm install
```

Atau dengan NPM

```bash
npm install
```

## Menjalankan Aplikasi (Development)

PNPM:

```bash
pnpm dev
```

NPM:

```bash
npm run dev
```

Buka: http://localhost:3000

Port berbeda (opsional): `pnpm dev -- -p 3001` atau `npm run dev -- -p 3001`.

## Build & Start (Produksi Lokal)

PNPM:

```bash
pnpm build
pnpm start
```

NPM:

```bash
npm run build
npm start
```

## Lint

PNPM: `pnpm lint`

NPM: `npm run lint`

## Konfigurasi & Catatan

- Tidak ada `.env` yang wajib secara default.
- Tailwind CSS v4 sudah terpasang melalui `postcss.config.mjs` dan `app/globals.css`.
- Alias path: lihat `tsconfig.json` (alias `@/*` menunjuk ke akar proyek).
- Versi utama: Next.js 16, React 19, TypeScript 5.

## Pemecahan Masalah (Troubleshooting)

- Konflik peer dependency saat NPM install (ERESOLVE)
  - Proyek ini sempat memiliki paket `vaul` yang tidak mendukung React 19. Dependensi tersebut sudah dihapus dari `package.json`.
  - Jika Anda masih menjumpai error serupa, lakukan pembersihan berikut lalu install ulang:
    - PowerShell (Windows):
      ```powershell
      Remove-Item -Recurse -Force node_modules, package-lock.json
      ```
      Untuk PNPM: hapus juga `pnpm-lock.yaml` hanya jika Anda ingin pindah ke NPM sepenuhnya.
    - Kemudian jalankan kembali: `pnpm install` (disarankan) atau `npm install`.

- Cache/build bermasalah atau perubahan tak terdeteksi
  - Hapus folder `.next`: `Remove-Item -Recurse -Force .next`
  - Install ulang dependensi seperti langkah di atas, lalu jalankan dev server lagi.

- Port 3000 sudah terpakai
  - Jalankan dengan port lain: `pnpm dev -- -p 3001` atau `npm run dev -- -p 3001`.

## Skrip yang Tersedia

- `dev`: menjalankan Next.js di mode development
- `build`: membangun aplikasi untuk produksi
- `start`: menjalankan server produksi hasil build
- `lint`: menjalankan ESLint

