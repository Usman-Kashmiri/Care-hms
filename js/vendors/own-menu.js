/*!
Waypoints - 3.1.1
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
!(function() {
    "use strict";

    function t(o) {
        if (!o) throw new Error("No options passed to Waypoint constructor");
        if (!o.element)
            throw new Error("No element option passed to Waypoint constructor");
        if (!o.handler)
            throw new Error("No handler option passed to Waypoint constructor");
        (this.key = "waypoint-" + e),
        (this.options = t.Adapter.extend({}, t.defaults, o)),
        (this.element = this.options.element),
        (this.adapter = new t.Adapter(this.element)),
        (this.callback = o.handler),
        (this.axis = this.options.horizontal ? "horizontal" : "vertical"),
        (this.enabled = this.options.enabled),
        (this.triggerPoint = null),
        (this.group = t.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis,
        })),
        (this.context = t.Context.findOrCreateByElement(this.options.context)),
        t.offsetAliases[this.options.offset] &&
            (this.options.offset = t.offsetAliases[this.options.offset]),
            this.group.add(this),
            this.context.add(this),
            (i[this.key] = this),
            (e += 1);
    }
    var e = 0,
        i = {};
    (t.prototype.queueTrigger = function(t) {
        this.group.queueTrigger(this, t);
    }),
    (t.prototype.trigger = function(t) {
        this.enabled && this.callback && this.callback.apply(this, t);
    }),
    (t.prototype.destroy = function() {
        this.context.remove(this), this.group.remove(this), delete i[this.key];
    }),
    (t.prototype.disable = function() {
        return (this.enabled = !1), this;
    }),
    (t.prototype.enable = function() {
        return this.context.refresh(), (this.enabled = !0), this;
    }),
    (t.prototype.next = function() {
        return this.group.next(this);
    }),
    (t.prototype.previous = function() {
        return this.group.previous(this);
    }),
    (t.invokeAll = function(t) {
        var e = [];
        for (var o in i) e.push(i[o]);
        for (var n = 0, r = e.length; r > n; n++) e[n][t]();
    }),
    (t.destroyAll = function() {
        t.invokeAll("destroy");
    }),
    (t.disableAll = function() {
        t.invokeAll("disable");
    }),
    (t.enableAll = function() {
        t.invokeAll("enable");
    }),
    (t.refreshAll = function() {
        t.Context.refreshAll();
    }),
    (t.viewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight;
    }),
    (t.viewportWidth = function() {
        return document.documentElement.clientWidth;
    }),
    (t.adapters = []),
    (t.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0,
    }),
    (t.offsetAliases = {
        "bottom-in-view": function() {
            return this.context.innerHeight() - this.adapter.outerHeight();
        },
        "right-in-view": function() {
            return this.context.innerWidth() - this.adapter.outerWidth();
        },
    }),
    (window.Waypoint = t);
})(),
(function() {
    "use strict";

    function t(t) {
        window.setTimeout(t, 1e3 / 60);
    }

    function e(t) {
        (this.element = t),
        (this.Adapter = n.Adapter),
        (this.adapter = new this.Adapter(t)),
        (this.key = "waypoint-context-" + i),
        (this.didScroll = !1),
        (this.didResize = !1),
        (this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop(),
        }),
        (this.waypoints = { vertical: {}, horizontal: {} }),
        (t.waypointContextKey = this.key),
        (o[t.waypointContextKey] = this),
        (i += 1),
        this.createThrottledScrollHandler(),
            this.createThrottledResizeHandler();
    }
    var i = 0,
        o = {},
        n = window.Waypoint,
        r = window.onload;
    (e.prototype.add = function(t) {
        var e = t.options.horizontal ? "horizontal" : "vertical";
        (this.waypoints[e][t.key] = t), this.refresh();
    }),
    (e.prototype.checkEmpty = function() {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
            e = this.Adapter.isEmptyObject(this.waypoints.vertical);
        t && e && (this.adapter.off(".waypoints"), delete o[this.key]);
    }),
    (e.prototype.createThrottledResizeHandler = function() {
        function t() {
            e.handleResize(), (e.didResize = !1);
        }
        var e = this;
        this.adapter.on("resize.waypoints", function() {
            e.didResize || ((e.didResize = !0), n.requestAnimationFrame(t));
        });
    }),
    (e.prototype.createThrottledScrollHandler = function() {
        function t() {
            e.handleScroll(), (e.didScroll = !1);
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function() {
            (!e.didScroll || n.isTouch) &&
            ((e.didScroll = !0), n.requestAnimationFrame(t));
        });
    }),
    (e.prototype.handleResize = function() {
        n.Context.refreshAll();
    }),
    (e.prototype.handleScroll = function() {
        var t = {},
            e = {
                horizontal: {
                    newScroll: this.adapter.scrollLeft(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left",
                },
                vertical: {
                    newScroll: this.adapter.scrollTop(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up",
                },
            };
        for (var i in e) {
            var o = e[i],
                n = o.newScroll > o.oldScroll,
                r = n ? o.forward : o.backward;
            for (var s in this.waypoints[i]) {
                var a = this.waypoints[i][s],
                    l = o.oldScroll < a.triggerPoint,
                    h = o.newScroll >= a.triggerPoint,
                    p = l && h,
                    u = !l && !h;
                (p || u) && (a.queueTrigger(r), (t[a.group.id] = a.group));
            }
        }
        for (var c in t) t[c].flushTriggers();
        this.oldScroll = { x: e.horizontal.newScroll, y: e.vertical.newScroll };
    }),
    (e.prototype.innerHeight = function() {
        return this.element == this.element.window ?
            n.viewportHeight() :
            this.adapter.innerHeight();
    }),
    (e.prototype.remove = function(t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty();
    }),
    (e.prototype.innerWidth = function() {
        return this.element == this.element.window ?
            n.viewportWidth() :
            this.adapter.innerWidth();
    }),
    (e.prototype.destroy = function() {
        var t = [];
        for (var e in this.waypoints)
            for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
        for (var o = 0, n = t.length; n > o; o++) t[o].destroy();
    }),
    (e.prototype.refresh = function() {
        var t,
            e = this.element == this.element.window,
            i = this.adapter.offset(),
            o = {};
        this.handleScroll(),
            (t = {
                horizontal: {
                    contextOffset: e ? 0 : i.left,
                    contextScroll: e ? 0 : this.oldScroll.x,
                    contextDimension: this.innerWidth(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left",
                    offsetProp: "left",
                },
                vertical: {
                    contextOffset: e ? 0 : i.top,
                    contextScroll: e ? 0 : this.oldScroll.y,
                    contextDimension: this.innerHeight(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up",
                    offsetProp: "top",
                },
            });
        for (var n in t) {
            var r = t[n];
            for (var s in this.waypoints[n]) {
                var a,
                    l,
                    h,
                    p,
                    u,
                    c = this.waypoints[n][s],
                    d = c.options.offset,
                    f = c.triggerPoint,
                    w = 0,
                    y = null == f;
                c.element !== c.element.window &&
                    (w = c.adapter.offset()[r.offsetProp]),
                    "function" == typeof d ?
                    (d = d.apply(c)) :
                    "string" == typeof d &&
                    ((d = parseFloat(d)),
                        c.options.offset.indexOf("%") > -1 &&
                        (d = Math.ceil((r.contextDimension * d) / 100))),
                    (a = r.contextScroll - r.contextOffset),
                    (c.triggerPoint = w + a - d),
                    (l = f < r.oldScroll),
                    (h = c.triggerPoint >= r.oldScroll),
                    (p = l && h),
                    (u = !l && !h), !y && p ?
                    (c.queueTrigger(r.backward), (o[c.group.id] = c.group)) :
                    !y && u ?
                    (c.queueTrigger(r.forward), (o[c.group.id] = c.group)) :
                    y &&
                    r.oldScroll >= c.triggerPoint &&
                    (c.queueTrigger(r.forward), (o[c.group.id] = c.group));
            }
        }
        for (var g in o) o[g].flushTriggers();
        return this;
    }),
    (e.findOrCreateByElement = function(t) {
        return e.findByElement(t) || new e(t);
    }),
    (e.refreshAll = function() {
        for (var t in o) o[t].refresh();
    }),
    (e.findByElement = function(t) {
        return o[t.waypointContextKey];
    }),
    (window.onload = function() {
        r && r(), e.refreshAll();
    }),
    (n.requestAnimationFrame = function(e) {
        var i =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            t;
        i.call(window, e);
    }),
    (n.Context = e);
})(),
(function() {
    "use strict";

    function t(t, e) {
        return t.triggerPoint - e.triggerPoint;
    }

    function e(t, e) {
        return e.triggerPoint - t.triggerPoint;
    }

    function i(t) {
        (this.name = t.name),
        (this.axis = t.axis),
        (this.id = this.name + "-" + this.axis),
        (this.waypoints = []),
        this.clearTriggerQueues(),
            (o[this.axis][this.name] = this);
    }
    var o = { vertical: {}, horizontal: {} },
        n = window.Waypoint;
    (i.prototype.add = function(t) {
        this.waypoints.push(t);
    }),
    (i.prototype.clearTriggerQueues = function() {
        this.triggerQueues = { up: [], down: [], left: [], right: [] };
    }),
    (i.prototype.flushTriggers = function() {
        for (var i in this.triggerQueues) {
            var o = this.triggerQueues[i],
                n = "up" === i || "left" === i;
            o.sort(n ? e : t);
            for (var r = 0, s = o.length; s > r; r += 1) {
                var a = o[r];
                (a.options.continuous || r === o.length - 1) && a.trigger([i]);
            }
        }
        this.clearTriggerQueues();
    }),
    (i.prototype.next = function(e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints),
            o = i === this.waypoints.length - 1;
        return o ? null : this.waypoints[i + 1];
    }),
    (i.prototype.previous = function(e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints);
        return i ? this.waypoints[i - 1] : null;
    }),
    (i.prototype.queueTrigger = function(t, e) {
        this.triggerQueues[e].push(t);
    }),
    (i.prototype.remove = function(t) {
        var e = n.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1);
    }),
    (i.prototype.first = function() {
        return this.waypoints[0];
    }),
    (i.prototype.last = function() {
        return this.waypoints[this.waypoints.length - 1];
    }),
    (i.findOrCreate = function(t) {
        return o[t.axis][t.name] || new i(t);
    }),
    (n.Group = i);
})(),
(function() {
    "use strict";

    function t(t) {
        this.$element = e(t);
    }
    var e = window.jQuery,
        i = window.Waypoint;
    e.each(
            [
                "innerHeight",
                "innerWidth",
                "off",
                "offset",
                "on",
                "outerHeight",
                "outerWidth",
                "scrollLeft",
                "scrollTop",
            ],
            function(e, i) {
                t.prototype[i] = function() {
                    var t = Array.prototype.slice.call(arguments);
                    return this.$element[i].apply(this.$element, t);
                };
            }
        ),
        e.each(["extend", "inArray", "isEmptyObject"], function(i, o) {
            t[o] = e[o];
        }),
        i.adapters.push({ name: "jquery", Adapter: t }),
        (i.Adapter = t);
})(),
(function() {
    "use strict";

    function t(t) {
        return function() {
            var i = [],
                o = arguments[0];
            return (
                t.isFunction(arguments[0]) &&
                ((o = t.extend({}, arguments[1])), (o.handler = arguments[0])),
                this.each(function() {
                    var n = t.extend({}, o, { element: this });
                    "string" == typeof n.context &&
                        (n.context = t(this).closest(n.context)[0]),
                        i.push(new e(n));
                }),
                i
            );
        };
    }
    var e = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)),
        window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto));
})();

/*! Stellar.js v0.6.2 | Copyright 2014, Mark Dalgleish | http://markdalgleish.com/projects/stellar.js | http://markdalgleish.mit-license.org */
!(function(a, b, c, d) {
    function e(b, c) {
        (this.element = b),
        (this.options = a.extend({}, g, c)),
        (this._defaults = g),
        (this._name = f),
        this.init();
    }
    var f = "stellar",
        g = {
            scrollProperty: "scroll",
            positionProperty: "position",
            horizontalScrolling: !0,
            verticalScrolling: !0,
            horizontalOffset: 0,
            verticalOffset: 0,
            responsive: !1,
            parallaxBackgrounds: !0,
            parallaxElements: !0,
            hideDistantElements: !0,
            hideElement: function(a) {
                a.hide();
            },
            showElement: function(a) {
                a.show();
            },
        },
        h = {
            scroll: {
                getLeft: function(a) {
                    return a.scrollLeft();
                },
                setLeft: function(a, b) {
                    a.scrollLeft(b);
                },
                getTop: function(a) {
                    return a.scrollTop();
                },
                setTop: function(a, b) {
                    a.scrollTop(b);
                },
            },
            position: {
                getLeft: function(a) {
                    return -1 * parseInt(a.css("left"), 10);
                },
                getTop: function(a) {
                    return -1 * parseInt(a.css("top"), 10);
                },
            },
            margin: {
                getLeft: function(a) {
                    return -1 * parseInt(a.css("margin-left"), 10);
                },
                getTop: function(a) {
                    return -1 * parseInt(a.css("margin-top"), 10);
                },
            },
            transform: {
                getLeft: function(a) {
                    var b = getComputedStyle(a[0])[k];
                    return "none" !== b ?
                        -1 * parseInt(b.match(/(-?[0-9]+)/g)[4], 10) :
                        0;
                },
                getTop: function(a) {
                    var b = getComputedStyle(a[0])[k];
                    return "none" !== b ?
                        -1 * parseInt(b.match(/(-?[0-9]+)/g)[5], 10) :
                        0;
                },
            },
        },
        i = {
            position: {
                setLeft: function(a, b) {
                    a.css("left", b);
                },
                setTop: function(a, b) {
                    a.css("top", b);
                },
            },
            transform: {
                setPosition: function(a, b, c, d, e) {
                    a[0].style[k] =
                        "translate3d(" + (b - c) + "px, " + (d - e) + "px, 0)";
                },
            },
        },
        j = (function() {
            var b,
                c = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
                d = a("script")[0].style,
                e = "";
            for (b in d)
                if (c.test(b)) {
                    e = b.match(c)[0];
                    break;
                }
            return (
                "WebkitOpacity" in d && (e = "Webkit"),
                "KhtmlOpacity" in d && (e = "Khtml"),
                function(a) {
                    return (
                        e + (e.length > 0 ? a.charAt(0).toUpperCase() + a.slice(1) : a)
                    );
                }
            );
        })(),
        k = j("transform"),
        l =
        a("<div />", { style: "background:#fff" }).css(
            "background-position-x"
        ) !== d,
        m = l ?

        function(a, b, c) {
            a.css({ "background-position-x": b, "background-position-y": c });
        } :
        function(a, b, c) {
            a.css("background-position", b + " " + c);
        },
        n = l ?

        function(a) {
            return [
                a.css("background-position-x"),
                a.css("background-position-y"),
            ];
        } :
        function(a) {
            return a.css("background-position").split(" ");
        },
        o =
        b.requestAnimationFrame ||
        b.webkitRequestAnimationFrame ||
        b.mozRequestAnimationFrame ||
        b.oRequestAnimationFrame ||
        b.msRequestAnimationFrame ||
        function(a) {
            setTimeout(a, 1e3 / 60);
        };
    (e.prototype = {
        init: function() {
            (this.options.name = f + "_" + Math.floor(1e9 * Math.random())),
            this._defineElements(),
                this._defineGetters(),
                this._defineSetters(),
                this._handleWindowLoadAndResize(),
                this._detectViewport(),
                this.refresh({ firstLoad: !0 }),
                "scroll" === this.options.scrollProperty ?
                this._handleScrollEvent() :
                this._startAnimationLoop();
        },
        _defineElements: function() {
            this.element === c.body && (this.element = b),
                (this.$scrollElement = a(this.element)),
                (this.$element = this.element === b ? a("body") : this.$scrollElement),
                (this.$viewportElement =
                    this.options.viewportElement !== d ?
                    a(this.options.viewportElement) :
                    this.$scrollElement[0] === b ||
                    "scroll" === this.options.scrollProperty ?
                    this.$scrollElement :
                    this.$scrollElement.parent());
        },
        _defineGetters: function() {
            var a = this,
                b = h[a.options.scrollProperty];
            (this._getScrollLeft = function() {
                return b.getLeft(a.$scrollElement);
            }),
            (this._getScrollTop = function() {
                return b.getTop(a.$scrollElement);
            });
        },
        _defineSetters: function() {
            var b = this,
                c = h[b.options.scrollProperty],
                d = i[b.options.positionProperty],
                e = c.setLeft,
                f = c.setTop;
            (this._setScrollLeft =
                "function" == typeof e ?

                function(a) {
                    e(b.$scrollElement, a);
                } :
                a.noop),
            (this._setScrollTop =
                "function" == typeof f ?

                function(a) {
                    f(b.$scrollElement, a);
                } :
                a.noop),
            (this._setPosition =
                d.setPosition ||
                function(a, c, e, f, g) {
                    b.options.horizontalScrolling && d.setLeft(a, c, e),
                        b.options.verticalScrolling && d.setTop(a, f, g);
                });
        },
        _handleWindowLoadAndResize: function() {
            var c = this,
                d = a(b);
            c.options.responsive &&
                d.bind("load." + this.name, function() {
                    c.refresh();
                }),
                d.bind("resize." + this.name, function() {
                    c._detectViewport(), c.options.responsive && c.refresh();
                });
        },
        refresh: function(c) {
            var d = this,
                e = d._getScrollLeft(),
                f = d._getScrollTop();
            (c && c.firstLoad) || this._reset(),
                this._setScrollLeft(0),
                this._setScrollTop(0),
                this._setOffsets(),
                this._findParticles(),
                this._findBackgrounds(),
                c &&
                c.firstLoad &&
                /WebKit/.test(navigator.userAgent) &&
                a(b).load(function() {
                    var a = d._getScrollLeft(),
                        b = d._getScrollTop();
                    d._setScrollLeft(a + 1),
                        d._setScrollTop(b + 1),
                        d._setScrollLeft(a),
                        d._setScrollTop(b);
                }),
                this._setScrollLeft(e),
                this._setScrollTop(f);
        },
        _detectViewport: function() {
            var a = this.$viewportElement.offset(),
                b = null !== a && a !== d;
            (this.viewportWidth = this.$viewportElement.width()),
            (this.viewportHeight = this.$viewportElement.height()),
            (this.viewportOffsetTop = b ? a.top : 0),
            (this.viewportOffsetLeft = b ? a.left : 0);
        },
        _findParticles: function() {
            {
                var b = this;
                this._getScrollLeft(), this._getScrollTop();
            }
            if (this.particles !== d)
                for (var c = this.particles.length - 1; c >= 0; c--)
                    this.particles[c].$element.data("stellar-elementIsActive", d);
            (this.particles = []),
            this.options.parallaxElements &&
                this.$element.find("[data-stellar-ratio]").each(function() {
                    var c,
                        e,
                        f,
                        g,
                        h,
                        i,
                        j,
                        k,
                        l,
                        m = a(this),
                        n = 0,
                        o = 0,
                        p = 0,
                        q = 0;
                    if (m.data("stellar-elementIsActive")) {
                        if (m.data("stellar-elementIsActive") !== this) return;
                    } else m.data("stellar-elementIsActive", this);
                    b.options.showElement(m),
                        m.data("stellar-startingLeft") ?
                        (m.css("left", m.data("stellar-startingLeft")),
                            m.css("top", m.data("stellar-startingTop"))) :
                        (m.data("stellar-startingLeft", m.css("left")),
                            m.data("stellar-startingTop", m.css("top"))),
                        (f = m.position().left),
                        (g = m.position().top),
                        (h =
                            "auto" === m.css("margin-left") ?
                            0 :
                            parseInt(m.css("margin-left"), 10)),
                        (i =
                            "auto" === m.css("margin-top") ?
                            0 :
                            parseInt(m.css("margin-top"), 10)),
                        (k = m.offset().left - h),
                        (l = m.offset().top - i),
                        m.parents().each(function() {
                            var b = a(this);
                            return b.data("stellar-offset-parent") === !0 ?
                                ((n = p), (o = q), (j = b), !1) :
                                ((p += b.position().left), void(q += b.position().top));
                        }),
                        (c =
                            m.data("stellar-horizontal-offset") !== d ?
                            m.data("stellar-horizontal-offset") :
                            j !== d && j.data("stellar-horizontal-offset") !== d ?
                            j.data("stellar-horizontal-offset") :
                            b.horizontalOffset),
                        (e =
                            m.data("stellar-vertical-offset") !== d ?
                            m.data("stellar-vertical-offset") :
                            j !== d && j.data("stellar-vertical-offset") !== d ?
                            j.data("stellar-vertical-offset") :
                            b.verticalOffset),
                        b.particles.push({
                            $element: m,
                            $offsetParent: j,
                            isFixed: "fixed" === m.css("position"),
                            horizontalOffset: c,
                            verticalOffset: e,
                            startingPositionLeft: f,
                            startingPositionTop: g,
                            startingOffsetLeft: k,
                            startingOffsetTop: l,
                            parentOffsetLeft: n,
                            parentOffsetTop: o,
                            stellarRatio: m.data("stellar-ratio") !== d ? m.data("stellar-ratio") : 1,
                            width: m.outerWidth(!0),
                            height: m.outerHeight(!0),
                            isHidden: !1,
                        });
                });
        },
        _findBackgrounds: function() {
            var b,
                c = this,
                e = this._getScrollLeft(),
                f = this._getScrollTop();
            (this.backgrounds = []),
            this.options.parallaxBackgrounds &&
                ((b = this.$element.find("[data-stellar-background-ratio]")),
                    this.$element.data("stellar-background-ratio") &&
                    (b = b.add(this.$element)),
                    b.each(function() {
                        var b,
                            g,
                            h,
                            i,
                            j,
                            k,
                            l,
                            o = a(this),
                            p = n(o),
                            q = 0,
                            r = 0,
                            s = 0,
                            t = 0;
                        if (o.data("stellar-backgroundIsActive")) {
                            if (o.data("stellar-backgroundIsActive") !== this) return;
                        } else o.data("stellar-backgroundIsActive", this);
                        o.data("stellar-backgroundStartingLeft") ?
                            m(
                                o,
                                o.data("stellar-backgroundStartingLeft"),
                                o.data("stellar-backgroundStartingTop")
                            ) :
                            (o.data("stellar-backgroundStartingLeft", p[0]),
                                o.data("stellar-backgroundStartingTop", p[1])),
                            (h =
                                "auto" === o.css("margin-left") ?
                                0 :
                                parseInt(o.css("margin-left"), 10)),
                            (i =
                                "auto" === o.css("margin-top") ?
                                0 :
                                parseInt(o.css("margin-top"), 10)),
                            (j = o.offset().left - h - e),
                            (k = o.offset().top - i - f),
                            o.parents().each(function() {
                                var b = a(this);
                                return b.data("stellar-offset-parent") === !0 ?
                                    ((q = s), (r = t), (l = b), !1) :
                                    ((s += b.position().left), void(t += b.position().top));
                            }),
                            (b =
                                o.data("stellar-horizontal-offset") !== d ?
                                o.data("stellar-horizontal-offset") :
                                l !== d && l.data("stellar-horizontal-offset") !== d ?
                                l.data("stellar-horizontal-offset") :
                                c.horizontalOffset),
                            (g =
                                o.data("stellar-vertical-offset") !== d ?
                                o.data("stellar-vertical-offset") :
                                l !== d && l.data("stellar-vertical-offset") !== d ?
                                l.data("stellar-vertical-offset") :
                                c.verticalOffset),
                            c.backgrounds.push({
                                $element: o,
                                $offsetParent: l,
                                isFixed: "fixed" === o.css("background-attachment"),
                                horizontalOffset: b,
                                verticalOffset: g,
                                startingValueLeft: p[0],
                                startingValueTop: p[1],
                                startingBackgroundPositionLeft: isNaN(parseInt(p[0], 10)) ?
                                    0 :
                                    parseInt(p[0], 10),
                                startingBackgroundPositionTop: isNaN(parseInt(p[1], 10)) ?
                                    0 :
                                    parseInt(p[1], 10),
                                startingPositionLeft: o.position().left,
                                startingPositionTop: o.position().top,
                                startingOffsetLeft: j,
                                startingOffsetTop: k,
                                parentOffsetLeft: q,
                                parentOffsetTop: r,
                                stellarRatio: o.data("stellar-background-ratio") === d ?
                                    1 :
                                    o.data("stellar-background-ratio"),
                            });
                    }));
        },
        _reset: function() {
            var a, b, c, d, e;
            for (e = this.particles.length - 1; e >= 0; e--)
                (a = this.particles[e]),
                (b = a.$element.data("stellar-startingLeft")),
                (c = a.$element.data("stellar-startingTop")),
                this._setPosition(a.$element, b, b, c, c),
                this.options.showElement(a.$element),
                a.$element
                .data("stellar-startingLeft", null)
                .data("stellar-elementIsActive", null)
                .data("stellar-backgroundIsActive", null);
            for (e = this.backgrounds.length - 1; e >= 0; e--)
                (d = this.backgrounds[e]),
                d.$element
                .data("stellar-backgroundStartingLeft", null)
                .data("stellar-backgroundStartingTop", null),
                m(d.$element, d.startingValueLeft, d.startingValueTop);
        },
        destroy: function() {
            this._reset(),
                this.$scrollElement
                .unbind("resize." + this.name)
                .unbind("scroll." + this.name),
                (this._animationLoop = a.noop),
                a(b)
                .unbind("load." + this.name)
                .unbind("resize." + this.name);
        },
        _setOffsets: function() {
            var c = this,
                d = a(b);
            d
                .unbind("resize.horizontal-" + this.name)
                .unbind("resize.vertical-" + this.name),
                "function" == typeof this.options.horizontalOffset ?
                ((this.horizontalOffset = this.options.horizontalOffset()),
                    d.bind("resize.horizontal-" + this.name, function() {
                        c.horizontalOffset = c.options.horizontalOffset();
                    })) :
                (this.horizontalOffset = this.options.horizontalOffset),
                "function" == typeof this.options.verticalOffset ?
                ((this.verticalOffset = this.options.verticalOffset()),
                    d.bind("resize.vertical-" + this.name, function() {
                        c.verticalOffset = c.options.verticalOffset();
                    })) :
                (this.verticalOffset = this.options.verticalOffset);
        },
        _repositionElements: function() {
            var a,
                b,
                c,
                d,
                e,
                f,
                g,
                h,
                i,
                j,
                k = this._getScrollLeft(),
                l = this._getScrollTop(),
                n = !0,
                o = !0;
            if (
                this.currentScrollLeft !== k ||
                this.currentScrollTop !== l ||
                this.currentWidth !== this.viewportWidth ||
                this.currentHeight !== this.viewportHeight
            ) {
                for (
                    this.currentScrollLeft = k,
                    this.currentScrollTop = l,
                    this.currentWidth = this.viewportWidth,
                    this.currentHeight = this.viewportHeight,
                    j = this.particles.length - 1; j >= 0; j--
                )
                    (a = this.particles[j]),
                    (b = a.isFixed ? 1 : 0),
                    this.options.horizontalScrolling ?
                    ((f =
                            (k +
                                a.horizontalOffset +
                                this.viewportOffsetLeft +
                                a.startingPositionLeft -
                                a.startingOffsetLeft +
                                a.parentOffsetLeft) *
                            -(a.stellarRatio + b - 1) +
                            a.startingPositionLeft),
                        (h = f - a.startingPositionLeft + a.startingOffsetLeft)) :
                    ((f = a.startingPositionLeft), (h = a.startingOffsetLeft)),
                    this.options.verticalScrolling ?
                    ((g =
                            (l +
                                a.verticalOffset +
                                this.viewportOffsetTop +
                                a.startingPositionTop -
                                a.startingOffsetTop +
                                a.parentOffsetTop) *
                            -(a.stellarRatio + b - 1) +
                            a.startingPositionTop),
                        (i = g - a.startingPositionTop + a.startingOffsetTop)) :
                    ((g = a.startingPositionTop), (i = a.startingOffsetTop)),
                    this.options.hideDistantElements &&
                    ((o = !this.options.horizontalScrolling ||
                            (h + a.width > (a.isFixed ? 0 : k) &&
                                h <
                                (a.isFixed ? 0 : k) +
                                this.viewportWidth +
                                this.viewportOffsetLeft)),
                        (n = !this.options.verticalScrolling ||
                            (i + a.height > (a.isFixed ? 0 : l) &&
                                i <
                                (a.isFixed ? 0 : l) +
                                this.viewportHeight +
                                this.viewportOffsetTop))),
                    o && n ?
                    (a.isHidden &&
                        (this.options.showElement(a.$element), (a.isHidden = !1)),
                        this._setPosition(
                            a.$element,
                            f,
                            a.startingPositionLeft,
                            g,
                            a.startingPositionTop
                        )) :
                    a.isHidden ||
                    (this.options.hideElement(a.$element), (a.isHidden = !0));
                for (j = this.backgrounds.length - 1; j >= 0; j--)
                    (c = this.backgrounds[j]),
                    (b = c.isFixed ? 0 : 1),
                    (d = this.options.horizontalScrolling ?
                        (k +
                            c.horizontalOffset -
                            this.viewportOffsetLeft -
                            c.startingOffsetLeft +
                            c.parentOffsetLeft -
                            c.startingBackgroundPositionLeft) *
                        (b - c.stellarRatio) +
                        "px" :
                        c.startingValueLeft),
                    (e = this.options.verticalScrolling ?
                        (l +
                            c.verticalOffset -
                            this.viewportOffsetTop -
                            c.startingOffsetTop +
                            c.parentOffsetTop -
                            c.startingBackgroundPositionTop) *
                        (b - c.stellarRatio) +
                        "px" :
                        c.startingValueTop),
                    m(c.$element, d, e);
            }
        },
        _handleScrollEvent: function() {
            var a = this,
                b = !1,
                c = function() {
                    a._repositionElements(), (b = !1);
                },
                d = function() {
                    b || (o(c), (b = !0));
                };
            this.$scrollElement.bind("scroll." + this.name, d), d();
        },
        _startAnimationLoop: function() {
            var a = this;
            (this._animationLoop = function() {
                o(a._animationLoop), a._repositionElements();
            }),
            this._animationLoop();
        },
    }),
    (a.fn[f] = function(b) {
        var c = arguments;
        return b === d || "object" == typeof b ?
            this.each(function() {
                a.data(this, "plugin_" + f) ||
                    a.data(this, "plugin_" + f, new e(this, b));
            }) :
            "string" == typeof b && "_" !== b[0] && "init" !== b ?
            this.each(function() {
                var d = a.data(this, "plugin_" + f);
                d instanceof e &&
                    "function" == typeof d[b] &&
                    d[b].apply(d, Array.prototype.slice.call(c, 1)),
                    "destroy" === b && a.data(this, "plugin_" + f, null);
            }) :
            void 0;
    }),
    (a[f] = function() {
        var c = a(b);
        return c.stellar.apply(c, Array.prototype.slice.call(arguments, 0));
    }),
    (a[f].scrollProperty = h),
    (a[f].positionProperty = i),
    (b.Stellar = e);
})(jQuery, this, document);

