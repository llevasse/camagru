
{
  class ProfilePage{
    body = `
    <link id="style" rel="stylesheet" href="/css/profile-page.css">
    <h1>Profile</h1>
    <div id="client-posts-container">
      <h2>Your posts</h2>
      <div id="client-posts-list">

      </div>
    </div>
    `;
    
    
    constructor(){
      history.replaceState("","","https://localhost:4243/profile")
      document.getElementById("container").innerHTML = this.body;
      
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