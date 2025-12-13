const routes = {
  "/sign-in": `https://localhost:833/js/pages/sign-in.js`,
  "/login": `https://localhost:833/js/pages/login.js`,
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

async function load(){
	const url = new URL(window.location.href);
	var path = url.pathname;
  // console.log(url.pathname);
  
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