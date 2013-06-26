/*
 * Joel Severin (ICE Business Development AB), for VideofyMe.
 */
/*
 * Load videos and toplists at init from VideofyMe JS API.
 */
 // api key for ipaddress:
 // 8ef8f30a803dad6fd963f2352a7cd64f78f0569efff2a283824929031089e62b

 /**
  * Cookie plugin
  *
  * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
  * Dual licensed under the MIT and GPL licenses:
  * http://www.opensource.org/licenses/mit-license.php
  * http://www.gnu.org/licenses/gpl.html
  *
  */
jQuery.cookie=function(name,value,options){if(typeof value!='undefined'){options=options||{};if(value===null){value='';options=$.extend({},options);options.expires=-1;}var expires='';if(options.expires&&(typeof options.expires=='number'||options.expires.toUTCString)){var date;if(typeof options.expires=='number'){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000));}else{date=options.expires;}expires='; expires='+date.toUTCString();}var path=options.path?'; path='+(options.path):'';var domain=options.domain?'; domain='+(options.domain):'';var secure=options.secure?'; secure':'';document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');}else{var cookieValue=null;if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}return cookieValue;}};

jQuery(function ($) {

    var parentHolder = $("#sidebar-info-text");
    var limitIG = 5;
    var checkUrlSource = document.URL.split('/');
    if (checkUrlSource.length < 5) {
        var caller = $.ajax({
            url: "http://api.followgram.com/v1/album/44485/1286686800/"
        }).success(function (data) {
            //console.log(data);
            parentHolder.addClass('processed').empty();
            $.each(data, function (i, v) {
                if (i < limitIG) $('<img/>', {
                    src: v.urlbig,
                    "class": "ig_imgs"
                }).appendTo(parentHolder);
            });

            parentHolder.on("click", function () {
                window.location = "http://arma.ni/fol"
                return false;
            });
        });
    }


    // Invoke the specified features and then calls their response callback.
    function invoke_features(features, response_callbacks) {
        $.ajax({
            url: videofymyfashion.settings.videofyme_api_url,
            dataType: 'jsonp',
            // The VideofyMe API does not allow the _ in the auto-grenerated callback.
            jsonpCallback: 'jsonpCallback' + Math.round(Math.random()),
            data: {
                feature: features,
                requester_id: videofymyfashion.settings.tumblr_blog_id
            }
        }).success(function (data) {
            // Call the response callback for each matching response callback.
            for (var feature in data) {
                if (response_callbacks[feature]) {
                    response_callbacks[feature](data[feature]);
                }
            }
        });
    }

    // Populates jQuery DOM-node(s) with the supplied video information.

    function populate_video(video, videoinfo) {
        var p = video.find('p');
        var a = p.find('a');

        // Add video thumbnail and wraps it in the a used for comments etc.
        video.prepend(
            a.clone().empty().append(
                $('<img/>')
                .attr('src', videoinfo.thumbnails[
                    // 1 and 7 is large, the others medium
                    video.is('.video-zebra-1, .video-zebra-7') ? 'large' : 'medium'
                ])
                .attr('alt', videoinfo.title)
            )
        );
        // Adds like buttons and make them clickable as ordinary permalinks.
        p.prepend('&nbsp;&nbsp;');
        video.find('p').prepend(
            construct_like_counter(videoinfo)
            .addClass('permalink')
            .attr('href', a.attr('href'))
        );
    }
    // Returns a jQuery-object with a like-counter (1337 <3)

    function construct_like_counter(videoinfo) {
        // The like-counter class' onclick handler is captured with js.
        return $('<a href="#"/>').addClass('like-counter').text(videoinfo.likes);
    }
    // Makes sure everything on the page is parsed and updated with information
    // from the VideofyMe API.

    function parse_and_update_everything() {
        var features = {};
        // If the toplist haven't been found and begun to be populated yet...
        var toplist = $('#sidebar-like-toplist:not(.videofyme-api-parsed)');
        if (toplist.length) {
            $('#sidebar-like-toplist').addClass('videofyme-api-parsed');
            features.tag_like_toplist = 'videofymyfashion';
        }
        // If there are any unparsed videos.
        var videos = $('#videos article:not(.videofyme-api-parsed), .post');
        if (videos.length) {
            var video_ids = [];
            videos.each(function () {
                var video = $(this);
                video.addClass('videofyme-api-parsed');
                // Tumblr exports in 'Escape\xBEEF'-format, we have to eval...
                var embed_code = eval(video.data('player'));
                // (Mis)use replace to get the subpattern, if found. (note: no /g)
                embed_code.replace(
                    /(\/v\/|videoid=)([\d]+)/i,
                    function (match, video_id_handle, video_id) {
                        if (video_id) {
                            video.data('video-id', video_id);
                            // Remove from DOM (eg. clean up Firebug-like element inspection)
                            video.data('player', '');
                            video_ids.push(video_id);
                        }
                        return match;
                    }
                );
            });
            // Add the videoinfo feature to the request.
            if (video_ids.length) {
                features.videoinfo = video_ids.join(',');
                features.key_values = $.map(video_ids, function (video_id) {
                    return "user_id:" + videofymyfashion.settings.tumblr_blog_id + ":video_id:" + video_id + ":tumblr:content_id";
                }).join(',');
            }
        }
        // If no features are in fact requested, optimize by stopping here.
        if (!features.tag_like_toplist && !features.videoinfo) return;
        invoke_features(features, {
            videoinfo: function (data) {
                // Populate each video object with the fetched data.
                // Helper that converts thumbnails.
                function scale_thumbnail(full, commands) {
                    // Replace domain...
                    var scaled = full.replace(
                        /^(http|https):\/\/([^\/]+)/,
                        '$1://' + videofymyfashion.settings.thumbnail_imgix_domain
                    );
                    // Append options
                    // The image has to have exactly these dimensions, currently only
                    // fit=scale seems to meet that criteria...
                    scaled += commands ? '?' + commands : '';
                    return scaled;
                }
                for (var video in data) {
                    var videoinfo = {
                        video_id: data[video].video_id,
                        title: data[video].title,
                        likes: data[video].likes,
                        videofyme_link: data[video].link,
                        thumbnails: {
                            small: data[video].small_thumbnail_path,
                            medium: scale_thumbnail(
                                data[video].medium_thumbnail_path,
                                // Remove black borders and make image slim (only crop height)
                                //'w=200&h=120&bg=000000&fit=crop'// Crops to center
                                'w=200&h=110&bg=000000&fit=crop' // Crops to center
                                + '&mark=http://static.videofy.me/play-symbol-small.png' // (below)
                                + '&markalign=middle,center' // Add play symbol
                            ),
                            large: scale_thumbnail(
                                data[video].thumbnail_path,
                                //'w=430&h=270&bg=000000&fit=crop&crop=faces'
                                'w=430&h=250&bg=000000&fit=crop&crop=faces' + '&mark=http://static.videofy.me/play-symbol-big.png' // (below)
                                + '&markalign=middle,center' // Add play symbol
                            ),
                            extra_large: data[video].thumbnail_path
                        }
                    };
                    // See note below (=we have to filter out old ones, with the same id).
                    var video_node = videos.filter(function () {
                        return (
                            $(this).data('video-id') == videoinfo.video_id && !$(this).is('.videofyme-api-populated')
                        );
                    });
                    // If the same video id occurs multiple times, we have to do it
                    // independently (this should only happen in a debug environment...)
                    video_node.each(function () {
                        var current_video_node = $(this);
                        populate_video(current_video_node, videoinfo);
                        current_video_node
                            .data('videofyme-link', videoinfo.videofyme_link)
                            .data('thumbnails-extra-large', videoinfo.thumbnails.extra_large)
                            .data('title', videoinfo.title);
                        current_video_node.addClass('videofyme-api-populated');
                        current_video_node.trigger('videofymeapipopulated');
                    });
                }
            },
            tag_like_toplist: function (data) {
                // Populate toplist with top videos.
                var ol = $('#sidebar-like-toplist ol');
                ol.empty();
                for (var video in data) {
                    var like_counter = construct_like_counter({
                        likes: data[video].likes
                    });
                    var blog_name = $('<span/>').text(data[video].blog_title);
                    var video_link = $('<a class="permalink" />')
                    //.attr('href', data[video].link)
                    .attr('href', '/post/' + data[video].tumblr_id)
                        .text(data[video].title);
                    $('<li/>').appendTo(ol).append(like_counter, video_link, blog_name)
                        .data('video-id', data[video].video_id)
                        .data('videofyme-link', data[video].link)
                        .data('thumbnails-extra-large', data[video].thumbnail_path)
                        .data('title', data[video].title);
                }
            },
            key_values: function (data) {
                for (var video in data) {
                    var video_id = data[video].key.match(/:video_id:([\d]+)/i)[1];
                    var video_node = videos.filter(function () {
                        return $(this).data('video-id') == video_id;
                    });
                    // If the same video id occurs multiple times, we have to do it
                    // independently (this should only happen in a debug environment...)
                    video_node.each(function () {
                        var current_video_node = $(this);
                        current_video_node
                            .data('content-id', data[video].value);
                    });
                }
                var article = $("article.post").first()
                if (article.length > 0)
                    content_id_hook(article.data("contentId"));
            }
        });
    }
    // Do something with content id in modal or on permalink page
    // hooked_from can be modal or permalink
    
    function loadImage(id,part){
      
     var parentHolder = $(".post-player"),
          productSrc = "http://imgs-org.yoox.biz/46/"+id[0]+"_12_F.jpg",
          productUrl = "http://www.armani.com/itemSearchAPI.asp?site=giorgioarmani&cod10="+id[part];
    
     var elementLink = $("<a/>",{'href':productUrl,"class":"product-image"})
                       .append($('<span/>').css('background-image','url('+productSrc+')'))
                       .append($('<img/>',{src:"http://res.cloudinary.com/armani/image/upload/v1372255678/get-these-on-framesoflife_com_wihuuc.png"}))

     parentHolder.after(elementLink);
     
    }

    function content_id_hook(content_id) {
        //console.log(content_id);
        if (videofymyfashion.settings.content_id_hook && content_id != ""){
         var localizedId = content_id.split('_'),
             idPart = 0;
             
             if($.cookie('_a_country_code_') == undefined || $.cookie('_a_country_code_') == ""){
                 var caller = $.ajax({
                     url: "http://armanissl.com/static/logic/locate.php"
                 }).success(function (data) {
                     if(data.countryCode == "US") idPart = 1;
                     $.cookie('_a_country_code_', data.countryCode, { expires: 30 });
                     loadImage(localizedId,idPart);
                 }).error(function(xhr, status, error){
                     loadImage(localizedId,idPart);
                 });
            }else{
                  if($.cookie('_a_country_code_') == "US") idPart = 1;
                  loadImage(localizedId,idPart);
            }
        }
    }
    // Parse everything, and make sure it is done on ajax pageloads...
    (function () {
        parse_and_update_everything();
        $(document).on('inlineajaxdomready', function () {
            parse_and_update_everything();
        });
    })();
    // Get the URI from the given URL (protocol://domain/uri/x?foo -> /uri/x?foo)
    // Currently, the #hash part is also included...

    function get_uri_from_url(url) {
        var return_value = null;
        // (Mis)use replace to get the path
        url.replace(
            /^(http|https):\/\/([^\/]+)(\/.*)$/g,
            function (match, protocol, domain, path) {
                // TODO(implementing https): Add check/take action if going http->https.
                if (path) return_value = path;
                return null;
            }
        );
        return return_value;
    }
    // Navigate with History API if possible.

    function history_go_there(uri, title) {
        if (!window.history || !window.history.pushState) return;
        window.history.pushState(null, title, uri);
    }
    // Common "singleton" holder for modal dialog.
    var dialog = null;
    // Create the modal dialog if not already done...

    function create_dialog() {
        if (dialog) return;
        // The black-transparent overlay for the whole page.
        var background_fader = $('<div class="modal-dialog-background-fader"/>')
            .css("opacity", 0).hide(0);
        // The real dialog is insida a container, positioning and centering the it.
        dialog = $('<div class="modal-dialog-container"/>').hide(0);
        dialog.on('openmodaldialog', function () {
            background_fader.show(0).animate({
                "opacity": 0.5
            }, 'slow');
            dialog.slideDown('slow');
        });
        dialog.on('closemodaldialog', function () {
            background_fader.animate({
                "opacity": 0
            }, 'fast').hide(0);
            dialog.slideUp('fast', function () {
                // Empty the contents when animation finishes to stop video playback etc
                dialog.find('.modal-dialog-content').empty();
            });
        });
        // This is the real dialog, from a users/UI perspective...
        var real_dialog = $('<div class="modal-dialog"/>').appendTo(dialog);
        // Setup header. This is where the title and close button belongs.
        var header = $('<div class="modal-dialog-header"/>').appendTo(real_dialog);
        header.append($('<a href="#" class="close">X</a>'));
        header.append($('<span class="title"/>'));
        // Setup content area.
        $('<div class="modal-dialog-content"/>').appendTo(real_dialog);
        // Setup event listeners for closing the dialog
        var selectors = '.modal-dialog-background-fader, .modal-dialog-container';
        $('body').on('click', selectors, function (event) {
            if (event.target === this) dialog.trigger('closemodaldialog');
        });
        $('body').on('click', '.modal-dialog-header a.close', function (event) {
            dialog.trigger('closemodaldialog');
            event.preventDefault();
        });
        // Append both fader and dialog.
        $('body').append(background_fader, dialog);
    }
    // Opens the dialog, and loads url into it, if specified...

    function open_dialog(url) {
        if (!dialog) create_dialog();
        dialog.trigger('openmodaldialog');
        if (url) {
            var dialog_content = dialog.find('.modal-dialog-content');
            var dialog_title = dialog.find('.modal-dialog-header .title');
            dialog_content.empty().text('Loading...');
            $.ajax(url)
                .done(function (data) {
                    // Find markers (this is where the content begins)
                    var start = data.indexOf('<!--AJAX_REQUEST_MARKER-->');
                    var end = data.indexOf('<!--/AJAX_REQUEST_MARKER-->');
                    if (start == -1 || end == -1) {
                        var error = 'AJAX_REQUEST_MARKER(s) was not found:';
                        error += (start == -1) ? ' Start marker not found.' : '';
                        error += (end == -1) ? ' End marker not found.' : '';
                        alert('Oops, we could not parse the page for you :(\nError:' + error);
                    } else {
                        // Update with the code extracted from the AJAX call.
                        dialog_content.empty().html(
                            data.slice(start, end)
                        );
                        // Set the title in the modal dialog, if found...
                        var title = dialog_content.find('.post').data('title');
                        if (title) dialog_title.html(title);
                        // Remove old tumblr toolbar if any, and add a new one:
                        dialog.find('.modal-dialog-header .modal-dialog-tumblr-toolbar')
                            .remove();
                        dialog.find('.modal-dialog-header a.close').after(
                            $('<iframe scrolling="no" frameborder="0" border="0"/>')
                            .addClass('modal-dialog-tumblr-toolbar')
                            .attr(
                                'src',
                                url + (url.indexOf('?') == -1 ? '?' : '&') + 'tumblr-toolbar'
                            )
                        );
                        $(document).trigger('inlineajaxdomready');
                    }
                })
                .fail(function (jqXHR, status) {
                    alert('Sorry, we failed to open the page for you :( Error:\n' + status);
                    dialog.trigger('closemodaldialog');
                });
        }
        // Listen for scroll events, scroll dialog to top if neccessary.
        // Placed were, because we dont't need to (and probably shouldn't) run it
        // if there is in fact no modal dialog ever created.
        (function () {
            var win = $(window);
            var modal_dialog_container = $('.modal-dialog-container');
            win.on('scroll.videofymyfashion-modal-dialog-scroll', function () {
                if (!dialog_focus_scrolled) return; // Super fast
                var win_scroll_top = win.scrollTop();
                if (win_scroll_top < modal_dialog_container.offset().top) {
                    modal_dialog_container.css('top', win_scroll_top + 'px');
                }
            });
        })();
    }
    // Closes the dialog

    function close_dialog() {
        if (!dialog) return; // assert(dialog) :S
        dialog.trigger('closemodaldialog');
    }
    // If set to true, the dialog has been given focus and is scrolled below top.
    var dialog_focus_scrolled = false;
    // Sets focus on the dialog (scroll it into the users viewport).

    function dialog_set_focus() {
        var scroll_top = $(window).scrollTop();
        $('.modal-dialog-container').css('top', scroll_top + 'px');
        if (scroll_top > 0) dialog_focus_scrolled = true;
    }
    // Listen for permalink click events, open modal dialog when invoked.
    (function () {
        $('#videos, #sidebar-like-toplist')
            .on('click', 'a.permalink', function (event) {
                // Open modal dialog, change location bar and abort navigation.
                open_dialog(this.href);
                dialog.bind('closemodaldialog', function () {
                    history_go_there('/');
                });
                history_go_there(get_uri_from_url(this.href));
                event.preventDefault();
                // Scroll to top of page.
                // Leave 1px off to hide the location bar in mobile browsers (e.g. iPhone)
                //window.scrollTo(0, 1);
                //Move dialog instead
                dialog_set_focus();
            });
    })();
    // Reparse Facebook, Twitter and Pinterest tags...
    (function () {
        $(document).on('inlineajaxdomready', function () {
            // try {
            //         FB.XFBML.parse()
            //       } catch(e) {}
            //       try {
            //         twttr.widgets.load();
            //       } catch(e) {}
            // Create Pinterest tags that are waiting for parsing...
            // $('.pinterest-pin-it-dummy').each(function() {
            //       var permalink = $(this).data('belongs-to-permalink');
            //       // Any datasources found? Use them and create button!
            //       var source = $('#videos article, #sidebar-like-toplist li')
            //       .filter(function() {
            //         var source_candidate = $(this);
            //         return (
            //           source_candidate.data('permalink') == permalink
            //         );
            //       })
            //       .first();
            //       if(source.length) {
            //         // Create native Pinterest button with filled in data.
            //         var url = 'http://pinterest.com/pin/create/button/'
            //         .replace('$URL', encodeURIComponent(
            //           source.data('videofyme-link')
            //         ))
            //         .replace('$MEDIA', encodeURIComponent(
            //           source.data('thumbnails-extra-large')
            //         ))
            //         .replace('$DESCRIPTION', encodeURIComponent(
            //           source.data('title')
            //         ));
            //         var pin_it = $('<a class="pin-it-button" count-layout="horizontal"/>')
            //         .attr('href', url)
            //         .append(
            //           $('<img/>')
            //           .attr('src', '//assets.pinterest.com/images/PinExt.png')
            //           .attr('alt', 'Pin It')
            //         );
            //         // Remove this dummy, replacing it with the native button.
            //         $(this).replaceWith(pin_it);
            //       }
            //     });
            // try {
            //        // This is the way to re-parse Pin It-buttons...
            //        $.ajax({
            //          url: location.protocol + '//assets.pinterest.com/js/pinit.js',
            //          dataType: 'script',
            //          cache: true
            //        });
            //      } catch(e) {}
        });
    })();
});
/*
 * Infinity scroll
 */
