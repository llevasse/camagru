{
  myFetch("/pages/editing_page.php", {
    headers : {"Authorization":"Bearer " + localStorage.getItem('token')}
  }).then(response=>{
    response.text().then((script)=>{
      document.getElementById("script").remove();
      var s = document.createElement("script");
      s.setAttribute('id', 'script');
      s.innerHTML = script;
      document.body.appendChild(s);
    })
  });
}