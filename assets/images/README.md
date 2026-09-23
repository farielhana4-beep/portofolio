# Panduan Asset Gambar Portfolio

Jangan mengunggah foto/gambar palsu. Folder ini hanya berisi slot placeholder
yang diganti dengan file asli milik Fariel sebelum presentasi Serkom.

## Nama file yang sudah terhubung ke `index.html`

| Slot di website | File yang harus disimpan | Ukuran disarankan |
|---|---|---|
| Foto profil (hero) | `profile/foto-profil.jpg` | 1:1, min. 480x480 |
| Screenshot beranda TOKOTOKI | `projects/tokotoki-beranda.jpg` | 1280x800 |
| Screenshot dashboard/admin | `projects/tokotoki-dashboard.jpg` | 1280x800 |
| Screenshot katalog | `projects/tokotoki-katalog.jpg` | 1280x800 |
| Screenshot cart & checkout | `projects/tokotoki-cart-checkout.jpg` | 1280x800 |
| Sertifikat 1 | `certificates/sertifikat-1.png` | bebas |
| Sertifikat 2 | `certificates/sertifikat-2.png` | bebas |
| Dokumentasi kegiatan 1 | `activities/kegiatan-1.jpg` | bebas |
| Dokumentasi kegiatan 2 | `activities/kegiatan-2.jpg` | bebas |

## Cara memasang

Setiap placeholder di `index.html` memiliki komentar HTML yang menjelaskan
tag `<img>` penggantinya. Contoh untuk foto profil:

```html
<img class="profile-photo" src="assets/images/profile/foto-profil.jpg" alt="Foto profil Fariel Hana Putra" width="480" height="480">
```

Selama file asli belum ada, placeholder `[Foto Profil]` / `[Sertifikat]` /
`[Dokumentasi]` tetap tampil rapi dan jelas sebagai penanda.
