<?php
  print_r($_FILES);
  $target_dir = "/var/www/pictures/";
  $target_file = $target_dir . basename($_FILES["photo"]["name"]);
  $uploadOk = 1;
  $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
  // Check if image file is a actual image or fake image  

  if(isset($_FILES['photo'])) {
    $filepath = $_FILES['photo']['tmp_name'];
    $fileSize = filesize($filepath);
    $fileinfo = finfo_open(FILEINFO_MIME_TYPE);
    $filetype = finfo_file($fileinfo, $filepath);
    
    if ($fileSize === 0) {
        die("The file is empty.");
    }

    if ($fileSize > 3145728) { // 3 MB (1 byte * 1024 * 1024 * 3 (for 3 MB))
        die("The file is too large");
    }

    $allowedTypes = [
      'image/png' => 'png',
      'image/jpeg' => 'jpg'
    ];
    
    if (!in_array($filetype, array_keys($allowedTypes))) {
      die("File not allowed.");
    }

    $filename = time() . rand(0, 42024); // I'm using the original name here, but you can also change the name of the file here
    $extension = $allowedTypes[$filetype];
    $targetDirectory = "/var/www/pictures/pictures";

    $newFilepath = $targetDirectory . "/" . $filename . "." . $extension;

    if (!copy($filepath, $newFilepath)) { // Copy the file, returns false if failed
      die("Can't move file.");
    }
    unlink($filepath); // Delete the temp file
  }
?>