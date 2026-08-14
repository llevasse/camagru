<?php
  include_once("/var/www/php/utils/quit.php");
	function checkEmail($email){
		if (!$email){
			quit(json_encode(array("message"=> "No email provided")), 400);
		}
		if (strlen($email) > 100){
			quit(json_encode(array("message"=> "Email too long")), 400);
		}
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			quit(json_encode(array("message"=> "Invalid email format")), 400);
		}
	}
?>