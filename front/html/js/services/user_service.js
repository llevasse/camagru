class UserService{
  async getClient(){
    return await fetch("https://localhost:833/profile.php", {
      method: "GET",
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      }
    }).then(async (value)=>{
      if (value.ok){
        return await value.json().then((obj)=>{
          if (obj)
            return (new User(obj['id'], obj['username'], obj['email']));
          return null;
        })
      }
      return null;
    });
  }
  
  async uploadPicture(photo){
    if (localStorage.getItem('token') == null){
      console.error("Need to be logged to upload pictures");
      return ;
    }
    const form = new FormData();
    form.append('photo', photo);
    return fetch(`https://localhost:833/upload_file.php`, {
      method: 'POST',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form,
    })
  }
}