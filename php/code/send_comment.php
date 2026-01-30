<?php
  include_once("utils/get_info_from_token.php");
  include_once("exceptions/token_expired.php");
  include_once("/var/www/php/notifs/comment.php");
  
  ob_start();
  function quit($json, $response_code = 200) {
    ob_clean();
    http_response_code($response_code);
    die($json);
  }

  try{
    $info = get_info_from_token();
  
    $db_password = ($_ENV['DB_PASSWORD']);
    $db_user = ($_ENV['DB_USER']);
    $db_host = ($_ENV['DB_HOST']);
      
    $conn = mysqli_connect($db_host, $db_user, $db_password);
    
    if ($conn->connect_error) {
      quit(json_encode(array("message"=> "Connection failed: " . $conn->connect_error)), 400);
    }  
    
    $input = $_POST;
    if (!$_POST || count($_POST) === 0){
      $json = file_get_contents('php://input');
      $input = json_decode($json, true);
      if (json_last_error() !== JSON_ERROR_NONE){
        quit(json_encode(array("message"=> "Error parsing json : ". json_last_error_msg())), 400);
      }
    }
    
    if (!isset($input['post_id']) || !isset($input['comment_content'])){
      quit(json_encode(array("message"=> "Not every need parameters are provided")), 400);
    }
    
    $posterId = $info['id'];
    $postId = $input['post_id'];
    $comment = $input['comment_content'];
    
    $sql = "INSERT INTO camagru.comments (picture_id, user_id, comment) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->bind_param("iis", $postId, $posterId, $comment) === false) {
      $stmt->close();  
      quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
    }
    if ($stmt->execute() === false) {
      $stmt->close();  
      quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
    }
    $stmt->close();  
    
    $sql = "SELECT send_comment_notif, username, email FROM camagru.users WHERE id = (SELECT user_id FROM camagru.pictures WHERE id = ?)";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->bind_param("i", $postId) === false) {
      $stmt->close();  
      quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
    }
    if ($stmt->execute() === false) {
      $stmt->close();  
      quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
    }
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();
    $email = $result['email'];
    $username = $result['username'];
    $allow = $result['send_comment_notif'];
    if ($allow == true){
      send_comment_notif(array(["name"=>$username, "email"=>$email]));
    }
    
    $stmt->close();  
    
    quit(json_encode(array("message"=>"Comment created successfully")));
  }
  catch(mysqli_sql_exception $e){
    $message = $e->getMessage();
    // duplicate entry
    quit(json_encode(array(
      "message" => $message,
    )), 400);
    
  }
?>