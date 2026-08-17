{
  myFetch("/pages/editing_page.php", {
    headers : {"Authorization":"Bearer " + localStorage.getItem('token')}
  }).then(response=>{
		if (response instanceof Response){
			if (response.status == 403){
				load('/login');
			}
			response.text().then((script)=>{
				document.getElementById("script").remove();
				var s = document.createElement("script");
				s.setAttribute('id', 'script');
				s.innerHTML = script;
				document.body.appendChild(s);
			});
		}
  });
}