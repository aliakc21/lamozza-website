# La Mozza İncek — Web Sitesi

Ankara İncek (Gölbaşı) düğün, kına ve etkinlik mekanı için statik web sitesi.
Çerçeve yok, derleme adımı yok, sunucu tarafı kod yok — dosyaları bir statik
sunucuya koymak yeterli.

---

## 1. Alan adları ve yönlendirme planı

Elde 4 alan adı var. Önerilen kurgu:

| Alan adı | Rol | Durum |
|---|---|---|
| **www.lamozza.com.tr** | **ANA (canonical)** | ✅ Site burada, HTTPS'li |
| lamozza.com.tr | Kök → www | ✅ 301 ile www'ye gidiyor |
| lamozza.tr | Yönlendirme | Hedefi `https://www.lamozza.com.tr` yapılmalı |
| lamozza.org | Yönlendirme | Hedefi `https://www.lamozza.com.tr` yapılmalı |
| lamozza.xyz | Yönlendirme | Hedefi `https://www.lamozza.com.tr` yapılmalı |

> **Neden `www`?** `www` bir CNAME kaydı olduğu için GitHub'ın kendi DNS'ini
> takip eder; IP'leri değişse bile kayıt bayatlamaz. Kök alan adı ise sabit 4 A
> kaydına bağlıdır ve isimtescil'in girdiği kayıtlardan biri hatalı olduğu için
> (`185.199.111.15`, sonunda 3 eksik) kök adres için sertifika üretilemiyor.
> Ayrıntı: `DURUM-VE-YAPILACAKLAR.md`

**Neden `.com.tr` ana?** Türkiye'de ticari işletmenin en tanınan uzantısı,
belge ile tescil edildiği için güven sinyali daha yüksek ve Google'ın Türkiye
sonuçlarında yerleşik. Diğer üçü marka koruması amaçlı tutulup ana adrese
yönlendirilir.

> **Kritik SEO kuralı:** Aynı içerik dört ayrı adreste yayınlanırsa Google bunu
> kopya içerik sayar ve hiçbiri hak ettiği sıraya çıkamaz. **Sadece bir tanesi**
> siteyi yayınlar, diğer üçü 301 (kalıcı) yönlendirme yapar. Sitedeki tüm
> `canonical` etiketleri `https://www.lamozza.com.tr`'yi gösteriyor.

Ana alan adını değiştirmek isterseniz tek yapılacak: `DEGISTIR.md` dosyasındaki
adımları izlemek (tüm dosyalarda tek komutla değişir).

---

## 2. Yayına alma

### Seçenek A — GitHub Pages (ücretsiz, önerilen)

MiniBeauty sitesiyle aynı yöntem.

1. GitHub'da yeni bir depo aç (örn. `lamozza-website`), **Public** olmalı.
2. Bu klasörü depoya gönder:
   ```bash
   cd /Users/akc/Documents/LAMOZZA
   git init && git add -A && git commit -m "La Mozza web sitesi"
   git branch -M main
   git remote add origin https://github.com/KULLANICI/lamozza-website.git
   git push -u origin main
   ```
3. Depo → **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `(root)`.
4. **Custom domain** kutusuna `www.lamozza.com.tr` yaz, kaydet. (`CNAME` dosyası zaten hazır.)
5. **Enforce HTTPS** kutusunu işaretle (sertifika birkaç dakikada gelir).

**DNS kayıtları** (isimtescil → lamozza.com.tr → DNS yönetimi):

| Tip | Ad | Değer |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | aliakc21.github.io |

### Seçenek B — Cloudflare Pages / Netlify

Klasörü sürükle-bırak ile yükle, alan adını bağla. Yapılandırma gerekmez.

### Seçenek C — Klasik hosting (cPanel / Plesk)

Klasörün **içindekileri** `public_html` altına at. `.claude` klasörünü **atma**
(sadece geliştirme aracı). `404.html` otomatik çalışır.

---

