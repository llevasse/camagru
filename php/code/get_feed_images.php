<?php
  include_once("/var/www/php/jwt.php");
  include_once("/var/www/php/utils/get_info_from_token.php");
  include_once("/var/www/php/exceptions/token_expired.php");
  function quit($json, $response_code = 200) {
    ob_clean();
    http_response_code($response_code);
    die($json);
  }
  
  
  ob_start();
  $userId = null;
  
  try{
    $info = get_info_from_token();
    $userId = $info['id'];
  }
  catch(TokenExpired $e){
    quit(json_encode(["message"=> "Token expired"]), 400);
  }
  catch(Exception $e) {
  }
  
  try{
    $db_password = ($_ENV['DB_PASSWORD']);
    $db_user = ($_ENV['DB_USER']);
    $db_host = ($_ENV['DB_HOST']);
    
    $conn = mysqli_connect($db_host, $db_user, $db_password);
  
    if ($conn->connect_error) {
      quit(json_encode(array("message"=> "Connection failed: " . $conn->connect_error)), 400);
    } 
    
    $conn->select_db("camagru");
    
    $sql = 'SELECT pic.id, pic.file_path, u.username, pic.uploaded_at,
    (SELECT JSON_ARRAYAGG(
      JSON_OBJECT("comment", c.comment, "user_id", c.user_id
        , "username", (SELECT u.username FROM users u WHERE u.id = c.user_id))) 
      FROM comments c WHERE c.picture_id = pic.id) as comments
    FROM pictures pic LEFT JOIN users u ON pic.user_id = u.id';
    $sql = $sql." ORDER BY pic.uploaded_at ASC";
    
    $stmt = $conn->prepare($sql);
    if ($stmt->execute() === false) {
      quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
    }
    
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
      while($row = mysqli_fetch_assoc($result)) {
        $rows[] = array(
          "path"=>$row['file_path'],
          "id"=>$row['id'],
          "username" => $row['username'],
          "uploaded_at" => $row['uploaded_at'],
          "comments" => json_decode($row['comments'])
          );
      }
      quit(json_encode($rows), 200);
    }
    quit(json_encode([]), 200);
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