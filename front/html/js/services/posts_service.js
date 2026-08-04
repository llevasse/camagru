class PostsService{
  constructor(){
  }

  async getPosts(offset = 0){
    return await fetch(`/get_feed_images.php?offset=${offset}`, {
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

    return fetch("/send_comment.php", {
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

    return await fetch("/like_post.php", {
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

    return await fetch("/unlike_post.php", {
      method: "POST",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form
    })
  }
  
  async deletePost(url){
    if (localStorage.getItem('token') == null){
      console.error("Need to be logged to delete pictures");
      return null;
    }
    const form = new FormData();
    form.append('url', url);
    return fetch(`/delete_file.php`, {
      method: 'POST',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form,
    })
  }
}