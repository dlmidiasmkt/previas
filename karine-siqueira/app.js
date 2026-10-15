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

  // "Aberto agora · fecha às 18h" / "Fechado agora · abre amanhã às 8h" (horário de Brasília) — dá urgência para chamar já
  var ag = d.querySelector('.agora');
  if (ag && S.horas && S.horas.length) {
    try {
      var DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var p = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      var hoje = DIAS.indexOf(p.weekday), agora = (+p.hour) * 60 + (+p.minute);
      var min = function (h) { var a = h.split(':'); return (+a[0]) * 60 + (+a[1]); };
      var hora = function (h) { var a = h.split(':'); return (+a[0]) + 'h' + (a[1] === '00' ? '' : a[1]); };
      var doDia = function (i) { return S.horas.filter(function (h) { return h.d.indexOf(DIAS[i]) >= 0; })[0]; };
      var h = doDia(hoje), txt, aberto = false;
      if (h && h.a === '00:00' && min(h.f) >= 1439) { aberto = true; txt = 'Aberto agora · atende 24 horas'; }
      else if (h && agora >= min(h.a) && agora < min(h.f)) { aberto = true; txt = 'Aberto agora · fecha às ' + hora(h.f); }
      else if (h && agora < min(h.a)) txt = 'Fechado agora · abre hoje às ' + hora(h.a);
      else for (var k = 1; k <= 7; k++) { var o = doDia((hoje + k) % 7); if (o) { txt = 'Fechado agora · abre ' + (k === 1 ? 'amanhã' : ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][(hoje + k) % 7]) + ' às ' + hora(o.a); break; } }
      if (txt) { ag.textContent = txt; ag.classList.add(aberto ? 'is-open' : 'is-closed'); ag.hidden = false; }
    } catch (e) {}
  }

  // Só no endereço publicado da prévia (github.io): conta a visita e mostra a faixa "Quero este site" para o dono do negócio.
  // Quem já abriu o painel (localStorage "previas-eu", mesmo endereço) não conta nem vê a faixa; ?faixa=1 força a faixa.
  var LS = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var SS = function (k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } };
  var publicado = /github.io$/.test(location.hostname), eu = !!LS('previas-eu'), forca = /[?&]faixa=1/.test(location.search);
  var conta = function (k) { if (publicado && !eu && S.slug) try { fetch('https://abacus.jasoncameron.dev/hit/dlprevias/' + S.slug + k, { keepalive: true }).catch(function () {}); } catch (e) {} };
  if (!SS('dl-vis')) { SS('dl-vis', '1'); conta(''); }
  if (S.dl && S.dl.wa && ((publicado && !eu) || forca) && !SS('dl-faixa-x')) {
    var fx = d.createElement('aside');
    fx.className = 'dl-faixa'; fx.setAttribute('aria-label', 'Sobre esta prévia');
    fx.innerHTML = '<p><b>✨ Prévia criada pelo ' + S.dl.autor + ' para ' + S.dl.nome + '.</b> <span>Gostou? Este site pode ser seu.</span></p>' +
      '<a class="dl-faixa__btn" target="_blank" rel="noopener">Quero este site</a><button type="button" class="dl-faixa__x" aria-label="Fechar">×</button>';
    var btn = fx.querySelector('a');
    btn.href = 'https://wa.me/' + S.dl.wa + '?text=' + encodeURIComponent('Oi, ' + S.dl.autor + '! Vi a prévia do site ' + S.dl.doNome + ' e gostei 😊 Me conta como funciona?');
    btn.addEventListener('click', function () { conta('-quero'); window.dataLayer.push({ event: 'quero_site' }); });
    fx.querySelector('button').addEventListener('click', function () { fx.classList.remove('is-on'); d.documentElement.classList.remove('tem-faixa'); SS('dl-faixa-x', '1'); });
    d.body.appendChild(fx);
    var mostra = function () { if (fx.classList.contains('is-on') || SS('dl-faixa-x')) return; fx.classList.add('is-on'); d.documentElement.classList.add('tem-faixa'); };
    setTimeout(mostra, 7000);
    window.addEventListener('scroll', function () { if (window.scrollY > d.documentElement.scrollHeight * 0.3) mostra(); }, { passive: true });
  }

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
