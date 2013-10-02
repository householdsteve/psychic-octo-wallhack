<?php
// DO NOT MODIFY THESE FIRST SETTINGS
// Include the composer autoloader
if(!file_exists(__DIR__ .'/vendor/autoload.php')) {
	echo "The 'vendor' folder is missing. You must run 'composer update' to resolve application dependencies.\nPlease see the README for more information.\n";
	exit(1);
}
require __DIR__ . '/vendor/autoload.php';
require 'resources/base.php';
$is_page_secure = find_secure_connection();
// OK MODIFY AFTER HERE


// LOAD TWIG SETTINGS
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
    $URLPARTS = (isset($_REQUEST['q'])) ? explode("/",$_REQUEST['q']) : array("index","index");
    $URLARGS = array_slice($URLPARTS, 1);
    

// THESE ARE THE DEFAULT PAGE VARIABLE
    $pagevars = (object) array(
          "appenv"=>$_SERVER["APPENV"], // THIS ALLOWS US TO WRITE VARIABLES BASE ON ENVIRONMENT
          "baseurl"=> "http://localhost/2013/static/pages/armani_jeans-antwerpen", // THE BASE URL OF THE SITE
          "secure" => $is_page_secure,
          "nav" => "", // send an object here
          "args" => $URLARGS, // SEND ALL OF THE ARGUMENTS TO USE USED IN THE PAGE
          "titlebase" => "Armani - ", // THE FIRST PART OF THE PAGE TITLE
          "title"=>"XXXXXXX", // THE SECOND PART OF PAGE TITLE. THIS SHOULD BE EXTENDED BELOW BASED ON CONTENT
          "description" => "XXXXX", // THIS IS FOR META TAGS
          "keywords" => "XXX, YYY" // THIS TOO, THESE BOTH SHOULD BE EXTENDED BASED ON CONTEXT
     );

// THIS PROCESSES THE FIRST PART OF THE URL TO DELEGATE ACTIONS
    switch($URLPARTS[0]):
      case "index":
      default: // INCASE IT DOESNT FIND ANYTHING ELSE AT LEAST DO THIS:
          $pagevars->args = $URLARGS;
          echo $twig->render('index.html', array(
                              'pagevars'=> $pagevars
                              )); 
      break;
  
    endswitch;
?>