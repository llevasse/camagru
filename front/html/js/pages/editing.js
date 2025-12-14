class EditingPage{
  body = `
  <link id="style" rel="stylesheet" href="/css/editing-page.css">
  <div id="editing-container">
    <div id="editing-main-div">
      <video id="editing-video"></video>
      <div id="editing-video-buttons-container">
        <button id="editing-permissions-button">Allow webcam capture</button>  
        <button id="editing-capture">Capture photo</button>
      </div>
    </div>
    <div id="editing-side-div">
      <canvas id="editing-canvas"></canvas>
      <div class="output">
        <img id="editing-photo" src="" alt="The screen capture will appear in this box." />
      </div>
    </div>
  </div>`;
  
  width = "100%";
  height = "100%";
  
  streaming = false;
  
  video;
  canvas;
  photo;
  captureButton;
  permsisionButton;
  
  constructor(){
    history.replaceState("","","https://localhost:833/editing")
    document.getElementById("container").innerHTML = this.body;
    
    this.video = document.getElementById("editing-video");
    this.canvas = document.getElementById("editing-canvas");
    this.photo = document.getElementById("editing-photo");
    this.captureButton = document.getElementById("editing-capture");
    this.permsisionButton = document.getElementById("editing-permissions-button");
    
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
      const videoSize = this.video.getBoundingClientRect();
      // const width = this.video.videoWidth;
      // const height = this.video.videoHeight;
      const width = videoSize.width;
      const height = videoSize.height;
      if (width && height) {
        this.canvas.width = width;
        this.canvas.height = height;
        context.drawImage(this.video, 0, 0, width, height);
  
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
      if (this.streaming){  // cancel stream
        this.video.srcObject.getTracks().forEach(track=>track.stop());
        this.streaming = false;
        this.permsisionButton.innerHTML = "Allow webcam capture";
        return;
      }
      
      navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        document.getElementById("editing-video").srcObject = stream;
        document.getElementById("editing-video").play();
        this.permsisionButton.innerHTML = "Remove webcam capture";
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });
    }); 
  }
}

{
  new EditingPage();
}