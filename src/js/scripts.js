hljs.highlightAll();
/*
 * jQuery Mobile Menu 
 * Turn unordered list menu into dropdown select menu
 * version 1.0(31-OCT-2011)
 * 
 * Built on top of the jQuery library
 *   http://jquery.com
 * 
 * Documentation
 * 	 http://github.com/mambows/mobilemenu
 */
(function ($) {
    $.fn.mobileMenu = function (options) {

        var defaults = {
            defaultText: 'Navigate to...',
            className: 'select-menu',
            containerClass: 'select-menu-container',
            subMenuClass: 'sub-menu',
            subMenuDash: '&ndash;'
        },
            settings = $.extend(defaults, options),
            el = $(this);

        this.each(function () {
            // ad class to submenu list
            el.find('ul').addClass(settings.subMenuClass);

            // Create base menu
            $('<div />', {
                'class': settings.containerClass
            }).insertAfter(el);

            // Create base menu
            $('<select />', {
                'class': settings.className
            }).appendTo('.' + settings.containerClass);

            // Create default option
            $('<option />', {
                "value": '#',
                "text": settings.defaultText
            }).appendTo('.' + settings.className);

            // Create select option from menu
            el.find('a').each(function () {
                var $this = $(this),
                    optText = '&nbsp;' + $this.text(),
                    optSub = $this.parents('.' + settings.subMenuClass),
                    len = optSub.length,
                    dash;

                // if menu has sub menu
                if ($this.parents('ul').hasClass(settings.subMenuClass)) {
                    dash = Array(len + 1).join(settings.subMenuDash);
                    optText = dash + optText;
                }

                // Now build menu and append it
                $('<option />', {
                    "value": this.href,
                    "html": optText,
                    "selected": (this.href == window.location.href)
                }).appendTo('.' + settings.className);

            }); // End el.find('a').each

            // Change event on select element
            $('.' + settings.className).change(function () {
                var locations = $(this).val();
                if (locations !== '#') {
                    window.location.href = $(this).val();
                };
            });

        }); // End this.each

        return this;

    };
})(jQuery);


(function ($) {
    /* hoverIntent by Brian Cherne */
    $.fn.hoverIntent = function (f, g) {
        // default configuration options
        var cfg = {
            sensitivity: 7,
            interval: 100,
            timeout: 0
        };
        // override configuration options with user supplied object
        cfg = $.extend(cfg, g ? { over: f, out: g } : f);

        // instantiate variables
        // cX, cY = current X and Y position of mouse, updated by mousemove event
        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
        var cX, cY, pX, pY;

        // A private function for getting mouse position
        var track = function (ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        // A private function for comparing current and previous mouse position
        var compare = function (ev, ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            // compare mouse positions to see if they've crossed the threshold
            if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) {
                $(ob).unbind("mousemove", track);
                // set hoverIntent state to true (so mouseOut can be called)
                ob.hoverIntent_s = 1;
                return cfg.over.apply(ob, [ev]);
            } else {
                // set previous coordinates for next time
                pX = cX; pY = cY;
                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
                ob.hoverIntent_t = setTimeout(function () { compare(ev, ob); }, cfg.interval);
            }
        };

        // A private function for delaying the mouseOut function
        var delay = function (ev, ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = 0;
            return cfg.out.apply(ob, [ev]);
        };

        // A private function for handling mouse 'hovering'
        var handleHover = function (e) {
            // next three lines copied from jQuery.hover, ignore children onMouseOver/onMouseOut
            var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
            while (p && p != this) { try { p = p.parentNode; } catch (e) { p = this; } }
            if (p == this) { return false; }

            // copy objects to be passed into t (required for event object to be passed in IE)
            var ev = jQuery.extend({}, e);
            var ob = this;

            // cancel hoverIntent timer if it exists
            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

            // else e.type == "onmouseover"
            if (e.type == "mouseover") {
                // set "previous" X and Y position based on initial entry point
                pX = ev.pageX; pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $(ob).bind("mousemove", track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout(function () { compare(ev, ob); }, cfg.interval); }

                // else e.type == "onmouseout"
            } else {
                // unbind expensive mousemove event
                $(ob).unbind("mousemove", track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout(function () { delay(ev, ob); }, cfg.timeout); }
            }
        };

        // bind the function to the two event listeners
        return this.mouseover(handleHover).mouseout(handleHover);
    };

})(jQuery);

