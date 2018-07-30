!function () {
    window.globalUtils = {
        queryHashesFailed429: 0,
        workingQueryHashOwner: null,
        workingQueryHashSaved: null,
        workingQueryHashStoriesHighlight: null,
        queryHashes: [],
        queryHashForTryNow: null,
        zipCanceledCheckInterval: 0,
        firstParamRequestJSONgraphqlQuery: 48,
        trackFailsShortCode: 0,
        trackFailsReelMedia: !1,
        trackMultiplePostsLi: !1,
        requestsStats: {
            JgraphqlMain: {a: 0, f: 0, d: 0, dS: 0},
            HgraphqlMain: {a: 0, f: 0, d: 0, dS: 0},
            JgraphqlUser: {a: 0, f: 0, d: 0, dS: 0},
            HgraphqlUser: {a: 0, f: 0, d: 0, dS: 0},
            JgraphqlQuery: {a: 0, f: 0, d: 0, dS: 0},
            JgraphqlShortCode: {a: 0, f: 0, d: 0, dS: 0},
            HgraphqlShortCode: {a: 0, f: 0, d: 0, dS: 0}
        },
        domStats: {dlBtn: 0, dlBtnAll: 0, stB: 0},
        clickStats: {dlBtn: 0, dlBtnSt: 0, dlBtnAll: 0},
        resStats: {dC: 0, dI: 0},
        domState: [],
        requestJSONgraphqlMain: function (a) {
            if ("function" == typeof a) {
                var b = "https://www.instagram.com/?__a=1";
                globalUtils.requestsStats.JgraphqlMain.a++, $.ajax({url: b, dataType: "json"}).done(function (c) {
                    globalUtils.requestsStats.JgraphqlMain.d++;
                    var d;
                    if (/^<!DOCTYPE\s+html>/.test(c)) {
                        var e = globalUtils.get_sharedDataFromHTML(c, b);
                        e && (d = globalUtils.getGraphQlFromSharedData(e, b))
                    } else if ("object" != typeof c) try {
                        d = JSON.parse(c)
                    } catch (f) {
                    } else d = c;
                    return d && (d.graphql || d.captcha) ? (globalUtils.requestsStats.JgraphqlMain.dS++, void a(d)) : a({error: 1})
                }).fail(function (c) {
                    return globalUtils.requestsStats.JgraphqlMain.f++, globalUtils.trackFailedAjaxRequest({
                        method: "requestJSONgraphqlMain",
                        url: b,
                        res: c,
                        random: 1e-5
                    }), a({error: 1})
                })
            }
        },
        requestHTMLgraphqlMain: function (a) {
            if ("function" == typeof a) {
                globalUtils.requestsStats.HgraphqlMain.a++;
                var b = "https://www.instagram.com/";
                $.ajax(b).done(function (c) {
                    return globalUtils.requestsStats.HgraphqlMain.d++, c && c.length && /_sharedData/.test(c) ? (globalUtils.requestsStats.HgraphqlMain.dS++, void a(c)) : (globalUtils.trackUnknownAjaxResponse({
                        method: "requestHTMLgraphqlMain",
                        url: b,
                        data: c,
                        random: .001
                    }), a({error: 1}))
                }).fail(function (c) {
                    globalUtils.requestsStats.HgraphqlMain.f++, globalUtils.trackFailedAjaxRequest({
                        method: "requestHTMLgraphqlMain",
                        url: b,
                        res: c,
                        random: 1e-4
                    }), a({error: 1})
                })
            }
        },
        requestJSONgraphqlUser: function (a, b) {
            return globalUtils.requestHTMLgraphqlUser(a, b)
        },
        requestHTMLgraphqlUser: function (a, b) {
            if ("string" == typeof a && "function" == typeof b) {
                var c = "https://www.instagram.com/" + a + "/";
                globalUtils.requestsStats.HgraphqlUser.a++, $.ajax(c).done(function (a) {
                    if (globalUtils.requestsStats.HgraphqlUser.d++, !a || !a.length || !/_sharedData/.test(a)) return globalUtils.trackUnknownAjaxResponse({
                        method: "requestHTMLgraphqlUser",
                        url: c,
                        data: a,
                        random: .01
                    }), b({error: 1});
                    var d = globalUtils.get_sharedDataFromHTML(a, c);
                    if (!d) return b({error: 1});
                    var e = globalUtils.getGraphQlFromSharedData(d, c);
                    return e && e.graphql ? (globalUtils.requestsStats.HgraphqlUser.dS++, void b(e)) : b({error: 1})
                }).fail(function (a) {
                    return globalUtils.requestsStats.HgraphqlUser.f++, globalUtils.trackFailedAjaxRequest({
                        method: "requestHTMLgraphqlUser",
                        url: c,
                        res: a,
                        random: .01
                    }), b({error: 1})
                })
            }
        },
        requestJSONgraphqlQuery: function (a, b) {
            if ("function" == typeof b) {
                var c, d, e, f = "string" == typeof a.highlight_reel_id;
                if (f) c = "highlight_reels", e = '{"reel_ids":[],"tag_names":[],"location_ids":[],"highlight_reel_ids":["' + a.highlight_reel_id + '"],"precomposed_overlay":false}', d = globalUtils.workingQueryHashStoriesHighlight; else {
                    var g = a.user_id, h = a.end_cursor, i = a.touch, j = a.from_saved;
                    c = j ? "saved" : "owner";
                    var k = a.first || globalUtils.firstParamRequestJSONgraphqlQuery;
                    e = '{"id":"' + g + '","first":' + k + ',"after":"' + h + '"}', d = j ? globalUtils.workingQueryHashSaved : globalUtils.workingQueryHashOwner
                }
                null !== globalUtils.queryHashForTryNow && (d = globalUtils.queryHashForTryNow, globalUtils.queryHashForTryNow = null);
                var l = "https://www.instagram.com/graphql/query/?query_hash=" + d + "&variables=" + encodeURI(e);
                globalUtils.requestsStats.JgraphqlQuery.a++, $.ajax({url: l, dataType: "json"}).done(function (a) {
                    globalUtils.requestsStats.JgraphqlQuery.d++, clearInterval(globalUtils.zipCanceledCheckInterval);
                    var e;
                    if ("object" != typeof a) try {
                        e = JSON.parse(a)
                    } catch (g) {
                    } else e = a;
                    return e || e.data ? (f && d != globalUtils.workingQueryHashStoriesHighlight ? (globalUtils.workingQueryHashStoriesHighlight = d, globalUtils.setNewWorkingQueryHash(d, c)) : j && d != globalUtils.workingQueryHashSaved ? (globalUtils.workingQueryHashSaved = d, globalUtils.setNewWorkingQueryHash(d, c)) : j || d == globalUtils.workingQueryHashOwner || (globalUtils.workingQueryHashOwner = d, globalUtils.setNewWorkingQueryHash(d, c)), globalUtils.queryHashesFailed429 = 0, globalUtils.requestsStats.JgraphqlQuery.dS++, void b(e)) : (globalUtils.trackUnknownAjaxResponse({
                        method: "requestJSONgraphqlQuery",
                        url: l,
                        data: a,
                        random: .01
                    }), b({error: 1}))
                }).fail(function (e) {
                    if (clearInterval(globalUtils.zipCanceledCheckInterval), 429 == e.status) {
                        if (i || globalUtils.queryHashesFailed429 > 5) return globalUtils.queryHashesFailed429 = 0, clearInterval(globalUtils.zipCanceledCheckInterval), b({error: 1});
                        globalUtils.queryHashesFailed429++;
                        var f = setTimeout(function () {
                            globalUtils.requestJSONgraphqlQuery(a, b)
                        }, 12e4 * globalUtils.queryHashesFailed429);
                        a.downloadZipObj && (globalUtils.zipCanceledCheckInterval = setInterval(function () {
                            a.downloadZipObj.zipCanceledByUser && (clearTimeout(f), clearInterval(globalUtils.zipCanceledCheckInterval), globalUtils.zipCanceledCheckInterval = null, b({cancel: 1}))
                        }, 1e3))
                    } else {
                        if (400 != e.status) return globalUtils.trackFailedAjaxRequest({
                            method: "requestJSONgraphqlQuery",
                            url: l,
                            res: e,
                            random: .01
                        }), b({error: 1});
                        e.responseJSON && (!e.responseJSON.message || "invalid query_hash" !== e.responseJSON.message && "execution failure" !== e.responseJSON.message) && globalUtils.trackEventWithRandom("requestJSONgraphqlQuery_unusual_400_response", {responseJSON: e.responseJSON}, .01), e.responseJSON && e.responseJSON.data && e.responseJSON.errors && e.responseJSON.message ? setTimeout(function () {
                            return globalUtils.firstParamRequestJSONgraphqlQuery = k / 2, globalUtils.firstParamRequestJSONgraphqlQuery < 12 ? b({error: 1}) : void globalUtils.requestJSONgraphqlQuery(a, b)
                        }, 500) : (globalUtils.removeNotWorkingQueryHash(d, c), globalUtils.queryHashes.length ? (globalUtils.queryHashForTryNow = globalUtils.queryHashes.shift(), globalUtils.requestJSONgraphqlQuery(a, b)) : globalUtils.getNewQueryHashes(function (d) {
                            return d && d[c] && d[c].length ? (globalUtils.queryHashes = d[c], globalUtils.queryHashForTryNow = globalUtils.queryHashes.shift(), void globalUtils.requestJSONgraphqlQuery(a, b)) : b({error: 1})
                        }))
                    }
                })
            }
        },
        requestJSONgraphqlByShortCode: function (a, b) {
            if ("string" == typeof a && a.length && "function" == typeof b) {
                var c = "https://www.instagram.com/p/" + a + "/?__a=1";
                return globalUtils.requestsStats.JgraphqlShortCode.a++, $.ajax({
                    url: c,
                    dataType: "json"
                }).done(function (d) {
                    globalUtils.requestsStats.JgraphqlShortCode.d++;
                    var e;
                    if (/^<!DOCTYPE\s+html>/.test(d)) {
                        var f = globalUtils.get_sharedDataFromHTML(d, c);
                        f && (e = globalUtils.getGraphQlFromSharedData(f, c))
                    } else if ("object" != typeof d) try {
                        e = JSON.parse(d)
                    } catch (g) {
                    } else e = d;
                    return e && e.graphql && e.graphql.shortcode_media ? (globalUtils.requestsStats.JgraphqlShortCode.dS++, void b(e)) : (globalUtils.trackUnknownAjaxResponse({
                        method: "requestJSONgraphqlByShortCode",
                        url: c,
                        data: d,
                        random: .001
                    }), globalUtils.requestHTMLgraphqlByShortCode(a, b))
                }).fail(function (d) {
                    return globalUtils.requestsStats.JgraphqlShortCode.f++, globalUtils.trackFailsShortCode < 3 && Math.random() < .001 && (globalUtils.trackFailsShortCode++, globalUtils.trackFailedAjaxRequest({
                        method: "requestJSONgraphqlByShortCode",
                        url: c,
                        res: d,
                        random: .1
                    })), 429 == d.status ? b({error: 1, reason: 429}) : globalUtils.requestHTMLgraphqlByShortCode(a, b)
                })
            }
        },
        requestHTMLgraphqlByShortCode: function (a, b) {
            if ("string" == typeof a && "function" == typeof b) {
                var c = "https://www.instagram.com/p/" + a;
                globalUtils.requestsStats.HgraphqlShortCode.a++, $.ajax(c).done(function (a) {
                    if (globalUtils.requestsStats.HgraphqlShortCode.d++, !a || !a.length || !/_sharedData/.test(a)) return globalUtils.trackUnknownAjaxResponse({
                        method: "requestHTMLgraphqlByShortCode",
                        url: c,
                        data: a,
                        random: .001
                    }), b({error: 1});
                    var d = globalUtils.get_sharedDataFromHTML(a, c);
                    if (!d) return b({error: 1});
                    var e = globalUtils.getGraphQlFromSharedData(d, c);
                    return e && e.graphql ? (globalUtils.requestsStats.HgraphqlShortCode.dS++, void b(e)) : (globalUtils.trackUnknownAjaxResponse({
                        method: "requestHTMLgraphqlByShortCode",
                        url: c,
                        data: a,
                        random: .001
                    }), b({error: 1}))
                }).fail(function (a) {
                    return globalUtils.requestsStats.HgraphqlShortCode.f++, globalUtils.trackFailsShortCode < 3 && Math.random() < .001 && (globalUtils.trackFailsShortCode++, globalUtils.trackFailedAjaxRequest({
                        method: "requestHTMLgraphqlByShortCode",
                        url: c,
                        res: a,
                        random: .1
                    })), b(429 == a.status ? {error: 1, reason: 429} : {error: 1})
                })
            }
        },
        get_sharedDataFromHTML: function (a, b) {
            var c, d;
            if ("string" != typeof a || !a.length) return null;
            a = a.replace(/[\r\n\t\s]/g, "");
            var e = a.indexOf("window._sharedData");
            if (-1 == e) return globalUtils.trackEventWithRandom("no_shared_data_start", {url: b}, .001), null;
            var f = a.indexOf("</script>", e);
            if (-1 == f) return globalUtils.trackEventWithRandom("no_shared_data_end", {url: b}, .001), null;
            var g = a.substr(e, f - e);
            if (c = g.match(/({.+);$/), c = c && c[1], !c) return globalUtils.trackEventWithRandom("no_shared_data_string", {url: b}, .001), null;
            try {
                d = JSON.parse(c)
            } catch (h) {
            }
            return d ? d : (globalUtils.trackEventWithRandom("error_JSON_parse_shared_data", {url: b}, .001), null)
        },
        getGraphQlFromSharedData: function (a, b) {
            return a && "object" == typeof a ? a.entry_data ? a.entry_data.PostPage ? a.entry_data.PostPage[0] : a.entry_data.ProfilePage ? a.entry_data.ProfilePage[0] : a.entry_data.FeedPage ? a.entry_data.FeedPage[0] : a.entry_data.LandingPage ? a.entry_data.LandingPage[0] : (globalUtils.trackEventWithRandom("error_get_graphql_from_shared_data", {url: b}, .001), null) : (globalUtils.trackEventWithRandom("no_entry_data_in_shared_data_object", {
                method: "getGraphQlFromSharedData",
                url: b
            }, .001), null) : (globalUtils.trackEventWithRandom("no_shared_data_object", {
                method: "getGraphQlFromSharedData",
                url: b
            }, .001), null)
        },
        getViewerFromSharedData: function (a, b) {
            return a && "object" == typeof a ? a.config ? a.config.viewer : (globalUtils.trackEventWithRandom("no_config_in_shared_data_object", {
                method: "getViewerFromSharedData",
                url: b
            }, .001), null) : (globalUtils.trackEventWithRandom("no_shared_data_object", {
                method: "getViewerFromSharedData",
                url: b
            }, .001), null)
        },
        getAuthorizedUserName: function (a) {
            globalUtils.requestJSONgraphqlMain(function (b) {
                if (b && b.graphql) try {
                    var c = b.graphql.user.username;
                    return a(c)
                } catch (d) {
                    globalUtils.trackEventWithRandom("error_in", {
                        method: "getAuthorizedUserName",
                        error: d,
                        data: b.graphql
                    }, .001)
                } else {
                    if (b.captcha) return a(null);
                    globalUtils.requestHTMLgraphqlMain(function (b) {
                        if (!b || !b.length) return a(null);
                        var c = globalUtils.get_sharedDataFromHTML(b, "https://www.instagram.com");
                        if (!c) return a(null);
                        var d = globalUtils.getViewerFromSharedData(c, "https://www.instagram.com");
                        return a(d && d.username ? d.username : null)
                    })
                }
            })
        },
        getPostsDataFromUserGraphql: function (a, b) {
            if ("function" == typeof b) {
                var c = a.userName, d = a.fromSaved;
                globalUtils.requestJSONgraphqlUser(c, function (e) {
                    if (!e || e.error) return b({error: 1});
                    try {
                        if (d) var f = e.graphql.user.edge_saved_media; else f = e.graphql.user.edge_owner_to_timeline_media;
                        var g = globalUtils.getShortCodesFromEdgeOwnerToTimelineMedia(f, a.advanced);
                        if (!g || "object" != typeof g || g.error) return b({error: 1});
                        g.userId = e.graphql.user.id, g.count = f.count
                    } catch (h) {
                        return globalUtils.trackEventWithRandom("error_in", {
                            method: "getPostsDataFromUserGraphql",
                            error: h,
                            userName: c,
                            json: e
                        }, .001), b({error: 1})
                    }
                    b(g)
                })
            }
        },
        getIgtvDataFromUserGraphql: function (a, b) {
            if ("function" == typeof b) {
                var c = a.userName;
                globalUtils.requestJSONgraphqlUser(c, function (d) {
                    if (!d || d.error) return b({error: 1});
                    try {
                        var e = d.graphql.user.edge_felix_video_timeline,
                            f = globalUtils.getIgtvDataFromEdgeFelixVideoTimeline(e, a.advanced);
                        if (!f || "object" != typeof f || f.error) return b({error: 1});
                        f.userId = d.graphql.user.id, f.count = e.count
                    } catch (g) {
                        return globalUtils.trackEventWithRandom("error_in", {
                            method: "getIgtvDataFromUserGraphql",
                            error: g,
                            userName: c,
                            json: d
                        }, .001), b({error: 1})
                    }
                    b(f)
                })
            }
        },
        getIgtvDataFromEdgeFelixVideoTimeline: function (a) {
            var b = [], c = !1, d = null, e = !1;
            try {
                var f = a.edges;
                f.length && f.forEach(function (a) {
                    if ("igtv" == a.node.product_type && a.node.display_url && a.node.shortcode) {
                        var c;
                        c = a.node.thumbnail_resources && a.node.thumbnail_resources[0] && a.node.thumbnail_resources[0].src ? a.node.thumbnail_resources[0].src : a.node.display_url, b.push({
                            display_url: c,
                            shortcode: a.node.shortcode,
                            title: a.node.title,
                            duration: a.node.video_duration
                        })
                    }
                }), c = a.page_info.has_next_page, d = a.page_info.end_cursor
            } catch (g) {
                return globalUtils.trackEventWithRandom("error_in", {
                    method: "getIgtvDataFromEdgeFelixVideoTimeline",
                    error: g,
                    url: window.location.href,
                    data: a
                }, .001), {error: 1}
            }
            return {media: b, end_cursor: d, has_next_page: c, time_end: e}
        },
        getPostsDataFromUserGraphqlOther: function (a, b) {
            globalUtils.requestJSONgraphqlQuery(a, function (c) {
                try {
                    if (a.from_saved) var d = c.data.user.edge_saved_media; else {
                        if (a.highlight_reel_id) return d = c.data.reels_media, f = globalUtils.getStoryItemsFromGraphql(d), b(f);
                        d = c.data.user.edge_owner_to_timeline_media
                    }
                } catch (e) {
                    return globalUtils.trackEventWithRandom("error_in", {
                        method: "getPostsDataFromUserGraphqlOther",
                        error: e,
                        options: a,
                        url: window.location.href,
                        json: c
                    }, .001), b()
                }
                var f = globalUtils.getShortCodesFromEdgeOwnerToTimelineMedia(d, a.advanced);
                b(f)
            })
        },
        getStoryItemsFromGraphql: function (a) {
            var b = [];
            return a[0].items.forEach(function (a) {
                try {
                    var c, d, e, f = 0, g = 0, h = a.is_video ? a.video_resources : a.display_resources;
                    if (!h || !Array.isArray(h)) return void globalUtils.trackEventWithRandom("no_mediaArray_in_story_graphql", "", .01);
                    if (h.forEach(function (a) {
                        try {
                            (a.config_width > f || a.config_height > g) && (f = a.config_width, g = a.config_height, c = a.src)
                        } catch (b) {
                            globalUtils.trackErrorParseAjaxResponse({
                                method: "getStoryItemsFromGraphql 1",
                                error: b,
                                data: a,
                                random: .01
                            })
                        }
                    }), !c) return void globalUtils.trackEventWithRandom("no_url_in_story_graphql", {mediaArray: h}, .01);
                    e = a.owner.username, d = globalUtils.getFileNameFromLink(c), b.push({
                        url: c,
                        filename: d,
                        username: e
                    })
                } catch (i) {
                    globalUtils.trackErrorParseAjaxResponse({
                        method: "getStoryItemsFromGraphql 2",
                        error: i,
                        data: a,
                        random: .01
                    })
                }
            }), b
        },
        getShortCodesFromEdgeOwnerToTimelineMedia: function (a, b) {
            var c = [], d = !1, e = null, f = !1;
            try {
                var g = a.edges;
                g.length && g.forEach(function (a) {
                    if (b) {
                        if (b.timeFrom && b.timeFrom > a.node.taken_at_timestamp) return void(f = !0);
                        if ("photo" == b.mediaType && "GraphVideo" == a.node.__typename || "video" == b.mediaType && "GraphImage" == a.node.__typename) return
                    }
                    c.push(a.node.shortcode)
                }), d = a.page_info.has_next_page, e = a.page_info.end_cursor
            } catch (h) {
                return globalUtils.trackEventWithRandom("error_in", {
                    method: "getShortCodesFromEdgeOwnerToTimelineMedia",
                    error: h,
                    url: window.location.href,
                    data: a
                }, .001), {error: 1}
            }
            return {shortcodes: c, end_cursor: e, has_next_page: d, time_end: f}
        },
        getMediaItemFromJsonGraphql: function (a, b, c) {
            "function" == typeof a && this.requestJSONgraphqlByShortCode(b, function (b) {
                try {
                    var d = b.graphql.shortcode_media.owner.username,
                        e = b.graphql.shortcode_media.location && b.graphql.shortcode_media.location.slug,
                        f = !!(b.graphql.shortcode_media.edge_sidecar_to_children && b.graphql.shortcode_media.edge_sidecar_to_children.edges && b.graphql.shortcode_media.edge_sidecar_to_children.edges.length);
                    if (f && "undefined" == typeof c && (c = "0"), "undefined" == typeof c) var g = globalUtils.getMediaDataFromJsonGraphqlItem(b.graphql.shortcode_media, d, e); else {
                        var h = b.graphql.shortcode_media.edge_sidecar_to_children.edges;
                        g = globalUtils.getMediaDataFromJsonGraphqlItem(h[c].node, d, e)
                    }
                } catch (i) {
                    globalUtils.trackErrorParseAjaxResponse({
                        method: "getMediaItemFromJsonGraphql",
                        error: i,
                        data: b,
                        random: .001
                    })
                }
                return a(g && g.url && g.filename ? g : {error: 1})
            })
        },
        getMediaDataFromJsonGraphqlItem: function (a, b, c) {
            var d, e, f, g, h;
            if (a.is_video) d = a.video_url, e = this.getFileNameFromVideoLink(d, b, c), f = "video", g = a.display_url, h = a.video_view_count; else {
                if (d = a.display_url, !d) {
                    var i = 0, j = 0;
                    a.display_resources.forEach(function (a) {
                        (a.config_width > i || a.config_height > j) && (i = a.config_width, j = a.config_height, d = a.src)
                    })
                }
                e = this.getFileNameFromImageLink(d, b, c), f = "photo", g = d
            }
            return {url: d, filename: e, type: f, prev: g, video_view_count: h}
        },
        getAllMediaDataFromJsonGraphql: function (a, b) {
            return this.requestJSONgraphqlByShortCode(b, function (b) {
                if (!b || b.error) return a(b);
                try {
                    var c = b.graphql.shortcode_media.owner.username,
                        d = b.graphql.shortcode_media.edge_media_preview_like.count,
                        e = b.graphql.shortcode_media.edge_sidecar_to_children && b.graphql.shortcode_media.edge_sidecar_to_children.edges,
                        f = [];
                    if (Array.isArray(e) && e.length) e.forEach(function (a) {
                        var b = globalUtils.getMediaDataFromJsonGraphqlItem(a.node, c);
                        "object" == typeof b && b.url && b.filename && b.type && b.prev && (b.likes_count = d, f.push(b))
                    }); else {
                        var g = globalUtils.getMediaDataFromJsonGraphqlItem(b.graphql.shortcode_media, c);
                        "object" == typeof g && g.url && g.filename && g.type && g.prev && (g.likes_count = d, f.push(g))
                    }
                    a(f)
                } catch (h) {
                    return globalUtils.trackErrorParseAjaxResponse({
                        method: "getAllMediaDataFromJsonGraphql",
                        error: h,
                        data: b,
                        random: .001
                    }), a({error: 1})
                }
            })
        },
        getFileNameFromLink: function (a, b) {
            return "string" != typeof a ? null : /\.(png|jpg)/.test(a) ? globalUtils.getFileNameFromImageLink(a, b) : /\.(mp4|flv)/.test(a) ? globalUtils.getFileNameFromVideoLink(a, b) : null
        },
        getFileNameFromVideoLink: function (a, b, c) {
            if ("string" != typeof a) return null;
            var d = "mp4";
            -1 !== a.indexOf(".flv") && (d = "flv");
            var e = a.match(/\/([^\/?]+)(?:$|\?)/);
            return e = e && e[1], e || (e = Math.floor(1e4 * Math.random()) + "noname." + d), b && (e = b + "_" + e), this.filename.modify(e)
        },
        getFileNameFromImageLink: function (a, b, c) {
            if ("string" != typeof a) return null;
            var d = "jpg";
            -1 !== a.indexOf(".png") && (d = "png");
            var e = a.match(/\/([^\/?]+)(?:$|\?)/);
            return e = e && e[1], e || (e = Math.floor(1e4 * Math.random()) + "_noname." + d), b && (e = b + "_" + e), this.filename.modify(e)
        },
        trackEvent: function (a, b) {
            var c = {action: "trackEvent", event: a};
            "undefined" != typeof b && (c.details = JSON.stringify(b)), chrome.runtime.sendMessage(c)
        },
        trackEventWithRandom: function (a, b, c) {
            c || (c = .05), Math.random() < c && this.trackEvent(a, b)
        },
        trackFailedAjaxRequest: function (a) {
            var b = a.res && JSON.stringify(a.res.responseJSON);
            b = b || a.res && a.res.responseText, b = b ? b.substr(0, 1500) : null;
            var c = a.res && a.res.status;
            globalUtils.trackEventWithRandom("fail_ajax_request", {
                method: a.method,
                url: a.url,
                resStatus: c,
                res: b
            }, a.random)
        },
        trackUnknownAjaxResponse: function (a) {
            globalUtils.trackEventWithRandom("unknown_ajax_response", {
                method: a.method,
                url: a.url,
                data: a.data
            }, a.random)
        },
        trackErrorParseAjaxResponse: function (a) {
            globalUtils.trackEventWithRandom("error_parse_ajax_response", {
                method: a.method,
                url: a.url,
                error: a.error,
                data: a.data
            }, a.random)
        },
        trackEventPost: function (a, b, c) {
            var d = {action: "trackEventPost", url: b, event: a, details: c};
            chrome.runtime.sendMessage(d)
        },
        trackCodeError: function (a, b) {
            return "object" != typeof JSON || "function" != typeof JSON.stringify ? void chrome.runtime.sendMessage({
                action: "trackEvent",
                event: "no_json_object"
            }) : void chrome.runtime.sendMessage({
                action: "trackEvent",
                event: "code_error",
                details: JSON.stringify({
                    method: b,
                    name: a.name,
                    message: a.message,
                    stack: a.stack,
                    additional_info: a.additional_info || ""
                })
            })
        },
        filename: {
            rtrim: /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            illegalRe: /[\/\?<>\\:\*\|"~]/g,
            controlRe: /[\x00-\x1f\x80-\x9f]/g,
            reservedRe: /^\.+/,
            partsRe: /^(.+)\.([a-z0-9]{1,4})$/i,
            specialChars: "nbsp,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,times,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,divide,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml".split(","),
            specialCharsList: [["amp", "quot", "lt", "gt"], [38, 34, 60, 62]],
            specialCharsRe: /&([^;]{2,6});/g,
            rnRe: /\r?\n/g,
            re1: /[\*\?"]/g,
            re2: /</g,
            re3: />/g,
            spaceRe: /[\s\t\uFEFF\xA0]+/g,
            dblRe: /(\.|!|\?|_|,|\-|:|\+){2,}/g,
            re4: /[\.,:;\/\-_\+=']$/g,
            decodeUnicodeEscapeSequence: function (a) {
                var b = /\\(\\u[0-9a-f]{4})/g;
                try {
                    return JSON.parse(JSON.stringify(a).replace(b, "$1"))
                } catch (c) {
                    return a
                }
            },
            decodeSpecialChars: function (a) {
                var b = this;
                return a.replace(this.specialCharsRe, function (a, c) {
                    var d = null;
                    if ("#" === c[0]) return d = parseInt(c.substr(1)), isNaN(d) ? "" : String.fromCharCode(d);
                    var e = b.specialCharsList[0].indexOf(c);
                    return -1 !== e ? (d = b.specialCharsList[1][e], String.fromCharCode(d)) : (e = b.specialChars.indexOf(c), -1 !== e ? (d = e + 160, String.fromCharCode(d)) : "")
                })
            },
            trim: function (a) {
                return a.replace(this.rtrim, "")
            },
            getParts: function (a) {
                return a.match(this.partsRe)
            },
            modify: function (a) {
                if (!a) return "";
                a = this.decodeUnicodeEscapeSequence(a);
                try {
                    a = decodeURIComponent(a)
                } catch (b) {
                    a = unescape(a)
                }
                if (a = this.decodeSpecialChars(a), a = a.replace(this.rnRe, " "), a = this.trim(a), a = a.replace(this.re1, "").replace(this.re2, "(").replace(this.re3, ")").replace(this.spaceRe, " ").replace(this.dblRe, "$1").replace(this.illegalRe, "_").replace(this.controlRe, "").replace(this.reservedRe, "").replace(this.re4, ""), a.length <= this.maxLength) return a;
                var c = this.getParts(a);
                return c && 3 == c.length ? (c[1] = c[1].substr(0, this.maxLength), c[1] + "." + c[2]) : a
            }
        },
        fixForeach: function () {
            "undefined" == typeof NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), "undefined" == typeof HTMLCollection.prototype.forEach && (HTMLCollection.prototype.forEach = Array.prototype.forEach)
        },
        isValidUrl: function (a) {
            return !("string" != typeof a || -1 != a.indexOf("blob:") || !a.match(/\.(png|jpg|mp4|flv)/))
        },
        isJqueryAjaxInstance: function (a) {
            return "object" == typeof a && a.hasOwnProperty("readyState") && "function" == typeof a.success
        },
        getNewQueryHashes: function (a) {
            chrome.runtime.sendMessage("getNewQueryHashes", a)
        },
        setNewWorkingQueryHash: function (a, b) {
            chrome.runtime.sendMessage({action: "setNewWorkingQueryHash", query_hash: a, type: b})
        },
        getWorkingQueryHashes: function () {
            chrome.runtime.sendMessage("getWorkingQueryHashes", function (a) {
                a && (globalUtils.workingQueryHashOwner = a.owner, globalUtils.workingQueryHashSaved = a.saved, globalUtils.workingQueryHashStoriesHighlight = a.highlight_reels)
            })
        },
        removeNotWorkingQueryHash: function (a, b) {
            chrome.runtime.sendMessage({action: "removeNotWorkingQueryHash", query_hash: a, type: b})
        },
        downloadFile: function (a, b) {
            return globalUtils.downloadByChromeApi(a, b)
        },
        downloadByChromeApi: function (a, b) {
            chrome.runtime.sendMessage({
                action: "downloadFile",
                options: {url: a.url, filename: a.filename, isStory: "undefined" != typeof a.isStory}
            }, function (a) {
                "function" == typeof b && b(a)
            })
        }
    }
}();