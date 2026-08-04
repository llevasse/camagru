<?php
  include_once("quit.php");

  function get_db_conn(){
    $db_password = ($_ENV['DB_PASSWORD']);
    $db_user = ($_ENV['DB_USER']);
    $db_host = ($_ENV['DB_HOST']);
    
    $conn = mysqli_connect($db_host, $db_user, $db_password);

    if ($conn->connect_error) {
      quit(json_encode(array("message"=> "Connection failed: " . $conn->connect_error)), 400);
    }

    return $conn;
  }
?>