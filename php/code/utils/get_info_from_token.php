<?php
  include_once("/var/www/php/jwt.php");

  function get_info_from_token( ) {
    $bearer = $_SERVER['HTTP_AUTHORIZATION'];
    if ( ! is_string( $bearer ) ) {return false;}
    $token = explode(' ', $bearer ) ;
    $token = end( $token);
    
    $jwtCtrl = new Jwt($_ENV['JWT_SECRET_KEY']);
    
    return ($jwtCtrl->decode($token));
  }
?>