## 3. Yönlendirmelerin kurulumu (isimtescil)

Üç alan adı için (`lamozza.tr`, `lamozza.org`, `lamozza.xyz`):

**En temiz yol — isimtescil'in kendi yönlendirme servisi:**
Alan adı paneli → ilgili alan adı → **Yönlendirme / Web Yönlendirme** →
Hedef: `https://www.lamozza.com.tr` → Tip: **301 Kalıcı** → `www` dahil işaretle.

**Alternatif — Cloudflare üzerinden:** Alan adlarının nameserver'ını Cloudflare'e
alıp Bulk Redirect kuralı yazmak. Daha esnek ama daha çok adım.

> Yönlendirmelerde **mutlaka 301 (kalıcı)** seçin. 302 (geçici) seçilirse Google
> yönlendirmeyi kalıcı saymaz ve otorite ana alan adında toplanmaz.

---

## 4. Dosya yapısı

```
/
├── index.html                    Ana sayfa
├── dugun/ kina-gecesi/ nisan-soz/ nikah/
│   after-party/ sunnet/ dogum-gunu/
│   kurumsal-etkinlik/             Organizasyon türü sayfaları (8)
├── incek-dugun-salonu/
│   golbasi-dugun-mekani/
│   ankara-kir-dugunu/
│   ankara-kina-mekani/            Bölgesel SEO sayfaları (4)
├── galeri/ sss/ iletisim/ kvkk/   Genel sayfalar
├── 404.html
├── assets/
│   ├── css/main.css              Tüm stiller (tek dosya)
│   ├── js/main.js                Tüm etkileşim (bağımlılıksız)
│   └── img/                      Fotoğraflar
├── sitemap.xml robots.txt llms.txt humans.txt manifest.json
├── favicon.svg og-image.jpg apple-touch-icon.png
├── CNAME                         GitHub Pages alan adı
└── .claude/                      Geliştirme araçları (yayına gitmez)
```

---

## 5. Fotoğraflar

### Şu anki durum — ÖNEMLİ

Sitedeki görsellerin çoğu **geçici temsili fotoğraftır** (Unsplash, ücretsiz ve
ticari kullanıma açık lisans, atıf zorunluluğu yok). Bunlar mekânın kendi
fotoğrafları **değildir** ve gerçek çekimler hazır olunca değiştirilmelidir.

**İstisna:** Ana sayfa ve galeri sayfasındaki **Instagram ızgarası**
(`assets/img/ig/01–08.jpg`) gerçek @lamozzaincek gönderileridir ve her kare
ilgili Instagram gönderisine bağlanır. Orası olduğu gibi kalmalı.

Neden temsili kullanıldı: Instagram herkese açık erişimde görselleri 640 piksele
sınırlıyor; o boyuttaki kareler sitede büyütülünce bulanık kalıyordu, ayrıca
bazılarında başka çiftlerin isimleri (tabela/ayna yazıları) görünüyordu.

**Yerine gerçek fotoğraf koymak:** Aşağıdaki tabloda hangi dosyanın nerede
kullanıldığı yazıyor. Aynı isimle üzerine yazmanız yeterli — kod değişikliği
gerekmez. Önerilen boyutlara uyarsanız sayfa hızı korunur.

