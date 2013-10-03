$.parse.init({
    session_token : AApp.session_token,
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