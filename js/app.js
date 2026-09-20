import {processCommand,getTasks,getReviews,saveTask,saveReview,updateReview} from "./command-engine.js";

const input=document.querySelector("#commandInput"),send=document.querySelector("#sendCommand"),response=document.querySelector("#response"),workspace=document.querySelector("#workspaceContent"),core=document.querySelector("#core");
let activeTab="tasks";

function render(){
  const tasks=getTasks(),reviews=getReviews();
  document.querySelector("#taskCount").textContent=`${tasks.length} task${tasks.length===1?"":"s"}`;
  document.querySelector("#reviewCount").textContent=`${reviews.filter(x=>x.status==="Awaiting Review").length} awaiting review`;
  const data=activeTab==="tasks"?tasks:activeTab==="review"?reviews:getMemory();
  if(!data.length){workspace.innerHTML='<div class="empty">ابھی یہاں کوئی item موجود نہیں۔ Command دے کر شروع کریں۔</div>';return}
  workspace.innerHTML=data.map(item=>{
    if(activeTab==="memory")return`<div class="item"><div class="item-title">${escapeHtml(item.command)}</div><div class="item-meta">${escapeHtml(item.time)}</div></div>`;
    const actions=activeTab==="review"&&item.status==="Awaiting Review"?`<div class="item-actions"><button class="approve" data-review="${item.id}" data-status="Approved">Approve</button><button data-review="${item.id}" data-status="Regenerate">Regenerate</button><button class="cancel" data-review="${item.id}" data-status="Cancelled">Cancel</button></div>`:"";
    return `<div class="item"><div class="item-title">${escapeHtml(item.title)}</div><div class="item-meta">${escapeHtml(item.status)} • ${escapeHtml(item.createdAt)}</div>${actions}</div>`;
  }).join("");
  workspace.querySelectorAll("[data-review]").forEach(btn=>btn.addEventListener("click",()=>{updateReview(btn.dataset.review,btn.dataset.status);response.textContent=`Review action: ${btn.dataset.status}`;render()}));
}
function getMemory(){return JSON.parse(localStorage.getItem("ai_memory")||"[]")}
function saveMemory(command){const m=getMemory();m.unshift({command,time:new Date().toLocaleString()});localStorage.setItem("ai_memory",JSON.stringify(m.slice(0,50)))}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function runCommand(command){
  const result=processCommand(command);
  response.textContent=result.message;
  saveMemory(command);
  if(result.task)saveTask(result.task);
  if(result.review)saveReview(result.review);
  core.classList.add("processing");setTimeout(()=>core.classList.remove("processing"),450);
  if(result.action==="review")activeTab="review";
  if(result.action==="task")activeTab="tasks";
  if(result.action==="memory")activeTab="memory";
  render();
}
send.addEventListener("click",()=>runCommand(input.value.trim()));
input.addEventListener("keydown",e=>{if(e.key==="Enter")runCommand(input.value.trim())});
document.querySelectorAll("[data-command]").forEach(b=>b.addEventListener("click",()=>{input.value=b.dataset.command;runCommand(input.value)}));
document.querySelectorAll(".module").forEach(m=>m.addEventListener("click",()=>{document.querySelectorAll(".module").forEach(x=>x.classList.remove("active"));m.classList.add("active");activeTab=m.dataset.module==="review"?"review":m.dataset.module==="memory"?"memory":"tasks";response.textContent=m.querySelector("strong").textContent+" selected.";render()}));
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");activeTab=t.dataset.tab;render()}));
render();