/*
 * Superfish v1.4.8 - jQuery menu widget
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 * CHANGELOG: http://users.tpg.com.au/j_birch/plugins/superfish/changelog.txt
 */

; (function ($) {
    $.fn.superfish = function (op) {

        var sf = $.fn.superfish,
            c = sf.c,
            $arrow = $(['<span class="', c.arrowClass, '"> &#187;</span>'].join('')),
            over = function () {
                var $$ = $(this), menu = getMenu($$);
                clearTimeout(menu.sfTimer);
                $$.showSuperfishUl().siblings().hideSuperfishUl();
            },
            out = function () {
                var $$ = $(this), menu = getMenu($$), o = sf.op;
                clearTimeout(menu.sfTimer);
                menu.sfTimer = setTimeout(function () {
                    o.retainPath = ($.inArray($$[0], o.$path) > -1);
                    $$.hideSuperfishUl();
                    if (o.$path.length && $$.parents(['li.', o.hoverClass].join('')).length < 1) { over.call(o.$path); }
                }, o.delay);
            },
            getMenu = function ($menu) {
                var menu = $menu.parents(['ul.', c.menuClass, ':first'].join(''))[0];
                sf.op = sf.o[menu.serial];
                return menu;
            },
            addArrow = function ($a) { $a.addClass(c.anchorClass).append($arrow.clone()); };

        return this.each(function () {
            var s
                = this.serial = sf.o.length;
            var o = $.extend({}, sf.defaults, op);
            o.$path = $('li.' + o.pathClass, this).slice(0, o.pathLevels).each(function () {
                $(this).addClass([o.hoverClass, c.bcClass].join(' '))
                    .filter('li:has(ul)').removeClass(o.pathClass);
            });
            sf.o[s] = sf.op = o;

            $('li:has(ul)', this)[($.fn.hoverIntent && !o.disableHI) ? 'hoverIntent' : 'hover'](over, out).each(function () {
                if (o.autoArrows) addArrow($('>a:first-child', this));
            })
                .not('.' + c.bcClass)
                .hideSuperfishUl();

            var $a = $('a', this);
            $a.each(function (i) {
                var $li = $a.eq(i).parents('li');
                $a.eq(i).focus(function () { over.call($li); }).blur(function () { out.call($li); });
            });
            o.onInit.call(this);

        }).each(function () {
            var menuClasses = [c.menuClass];
            if (sf.op.dropShadows && !($.browser.msie && $.browser.version < 7)) menuClasses.push(c.shadowClass);
            $(this).addClass(menuClasses.join(' '));
        });
    };

    var sf = $.fn.superfish;
    sf.o = [];
    sf.op = {};
    sf.IE7fix = function () {
        var o = sf.op;
        if ($.browser.msie && $.browser.version > 6 && o.dropShadows && o.animation.opacity != undefined)
            this.toggleClass(sf.c.shadowClass + '-off');
    };
    sf.c = {
        bcClass: 'sf-breadcrumb',
        menuClass: 'sf-js-enabled',
        anchorClass: 'sf-with-ul',
        arrowClass: 'sf-sub-indicator',
        shadowClass: 'sf-shadow'
    };
    sf.defaults = {
        hoverClass: 'sfHover',
        pathClass: 'overideThisToUse',
        pathLevels: 1,
        delay: 800,
        animation: { opacity: 'show' },
        speed: 'normal',
        autoArrows: true,
        dropShadows: true,
        disableHI: false,		// true disables hoverIntent detection
        onInit: function () { }, // callback functions
        onBeforeShow: function () { },
        onShow: function () { },
        onHide: function () { }
    };
    $.fn.extend({
        hideSuperfishUl: function () {
            var o = sf.op,
                not = (o.retainPath === true) ? o.$path : '';
            o.retainPath = false;
            var $ul = $(['li.', o.hoverClass].join(''), this).add(this).not(not).removeClass(o.hoverClass)
                .find('>ul').hide().css('visibility', 'hidden');
            o.onHide.call($ul);
            return this;
        },
        showSuperfishUl: function () {
            var o = sf.op,
                sh = sf.c.shadowClass + '-off',
                $ul = this.addClass(o.hoverClass)
                    .find('>ul:hidden').css('visibility', 'visible');
            sf.IE7fix.call($ul);
            o.onBeforeShow.call($ul);
            $ul.animate(o.animation, o.speed, function () { sf.IE7fix.call($ul); o.onShow.call($ul); });
            return this;
        }
    });

})(jQuery);


