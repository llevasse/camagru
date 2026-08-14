<?php
  include_once("/var/www/php/utils/quit.php");
	function checkUsername($username){
		if (!$username){
			quit(json_encode(array("message"=> "No username provided")), 400);
		}
		if (strlen($username) > 30){
			quit(json_encode(array("message"=> "Username too long (max 30 character)")), 400);
		}
		if (preg_match("/\s/", $username)){
			quit(json_encode(array("message"=> "Username can't contain any whitespace")), 400);
		}
	}
?>