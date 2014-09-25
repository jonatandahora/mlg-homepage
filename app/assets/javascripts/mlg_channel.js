var MlgChannel = function (a, b, c) {
    c = c || null;
    var d = this;
    d.autoplay = function () {
        //return window.location.hostname.match(/^.*?-?(\w*)\./)[1] == "www" ? !1 : !0
    }, this.MLG_API_CLIENT = new MlgApiClient(a, b, "mlgChannel"), this.REFRESH_FINISHED = "refresh_finished", this.REFRESH_FAILED = "refresh_failed", this.current_channel_index = -1, this.channel_id = c, this.autoplay = d.autoplay(), this.parent_has_live_stream = !1, this.video_expanded = $("#page_type").val() == "tv" ? !0 : !1, this.sample_percent = 5, this.sample = 100 / this.sample_percent, this.expand_count = 0, this.min_concurrents = 100, this.page_type = $("#page_type").val(), d.on = function (a, b) {
        var c = this;
        a in c.MLG_API_CLIENT.event_listeners || (c.MLG_API_CLIENT.event_listeners[a] = []), c.MLG_API_CLIENT.event_listeners[a].push(b)
    }, d.trigger = function (a, b) {
        var c = this;
        a in c.MLG_API_CLIENT.event_listeners && $(c.MLG_API_CLIENT.event_listeners[a]).each(function (a, d) {
            d.apply(c, b)
        })
    }, d.on(d.REFRESH_FINISHED, function (a) {
        d.channel_id ? d.showSpecificChannel(d.afterShowChannels) : d.showChannels(d.afterShowChannels)
    }), d.on(d.REFRESH_FAILED, function (a) {
        d.noChannelsFound()
    }), d.hasLiveChannel = function () {
        for (var a = 0; a < d.MLG_API_CLIENT.channels.length; a++) {
            var b = d.MLG_API_CLIENT.channels[a];
            if (b["status"] != -1 && b.stream_featured && !b.is_hidden)return!0
        }
        return!1
    }, d.addChannel = function (a, b, c) {
        c = c || null;
        if ($("#channel-viewers-title-" + b.id) && b.viewers >= d.min_concurrents && b["status"] == 1) {
            var e = "        <span title='" + b.viewers.toLocaleString() + " viewers'>        <span id='viewer-count'>" + b.viewers.toLocaleString() + "</span>        </span>      ";
            $("#channel-viewers-title-" + b.id).html(e)
        } else $("#channel-viewers-title-" + b.id).html("");
        if (b.viewers >= d.min_concurrents && b["status"] == 1) {
            $(".viewer-count-" + b.id).html(b.viewers.toLocaleString());
            var f = "<div class='channel-viewers viewer-count-" + b.id + "' title='" + b.viewers.toLocaleString() + " viewers'>" + b.viewers.toLocaleString() + "</div>";
            $("#tv-home-concurrents-" + b.id).html(f)
        } else $(".viewer-count-" + b.id).parent().html(""), $("#tv-home-concurrents-" + b.id).html("");
        if (b.stream_name === null)return;
        var g = {1: "live", 2: "replay", "-1": "offline"}, h = "channel_" + a, i = g[b.status], j = "      <div id='" + h + "' class='channel' title='" + b.name + "'>        <div class='avatar'>          <img src='" + b.image_1_1 + "'/>        </div>        <div class='info'>          <p class='title'>" + b.name + "</p>          <p class='subtitle'>" + b.subtitle + "</p>        </div>        <div class='status " + i + "' title='" + i.toUpperCase() + "'></div>      </div>    ";
        $("#channels").append(j);
        if (c) {
            var k = d.MLG_API_CLIENT.channels[c];
            k["type"] != "team" && k["type"] != "network" && $("#" + h).attr("data-related-channel-url", b.url)
        }
    }, d.showChannels = function (a) {
        $("#channels").html("");
        if (!d.hasLiveChannel()) {
            d.noChannelsFound();
            return
        }
        for (var b = 0; b < d.MLG_API_CLIENT.channels.length; b++) {
            var c = d.MLG_API_CLIENT.channels[b];
            if (c.status === -1 || !c.stream_featured || c.is_hidden)continue;
            d.addChannel(b, c)
        }
        $(".channel").click(function () {
            var a = $(this).attr("id").split("_")[1];
            d.autoplay = !0, d.changeChannel(a)
        }), d.current_channel_index === -1 ? d.setCurrentChannel() : $("#channel_" + d.current_channel_index).addClass("active"), this.video_expanded == 1 && d.getStatusColors(), a()
    }, d.afterShowChannels = function () {
        $.cookie("video_expanded") == "true" && d.expandVideo()
    }, d.addRelatedChannels = function (a, b) {
        for (var c = 0; c < d.MLG_API_CLIENT.channels.length; c++) {
            var e = d.MLG_API_CLIENT.channels[c];
            $.inArray(e.id, b) > -1 && d.addChannel(c, e, a)
        }
    }, d.showSpecificChannel = function (a) {
        $("#channels").html("");
        var b = null;
        for (var c = 0; c < d.MLG_API_CLIENT.channels.length; c++) {
            var e = d.MLG_API_CLIENT.channels[c];
            if (e["id"] == d.channel_id) {
                b = c;
                break
            }
        }
        if (b === null) {
            d.noChannelsFound();
            return
        }
        var f = d.MLG_API_CLIENT.channels[b];
        f.stream_name && (d.parent_has_live_stream = !0, d.addChannel(b, f)), f.children.length && (d.parent_has_live_stream && $("#channels").append("<div id='related_channels_header'>Related Channels</div>"), d.addRelatedChannels(b, f.children)), $(".channel").click(function () {
            var a = $(this).attr("data-related-channel-url");
            if (typeof a != "undefined" && a !== !1)window.location.href = a; else {
                var b = $(this).attr("id").split("_")[1];
                d.changeChannel(b)
            }
        }), d.current_channel_index === -1 ? (d.changeBackground(f.image_background), d.changeChannel(b)) : $("#channel_" + d.current_channel_index).addClass("active"), a()
    }, d.changeChannel = function (a) {
        var b = d.MLG_API_CLIENT.channels[a], c = d.channel_id, e = d.getChannelById(d.channel_id), f = "";
        b.status === -1 ? f = "<img src='" + b.image_16_9_medium + "'/>" : f = b.embed_code.replace("/player/", "http://www.majorleaguegaming.com/player/"), $("#video").css({background: "#000"}), d.autoplay ? $("#video, #video-expanded").html(f) : ($("#video, #video-expanded").html("<a id='play_placeholder' href='#'><div style='width:100%;height:100%;'><div class='circle_one'><div class='play_triangle'></div></div></div></a>"), $("#video, #video-expanded").css({background: "url(" + b.image_16_9_medium + ")", "background-size": "cover"}), $("#video, #video-expanded").mouseover(function () {
            $(".circle_one, .play_triangle").stop().animate({opacity: "1"}, 500)
        }), $("#video, #video-expanded").mouseout(function () {
            $(".circle_one, .play_triangle").stop().animate({opacity: ".8"}, 500)
        })), $("#play_placeholder").click(function () {
            $("#video, #video-expanded").html(f), $("#video, #video-expanded").css({"background-image": "none", "background-color": "#151515"})
        });
        var g = "//www.majorleaguegaming.com/follows/follow_button?channel_id=" + b.id, h = "";
        b.viewers >= d.min_concurrents && b["status"] == 1 && (h = "        <span title='" + b.viewers.toLocaleString() + " viewers'>          <span id='viewer-count'>" + b.viewers.toLocaleString() + "</span>        </span>      ");
        var i = "";
        b["embed_code"] == null ? i = "" : i = b.embed_code.replace("/player/", "http://www.majorleaguegaming.com/player/");
        var j = b.subtitle.length > 50 ? b.subtitle.substring(0, 50) + "..." : b.subtitle, k = "      <div class='info'>        <div id='info-top'>          <div id='channel-info'><a href='" + b.url + "'>" + b.name + "</a><span id='subtitle'> - " + b.subtitle + "</span></div>          <div id='viewers-info'><span id='channel-viewers-title-" + b.id + "' class='channel-viewers-title'>" + h + "</span></div>        </div>        <div style='clear: both;'></div>        <div id='info-bottom'>          <iframe id='mlg_follow_iframe' src='" + g + "' scrolling='no' onload=\"this.style.visibility='visible';\"></iframe>          <a href='https://www.facebook.com/dialog/share?app_id=260637543981981&display=page&href=http%3A%2F%2Fwww.majorleaguegaming.com&redirect_uri=http%3A%2F%2Fwww.majorleaguegaming.com' target='_blank'><div class='share_button' id='facebook_share'></div></a>          <a href='https://twitter.com/home?status=I&#39;m%20watching%20" + b.name + "%20at%20MLG.tv' target='_blank'><div class='share_button' id='twitter_share'></div></a>          <a href='https://plus.google.com/share?url=I&#39;m%20watching%20" + b.name + "%20at%20MLG.tv' target='_blank'><div class='share_button' id='gplus_share'></div></a>          <div id='embed_share' class='share_button' data-toggle='popover' title='Channel embed code' data-content='" + i + "'></div>          <div id='playerShareBar'></div>        </div>      </div>    ";
        $("#channel-info").html(k), $("#embed_share").popover();
        var l = "";
        if (b["new_chat"] == 1) {
            var m = document.domain.split("."), n = m[0], o = m.slice(1).join(".");
            l = "http://chat." + o + "/" + b.id
        } else l = "//" + document.domain + "/chat/" + b.id;
        var p = "<iframe id='mlg_chat_iframe' frameborder='0' scrolling='no' src='" + l + "'></iframe>";
        $("#chat").html(p);
        if (c) {
            if (d.video_expanded == 1)return;
            if (e["type"] == "team" || e["type"] == "network")$("#channels-button").hasClass("active") || $("#channels-button").focus().click(); else switch (b.default_tab) {
                case"channels_tab":
                    $("#channels-button").hasClass("active") || $("#channels-button").focus().click();
                    break;
                case"chat_tab":
                    $("#chat-button").hasClass("active") || $("#chat-button").focus().click();
                    break;
                default:
            }
        }
        $("#channel_" + d.current_channel_index).removeClass("active"), $("#channel_" + a).addClass("active"), d.buildShareBar(), $("#share_button").click(function () {
            $("#playerShareBar-reaction0").click()
        }), $("#popout_button").click(function () {
            d.popoutVideo(f, b)
        }), d.current_channel_index = a
    }, d.changeBackground = function (a) {
        $("#dark-bg-thing").css("background-image", "url(" + a + ")")
    }, d.noChannelsFound = function () {
        $("#video").html(""), $("#channels").html("<p class='not-found'>Nenhum canal encontrado</p>"), $("#channel-info").html("<div class='info'><p>Offline</p></div>"), $("#chat").html("<p class='not-found'>No chat found</p>")
    }, d.getIndexFromFirstLiveChannel = function () {
        for (var a = 0; a < d.MLG_API_CLIENT.channels.length; a++) {
            var b = d.MLG_API_CLIENT.channels[a];
            if (b["status"] != -1 && b.stream_featured && !b.is_hidden)return a
        }
        return-1
    }, d.setCurrentChannel = function () {
        d.current_channel_index = d.getIndexFromFirstLiveChannel();
        if (d.current_channel_index === -1) {
            d.noChannelsFound();
            return
        }
        d.changeChannel(d.current_channel_index)
    }, d.buildShareBar = function () {
        var a = new gigya.socialize.UserAction, b = $("#channel-info .info p").text();
        a.setTitle("I'm watching " + b + " on MLG.tv"), a.setDescription("I'm watching " + b + " on MLG.tv"), a.setLinkBack(document.URL);
        var c = {userAction: a, shareButtons: [
            {provider: "share"}
        ], containerID: "playerShareBar"};
        gigya.socialize.showShareBarUI(c)
    }, d.onError = function (a) {
        alert("An error has occured: " + a.status + "; " + a.statusMessage)
    }, d.popoutVideo = function (a, b) {
        var c = "//" + window.location.hostname + "/player/popout/" + b.id, d = 672, e = 378, f = null, g = new Array(10), h = null, i = window.screen.width, j = window.screen.height, k = "resizable=yes,width=" + i + ",height=" + j + ",left=50,top=50,toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,directories=no,location=0", l = null;
        l = c.split("=").reverse()[0], l = l.replace(/[_\W]/g, "");
        if (g[l] == undefined || g[l].closed) {
            var m = 5, n = 100 / m;
            Math.floor(Math.random() * n + 1) == 1 && _gaq.push(["_trackEvent", "popout", c, null, n]), f = a, $("#video").html("<div class='popout-placeholder'>Reload Player</div>"), g[l] = window.open(c, l, k)
        } else g[l].focus();
        return $(".popout-placeholder").mouseover(function () {
            $(".popout-placeholder").addClass("popout-placeholder-hover")
        }), $(".popout-placeholder").mouseout(function () {
            $(".popout-placeholder").removeClass("popout-placeholder-hover")
        }), $(".popout-placeholder").click(function () {
            $("#video").html(f)
        }), clearInterval(h), h = setInterval(function () {
            g[l].closed && (clearInterval(h), $("#video").html(f))
        }, 1e3), !1
    }, $("#expand-button").click(function () {
        d.expandVideo()
    }), $("#shrink-button").click(function () {
        d.shrinkVideo()
    }), d.top_domain = document.domain.split(".").slice(-2).join("."), $.cookie("video_expanded") || $.cookie("video_expanded", "false", {expires: 365, path: "/", domain: "." + d.top_domain}), d.expandVideo = function () {
        $("#video").attr("id", "video-expanded"), $("#video-sidebar").attr("id", "video-sidebar-expanded"), $("#sidebar-content").attr("id", "sidebar-content-expanded"), $("#info-container").attr("id", "info-container-expanded"), $("#expand-button").attr("id", "shrink-button"), $("#shrink-button").off("click").click(function () {
            d.shrinkVideo()
        }), d.video_expanded = !0, d.selectedTab = $("#sidebar-nav .active").attr("id"), d.channel_width = $("#channels > .channel").width() + 16, d.showChannelsTab(), $("#dark-bg-thing").css({height: "" + d.getDarkBgHeight(0) + "px"}), $(".glyphicon-resize-full").addClass("glyphicon-resize-small").removeClass("glyphicon-resize-full"), d.getStatusColors(), Math.floor(Math.random() * d.sample + 1) == 1 && (d.expand_count += 1, _gaq.push(["_trackEvent", "video-expand", d.expand_count.toString(), null, d.sample])), d.parent_has_live_stream && $("#related_channels_header").html(""), $.cookie("video_expanded", "true", {expires: 365, path: "/", domain: "." + d.top_domain})
    }, d.showChannelsTab = function () {
        $("#channels-button").addClass("active"), $("#chat-button").removeClass("active"), $("#chat").css("display", "none"), $("#channels").css("display", "block")
    }, d.showChatTab = function () {
        $("#channels-button").removeClass("active"), $("#chat-button").addClass("active"), $("#chat").css("display", "block"), $("#channels").css("display", "none")
    }, d.getStatusColors = function () {
        $("#channels > .channel").css("width", "71px"), $("#channels > .channel").each(function (a, b) {
            var c = "#000", d = "-4px";
            $(this).children(".status").attr("title") == "LIVE" ? c = "#e51212" : $(this).children(".status").attr("title") == "REPLAY" ? c = "#ff5e00" : d = "0", $(this).css("box-shadow", "inset " + d + " 0 0 0 " + c)
        })
    }, d.shrinkVideo = function () {
        $("#channels .channel").attr("style", ""), $("#video-expanded").attr("id", "video"), $("#video-sidebar-expanded").attr("id", "video-sidebar"), $("#sidebar-content-expanded").attr("id", "sidebar-content"), $("#expand-button-expanded").attr("id", "expand-button"), $("#info-container-expanded").attr("id", "info-container"), $("#shrink-button").attr("id", "expand-button"), $("#expand-button").off("click").click(function () {
            d.expandVideo()
        }), $("#dark-bg-thing").css({height: "" + d.getDarkBgHeight(0) + "px"}), $(".glyphicon-resize-small").addClass("glyphicon-resize-full").removeClass("glyphicon-resize-small"), d.video_expanded = !1, $.cookie("video_expanded", "false", {expires: 365, path: "/", domain: "." + d.top_domain})
    }, d.getDarkBgHeight = function (a) {
        var b = $("#channel"), c = b.offset(), d = c.top + b.height() + a;
        return d
    }, d.getChannelById = function (a) {
        var b = null;
        for (var c = 0; c < d.MLG_API_CLIENT.channels.length; c++) {
            var e = d.MLG_API_CLIENT.channels[c];
            e["id"] == a && (b = e)
        }
        return b
    }
};