# La Mozza — Yayın Durumu

Son güncelleme: 6 Ağustos 2026

---

## 🟢 ANA SİTE CANLI VE GÜVENLİ

# https://www.lamozza.com.tr

18 sayfa, Let's Encrypt sertifikası geçerli, HTTPS zorunlu.

---

## 🔴 "Güvenli değil" uyarısının sebebi

| Adres | HTTP | HTTPS | Neden |
|---|---|---|---|
| `www.lamozza.com.tr` | 301 → HTTPS | ✅ **Güvenli** | — |
| `lamozza.com.tr` | ⚠️ %25 ihtimalle `500` | ❌ | isimtescil'in A kaydı yazım hatası |
| `lamozza.org` | 200 (yönlendiriyor) | ❌ | **isimtescil yönlendirme sunucusu HTTPS desteklemiyor** |
| `lamozza.xyz` | 200 (yönlendiriyor) | ❌ | aynı |
| `lamozza.tr` | 200 (yönlendiriyor) | ❌ | aynı |

**Ölçüm:** `openssl s_client -connect lamozza.org:443` → *sertifika sunulmuyor*.
isimtescil'in yönlendirme sunucusu (`93.89.226.17`) 443 portunda hiç sertifika
vermiyor. Bu bir ayar meselesi değil; o servis kullanıldığı sürece bu üç alan
adı **hiçbir zaman** HTTPS olamaz.

---

## ✅ Çözüm hazırlandı — 3 yönlendirme sitesi kuruldu

isimtescil'in yönlendirme servisi yerine **GitHub Pages** kullanılacak.
GitHub her alan adına ücretsiz Let's Encrypt sertifikası veriyor.

| Depo | Alan adı | Durum |
|---|---|---|
| `aliakc21/lamozza-org-redirect` | lamozza.org | ✅ Kuruldu, DNS bekliyor |
| `aliakc21/lamozza-xyz-redirect` | lamozza.xyz | ✅ Kuruldu, DNS bekliyor |
| `aliakc21/lamozza-tr-redirect` | lamozza.tr | ✅ Kuruldu, DNS bekliyor |

Her biri gelen yolu koruyarak yönlendirir:
`lamozza.org/dugun/` → `https://www.lamozza.com.tr/dugun/`
Arama motorlarına `noindex` verilir, kopya içerik sorunu olmaz.

---

## ⏳ Kalan tek adım: isimtescil'de DNS

**Her üç alan adı için** (`lamozza.org`, `lamozza.xyz`, `lamozza.tr`):

1. `Panel → Domainlerim → <alan adı> → Başka Adrese Yönlendirme` → **yönlendirmeyi kaldır**
   (yoksa DNS'i kendi sunucusuna geri çeker)
2. `Panel → Domainlerim → <alan adı> → IP Bazlı DNS Yönetimi` → şu kayıtlar:

| Tip | Ad | Değer |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `aliakc21.github.io` |

**Ve `lamozza.com.tr` için** hatalı kaydın düzeltilmesi:

```
185.199.111.15    ❌  →  185.199.111.153   ✅
```

DNS yayılınca (24 saate kadar) GitHub sertifikaları otomatik üretir; ben
`Enforce HTTPS`'i açarım ve beş adresin beşi de güvenli olur.

> ⚠️ **Apex (kök) kayıtlar panelde korumalı** — silme "başarılı" der ama kayıt
> kalır, düzenleme kaydedilmez. Bu yüzden bu adımları büyük ihtimalle
> **isimtescil desteğinin** yapması gerekiyor. Hazır talep metni aşağıda.

---

## 📧 isimtescil'e gönderilecek metin (Ticket 2302904'e ek)

> Merhaba,
>
> Üye ID: 201898
>
> **1)** `lamozza.com.tr` için girilen A kayıtlarından biri hatalı:
> `185.199.111.15` → doğrusu **`185.199.111.153`** (sonunda 3 eksik).
> O IP GitHub'a ait değil, `500 Domain Not Found` dönüyor ve kök alan adı
> için SSL sertifikası üretilemiyor.
>
> **2)** `lamozza.org`, `lamozza.xyz` ve `lamozza.tr` alan adlarında
> **"Başka Adrese Yönlendirme" özelliğini kaldırıp** DNS kayıtlarını
> aşağıdaki gibi güncelleyebilir misiniz? (Bu üç alan adını da GitHub
> Pages üzerinden SSL'li yönlendireceğim; sizin yönlendirme sunucunuz
> 443 portunda sertifika sunmadığı için `https://lamozza.org` çalışmıyor.)
>
> ```
> A      @      185.199.108.153
> A      @      185.199.109.153
> A      @      185.199.110.153
> A      @      185.199.111.153
> CNAME  www    aliakc21.github.io
> ```
>
> **3)** Kök (apex) kayıtları panelden düzenleyemiyorum: silme işleminde
> "işlem başarılı" mesajı çıkıyor ama kayıt kalıyor, kalem ikonuyla
> düzenleyip kaydettiğimde de değişiklik uygulanmıyor. Alt alan adı
> kayıtlarında aynı işlemler sorunsuz çalışıyor.
>
> Teşekkürler.

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
