<?php
  function quit($json, $response_code = 200) {
    ob_clean();
    http_response_code($response_code);
    die($json);
  }
?>