!(function($) {
    ($.flexslider = function(e, t) {
        var a = $(e);
        a.vars = $.extend({}, $.flexslider.defaults, t);
        var n = a.vars.namespace,
            i =
            window.navigator &&
            window.navigator.msPointerEnabled &&
            window.MSGesture,
            s =
            ("ontouchstart" in window ||
                i ||
                (window.DocumentTouch && document instanceof DocumentTouch)) &&
            a.vars.touch,
            r = "click touchend MSPointerUp keyup",
            o = "",
            l,
            c = "vertical" === a.vars.direction,
            d = a.vars.reverse,
            u = a.vars.itemWidth > 0,
            v = "fade" === a.vars.animation,
            p = "" !== a.vars.asNavFor,
            m = {},
            f = !0;
        $.data(e, "flexslider", a),
            (m = {
                init: function() {
                    (a.animating = !1),
                    (a.currentSlide = parseInt(
                        a.vars.startAt ? a.vars.startAt : 0,
                        10
                    )),
                    isNaN(a.currentSlide) && (a.currentSlide = 0),
                        (a.animatingTo = a.currentSlide),
                        (a.atEnd = 0 === a.currentSlide || a.currentSlide === a.last),
                        (a.containerSelector = a.vars.selector.substr(
                            0,
                            a.vars.selector.search(" ")
                        )),
                        (a.slides = $(a.vars.selector, a)),
                        (a.container = $(a.containerSelector, a)),
                        (a.count = a.slides.length),
                        (a.syncExists = $(a.vars.sync).length > 0),
                        "slide" === a.vars.animation && (a.vars.animation = "swing"),
                        (a.prop = c ? "top" : "marginLeft"),
                        (a.args = {}),
                        (a.manualPause = !1),
                        (a.stopped = !1),
                        (a.started = !1),
                        (a.startTimeout = null),
                        (a.transitions = !a.vars.video &&
                            !v &&
                            a.vars.useCSS &&
                            (function() {
                                var e = document.createElement("div"),
                                    t = [
                                        "perspectiveProperty",
                                        "WebkitPerspective",
                                        "MozPerspective",
                                        "OPerspective",
                                        "msPerspective",
                                    ];
                                for (var n in t)
                                    if (void 0 !== e.style[t[n]])
                                        return (
                                            (a.pfx = t[n].replace("Perspective", "").toLowerCase()),
                                            (a.prop = "-" + a.pfx + "-transform"), !0
                                        );
                                return !1;
                            })()),
                        (a.ensureAnimationEnd = ""),
                        "" !== a.vars.controlsContainer &&
                        (a.controlsContainer =
                            $(a.vars.controlsContainer).length > 0 &&
                            $(a.vars.controlsContainer)),
                        "" !== a.vars.manualControls &&
                        (a.manualControls =
                            $(a.vars.manualControls).length > 0 &&
                            $(a.vars.manualControls)),
                        "" !== a.vars.customDirectionNav &&
                        (a.customDirectionNav =
                            2 === $(a.vars.customDirectionNav).length &&
                            $(a.vars.customDirectionNav)),
                        a.vars.randomize &&
                        (a.slides.sort(function() {
                                return Math.round(Math.random()) - 0.5;
                            }),
                            a.container.empty().append(a.slides)),
                        a.doMath(),
                        a.setup("init"),
                        a.vars.controlNav && m.controlNav.setup(),
                        a.vars.directionNav && m.directionNav.setup(),
                        a.vars.keyboard &&
                        (1 === $(a.containerSelector).length ||
                            a.vars.multipleKeyboard) &&
                        $(document).bind("keyup", function(e) {
                            var t = e.keyCode;
                            if (!a.animating && (39 === t || 37 === t)) {
                                var n =
                                    39 === t ?
                                    a.getTarget("next") :
                                    37 === t ?
                                    a.getTarget("prev") :
                                    !1;
                                a.flexAnimate(n, a.vars.pauseOnAction);
                            }
                        }),
                        a.vars.mousewheel &&
                        a.bind("mousewheel", function(e, t, n, i) {
                            e.preventDefault();
                            var s = a.getTarget(0 > t ? "next" : "prev");
                            a.flexAnimate(s, a.vars.pauseOnAction);
                        }),
                        a.vars.pausePlay && m.pausePlay.setup(),
                        a.vars.slideshow &&
                        a.vars.pauseInvisible &&
                        m.pauseInvisible.init(),
                        a.vars.slideshow &&
                        (a.vars.pauseOnHover &&
                            a.hover(
                                function() {
                                    a.manualPlay || a.manualPause || a.pause();
                                },
                                function() {
                                    a.manualPause || a.manualPlay || a.stopped || a.play();
                                }
                            ),
                            (a.vars.pauseInvisible && m.pauseInvisible.isHidden()) ||
                            (a.vars.initDelay > 0 ?
                                (a.startTimeout = setTimeout(a.play, a.vars.initDelay)) :
                                a.play())),
                        p && m.asNav.setup(),
                        s && a.vars.touch && m.touch(),
                        (!v || (v && a.vars.smoothHeight)) &&
                        $(window).bind("resize orientationchange focus", m.resize),
                        a.find("img").attr("draggable", "false"),
                        setTimeout(function() {
                            a.vars.start(a);
                        }, 200);
                },
                asNav: {
                    setup: function() {
                        (a.asNav = !0),
                        (a.animatingTo = Math.floor(a.currentSlide / a.move)),
                        (a.currentItem = a.currentSlide),
                        a.slides
                            .removeClass(n + "active-slide")
                            .eq(a.currentItem)
                            .addClass(n + "active-slide"),
                            i ?
                            ((e._slider = a),
                                a.slides.each(function() {
                                    var e = this;
                                    (e._gesture = new MSGesture()),
                                    (e._gesture.target = e),
                                    e.addEventListener(
                                            "MSPointerDown",
                                            function(e) {
                                                e.preventDefault(),
                                                    e.currentTarget._gesture &&
                                                    e.currentTarget._gesture.addPointer(e.pointerId);
                                            }, !1
                                        ),
                                        e.addEventListener("MSGestureTap", function(e) {
                                            e.preventDefault();
                                            var t = $(this),
                                                n = t.index();
                                            $(a.vars.asNavFor).data("flexslider").animating ||
                                                t.hasClass("active") ||
                                                ((a.direction = a.currentItem < n ? "next" : "prev"),
                                                    a.flexAnimate(n, a.vars.pauseOnAction, !1, !0, !0));
                                        });
                                })) :
                            a.slides.on(r, function(e) {
                                e.preventDefault();
                                var t = $(this),
                                    i = t.index(),
                                    s = t.offset().left - $(a).scrollLeft();
                                0 >= s && t.hasClass(n + "active-slide") ?
                                    a.flexAnimate(a.getTarget("prev"), !0) :
                                    $(a.vars.asNavFor).data("flexslider").animating ||
                                    t.hasClass(n + "active-slide") ||
                                    ((a.direction = a.currentItem < i ? "next" : "prev"),
                                        a.flexAnimate(i, a.vars.pauseOnAction, !1, !0, !0));
                            });
                    },
                },
                controlNav: {
                    setup: function() {
                        a.manualControls ?
                            m.controlNav.setupManual() :
                            m.controlNav.setupPaging();
                    },
                    setupPaging: function() {
                        var e =
                            "thumbnails" === a.vars.controlNav ?
                            "control-thumbs" :
                            "control-paging",
                            t = 1,
                            i,
                            s;
                        if (
                            ((a.controlNavScaffold = $(
                                    '<ol class="' + n + "control-nav " + n + e + '"></ol>'
                                )),
                                a.pagingCount > 1)
                        )
                            for (var l = 0; l < a.pagingCount; l++) {
                                if (
                                    ((s = a.slides.eq(l)),
                                        (i =
                                            "thumbnails" === a.vars.controlNav ?
                                            '<img src="' + s.attr("data-thumb") + '"/>' :
                                            "<a>" + t + "</a>"),
                                        "thumbnails" === a.vars.controlNav &&
                                        !0 === a.vars.thumbCaptions)
                                ) {
                                    var c = s.attr("data-thumbcaption");
                                    "" !== c &&
                                        void 0 !== c &&
                                        (i += '<span class="' + n + 'caption">' + c + "</span>");
                                }
                                a.controlNavScaffold.append("<li>" + i + "</li>"), t++;
                            }
                        a.controlsContainer ?
                            $(a.controlsContainer).append(a.controlNavScaffold) :
                            a.append(a.controlNavScaffold),
                            m.controlNav.set(),
                            m.controlNav.active(),
                            a.controlNavScaffold.delegate("a, img", r, function(e) {
                                if ((e.preventDefault(), "" === o || o === e.type)) {
                                    var t = $(this),
                                        i = a.controlNav.index(t);
                                    t.hasClass(n + "active") ||
                                        ((a.direction = i > a.currentSlide ? "next" : "prev"),
                                            a.flexAnimate(i, a.vars.pauseOnAction));
                                }
                                "" === o && (o = e.type), m.setToClearWatchedEvent();
                            });
                    },
                    setupManual: function() {
                        (a.controlNav = a.manualControls),
                        m.controlNav.active(),
                            a.controlNav.bind(r, function(e) {
                                if ((e.preventDefault(), "" === o || o === e.type)) {
                                    var t = $(this),
                                        i = a.controlNav.index(t);
                                    t.hasClass(n + "active") ||
                                        ((a.direction = i > a.currentSlide ? "next" : "prev"),
                                            a.flexAnimate(i, a.vars.pauseOnAction));
                                }
                                "" === o && (o = e.type), m.setToClearWatchedEvent();
                            });
                    },
                    set: function() {
                        var e = "thumbnails" === a.vars.controlNav ? "img" : "a";
                        a.controlNav = $(
                            "." + n + "control-nav li " + e,
                            a.controlsContainer ? a.controlsContainer : a
                        );
                    },
                    active: function() {
                        a.controlNav
                            .removeClass(n + "active")
                            .eq(a.animatingTo)
                            .addClass(n + "active");
                    },
                    update: function(e, t) {
                        a.pagingCount > 1 && "add" === e ?
                            a.controlNavScaffold.append(
                                $("<li><a>" + a.count + "</a></li>")
                            ) :
                            1 === a.pagingCount ?
                            a.controlNavScaffold.find("li").remove() :
                            a.controlNav.eq(t).closest("li").remove(),
                            m.controlNav.set(),
                            a.pagingCount > 1 && a.pagingCount !== a.controlNav.length ?
                            a.update(t, e) :
                            m.controlNav.active();
                    },
                },
                directionNav: {
                    setup: function() {
                        var e = $(
                            '<ul class="' +
                            n +
                            'direction-nav"><li class="' +
                            n +
                            'nav-prev"><a class="' +
                            n +
                            'prev" href="#">' +
                            a.vars.prevText +
                            '</a></li><li class="' +
                            n +
                            'nav-next"><a class="' +
                            n +
                            'next" href="#">' +
                            a.vars.nextText +
                            "</a></li></ul>"
                        );
                        a.customDirectionNav ?
                            (a.directionNav = a.customDirectionNav) :
                            a.controlsContainer ?
                            ($(a.controlsContainer).append(e),
                                (a.directionNav = $(
                                    "." + n + "direction-nav li a",
                                    a.controlsContainer
                                ))) :
                            (a.append(e),
                                (a.directionNav = $("." + n + "direction-nav li a", a))),
                            m.directionNav.update(),
                            a.directionNav.bind(r, function(e) {
                                e.preventDefault();
                                var t;
                                ("" === o || o === e.type) &&
                                ((t = a.getTarget(
                                        $(this).hasClass(n + "next") ? "next" : "prev"
                                    )),
                                    a.flexAnimate(t, a.vars.pauseOnAction)),
                                "" === o && (o = e.type),
                                    m.setToClearWatchedEvent();
                            });
                    },
                    update: function() {
                        var e = n + "disabled";
                        1 === a.pagingCount ?
                            a.directionNav.addClass(e).attr("tabindex", "-1") :
                            a.vars.animationLoop ?
                            a.directionNav.removeClass(e).removeAttr("tabindex") :
                            0 === a.animatingTo ?
                            a.directionNav
                            .removeClass(e)
                            .filter("." + n + "prev")
                            .addClass(e)
                            .attr("tabindex", "-1") :
                            a.animatingTo === a.last ?
                            a.directionNav
                            .removeClass(e)
                            .filter("." + n + "next")
                            .addClass(e)
                            .attr("tabindex", "-1") :
                            a.directionNav.removeClass(e).removeAttr("tabindex");
                    },
                },
                pausePlay: {
                    setup: function() {
                        var e = $('<div class="' + n + 'pauseplay"><a></a></div>');
                        a.controlsContainer ?
                            (a.controlsContainer.append(e),
                                (a.pausePlay = $("." + n + "pauseplay a", a.controlsContainer))) :
                            (a.append(e), (a.pausePlay = $("." + n + "pauseplay a", a))),
                            m.pausePlay.update(a.vars.slideshow ? n + "pause" : n + "play"),
                            a.pausePlay.bind(r, function(e) {
                                e.preventDefault(),
                                    ("" === o || o === e.type) &&
                                    ($(this).hasClass(n + "pause") ?
                                        ((a.manualPause = !0), (a.manualPlay = !1), a.pause()) :
                                        ((a.manualPause = !1), (a.manualPlay = !0), a.play())),
                                    "" === o && (o = e.type),
                                    m.setToClearWatchedEvent();
                            });
                    },
                    update: function(e) {
                        "play" === e
                            ?
                            a.pausePlay
                            .removeClass(n + "pause")
                            .addClass(n + "play")
                            .html(a.vars.playText) :
                            a.pausePlay
                            .removeClass(n + "play")
                            .addClass(n + "pause")
                            .html(a.vars.pauseText);
                    },
                },
                touch: function() {
                    function t(t) {
                        t.stopPropagation(),
                            a.animating ?
                            t.preventDefault() :
                            (a.pause(),
                                e._gesture.addPointer(t.pointerId),
                                (w = 0),
                                (p = c ? a.h : a.w),
                                (f = Number(new Date())),
                                (l =
                                    u && d && a.animatingTo === a.last ?
                                    0 :
                                    u && d ?
                                    a.limit -
                                    (a.itemW + a.vars.itemMargin) * a.move * a.animatingTo :
                                    u && a.currentSlide === a.last ?
                                    a.limit :
                                    u ?
                                    (a.itemW + a.vars.itemMargin) * a.move * a.currentSlide :
                                    d ?
                                    (a.last - a.currentSlide + a.cloneOffset) * p :
                                    (a.currentSlide + a.cloneOffset) * p));
                    }

                    function n(t) {
                        t.stopPropagation();
                        var a = t.target._slider;
                        if (a) {
                            var n = -t.translationX,
                                i = -t.translationY;
                            return (
                                (w += c ? i : n),
                                (m = w),
                                (y = c ?
                                    Math.abs(w) < Math.abs(-n) :
                                    Math.abs(w) < Math.abs(-i)),
                                t.detail === t.MSGESTURE_FLAG_INERTIA ?
                                void setImmediate(function() {
                                    e._gesture.stop();
                                }) :
                                void(
                                    (!y || Number(new Date()) - f > 500) &&
                                    (t.preventDefault(), !v &&
                                        a.transitions &&
                                        (a.vars.animationLoop ||
                                            (m =
                                                w /
                                                ((0 === a.currentSlide && 0 > w) ||
                                                    (a.currentSlide === a.last && w > 0) ?
                                                    Math.abs(w) / p + 2 :
                                                    1)),
                                            a.setProps(l + m, "setTouch")))
                                )
                            );
                        }
                    }

                    function s(e) {
                        e.stopPropagation();
                        var t = e.target._slider;
                        if (t) {
                            if (t.animatingTo === t.currentSlide && !y && null !== m) {
                                var a = d ? -m : m,
                                    n = t.getTarget(a > 0 ? "next" : "prev");
                                t.canAdvance(n) &&
                                    ((Number(new Date()) - f < 550 && Math.abs(a) > 50) ||
                                        Math.abs(a) > p / 2) ?
                                    t.flexAnimate(n, t.vars.pauseOnAction) :
                                    v ||
                                    t.flexAnimate(t.currentSlide, t.vars.pauseOnAction, !0);
                            }
                            (r = null), (o = null), (m = null), (l = null), (w = 0);
                        }
                    }
                    var r,
                        o,
                        l,
                        p,
                        m,
                        f,
                        g,
                        h,
                        S,
                        y = !1,
                        x = 0,
                        b = 0,
                        w = 0;
                    i
                        ?
                        ((e.style.msTouchAction = "none"),
                            (e._gesture = new MSGesture()),
                            (e._gesture.target = e),
                            e.addEventListener("MSPointerDown", t, !1),
                            (e._slider = a),
                            e.addEventListener("MSGestureChange", n, !1),
                            e.addEventListener("MSGestureEnd", s, !1)) :
                        ((g = function(t) {
                                a.animating ?
                                    t.preventDefault() :
                                    (window.navigator.msPointerEnabled ||
                                        1 === t.touches.length) &&
                                    (a.pause(),
                                        (p = c ? a.h : a.w),
                                        (f = Number(new Date())),
                                        (x = t.touches[0].pageX),
                                        (b = t.touches[0].pageY),
                                        (l =
                                            u && d && a.animatingTo === a.last ?
                                            0 :
                                            u && d ?
                                            a.limit -
                                            (a.itemW + a.vars.itemMargin) * a.move * a.animatingTo :
                                            u && a.currentSlide === a.last ?
                                            a.limit :
                                            u ?
                                            (a.itemW + a.vars.itemMargin) *
                                            a.move *
                                            a.currentSlide :
                                            d ?
                                            (a.last - a.currentSlide + a.cloneOffset) * p :
                                            (a.currentSlide + a.cloneOffset) * p),
                                        (r = c ? b : x),
                                        (o = c ? x : b),
                                        e.addEventListener("touchmove", h, !1),
                                        e.addEventListener("touchend", S, !1));
                            }),
                            (h = function(e) {
                                (x = e.touches[0].pageX),
                                (b = e.touches[0].pageY),
                                (m = c ? r - b : r - x),
                                (y = c ?
                                    Math.abs(m) < Math.abs(x - o) :
                                    Math.abs(m) < Math.abs(b - o));
                                var t = 500;
                                (!y || Number(new Date()) - f > t) &&
                                (e.preventDefault(), !v &&
                                    a.transitions &&
                                    (a.vars.animationLoop ||
                                        (m /=
                                            (0 === a.currentSlide && 0 > m) ||
                                            (a.currentSlide === a.last && m > 0) ?
                                            Math.abs(m) / p + 2 :
                                            1),
                                        a.setProps(l + m, "setTouch")));
                            }),
                            (S = function(t) {
                                if (
                                    (e.removeEventListener("touchmove", h, !1),
                                        a.animatingTo === a.currentSlide && !y && null !== m)
                                ) {
                                    var n = d ? -m : m,
                                        i = a.getTarget(n > 0 ? "next" : "prev");
                                    a.canAdvance(i) &&
                                        ((Number(new Date()) - f < 550 && Math.abs(n) > 50) ||
                                            Math.abs(n) > p / 2) ?
                                        a.flexAnimate(i, a.vars.pauseOnAction) :
                                        v ||
                                        a.flexAnimate(a.currentSlide, a.vars.pauseOnAction, !0);
                                }
                                e.removeEventListener("touchend", S, !1),
                                    (r = null),
                                    (o = null),
                                    (m = null),
                                    (l = null);
                            }),
                            e.addEventListener("touchstart", g, !1));
                },
                resize: function() {
                    !a.animating &&
                        a.is(":visible") &&
                        (u || a.doMath(),
                            v ?
                            m.smoothHeight() :
                            u ?
                            (a.slides.width(a.computedW),
                                a.update(a.pagingCount),
                                a.setProps()) :
                            c ?
                            (a.viewport.height(a.h), a.setProps(a.h, "setTotal")) :
                            (a.vars.smoothHeight && m.smoothHeight(),
                                a.newSlides.width(a.computedW),
                                a.setProps(a.computedW, "setTotal")));
                },
                smoothHeight: function(e) {
                    if (!c || v) {
                        var t = v ? a : a.viewport;
                        e
                            ?
                            t.animate({ height: a.slides.eq(a.animatingTo).height() }, e) :
                            t.height(a.slides.eq(a.animatingTo).height());
                    }
                },
                sync: function(e) {
                    var t = $(a.vars.sync).data("flexslider"),
                        n = a.animatingTo;
                    switch (e) {
                        case "animate":
                            t.flexAnimate(n, a.vars.pauseOnAction, !1, !0);
                            break;
                        case "play":
                            t.playing || t.asNav || t.play();
                            break;
                        case "pause":
                            t.pause();
                    }
                },
                uniqueID: function(e) {
                    return (
                        e
                        .filter("[id]")
                        .add(e.find("[id]"))
                        .each(function() {
                            var e = $(this);
                            e.attr("id", e.attr("id") + "_clone");
                        }),
                        e
                    );
                },
                pauseInvisible: {
                    visProp: null,
                    init: function() {
                        var e = m.pauseInvisible.getHiddenProp();
                        if (e) {
                            var t = e.replace(/[H|h]idden/, "") + "visibilitychange";
                            document.addEventListener(t, function() {
                                m.pauseInvisible.isHidden() ?
                                    a.startTimeout ?
                                    clearTimeout(a.startTimeout) :
                                    a.pause() :
                                    a.started ?
                                    a.play() :
                                    a.vars.initDelay > 0 ?
                                    setTimeout(a.play, a.vars.initDelay) :
                                    a.play();
                            });
                        }
                    },
                    isHidden: function() {
                        var e = m.pauseInvisible.getHiddenProp();
                        return e ? document[e] : !1;
                    },
                    getHiddenProp: function() {
                        var e = ["webkit", "moz", "ms", "o"];
                        if ("hidden" in document) return "hidden";
                        for (var t = 0; t < e.length; t++)
                            if (e[t] + "Hidden" in document) return e[t] + "Hidden";
                        return null;
                    },
                },
                setToClearWatchedEvent: function() {
                    clearTimeout(l),
                        (l = setTimeout(function() {
                            o = "";
                        }, 3e3));
                },
            }),
            (a.flexAnimate = function(e, t, i, r, o) {
                if (
                    (a.vars.animationLoop ||
                        e === a.currentSlide ||
                        (a.direction = e > a.currentSlide ? "next" : "prev"),
                        p &&
                        1 === a.pagingCount &&
                        (a.direction = a.currentItem < e ? "next" : "prev"), !a.animating && (a.canAdvance(e, o) || i) && a.is(":visible"))
                ) {
                    if (p && r) {
                        var l = $(a.vars.asNavFor).data("flexslider");
                        if (
                            ((a.atEnd = 0 === e || e === a.count - 1),
                                l.flexAnimate(e, !0, !1, !0, o),
                                (a.direction = a.currentItem < e ? "next" : "prev"),
                                (l.direction = a.direction),
                                Math.ceil((e + 1) / a.visible) - 1 === a.currentSlide || 0 === e)
                        )
                            return (
                                (a.currentItem = e),
                                a.slides
                                .removeClass(n + "active-slide")
                                .eq(e)
                                .addClass(n + "active-slide"), !1
                            );
                        (a.currentItem = e),
                        a.slides
                            .removeClass(n + "active-slide")
                            .eq(e)
                            .addClass(n + "active-slide"),
                            (e = Math.floor(e / a.visible));
                    }
                    if (
                        ((a.animating = !0),
                            (a.animatingTo = e),
                            t && a.pause(),
                            a.vars.before(a),
                            a.syncExists && !o && m.sync("animate"),
                            a.vars.controlNav && m.controlNav.active(),
                            u ||
                            a.slides
                            .removeClass(n + "active-slide")
                            .eq(e)
                            .addClass(n + "active-slide"),
                            (a.atEnd = 0 === e || e === a.last),
                            a.vars.directionNav && m.directionNav.update(),
                            e === a.last && (a.vars.end(a), a.vars.animationLoop || a.pause()),
                            v)
                    )
                        s ?
                        (a.slides.eq(a.currentSlide).css({ opacity: 0, zIndex: 1 }),
                            a.slides.eq(e).css({ opacity: 1, zIndex: 2 }),
                            a.wrapup(f)) :
                        (a.slides
                            .eq(a.currentSlide)
                            .css({ zIndex: 1 })
                            .animate({ opacity: 0 },
                                a.vars.animationSpeed,
                                a.vars.easing
                            ),
                            a.slides
                            .eq(e)
                            .css({ zIndex: 2 })
                            .animate({ opacity: 1 },
                                a.vars.animationSpeed,
                                a.vars.easing,
                                a.wrapup
                            ));
                    else {
                        var f = c ? a.slides.filter(":first").height() : a.computedW,
                            g,
                            h,
                            S;
                        u
                            ?
                            ((g = a.vars.itemMargin),
                                (S = (a.itemW + g) * a.move * a.animatingTo),
                                (h = S > a.limit && 1 !== a.visible ? a.limit : S)) :
                            (h =
                                0 === a.currentSlide &&
                                e === a.count - 1 &&
                                a.vars.animationLoop &&
                                "next" !== a.direction ?
                                d ?
                                (a.count + a.cloneOffset) * f :
                                0 :
                                a.currentSlide === a.last &&
                                0 === e &&
                                a.vars.animationLoop &&
                                "prev" !== a.direction ?
                                d ?
                                0 :
                                (a.count + 1) * f :
                                d ?
                                (a.count - 1 - e + a.cloneOffset) * f :
                                (e + a.cloneOffset) * f),
                            a.setProps(h, "", a.vars.animationSpeed),
                            a.transitions ?
                            ((a.vars.animationLoop && a.atEnd) ||
                                ((a.animating = !1), (a.currentSlide = a.animatingTo)),
                                a.container.unbind("webkitTransitionEnd transitionend"),
                                a.container.bind(
                                    "webkitTransitionEnd transitionend",
                                    function() {
                                        clearTimeout(a.ensureAnimationEnd), a.wrapup(f);
                                    }
                                ),
                                clearTimeout(a.ensureAnimationEnd),
                                (a.ensureAnimationEnd = setTimeout(function() {
                                    a.wrapup(f);
                                }, a.vars.animationSpeed + 100))) :
                            a.container.animate(
                                a.args,
                                a.vars.animationSpeed,
                                a.vars.easing,
                                function() {
                                    a.wrapup(f);
                                }
                            );
                    }
                    a.vars.smoothHeight && m.smoothHeight(a.vars.animationSpeed);
                }
            }),
            (a.wrapup = function(e) {
                v ||
                    u ||
                    (0 === a.currentSlide &&
                        a.animatingTo === a.last &&
                        a.vars.animationLoop ?
                        a.setProps(e, "jumpEnd") :
                        a.currentSlide === a.last &&
                        0 === a.animatingTo &&
                        a.vars.animationLoop &&
                        a.setProps(e, "jumpStart")),
                    (a.animating = !1),
                    (a.currentSlide = a.animatingTo),
                    a.vars.after(a);
            }),
            (a.animateSlides = function() {
                !a.animating && f && a.flexAnimate(a.getTarget("next"));
            }),
            (a.pause = function() {
                clearInterval(a.animatedSlides),
                    (a.animatedSlides = null),
                    (a.playing = !1),
                    a.vars.pausePlay && m.pausePlay.update("play"),
                    a.syncExists && m.sync("pause");
            }),
            (a.play = function() {
                a.playing && clearInterval(a.animatedSlides),
                    (a.animatedSlides =
                        a.animatedSlides ||
                        setInterval(a.animateSlides, a.vars.slideshowSpeed)),
                    (a.started = a.playing = !0),
                    a.vars.pausePlay && m.pausePlay.update("pause"),
                    a.syncExists && m.sync("play");
            }),
            (a.stop = function() {
                a.pause(), (a.stopped = !0);
            }),
            (a.canAdvance = function(e, t) {
                var n = p ? a.pagingCount - 1 : a.last;
                return t ?
                    !0 :
                    p &&
                    a.currentItem === a.count - 1 &&
                    0 === e &&
                    "prev" === a.direction ?
                    !0 :
                    p &&
                    0 === a.currentItem &&
                    e === a.pagingCount - 1 &&
                    "next" !== a.direction ?
                    !1 :
                    e !== a.currentSlide || p ?
                    a.vars.animationLoop ?
                    !0 :
                    a.atEnd &&
                    0 === a.currentSlide &&
                    e === n &&
                    "next" !== a.direction ?
                    !1 :
                    a.atEnd &&
                    a.currentSlide === n &&
                    0 === e &&
                    "next" === a.direction ?
                    !1 :
                    !0 :
                    !1;
            }),
            (a.getTarget = function(e) {
                return (
                    (a.direction = e),
                    "next" === e ?
                    a.currentSlide === a.last ?
                    0 :
                    a.currentSlide + 1 :
                    0 === a.currentSlide ?
                    a.last :
                    a.currentSlide - 1
                );
            }),
            (a.setProps = function(e, t, n) {
                var i = (function() {
                    var n = e ?
                        e :
                        (a.itemW + a.vars.itemMargin) * a.move * a.animatingTo,
                        i = (function() {
                            if (u)
                                return "setTouch" === t ?
                                    e :
                                    d && a.animatingTo === a.last ?
                                    0 :
                                    d ?
                                    a.limit -
                                    (a.itemW + a.vars.itemMargin) * a.move * a.animatingTo :
                                    a.animatingTo === a.last ?
                                    a.limit :
                                    n;
                            switch (t) {
                                case "setTotal":
                                    return d ?
                                        (a.count - 1 - a.currentSlide + a.cloneOffset) * e :
                                        (a.currentSlide + a.cloneOffset) * e;
                                case "setTouch":
                                    return d ? e : e;
                                case "jumpEnd":
                                    return d ? e : a.count * e;
                                case "jumpStart":
                                    return d ? a.count * e : e;
                                default:
                                    return e;
                            }
                        })();
                    return -1 * i + "px";
                })();
                a.transitions &&
                    ((i = c ?
                            "translate3d(0," + i + ",0)" :
                            "translate3d(" + i + ",0,0)"),
                        (n = void 0 !== n ? n / 1e3 + "s" : "0s"),
                        a.container.css("-" + a.pfx + "-transition-duration", n),
                        a.container.css("transition-duration", n)),
                    (a.args[a.prop] = i),
                    (a.transitions || void 0 === n) && a.container.css(a.args),
                    a.container.css("transform", i);
            }),
            (a.setup = function(e) {
                if (v)
                    a.slides.css({
                        width: "100%",
                        float: "left",
                        marginRight: "-100%",
                        position: "relative",
                    }),
                    "init" === e &&
                    (s ?
                        a.slides
                        .css({
                            opacity: 0,
                            display: "block",
                            webkitTransition: "opacity " + a.vars.animationSpeed / 1e3 + "s ease",
                            zIndex: 1,
                        })
                        .eq(a.currentSlide)
                        .css({ opacity: 1, zIndex: 2 }) :
                        0 == a.vars.fadeFirstSlide ?
                        a.slides
                        .css({ opacity: 0, display: "block", zIndex: 1 })
                        .eq(a.currentSlide)
                        .css({ zIndex: 2 })
                        .css({ opacity: 1 }) :
                        a.slides
                        .css({ opacity: 0, display: "block", zIndex: 1 })
                        .eq(a.currentSlide)
                        .css({ zIndex: 2 })
                        .animate({ opacity: 1 },
                            a.vars.animationSpeed,
                            a.vars.easing
                        )),
                    a.vars.smoothHeight && m.smoothHeight();
                else {
                    var t, i;
                    "init" === e &&
                        ((a.viewport = $('<div class="' + n + 'viewport"></div>')
                                .css({ overflow: "hidden", position: "relative" })
                                .appendTo(a)
                                .append(a.container)),
                            (a.cloneCount = 0),
                            (a.cloneOffset = 0),
                            d &&
                            ((i = $.makeArray(a.slides).reverse()),
                                (a.slides = $(i)),
                                a.container.empty().append(a.slides))),
                        a.vars.animationLoop &&
                        !u &&
                        ((a.cloneCount = 2),
                            (a.cloneOffset = 1),
                            "init" !== e && a.container.find(".clone").remove(),
                            a.container
                            .append(
                                m
                                .uniqueID(a.slides.first().clone().addClass("clone"))
                                .attr("aria-hidden", "true")
                            )
                            .prepend(
                                m
                                .uniqueID(a.slides.last().clone().addClass("clone"))
                                .attr("aria-hidden", "true")
                            )),
                        (a.newSlides = $(a.vars.selector, a)),
                        (t = d ?
                            a.count - 1 - a.currentSlide + a.cloneOffset :
                            a.currentSlide + a.cloneOffset),
                        c && !u ?
                        (a.container
                            .height(200 * (a.count + a.cloneCount) + "%")
                            .css("position", "absolute")
                            .width("100%"),
                            setTimeout(
                                function() {
                                    a.newSlides.css({ display: "block" }),
                                        a.doMath(),
                                        a.viewport.height(a.h),
                                        a.setProps(t * a.h, "init");
                                },
                                "init" === e ? 100 : 0
                            )) :
                        (a.container.width(200 * (a.count + a.cloneCount) + "%"),
                            a.setProps(t * a.computedW, "init"),
                            setTimeout(
                                function() {
                                    a.doMath(),
                                        a.newSlides.css({
                                            width: a.computedW,
                                            float: "left",
                                            display: "block",
                                        }),
                                        a.vars.smoothHeight && m.smoothHeight();
                                },
                                "init" === e ? 100 : 0
                            ));
                }
                u ||
                    a.slides
                    .removeClass(n + "active-slide")
                    .eq(a.currentSlide)
                    .addClass(n + "active-slide"),
                    a.vars.init(a);
            }),
            (a.doMath = function() {
                var e = a.slides.first(),
                    t = a.vars.itemMargin,
                    n = a.vars.minItems,
                    i = a.vars.maxItems;
                (a.w = void 0 === a.viewport ? a.width() : a.viewport.width()),
                (a.h = e.height()),
                (a.boxPadding = e.outerWidth() - e.width()),
                u
                    ?
                    ((a.itemT = a.vars.itemWidth + t),
                        (a.minW = n ? n * a.itemT : a.w),
                        (a.maxW = i ? i * a.itemT - t : a.w),
                        (a.itemW =
                            a.minW > a.w ?
                            (a.w - t * (n - 1)) / n :
                            a.maxW < a.w ?
                            (a.w - t * (i - 1)) / i :
                            a.vars.itemWidth > a.w ?
                            a.w :
                            a.vars.itemWidth),
                        (a.visible = Math.floor(a.w / a.itemW)),
                        (a.move =
                            a.vars.move > 0 && a.vars.move < a.visible ?
                            a.vars.move :
                            a.visible),
                        (a.pagingCount = Math.ceil((a.count - a.visible) / a.move + 1)),
                        (a.last = a.pagingCount - 1),
                        (a.limit =
                            1 === a.pagingCount ?
                            0 :
                            a.vars.itemWidth > a.w ?
                            a.itemW * (a.count - 1) + t * (a.count - 1) :
                            (a.itemW + t) * a.count - a.w - t)) :
                    ((a.itemW = a.w),
                        (a.pagingCount = a.count),
                        (a.last = a.count - 1)),
                    (a.computedW = a.itemW - a.boxPadding);
            }),
            (a.update = function(e, t) {
                a.doMath(),
                    u ||
                    (e < a.currentSlide ?
                        (a.currentSlide += 1) :
                        e <= a.currentSlide && 0 !== e && (a.currentSlide -= 1),
                        (a.animatingTo = a.currentSlide)),
                    a.vars.controlNav &&
                    !a.manualControls &&
                    (("add" === t && !u) || a.pagingCount > a.controlNav.length ?
                        m.controlNav.update("add") :
                        (("remove" === t && !u) ||
                            a.pagingCount < a.controlNav.length) &&
                        (u &&
                            a.currentSlide > a.last &&
                            ((a.currentSlide -= 1), (a.animatingTo -= 1)),
                            m.controlNav.update("remove", a.last))),
                    a.vars.directionNav && m.directionNav.update();
            }),
            (a.addSlide = function(e, t) {
                var n = $(e);
                (a.count += 1),
                (a.last = a.count - 1),
                c && d ?
                    void 0 !== t ?
                    a.slides.eq(a.count - t).after(n) :
                    a.container.prepend(n) :
                    void 0 !== t ?
                    a.slides.eq(t).before(n) :
                    a.container.append(n),
                    a.update(t, "add"),
                    (a.slides = $(a.vars.selector + ":not(.clone)", a)),
                    a.setup(),
                    a.vars.added(a);
            }),
            (a.removeSlide = function(e) {
                var t = isNaN(e) ? a.slides.index($(e)) : e;
                (a.count -= 1),
                (a.last = a.count - 1),
                isNaN(e) ?
                    $(e, a.slides).remove() :
                    c && d ?
                    a.slides.eq(a.last).remove() :
                    a.slides.eq(e).remove(),
                    a.doMath(),
                    a.update(t, "remove"),
                    (a.slides = $(a.vars.selector + ":not(.clone)", a)),
                    a.setup(),
                    a.vars.removed(a);
            }),
            m.init();
    }),
    $(window)
        .blur(function(e) {
            focused = !1;
        })
        .focus(function(e) {
            focused = !0;
        }),
        ($.flexslider.defaults = {
            namespace: "flex-",
            selector: ".slides > li",
            animation: "fade",
            easing: "swing",
            direction: "horizontal",
            reverse: !1,
            animationLoop: !0,
            smoothHeight: !1,
            startAt: 0,
            slideshow: !0,
            slideshowSpeed: 7e3,
            animationSpeed: 600,
            initDelay: 0,
            randomize: !1,
            fadeFirstSlide: !0,
            thumbCaptions: !1,
            pauseOnAction: !0,
            pauseOnHover: !1,
            pauseInvisible: !0,
            useCSS: !0,
            touch: !0,
            video: !1,
            controlNav: !0,
            directionNav: !0,
            prevText: "Previous",
            nextText: "Next",
            keyboard: !0,
            multipleKeyboard: !1,
            mousewheel: !1,
            pausePlay: !1,
            pauseText: "Pause",
            playText: "Play",
            controlsContainer: "",
            manualControls: "",
            customDirectionNav: "",
            sync: "",
            asNavFor: "",
            itemWidth: 0,
            itemMargin: 0,
            minItems: 1,
            maxItems: 0,
            move: 0,
            allowOneSlide: !0,
            start: function() {},
            before: function() {},
            after: function() {},
            end: function() {},
            added: function() {},
            removed: function() {},
            init: function() {},
        }),
        ($.fn.flexslider = function(e) {
            if ((void 0 === e && (e = {}), "object" == typeof e))
                return this.each(function() {
                    var t = $(this),
                        a = e.selector ? e.selector : ".slides > li",
                        n = t.find(a);
                    (1 === n.length && e.allowOneSlide === !0) || 0 === n.length ?
                        (n.fadeIn(400), e.start && e.start(t)) :
                        void 0 === t.data("flexslider") && new $.flexslider(this, e);
                });
            var t = $(this).data("flexslider");
            switch (e) {
                case "play":
                    t.play();
                    break;
                case "pause":
                    t.pause();
                    break;
                case "stop":
                    t.stop();
                    break;
                case "next":
                    t.flexAnimate(t.getTarget("next"), !0);
                    break;
                case "prev":
                case "previous":
                    t.flexAnimate(t.getTarget("prev"), !0);
                    break;
                default:
                    "number" == typeof e && t.flexAnimate(e, !0);
            }
        });
})(jQuery);

