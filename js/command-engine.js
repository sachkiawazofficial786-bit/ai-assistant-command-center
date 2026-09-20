function makeId(prefix){return prefix+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,6)}
function getStore(key,fallback=[]){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function setStore(key,value){localStorage.setItem(key,JSON.stringify(value))}

export function getTasks(){return getStore("ai_tasks")}
export function getReviews(){return getStore("ai_reviews")}

export function processCommand(command){
  if(!command)return{message:"براہِ کرم کوئی command لکھیں۔",action:"none"};
  const text=command.toLowerCase();

  if(text.includes("status")||text.includes("حالت")||text.includes("اسٹیٹس"))
    return{message:"سسٹم آن لائن ہے۔ AI Core، Task Engine اور Review Center فعال ہیں۔",action:"status"};

  if(text.includes("review")||text.includes("ریویو")||text.includes("جائزہ"))
    return{message:"Review Center کھول دیا گیا ہے۔ یہاں content کو Approve، Edit، Cancel یا Regenerate کیا جا سکتا ہے۔",action:"review"};

  if(text.includes("website")||text.includes("ویب سائٹ")||text.includes("ویب"))
    return{message:"Website Engine منتخب ہے۔ اگلے مرحلے میں page builder اور live preview یہاں connect ہوں گے۔",action:"website"};

  if(text.includes("task")||text.includes("کام")||text.includes("ٹاسک")||text.includes("نیا"))
    return{message:"نیا task تیار کیا گیا۔ آپ اسے Live Workspace میں دیکھ سکتے ہیں۔",action:"task",task:{id:makeId("TASK"),title:command,status:"Pending",createdAt:new Date().toLocaleString()}};

  if(text.includes("memory")||text.includes("میموری")||text.includes("یاد"))
    return{message:"Memory workspace کھول دیا گیا ہے۔ موجودہ commands browser میں محفوظ کی جا سکتی ہیں۔",action:"memory"};

  if(text.includes("media")||text.includes("video")||text.includes("ویڈیو")||text.includes("content")||text.includes("مواد"))
    return{message:"Media workflow شروع ہوا۔ Content کو review کے بعد ہی publish کیا جائے گا۔",action:"review",review:{id:makeId("CONTENT"),title:command,status:"Awaiting Review",createdAt:new Date().toLocaleString()}};

  return{message:"Command موصول ہوگئی۔ AI Core نے اسے سمجھنے کے لیے basic intent routing کیا ہے۔",action:"none"};
}

export function saveTask(task){const items=getTasks();items.unshift(task);setStore("ai_tasks",items)}
export function saveReview(review){const items=getReviews();items.unshift(review);setStore("ai_reviews",items)}
export function updateReview(id,status){const items=getReviews().map(x=>x.id===id?{...x,status}:x);setStore("ai_reviews",items)}
