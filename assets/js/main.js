/* ==========================================================================
   La Mozza İncek — main.js
   Bağımlılık yok. Tüm efektler prefers-reduced-motion'a saygı duyar.
   ========================================================================== */
(function () {
  'use strict';

  var AZ_HAREKET = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- 1. Nav */
  var ust = $('.ust');
  if (ust) {
    var sabitle = function () {
      ust.classList.toggle('ust--sabit', window.scrollY > 24);
    };
    sabitle();
    window.addEventListener('scroll', sabitle, { passive: true });
  }

  /* Mobil menü */
  var menuBtn = $('.menu-btn');
  var mobil   = $('.mobil');
  if (menuBtn && mobil) {
    var kapat = function () {
      document.body.classList.remove('menu-acik');
      document.body.style.overflow = '';
      menuBtn.setAttribute('aria-expanded', 'false');
    };
    menuBtn.addEventListener('click', function () {
      var acik = document.body.classList.toggle('menu-acik');
      document.body.style.overflow = acik ? 'hidden' : '';
      menuBtn.setAttribute('aria-expanded', acik ? 'true' : 'false');
    });
    $$('a', mobil).forEach(function (a) { a.addEventListener('click', kapat); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-acik')) kapat();
    });
  }

  /* Masaüstü açılır menü */
  $$('.nav__alt').forEach(function (grup) {
    var btn = $('button', grup);
    if (!btn) return;
    var ac = function (durum) {
      grup.setAttribute('data-acik', durum ? 'true' : 'false');
      btn.setAttribute('aria-expanded', durum ? 'true' : 'false');
    };
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      ac(grup.getAttribute('data-acik') !== 'true');
    });
    grup.addEventListener('mouseenter', function () { ac(true); });
    grup.addEventListener('mouseleave', function () { ac(false); });
    grup.addEventListener('focusout', function (e) {
      if (!grup.contains(e.relatedTarget)) ac(false);
    });
    document.addEventListener('click', function (e) {
      if (!grup.contains(e.target)) ac(false);
    });
  });

  /* ------------------------------------------------- 2. Scroll reveal */
  /* Kaydırma konumundan hesaplanır. IntersectionObserver'a bağlı değil:
     bazı gömülü tarayıcılarda ve otomasyon bağlamlarında IO hiç tetiklenmiyor
     ve içerik kalıcı olarak görünmez kalıyordu. Bu yöntem her koşulda çalışır.
     Maliyeti önemsiz — her tarama yalnızca kalan öğeler için rect okur ve
     tüm öğeler açıldığında dinleyiciler tamamen kaldırılır. */
  var acilanlar = $$('.ac, .kay');
  if (acilanlar.length) {
    if (AZ_HAREKET) {
      acilanlar.forEach(function (el) { el.classList.add('gorundu'); });
    } else {
      var kalan = acilanlar.slice();
      var bekle = false;
      var nabiz = null;

      var tara = function () {
        bekle = false;
        var esik = window.innerHeight * 0.92;
        for (var i = kalan.length - 1; i >= 0; i--) {
          var r = kalan[i].getBoundingClientRect();
          if (r.top < esik && r.bottom > 0) {
            kalan[i].classList.add('gorundu');
            kalan.splice(i, 1);
          }
        }
        if (!kalan.length) {
          window.removeEventListener('scroll', tetik);
          window.removeEventListener('resize', tetik);
          if (nabiz) { clearInterval(nabiz); nabiz = null; }
        }
      };

      var tetik = function () {
        if (bekle) return;
        bekle = true;
        if (window.requestAnimationFrame) window.requestAnimationFrame(tara);
        else setTimeout(tara, 16);
      };

      window.addEventListener('scroll', tetik, { passive: true });
      window.addEventListener('resize', tetik, { passive: true });
      /* rAF'ın çalışmadığı bağlamlarda ilerlemeyi garantiye alan yavaş nabız */
      nabiz = setInterval(tara, 400);
      tara();
    }
  }

  /* ------------------------------------------------- 3. Hero sekmeleri */
  var sekmeKap = $('.hero__sekme');
  if (sekmeKap) {
    var sekmeler = $$('button', sekmeKap);
    var paneller = $$('.hero__panel');
    var aktifNo  = 0;
    var zaman    = null;

    var sec = function (i, kullanici) {
      aktifNo = i;
      sekmeler.forEach(function (b, n) {
        b.setAttribute('aria-selected', n === i ? 'true' : 'false');
        b.setAttribute('tabindex', n === i ? '0' : '-1');
      });
      paneller.forEach(function (p, n) {
        if (n === i) { p.removeAttribute('hidden'); }
        else { p.setAttribute('hidden', ''); }
      });
      if (kullanici) dur();
    };

    var dur = function () { if (zaman) { clearInterval(zaman); zaman = null; } };
    var basla = function () {
      if (AZ_HAREKET || zaman) return;
      zaman = setInterval(function () { sec((aktifNo + 1) % sekmeler.length); }, 9000);
    };

    sekmeler.forEach(function (b, n) {
      b.addEventListener('click', function () { sec(n, true); });
      b.addEventListener('keydown', function (e) {
        var y = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!y) return;
        e.preventDefault();
        var yeni = (n + y + sekmeler.length) % sekmeler.length;
        sec(yeni, true);
        sekmeler[yeni].focus();
      });
    });
    sekmeKap.closest('.hero').addEventListener('mouseenter', dur);
    sec(0);
    basla();
  }

  /* --------------------------------------------- 4. Alanlar turu (pinned)
     Kaydırma konumundan hesaplanır — IntersectionObserver'a bağlı değil.
     Ekranın ortasına en yakın adım hangisiyse o alanın görseli açılır. */
  var tur = $('.tur');
  if (tur) {
    var adimlar = $$('.tur__adim', tur);
    var katlar  = $$('.tur__kat', tur);

    if (adimlar.length && katlar.length) {
      var sonAktif = -1;

      var turHesapla = function () {
        var merkez = window.innerHeight / 2;
        var enIyi = 0, enYakin = Infinity;
        for (var i = 0; i < adimlar.length; i++) {
          var r = adimlar[i].getBoundingClientRect();
          var uzaklik = Math.abs((r.top + r.bottom) / 2 - merkez);
          if (uzaklik < enYakin) { enYakin = uzaklik; enIyi = i; }
        }
        if (enIyi === sonAktif) return;
        sonAktif = enIyi;
        for (var n = 0; n < katlar.length; n++) {
          katlar[n].setAttribute('data-aktif', n === enIyi ? 'true' : 'false');
        }
      };

      /* Doğrudan hesaplanır: yalnızca 4 getBoundingClientRect okuması —
         rAF kuyruğuna bağlı kalmadan her kaydırmada kesin sonuç verir. */
      var turTetikle = turHesapla;

      /* Sahne görselleri opacity:0 kutularda durduğu için tarayıcı tembel
         yüklemeyi erteleyebiliyor; tur görüş alanına girince zorla yükle. */
      var gorselleriAc = function () {
        $$('.tur__kat img', tur).forEach(function (im) {
          if (im.getAttribute('loading') === 'lazy') {
            im.setAttribute('loading', 'eager');
            im.src = im.src; /* yüklemeyi tetikler */
          }
        });
      };
      var yuklemeKontrol = function () {
        var r = tur.getBoundingClientRect();
        if (r.top < window.innerHeight * 2 && r.bottom > -window.innerHeight) {
          gorselleriAc();
          window.removeEventListener('scroll', yuklemeKontrol);
        }
      };
      yuklemeKontrol();
      window.addEventListener('scroll', yuklemeKontrol, { passive: true });

      window.addEventListener('scroll', turTetikle, { passive: true });
      window.addEventListener('resize', turTetikle, { passive: true });
      turHesapla();
    }
  }

  /* ------------------------------------------------- 5. Yatay şerit oku */
  $$('[data-serit]').forEach(function (kontrol) {
    var hedef = $('#' + kontrol.getAttribute('data-serit'));
    if (!hedef) return;
    $$('button', kontrol).forEach(function (b) {
      b.addEventListener('click', function () {
        var ilk = hedef.firstElementChild;
        var adim = ilk ? ilk.getBoundingClientRect().width + 16 : hedef.clientWidth * 0.8;
        hedef.scrollBy({ left: b.getAttribute('data-yon') === 'sonraki' ? adim : -adim, behavior: AZ_HAREKET ? 'auto' : 'smooth' });
      });
    });
  });

  /* ------------------------------------------------------- 6. Lightbox */
  var kutu = $('.kutu');
  if (kutu) {
    var kutuImg = $('img', kutu);
    var kutuCap = $('figcaption', kutu);
    var liste = [];
    var sira = 0;

    var goster = function (i) {
      if (!liste.length) return;
      sira = (i + liste.length) % liste.length;
      var kaynak = liste[sira];
      kutuImg.src = kaynak.src;
      kutuImg.alt = kaynak.alt;
      kutuCap.textContent = kaynak.cap || kaynak.alt || '';
    };
    var kutuAc = function () {
      kutu.setAttribute('data-acik', 'true');
      document.body.style.overflow = 'hidden';
      $('.kutu__kapat', kutu).focus();
    };
    var kutuKapat = function () {
      kutu.setAttribute('data-acik', 'false');
      document.body.style.overflow = '';
    };

    var tazele = function () {
      liste = $$('[data-kutu]').filter(function (el) {
        var im = el.tagName === 'IMG' ? el : $('img', el);
        return im && im.currentSrc !== '' && !im.hasAttribute('data-yok');
      }).map(function (el) {
        var im = el.tagName === 'IMG' ? el : $('img', el);
        return { src: im.currentSrc || im.src, alt: im.alt || '', cap: el.getAttribute('data-kutu') };
      });
    };

    $$('[data-kutu]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var im = el.tagName === 'IMG' ? el : $('img', el);
        if (!im || im.hasAttribute('data-yok')) return; /* foto yoksa açma */
        e.preventDefault();
        tazele();
        var bu = liste.findIndex(function (k) { return k.src === (im.currentSrc || im.src); });
        goster(bu < 0 ? 0 : bu);
        kutuAc();
      });
    });

    $('.kutu__kapat', kutu).addEventListener('click', kutuKapat);
    kutu.addEventListener('click', function (e) { if (e.target === kutu) kutuKapat(); });
    $$('.kutu__gez', kutu).forEach(function (b) {
      b.addEventListener('click', function () {
        goster(sira + (b.getAttribute('data-yon') === 'sonraki' ? 1 : -1));
      });
    });
    document.addEventListener('keydown', function (e) {
      if (kutu.getAttribute('data-acik') !== 'true') return;
      if (e.key === 'Escape') kutuKapat();
      if (e.key === 'ArrowRight') goster(sira + 1);
      if (e.key === 'ArrowLeft')  goster(sira - 1);
    });
  }

  /* ------------------------------------ 7. Görsel yoksa yer tutucuyu bırak
     Fotoğraflar henüz yüklenmemişse tarayıcının kırık-görsel ikonu yerine
     tasarlanmış yer tutucu görünür. Gerçek dosya konduğu an kendiliğinden devreye girer. */
  $$('img').forEach(function (im) {
    var kaynak = im.getAttribute('src') || '';
    if (kaynak.indexOf('/assets/img/') !== 0) return;
    var bitir = function () {
      im.setAttribute('data-yok', '');
      if (im.parentNode) im.remove();
    };
    if (im.complete && im.naturalWidth === 0 && kaynak) { bitir(); return; }
    im.addEventListener('error', bitir);
  });

  /* --------------------------------------------------- 8. Hero medyası */
  var heroMedya = $('.hero__medya');
  if (heroMedya) {
    /* Geniş tek fotoğraf (hero.jpg) varsa o kullanılır ve triptik gizlenir;
       yoksa üç dikey panel gösterilir. */
    var heroImg = heroMedya.querySelector(':scope > img');
    if (heroImg) {
      var acHero = function () {
        heroImg.classList.add('yuklendi');
        heroMedya.setAttribute('data-tek', 'true');
      };
      if (heroImg.complete) {
        if (heroImg.naturalWidth > 0) acHero(); else heroImg.remove();
      } else {
        heroImg.addEventListener('load', acHero);
        heroImg.addEventListener('error', function () { heroImg.remove(); });
      }
    }
    $$('.hero__uclu img').forEach(function (im) {
      var ac = function () { im.classList.add('yuklendi'); };
      if (im.complete) {
        if (im.naturalWidth > 0) ac(); else im.remove();
      } else {
        im.addEventListener('load', ac);
        im.addEventListener('error', function () { im.remove(); });
      }
    });
    /* Video: sadece geniş ekranda, kullanıcı hareket istiyorsa, ve dosya varsa yüklenir */
    var vid = $('video[data-src]', heroMedya);
    if (vid && !AZ_HAREKET && window.matchMedia('(min-width:1024px)').matches) {
      window.addEventListener('load', function () {
        vid.src = vid.getAttribute('data-src');
        vid.addEventListener('loadeddata', function () { vid.classList.add('yuklendi'); });
        vid.addEventListener('error', function () { vid.remove(); });
      });
    } else if (vid) {
      vid.remove();
    }
  }

  /* ------------------------------------- 9. Randevu formu → WhatsApp / e-posta */
  var form = $('#randevu-form');
  if (form) {
    var WA = form.getAttribute('data-wa') || '905330143853';
    var EPOSTA = form.getAttribute('data-eposta') || 'info@lamozza.com.tr';

    var metinKur = function () {
      var v = function (ad) {
        var el = form.elements[ad];
        if (!el) return '';
        if (el.tagName === 'SELECT') {
          return el.selectedIndex > 0 ? el.options[el.selectedIndex].text : '';
        }
        return (el.value || '').trim();
      };
      var satirlar = [
        'Merhaba, La Mozza İncek için bilgi ve fiyat teklifi almak istiyorum.',
        '',
        'Ad Soyad: ' + (v('ad') || '—'),
        'Telefon: ' + (v('telefon') || '—')
      ];
      if (v('eposta'))   satirlar.push('E-posta: ' + v('eposta'));
      if (v('tur'))      satirlar.push('Etkinlik Türü: ' + v('tur'));
      if (v('tarih'))    satirlar.push('Tarih: ' + v('tarih'));
      else if (v('tarih_esnek')) satirlar.push('Tarih: Henüz netleşmedi');
      if (v('kisi'))     satirlar.push('Tahmini Davetli: ' + v('kisi'));
      if (v('alan'))     satirlar.push('Tercih Edilen Alan: ' + v('alan'));
      if (v('ikram'))    satirlar.push('İkram Düzeni: ' + v('ikram'));
      if (v('mesaj'))    satirlar.push('', 'Not: ' + v('mesaj'));
      return satirlar.join('\n');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var metin = metinKur();
      var kanal = form.querySelector('[name="kanal"]:checked');
      var yol = kanal ? kanal.value : 'whatsapp';
      if (yol === 'eposta') {
        window.location.href = 'mailto:' + EPOSTA +
          '?subject=' + encodeURIComponent('Randevu / Fiyat Teklifi Talebi — La Mozza İncek') +
          '&body=' + encodeURIComponent(metin);
      } else {
        window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(metin), '_blank', 'noopener');
      }
      var geri = $('#form-geri');
      if (geri) {
        geri.textContent = yol === 'eposta'
          ? 'E-posta uygulamanız açılıyor — mesajı gönderdiğinizde talebiniz bize ulaşacak.'
          : 'WhatsApp açılıyor — hazır mesajı göndermeniz yeterli. En kısa sürede dönüş yapıyoruz.';
        geri.hidden = false;
      }
    });

    /* Tarih esnek işaretlenince tarih alanını gevşet */
    var esnek = form.elements['tarih_esnek'];
    var tarih = form.elements['tarih'];
    if (esnek && tarih) {
      esnek.addEventListener('change', function () {
        tarih.disabled = esnek.checked;
        if (esnek.checked) tarih.value = '';
      });
    }
  }

  /* ---------------------------- 10. Sayfa içi bağlam duyarlı WhatsApp metni */
  var wsBaglam = document.body.getAttribute('data-wa-metin');
  if (wsBaglam) {
    $$('a[href*="wa.me/"]').forEach(function (a) {
      if (a.hasAttribute('data-wa-sabit')) return;
      var temel = a.getAttribute('href').split('?')[0];
      a.setAttribute('href', temel + '?text=' + encodeURIComponent(wsBaglam));
    });
  }

  /* ------------------- 11. Canlı Instagram akışı varsa sabit ızgarayı devre dışı bırak
     Varsayılan: kendi sunucumuzdaki gerçek gönderi ızgarası görünür (üçüncü taraf yok).
     Elfsight widget'ı sonradan eklenirse yüklendiği an ızgara gizlenir. */
  var igYuva = $('.ig-yuva');
  if (igYuva) {
    var igKontrol = function () {
      var dolu = igYuva.querySelector('iframe, [class*="eapps"], canvas');
      if (dolu) {
        igYuva.setAttribute('data-canli', 'true');
        /* Elfsight ücretsiz plan bandını temizle */
        $$('a[href*="elfsight.com"]', igYuva).forEach(function (a) {
          var p = a.parentElement;
          if (p && p.children.length <= 3 && /elfsight|instagram feed widget/i.test(p.textContent || '')) {
            p.style.display = 'none';
          }
        });
        return true;
      }
      return false;
    };
    if (!igKontrol()) {
      var denemeler = 0;
      var zamanlayici = setInterval(function () {
        if (igKontrol() || ++denemeler > 12) clearInterval(zamanlayici);
      }, 700);
    }
  }

  /* ------------------------------------------------ 12. Aktif menü işareti */
  var yol = window.location.pathname.replace(/\/index\.html$/, '/');
  $$('.nav a, .mobil__nav a').forEach(function (a) {
    var h = a.getAttribute('href') || '';
    if (h === '/' || h === '' || h.charAt(0) === '#') return;
    var hedefYol = h.replace(/^\.\.?/, '').replace(/\/index\.html$/, '/');
    if (yol.indexOf(hedefYol) === 0 && hedefYol.length > 1) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* -------------------------------------- 13. Yıl (footer telif) */
  $$('[data-yil]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