/*global jQuery */
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

(function ($) {

    "use strict";

    $.fn.fitVids = function (options) {
        var settings = {
            customSelector: null,
            ignore: null
        };

        if (!document.getElementById('fit-vids-style')) {
            // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
            var head = document.head || document.getElementsByTagName('head')[0];
            var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
            var div = document.createElement('div');
            div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
            head.appendChild(div.childNodes[1]);
        }

        if (options) {
            $.extend(settings, options);
        }

        return this.each(function () {
            var selectors = [
                "iframe[src*='player.vimeo.com']",
                "iframe[src*='youtube.com']",
                "iframe[src*='youtube-nocookie.com']",
                "iframe[src*='kickstarter.com'][src*='video.html']",
                "object",
                "embed"
            ];

            if (settings.customSelector) {
                selectors.push(settings.customSelector);
            }

            var ignoreList = '.fitvidsignore';

            if (settings.ignore) {
                ignoreList = ignoreList + ', ' + settings.ignore;
            }

            var $allVideos = $(this).find(selectors.join(','));
            $allVideos = $allVideos.not("object object"); // SwfObj conflict patch
            $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

            $allVideos.each(function () {
                var $this = $(this);
                if ($this.parents(ignoreList).length > 0) {
                    return; // Disable FitVids on this video.
                }
                if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
                if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width')))) {
                    $this.attr('height', 9);
                    $this.attr('width', 16);
                }
                var height = (this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10)))) ? parseInt($this.attr('height'), 10) : $this.height(),
                    width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
                    aspectRatio = height / width;
                if (!$this.attr('id')) {
                    var videoID = 'fitvid' + Math.floor(Math.random() * 999999);
                    $this.attr('id', videoID);
                }
                $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100) + "%");
                $this.removeAttr('height').removeAttr('width');
            });
        });
    };
    // Works with either jQuery or Zepto
})(window.jQuery || window.Zepto);


jQuery.noConflict();
jQuery(function () {
    jQuery('ul.menu-primary').superfish({
        animation: {
            opacity: 'show'
        },
        autoArrows: true,
        dropShadows: false,
        speed: 200,
        delay: 800
    });
});

jQuery(document).ready(function () {
    jQuery('.menu-primary-container').mobileMenu({
        defaultText: 'Feedback',
        className: 'menu-primary-responsive',
        containerClass: 'menu-primary-responsive-container',
        subMenuDash: '&#9989;'
    });
});

jQuery(document).ready(function () {
    var blloc = window.location.href;
    jQuery("#pagelistmenusblogul li a").each(function () {
        var blloc2 = jQuery(this).attr('href');
        if (blloc2 == blloc) {
            jQuery(this).parent('li').addClass('current-cat');
        }
    });
});

jQuery(function () {
    jQuery('ul.menu-secondary').superfish({
        animation: {
            opacity: 'show'
        },
        autoArrows: true,
        dropShadows: false,
        speed: 200,
        delay: 800
    });
});

jQuery(document).ready(function () {
    jQuery('.menu-secondary-container').mobileMenu({
        defaultText: 'Navigation',
        className: 'menu-secondary-responsive',
        containerClass: 'menu-secondary-responsive-container',
        subMenuDash: '&#9989;'
    });
    jQuery(".post").fitVids();
});

