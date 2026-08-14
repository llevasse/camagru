<?php
  include_once("/var/www/php/utils/quit.php");
	function checkPasswordComplexity($password){
	  if (!$password){
	    quit(json_encode(array("message"=> "No password provided")), 400);
	  }
		if (!preg_match("/[a-zA-Z]/", $password)){
			quit(json_encode(array("message"=> "Password needs to contain at least one alphabetical latin characteur")), 400);
		}
		if (!preg_match("/[0-9]/", $password)){
			quit(json_encode(array("message"=> "Password needs to contain at least one number")), 400);
		}
		if (!preg_match("/@|-|_|\+|=|<|>/", $password)){
	    quit(json_encode(array("message"=> "Password needs to contain one of these characters : @-_+=<>")), 400);
	  }
	  if (strlen($password) < 8){
	    quit(json_encode(array("message"=> "Password too short (min 8 character)")), 400);
	  }
	  if (strlen($password) > 100){
	    quit(json_encode(array("message"=> "Password too long (max 100 character)")), 400);
	  }
	}
?>