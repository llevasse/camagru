class CamagruPost{
  url;
  posterUsername;
  uploadTime;
  
  constructor(url, posterUsername, uploadTime){
    this.url = url
    this.posterUsername = posterUsername;
    this.uploadTime = uploadTime;
  }
  
  getTimeDiffInHour(date1) 
  {
    let now = new Date();
    var milliseconds =(now.getTime() - date1.getTime());
    let seconds = milliseconds / 1000;
    if (seconds < 60)
      return `${Math.abs(Math.round(seconds))} second${seconds > 1 ? 's' : ''} ago`;
    let minutes = seconds / 60;
    if (minutes < 60)
      return `${Math.abs(Math.round(minutes))} minute${minutes > 1 ? 's' : ''} ago`;
    let hours = minutes / 60;
    if (hours < 24)
      return `${Math.abs(Math.round(hours))} hour${hours > 1 ? 's' : ''} ago`;
    let days = hours / 24;
    if (days < 31)
      return `${Math.abs(Math.round(days))} day${days > 1 ? 's' : ''} ago`;
    let month = days / 31;
    if (month < 12)
      return `${Math.abs(Math.round(month))} month${month > 1 ? 's' : ''} ago`;
    let years = month / 12;
    return `${Math.abs(Math.round(years))} year${years > 1 ? 's' : ''} ago`;
  }
  
  toHtmlElement(){
    let e = document.createElement("div");
    e.classList.add("post");
    let imgEl = new Image();
    imgEl.src = this.url
    
    let username = document.createElement("span");
    username.classList.add("post-username");
    username.innerText = this.posterUsername;
    
    let date = document.createElement("span");
    date.classList.add("post-date"); 
    let uploadTime = new Date(Date.parse(this.uploadTime));
    date.innerText = this.getTimeDiffInHour(uploadTime);;
    
    let infoContaier = document.createElement("div");
    infoContaier.classList.add("post-info-container");
    infoContaier.appendChild(username);
    infoContaier.appendChild(date);
    
    e.appendChild(infoContaier);
    e.appendChild(imgEl);    
    return e;
  }
}