| Dosya | Nerede kullanılıyor | Önerilen boyut |
|---|---|---|
| `assets/img/hero.jpg` | **Ana sayfa üst görseli** — konursa triptiğin yerini alır | 2400×1350, yatay |
| `assets/img/hero-a/b/c.jpg` | Triptik panelleri | 900×1600, dikey |
| `assets/img/konak.jpg` | "Mekân Hakkında" yan görseli | 1200×1500, dikey |
| `assets/img/alan-bahce.jpg` | Kır bahçesi | 1400×1400 |
| `assets/img/alan-kina-konagi.jpg` | Kına Konağı salonu | 1400×1400 |
| `assets/img/alan-tas-konak.jpg` | Taş Konak | 1400×1400 |
| `assets/img/alan-restoran.jpg` | Alacarte restoran | 1400×1400 |
| `assets/img/acilir-tavan.jpg` | Açılır tavan bölümü (kemer maskeli) | 1200×1500, dikey |
| `assets/img/org-*.jpg` | 8 organizasyon kartı | 1200×750, yatay |
| `assets/img/galeri/01–12.jpg` | Galeri | 1200×1500, dikey |
| `assets/img/ig/01–08.jpg` | Instagram ızgarası | 1080×1080, kare |
| `assets/img/hero-<sayfa>.jpg` | Alt sayfa üst görselleri (isteğe bağlı) | 2400×1200, yatay |
| `assets/img/hero.mp4` | **İsteğe bağlı** ana sayfa videosu | 1920×1080, 2–4 MB, sessiz |

Bir dosya yoksa site **bozulmaz** — yerine tasarlanmış bir doku/monogram
gösterilir. Video sadece masaüstünde ve kullanıcı hareket kısıtlaması
açmadıysa yüklenir; mobilde hiç indirilmez.

### Telif / lisans notu

- **Temsili görseller:** Unsplash lisansı — ücretsiz, ticari kullanıma açık,
  atıf zorunlu değil. Yine de kalıcı kullanımda mekânın kendi fotoğraflarına
  geçilmesi önerilir; başka bir mekânın fotoğrafıyla müşteri beklentisi
  oluşturmak doğru olmaz.
- **Instagram kareleri:** @lamozzaincek hesabının kendi gönderileri. Bazı
  paylaşımlar organizasyon firmaları ve fotoğrafçılarla ortak etiketli;
  kalıcı kullanımda ilgili fotoğrafçılardan yazılı izin alınması önerilir.
  Kaynak gönderiler: `DbS7-F5M1zW · DY60fysM2f8 · DZ0FAaCiGuz · DXpS8wUjOX6 ·
  DafqiwPsi4t · DZW_axZtqMy · DbG0qNrMKzq · DYRlhtzMWYY`
  (`https://www.instagram.com/p/<kod>/`)

---

## 6. Instagram bölümü

Ana sayfa ve galeri sayfasında **8 gerçek gönderiye bağlı** kare ızgara var.
Her kare ilgili Instagram gönderisini açar. Üçüncü taraf script kullanılmıyor —
sayfa hızlı açılır ve çerez yazılmaz.

**Otomatik güncellenen canlı akış isterseniz** (isteğe bağlı):

