<?php
  include_once("/var/www/php/jwt.php");
  include_once("/var/www/php/utils/get_info_from_token.php");
  include_once("/var/www/php/utils/quit.php");
  include_once("/var/www/php/exceptions/token_expired.php");

  ob_start();
  
  try{
    $info = get_info_from_token('JWT_SECRET_KEY', false);
    http_response_code(200);
    die(file_get_contents('/var/www/php/pages/scripts/profile_page.js'));
  }
  catch(TokenExpired $e){
    http_response_code(403);
    die(file_get_contents('/var/www/php/pages/scripts/error_403.js'));
  }
  catch(InvalidArgumentException $e){
    http_response_code(403);
    die(file_get_contents('/var/www/php/pages/scripts/error_403.js'));
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