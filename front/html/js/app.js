const routes = {
  "/sign-in": `https://localhost:833/js/pages/sign-in.js`,
  "/login": `https://localhost:833/js/pages/login.js`,
  "/editing": `https://localhost:833/js/pages/editing.js`,
  "/": `https://localhost:833/js/pages/home.js`,
}

const authService = new AuthService();
const userService = new UserService();

var userClient = null;

window.addEventListener("popstate", (e)=>{
  load();
})

window.addEventListener("load", (e) => {
	load();
})

async function load(path = null){
	const url = new URL(window.location.href);
	if (path == null){
	  path = url.pathname;
	}
  
  userClient = await userService.getClient();
  var logButtons = document.querySelector("#log-buttons");
  if (userClient){
    if (!logButtons.classList.contains("logged")){
      logButtons.classList.add("logged")
    }
  }
  else{
    logButtons.classList.remove("logged")
  }
  
  if (routes[path]){
    document.getElementById("script").remove();
    var s = document.createElement("script");
    s.setAttribute('id', 'script');
    s.setAttribute('src', routes[path]);
    document.body.appendChild(s);
  }
}

function myReplaceState(url) {
	history.replaceState("", "", url);
	load();
}

function myPushState(url) {
	history.pushState("", "", url);
	load();
}