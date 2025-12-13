const routes = {
  "/sign-in": `https://localhost:833/js/sign-in.js`,
}

window.addEventListener("load", (e) => {
	load();
})

function load(){
	const url = new URL(window.location.href);
	var path = url.pathname;
  console.log(url.pathname);
  
  if (routes[path]){
    document.getElementById("script").remove();
    var s = document.createElement("script");
    s.setAttribute('id', 'script');
    s.setAttribute('src', routes[path]);
    document.body.appendChild(s);
  }
}