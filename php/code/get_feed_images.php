<?php
  include_once("jwt.php");
  include_once("utils/get_info_from_token.php");
  include_once("utils/quit.php");
  include_once("exceptions/token_expired.php");
  include_once("utils/get_db_conn.php");
  
  
  ob_start();
  $userId = null;
  
  try{
    $info = get_info_from_token('JWT_SECRET_KEY', false);
    $userId = $info['id'];
  }
  catch(Exception $e) {
  }
  
  try{
    $conn = get_db_conn();
    
    $conn->select_db("camagru");
    
    $offset = $_GET['offset'];
    
    if (!is_numeric($offset)) {
      quit(json_encode(array("message"=> "Offset should be a number")), 400);
    }
    
    $sql = 'SELECT pic.id, pic.file_path, u.username, pic.uploaded_at,
    (SELECT COUNT(li.id) FROM likes li WHERE li.picture_id = pic.id) as likes,
    (SELECT COUNT(li.id) FROM likes li WHERE li.picture_id = pic.id AND li.user_id = ?) as from_client,
    (SELECT JSON_ARRAYAGG(
      JSON_OBJECT("comment", c.comment, "user_id", c.user_id
        , "username", (SELECT u.username FROM users u WHERE u.id = c.user_id)))
      FROM comments c WHERE c.picture_id = pic.id) as comments
    FROM pictures pic LEFT JOIN users u ON pic.user_id = u.id
    ORDER BY pic.uploaded_at DESC LIMIT 5 OFFSET ?
    ';
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $userId, $offset);
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
          "comments" => json_decode($row['comments']),
          "likes" => $row['likes'],
          "likes_from_client" => $row['from_client'] == 1,
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