1. [elfsight.com](https://elfsight.com) → Instagram Feed widget oluştur, `@lamozzaincek` bağla.
2. Verilen widget ID'sini al (`elfsight-app-xxxxxxxx-xxxx-...` biçiminde).
3. `index.html` ve `galeri/index.html` içinde `elfsight-app-LAMOZZA-WIDGET-ID`
   yazan yeri kendi ID'nizle değiştirin ve o `<div>`'den `hidden` özelliğini silin.
4. `</body>` öncesine ekleyin:
   `<script src="https://elfsightcdn.com/platform.js" async></script>`

Canlı akış yüklendiği anda sabit ızgara **otomatik gizlenir** — ikisi üst üste
binmez.

---

## 7. Teklif formu nasıl çalışıyor?

Sunucu gerekmez. Kullanıcı formu doldurup gönderdiğinde girdiği bilgiler
düzenli bir metne dönüşür ve seçimine göre:

- **WhatsApp** (varsayılan): `wa.me/905330143853` hazır mesajla açılır
- **E-posta**: `info@lamozza.com.tr` adresine taslak olarak açılır

Kullanıcı "gönder"e basmadan hiçbir veri hiçbir yere gitmez. KVKK metni bunu
açıkça anlatıyor.

**Numarayı/e-postayı değiştirmek:** `iletisim/index.html` ve `index.html`
içindeki `<form ... data-wa="905330143853" data-eposta="info@lamozza.com.tr">`
satırı yeterli.

> `info@lamozza.com.tr` adresini kurmayı unutmayın (isimtescil e-posta paketi
> veya Google Workspace). Kurulmazsa e-posta seçeneği çalışmaz — o durumda
> formdan e-posta seçeneğini kaldırın.

---

## 8. Site içeriğinin kaynağı

Sitedeki kapasite ve olanak bilgileri şu kaynaklardan derlendi:

- **900 kişilik kır bahçesi**, **500 kişilik açılır-kapanır tavanlı kapalı salon
  (Kına Konağı, han konsepti)**, **alacarte restoran**, **pentatlon sahalı çocuk
  oyun alanı**, **400 araçlık otopark ve vale** → işletmenin eski resmi sitesi
  (`lamozzaincek.com`, web arşivi 2017–2018)
- **Taş Konak ~220 kişi** → dugun.com işletme profili
- **Telefonlar ve "randevu alınız" notu** → @lamozzaincek Instagram biyografisi
- **Adres ve koordinat** → Yandex Haritalar + menuburada (birbirini doğruluyor)
- **Puanlar** → Yandex Haritalar 4.5/5 (36 değerlendirme), menuburada 5/5 (33 yorum)

### ⚠️ Yayına almadan önce işletmeye doğrulatın

| Konu | Sitede yazan | Not |
|---|---|---|
| Kapasiteler | 900 / 500 / ~220 | Kaynak 2017–2018 tarihli, güncel olmayabilir |
| Posta kodu | 06830 | Kaynaklarda 06810 da geçiyor |
| Kapı numarası | Dural Cad. No: 8 | Bir kayıtta "4B" görünüyor |
| E-posta | info@lamozza.com.tr | Henüz kurulmamış olabilir |
| Jeneratör | SSS'te "teknik ekiple çalışıyoruz" deniyor | Varsa net yazılmalı |
| Çalışma saatleri | "Her gün açığız, randevu alın" | Net saat verilmedi (kaynaklar çelişkili) |
| Alkollü servis | "Seçenek var" | Doğrulanmalı |

Bunlardan biri yanlışsa ilgili sayfada düzeltilmesi 1 dakikalık iş — hepsi düz
metin olarak yazılı.

---

## 9. Geliştirme ve test

```bash
# Yerel sunucu
python3 .claude/serve.py 8099
# → http://localhost:8099/
```

`.claude/mobil-test.html` adresini tarayıcıda açın: 18 sayfanın tamamını
360 / 390 / 430 / 768 / 1024 px genişliklerinde tarayıp yatay taşma olup
olmadığını tablo halinde raporlar. Tasarımda değişiklik yaptıktan sonra bu
testi çalıştırın.

---

## 10. Teknik özellikler

- **Bağımlılık yok** — jQuery, React, Bootstrap, GSAP yok. Tek CSS + tek JS.
- **Tipografi:** Fraunces (başlık) + Figtree (metin) + DM Mono (etiket),
  `latin-ext` alt kümesiyle — ğ ş ı İ Ç Ö Ü doğru görünür.
- **Erişilebilirlik:** WCAG AA kontrast, tam klavye erişimi, `prefers-reduced-motion`
  desteği, her görselde `alt`, her form alanında `label`, `<html lang="tr">`.
- **SEO:** Sayfa başına özgün title/description/canonical, Open Graph + Twitter Card,
  `EventVenue` + `LocalBusiness` + `FAQPage` + `Service` yapılandırılmış verisi,
  sitemap, robots, `llms.txt` (yapay zekâ arama motorları için).
- **Performans:** Toplam görsel ağırlığı ~2 MB, tüm görseller `loading="lazy"`,
  video yalnızca masaüstünde ve `preload="none"`, üçüncü taraf script yok
  (yalnızca Google Fonts ve iletişim sayfasındaki harita).
- **Mobil:** Yatay taşma sıfır, dokunmatikte hover efektleri kapalı, sabit
  WhatsApp + telefon butonları, tam ekran açılır menü.
