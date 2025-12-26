A(1, 0);
function A(t = 1, c) {
  fetch("https://tvcn-be.vercel.app/data")
    .then((e) => e.json())
    .then((n) => {
      let o;
      switch (t) {
        case 1:
          o = n.slice(0, 200);
          break;
        case 2:
          o = n.slice(200, 413);
          break;
        case 3:
          o = n.slice(413, 683);
          break;
        case 4:
          o = n.slice(683);
          break;
        default:
          o = n.slice(0);
      }
      e(o, c);
    });
}
function b(e, t) {
  return (
    document.querySelectorAll(".Qr7Oae").forEach((n) => {
      const o = n.querySelector(".M7eMe"),
        r = o ? o.textContent.trim() : "";
      if (r === e) {
        const e = n.querySelectorAll(".aDTYNe.snByac.OvPDhc.OIC90c");
        for (const n of e) if (n.textContent.trim() === t) n.click();
      }
    }),
    c
  );
}
function c(e, t) {
  return (
    document.querySelectorAll(".Qr7Oae").forEach((n) => {
      const o = n.querySelector(".M7eMe"),
        r = o ? o.textContent.trim() : "";
      if (r === e) {
        const e = n.querySelectorAll(".aDTYNe.snByac.OvPDhc.OIC90c");
        for (const n of e) if (n.textContent.trim() !== t) n.click();
      }
    }),
    c
  );
}
function e(e, t = 300) {
  window.scrollTo(0, document.body.scrollHeight);
  let n = 0;
  for (let o = 0; o < e.length; o++) {
    const r = e[o],
      l = r.cau_hoi,
      i = r.dap_an_dung;
    n < t ? b(l, i) && n++ : c(l, i);
  }
}
