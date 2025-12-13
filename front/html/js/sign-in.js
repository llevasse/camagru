var body = `
  <h1>Sign in</h1>
  <div >
    <form autocomplete=on id="signin-form" onsubmit="signin(event)" style="display: flex; flex-direction: column;">
      <label>
        <span>Username</span>
        <input type="text" id="username-input" autocomplete="username">
      </label>
      <label>
        <span>Email</span>
        <input type="email" id="email-input" autocomplete="email">
      </label>
      <label>
        <span>Password</span>
        <input type="password" id="password-input" autocomplete>
      </label>
      <button type="submit">sign in</button>
      <small id="return-value"></small>
    </form>
  </div>
`

{
	document.getElementById("container").innerHTML = body;
}

async function signin(event){
  event.preventDefault();
  const password_input = document.querySelector("#password-input");
  const email_input = document.querySelector("#email-input");
  const username_input = document.querySelector("#username-input");
  const return_value = document.querySelector("#return-value");
  
  await fetch("https://localhost:833/signin.php", {
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