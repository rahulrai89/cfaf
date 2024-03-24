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



    /*
     * jQuery FlexSlider v2.6.0
     * Copyright 2012 WooThemes
     * Contributing Author: Tyler Smith
     */!function ($) { var e = !0; $.flexslider = function (t, a) { var n = $(t); n.vars = $.extend({}, $.flexslider.defaults, a); var i = n.vars.namespace, s = window.navigator && window.navigator.msPointerEnabled && window.MSGesture, r = ("ontouchstart" in window || s || window.DocumentTouch && document instanceof DocumentTouch) && n.vars.touch, o = "click touchend MSPointerUp keyup", l = "", c, d = "vertical" === n.vars.direction, u = n.vars.reverse, v = n.vars.itemWidth > 0, p = "fade" === n.vars.animation, m = "" !== n.vars.asNavFor, f = {}; $.data(t, "flexslider", n), f = { init: function () { n.animating = !1, n.currentSlide = parseInt(n.vars.startAt ? n.vars.startAt : 0, 10), isNaN(n.currentSlide) && (n.currentSlide = 0), n.animatingTo = n.currentSlide, n.atEnd = 0 === n.currentSlide || n.currentSlide === n.last, n.containerSelector = n.vars.selector.substr(0, n.vars.selector.search(" ")), n.slides = $(n.vars.selector, n), n.container = $(n.containerSelector, n), n.count = n.slides.length, n.syncExists = $(n.vars.sync).length > 0, "slide" === n.vars.animation && (n.vars.animation = "swing"), n.prop = d ? "top" : "marginLeft", n.args = {}, n.manualPause = !1, n.stopped = !1, n.started = !1, n.startTimeout = null, n.transitions = !n.vars.video && !p && n.vars.useCSS && function () { var e = document.createElement("div"), t = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"]; for (var a in t) if (void 0 !== e.style[t[a]]) return n.pfx = t[a].replace("Perspective", "").toLowerCase(), n.prop = "-" + n.pfx + "-transform", !0; return !1 }(), n.ensureAnimationEnd = "", "" !== n.vars.controlsContainer && (n.controlsContainer = $(n.vars.controlsContainer).length > 0 && $(n.vars.controlsContainer)), "" !== n.vars.manualControls && (n.manualControls = $(n.vars.manualControls).length > 0 && $(n.vars.manualControls)), "" !== n.vars.customDirectionNav && (n.customDirectionNav = 2 === $(n.vars.customDirectionNav).length && $(n.vars.customDirectionNav)), n.vars.randomize && (n.slides.sort(function () { return Math.round(Math.random()) - .5 }), n.container.empty().append(n.slides)), n.doMath(), n.setup("init"), n.vars.controlNav && f.controlNav.setup(), n.vars.directionNav && f.directionNav.setup(), n.vars.keyboard && (1 === $(n.containerSelector).length || n.vars.multipleKeyboard) && $(document).bind("keyup", function (e) { var t = e.keyCode; if (!n.animating && (39 === t || 37 === t)) { var a = 39 === t ? n.getTarget("next") : 37 === t ? n.getTarget("prev") : !1; n.flexAnimate(a, n.vars.pauseOnAction) } }), n.vars.mousewheel && n.bind("mousewheel", function (e, t, a, i) { e.preventDefault(); var s = 0 > t ? n.getTarget("next") : n.getTarget("prev"); n.flexAnimate(s, n.vars.pauseOnAction) }), n.vars.pausePlay && f.pausePlay.setup(), n.vars.slideshow && n.vars.pauseInvisible && f.pauseInvisible.init(), n.vars.slideshow && (n.vars.pauseOnHover && n.hover(function () { n.manualPlay || n.manualPause || n.pause() }, function () { n.manualPause || n.manualPlay || n.stopped || n.play() }), n.vars.pauseInvisible && f.pauseInvisible.isHidden() || (n.vars.initDelay > 0 ? n.startTimeout = setTimeout(n.play, n.vars.initDelay) : n.play())), m && f.asNav.setup(), r && n.vars.touch && f.touch(), (!p || p && n.vars.smoothHeight) && $(window).bind("resize orientationchange focus", f.resize), n.find("img").attr("draggable", "false"), setTimeout(function () { n.vars.start(n) }, 200) }, asNav: { setup: function () { n.asNav = !0, n.animatingTo = Math.floor(n.currentSlide / n.move), n.currentItem = n.currentSlide, n.slides.removeClass(i + "active-slide").eq(n.currentItem).addClass(i + "active-slide"), s ? (t._slider = n, n.slides.each(function () { var e = this; e._gesture = new MSGesture, e._gesture.target = e, e.addEventListener("MSPointerDown", function (e) { e.preventDefault(), e.currentTarget._gesture && e.currentTarget._gesture.addPointer(e.pointerId) }, !1), e.addEventListener("MSGestureTap", function (e) { e.preventDefault(); var t = $(this), a = t.index(); $(n.vars.asNavFor).data("flexslider").animating || t.hasClass("active") || (n.direction = n.currentItem < a ? "next" : "prev", n.flexAnimate(a, n.vars.pauseOnAction, !1, !0, !0)) }) })) : n.slides.on(o, function (e) { e.preventDefault(); var t = $(this), a = t.index(), s = t.offset().left - $(n).scrollLeft(); 0 >= s && t.hasClass(i + "active-slide") ? n.flexAnimate(n.getTarget("prev"), !0) : $(n.vars.asNavFor).data("flexslider").animating || t.hasClass(i + "active-slide") || (n.direction = n.currentItem < a ? "next" : "prev", n.flexAnimate(a, n.vars.pauseOnAction, !1, !0, !0)) }) } }, controlNav: { setup: function () { n.manualControls ? f.controlNav.setupManual() : f.controlNav.setupPaging() }, setupPaging: function () { var e = "thumbnails" === n.vars.controlNav ? "control-thumbs" : "control-paging", t = 1, a, s; if (n.controlNavScaffold = $('<ol class="' + i + " control-nav " + i + e + '"></ol>'), n.pagingCount > 1) for (var r = 0; r < n.pagingCount; r++) { if (s = n.slides.eq(r), void 0 === s.attr("data-thumb-alt") && s.attr("data-thumb-alt", ""), altText = "" !== s.attr("data-thumb-alt") ? altText = ' alt = "' + s.attr("data - thumb - alt") + '"' : "", a = "thumbnails" === n.vars.controlNav ? ' < img src = "' + s.attr("data - thumb") + '"' + altText + "/>" : ' < a href = "#" > ' + t + "</a>", "thumbnails" === n.vars.controlNav && !0 === n.vars.thumbCaptions) { var c = s.attr("data-thumbcaption"); "" !== c && void 0 !== c && (a += ' < span class="' + i + 'caption" > ' + c + "</span>") } n.controlNavScaffold.append("<li>" + a + "</li>"), t++ } n.controlsContainer ? $(n.controlsContainer).append(n.controlNavScaffold) : n.append(n.controlNavScaffold), f.controlNav.set(), f.controlNav.active(), n.controlNavScaffold.delegate("a, img", o, function (e) { if (e.preventDefault(), "" === l || l === e.type) { var t = $(this), a = n.controlNav.index(t); t.hasClass(i + "active") || (n.direction = a > n.currentSlide ? "next" : "prev", n.flexAnimate(a, n.vars.pauseOnAction)) } "" === l && (l = e.type), f.setToClearWatchedEvent() }) }, setupManual: function () { n.controlNav = n.manualControls, f.controlNav.active(), n.controlNav.bind(o, function (e) { if (e.preventDefault(), "" === l || l === e.type) { var t = $(this), a = n.controlNav.index(t); t.hasClass(i + "active") || (a > n.currentSlide ? n.direction = "next" : n.direction = "prev", n.flexAnimate(a, n.vars.pauseOnAction)) } "" === l && (l = e.type), f.setToClearWatchedEvent() }) }, set: function () { var e = "thumbnails" === n.vars.controlNav ? "img" : "a"; n.controlNav = $("." + i + "control-nav li " + e, n.controlsContainer ? n.controlsContainer : n) }, active: function () { n.controlNav.removeClass(i + "active").eq(n.animatingTo).addClass(i + "active") }, update: function (e, t) { n.pagingCount > 1 && "add" === e ? n.controlNavScaffold.append($(' < li > <a href="#">' + n.count + "</a></li > ")) : 1 === n.pagingCount ? n.controlNavScaffold.find("li").remove() : n.controlNav.eq(t).closest("li").remove(), f.controlNav.set(), n.pagingCount > 1 && n.pagingCount !== n.controlNav.length ? n.update(t, e) : f.controlNav.active() } }, directionNav: { setup: function () { var e = $('<ul class="' + i + 'direction - nav"><li class="' + i + 'nav - prev"><a class="' + i + 'prev" href="#">' + n.vars.prevText + '</a></li><li class="' + i + 'nav - next"><a class="' + i + 'next" href="#">' + n.vars.nextText + "</a ></li ></ul > "); n.customDirectionNav ? n.directionNav = n.customDirectionNav : n.controlsContainer ? ($(n.controlsContainer).append(e), n.directionNav = $("." + i + "direction - nav li a", n.controlsContainer)) : (n.append(e), n.directionNav = $("." + i + "direction - nav li a", n)), f.directionNav.update(), n.directionNav.bind(o, function (e) { e.preventDefault(); var t; ("" === l || l === e.type) && (t = $(this).hasClass(i + "next") ? n.getTarget("next") : n.getTarget("prev"), n.flexAnimate(t, n.vars.pauseOnAction)), "" === l && (l = e.type), f.setToClearWatchedEvent() }) }, update: function () { var e = i + "disabled"; 1 === n.pagingCount ? n.directionNav.addClass(e).attr("tabindex", " - 1") : n.vars.animationLoop ? n.directionNav.removeClass(e).removeAttr("tabindex") : 0 === n.animatingTo ? n.directionNav.removeClass(e).filter("." + i + "prev").addClass(e).attr("tabindex", " - 1") : n.animatingTo === n.last ? n.directionNav.removeClass(e).filter("." + i + "next").addClass(e).attr("tabindex", " - 1") : n.directionNav.removeClass(e).removeAttr("tabindex") } }, pausePlay: { setup: function () { var e = $('<div class="' + i + 'pauseplay"><a href="#"></a></div>'); n.controlsContainer ? (n.controlsContainer.append(e), n.pausePlay = $("." + i + "pauseplay a", n.controlsContainer)) : (n.append(e), n.pausePlay = $("." + i + "pauseplay a", n)), f.pausePlay.update(n.vars.slideshow ? i + "pause" : i + "play"), n.pausePlay.bind(o, function (e) { e.preventDefault(), ("" === l || l === e.type) && ($(this).hasClass(i + "pause") ? (n.manualPause = !0, n.manualPlay = !1, n.pause()) : (n.manualPause = !1, n.manualPlay = !0, n.play())), "" === l && (l = e.type), f.setToClearWatchedEvent() }) }, update: function (e) { "play" === e ? n.pausePlay.removeClass(i + "pause").addClass(i + "play").html(n.vars.playText) : n.pausePlay.removeClass(i + "play").addClass(i + "pause").html(n.vars.pauseText) } }, touch: function () { function e(e) { e.stopPropagation(), n.animating ? e.preventDefault() : (n.pause(), t._gesture.addPointer(e.pointerId), T = 0, c = d ? n.h : n.w, f = Number(new Date), l = v && u && n.animatingTo === n.last ? 0 : v && u ? n.limit - (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo : v && n.currentSlide === n.last ? n.limit : v ? (n.itemW + n.vars.itemMargin) * n.move * n.currentSlide : u ? (n.last - n.currentSlide + n.cloneOffset) * c : (n.currentSlide + n.cloneOffset) * c) } function a(e) { e.stopPropagation(); var a = e.target._slider; if (a) { var n = -e.translationX, i = -e.translationY; return T += d ? i : n, m = T, x = d ? Math.abs(T) < Math.abs(-n) : Math.abs(T) < Math.abs(-i), e.detail === e.MSGESTURE_FLAG_INERTIA ? void setImmediate(function () { t._gesture.stop() }) : void ((!x || Number(new Date) - f > 500) && (e.preventDefault(), !p && a.transitions && (a.vars.animationLoop || (m = T / (0 === a.currentSlide && 0 > T || a.currentSlide === a.last && T > 0 ? Math.abs(T) / c + 2 : 1)), a.setProps(l + m, "setTouch")))) } } function i(e) { e.stopPropagation(); var t = e.target._slider; if (t) { if (t.animatingTo === t.currentSlide && !x && null !== m) { var a = u ? -m : m, n = a > 0 ? t.getTarget("next") : t.getTarget("prev"); t.canAdvance(n) && (Number(new Date) - f < 550 && Math.abs(a) > 50 || Math.abs(a) > c / 2) ? t.flexAnimate(n, t.vars.pauseOnAction) : p || t.flexAnimate(t.currentSlide, t.vars.pauseOnAction, !0) } r = null, o = null, m = null, l = null, T = 0 } } var r, o, l, c, m, f, g, h, S, x = !1, y = 0, b = 0, T = 0; s ? (t.style.msTouchAction = "none", t._gesture = new MSGesture, t._gesture.target = t, t.addEventListener("MSPointerDown", e, !1), t._slider = n, t.addEventListener("MSGestureChange", a, !1), t.addEventListener("MSGestureEnd", i, !1)) : (g = function (e) { n.animating ? e.preventDefault() : (window.navigator.msPointerEnabled || 1 === e.touches.length) && (n.pause(), c = d ? n.h : n.w, f = Number(new Date), y = e.touches[0].pageX, b = e.touches[0].pageY, l = v && u && n.animatingTo === n.last ? 0 : v && u ? n.limit - (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo : v && n.currentSlide === n.last ? n.limit : v ? (n.itemW + n.vars.itemMargin) * n.move * n.currentSlide : u ? (n.last - n.currentSlide + n.cloneOffset) * c : (n.currentSlide + n.cloneOffset) * c, r = d ? b : y, o = d ? y : b, t.addEventListener("touchmove", h, !1), t.addEventListener("touchend", S, !1)) }, h = function (e) { y = e.touches[0].pageX, b = e.touches[0].pageY, m = d ? r - b : r - y, x = d ? Math.abs(m) < Math.abs(y - o) : Math.abs(m) < Math.abs(b - o); var t = 500; (!x || Number(new Date) - f > t) && (e.preventDefault(), !p && n.transitions && (n.vars.animationLoop || (m /= 0 === n.currentSlide && 0 > m || n.currentSlide === n.last && m > 0 ? Math.abs(m) / c + 2 : 1), n.setProps(l + m, "setTouch"))) }, S = function (e) { if (t.removeEventListener("touchmove", h, !1), n.animatingTo === n.currentSlide && !x && null !== m) { var a = u ? -m : m, i = a > 0 ? n.getTarget("next") : n.getTarget("prev"); n.canAdvance(i) && (Number(new Date) - f < 550 && Math.abs(a) > 50 || Math.abs(a) > c / 2) ? n.flexAnimate(i, n.vars.pauseOnAction) : p || n.flexAnimate(n.currentSlide, n.vars.pauseOnAction, !0) } t.removeEventListener("touchend", S, !1), r = null, o = null, m = null, l = null }, t.addEventListener("touchstart", g, !1)) }, resize: function () { !n.animating && n.is(":visible") && (v || n.doMath(), p ? f.smoothHeight() : v ? (n.slides.width(n.computedW), n.update(n.pagingCount), n.setProps()) : d ? (n.viewport.height(n.h), n.setProps(n.h, "setTotal")) : (n.vars.smoothHeight && f.smoothHeight(), n.newSlides.width(n.computedW), n.setProps(n.computedW, "setTotal"))) }, smoothHeight: function (e) { if (!d || p) { var t = p ? n : n.viewport; e ? t.animate({ height: n.slides.eq(n.animatingTo).height() }, e) : t.height(n.slides.eq(n.animatingTo).height()) } }, sync: function (e) { var t = $(n.vars.sync).data("flexslider"), a = n.animatingTo; switch (e) { case "animate": t.flexAnimate(a, n.vars.pauseOnAction, !1, !0); break; case "play": t.playing || t.asNav || t.play(); break; case "pause": t.pause() } }, uniqueID: function (e) { return e.filter("[id]").add(e.find("[id]")).each(function () { var e = $(this); e.attr("id", e.attr("id") + "_clone") }), e }, pauseInvisible: { visProp: null, init: function () { var e = f.pauseInvisible.getHiddenProp(); if (e) { var t = e.replace(/[H|h]idden/, "") + "visibilitychange"; document.addEventListener(t, function () { f.pauseInvisible.isHidden() ? n.startTimeout ? clearTimeout(n.startTimeout) : n.pause() : n.started ? n.play() : n.vars.initDelay > 0 ? setTimeout(n.play, n.vars.initDelay) : n.play() }) } }, isHidden: function () { var e = f.pauseInvisible.getHiddenProp(); return e ? document[e] : !1 }, getHiddenProp: function () { var e = ["webkit", "moz", "ms", "o"]; if ("hidden" in document) return "hidden"; for (var t = 0; t < e.length; t++)if (e[t] + "Hidden" in document) return e[t] + "Hidden"; return null } }, setToClearWatchedEvent: function () { clearTimeout(c), c = setTimeout(function () { l = "" }, 3e3) } }, n.flexAnimate = function (e, t, a, s, o) { if (n.vars.animationLoop || e === n.currentSlide || (n.direction = e > n.currentSlide ? "next" : "prev"), m && 1 === n.pagingCount && (n.direction = n.currentItem < e ? "next" : "prev"), !n.animating && (n.canAdvance(e, o) || a) && n.is(":visible")) { if (m && s) { var l = $(n.vars.asNavFor).data("flexslider"); if (n.atEnd = 0 === e || e === n.count - 1, l.flexAnimate(e, !0, !1, !0, o), n.direction = n.currentItem < e ? "next" : "prev", l.direction = n.direction, Math.ceil((e + 1) / n.visible) - 1 === n.currentSlide || 0 === e) return n.currentItem = e, n.slides.removeClass(i + "active - slide").eq(e).addClass(i + "active - slide"), !1; n.currentItem = e, n.slides.removeClass(i + "active - slide").eq(e).addClass(i + "active - slide"), e = Math.floor(e / n.visible) } if (n.animating = !0, n.animatingTo = e, t && n.pause(), n.vars.before(n), n.syncExists && !o && f.sync("animate"), n.vars.controlNav && f.controlNav.active(), v || n.slides.removeClass(i + "active - slide").eq(e).addClass(i + "active - slide"), n.atEnd = 0 === e || e === n.last, n.vars.directionNav && f.directionNav.update(), e === n.last && (n.vars.end(n), n.vars.animationLoop || n.pause()), p) r ? (n.slides.eq(n.currentSlide).css({ opacity: 0, zIndex: 1 }), n.slides.eq(e).css({ opacity: 1, zIndex: 2 }), n.wrapup(c)) : (n.slides.eq(n.currentSlide).css({ zIndex: 1 }).animate({ opacity: 0 }, n.vars.animationSpeed, n.vars.easing), n.slides.eq(e).css({ zIndex: 2 }).animate({ opacity: 1 }, n.vars.animationSpeed, n.vars.easing, n.wrapup)); else { var c = d ? n.slides.filter(":first").height() : n.computedW, g, h, S; v ? (g = n.vars.itemMargin, S = (n.itemW + g) * n.move * n.animatingTo, h = S > n.limit && 1 !== n.visible ? n.limit : S) : h = 0 === n.currentSlide && e === n.count - 1 && n.vars.animationLoop && "next" !== n.direction ? u ? (n.count + n.cloneOffset) * c : 0 : n.currentSlide === n.last && 0 === e && n.vars.animationLoop && "prev" !== n.direction ? u ? 0 : (n.count + 1) * c : u ? (n.count - 1 - e + n.cloneOffset) * c : (e + n.cloneOffset) * c, n.setProps(h, "", n.vars.animationSpeed), n.transitions ? (n.vars.animationLoop && n.atEnd || (n.animating = !1, n.currentSlide = n.animatingTo), n.container.unbind("webkitTransitionEnd transitionend"), n.container.bind("webkitTransitionEnd transitionend", function () { clearTimeout(n.ensureAnimationEnd), n.wrapup(c) }), clearTimeout(n.ensureAnimationEnd), n.ensureAnimationEnd = setTimeout(function () { n.wrapup(c) }, n.vars.animationSpeed + 100)) : n.container.animate(n.args, n.vars.animationSpeed, n.vars.easing, function () { n.wrapup(c) }) } n.vars.smoothHeight && f.smoothHeight(n.vars.animationSpeed) } }, n.wrapup = function (e) { p || v || (0 === n.currentSlide && n.animatingTo === n.last && n.vars.animationLoop ? n.setProps(e, "jumpEnd") : n.currentSlide === n.last && 0 === n.animatingTo && n.vars.animationLoop && n.setProps(e, "jumpStart")), n.animating = !1, n.currentSlide = n.animatingTo, n.vars.after(n) }, n.animateSlides = function () { !n.animating && e && n.flexAnimate(n.getTarget("next")) }, n.pause = function () { clearInterval(n.animatedSlides), n.animatedSlides = null, n.playing = !1, n.vars.pausePlay && f.pausePlay.update("play"), n.syncExists && f.sync("pause") }, n.play = function () { n.playing && clearInterval(n.animatedSlides), n.animatedSlides = n.animatedSlides || setInterval(n.animateSlides, n.vars.slideshowSpeed), n.started = n.playing = !0, n.vars.pausePlay && f.pausePlay.update("pause"), n.syncExists && f.sync("play") }, n.stop = function () { n.pause(), n.stopped = !0 }, n.canAdvance = function (e, t) { var a = m ? n.pagingCount - 1 : n.last; return t ? !0 : m && n.currentItem === n.count - 1 && 0 === e && "prev" === n.direction ? !0 : m && 0 === n.currentItem && e === n.pagingCount - 1 && "next" !== n.direction ? !1 : e !== n.currentSlide || m ? n.vars.animationLoop ? !0 : n.atEnd && 0 === n.currentSlide && e === a && "next" !== n.direction ? !1 : n.atEnd && n.currentSlide === a && 0 === e && "next" === n.direction ? !1 : !0 : !1 }, n.getTarget = function (e) { return n.direction = e, "next" === e ? n.currentSlide === n.last ? 0 : n.currentSlide + 1 : 0 === n.currentSlide ? n.last : n.currentSlide - 1 }, n.setProps = function (e, t, a) { var i = function () { var a = e ? e : (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo, i = function () { if (v) return "setTouch" === t ? e : u && n.animatingTo === n.last ? 0 : u ? n.limit - (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo : n.animatingTo === n.last ? n.limit : a; switch (t) { case "setTotal": return u ? (n.count - 1 - n.currentSlide + n.cloneOffset) * e : (n.currentSlide + n.cloneOffset) * e; case "setTouch": return u ? e : e; case "jumpEnd": return u ? e : n.count * e; case "jumpStart": return u ? n.count * e : e; default: return e } }(); return -1 * i + "px" }(); n.transitions && (i = d ? "translate3d(0, " + i + ", 0)" : "translate3d(" + i + ", 0, 0)", a = void 0 !== a ? a / 1e3 + "s" : "0s", n.container.css(" - " + n.pfx + " - transition - duration", a), n.container.css("transition - duration", a)), n.args[n.prop] = i, (n.transitions || void 0 === a) && n.container.css(n.args), n.container.css("transform", i) }, n.setup = function (e) { if (p) n.slides.css({ width: "100 % ", "float": "left", marginRight: " - 100 % ", position: "relative" }), "init" === e && (r ? n.slides.css({ opacity: 0, display: "block", webkitTransition: "opacity " + n.vars.animationSpeed / 1e3 + "s ease", zIndex: 1 }).eq(n.currentSlide).css({ opacity: 1, zIndex: 2 }) : 0 == n.vars.fadeFirstSlide ? n.slides.css({ opacity: 0, display: "block", zIndex: 1 }).eq(n.currentSlide).css({ zIndex: 2 }).css({ opacity: 1 }) : n.slides.css({ opacity: 0, display: "block", zIndex: 1 }).eq(n.currentSlide).css({ zIndex: 2 }).animate({ opacity: 1 }, n.vars.animationSpeed, n.vars.easing)), n.vars.smoothHeight && f.smoothHeight(); else { var t, a; "init" === e && (n.viewport = $('<div class="' + i + 'viewport"></div>').css({ overflow: "hidden", position: "relative" }).appendTo(n).append(n.container), n.cloneCount = 0, n.cloneOffset = 0, u && (a = $.makeArray(n.slides).reverse(), n.slides = $(a), n.container.empty().append(n.slides))), n.vars.animationLoop && !v && (n.cloneCount = 2, n.cloneOffset = 1, "init" !== e && n.container.find(".clone").remove(), n.container.append(f.uniqueID(n.slides.first().clone().addClass("clone")).attr("aria - hidden", "true")).prepend(f.uniqueID(n.slides.last().clone().addClass("clone")).attr("aria - hidden", "true"))), n.newSlides = $(n.vars.selector, n), t = u ? n.count - 1 - n.currentSlide + n.cloneOffset : n.currentSlide + n.cloneOffset, d && !v ? (n.container.height(200 * (n.count + n.cloneCount) + " % ").css("position", "absolute").width("100 % "), setTimeout(function () { n.newSlides.css({ display: "block" }), n.doMath(), n.viewport.height(n.h), n.setProps(t * n.h, "init") }, "init" === e ? 100 : 0)) : (n.container.width(200 * (n.count + n.cloneCount) + " % "), n.setProps(t * n.computedW, "init"), setTimeout(function () { n.doMath(), n.newSlides.css({ width: n.computedW, marginRight: n.computedM, "float": "left", display: "block" }), n.vars.smoothHeight && f.smoothHeight() }, "init" === e ? 100 : 0)) } v || n.slides.removeClass(i + "active - slide").eq(n.currentSlide).addClass(i + "active - slide"), n.vars.init(n) }, n.doMath = function () { var e = n.slides.first(), t = n.vars.itemMargin, a = n.vars.minItems, i = n.vars.maxItems; n.w = void 0 === n.viewport ? n.width() : n.viewport.width(), n.h = e.height(), n.boxPadding = e.outerWidth() - e.width(), v ? (n.itemT = n.vars.itemWidth + t, n.itemM = t, n.minW = a ? a * n.itemT : n.w, n.maxW = i ? i * n.itemT - t : n.w, n.itemW = n.minW > n.w ? (n.w - t * (a - 1)) / a : n.maxW < n.w ? (n.w - t * (i - 1)) / i : n.vars.itemWidth > n.w ? n.w : n.vars.itemWidth, n.visible = Math.floor(n.w / n.itemW), n.move = n.vars.move > 0 && n.vars.move < n.visible ? n.vars.move : n.visible, n.pagingCount = Math.ceil((n.count - n.visible) / n.move + 1), n.last = n.pagingCount - 1, n.limit = 1 === n.pagingCount ? 0 : n.vars.itemWidth > n.w ? n.itemW * (n.count - 1) + t * (n.count - 1) : (n.itemW + t) * n.count - n.w - t) : (n.itemW = n.w, n.itemM = t, n.pagingCount = n.count, n.last = n.count - 1), n.computedW = n.itemW - n.boxPadding, n.computedM = n.itemM }, n.update = function (e, t) { n.doMath(), v || (e < n.currentSlide ? n.currentSlide += 1 : e <= n.currentSlide && 0 !== e && (n.currentSlide -= 1), n.animatingTo = n.currentSlide), n.vars.controlNav && !n.manualControls && ("add" === t && !v || n.pagingCount > n.controlNav.length ? f.controlNav.update("add") : ("remove" === t && !v || n.pagingCount < n.controlNav.length) && (v && n.currentSlide > n.last && (n.currentSlide -= 1, n.animatingTo -= 1), f.controlNav.update("remove", n.last))), n.vars.directionNav && f.directionNav.update() }, n.addSlide = function (e, t) { var a = $(e); n.count += 1, n.last = n.count - 1, d && u ? void 0 !== t ? n.slides.eq(n.count - t).after(a) : n.container.prepend(a) : void 0 !== t ? n.slides.eq(t).before(a) : n.container.append(a), n.update(t, "add"), n.slides = $(n.vars.selector + ": not(.clone)", n), n.setup(), n.vars.added(n) }, n.removeSlide = function (e) { var t = isNaN(e) ? n.slides.index($(e)) : e; n.count -= 1, n.last = n.count - 1, isNaN(e) ? $(e, n.slides).remove() : d && u ? n.slides.eq(n.last).remove() : n.slides.eq(e).remove(), n.doMath(), n.update(t, "remove"), n.slides = $(n.vars.selector + ": not(.clone)", n), n.setup(), n.vars.removed(n) }, f.init() }, $(window).blur(function (t) { e = !1 }).focus(function (t) { e = !0 }), $.flexslider.defaults = { namespace: "flex - ", selector: ".slides > li", animation: "fade", easing: "swing", direction: "horizontal", reverse: !1, animationLoop: !0, smoothHeight: !1, startAt: 0, slideshow: !0, slideshowSpeed: 7e3, animationSpeed: 600, initDelay: 0, randomize: !1, fadeFirstSlide: !0, thumbCaptions: !1, pauseOnAction: !0, pauseOnHover: !1, pauseInvisible: !0, useCSS: !0, touch: !0, video: !1, controlNav: !0, directionNav: !0, prevText: "Previous", nextText: "Next", keyboard: !0, multipleKeyboard: !1, mousewheel: !1, pausePlay: !1, pauseText: "Pause", playText: "Play", controlsContainer: "", manualControls: "", customDirectionNav: "", sync: "", asNavFor: "", itemWidth: 0, itemMargin: 0, minItems: 1, maxItems: 0, move: 0, allowOneSlide: !0, start: function () { }, before: function () { }, after: function () { }, end: function () { }, added: function () { }, removed: function () { }, init: function () { } }, $.fn.flexslider = function (e) { if (void 0 === e && (e = {}), "object" == typeof e) return this.each(function () { var t = $(this), a = e.selector ? e.selector : ".slides > li", n = t.find(a); 1 === n.length && e.allowOneSlide === !0 || 0 === n.length ? (n.fadeIn(400), e.start && e.start(t)) : void 0 === t.data("flexslider") && new $.flexslider(this, e) }); var t = $(this).data("flexslider"); switch (e) { case "play": t.play(); break; case "pause": t.pause(); break; case "stop": t.stop(); break; case "next": t.flexAnimate(t.getTarget("next"), !0); break; case "prev": case "previous": t.flexAnimate(t.getTarget("prev"), !0); break; default: "number" == typeof e && t.flexAnimate(e, !0) } } }(jQuery);



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
        imgtag = '<img src="' + img[0].src + '" class="pbtthumbimg"/>';
        summ = summary_img;
    }

    var summary = imgtag + '<div>' + removeHtmlTag(div.innerHTML, summ) + '</div>';
    div.innerHTML = summary;
}

