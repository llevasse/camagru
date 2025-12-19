class SuperposableImage{
  body = `<div class="superposableImageImgContainer">
    <img class="superposableImageImg" src="{IMG_SRC}">
  </div>`;
  
  xPositionPercent = .2;
  yPositionPercent = .2;
  
  move = false;
  begPosition;
  newPosition;
  index = null;
  
  editingVideoContainer;
  
  element; 
  
  constructor(img_url){
    this.body = this.body.replace("{IMG_SRC}", img_url);
    this.element = document.createElement("div");
    this.element.draggable = false;
    this.element.classList.add("superposableImageImgContainer");
    this.element.appendChild(document.createElement("img"));
    this.element.lastChild.classList.add("superposableImageImg")
    this.element.lastChild.src = img_url;
    this.element.lastChild.draggable = false;
    this.editingVideoContainer = document.querySelector("#editing-video-container");
    this.element.addEventListener("click", ()=>{
      this.onClick();
    })
  }
  
  positionFromPointerEvent(ev){
    return {clientX : ev.clientX, clientY : ev.clientY, offsetX : ev.offsetX, offsetY : ev.offsetY};
  }
  
  reposition(){
    var sourceDimension = document.querySelector(".focusSource").getBoundingClientRect();
    var el = this.editingVideoContainer.children[this.index];
                        
    var layerX = sourceDimension.x + (sourceDimension.width * this.xPositionPercent);
    var layerY = sourceDimension.y + (sourceDimension.height * this.yPositionPercent);
    console.log(this.xPositionPercent,this.yPositionPercent);
    console.log(layerX, layerY);
    el.style.left = `${layerX}px`;
    el.style.top = `${layerY}px`;
  }
  
  onClick(){
    let clone = this.element.cloneNode(true);
    this.index = this.editingVideoContainer.children.length;
    clone.classList.add("layered");
    
    var sourceDimension = document.querySelector(".focusSource").getBoundingClientRect();
    const defaultSpawnXPositionPercent = .20;
    const defaultSpawnYPositionPercent = .20;
                  
                  
    // var layerX = sourceDimension.left + (sourceDimension.width * defaultSpawnXPositionPercent);
    // var layerY = sourceDimension.top + (sourceDimension.height * defaultSpawnYPositionPercent);
    
    clone.style.left = `${defaultSpawnXPositionPercent * 100}%`;
    clone.style.top = `${defaultSpawnYPositionPercent * 100}%`;
    
    clone.addEventListener("pointerdown", (ev)=>{
      this.move = true;
      this.begPosition = this.positionFromPointerEvent(ev);
    });
    
        
    clone.addEventListener("pointerup", (ev)=>{
      this.move = false;
    })
    
    
    clone.addEventListener("pointermove", (ev)=>{
      if (this.move){
        this.newPosition = this.positionFromPointerEvent(ev);   
        if (this.index != null){
          var el = this.editingVideoContainer.children[this.index];
          const pos = el.getBoundingClientRect();
          el.style.left = `${pos.x + this.newPosition.offsetX - this.begPosition.offsetX}px`;
          el.style.top = `${pos.y + this.newPosition.offsetY - this.begPosition.offsetY}px`;
          
          this.xPositionPercent = el.getBoundingClientRect().left / sourceDimension.width
          this.yPositionPercent = el.getBoundingClientRect().top / sourceDimension.height
          
          clone.style.left = `${this.xPositionPercent * 100}%`;
          clone.style.top = `${this.yPositionPercent * 100}%`;
        }
      }
    })
    
    onpointerdown=""
    
    document.querySelector("#layered-image-container").appendChild(clone);
  }
}

class EditedImage{
  baseImage; // {src, width, height}
  superposableImages;
  finalImageDataUrl;
  
  constructor(baseImage, superposableImages, finalImageDataUrl){
    this.baseImage = baseImage;
    this.superposableImages = superposableImages;
    this.finalImageDataUrl = finalImageDataUrl;
    this.body
  }
  
  toHtmlElement(){
    let e = document.createElement("div");
    e.classList.add("editedImage");
    let img = document.createElement("img");
    img.src = this.finalImageDataUrl;
    e.appendChild(img);
    let btn = document.createElement("button");
    btn.innerHTML = "Save";
    btn.onclick = this.upload();
    e.appendChild(btn);
    return e;
  }
  
  upload(){
    fetch(this.baseImage.src).then(res => res.blob()).then(blob => {      
      var imgSize = {width: this.baseImage.width, height: this.baseImage.height};      
      const file = new File([blob], 'dot.png', blob)
      editingService.uploadPicture(file, JSON.stringify(this.superposableImages), JSON.stringify(imgSize));
    })
  }
}

