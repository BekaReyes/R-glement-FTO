async function load(){
  const r=await fetch("content.json?"+Date.now());
  const d=await r.json();
  document.title=d.title+" — "+d.subtitle;
  ["title","subtitle","intro","footer","approval","signatures"].forEach(id=>{
    document.getElementById(id).textContent=d[id]||"";
  });
  document.getElementById("articles").innerHTML=(d.articles||[]).map(a=>`
    <article>
      <h2>${esc(a.title)}</h2>
      ${(a.paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join("")}
      ${(a.bullets||[]).length?`<ul>${a.bullets.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
      ${a.tail?`<p>${esc(a.tail)}</p>`:""}
    </article>`).join("");
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
load().catch(()=>document.getElementById("intro").textContent="Impossible de charger le règlement.");
