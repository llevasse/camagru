var body = `
  <h1>Camagru</h1>
  <link id="style" rel="stylesheet" href="/css/form.css">
  <form autocomplete=off id="password-form">
    <label>
      <span>Password</span>
      <input placeholder="Password..." type="password" id="password-input" autocomplete="off">
    </label>
    <label>
      <span>Confirm password</span>
      <input placeholder="Confirm password..." type="password" id="confirm-password-input" autocomplete="off">
    </label>
    <button type="submit">Save</button>
    <small id="return-value"></small>
  </form>
`

{
	document.getElementById("container").innerHTML = body;
	
	let form = document.querySelector("#password-form");
	if (form instanceof HTMLFormElement){
    form.onsubmit = async (event) =>{
      event.preventDefault();
      let url = new URL(document.URL);
      let token = url.searchParams.get('token');
      const password_input = document.querySelector("#password-input");
      const confirm_password_input = document.querySelector("#confirm-password-input");
      const return_value = document.querySelector("#return-value");
      
      const error = await userService.changePassword(password_input.value, confirm_password_input.value, token);
      if (!error){
        myPushState("/");
      }
      else {
        return_value.innerHTML = error;
      }
      return false;
    }
	}
}
