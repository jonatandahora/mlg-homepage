var MlgTvChannels = function (a, b) {
    var c = this;
    this.MLG_API_CLIENT = new MlgApiClient(a, b, "mlgTvChannel"), this.REFRESH_FINISHED = "refresh_finished", this.REFRESH_FAILED = "refresh_failed", c.on = function (a, b) {
        var c = this;
        a in c.MLG_API_CLIENT.event_listeners || (c.MLG_API_CLIENT.event_listeners[a] = []), c.MLG_API_CLIENT.event_listeners[a].push(b)
    }, c.trigger = function (a, b) {
        var c = this;
        a in c.MLG_API_CLIENT.event_listeners && $(c.MLG_API_CLIENT.event_listeners[a]).each(function (a, d) {
            d.apply(c, b)
        })
    }, c.on(c.REFRESH_FINISHED, function (a) {
        c.showChannels()
    }), c.on(c.REFRESH_FAILED, function (a) {
        c.noChannelsFound()
    }), c.showChannels = function () {
        $("#tv_channels").html("");
        var a = {1: "live", 2: "replay", "-1": "offline"}, b = "", d = "", e = "", f = 0, g = {};
        for (var h = 0; h < c.MLG_API_CLIENT.channels.length; h++) {
            var i = c.MLG_API_CLIENT.channels[h];
            if (i.is_hidden || i.stream_name === null) {
                f++;
                continue
            }
            var j = "#";
            i.image_16_9_medium && (j = i.image_16_9_medium);
            var k = a[i.status], l = "", m = h - f;
            m >= 2 && m % 3 === 2 && (l += "break "), m >= 2 && m % 3 === 1 && (l += "last "), $.each(i.tag_names, function (a, b) {
                g[b] ? g[b]++ : g[b] = 1;
                var c = b.split(" ").join("");
                l += "filter-type-" + c + " "
            }), l += "channels";
            var n = "";
            i.viewers >= 100 && i["status"] == 1 && (n = "<div class='channel-viewers viewer-count-" + i.id + "' title='" + i.viewers.toLocaleString() + " viewers'>" + i.viewers.toLocaleString() + "</div>"), b = "        <a href ='" + i.url + "'>          <div class='" + l + "'>            <img class='channel-image' data-src='" + j + "' data-loaded='false' src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'/>            <span id='tv-home-concurrents-" + i.id + "'>" + n + "</span>            <div class='hover-box'><h2>" + i.name + "</h2><div class='description'>" + i.description + "</div></div>            <div class='tv-listing-under-channel'><span class='" + k + "'>" + k.toUpperCase() + "</span> - " + i.subtitle + "</div>          </div>        </a>      ", k == "offline" ? e += b : d += b
        }
        var o = "<a class='tag-link tag-link-selected' id='tag-link-all' >All</a>", p = Object.keys(g), q = new Array;
        $.each(g, function (a, b) {
            q.push({name: a, count: b})
        }), q.sort(function (a, b) {
            return b.count - a.count
        });
        for (var h = 0; h < q.length; h++) {
            if (h == 6)break;
            var r = q[h].name.split(" ").join("");
            o += "<a class='tag-link' id='tag-link-" + r + "' >" + q[h].name + "</a>"
        }
        $("#tag-list").html(o), $("#tv_channels").html(d), c.insertShowOfflineChannelsButton(e), $(".description").ellipsis(), c.lazyLoadChannelImages(), $(window).scroll(function () {
            c.lazyLoadChannelImages()
        }), $(".tag-link").click(function () {
            var a = $(this).attr("id"), b = "filter-type-" + a.substring(9);
            b == "filter-type-all" ? ($(".channels").show(), $("#tv_channels").html(d), c.sendShowOfflineGa = !0, c.insertShowOfflineChannelsButton(e)) : (c.sendShowOfflineGa = !1, $("#view_offline_button").click(), $(".channels").hide(), $("." + b).show()), $(".tag-link").removeClass("tag-link-selected"), $("#" + a).addClass("tag-link-selected");
            var f = 0;
            $(".channels").removeClass("break"), $(".channels").removeClass("last"), channels_array = $(".channels"), channels_array.each(function (a) {
                $(this).is(":visible") && (f >= 2 && f % 3 === 2 && $(this).addClass("break"), f >= 2 && f % 3 === 1 && $(this).addClass("last"), f++)
            }), c.lazyLoadChannelImages()
        })
    }, c.noChannelsFound = function () {
        $("#tv_channels").html("<p class='loading'>No channels found</p>")
    }, c.lazyLoadChannelImages = function () {
        $(".channel-image").each(function () {
            var a = $(this);
            c.isInView(this) && a.attr("data-loaded") == "false" && (a.attr("src", a.attr("data-src")), a.attr("data-loaded", "true"))
        })
    }, c.isInView = function (a) {
        var b = $(window).scrollTop() + $(window).height(), c = $(a).offset().top;
        return b >= c
    }, c.sendShowOfflineGa = !0, c.insertShowOfflineChannelsButton = function (a) {
        $("#tv_channels_container").append("<div id='view_offline_button'>Show Offline Channels</div>"), $("#view_offline_button").click(function () {
            $("#tv_channels").append(a), c.lazyLoadChannelImages(), $(this).remove();
            if (c.sendShowOfflineGa) {
                var b = 5, d = 100 / b;
                Math.floor(Math.random() * d + 1) == 1 && _gaq.push(["_trackEvent", "tv_home_show_offline", "null", null, d])
            }
        })
    }
};