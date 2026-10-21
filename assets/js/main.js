/* OIANE · Peluquería y Bienestar — interacciones */
(function () {
  'use strict';

  /* ---------- Configuración de reservas ----------
     Cuando el salón active la reserva online en Fresha, basta con
     sustituir FRESHA_URL por la URL de reserva que les facilite Fresha.
     Todos los botones con la clase .enlace-fresha se actualizan solos. */
  var FRESHA_URL = 'https://www.fresha.com/es/lvp/oiane-peluqueria-unisex-calle-del-puig-rafelbunyol-oowje8';
  var TELEFONO = '34620661404';
  var MENSAJE_WA = 'Hola Oiane, me gustaría reservar una cita. ¿Qué disponibilidad tenéis?';

  document.querySelectorAll('.enlace-fresha').forEach(function (a) {
    a.href = FRESHA_URL;
    a.target = '_blank';
    a.rel = 'noopener';
  });
  document.querySelectorAll('.enlace-whatsapp').forEach(function (a) {
    var texto = a.getAttribute('data-mensaje') || MENSAJE_WA;
    a.href = 'https://wa.me/' + TELEFONO + '?text=' + encodeURIComponent(texto);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Menú móvil ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.menu');
  function cerrarMenu() {
    if (!burger || !menu) return;
    burger.classList.remove('abierto');
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('abierto');
    document.body.style.overflow = '';
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var abierto = !menu.classList.contains('abierto');
      burger.classList.toggle('abierto', abierto);
      burger.setAttribute('aria-expanded', String(abierto));
      menu.classList.toggle('abierto', abierto);
      document.body.style.overflow = abierto ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', cerrarMenu); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) cerrarMenu(); });
  }

  /* ---------- Cabecera compacta ---------- */
  var cabecera = document.querySelector('.cabecera');
  if (cabecera) {
    var actualizar = function () { cabecera.classList.toggle('compacta', window.scrollY > 24); };
    window.addEventListener('scroll', actualizar, { passive: true });
    actualizar();
  }

  /* ---------- Enlace activo ---------- */
  var pagina = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(function (a) {
    if (a.getAttribute('href') === pagina) a.classList.add('activo');
  });

  /* ---------- Aparición al hacer scroll ---------- */
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sinAnimacion = /[?&]sin-animacion/.test(location.search);
  var elementos = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window && !reducir && !sinAnimacion) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    elementos.forEach(function (el) { obs.observe(el); });
  } else {
    elementos.forEach(function (el) { el.style.transition = 'none'; el.classList.add('visible'); });
  }

  /* ---------- Horario: día actual y estado ---------- */
  var hoy = new Date();
  var dia = hoy.getDay(); /* 0 = domingo */
  document.querySelectorAll('.tabla-horario tr[data-dia]').forEach(function (fila) {
    if (parseInt(fila.getAttribute('data-dia'), 10) === dia) fila.classList.add('hoy');
  });
  var estado = document.querySelectorAll('.estado-apertura');
  if (estado.length) {
    var minutos = hoy.getHours() * 60 + hoy.getMinutes();
    var abreHoy = dia >= 2 && dia <= 5; /* martes a viernes */
    var abierto = abreHoy && minutos >= 600 && minutos < 1200;
    estado.forEach(function (el) {
      el.classList.toggle('cerrado', !abierto);
      el.textContent = abierto ? 'Abierto ahora · cierra a las 20:00' : (abreHoy && minutos < 600 ? 'Cerrado · abre hoy a las 10:00' : 'Cerrado ahora · martes a viernes de 10:00 a 20:00');
    });
  }

  /* ---------- Vídeos (reels) ---------- */
  document.querySelectorAll('.video-reel').forEach(function (caja) {
    var video = caja.querySelector('video');
    var boton = caja.querySelector('.video-reel__play');
    if (!video) return;
    function reproducir() {
      document.querySelectorAll('.video-reel video').forEach(function (v) {
        if (v !== video && !v.paused) { v.pause(); v.closest('.video-reel').classList.remove('reproduciendo'); }
      });
      video.muted = false;
      video.play();
      caja.classList.add('reproduciendo');
    }
    if (boton) boton.addEventListener('click', reproducir);
    video.addEventListener('pause', function () { caja.classList.remove('reproduciendo'); });
    video.addEventListener('ended', function () { caja.classList.remove('reproduciendo'); });
    video.addEventListener('play', function () { caja.classList.add('reproduciendo'); });
  });

  /* ---------- Galería: filtros ---------- */
  var filtros = document.querySelectorAll('.filtros button');
  var piezas = Array.prototype.slice.call(document.querySelectorAll('.pieza-galeria'));
  filtros.forEach(function (b) {
    b.addEventListener('click', function () {
      filtros.forEach(function (x) { x.classList.remove('activo'); });
      b.classList.add('activo');
      var cat = b.getAttribute('data-filtro');
      piezas.forEach(function (p) {
        p.classList.toggle('oculta', cat !== 'todo' && p.getAttribute('data-categoria') !== cat);
      });
    });
  });

  /* ---------- Galería: visor ---------- */
  var conGrande = piezas.filter(function (p) { return p.getAttribute('data-grande'); });
  if (conGrande.length) {
    var visor = document.createElement('div');
    visor.className = 'visor';
    visor.setAttribute('role', 'dialog');
    visor.setAttribute('aria-label', 'Visor de imágenes');
    visor.innerHTML =
      '<button class="visor__cerrar" aria-label="Cerrar">&times;</button>' +
      '<button class="visor__ant" aria-label="Anterior">&#8249;</button>' +
      '<img alt="">' +
      '<button class="visor__sig" aria-label="Siguiente">&#8250;</button>' +
      '<div class="visor__pie"></div>';
    document.body.appendChild(visor);
    var img = visor.querySelector('img');
    var pie = visor.querySelector('.visor__pie');
    var indice = 0;
    function visibles() { return conGrande.filter(function (p) { return !p.classList.contains('oculta'); }); }
    function mostrar(i) {
      var lista = visibles();
      if (!lista.length) return;
      indice = (i + lista.length) % lista.length;
      var p = lista[indice];
      img.src = p.getAttribute('data-grande');
      img.alt = p.querySelector('img') ? p.querySelector('img').alt : '';
      pie.textContent = (p.querySelector('figcaption') ? p.querySelector('figcaption').textContent + ' · ' : '') + (indice + 1) + ' / ' + lista.length;
    }
    function abrir(p) {
      indice = visibles().indexOf(p);
      mostrar(indice);
      visor.classList.add('abierto');
      document.body.style.overflow = 'hidden';
    }
    function cerrar() { visor.classList.remove('abierto'); document.body.style.overflow = ''; }
    conGrande.forEach(function (p) { p.addEventListener('click', function () { abrir(p); }); });
    visor.querySelector('.visor__cerrar').addEventListener('click', cerrar);
    visor.querySelector('.visor__ant').addEventListener('click', function () { mostrar(indice - 1); });
    visor.querySelector('.visor__sig').addEventListener('click', function () { mostrar(indice + 1); });
    visor.addEventListener('click', function (e) { if (e.target === visor) cerrar(); });
    document.addEventListener('keydown', function (e) {
      if (!visor.classList.contains('abierto')) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowLeft') mostrar(indice - 1);
      if (e.key === 'ArrowRight') mostrar(indice + 1);
    });
  }

  /* ---------- Año en el pie ---------- */
  document.querySelectorAll('.anyo').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* Filtros de la página de opiniones */
(function () {
  var botones = document.querySelectorAll('[data-filtro-opinion]');
  if (!botones.length) return;
  var opiniones = Array.prototype.slice.call(document.querySelectorAll('.opinion'));
  var vacio = document.querySelector('.opiniones__vacio');
  botones.forEach(function (b) {
    b.addEventListener('click', function () {
      botones.forEach(function (x) { x.classList.remove('activo'); });
      b.classList.add('activo');
      var f = b.getAttribute('data-filtro-opinion');
      var visibles = 0;
      opiniones.forEach(function (o) {
        var mostrar = f === 'todo' ||
          (f === 'texto' && o.getAttribute('data-texto') === '1') ||
          (f === '5' && o.getAttribute('data-estrellas') === '5') ||
          (f === 'recientes' && o.getAttribute('data-reciente') === '1');
        o.classList.toggle('oculta', !mostrar);
        if (mostrar) visibles++;
      });
      if (vacio) vacio.hidden = visibles > 0;
    });
  });
})();
