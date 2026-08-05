{
  // Layered images displayed over webcam video or user uploaded image
  class SuperposableImageLayered{
    body = `<div class="superposableImageImgContainer">
      <img class="superposableImageImg" src="{IMG_SRC}">
    </div>`;
    
    img_url;
    
    defaultSpawnXPositionPercent = .20;
    defaultSpawnYPositionPercent = .20;
    
    widthInPercent;
    heightInPercent;
    
    xPositionPercent = .2;
    yPositionPercent = .2;
    
    allowMoving;
    
    move = false;
    begPosition;
    newPosition;
    index = 0;
    
    layeredImageContainer;
    
    superposableElement;
    
    constructor(img_url, {index=0, allowMoving=true}){
      this.superposableElement = document.createElement("div");
      this.superposableElement.draggable = false;
      this.superposableElement.classList.add("superposableImageImgContainer");
      this.superposableElement.classList.add("layered");
  
      this.superposableElement.style.left = `${this.defaultSpawnXPositionPercent * 100}%`;
      this.superposableElement.style.top = `${this.defaultSpawnYPositionPercent * 100}%`;
      
      this.img_url = img_url;
      
      const img = new Image();
      img.onload = (ev)=>{this.initImgSizeInPercent()};
      img.src = img_url;
      img.classList.add("superposableImageImg");
      img.draggable = false;
      
      this.superposableElement.appendChild(img);
      
      
      this.index = index;
      this.allowMoving = allowMoving;
      
      this.superposableElement.addEventListener("pointerdown", (ev)=>{this.onpointerdown(ev);})
      this.superposableElement.addEventListener("pointerup", (ev)=>{this.onpointerup(ev);})
      this.superposableElement.addEventListener("pointermove", (ev)=>{this.onpointermove(ev);})
      
      document.querySelector("#layered-image-container").dispatchEvent(new CustomEvent('newChild', {'detail':this}));
    }
    
    // Needs to be called after img has been added to DOM
    initImgSizeInPercent(){
      const imgDimensions = this.superposableElement.lastChild.getBoundingClientRect();
      const srcDimensions = document.querySelector(".focusSource").getBoundingClientRect();
      this.widthInPercent = imgDimensions.width /  srcDimensions.width;
      this.heightInPercent = imgDimensions.height /  srcDimensions.height;
      this.superposableElement.style.width = `${this.widthInPercent * 100}%`;
      this.superposableElement.style.height = `${this.heightInPercent * 100}%`;
    }
    
    positionFromPointerEvent(ev){
      return {clientX : ev.clientX, clientY : ev.clientY,
              offsetX : ev.offsetX, offsetY : ev.offsetY,
              movementX: ev.movementX, movementY: ev.movementY,
              pageX: ev.pageX, pageY: ev.pageY,
      };
    }
    
    onpointerdown(ev){
      if (this.allowMoving){
        this.move = true;
        this.begPosition = this.positionFromPointerEvent(ev);
      }
    }
    
    onpointerup(ev){
      if (this.allowMoving){
        this.move = false;
        document.querySelector("#layered-image-container").dispatchEvent(new CustomEvent('movedChild', {'detail':this}));      
        let parentSize = document.querySelector("#layered-image-container").getBoundingClientRect();
        let imageSize = this.superposableElement.getBoundingClientRect();
        if (imageSize.right < parentSize.left || imageSize.top > parentSize.bottom || imageSize.left > parentSize.right || imageSize.bottom < parentSize.top){
          document.querySelector("#layered-image-container").dispatchEvent(new CustomEvent('removeChild', {'detail':this}));  
          this.superposableElement.remove();
        }
      }
    }
    
    onpointermove(ev){
      if (this.allowMoving && this.move){
        this.newPosition = this.positionFromPointerEvent(ev);   
        if (this.index != null){
          var elementPos = this.superposableElement.getBoundingClientRect();
          var diff = {offsetX : this.newPosition.offsetX - this.begPosition.offsetX, offsetY : this.newPosition.offsetY - this.begPosition.offsetY};
          
          var srcDimensions = document.querySelector(".focusSource").getBoundingClientRect();
                  
          // get new postion in pixel of image relative to it's parent (#layered-image-container)
          var left = elementPos.x + (diff.offsetX) - srcDimensions.x;
          var top  = elementPos.y + (diff.offsetY) - srcDimensions.y;
  
          this.xPositionPercent = left / srcDimensions.width;
          this.yPositionPercent = top / srcDimensions.height;
          
          this.superposableElement.style.left = `${this.xPositionPercent * 100}%`;
          this.superposableElement.style.top = `${this.yPositionPercent * 100}%`;
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
    
      
      this.editingVideoContainer = document.querySelector("#editing-video-container");
      this.layeredImageContainer = document.querySelector("#layered-image-container");
      
      this.element.addEventListener("click", ()=>{
        let container =document.querySelector("#layered-image-container"); 
        let layer = new SuperposableImageLayered(img_url, {index: container.childElementCount});
        container.appendChild(layer.superposableElement);
        
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
      if (!(superposableImages instanceof Array)){
        throw ("superposableImages should be an array of SuperposableImageLayered class instance")
      }
      if (superposableImages.length == 0){
        throw ("superposableImages should contain at least one element")
      }
      if (!(superposableImages[0] instanceof SuperposableImageLayered)){
        throw ("superposableImages should contain SuperposableImageLayered instances")
      }
      
      this.baseImage = baseImage;
      this.superposableImages = superposableImages;
      this.finalImageDataUrl = finalImageDataUrl;
      this.imgEl = new Image();
      this.imgEl.src = finalImageDataUrl;
      this.uploaded = false;
    }
    
    _createDeleteButton(){
      let btn = document.createElement("button");
      btn.className = "edited-image-delete-button";
      btn.onclick = ()=>{
        let ancestor = btn.closest('.edited-image');
        if (ancestor)
          ancestor.remove();
      };
      
      let img = document.createElement("img");
      btn.appendChild(img);
      
      return btn;
    }
    
    _createSaveButton(){
      let btn = document.createElement("button");
      btn.className = "edited-image-save-button";
      btn.onclick = ()=>{
        if (this.uploaded) return;
        fetch(this.baseImage.src).then(res => res.blob()).then(blob => {      
          var imgSize = {width: this.baseImage.width, height: this.baseImage.height};      
          const file = new File([blob], 'dot.png', blob)
          
                  
          let superposables = {};
          var index = 0;
          this.superposableImages.forEach((image)=>{
            if (image instanceof SuperposableImageLayered){
              superposables[index] = {
                x:image.xPositionPercent * imgSize.width,
                y:image.yPositionPercent * imgSize.height,
                width: image.widthInPercent * imgSize.width,
                height: image.heightInPercent * imgSize.height,
                src:image.img_url};
              index++;  
            }
          })
          
          editingService.uploadPicture(file, JSON.stringify(superposables), JSON.stringify(imgSize));
        })
        let ancestor = btn.closest('.edited-image');
        if (ancestor)
          ancestor.remove();
      };
      
      let img = document.createElement("img");
      btn.appendChild(img);
      
      return btn;
    }
    
    _createEditButton(){
      let btn = document.createElement("button");
      btn.className = "edited-image-edit-button";
      btn.onclick = ()=>{
        document.querySelector("#editing-container").dispatchEvent(new CustomEvent('reEditImage', {detail: this}))
        let ancestor = btn.closest('.edited-image');
        if (ancestor)
          ancestor.remove();
      };
      
      let img = document.createElement("img");
      btn.appendChild(img);
      
      return btn;
    }
    
    toHtmlElement(){
      let e = document.createElement("div");
      e.classList.add("edited-image");
      
      let superposableImagesContainer = document.createElement("div");
      superposableImagesContainer.className = "editedSuperposableImagesContainer"
      
      this.superposableImages.forEach((image)=>{
        if (image instanceof SuperposableImageLayered){
          superposableImagesContainer.appendChild(image.superposableElement);
        }
      })
      
      let buttonsContainer = document.createElement("div");
      buttonsContainer.className = "edited-buttons-container";
      buttonsContainer.appendChild(this._createSaveButton());
      buttonsContainer.appendChild(this._createEditButton());
      buttonsContainer.appendChild(this._createDeleteButton());
      
      e.appendChild(this.imgEl);    
      e.appendChild(superposableImagesContainer);;      
      e.appendChild(buttonsContainer);
      return e;
    }
  }
  
  class EditingPage{
    body = `
    <link id="style" rel="stylesheet" href="/css/editing-page.css">
    <link id="style" rel="stylesheet" href="/css/edit-image.css">
    <div id="editing-container">
      <div id="editing-main-div">
        <div id="editing-video-n-buttons-container">
          <div id="editing-video-container">
            <video disablepictureinpicture="true" id="editing-video"></video>
            <img id="editing-video-img"></img>
            <div id="layered-image-container"></div>
            <span id="webcamDisabledMessage">Your webcam access is forbiden, change your permissions settings to use the webcam.</span>
          </div>
          <div id="editing-video-buttons-container">
            <button class="media-selector-buttons video-off" id="video-permissions-button">
              <img>
            </button>
            <label class="media-selector-buttons" id="file-upload-button">
              <img>
              <input style="display: none;" id="editing-upload-button" type="file" accept="image/*">
            </label>
            <button disabled class="media-selector-buttons" id="editing-capture">
              <img>
            </button>
          </div>
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
    webcamDisabledMessage;
    
    focusSource;
      
    superposableImagesContainer;
    layeredImageContainer;
    
    editedImages = [];
    activeSuperposableImages = [];
    
    toggleVideoButtonClass(){
      if (this.permsisionButton.classList.contains('video-on')){
        this.permsisionButton.classList.replace('video-on', 'video-off')
      }
      else{
        this.permsisionButton.classList.replace('video-off', 'video-on')
      }
    
    }
    
    removeStream(){
      if (this.streaming){  // cancel stream
        this.video.srcObject.getTracks().forEach(track=>track.stop());
        this.streaming = false;
        this.toggleVideoButtonClass()
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
      this.webcamDisabledMessage.className = '';
      this.resizeEvent(null, null);
      this.clearSelectedSuperposableImages();
    }
    
    uploadButtonChangeEvent(){
      if (this.uploadButton.files.length !== 0){
        try {
          let img = new Image();
          img.onload = ()=>{
            this.removeStream();
            this.setImgAsSrc();
            this.editingImg.src = URL.createObjectURL(this.uploadButton.files[0]); 
          }
          img.onerror = function() {
            alert("Uploaded image is not valid");
          };
          img.src =URL.createObjectURL(this.uploadButton.files[0]);          
        }
        catch(e){
          return;
        }
        
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

        const data = this.canvas.toDataURL("image/png");
        
        let clonedSuperposables = [];
        
        this.activeSuperposableImages.forEach((image)=>{
          if (image instanceof SuperposableImageLayered){
            image.allowMoving = false;
            let newImage = image;
            clonedSuperposables.push(newImage);
          }
        });
        const editedImage = new EditedImage({src: baseImageDataUrl, width: width, height: height}, clonedSuperposables, data);
        
        this.editedImages.push(editedImage);
        
        this.editedImagesContainer.insertBefore(editedImage.toHtmlElement(), this.editedImagesContainer.firstChild);        
      } else { // clear photo;
        const context = this.canvas.getContext("2d");
        context.fillStyle = "#aaaaaa";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
		      this.webcamDisabledMessage.className = '';
					document.getElementById("editing-video").srcObject = stream;
          document.getElementById("editing-video").play();
          
          this.toggleVideoButtonClass();
          this.setVideoAsSrc();
        })
        .catch((err) => {
          this.setVideoAsSrc();
      		this.video.classList.remove('active');
      		this.webcamDisabledMessage.className = 'active';
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
    
    resizeEvent(ev, images){}
    
    clearSelectedSuperposableImages(){
      document.querySelector("#layered-image-container").innerHTML = "";
      document.querySelector("#editing-capture").setAttribute('disabled', true);
      this.activeSuperposableImages = [];
    }
    
    constructor(){
      history.replaceState("","","/editing")
      document.getElementById("container").innerHTML = this.body;
      
      this.editingContainer = document.querySelector("#editing-container");
      
      this.video = document.getElementById("editing-video");
      this.editingImg = document.getElementById("editing-video-img");
      this.canvas = document.getElementById("editing-canvas");
      this.editedImagesContainer = document.getElementById("edited-images-output");
      this.captureButton = document.getElementById("editing-capture");
      this.permsisionButton = document.getElementById("video-permissions-button");
      this.saveButton = document.getElementById("save-photo-button");
      this.uploadButton = document.getElementById("editing-upload-button");
      this.layeredImageContainer = document.querySelector("#layered-image-container");
      this.webcamDisabledMessage = document.querySelector("#webcamDisabledMessage");      
      
      this.layeredImageContainer.addEventListener("newChild", (event)=>{
        this.activeSuperposableImages.push(event.detail);
        this.captureButton.removeAttribute("disabled");
      })
      
      this.layeredImageContainer.addEventListener("movedChild", (event)=>{
        let detail = event.detail;
        if (detail instanceof SuperposableImageLayered){
          if (this.activeSuperposableImages.at(detail.index)){
            this.activeSuperposableImages[detail.index] = detail;
          }
        }
      })
      
      this.layeredImageContainer.addEventListener("removeChild", (event)=>{
        let detail = event.detail;
        if (detail instanceof SuperposableImageLayered){
          if (this.activeSuperposableImages.at(detail.index)){
            this.activeSuperposableImages.splice(detail.index, 1);
            let i = 0;
            this.activeSuperposableImages.forEach((element)=>{
              element.index = i;
              i++;
            })
            if (this.activeSuperposableImages.length == 0){
              document.querySelector("#editing-capture").setAttribute('disabled', true);
            }
          }
        }
      })
      
      this.editingContainer.addEventListener("reEditImage", (event)=>{
        let editedImage = event.detail;
        if (editedImage instanceof EditedImage){
          this.clearSelectedSuperposableImages();
          this.removeStream();
          this.setImgAsSrc();
          this.editingImg.src = editedImage.finalImageDataUrl;
          let clonedSuperposables = editedImage.superposableImages.slice();
          clonedSuperposables.forEach((element)=>{
            if (element instanceof SuperposableImageLayered){
              element.allowMoving = true;
              this.layeredImageContainer.dispatchEvent(new CustomEvent('newChild', {'detail':element}));
              this.layeredImageContainer.appendChild(element.superposableElement);
            }
          })          
        }
      })
      
      this.superposableImagesContainer = document.getElementById("superposableImageImgContainer");
      
      this.uploadButton.addEventListener("change", ()=>{this.uploadButtonChangeEvent()});
      
      this.video.addEventListener("canplay", ()=>{this.videoCanPlayEvent()});
      
      this.captureButton.addEventListener("click", ()=>{
        this.captureButtonClickEvent();
        this.clearSelectedSuperposableImages();
      });
        
      this.permsisionButton.addEventListener("click", ()=>{this.permsisionButtonClickEvent()});
            
      let editingMainDiv = document.querySelector("#editing-main-div")
      
      let resizeObserver = new ResizeObserver((entry)=>{
        this.resizeEvent(null, null);
      })
      
      resizeObserver.observe(editingMainDiv);
            
      this.addSuperposableImages();
      
      this.permsisionButtonClickEvent();      
    }
    
  }
  
  new EditingPage();
}