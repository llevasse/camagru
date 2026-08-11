class CamagruPost{
  id
  url;
  posterUsername;
  uploadTime;
  comments;
  allowDelete;
  
  commentInputElement;
  commentsContainer;
  likes;
  likedByClient;
  
  isPreview;
  allowEdit;
  
  constructor(id, url, {
			username = '',
			uploadTime = new Date(DataTransfer.now()),
			comments = [],
			likes = 0,
			likedByClient = false,
	  	allowDelete = false,
	  	allowEdit = false,
	  	isPreview = false
  	}){
    this.id = id;
    this.url = url;
    this.posterUsername = username;
    this.uploadTime = uploadTime;
    this.comments = comments;
    this.allowDelete = allowDelete;
    this.likes = likes;
    this.likedByClient = likedByClient;
    this.allowEdit = allowEdit;
    this.isPreview = isPreview;
  }
  
  getTimeDiffInHour(date1) {
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
    sendButton.className = "comment-send-btn";
    sendButton.appendChild(new Image());
    sendButton.onclick = ()=>{
      this._sendComment(this.commentInputElement.value);
    }
    
    this.commentInputElement.addEventListener("keydown", event=>{
      if (event instanceof KeyboardEvent){
        if (event.key == "Enter"){
          this._sendComment(this.commentInputElement.value);
          event.preventDefault();
        }
      }
    })
    
    
    let likeButton = document.createElement("button");
    likeButton.className = "like-btn";
    if (this.likedByClient){
      likeButton.classList.add("liked");
    }
    likeButton.appendChild(new Image());
    
    let likesCount = document.createElement("span");
    likesCount.className = "likes-count";
    likesCount.innerText = this.likes;
    
    likeButton.appendChild(likesCount);
    
    likeButton.onclick = ()=>{
      if (this.likedByClient){
        this.likes--;
        postsService.unlikePost(this.id);
        likeButton.classList.remove("liked");
        this.likedByClient = false;
        likesCount.innerText = this.likes;
      }
      else{
        this.likes++;
        postsService.likePost(this.id);
        likeButton.classList.add("liked");
        this.likedByClient = true;
        likesCount.innerText = this.likes;
      }
    }
    
    
    inputContainer.appendChild(this.commentInputElement);
    inputContainer.appendChild(sendButton);
    inputContainer.appendChild(likeButton);
    return inputContainer;  
  }
  
  _sendComment(comment){
		const commentTrimmed = comment.trim();
    if (commentTrimmed.length > 0){
      postsService.sendComment(this.id, commentTrimmed).then((response) => {
				if (response.ok){
					if (this.commentInputElement instanceof HTMLTextAreaElement && this.commentsContainer instanceof HTMLDivElement){
						this.commentInputElement.value = "";
						let client = userService.client;
						if (client instanceof User)
						this.commentsContainer.appendChild(this._createCommentContainer(commentTrimmed, client.username))
					}
				}
			});
    } 
  }
  
  _createCommentContainer(comment, username){
    let commentContainer = document.createElement("div");
    commentContainer.classList.add("comment-container");
    
    let commentSpan = document.createElement("span");
    commentSpan.classList.add("comment-text");
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
    this.commentsContainer.className = "comments-container";
    if (this.comments && this.comments.length > 0 && this.commentsContainer instanceof HTMLElement){
      this.comments.forEach(obj=>{
        this.commentsContainer.appendChild(this._createCommentContainer(obj['comment'], obj['username']));
      });
    }
    
    return this.commentsContainer;
  }
  
  _createDeleteButton(){
    let btn = document.createElement("button");
    btn.className = "delete-post-btn";
    btn.onclick = ()=>{
      postsService.deletePost(this.url)
      if (btn.closest('.post'))
        btn.closest('.post').remove();
    };
    
    let img = document.createElement("img");
    btn.appendChild(img);
    
    return btn;
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
    if (userService.client){
      imageCommentContainer.appendChild(this._createCommentsInputContainer());
    }
    
    e.appendChild(imageCommentContainer);
    e.appendChild(this._createCommentsContainer());
    if (this.allowDelete){
      e.appendChild(this._createDeleteButton());
    }
    return e;
  }
}