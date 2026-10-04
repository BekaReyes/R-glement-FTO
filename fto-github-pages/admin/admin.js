let data=null, cfg={};

const $=id=>document.getElementById(id);
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function attr(s){return esc(s).replace(/"/g,"&quot;")}

$("connect").onclick=async()=>{
  cfg.owner=$("owner").value.trim();
  cfg.repo=$("repo").value.trim();
  cfg.branch=$("branch").value.trim()||"main";
  cfg.token=$("token").value.trim();
  if(!cfg.owner||!cfg.repo||!cfg.token){$("status").textContent="Renseigne le compte, le dépôt et le jeton.";return}
  $("status").textContent="Chargement…";
  try{
    const r=await gh("GET",`/repos/${cfg.owner}/${cfg.repo}/contents/content.json?ref=${encodeURIComponent(cfg.branch)}`);
    data=JSON.parse(decodeBase64(r.content));
    $("status").textContent="✓ Règlement chargé.";
    $("editor").classList.remove("hidden"); render();
  }catch(e){$("status").textContent="Erreur : "+e.message}
};

function render(){
  $("title").value=data.title||"";
  $("subtitle").value=data.subtitle||"";
  $("intro").value=data.intro||"";
  $("articles").innerHTML=(data.articles||[]).map((a,i)=>`
  <div class="article">
    <div class="articleHead"><h3>ARTICLE ${i+1}</h3><button type="button" class="remove" onclick="removeArticle(${i})">Supprimer</button></div>
    <label>Titre<input value="${attr(a.title)}" oninput="data.articles[${i}].title=this.value"></label>
    <label>Paragraphes<textarea rows="4" oninput="data.articles[${i}].paragraphs=this.value.split('\\n').filter(Boolean)">${esc((a.paragraphs||[]).join("\n"))}</textarea></label>
    <label>Listes à puces<textarea rows="6" oninput="data.articles[${i}].bullets=this.value.split('\\n').filter(Boolean)">${esc((a.bullets||[]).join("\n"))}</textarea></label>
    <label>Texte final (optionnel)<textarea rows="3" oninput="data.articles[${i}].tail=this.value">${esc(a.tail||"")}</textarea></label>
  </div>`).join("");
}
function removeArticle(i){if(confirm("Supprimer cet article ?")){data.articles.splice(i,1);render()}}
$("add").onclick=()=>{data.articles.push({title:"NOUVEL ARTICLE",paragraphs:[""],bullets:[]});render()};

$("publish").onclick=async()=>{
  data.title=$("title").value; data.subtitle=$("subtitle").value; data.intro=$("intro").value;
  $("publishStatus").textContent="Publication en cours…";
  try{
    const current=await gh("GET",`/repos/${cfg.owner}/${cfg.repo}/contents/content.json?ref=${encodeURIComponent(cfg.branch)}`);
    const body={message:"Mise à jour du règlement FTO",content:encodeBase64(JSON.stringify(data,null,2)+"\n"),sha:current.sha,branch:cfg.branch};
    await gh("PUT",`/repos/${cfg.owner}/${cfg.repo}/contents/content.json`,body);
    $("publishStatus").textContent="✓ Publié sur GitHub. GitHub Pages va mettre le site à jour automatiquement.";
  }catch(e){$("publishStatus").textContent="Erreur : "+e.message}
};

async function gh(method,path,body){
  const r=await fetch("https://api.github.com"+path,{
    method,
    headers:{Accept:"application/vnd.github+json",Authorization:"Bearer "+cfg.token,"X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"},
    body:body?JSON.stringify(body):undefined
  });
  const t=await r.text(); let d; try{d=JSON.parse(t)}catch{d={}};
  if(!r.ok) throw new Error(d.message||("HTTP "+r.status));
  return d;
}
function decodeBase64(s){const bin=atob(s.replace(/\n/g,""));const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
function encodeBase64(s){const bytes=new TextEncoder().encode(s);let bin="";bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin)}
