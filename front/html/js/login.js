// const authService = new AuthService();
// import {AuthService} from "./services/auth_service.js";

var body = `
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
  const username_input = document.querySelector("#username-input");
  const return_value = document.querySelector("#return-value");
  
  const error = await authService.login(username_input.value, password_input.value);
  if (!error){
    myPushState("https://localhost:833/");
  }
  else {
    return_value.innerHTML = error;
  }
  return false;
}