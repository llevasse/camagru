<?php
  include_once("/var/www/php/jwt.php");
  include_once("/var/www/php/utils/get_db_conn.php");
  include_once("/var/www/php/utils/get_info_from_token.php");
  include_once("/var/www/php/utils/quit.php");
  function send_password_email($userId, $username, $email) {
    $jwtCtrl = new Jwt($_ENV['EMAIL_SECRET_KEY']);
    
    $exp = time() + 1*24*60*60;
    
    $token = $jwtCtrl->encode([
        "id"=>$userId,
        "exp"=> $exp,
      ]);
    $resetLink = $_ENV['FRONTEND_URL'] . '/reset-password?token=' . $token;
    
    $API_KEY = $_ENV['BREVO_API_KEY'];
    
    $sender = array("name"=>"Camagru", "email"=>"elise.levasse@gmail.com");
    
    $to = array(["name"=> $username, "email"=> $email]);
    
    $subject = "Camagru account password reset"; 
    
    $htmlContent = "<h3>Password reset</h3><p>Click <a href=\"{{params.resetLink}}\">here</a> to reset your password</p>";
    
    $params = array("resetLink"=> $resetLink);
    
    $ch = curl_init("https://api.brevo.com/v3/smtp/email");
    
    $postField = array(
      "sender"=>$sender,
      "to"=>$to,
      "subject"=>$subject,
      "params"=>$params,
      "htmlContent"=>$htmlContent
    );
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postField));

    $headers = array();
    $headers[] = 'Accept: application/json';
    $headers[] = 'Api-Key: '.$API_KEY;
    $headers[] = 'Content-Type: application/json';
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    

    $result = curl_exec($ch);
    if (curl_errno($ch)) {
      throw new Exception(curl_error($ch));
    }
  }
    
  try{
    $conn = get_db_conn();
    
    $info = get_info_from_token();
    
    $userId = $info['id'];
    
    $sql = "SELECT username, email FROM camagru.users WHERE id=?";
    $stmt = $conn->prepare($sql);    
    if ($stmt->bind_param("i",  $userId) === false) {
      quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
    }
    if ($stmt->execute() === false) {
      quit(json_encode(array("message"=> "SQL excute failed: " . $stmt->error)), 400);
    }
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();
    $email = $result["email"];
    $username = $result["username"];
    send_password_email($userId, $username, $email);
  }
  catch (Exception $e){
    quit(array("message"=> $e->getMessage()), 400);
  }
?>