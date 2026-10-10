/* Modelo de prévia — Fábrica DL. Sem bibliotecas. Configuração em window.SITE (escrita pelo gerador). */
(function () {
  var S = window.SITE || {};
  var d = document;
  d.documentElement.classList.remove('no-js');
  window.dataLayer = window.dataLayer || [];

  // WhatsApp: todo [data-wa] vira link com mensagem pronta + evento de conversão (GTM / Google Ads)
  d.querySelectorAll('[data-wa]').forEach(function (a) {
    var msg = a.getAttribute('data-wa') || S.msg;
    a.href = 'https://wa.me/' + S.wa + '?text=' + encodeURIComponent(msg);
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', function () {
      window.dataLayer.push({ event: 'whatsapp_click', wa_local: a.getAttribute('data-local') || 'site', wa_msg: msg });
      if (typeof window.gtag === 'function' && S.adsConversion) window.gtag('event', 'conversion', { send_to: S.adsConversion });
    });
  });
  d.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () { window.dataLayer.push({ event: 'phone_click' }); });
  });

  // topo com sombra depois de rolar + botão flutuante depois do hero (some no contato)
  var top = d.querySelector('.topbar'), hero = d.querySelector('.hero'), fl = d.querySelector('.wa-float'), contato = d.getElementById('contato');
  var contatoVisivel = false;
  function onScroll() {
    var y = window.scrollY;
    top && top.classList.toggle('is-scrolled', y > 10);
    if (fl && hero) fl.classList.toggle('is-on', y > hero.offsetHeight * .7 && !contatoVisivel);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!('IntersectionObserver' in window)) {
    d.querySelectorAll('.rv,.rv-img').forEach(function (e) { e.classList.add('in'); });
    return;
  }
  // revelações
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  d.querySelectorAll('.rv,.rv-img').forEach(function (e) { io.observe(e); });

  // menu ativo
  var links = [].slice.call(d.querySelectorAll('.menu a'));
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(function (l) { var s = d.querySelector(l.getAttribute('href')); s && spy.observe(s); });

  // contato visível: esconde o botão flutuante; mapa só carrega perto da tela
  if (contato) new IntersectionObserver(function (es) { contatoVisivel = es[0].isIntersecting; onScroll(); }, { threshold: .15 }).observe(contato);
  var map = d.querySelector('.map[data-src]');
  function loadMap() {
    if (!map || map.querySelector('iframe')) return;
    var f = d.createElement('iframe');
    f.src = map.getAttribute('data-src'); f.title = map.getAttribute('data-title') || 'Mapa'; f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    map.appendChild(f);
    var b = map.querySelector('.map__btn'); b && b.remove();
  }
  if (map) {
    new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { loadMap(); o.disconnect(); } }, { rootMargin: '300px' }).observe(map);
    var mb = map.querySelector('.map__btn'); mb && mb.addEventListener('click', loadMap);
  }
})();
