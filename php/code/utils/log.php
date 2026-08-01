<?php
  function stdoutLog($message) {	// TODO remove all calls before evaluation (check subject)
		$out = fopen('php://stdout', 'w'); 
		fputs($out, $message);
		fclose($out);
  }
?>