jQuery(function ($) {
    // Cached to give maximum performance gain for window onscroll events etc.
    var win = $(window);
    var videos = $('#videos');
    // Activate the new-video-fetching if possible, and not already done.

    function maybe_activate() {
        var more_link = videos.find('a.infinity-scroll-next:not(.activated)');
        if (more_link.length != 1) return; // assert(0 <= links.length <= 1)
        // If the link is down below the browser windows bottom edge, return...
        if (more_link.offset().top > win.scrollTop() + win.height()) return;
        // It is important to flag it as active, preventing additional requests...
        //more_link.addClass('activated').animate({ opacity: 0.5 });
        more_link.addClass('activated').animate({
            opacity: 0
        });
        more_link.text('Loading more videos...');
        $.ajax(more_link.attr('href'))
            .success(function (data) {
                // Remove more link, there will be a new one in the request if there are
                // more pages available to load.
                more_link.remove();
                var start = data.indexOf('<!--AJAX_REQUEST_MARKER-->');
                var end = data.indexOf('<!--/AJAX_REQUEST_MARKER-->');
                if (start == -1 || end == -1) return; // Silently fail...
                var page = data.substring(start, end);
                // Load the page into a div, detach elements, hide videos, insert, show.
                var new_elements = $('<div/>').html(page)
                    .contents().detach().appendTo(videos);
                // Hide the new videos at first...
                var new_videos = new_elements.filter('article');
                new_videos.hide(0);
                // When they finish VideofyMe API population, show them...
                var started_showing_this_batch = false;
                new_videos.on('videofymeapipopulated', function () {
                    // We vill get notifications from every video node, but only care about
                    // the first. The others will be finished very shortly thereafter...
                    if (started_showing_this_batch) return;
                    started_showing_this_batch = true;
                    // Create a callback tree to show each video one after another...
                    var callbacks = [];
                    new_videos.each(function () {
                        var video = $(this);
                        callbacks.push(function (callback) {
                            //video.show(500, callback);
                            video.css('opacity', 0);
                            video.show(0);
                            video.animate({
                                opacity: 1
                            }, 250, callback);
                        });
                    });
                    // Execute this now, and efter every animation step, until none left.
                    (function () {
                        if (callbacks.length) callbacks.shift()(arguments.callee);
                    })();
                });
                // Re-parse the document (including VideofyMe API population).
                $(document).trigger('inlineajaxdomready');
            });
    }
    win.on('scroll.videofymyfashion-inifnity-scroll', maybe_activate);
    // Also bind on activated link clicks, to prevent the browser from navigating
    // away (the filtering of :not(.activated) is done in maybe_activate anyway).
    videos.on('click', 'a.infinity-scroll-next', function (event) {
        maybe_activate();
        event.preventDefault();
    });
});
/*
 * Ugly hack that resizes videos...
 * Problem: Tumblr delivers them in 250, 400 or 400-px wide format.
 */
(function ($) {
    function resize() {
        // Note: Don't use .width()/.height() - they use css!
        var old_width = 500;
        $('.post-player object, .post-player embed, .post-player iframe')
            .filter(function () {
                var tag = $(this);
                return (tag.attr('width') == old_width && tag.attr('height'));
            })
            .each(function () {
                var tag = $(this);
                // Fine to use width... it should really be innerWidth or something,
                // but rather break than create mysterious bugs when someone applies
                // margins/paddings in the css - cause they shouldn't...
                var new_width = tag.parents('.post-player').width();
                // Maintain aspect ratio
                var new_height = Math.round(tag.attr('height') * (new_width / old_width));
                tag.attr('width', new_width).attr('height', new_height);
            });
    }
    $(resize);
    $(document).on('inlineajaxdomready', resize);
})(jQuery);
