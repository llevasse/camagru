class UserService{
  client;
  
  constructor(){
    this.client = null;
  }

  async getClient(){
    return await fetch("https://localhost:4243/profile.php", {
      method: "GET",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      }
    }).then(async (value)=>{
      if (value.ok){
        return await value.json().then((obj)=>{
          if (obj){
            this.client = new User(obj['id'], obj['username'], obj['email'], obj['send_comment_notif']);
            document.dispatchEvent(new Event("clientCreated"));
            return this.client;
          }
          this.client = null;
          return null;
        })
      }
      else{
        localStorage.removeItem('token');
      }
      return null;
    });
  }
  
  async updateProfile(username, email, commentNotif){
    const profile = new FormData();
    profile.append('username', username);
    profile.append('email', email);
    profile.append('commentNotif', commentNotif == true ? 1 : 0);

    return await fetch("https://localhost:4243/profile/update.php", {
      method: "POST",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: profile
    })
  }
  
  async getClientPosts(){
    return await fetch("https://localhost:4243/get_client_posts.php", {
      method: "GET",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      }
    });
  }
}