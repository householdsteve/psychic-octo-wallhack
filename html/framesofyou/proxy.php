<?php
$c = curl_init();
//curl_setopt($c, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
curl_setopt($c, CURLOPT_URL, 'http://api.followgram.com/v1/album/44485/1286686800/');
$content = curl_exec($c);
curl_close($c);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
?>