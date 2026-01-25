class FeedService{
  constructor(){
  }

  async getFeed(){
    return await fetch("https://localhost:833/get_feed_images.php", {
      method: "GET",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      }
    })
  }
}