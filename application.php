<?php
// DO NOT MODIFY THESE FIRST SETTINGS
// Include the composer autoloader
if(!file_exists(__DIR__ .'/vendor/autoload.php')) {
	echo "The 'vendor' folder is missing. You must run 'composer update' to resolve application dependencies.\nPlease see the README for more information.\n";
	exit(1);
}
require __DIR__ . '/vendor/autoload.php';
require __DIR__ .'/resources/base.php';
//require_once 'Mobile_Detect.php';

// OK MODIFY AFTER HERE
function process_page_call($URLPARTS){
    $is_page_secure = find_secure_connection();
    


// LOAD TWIG SETTINGS - THIS IS FOR TEMLATEING
    Twig_Autoloader::register();
    $loader = new Twig_Loader_Filesystem(__DIR__.'/templates');
    $twig = new Twig_Environment($loader);

    $numberfilter = new Twig_SimpleFilter('number_format', function ($str,$length=2) {
    	  return number_format($str, $length, '.', '');
    });

    $twig->addFilter($numberfilter);

    // twig template caching
    // $twig = new Twig_Environment($loader, array(
    //     'cache' => __DIR__.'/cache',
    // ));


// THIS GETS DATA FROM THE URL AND PROCESSES IT FOR US
    //$URLPARTS - THIS COMES FROM THE INDEX PAGE.
    $URLARGS = array_slice($URLPARTS, 1);
    $baseurl = "//armanissl.com/antwerpen";
    //$baseurl = "//localhost/2013/static";

// THESE ARE THE DEFAULT PAGE VARIABLE
    $pagevars = array(
          "appenv"=>$_SERVER["APPENV"], // THIS ALLOWS US TO WRITE VARIABLES BASE ON ENVIRONMENT
          "baseurl"=> $baseurl, // THE BASE URL OF THE SITE
          "secure" => $is_page_secure,
          "eventclosed" => "no",
          "nav" => "", // send an object here
          "args" => $URLARGS, // SEND ALL OF THE ARGUMENTS TO USE USED IN THE PAGE
          "titlebase" => "Armani - ", // THE FIRST PART OF THE PAGE TITLE
          "title"=>"INVITES YOU TO THE NEW STORE OPENING", // THE SECOND PART OF PAGE TITLE. THIS SHOULD BE EXTENDED BELOW BASED ON CONTENT
          "description" => "Armani Jeans opens in Antwerpen", // THIS IS FOR META TAGS
          "keywords" => "Armani, Jeans, Belgium, Antwerpen, Dj", // THIS TOO, THESE BOTH SHOULD BE EXTENDED BASED ON CONTEXT
          "og" => array("image"=> "http:".$baseurl."/assets/images/OG.jpg",
                        "title"=> "") // THESE ARE FOR SOCIAL CHANNELS LIKE FACEBOOK WHERE AN IMAGE IS SHARED.
     );

// THIS PROCESSES THE FIRST PART OF THE URL TO DELEGATE ACTIONS
    include __DIR__ ."/resources/parse/parse.php";
    include __DIR__ ."/resources/fb.php";
    include __DIR__ ."/resources/ip2locationlite.class.php";
    
    switch($URLPARTS[0]):
      case "check":
        $detect = new Mobile_Detect;
        if (!$detect->isMobile()) {
          header("Location: https://www.facebook.com/ARMANI/app_568727519847132");
        }else{
          //Load the class
          $ipLite = new ip2location_lite;
          $ipLite->setKey('8ef8f30a803dad6fd963f2352a7cd64f78f0569efff2a283824929031089e62b');
          $location = $ipLite->getCountry($_SERVER['REMOTE_ADDR']);
          
          // get user session key for parse
          $parse = new parseRestClient();
          $u = new parseUser();
          $u->username = "steve";
          $u->password = "20armani13";
          $parse_user = $u->login();
          //echo "<pre>".print_r($location)."</pre>";
          
          $parseQ = new parseQuery($class = 'signups');
          $result = $parseQ->find();
          
          if(count($result->results) > 100){
            $pagevars['eventclosed'] = "yes";
          }    
          $pagevars['eventclosed'] = "yes"; // event is closed manually.          
          // get the facebook page info based on user // ONLY AVAILABLE FROM TAB
          $fbdata = signed_request_data($_POST['signed_request'],'720a58877f1d26dc69dd8c8dc7396d7d');
          //$fbdata = array();          
          return $twig->render('index.html', array('pagevars'=> (object) $pagevars,'facebook'=>$fbdata,'location'=>$location,'parse'=>$parse_user));
        }
      break;
      case "count":
          $parse = new parseQuery($class = 'signups');
          $result = $parse->find();
          echo "all full!";
          //echo count($result->results);
          // echo "RESULT: ";
          //           print_r($result);
      break;
      case "view":
          $parse = new parseQuery($class = 'signups');
          $result = $parse->find();
          echo "<pre>";
          print_r($result);
          echo "</pre>";
      break;
      case "index":
      default: // INCASE IT DOESNT FIND ANYTHING ELSE AT LEAST DO THIS:
          //Load the class
          $ipLite = new ip2location_lite;
          $ipLite->setKey('8ef8f30a803dad6fd963f2352a7cd64f78f0569efff2a283824929031089e62b');
          $location = $ipLite->getCountry($_SERVER['REMOTE_ADDR']);
          
          // get user session key for parse
          $parse = new parseRestClient();
          $u = new parseUser();
          $u->username = "steve";
          $u->password = "20armani13";
          $parse_user = $u->login();
          //echo "<pre>".print_r($location)."</pre>";
          
          // get the facebook page info based on user // ONLY AVAILABLE FROM TAB
          $fbdata = signed_request_data($_POST['signed_request'],'720a58877f1d26dc69dd8c8dc7396d7d');
          //$fbdata = array();
          $parseQ = new parseQuery($class = 'signups');
          $result = $parseQ->find();
          
          if(count($result->results) > 100){
            $pagevars['eventclosed'] = "yes";
          }
          $pagevars['eventclosed'] = "yes"; // event is closed manually.
            
          return $twig->render('index.html', array('pagevars'=> (object) $pagevars,'facebook'=>$fbdata,'location'=>$location,'parse'=>$parse_user));
      break;
  
    endswitch;
}
?>