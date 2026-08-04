<?php
  include_once("jwt.php");
  include_once("utils/get_info_from_token.php");
  include_once("utils/get_db_conn.php");
  include_once("utils/quit.php");
  include_once("exceptions/token_expired.php");  
  
  try{
    ob_start();

    $info = get_info_from_token();
    $userId = $info['id'];
    
    $conn = get_db_conn();
  
    $sql = "SELECT file_path FROM camagru.pictures WHERE user_id=?";
    $stmt = $conn->prepare($sql);
    if ($stmt->bind_param("i",$userId) === false) {
      quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
    }
    if ($stmt->execute() === false) {
      quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
    }
    
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
      while($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row['file_path'];
      }
      quit(json_encode($rows), 200);
    }
    quit(json_encode([]), 200);
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