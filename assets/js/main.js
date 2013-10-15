$.parse.init({
    session_token : AApp.session_token,
    app_id:"Y9IJPTXprcWyThTYBvgso90fKPoGjGCgdidJPbsD",
    rest_key:"ClIMrTcgQbUdBgPAaSoyzOMUoeaEHrKnKYIEqkQo"
});

FB.init({
    appId: '568727519847132',
    status: true, 
    cookie: true, 
    xfbml: true
});

$(window).load(function(){
    FB.Canvas.setSize();
});

$.support.cors = true;

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
 		getAge: function(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    },
    getAgeRange: function(age){
      var group;
      switch(true){
        case (age > 18 && age < 25):
          group = 1824;
        break;
        case (age > 24 && age < 35):
          group = 2534;
        break;
        case (age > 34 && age < 45):
          group = 3544;
        break;
        case (age > 44 && age < 55):
          group = 4554;
        break;
        case (age > 54 && age < 65):
          group = 5565;
        break;
        case (age > 64 && age < 110):
          group = 6699;
        break;
      }
      return group;
    },
 		pluralize: function (count, word) {
 			return count === 1 ? word : word + 's';
 		},
 		padNumber: function (number, digits) {
      // z = z || '0';
      //       n = n + '';
      //       return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
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
 	
 	$.validator.addMethod(
      "euroDate",
      function(value, element) {
          // put your own logic here, this is just a (crappy) example
          return value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/);
      },
      "Please enter a date in the format dd/mm/yyyy."
  );
  
  $.validator.addMethod('mustSelect', function(value,element){
    if($(element).is(':checked')){
      return true;
    }else{
      return false;
    }
  }, 'You must check this box');

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
 		  this.$principal = $("div.principal");
 			this.$formHolder = $("div.holder");
 			this.selectedTemplate = Handlebars.compile($('#item-template').html());
 			
 		  this.$djForm = $('#djs');
 		  this.$signupForm = $('#signup');
 		  this.$thanks = $('#thanks');
 		  this.$nextArrow = $("button.arrow");
 		  this.$changeSelection = $("a.close");
 		  this.$votedFor = $("#voted-for");
 		  this.$djs = $("figure", this.$djForm);
 		  this.$privacy = $("#privacy");
 		  this.$privacyText = $("#policy");

 		},
 		bindEvents: function () {
 		  this.$privacy.on("click",this.loadPrivacy);
 		  this.$changeSelection.on("click",this.deactivateSelection);
 		  this.$djs.each(function(i,v){
 		    var o = $(this);
 		    o.on("click",App.activateSelection);
 		    o.on("mouseenter",App.hoverSelection);
 		    o.on("mouseleave",App.hoverOutSelection); 		    
 		    o.children("input").on("click",function(e){e.stopImmediatePropagation();});
 		  });
 		  
 		  this.$djForm.on("submit",function(e){return false;}).validate({
        errorElement:"em",
        submitHandler: function(form) {
          App.slideForm();
        }
       });
       
       this.$signupForm.on("submit",function(e){return false;}).validate({
         errorElement:"em",
         rules : {
                    gender: {
                     required:true 
                    },
                    emails: {
                      mustSelect:true
                    }
                    
                 },
         submitHandler: function(form) {
           
           var data = {}
           $.each($(form).serializeArray(),function(i,v){
             data[v.name] = v.value;
           });
           
           data.deejay = $('input[name="deejay"]',this.$djForm).val();
           
           var age = Utils.getAge(data.year+"/"+data.month+"/"+data.date);
           
           data.dob = data.year+""+Utils.padNumber(data.month,2)+""+Utils.padNumber(data.date,2);
           data.age_range = Utils.getAgeRange(age);
           var sex = parseFloat(data.gender);
           data.sex = (sex == 5) ? 1 : sex;
           console.log(data)
           $.parse.post('signups',data, App.saveData);
         }
        });
 		},
 		saveData: function(json){
 		  if(json.objectId != ""){
        App.slideForm();
       }
 		},
 		removeEvents: function(){
 		  this.$djs.each(function(i,v){
 		    var o = $(this);
 		    o.off("click",App.activateSelection);
 		    o.off("mouseenter",App.hoverSelection);
 		    o.off("mouseleave",App.hoverOutSelection); 		    
 		    o.children("input").off("click",function(e){e.stopImmediatePropagation();});
 		  });
 		},
 		loadPrivacy: function(e){
 		  e.stopImmediatePropagation();
 		  App.$privacyText.slideDown(600);
 		  return false;
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
 		  App.$votedFor.html(App.selectedTemplate(data)).show();
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
 		hoverSelection: function(e){
 		  var el = $(e.currentTarget);
 		  TweenLite.to(el.find(".vote"), 0.3, {css:{opacity:1}});
 		  App.$djs.each(function(i,v){
 		    if(v != e.currentTarget) TweenLite.to($(v).children("figcaption"), 0.5, {css:{opacity:0}});
 		  });
 		},
 		hoverOutSelection: function(e){
 		  var el = $(e.currentTarget);
 		  TweenLite.to(el.find(".vote"), 0.3, {css:{opacity:0}});
 		  App.$djs.each(function(i,v){
 		    TweenLite.to($(v).children("figcaption"), 0.5, {css:{opacity:1}});
 		  });
 		},
 		activateSelection: function (e) {
 		  var el = $(e.currentTarget), c = el.find("span");
 		      el.children('input[type="radio"]').trigger("click");
 		      el.addClass("selected");
 		      TweenLite.to(App.$principal, 0.6, {backgroundColor:"rgba(0,0,0,0.6)"});  
 		      App.$djs.each(function(i,v){
     		    if(v != e.currentTarget) TweenLite.to($(v), 0.5, {css:{opacity:0.2}});
     		  });
     		  App.showVotedFor({"title":c.text()});
     		  App.removeEvents();
     		  TweenLite.to(el.find(".vote"), 0.3, {css:{opacity:0}});
     		  TweenLite.to(el.children("figcaption"), 0.5, {css:{opacity:0}});
     		  App.$changeSelection.show();
     		  App.$nextArrow.show();
 		},
 		deactivateSelection: function (e) {
 		  e.stopImmediatePropagation();
 		  App.bindEvents();
 		  $("figure.selected").removeClass("selected");
 		  App.$votedFor.hide();
 		  TweenLite.to(App.$djs, 0.5, {css:{opacity:1}});
 		  TweenLite.to(App.$djs.children("figcaption"), 0.5, {css:{opacity:1}});
 		  TweenLite.to(App.$principal, 0.6, {backgroundColor:"rgba(0,0,0,0)"});
 		  App.$changeSelection.hide();
 		  App.$nextArrow.hide();
 		  return false;
 	  }
 	};

 	App.init();
 });
 
 