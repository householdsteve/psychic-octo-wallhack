$.parse.init({
    session_token : AApp.session_token,
    app_id:"Y9IJPTXprcWyThTYBvgso90fKPoGjGCgdidJPbsD",
    rest_key:"ClIMrTcgQbUdBgPAaSoyzOMUoeaEHrKnKYIEqkQo"
});

FB.init({
    appId: '216035795213266',
    status: true, 
    cookie: true, 
    xfbml: true
});

$(window).load(function(){
    FB.Canvas.setSize();
});

$.support.cors = true;

$(function(){

    $("#privacy").click(function(e){
      $("#policy").slideDown(600);
      // $('body,html').animate({
      //              scrollTop: $("#terms").offset().top
      //            }, 800);
      return false;
    });
    

    $("#signupereere").on("submit",function(e){return false;}).validate({
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
 
 /*global jQuery, Handlebars */
 jQuery(function ($) {
 	'use strict';

 	var Utils = {
 		uuid: function () {
 			/*jshint bitwise:false */
 			var i, random;
 			var uuid = '';

 			for (i = 0; i < 32; i++) {
 				random = Math.random() * 16 | 0;
 				if (i === 8 || i === 12 || i === 16 || i === 20) {
 					uuid += '-';
 				}
 				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
 			}

 			return uuid;
 		},
 		pluralize: function (count, word) {
 			return count === 1 ? word : word + 's';
 		},
 		store: function (namespace, data) {
 			if (arguments.length > 1) {
 				return localStorage.setItem(namespace, JSON.stringify(data));
 			} else {
 				var store = localStorage.getItem(namespace);
 				return (store && JSON.parse(store)) || [];
 			}
 		}
 	};

 	var App = {
 		init: function () {
 			this.ENTER_KEY = 13;
 			this.priceQuotes = Utils.store('pricequotes-jquery');
 			this.activeStyle = {};
 			this.currentLeftPosition = 0;
 			this.cacheElements();
 			this.bindEvents();
 			this.render();
 		},
 		cacheElements: function () {
 			this.$formHolder = $("div.holder");
 			this.selectedTemplate = Handlebars.compile($('#item-template').html());
 			
 		  this.$djForm = $('#djs');
 		  this.$signupForm = $('#signup');
 		  this.$thanks = $('#thanks');
 		  this.$votedFor = $("#voted-for");

 		},
 		bindEvents: function () {
 		  this.$djForm.on("submit",function(e){return false;}).validate({
        errorElement:"em",
        submitHandler: function(form) {
          App.slideForm();
        }
       });
       
       this.$signupForm.on("submit",function(e){return false;}).validate({
         errorElement:"em",
         submitHandler: function(form) {
           App.slideForm();
         }
        });
 		  
 		},
 		slideForm: function(){
 		  var lp = App.currentLeftPosition-810;
 		  this.$formHolder.animate({left:lp},500, function(){
 		    App.currentLeftPosition = lp;
 		  });
 		},
 		render: function () {

        $('[placeholder]').parents('form').submit(function() {
          $(this).find('[placeholder]').each(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
              input.val('');
            }
          })
        });
        
      $('input[type="checkbox"],input[type="radio"]',this.$signupForm).iCheck({
            checkboxClass: 'icheckbox_square-red',
            radioClass: 'iradio_square-red',
            increaseArea: '20%' // optional
      });
 		},
 		showVotedFor: function(data){
 		  console.log(data);
 		  App.$votedFor.html(App.selectedTemplate(data));
 		},
 		togglePanel: function(e){
 		  e.stopImmediatePropagation();
       $(e.currentTarget).addClass('open');
 		  var el = e.data.prntObject;
 		  $.each(App.$panelArray,function(i,v){
 		    if($(this).hasClass('in')){
 		      $(this).collapse('hide');
 		      $(this).prev().removeClass('open');
 		    } 
 		  })
 		  el.collapse('show');
 		  //return false;
 		},
 		activateStyle: function (e) {
 		  var element = e;
 		      element.css({opacity:0.5});
 		      element.find('input').iCheck('toggle');
 		      App.activeStyle = element;
 		      //this.$panelOne.collapse('hide');
 		      //this.$panelTwo.collapse('show');
 		      this.$panelTwo.prev().trigger('click');
 		      App.updateBuilder({"action":"refresh","obj":$(this.$quantityInputs[0])});
 		},
 		deactivateStyle: function (e) {
 		  var element = $(e.target);
 		  element.css({opacity:1});
 		  //element.find('input').iCheck('toggle');
 		  // should remove object from right here too
 	  },
 		toggleStyle: function (e) {
 		  e.stopImmediatePropagation();
 			if(App.activeStyle.length > 0) App.activeStyle.trigger('deactivate');
 			var element = $(this);
 			App.activateStyle(element);
 		}
 	};

 	App.init();
 });
 
 