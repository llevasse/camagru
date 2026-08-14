var body = `
  <link id="style" rel="stylesheet" href="/css/feed.css">
  <h1>Camagru</h1>
  <h2 id="no-post-found">No post found :(</h2>
  <div id="post-list-container"></div>
`

{
  history.replaceState("","","/")
	document.getElementById("container").innerHTML = body;
  
  let postListContainer = document.querySelector("#post-list-container");
  let shouldIKeepGoing = true;
  let fetching = false;
	
	function getDocHeight() {
    var D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  }
  
  document.onscroll = () => { 
		if (document.documentElement.scrollTop + document.documentElement.clientHeight >= getDocHeight() - 100) { // make new search request when close to bottom of page
      searchAndAddPosts(postListContainer.childElementCount);
    }
  };
  
  async function searchAndAddPosts(offset = 0){
    if (shouldIKeepGoing == false || fetching == true) return;
		fetching = true;
    await postsService.getPosts(offset).then(async response => {
      if (response instanceof Response && response.ok){
        return await response.json().then(obj=>{
          shouldIKeepGoing = obj.length == 5; //No more post not yet fetched
          Object.values(obj).forEach(postObj => {
            let path = postObj['path'];
            let id = postObj['id'];
            let username = postObj['username'];
            let uploadTime = postObj['uploaded_at'];
            let comments = postObj['comments'];
            let likes= postObj['likes'];
            let likedByClient = postObj['likes_from_client'];
            if (path && id && username && uploadTime && likes != undefined && likedByClient != undefined){
							let post = new CamagruPost(id, path, {
								username: username,
								uploadTime: uploadTime,
								comments: comments,
								likes: likes,
								likedByClient: likedByClient,
							});
              postListContainer.appendChild(post.toHtmlElement());
            }
          })
        })
      }
    })
    fetching = false;
    if (postListContainer.childElementCount != 0 && document.querySelector("#no-post-found") != undefined){
			document.querySelector("#no-post-found").remove();
    }
  }
	searchAndAddPosts();
}