jQuery(document).ready(function () {
    jQuery('.flexslider').flexslider({

        namespace: "flex-", //{NEW} String: Prefix string attached to the class of every element generated by the plugin
        selector: ".slidespbt > li", //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
        animation: "fade", //String: Select your animation type, "fade" or "slide"
        easing: "swing", //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
        direction: "horizontal", //String: Select the sliding direction, "horizontal" or "vertical"
        reverse: false, //{NEW} Boolean: Reverse the animation direction
        animationLoop: true, //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
        smoothHeight: true, //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode  
        startAt: 0, //Integer: The slide that the slider should start on. Array notation (0 = first slide)
        slideshow: true, //Boolean: Animate slider automatically
        slideshowSpeed: 5000, //Integer: Set the speed of the slideshow cycling, in milliseconds
        animationSpeed: 600, //Integer: Set the speed of animations, in milliseconds
        initDelay: 0, //{NEW} Integer: Set an initialization delay, in milliseconds
        randomize: false, //Boolean: Randomize slide order

        // Usability features
        pauseOnAction: true, //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
        pauseOnHover: true, //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
        useCSS: true, //{NEW} Boolean: Slider will use CSS3 transitions if available
        touch: true, //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
        video: false, //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

        // Primary Controls
        controlNav: false, //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
        directionNav: true, //Boolean: Create navigation for previous/next navigation? (true/false)
        prevText: "Previous", //String: Set the text for the "previous" directionNav item
        nextText: "Next", //String: Set the text for the "next" directionNav item

        // Secondary Navigation
        keyboard: true, //Boolean: Allow slider navigating via keyboard left/right keys
        multipleKeyboard: false, //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
        mousewheel: false, //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
        pausePlay: false, //Boolean: Create pause/play dynamic element
        pauseText: 'Pause', //String: Set the text for the "pause" pausePlay item
        playText: 'Play', //String: Set the text for the "play" pausePlay item

        // Special properties
        controlsContainer: "", //{UPDATED} Selector: USE CLASS SELECTOR. Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be ".flexslider-container". Property is ignored if given element is not found.
        manualControls: "", //Selector: Declare custom control navigation. Examples would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
        sync: "", //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
        asNavFor: "", //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

        // Carousel Options
        itemWidth: 0, //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
        itemMargin: 0, //{NEW} Integer: Margin between carousel items.
        minItems: 0, //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
        maxItems: 0, //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
        move: 0, //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.

        // Callback API
        start: function () { }, //Callback: function(slider) - Fires when the slider loads the first slide
        before: function () { }, //Callback: function(slider) - Fires asynchronously with each slider animation
        after: function () { }, //Callback: function(slider) - Fires after each slider animation completes
        end: function () { }, //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
        added: function () { }, //{NEW} Callback: function(slider) - Fires after a slide is added
        removed: function () { } //{NEW} Callback: function(slider) - Fires after a slide is removed

    });
});



function showrecentcomments(json) { for (var i = 0; i < a_rc; i++) { var b_rc = json.feed.entry[i]; var c_rc; if (i == json.feed.entry.length) break; for (var k = 0; k < b_rc.link.length; k++) { if (b_rc.link[k].rel == 'alternate') { c_rc = b_rc.link[k].href; break; } } c_rc = c_rc.replace("#", "#comment-"); var d_rc = c_rc.split("#"); d_rc = d_rc[0]; var e_rc = d_rc.split("/"); e_rc = e_rc[5]; e_rc = e_rc.split(".html"); e_rc = e_rc[0]; var f_rc = e_rc.replace(/-/g, " "); f_rc = f_rc.link(d_rc); var g_rc = b_rc.published.$t; var h_rc = g_rc.substring(0, 4); var i_rc = g_rc.substring(5, 7); var j_rc = g_rc.substring(8, 10); var k_rc = new Array(); k_rc[1] = "Jan"; k_rc[2] = "Feb"; k_rc[3] = "Mar"; k_rc[4] = "Apr"; k_rc[5] = "May"; k_rc[6] = "Jun"; k_rc[7] = "Jul"; k_rc[8] = "Aug"; k_rc[9] = "Sep"; k_rc[10] = "Oct"; k_rc[11] = "Nov"; k_rc[12] = "Dec"; if ("content" in b_rc) { var l_rc = b_rc.content.$t; } else if ("summary" in b_rc) { var l_rc = b_rc.summary.$t; } else var l_rc = ""; var re = /<\S[^>]*>/g; l_rc = l_rc.replace(re, ""); if (m_rc == true) document.write('On ' + k_rc[parseInt(i_rc, 10)] + ' ' + j_rc + ' '); document.write('<a href="' + c_rc + '">' + b_rc.author[0].name.$t + '</a> commented'); if (n_rc == true) document.write(' on ' + f_rc); document.write(': '); if (l_rc.length < o_rc) { document.write('<i>&#8220;'); document.write(l_rc); document.write('&#8221;</i><br/><br/>'); } else { document.write('<i>&#8220;'); l_rc = l_rc.substring(0, o_rc); var p_rc = l_rc.lastIndexOf(" "); l_rc = l_rc.substring(0, p_rc); document.write(l_rc + '&hellip;&#8221;</i>'); document.write('<br/><br/>'); } } }

