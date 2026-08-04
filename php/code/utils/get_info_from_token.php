<?php
  include_once("/var/www/php/jwt.php");
  include_once("quit.php");

  function get_info_from_token($ENV_VAR = 'JWT_SECRET_KEY', $return401 = true ) {
    $bearer = $_SERVER['HTTP_AUTHORIZATION'];
    if ( ! is_string( $bearer ) ) {return false;}
    $token = explode(' ', $bearer ) ;
    $token = end( $token);
    
    if ($return401) {
			if ($token == 'null' || $token == null){
				quit("Token not provided", 401);
			}
    }
    $jwtCtrl = new Jwt($_ENV[$ENV_VAR]);
    
    return ($jwtCtrl->decode($token));
  }
?>