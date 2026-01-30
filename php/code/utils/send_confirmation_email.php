<?php
  include_once("/var/www/php/jwt.php");

  function send_confirmation_email($userId, $userEmail ) {
    $jwtCtrl = new Jwt($_ENV['EMAIL_SECRET_KEY']);
    
    $exp = time() + 1*24*60*60;
    
    $token = $jwtCtrl->encode([
        "id"=>$userId,
        "exp"=> $exp,
      ]);
    $confirmationLink = $_ENV['FRONTEND_URL'] . '/confirm-email?token=' . $token;
    $to = $userEmail;
    $subject = "Camagru account confirmation";
    $message = `
        <h3>Confirmation d'inscription</h3>
        <p>Cliquez sur le lien ci-dessous pour confirmer votre compte :</p>
        <a href="` . $confirmationLink . `">Confirmer mon compte</a>
    `;
    
    // To send HTML mail, the Content-type header must be set
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=iso-8859-1';

    // Additional headers
    $headers[] = 'To: <'.$userEmail.'>';
    $headers[] = 'From: Camagru <confirmation@camagru.com>';

    // Mail it
    mail($to, $subject, $message, implode("\r\n", $headers));
  }
?>