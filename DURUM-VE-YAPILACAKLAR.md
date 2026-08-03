# La Mozza — Yayın Durumu

Son güncelleme: 3 Ağustos 2026, 15:00

---

## 🟢 SİTE CANLI

**http://lamozza.com.tr** — 18 sayfanın tamamı çalışıyor (18/18 test edildi, 200 OK).

| | Durum |
|---|---|
| Site | ✅ Canlı, `lamozza.com.tr` |
| DNS bölgeleri (.com.tr, .tr) | ✅ isimtescil açtı (Ticket 2302904) |
| `www.lamozza.com.tr` | ✅ Ana adrese 301 |
| `lamozza.org` → `lamozza.com.tr` | ✅ Yönlendirme aktif |
| `lamozza.xyz` → `lamozza.com.tr` | ✅ Yönlendirme aktif |
| `lamozza.tr` → `lamozza.com.tr` | ⏳ Ayarlandı, DNS yayılıyor |
| **HTTPS** | ⏳ **Aşağıdaki tek hata düzelince otomatik açılacak** |

---

## ⚠️ KALAN TEK SORUN — isimtescil'de bir yazım hatası

isimtescil, `lamozza.com.tr` için istediğim 4 A kaydını girerken **birini yanlış yazmış:**

```
185.199.108.153   ✅
185.199.109.153   ✅
185.199.110.153   ✅
185.199.111.15    ❌  ← sonunda "3" eksik, doğrusu 185.199.111.153
```

**İki sonucu var:**

1. **Ziyaretçilerin ~%25'i siteye ulaşamıyor.** O IP GitHub'a ait değil; test ettim,
   `HTTP/1.1 500 Domain Not Found` dönüyor.
2. **HTTPS açılamıyor.** GitHub sertifika vermeden önce *tüm* A kayıtlarını doğruluyor;
   yabancı bir IP varken sertifika üretmiyor. (`gh api` cevabı: *"The certificate does not exist yet"*.)

**Bu kaydı panelden düzeltemiyorum:** kök (apex) kayıtlar korumalı — silmeye çalışınca
"işlem başarılı" diyor ama kayıt duruyor, kalemle düzenleyip kaydedince de değişmiyor.
Aynı davranışı `lamozza.org`'un kök kaydında da görmüştüm; alt alan adı kayıtlarında
ekleme/silme sorunsuz çalışıyor.

**Yapıldı:** Ticket 2302904'e düzeltme talebi yazıldı (3 Ağustos 15:00).

**Düzeldiği an ne olacak:** Arka planda bir izleyici çalışıyor; kayıt düzelir düzelmez
GitHub'da HTTPS'i otomatik açacak. Elle bir şey yapılmasına gerek yok.

> Not: `lamozza.tr`'de dört kaydın dördü de doğru girilmiş, orada bu sorun yok.

---

## 📋 Yapılan işlemler (3 Ağustos)

1. DNS bölgelerinin açıldığı yetkili sunucudan doğrulandı (`dig +norecurse SOA @tr.dnsenable.com` → `aa` bayrağı, `ANSWER: 1`)
2. Hatalı A kaydı tespit edildi ve ölü olduğu kanıtlandı (`--resolve` ile doğrudan test)
3. Kayıt panelden silinmeye/düzenlenmeye çalışıldı → apex korumalı, olmadı
4. Ticket 2302904'e düzeltme talebi yazıldı
5. `.tr`, `.org`, `.xyz` için Standart Yönlendirme → `https://lamozza.com.tr` ayarlandı
6. 18 sayfa canlı adreste tek tek test edildi → 18/18 · 200 OK
7. Varlıklar test edildi (CSS, JS, fotoğraflar, og-image, favicon, sitemap, robots, manifest) → hepsi 200
8. Olmayan sayfa → 404 doğru çalışıyor
9. Ana sayfa içeriği doğrulandı: title, canonical, h1, 37 görsel, telefon + WhatsApp bağlantıları

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

---

## 🧪 Teşhisi kesinleştiren DNS ölçümleri

Destek talebine itiraz gelirse bu kanıtlar kullanılabilir:

```bash
# .org'un bölgesi VAR — yetkili cevap veriyor (aa bayrağı) ve bugün düzenlenmiş
dig +norecurse SOA lamozza.org @tr.dnsenable.com
#   → flags: qr aa;  ANSWER: 1;  serial 2026080302

# .com.tr'nin bölgesi YOK — aynı sunucu hiçbir kayıt döndürmüyor
dig +norecurse SOA lamozza.com.tr @tr.dnsenable.com
#   → ANSWER: 0;  yetkili bölümde sadece genel "com.tr SOA hostmaster.dnsenable.com"

# Delegasyon farkı: .org 3 name server, .com.tr sadece 2
dig +short NS lamozza.org      # us. + tr. + eu.dnsenable.com
dig +trace NS lamozza.com.tr   # sadece tr. + eu.dnsenable.com  ← us. EKSİK
```

**Özet:** Aynı hesapta `.org`/`.xyz` için ücretsiz DNS servisi sağlanmış
(bölge dosyası + 3. name server var), `.com.tr`/`.tr` için **hiç sağlanmamış**
(bölge yok + `us.dnsenable.com` eksik). Sorun kayıt biçimi değil, servisin bu iki
alan adı için hiç açılmamış olması. Talep tam olarak bunu istiyor.

### Destek yanıt vermezse yedek plan

isimtescil panelinde `.com.tr` için **"Müşteriye Özel DNS / harici nameserver"**
alanının açılmasını istemek (talebin (b) maddesi). Açılırsa DNS'i ücretsiz bir
sağlayıcıya (deSEC, Hetzner DNS, Cloudflare) taşıyıp kayıtları oradan yönetiriz.
O senaryoda tek gereken bir hesap açılması — o adımı ben yapamam, gerisini yaparım.
