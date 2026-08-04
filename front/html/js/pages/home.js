var body = `
  <link id="style" rel="stylesheet" href="/css/feed.css">
  <h1>Camagru</h1>
  <div id="post-list-container"></div>
`

{
  history.replaceState("","","/")
	document.getElementById("container").innerHTML = body;
  
  let postListContainer = document.querySelector("#post-list-container");
  let shouldIKeepGoing = true;
	
	function getDocHeight() {
    var D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  }

  function scrollChecker() {
    if (document.documentElement.scrollTop + document.documentElement.offsetHeight >= getDocHeight() - 10) { // make new search request when close to bottom of page
      searchAndAddPosts(postListContainer.childElementCount);
    }
  }
  
  document.onscroll = () => { scrollChecker() };  
  
  function searchAndAddPosts(offset = 0){
    if (shouldIKeepGoing == false) return;
    postsService.getPosts(offset).then(response => {
      if (response instanceof Response && response.ok){
        response.json().then(obj=>{
          shouldIKeepGoing = obj.length == 5;
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
	searchAndAddPosts();
}