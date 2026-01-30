class PostsService{
  constructor(){
  }

  async getPosts(offset = 0){
    return await fetch(`https://localhost:4243/get_feed_images.php?offset=${offset}`, {
      method: "GET",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      }
    })
  }
  
  async sendComment(postId, commentContent){
    const comment = new FormData();
    comment.append('post_id', postId);
    comment.append('comment_content', commentContent);

    return await fetch("https://localhost:4243/send_comment.php", {
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

    return await fetch("https://localhost:4243/like_post.php", {
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

    return await fetch("https://localhost:4243/unlike_post.php", {
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
    return fetch(`https://localhost:4243/delete_file.php`, {
      method: 'POST',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form,
    })
  }
}