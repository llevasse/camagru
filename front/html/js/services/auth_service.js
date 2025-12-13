class AuthService{
  async login(username, password){
    return await fetch("https://localhost:833/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        "username":username,
        "password":password
      })
    }).then(async (value)=>{
      return await value.json().then((obj)=>{
        var message = "";
        if (obj['message']){
          message = obj['message'];
          if (value.ok){
            localStorage.setItem('token', obj['token']);
            return null;
          }
        }
        else
          message = JSON.stringify(obj);
        return message;
      })
    });
  }
  
  async signin(username, email, password){
    return await fetch("https://localhost:833/signin.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        "username":username,
        "email": email,
        "password":password
      })
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
}

