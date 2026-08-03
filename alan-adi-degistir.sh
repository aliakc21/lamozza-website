#!/bin/bash
# La Mozza — sitenin yayın alan adını değiştirir.
#
# Kullanım:
#   ./alan-adi-degistir.sh lamozza.com.tr        # .com.tr'ye taşı (nihai hedef)
#   ./alan-adi-degistir.sh lamozza.org           # geçici olarak .org'a taşı
#
# Ne yapar:
#   1) Tüm sayfalardaki canonical / og:url / twitter / JSON-LD adreslerini değiştirir
#   2) sitemap.xml, robots.txt, llms.txt, CNAME içindeki adresi değiştirir
#   3) Değişikliği commit'ler ve GitHub'a gönderir
#   4) GitHub Pages özel alan adını günceller
#
# NOT: DNS kayıtlarını bu betik DEĞİŞTİRMEZ; onlar isimtescil panelinden yapılır.

set -euo pipefail
cd "$(dirname "$0")"

YENI="${1:-}"
if [ -z "$YENI" ]; then
  echo "Kullanım: $0 <yeni-alan-adi>   (örn: lamozza.com.tr)" >&2
  exit 1
fi

ESKI=$(cat CNAME 2>/dev/null | tr -d '\n' || echo "")
if [ -z "$ESKI" ]; then
  echo "CNAME dosyası boş/yok, mevcut alan adı okunamadı." >&2
  exit 1
fi

if [ "$ESKI" = "$YENI" ]; then
  echo "Zaten $YENI kullanılıyor, yapılacak bir şey yok."
  exit 0
fi

echo "═══ $ESKI  →  $YENI ═══"
echo

# 1) Tüm metin dosyalarında değiştir
SAYI=0
while IFS= read -r -d '' f; do
  if grep -q "$ESKI" "$f" 2>/dev/null; then
    # BSD sed (macOS) uyumlu
    sed -i '' "s|$ESKI|$YENI|g" "$f"
    SAYI=$((SAYI+1))
    echo "  ✓ ${f#./}"
  fi
done < <(find . \
  \( -name '*.html' -o -name '*.xml' -o -name '*.txt' -o -name '*.json' -o -name '*.md' -o -name 'CNAME' \) \
  -not -path './.git/*' -not -path './.claude/*' -print0)

echo
echo "$SAYI dosya güncellendi."

# 2) Doğrulama — eski alan adı kaldı mı
KALAN=$(grep -rl "$ESKI" --include='*.html' --include='*.xml' --include='*.txt' --include='*.json' \
  --exclude-dir=.git --exclude-dir=.claude . 2>/dev/null | wc -l | tr -d ' ')
if [ "$KALAN" != "0" ]; then
  echo "⚠ UYARI: $KALAN dosyada hâlâ $ESKI geçiyor:" >&2
  grep -rl "$ESKI" --include='*.html' --include='*.xml' --include='*.txt' --include='*.json' \
    --exclude-dir=.git --exclude-dir=.claude . 2>/dev/null >&2
fi

# 3) Commit + push
git add -A
git -c user.name="AliAkc" -c user.email="maliakcadag@gmail.com" \
    commit -q -m "Yayın alan adı: $ESKI → $YENI" || echo "(değişiklik yok)"
git push -q origin main
echo "✓ GitHub'a gönderildi."

# 4) GitHub Pages özel alan adı
if command -v gh >/dev/null 2>&1; then
  gh api -X PUT "repos/aliakc21/lamozza-website/pages" -f "cname=$YENI" >/dev/null 2>&1 \
    && echo "✓ GitHub Pages özel alan adı: $YENI" \
    || echo "⚠ Pages alan adı güncellenemedi, elle: Settings → Pages → Custom domain"
fi

echo
echo "═══ SIRADAKİ ═══"
echo "  1. isimtescil'de $YENI için DNS kayıtları:"
echo "       A      @      185.199.108.153"
echo "       A      @      185.199.109.153"
echo "       A      @      185.199.110.153"
echo "       A      @      185.199.111.153"
echo "       CNAME  www    aliakc21.github.io"
echo "  2. Yayılmayı kontrol et:   dig +short $YENI"
echo "  3. GitHub → Settings → Pages → Enforce HTTPS (DNS yayıldıktan ~15 dk sonra)"
echo "  4. Diğer alan adlarını $YENI'ye Standart (301) yönlendir"