(function(a, b, c) {
    "use strict";
    var d = a.document,
        e = a.Modernizr,
        f = function(a) {
            return a.charAt(0).toUpperCase() + a.slice(1);
        },
        g = "Moz Webkit O Ms".split(" "),
        h = function(a) {
            var b = d.documentElement.style,
                c;
            if (typeof b[a] == "string") return a;
            a = f(a);
            for (var e = 0, h = g.length; e < h; e++) {
                c = g[e] + a;
                if (typeof b[c] == "string") return c;
            }
        },
        i = h("transform"),
        j = h("transitionProperty"),
        k = {
            csstransforms: function() {
                return !!i;
            },
            csstransforms3d: function() {
                var a = !!h("perspective");
                if (a) {
                    var c = " -o- -moz- -ms- -webkit- -khtml- ".split(" "),
                        d = "@media (" + c.join("transform-3d),(") + "modernizr)",
                        e = b(
                            "<style>" + d + "{#modernizr{height:3px}}" + "</style>"
                        ).appendTo("head"),
                        f = b('<div id="modernizr" />').appendTo("html");
                    (a = f.height() === 3), f.remove(), e.remove();
                }
                return a;
            },
            csstransitions: function() {
                return !!j;
            },
        },
        l;
    if (e)
        for (l in k) e.hasOwnProperty(l) || e.addTest(l, k[l]);
    else {
        e = a.Modernizr = { _version: "1.6ish: miniModernizr for Isotope" };
        var m = " ",
            n;
        for (l in k)(n = k[l]()), (e[l] = n), (m += " " + (n ? "" : "no-") + l);
        b("html").addClass(m);
    }
    if (e.csstransforms) {
        var o = e.csstransforms3d ?
            {
                translate: function(a) {
                    return "translate3d(" + a[0] + "px, " + a[1] + "px, 0) ";
                },
                scale: function(a) {
                    return "scale3d(" + a + ", " + a + ", 1) ";
                },
            } :
            {
                translate: function(a) {
                    return "translate(" + a[0] + "px, " + a[1] + "px) ";
                },
                scale: function(a) {
                    return "scale(" + a + ") ";
                },
            },
            p = function(a, c, d) {
                var e = b.data(a, "isoTransform") || {},
                    f = {},
                    g,
                    h = {},
                    j;
                (f[c] = d), b.extend(e, f);
                for (g in e)(j = e[g]), (h[g] = o[g](j));
                var k = h.translate || "",
                    l = h.scale || "",
                    m = k + l;
                b.data(a, "isoTransform", e), (a.style[i] = m);
            };
        (b.cssNumber.scale = !0),
        (b.cssHooks.scale = {
            set: function(a, b) {
                p(a, "scale", b);
            },
            get: function(a, c) {
                var d = b.data(a, "isoTransform");
                return d && d.scale ? d.scale : 1;
            },
        }),
        (b.fx.step.scale = function(a) {
            b.cssHooks.scale.set(a.elem, a.now + a.unit);
        }),
        (b.cssNumber.translate = !0),
        (b.cssHooks.translate = {
            set: function(a, b) {
                p(a, "translate", b);
            },
            get: function(a, c) {
                var d = b.data(a, "isoTransform");
                return d && d.translate ? d.translate : [0, 0];
            },
        });
    }
    var q, r;
    e.csstransitions &&
        ((q = {
                WebkitTransitionProperty: "webkitTransitionEnd",
                MozTransitionProperty: "transitionend",
                OTransitionProperty: "oTransitionEnd otransitionend",
                transitionProperty: "transitionend",
            }[j]),
            (r = h("transitionDuration")));
    var s = b.event,
        t;
    (s.special.smartresize = {
        setup: function() {
            b(this).bind("resize", s.special.smartresize.handler);
        },
        teardown: function() {
            b(this).unbind("resize", s.special.smartresize.handler);
        },
        handler: function(a, b) {
            var c = this,
                d = arguments;
            (a.type = "smartresize"),
            t && clearTimeout(t),
                (t = setTimeout(
                    function() {
                        jQuery.event.handle.apply(c, d);
                    },
                    b === "execAsap" ? 0 : 100
                ));
        },
    }),
    (b.fn.smartresize = function(a) {
        return a ?
            this.bind("smartresize", a) :
            this.trigger("smartresize", ["execAsap"]);
    }),
    (b.Isotope = function(a, c, d) {
        (this.element = b(c)), this._create(a), this._init(d);
    });
    var u = ["width", "height"],
        v = b(a);
    (b.Isotope.settings = {
        resizable: !0,
        layoutMode: "masonry",
        containerClass: "isotope",
        itemClass: "isotope-item",
        hiddenClass: "isotope-hidden",
        hiddenStyle: { opacity: 0, scale: 0.001 },
        visibleStyle: { opacity: 1, scale: 1 },
        containerStyle: { position: "relative", overflow: "hidden" },
        animationEngine: "best-available",
        animationOptions: { queue: !1, duration: 800 },
        sortBy: "original-order",
        sortAscending: !0,
        resizesContainer: !0,
        transformsEnabled: !0,
        itemPositionDataEnabled: !1,
    }),
    (b.Isotope.prototype = {
        _create: function(a) {
            (this.options = b.extend({}, b.Isotope.settings, a)),
            (this.styleQueue = []),
            (this.elemCount = 0);
            var c = this.element[0].style;
            this.originalStyle = {};
            var d = u.slice(0);
            for (var e in this.options.containerStyle) d.push(e);
            for (var f = 0, g = d.length; f < g; f++)
                (e = d[f]), (this.originalStyle[e] = c[e] || "");
            this.element.css(this.options.containerStyle),
                this._updateAnimationEngine(),
                this._updateUsingTransforms();
            var h = {
                "original-order": function(a, b) {
                    return b.elemCount++, b.elemCount;
                },
                random: function() {
                    return Math.random();
                },
            };
            (this.options.getSortData = b.extend(this.options.getSortData, h)),
            this.reloadItems(),
                (this.offset = {
                    left: parseInt(this.element.css("padding-left") || 0, 10),
                    top: parseInt(this.element.css("padding-top") || 0, 10),
                });
            var i = this;
            setTimeout(function() {
                    i.element.addClass(i.options.containerClass);
                }, 0),
                this.options.resizable &&
                v.bind("smartresize.isotope", function() {
                    i.resize();
                }),
                this.element.delegate(
                    "." + this.options.hiddenClass,
                    "click",
                    function() {
                        return !1;
                    }
                );
        },
        _getAtoms: function(a) {
            var b = this.options.itemSelector,
                c = b ? a.filter(b).add(a.find(b)) : a,
                d = { position: "absolute" };
            return (
                this.usingTransforms && ((d.left = 0), (d.top = 0)),
                c.css(d).addClass(this.options.itemClass),
                this.updateSortData(c, !0),
                c
            );
        },
        _init: function(a) {
            (this.$filteredAtoms = this._filter(this.$allAtoms)),
            this._sort(),
                this.reLayout(a);
        },
        option: function(a) {
            if (b.isPlainObject(a)) {
                this.options = b.extend(!0, this.options, a);
                var c;
                for (var d in a)(c = "_update" + f(d)), this[c] && this[c]();
            }
        },
        _updateAnimationEngine: function() {
            var a = this.options.animationEngine
                .toLowerCase()
                .replace(/[ _\-]/g, ""),
                b;
            switch (a) {
                case "css":
                case "none":
                    b = !1;
                    break;
                case "jquery":
                    b = !0;
                    break;
                default:
                    b = !e.csstransitions;
            }
            (this.isUsingJQueryAnimation = b), this._updateUsingTransforms();
        },
        _updateTransformsEnabled: function() {
            this._updateUsingTransforms();
        },
        _updateUsingTransforms: function() {
            var a = (this.usingTransforms =
                this.options.transformsEnabled &&
                e.csstransforms &&
                e.csstransitions &&
                !this.isUsingJQueryAnimation);
            a ||
                (delete this.options.hiddenStyle.scale,
                    delete this.options.visibleStyle.scale),
                (this.getPositionStyles = a ? this._translate : this._positionAbs);
        },
        _filter: function(a) {
            var b = this.options.filter === "" ? "*" : this.options.filter;
            if (!b) return a;
            var c = this.options.hiddenClass,
                d = "." + c,
                e = a.filter(d),
                f = e;
            if (b !== "*") {
                f = e.filter(b);
                var g = a.not(d).not(b).addClass(c);
                this.styleQueue.push({ $el: g, style: this.options.hiddenStyle });
            }
            return (
                this.styleQueue.push({ $el: f, style: this.options.visibleStyle }),
                f.removeClass(c),
                a.filter(b)
            );
        },
        updateSortData: function(a, c) {
            var d = this,
                e = this.options.getSortData,
                f,
                g;
            a.each(function() {
                (f = b(this)), (g = {});
                for (var a in e)
                    !c && a === "original-order" ?
                    (g[a] = b.data(this, "isotope-sort-data")[a]) :
                    (g[a] = e[a](f, d));
                b.data(this, "isotope-sort-data", g);
            });
        },
        _sort: function() {
            var a = this.options.sortBy,
                b = this._getSorter,
                c = this.options.sortAscending ? 1 : -1,
                d = function(d, e) {
                    var f = b(d, a),
                        g = b(e, a);
                    return (
                        f === g &&
                        a !== "original-order" &&
                        ((f = b(d, "original-order")), (g = b(e, "original-order"))),
                        (f > g ? 1 : f < g ? -1 : 0) * c
                    );
                };
            this.$filteredAtoms.sort(d);
        },
        _getSorter: function(a, c) {
            return b.data(a, "isotope-sort-data")[c];
        },
        _translate: function(a, b) {
            return { translate: [a, b] };
        },
        _positionAbs: function(a, b) {
            return { left: a, top: b };
        },
        _pushPosition: function(a, b, c) {
            (b = Math.round(b + this.offset.left)),
            (c = Math.round(c + this.offset.top));
            var d = this.getPositionStyles(b, c);
            this.styleQueue.push({ $el: a, style: d }),
                this.options.itemPositionDataEnabled &&
                a.data("isotope-item-position", { x: b, y: c });
        },
        layout: function(a, b) {
            var c = this.options.layoutMode;
            this["_" + c + "Layout"](a);
            if (this.options.resizesContainer) {
                var d = this["_" + c + "GetContainerSize"]();
                this.styleQueue.push({ $el: this.element, style: d });
            }
            this._processStyleQueue(a, b), (this.isLaidOut = !0);
        },
        _processStyleQueue: function(a, c) {
            var d = this.isLaidOut ?
                this.isUsingJQueryAnimation ?
                "animate" :
                "css" :
                "css",
                f = this.options.animationOptions,
                g = this.options.onLayout,
                h,
                i,
                j,
                k;
            i = function(a, b) {
                b.$el[d](b.style, f);
            };
            if (this._isInserting && this.isUsingJQueryAnimation)
                i = function(a, b) {
                    (h = b.$el.hasClass("no-transition") ? "css" : d),
                    b.$el[h](b.style, f);
                };
            else if (c || g || f.complete) {
                var l = !1,
                    m = [c, g, f.complete],
                    n = this;
                (j = !0),
                (k = function() {
                    if (l) return;
                    var b;
                    for (var c = 0, d = m.length; c < d; c++)
                        (b = m[c]), typeof b == "function" && b.call(n.element, a, n);
                    l = !0;
                });
                if (this.isUsingJQueryAnimation && d === "animate")
                    (f.complete = k), (j = !1);
                else if (e.csstransitions) {
                    var o = 0,
                        p = this.styleQueue[0],
                        s = p && p.$el,
                        t;
                    while (!s || !s.length) {
                        t = this.styleQueue[o++];
                        if (!t) return;
                        s = t.$el;
                    }
                    var u = parseFloat(getComputedStyle(s[0])[r]);
                    u > 0 &&
                        ((i = function(a, b) {
                                b.$el[d](b.style, f).one(q, k);
                            }),
                            (j = !1));
                }
            }
            b.each(this.styleQueue, i), j && k(), (this.styleQueue = []);
        },
        resize: function() {
            this["_" + this.options.layoutMode + "ResizeChanged"]() &&
                this.reLayout();
        },
        reLayout: function(a) {
            this["_" + this.options.layoutMode + "Reset"](),
                this.layout(this.$filteredAtoms, a);
        },
        addItems: function(a, b) {
            var c = this._getAtoms(a);
            (this.$allAtoms = this.$allAtoms.add(c)), b && b(c);
        },
        insert: function(a, b) {
            this.element.append(a);
            var c = this;
            this.addItems(a, function(a) {
                var d = c._filter(a);
                c._addHideAppended(d),
                    c._sort(),
                    c.reLayout(),
                    c._revealAppended(d, b);
            });
        },
        appended: function(a, b) {
            var c = this;
            this.addItems(a, function(a) {
                c._addHideAppended(a), c.layout(a), c._revealAppended(a, b);
            });
        },
        _addHideAppended: function(a) {
            (this.$filteredAtoms = this.$filteredAtoms.add(a)),
            a.addClass("no-transition"),
                (this._isInserting = !0),
                this.styleQueue.push({ $el: a, style: this.options.hiddenStyle });
        },
        _revealAppended: function(a, b) {
            var c = this;
            setTimeout(function() {
                a.removeClass("no-transition"),
                    c.styleQueue.push({ $el: a, style: c.options.visibleStyle }),
                    (c._isInserting = !1),
                    c._processStyleQueue(a, b);
            }, 10);
        },
        reloadItems: function() {
            this.$allAtoms = this._getAtoms(this.element.children());
        },
        remove: function(a, b) {
            (this.$allAtoms = this.$allAtoms.not(a)),
            (this.$filteredAtoms = this.$filteredAtoms.not(a));
            var c = this,
                d = function() {
                    a.remove(), b && b.call(c.element);
                };
            a.filter(":not(." + this.options.hiddenClass + ")").length ?
                (this.styleQueue.push({ $el: a, style: this.options.hiddenStyle }),
                    this._sort(),
                    this.reLayout(d)) :
                d();
        },
        shuffle: function(a) {
            this.updateSortData(this.$allAtoms),
                (this.options.sortBy = "random"),
                this._sort(),
                this.reLayout(a);
        },
        destroy: function() {
            var a = this.usingTransforms,
                b = this.options;
            this.$allAtoms
                .removeClass(b.hiddenClass + " " + b.itemClass)
                .each(function() {
                    var b = this.style;
                    (b.position = ""),
                    (b.top = ""),
                    (b.left = ""),
                    (b.opacity = ""),
                    a && (b[i] = "");
                });
            var c = this.element[0].style;
            for (var d in this.originalStyle) c[d] = this.originalStyle[d];
            this.element
                .unbind(".isotope")
                .undelegate("." + b.hiddenClass, "click")
                .removeClass(b.containerClass)
                .removeData("isotope"),
                v.unbind(".isotope");
        },
        _getSegments: function(a) {
            var b = this.options.layoutMode,
                c = a ? "rowHeight" : "columnWidth",
                d = a ? "height" : "width",
                e = a ? "rows" : "cols",
                g = this.element[d](),
                h,
                i =
                (this.options[b] && this.options[b][c]) ||
                this.$filteredAtoms["outer" + f(d)](!0) ||
                g;
            (h = Math.floor(g / i)),
            (h = Math.max(h, 1)),
            (this[b][e] = h),
            (this[b][c] = i);
        },
        _checkIfSegmentsChanged: function(a) {
            var b = this.options.layoutMode,
                c = a ? "rows" : "cols",
                d = this[b][c];
            return this._getSegments(a), this[b][c] !== d;
        },
        _masonryReset: function() {
            (this.masonry = {}), this._getSegments();
            var a = this.masonry.cols;
            this.masonry.colYs = [];
            while (a--) this.masonry.colYs.push(0);
        },
        _masonryLayout: function(a) {
            var c = this,
                d = c.masonry;
            a.each(function() {
                var a = b(this),
                    e = Math.ceil(a.outerWidth(!0) / d.columnWidth);
                e = Math.min(e, d.cols);
                if (e === 1) c._masonryPlaceBrick(a, d.colYs);
                else {
                    var f = d.cols + 1 - e,
                        g = [],
                        h,
                        i;
                    for (i = 0; i < f; i++)
                        (h = d.colYs.slice(i, i + e)), (g[i] = Math.max.apply(Math, h));
                    c._masonryPlaceBrick(a, g);
                }
            });
        },
        _masonryPlaceBrick: function(a, b) {
            var c = Math.min.apply(Math, b),
                d = 0;
            for (var e = 0, f = b.length; e < f; e++)
                if (b[e] === c) {
                    d = e;
                    break;
                }
            var g = this.masonry.columnWidth * d,
                h = c;
            this._pushPosition(a, g, h);
            var i = c + a.outerHeight(!0),
                j = this.masonry.cols + 1 - f;
            for (e = 0; e < j; e++) this.masonry.colYs[d + e] = i;
        },
        _masonryGetContainerSize: function() {
            var a = Math.max.apply(Math, this.masonry.colYs);
            return { height: a };
        },
        _masonryResizeChanged: function() {
            return this._checkIfSegmentsChanged();
        },
        _fitRowsReset: function() {
            this.fitRows = { x: 0, y: 0, height: 0 };
        },
        _fitRowsLayout: function(a) {
            var c = this,
                d = this.element.width(),
                e = this.fitRows;
            a.each(function() {
                var a = b(this),
                    f = a.outerWidth(!0),
                    g = a.outerHeight(!0);
                e.x !== 0 && f + e.x > d && ((e.x = 0), (e.y = e.height)),
                    c._pushPosition(a, e.x, e.y),
                    (e.height = Math.max(e.y + g, e.height)),
                    (e.x += f);
            });
        },
        _fitRowsGetContainerSize: function() {
            return { height: this.fitRows.height };
        },
        _fitRowsResizeChanged: function() {
            return !0;
        },
        _cellsByRowReset: function() {
            (this.cellsByRow = { index: 0 }),
            this._getSegments(),
                this._getSegments(!0);
        },
        _cellsByRowLayout: function(a) {
            var c = this,
                d = this.cellsByRow;
            a.each(function() {
                var a = b(this),
                    e = d.index % d.cols,
                    f = Math.floor(d.index / d.cols),
                    g = (e + 0.5) * d.columnWidth - a.outerWidth(!0) / 2,
                    h = (f + 0.5) * d.rowHeight - a.outerHeight(!0) / 2;
                c._pushPosition(a, g, h), d.index++;
            });
        },
        _cellsByRowGetContainerSize: function() {
            return {
                height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) *
                    this.cellsByRow.rowHeight +
                    this.offset.top,
            };
        },
        _cellsByRowResizeChanged: function() {
            return this._checkIfSegmentsChanged();
        },
        _straightDownReset: function() {
            this.straightDown = { y: 0 };
        },
        _straightDownLayout: function(a) {
            var c = this;
            a.each(function(a) {
                var d = b(this);
                c._pushPosition(d, 0, c.straightDown.y),
                    (c.straightDown.y += d.outerHeight(!0));
            });
        },
        _straightDownGetContainerSize: function() {
            return { height: this.straightDown.y };
        },
        _straightDownResizeChanged: function() {
            return !0;
        },
        _masonryHorizontalReset: function() {
            (this.masonryHorizontal = {}), this._getSegments(!0);
            var a = this.masonryHorizontal.rows;
            this.masonryHorizontal.rowXs = [];
            while (a--) this.masonryHorizontal.rowXs.push(0);
        },
        _masonryHorizontalLayout: function(a) {
            var c = this,
                d = c.masonryHorizontal;
            a.each(function() {
                var a = b(this),
                    e = Math.ceil(a.outerHeight(!0) / d.rowHeight);
                e = Math.min(e, d.rows);
                if (e === 1) c._masonryHorizontalPlaceBrick(a, d.rowXs);
                else {
                    var f = d.rows + 1 - e,
                        g = [],
                        h,
                        i;
                    for (i = 0; i < f; i++)
                        (h = d.rowXs.slice(i, i + e)), (g[i] = Math.max.apply(Math, h));
                    c._masonryHorizontalPlaceBrick(a, g);
                }
            });
        },
        _masonryHorizontalPlaceBrick: function(a, b) {
            var c = Math.min.apply(Math, b),
                d = 0;
            for (var e = 0, f = b.length; e < f; e++)
                if (b[e] === c) {
                    d = e;
                    break;
                }
            var g = c,
                h = this.masonryHorizontal.rowHeight * d;
            this._pushPosition(a, g, h);
            var i = c + a.outerWidth(!0),
                j = this.masonryHorizontal.rows + 1 - f;
            for (e = 0; e < j; e++) this.masonryHorizontal.rowXs[d + e] = i;
        },
        _masonryHorizontalGetContainerSize: function() {
            var a = Math.max.apply(Math, this.masonryHorizontal.rowXs);
            return { width: a };
        },
        _masonryHorizontalResizeChanged: function() {
            return this._checkIfSegmentsChanged(!0);
        },
        _fitColumnsReset: function() {
            this.fitColumns = { x: 0, y: 0, width: 0 };
        },
        _fitColumnsLayout: function(a) {
            var c = this,
                d = this.element.height(),
                e = this.fitColumns;
            a.each(function() {
                var a = b(this),
                    f = a.outerWidth(!0),
                    g = a.outerHeight(!0);
                e.y !== 0 && g + e.y > d && ((e.x = e.width), (e.y = 0)),
                    c._pushPosition(a, e.x, e.y),
                    (e.width = Math.max(e.x + f, e.width)),
                    (e.y += g);
            });
        },
        _fitColumnsGetContainerSize: function() {
            return { width: this.fitColumns.width };
        },
        _fitColumnsResizeChanged: function() {
            return !0;
        },
        _cellsByColumnReset: function() {
            (this.cellsByColumn = { index: 0 }),
            this._getSegments(),
                this._getSegments(!0);
        },
        _cellsByColumnLayout: function(a) {
            var c = this,
                d = this.cellsByColumn;
            a.each(function() {
                var a = b(this),
                    e = Math.floor(d.index / d.rows),
                    f = d.index % d.rows,
                    g = (e + 0.5) * d.columnWidth - a.outerWidth(!0) / 2,
                    h = (f + 0.5) * d.rowHeight - a.outerHeight(!0) / 2;
                c._pushPosition(a, g, h), d.index++;
            });
        },
        _cellsByColumnGetContainerSize: function() {
            return {
                width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) *
                    this.cellsByColumn.columnWidth,
            };
        },
        _cellsByColumnResizeChanged: function() {
            return this._checkIfSegmentsChanged(!0);
        },
        _straightAcrossReset: function() {
            this.straightAcross = { x: 0 };
        },
        _straightAcrossLayout: function(a) {
            var c = this;
            a.each(function(a) {
                var d = b(this);
                c._pushPosition(d, c.straightAcross.x, 0),
                    (c.straightAcross.x += d.outerWidth(!0));
            });
        },
        _straightAcrossGetContainerSize: function() {
            return { width: this.straightAcross.x };
        },
        _straightAcrossResizeChanged: function() {
            return !0;
        },
    }),
    (b.fn.imagesLoaded = function(a) {
        function h() {
            a.call(c, d);
        }

        function i(a) {
            var c = a.target;
            c.src !== f &&
                b.inArray(c, g) === -1 &&
                (g.push(c),
                    --e <= 0 && (setTimeout(h), d.unbind(".imagesLoaded", i)));
        }
        var c = this,
            d = c.find("img").add(c.filter("img")),
            e = d.length,
            f =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
            g = [];
        return (
            e || h(),
            d.bind("load.imagesLoaded error.imagesLoaded", i).each(function() {
                var a = this.src;
                (this.src = f), (this.src = a);
            }),
            c
        );
    });
    var w = function(b) {
        a.console && a.console.error(b);
    };
    b.fn.isotope = function(a, c) {
        if (typeof a == "string") {
            var d = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var c = b.data(this, "isotope");
                if (!c) {
                    w(
                        "cannot call methods on isotope prior to initialization; attempted to call method '" +
                        a +
                        "'"
                    );
                    return;
                }
                if (!b.isFunction(c[a]) || a.charAt(0) === "_") {
                    w("no such method '" + a + "' for isotope instance");
                    return;
                }
                c[a].apply(c, d);
            });
        } else
            this.each(function() {
                var d = b.data(this, "isotope");
                d
                    ?
                    (d.option(a), d._init(c)) :
                    b.data(this, "isotope", new b.Isotope(a, this, c));
            });
        return this;
    };
})(window, jQuery);
jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
        return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
        return (c / 2) * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
        return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d) {
        return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d) {
        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(x, t, b, c, d) {
        return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
        return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
        return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * 0.3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
        return (-(
            a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p)
        ) + b);
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * 0.3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
        return (
            a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
            c +
            b
        );
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (0.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
        if (t < 1)
            return (-0.5 *
                (a *
                    Math.pow(2, 10 * (t -= 1)) *
                    Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                b
            );
        return (
            a *
            Math.pow(2, -10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
            0.5 +
            c +
            b
        );
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1)
            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2)
            return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b;
        return (
            jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
        );
    },
});
(function(t) {
    function e() {}

    function i(t) {
        function i(e) {
            e.prototype.option ||
                (e.prototype.option = function(e) {
                    t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e));
                });
        }

        function n(e, i) {
            t.fn[e] = function(n) {
                if ("string" == typeof n) {
                    for (
                        var s = o.call(arguments, 1), a = 0, u = this.length; u > a; a++
                    ) {
                        var p = this[a],
                            h = t.data(p, e);
                        if (h)
                            if (t.isFunction(h[n]) && "_" !== n.charAt(0)) {
                                var f = h[n].apply(h, s);
                                if (void 0 !== f) return f;
                            } else r("no such method '" + n + "' for " + e + " instance");
                        else
                            r(
                                "cannot call methods on " +
                                e +
                                " prior to initialization; " +
                                "attempted to call '" +
                                n +
                                "'"
                            );
                    }
                    return this;
                }
                return this.each(function() {
                    var o = t.data(this, e);
                    o
                        ?
                        (o.option(n), o._init()) :
                        ((o = new i(this, n)), t.data(this, e, o));
                });
            };
        }
        if (t) {
            var r =
                "undefined" == typeof console ?
                e :
                function(t) {
                    console.error(t);
                };
            return (
                (t.bridget = function(t, e) {
                    i(e), n(t, e);
                }),
                t.bridget
            );
        }
    }
    var o = Array.prototype.slice;
    "function" == typeof define && define.amd ?
        define("jquery-bridget/jquery.bridget", ["jquery"], i) :
        i(t.jQuery);
})(window),
(function(t) {
    function e(e) {
        var i = t.event;
        return (i.target = i.target || i.srcElement || e), i;
    }
    var i = document.documentElement,
        o = function() {};
    i.addEventListener ?
        (o = function(t, e, i) {
            t.addEventListener(e, i, !1);
        }) :
        i.attachEvent &&
        (o = function(t, i, o) {
            (t[i + o] = o.handleEvent ?

                function() {
                    var i = e(t);
                    o.handleEvent.call(o, i);
                } :
                function() {
                    var i = e(t);
                    o.call(t, i);
                }),
            t.attachEvent("on" + i, t[i + o]);
        });
    var n = function() {};
    i.removeEventListener ?
        (n = function(t, e, i) {
            t.removeEventListener(e, i, !1);
        }) :
        i.detachEvent &&
        (n = function(t, e, i) {
            t.detachEvent("on" + e, t[e + i]);
            try {
                delete t[e + i];
            } catch (o) {
                t[e + i] = void 0;
            }
        });
    var r = { bind: o, unbind: n };
    "function" == typeof define && define.amd ?
        define("eventie/eventie", r) :
        "object" == typeof exports ?
        (module.exports = r) :
        (t.eventie = r);
})(this),
(function(t) {
    function e(t) {
        "function" == typeof t && (e.isReady ? t() : r.push(t));
    }

    function i(t) {
        var i = "readystatechange" === t.type && "complete" !== n.readyState;
        if (!e.isReady && !i) {
            e.isReady = !0;
            for (var o = 0, s = r.length; s > o; o++) {
                var a = r[o];
                a();
            }
        }
    }

    function o(o) {
        return (
            o.bind(n, "DOMContentLoaded", i),
            o.bind(n, "readystatechange", i),
            o.bind(t, "load", i),
            e
        );
    }
    var n = t.document,
        r = [];
    (e.isReady = !1),
    "function" == typeof define && define.amd ?
        ((e.isReady = "function" == typeof requirejs),
            define("doc-ready/doc-ready", ["eventie/eventie"], o)) :
        (t.docReady = o(t.eventie));
})(this),
function() {
    function t() {}

    function e(t, e) {
        for (var i = t.length; i--;)
            if (t[i].listener === e) return i;
        return -1;
    }

    function i(t) {
        return function() {
            return this[t].apply(this, arguments);
        };
    }
    var o = t.prototype,
        n = this,
        r = n.EventEmitter;
    (o.getListeners = function(t) {
        var e,
            i,
            o = this._getEvents();
        if (t instanceof RegExp) {
            e = {};
            for (i in o) o.hasOwnProperty(i) && t.test(i) && (e[i] = o[i]);
        } else e = o[t] || (o[t] = []);
        return e;
    }),
    (o.flattenListeners = function(t) {
        var e,
            i = [];
        for (e = 0; t.length > e; e += 1) i.push(t[e].listener);
        return i;
    }),
    (o.getListenersAsObject = function(t) {
        var e,
            i = this.getListeners(t);
        return i instanceof Array && ((e = {}), (e[t] = i)), e || i;
    }),
    (o.addListener = function(t, i) {
        var o,
            n = this.getListenersAsObject(t),
            r = "object" == typeof i;
        for (o in n)
            n.hasOwnProperty(o) &&
            -1 === e(n[o], i) &&
            n[o].push(r ? i : { listener: i, once: !1 });
        return this;
    }),
    (o.on = i("addListener")),
    (o.addOnceListener = function(t, e) {
        return this.addListener(t, { listener: e, once: !0 });
    }),
    (o.once = i("addOnceListener")),
    (o.defineEvent = function(t) {
        return this.getListeners(t), this;
    }),
    (o.defineEvents = function(t) {
        for (var e = 0; t.length > e; e += 1) this.defineEvent(t[e]);
        return this;
    }),
    (o.removeListener = function(t, i) {
        var o,
            n,
            r = this.getListenersAsObject(t);
        for (n in r)
            r.hasOwnProperty(n) &&
            ((o = e(r[n], i)), -1 !== o && r[n].splice(o, 1));
        return this;
    }),
    (o.off = i("removeListener")),
    (o.addListeners = function(t, e) {
        return this.manipulateListeners(!1, t, e);
    }),
    (o.removeListeners = function(t, e) {
        return this.manipulateListeners(!0, t, e);
    }),
    (o.manipulateListeners = function(t, e, i) {
        var o,
            n,
            r = t ? this.removeListener : this.addListener,
            s = t ? this.removeListeners : this.addListeners;
        if ("object" != typeof e || e instanceof RegExp)
            for (o = i.length; o--;) r.call(this, e, i[o]);
        else
            for (o in e)
                e.hasOwnProperty(o) &&
                (n = e[o]) &&
                ("function" == typeof n ?
                    r.call(this, o, n) :
                    s.call(this, o, n));
        return this;
    }),
    (o.removeEvent = function(t) {
        var e,
            i = typeof t,
            o = this._getEvents();
        if ("string" === i) delete o[t];
        else if (t instanceof RegExp)
            for (e in o) o.hasOwnProperty(e) && t.test(e) && delete o[e];
        else delete this._events;
        return this;
    }),
    (o.removeAllListeners = i("removeEvent")),
    (o.emitEvent = function(t, e) {
        var i,
            o,
            n,
            r,
            s = this.getListenersAsObject(t);
        for (n in s)
            if (s.hasOwnProperty(n))
                for (o = s[n].length; o--;)
                    (i = s[n][o]),
                    i.once === !0 && this.removeListener(t, i.listener),
                    (r = i.listener.apply(this, e || [])),
                    r === this._getOnceReturnValue() &&
                    this.removeListener(t, i.listener);
        return this;
    }),
    (o.trigger = i("emitEvent")),
    (o.emit = function(t) {
        var e = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(t, e);
    }),
    (o.setOnceReturnValue = function(t) {
        return (this._onceReturnValue = t), this;
    }),
    (o._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ?
            this._onceReturnValue :
            !0;
    }),
    (o._getEvents = function() {
        return this._events || (this._events = {});
    }),
    (t.noConflict = function() {
        return (n.EventEmitter = r), t;
    }),
    "function" == typeof define && define.amd ?
        define("eventEmitter/EventEmitter", [], function() {
            return t;
        }) :
        "object" == typeof module && module.exports ?
        (module.exports = t) :
        (this.EventEmitter = t);
}.call(this),
    (function(t) {
        function e(t) {
            if (t) {
                if ("string" == typeof o[t]) return t;
                t = t.charAt(0).toUpperCase() + t.slice(1);
                for (var e, n = 0, r = i.length; r > n; n++)
                    if (((e = i[n] + t), "string" == typeof o[e])) return e;
            }
        }
        var i = "Webkit Moz ms Ms O".split(" "),
            o = document.documentElement.style;
        "function" == typeof define && define.amd ?
            define("get-style-property/get-style-property", [], function() {
                return e;
            }) :
            "object" == typeof exports ?
            (module.exports = e) :
            (t.getStyleProperty = e);
    })(window),
    (function(t) {
        function e(t) {
            var e = parseFloat(t),
                i = -1 === t.indexOf("%") && !isNaN(e);
            return i && e;
        }

        function i() {
            for (
                var t = {
                        width: 0,
                        height: 0,
                        innerWidth: 0,
                        innerHeight: 0,
                        outerWidth: 0,
                        outerHeight: 0,
                    },
                    e = 0,
                    i = s.length; i > e; e++
            ) {
                var o = s[e];
                t[o] = 0;
            }
            return t;
        }

        function o(t) {
            function o(t) {
                if (
                    ("string" == typeof t && (t = document.querySelector(t)),
                        t && "object" == typeof t && t.nodeType)
                ) {
                    var o = r(t);
                    if ("none" === o.display) return i();
                    var n = {};
                    (n.width = t.offsetWidth), (n.height = t.offsetHeight);
                    for (
                        var h = (n.isBorderBox = !(!p || !o[p] || "border-box" !== o[p])),
                            f = 0,
                            d = s.length; d > f; f++
                    ) {
                        var l = s[f],
                            c = o[l];
                        c = a(t, c);
                        var y = parseFloat(c);
                        n[l] = isNaN(y) ? 0 : y;
                    }
                    var m = n.paddingLeft + n.paddingRight,
                        g = n.paddingTop + n.paddingBottom,
                        v = n.marginLeft + n.marginRight,
                        _ = n.marginTop + n.marginBottom,
                        I = n.borderLeftWidth + n.borderRightWidth,
                        L = n.borderTopWidth + n.borderBottomWidth,
                        z = h && u,
                        S = e(o.width);
                    S !== !1 && (n.width = S + (z ? 0 : m + I));
                    var b = e(o.height);
                    return (
                        b !== !1 && (n.height = b + (z ? 0 : g + L)),
                        (n.innerWidth = n.width - (m + I)),
                        (n.innerHeight = n.height - (g + L)),
                        (n.outerWidth = n.width + v),
                        (n.outerHeight = n.height + _),
                        n
                    );
                }
            }

            function a(t, e) {
                if (n || -1 === e.indexOf("%")) return e;
                var i = t.style,
                    o = i.left,
                    r = t.runtimeStyle,
                    s = r && r.left;
                return (
                    s && (r.left = t.currentStyle.left),
                    (i.left = e),
                    (e = i.pixelLeft),
                    (i.left = o),
                    s && (r.left = s),
                    e
                );
            }
            var u,
                p = t("boxSizing");
            return (
                (function() {
                    if (p) {
                        var t = document.createElement("div");
                        (t.style.width = "200px"),
                        (t.style.padding = "1px 2px 3px 4px"),
                        (t.style.borderStyle = "solid"),
                        (t.style.borderWidth = "1px 2px 3px 4px"),
                        (t.style[p] = "border-box");
                        var i = document.body || document.documentElement;
                        i.appendChild(t);
                        var o = r(t);
                        (u = 200 === e(o.width)), i.removeChild(t);
                    }
                })(),
                o
            );
        }
        var n = t.getComputedStyle,
            r = n ?

            function(t) {
                return n(t, null);
            } :
            function(t) {
                return t.currentStyle;
            },
            s = [
                "paddingLeft",
                "paddingRight",
                "paddingTop",
                "paddingBottom",
                "marginLeft",
                "marginRight",
                "marginTop",
                "marginBottom",
                "borderLeftWidth",
                "borderRightWidth",
                "borderTopWidth",
                "borderBottomWidth",
            ];
        "function" == typeof define && define.amd ?
            define(
                "get-size/get-size", ["get-style-property/get-style-property"],
                o
            ) :
            "object" == typeof exports ?
            (module.exports = o(require("get-style-property"))) :
            (t.getSize = o(t.getStyleProperty));
    })(window),
    (function(t, e) {
        function i(t, e) {
            return t[a](e);
        }

        function o(t) {
            if (!t.parentNode) {
                var e = document.createDocumentFragment();
                e.appendChild(t);
            }
        }

        function n(t, e) {
            o(t);
            for (
                var i = t.parentNode.querySelectorAll(e), n = 0, r = i.length; r > n; n++
            )
                if (i[n] === t) return !0;
            return !1;
        }

        function r(t, e) {
            return o(t), i(t, e);
        }
        var s,
            a = (function() {
                if (e.matchesSelector) return "matchesSelector";
                for (
                    var t = ["webkit", "moz", "ms", "o"], i = 0, o = t.length; o > i; i++
                ) {
                    var n = t[i],
                        r = n + "MatchesSelector";
                    if (e[r]) return r;
                }
            })();
        if (a) {
            var u = document.createElement("div"),
                p = i(u, "div");
            s = p ? i : r;
        } else s = n;
        "function" == typeof define && define.amd ?
            define("matches-selector/matches-selector", [], function() {
                return s;
            }) :
            (window.matchesSelector = s);
    })(this, Element.prototype),
    (function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t;
        }

        function i(t) {
            for (var e in t) return !1;
            return (e = null), !0;
        }

        function o(t) {
            return t.replace(/([A-Z])/g, function(t) {
                return "-" + t.toLowerCase();
            });
        }

        function n(t, n, r) {
            function a(t, e) {
                t &&
                    ((this.element = t),
                        (this.layout = e),
                        (this.position = { x: 0, y: 0 }),
                        this._create());
            }
            var u = r("transition"),
                p = r("transform"),
                h = u && p,
                f = !!r("perspective"),
                d = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "otransitionend",
                    transition: "transitionend",
                }[u],
                l = [
                    "transform",
                    "transition",
                    "transitionDuration",
                    "transitionProperty",
                ],
                c = (function() {
                    for (var t = {}, e = 0, i = l.length; i > e; e++) {
                        var o = l[e],
                            n = r(o);
                        n && n !== o && (t[o] = n);
                    }
                    return t;
                })();
            e(a.prototype, t.prototype),
                (a.prototype._create = function() {
                    (this._transn = { ingProperties: {}, clean: {}, onEnd: {} }),
                    this.css({ position: "absolute" });
                }),
                (a.prototype.handleEvent = function(t) {
                    var e = "on" + t.type;
                    this[e] && this[e](t);
                }),
                (a.prototype.getSize = function() {
                    this.size = n(this.element);
                }),
                (a.prototype.css = function(t) {
                    var e = this.element.style;
                    for (var i in t) {
                        var o = c[i] || i;
                        e[o] = t[i];
                    }
                }),
                (a.prototype.getPosition = function() {
                    var t = s(this.element),
                        e = this.layout.options,
                        i = e.isOriginLeft,
                        o = e.isOriginTop,
                        n = parseInt(t[i ? "left" : "right"], 10),
                        r = parseInt(t[o ? "top" : "bottom"], 10);
                    (n = isNaN(n) ? 0 : n), (r = isNaN(r) ? 0 : r);
                    var a = this.layout.size;
                    (n -= i ? a.paddingLeft : a.paddingRight),
                    (r -= o ? a.paddingTop : a.paddingBottom),
                    (this.position.x = n),
                    (this.position.y = r);
                }),
                (a.prototype.layoutPosition = function() {
                    var t = this.layout.size,
                        e = this.layout.options,
                        i = {};
                    e.isOriginLeft ?
                        ((i.left = this.position.x + t.paddingLeft + "px"),
                            (i.right = "")) :
                        ((i.right = this.position.x + t.paddingRight + "px"),
                            (i.left = "")),
                        e.isOriginTop ?
                        ((i.top = this.position.y + t.paddingTop + "px"),
                            (i.bottom = "")) :
                        ((i.bottom = this.position.y + t.paddingBottom + "px"),
                            (i.top = "")),
                        this.css(i),
                        this.emitEvent("layout", [this]);
                });
            var y = f ?

                function(t, e) {
                    return "translate3d(" + t + "px, " + e + "px, 0)";
                } :
                function(t, e) {
                    return "translate(" + t + "px, " + e + "px)";
                };
            (a.prototype._transitionTo = function(t, e) {
                this.getPosition();
                var i = this.position.x,
                    o = this.position.y,
                    n = parseInt(t, 10),
                    r = parseInt(e, 10),
                    s = n === this.position.x && r === this.position.y;
                if ((this.setPosition(t, e), s && !this.isTransitioning))
                    return this.layoutPosition(), void 0;
                var a = t - i,
                    u = e - o,
                    p = {},
                    h = this.layout.options;
                (a = h.isOriginLeft ? a : -a),
                (u = h.isOriginTop ? u : -u),
                (p.transform = y(a, u)),
                this.transition({
                    to: p,
                    onTransitionEnd: { transform: this.layoutPosition },
                    isCleaning: !0,
                });
            }),
            (a.prototype.goTo = function(t, e) {
                this.setPosition(t, e), this.layoutPosition();
            }),
            (a.prototype.moveTo = h ? a.prototype._transitionTo : a.prototype.goTo),
            (a.prototype.setPosition = function(t, e) {
                (this.position.x = parseInt(t, 10)),
                (this.position.y = parseInt(e, 10));
            }),
            (a.prototype._nonTransition = function(t) {
                this.css(t.to), t.isCleaning && this._removeStyles(t.to);
                for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this);
            }),
            (a.prototype._transition = function(t) {
                if (!parseFloat(this.layout.options.transitionDuration))
                    return this._nonTransition(t), void 0;
                var e = this._transn;
                for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
                for (i in t.to)
                    (e.ingProperties[i] = !0), t.isCleaning && (e.clean[i] = !0);
                if (t.from) {
                    this.css(t.from);
                    var o = this.element.offsetHeight;
                    o = null;
                }
                this.enableTransition(t.to),
                    this.css(t.to),
                    (this.isTransitioning = !0);
            });
            var m = p && o(p) + ",opacity";
            (a.prototype.enableTransition = function() {
                this.isTransitioning ||
                    (this.css({
                            transitionProperty: m,
                            transitionDuration: this.layout.options.transitionDuration,
                        }),
                        this.element.addEventListener(d, this, !1));
            }),
            (a.prototype.transition =
                a.prototype[u ? "_transition" : "_nonTransition"]),
            (a.prototype.onwebkitTransitionEnd = function(t) {
                this.ontransitionend(t);
            }),
            (a.prototype.onotransitionend = function(t) {
                this.ontransitionend(t);
            });
            var g = {
                "-webkit-transform": "transform",
                "-moz-transform": "transform",
                "-o-transform": "transform",
            };
            (a.prototype.ontransitionend = function(t) {
                if (t.target === this.element) {
                    var e = this._transn,
                        o = g[t.propertyName] || t.propertyName;
                    if (
                        (delete e.ingProperties[o],
                            i(e.ingProperties) && this.disableTransition(),
                            o in e.clean &&
                            ((this.element.style[t.propertyName] = ""), delete e.clean[o]),
                            o in e.onEnd)
                    ) {
                        var n = e.onEnd[o];
                        n.call(this), delete e.onEnd[o];
                    }
                    this.emitEvent("transitionEnd", [this]);
                }
            }),
            (a.prototype.disableTransition = function() {
                this.removeTransitionStyles(),
                    this.element.removeEventListener(d, this, !1),
                    (this.isTransitioning = !1);
            }),
            (a.prototype._removeStyles = function(t) {
                var e = {};
                for (var i in t) e[i] = "";
                this.css(e);
            });
            var v = { transitionProperty: "", transitionDuration: "" };
            return (
                (a.prototype.removeTransitionStyles = function() {
                    this.css(v);
                }),
                (a.prototype.removeElem = function() {
                    this.element.parentNode.removeChild(this.element),
                        this.emitEvent("remove", [this]);
                }),
                (a.prototype.remove = function() {
                    if (!u || !parseFloat(this.layout.options.transitionDuration))
                        return this.removeElem(), void 0;
                    var t = this;
                    this.on("transitionEnd", function() {
                            return t.removeElem(), !0;
                        }),
                        this.hide();
                }),
                (a.prototype.reveal = function() {
                    delete this.isHidden, this.css({ display: "" });
                    var t = this.layout.options;
                    this.transition({
                        from: t.hiddenStyle,
                        to: t.visibleStyle,
                        isCleaning: !0,
                    });
                }),
                (a.prototype.hide = function() {
                    (this.isHidden = !0), this.css({ display: "" });
                    var t = this.layout.options;
                    this.transition({
                        from: t.visibleStyle,
                        to: t.hiddenStyle,
                        isCleaning: !0,
                        onTransitionEnd: {
                            opacity: function() {
                                this.isHidden && this.css({ display: "none" });
                            },
                        },
                    });
                }),
                (a.prototype.destroy = function() {
                    this.css({
                        position: "",
                        left: "",
                        right: "",
                        top: "",
                        bottom: "",
                        transition: "",
                        transform: "",
                    });
                }),
                a
            );
        }
        var r = t.getComputedStyle,
            s = r ?

            function(t) {
                return r(t, null);
            } :
            function(t) {
                return t.currentStyle;
            };
        "function" == typeof define && define.amd ?
            define(
                "outlayer/item", [
                    "eventEmitter/EventEmitter",
                    "get-size/get-size",
                    "get-style-property/get-style-property",
                ],
                n
            ) :
            ((t.Outlayer = {}),
                (t.Outlayer.Item = n(t.EventEmitter, t.getSize, t.getStyleProperty)));
    })(window),
    (function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t;
        }

        function i(t) {
            return "[object Array]" === f.call(t);
        }

        function o(t) {
            var e = [];
            if (i(t)) e = t;
            else if (t && "number" == typeof t.length)
                for (var o = 0, n = t.length; n > o; o++) e.push(t[o]);
            else e.push(t);
            return e;
        }

        function n(t, e) {
            var i = l(e, t); -
            1 !== i && e.splice(i, 1);
        }

        function r(t) {
            return t
                .replace(/(.)([A-Z])/g, function(t, e, i) {
                    return e + "-" + i;
                })
                .toLowerCase();
        }

        function s(i, s, f, l, c, y) {
            function m(t, i) {
                if (("string" == typeof t && (t = a.querySelector(t)), !t || !d(t)))
                    return (
                        u &&
                        u.error("Bad " + this.constructor.namespace + " element: " + t),
                        void 0
                    );
                (this.element = t),
                (this.options = e({}, this.constructor.defaults)),
                this.option(i);
                var o = ++g;
                (this.element.outlayerGUID = o),
                (v[o] = this),
                this._create(),
                    this.options.isInitLayout && this.layout();
            }
            var g = 0,
                v = {};
            return (
                (m.namespace = "outlayer"),
                (m.Item = y),
                (m.defaults = {
                    containerStyle: { position: "relative" },
                    isInitLayout: !0,
                    isOriginLeft: !0,
                    isOriginTop: !0,
                    isResizeBound: !0,
                    isResizingContainer: !0,
                    transitionDuration: "0.4s",
                    hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
                    visibleStyle: { opacity: 1, transform: "scale(1)" },
                }),
                e(m.prototype, f.prototype),
                (m.prototype.option = function(t) {
                    e(this.options, t);
                }),
                (m.prototype._create = function() {
                    this.reloadItems(),
                        (this.stamps = []),
                        this.stamp(this.options.stamp),
                        e(this.element.style, this.options.containerStyle),
                        this.options.isResizeBound && this.bindResize();
                }),
                (m.prototype.reloadItems = function() {
                    this.items = this._itemize(this.element.children);
                }),
                (m.prototype._itemize = function(t) {
                    for (
                        var e = this._filterFindItemElements(t),
                            i = this.constructor.Item,
                            o = [],
                            n = 0,
                            r = e.length; r > n; n++
                    ) {
                        var s = e[n],
                            a = new i(s, this);
                        o.push(a);
                    }
                    return o;
                }),
                (m.prototype._filterFindItemElements = function(t) {
                    t = o(t);
                    for (
                        var e = this.options.itemSelector, i = [], n = 0, r = t.length; r > n; n++
                    ) {
                        var s = t[n];
                        if (d(s))
                            if (e) {
                                c(s, e) && i.push(s);
                                for (
                                    var a = s.querySelectorAll(e), u = 0, p = a.length; p > u; u++
                                )
                                    i.push(a[u]);
                            } else i.push(s);
                    }
                    return i;
                }),
                (m.prototype.getItemElements = function() {
                    for (var t = [], e = 0, i = this.items.length; i > e; e++)
                        t.push(this.items[e].element);
                    return t;
                }),
                (m.prototype.layout = function() {
                    this._resetLayout(), this._manageStamps();
                    var t =
                        void 0 !== this.options.isLayoutInstant ?
                        this.options.isLayoutInstant :
                        !this._isLayoutInited;
                    this.layoutItems(this.items, t), (this._isLayoutInited = !0);
                }),
                (m.prototype._init = m.prototype.layout),
                (m.prototype._resetLayout = function() {
                    this.getSize();
                }),
                (m.prototype.getSize = function() {
                    this.size = l(this.element);
                }),
                (m.prototype._getMeasurement = function(t, e) {
                    var i,
                        o = this.options[t];
                    o
                        ?
                        ("string" == typeof o ?
                            (i = this.element.querySelector(o)) :
                            d(o) && (i = o),
                            (this[t] = i ? l(i)[e] : o)) :
                        (this[t] = 0);
                }),
                (m.prototype.layoutItems = function(t, e) {
                    (t = this._getItemsForLayout(t)),
                    this._layoutItems(t, e),
                        this._postLayout();
                }),
                (m.prototype._getItemsForLayout = function(t) {
                    for (var e = [], i = 0, o = t.length; o > i; i++) {
                        var n = t[i];
                        n.isIgnored || e.push(n);
                    }
                    return e;
                }),
                (m.prototype._layoutItems = function(t, e) {
                    function i() {
                        o.emitEvent("layoutComplete", [o, t]);
                    }
                    var o = this;
                    if (!t || !t.length) return i(), void 0;
                    this._itemsOn(t, "layout", i);
                    for (var n = [], r = 0, s = t.length; s > r; r++) {
                        var a = t[r],
                            u = this._getItemLayoutPosition(a);
                        (u.item = a), (u.isInstant = e || a.isLayoutInstant), n.push(u);
                    }
                    this._processLayoutQueue(n);
                }),
                (m.prototype._getItemLayoutPosition = function() {
                    return { x: 0, y: 0 };
                }),
                (m.prototype._processLayoutQueue = function(t) {
                    for (var e = 0, i = t.length; i > e; e++) {
                        var o = t[e];
                        this._positionItem(o.item, o.x, o.y, o.isInstant);
                    }
                }),
                (m.prototype._positionItem = function(t, e, i, o) {
                    o ? t.goTo(e, i) : t.moveTo(e, i);
                }),
                (m.prototype._postLayout = function() {
                    this.resizeContainer();
                }),
                (m.prototype.resizeContainer = function() {
                    if (this.options.isResizingContainer) {
                        var t = this._getContainerSize();
                        t &&
                            (this._setContainerMeasure(t.width, !0),
                                this._setContainerMeasure(t.height, !1));
                    }
                }),
                (m.prototype._getContainerSize = h),
                (m.prototype._setContainerMeasure = function(t, e) {
                    if (void 0 !== t) {
                        var i = this.size;
                        i.isBorderBox &&
                            (t += e ?
                                i.paddingLeft +
                                i.paddingRight +
                                i.borderLeftWidth +
                                i.borderRightWidth :
                                i.paddingBottom +
                                i.paddingTop +
                                i.borderTopWidth +
                                i.borderBottomWidth),
                            (t = Math.max(t, 0)),
                            (this.element.style[e ? "width" : "height"] = t + "px");
                    }
                }),
                (m.prototype._itemsOn = function(t, e, i) {
                    function o() {
                        return n++, n === r && i.call(s), !0;
                    }
                    for (
                        var n = 0, r = t.length, s = this, a = 0, u = t.length; u > a; a++
                    ) {
                        var p = t[a];
                        p.on(e, o);
                    }
                }),
                (m.prototype.ignore = function(t) {
                    var e = this.getItem(t);
                    e && (e.isIgnored = !0);
                }),
                (m.prototype.unignore = function(t) {
                    var e = this.getItem(t);
                    e && delete e.isIgnored;
                }),
                (m.prototype.stamp = function(t) {
                    if ((t = this._find(t))) {
                        this.stamps = this.stamps.concat(t);
                        for (var e = 0, i = t.length; i > e; e++) {
                            var o = t[e];
                            this.ignore(o);
                        }
                    }
                }),
                (m.prototype.unstamp = function(t) {
                    if ((t = this._find(t)))
                        for (var e = 0, i = t.length; i > e; e++) {
                            var o = t[e];
                            n(o, this.stamps), this.unignore(o);
                        }
                }),
                (m.prototype._find = function(t) {
                    return t ?
                        ("string" == typeof t && (t = this.element.querySelectorAll(t)),
                            (t = o(t))) :
                        void 0;
                }),
                (m.prototype._manageStamps = function() {
                    if (this.stamps && this.stamps.length) {
                        this._getBoundingRect();
                        for (var t = 0, e = this.stamps.length; e > t; t++) {
                            var i = this.stamps[t];
                            this._manageStamp(i);
                        }
                    }
                }),
                (m.prototype._getBoundingRect = function() {
                    var t = this.element.getBoundingClientRect(),
                        e = this.size;
                    this._boundingRect = {
                        left: t.left + e.paddingLeft + e.borderLeftWidth,
                        top: t.top + e.paddingTop + e.borderTopWidth,
                        right: t.right - (e.paddingRight + e.borderRightWidth),
                        bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth),
                    };
                }),
                (m.prototype._manageStamp = h),
                (m.prototype._getElementOffset = function(t) {
                    var e = t.getBoundingClientRect(),
                        i = this._boundingRect,
                        o = l(t),
                        n = {
                            left: e.left - i.left - o.marginLeft,
                            top: e.top - i.top - o.marginTop,
                            right: i.right - e.right - o.marginRight,
                            bottom: i.bottom - e.bottom - o.marginBottom,
                        };
                    return n;
                }),
                (m.prototype.handleEvent = function(t) {
                    var e = "on" + t.type;
                    this[e] && this[e](t);
                }),
                (m.prototype.bindResize = function() {
                    this.isResizeBound ||
                        (i.bind(t, "resize", this), (this.isResizeBound = !0));
                }),
                (m.prototype.unbindResize = function() {
                    this.isResizeBound && i.unbind(t, "resize", this),
                        (this.isResizeBound = !1);
                }),
                (m.prototype.onresize = function() {
                    function t() {
                        e.resize(), delete e.resizeTimeout;
                    }
                    this.resizeTimeout && clearTimeout(this.resizeTimeout);
                    var e = this;
                    this.resizeTimeout = setTimeout(t, 100);
                }),
                (m.prototype.resize = function() {
                    this.isResizeBound && this.needsResizeLayout() && this.layout();
                }),
                (m.prototype.needsResizeLayout = function() {
                    var t = l(this.element),
                        e = this.size && t;
                    return e && t.innerWidth !== this.size.innerWidth;
                }),
                (m.prototype.addItems = function(t) {
                    var e = this._itemize(t);
                    return e.length && (this.items = this.items.concat(e)), e;
                }),
                (m.prototype.appended = function(t) {
                    var e = this.addItems(t);
                    e.length && (this.layoutItems(e, !0), this.reveal(e));
                }),
                (m.prototype.prepended = function(t) {
                    var e = this._itemize(t);
                    if (e.length) {
                        var i = this.items.slice(0);
                        (this.items = e.concat(i)),
                        this._resetLayout(),
                            this._manageStamps(),
                            this.layoutItems(e, !0),
                            this.reveal(e),
                            this.layoutItems(i);
                    }
                }),
                (m.prototype.reveal = function(t) {
                    var e = t && t.length;
                    if (e)
                        for (var i = 0; e > i; i++) {
                            var o = t[i];
                            o.reveal();
                        }
                }),
                (m.prototype.hide = function(t) {
                    var e = t && t.length;
                    if (e)
                        for (var i = 0; e > i; i++) {
                            var o = t[i];
                            o.hide();
                        }
                }),
                (m.prototype.getItem = function(t) {
                    for (var e = 0, i = this.items.length; i > e; e++) {
                        var o = this.items[e];
                        if (o.element === t) return o;
                    }
                }),
                (m.prototype.getItems = function(t) {
                    if (t && t.length) {
                        for (var e = [], i = 0, o = t.length; o > i; i++) {
                            var n = t[i],
                                r = this.getItem(n);
                            r && e.push(r);
                        }
                        return e;
                    }
                }),
                (m.prototype.remove = function(t) {
                    t = o(t);
                    var e = this.getItems(t);
                    if (e && e.length) {
                        this._itemsOn(e, "remove", function() {
                            this.emitEvent("removeComplete", [this, e]);
                        });
                        for (var i = 0, r = e.length; r > i; i++) {
                            var s = e[i];
                            s.remove(), n(s, this.items);
                        }
                    }
                }),
                (m.prototype.destroy = function() {
                    var t = this.element.style;
                    (t.height = ""), (t.position = ""), (t.width = "");
                    for (var e = 0, i = this.items.length; i > e; e++) {
                        var o = this.items[e];
                        o.destroy();
                    }
                    this.unbindResize(),
                        delete this.element.outlayerGUID,
                        p && p.removeData(this.element, this.constructor.namespace);
                }),
                (m.data = function(t) {
                    var e = t && t.outlayerGUID;
                    return e && v[e];
                }),
                (m.create = function(t, i) {
                    function o() {
                        m.apply(this, arguments);
                    }
                    return (
                        Object.create ?
                        (o.prototype = Object.create(m.prototype)) :
                        e(o.prototype, m.prototype),
                        (o.prototype.constructor = o),
                        (o.defaults = e({}, m.defaults)),
                        e(o.defaults, i),
                        (o.prototype.settings = {}),
                        (o.namespace = t),
                        (o.data = m.data),
                        (o.Item = function() {
                            y.apply(this, arguments);
                        }),
                        (o.Item.prototype = new y()),
                        s(function() {
                            for (
                                var e = r(t),
                                    i = a.querySelectorAll(".js-" + e),
                                    n = "data-" + e + "-options",
                                    s = 0,
                                    h = i.length; h > s; s++
                            ) {
                                var f,
                                    d = i[s],
                                    l = d.getAttribute(n);
                                try {
                                    f = l && JSON.parse(l);
                                } catch (c) {
                                    u &&
                                        u.error(
                                            "Error parsing " +
                                            n +
                                            " on " +
                                            d.nodeName.toLowerCase() +
                                            (d.id ? "#" + d.id : "") +
                                            ": " +
                                            c
                                        );
                                    continue;
                                }
                                var y = new o(d, f);
                                p && p.data(d, t, y);
                            }
                        }),
                        p && p.bridget && p.bridget(t, o),
                        o
                    );
                }),
                (m.Item = y),
                m
            );
        }
        var a = t.document,
            u = t.console,
            p = t.jQuery,
            h = function() {},
            f = Object.prototype.toString,
            d =
            "object" == typeof HTMLElement ?

            function(t) {
                return t instanceof HTMLElement;
            } :
            function(t) {
                return (
                    t &&
                    "object" == typeof t &&
                    1 === t.nodeType &&
                    "string" == typeof t.nodeName
                );
            },
            l = Array.prototype.indexOf ?

            function(t, e) {
                return t.indexOf(e);
            } :
            function(t, e) {
                for (var i = 0, o = t.length; o > i; i++)
                    if (t[i] === e) return i;
                return -1;
            };
        "function" == typeof define && define.amd ?
            define(
                "outlayer/outlayer", [
                    "eventie/eventie",
                    "doc-ready/doc-ready",
                    "eventEmitter/EventEmitter",
                    "get-size/get-size",
                    "matches-selector/matches-selector",
                    "./item",
                ],
                s
            ) :
            (t.Outlayer = s(
                t.eventie,
                t.docReady,
                t.EventEmitter,
                t.getSize,
                t.matchesSelector,
                t.Outlayer.Item
            ));
    })(window),
    (function(t) {
        function e(t) {
            function e() {
                t.Item.apply(this, arguments);
            }
            (e.prototype = new t.Item()),
            (e.prototype._create = function() {
                (this.id = this.layout.itemGUID++),
                t.Item.prototype._create.call(this),
                    (this.sortData = {});
            }),
            (e.prototype.updateSortData = function() {
                if (!this.isIgnored) {
                    (this.sortData.id = this.id),
                    (this.sortData["original-order"] = this.id),
                    (this.sortData.random = Math.random());
                    var t = this.layout.options.getSortData,
                        e = this.layout._sorters;
                    for (var i in t) {
                        var o = e[i];
                        this.sortData[i] = o(this.element, this);
                    }
                }
            });
            var i = e.prototype.destroy;
            return (
                (e.prototype.destroy = function() {
                    i.apply(this, arguments), this.css({ display: "" });
                }),
                e
            );
        }
        "function" == typeof define && define.amd ?
            define("isotope/js/item", ["outlayer/outlayer"], e) :
            ((t.Isotope = t.Isotope || {}), (t.Isotope.Item = e(t.Outlayer)));
    })(window),
    (function(t) {
        function e(t, e) {
            function i(t) {
                (this.isotope = t),
                t &&
                    ((this.options = t.options[this.namespace]),
                        (this.element = t.element),
                        (this.items = t.filteredItems),
                        (this.size = t.size));
            }
            return (
                (function() {
                    function t(t) {
                        return function() {
                            return e.prototype[t].apply(this.isotope, arguments);
                        };
                    }
                    for (
                        var o = [
                                "_resetLayout",
                                "_getItemLayoutPosition",
                                "_manageStamp",
                                "_getContainerSize",
                                "_getElementOffset",
                                "needsResizeLayout",
                            ],
                            n = 0,
                            r = o.length; r > n; n++
                    ) {
                        var s = o[n];
                        i.prototype[s] = t(s);
                    }
                })(),
                (i.prototype.needsVerticalResizeLayout = function() {
                    var e = t(this.isotope.element),
                        i = this.isotope.size && e;
                    return i && e.innerHeight !== this.isotope.size.innerHeight;
                }),
                (i.prototype._getMeasurement = function() {
                    this.isotope._getMeasurement.apply(this, arguments);
                }),
                (i.prototype.getColumnWidth = function() {
                    this.getSegmentSize("column", "Width");
                }),
                (i.prototype.getRowHeight = function() {
                    this.getSegmentSize("row", "Height");
                }),
                (i.prototype.getSegmentSize = function(t, e) {
                    var i = t + e,
                        o = "outer" + e;
                    if ((this._getMeasurement(i, o), !this[i])) {
                        var n = this.getFirstItemSize();
                        this[i] = (n && n[o]) || this.isotope.size["inner" + e];
                    }
                }),
                (i.prototype.getFirstItemSize = function() {
                    var e = this.isotope.filteredItems[0];
                    return e && e.element && t(e.element);
                }),
                (i.prototype.layout = function() {
                    this.isotope.layout.apply(this.isotope, arguments);
                }),
                (i.prototype.getSize = function() {
                    this.isotope.getSize(), (this.size = this.isotope.size);
                }),
                (i.modes = {}),
                (i.create = function(t, e) {
                    function o() {
                        i.apply(this, arguments);
                    }
                    return (
                        (o.prototype = new i()),
                        e && (o.options = e),
                        (o.prototype.namespace = t),
                        (i.modes[t] = o),
                        o
                    );
                }),
                i
            );
        }
        "function" == typeof define && define.amd ?
            define(
                "isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"],
                e
            ) :
            ((t.Isotope = t.Isotope || {}),
                (t.Isotope.LayoutMode = e(t.getSize, t.Outlayer)));
    })(window),
    (function(t) {
        function e(t, e) {
            var o = t.create("masonry");
            return (
                (o.prototype._resetLayout = function() {
                    this.getSize(),
                        this._getMeasurement("columnWidth", "outerWidth"),
                        this._getMeasurement("gutter", "outerWidth"),
                        this.measureColumns();
                    var t = this.cols;
                    for (this.colYs = []; t--;) this.colYs.push(0);
                    this.maxY = 0;
                }),
                (o.prototype.measureColumns = function() {
                    if ((this.getContainerWidth(), !this.columnWidth)) {
                        var t = this.items[0],
                            i = t && t.element;
                        this.columnWidth = (i && e(i).outerWidth) || this.containerWidth;
                    }
                    (this.columnWidth += this.gutter),
                    (this.cols = Math.floor(
                        (this.containerWidth + this.gutter) / this.columnWidth
                    )),
                    (this.cols = Math.max(this.cols, 1));
                }),
                (o.prototype.getContainerWidth = function() {
                    var t = this.options.isFitWidth ?
                        this.element.parentNode :
                        this.element,
                        i = e(t);
                    this.containerWidth = i && i.innerWidth;
                }),
                (o.prototype._getItemLayoutPosition = function(t) {
                    t.getSize();
                    var e = t.size.outerWidth % this.columnWidth,
                        o = e && 1 > e ? "round" : "ceil",
                        n = Math[o](t.size.outerWidth / this.columnWidth);
                    n = Math.min(n, this.cols);
                    for (
                        var r = this._getColGroup(n),
                            s = Math.min.apply(Math, r),
                            a = i(r, s),
                            u = { x: this.columnWidth * a, y: s },
                            p = s + t.size.outerHeight,
                            h = this.cols + 1 - r.length,
                            f = 0; h > f; f++
                    )
                        this.colYs[a + f] = p;
                    return u;
                }),
                (o.prototype._getColGroup = function(t) {
                    if (2 > t) return this.colYs;
                    for (var e = [], i = this.cols + 1 - t, o = 0; i > o; o++) {
                        var n = this.colYs.slice(o, o + t);
                        e[o] = Math.max.apply(Math, n);
                    }
                    return e;
                }),
                (o.prototype._manageStamp = function(t) {
                    var i = e(t),
                        o = this._getElementOffset(t),
                        n = this.options.isOriginLeft ? o.left : o.right,
                        r = n + i.outerWidth,
                        s = Math.floor(n / this.columnWidth);
                    s = Math.max(0, s);
                    var a = Math.floor(r / this.columnWidth);
                    (a -= r % this.columnWidth ? 0 : 1), (a = Math.min(this.cols - 1, a));
                    for (
                        var u =
                            (this.options.isOriginTop ? o.top : o.bottom) + i.outerHeight,
                            p = s; a >= p; p++
                    )
                        this.colYs[p] = Math.max(u, this.colYs[p]);
                }),
                (o.prototype._getContainerSize = function() {
                    this.maxY = Math.max.apply(Math, this.colYs);
                    var t = { height: this.maxY };
                    return (
                        this.options.isFitWidth && (t.width = this._getContainerFitWidth()),
                        t
                    );
                }),
                (o.prototype._getContainerFitWidth = function() {
                    for (var t = 0, e = this.cols; --e && 0 === this.colYs[e];) t++;
                    return (this.cols - t) * this.columnWidth - this.gutter;
                }),
                (o.prototype.needsResizeLayout = function() {
                    var t = this.containerWidth;
                    return this.getContainerWidth(), t !== this.containerWidth;
                }),
                o
            );
        }
        var i = Array.prototype.indexOf ?

            function(t, e) {
                return t.indexOf(e);
            } :
            function(t, e) {
                for (var i = 0, o = t.length; o > i; i++) {
                    var n = t[i];
                    if (n === e) return i;
                }
                return -1;
            };
        "function" == typeof define && define.amd ?
            define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size"], e) :
            (t.Masonry = e(t.Outlayer, t.getSize));
    })(window),
    (function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t;
        }

        function i(t, i) {
            var o = t.create("masonry"),
                n = o.prototype._getElementOffset,
                r = o.prototype.layout,
                s = o.prototype._getMeasurement;
            e(o.prototype, i.prototype),
                (o.prototype._getElementOffset = n),
                (o.prototype.layout = r),
                (o.prototype._getMeasurement = s);
            var a = o.prototype.measureColumns;
            o.prototype.measureColumns = function() {
                (this.items = this.isotope.filteredItems), a.call(this);
            };
            var u = o.prototype._manageStamp;
            return (
                (o.prototype._manageStamp = function() {
                    (this.options.isOriginLeft = this.isotope.options.isOriginLeft),
                    (this.options.isOriginTop = this.isotope.options.isOriginTop),
                    u.apply(this, arguments);
                }),
                o
            );
        }
        "function" == typeof define && define.amd ?
            define(
                "isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"],
                i
            ) :
            i(t.Isotope.LayoutMode, t.Masonry);
    })(window),
    (function(t) {
        function e(t) {
            var e = t.create("fitRows");
            return (
                (e.prototype._resetLayout = function() {
                    (this.x = 0), (this.y = 0), (this.maxY = 0);
                }),
                (e.prototype._getItemLayoutPosition = function(t) {
                    t.getSize(),
                        0 !== this.x &&
                        t.size.outerWidth + this.x > this.isotope.size.innerWidth &&
                        ((this.x = 0), (this.y = this.maxY));
                    var e = { x: this.x, y: this.y };
                    return (
                        (this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight)),
                        (this.x += t.size.outerWidth),
                        e
                    );
                }),
                (e.prototype._getContainerSize = function() {
                    return { height: this.maxY };
                }),
                e
            );
        }
        "function" == typeof define && define.amd ?
            define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], e) :
            e(t.Isotope.LayoutMode);
    })(window),
    (function(t) {
        function e(t) {
            var e = t.create("vertical", { horizontalAlignment: 0 });
            return (
                (e.prototype._resetLayout = function() {
                    this.y = 0;
                }),
                (e.prototype._getItemLayoutPosition = function(t) {
                    t.getSize();
                    var e =
                        (this.isotope.size.innerWidth - t.size.outerWidth) *
                        this.options.horizontalAlignment,
                        i = this.y;
                    return (this.y += t.size.outerHeight), { x: e, y: i };
                }),
                (e.prototype._getContainerSize = function() {
                    return { height: this.y };
                }),
                e
            );
        }
        "function" == typeof define && define.amd ?
            define("isotope/js/layout-modes/vertical", ["../layout-mode"], e) :
            e(t.Isotope.LayoutMode);
    })(window),
    (function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t;
        }

        function i(t) {
            return "[object Array]" === h.call(t);
        }

        function o(t) {
            var e = [];
            if (i(t)) e = t;
            else if (t && "number" == typeof t.length)
                for (var o = 0, n = t.length; n > o; o++) e.push(t[o]);
            else e.push(t);
            return e;
        }

        function n(t, e) {
            var i = f(e, t); -
            1 !== i && e.splice(i, 1);
        }

        function r(t, i, r, u, h) {
            function f(t, e) {
                return function(i, o) {
                    for (var n = 0, r = t.length; r > n; n++) {
                        var s = t[n],
                            a = i.sortData[s],
                            u = o.sortData[s];
                        if (a > u || u > a) {
                            var p = void 0 !== e[s] ? e[s] : e,
                                h = p ? 1 : -1;
                            return (a > u ? 1 : -1) * h;
                        }
                    }
                    return 0;
                };
            }
            var d = t.create("isotope", {
                layoutMode: "masonry",
                isJQueryFiltering: !0,
                sortAscending: !0,
            });
            (d.Item = u),
            (d.LayoutMode = h),
            (d.prototype._create = function() {
                (this.itemGUID = 0),
                (this._sorters = {}),
                this._getSorters(),
                    t.prototype._create.call(this),
                    (this.modes = {}),
                    (this.filteredItems = this.items),
                    (this.sortHistory = ["original-order"]);
                for (var e in h.modes) this._initLayoutMode(e);
            }),
            (d.prototype.reloadItems = function() {
                (this.itemGUID = 0), t.prototype.reloadItems.call(this);
            }),
            (d.prototype._itemize = function() {
                for (
                    var e = t.prototype._itemize.apply(this, arguments),
                        i = 0,
                        o = e.length; o > i; i++
                ) {
                    var n = e[i];
                    n.id = this.itemGUID++;
                }
                return this._updateItemsSortData(e), e;
            }),
            (d.prototype._initLayoutMode = function(t) {
                var i = h.modes[t],
                    o = this.options[t] || {};
                (this.options[t] = i.options ? e(i.options, o) : o),
                (this.modes[t] = new i(this));
            }),
            (d.prototype.layout = function() {
                return !this._isLayoutInited && this.options.isInitLayout ?
                    (this.arrange(), void 0) :
                    (this._layout(), void 0);
            }),
            (d.prototype._layout = function() {
                var t = this._getIsInstant();
                this._resetLayout(),
                    this._manageStamps(),
                    this.layoutItems(this.filteredItems, t),
                    (this._isLayoutInited = !0);
            }),
            (d.prototype.arrange = function(t) {
                this.option(t),
                    this._getIsInstant(),
                    (this.filteredItems = this._filter(this.items)),
                    this._sort(),
                    this._layout();
            }),
            (d.prototype._init = d.prototype.arrange),
            (d.prototype._getIsInstant = function() {
                var t =
                    void 0 !== this.options.isLayoutInstant ?
                    this.options.isLayoutInstant :
                    !this._isLayoutInited;
                return (this._isInstant = t), t;
            }),
            (d.prototype._filter = function(t) {
                function e() {
                    f.reveal(n), f.hide(r);
                }
                var i = this.options.filter;
                i = i || "*";
                for (
                    var o = [],
                        n = [],
                        r = [],
                        s = this._getFilterTest(i),
                        a = 0,
                        u = t.length; u > a; a++
                ) {
                    var p = t[a];
                    if (!p.isIgnored) {
                        var h = s(p);
                        h && o.push(p),
                            h && p.isHidden ? n.push(p) : h || p.isHidden || r.push(p);
                    }
                }
                var f = this;
                return this._isInstant ? this._noTransition(e) : e(), o;
            }),
            (d.prototype._getFilterTest = function(t) {
                return s && this.options.isJQueryFiltering ?

                    function(e) {
                        return s(e.element).is(t);
                    } :
                    "function" == typeof t ?

                    function(e) {
                        return t(e.element);
                    } :
                    function(e) {
                        return r(e.element, t);
                    };
            }),
            (d.prototype.updateSortData = function(t) {
                this._getSorters(), (t = o(t));
                var e = this.getItems(t);
                (e = e.length ? e : this.items), this._updateItemsSortData(e);
            }),
            (d.prototype._getSorters = function() {
                var t = this.options.getSortData;
                for (var e in t) {
                    var i = t[e];
                    this._sorters[e] = l(i);
                }
            }),
            (d.prototype._updateItemsSortData = function(t) {
                for (var e = 0, i = t.length; i > e; e++) {
                    var o = t[e];
                    o.updateSortData();
                }
            });
            var l = (function() {
                function t(t) {
                    if ("string" != typeof t) return t;
                    var i = a(t).split(" "),
                        o = i[0],
                        n = o.match(/^\[(.+)\]$/),
                        r = n && n[1],
                        s = e(r, o),
                        u = d.sortDataParsers[i[1]];
                    return (t = u ?

                        function(t) {
                            return t && u(s(t));
                        } :
                        function(t) {
                            return t && s(t);
                        });
                }

                function e(t, e) {
                    var i;
                    return (i = t ?

                        function(e) {
                            return e.getAttribute(t);
                        } :
                        function(t) {
                            var i = t.querySelector(e);
                            return i && p(i);
                        });
                }
                return t;
            })();
            (d.sortDataParsers = {
                parseInt: function(t) {
                    return parseInt(t, 10);
                },
                parseFloat: function(t) {
                    return parseFloat(t);
                },
            }),
            (d.prototype._sort = function() {
                var t = this.options.sortBy;
                if (t) {
                    var e = [].concat.apply(t, this.sortHistory),
                        i = f(e, this.options.sortAscending);
                    this.filteredItems.sort(i),
                        t !== this.sortHistory[0] && this.sortHistory.unshift(t);
                }
            }),
            (d.prototype._mode = function() {
                var t = this.options.layoutMode,
                    e = this.modes[t];
                if (!e) throw Error("No layout mode: " + t);
                return (e.options = this.options[t]), e;
            }),
            (d.prototype._resetLayout = function() {
                t.prototype._resetLayout.call(this), this._mode()._resetLayout();
            }),
            (d.prototype._getItemLayoutPosition = function(t) {
                return this._mode()._getItemLayoutPosition(t);
            }),
            (d.prototype._manageStamp = function(t) {
                this._mode()._manageStamp(t);
            }),
            (d.prototype._getContainerSize = function() {
                return this._mode()._getContainerSize();
            }),
            (d.prototype.needsResizeLayout = function() {
                return this._mode().needsResizeLayout();
            }),
            (d.prototype.appended = function(t) {
                var e = this.addItems(t);
                if (e.length) {
                    var i = this._filterRevealAdded(e);
                    this.filteredItems = this.filteredItems.concat(i);
                }
            }),
            (d.prototype.prepended = function(t) {
                var e = this._itemize(t);
                if (e.length) {
                    var i = this.items.slice(0);
                    (this.items = e.concat(i)),
                    this._resetLayout(),
                        this._manageStamps();
                    var o = this._filterRevealAdded(e);
                    this.layoutItems(i),
                        (this.filteredItems = o.concat(this.filteredItems));
                }
            }),
            (d.prototype._filterRevealAdded = function(t) {
                var e = this._noTransition(function() {
                    return this._filter(t);
                });
                return this.layoutItems(e, !0), this.reveal(e), t;
            }),
            (d.prototype.insert = function(t) {
                var e = this.addItems(t);
                if (e.length) {
                    var i,
                        o,
                        n = e.length;
                    for (i = 0; n > i; i++)
                        (o = e[i]), this.element.appendChild(o.element);
                    var r = this._filter(e);
                    for (
                        this._noTransition(function() {
                            this.hide(r);
                        }),
                        i = 0; n > i; i++
                    )
                        e[i].isLayoutInstant = !0;
                    for (this.arrange(), i = 0; n > i; i++) delete e[i].isLayoutInstant;
                    this.reveal(r);
                }
            });
            var c = d.prototype.remove;
            return (
                (d.prototype.remove = function(t) {
                    t = o(t);
                    var e = this.getItems(t);
                    if ((c.call(this, t), e && e.length))
                        for (var i = 0, r = e.length; r > i; i++) {
                            var s = e[i];
                            n(s, this.filteredItems);
                        }
                }),
                (d.prototype.shuffle = function() {
                    for (var t = 0, e = this.items.length; e > t; t++) {
                        var i = this.items[t];
                        i.sortData.random = Math.random();
                    }
                    (this.options.sortBy = "random"), this._sort(), this._layout();
                }),
                (d.prototype._noTransition = function(t) {
                    var e = this.options.transitionDuration;
                    this.options.transitionDuration = 0;
                    var i = t.call(this);
                    return (this.options.transitionDuration = e), i;
                }),
                (d.prototype.getFilteredItemElements = function() {
                    for (var t = [], e = 0, i = this.filteredItems.length; i > e; e++)
                        t.push(this.filteredItems[e].element);
                    return t;
                }),
                d
            );
        }
        var s = t.jQuery,
            a = String.prototype.trim ?

            function(t) {
                return t.trim();
            } :
            function(t) {
                return t.replace(/^\s+|\s+$/g, "");
            },
            u = document.documentElement,
            p = u.textContent ?

            function(t) {
                return t.textContent;
            } :
            function(t) {
                return t.innerText;
            },
            h = Object.prototype.toString,
            f = Array.prototype.indexOf ?

            function(t, e) {
                return t.indexOf(e);
            } :
            function(t, e) {
                for (var i = 0, o = t.length; o > i; i++)
                    if (t[i] === e) return i;
                return -1;
            };
        "function" == typeof define && define.amd ?
            define(
                [
                    "outlayer/outlayer",
                    "get-size/get-size",
                    "matches-selector/matches-selector",
                    "isotope/js/item",
                    "isotope/js/layout-mode",
                    "isotope/js/layout-modes/masonry",
                    "isotope/js/layout-modes/fit-rows",
                    "isotope/js/layout-modes/vertical",
                ],
                r
            ) :
            (t.Isotope = r(
                t.Outlayer,
                t.getSize,
                t.matchesSelector,
                t.Isotope.Item,
                t.Isotope.LayoutMode
            ));
    })(window);

