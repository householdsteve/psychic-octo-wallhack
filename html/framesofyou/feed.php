<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Followgram Feed</title>
        <style type="text/css" media="screen">
          .ig_imgs {
            display:block;
            width:95%;
            border: 4px solid #000000;
            margin-top:10px;
          }
          .ig_imgs:first-child {
            margin:0;
          }
        </style>
    </head>
    <body style="background:transparent"><a href="http://arma.ni/fol" target="_blank">
      <?php
          $c = curl_init();
          curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
          curl_setopt($c, CURLOPT_URL, 'http://api.followgram.com/v1/album/44485/1286686800/');
          $content = curl_exec($c);
          curl_close($c);
          $images = json_decode($content);
          for($x = 0; $x < 5; $x++):
      ?>
      <img class="ig_imgs" src="<?php echo $images[$x]->urlbig;?>" width="265">
      <?php
        endfor;
      ?>
      </a>
    </body>
</html>