class EditingPage{
  body = `
  <link id="style" rel="stylesheet" href="/css/editing-page.css">
  <div id="editing-container">
    <div id="editing-main-div">
      <div id="editing-video-container">
        <video id="editing-video"></video>
        <img id="editing-video-img"></img>
        <div id="layered-image-container"></div>
      </div>
      <div id="editing-video-buttons-container">
        <button id="editing-permissions-button">Allow webcam capture</button>  
        <button id="editing-capture">Capture photo</button>
        <input id="editing-upload-button" type="file" accept="image/*">
      </div>
      <div id="superposableImageImgContainer">
      </div>
    </div>
    <div id="editing-side-div">
      <canvas id="editing-canvas"></canvas>
      <div id="edited-images-output">
      
      </div>
    </div>
  </div>`;
  
  
  streaming = false;
  
  video;
  editingImg;
  canvas;
  editedImagesContainer;
  captureButton;
  permsisionButton;
  uploadButton;
  saveButton;
  
  focusSource;
  focusSourceSize;
  
  superposableImages = [];
  
  superposableImagesContainer;
  layereImageContainer;
  editiedImages = [];
  
  removeStream(){
    if (this.streaming){  // cancel stream
      this.video.srcObject.getTracks().forEach(track=>track.stop());
      this.streaming = false;
      this.permsisionButton.innerHTML = "Allow webcam capture";
      return 1;
    }
    return 0
  }
  
  setVideoAsSrc(){
    if (this.focusSource && this.focusSource.classList.contains("focusSource")){
      this.focusSource.classList.remove("focusSource");
    }
    if (this.editingImg.classList.contains("active")){
      this.editingImg.classList.remove("active");
    }
    if (!this.video.classList.contains("active")){
      this.video.classList.add("active");
    }
    this.focusSource = this.video;
    if (!this.focusSource.classList.contains("focusSource")){
      this.focusSource.classList.add("focusSource");
    }
    this.focusSourceSize = this.focusSource.getBoundingClientRect();
    
    this.layereImageContainer.style.top = `${this.focusSourceSize.top}px`;
    this.layereImageContainer.style.left = `${this.focusSourceSize.left}px`;
    this.layereImageContainer.style.width = `${this.focusSourceSize.width}px`;
    this.layereImageContainer.style.height = `${this.focusSourceSize.height}px`;
    
  }
  setImgAsSrc(){
    if (this.focusSource && this.focusSource.classList.contains("focusSource")){
      this.focusSource.classList.remove("focusSource");
    }
    if (this.video.classList.contains("active")){
      this.video.classList.remove("active");
    }
    if (!this.editingImg.classList.contains("active")){
      this.editingImg.classList.add("active");
    }
    this.focusSource = this.editingImg;
    if (!this.focusSource.classList.contains("focusSource")){
      this.focusSource.classList.add("focusSource");
    }
    this.focusSourceSize = this.focusSource.getBoundingClientRect();
    this.layereImageContainer.style.top = `${this.focusSourceSize.top}px`;
    this.layereImageContainer.style.left = `${this.focusSourceSize.left}px`;
    this.layereImageContainer.style.width = `${this.focusSourceSize.width}px`;
    this.layereImageContainer.style.height = `${this.focusSourceSize.height}px`;
  }
  
  uploadButtonChangeEvent(){
    if (this.uploadButton.files.length !== 0){
      this.removeStream();
      this.setImgAsSrc();
      this.editingImg.src = URL.createObjectURL(this.uploadButton.files[0]);
    }
  }
  
  videoCanPlayEvent(){
    if (!this.streaming) {
      this.canvas.setAttribute("width", this.video.videoWidth);
      this.canvas.setAttribute("height", this.video.videoHeight);
      this.streaming = true;
    }
  }
  
