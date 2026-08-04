class UserService{
  client;
  
  constructor(){
    this.client = null;
  }

  async getClient(){
		const token = localStorage.getItem('token');
		if (token == null) return;

    return await fetch("/profile.php", {
      method: "GET",
      headers : {
        "Authorization":"Bearer " + token,
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

    return await fetch("/profile/update.php", {
      method: "POST",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: profile
    })
  }
  
  async resetPasswordMail(username = null){
    return await fetch(`/profile/reset_password_mail.php${username ? "?username="+username : ""}`, {
      method: "GET",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
    })
  }
  
  async changePassword(password, confirmedPassword, token){
    const form = new FormData();
    form.append('password', password);
    form.append('confirmedPassword', confirmedPassword);
    return await fetch("/profile/update_password.php", {
      method: "POST",
      headers: {
        "Authorization":"Bearer " + token,
      },
      body: form
    }).then(async (value)=>{
      return await value.json().then((obj)=>{
        var message = "";
        if (obj['message']){
          message = obj['message'];
          if (value.ok){
            return null;
          }
        }
        else
          message = JSON.stringify(obj);
        return message;
      })
    });
  }
  
  async getClientPosts(){
    return await fetch("/get_client_posts.php", {
      method: "GET",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      }
    });
  }
}