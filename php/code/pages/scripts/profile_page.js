
{
  class ProfilePage{
    body = `
    <link id="style" rel="stylesheet" href="/css/profile-page.css">
    <h1>Profile</h1>
    <form id="client-info-container" onsubmit="updateProfile(event)">
      <label>
        <span>Username</span>
        <input maxlength="30" type="text" id="client-username-input">
      </label>
      <label>
        <span>Email</span>
        <input maxlength="100" type="email" id="client-email-input">
      </label>
      <label id="client-comment-notif-label">
        <span>Send mail on new comment</span>
        <input type="checkbox" id="client-comment-notif">
      </label>
      <button id="save-btn" type="submit">save</button>
      <span id="status"></span>
      <a id="send-reset-password">Send reset password mail</a>
    </form>
    <div id="client-posts-container">
      <h2>Your posts</h2>
      <div id="client-posts-list">
      </div>
    </div>
    `;
 
    
    constructor(){
      history.replaceState("","","/profile")
      document.getElementById("container").innerHTML = this.body;
      
      async function updateProfile(event){
        if (event instanceof Event){
					const status = document.querySelector("#status");
					status.textContent = "";
          event.preventDefault();
          let usernameInput = document.querySelector("#client-username-input").value
          let emailInput = document.querySelector("#client-email-input").value
          let commentNotifInput = document.querySelector("#client-comment-notif").checked
          
          const response = await userService.updateProfile(usernameInput, emailInput, commentNotifInput);
          if (response){
						status.textContent = response;
          }
          return false;
        }
      }
      
      let form = document.querySelector("#client-info-container");
      if (form instanceof HTMLFormElement){
        form.onsubmit = updateProfile;
      }
      
      let usernameInput = document.querySelector("#client-username-input");
      let emailInput = document.querySelector("#client-email-input");
      let commentNotifInput = document.querySelector("#client-comment-notif");
      
      let resetPasswordBtn = document.querySelector("#send-reset-password");
      
      userService.getClient().then(client=>{
        if (client instanceof User){
          usernameInput.value = client.username;
          emailInput.value = client.email;
          commentNotifInput.checked = client.sendCommentNotif == 1;
        }
      });
      
      if (resetPasswordBtn instanceof HTMLElement){
        resetPasswordBtn.onclick = ()=>{
          userService.resetPasswordMail();
					const status = document.querySelector("#status");
          status.innerHTML = "Reset password email sent."
        }
      }
      
      
      let postListContainer = document.querySelector("#client-posts-list");
      userService.getClientPosts().then(response => {
        if (response instanceof Response && response.ok){
          response.json().then(obj=>{
            Object.values(obj).forEach(value=>{
              let path = value['path'];
              let id = value['id'];
              let uploadTime = value['uploaded_at'];
              let comments = value['comments'];
              let likes= value['likes'];
              let likedByClient = value['likes_from_client'];
              if (path && id && uploadTime && likes != undefined && likedByClient != undefined){
                let post = new CamagruPost(id, path, {
									username: "",
									uploadTime: uploadTime,
									comments: comments,
									likes: likes,
									likedByClient: likedByClient,
									allowDelete: true,
                });
                postListContainer.insertBefore(post.toHtmlElement(), postListContainer.firstChild);
              }
            })
          })
        }
      });
    } 
  }
  
  new ProfilePage();
}