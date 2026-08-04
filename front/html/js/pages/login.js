var body = `
  <h1>Camagru</h1>
  <link id="style" rel="stylesheet" href="/css/form.css">
  <form autocomplete=off id="login-form" onsubmit="login(event)">
    <label>
      <span>Username</span>
      <input maxlength="30" placeholder="Username..." type="text" id="username-input" autocomplete="off">
    </label>
    <label>
      <span>Password</span>
      <input placeholder="Password..." type="password" id="password-input" autocomplete="off">
    </label>
    <button type="submit">Login</button>
    <a id="send-reset-password">Send reset password mail </br>To user with provided username</a>
    <small id="return-value"></small>
  </form>
`

{
  history.replaceState("","","/login")
	document.getElementById("container").innerHTML = body;
	localStorage.removeItem("token");
  
  let username_input = document.querySelector("#username-input");
	
  let resetPasswordBtn = document.querySelector("#send-reset-password");	
  if (resetPasswordBtn instanceof HTMLElement){
    resetPasswordBtn.onclick = ()=>{
      userService.resetPasswordMail(username_input.value);
    }
  }
}

async function login(event){
  event.preventDefault();
  const password_input = document.querySelector("#password-input");
  const username_input = document.querySelector("#username-input");
  const return_value = document.querySelector("#return-value");
  
  const error = await authService.login(username_input.value, password_input.value);
  if (!error){
    myPushState("/");
  }
  else {
    return_value.innerHTML = error;
  }
  return false;
}