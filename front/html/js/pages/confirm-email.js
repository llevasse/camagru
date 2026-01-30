{
	document.getElementById("container").innerHTML = '';
	let url = new URL(document.URL);
	let token = url.searchParams.get('token');
	if (token){
    authService.comfirm(token).then(error=>{
      if (!error){
        myPushState("https://localhost:4243/login");
      }
    });
	}
}