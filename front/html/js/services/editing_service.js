class EditingService{
  async uploadPicture(photo, superposables, imgSize){
    const form = new FormData();
    form.append('photo', photo);
    form.append('superposables', superposables);
    form.append('imgSize', imgSize);
    return myFetch(`/upload_file.php`, {
      method: 'POST',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form,
    });
  }
  
  async deletePicture(url){
    const form = new FormData();
    form.append('url', url);
    return myFetch(`/delete_file.php`, {
      method: 'POST',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form,
    })
  }
  
  async getUserImages(){
    return myFetch(`/get_user_images.php`, {
      method: 'GET',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
    })
  }
  
  async getSuperposableImages(){
    return myFetch(`/get_superposable_images.php`, {
      method: 'GET',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
    })
  }
}