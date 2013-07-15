<?php
include "parse/parse.php";
include "fb.php";
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

include('ip2locationlite.class.php');
 
//Load the class
$ipLite = new ip2location_lite;
$ipLite->setKey('8ef8f30a803dad6fd963f2352a7cd64f78f0569efff2a283824929031089e62b');
 
//Get errors and locations
$location = $ipLite->getCountry($_SERVER['REMOTE_ADDR']);
// get user session key
$parse = new parseRestClient();
$u = new parseUser();
$u->username = "steve";
$u->password = "20armani13";
$acc = $u->login();

// get the facebook page info based on user
$fbdata = signed_request_data($_POST['signed_request'],'dae2f933990c664c01730fe4f5255c62');
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Summer Garden Live Signup | Emporio Armani</title>
        <link rel="stylesheet" href="<?php echo ($secure_connection) ? 'https://armanissl.com/static/': 'http://static.armanissl.com/'; ?>css/main.css" type="text/css" media="screen" title="normalize" charset="utf-8">
        <link rel="stylesheet" href="<?php echo ($secure_connection) ? 'https://armanissl.com/static/': 'http://static.armanissl.com/'; ?>css/normalize.min.css" type="text/css" media="screen" title="main" charset="utf-8">
<link href='//fonts.googleapis.com/css?family=Lato:700,300' rel='stylesheet' type='text/css'>
        <!--[if lt IE 9]>
          <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6.2/html5shiv.js" type="text/javascript" charset="utf-8"></script>
        <![endif]-->
        
        <style type="text/css" media="screen">
          body {  
            background:#000;
            color:#fff;
            font-family: 'Lato', sans-serif;
            font-weight:700;
          }
          header {
            text-align:center;
            padding:30px;
          }
          form {
            text-align:center;
            width:500px;
            margin:0 auto;
          }
          
          #terms {
            width:435px;
            padding:20px;
            margin:0 auto;
            display:none;
            font-weight:300;
          }
          
          form input[type="text"]{
            border:#fff 1px solid;
            background:black;
            color:#fff;
            font-size:15px;
            padding:20px 20px 20px 40px;
            display:inline-block;
            width:395px;
          }
          div.form-row{
            position:relative;
            margin-bottom:20px;
          }
          fieldset {
            padding:20px 20px 0 20px;
          }
           label {
             position:absolute;
             left:15px;
             top:16px;
             font-size:20px;
            }
          
          
          form input[type="email"]{
            border:#fff 1px solid;
            background:black;
            color:#fff;
            font-size:15px;
            padding:20px;
            display:inline-block;
            width:280px;
          }
          form input[type="submit"]{
            border:#fff 1px solid;
            background:black;
            color:#fff;
            font-size:15px;
            padding:20px 20px;
            display:inline-block;
            margin:10px auto;
            width:130px;
          }
          
          input[type="submit"]::-moz-focus-inner {border:0;}
          input[type="submit"]:focus {background:#333;}
          
          form input[type="email"].error, form input[type="submit"].error {
            border-color:#ff0000;
          }
          em.error {
            display:block;
            color:#ff0000;
          }
          
          form input[type="checkbox"]{
            border:#fff 1px solid;
            background:black;
            color:#fff;
            display:inline-block;
            width:15px;
            height:15px;
          }
          .accept {
            margin:10px auto;
            width:100%;
          }
         
          #success {
            font-size:20px;
            display:none;
            text-align:center;
            width:500px;
            margin:0 auto;
          }
          a {
            color:#fff;
            text-decoration:underline;
          }
          a:hover {
            color:#333;
          }
          legend {
            font-size:30px;
            line-height:30px;
            text-align:left;
            color:#fff;
            width:100%;
          }
          legend small {
            color:#333;
            font-size:18px;
          }
        </style>
    </head>
    <body>
      <section id="wrapper" class="wrapper">
        <header>
          <img src="<?php echo ($secure_connection) ? $secure_link : $insecure_link; ?>v1373625874/sgl-ea-logo_satebv.png" width="469" height="371" alt="Sgl Ea Logo">
        </header>
        <section>
          <form id="signup" action="#" method="get" accept-charset="utf-8">
              <fieldset class="form-songs">
                <legend>Share your top 5 summer songs playlist and win a Spotify 3 month premium access card! <small>(UK Residents only)</small></legend>
                <div class="form-row">
                  <label for="song_one">1</label><input type="text" name="song_one" placeholder="Song Title, Artist" value="" id="song_one" required/>
                </div>
                <div class="form-row">
                  <label for="song_two">2</label><input type="text" name="song_two" placeholder="Song Title, Artist" value="" id="song_two" required/>
                </div>
                <div class="form-row">
                  <label for="song_three">3</label><input type="text" name="song_three" placeholder="Song Title, Artist" value="" id="song_three" required/>
                </div>
                <div class="form-row">
                  <label for="song_four">4</label><input type="text" name="song_four" placeholder="Song Title, Artist" value="" id="song_four" required/>
                </div>
                <div class="form-row">
                  <label for="song_five">5</label><input type="text" name="song_five" placeholder="Song Title, Artist" value="" id="song_five" required/>
                </div>
              </fieldset>
                <input type="email" name="email" placeholder="E-Mail: your@email.com" value="" id="email" required/>
                <input type="hidden" name="country" value="<?php echo $location['countryCode'];?>" id="country">
                <input type="hidden" name="likes_us" value="<?php echo ($fbdata['page']['liked']) ? 'true':'false';?>" id="likes_us">
                <input type="submit" value="Send &rarr;">
                <div class="accept">
                  <input type="checkbox" name="accept" id="accept" checked><span>By submitting this form I accept these <a href="#" id="displayterms">terms and conditions</a></span>
                </div>
          </form>
          <section id="terms">
            <p>
              <h1>Promotion Terms and Conditions</h1>
              <p>
              1. This competition (hereinafter the “promotion”) is run by Spotify, Golden House, 30 Great Pulteney Street, London, W1F 9NN, "Spotify".
            </p><p>
              2. By entering this promotion you agree to these terms and conditions which will at that time become binding between you and Spotify.  Your participation in the promotion is in consideration for Spotify allowing you to enter it and giving you the opportunity to win.
              </p><p>
              3. No purchase is necessary in order to enter the promotion. There is no fee charged to enter into this promotion other than the cost of you accessing the Internet which you would otherwise have.
              </p><p>
              4. You must be over 18 and a resident of United Kingdom to enter into this promotion and receive the prize if you win. Employees of Spotify, any business partner associated with this promotion or any of their group companies or its agencies associated with this promotion are not eligible to enter or participate.  Only one entry per person is permitted.
              </p><p>
              5. The promotion opens at Friday 12th July at 18.00pm CET. To be valid entries must be received not later than at Tuesday 16th July at 18.00pm page, at which time the offer of this promotion will end.
              </p><p>
              6. The prize for the promotion is 3 month Spotify Premium access card, the prize includes 3 months access to Spotify starting from activation date. Any pictures used to promote the prize are for information only.  It is the responsibility of the prize winner(s) to ensure they have a valid passport and obtain relevant visas, as applicable. The winner must also comply with Spotify’s instructions about the prize, such as how to conduct themselves while participating in the prize.  There is no cash alternative instead of the prize.
              </p><p>
              7. The winner will be selected by a panel from Giorgio Armani S.p.A. The panel will select the winner based on The entrant submitting a compilation of 5 music tracks to make up their favourite ‘Summer Sounds’ playlist. The panel´s decision is final and binding. Giorgio Armani S.p.A will select 10 winners from amongst the complete entries on Friday July 19th. Giorgio Armani S.p.A’s decision is final and no correspondence will be entered into. The winners will be contacted via email and their details may be posted online.
              </p><p>
              8. Every reasonable effort will be made to contact the winner(s) per e-mail. If a winner cannot be contacted within 48 hours of the relevant promotion end date, the prize will revert to Spotify and will be awarded to another entrant among other valid entries.
              </p><p>
              9. By participating in the Promotion you consent to Spotify collecting and processing the personal information you submit to Spotify, for the purpose of administering the Promotion, and otherwise in consistency with our privacy policy, which you can read here. Spotify will only share your personal information as is necessary to administer the Promotion.
              </p><p>
              10. Except as otherwise required by applicable law, Spotify is not responsible for any loss or damage associated with you entering into this promotion, the carrying out of the draw or the provision or otherwise of any aspect of any prize or any act or omission of any other person or party, and all warranties, conditions and representations (of any kind) not expressly set out in these terms and conditions are hereby excluded.
              </p><p>
              11. Spotify may terminate these terms and conditions, the promotion or any prize if you do not comply with any of these terms and conditions or are unlikely to do so, if Spotify decides in its absolute discretion to withdraw the promotion before any winners are notified, or thereafter if any circumstances beyond Spotify’s reasonable control prevent or restrict Spotify or any other person or party from providing the prize or any aspect of the prize. Spotify will notify you per e-mail should any such premature termination or withdrawal occur.
              </p><p>
              12. You may not assign or transfer your rights or obligations, or subcontract your obligations, under these terms and conditions, such as giving a prize to anyone else, without Spotify’s prior written consent.  Spotify may assign or transfer its rights or obligations, or subcontract its obligations, under these terms and conditions without your consent.
              </p><p>
              14. If any provision of these terms and conditions is found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavour to give effect to the parties' intentions as reflected in the provision and the other provisions of the terms and conditions will remain in full force and effect.
              </p><p>
              15. These terms and conditions and all matters arising from or in connection with them are governed by English law, and the courts of England will have exclusive jurisdiction in the event of any such dispute.
              </p><p>
              16. Even though this promotion may be promoted on Facebook, this promotion is in no way sponsored, endorsed or administered by, or associated with, Facebook, and, by entering, entrants agree and understand that Facebook cannot be held responsible or liable in any way for or in connection with this promotion. Entrants understand that they are providing their information to the promoter and not to Facebook.
              </p>
            </p>
          </section>
          <div id="success">
            <h1>Thank you for signing up!</h1>
          </div>
        </section>
        <footer>
        </footer>
      </section>
      <div id="fb-root"></div>
      <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.0/jquery.min.js" type="text/javascript" charset="utf-8"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.11.1/jquery.validate.min.js" type="text/javascript" charset="utf-8"></script>
      <script type="text/javascript" src="//connect.facebook.net/en_US/all.js"></script>
      <script src="<?php echo ($secure_connection) ? 'https://armanissl.com/static/': 'http://static.armanissl.com/'; ?>js/jquery.parse.js" type="text/javascript" charset="utf-8"></script>
      
      <script type="text/javascript" charset="utf-8">
         $.parse.init({
              session_token : "<?php echo $acc->sessionToken;?>",
              app_id:"XKadikS4ALD5N3VNcFeJZb3iRkblI8tbO0yEXpas",
              rest_key:"zyaf7k5ftiIc0ugQye5UnCMzOY365t1CrGHHWHB8"
          });
          FB.init({
              appId: '216035795213266', 
              status: true, 
              cookie: true, 
              xfbml: true
          });

          $(window).load(function(){
              //resize our tab app canvas after our content has finished loading
              FB.Canvas.setSize();
          });
          
          $(function(){
            $.support.cors = true;
            $('[placeholder]').parents('form').submit(function() {
              $(this).find('[placeholder]').each(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                  input.val('');
                }
              })
            });

          $("#displayterms").click(function(e){
            $("#terms").slideDown(600);
            $('body,html').animate({
            				scrollTop: $("#terms").offset().top
            			}, 800);
            return false;
          });
          
          
          $("#signup").on("submit",function(e){return false;}).validate({
            errorElement:"em",
            rules: {
                accept:"required"
              },
            submitHandler: function(form) {
              var data = {}
              $.each($(form).serializeArray(),function(i,v){
                data[v.name] = v.value;
              });
              $.parse.post('signups',data, function(json){
                //console.log(json);
                var dek = 300;
                if(json.objectId != ""){
                  $(form).css({opacity:1}).animate({opacity:0},dek,function(){$(form).hide()});
                  $("#success").delay(dek).css({opacity:0}).show().animate({opacity:1},dek);
                }
              });
              return false;
            }
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