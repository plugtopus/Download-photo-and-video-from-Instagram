!function () {
    var a = window.globalUtils, b = function () {
        return {
            buttonTemplate: null,
            dlBtnClassName: "ext_mobile_dl_btn",
            dlProfileBtnClassName: "profile_mobile_dl_btn",
            dlStoryBtnClassName: "story_mobile_dl_btn",
            run: function () {
                var b = this;
                b.modeGlobalWindow(), $(function () {
                    function c() {
                        b.imageAcceptAll(), b.removeAppPromote(), b.observeDom()
                    }

                    b.removeAppPromote(), b.checkAuth(), b.stylingScroll(), b.createBtnTpl(), a.fixForeach(), b.userActionsListenerInit(), b.messagesListenerInit(), c(), setInterval(c, 1e3)
                }), window.ext_blob_story_data = {}
            },
            removeAppPromote: function () {
                var a = $('a:contains("×")'), b = $('a[href^="https://itunes.apple.com/app/instagram"]'),
                    c = $('a[href^="https://play.google.com/store/apps/details?id=com.instagram.android"]');
                a.length && a.parent().remove(), b.length && b.remove(), c.length && c.remove(), $('a[href$="/download/"]').length && $('a[href$="/download/"]').parent().parent().remove()
            },
            checkAuth: function () {
                $.ajax({method: "GET", url: "https://www.instagram.com/"}).done(function (a) {
                    /activity_counts.{0,4}null/.test(a) ? chrome.runtime.sendMessage("iWillLogIn") : chrome.runtime.sendMessage("amIJustLogIn", function (a) {
                        a && chrome.runtime.sendMessage("needReloadPage")
                    })
                })
            },
            stylingScroll: function () {
                $("body").length && $("body").append('<style media="screen">::-webkit-scrollbar {width: 8px;height: 6px;background-color: #e1e1e1;}::-webkit-scrollbar-thumb {background-color: #000000;}::-webkit-scrollbar-track {background: transparent;}</style>')
            },
            imageAcceptAll: function () {
                $('input[type="file"][accept="image/jpeg"]').attr("accept", "image/*")
            },
            modeGlobalWindow: function () {
                var a = {
                    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25",
                    vendor: "Apple, Inc.",
                    platform: "iPhone"
                };
                window.addEventListener("beforeload", function (b) {
                    Object.keys(a).forEach(function (b) {
                        Object.defineProperty(window.navigator, b, {
                            get: function () {
                                return a[b]
                            }
                        })
                    }), Object.defineProperty(window.screen.orientation, "type", {value: "portrait-primary"})
                }, !0);
                const b = document.createElement("script");
                b.type = "text/javascript", b.innerText = Object.keys(a).map(function (b) {
                    return 'Object.defineProperty(window.navigator, "' + b + '", { get: function(){ return "' + a[b] + '"; } });'
                }).join("") + "Object.defineProperty(window.screen.orientation, 'type', {value: 'portrait-primary'});", document.documentElement.insertBefore(b, document.documentElement.firstChild)
            },
            addMobileDlBtn: function (a, c) {
                a && (a.querySelector("." + b.dlBtnClassName) || a.appendChild(b.getDlBtnEl(c)))
            },
            observeDom: function () {
                var a = this, b = document.querySelectorAll("div > div > article > header + div > div > div");
                b && b.forEach && b.forEach(function (b) {
                    b.parentNode.dataset.extSkip > 0 || (b.parentNode.dataset.extSkip = "1", a.addMobileDlBtn(b.parentNode, 1))
                });
                var c = document.querySelectorAll('section > main article > div > div > div a[href^="/p/"]');
                c && c.forEach && c.forEach(function (b) {
                    b.dataset.extSkip > 0 || (b.dataset.extSkip = "1", a.addMobileDlBtn(b.parentNode, 2))
                });
                var d = document.querySelector("section > ._0ZGP4");
                d && (a.addMobileDlBtn(d, 3), a.addFictitiousArrows2NativeStories(d))
            },
            showDownloadError: function () {
                $("#react-root").append('<div class="error_dl_msg_mobile">' + chrome.i18n.getMessage("error_dl_msg") + "</div>"), setTimeout(function () {
                    $(".error_dl_msg_mobile").remove()
                }, 2e3)
            },
            userActionsListenerInit: function () {
                var a = $("body"), b = this, d = 0;
                a.on("click", "." + b.dlBtnClassName, function (a) {
                    var e = this;
                    a.stopPropagation(), a.preventDefault();
                    var f = Date.now();
                    if (!(d + 500 > f)) if (d = f, b.loaderBtnState.on(e), 1 == e.dataset.page_type) {
                        var h = $(e).closest("article").get(0);
                        b.getMediaInfoOnInternalPage(h, function (a) {
                            g.onGetMediaInfo.call(b, a, e)
                        })
                    } else if (2 == e.dataset.page_type) h = e.parentNode, b.getMediaInfoOnInternalPage(h, function (a) {
                        g.onGetMediaInfo.call(b, a, e)
                    }); else if (3 == e.dataset.page_type) {
                        var i = e.parentNode;
                        c.storiesPause.on(), b.getMediaInfoOnStoriesPage(i, function (a) {
                            g.onGetMediaInfo.call(b, a, e)
                        })
                    }
                }), a.on("click", ".ckWGn", function () {
                    var a = document.body.style.top,
                        b = document.querySelector('[role="dialog"] article header div + div a:first-child'),
                        c = b && b.getAttribute("href");
                    c && c.match(/^\/[^\/]+\/$/) && (b && b.click && b.click(), setTimeout(function () {
                        document.body.style.top = a
                    }, 200))
                }), a.on("click", ".coreSpriteCloseLight", function () {
                    setTimeout(function () {
                        document.querySelector(".coreSpriteFeedCreation") || window.location.reload()
                    }, 300)
                });
                var e = !0;
                a.on("click", ".coreSpriteStoryCreation", function (a) {
                    if (e) {
                        var b = this;
                        chrome.runtime.sendMessage("tryUploadStory", function (a) {
                            if (a) {
                                var c = setInterval(function () {
                                    $("._162ov ._3bdnt").css({opacity: 0})
                                }, 20);
                                setTimeout(function () {
                                    e = !1, b.click(), setTimeout(function () {
                                        clearInterval(c), e = !0
                                    }, 200)
                                }, 300)
                            }
                        })
                    }
                }), a.on("click", 'a.MpBh3[role="button"], a.SWk3c[role="button"]', function (a) {
                    g.multiplePostSwitchListener.call(this, b, a)
                })
            },
            messagesListenerInit: function () {
                chrome.runtime.onMessage.addListener(function (a, b, d) {
                    "storyPauseOffByDownloadId" == a ? c.storiesPause.off() : "storyPauseOffByBlobUrl" == a.action && window.ext_blob_story_data.object_url == a.url && c.storiesPause.off()
                })
            },
            loaderBtnState: {
                on: function (a) {
                    $(".ext_icon", a).addClass("preloader2")
                }, off: function () {
                    $(".preloader2").removeClass("preloader2")
                }
            },
            createBtnTpl: function () {
                var a = document.createElement("a");
                a.innerHTML = '<span class="ext_icon"></span>', this.buttonTemplate = a
            },
            getDlBtnEl: function (a) {
                var b = this.buttonTemplate.cloneNode(!0);
                return b.setAttribute("type", "button"), b.dataset.page_type = a, b.classList.add(this.dlBtnClassName), 1 == a || 2 == a ? b.classList.add(this.dlProfileBtnClassName) : 3 == a && b.classList.add(this.dlStoryBtnClassName), b
            },
            getMediaInfoOnMainPage: function (b, c) {
                if (b instanceof HTMLElement && "function" == typeof c) {
                    var d = b.querySelector("header");
                    if (!d) return c({error: 1});
                    var e, f, h, i = b.querySelector("header + div"), j = d.querySelector("div + div a:first-child"),
                        k = j.getAttribute("href");
                    (m = k.match(/^\/([^\/]+)\/$/)) && (e = m[1]);
                    var l = i.querySelector("video[src]");
                    if (l) {
                        if (f = g.getLinkFromVideoElement(l), "string" != typeof f || f.indexOf("blob:") > -1) return this.getMediaInfoOnInternalPage(b, c);
                        h = a.getFileNameFromVideoLink(f, e)
                    } else {
                        var n = g.findImageElement(i);
                        n && (f = g.getLinkFromImgElement(n), h = a.getFileNameFromImageLink(f, e))
                    }
                    return c(f && h ? {url: f, filename: h} : {error: 1})
                }
            },
            getMediaInfoOnInternalPage: function (b, c) {
                if (b instanceof HTMLElement && "function" == typeof c) {
                    var d = this, e = g.getShortCode(b);
                    if (!e) return c({error: 1});
                    var f = b.querySelector("." + d.dlBtnClassName);
                    return f ? void a.getMediaItemFromJsonGraphql(c, e, f.dataset.multiplePos) : c({error: 1})
                }
            },
            getMediaInfoOnStoriesPage: function (b, c) {
                var d, e, f;
                d = window.location.pathname.match(/stories\/([^\/]+)/), d = d && d[1];
                var h = b.querySelector("video");
                if (h) e = g.getLinkFromVideoElement(h), f = a.getFileNameFromVideoLink(e, d); else {
                    var i = b.querySelector("img");
                    e = g.getLinkFromImgElement(i), f = a.getFileNameFromImageLink(e, d)
                }
                return c(e && f ? {url: e, filename: f, isStory: 1} : {error: 1})
            },
            addFictitiousArrows2NativeStories: function (a) {
                if (a instanceof HTMLElement && !a.querySelector(".storiesToLeft") && !a.querySelector(".storiesToRight")) {
                    var b = a.querySelector("section > div:first-child > div > div");
                    if (b) {
                        var c = b.querySelector("button:nth-child(2n+1)"), d = b.querySelector("button:nth-child(2n)");
                        if (c && d) {
                            var e = document.createElement("span"), f = document.createElement("span");
                            e.className = "storiesToLeft", f.className = "storiesToRight", c.appendChild(e), d.appendChild(f)
                        }
                    }
                }
            }
        }
    }(), c = function () {
        return {
            dlBtnClassName: "ext_stories_dl_btn",
            showingStoryItems: [],
            showingStoryType: null,
            allCurrentStories: [],
            gallery: null,
            lastTimeStoryUpdate: 0,
            lastTimeLiveStoriesUpdate: 0,
            lastTimeAllStoriesUpdate: 0,
            storyUpdatePeriod: 2e4,
            liveStoriesUpdatePeriod: 6e4,
            allStoriesUpdatePeriod: 6e5,
            storyTrayElTpl: null,
            storyLiveElTpl: null,
            storyNativeLiveElTpl: null,
            storiesWrapperClass: "ext_stories_wrap",
            cachedStoriesMedia: {},
            insertStoriesBlock: function (a) {
                if (e.isMainPage() && a) {
                    var b = document.querySelector("." + c.storiesWrapperClass);
                    b || (b = document.createElement("div"), b.className = c.storiesWrapperClass, b.style.display = "none", a.firstElementChild ? a.insertBefore(b, a.firstElementChild) : a.appendChild(b), this.insertStories(b), e.isWindows() || Ps.initialize(b, {
                        minScrollbarLength: 50,
                        maxScrollbarLength: 50
                    }))
                }
            },
            insertStories: function (a, b) {
                var c = this;
                chrome.runtime.sendMessage("requestStories", function (d) {
                    if (!d || !d.length || !Array.isArray(d)) return void(a.style.display = "none");
                    if (a.style.display = "block", e.objectSortByProp(d, "ranked_position"), c.allCurrentStories = d, c.lastTimeAllStoriesUpdate = c.lastTimeLiveStoriesUpdate = Date.now(), e.isWindows()) try {
                        $(a).smoothDivScroll(), $(a).smoothDivScroll("destroy")
                    } catch (f) {
                    }
                    a.innerHTML = "", d.forEach(function (b, d) {
                        var e = "undefined" != typeof b.broadcast_owner, f = !e && "undefined" != typeof b.broadcasts;
                        e || f ? c.insertStoryLiveItem(b, d, a, e) : c.insertStoryTrayItem(b, d, a)
                    }), e.isWindows() && $(a).smoothDivScroll(), "function" == typeof b && b()
                })
            },
            updateStories: function () {
                var a = document.querySelector("." + c.storiesWrapperClass);
                a && (Date.now() > this.lastTimeAllStoriesUpdate + this.allStoriesUpdatePeriod ? this.insertStories(a) : Date.now() > this.lastTimeLiveStoriesUpdate + this.liveStoriesUpdatePeriod && this.updateLiveStories(a))
            },
            updateLiveStories: function (a, b) {
                var c = this;
                chrome.runtime.sendMessage("requestStories", function (d) {
                    if (!d || !d.length || !Array.isArray(d)) return void(a.style.display = "none");
                    a.style.display = "block", e.objectSortByProp(d, "ranked_position"), c.lastTimeLiveStoriesUpdate = Date.now();
                    var f = [], g = [];
                    c.allCurrentStories.forEach(function (a, b) {
                        (a.dash_playback_url || a.dash_abr_playback_url) && (f[b] = a.id)
                    }), d.forEach(function (a, b) {
                        (a.dash_playback_url || a.dash_abr_playback_url) && (g[b] = a.id)
                    });
                    var h = !1;
                    if (f.forEach(function (a, b) {
                        var e = g.indexOf(a);
                        if (0 > e) {
                            var f = document.querySelector('.ext_story_item_wrap[data-story-num="' + b + '"]');
                            f && f.parentNode.removeChild(f), delete c.allCurrentStories[b], h = !0
                        } else c.allCurrentStories[b] = d[e]
                    }), g.forEach(function (b, e) {
                        if (f.indexOf(b) < 0) {
                            var g = c.allCurrentStories.length;
                            c.allCurrentStories[g] = d[e], c.insertStoryLiveItem(d[e], g, a, !0, !0), h = !0
                        }
                    }), h && e.isWindows()) try {
                        $(a).smoothDivScroll("recalculateScrollableArea")
                    } catch (i) {
                    }
                    "function" == typeof b && b()
                })
            },
            insertStoryLiveItem: function (a, b, c, d, f) {
                var g = a.broadcast_owner || a.user, h = this.getStoryLiveElTpl();
                h.dataset.storyId = a.id || a.pk, h.dataset.storyType = d ? "live" : "postlive";
                var i = h.querySelector("img.user_icon_live");
                i.src = g.profile_pic_url;
                var j = h.querySelector("img.ext_story_type_icon");
                j.src = "chrome-extension://" + chrome.runtime.id + "/img/" + (d ? "icon_live.png" : "icon_post_live.png"), j.className = "ext_live_icon center_div";
                var k = h.querySelector("span.ext_story_item_author");
                if (k.innerText = g.username.length > 11 ? g.username.substr(0, 10) + "..." : g.username, e.isWindows()) {
                    var l = c.querySelector(".scrollableArea");
                    l || (l = c)
                } else l = c;
                if (f) {
                    var m = l.firstElementChild;
                    m ? l.insertBefore(h, m) : l.appendChild(h)
                } else l.appendChild(h)
            },
            insertStoryTrayItem: function (a, b, c) {
                var d = a.user, e = this.getStoryTrayElTpl();
                e.dataset.storyId = a.id || a.pk;
                var f = e.querySelector("img.ext_story_item_image");
                f.src = d.profile_pic_url;
                var g = e.querySelector("span.ext_story_item_author");
                g.innerText = d.username.length > 11 ? d.username.substr(0, 10) + "..." : d.username, c.appendChild(e)
            },
            getStoryTrayElTpl: function () {
                if (!this.storyTrayElTpl) {
                    var a = document.createElement("div");
                    a.className = "ext_story_item_wrap", a.dataset.storyType = "tray";
                    var b = document.createElement("img");
                    b.className = "ext_story_item_image";
                    var c = document.createElement("span");
                    c.className = "ext_story_item_author", a.appendChild(b), a.appendChild(c), this.storyTrayElTpl = a
                }
                return this.storyTrayElTpl.cloneNode(!0)
            },
            getStoryLiveElTpl: function () {
                if (!this.storyLiveElTpl) {
                    var a = document.createElement("div");
                    a.className = "ext_story_item_wrap";
                    var b = document.createElement("div");
                    b.className = "ext_live_tray_item ext_unseen_story_item";
                    var c = document.createElement("img");
                    c.className = "user_icon_live center_div";
                    var d = document.createElement("div");
                    d.className = " center_div user_icon_black_background";
                    var e = document.createElement("span");
                    e.className = "pulse center_div";
                    var f = document.createElement("img");
                    f.className = "ext_story_type_icon";
                    var g = document.createElement("span");
                    g.className = "ext_story_item_author";
                    var h = document.createElement("div");
                    h.className = "streak", b.appendChild(c), b.appendChild(d), b.appendChild(e), b.appendChild(f), a.appendChild(b), a.appendChild(h), a.appendChild(g), this.storyLiveElTpl = a
                }
                return this.storyLiveElTpl.cloneNode(!0)
            },
            checkStoryOneUser: function (b, c) {
                var d = this;
                return b ? void a.requestJSONgraphqlUser(b, function (b) {
                    if (!b || b.error || !b.graphql) return void("function" == typeof c && c({error: 1}));
                    var e = b.graphql.user, f = e && e.id;
                    if (!f) return a.trackEventWithRandom("no_user_id", {
                        method: "checkStoryOneUser",
                        graphql: b.graphql
                    }, .1), void("function" == typeof c && c({error: 1}));
                    var g = [];
                    d.requestOneUserStories(f, function (a) {
                        return a && a.items && a.items.length ? (g = d.getPrepareStoryItems(a.items), g.length ? void("function" == typeof c && c(g)) : void("function" == typeof c && c({error: 1}))) : void("function" == typeof c && c({error: 1}))
                    })
                }) : void("function" == typeof c && c())
            },
            requestOneUserStories: function (b, c, d) {
                var e = this, f = 4;
                d = d || 0, d++, chrome.runtime.sendMessage("getCookies", function (g) {
                    if (!g) return c();
                    var h = "https://i.instagram.com/api/v1/feed/user/" + b + "/reel_media/";
                    $.ajax({method: "GET", url: h, dataType: "json"}).done(function (g) {
                        g && "object" == typeof g ? c(g) : f >= d ? e.requestOneUserStories(b, c, d) : (a.trackUnknownAjaxResponse({
                            method: "requestOneUserStories",
                            url: h,
                            data: g,
                            random: .05
                        }), c())
                    }).fail(function (g) {
                        if (f >= d) e.requestOneUserStories(b, c, d); else {
                            if (!a.trackFailsReelMedia && Math.random() < .01) {
                                a.trackFailsReelMedia = !0;
                                var i = g && JSON.stringify(g.responseJSON);
                                i = i || g && g.responseText, i = i ? i.substr(0, 1500) : null;
                                var j = g && g.status;
                                chrome.runtime.sendMessage("getInstalledExtensions", function (b) {
                                    a.trackEvent("fail_ajax_request", {
                                        method: "requestOneUserStories",
                                        url: h,
                                        resStatus: j,
                                        res: i,
                                        extIds: b
                                    })
                                })
                            }
                            c()
                        }
                    })
                })
            },
            getPrepareLiveStory: function (b) {
                try {
                    var c = [];
                    if (b.broadcasts) b.broadcasts.forEach(function (b) {
                        try {
                            var d = {
                                story_type: "post_live",
                                dash_manifest: b.dash_manifest,
                                html: '<div class="ext_video_preload"><span></span></div><video class="ext_video_story_player" controls></video>',
                                user_pk: b.broadcast_owner.pk,
                                username: b.broadcast_owner.username,
                                userPic: b.broadcast_owner.profile_pic_url
                            };
                            c.push(d)
                        } catch (e) {
                            a.trackErrorParseAjaxResponse({
                                method: "getPrepareLiveStory",
                                error: e,
                                data: b,
                                random: .05
                            })
                        }
                    }); else {
                        var d = b.dash_abr_playback_url;
                        if (d || (d = b.dash_playback_url), !d) return a.trackEventWithRandom("NO_dash_playback_url", {storyObj: b}, .1), null;
                        var e = d.match(/(\d+)\.mpd/);
                        e = e ? e[1] : b.id;
                        try {
                            c.push({
                                story_type: "live",
                                media_id: e,
                                playback_url: d,
                                html: '<div class="ext_video_preload"><span></span></div><div class="video_live_finished">' + chrome.i18n.getMessage("broadcast_finished") + '</div><video src="' + d + '" class="ext_video_story_player" controls></video><div class="chatbox_header"></div><div class="live_chatbox"></div>',
                                user_pk: b.broadcast_owner.pk,
                                username: b.broadcast_owner.username,
                                userPic: b.broadcast_owner.profile_pic_url,
                                viewer_count: parseInt(b.viewer_count)
                            })
                        } catch (f) {
                            a.trackErrorParseAjaxResponse({
                                method: "getPrepareLiveStory",
                                error: f,
                                data: b,
                                random: .05
                            })
                        }
                    }
                    return c
                } catch (f) {
                    a.trackCodeError(f, "getPrepareLiveStory")
                }
            },
            getPrepareStoryItems: function (b) {
                var c = [];
                return b.forEach(function (b) {
                    try {
                        var d, e = null, f = 0, g = 0, h = void 0, i = void 0,
                            j = "undefined" != typeof b.video_versions;
                        j ? (b.video_versions.forEach(function (b) {
                            try {
                                b.width > f ? (f = b.width, g = b.height, e = b.url) : b.width < h && (h = b.width, i = b.url)
                            } catch (c) {
                                a.trackErrorParseAjaxResponse({
                                    method: "getPrepareStoryItems 1",
                                    error: c,
                                    data: b,
                                    random: .01
                                })
                            }
                        }), b.image_versions2.candidates.forEach(function (b) {
                            try {
                                h = b.width, i = b.url
                            } catch (c) {
                                a.trackErrorParseAjaxResponse({
                                    method: "getPrepareStoryItems 2",
                                    error: c,
                                    data: b,
                                    random: .01
                                })
                            }
                        }), d = "mp4", -1 !== e.indexOf(".flv") && (d = "flv")) : (b.image_versions2.candidates.forEach(function (b) {
                            try {
                                b.width > f && (f = b.width, g = b.height, e = b.url), "undefined" == typeof h ? (h = b.width, i = b.url) : b.width < h && (h = b.width, i = b.url)
                            } catch (c) {
                                a.trackErrorParseAjaxResponse({
                                    method: "getPrepareStoryItems 3",
                                    error: c,
                                    data: b,
                                    random: .01
                                })
                            }
                        }), d = "jpg", -1 !== e.indexOf(".png") && (d = "png"));
                        var k = e.match(/\/([^\/?]+)(?:$|\?)/);
                        k = k && k[1], k || (k = "noname." + d);
                        var l = {
                            w: f,
                            h: g,
                            isVideo: j,
                            type: j ? "video" : "photo",
                            url: e,
                            prev: i,
                            filename: k,
                            story_type: "tray",
                            username: b.user.username,
                            userPic: b.user.profile_pic_url
                        };
                        j ? l.html = '<div class="ext_video_preload"><span></span></div><video class="ext_video_story_player" poster="" controls><source src="' + e + '" type="video/mp4"> </video>' : l.src = e, c.push(l)
                    } catch (m) {
                        a.trackCodeError(m, "getPrepareStoryItems")
                    }
                }), c
            },
            createPswp: function () {
                var a = document.createElement("div");
                a.setAttribute("tabindex", "-1"), a.setAttribute("role", "dialog"), a.setAttribute("aria-hidden", "true"), a.className = "pswp insta_down";
                var b = chrome.i18n.getMessage("download"), d = chrome.i18n.getMessage("download_all");
                return a.innerHTML = '<div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden pswp__ctrls-wrap"><div class="pswp__top-bar"><div class="pswp__counter"></div><div class="dl_btns_container"><a type="button" class="' + c.dlBtnClassName + ' ext_ds_dl_btn ext_story__download" title="' + b + '"><span class="ext_icon"></span><span class="ext_text">' + b + '</span></a><a type="button" class="' + c.dlBtnClassName + ' ext_ds_dl_all_btn ext_story__download_all" title="' + d + '"><span class="ext_icon"></span><span class="ext_text">' + d + '</span></a></div><div class="live_header"><span class="live_icon"></span><span class="viewers_count"><span class="eye_icon"></span><span class="count_text">count</span></span></div><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="story_author_wrap"><div class="story_author_wrap_2"><a target="_blank" class="author_link"><img src="" class="story_author_icon"></a><div class="story_author_name"></div></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div>', document.querySelector("body").appendChild(a), a
            },
            getPswp: function () {
                var a = document.querySelector(".insta_down");
                return a ? a : this.createPswp()
            },
            stopAllVideos: function () {
                var a = document.querySelectorAll(".ext_video_story_player");
                a && a.forEach && a.forEach(function (a) {
                    a.pause()
                })
            },
            getLiveComments: function (b, c, d) {
                function f() {
                    k || $.ajax({method: "GET", url: j, dataType: "json"}).done(function (a) {
                        m = 0, g(a) && setTimeout(f, l)
                    }).fail(function (a) {
                        return m++, 7 > m ? void setTimeout(function () {
                            f()
                        }, 500) : void("function" == typeof d && d())
                    })
                }

                function g(b) {
                    try {
                        if (!b || "object" != typeof b || "ok" != b.status) return a.trackUnknownAjaxResponse({
                            method: "handleCommentResponse",
                            url: url,
                            data: b,
                            random: .01
                        }), 6 >= m;
                        if (b.comment_muted) return c.commentMuted(), !0;
                        var d = b.comments;
                        if (!d || !d.length) return !0;
                        e.objectSortByProp(d, "created_at"), c.is_muted && c.commentActive(), d.forEach(function (a) {
                            c.addComment(a)
                        });
                        var f = d.pop();
                        return h = parseInt(f.created_at), !h || isNaN(h) ? (a.trackEvent("unknown_comment_data", {
                            url: j,
                            type: "code_200_unknown_response",
                            data: f
                        }), !0) : (j = i + "?last_comment_ts=" + h, !0)
                    } catch (g) {
                        a.trackCodeError(g, "handleCommentResponse")
                    }
                }

                var h, i = "https://i.instagram.com/api/v1/live/" + b + "/get_comment/", j = i, k = !1, l = 4e3, m = 0;
                return f(), {
                    stop: function () {
                        k = !0
                    }
                }
            },
            getLiveInfo: function (b, c, d) {
                function e() {
                    j || $.ajax({method: "GET", url: g, dataType: "json"}).done(function (b) {
                        try {
                            h = 0, f(b) && setTimeout(e, i)
                        } catch (c) {
                            a.trackCodeError(c, "getLiveInfo2")
                        }
                    }).fail(function (b) {
                        try {
                            var c = b.responseJSON;
                            h++, 7 > h ? setTimeout(function () {
                                e()
                            }, 500) : 400 == b.status && c && "login_required" != c.message && "function" == typeof d ? d() : c ? "string" == typeof c.message && "broadcast is unavailable" !== c.message.toLowerCase() && a.trackEventWithRandom("error_info_live_url", {
                                url: g,
                                type: "unknown_response",
                                response: c
                            }, .01) : a.trackEventWithRandom("error_info_live_url", {
                                url: g,
                                type: "no_response",
                                resCode: b.status
                            }, .01)
                        } catch (f) {
                            a.trackCodeError(f, "getLiveInfo3")
                        }
                    })
                }

                function f(b) {
                    return b && "object" == typeof b && "ok" == b.status ? (c.setViewersCount(b.viewer_count), !0) : (a.trackEventWithRandom("error_comment_url", {
                        url: g,
                        type: "code_200_unknown_response",
                        response: b
                    }, .01), 6 >= h)
                }

                var g = "https://i.instagram.com/api/v1/live/" + b + "/info/", h = 0, i = 1e4, j = !1;
                return e(), {
                    stop: function () {
                        j = !0
                    }
                }
            },
            chatBoxInit: function (b) {
                try {
                    var c, d, e, f, g, h, i, j, k = function () {
                        return document.querySelector(".live_chatbox")
                    }, l = function () {
                        return document.querySelector(".chatbox_header")
                    };
                    if (c = k(), d = l(), !c) return null;
                    if (!d) return null;
                    if (!b) return null;
                    if ("object" != typeof Ps || null == Ps) return null;
                    Ps.initialize(c, {wheelSpeed: 2, minScrollbarLength: 20, maxScrollbarLength: 60});
                    var m = function () {
                        return c ? (c.style.display = "block", c.style.opacity = 1, h = !0, i = !1, !0) : !1
                    }, n = function () {
                        return c ? (c.style.display = "none", h = !1, i = !0, !0) : !1
                    }, o = function () {
                        i ? (d.innerText = f, m()) : (d.innerText = e, n())
                    }, p = function () {
                        return d ? (d.display = "block", !0) : !1
                    }, q = function () {
                        try {
                            var e = b.getBoundingClientRect();
                            if ("undefined" == typeof e) return void a.trackEvent("error_getBoundingClientRect");
                            d.style.left = e.left + e.width + "px", d.style.top = e.top + 50 + "px", d.style.display = "block", c.style.left = e.left + e.width + "px", c.style.top = e.top + 80 + "px", c.style.height = e.height - 100 + "px"
                        } catch (f) {
                            a.trackCodeError(f, "updatePositionAndSize")
                        }
                    }, r = function () {
                        try {
                            j = document.createElement("div"), j.className = "one_comment_wrap";
                            var b = document.createElement("a");
                            b.className = "author_link", b.setAttribute("target", "_blank");
                            var c = document.createElement("img");
                            c.className = "comment_author_icon", b.appendChild(c);
                            var d = document.createElement("div");
                            d.className = "comment_author_name";
                            var e = document.createElement("p");
                            e.className = "live_comment_text", j.appendChild(b), j.appendChild(d), j.appendChild(e)
                        } catch (f) {
                            a.trackCodeError(f, "createCommentElTpl")
                        }
                    }, s = function () {
                        return j || r(), j.cloneNode(!0)
                    };
                    return e = chrome.i18n.getMessage("show_live_comments"), f = chrome.i18n.getMessage("hide_live_comments"), g = chrome.i18n.getMessage("comments_is_muted"), d.innerText = f, q(), d.addEventListener("click", o), b.addEventListener("resize", q), window.addEventListener("resize", q), {
                        is_muted: !1,
                        commentMuted: function () {
                            this.is_muted || (this.is_muted = !0, d && d.removeEventListener("click", o), d.innerText = g)
                        },
                        commentActive: function () {
                            this.is_muted && (this.is_muted = !1, d.innerText = f, d.addEventListener("click", o))
                        },
                        shown: function () {
                            return h
                        },
                        hidden: function () {
                            return i
                        },
                        show: m,
                        hide: n,
                        addComment: function (b) {
                            try {
                                var d = c.scrollHeight, e = s(), f = e.querySelector("a.author_link");
                                f.href = "https://www.instagram.com/" + b.user.username;
                                var g = e.querySelector("img.comment_author_icon");
                                g.src = b.user.profile_pic_url;
                                var h = e.querySelector("div.comment_author_name");
                                h.innerText = b.user.username;
                                var i = e.querySelector("p.live_comment_text");
                                i.innerText = b.text, c.appendChild(e), d < c.scrollTop + c.clientHeight + 50 && $(c).animate({scrollTop: c.scrollHeight}, 800)
                            } catch (j) {
                                a.trackCodeError(j, "addComment")
                            }
                        },
                        destroy: function () {
                            d && d.removeEventListener("click", o), b && b.removeEventListener("resize", q), window.removeEventListener("resize", q), n(), p()
                        }
                    }
                } catch (t) {
                    a.trackCodeError(t, "chatBoxInit")
                }
            },
            showInPswp: function (b) {
                try {
                    var c = this;
                    if (!b || !b.length) return;
                    var d, e, f, g, h, i, j, k, l, m, n = function (a, b) {
                        var c = document.querySelector(".ext_ds_dl_btn"),
                            d = document.querySelector(".ext_ds_dl_all_btn");
                        c && d && ("tray" == a ? (c.style.display = "block", b > 1 ? d.style.display = "block" : d.style.display = "none") : (c.style.display = "none", d.style.display = "none"))
                    }, o = function () {
                        try {
                            var b = document.querySelector(".video_live_finished");
                            if (!(j && b && i && e && m)) return;
                            j.style.display = "none", b.style.display = "block", i.pause(), e.pause(), m.hide()
                        } catch (c) {
                            a.trackCodeError(c, "stopEndedBroadcast")
                        }
                    }, p = function () {
                        k || (k = !0, o())
                    }, q = function () {
                        c.stopAllVideos(), f && f.stop(), g && g.stop(), h && h.destroy(), m && m.hide(), x(), "tray" !== d.currItem.story_type && e && (e.pause(), e.reset())
                    }, r = function () {
                        l = !0, j && (j.style.display = "none")
                    }, s = function () {
                        l = !0, j && (j.style.display = "none")
                    }, t = function () {
                        l = !1, setTimeout(function () {
                            !l && j && (j.style.display = "flex")
                        }, 200)
                    }, u = function () {
                        var a, b, c = function () {
                            return document.querySelector(".live_header")
                        }, d = function () {
                            return a ? a.querySelector(".viewers_count .count_text") : void 0
                        };
                        return a = c(), b = d(), {
                            element: a, viewersCountEl: b, show: function () {
                                return a || (a = c()), a ? (a.style.display = "block", !0) : !1
                            }, hide: function () {
                                return a || (a = c()), a ? (a.style.display = "none", !0) : !1
                            }, setViewersCount: function (e) {
                                return b || (a || (a = c()), b = d()), b ? (e = parseInt(e), "number" != typeof e || isNaN(e) ? (this.hide(), !1) : (b.innerText = e, this.show(), !0)) : (this.hide(), !1)
                            }
                        }
                    }, v = function (a) {
                        if (e = dashjs.MediaPlayer().create(), "post_live" == a.currItem.story_type) {
                            var b = a.currItem.dash_manifest;
                            e.initialize(i);
                            var d = dashjs.FactoryMaker.getClassFactoryByName("XlinkController"),
                                j = dashjs.FactoryMaker.getClassFactoryByName("DashParser"), l = d().create({}),
                                n = j().create({}), o = n.parse(b, l);
                            o.loadedTime = new Date, l.resolveManifestOnLoad(o), e.attachSource(o)
                        } else {
                            k = !1, h = c.chatBoxInit(i), h.show(), m = u(), m.setViewersCount(a.currItem.viewer_count);
                            var q = a.currItem.playback_url;
                            e.initialize(i, q, !0), f = c.getLiveComments(a.currItem.media_id, h, p), g = c.getLiveInfo(a.currItem.media_id, m, p)
                        }
                        e.getDebug().setLogToBrowserConsole(!1), e.setStableBufferTime(2), e.setFragmentLoaderRetryAttempts(20), e.play()
                    }, w = function () {
                        i && (i.addEventListener("playing", r), i.addEventListener("canplay", s), i.addEventListener("waiting", t))
                    }, x = function () {
                        i && (i.removeEventListener("playing", r), i.removeEventListener("canplay", s), i.removeEventListener("waiting", t))
                    }, y = function (a) {
                        return a ? (document.querySelector(".story_author_wrap .author_link").href = "https://www.instagram.com/" + a.username, document.querySelector(".story_author_wrap .story_author_icon").src = a.userPic, document.querySelector(".story_author_wrap .story_author_name").innerText = a.username, void(document.querySelector(".story_author_wrap").style.display = "block")) : void(document.querySelector(".story_author_wrap").style.display = "none")
                    };
                    c.showingStoryItems = b, c.showingStoryType = b[0].story_type;
                    var z = c.getPswp(), A = {index: 0, closeOnScroll: !1, history: !1, focus: !0, bgOpacity: .9};
                    d = new PhotoSwipe(z, PhotoSwipeUI_Default, b, A), c.gallery = d, n(b[0].story_type, c.showingStoryItems.length), d.listen("afterChange", function () {
                        try {
                            if (!this.currItem.container) return;
                            var b = this.currItem.isVideo || "tray" !== this.currItem.story_type;
                            if (b) {
                                if (l = !1, i = this.currItem.container.querySelector("video.ext_video_story_player"), j = this.currItem.container.querySelector(".ext_video_preload"), !i || !j) return;
                                j.style.display = "flex", i.currentTime = 0, w()
                            }
                            "tray" == this.currItem.story_type ? this.currItem.isVideo && (i.play(), 4 == i.readyState && (j.style.display = "none")) : v(this)
                        } catch (c) {
                            a.trackCodeError(c, "showInPswp")
                        }
                    }), d.listen("beforeChange", function () {
                        q()
                    }), d.listen("close", function () {
                        q(), c.showingStoryItems = [], c.showingStoryType = null, z && z.remove && z.remove()
                    }), d.listen("destroy", function () {
                        c.gallery = null
                    }), y(b[0]), d.init()
                } catch (B) {
                    a.trackCodeError(B, "showInPswp")
                }
            },
            checkStateDownloadAllBtn: function (a) {
                var b = document.querySelector(".ext_ns_dl_all_btn");
                if (b) {
                    var c = 1, d = a.querySelector("._mviq1");
                    d || (d = a.querySelector("section > header + div")), d && (c = d.childElementCount), c > 1 ? (b.querySelector(".stories_count").innerText = "(" + c + ")", b.style.display = "flex") : b.style.display = "none"
                }
            },
            appendDlBtn2NativeStories: function (a) {
                var b = this, d = document.createElement("div");
                d.className = "native_stories_dl_wrap";
                var e = document.createElement("a");
                e.className = c.dlBtnClassName + " ext_ns_dl_btn ext_story__download", e.innerHTML = '<span class="ext_icon"></span><span class="ext_text">' + chrome.i18n.getMessage("download") + "</span>";
                var f = document.createElement("a");
                f.className = c.dlBtnClassName + " ext_ns_dl_all_btn ext_story__download_all", f.innerHTML = '<span class="ext_icon"></span><span class="ext_text">' + chrome.i18n.getMessage("download_all") + '</span><span class="stories_count"></span>', d.appendChild(e), d.appendChild(f), a.appendChild(d), b.checkStateDownloadAllBtn(a)
            },
            onClickDlBtnNativeStoryOne: function (b) {
                a.clickStats.dlBtnSt++;
                var d = this;
                c.storiesPause.on(), g.loaderBtnState.on(d);
                var e = window.location.pathname.match(/stories\/([^\/]+)/);
                e = e && e[1];
                var f, h, i = d.parentNode.parentNode.querySelector("section header + div + div");
                if (i) {
                    var j = g.findVideoElement(i);
                    if (j) f = g.getLinkFromVideoElement(j), h = a.getFileNameFromVideoLink(f, e); else {
                        var k = g.findImageElement(i);
                        f = g.getLinkFromImgElement(k), h = a.getFileNameFromImageLink(f, e)
                    }
                    f && h && g.onGetMediaInfo.call(g, {url: f, filename: h, isStory: !0}, d)
                }
            },
            onClickDlBtnNativeStoryAll: function (a) {
                d.zipCanceledByUser = !1, g.loaderBtnState.on(this), c.storiesPause.on(), c.getAllLinksCurrentNativeStories(function (a) {
                    if (g.loaderBtnState.off(), !a || a.error) return void c.storiesPause.off();
                    var b = a;
                    if (b && b.length) {
                        var e = b[0] && b[0].username;
                        d.downloadZIP(b, e, function (a) {
                            a && a.error && c.storiesPause.off()
                        }, !0)
                    }
                })
            },
            onClickDlBtnOurStoryOne: function (b) {
                var d = c.gallery.currItem;
                if ("post_live" != d.story_type) {
                    var e = this, f = d.filename;
                    c.gallery.currItem.username && (f = c.gallery.currItem.username + "_" + f), c.storiesPause.on(), a.downloadFile({
                        url: d.url,
                        filename: f,
                        isStory: !0
                    }, function (a) {
                        g.loaderBtnState.off(), a || g.showDownloadError(e)
                    })
                }
            },
            onClickDlBtnOurStoryAll: function (a) {
                d.zipCanceledByUser = !1, c.storiesPause.on(), d.downloadZIP(c.showingStoryItems.slice(0), c.gallery.currItem.username, function (a) {
                    a && a.error && c.storiesPause.off()
                }, !0)
            },
            storiesPause: {
                isPausedByAs: !1, isNativeStories: function () {
                    return window.location.href.indexOf("/stories/") > -1
                }, isOurStories: function () {
                    return !(!c.gallery || !c.gallery.currItem)
                }, pauseNativeStories: function () {
                    var a = $(".KuJpX").get(0);
                    if (a) {
                        this.isPausedByAs = !0;
                        var b = setInterval(function () {
                            $('[role="presentation"] div:not(".ext_modal")').css({opacity: 0})
                        }, 10);
                        a.click(), setTimeout(function () {
                            clearInterval(b)
                        }, 300)
                    }
                }, playNativeStories: function () {
                    var a = $('[role="presentation"]').get(0);
                    a && a.click(), this.isPausedByAs = !1
                }, pauseOurStories: function () {
                    if (!c.gallery || !c.gallery.currItem || !c.gallery.currItem.container) return !1;
                    var a = c.gallery.currItem.container, b = a.querySelector("video.ext_video_story_player");
                    return b ? void(b.paused || (b.pause(), this.isPausedByAs = !0)) : !1
                }, playOurStories: function () {
                    if (this.isPausedByAs = !1, c.gallery && c.gallery.currItem && c.gallery.currItem.container) {
                        var a = c.gallery.currItem.container, b = a.querySelector("video.ext_video_story_player");
                        b && b.paused && b.play()
                    }
                }, on: function () {
                    this.isNativeStories() ? this.pauseNativeStories() : this.isOurStories() && this.pauseOurStories()
                }, off: function () {
                    this.isPausedByAs && (this.isNativeStories() ? this.playNativeStories() : this.isOurStories() && this.playOurStories())
                }
            },
            getAllLinksCurrentNativeStories: function (b) {
                var c = window.location.pathname.match(/stories\/highlights\/([\d]+)/);
                if (c = c && c[1]) a.getPostsDataFromUserGraphqlOther({highlight_reel_id: c}, b); else {
                    var d = window.location.pathname.match(/stories\/([^\/]+)/);
                    if (d = d && d[1], !d) return void b();
                    this.checkStoryOneUser(d, b)
                }
            },
            addDlBtn2NativeStories: function (a) {
                var b = a.parentNode;
                b.querySelector(".native_stories_dl_wrap") ? this.checkStateDownloadAllBtn(b) : this.appendDlBtn2NativeStories(b)
            },
            getStoryVideoMediaInfo: function (b, c) {
                var d = b.querySelectorAll("source");
                if (!d.length) return !1;
                var e = ["avc1.64001E", "avc1.4D401E", "avc1.58A01E", "avc1.42E01E"], f = [];
                d.forEach(function (a) {
                    var b = a.getAttribute("type");
                    if (b) {
                        var c = b.match(/codecs="([^,]+)/);
                        if (c = c && c[1]) {
                            var d = e.indexOf(c);
                            -1 != d && (f[d] = a.src)
                        }
                    }
                });
                var g;
                for (var h in f) if ("string" == typeof f[h] && f[h].length) {
                    g = f[h];
                    break
                }
                g || (g = d[0].getAttribute("src"));
                var i = "mp4";
                -1 !== g.indexOf(".flv") && (i = "flv");
                var j = g.match(/\/([^\/?]+)(?:$|\?)/);
                j = j && j[1], j || (j = "noname." + i), c && (j = c + "_" + j), j = a.filename.modify(j);
                var k = b.getAttribute("poster");
                return k || (k = ""), {filename: j, url: g, prev: k, type: "video", referer: window.location.href}
            }
        }
    }(), d = function () {
        return {
            zipCanceledByUser: !1,
            dlBtnClassName: "ext_btn_dl_all",
            downloadAllBtnWrapperClass: "download_all_wrap",
            PAGE_TYPE_DEFAULT: 1,
            PAGE_TYPE_USERPAGE: 2,
            PAGE_TYPE_ONE_POST: 3,
            pageType: null,
            massDownloadProSettings: !1,
            isAdvancedSettings: !1,
            addDlZipBtn: function () {
                if (!document.querySelector("." + this.dlBtnClassName)) {
                    var b = document.querySelector("section > main > nav ._qlijk");
                    if (b || (b = document.querySelector("section > main + nav > div > div > div > div:last-child div")), b) {
                        var c = document.createElement("div");
                        c.className = "XrOey", c.innerHTML = '<div class="' + this.downloadAllBtnWrapperClass + '"><span class="ext_tooltip download_all">' + chrome.i18n.getMessage("download_all") + '</span><a class="_8scx2 _gvoze ' + this.dlBtnClassName + '"></a></div>', b.appendChild(c), a.domStats.dlBtnAll++
                    }
                }
            },
            showPopupDlAll: function () {
                var a = document.querySelector("." + this.dlBtnClassName), b = a.parentNode.parentNode,
                    c = document.createElement("div");
                c.innerHTML = '<div class="ext_all_popup_wrap"><div class="_8Mwnh" role="dialog"></div><div class="hUQsm"></div><div class="T5hFd"></div><div class="ext_dl_all_popup_loader"><span class="ext_icon"></span></div><div class="ext_dl_all_popup"><div class="ext_popup_header"></div><div class="ext_popup_links_wrap"></div><div class="ext_popup_footer"></div></div>', b.appendChild(c), c.querySelector("._8Mwnh").addEventListener("click", function (a) {
                    a.stopPropagation(), b.removeChild(c)
                });
                var d = this;
                chrome.runtime.sendMessage("isDownloadAllProcessNow", function (a) {
                    if (a) d.buildAllPopup({denied: 1}); else if (-1 !== window.location.href.indexOf("/p/")) d.pageType = d.PAGE_TYPE_ONE_POST, d.buildAllPopup({count: 1}); else if (document.querySelector('header a[href*="/followers/"]')) {
                        var b = -1 !== window.location.href.indexOf("/saved/");
                        d.checkPossibilityVirtualScrollPage(b, function (a) {
                            a && !a.error && a.success && a.count ? (d.pageType = d.PAGE_TYPE_USERPAGE, d.buildAllPopup({
                                count: a.count,
                                user_page: !0
                            })) : (d.pageType = d.PAGE_TYPE_DEFAULT, d.buildAllPopup({count: g.cachedMediaShortCodes.length}))
                        })
                    } else d.pageType = d.PAGE_TYPE_DEFAULT, d.buildAllPopup({count: g.cachedMediaShortCodes.length})
                })
            },
            rebuildPopup: function (a) {
                document.querySelector(".ext_all_popup_wrap") && d.pageType == d.PAGE_TYPE_DEFAULT && d.buildAllPopup({count: g.cachedMediaShortCodes.length})
            },
            buildAllPopup: function (a) {
                var b = d;
                if (b.massDownloadProSettings && b.pageType == b.PAGE_TYPE_USERPAGE) return b.buildAllPopupPro(a);
                b.isAdvancedSettings = !1;
                var c = document.querySelector(".ext_all_popup_wrap"), e = a.count;
                if (c) {
                    var f = c.querySelector(".ext_dl_all_popup"), g = c.querySelector(".ext_popup_header"),
                        h = c.querySelector(".ext_dl_all_popup_loader"), i = c.querySelector(".ext_popup_links_wrap"),
                        j = f.querySelector(".ext_popup_footer");
                    if (i.innerHTML = "", a.denied) return g.innerText = chrome.i18n.getMessage("parallel_all_download_denied"), h.style.display = "none", void(f.style.display = "block");
                    g.innerHTML = chrome.i18n.getMessage("files_found_on_page") + ": <br>" + e;
                    var k = e, l = !1;
                    if (b.pageType == b.PAGE_TYPE_DEFAULT) l = !0, j.innerText = chrome.i18n.getMessage("scroll_page_for_download_more"); else if (b.pageType == b.PAGE_TYPE_ONE_POST) {
                        var m = document.querySelectorAll("article header + div td").length;
                        g.innerHTML = chrome.i18n.getMessage("files_found_on_page") + ":  <br>" + e + " (" + m + ")"
                    }
                    var n = document.createElement("div");
                    n.className = "choose_count_dl_all_form", n.innerHTML = '<div class="ext_form_header">' + chrome.i18n.getMessage("set_range") + "</div><span>" + chrome.i18n.getMessage("from") + '</span><input id="ext_dl_all_start" type="number" min="1" max="' + (parseInt(e) - 1) + '" value="1"><span>' + chrome.i18n.getMessage("to") + '</span><input id="ext_dl_all_end" type="number" min="2" value="' + k + '" max="' + e + '">', i.appendChild(n)

                    var o = document.createElement("div");
                    o.className = "ext_btn_wrap", o.innerHTML = '<div class="ext_popup_dl_btn" data-count=""><span class="ext_icon"></span><span class="ext_text">' + chrome.i18n.getMessage("download") + "</span></div>", i.appendChild(o), h.style.display = "none", f.style.display = "block";
                    var p = document.querySelector("#ext_dl_all_start"), q = document.querySelector("#ext_dl_all_end");
                    $(q).on("keydown", function () {
                        var a = this;
                        setTimeout(function () {
                            var b = parseInt(a.value);
                            isNaN(b) || b < p.value ? a.value = p.value : b > e && (a.value = e)
                        }, 200)
                    }), $(p).on("keydown", function () {
                        var a = this;
                        setTimeout(function () {
                            var b = parseInt(a.value);
                            isNaN(b) || 1 > b ? a.value = 1 : b > q.value && (a.value = q.value)
                        }, 200)
                    })
                }
            },
            buildAllPopupPro: function (a) {
                var b = d;
                b.isAdvancedSettings = !0;
                var c = document.querySelector(".ext_all_popup_wrap"), e = a.count;
                if (c) {
                    var f = c.querySelector(".ext_dl_all_popup"), g = c.querySelector(".ext_popup_header"),
                        h = c.querySelector(".ext_dl_all_popup_loader"), i = c.querySelector(".ext_popup_links_wrap"),
                        j = f.querySelector(".ext_popup_footer");
                    i.innerHTML = "", g.innerHTML = chrome.i18n.getMessage("files_found_on_page") + ": <br>" + e;
                    var k = document.createElement("div");
                    k.className = "choose_count_dl_all_form", k.innerHTML = '<div class="ext_form_header">' + chrome.i18n.getMessage("advanced_settings_mass_download") + '</div><div class="ext_form_al_all_block"><div class="ext_form_al_all_sub_block"><div class="ext_half_66 ext_text_left"><span class="ext_span_label" title="' + chrome.i18n.getMessage("by_default_100") + '">' + chrome.i18n.getMessage("set_percent") + '</span></div><div class="inline_block ext_label_wrap"><label class="ext_switch" title="' + chrome.i18n.getMessage("by_default_100") + '"><input type="checkbox" name="percent_toggler"><span class="ext_slider"></span></label></div><div class="ext_half_33 ext_text_right"><input name="percent_count" type="number" max="100" min="1" value="100" class="ext_disabled" disabled>%</div></div><div class="ext_form_al_all_sub_block ext_text_left"><span class="ext_span_label">' + chrome.i18n.getMessage("most_liked") + '</span><div class="inline_block ext_label_wrap"><label class="ext_switch"><input type="checkbox" name="most_liked" disabled><span class="ext_slider ext_disabled"></span></label></div></div><div class="ext_form_al_all_sub_block ext_text_left"><span class="ext_span_label" title="' + chrome.i18n.getMessage("only_video") + '">' + chrome.i18n.getMessage("most_viewed") + '</span><div class="inline_block ext_label_wrap"><label class="ext_switch" title="' + chrome.i18n.getMessage("only_video") + '"><input type="checkbox" name="most_viewed" disabled><span class="ext_slider ext_disabled"></span></label></div></div></div><div class="ext_form_al_all_block"><div class="ext_form_al_all_sub_block ext_text_left"><span class="ext_span_label">' + chrome.i18n.getMessage("only_photo") + '</span><div class="inline_block ext_label_wrap"><label class="ext_switch"><input type="checkbox" name="only_photo"><span class="ext_slider"></span></label></div></div><div class="ext_form_al_all_sub_block ext_text_left"><span class="ext_span_label">' + chrome.i18n.getMessage("only_video") + '</span><div class="inline_block ext_label_wrap"><label class="ext_switch"><input type="checkbox" name="only_video"><span class="ext_slider"></span></label></div></div></div><div class="ext_form_al_all_block"><div class="ext_half_66 ext_text_left"><span class="ext_span_label">' + chrome.i18n.getMessage("for_previous_days") + '</span><div class="inline_block ext_label_wrap"><label class="ext_switch"><input type="checkbox" name="for_previous_days"><span class="ext_slider"></span></label></div></div><div class="ext_half_33 ext_text_right"><input type="number" name="last_days_count" class="ext_disabled" max="365" min="1" value="365" disabled></div></div>', i.appendChild(k);
                    var l = document.createElement("div");
                    l.className = "ext_btn_wrap", l.innerHTML = '<div class="ext_popup_dl_btn" data-count=""><span class="ext_icon"></span><span class="ext_text">' + chrome.i18n.getMessage("download") + "</span></div>", j.innerHTML = '<a href="#">' + chrome.i18n.getMessage("mass_download_pro_back") + "</a>", j.querySelector("a").addEventListener("click", function (c) {
                        c.stopPropagation(), c.preventDefault(), b.massDownloadProSettings = !1, chrome.runtime.sendMessage("massDownloadProSettingOff"), d.buildAllPopup(a)
                    });
                    var m = $(k), n = $('[name="percent_toggler"]', m), o = $('[name="percent_count"]', m),
                        p = $('[name="only_photo"]', m), q = $('[name="only_video"]', m),
                        r = $('[name="for_previous_days"]', m), s = $('[name="last_days_count"]', m),
                        t = $('[name="most_liked"]', m), u = $('[name="most_viewed"]', m);
                    $.fn.enableInput || ($.fn.enableInput = function () {
                        var a = this;
                        a && a.length && "input" == a.get(0).tagName.toLowerCase() && (a.removeAttr("disabled"), "checkbox" == a.attr("type") ? a.parent().find(".ext_slider").removeClass("ext_disabled") : "number" == a.attr("type") && a.removeClass("ext_disabled"))
                    }), $.fn.disableInput || ($.fn.disableInput = function () {
                        var a = this;
                        a && a.length && "input" == a.get(0).tagName.toLowerCase() && (a.attr("disabled", !0), "checkbox" == a.attr("type") ? a.parent().find(".ext_slider").addClass("ext_disabled") : "number" == a.attr("type") && a.addClass("ext_disabled"))
                    }), n.on("change", function () {
                        this.checked ? (t.enableInput(), q.prop("checked") && u.enableInput(), o.enableInput(), o.focus(), o.select()) : (t.disableInput(), t.prop("checked", !1), u.disableInput(), u.prop("checked", !1), o.disableInput())
                    }), p.on("change", function () {
                        this.checked && (q.prop("checked", !1), u.prop("checked", !1), u.disableInput())
                    }), q.on("change", function () {
                        this.checked ? (p.prop("checked", !1), n.prop("checked") && u.enableInput()) : (u.prop("checked", !1), u.disableInput())
                    }), r.on("change", function () {
                        this.checked ? (s.enableInput(), s.focus(), s.select()) : s.disableInput()
                    }), u.on("change", function () {
                        this.checked && t.prop("checked", !1)
                    }), t.on("change", function () {
                        this.checked && u.prop("checked", !1)
                    }), $(k.querySelector('[name="last_days_count"]')).on("keydown", function () {
                        var a = this;
                        setTimeout(function () {
                            var b = parseInt(a.value);
                            isNaN(b) || 1 > b ? a.value = 1 : b > 999 && (a.value = 999)
                        }, 200)
                    }), $(k.querySelector('[name="percent_count"]')).on("keydown", function () {
                        var a = this;
                        setTimeout(function () {
                            var b = parseInt(a.value);
                            isNaN(b) || 1 > b ? a.value = 1 : b > 100 && (a.value = 100), 100 > b ? t.enableInput() : (t.disableInput(), t.prop("checked", !1))
                        }, 200)
                    }), function () {
                        var a = b.advancedDownloadAllSettings.get() || {};
                        a.percent && a.percent < 100 && (n.prop("checked", !0), o.enableInput(), o.val(a.percent), t.enableInput(), a.most_liked && t.prop("checked", !0), "video" == a.mediaType && (u.enableInput(), a.most_viewed && u.prop("checked", !0))), "photo" == a.mediaType ? p.prop("checked", !0) : "video" == a.mediaType && q.prop("checked", !0), a.previousDays && (r.prop("checked", !0), s.enableInput(), s.val(a.previousDays))
                    }(), i.appendChild(l), h.style.display = "none", f.style.display = "block"
                }
            },
            downloadAllByAdvanced: function () {
                var a, b, c = $(".choose_count_dl_all_form"), e = {}, f = $('[name="percent_toggler"]', c),
                    h = $('[name="only_photo"]', c), i = $('[name="only_video"]', c),
                    j = $('[name="for_previous_days"]', c);
                if (j.prop("checked")) {
                    a = parseInt($('[name="last_days_count"]', c).val());
                    var k = new Date;
                    b = new Date(k.getFullYear() + "-" + (k.getMonth() + 1) + "-" + k.getDate()).getTime(), e.timeFrom = Math.floor((b - 864e5 * a) / 1e3), e.previousDays = a
                }
                e.mediaType = h.prop("checked") ? "photo" : i.prop("checked") ? "video" : "all", f.prop("checked") && (e.percent = parseInt($('[name="percent_count"]', c).val()), e.most_liked = $('[name="most_liked"]', c).prop("checked"), i.prop("checked") && (e.most_viewed = $('[name="most_viewed"]', c).prop("checked"))), d.advancedDownloadAllSettings.set(e), chrome.runtime.sendMessage("downloadAllProcessStart"), d.downloadFromUserPage({advanced: e}, function (a, b, c) {
                    a.length ? d.downloadByShortCodes(a, b, c, e) : (chrome.runtime.sendMessage("downloadAllProcessFinished"), g.getModalBox().showErrorBox(chrome.i18n.getMessage("advanced_download_all_not_match")))
                }), $(".ext_dl_all_popup").parent().remove()
            },
            advancedDownloadAllSettings: {
                storageKey: "advanced_download_all_settings", set: function (a) {
                    localStorage[this.storageKey] = JSON.stringify({
                        percent: a.percent || null,
                        most_liked: a.most_liked || null,
                        most_viewed: a.most_viewed || null,
                        mediaType: a.mediaType || null,
                        previousDays: a.previousDays || null
                    })
                }, get: function () {
                    return localStorage[this.storageKey] && JSON.parse(localStorage[this.storageKey])
                }
            },
            onClickDownloadAllBtn: function () {
                if (d.zipCanceledByUser = !1, d.isAdvancedSettings) return d.downloadAllByAdvanced();
                var b, c, e;
                switch (d.pageType) {
                    case d.PAGE_TYPE_DEFAULT:
                        var f = $("#ext_dl_all_start").val(), h = $("#ext_dl_all_end").val();
                        b = h - f, e = 1;
                        break;
                    case d.PAGE_TYPE_USERPAGE:
                        f = $("#ext_dl_all_start").val(), h = $("#ext_dl_all_end").val(), b = h - f, e = 2;
                        break;
                    case d.PAGE_TYPE_ONE_POST:
                        f = 1, h = 1, b = 1, e = 1;
                        var i = document.querySelector("article header a"), j = i && i.getAttribute("href");
                        c = j && j.match(/\/([^\/]+)\//), c = c && c[1];
                        break;
                    default:
                        a.trackEventWithRandom("Unknown_page_type_on_click_downloadAll", {
                            url: window.location.href,
                            pageType: d.pageType
                        }, .1), f = $("#ext_dl_all_start").val(), h = $("#ext_dl_all_end").val(), b = h - f, e = 1
                }
                isNaN(f) && (f = 1), isNaN(h) && (h = 1);
                var k = function () {
                    if (1 === e) {
                        var a = g.getFoundShortCodes(f, h);
                        d.downloadByShortCodes(a, null, c)
                    } else {
                        if (2 !== e) return;
                        d.downloadFromUserPage({start: f, end: h}, function (a, b, c) {
                            d.downloadByShortCodes(a, b, c)
                        })
                    }
                    chrome.runtime.sendMessage("downloadAllProcessStart")
                };
                b > 500 ? chrome.runtime.sendMessage("warning-request", function (a) {
                    a ? g.getModalBox().showDownloadAllWarning({
                        continueCallback: function () {
                            k()
                        }
                    }) : k()
                }) : k(), $(".ext_dl_all_popup").parent().remove()
            },
            checkPossibilityVirtualScrollPage: function (b, c) {
                var d = document.querySelector("main article header section h1"), e = d && d.innerText;
                e || (e = window.location.href.match(/instagram\.com\/([^\/]+)/), e = e[1]), e = e.trim(), a.getPostsDataFromUserGraphql({
                    userName: e,
                    fromSaved: b
                }, function (d) {
                    if (!d || d.error || "undefined" == typeof d.userId || "undefined" == typeof d.end_cursor || "undefined" == typeof d.has_next_page || "undefined" == typeof d.count || "undefined" == typeof d.shortcodes) return c({error: 1});
                    var f = d.count;
                    return d.has_next_page === !1 ? c({
                        success: 1,
                        count: f
                    }) : void a.getPostsDataFromUserGraphqlOther({
                        end_cursor: d.end_cursor,
                        user_name: e,
                        user_id: d.userId,
                        touch: !0,
                        from_saved: b,
                        first: 12
                    }, function (a) {
                        return c(!a || a.error || "undefined" == typeof a.end_cursor || "undefined" == typeof a.has_next_page || "undefined" == typeof!a.shortcodes ? {error: 1} : {
                            success: 1,
                            count: f
                        })
                    })
                })
            },
            downloadFromUserPage: function (b, c) {
                function e() {
                    if (!l.zipCanceledByUser) {
                        if (n && f.length >= n || !j || k) {
                            m && n && (f = f.slice(m - 1, n));
                            var g = 100 * p;
                            return c(f, g, u)
                        }
                        if (!h || !i) return a.trackEventWithRandom("error_download_zip", {
                            method: "scrollPage",
                            type: "endCursor_userId",
                            endCursor: h,
                            userId: i,
                            userName: u,
                            fromSaved: v
                        }, .1), chrome.runtime.sendMessage("downloadAllProcessFinished"), s.showErrorBox(chrome.i18n.getMessage("errorZip"));
                        var o = !1, t = setTimeout(function () {
                            r.no_progress = !0, r.dont_panic = !0, o = !0, s.updatePrepareZipProgressBarAndText(r)
                        }, 2e4);
                        a.getPostsDataFromUserGraphqlOther({
                            end_cursor: h,
                            user_name: u,
                            user_id: i,
                            from_saved: v,
                            downloadZipObj: d,
                            advanced: b.advanced
                        }, function (b) {
                            if (!d.zipCanceledByUser) {
                                if (clearTimeout(t), !b || b.error) return a.trackEventWithRandom("error_download_zip", {
                                    method: "scrollPage",
                                    type: "getPostsDataFromUserGraphqlOther",
                                    endCursor: h,
                                    userId: i,
                                    userName: u,
                                    fromSaved: v
                                }, .1), chrome.runtime.sendMessage("downloadAllProcessFinished"), s.showErrorBox(chrome.i18n.getMessage("errorZip"));
                                if (o && (r.no_progress = !1, r.dont_panic = !1, o = !1), h = b.end_cursor, j = b.has_next_page, k = b.time_end, f = f.concat(b.shortcodes), r.oneValuePercent = q * (b.shortcodes.length || 1), s.updatePrepareZipProgressBarAndText(r), w++, 50 > w) var c = 500; else c = 100 > w ? 1e3 : 200 > w ? 2e3 : 3e3;
                                setTimeout(function () {
                                    e()
                                }, c)
                            }
                        })
                    }
                }

                if ("function" == typeof c) {
                    var f = [], h = null, i = null, j = !0, k = !0, l = this, m = b.start, n = b.end, o = n;
                    !o && b.advanced && (b.advanced.previousDays && (o = 2 * b.advanced.previousDays), o = 500);
                    var p = .6, q = 100 / o * p, r = {allCount: o, maxValue: 100 * p, oneValuePercent: q},
                        s = g.getModalBox();
                    s.showPrepareDownloadProcess({
                        header: chrome.i18n.getMessage("prepare_zip_links"),
                        bar_start: 0
                    }, {
                        cancelCallback: function () {
                            l.zipCanceledByUser = !0, chrome.runtime.sendMessage("downloadAllProcessFinished")
                        }
                    });
                    var t = document.querySelector("main header section h1"), u = t && t.innerText;
                    if (u || (u = window.location.href.match(/instagram\.com\/([^\/]+)/), u = u[1]), u = u.trim(), !u) return a.trackEvent("no_username", {
                        method: "downloadFromUserPage",
                        url: window.location.href
                    }), chrome.runtime.sendMessage("downloadAllProcessFinished"), s.showErrorBox(chrome.i18n.getMessage("errorZip"));
                    var v = -1 !== window.location.href.indexOf("/saved/");
                    a.getPostsDataFromUserGraphql({userName: u, fromSaved: v, advanced: b.advanced}, function (b) {
                        return !b || b.error ? (a.trackEventWithRandom("error_download_zip", {
                            method: "getPostsDataFromUserGraphql",
                            userName: u,
                            fromSaved: v
                        }, .1), chrome.runtime.sendMessage("downloadAllProcessFinished"), s.showErrorBox(chrome.i18n.getMessage("errorZip"))) : (h = b.end_cursor, i = b.userId, j = b.has_next_page, k = b.time_end, f = f.concat(b.shortcodes), r.oneValuePercent = q * (b.shortcodes.length || 1), s.updatePrepareZipProgressBarAndText(r), void e())
                    });
                    var w = 0;
                    a.firstParamRequestJSONgraphqlQuery = 48
                }
            },
            downloadByShortCodes: function (a, b, c, e) {
                d.prepareLinksByShortCodes(a, b, e, function (a) {
                    if (a && a.length) d.downloadZIP(a, c); else if (d.zipCanceledByUser) ; else {
                        chrome.runtime.sendMessage("downloadAllProcessFinished");
                        var b = g.getModalBox();
                        if (a && a.error && "not_match" == inks.error) var e = chrome.i18n.getMessage("advanced_download_all_not_match"); else e = chrome.i18n.getMessage("errorZip");
                        b.showErrorBox(e)
                    }
                })
            },
            prepareLinksByShortCodes: function (b, c, d, f) {
                function h(b, c, d, e, f) {
                    if (m.zipCanceledByUser) return c();
                    if (!q) return p && !f ? void setTimeout(function () {
                        h(b, c, d, e)
                    }, 2e4) : void a.getAllMediaDataFromJsonGraphql(function (a) {
                        return a && a.error && 429 == a.reason ? p ? f ? ++f < 2 ? void setTimeout(function () {
                            h(b, c, d, e, f)
                        }, 20 * f * 1e3) : (q = !0, c(), void j(d)) : void setTimeout(function () {
                            h(b, c, d, e)
                        }, 1e4) : (p = !0, f = 1, r.no_progress = !0, r.dont_panic = !0, o.updatePrepareZipProgressBarAndText(r), void setTimeout(function () {
                            h(b, c, d, e, f)
                        }, 2e4)) : a && !a.error && a.length ? (p && (p = !1, r.no_progress = !1, r.dont_panic = !1), a.forEach(function (a) {
                            n.push(a)
                        }), o.updatePrepareZipProgressBarAndText(r), void b(e)) : (d.push(e), void b(e))
                    }, e)
                }

                function i(a) {
                    if (!d) return a;
                    var b = [];
                    if ("all" !== d.mediaType) {
                        if (a.forEach(function (a) {
                            d.mediaType == a.type && b.push(a)
                        }), !b || !b.length) return {error: "not_match"}
                    } else b = a;
                    if (d.percent && d.percent < 100) {
                        d.most_liked ? e.objectSortByProp(b, "likes_count", !0) : "video" == d.mediaType && d.most_viewed ? e.objectSortByProp(b, "video_view_count", !0) : b = e.shuffle(b);
                        var c = Math.ceil(b.length * d.percent / 100);
                        b = b.splice(0, c)
                    }
                    return b
                }

                function j(b, c) {
                    c = c || 0, c++;
                    var d = 4;
                    if (c > d) {
                        var k = 0;
                        return b.forEach(function (a) {
                            var b = g.getCachedLinkByShortCode(a);
                            b && (n.push(b), k++)
                        }), b.length - k > 5 && b.length > l / 10 + k ? (a.trackEventWithRandom("error_download_zip", {
                            method: "prepareLinksByShortCodes",
                            type: "many tries",
                            rejectedCount: b.length,
                            allCount: l
                        }, .1), f({error: 1})) : void f(i(n))
                    }
                    if (q) return .9 * l > n.length ? (a.trackEventWithRandom("error_download_zip", {
                        method: "prepareLinksByShortCodes",
                        type: "429TooLong",
                        successCount: n.length,
                        allCount: l
                    }, .1), f({error: 1})) : void f(i(n));
                    var o = [];
                    e.customPromiseAll({data: b, asyncCount: 12 / c}, function (a, b, c) {
                        h(b, c, o, a)
                    }).thenOne(function (a) {
                        return m.zipCanceledByUser ? f() : void(o.length ? setTimeout(function () {
                            j(o, c)
                        }, 3e3 * c) : f(i(n)))
                    }, function (a) {
                        return f()
                    })
                }

                if ("function" == typeof f) {
                    if (!Array.isArray(b) || !b.length) return f();
                    c = c || 0;
                    var k = (100 - c) / 100, l = b.length, m = this, n = [], o = g.getModalBox(), p = !1, q = !1,
                        r = {allCount: l, oneValuePercent: 100 / l * k};
                    o.showPrepareDownloadProcess({
                        header: chrome.i18n.getMessage("prepare_zip_links"),
                        bar_start: c
                    }, {
                        cancelCallback: function () {
                            m.zipCanceledByUser = !0, chrome.runtime.sendMessage("downloadAllProcessFinished")
                        }
                    }), j(b)
                }
            },
            downloadZIP: function (b, c, d, f) {
                function h() {
                    k.zipCanceledByUser = !0, n.aborted = !0, j()
                }

                function i(a) {
                    if (k.zipCanceledByUser) return void(n.aborted = !0);
                    if ("undefined" == typeof o[a]) j(); else if (0 == o[a].length && o[a + 1] && o[a + 1].length) setTimeout(function () {
                        i(a + 1)
                    }, 1e3 * (a + 1)); else if (0 != o[a].length || o[a + 1] && o[a + 1].length) if (o[a].length) {
                        var b = o[a].shift();
                        JSZipUtils.getBinaryContent(b.url, function (c, d) {
                            c ? o[a + 1] && o[a + 1].push(b) : (q.rejectedCount--, q.successCount++, q.retrySuccessCount++, q.lastSuccess = !0, m.updateDownloadZipProgressBar(q), l.file(b.filename, d, {binary: !0})), setTimeout(function () {
                                i(a)
                            }, 1e3 * a)
                        }, n, s)
                    } else j(); else j()
                }

                function j() {
                    f || chrome.runtime.sendMessage("downloadAllProcessFinished"), l.generateAsync({type: "blob"}).then(function (a) {
                        var b = new Date,
                            e = c + "_" + b.getFullYear() + "_" + (b.getMonth() + 1) + "_" + b.getDate() + "_" + b.getHours() + "_" + b.getMinutes() + "_" + b.getSeconds() + ".zip";
                        saveAs(a, e), m.close(), "function" == typeof d && d({success: 1}), chrome.runtime.sendMessage({
                            action: "downloadZip",
                            count: p,
                            successCount: q.successCount
                        })
                    })
                }

                var k = this, l = new JSZip;
                c = c || "Instagram";
                var m = g.getModalBox(), n = {aborted: !1}, o = [null, [], [], []], p = b.length, q = {
                    allCount: p,
                    successCount: 0,
                    rejectedCount: 0,
                    retrySuccessCount: 0,
                    retryRequestsCount: void 0,
                    oneValuePercent: 100 / p,
                    lastSuccess: !1
                }, r = 6e4, s = 3e5, t = {enoughCallback: h};
                f ? t.cancelCallback = function () {
                    k.zipCanceledByUser = !0, n.aborted = !0
                } : t.cancelCallback = function () {
                    k.zipCanceledByUser = !0, n.aborted = !0, chrome.runtime.sendMessage("downloadAllProcessFinished")
                }, m.showDownloadProcess(p, t), e.customPromiseAll({data: b, asyncCount: 12}, function (a, b, c) {
                    return k.zipCanceledByUser ? (n.aborted = !0, c()) : void JSZipUtils.getBinaryContent(a.url, function (c, d) {
                        c ? (q.rejectedCount++, o[1].push(a), b(a.filename)) : (q.successCount++, q.lastSuccess = !0, m.updateDownloadZipProgressBar(q), l.file(a.filename, d, {binary: !0}), b(a.filename))
                    }, n, r)
                }).thenOne(function (a) {
                    k.zipCanceledByUser || (o[1].length ? (q.retryRequestsCount = o[1].length, q.text = chrome.i18n.getMessage("retry_requests"), q.lastSuccess = !1, m.updateDownloadZipProgressBar(q), setTimeout(function () {
                        i(1)
                    }, 1e3)) : j())
                }, function (b) {
                    f || chrome.runtime.sendMessage("downloadAllProcessFinished"), k.zipCanceledByUser || (m.showErrorBox(chrome.i18n.getMessage("errorZip")), "function" == typeof d && d({error: 1}), a.trackEventWithRandom("error_download_zip", {
                        count: p,
                        successCount: q.successCount
                    }, .1))
                })
            }
        }
    }(), e = function () {
        return {
            bridge: function (a) {
                "use strict";
                a.args = a.args || [], void 0 === a.timeout && (a.timeout = 300);
                var b = "ext-bridge-" + parseInt(1e3 * Math.random()) + "-" + Date.now(), c = function (d) {
                    window.removeEventListener("ext-bridge-" + b, c);
                    var e;
                    e = d.detail ? JSON.parse(d.detail) : void 0, a.cb(e)
                };
                window.addEventListener("ext-bridge-" + b, c);
                var d = "(" + function (a, b, c, d) {
                        var e = document.getElementById(c);
                        e && e.parentNode.removeChild(e);
                        var f = !1, g = function (a) {
                            if (!f) {
                                f = !0;
                                var b = new CustomEvent("ext-bridge-" + c, {detail: JSON.stringify(a)});
                                window.dispatchEvent(b)
                            }
                        };
                        d && setTimeout(function () {
                            g()
                        }, d), b.push(g), a.apply(null, b)
                    }.toString() + ")(" + [a.func.toString(), JSON.stringify(a.args), JSON.stringify(b), parseInt(a.timeout)].join(",") + ");",
                    e = document.createElement("script");
                e.id = b, e.innerText = d, document.querySelector("body").appendChild(e)
            }, objectSortByProp: function (a, b, c) {
                function d(a, d) {
                    var e = parseInt(a[b]), f = parseInt(d[b]);
                    return c ? f > e ? 1 : e > f ? -1 : 0 : e > f ? 1 : f > e ? -1 : 0
                }

                a.sort(d)
            }, shuffle: function (a) {
                var b, c, d;
                for (d = a.length - 1; d > 0; d--) b = Math.floor(Math.random() * (d + 1)), c = a[d], a[d] = a[b], a[b] = c;
                return a
            }, customPromiseAll: function (a, b) {
                function c() {
                    f || (f = setInterval(function () {
                        g !== i && (clearInterval(f), f = void 0, g === j ? q() : r())
                    }, 10))
                }

                var d, e, f, g, h, i = 0, j = 1, k = 2, l = a.data, m = (a.timeout || 6e5, a.asyncCount || 48), n = !1,
                    o = this, p = [], q = function () {
                        "function" == typeof h.resolve && (l = p, setTimeout(function () {
                            try {
                                h.resolve(l)
                            } catch (a) {
                                p = a, r()
                            }
                        }, 0))
                    }, r = function () {
                        n || (n = !0, "function" == typeof h.reject && (b = h.reject)(p))
                    }, s = function () {
                        e = 0, d = l.length;
                        var a = 0, f = function (b) {
                            return function (c) {
                                Array.isArray(p) && g != k && (a--, e++, p[b] = c, e === d && (g = j))
                            }
                        }, h = function (a) {
                            g = k, p = a
                        };
                        g = i, c();
                        var n = setInterval(function () {
                            if (!l.length || g != i) return void clearInterval(n);
                            var c = m - a;
                            1 > c || l.splice(0, c).forEach(function (c, d) {
                                setTimeout(function () {
                                    try {
                                        a++, b(c, f(d), h)
                                    } catch (e) {
                                        p = e, g = k
                                    }
                                }, 0)
                            })
                        }, 500)
                    };
                return this.thenOne = function (a, b) {
                    return h = {resolve: a, reject: b}, c(), o
                }, s(), this
            }, isMainPage: function () {
                return "/" == window.location.pathname && "instagram.com" == window.location.host.replace(/^w{3}\./, "") && null == document.querySelector('input[type="password"]')
            }, getHostName: function () {
                return window.location.host.toLowerCase().replace(/^www\./, "").replace(/:.*$/, "")
            }, isNativeStories: function () {
                return /instagram.com\/stories\/\w+/.test(window.location.href)
            }, isLoginPage: function () {
                return null != document.querySelector('input[type="password"]')
            }, isAccountSettingPage: function () {
                return window.location.pathname.indexOf("instagram.com/emails/") > -1 || window.location.pathname.indexOf("instagram.com/accounts/") > -1
            }, isMultiplePost: function (a) {
                return null != a.querySelector(".coreSpriteRightChevron") || null != a.querySelector(".coreSpriteLeftChevron") || null != a.querySelector(".coreSpriteSidecarIconLarge") || null != a.querySelector('a.MpBh3[role="button"]') || null != a.querySelector('a.SWk3c[role="button"]') || null != a.querySelector("span.Z4Ol1.Szr5J.o0qq2 ")
            }, isSavedMedia: function () {
                return -1 !== window.location.pathname.indexOf("/saved/")
            }, isWindows: function () {
                return window.navigator.userAgent.toLowerCase().indexOf("windows") > -1
            }, isUsualDesktopInstagram: function () {
                return (document.querySelector(".coreSpriteMobileNavSearchInactive") || document.querySelector(".coreSpriteMobileNavSearchActive")) && (document.querySelector(".coreSpriteFeedCreation") || document.querySelector(".coreSpriteMobileNavSearchActive")) ? !1 : !0
            }, isFrame: function () {
                return window.top != window.self
            }
        }
    }(), f = function () {
        function b(a, b) {
            if (a.files && a.files[0]) {
                var c = new FileReader;
                c.onload = b, c.readAsDataURL(a.files[0])
            }
        }
    }(), g = function () {
        return {
            dlBtnClassName: "ext_desktop_dl_btn",
            buttonTemplate: null,
            authorizedUserName: null,
            isFrame: !1,
            updatesStoryInterval: 0,
            observerDomInterval: 0,
            disabledApp: !1,
            cachedMedia: [],
            cachedMediaShortCodes: [],
            lastUri: null,
            run: function () {
                var b = this;
                "undefined" == typeof window.localStorage.ext_igtv_on && (window.localStorage.ext_igtv_on = "1"), this.disconnectPortObserver.testConnect(), a.fixForeach(), this.createDownloadButtonTpl(), this.observerDOMInit(), this.messagesListenerInit(), this.userActionsListenerInit(), a.getWorkingQueryHashes(), a.getAuthorizedUserName(function (a) {
                    return a ? void(b.authorizedUserName = a) : void b.getUserSelfInfo()
                }), chrome.runtime.sendMessage("askMassDownloadPro", function (a) {
                    a && (d.massDownloadProSettings = !0)
                }), window.ext_blob_story_data = {}
            },
            observerDOMInit: function () {
                function b() {
                    try {
                        var b = document.querySelector("#react-root");
                        if (!b) return void("instagram.com" == e.getHostName() && Math.random() < .001 && a.trackEventPost("no_react-root", window.location.href, document.body && document.body.innerHTML));
                        var c = {attributes: !1, childList: !0, characterData: !1, subtree: !1},
                            d = e.isNativeStories(), f = new MutationObserver(function (a) {
                                a.forEach(function (a) {
                                    if (a.addedNodes.length) for (var b = 0; a.addedNodes[b]; b++) if ("section" == a.addedNodes[b].tagName.toLowerCase()) {
                                        window.location.href.indexOf("/stories/") > -1 ? (d = !0, j()) : (d ? d = !1 : g.resetFoundLinks(), setTimeout(function () {
                                            m()
                                        }, 0));
                                        break
                                    }
                                })
                            });
                        f.observe(b, c)
                    } catch (h) {
                        a.trackCodeError(h, "reactRootObserver")
                    }
                }

                function h() {
                    g.lastUri && g.authorizedUserName && (-1 !== g.lastUri.indexOf("/saved/") && -1 === window.location.pathname.indexOf("/saved/") && -1 !== window.location.pathname.indexOf("/" + g.authorizedUserName + "/") || -1 === g.lastUri.indexOf("/saved/") && -1 !== g.lastUri.indexOf("/" + g.authorizedUserName + "/") && -1 !== window.location.pathname.indexOf("/saved/")) && g.resetFoundLinks(), g.lastUri = window.location.pathname
                }

                function i() {
                    if (!e.isNativeStories()) return !1;
                    var a = document.querySelector("._sq4bv ._psbeo ._ni05h section");
                    a || (a = document.querySelector("section > div div section")), a && c.checkStateDownloadAllBtn(a)
                }

                function j(b) {
                    if (!e.isNativeStories()) return !1;
                    var d = document.querySelector("._sq4bv ._psbeo ._ni05h section");
                    return d || (d = document.querySelector("section > div div section")), d ? d && "1" != d.dataset.extSkip && (d.dataset.extSkip = 1, setTimeout(function () {
                        c.addDlBtn2NativeStories(d)
                    }, 0)) : b ? setTimeout(j, 200) : !document.querySelector(".coreSpriteFeedCreation") && Math.random() < .001 && chrome.runtime.sendMessage("noNativeStoriesContTrack", function () {
                        var b = document.querySelector("#react-root");
                        b ? a.trackEventPost("no_native_stories_cont", location.href, b.innerHTML) : a.trackEventPost("no_native_stories_cont_no_react_root", location.href, document.body && document.body.innerHTML)
                    }), !0
                }

                function k() {
                    if (e.isMainPage()) {
                        var b = document.querySelector("section > main > section > div:first-child");
                        b ? b && "1" != b.dataset.extSkip && (b.dataset.extSkip = 1, setTimeout(function () {
                            c.insertStoriesBlock(b)
                        }, 0)) : !document.querySelector(".coreSpriteFeedCreation") && Math.random() < 1e-5 && chrome.runtime.sendMessage("noMainContTrack", function () {
                            var b = document.querySelector("#react-root");
                            b ? a.trackEventPost("no_main_cont", location.href, b.innerHTML) : a.trackEventPost("no_main_cont_no_react_root", location.href, document.body && document.body.innerHTML)
                        })
                    }
                }

                function l() {
                    if (!document.querySelector("." + g.mobileModeBtnClassName)) {
                        var a = document.querySelector("section > main + nav ._qlijk");
                        if (a || (a = document.querySelector("section > main + nav > div > div > div > div:last-child div")), a) {
                            var b = document.createElement("div");
                            b.className = "XrOey", b.innerHTML = '<a class="_8scx2 _gvoze ' + g.mobileModeBtnClassName + '" href=""></a>', a.appendChild(b)
                        }
                    }
                }

                function m() {
                    setTimeout(function () {
                        l()
                    }, 0), setTimeout(function () {
                        k()
                    }, 0), setTimeout(function () {
                        j()
                    }, 0), h(), i();
                    var b = document.querySelector('main header section a[href^="/accounts/edit"]');
                    b && setTimeout(function () {
                        f.uploadStateInit(b.parentNode)
                    }, 0);
                    var e = !1;
                    !/[\/\?]saved/.test(window.location.href) && b && b.previousSibling && g.authorizedUserName && b.previousSibling.innerText && g.authorizedUserName === b.previousSibling.innerText && (e = !0);
                    var m = 0, n = document.querySelectorAll('section > main article > div > div > div a[href^="/p/"]');
                    if (n && n.forEach && n.forEach(function (a) {
                        a.parentNode.dataset.extSkip || (m++, g.addDlBtn(a.parentNode, 2)), e && !a.parentNode.dataset.dlBtnSkip && f.addDeleteBtnToThumbnail(a.parentNode)
                    }), document.querySelector('header a[href*="/followers/"]') && !document.querySelector('a[href*="/channel/"]') && !document.querySelector(".ext_igtv_list_panel")) {
                        var o = document.querySelector("#react-root section > main > div");
                        o && "1" != o.dataset.ext_igtv && g.addIgtvPanel(o)
                    }
                    var p = document.querySelectorAll("div > div > article > header + div > div > div");
                    p && p.forEach && p.forEach(function (a) {
                        a.parentNode.dataset.extSkip > 0 || (m++, g.addDlBtn(a.parentNode, 1))
                    });
                    var q = document.querySelectorAll("div > div > article > header + div > div > div ul > li");
                    q && q.length && !document.querySelector("div > div > article > header + div > div > div ul .downloadbtnIco") && !a.trackMultiplePostsLi && Math.random() < 5e-5 && (a.trackMultiplePostsLi = !0, a.trackEvent("mediaInMultiplePostsLi exists", {ul: document.querySelector("div > div > article > header + div > div > div ul").innerHTML})), m > 0 && d.rebuildPopup(), c.updateStories()
                }

                function n() {
                    var a = document.querySelectorAll(".Embed > .Header + div");
                    a && a.forEach && a.forEach(function (a) {
                        return a.dataset.extSkip > 0 ? !1 : void g.addDlBtn(a, 3)
                    })
                }

                return e.isFrame() ? (g.isFrame = !0, void n()) : (setTimeout(function () {
                    l()
                }, 0), setTimeout(function () {
                    k()
                }, 0), setTimeout(function () {
                    m()
                }, 0), b(), void(g.observerDomInterval = setInterval(function () {
                    m()
                }, 1500)))
            },
            messagesListenerInit: function () {
                chrome.runtime.onMessage.addListener(g.chromeMessagesListener)
            },
            userActionsListenerInit: function () {
                var b = $("body"), e = Date.now(), h = this, i = function () {
                    var a = Date.now();
                    return e + 500 > a ? !0 : (e = a, !1)
                };
                b.on("click", "." + g.dlBtnClassName, function (a) {
                    g.disabledApp || i() || g.onClickDownloadBtn.call(this, a)
                }), b.on("click", 'a.MpBh3[role="button"], a.SWk3c[role="button"]', function (a) {
                    h.multiplePostSwitchListener.call(this, h, a)
                }), g.isFrame || (b.on("click", ".ext_popup_dl_btn", d.onClickDownloadAllBtn), b.on("click", ".ext_del_btn", function (a) {
                    if (!g.disabledApp && !i()) {
                        var b = this.dataset.shortcode, c = g.getModalBox();
                        c.showDeleteWarning({continueDelCallback: f.deleteMedia(b)})
                    }
                }), b.on("click", "." + d.dlBtnClassName, function (a) {
                    g.disabledApp || i() || d.showPopupDlAll()
                }), b.on("click", ".ext_story_item_wrap", function (b) {
                    if (!g.disabledApp && !i()) {
                        var d, e = this, f = c.allCurrentStories, h = e.dataset.storyId, j = e.dataset.storyType,
                            k = null;
                        for (var l in f) if (f[l].id && f[l].id == h || f[l].pk && f[l].pk == h) {
                            k = f[l], d = l;
                            break
                        }
                        if (!k) {
                            if ("live" == j) var m = chrome.i18n.getMessage("broadcast_finished"); else m = chrome.i18n.getMessage("story_is_not_available");
                            var n = g.getModalBox();
                            return n.showErrorBox(m)
                        }
                        var o = [];
                        if ("tray" == j) if ("undefined" != typeof k.items) {
                            if (o = c.getPrepareStoryItems(k.items), !o.length) return;
                            c.showInPswp(o)
                        } else {
                            var p = k.user && k.user.pk;
                            if (!p) return void a.trackEventWithRandom("no_user_id", {user_object: k.user}, .01);
                            c.requestOneUserStories(p, function (a) {
                                a && (f[d] = a, o = c.getPrepareStoryItems(a.items), o.length && c.showInPswp(o))
                            })
                        } else o = c.getPrepareLiveStory(k), c.showInPswp(o)
                    }
                }), b.on("click", ".ext_ds_dl_btn", function (a) {
                    g.disabledApp || (a.stopPropagation(), a.preventDefault(), i() || c.onClickDlBtnOurStoryOne())
                }), b.on("click", ".ext_ds_dl_all_btn", function (a) {
                    g.disabledApp || (a.stopPropagation(), a.preventDefault(), i() || c.onClickDlBtnOurStoryAll())
                }), b.on("click", ".ext_ns_dl_btn", function (a) {
                    i() || c.onClickDlBtnNativeStoryOne.call(this, a)
                }), b.on("click", ".ext_ns_dl_all_btn", function (a) {
                    i() || c.onClickDlBtnNativeStoryAll.call(this, a)
                }), b.on("click", ".upload_by_mobile_mode, .delete_by_mobile_mode, ." + g.mobileModeBtnClassName, function (a) {
                    a.preventDefault(), i() || chrome.runtime.sendMessage("openMobileMode")
                }), b.on("click", ".ext_video_story_player", function (a) {
                    i() || (this.paused ? this.play() : this.pause())
                }))
            },
            sendReportGlobal: function () {
                setTimeout(function () {
                    chrome.runtime.sendMessage("needReportRequests", function (b) {
                        b && (a.trackEvent("FirstHourStats", {
                            domStats: a.domStats,
                            clicks: a.clickStats,
                            res: a.resStats,
                            requestsStats: a.requestsStats
                        }), chrome.runtime.sendMessage("reportRequestsSent"))
                    })
                }, 36e5)
            },
            prepareDomReport: function () {
                function b(a, c, d) {
                    1 === c.nodeType && "article" != c.nodeName.toLowerCase() && (c.classList.contains(g.mobileModeBtnClassName) || c.classList.contains("download_all_wrap") || (c.childElementCount ? (d++, c.children && c.children.forEach(function (c) {
                        b(a, c, d)
                    })) : a.push({tag: c.nodeName, className: c.className, depth: d})))
                }

                var c = 0, d = !1, f = !1, h = setInterval(function () {
                    var i, j = e.isMainPage(), k = [], l = document.querySelectorAll("." + g.dlBtnClassName).length,
                        m = document.querySelectorAll("div > div > article > header + div > div > div"),
                        n = document.querySelectorAll('section > main article > div > div > div a[href^="/p/"]');
                    try {
                        if (j && 0 == a.domStats.stB && !f && a.domState.length && !document.querySelector(".coreSpriteFeedCreation") && (i = a.domState[a.domState.length - 1], i.isMainPage)) {
                            f = !0;
                            var o = document.querySelector("#react-root > section > main > section > div:first-child"),
                                p = document.querySelector("#react-root > section"),
                                q = document.querySelector("#react-root > section > main"),
                                r = document.querySelector("#react-root > section > main > section"), s = [], t = [],
                                u = 0, v = 0;
                            r ? (u = r.childElementCount, r.childNodes && r.childNodes.forEach(function (a) {
                                t.push({
                                    el: a.nodeName + "_" + a.className,
                                    firstChild: a.firstElementChild && a.firstElementChild.nodeName + "_" + a.firstElementChild.className,
                                    lastChild: a.lastElementChild && a.lastElementChild.nodeName + "_" + a.lastElementChild.className
                                })
                            })) : q && (v = q.childElementCount, q.childNodes && q.childNodes.forEach(function (a) {
                                s.push({
                                    el: a.nodeName + "_" + a.className,
                                    firstChild: a.firstElementChild && a.firstElementChild.nodeName + "_" + a.firstElementChild.className,
                                    lastChild: a.lastElementChild && a.lastElementChild.nodeName + "_" + a.lastElementChild.className
                                })
                            }));
                            var w = {
                                container: +!!o,
                                userAgent: window.navigator.userAgent,
                                articlesCount: document.querySelectorAll("article").length,
                                section1El: +!!p,
                                mainEl: +!!q,
                                section2El: +!!r,
                                section2ChildrenCount: u,
                                section2Children: t,
                                mainElChildrenCount: v,
                                mainElChildren: s
                            };
                            a.trackEvent("stories_block2_report", w)
                        }
                    } catch (x) {
                        a.trackEventWithRandom("error_in_stories_block_report", {error: x}, .01)
                    }
                    if (!d && l > 1 && !document.querySelector(".coreSpriteFeedCreation") && !document.querySelector(".download_all_wrap")) {
                        d = !0;
                        var y = document.querySelector("#react-root > section > main + nav"),
                            z = document.querySelector("section > main + nav > div > div > div > div:last-child");
                        !z && y && b(k, y, 0), a.trackEvent("nav2_report", {
                            url: window.location.href,
                            userAgent: window.navigator.userAgent,
                            navExists: !!y,
                            navDeepChild: z && z.innerHTML,
                            navNodes: k
                        })
                    }
                    var A = {
                        isMainPage: j,
                        url: window.location.href,
                        aP: document.querySelectorAll('a[href^="/p/"]').length,
                        pNew: n.length,
                        pMain: m.length,
                        dlBtn: l,
                        cache: g.cachedMedia.length
                    };
                    a.domState.push(A), c++, c > 10 && (clearInterval(h), a.domState = {})
                }, 2e4)
            },
            onClickDownloadBtn: function (b) {
                b.stopPropagation(), b.preventDefault(), a.clickStats.dlBtn++;
                var c = this;
                if (!(c instanceof HTMLElement && c.classList.contains(g.dlBtnClassName))) return void g.showDownloadError();
                g.loaderBtnState.on(c);
                var d = c.dataset.shortcode;
                a.getMediaItemFromJsonGraphql(function (b) {
                    if (!b || b.error) try {
                        if (g.isVideoPost(c.parentNode)) {
                            var d = g.findVideoElement(c.parentNode);
                            if (d) var e = g.getLinkFromVideoElement(d), f = a.getFileNameFromVideoLink(e)
                        } else if (g.isImagePost(c.parentNode)) {
                            var h = g.findImageElement(c.parentNode);
                            h && (e = g.getLinkFromImgElement(h), f = a.getFileNameFromImageLink(e))
                        }
                        e && a.isValidUrl(e) && f && (b = {url: e, filename: f})
                    } catch (i) {
                        a.trackEventWithRandom("error_in_try_found_reserve_url", {container: c.parentNode.outerHTML}, .001)
                    }
                    g.onGetMediaInfo.call(g, b, c)
                }, d, c.dataset.multiplePos)
            },
            onGetMediaInfo: function (b, c) {
                var d = this;
                return b && !b.error && b.url && b.filename ? void a.downloadFile(b, function (a) {
                    d.loaderBtnState.off(), a || d.showDownloadError(c)
                }) : (d.loaderBtnState.off(), d.showDownloadError(c))
            },
            resetFoundLinks: function () {
                this.cachedMedia = [], this.cachedMediaShortCodes = []
            },
            loaderBtnState: {
                on: function (a) {
                    $(".ext_icon", a).addClass("preloader2")
                }, off: function () {
                    $("." + g.dlBtnClassName + " .ext_icon.preloader2").removeClass("preloader2"), $("." + c.dlBtnClassName + " .ext_icon.preloader2").removeClass("preloader2")
                }
            },
            multiplePostSwitchListener: function (b, c) {
                var d = $(this).closest("article").get(0);
                if (d) {
                    var e = d.querySelector("." + b.dlBtnClassName);
                    if (e) {
                        if ("undefined" == typeof e.dataset.multiplePos && (e.dataset.multiplePos = 0), this.classList.contains("Zk-Zb")) var f = 1; else {
                            if (!this.classList.contains("_2Igxi")) return void a.trackEventWithRandom("change_multiple_switcher_class", {el: this.innerHTML}, .01);
                            f = -1
                        }
                        e.dataset.multiplePos = parseInt(e.dataset.multiplePos) + f, parseInt(e.dataset.multiplePos) < 0 && (e.dataset.multiplePos = 0)
                    }
                }
            },
            showDownloadError: function (a) {
                if (a) {
                    var b = a.parentNode;
                    $(b).append('<div class="error_dl_msg_desktop">' + chrome.i18n.getMessage("error_dl_msg") + "</div>"), setTimeout(function () {
                        $(".error_dl_msg_desktop").remove()
                    }, 2e3)
                }
            },
            disableApp: function () {
                clearInterval(this.updatesStoryInterval), clearInterval(this.observerDomInterval), this.disabledApp = !0, this.disconnectPortObserver.port && this.disconnectPortObserver.port.onDisconnect.removeListener(this.disconnectPortObserver.disconnectListener), chrome.runtime.onMessage.removeListener(g.chromeMessagesListener), $("." + g.dlBtnClassName).remove(), $("." + c.storiesWrapperClass).remove(), $("." + d.downloadAllBtnWrapperClass).remove(), $("." + g.mobileModeBtnClassName).remove()
            },
            chromeMessagesListener: function (b, d, e) {
                if (!b) return !1;
                if ("checkConnect" == b) e(!0); else {
                    if ("getFoundLinks" == b) return g.getFoundLinks(e), !0;
                    "checkLinks" == b ? g.checkLinks() : "getAuthorizedUserName" == b ? e(g.authorizedUserName) : "storyPauseOffByDownloadId" == b ? c.storiesPause.off() : "storyPauseOffByBlobUrl" == b.action ? window.ext_blob_story_data.object_url == b.url && c.storiesPause.off() : "downloadFileFinished" == b.action && ("interrupted" == b.status ? a.resStats.dI++ : "complete" == b.status && a.resStats.dC++)
                }
            },
            disconnectPortObserver: {
                port: null, testConnect: function () {
                    this.port = chrome.runtime.connect(), this.port.onDisconnect.addListener(this.disconnectListener)
                }, disconnectListener: function () {
                    g.disconnectPortObserver.showDisconnectNotification()
                }, showDisconnectNotification: function () {
                    var a = document.createElement("div");
                    a.className = "disconnect_notification", a.innerHTML = '<div class="notify_wrap"><div class="ext_close_btn">&times;</div><div class="ext_text">' + chrome.i18n.getMessage("disconnect_notification") + "</div></div>";
                    var b = a.querySelector(".ext_close_btn");
                    b.addEventListener("click", function () {
                        a.remove()
                    }), document.querySelector("body").appendChild(a), $(a).animate({opacity: 1, right: "20px"}, 1e3)
                }
            },
            getFoundLinks: function (b) {
                try {
                    var d = this, f = [];
                    if (null != c.gallery && 0 != c.showingStoryItems.length && "tray" == c.showingStoryType) c.showingStoryItems.forEach(function (a) {
                        f.push({isStory: !0, type: a.type, prev: a.prev, url: a.url, filename: a.filename})
                    }); else {
                        if (e.isNativeStories()) return void c.getAllLinksCurrentNativeStories(function (a) {
                            a.forEach(function (a) {
                                f.push({isStory: !0, type: a.type, prev: a.prev, url: a.url, filename: a.filename})
                            }), b(f)
                        });
                        f = d.cachedMedia
                    }
                    "function" == typeof b && b(f)
                } catch (g) {
                    a.trackCodeError(g, "getFoundLinks")
                }
            },
            getCachedLinkByShortCode: function (a) {
                for (var b = 0; g.cachedMedia[b]; b++) if (g.cachedMedia[b].shortcode == a) return "string" == typeof g.cachedMedia[b].url && g.cachedMedia[b].url.length ? {
                    url: g.cachedMedia[b].url,
                    filename: g.cachedMedia[b].filename
                } : null;
                return null
            },
            getFoundShortCodes: function (a, b) {
                return a = "undefined" == typeof a || isNaN(parseInt(a)) ? 0 : parseInt(a) - 1, b = isNaN(parseInt(b)) ? void 0 : parseInt(b), this.cachedMediaShortCodes.slice(a, b)
            },
            findVideoElement: function (a) {
                return a.querySelector("video")
            },
            findImageElement: function (b) {
                var c = null, d = b.querySelectorAll("img[src], img[srcset]");
                if ("undefined" == typeof d.length) a.trackEventWithRandom("NodeList_not_has_length_property", "", .001), c = b.querySelector("img[src], img[srcset]"); else if (1 === d.length) c = d[0]; else if (d.length > 1) {
                    for (var e = 0; d[e]; e++) {
                        var f = d[e].getAttribute("src"), g = d[e].getAttribute("srcset");
                        if (f || g) {
                            if (!("string" == typeof f && f.indexOf("chrome-extension") > -1)) {
                                if ("string" == typeof f && f.indexOf("instagram") > -1 || "string" == typeof g && g.indexOf("instagram") > -1) {
                                    c = d[e];
                                    break
                                }
                                a.trackEventWithRandom("unusual_url_img", {src: f, srcset: g}, .01)
                            }
                        } else a.trackEventWithRandom("no_src_and_scrset_in_img", {imgEl: d[e].outerHTML}, .01)
                    }
                    c || (c = d[0])
                }
                return c ? c : null
            },
            getLinkFromImgElement: function (a) {
                if (!(a instanceof HTMLElement)) return null;
                var b = a.getAttribute("srcset");
                if (b) {
                    var c = {}, d = b.split(",");
                    d.forEach(function (a) {
                        var b = a.split(" ");
                        c[b[1].replace(/[^\d]/, "")] = b[0]
                    });
                    var e = 0;
                    for (var f in c) +f > +e && (e = f);
                    var g = c[e]
                }
                return "string" == typeof g && g.match(/\.(jpg|png)/) || (g = a.getAttribute("src")), "string" != typeof g ? null : g
            },
            getLinkFromVideoElement: function (a) {
                if (!(a instanceof HTMLElement)) return !1;
                var b = a.getAttribute("src");
                if ("string" == typeof b) return b;
                var c = a.querySelectorAll("source");
                if (!c.length) return !1;
                var d = ["avc1.64001E", "avc1.4D401E", "avc1.58A01E", "avc1.42E01E"], e = [];
                c.forEach(function (a) {
                    var b = a.getAttribute("type");
                    if (b) {
                        var c = b.match(/codecs="([^,]+)/);
                        if (c = c && c[1]) {
                            var f = d.indexOf(c);
                            -1 != f && (e[f] = a.src)
                        }
                    }
                });
                for (var f in e) if ("string" == typeof e[f] && e[f].length) {
                    b = e[f];
                    break
                }
                return b || (b = c[0].getAttribute("src")), "string" != typeof b ? !1 : b
            },
            isVideoPost: function (a) {
                return !!(a.querySelector("video") || a.querySelector(".videoSpritePlayButton") || a.querySelector(".coreSpriteVideoIconLarge"))
            },
            isImagePost: function (a) {
                return !!a.querySelector("img[src], img[srcset]")
            },
            getVideoPoster: function (a) {
                var b, c = a.querySelector("video");
                if (c && (b = c.getAttribute("poster")), b && b.length && b.match(/\.(jpg|png)/)) return b;
                var d = a.querySelector("img");
                return d ? d.getAttribute("src") : null
            },
            getPreviewFromImageElement: function (a) {
                if (!a) return null;
                var b, c = a.getAttribute("srcset");
                if (c) {
                    var d = {}, e = c.split(",");
                    e.forEach(function (a) {
                        var b = a.split(" ");
                        d[b[1].replace(/[^\d]/, "")] = b[0]
                    });
                    var f = null;
                    for (var g in d) null !== f ? +f > +g && (f = g) : f = g;
                    b = d[f]
                }
                return "string" == typeof b && b.match(/\.(jpg|png)/) ? b : (b = a.getAttribute("src"), "string" == typeof b && b.match(/\.(jpg|png)/) ? b : null)
            },
            addDlBtn: function (b, c) {
                "use strict";
                try {
                    var d = this;
                    if (b.querySelector("." + g.dlBtnClassName)) return;
                    var f, h, i, j, k, l, m, n, o;
                    if (1 == c) {
                        if (f = $(b).closest("article").get(0), !f) return
                    } else if (2 == c) f = b; else {
                        if (3 != c) return;
                        f = b.querySelector(".EmbeddedMedia")
                    }
                    if (n = g.getShortCode(f), !n) return void a.trackEventWithRandom("no_shortcode_in_container", {
                        pageType: c,
                        container: b.innerHTML
                    }, .001);
                    if (d.isVideoPost(b)) o = "video", h = d.findVideoElement(b), h && (l = d.getLinkFromVideoElement(h), k = a.getFileNameFromVideoLink(l), l && k || a.trackEventWithRandom("no_data_in_video_el", {
                        el: h.outerHTML,
                        pageType: c
                    }, .01)), m = d.getVideoPoster(b); else {
                        if (!d.isImagePost(b)) return;
                        if (o = "photo", i = d.findImageElement(b), !i) return void a.trackEventWithRandom("no_img_el_in_image_post", {
                            container: b.innerHTML,
                            pageType: c
                        }, .01);
                        l = d.getLinkFromImgElement(i), k = a.getFileNameFromImageLink(l), m = d.getPreviewFromImageElement(i), m || (a.trackEventWithRandom("no_new_preview_media", {
                            pageType: c,
                            imageEl: i,
                            url: l,
                            container: b.innerHTML
                        }, .01), m = l)
                    }
                    if (!m) return;
                    var p = {
                        shortcode: n,
                        type: o,
                        prev: m,
                        page_type: c,
                        isStory: !1,
                        isMultiple: e.isMultiplePost(b)
                    };
                    "string" == typeof l && -1 == l.indexOf("blob:") && l.match(/\.(png|jpg|mp4|flv)/) && (p.url = l, p.filename = k), d.addPost2Cache(p), d.sendNewPostInfoToPopup(p), j = this.getDlBtnEl(p), b.appendChild(j), a.domStats.dlBtn++, b.dataset.extSkip = "1"
                } catch (q) {
                    Math.random() < .01 && a.trackCodeError(q, "addNewDlBtn")
                }
            },
            addPost2Cache: function (a) {
                "object" == typeof a && a.shortcode && (-1 == g.cachedMediaShortCodes.indexOf(a.shortcode) && (g.cachedMedia.push(a), g.cachedMediaShortCodes.push(a.shortcode)), (g.cachedMedia.length > 1 || a.isMultiple) && d.addDlZipBtn())
            },
            sendNewPostInfoToPopup: function (a) {
                chrome.runtime.sendMessage({action: "linkFound", mediaInfo: a})
            },
            getDlBtnEl: function (a) {
                var b = this.buttonTemplate.cloneNode(!0);
                return b.dataset.shortcode = a.shortcode, a.isMultiple && (b.dataset.multiplePos = "0"), b
            },
            createDownloadButtonTpl: function () {
                var a = document.createElement("a");
                a.className = this.dlBtnClassName, a.setAttribute("type", "button"), a.innerHTML = '<span class="ext_icon"></span><span class="ext_text">' + chrome.i18n.getMessage("download").toUpperCase() + "</span>", e.isWindows() && a.classList.add("ext_windows_font"), this.buttonTemplate = a
            },
            getModalBox: function () {
                function a() {
                    w = p.querySelector("#ext_modal_checkbox"), w && w.checked && chrome.runtime.sendMessage("warning-off"), n(), p.style.display = "none", E.innerHTML = "", p.opened = 0, p.remove()
                }

                function b(b) {
                    return function () {
                        a(), b()
                    }
                }

                function d(b) {
                    return function () {
                        a(), b()
                    }
                }

                function f(b) {
                    return function () {
                        a(), b()
                    }
                }

                function g(a) {
                    return function () {
                        a(p)
                    }
                }

                function h(b) {
                    return function () {
                        a(), b()
                    }
                }

                function i(b) {
                    return function () {
                        a(), c.storiesPause.off(), "function" == typeof b && b()
                    }
                }

                function j(b) {
                    b.target == p && a()
                }

                function k() {
                    document.querySelector("#ext_review_link").click(), a()
                }

                function l() {
                    a(), chrome.runtime.sendMessage("estimateLater")
                }

                function m(a, b, c) {
                    a && b && c && a.addEventListener(b, c), F.push({el: a, event: b, listener: c})
                }

                function n() {
                    F.forEach(function (a) {
                        a.el && a.event && a.listener && a.el.removeEventListener(a.event, a.listener)
                    }), window.removeEventListener("click", j)
                }

                function o(a) {
                    q = p.querySelector(".ext_btn_continue"), r = p.querySelector(".ext_btn_cancel"), x = E.querySelector(".ext_modal_close"), s = E.querySelector(".ext_btn_estimate"), t = E.querySelector("#estimate_later"), u = E.querySelector("#estimate_no"), v = E.querySelector(".ext_btn_enough"), C = E.querySelector(".upload_to_profile_btn"), D = E.querySelector(".upload_to_stories_btn"), a && ("function" == typeof a.continueCallback && q && m(q, "click", b(a.continueCallback)), "function" == typeof a.continueDelCallback && q && m(q, "click", g(a.continueDelCallback)), "function" == typeof a.enoughCallback && v && m(v, "click", h(a.enoughCallback)), "function" == typeof a.toProfileCallback && C && m(C, "click", d(a.toProfileCallback)), "function" == typeof a.toStoriesCallback && D && m(D, "click", f(a.toStoriesCallback))), m(r, "click", i(a && a.cancelCallback)), m(x, "click", i(a && a.cancelCallback)), m(s, "click", k), m(t, "click", l), m(t, "click", l)
                }

                var p = document.querySelector(".ext_modal");
                p || (p = document.createElement("div"), p.className = "ext_modal", p.innerHTML = '<div class="ext_modal_content"></div>', document.querySelector("body").appendChild(p));
                var q, r, s, t, u, v, w, x, y, z, A, B, C, D, E = p.querySelector(".ext_modal_content"), F = [];
                return p.close = function () {
                    a()
                }, p.showDownloadAllWarning = function (a) {
                    E.innerHTML = '<div class="ext_modal_header">' + chrome.i18n.getMessage("download_more_100_warning") + '</div><div class="ext_modal_buttons_wrap"><button class="ext_btn_continue">' + chrome.i18n.getMessage("btn_continue").toUpperCase() + '</button><button class="ext_btn_cancel">' + chrome.i18n.getMessage("btn_cancel").toUpperCase() + '</button></div><div class="ext_modal_footer"><input type="checkbox" id="ext_modal_checkbox"><span>' + chrome.i18n.getMessage("do_not_show_again") + "</span></div>", o(a), window.addEventListener("click", j), p.style.display = "block", p.opened = 1
                }, p.showDeleteWarning = function (a) {
                    E.innerHTML = '<div class="ext_modal_header">' + chrome.i18n.getMessage("are_you_sure_delete") + '</div><div class="ext_modal_buttons_wrap"><button class="ext_btn_continue">' + chrome.i18n.getMessage("delete").toUpperCase() + '</button><button class="ext_btn_cancel">' + chrome.i18n.getMessage("btn_cancel").toUpperCase() + "</button></div>", o(a), window.addEventListener("click", j), p.style.display = "block", p.opened = 1
                }, p.showUploadChoice = function (a) {
                    E.innerHTML = '<span class="ext_modal_close">&times;</span><div class="ext_modal_buttons_wrap"><button class="upload_to_profile_btn">' + chrome.i18n.getMessage("upload_to_profile") + '</button><button class="upload_to_stories_btn">' + chrome.i18n.getMessage("upload_to_stories") + '</button></div><div class="upload_by_mobile_mode"><a href="">' + chrome.i18n.getMessage("upload_by_mobile_mode") + '<span class="icon"></span></a></div>', o(a), window.addEventListener("click", j), p.style.display = "block", p.opened = 1
                }, p.showDownloadProcess = function (a, b) {
                    window.removeEventListener("click", j), E.innerHTML = '<div class="ext_download_all_process"><div class="download_all_process_state">' + chrome.i18n.getMessage("download_zip") + '</div><div class="download_all_retry">' + chrome.i18n.getMessage("retry_requests") + '<span></span></div><div id="ext_progress"><div id="ext_bar"></div></div><div class="download_all_success_count"></div><div class="ext_modal_buttons_wrap"><button class="ext_btn_cancel cancel_download">' + chrome.i18n.getMessage("btn_cancel").toUpperCase() + '</button><button class="ext_btn_enough">' + chrome.i18n.getMessage("btn_enough").toUpperCase() + '</button></div><div class="footer"><div><a class="open_new_tab_insta" href="https://www.instagram.com/" target="_blank">' + chrome.i18n.getMessage("open_new_tab_for_surfing") + "</a></div></div></div>", z = E.querySelector(".download_all_success_count"), A = E.querySelector(".download_all_retry"), B = E.querySelector(".download_all_retry span"), y = p.querySelector("#ext_bar"), z.innerText = "(0/" + a + ")", o(b);
                    var c = $('[role="presentation"]');
                    e.isNativeStories() && c.length && c.append(p), p.style.display = "block", p.opened = 1
                }, p.showPrepareDownloadProcess = function (a, b) {
                    var c = a.header, d = (a.footer, a.bar_start || 0);
                    window.removeEventListener("click", j), E.innerHTML = '<div class="ext_download_all_process"><div class="download_all_process_state">' + c + '</div><div id="ext_progress"><div id="ext_bar"></div></div><div class="ext_modal_buttons_wrap"><button class="ext_btn_cancel">' + chrome.i18n.getMessage("btn_cancel").toUpperCase() + '</button></div><div class="footer"><div class="ext_dont_panic" style="display: none"><span>' + chrome.i18n.getMessage("waiting_response_for_virtual_scroll") + '</span><span class="ext_loader"></span></div><div><a class="open_new_tab_insta" href="https://www.instagram.com/" target="_blank">' + chrome.i18n.getMessage("open_new_tab_for_surfing") + "</a></div></div></div>", o(b), y = p.querySelector("#ext_bar"), y.style.width = d + "%", p.style.display = "block", p.opened = 1
                }, p.updateDownloadZipProgressBar = function (a) {
                    if (p.querySelector(".ext_download_all_process") && (z.innerText = "(" + a.successCount + "/" + a.allCount + ")", a.retryRequestsCount && (A.style.display = "block", B.innerText = " (" + a.retrySuccessCount + "/" + a.retryRequestsCount + ")"), a.lastSuccess)) {
                        var b = a.oneValuePercent;
                        y.style.width || (y.style.width = "0%");
                        var c = parseFloat(y.style.width), d = c + b;
                        (100 == d || d > 100) && (d = 100), y.style.width = d + "%"
                    }
                }, p.updatePrepareZipProgressBarAndText = function (a) {
                    var b = $(y).closest(".ext_download_all_process"), c = b.find(".ext_dont_panic");
                    if (a.dont_panic ? c.show() : c.hide(), !a.no_progress) {
                        var d = a.oneValuePercent, e = a.maxValue || 100;
                        y.style.width || (y.style.width = "0%");
                        var f = parseFloat(y.style.width), g = f + d;
                        g > e && (g = e), y.style.width = g + "%"
                    }
                }, p.showSuccessText = function (a) {
                    E.innerHTML = '<span class="ext_modal_close">&times;</span><div class="ext_modal_just_text_wrap"><span>' + a + "</span></div>", o(), window.addEventListener("click", j), p.style.display = "block", p.opened = 1
                }, p.showErrorBox = function (a) {
                    E.innerHTML = '<span class="ext_modal_close">&times;</span><div class="ext_error_modal_wrap"><div class="ext_error_modal_text">' + a + "</div></div>", o(), window.addEventListener("click", j), p.opened = 1, p.style.display = "block"
                }, p.opened = 0, E.innerHTML = "", p
            },
            getShortCode: function (a) {
                if (!(a instanceof HTMLElement)) return null;
                if ("a" == a.tagName.toLowerCase()) var b = a; else b = a.querySelector('a[href^="/p/"]');
                var c = b.href.match(/\/p\/([^\/]+)/);
                return c = c && c[1], c ? c : null
            },
            getUserSelfInfo: function (a) {
                var b = this;
                a = a || 0, a++;
                var d = 3;
                chrome.runtime.sendMessage("getUserSelfInfo", function (e) {
                    e && c.requestOneUserStories(e, function (c) {
                        "object" == typeof c && c.user && c.user.username ? b.authorizedUserName = c.user.username : d > a && setTimeout(function () {
                            b.getUserSelfInfo(a)
                        }, 500)
                    })
                })
            },
            checkLinks: function () {
                var b = document.querySelectorAll('div a[href^="/p/"]').length;
                0 != b && a.trackEventWithRandom("links_no_found_in_popup", {
                    url: window.location.href,
                    ua: window.navigator.userAgent,
                    aLinksCount: b,
                    mediaContainersInternal: document.querySelectorAll('section > main article > div > div > div a[href^="/p/"]').length,
                    mediaContainersMain: document.querySelectorAll("div > div > article > header + div > div > div").length
                }, .1)
            },
            switchMultipleMediaPostListener: function (b) {
                function c(b, c) {
                    var d = b.match(/\/([^\/\.]+)[^\/]+$/);
                    d = d && d[1] && d[1].replace(/[^\d]/g, "");
                    var e = c.match(/\/([^\/\.]+)[^\/]+$/);
                    return e = e && e[1] && e[1].replace(/[^\d]/g, ""), d && e ? d == e : (a.trackEvent("unusual_url_patterns", [b, c]), !1)
                }

                function d() {
                    k++, setTimeout(function () {
                        var a = f.querySelector(["video[src]"]), b = f.querySelectorAll("img[src]");
                        if (a) var l = g.getVideoInfo(a, !0); else {
                            if (!b[0]) return void(j > k && d());
                            b.forEach(function (a) {
                                var b = a.getAttribute("src");
                                -1 == b.indexOf("chrome-extension://") && (l = g.getImageInfo(a, 0, !0))
                            })
                        }
                        if (l) {
                            var m = l.url;
                            if (m) {
                                if (c(i, m)) return void(j > k && d());
                                h = f.querySelector("." + e.dlBtnClassName), h && h.parentNode && h.parentNode.removeChild(h), e.onGetMediaInfo(f, l)
                            }
                        }
                    }, 200)
                }

                var e = this, f = $(b).closest("article > header + div > div").get(0);
                if (f && !f.querySelector("ul > li")) {
                    var h = f.querySelector("." + e.dlBtnClassName);
                    if (h) {
                        var i = h.dataset.url;
                        if (i) {
                            var j = 20, k = 0;
                            d()
                        }
                    }
                }
            },
            getUserName: function (b, c) {
                var d = null;
                if (c) {
                    var f = $(b).closest("article").get(0);
                    if (f) {
                        var g = f.querySelector("header > div + div a");
                        d = g && g.getAttribute("href"), d = d && d.replace(/\//g, "")
                    }
                } else if (e.isSavedMedia() && b) {
                    var h = b.getAttribute("alt");
                    h && (h = h.substr(0, 50), h = a.filename.modify(h), d = h)
                } else {
                    var i = document.querySelector("._mesn5 ._mainc ._o6mpc ._rf3jb");
                    d = i && i.innerText
                }
                return d
            }
        }
    }();
    chrome.runtime.sendMessage("amIMobile", function (a) {
        1 === a ? b.run() : 2 === a || $(document).ready(function () {
            if (location.href.indexOf("instagram.com") > -1) {
                if (!document.body) return;
                g.run()
            }
        })
    })
}();