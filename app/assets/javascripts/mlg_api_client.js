var MlgApiClient = function (a, b, c) {
    var d = this;
    this.channels = [], this.event_listeners = {}, this.content_api_url = a, this.streams_api_url = b, this.KEY = c, this.CONTENT_LOADED = "content_loaded", this.STREAMS_LOADED = "streams_loaded", this.REFRESH_FINISHED = "refresh_finished", this.REFRESH_FAILED = "refresh_failed", this.is_refreshing = !1, d.on = function (a, b) {
        var c = this;
        a in c.event_listeners || (c.event_listeners[a] = []), c.event_listeners[a].push(b)
    }, d.trigger = function (a, b) {
        var c = this;
        a in c.event_listeners && $(c.event_listeners[a]).each(function (a, d) {
            d.apply(c, b)
        })
    }, d.on(d.CONTENT_LOADED, function (a) {
        d.getStreams()
    }), d.on(d.STREAMS_LOADED, function (a) {
        d.refreshFinished()
    }), d.getContentCallback = function (a) {
        var b = d.validateResponse(a);
        if (!b) {
            d.refreshFailed();
            return
        }
        var c = a.data.items;
        for (var e = 0; e < c.length; e++) {
            var f = c[e];
            f.status = -1, ["image_1_1", "image_16_9_small", "image_16_9_medium", "image_background"].map(function (a) {
                f[a] == null && (f[a] = "")
            }), d.channels.push(f)
        }
        if (Object.keys(d.channels).length == 0) {
            d.refreshFailed();
            return
        }
        d.trigger(d.CONTENT_LOADED, [])
    }, d.getStreamsCallback = function (a) {
        var b = d.validateResponse(a);
        if (!b) {
            d.refreshFailed();
            return
        }
        var c = a.data.items, e = {};
        for (var f = 0; f < c.length; f++) {
            var g = c[f], h = g.stream_name;
            e[h] = g.status
        }
        var c = a.data.items, i = {};
        for (var f = 0; f < c.length; f++) {
            var g = c[f], h = g.stream_name;
            viewers = g.viewers, i[h] = viewers
        }
        for (var f = 0; f < d.channels.length; f++) {
            var h = d.channels[f].stream_name;
            h in e && (d.channels[f].status = e[h]), d.channels[f].viewers = i[h]
        }
        var j = {1: 1, 2: 2, "-1": 3};
        d.channels.sort(function (a, b) {
            var c = j[a.status] - j[b.status];
            return c == 0 ? a.stream_sort_order - b.stream_sort_order : c
        }), d.trigger(d.STREAMS_LOADED, [])
    }, d.getContent = function () {
        if (d.is_refreshing)return;
        d.is_refreshing = !0, d.channels = [];
        var a = ["id", "name", "slug", "subtitle", "stream_name", "type", "default_tab", "is_hidden", "image_1_1", "image_16_9_small", "image_16_9_medium", "image_background", "url", "embed_code", "stream_featured", "stream_sort_order", "tags", "tag_names", "children", "description", "new_chat"], b = "?tags=MLG%20Brasil&fields=";
        for (var c = 0; c < a.length; c++)b += a[c], c < a.length - 1 && (b += ",");
        var e = "contentCallback" + d.KEY;
        window[e] = function (a) {
            d.getContentCallback(a)
        };
        var f = $.ajax({url: d.content_api_url + b, type: "GET", dataType: "jsonp", cache: !0, jsonpCallback: e, timeout: 15e3});
        f.error(function () {
            d.refreshFailed()
        })
    }, d.getStreams = function () {
        var a = "streamsCallback" + d.KEY;
        window[a] = function (a) {
            d.getStreamsCallback(a)
        };
        var b = $.ajax({url: d.streams_api_url, type: "GET", dataType: "jsonp", cache: !0, jsonpCallback: a, timeout: 15e3});
        b.error(function () {
            d.refreshFailed()
        })
    }, d.refreshFinished = function () {
        d.is_refreshing = !1, d.trigger(d.REFRESH_FINISHED, [])
    }, d.refreshFailed = function () {
        d.is_refreshing = !1, d.trigger(d.REFRESH_FAILED, [])
    }, d.validateResponse = function (a) {
        return a === undefined || a.data === undefined || !Object.keys(a.data).length || !a.data.items.length ? !1 : !0
    }
};