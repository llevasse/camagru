class PostsService{
  constructor(){
  }

  async getPosts(offset = 0){
    return await myFetch(`/get_feed_images.php?offset=${offset}`, {
      method: "GET",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      }
    })
  }
  
  sendComment(postId, commentContent){
    const comment = new FormData();
    comment.append('post_id', postId);
    comment.append('comment_content', commentContent);

    return myFetch("/send_comment.php", {
      method: "POST",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: comment
    })
  }
  
  async likePost(postId){
    const form = new FormData();
    form.append('post_id', postId);

    return await myFetch("/like_post.php", {
      method: "POST",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form
    })
  }
  
  async unlikePost(postId){
    const form = new FormData();
    form.append('post_id', postId);

    return await myFetch("/unlike_post.php", {
      method: "POST",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form
    })
  }
  
  async deletePost(url){
    const form = new FormData();
    form.append('url', url);
    return myFetch(`/delete_file.php`, {
      method: 'POST',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form,
    })
  }
}