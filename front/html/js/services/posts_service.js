class PostsService{
  constructor(){
  }

  async getPosts(){
    return await fetch("https://localhost:4243/get_feed_images.php", {
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
}