/*
jQuery Lighter
Copyright 2015 Kevin Sylvestre
1.3.4
 */

(function() {
    "use strict";
    var $,
        Animation,
        Lighter,
        Slide,
        bind = function(fn, me) {
            return function() {
                return fn.apply(me, arguments);
            };
        };

    $ = jQuery;

    Animation = (function() {
        function Animation() {}

        Animation.transitions = {
            webkitTransition: "webkitTransitionEnd",
            mozTransition: "mozTransitionEnd",
            oTransition: "oTransitionEnd",
            transition: "transitionend",
        };

        Animation.transition = function($el) {
            var el, i, len, ref, result, type;
            for (i = 0, len = $el.length; i < len; i++) {
                el = $el[i];
                ref = this.transitions;
                for (type in ref) {
                    result = ref[type];
                    if (el.style[type] != null) {
                        return result;
                    }
                }
            }
        };

        Animation.execute = function($el, callback) {
            var transition;
            transition = this.transition($el);
            if (transition != null) {
                return $el.one(transition, callback);
            } else {
                return callback();
            }
        };

        return Animation;
    })();

    Slide = (function() {
        function Slide(url) {
            this.url = url;
        }

        Slide.prototype.type = function() {
            switch (false) {
                case !this.url.match(/\.(webp|jpeg|jpg|jpe|gif|png|bmp)$/i):
                    return "image";
                default:
                    return "unknown";
            }
        };

        Slide.prototype.preload = function(callback) {
            var image;
            image = new Image();
            image.src = this.url;
            return (image.onload = (function(_this) {
                return function() {
                    _this.dimensions = {
                        width: image.width,
                        height: image.height,
                    };
                    return callback(_this);
                };
            })(this));
        };

        Slide.prototype.$content = function() {
            return $("<img />").attr({
                src: this.url,
            });
        };

        return Slide;
    })();

    Lighter = (function() {
        Lighter.namespace = "lighter";

        Lighter.prototype.defaults = {
            loading: "#{Lighter.namespace}-loading",
            fetched: "#{Lighter.namespace}-fetched",
            padding: 40,
            dimensions: {
                width: 480,
                height: 480,
            },
            template: "<div class='" +
                Lighter.namespace +
                " " +
                Lighter.namespace +
                "-fade'>\n  <div class='" +
                Lighter.namespace +
                "-container'>\n    <span class='" +
                Lighter.namespace +
                "-content'></span>\n    <a class='" +
                Lighter.namespace +
                "-close'>&times;</a>\n    <a class='" +
                Lighter.namespace +
                "-prev'>&lsaquo;</a>\n    <a class='" +
                Lighter.namespace +
                "-next'>&rsaquo;</a>\n  </div>\n  <div class='" +
                Lighter.namespace +
                "-spinner'>\n    <div class='" +
                Lighter.namespace +
                "-dot'></div>\n    <div class='" +
                Lighter.namespace +
                "-dot'></div>\n    <div class='" +
                Lighter.namespace +
                "-dot'></div>\n  </div>\n  <div class='" +
                Lighter.namespace +
                "-overlay'></div>\n</div>",
        };

        Lighter.lighter = function($target, options) {
            var data;
            if (options == null) {
                options = {};
            }
            data = $target.data("_lighter");
            if (!data) {
                $target.data("_lighter", (data = new Lighter($target, options)));
            }
            return data;
        };

        Lighter.prototype.$ = function(selector) {
            return this.$el.find(selector);
        };

        function Lighter($target, settings) {
            if (settings == null) {
                settings = {};
            }
            this.show = bind(this.show, this);
            this.hide = bind(this.hide, this);
            this.observe = bind(this.observe, this);
            this.keyup = bind(this.keyup, this);
            this.size = bind(this.size, this);
            this.align = bind(this.align, this);
            this.process = bind(this.process, this);
            this.resize = bind(this.resize, this);
            this.type = bind(this.type, this);
            this.prev = bind(this.prev, this);
            this.next = bind(this.next, this);
            this.close = bind(this.close, this);
            this.$ = bind(this.$, this);
            this.$target = $target;
            this.settings = $.extend({}, this.defaults, settings);
            this.$el = $(this.settings.template);
            this.$overlay = this.$("." + Lighter.namespace + "-overlay");
            this.$content = this.$("." + Lighter.namespace + "-content");
            this.$container = this.$("." + Lighter.namespace + "-container");
            this.$close = this.$("." + Lighter.namespace + "-close");
            this.$prev = this.$("." + Lighter.namespace + "-prev");
            this.$next = this.$("." + Lighter.namespace + "-next");
            this.$body = this.$("." + Lighter.namespace + "-body");
            this.dimensions = this.settings.dimensions;
            this.process();
        }

        Lighter.prototype.close = function(event) {
            if (event != null) {
                event.preventDefault();
            }
            if (event != null) {
                event.stopPropagation();
            }
            return this.hide();
        };

        Lighter.prototype.next = function(event) {
            if (event != null) {
                event.preventDefault();
            }
            return event != null ? event.stopPropagation() : void 0;
        };

        Lighter.prototype.prev = function() {
            if (typeof event !== "undefined" && event !== null) {
                event.preventDefault();
            }
            return typeof event !== "undefined" && event !== null ?
                event.stopPropagation() :
                void 0;
        };

        Lighter.prototype.type = function(href) {
            if (href == null) {
                href = this.href();
            }
            return (
                this.settings.type ||
                (this.href().match(/\.(webp|jpeg|jpg|jpe|gif|png|bmp)$/i) ?
                    "image" :
                    void 0)
            );
        };

        Lighter.prototype.resize = function(dimensions) {
            this.dimensions = dimensions;
            return this.align();
        };

        Lighter.prototype.process = function() {
            var fetched, loading;
            fetched = (function(_this) {
                return function() {
                    return _this.$el
                        .removeClass(Lighter.namespace + "-loading")
                        .addClass(Lighter.namespace + "-fetched");
                };
            })(this);
            loading = (function(_this) {
                return function() {
                    return _this.$el
                        .removeClass(Lighter.namespace + "-fetched")
                        .addClass(Lighter.namespace + "-loading");
                };
            })(this);
            this.slide = new Slide(this.$target.attr("href"));
            loading();
            return this.slide.preload(
                (function(_this) {
                    return function(slide) {
                        _this.resize(slide.dimensions);
                        _this.$content.html(_this.slide.$content());
                        return fetched();
                    };
                })(this)
            );
        };

        Lighter.prototype.align = function() {
            var size;
            size = this.size();
            return this.$container.css({
                width: size.width,
                height: size.height,
                margin: "-" + size.height / 2 + "px -" + size.width / 2 + "px",
            });
        };

        Lighter.prototype.size = function() {
            var ratio;
            ratio = Math.max(
                this.dimensions.height / ($(window).height() - this.settings.padding),
                this.dimensions.width / ($(window).width() - this.settings.padding)
            );
            return {
                width: ratio > 1.0 ?
                    Math.round(this.dimensions.width / ratio) :
                    this.dimensions.width,
                height: ratio > 1.0 ?
                    Math.round(this.dimensions.height / ratio) :
                    this.dimensions.height,
            };
        };

        Lighter.prototype.keyup = function(event) {
            if (event.target.form != null) {
                return;
            }
            if (event.which === 27) {
                this.close();
            }
            if (event.which === 37) {
                this.prev();
            }
            if (event.which === 39) {
                return this.next();
            }
        };

        Lighter.prototype.observe = function(method) {
            if (method == null) {
                method = "on";
            }
            $(window)[method]("resize", this.align);
            $(document)[method]("keyup", this.keyup);
            this.$overlay[method]("click", this.close);
            this.$close[method]("click", this.close);
            this.$next[method]("click", this.next);
            return this.$prev[method]("click", this.prev);
        };

        Lighter.prototype.hide = function() {
            var alpha, omega;
            alpha = (function(_this) {
                return function() {
                    return _this.observe("off");
                };
            })(this);
            omega = (function(_this) {
                return function() {
                    return _this.$el.remove();
                };
            })(this);
            alpha();
            this.$el.position();
            this.$el.addClass(Lighter.namespace + "-fade");
            return Animation.execute(this.$el, omega);
        };

        Lighter.prototype.show = function() {
            var alpha, omega;
            omega = (function(_this) {
                return function() {
                    return _this.observe("on");
                };
            })(this);
            alpha = (function(_this) {
                return function() {
                    return $(document.body).append(_this.$el);
                };
            })(this);
            alpha();
            this.$el.position();
            this.$el.removeClass(Lighter.namespace + "-fade");
            return Animation.execute(this.$el, omega);
        };

        return Lighter;
    })();

    $.fn.extend({
        lighter: function(option) {
            if (option == null) {
                option = {};
            }
            return this.each(function() {
                var $this, action, options;
                $this = $(this);
                options = $.extend({},
                    $.fn.lighter.defaults,
                    typeof option === "object" && option
                );
                action = typeof option === "string" ? option : option.action;
                if (action == null) {
                    action = "show";
                }
                return Lighter.lighter($this, options)[action]();
            });
        },
    });

    $(document).on("click", "[data-lighter]", function(event) {
        event.preventDefault();
        event.stopPropagation();
        return $(this).lighter();
    });
}.call(this));

