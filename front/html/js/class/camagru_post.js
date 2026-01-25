class CamagruPost{
  url;
  
  constructor(url){
    this.url = url
  }
  
   toHtmlElement(){
    let e = document.createElement("div");
    e.classList.add("post");
    let imgEl = new Image();
    
    imgEl.src = this.url
    
    e.appendChild(imgEl);    
    return e;
  }
}