class CamagruPost{
  id
  url;
  posterUsername;
  uploadTime;
  comments;
  
  commentInputElement;
  commentsContainer;
  
  constructor(id, url, posterUsername, uploadTime, comments){
    this.id = id;
    this.url = url;
    this.posterUsername = posterUsername;
    this.uploadTime = uploadTime;
    this.comments = comments;
  }
  
  getTimeDiffInHour(date1) 
  {
    if (date1 instanceof Date){
      let now = new Date(Date.now());
      var milliseconds =(now.getTime() - date1.getTime());
      let seconds = milliseconds / 1000;
      if (seconds < 60)
        return `${Math.abs(Math.round(seconds))} second${seconds >= 2 ? 's' : ''} ago`;
      let minutes = seconds / 60;
      if (minutes < 60)
        return `${Math.abs(Math.round(minutes))} minute${minutes >= 2 ? 's' : ''} ago`;
      let hours = minutes / 60;
      if (hours < 24)
        return `${Math.abs(Math.round(hours))} hour${hours >= 2 ? 's' : ''} ago`;
      let days = hours / 24;
      if (days < 31)
        return `${Math.abs(Math.round(days))} day${days >= 2 ? 's' : ''} ago`;
      let month = days / 31;
      if (month < 12)
        return `${Math.abs(Math.round(month))} month${month >= 2 ? 's' : ''} ago`;
      let years = month / 12;
      return `${Math.abs(Math.round(years))} year${years >= 2 ? 's' : ''} ago`;
    }
    return null
  }
  
  _createCommentsInputContainer(){    
    let inputContainer = document.createElement("div");
    inputContainer.className = 'comment-input-container'
    
    this.commentInputElement = document.createElement("textarea");    
    this.commentInputElement.className = "comment-input";
    this.commentInputElement.placeholder = "Comment here";
    
    let sendButton = document.createElement("button");
    sendButton.innerText = "send";
    sendButton.className = "comment-send-btn";
    sendButton.onclick = ()=>{
      this._sendComment(this.commentInputElement.value);
    }
    
    this.commentInputElement.addEventListener("keydown", event=>{
      if (event instanceof KeyboardEvent){
        if (event.key == "Enter"){
          this._sendComment(this.commentInputElement.value);
        }
      }
    })
    
    inputContainer.appendChild(this.commentInputElement);
    inputContainer.appendChild(sendButton);
    return inputContainer;  
  }
  
  _sendComment(comment){
    if (comment.trim().length > 0){
      postsService.sendComment(this.id, comment.trim());
      if (this.commentInputElement instanceof HTMLTextAreaElement && this.commentsContainer instanceof HTMLDivElement){
        this.commentInputElement.value = "";
        let client = userService.client;
        if (client instanceof User)
        this.commentsContainer.appendChild(this._createCommentContainer(comment, client.username))
      }
    } 
  }
  
  _createCommentContainer(comment, username){
    let commentContainer = document.createElement("div");
    commentContainer.classList.add("comment-container");
    
    let commentSpan = document.createElement("span");
    commentSpan.classList.add("comment-text")
    commentSpan.innerText = comment;
    
    let commentUsernameSpan = document.createElement("span");
    commentUsernameSpan.classList.add("comment-username")
    commentUsernameSpan.innerText = username;
    
    let p = document.createElement("p");
    p.innerHTML = `${commentUsernameSpan.outerHTML} ${commentSpan.outerHTML}`
    
    commentContainer.appendChild(p);
    return commentContainer;
  }
  
  _createCommentsContainer(){    
    this.commentsContainer = document.createElement("div");
    if (this.comments && this.comments.length > 0){
      this.comments.forEach(obj=>{
        this.commentsContainer.appendChild(this._createCommentContainer(obj['comment'], obj['username']));
      });
    }
    
    return this.commentsContainer;
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
    uploadTime = new Date(uploadTime.getTime() + (Math.abs(uploadTime.getTimezoneOffset()) * 60000)); // get relative to timezone upload time
    date.innerText = this.getTimeDiffInHour(uploadTime);;
    
    let infoContaier = document.createElement("div");
    infoContaier.classList.add("post-info-container");
    infoContaier.appendChild(username);
    infoContaier.appendChild(date);
    
    e.appendChild(infoContaier);
    
    let imageCommentContainer = document.createElement("div");
    imageCommentContainer.className = "image-comment-container"
    imageCommentContainer.appendChild(imgEl);
    imageCommentContainer.appendChild(this._createCommentsInputContainer());
    
    e.appendChild(imageCommentContainer);
    e.appendChild(this._createCommentsContainer());
    return e;
  }
}