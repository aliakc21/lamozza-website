# La Mozza — Yayın Durumu

Son güncelleme: 3 Ağustos 2026, 16:45

---

## 🟢 SİTE CANLI VE HTTPS'Lİ

# https://www.lamozza.com.tr

18 sayfanın tamamı HTTPS üzerinden test edildi → **18/18 · 200 OK**
Sertifika: Let's Encrypt, geçerli (3 Ağu → 1 Kas 2026), otomatik yenilenir.

| Adres | Durum |
|---|---|
| `https://www.lamozza.com.tr` | ✅ **Site — HTTPS** |
| `http://www.lamozza.com.tr` | ✅ 301 → HTTPS |
| `http://lamozza.com.tr` | ✅ 301 → https://www.lamozza.com.tr |
| `https://lamozza.com.tr` | ❌ Sertifika yok (aşağıdaki yazım hatası yüzünden) |
| `lamozza.org` / `.xyz` / `.tr` | ⚠️ Yönlendiriyor ama **hedefi güncellenmeli** |

### Neden `www`?

`www.lamozza.com.tr` bir **CNAME** kaydı (`aliakc21.github.io`) — GitHub'ın kendi
DNS'ini takip ediyor, dolayısıyla dört IP'nin dördü de doğru geliyor ve isimtescil'in
yazım hatasından **etkilenmiyor**. Bu sayede sertifika alınabildi.

Kök alan adı ise sabit 4 A kaydına bağlı ve biri hatalı → sertifika alamıyor.
GitHub da zaten `www` kullanımını öneriyor (IP değişikliklerinde kayıt bayatlamaz).

---

## ⚠️ isimtescil'de kalan 2 iş

### 1. Yanlış girilen A kaydı

`lamozza.com.tr` için girilen 4 A kaydından biri hatalı:

```
185.199.108.153   ✅
185.199.109.153   ✅
185.199.110.153   ✅
185.199.111.15    ❌  ← sonunda "3" eksik, doğrusu 185.199.111.153
```

O IP GitHub'a ait değil, test edildi: `HTTP/1.1 500 Domain Not Found`.
Etkisi: doğrudan `lamozza.com.tr` yazan ziyaretçilerin ~%25'i hata alıyor ve
`https://lamozza.com.tr` (www'suz HTTPS) çalışmıyor.

**Panelden düzeltilemiyor** — kök (apex) kayıtlar korumalı: silme "başarılı" diyor
ama kayıt duruyor, kalemle düzenleyip kaydedince değişmiyor. Alt alan adı
kayıtlarında aynı işlemler sorunsuz çalışıyor.

→ **Ticket 2302904'e düzeltme talebi yazıldı.** Düzelince `https://lamozza.com.tr`
de kendiliğinden çalışmaya başlayacak (GitHub kök için de sertifika üretir).

### 2. Yönlendirme hedefleri güncellenmeli

`.tr`, `.org`, `.xyz` şu an `https://lamozza.com.tr`'ye yönlendiriyor — o adresin
sertifikası olmadığı için bağlantı kurulamıyor. Hedef şu olmalı:

```
https://www.lamozza.com.tr
```

`Panel → Domainlerim → <alan adı> → Başka Adrese Yönlendirme` · Standart Yönlendirme

> **isimtescil oturumu düştü**, panele yeniden giriş yapılması gerekiyor.
> Giriş yapıldıktan sonra bu üç yönlendirme 2 dakikada güncellenebilir.

---

## 📋 3 Ağustos'ta yapılanlar

1. DNS bölgelerinin açıldığı yetkili sunucudan doğrulandı
2. Hatalı A kaydı tespit edildi, ölü olduğu `curl --resolve` ile kanıtlandı
3. Panelden silme/düzenleme denendi → apex korumalı
4. Ticket 2302904'e düzeltme talebi yazıldı
5. `.tr`, `.org`, `.xyz` yönlendirmeleri kuruldu (üçü de aktif)
6. Site `www.lamozza.com.tr` üzerine alındı → **sertifika onaylandı, HTTPS açıldı**
7. Tüm site URL'leri (canonical, og:url, JSON-LD, sitemap, robots, llms.txt) `www`'ye güncellendi
8. 18 sayfa HTTP ve HTTPS üzerinden ayrı ayrı test edildi → 18/18
9. Varlıklar test edildi (CSS, JS, fotoğraflar, og-image, favicon, sitemap, robots, manifest) → hepsi 200
10. 404 sayfası doğrulandı

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
