<?php
  include_once("utils/get_info_from_token.php");
  include_once("utils/get_db_conn.php");
  include_once("utils/quit.php");
  include_once("exceptions/token_expired.php");
  
  function upload_file(){  
    
    $filepath = $_FILES['photo']['tmp_name'];
    $fileSize = filesize($filepath);
    $fileinfo = finfo_open(FILEINFO_MIME_TYPE);
    $filetype = finfo_file($fileinfo, $filepath);
    
    if ($fileSize === 0) {
      quit(json_encode(["message"=>"The file is empty."]), 400);
    }

    if ($fileSize > 3145728) { // 3 MB (1 byte * 1024 * 1024 * 3 (for 3 MB))
      quit(json_encode(["message"=>"The file is too large."]), 400);
    }

    $allowedTypes = [
      'image/png' => 'png',
      'image/jpeg' => 'jpg'
    ];
    
    if (!in_array($filetype, array_keys($allowedTypes))) {
      quit(json_encode(["message"=>"The file extension is not allowed."]), 400);
    }

    $filename = time() . rand(0, 42024);
    $extension = $allowedTypes[$filetype];
    $targetDirectory = "/var/www/pictures/pictures";
    $relativeTargetDirectory = "pictures";

    $newFilepath = $targetDirectory . "/" . $filename . "." . $extension;
    $relativeFilepath = $relativeTargetDirectory . "/" . $filename . "." . $extension;

    if (!copy($filepath, $newFilepath)) {
      quit(json_encode(["message"=>"Can't move file."]), 400);
    }
    unlink($filepath); // Delete the temp file
    return $relativeFilepath;
  }
  
  function mergeFileAndSuperposables($filepath){
    try{
      $superposables = $_POST["superposables"];
      $dest = imagecreatefrompng("/var/www/pictures/$filepath");
      $size = json_decode($_POST['imgSize']);
      $width = $size->width;
      $height = $size->height;
      
      $dest = imagescale($dest, $width, $height);
      foreach (json_decode($superposables, true) as $key => $value) {
        $src = imagecreatefrompng("/var/www/pictures".$value['src']); // TODO handle error opening image.
        $src = imagescale($src, $value['width'], $value['height']);

        imagecopy($dest, $src, $value['x'], $value['y'], 0, 0, $value['width'], imagesy( $src ) );
        
      }
      imagepng($dest, "/var/www/pictures/$filepath");
    }
    catch(Exception $e){
      throw $e;
    }
  }
  
  try{
    ob_start();
    if(isset($_FILES['photo']) && isset($_POST['superposables'])  && isset($_POST['imgSize'])) {
      $info = get_info_from_token();
      
      $filepath = upload_file();
      mergeFileAndSuperposables($filepath);  
      
      
      $conn = get_db_conn();
      
      $sql = "INSERT INTO camagru.pictures (user_id, file_path) VALUES (?, ?)";
      $stmt = $conn->prepare($sql);
      if ($stmt->bind_param("is", $info['id'], $filepath) === false) {
        quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
      }
      if ($stmt->execute() === false) {
        quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
      }
      ob_clean();
      quit(json_encode(["path"=>$filepath]), 200);
    }
    else{
      throw new Exception("photo or superposables missing");
    }
    
  }
  catch(TokenExpired $e){
    quit(json_encode(["message"=> "Token expired"]), 400);
  }
  catch(mysqli_sql_exception $e){
    $message = $e->getMessage();
    
    quit(json_encode(array(
      "message" => $message,
    )), 400);
  }
  catch(Exception $e) {
    quit(json_encode(["message"=> $e->getMessage()]), 400);
  } 
?>