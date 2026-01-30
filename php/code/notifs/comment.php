<?php
  function send_comment_notif($to = array(["name", "email"])){
    $API_KEY = $_ENV['BREVO_API_KEY'];
    
    $sender = array("name"=>"Camagru", "email"=>"elise.levasse@gmail.com");
        
    $subject = "New comment"; 
    
    $htmlContent = "<h3>New comments</h3><p>You have a new comment on one of your post, go check it out!</p>";
    
    $ch = curl_init("https://api.brevo.com/v3/smtp/email");
    
    $postField = array(
        "sender"=>$sender,
        "to"=>$to,
        "subject"=>$subject,
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