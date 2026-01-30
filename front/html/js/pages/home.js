var body = `
  <link id="style" rel="stylesheet" href="/css/feed.css">
  <h1>Camagru</h1>
  <div id="post-list-container"></div>
`

{
  history.replaceState("","","https://localhost:4243/")
	document.getElementById("container").innerHTML = body;
	
	let postListContainer = document.querySelector("#post-list-container");
	postsService.getPosts().then(response => {
    if (response instanceof Response && response.ok){
      response.json().then(obj=>{
        Object.values(obj).forEach(value=>{
          let path = value['path'];
          let id = value['id'];
          let username = value['username'];
          let uploadTime = value['uploaded_at'];
          let comments = value['comments'];
          let likes= value['likes'];
          let likedByClient = value['likes_from_client'];
          if (path && id && username && uploadTime && likes != undefined && likedByClient != undefined){
            let post = new CamagruPost(id, path, username, uploadTime, comments, likes, likedByClient);
            postListContainer.appendChild(post.toHtmlElement());
          }
        })
      })
    }
	})
}