function rp(json) { document.write('<ul>'); for (var i = 0; i < numposts; i++) { document.write('<li>'); var entry = json.feed.entry[i]; var posttitle = entry.title.$t; var posturl; if (i == json.feed.entry.length) break; for (var k = 0; k < entry.link.length; k++) { if (entry.link[k].rel == 'alternate') { posturl = entry.link[k].href; break } } posttitle = posttitle.link(posturl); var readmorelink = "(more)"; readmorelink = readmorelink.link(posturl); var postdate = entry.published.$t; var cdyear = postdate.substring(0, 4); var cdmonth = postdate.substring(5, 7); var cdday = postdate.substring(8, 10); var monthnames = new Array(); monthnames[1] = "Jan"; monthnames[2] = "Feb"; monthnames[3] = "Mar"; monthnames[4] = "Apr"; monthnames[5] = "May"; monthnames[6] = "Jun"; monthnames[7] = "Jul"; monthnames[8] = "Aug"; monthnames[9] = "Sep"; monthnames[10] = "Oct"; monthnames[11] = "Nov"; monthnames[12] = "Dec"; if ("content" in entry) { var postcontent = entry.content.$t } else if ("summary" in entry) { var postcontent = entry.summary.$t } else var postcontent = ""; var re = /<\S[^>]*>/g; postcontent = postcontent.replace(re, ""); document.write(posttitle); if (showpostdate == true) document.write(' - ' + monthnames[parseInt(cdmonth, 10)] + ' ' + cdday); if (showpostsummary == true) { if (postcontent.length < numchars) { document.write(postcontent) } else { postcontent = postcontent.substring(0, numchars); var quoteEnd = postcontent.lastIndexOf(" "); postcontent = postcontent.substring(0, quoteEnd); document.write(postcontent + '...' + readmorelink) } } document.write('</li>') } document.write('</ul>') }



summary_noimg = 350;
summary_img = 275;
img_thumb_height = 150;
img_thumb_width = 200;

function removeHtmlTag(strx, chop) {
    if (strx.indexOf("<") != -1) {
        var s = strx.split("<");
        for (var i = 0; i < s.length; i++) {
            if (s[i].indexOf(">") != -1) {
                s[i] = s[i].substring(s[i].indexOf(">") + 1, s[i].length);
            }
        }
        strx = s.join("");
    }
    chop = (chop < strx.length - 1) ? chop : strx.length - 2;
    while (strx.charAt(chop - 1) != ' ' && strx.indexOf(' ', chop) != -1) chop++;
    strx = strx.substring(0, chop - 1);
    return strx + '...';
}

function createSummaryAndThumb(pID) {
    var div = document.getElementById(pID);
    var imgtag = "";
    var img = div.getElementsByTagName("img");
    var summ = summary_noimg;
    if (img.length >= 1) {
        imgtag = '<img alt="' + img[0].alt + '" src="' + img[0].src + '" class="pbtthumbimg"/>';
        summ = summary_img;
    }

    var summary = imgtag + '<div>' + removeHtmlTag(div.innerHTML, summ) + '</div>';
    div.innerHTML = summary;
}

