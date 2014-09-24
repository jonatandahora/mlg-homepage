/**
 * Get the value of a cookie with the given key.
 *
 * @example jQuery.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String key The key of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name jQuery.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function (a, b, c) {
    if (arguments.length > 1 && String(b) !== "[object Object]") {
        c = jQuery.extend({}, c);
        if (b === null || b === void 0)c.expires = -1;
        if (typeof c.expires == "number") {
            var d = c.expires, e = c.expires = new Date;
            e.setDate(e.getDate() + d)
        }
        return b = String(b), document.cookie = [encodeURIComponent(a), "=", c.raw ? b : encodeURIComponent(b), c.expires ? "; expires=" + c.expires.toUTCString() : "", c.path ? "; path=" + c.path : "", c.domain ? "; domain=" + c.domain : "", c.secure ? "; secure" : ""].join("")
    }
    return c = b || {}, e = c.raw ? function (a) {
        return a
    } : decodeURIComponent, (d = RegExp("(?:^|; )" + encodeURIComponent(a) + "=([^;]*)").exec(document.cookie)) ? e(d[1]) : null
};
var split_domain = document.domain.split("."), subdomain = split_domain[0].split("-").reverse()[0], env = split_domain.slice(1).join("."), logo = "//www." + env + "/images/mlg-logo.png", login_url = "http://accounts." + env + "/?return_to=" + document.URL;
subdomain == "gamebattles" && (login_url = "http://" + split_domain[0] + "." + env + "/account/login?r=" + document.URL);
var buttons = [
    {name: '<img class="mlg-header-logo" src="' + logo + '"/>', url: "http://www." + env},
    {name: "watch", url: "http://tv." + env},
    {name: "play", url: "http://gamebattles." + env},
    {name: "events", url: "http://www." + env + "/seasons"},
    {name: "community", url: "http://gamebattles." + env + "/forums"},
    {name: "store", url: "http://store." + env},
    {name: "login / sign up", url: login_url}
], user = null;
jQuery.cookie("mlg_login") && (user = jQuery.cookie("mlg_login"));
var logout_url = "http://accounts." + env + "/logout?return_to=" + document.URL;
subdomain == "gamebattles" && (logout_url = "http://" + split_domain[0] + "." + env + "/account/logout?r=" + document.URL);
var dropdown = [];
dropdown.push({name: "my profile", url: "http://gamebattles." + env + "/profile/" + user}, {name: "edit profile", url: "http://gamebattles." + env + "/account/profile/"}, {name: "account settings", url: "http://accounts." + env}), $.cookie("mlg_streaming_partner") == "true" && dropdown.push({name: "streaming dashboard", url: "http://accounts." + env + "/account/stream_dashboard"}), dropdown.push({name: "messages", url: "http://gamebattles." + env + "/messages/inbox"}, {name: "team invites", url: "http://gamebattles." + env + "/messages/team_invites"}, {name: "friend invites", url: "http://gamebattles." + env + "/messages/friend_invites"}, {name: "prize claims", url: "http://gamebattles." + env + "/account/prizes"}, {name: "tickets & escalations", url: "http://gamebattles." + env + "/account/tickets"}, {name: "logout", url: logout_url}), jQuery(document).ready(function () {
    var a = new Header(logo, buttons, user, dropdown);
    a.user || a.startLoginPoller(), a.render("mlg-header"), jQuery("#mlg-header .login").click(function () {
        b(), jQuery("#mlg-header .user-dropdown").toggle()
    }), jQuery(document).click(function (a) {
        jQuery(a.target).is("#mlg-header .login, #mlg-header .username, #mlg-header .carret, #mlg-header .total-msg") || jQuery("#mlg-header .user-dropdown").hide()
    });
    var b = function () {
        jQuery("#mlg-header .user-dropdown").css("width", jQuery("#mlg-header .login").width() + 43 + "px")
    }
});
var Header = function (a, b, c, d) {
    var e = this;
    e.logo = a, e.buttons = b, e.dropdown = d, e.user = c, e.msg_count = null, e.team_invites = null, e.friend_invites = null, e.alerts = null, e.ajax_url = null, e.login_poller = null, e.checkLoggedIn = function () {
        e.user = jQuery.cookie("mlg_login"), e.user && (clearInterval(e.login_poller), e.login_check())
    }, e.startLoginPoller = function () {
        e.login_poller = setInterval(function () {
            e.checkLoggedIn()
        }, 1e3)
    }, e.render = function (a) {
        jQuery("#" + a).append(jQuery("<div/>").addClass("header-bg mlg-header-bg")), jQuery("#mlg-header .header-bg").append(jQuery("<div/>").addClass("top")), jQuery("#mlg-header .header-bg").append(jQuery("<div/>").addClass("bottom")), jQuery("#mlg-header .header-bg").append(jQuery("<div/>").addClass("header-content")), jQuery("#mlg-header .header-content").append(jQuery("<div/>").addClass("buttons")), e.populate()
    }, e.populate = function () {
        for (var a = 0; a < e.buttons.length; a++)jQuery("#mlg-header .buttons").append(jQuery("<div/>").addClass("button").html("<a class='link' href='" + e.buttons[a].url + "'>" + e.buttons[a].name + "</a>"));
        jQuery("#mlg-header .button:first-child").addClass("no-left-border"), jQuery("#mlg-header .button:last-child").addClass("login"), e.user && e.login_check()
    }, e.login_check = function () {
        jQuery("#mlg-header .login").html("<span class='username'>" + e.user + "</span><span class='total-msg'></span>"), jQuery("#mlg-header .login").append(jQuery("<b/>").addClass("carret")), jQuery("#mlg-header .login").append(jQuery("<div/>").addClass("user-dropdown"));
        for (var a = 0; a < e.dropdown.length; a++)jQuery("#mlg-header .user-dropdown").append(jQuery("<div/>").addClass("dropdown-button").html("<a class='dropdown-link " + e.makeSafeForCSS(e.dropdown[a].name) + "' href='" + e.dropdown[a].url + "'>" + e.dropdown[a].name + "</a>")), d[3].name == "streaming dashboard" ? (e.dropdown[a].name == "streaming dashboard" || e.dropdown[a].name == "tickets & escalations") && jQuery("#mlg-header .user-dropdown").append(jQuery("<div/>").addClass("dropdown-button dropdown-separator")) : (e.dropdown[a].name == "account settings" || e.dropdown[a].name == "tickets & escalations") && jQuery("#mlg-header .user-dropdown").append(jQuery("<div/>").addClass("dropdown-button dropdown-separator"));
        e.gb_check()
    }, window.msgCheck = function (a) {
        e.msgCheck(a)
    }, e.gb_check = function () {
        try {
            jQuery.ajax({url: "//gamebattles." + env + "/ajax/msg_check.php", data: {user: c}, type: "GET", dataType: "jsonp", jsonpCallback: "msgCheck", cache: !0})
        } catch (a) {
            typeof window.console != "undefined" && console.log("GB AJAX Error: ", err)
        }
    }, e.msgCheck = function (a) {
        e.total_msg = parseInt(a.msg_count) + parseInt(a.team_invites) + parseInt(a.friend_invites), e.gb_apply(e.total_msg, a.msg_count, a.team_invites, a.friend_invites, a.teams, a.community_alert, a.support_alert, a.timestamp)
    }, e.gb_apply = function (a, b, c, d, e, f, g, h) {
        a > 0 && (jQuery("#mlg-header .total-msg").text(" (" + a + ")"), b > 0 && jQuery("#mlg-header .user-dropdown .messages").html("messages (" + b + ")"), c > 0 && jQuery("#mlg-header .user-dropdown .team-invites").html("team invites (" + c + ")"), d > 0 && jQuery("#mlg-header .user-dropdown .friend-invites").html("friend invites (" + d + ")"));
        if (subdomain == "gamebattles") {
            e && insertUserTeams(e);
            if (!jQuery.cookie(h.toString())) {
                f.length > 0 && CPopupAlert.show(f), g.length > 0 && CPopupAlert.show(g);
                var i = new Date, j = 5;
                i.setTime(i.getTime() + j * 60 * 1e3), jQuery.cookie(h.toString(), "1", {expires: i})
            }
        }
    }, e.makeSafeForCSS = function (a) {
        return a.replace(/[^a-z0-9]/g, function (a) {
            var b = a.charCodeAt(0);
            return b == 32 ? "-" : b >= 65 && b <= 90 ? "_" + a.toLowerCase() : "__" + ("000" + b.toString(16)).slice(-4)
        })
    }
};