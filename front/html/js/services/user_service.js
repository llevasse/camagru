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
}