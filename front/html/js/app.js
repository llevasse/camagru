const routes = {
  "/sign-in": `/js/pages/sign-in.js`,
  "/login": `/js/pages/login.js`,
  "/editing": `/js/pages/editing.js`,
  "/": `/js/pages/home.js`,
}

const authService = new AuthService();
const userService = new UserService();
const editingService = new EditingService();
const postsService = new PostsService();

var userClient = null;
var logButtons = document.querySelector("#log-buttons");

document.addEventListener("clientCreated", ()=>{
  if (!logButtons.classList.contains("logged")){
    logButtons.classList.add("logged")
  }
})

document.addEventListener("logout", ()=>{
  logButtons.classList.remove("logged")
  
})

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
  
  userService.getClient();
  
  if (routes[path]){
    window.onresize = null;
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