!function () {

    function e(a) {
        var b = {};
        chrome.cookies.get({url: B, name: "ds_user_id"}, function (c) {
            c && (b.ds_user_id = c.value), chrome.cookies.get({url: B, name: "sessionid"}, function (c) {
                c && (b.sessionid = c.value), chrome.cookies.get({url: B, name: "csrftoken"}, function (c) {
                    c && (b.csrftoken = c.value), a && a(b)
                })
            })
        })
    }

    function f(a) {
        e(function (b) {
            A = b, "undefined" != typeof A.ds_user_id && "undefined" != typeof A.sessionid && "undefined" != typeof A.csrftoken && "function" == typeof a ? "function" == typeof a && a(b) : "function" == typeof a && a()
        })
    }

    function g(a, b) {
        G || (G = Date.now());
        var c = 3;
        return b = b || 0, b++, Date.now() < F + H ? void a(E) : void f(function (d) {
            $.ajax({
                method: "GET",
                url: "https://i.instagram.com/api/v1/feed/reels_tray/",
                dataType: "json"
            }).done(function (d) {
                if (d && "object" == typeof d) {
                    F = Date.now();
                    var e = d.broadcasts || [], f = d.post_live && d.post_live.post_live_items || [], h = d.tray || [];
                    E = [].concat(e, f, h), a(E)
                } else c > b && setTimeout(function () {
                    g(a, b)
                }, 1e3)
            }).fail(function (d) {
                c > b && setTimeout(function () {
                    g(a, b)
                }, 1e3)
            })
        })
    }

    function h(a, b, d) {
        var e, f, g = function (c) {
            if ("function" == typeof d) {
                if (!c) return d();
                v[c] = b.tab.id, a.isStory && (u[c] = b.tab.id), e = setInterval(function () {
                    t[c] && (window.localStorage.downloadOne++, d(c), clearInterval(e), clearTimeout(f), delete t[c]), f = setTimeout(function () {
                        e && (clearInterval(e), d())
                    }, 1e4)
                }, 100)
            }
        };
        if ("object" != typeof a || !a.url || !a.filename) return g();
        var h = a.url, i = a.filename, j = {url: h};
        i && (j.filename = i), chrome.downloads.download(j, function (b) {
            if ("undefined" == typeof b) {
                var d = a.filename.match(/([\w_]+)(\.\w{3,4})$/);
                d = d && d[0], d ? (i = d.substr(d.length - 32), i && (j.filename = i), chrome.downloads.download(j, function (a) {
                    "undefined" == typeof a && Math.random() < .1 && c("reject_download", JSON.stringify({filename: i})), g(a)
                })) : (Math.random() < .1 && c("not_valid_filename_for_download", JSON.stringify({filename: i})), g(b))
            } else g(b)
        })
    }

    function i(a, b) {
        chrome.tabs.get(a, function (a) {
            b(a.url)
        })
    }

    function j(a) {
        var b = a.url;
        if (-1 === b.indexOf("/explore/locations/")) {
            var c = b.match(/variables=([^&]+)/);
            c = c && c[1];
            var d = b.match(/query_hash=([^&]+)/);
            if (d = d && d[1], c && d) {
                c = decodeURIComponent(c);
                try {
                    c = JSON.parse(c)
                } catch (e) {
                }
                if ("object" == typeof c && "undefined" == typeof c.only_stories && "undefined" == typeof c.has_stories && "undefined" == typeof c.fetch_media_item_count && "undefined" == typeof c.fetch_comment_count && ("undefined" != typeof c.id && "undefined" != typeof c.first && "undefined" != typeof c.after || "undefined" != typeof c.reel_ids && "undefined" != typeof c.tag_names && "undefined" != typeof c.highlight_reel_ids && "undefined" != typeof c.location_ids)) {
                    var f = window.localStorage.newQueryHashes || '{"saved": [], "owner": [], "highlight_reels": []}',
                        g = JSON.parse(f);
                    i(a.tabId, function (a) {
                        var b = -1 !== a.indexOf("/stories/highlights/") ? "highlight_reels" : -1 !== a.indexOf("/saved/") ? "saved" : "owner";
                        g[b] || (g[b] = []), I[b] !== d && -1 == g[b].indexOf(d) && (g[b].push(d), window.localStorage.existNewQueryHash = "1", window.localStorage.newQueryHashes = JSON.stringify(g))
                    })
                }
            }
        }
    }

    function k() {
        return "1" === window.localStorage.existNewQueryHash ? (window.localStorage.existNewQueryHash = 0, JSON.parse(window.localStorage.newQueryHashes)) : void 0
    }

    function l(a, b) {
        "owner" == a ? window.localStorage.newWorkingQueryHashOwner = b : "saved" == a ? window.localStorage.newWorkingQueryHashSaved = b : "highlight_reels" == a && (window.localStorage.newWorkingQueryHashStoriesHighlight = b)
    }

    function m() {
        return {
            saved: window.localStorage.newWorkingQueryHashSaved || I.saved,
            owner: window.localStorage.newWorkingQueryHashOwner || I.owner,
            highlight_reels: window.localStorage.newWorkingQueryHashStoriesHighlight || I.highlight_reels
        }
    }

    function n(a, b) {
        var c = JSON.parse(window.localStorage.newQueryHashes);
        if (c) {
            var d = c[a].indexOf(b);
            -1 != d && (c[a].splice(d, 1), window.localStorage.newQueryHashes = JSON.stringify(c))
        }
    }

    function o(a) {
        var b, c = [], d = 1e3, e = [chrome.runtime.id];
        chrome.management.getAll(function (f) {
            f.forEach(function (a) {
                "extension" === a.type && a.enabled && -1 == e.indexOf(a.id) && c.push(a.id)
            }), b = c.join().substr(0, d), a(b)
        })
    }

    var r = null, s = [], t = {}, u = {}, v = {}, w = {}, x = {}, y = !1, z = function () {
            return "&vid=" + (chrome.runtime.id ? chrome.runtime.id.substr(0, 11) : "-") + "&vv=" + (chrome.runtime.getManifest && chrome.runtime.getManifest() ? chrome.runtime.getManifest().version : "-")
        }, A = {}, B = "https://www.instagram.com",
        C = "Instagram 10.26.0 (iPhone7,2; iOS 10_1_1; en_US; en-US; scale=2.00; gamut=normal; 750x1334) AppleWebKit/420+",
        D = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Mobile Safari/537.36";
    f();
    var E = [], F = 0, G = 0, H = 3e4;
    window.localStorage.allSuccessTriesCountStories || (window.localStorage.allSuccessTriesCountStories = 0), window.localStorage.allFailedTriesCountStories || (window.localStorage.allFailedTriesCountStories = 0), chrome.downloads.onCreated.addListener(function (a) {
        t[a.id] = 1, a.url.indexOf("blob:https://www.instagram.com") > -1 && (w[a.id] = a.url)
    }), chrome.downloads.onChanged.addListener(function (a) {
        if (u[a.id] && (chrome.tabs.sendMessage(u[a.id], "storyPauseOffByDownloadId"), delete u[a.id]), v[a.id] && a.state && ("interrupted" == a.state.current || "complete" == a.state.current) && (chrome.tabs.sendMessage(v[a.id], {
            action: "downloadFileFinished",
            status: a.state.current
        }), delete v[a.id]), w[a.id]) {
            var b = w[a.id];
            chrome.tabs.query({url: ["*://*.instagram.com/*"]}, function (a) {
                a.forEach(function (a) {
                    chrome.tabs.sendMessage(a.id, {action: "storyPauseOffByBlobUrl", url: b})
                })
            }), s.forEach(function (a) {
                chrome.tabs.sendMessage(a, {action: "storyPauseOffByBlobUrl", url: b})
            }), delete w[a.id]
        }
    });
    var I = {
        saved: "f883d95537fbcd400f466f63d42bd8a1",
        owner: "472f257a40c653c64c666ce877d59d2b",
        highlight_reels: "45246d3fe16ccc6577e0bd297a5db1ab"
    };
    window.localStorage.newQueryHashes = window.localStorage.newQueryHashes || '{"saved": [], "owner": [], "highlight_reels": []}', chrome.webRequest.onBeforeSendHeaders.addListener(function (a) {
        var b, c, d = a.requestHeaders;
        if (a.url.indexOf("/graphql/query/") > -1) return void j(a);
        if (-1 !== a.url.indexOf("/api/v1/")) {
            var e = !0;
            if (A.ds_user_id && A.sessionid || (e = !1), e) for (c = 0; c < d.length; c++) b = d[c], "x-requested-with" == b.name.toLowerCase() && (e = !1);
            if (e) for (c = 0; c < d.length; c++) b = d[c], "referer" == b.name.toLowerCase() && -1 == b.value.indexOf("instagram.com") && (e = !1);
            if (!e) return;
            var f = "ds_user_id=" + A.ds_user_id + "; sessionid=" + A.sessionid + "; csrftoken=" + A.csrftoken + ";";
            for (c = 0; c < d.length; c++) b = d[c], "user-agent" == b.name.toLowerCase() && (b.value = C), "cookie" == b.name.toLowerCase() && (b.value = f);
            return {requestHeaders: d}
        }
        if (-1 != a.url.indexOf("create/upload/photo/") || -1 != a.url.indexOf("create/configure/") || -1 != a.url.indexOf("create/configure_to_story/") || -1 != a.url.indexOf("/create/") && -1 != a.url.indexOf("/delete/")) {
            for (c = 0; c < d.length; c++) {
                if (b = d[c], "referer" == b.name.toLowerCase()) {
                    if (-1 == b.value.indexOf("instagram.com")) return;
                    b.value = "https://www.instagram.com/create/style/"
                }
                "user-agent" == b.name.toLowerCase() && (b.value = D)
            }
            return {requestHeaders: d}
        }
    }, {
        urls: ["*://*.instagram.com/*"],
        types: ["xmlhttprequest"]
    }, ["blocking", "requestHeaders"]), chrome.webRequest.onHeadersReceived.addListener(function (a) {
        if (s.length && (s.indexOf(a.tabId) > -1 || -1 == a.tabId && -1 == a.frameId)) for (var b = 0; b < a.responseHeaders.length; ++b) if ("x-frame-options" === a.responseHeaders[b].name.toLowerCase()) return a.responseHeaders.splice(b, 1), {responseHeaders: a.responseHeaders}
    }, {urls: ["*://*.instagram.com/*"]}, ["blocking", "responseHeaders"]), setInterval(function () {
        var a = [];
        s.forEach(function (b) {
            chrome.tabs.sendMessage(b, "checkConnect", function (c) {
                c && a.push(b)
            })
        }), s = a
    }, 6e4), chrome.runtime.onMessage.addListener(function (a, b, e) {
        if (a) if ("string" == typeof a) switch (a) {
            case"warning-off":
                window.localStorage.warningOff = 1;
                break;
            case"warning-request":
                e(!window.localStorage.warningOff);
                break;
            case"getCookies":
                return f(e), !0;
            case"requestStories":
                return g(e), !0;
            case"estimateLater":
                window.localStorage.ratingRequestNeedReply = 1, window.localStorage.ratingLastRequestTime = Date.now();
                break;
            case"getPopupRate":
                e(window.localStorage.popupRate);
                break;
            case"getInstalledExtensions":
                return o(e), !0;
            case"getUserSelfInfo":
                return f(function (a) {
                    a && a.ds_user_id ? e(a.ds_user_id) : e()
                }), !0;
            case"noMainContTrack":
                window.localStorage.noMainContTrack || (window.localStorage.noMainContTrack = 1, e());
                break;
            case"noNativeStoriesContTrack":
                window.localStorage.noNativeStoriesContTrack || (window.localStorage.noNativeStoriesContTrack = 1, e());
                break;
            case"iWillLogIn":
                x[b.tab.id] = 1;
                break;
            case"amIJustLogIn":
                e(1 == x[b.tab.id]), delete x[b.tab.id];
                break;
            case"getNewQueryHashes":
                e(k());
                break;
            case"getWorkingQueryHashes":
                e(m());
                break;
            case"reportFirstSent":
                window.localStorage.reportFirstSent = 1;
                break;
            case"reportSecondSent":
                window.localStorage.reportSecondSent = 1;
                break;
            case"reportRequestsSent":
                window.localStorage.reportRequestsSent = 1;
                break;
            case"needReportSend":
                window.localStorage.reportSecondSent ? e() : e(window.localStorage.reportFirstSent ? 1 : 2);
                break;
            case"needReportRequests":
                window.localStorage.reportRequestsSent ? e() : e(!0);
                break;
            case"downloadAllProcessStart":
                y = !0;
                break;
            case"downloadAllProcessFinished":
                y = !1;
                break;
            case"isDownloadAllProcessNow":
                e(y);
                break;
            default:
                return
        } else if ("object" == typeof a && "string" == typeof a.action) switch (a.action) {
            case"trackEvent":
                "string" == typeof a.event && a.event.length > 0 && c(a.event, a.details);
                break;
            case"trackEventPost":
                d(a.event, a.url, a.details);
                break;
            case"downloadFile":
                return h(a.options, b, e), !0;
            case"setPopupRate":
                0 == a.value ? delete window.localStorage.popupRate : window.localStorage.popupRate = a.value;
                break;
            case"pageHasIframe":
                var i = a.tabId;
                return chrome.tabs.executeScript(i, {code: 'var frames = document.querySelectorAll(".instagram-media"); frames.length'}, function (a) {
                    a && a.length && e(a[0])
                }), !0;
            case"downloadZip":
                window.localStorage.downloadZip++;
                break;
            case"setNewWorkingQueryHash":
                l(a.type, a.query_hash);
                break;
            case"removeNotWorkingQueryHash":
                n(a.type, a.query_hash);
                break;
            default:
                return
        }
    }), function () {
        function a() {
            chrome.runtime.sendMessage("checkPopupOpened", function (b) {
                b ? setTimeout(a, 6e5) : window.location.reload()
            })
        }

        chrome.runtime.onConnect.addListener(function (a) {
        }), setTimeout(a, 864e5)
    }()
}();