(function() {
    //duplicate hover state for parent menu when dropdown.
    jQuery("header ul.dropdown").hover(
        function() {
            $(this).parent().find("> a").addClass("expanded-menu");
        },
        function() {
            $(this).parent().find("> a").removeClass("expanded-menu");
        }
    );

    //mega menu position
    jQuery.fn.megamenu = function(width) {
        var $that = jQuery(this),
            $window = jQuery(window);

        function update() {
            $that.find(".megamenu").each(function() {
                var $this = jQuery(this),
                    windowW = $window.width(),
                    offSetLeft = $this.offset().left,
                    parentWidth = $this.width(),
                    megaMenuCols = $this.find("> .dropdown > li.has-dropdown").length,
                    megaMenuWidth,
                    mainMenuWidth = $(".mega-inside").width(),
                    dropdownWidth = 295,
                    longestMenu = 1;

                //fill in empty blanks if not equal length
                $this
                    .find("> .dropdown > li.has-dropdown > .dropdown")
                    .each(function() {
                        var currentLength = jQuery(this).find("> li").length;
                        if (currentLength > longestMenu) {
                            longestMenu = currentLength;
                        }
                    });

                $this
                    .find("> .dropdown > li.has-dropdown > .dropdown")
                    .each(function() {
                        var $dropdown = jQuery(this);
                        var currentLength = $dropdown.find("> li").length;
                        if (currentLength < longestMenu) {
                            for (var i = 1; i <= longestMenu - currentLength; i++) {
                                $dropdown.append('<li class="empty-megamenu"></li>');
                            }
                        }
                    });

                dropdownWidth = mainMenuWidth / megaMenuCols;
                var megaMenuWidth =
                    megaMenuCols * dropdownWidth > width ? width : mainMenuWidth,
                    blankGutterW =
                    windowW * 0.9 < width ? windowW * 0.05 : (windowW - width) / 2;

                //calculate default mega menu position - align in middle with parent item
                var megaMenuRight = megaMenuWidth / 2 - parentWidth / 2;

                //take care of mega menu position if it is pushed to outside of viewport
                megaMenuRight =
                    megaMenuWidth / 2 > offSetLeft + parentWidth / 2 - blankGutterW ?
                    width - (offSetLeft + parentWidth) :
                    megaMenuRight;
                var megaMenuPosition =
                    windowW - offSetLeft - parentWidth - blankGutterW;

                //finally set mega menu position
                if (windowW > 1300 || megaMenuRight > megaMenuPosition) {
                    megaMenuRight = megaMenuPosition;
                }

                $this
                    .find("> .dropdown > li.has-dropdown")
                    .css("width", dropdownWidth + "px");
                $this
                    .find("> .dropdown > li.has-dropdown > .dropdown")
                    .css({
                        width: dropdownWidth + "px",
                        "min-width": dropdownWidth + "px",
                    });
                $this.find("> .dropdown").css({
                    width: megaMenuWidth + "px",
                    right: -megaMenuRight + "px",
                });
            });

            //take care of offset issue for other dropdown
            $that
                .find("li:not(.megamenu).has-dropdown > .dropdown")
                .each(function() {
                    var $this = jQuery(this);
                    var windowW = jQuery(window).width(),
                        offSetLeft = $this.offset().left;
                    if ($this.width() + offSetLeft > windowW) {
                        $this.css({
                            left: "-100%",
                            "max-width": "100%",
                        });
                    }
                });
        }

        $(window).resize(update);
        update();
    };
    //end mega menu
    //set hover delay for mega menu item in case mouse is hovering on other menu items
    (function hoverdelay() {
        jQuery(".mega-inside:not(.expanded) .header-inn li.has-dropdown").each(
            function() {
                var $this = jQuery(this),
                    menuTimeoutShow,
                    menuTimeoutHide;
                $this.on("mouseenter tap", function(e) {
                    if (e.type == "tap") e.stopPropagation();
                    clearTimeout(menuTimeoutShow);
                    clearTimeout(menuTimeoutHide);

                    menuTimeoutShow = setTimeout(function() {
                        $this.addClass("hippo-menu-hovered");
                        if ($this.hasClass("hippo-menu-hovered")) {
                            $this.children("ul").stop().css("visibility", "visible").animate({
                                    opacity: 1,
                                },
                                200
                            );
                        }
                    }, 300);
                });
                $this.on("mouseleave", function(e) {
                    clearTimeout(menuTimeoutShow);
                    clearTimeout(menuTimeoutHide);
                    menuTimeoutHide = setTimeout(function() {
                        $this.removeClass("hippo-menu-hovered");
                        if (!$this.hasClass("hippo-menu-hovered")) {
                            $this.children("ul").css({
                                opacity: 0,
                                visibility: "hidden",
                            });
                        }
                    }, 300);
                });
            }
        );
    })(); //end hippo menu hover function
})(jQuery);

