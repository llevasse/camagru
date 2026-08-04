<?php
  include_once("utils/get_info_from_token.php");
  include_once("exceptions/token_expired.php");
  include_once("utils/quit.php");
  include_once("utils/get_db_conn.php");
  
  ob_start();

  try{
    $info = get_info_from_token(ENV_VAR:"EMAIL_SECRET_KEY");
    
    $accountId = $info['id'];
    
    $conn = get_db_conn();
    
    $sql = "UPDATE camagru.users SET is_confirmed=true WHERE id=?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->bind_param("i", $accountId) === false) {
      $stmt->close();  
      quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
    }
    if ($stmt->execute() === false) {
      $stmt->close();  
      quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
    }
    $stmt->close();  
    quit(json_encode(array("message"=>"User confirmed successfully")));
  }
  catch(mysqli_sql_exception $e){
    $message = $e->getMessage();
    quit(json_encode(array(
      "message" => $message,
    )), 400);  
  }
  catch(Exception $e){
    $message = $e->getMessage();
    quit(json_encode(array(
      "message" => $message,
    )), 400);  
  }
?>