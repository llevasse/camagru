
var body = `
  <h1>Camagru</h1>
  <link id="style" rel="stylesheet" href="/css/form.css">
  <div >
    <form id="signin-form" onsubmit="signin(event)" style="display: flex; flex-direction: column;">
      <label>
        <span>Username</span>
        <input maxlength="30" placeholder="Username..." autocomplete="off" name="username" type="text" id="username-input">
      </label>
      <label>
        <span>Email</span>
        <input maxlength="100" placeholder="Email..." autocomplete="off" name="email" type="email" id="email-input">
      </label>
      <label>
        <span>Password</span>
        <input autocomplete="off" placeholder="Password..." name="password" type="password" id="password-input">
      </label>
      <button type="submit">sign in</button>
      <small id="return-value"></small>
    </form>
  </div>
`
{
  history.replaceState("","","/sign-in")
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
    return_value.innerHTML = "Account created, check your emails to confirm your account"
  }
  else {
    return_value.innerHTML = error;
  }
  
  return false;
}