jQuery(".header-inn").megamenu(1200);

/*-----------------------------------------------------------------------------------*/
/*	Go TO TOP
/*-----------------------------------------------------------------------------------*/
var offset = 300,
    //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
    offset_opacity = 1200,
    //duration of the top scrolling animation (in ms)
    scroll_top_duration = 700,
    //grab the "back to top" link
    $back_to_top = $(".cd-top");

//hide or show the "back to top" link
$(window).scroll(function() {
    $(this).scrollTop() > offset ?
        $back_to_top.addClass("cd-is-visible") :
        $back_to_top.removeClass("cd-is-visible cd-fade-out");
    if ($(this).scrollTop() > offset_opacity) {
        $back_to_top.addClass("cd-fade-out");
    }
});
//smooth scroll to top
$back_to_top.on("click", function(event) {
    event.preventDefault();
    $("body,html").animate({
            scrollTop: 0,
        },
        scroll_top_duration
    );
});

/*-----------------------------------------------------------------------------------*/
/*    CONTACT FORM
/*-----------------------------------------------------------------------------------*/
function checkmail(input) {
    var pattern1 = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (pattern1.test(input)) {
        return true;
    } else {
        return false;
    }
}

function proceed() {
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var company = document.getElementById("company");
    var web = document.getElementById("website");
    var msg = document.getElementById("message");
    var errors = "";
    if (name.value == "") {
        name.className = "error";
        return false;
    } else if (email.value == "") {
        email.className = "error";
        return false;
    } else if (checkmail(email.value) == false) {
        alert("Please provide a valid email address.");
        return false;
    } else if (company.value == "") {
        company.className = "error";
        return false;
    } else if (web.value == "") {
        web.className = "error";
        return false;
    } else if (msg.value == "") {
        msg.className = "error";
        return false;
    } else {
        $.ajax({
            type: "POST",
            url: "php/submit.php",
            data: $("#contact_form").serialize(),
            success: function(msg) {
                //alert(msg);
                if (msg) {
                    $("#contact_form").fadeOut(1000);
                    $("#contact_message").fadeIn(1000);
                    document.getElementById("contact_message");
                    return true;
                }
            },
        });
    }
}

/*-----------------------------------------------------------------------------------*/
/* 		NAV
/*-----------------------------------------------------------------------------------*/
$("ul.nav li.dropdown").hover(
    function() {
        $(this).find(".dropdown-menu").stop(true, true).delay(100).fadeIn(400);
    },
    function() {
        $(this).find(".dropdown-menu").stop(true, true).delay(500).fadeOut(100);
    }
);