<?php
$secure_connection = false;
$secure_link = "https://cloudinary-a.akamaihd.net/armani/image/upload/";
$insecure_link = "http://res.cloudinary.com/armani/image/upload/";
if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'
    || $_SERVER['SERVER_PORT'] == 443) {

    $secure_connection = true;
}
function fetch($url) {
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
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Frames of You - Frames of Life | Giorgio Armani</title>
        <link rel="stylesheet" href="<?php echo ($secure_connection) ? 'https://armanissl.com/static/': 'http://static.armanissl.com/'; ?>css/main.css" type="text/css" media="screen" title="normalize" charset="utf-8">
        <link rel="stylesheet" href="<?php echo ($secure_connection) ? 'https://armanissl.com/static/': 'http://static.armanissl.com/'; ?>css/normalize.min.css" type="text/css" media="screen" title="main" charset="utf-8">
        
        <style type="text/css" media="screen">
          body{  
            background:url("<?php echo ($secure_connection) ? 'https://cloudinary-a.akamaihd.net/armani/image/upload/v1373287625/bg-fol2_bhbynv.jpg' : 'http://cdn2.yoox.biz/Os/armanigroup/giorgioarmani/images/fol2/bg-fol2.jpg';?>") repeat scroll center top #FFFFFF; 
            cursor:pointer;
          }
          a img, a, img {border: none; }
          .wrapper {
            max-width:809px;
            width:auto;
          }
          header {
            margin:0 0 25px 0;
          }
          .thumbs {
            margin-left:2%;
            width:30.2%;
          }
          .ig_imgs {
            margin-left:2%;
            width:17.2%;
          }
          .ig_imgs:first-child, .thumbs:first-child {
          }
          header img, footer img, aside img {
            width:100%;
            height:auto;
          }
        </style>
    </head>
    <body>
      <section id="wrapper" class="wrapper">
        <header>
          <a id="headerlink" href="http://arma.ni/fol" target="_blank"><img src="<?php echo ($secure_connection) ? $secure_link : $insecure_link; ?>v1372422023/header_to8lod.png" width="821" height="306" alt="Header"></a>
        </header>
        <article>
          <section class="videofyme">
             <?php
              $tumblr = fetch('http://api.tumblr.com/v2/blog/armani.tumblr.com/posts/video?api_key=RqCENeWOAxiknJHf2bzOFV3m7AKL2nZ5XPOE2d58SVKkzD8FTg&limit=3');
                $ids = array();
                $tf = json_decode($tumblr[0]);
                foreach($tf->response->posts as $post){
                  preg_match('/(http:\/\/p.videofy.me\/v\/)([0-9]+)/', $post->player[0]->embed_code, $matches);
                  $ids[] = $matches[2];
                }
                $vidinfo = fetch('http://www.videofy.me/jsonp_api?feature[videoinfo]='.implode(",",$ids).'&no_callback=1');
                $allvids = $vidinfo[0];
                //$allvids = str_replace( 'callback(', '', $allvids );
                //$allvids = substr_replace($allvids ,"",-2);
                $object = json_decode( $allvids );
                //echo "<pre>"; print_r($object); echo "</pre>";
                 foreach(array_reverse($object->videoinfo) as $vid):
                   $imglink = preg_replace('/^(http|https):\/\/([^\/]+)/',($secure_connection ? 'https': 'http').'://videofymethumbs.imgix.net',$vid->thumbnail_path).'?w=265&h=154&bg=000000&fit=crop&crop=faces&mark=http://static.videofy.me/play-symbol-big.png&markalign=middle,center';
              ?>
                  <img class="thumbs" src="<?php echo $imglink;?>">
                <?php endforeach;?>
          </section>
          <aside>
            <a href="http://arma.ni/fol" target="_blank"><img src="<?php echo ($secure_connection) ? $secure_link : $insecure_link; ?>v1372422022/explain_yuqumo.png" width="821" height="82" alt="Explain"></a>
          </aside>
          <section class="instagram">
            <?php
              $followgram = fetch('http://api.followgram.com/v1/album/44485/1286686800/');
               $images = json_decode($followgram[0]);
                for($x = 0; $x < 5; $x++):
            ?>
              <img class="ig_imgs" src="<?php echo ($secure_connection) ? preg_replace('/http/','https',$images[$x]->url) : $images[$x]->url;?>">
            <?php
              endfor;
            ?>
          </section>
        </article>
        <footer>
          <a href="http://arma.ni/fol" target="_blank"><img src="<?php echo ($secure_connection) ? $secure_link : $insecure_link; ?>v1372422023/footer_igfwcg.png" width="821" height="57" alt="Footer"></a>
        </footer>
      </section>
      <div id="fb-root"></div>
      <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.0/jquery.min.js" type="text/javascript" charset="utf-8"></script>
      <script type="text/javascript" src="//connect.facebook.net/en_US/all.js"></script>
      <script type="text/javascript" charset="utf-8">
          FB.Canvas.setSize();
          $('body').on('click',function(e){
            window.open($('a')[0].href);
            });
          var mindeg = -1;
          var maxdeg = 1;
          // and the formula is:
          $('.ig_imgs, .thumbs').each(function(i,v){
            var randomDeg = Math.floor(Math.random() * (maxdeg - mindeg + 1)) + mindeg;
            $(this).css({'-webkit-transform': 'rotate(' + randomDeg + 'deg)',
                         '-moz-transform': 'rotate(' + randomDeg + 'deg)',
                         '-ms-transform': 'rotate(' + randomDeg + 'deg)',
                         '-o-transform': 'rotate(' + randomDeg + 'deg)',
                         'transform': 'rotate(' + randomDeg + 'deg)',
                         'zoom': 1,
                         'opacity': 1
            });
          });
      </script>
      <script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-37062132-1']);
        _gaq.push(['_setDomainName', 'armanissl.com']);
        _gaq.push(['_trackPageview']);

        (function() {
          var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
          ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

      </script>
    </body>
</html>