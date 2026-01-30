<?php
  include_once("/var/www/php/utils/get_db_conn.php");
  include_once("/var/www/php/utils/get_info_from_token.php");
  include_once("/var/www/php/utils/quit.php");
  ob_start();
  try {
    $conn = get_db_conn();
    
    $info = get_info_from_token();    
    
    $input = $_POST;
    if (!$_POST || count($_POST) === 0){
      $json = file_get_contents('php://input');
      $input = json_decode($json, true);
      if (json_last_error() !== JSON_ERROR_NONE){
        quit(json_encode(array("message"=> "Error parsing json : ". json_last_error_msg())), 400);
      }
    }
    
    if (!isset($input['commentNotif']) || !isset($input['username']) || !isset($input['email'])){
      quit(json_encode(array("message"=> "Not every needed parameters are provided")), 400);
    }
    
    $userId = $info['id'];
    $comment_notif = $input["commentNotif"];
    $username = $input["username"];
    $email = $input["email"];
    
    $sql = "UPDATE camagru.users SET send_comment_notif=?, username=?, email=? WHERE id=?";
    $stmt = $conn->prepare($sql);    
    if ($stmt->bind_param("issi", $comment_notif, $username, $email, $userId) === false) {
      quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
    }
    if ($stmt->execute() === false) {
      quit(json_encode(array("message"=> "SQL excute failed: " . $stmt->error)), 400);
    }
    quit(json_encode(array("message"=> "Profile updated successfully")), 200);
  }
  catch (Exception $e) {
    quit(array("message"=> $e->getMessage()), 400);
  }
?>