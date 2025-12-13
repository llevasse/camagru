const body = `
  <h1>Login</h1>
  <div >
    <form id="login-form" onsubmit="login(event)" style="display: flex; flex-direction: column;">
      <label>
        <span>Username</span>
        <input type="text" id="username-input" autocomplete="username">
      </label>
      <label>
        <span>Password</span>
        <input type="password" id="password-input" autocomplete="password">
      </label>
      <button type="submit">Login</button>
      <small id="return-value"></small>
    </form>
  </div>
`

{
	document.getElementById("container").innerHTML = body;
}

async function login(event){
  event.preventDefault();
  const password_input = document.querySelector("#password-input");
  const email_input = document.querySelector("#email-input");
  const username_input = document.querySelector("#username-input");
  const return_value = document.querySelector("#return-value");
  
  await fetch("https://localhost:833/login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      "username":username_input.value,
      "email":email_input.value,
      "password":password_input.value
    })
  }).then(async (value)=>{
    return_value.innerHTML = await value.json().then((obj)=>{
      var message = "";
      if (obj['message']){
        message = obj['message'];
      }
      else
        message = JSON.stringify(obj);
      return message;
    })
    return 1;
  });
  return false;
}