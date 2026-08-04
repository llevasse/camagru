class EditingService{
  async uploadPicture(photo, superposables, imgSize){
    if (localStorage.getItem('token') == null){
      console.error("Need to be logged to upload pictures");
      return null;
    }
    const form = new FormData();
    form.append('photo', photo);
    form.append('superposables', superposables);
    form.append('imgSize', imgSize);
    return fetch(`/upload_file.php`, {
      method: 'POST',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form,
    })
  }
  
  async deletePicture(url){
    if (localStorage.getItem('token') == null){
      console.error("Need to be logged to upload pictures");
      return null;
    }
    const form = new FormData();
    form.append('url', url);
    return fetch(`/delete_file.php`, {
      method: 'POST',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
      body: form,
    })
  }
  
  async getUserImages(){
    if (localStorage.getItem('token') == null){
      console.error("Need to be logged to get pictures");
      return null;
    }
    return fetch(`/get_user_images.php`, {
      method: 'GET',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
    })
  }
  
  async getSuperposableImages(){
    if (localStorage.getItem('token') == null){
      console.error("Need to be logged to get pictures");
      return null;
    }
    return fetch(`/get_superposable_images.php`, {
      method: 'GET',
      headers : {
        "Authorization":"Bearer " + localStorage.getItem('token'),
      },
    })
  }
}