
{
  class ProfilePage{
    body = `
    <link id="style" rel="stylesheet" href="/css/profile-page.css">
    <h1>Profile</h1>
    <form id="client-info-container" onsubmit="updateProfile(event)">
      <label>
        <span>Username</span>
        <input type="text" id="client-username-input">
      </label>
      <label>
        <span>Email</span>
        <input type="email" id="client-email-input">
      </label>
      <label>
        <span>Send mail on new comment</span>
        <input type="checkbox" id="client-comment-notif">
      </label>
      <button type="submit">save</button>
    </form>
    <div id="client-posts-container">
      <h2>Your posts</h2>
      <div id="client-posts-list">
      </div>
    </div>
    `;
 
    
    constructor(){
      history.replaceState("","","https://localhost:4243/profile")
      document.getElementById("container").innerHTML = this.body;
      
      async function updateProfile(event){
        // console.log(event);
        if (event instanceof Event){
          event.preventDefault();
          let usernameInput = document.querySelector("#client-username-input").value
          let emailInput = document.querySelector("#client-email-input").value
          let commentNotifInput = document.querySelector("#client-comment-notif").checked
          
          userService.updateProfile(usernameInput, emailInput, commentNotifInput);
          return false;
        }
      }
      
      let form = document.querySelector("#client-info-container");
      if (form instanceof HTMLFormElement){
        form.onsubmit = updateProfile;
      }
      
      let usernameInput = document.querySelector("#client-username-input")
      let emailInput = document.querySelector("#client-email-input")
      let commentNotifInput = document.querySelector("#client-comment-notif")
      
      userService.getClient().then(client=>{
        if (client instanceof User){
          usernameInput.value = client.username;
          emailInput.value = client.email;
          commentNotifInput.checked = client.sendCommentNotif == 1;
        }
      });
      
      
      let postListContainer = document.querySelector("#client-posts-list");
      userService.getClientPosts().then(response => {
        if (response instanceof Response && response.ok){
          response.json().then(obj=>{
            Object.values(obj).forEach(value=>{
              console.log(value);
              let path = value['path'];
              let id = value['id'];
              let username = value['username'];
              let uploadTime = value['uploaded_at'];
              let comments = value['comments'];
              let likes= value['likes'];
              let likedByClient = value['likes_from_client'];
              if (path && id && uploadTime && likes != undefined && likedByClient != undefined){
                let post = new CamagruPost(id, path, "", uploadTime, comments, likes, likedByClient, {allowDelete: true});
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