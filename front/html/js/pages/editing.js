class EditingPage{
  body = `
  <link id="style" rel="stylesheet" href="/css/editing-page.css">
      <button id="editing-permissions-button">Allow webcam capture</button>  
      <div id="editing-main-div">
        <video id="editing-video">Webcam available.</video>
        <button id="editing-capture">Capture photo</button>
      </div>
      <canvas id="editing-canvas"></canvas>
      <div class="output">
        <img id="editing-photo" src="" alt="The screen capture will appear in this box." />
      </div>
    <div id="editing-side-div"></div>
  `;
  
  width = 320;
  height = 0;
  
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
        this.height = this.video.videoHeight / (this.video.videoWidth / this.width);
    
        this.video.setAttribute("width", this.width);
        this.video.setAttribute("height", this.height);
        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);
        this.streaming = true;
      }
    });
    
    this.captureButton.addEventListener("click", (ev)=>{
      const context = this.canvas.getContext("2d");
      if (this.width && this.height) {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        context.drawImage(this.video, 0, 0, this.width, this.height);
  
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