var body = `
  <h1>Camagru</h1>
  <link id="style" rel="stylesheet" href="/css/form.css">
  <form autocomplete=on id="login-form" onsubmit="login(event)">
    <label>
      <span>Username</span>
      <input placeholder="Username..." type="text" id="username-input" autocomplete="username">
    </label>
    <label>
      <span>Password</span>
      <input placeholder="Password..." type="password" id="password-input" autocomplete>
    </label>
    <button type="submit">Login</button>
    <small id="return-value"></small>
  </form>
`

{
  history.replaceState("","","https://localhost:4243/login")
	document.getElementById("container").innerHTML = body;
	localStorage.removeItem("token");
}

async function login(event){
  event.preventDefault();
  const password_input = document.querySelector("#password-input");
  const username_input = document.querySelector("#username-input");
  const return_value = document.querySelector("#return-value");
  
  const error = await authService.login(username_input.value, password_input.value);
  if (!error){
    myPushState("https://localhost:4243/");
  }
  else {
    return_value.innerHTML = error;
  }
  return false;
}