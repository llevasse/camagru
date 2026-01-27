
var body = `
  <h1>Camagru</h1>
  <link id="style" rel="stylesheet" href="/css/form.css">
  <div >
    <form id="signin-form" onsubmit="signin(event)" style="display: flex; flex-direction: column;">
      <label>
        <span>Username</span>
        <input autocomplete="off" name="username" type="text" id="username-input">
      </label>
      <label>
        <span>Email</span>
        <input autocomplete="off" name="email" type="email" id="email-input">
      </label>
      <label>
        <span>Password</span>
        <input autocomplete="off" name="password" type="password" id="password-input">
      </label>
      <button type="submit">sign in</button>
      <small id="return-value"></small>
    </form>
  </div>
`
{
  history.replaceState("","","https://localhost:4243/sign-in")
	document.getElementById("container").innerHTML = body;
	localStorage.removeItem("token");
  
}
async function signin(event){
  event.preventDefault();
  const password_input = document.querySelector("#password-input");
  const email_input = document.querySelector("#email-input");
  const username_input = document.querySelector("#username-input");
  const return_value = document.querySelector("#return-value");
  
  const error = await authService.signin(username_input.value, email_input.value, password_input.value);
  if (!error){
    await authService.login(username_input.value, password_input.value);
    myPushState("https://localhost:4243/");
  }
  else {
    return_value.innerHTML = error;
  }
  
  return false;
}
