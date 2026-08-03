# La Mozza — Yayın Durumu ve Kalan Tek Adım

Son güncelleme: 3 Ağustos 2026

---

## ✅ Tamamlananlar

| İş | Durum |
|---|---|
| 18 sayfalık site | Bitti |
| Fotoğraflar (@lamozzaincek'ten 12 gerçek kare) | Bitti |
| Mobil / duyarlılık testi (18 sayfa × 5 genişlik = 90 ölçüm) | Temiz |
| SEO, yapılandırılmış veri, sitemap, robots | Bitti |
| GitHub deposu | `github.com/aliakc21/lamozza-website` |
| GitHub Pages | **Kuruldu ve derlendi** (`status: built`) |
| Özel alan adı ayarı | `lamozza.com.tr` olarak tanımlı |

Site sunucuda hazır bekliyor. Tek eksik: alan adının bu sunucuyu göstermesi.

---

## ⛔ Tek engel: isimtescil `.tr` DNS bölgesi açık değil

### Tespit

| Alan adı | nic.tr delegasyonu | isimtescil DNS bölgesi | Kayıt eklenebiliyor mu |
|---|---|---|---|
| **lamozza.com.tr** | ✅ tr.dnsenable.com, eu.dnsenable.com | ❌ **YOK** | ❌ Hayır |
| **lamozza.tr** | ✅ tr.dnsenable.com, eu.dnsenable.com | ❌ **YOK** | ❌ Hayır |
| lamozza.org | ✅ | ✅ Var (A + NS + CNAME) | ✅ Evet |
| lamozza.xyz | ✅ | ✅ Var (A + NS + CNAME) | ✅ Evet |

**Yani sorun bizde değil.** Alan adlarının name server'ları registry'de (nic.tr)
doğru şekilde isimtescil'i gösteriyor. Ama isimtescil kendi DNS sunucularında bu
iki `.tr` alan adı için bölge dosyasını müşteri paneline bağlamamış.

Panelde `Domain → lamozza.com.tr → IP Bazlı DNS Yönetimi` şunu diyor:
> "Henüz eklenmiş DNS kaydı bulunmamaktadır."

- **"Varsayılan Dns Ekle"** butonu → hiçbir şey yapmıyor, kayıt oluşmuyor
- **A kaydı ekleme** → *"DNS kaydı eklenemedi. Kayıtta geçersiz veya gereksiz
  karakterler olabilir."* hatası (kayıt adı `@` da olsa, `www` da olsa aynı)

Aynı işlemler `lamozza.org` ve `lamozza.xyz` üzerinde **sorunsuz** çalışıyor.
Dolayısıyla panel kullanımıyla ilgili bir hata değil, `.tr` tarafında
sağlama/provisioning eksiği.

### Çözüm: isimtescil'e 1 destek kaydı

**En hızlısı telefon:** +90 850 200 0 444 (7/24)
**Yazılı:** destek@isimtescil.net veya panel → Destek

#### Gönderilecek metin

> **Konu: lamozza.com.tr ve lamozza.tr için DNS yönetimi açılmıyor**
>
> Merhaba,
>
> Üye ID: 201898
>
> **lamozza.com.tr** (Ürün ID 5607737) ve **lamozza.tr** (Ürün ID 5607736) alan
> adlarımın panelindeki *IP Bazlı DNS Yönetimi* bölümünde "Henüz eklenmiş DNS
> kaydı bulunmamaktadır" yazıyor.
>
> - "Varsayılan Dns Ekle" butonuna bastığımda hiçbir kayıt oluşmuyor.
> - Manuel A kaydı eklemeye çalıştığımda *"DNS kaydı eklenemedi. Kayıtta
>   geçersiz veya gereksiz karakterler olabilir."* hatası alıyorum. (Kayıt adı
>   olarak hem `@` hem `www` denedim, IP adresi geçerli.)
>
> Aynı hesaptaki **lamozza.org** ve **lamozza.xyz** alan adlarında aynı ekran
> sorunsuz çalışıyor ve kayıtlar görünüyor. WHOIS'te her iki `.tr` alan adının
> name server'ları da doğru şekilde `tr.dnsenable.com` ve `eu.dnsenable.com`
> olarak görünüyor.
>
> Bu iki alan adı için DNS bölgesinin açılmasını rica ediyorum. Açıldıktan sonra
> ekleyeceğim kayıtlar şunlar olacak (siteyi GitHub Pages'te yayınlıyorum):
>
> ```
> A      @      185.199.108.153
> A      @      185.199.109.153
> A      @      185.199.110.153
> A      @      185.199.111.153
> CNAME  www    aliakc21.github.io
> ```
>
> Dilerseniz bu kayıtları siz de tanımlayabilirsiniz.
>
> Teşekkürler.

---

## 📋 DNS açıldıktan sonra yapılacaklar (5 dakika)

### 1. lamozza.com.tr — siteyi yayına al

`Panel → Domainlerim → lamozza.com.tr → IP Bazlı DNS Yönetimi`

| Tip | Kayıt adı | Değer |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `aliakc21.github.io` |

Sonra GitHub'da: `Settings → Pages → Enforce HTTPS` işaretlenir
(sertifika DNS yayıldıktan ~15 dk sonra hazır olur).

### 2. lamozza.tr, lamozza.org, lamozza.xyz — ana adrese yönlendir

`Panel → Domainlerim → <alan adı> → Başka Adrese Yönlendirme`

- Yönlendirme Tipi: **Standart Yönlendirme** (maskeli DEĞİL — maskeli, adres
  çubuğunda eski alan adını bırakır ve Google bunu kopya içerik sayar)
- Yönlendirilecek Adres: `https://lamozza.com.tr`
- Sayfa Başlığı: `La Mozza İncek`

> `.org` ve `.xyz` için bu ekran hazır ve çalışıyor. `.tr` için DNS açıldıktan
> sonra yapılabilir.

### 3. Doğrulama

```bash
dig +short lamozza.com.tr
```
Cevap `185.199.10x.153` ise DNS tamam. Ardından `https://lamozza.com.tr` açılır.

---

## 🔎 Yayın öncesi işletmeye doğrulatılacaklar

Bu bilgiler mekanın **kendi eski sitesinden** (web arşivi 2017–2018) ve halka
açık kayıtlardan derlendi. Yanlış olan varsa düzeltmesi 1 dakikalık iş.

| Konu | Sitede yazan | Kaynak |
|---|---|---|
| Kır bahçesi kapasitesi | 900 kişi | Eski resmi site |
| Kapalı salon kapasitesi | 500 kişi, açılır-kapanır tavan | Eski resmi site |
| Taş Konak kapasitesi | ~220 kişi | dugun.com profili |
| Otopark | 400 araç + vale | Eski resmi site |
| Çocuk oyun alanı | Pentatlon sahalı | Eski resmi site |
| Adres | Turgut Özal Bulvarı, Dural Cad. No: 8 | Yandex + menuburada |
| Posta kodu | 06830 | Bazı kaynaklarda 06810 |
| Telefonlar | 0312 460 16 11 / 0533 014 38 53 | Instagram biyografisi |
| E-posta | info@lamozza.com.tr | **Henüz kurulmamış** (MX kaydı yok) |
| Alkollü servis | "Seçenek var" deniyor | Doğrulanmalı |
| Jeneratör | "Teknik ekiple çalışıyoruz" | Net bilgi yok |
| Çalışma saatleri | "Her gün açığız, randevu alın" | Kaynaklar çelişkili |

**E-posta notu:** `info@lamozza.com.tr` adresi henüz yok. Kurulana kadar
iletişim formundaki "E-posta ile gönder" seçeneği çalışmaz — WhatsApp seçeneği
varsayılan olduğu için form yine de sorunsuz işliyor.

---

## 🖼 Fotoğraflar

Şu an sitedeki tüm fotoğraflar @lamozzaincek Instagram hesabından. Instagram
herkese açık erişimde 640 piksel sınırı koyduğu için tasarım buna göre kurgulandı
(hiçbir görsel büyütülmüyor). Elinizdeki **orijinal yüksek çözünürlüklü**
fotoğrafları aynı isimle `assets/img/` altına koyarsanız site kendiliğinden
keskinleşir — hangi dosyanın nereye geldiği `README.md` bölüm 5'te listeli.
