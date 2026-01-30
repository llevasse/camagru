<?php
  include_once("/var/www/php/jwt.php");

  function send_confirmation_email($userId, $userEmail, $username ) {
    $jwtCtrl = new Jwt($_ENV['EMAIL_SECRET_KEY']);
    
    $exp = time() + 1*24*60*60;
    
    $token = $jwtCtrl->encode([
        "id"=>$userId,
        "exp"=> $exp,
      ]);
    $confirmationLink = $_ENV['FRONTEND_URL'] . '/confirm-email?token=' . $token;
    
    $API_KEY = $_ENV['BREVO_API_KEY'];
    
    $sender = array("name"=>"Camagru", "email"=>"elise.levasse@gmail.com");
    
    $to = array(["name"=> $username, "email"=> $userEmail]);
    
    $subject = "Camagru account confirmation"; 
    
    $htmlContent = "<h3>Sign-in confirmation</h3><p>Click on this link to confirm your account :</p><a href=\"{{params.confirmationLink}}\">Confirm my account</a>";
    
    $params = array("confirmationLink"=> $confirmationLink);
    
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
?>