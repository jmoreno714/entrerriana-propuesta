/* Partes comunes a todas las páginas: datos, barra, pie, carrito y avisos.
   Productos y precios de EJEMPLO para la maqueta. Reemplazar por el catálogo real. */
(() => {
  const CATS = [
    { id: "avicola", nombre: "Avícola", img: "img/sello-06.webp" },
    { id: "pescados", nombre: "Pescados y mariscos", img: "img/sello-07.webp" },
    { id: "rebozados", nombre: "Rebozados", img: "img/sello-09.webp" },
    { id: "huevos", nombre: "Huevos", img: null },
    { id: "envasados", nombre: "Envasados", img: "img/sello-08.webp" },
    { id: "verduras", nombre: "Frutas y verduras", img: "img/sello-10.webp" }
  ];
  const SUC = [
    { id: "smt", nombre: "San Miguel de Tucumán", dir: "Av. Roca 1973", ciudad: "San Miguel de Tucumán", tel: "(381) 551-3658" },
    { id: "con", nombre: "Concepción", dir: "24 de Septiembre 1599", ciudad: "Concepción", tel: "(03865) 425 997" },
    { id: "mon", nombre: "Monteros", dir: "Alberdi 191", ciudad: "Monteros", tel: null }
  ];
  const P = [
    ["avicola","Pollo entero","Por kg","refrigerado","menor",3490],
    ["avicola","Suprema de pollo","Por kg","refrigerado","menor",6990],
    ["avicola","Pata muslo","Por kg","refrigerado","menor",3990],
    ["avicola","Alitas de pollo","Por kg","congelado","menor",2890],
    ["avicola","Carne molida de pollo","Por kg","congelado","menor",3290],
    ["avicola","Suprema de pollo, caja","Caja x 15 kg","congelado","mayor",92000],
    ["avicola","Pata muslo IQF, caja","Caja x 15 kg","congelado","mayor",51500],
    ["avicola","Pollo entero, caja","Caja x 20 kg","congelado","mayor",64000],
    ["pescados","Filet de merluza","Por kg","congelado","menor",8490],
    ["pescados","Filet de merluza IQF, caja","Caja x 10 kg","congelado","mayor",78000],
    ["pescados","Filet de abadejo","Por kg","congelado","menor",11900],
    ["pescados","Filet de salmón rosado","Por kg","congelado","menor",15900],
    ["pescados","Langostinos enteros","Por kg","congelado","menor",16500],
    ["pescados","Rabas (anillas de calamar)","Por kg","congelado","menor",12400],
    ["pescados","Mejillones sin valva","Por kg","congelado","menor",9800],
    ["rebozados","Medallones de pollo","Bolsa x 1 kg","congelado","menor",5490],
    ["rebozados","Patitas de pollo","Bolsa x 1 kg","congelado","menor",4990],
    ["rebozados","Bastones de merluza","Bolsa x 1 kg","congelado","menor",7290],
    ["rebozados","Milanesas de pollo","Por kg","congelado","menor",6290],
    ["rebozados","Medallones de pollo, caja","Caja x 6 kg","congelado","mayor",30500],
    ["huevos","Huevos blancos","Maple x 30","refrigerado","menor",5200],
    ["huevos","Huevos color","Maple x 30","refrigerado","menor",5600],
    ["huevos","Huevos blancos, cajón","Cajón x 12 maples","refrigerado","mayor",58800],
    ["envasados","Papas bastón prefritas","Bolsa x 2,5 kg","congelado","menor",7800],
    ["envasados","Hamburguesas de carne","Caja x 12 u.","congelado","menor",8900],
    ["envasados","Papas bastón prefritas, caja","Caja x 4 bolsas de 2,5 kg","congelado","mayor",29200],
    ["verduras","Espinaca congelada","Bolsa x 1 kg","congelado","menor",3100],
    ["verduras","Choclo en granos","Bolsa x 1 kg","congelado","menor",3400],
    ["verduras","Mix de vegetales","Bolsa x 1 kg","congelado","menor",3600],
    ["verduras","Brócoli en floretes","Bolsa x 1 kg","congelado","menor",4200]
  ].map((r, i) => ({ id: "p" + i, cat: r[0], nombre: r[1], pres: r[2], frio: r[3], venta: r[4], precio: r[5] }));
  // Selección de ejemplo para "Los más pedidos" (en la web real sale de las ventas).
  const POPULARES = ["p1", "p0", "p8", "p15", "p20", "p13", "p23", "p17"];

  const $ = (s, r = document) => r.querySelector(s);
  const pesos = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  const catDe = (id) => CATS.find((c) => c.id === id);
  const prodDe = (id) => P.find((p) => p.id === id);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const unidadDe = (p) => p.pres.startsWith("Por kg") ? "por kg" : p.pres.toLowerCase();

  // Sello de Huevos dibujado en la misma familia que los sellos reales (plano, texto en arco, ícono de línea).
  const selloHuevo = (txt) => `<svg class="sello-huevo" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="56" fill="#F2DE9B"/>
    <path id="arco-h" d="M22 62a38 38 0 0 1 76 0" fill="none"/>
    ${txt ? '<text text-anchor="middle"><textPath href="#arco-h" startOffset="50%">HUEVOS</textPath></text>' : ""}
    <circle cx="22" cy="62" r="2.4" fill="#4a3600"/><circle cx="98" cy="62" r="2.4" fill="#4a3600"/>
    <path d="M60 50c-9 0-15 13-15 23 0 9 6.5 15 15 15s15-6 15-15c0-10-6-23-15-23z" fill="none" stroke="#4a3600" stroke-width="3.2"/>
    <path d="M53 73c0 4 2.5 7 6 8" fill="none" stroke="#4a3600" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  const selloGrande = (c) => c.img ? `<img src="${c.img}" alt="" width="280" height="246">` : `<span class="disco">${selloHuevo(true)}</span>`;
  const miniImg = (c) => c.img ? `<img src="${c.img}" alt="" width="52" height="46">` : `<span class="mini-huevo">${selloHuevo(false)}</span>`;

  const pagina = document.body.dataset.pagina || "";
  const NAV = [["catalogo.html", "Catálogo", "catalogo"], ["como-pedir.html", "Cómo pedir", "como-pedir"], ["mayoristas.html", "Mayoristas", "mayoristas"], ["sucursales.html", "Sucursales", "sucursales"]];

  const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-carro" viewBox="0 0 24 24"><path d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.5-1.1L21 8H6.3"/><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/></symbol>
  <symbol id="i-lupa" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></symbol>
  <symbol id="i-menos" viewBox="0 0 24 24"><path d="M6 12h12"/></symbol>
  <symbol id="i-mas" viewBox="0 0 24 24"><path d="M12 6v12M6 12h12"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
  <symbol id="i-camion" viewBox="0 0 24 24"><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.2v2.8h-7"/><circle cx="6.5" cy="17" r="1.7"/><circle cx="17" cy="17" r="1.7"/></symbol>
  <symbol id="i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/></symbol>
  <symbol id="i-tel" viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/></symbol>
  <symbol id="i-izq" viewBox="0 0 24 24"><path d="m14.5 6-6 6 6 6"/></symbol>
  <symbol id="i-der" viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6"/></symbol>
  <symbol id="i-flecha" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-ok" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-wa" viewBox="0 0 24 24"><path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.3 18.6z"/><path d="M9.2 8.6c.3-.6.6-.6.9-.6h.6c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.1-.1.3 0 .5.5.9 1.3 1.7 2.3 2.2.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.6 0 .6-.3 1.4-1 1.7-.8.4-2.1.3-3.8-.7a8.6 8.6 0 0 1-3-3.3c-.6-1.2-.6-2.4-.2-3.1z" fill="currentColor" stroke="none"/></symbol>
</svg>`;

  const barra = `<div class="aviso" role="note"><b>Maqueta</b> preparada por JM Digital Consulting · productos y precios de ejemplo</div>
<header class="barra" id="barra">
  <div class="wrap">
    <a class="logo" href="index.html" aria-label="La Entrerriana, inicio"><img src="img/logo.webp" alt="La Entrerriana" width="528" height="138"></a>
    <nav aria-label="Secciones" id="nav">
      ${NAV.map(([h, t, k]) => `<a href="${h}"${k === pagina ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    </nav>
    <button class="btn-carrito" id="abrir-carrito" type="button" aria-controls="carrito">
      <svg class="i"><use href="#i-carro"/></svg><span class="txt">Mi pedido</span><span class="n" id="n-carrito">0</span>
    </button>
    <button class="btn-menu" id="btn-menu" type="button" aria-controls="nav" aria-expanded="false" aria-label="Abrir menú"><svg class="i"><use href="#i-menu"/></svg></button>
  </div>
</header>`;

  const pie = `<footer class="pie">
  <div class="wrap cols">
    <div>
      <img src="img/logo.webp" alt="La Entrerriana" width="528" height="138">
      <span class="firma">Sabor y calidad en tu mesa</span>
    </div>
    <div><h3>La web</h3><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
    <div><h3>Sucursales</h3><ul>${SUC.map((s) => `<li>${esc(s.nombre)}<small>${esc(s.dir)}${s.tel ? " · " + esc(s.tel) : ""}</small></li>`).join("")}</ul></div>
    <div><h3>Redes</h3><ul>
      <li><a href="https://www.instagram.com/laentrerrianaarg/" target="_blank" rel="noopener">Instagram</a></li>
      <li><a href="https://www.facebook.com/LaentrerrianaARG" target="_blank" rel="noopener">Facebook</a></li></ul></div>
    <small>Maqueta de propuesta de JM Digital Consulting para La Entrerriana. Los productos y precios son de ejemplo.</small>
  </div>
</footer>`;

  const carrito = `<div class="velo" id="velo"></div>
<aside class="carrito" id="carrito" aria-labelledby="titulo-carrito" aria-hidden="true" inert>
  <div class="carrito-cab">
    <h2 id="titulo-carrito">Mi pedido</h2>
    <button class="cerrar" id="cerrar-carrito" type="button" aria-label="Cerrar pedido"><svg class="i"><use href="#i-x"/></svg></button>
  </div>
  <div class="carrito-cuerpo">
    <div id="items"></div>
    <div class="datos" id="datos">
      <div class="campo"><span class="lab">¿Cómo lo recibís?</span><div class="opciones" id="opciones"></div></div>
      <div class="campo" id="campo-dir" hidden><label for="f-dir">Dirección de entrega</label><input id="f-dir" type="text" placeholder="Calle, número y barrio" autocomplete="street-address"></div>
      <div class="campo"><label for="f-nombre">Tu nombre</label><input id="f-nombre" type="text" placeholder="Para que la sucursal sepa quién pide" autocomplete="name"></div>
      <div class="campo"><span class="lab">Así sale tu mensaje</span><div class="msj" id="msj"></div></div>
    </div>
  </div>
  <div class="carrito-pie">
    <div class="total"><span>Total estimado</span><b id="total">$ 0</b></div>
    <a class="btn btn-wa" id="enviar" href="#" target="_blank" rel="noopener" aria-disabled="true"><svg class="i"><use href="#i-wa"/></svg>Enviar pedido por WhatsApp</a>
    <p class="nota">Maqueta: este botón abre WhatsApp con el pedido escrito para que elijas el contacto. En la web real va directo a la sucursal.</p>
  </div>
</aside>
<div class="aviso-flot" id="aviso-flot" role="status"><svg class="i"><use href="#i-ok"/></svg><span id="aviso-txt"></span></div>`;

  document.body.insertAdjacentHTML("afterbegin", sprite + barra);
  document.body.insertAdjacentHTML("beforeend", pie + carrito);

  // menú en celular
  const barraEl = $("#barra"), bm = $("#btn-menu");
  bm.addEventListener("click", () => {
    const ab = barraEl.classList.toggle("menu-abierto");
    bm.setAttribute("aria-expanded", String(ab)); bm.setAttribute("aria-label", ab ? "Cerrar menú" : "Abrir menú");
    bm.innerHTML = `<svg class="i"><use href="#${ab ? "i-x" : "i-menu"}"/></svg>`;
  });

  // fecha de entrega: el día siguiente.
  // El domingo no se reparte (a confirmar con el cliente): un pedido del sábado llega el lunes.
  const man = new Date(); man.setDate(man.getDate() + 1); if (man.getDay() === 0) man.setDate(man.getDate() + 1);
  document.querySelectorAll("[data-fecha-entrega]").forEach((el) => { el.textContent = man.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "numeric" }); });

  // carrito
  const est = { carrito: {}, recibe: "smt" };
  try { const g = JSON.parse(localStorage.getItem("le-carrito") || "null"); if (g && typeof g === "object") est.carrito = g; } catch (e) {}
  const guardar = () => { try { localStorage.setItem("le-carrito", JSON.stringify(est.carrito)); } catch (e) {} };

  $("#opciones").innerHTML = SUC.map((s) => `<label class="op"><input type="radio" name="recibe" value="${s.id}" ${s.id === est.recibe ? "checked" : ""}><span><b>Retiro en ${esc(s.nombre)}</b><small>${esc(s.dir)}</small></span></label>`).join("") +
    `<label class="op"><input type="radio" name="recibe" value="envio"><span><b>Envío a domicilio</b><small>Al día siguiente, de 8 a 20 h</small></span></label>`;
  $("#opciones").addEventListener("change", (e) => { est.recibe = e.target.value; $("#campo-dir").hidden = est.recibe !== "envio"; pintarCarrito(); });
  ["#f-dir", "#f-nombre"].forEach((s) => $(s).addEventListener("input", pintarCarrito));

  function pintarCarrito() {
    const ids = Object.keys(est.carrito).filter((id) => est.carrito[id] > 0 && prodDe(id));
    const total = ids.reduce((t, id) => t + prodDe(id).precio * est.carrito[id], 0);
    $("#n-carrito").textContent = ids.reduce((t, id) => t + est.carrito[id], 0);
    $("#items").innerHTML = ids.length ? ids.map((id) => {
      const p = prodDe(id), n = est.carrito[id];
      return `<div class="item" data-id="${id}"><div><b>${esc(p.nombre)}</b><small>${esc(p.pres)}</small></div><span class="sub">${pesos.format(p.precio * n)}</span>
        <div class="fila"><div class="cant"><button type="button" data-dc="-1" aria-label="Uno menos"><svg class="i"><use href="#i-menos"/></svg></button><input type="number" value="${n}" readonly aria-label="Cantidad"><button type="button" data-dc="1" aria-label="Uno más"><svg class="i"><use href="#i-mas"/></svg></button></div><button class="quitar" type="button" data-quitar-item>Quitar</button></div></div>`;
    }).join("") : `<div class="carrito-vacio"><b>Todavía está vacío</b>Agregá productos desde el <a href="catalogo.html">catálogo</a>.</div>`;
    $("#datos").hidden = !ids.length;
    $("#total").textContent = pesos.format(total);
    const dest = est.recibe === "envio" ? `Envío a domicilio${$("#f-dir").value ? ": " + $("#f-dir").value : ""}` : `Retiro en sucursal ${SUC.find((s) => s.id === est.recibe).nombre}`;
    const nombre = $("#f-nombre").value.trim();
    const txt = `Hola, quiero hacer este pedido${nombre ? " (" + nombre + ")" : ""}:\n\n` +
      ids.map((id) => { const p = prodDe(id); return `• ${est.carrito[id]} × ${p.nombre} (${p.pres})`; }).join("\n") +
      `\n\n${dest}\nTotal estimado: ${pesos.format(total)}`;
    $("#msj").textContent = txt;
    const ok = ids.length > 0 && (est.recibe !== "envio" || $("#f-dir").value.trim());
    const env = $("#enviar"); env.setAttribute("aria-disabled", String(!ok)); env.href = ok ? "https://wa.me/?text=" + encodeURIComponent(txt) : "#";
  }
  $("#items").addEventListener("click", (e) => {
    const it = e.target.closest(".item"); if (!it) return; const id = it.dataset.id;
    const d = e.target.closest("[data-dc]");
    if (d) est.carrito[id] = Math.max(0, est.carrito[id] + +d.dataset.dc);
    if (e.target.closest("[data-quitar-item]")) est.carrito[id] = 0;
    if (!est.carrito[id]) delete est.carrito[id];
    guardar(); pintarCarrito();
  });

  const car = $("#carrito"), velo = $("#velo");
  const abrir = () => { car.classList.add("abierto"); velo.classList.add("abierto"); car.removeAttribute("inert"); car.setAttribute("aria-hidden", "false"); $("#cerrar-carrito").focus(); };
  const cerrar = () => { car.classList.remove("abierto"); velo.classList.remove("abierto"); car.setAttribute("inert", ""); car.setAttribute("aria-hidden", "true"); $("#abrir-carrito").focus(); };
  $("#abrir-carrito").addEventListener("click", abrir);
  $("#cerrar-carrito").addEventListener("click", cerrar);
  velo.addEventListener("click", cerrar);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && car.classList.contains("abierto")) cerrar(); });

  const agregar = (id, n) => { est.carrito[id] = (est.carrito[id] || 0) + n; guardar(); pintarCarrito(); };
  const avisar = (t) => {
    $("#aviso-txt").innerHTML = t; const a = $("#aviso-flot"); a.classList.add("ver");
    clearTimeout(avisar.t); avisar.t = setTimeout(() => a.classList.remove("ver"), 2600);
    const b = $("#abrir-carrito"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  };
  const marcarAgregado = (btn) => {
    btn.classList.add("listo"); btn.innerHTML = '<svg class="i"><use href="#i-ok"/></svg>Agregado';
    setTimeout(() => { btn.classList.remove("listo"); btn.innerHTML = '<svg class="i"><use href="#i-carro"/></svg>Agregar'; }, 1400);
  };
  const stepper = (p, n = 1) => `<div class="cant"><button type="button" data-d="-1" aria-label="Uno menos"><svg class="i"><use href="#i-menos"/></svg></button><input type="number" min="1" max="999" value="${n}" data-cant aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-d="1" aria-label="Uno más"><svg class="i"><use href="#i-mas"/></svg></button></div>`;

  // tarjeta de producto (home y destacados)
  const tarjeta = (p) => {
    const c = catDe(p.cat);
    return `<article class="tarjeta" data-id="${p.id}">
      <div class="foto">${selloGrande(c)}</div>
      <div class="cuerpo"><b>${esc(p.nombre)}</b><small>${esc(c.nombre)} · ${esc(p.pres)}</small>
        <div class="tags"><span class="tag ${p.frio}">${p.frio}</span>${p.venta === "mayor" ? '<span class="tag mayor">Por mayor</span>' : ""}</div>
        <span class="precio">${pesos.format(p.precio)}<small>${esc(unidadDe(p))} · ejemplo</small></span>
        <div class="acc">${stepper(p)}<button class="btn-agregar" type="button" data-agregar><svg class="i"><use href="#i-carro"/></svg>Agregar</button></div>
      </div></article>`;
  };
  const activarTarjetas = (cont) => {
    cont.addEventListener("click", (e) => {
      const t = e.target.closest("[data-id]"); if (!t) return;
      const inp = t.querySelector("[data-cant]");
      const d = e.target.closest("[data-d]");
      if (d) { inp.value = Math.max(1, Math.min(999, (+inp.value || 1) + +d.dataset.d)); return; }
      const b = e.target.closest("[data-agregar]");
      if (b) { const n = Math.max(1, Math.round(+inp.value) || 1); agregar(t.dataset.id, n); marcarAgregado(b); avisar(`<b>${n} ×</b> ${esc(prodDe(t.dataset.id).nombre)} en tu pedido`); }
    });
  };

  // mapa con pestañas por sucursal
  const mapaQ = (s) => `${s.dir}, ${s.ciudad}, Tucumán, Argentina`;
  const mapaEmbed = (s) => "https://maps.google.com/maps?q=" + encodeURIComponent(mapaQ(s)) + "&z=16&output=embed";
  const mapaLink = (s) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("La Entrerriana " + mapaQ(s));
  const mapaBloque = (cont) => {
    cont.innerHTML = `<div class="mapa-bloque">
      <div class="tabs-suc" role="tablist" aria-label="Sucursales">${SUC.map((s, i) => `<button class="tab-suc" type="button" role="tab" id="tab-${s.id}" aria-controls="panel-mapa" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-suc="${s.id}"><b>${esc(s.nombre)}</b><span>${esc(s.dir)}</span></button>`).join("")}</div>
      <div class="panel-mapa" id="panel-mapa" role="tabpanel" aria-labelledby="tab-${SUC[0].id}">
        <iframe title="Mapa de la sucursal" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${mapaEmbed(SUC[0])}"></iframe>
        <div class="mapa-pie"></div>
      </div></div>`;
    const tabs = [...cont.querySelectorAll(".tab-suc")], panel = $("#panel-mapa", cont), ifr = $("iframe", cont), piem = $(".mapa-pie", cont);
    const elegir = (s, foco) => {
      tabs.forEach((t) => { const on = t.dataset.suc === s.id; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; if (on && foco) t.focus(); });
      panel.setAttribute("aria-labelledby", "tab-" + s.id);
      ifr.src = mapaEmbed(s); ifr.title = "Mapa de la sucursal " + s.nombre;
      piem.innerHTML = `<span><svg class="i"><use href="#i-pin"/></svg>${esc(s.dir)}, ${esc(s.ciudad)}</span>
        <span class="${s.tel ? "" : "falta"}"><svg class="i"><use href="#i-tel"/></svg>${s.tel ? esc(s.tel) : "Teléfono a confirmar"}</span>
        <a href="${mapaLink(s)}" target="_blank" rel="noopener"><svg class="i"><use href="#i-pin"/></svg>Cómo llegar</a>`;
    };
    cont.addEventListener("click", (e) => { const t = e.target.closest(".tab-suc"); if (t) elegir(SUC.find((s) => s.id === t.dataset.suc)); });
    cont.addEventListener("keydown", (e) => {
      const t = e.target.closest(".tab-suc"); if (!t || !["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault(); const i = tabs.indexOf(t), d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
      elegir(SUC[(i + d + SUC.length) % SUC.length], true);
    });
    elegir(SUC[0]);
  };

  const waLista = "https://wa.me/?text=" + encodeURIComponent("Hola, tengo un comercio y quiero la lista de precios por mayor de La Entrerriana.");
  document.querySelectorAll("[data-wa-lista]").forEach((a) => { a.href = waLista; });

  pintarCarrito();
  window.LE = { CATS, SUC, P, POPULARES, $, pesos, esc, catDe, prodDe, unidadDe, selloGrande, miniImg, stepper, tarjeta, activarTarjetas, agregar, avisar, marcarAgregado, mapaBloque };
})();
