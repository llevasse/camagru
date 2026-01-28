
{
  // Layered images displayed over webcam video or user uploaded image
  class SuperposableImageLayered{
    body = `<div class="superposableImageImgContainer">
      <img class="superposableImageImg" src="{IMG_SRC}">
    </div>`;
    
    
    defaultSpawnXPositionPercent = .20;
    defaultSpawnYPositionPercent = .20;
    
    widthInPercent;
    heightInPercent;
    
    xPositionPercent = .2;
    yPositionPercent = .2;
    
    move = false;
    begPosition;
    newPosition;
    index = null;
    
    editingVideoContainer;
    layeredImageContainer;
    
    element;
    
    constructor(img_url){
      this.editingVideoContainer = document.querySelector("#editing-video-container");
      this.layeredImageContainer = document.querySelector("#layered-image-container");
      const srcDimensions = document.querySelector(".focusSource").getBoundingClientRect();
      
      this.element = document.createElement("div");
      this.element.draggable = false;
      this.element.classList.add("superposableImageImgContainer");
      this.element.classList.add("layered");
  
      this.element.style.left = `${this.defaultSpawnXPositionPercent * 100}%`;
      this.element.style.top = `${this.defaultSpawnYPositionPercent * 100}%`;
      
      const img = new Image();
      img.onload = (ev)=>{this.initImgSizeInPercent()};
      img.src = img_url;
      img.classList.add("superposableImageImg");
      img.draggable = false;
      
      this.element.appendChild(img);
      
      
      this.layeredImageContainer.style.top = `${srcDimensions.top}px`;
      this.layeredImageContainer.style.left = `${srcDimensions.left}px`;
      this.layeredImageContainer.style.width = `${srcDimensions.width}px`;
      this.layeredImageContainer.style.height = `${srcDimensions.height}px`;
      
      this.index = this.layeredImageContainer.children.length;
      
      this.element.addEventListener("pointerdown", (ev)=>{this.onpointerdown(ev);})
      this.element.addEventListener("pointerup", (ev)=>{this.onpointerup(ev);})
      this.element.addEventListener("pointermove", (ev)=>{this.onpointermove(ev);})    
    }
    
    // Needs to be called after img has been added to DOM
    initImgSizeInPercent(){
      const imgDimensions = this.element.lastChild.getBoundingClientRect();
      const srcDimensions = document.querySelector(".focusSource").getBoundingClientRect();
      this.widthInPercent = imgDimensions.width /  srcDimensions.width;
      this.heightInPercent = imgDimensions.height /  srcDimensions.height;
      this.element.style.width = `${this.widthInPercent * 100}%`;
      this.element.style.height = `${this.heightInPercent * 100}%`;
    }
    
    positionFromPointerEvent(ev){
      return {clientX : ev.clientX, clientY : ev.clientY,
              offsetX : ev.offsetX, offsetY : ev.offsetY,
              movementX: ev.movementX, movementY: ev.movementY,
              pageX: ev.pageX, pageY: ev.pageY,
      };
    }
    
    onpointerdown(ev){
      this.move = true;
      this.begPosition = this.positionFromPointerEvent(ev);
    }
    
    onpointerup(ev){
      this.move = false;
    }
    
    onpointermove(ev){
      if (this.move){
        this.newPosition = this.positionFromPointerEvent(ev);   
        if (this.index != null){
          var elementPos = this.element.getBoundingClientRect();
          var diff = {offsetX : this.newPosition.offsetX - this.begPosition.offsetX, offsetY : this.newPosition.offsetY - this.begPosition.offsetY};
          
          var srcDimensions = document.querySelector(".focusSource").getBoundingClientRect();
                  
          // get new postion in pixel of image relative to it's parent (#layered-image-container)
          var left = elementPos.x + (diff.offsetX) - srcDimensions.x;
          var top  = elementPos.y + (diff.offsetY) - srcDimensions.y;
  
          this.xPositionPercent = left / srcDimensions.width;
          this.yPositionPercent = top / srcDimensions.height;
          
          this.element.style.left = `${this.xPositionPercent * 100}%`;
          this.element.style.top = `${this.yPositionPercent * 100}%`;
        }
      }
    }
  }
  
  // Images displayed in superposable images list
  class SuperposableImageBase{
    body = `<div class="superposableImageImgContainer">
      <img class="superposableImageImg" src="{IMG_SRC}">
    </div>`;  
    
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
      this.element.addEventListener("click", ()=>{
        let layer = new SuperposableImageLayered(img_url);
        document.querySelector("#layered-image-container").dispatchEvent(new Event('newChild'));
        document.querySelector("#layered-image-container").appendChild(layer.element);
        
        // layer.initImgSizeInPercent();  
      })
    }
  }
  
  class EditedImage{
    baseImage; // {src, width, height}
    superposableImages;
    finalImageDataUrl;
    imgEl;
    uploaded;
    
    constructor(baseImage, superposableImages, finalImageDataUrl){
      this.baseImage = baseImage;
      this.superposableImages = superposableImages;
      this.finalImageDataUrl = finalImageDataUrl;
      this.imgEl = new Image();
      this.imgEl.src = finalImageDataUrl;
      this.uploaded = false;
    }
    
    toHtmlElement(){
      let e = document.createElement("div");
      e.classList.add("edited-image");
      
      let saveBtn = document.createElement("button")
      saveBtn.innerHTML = "save";
      saveBtn.classList.add("edited-image-save-button");
      saveBtn.onclick = ()=>{
        if (this.uploaded) return;
        fetch(this.baseImage.src).then(res => res.blob()).then(blob => {      
          var imgSize = {width: this.baseImage.width, height: this.baseImage.height};      
          const file = new File([blob], 'dot.png', blob)
          editingService.uploadPicture(file, JSON.stringify(this.superposableImages), JSON.stringify(imgSize));
        })  
      };
      
      let deleteBtn = document.createElement("button")
      deleteBtn.innerHTML = "delete";
      deleteBtn.classList.add("edited-image-delete-button");
      deleteBtn.onclick = ()=>{
        let ancestor = deleteBtn.closest(".edited-image");
        if (ancestor instanceof HTMLElement){
          ancestor.remove();
        }
      };
      
      e.appendChild(this.imgEl);    
      e.appendChild(saveBtn);
      e.appendChild(deleteBtn);
      return e;
    }
  }
  
  class EditingPage{
    body = `
    <link id="style" rel="stylesheet" href="/css/editing-page.css">
    <link id="style" rel="stylesheet" href="/css/edit-image.css">
    <div id="editing-container">
      <div id="editing-main-div">
        <div id="editing-video-container">
          <video id="editing-video"></video>
          <img id="editing-video-img"></img>
          <div id="layered-image-container"></div>
        </div>
        <div id="editing-video-buttons-container">
          <button class="media-selector-buttons" id="editing-permissions-button">Remove webcam capture</button>
          <label class="media-selector-buttons">
            <span>Local file</span>     
            <input style="display: none;" id="editing-upload-button" type="file" accept="image/*">
          </label>
          <button disabled class="media-selector-buttons" id="editing-capture">Capture photo</button>
        </div>
        <div id="superposableImageImgContainer">
        </div>
      </div>
      <div id="editing-side-div">
        <canvas id="editing-canvas"></canvas>
        <h2>Unuploaded images</h2>
        <div id="edited-images-output">
        </div>
      </div>
    </div>
    `;
    
    
    streaming = false;
    
    editingContainer;
    
    video;
    editingImg;
    canvas;
    editedImagesContainer;
    captureButton;
    permsisionButton;
    uploadButton;
    saveButton;
    
    focusSource;
      
    superposableImagesContainer;
    layeredImageContainer;
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
      this.resizeEvent(null, null);
      this.clearSelectedSuperposableImages();
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
      this.resizeEvent(null, null);
      this.clearSelectedSuperposableImages();
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
      const sourceSize = this.focusSource.getBoundingClientRect();
      
      const width = sourceSize.width;
      const height = sourceSize.height;
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
        if (this.editingImg.files && this.editingImg.files.length !== 0){
          this.setImgAsSrc();
        }
        this.video.classList.remove("active");
      }
      else{
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
    }
    
    addSuperposableImages(){
      editingService.getSuperposableImages().then(async (response)=>{
        if (response && response.ok){
          await response.json().then((obj)=>{
            Array.from(obj).forEach((value)=>{
              var img = new SuperposableImageBase(value['file_path']);
              this.superposableImagesContainer.appendChild(img.element);
            })
            return obj;
          })
        }
        return null;
      })
    }
    
    resizeEvent(ev, images){
      let layeredImageContainer = document.querySelector("#layered-image-container");
      if (this.focusSource && layeredImageContainer instanceof HTMLElement){
        var srcDimention = this.focusSource.getBoundingClientRect();
        layeredImageContainer.style.top = `${srcDimention.top}px`;
        layeredImageContainer.style.left = `${srcDimention.left}px`;
        layeredImageContainer.style.width = `${srcDimention.width}px`;
        layeredImageContainer.style.height = `${srcDimention.height}px`;
      }
    }
    
    clearSelectedSuperposableImages(){
      document.querySelector("#layered-image-container").innerHTML = "";
      this.captureButton.setAttribute("disabled", "true");
    }
    
    constructor(){
      history.replaceState("","","https://localhost:4243/editing")
      document.getElementById("container").innerHTML = this.body;
      
      this.editingContainer = document.querySelector("#editing-container");
      
      this.video = document.getElementById("editing-video");
      this.editingImg = document.getElementById("editing-video-img");
      this.canvas = document.getElementById("editing-canvas");
      this.editedImagesContainer = document.getElementById("edited-images-output");
      this.captureButton = document.getElementById("editing-capture");
      this.permsisionButton = document.getElementById("editing-permissions-button");
      this.saveButton = document.getElementById("save-photo-button");
      this.uploadButton = document.getElementById("editing-upload-button");
      this.layeredImageContainer = document.querySelector("#layered-image-container");
      
      this.layeredImageContainer.addEventListener("newChild", ()=>{
        this.captureButton.removeAttribute("disabled");
      })
      
      this.superposableImagesContainer = document.getElementById("superposableImageImgContainer");
      
      this.uploadButton.addEventListener("change", ()=>{this.uploadButtonChangeEvent()});
      
      this.video.addEventListener("canplay", ()=>{this.videoCanPlayEvent()});
      
      this.captureButton.addEventListener("click", ()=>{this.captureButtonClickEvent();});
        
      this.permsisionButton.addEventListener("click", ()=>{this.permsisionButtonClickEvent()});
      
      // this.saveButton.addEventListener("click", ()=>{this.saveButtonClickEvent()});
      
      let editingMainDiv = document.querySelector("#editing-main-div")
      
      let resizeObserver = new ResizeObserver((entry)=>{
        this.resizeEvent(null, null);
      })
      
      resizeObserver.observe(editingMainDiv);
            
      this.addSuperposableImages();
      
      this.permsisionButtonClickEvent();
      
      // this.layereImageContainer.addEventListener("pointerdown",(ev)=>{console.log(ev)});
      
      // window.onresize = (ev)=>{ this.resizeEvent(ev, this.superposableImages)};
    }
    
  }
  
  new EditingPage();
}