  captureButtonClickEvent(){
    const context = this.canvas.getContext("2d");
    let width;
    let height;
    const sourceSize = this.focusSource.getBoundingClientRect();
    
    if (this.streaming){
      width = this.video.videoWidth;
      height = this.video.videoHeight;
    }
    else{
      width = sourceSize.width;
      height = sourceSize.height;
    }
    // const s = width > height ? height : width;
    if (width && height) {
      this.canvas.width = width;
      this.canvas.height = height;
      context.drawImage(this.focusSource, 0, 0, width, height);
      const baseImageDataUrl = this.canvas.toDataURL("image/png");
      
      var superposables = {};
      var index = 0;
      document.querySelectorAll(".superposableImageImgContainer.layered").forEach((element)=>{
        var size = element.getBoundingClientRect();
        var x = size.left - sourceSize.left;
        var y = size.top - sourceSize.top;
        var src = (new URL(element.firstChild.src)).pathname;
        superposables[index] = {x:x, y:y, width: size.width, height: size.height, src:src};
        index++;
        context.drawImage(element.firstChild, x, y, size.width, size.height);
      });
      const data = this.canvas.toDataURL("image/png");
      
      const editedImage = new EditedImage({src: baseImageDataUrl, width: width, height: height}, superposables, data);
      
      this.editiedImages.push(editedImage);
      
      this.editedImagesContainer.insertBefore(editedImage.toHtmlElement(), this.editedImagesContainer.firstChild);
      
      this.editedImagesContainer.setAttribute("src", data);
    } else { // clear photo;
      const context = this.canvas.getContext("2d");
      context.fillStyle = "#aaaaaa";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // const data = this.canvas.toDataURL("image/png");
      // this.editedImagesContainer.setAttribute("src", data);
    }
  }
  
  permsisionButtonClickEvent(){
    if(this.removeStream()) {
      if (this.editingImg.files.length !== 0){
        this.setImgAsSrc();
      }
      this.video.classList.remove("active");
    };
    
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      document.getElementById("editing-video").srcObject = stream;
      document.getElementById("editing-video").play();
      
      this.permsisionButton.innerHTML = "Remove webcam capture";
      this.setVideoAsSrc();
    })
    .catch((err) => {
      console.error(`An error occurred: ${err}`);
    });
  }
  
  saveButtonClickEvent(){
    fetch(this.editedImagesContainer.src).then(res => res.blob()).then(blob => {
      var superposables = {};
      var index = 0;
      var sourceSize = this.focusSource.getBoundingClientRect();
      document.querySelectorAll(".superposableImageImgContainer.layered").forEach((element)=>{
        var size = element.getBoundingClientRect();
        var x = size.left - sourceSize.left;
        var y = size.top - sourceSize.top;
        var src = (new URL(element.firstChild.src)).pathname;
        superposables[index] = {x:x, y:y, width: size.width, height: size.height, src:src};
        index++;
      });
      
      var imgSize = {width: sourceSize.width, height: sourceSize.height};      
      const file = new File([blob], 'dot.png', blob)
      editingService.uploadPicture(file, JSON.stringify(superposables), JSON.stringify(imgSize));
      // console.log(file)
    })
  }
  
  addSuperposableImages(){
    editingService.getSuperposableImages().then(async (response)=>{
      if (response && response.ok){
        await response.json().then((obj)=>{
          Array.from(obj).forEach((value)=>{
            var img = new SuperposableImage(value['file_path']);
            this.superposableImages.push(img);
            this.superposableImagesContainer.appendChild(img.element);
          })
          return obj;
        })
      }
      return null;
    })
  }
  
  resizeEvent(ev, images){
    srcDimention = this.document.querySelector(".focusSource").getBoundingClientRect();
    document.querySelector("#layered-image-container").style.top = srcDimention.top;
    document.querySelector("#layered-image-container").style.left = srcDimention.left;
    document.querySelector("#layered-image-container").style.width = srcDimention.width;
    document.querySelector("#layered-image-container").style.height = srcDimention.height;
  }
  
  constructor(){
    history.replaceState("","","https://localhost:833/editing")
    document.getElementById("container").innerHTML = this.body;
    
    this.video = document.getElementById("editing-video");
    this.editingImg = document.getElementById("editing-video-img");
    this.canvas = document.getElementById("editing-canvas");
    this.editedImagesContainer = document.getElementById("edited-images-output");
    this.captureButton = document.getElementById("editing-capture");
    this.permsisionButton = document.getElementById("editing-permissions-button");
    this.saveButton = document.getElementById("save-photo-button");
    this.uploadButton = document.getElementById("editing-upload-button");
    this.layereImageContainer = document.querySelector("#layered-image-container");
    
    this.superposableImagesContainer = document.getElementById("superposableImageImgContainer");
    
    this.uploadButton.addEventListener("change", ()=>{this.uploadButtonChangeEvent()});
    
    this.video.addEventListener("canplay", ()=>{this.videoCanPlayEvent()});
    
    this.captureButton.addEventListener("click", ()=>{this.captureButtonClickEvent()});
       
    this.permsisionButton.addEventListener("click", ()=>{this.permsisionButtonClickEvent()});
    
    // this.saveButton.addEventListener("click", ()=>{this.saveButtonClickEvent()});   
    
    this.addSuperposableImages();
    
    this.permsisionButtonClickEvent();
    
    
    window.addEventListener("resize", (ev)=>{ this.resizeEvent(ev, this.superposableImages)});
  }
  
}

{
  new EditingPage();
}