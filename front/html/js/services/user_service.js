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
            this.client = new User(obj['id'], obj['username'], obj['email']);
            document.dispatchEvent(new Event("clientCreated"));
            return this.client;
          }
          this.client = null;
          return null;
        })
      }
      return null;
    });
  }
}