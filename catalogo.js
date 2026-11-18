/* Catálogo filtrable (página Catálogo y lista por caja de Mayoristas). Usa window.LE de comun.js. */
(() => {
  const { CATS, P, $, pesos, esc, catDe, prodDe, unidadDe, selloGrande, miniImg, stepper, agregar, avisar, marcarAgregado } = window.LE;
  const caja = $("#catalogo"); if (!caja) return;
  const POR_PAG = 10;
  const url = new URLSearchParams(location.search);
  const fija = caja.dataset.venta || "";           // en Mayoristas la venta queda fija en "mayor"
  const est = { q: url.get("q") || "", cat: CATS.some((c) => c.id === url.get("cat")) ? url.get("cat") : "", frio: "", venta: fija, pag: 1, marcados: new Set(), cant: {} };
  const titulo = caja.dataset.titulo || "Todos los productos";

  caja.innerHTML = `
    <div class="caja-cab">
      <h2 id="titulo-catalogo">${esc(titulo)}</h2>
      <p>${esc(caja.dataset.bajada || "Buscá, marcá lo que necesitás y elegí cantidades. Podés agregar productos de a uno o varios juntos.")} <span class="firma">Sabor y calidad en tu mesa</span></p>
    </div>
    <div class="herramientas" role="search">
      <div class="campo buscar"><label for="f-buscar">Buscar producto</label><svg class="i"><use href="#i-lupa"/></svg>
        <input id="f-buscar" type="search" placeholder="Ej.: suprema, merluza, rabas" autocomplete="off" value="${esc(est.q)}"></div>
      <div class="campo"><label for="f-cat">Categoría</label><select id="f-cat"><option value="">Todas las categorías</option>${CATS.map((c) => `<option value="${c.id}">${esc(c.nombre)}</option>`).join("")}</select></div>
      <div class="campo"><span class="lab" id="lab-frio">Conservación</span>
        <div class="segmento" role="group" aria-labelledby="lab-frio" id="f-frio">
          <button type="button" data-v="" aria-pressed="true">Todo</button><button type="button" data-v="congelado" aria-pressed="false">Congelado</button><button type="button" data-v="refrigerado" aria-pressed="false">Refrigerado</button></div></div>
      ${fija ? "" : `<div class="campo"><span class="lab" id="lab-venta">Venta</span>
        <div class="segmento" role="group" aria-labelledby="lab-venta" id="f-venta">
          <button type="button" data-v="" aria-pressed="true">Todo</button><button type="button" data-v="menor" aria-pressed="false">Por menor</button><button type="button" data-v="mayor" aria-pressed="false">Por mayor</button></div></div>`}
    </div>
    <div class="barra-tabla"><span class="cuenta" id="cuenta" aria-live="polite"></span><div class="chips" id="chips"></div>
      <button class="btn-lote" id="btn-lote" type="button" disabled>Agregar marcados</button></div>
    <div class="tabla-scroll"><table class="planilla">
      <thead><tr><th class="c-sel"><input class="chk" type="checkbox" id="marcar-todo" aria-label="Marcar todos los productos de esta página"></th>
        <th>Producto</th><th>Precio</th><th>Cantidad</th><th class="c-acc"><span class="sr">Acción</span></th></tr></thead>
      <tbody id="filas"></tbody></table></div>
    <div class="vacio" id="vacio" hidden><b>No encontramos ese producto</b>Probá con otra palabra o sacá algún filtro.</div>
    <div class="paginas" id="paginas"></div>`;
  if (fija) $(".herramientas").classList.add("sin-venta");
  $("#f-cat").value = est.cat;

  // sellos como filtros, con "Todos"
  const fila = $("#fila-sellos");
  if (fila) {
    fila.classList.add("con-todos");
    fila.innerHTML = `<button class="sello sello-todos" type="button" data-cat="" aria-pressed="false"><span class="disco"><i>Todo</i></span><span>Todos</span></button>` +
      CATS.map((c) => `<button class="sello${c.img ? "" : " huevo"}" type="button" data-cat="${c.id}" aria-pressed="false">${selloGrande(c)}<span>${esc(c.nombre)}</span></button>`).join("");
    fila.addEventListener("click", (e) => {
      const b = e.target.closest(".sello"); if (!b) return;
      est.cat = b.dataset.cat; est.pag = 1; $("#f-cat").value = est.cat; pintar(true);
      caja.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  const sinTildes = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const filtrar = () => {
    const q = sinTildes(est.q).trim();
    return P.filter((p) => (!est.cat || p.cat === est.cat) && (!est.frio || p.frio === est.frio) && (!est.venta || p.venta === est.venta) &&
      (!q || sinTildes(p.nombre + " " + p.pres + " " + catDe(p.cat).nombre).includes(q)));
  };

  const filaHTML = (p) => {
    const c = catDe(p.cat), m = est.marcados.has(p.id);
    return `<tr data-id="${p.id}" class="${m ? "marcada" : ""}">
      <td class="c-sel"><input class="chk" type="checkbox" data-marcar ${m ? "checked" : ""} aria-label="Marcar ${esc(p.nombre)}"></td>
      <td class="c-prod"><div class="prod">${miniImg(c)}<div><b>${esc(p.nombre)}</b><small>${esc(c.nombre)} · ${esc(p.pres)}</small>
        <div class="tags"><span class="tag ${p.frio}">${p.frio}</span>${p.venta === "mayor" ? '<span class="tag mayor">Por mayor</span>' : ""}</div></div></div></td>
      <td class="c-precio"><span class="precio">${pesos.format(p.precio)}<small>${esc(unidadDe(p))} · ejemplo</small></span></td>
      <td class="c-cant">${stepper(p, est.cant[p.id] || 1)}</td>
      <td class="c-acc"><button class="btn-agregar" type="button" data-agregar><svg class="i"><use href="#i-carro"/></svg>Agregar</button></td></tr>`;
  };

  function pintar(urlTambien) {
    const lista = filtrar();
    const pags = Math.max(1, Math.ceil(lista.length / POR_PAG));
    est.pag = Math.min(est.pag, pags);
    const ini = (est.pag - 1) * POR_PAG, vis = lista.slice(ini, ini + POR_PAG);
    $("#filas").innerHTML = vis.map(filaHTML).join("");
    $("#vacio").hidden = lista.length > 0;
    $("#cuenta").textContent = lista.length ? `Mostrando ${ini + 1}–${ini + vis.length} de ${lista.length} productos` : "Sin resultados";
    if (!fija) $("#titulo-catalogo").textContent = est.cat ? catDe(est.cat).nombre : titulo;
    const todos = vis.length > 0 && vis.every((p) => est.marcados.has(p.id));
    $("#marcar-todo").checked = todos;
    $("#marcar-todo").indeterminate = !todos && vis.some((p) => est.marcados.has(p.id));
    const nm = est.marcados.size;
    $("#btn-lote").disabled = nm === 0;
    $("#btn-lote").textContent = nm ? `Agregar marcados (${nm})` : "Agregar marcados";
    const chips = [];
    if (est.cat) chips.push(["cat", catDe(est.cat).nombre]);
    if (est.frio) chips.push(["frio", est.frio[0].toUpperCase() + est.frio.slice(1)]);
    if (est.venta && !fija) chips.push(["venta", est.venta === "mayor" ? "Por mayor" : "Por menor"]);
    if (est.q) chips.push(["q", `“${est.q}”`]);
    $("#chips").innerHTML = chips.map(([k, t]) => `<span class="chip">${esc(t)}<button type="button" data-quitar="${k}" aria-label="Quitar filtro ${esc(t)}"><svg class="i" style="width:12px;height:12px"><use href="#i-x"/></svg></button></span>`).join("");
    $("#paginas").innerHTML = pags > 1 ? `<span>Página ${est.pag} de ${pags}</span><div>
      <button type="button" data-pag="${est.pag - 1}" ${est.pag === 1 ? "disabled" : ""} aria-label="Página anterior"><svg class="i" style="width:16px;height:16px;margin:auto"><use href="#i-izq"/></svg></button>
      ${Array.from({ length: pags }, (_, i) => `<button type="button" data-pag="${i + 1}" ${i + 1 === est.pag ? 'aria-current="page"' : ""}>${i + 1}</button>`).join("")}
      <button type="button" data-pag="${est.pag + 1}" ${est.pag === pags ? "disabled" : ""} aria-label="Página siguiente"><svg class="i" style="width:16px;height:16px;margin:auto"><use href="#i-der"/></svg></button></div>` : "";
    caja.querySelectorAll("#f-frio button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === est.frio)));
    caja.querySelectorAll("#f-venta button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === est.venta)));
    if (fila) fila.querySelectorAll(".sello").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === est.cat)));
    if (urlTambien && !fija) { const u = new URL(location.href); est.cat ? u.searchParams.set("cat", est.cat) : u.searchParams.delete("cat"); history.replaceState(null, "", u); }
  }

  $("#f-buscar").addEventListener("input", (e) => { est.q = e.target.value; est.pag = 1; pintar(); });
  $("#f-cat").addEventListener("change", (e) => { est.cat = e.target.value; est.pag = 1; pintar(true); });
  $("#f-frio").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; est.frio = b.dataset.v; est.pag = 1; pintar(); });
  if (!fija) $("#f-venta").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; est.venta = b.dataset.v; est.pag = 1; pintar(); });
  $("#chips").addEventListener("click", (e) => {
    const k = e.target.closest("[data-quitar]")?.dataset.quitar; if (!k) return;
    if (k === "q") { est.q = ""; $("#f-buscar").value = ""; } else { est[k] = ""; if (k === "cat") $("#f-cat").value = ""; }
    est.pag = 1; pintar(true);
  });
  $("#paginas").addEventListener("click", (e) => { const b = e.target.closest("[data-pag]"); if (!b || b.disabled) return; est.pag = +b.dataset.pag; pintar(); caja.scrollIntoView(); });
  $("#marcar-todo").addEventListener("change", (e) => {
    filtrar().slice((est.pag - 1) * POR_PAG, est.pag * POR_PAG).forEach((p) => e.target.checked ? est.marcados.add(p.id) : est.marcados.delete(p.id)); pintar();
  });
  $("#filas").addEventListener("click", (e) => {
    const tr = e.target.closest("tr"); if (!tr) return; const id = tr.dataset.id;
    const d = e.target.closest("[data-d]");
    if (d) { const inp = tr.querySelector("[data-cant]"); const v = Math.max(1, Math.min(999, (+inp.value || 1) + +d.dataset.d)); inp.value = v; est.cant[id] = v; return; }
    const b = e.target.closest("[data-agregar]");
    if (b) { const n = est.cant[id] || 1; agregar(id, n); marcarAgregado(b); avisar(`<b>${n} ×</b> ${esc(prodDe(id).nombre)} en tu pedido`); }
  });
  $("#filas").addEventListener("change", (e) => {
    const tr = e.target.closest("tr"); if (!tr) return; const id = tr.dataset.id;
    if (e.target.matches("[data-marcar]")) { e.target.checked ? est.marcados.add(id) : est.marcados.delete(id); pintar(); }
    if (e.target.matches("[data-cant]")) { const v = Math.max(1, Math.min(999, Math.round(+e.target.value) || 1)); e.target.value = v; est.cant[id] = v; }
  });
  $("#btn-lote").addEventListener("click", () => {
    const n = est.marcados.size; est.marcados.forEach((id) => agregar(id, est.cant[id] || 1)); est.marcados.clear(); pintar();
    avisar(`<b>${n}</b> producto${n === 1 ? "" : "s"} agregado${n === 1 ? "" : "s"} a tu pedido`);
  });

  pintar();
})();
