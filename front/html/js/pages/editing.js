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
  
  onClick(){
    console.log(this.element);
    let clone = this.element.cloneNode(true);
    this.index = this.editingVideoContainer.children.length;
    clone.classList.add("layered");
    
    var videoDimension = document.getElementById("editing-video").getBoundingClientRect();
    const defaultSpawnXPositionPercent = .20;
    const defaultSpawnYPositionPercent = .20;
                  
                  
    var layerX = videoDimension.x + (videoDimension.width * defaultSpawnXPositionPercent);
    var layerY = videoDimension.y + (videoDimension.height * defaultSpawnYPositionPercent);
    
    clone.style.left = `${layerX}px`;
    clone.style.top = `${layerY}px`;
    
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
          
          this.xPositionPercent = el.getBoundingClientRect().left / videoDimension.width
          this.yPositionPercent = el.getBoundingClientRect().top / videoDimension.height
        }
      }
    })
    
    clone.addEventListener("resize", ()=>{
      var el = this.editingVideoContainer.children[this.index];
                        
      var layerX = videoDimension.x + (videoDimension.width * this.xPositionPercent);
      var layerY = videoDimension.y + (videoDimension.height * this.yPositionPercent);
      console.log(layerX, layerY);
      el.style.left = `${layerX}px`;
      el.style.top = `${layerY}px`;
    })
    
    onpointerdown=""
    
    this.editingVideoContainer.appendChild(clone);
  }
}

class EditingPage{
  body = `
  <link id="style" rel="stylesheet" href="/css/editing-page.css">
  <div id="editing-container">
    <div id="editing-main-div">
      <div id="editing-video-container">
        <video id="editing-video"></video>
      </div>
      <img id="editing-video-img"></img>
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
      <div class="output">
        <img id="editing-photo" src="" alt="The screen capture will appear in this box." />
        <button id="save-photo-button">Save</button>
      
      </div>
    </div>
  </div>`;
  
  
  streaming = false;
  
  video;
  editingImg;
  canvas;
  photo;
  captureButton;
  permsisionButton;
  uploadButton;
  saveButton;
  
  focusSource;
  
  superposableImages = [];
  
  superposableImagesContainer;
  
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
    if (this.editingImg.classList.contains("active")){
      this.editingImg.classList.remove("active");
    }
    if (!this.video.classList.contains("active")){
      this.video.classList.add("active");
    }
    this.focusSource = this.video;
  }
  setImgAsSrc(){
    if (this.video.classList.contains("active")){
      this.video.classList.remove("active");
    }
    if (!this.editingImg.classList.contains("active")){
      this.editingImg.classList.add("active");
    }
    this.focusSource = this.editingImg;
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
    const captureSize = this.focusSource.getBoundingClientRect();
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;
    const s = width > height ? height : width;
    if (s) {
      this.canvas.width = width;
      this.canvas.height = height;
      context.drawImage(this.focusSource, 0, 0, width, height);

      const data = this.canvas.toDataURL("image/png");
      this.photo.setAttribute("src", data);
    } else { // clear photo;
      const context = this.canvas.getContext("2d");
      context.fillStyle = "#aaaaaa";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const data = this.canvas.toDataURL("image/png");
      this.photo.setAttribute("src", data);
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
    fetch(this.photo.src).then(res => res.blob()).then(blob => {
      var superposables = {};
      var index = 0;
      var videoSize = this.video.getBoundingClientRect();
      document.querySelectorAll(".superposableImageImgContainer.layered").forEach((element)=>{
        var size = element.getBoundingClientRect();
        var x = size.left - videoSize.left;
        var y = size.top - videoSize.top;
        var src = (new URL(element.firstChild.src)).pathname;
        index++;
        superposables[index] = {x:x, y:y, width: size.width, height: size.height, src:src};
      });
      
      var imgSize = {width: videoSize.width, height: videoSize.height};
      
      console.log(superposables);
      
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
            this.superposableImagesContainer.appendChild(img.element);
          })
          return obj;
        })
      }
      return null;
    })
  }
  
  constructor(){
    history.replaceState("","","https://localhost:833/editing")
    document.getElementById("container").innerHTML = this.body;
    
    this.video = document.getElementById("editing-video");
    this.editingImg = document.getElementById("editing-video-img");
    this.canvas = document.getElementById("editing-canvas");
    this.photo = document.getElementById("editing-photo");
    this.captureButton = document.getElementById("editing-capture");
    this.permsisionButton = document.getElementById("editing-permissions-button");
    this.saveButton = document.getElementById("save-photo-button");
    this.uploadButton = document.getElementById("editing-upload-button");
    
    this.superposableImagesContainer = document.getElementById("superposableImageImgContainer");
    
    this.uploadButton.addEventListener("change", ()=>{this.uploadButtonChangeEvent()});
    
    this.video.addEventListener("canplay", ()=>{this.videoCanPlayEvent()});
    
    this.captureButton.addEventListener("click", ()=>{this.captureButtonClickEvent()});
       
    this.permsisionButton.addEventListener("click", ()=>{this.permsisionButtonClickEvent()});
    
    this.saveButton.addEventListener("click", ()=>{this.saveButtonClickEvent()});   
    
    this.addSuperposableImages();
    
    this.permsisionButtonClickEvent();
  }
}

{
  new EditingPage();
}