(function () {
    var a = !1, b = /xyz/.test(function () {
        xyz
    }) ? /\b_super\b/ : /.*/;
    this.Class = function () {
    }, Class.extend = function (c) {
        function g() {
            !a && this.init && this.init.apply(this, arguments)
        }

        var d = this.prototype;
        a = !0;
        var e = new this;
        a = !1;
        for (var f in c)e[f] = typeof c[f] == "function" && typeof d[f] == "function" && b.test(c[f]) ? function (a, b) {
            return function () {
                var c = this._super;
                this._super = d[a];
                var e = b.apply(this, arguments);
                return this._super = c, e
            }
        }(f, c[f]) : c[f];
        return g.prototype = e, g.prototype.constructor = g, g.extend = arguments.callee, g
    }
})();
var MlgObject = Class.extend({init: function () {
    var a = this;
    a.eventListeners = {}
}, on: function (a, b) {
    var c = this;
    a in c.eventListeners || (c.eventListeners[a] = []), c.eventListeners[a].push(b)
}, trigger: function (a, b) {
    var c = this;
    a in c.eventListeners && $(c.eventListeners[a]).each(function (a, d) {
        d.apply(c, b)
    })
}, log: function () {
    typeof window.console != "undefined" && console.log.apply(console, arguments)
}}), MlgModel = MlgObject.extend({init: function () {
    this._super()
}});