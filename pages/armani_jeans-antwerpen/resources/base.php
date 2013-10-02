<?php

function find_secure_connection(){
  if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) {
    return true;
  }else{
    return false;
  }
}

function curl_custom_url($url) {
    $curl = curl_init();
    $timeout = 5; // set to zero for no timeout
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, $timeout);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
    $html = curl_exec($curl);
    $content_type = curl_getinfo($curl, CURLINFO_CONTENT_TYPE);
    curl_close($curl);
    return array($html, $content_type);
}