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
          if (path && id && username && uploadTime){
            let post = new CamagruPost(id, path, username, uploadTime, comments);
            postListContainer.insertBefore(post.toHtmlElement(), postListContainer.firstChild);
          }
        })
      })
    }
	})
}