class EditingService{
  async uploadPicture(photo, superposables){
    if (localStorage.getItem('token') == null){
      console.error("Need to be logged to upload pictures");
      return null;
    }
    const form = new FormData();
    form.append('photo', photo);
    form.append('superposables', superposables);
    return fetch(`https://localhost:833/upload_file.php`, {
      method: 'POST',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form,
    })
  }
  
  async getSuperposableImages(){
    if (localStorage.getItem('token') == null){
      console.error("Need to be logged to get pictures");
      return null;
    }
    return fetch(`https://localhost:833/get_superposable_images.php`, {
      method: 'GET',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
    })
  }
}