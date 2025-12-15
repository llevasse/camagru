class EditingPage{
  body = `
  <link id="style" rel="stylesheet" href="/css/editing-page.css">
  <div id="editing-container">
    <div id="editing-main-div">
      <video id="editing-video"></video>
      <img id="editing-video-img"></img>
      <div id="editing-video-buttons-container">
        <button id="editing-permissions-button">Allow webcam capture</button>  
        <button id="editing-capture">Capture photo</button>
        <input id="editing-upload-button" type="file" accept="image/*">
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
  
  width = "100%";
  height = "100%";
  
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
  
  constructor(){
    history.replaceState("","","https://localhost:833/editing")
    document.getElementById("container").innerHTML = this.body;
    
    fetch("https://localhost:833/get_superposable_images.php");
    
    this.video = document.getElementById("editing-video");
    this.editingImg = document.getElementById("editing-video-img");
    this.canvas = document.getElementById("editing-canvas");
    this.photo = document.getElementById("editing-photo");
    this.captureButton = document.getElementById("editing-capture");
    this.permsisionButton = document.getElementById("editing-permissions-button");
    this.saveButton = document.getElementById("save-photo-button");
    this.uploadButton = document.getElementById("editing-upload-button");
    
    this.uploadButton.addEventListener("change", (ev)=>{
      if (this.uploadButton.files.length !== 0){
        this.removeStream();
        this.setImgAsSrc();
        this.editingImg.src = URL.createObjectURL(this.uploadButton.files[0]);
      }
    })
    
    this.video.addEventListener("canplay", ()=>{
      if (!this.streaming) {
        this.height = this.video.videoHeight / (this.video.videoWidth) * 100;
        // this.video.setAttribute("width", this.width);
        // this.video.setAttribute("height", `${this.height}%`);
        this.canvas.setAttribute("width", this.video.videoWidth);
        this.canvas.setAttribute("height", this.video.videoHeight);
        this.streaming = true;
      }
    });
    
    this.captureButton.addEventListener("click", (ev)=>{
      const context = this.canvas.getContext("2d");
      const captureSize = this.focusSource.getBoundingClientRect();
      const width = captureSize.width;
      const height = captureSize.height;
      const s = width > height ? height : width;
      if (s) {
        this.canvas.width = s;
        this.canvas.height = s;
        context.drawImage(this.focusSource, 0, 0, s, s);
  
        const data = this.canvas.toDataURL("image/png");
        this.photo.setAttribute("src", data);
      } else { // clear photo;
        const context = this.canvas.getContext("2d");
        context.fillStyle = "#aaaaaa";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const data = this.canvas.toDataURL("image/png");
        this.photo.setAttribute("src", data);
      }
      ev.preventDefault();
    });
  
       
    this.permsisionButton.addEventListener("click", ()=>{
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
    }); 
    
    this.saveButton.addEventListener("click", ()=>{
      fetch(this.photo.src).then(res => res.blob()).then(blob => {
        const file = new File([blob], 'dot.png', blob)
        userService.uploadPicture(file);
        // console.log(file)
      })
    })
  }
}

{
  new EditingPage();
}