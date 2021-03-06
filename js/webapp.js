//public.js
(function($) {

    $(document).ready(function() {

        var $window = self != top ? $(self) : $(window),
            $body = $('body'),
            $document = $(document);

        $(window).on('resize', function(event) {
            if (event.target.className && event.target.className.indexOf('col-') != -1) {
                $(event.target).find('.edit-wrap').trigger('editResize');
            } else if (event.target == window) {
                $('.edit-wrap').trigger('editResize');
            }
        });
        /**
         * =======================================
         * Init Hover Effect
         * =======================================
         */
        $(document).on('mouseover', '[data-hover-effect]', function() {
            var $this = $(this),
                hoverEffect = $this.data('hover-effect'),
                loadEffect = $this.data('load-effect');
            if (!$this.hasClass(hoverEffect)) {
                $this.removeClass('animated ' + loadEffect).addClass('animated ' + hoverEffect);
            }
            setTimeout(function() {
                $this.removeClass('animated ' + hoverEffect);
            }, 1000);
        });

        $(document).on('mouseover', '[data-prod-bg-color-hover]', function() {
            var $this = $(this),
                hoverBgColor = $this.attr('data-prod-bg-color-hover'),
                oldBgColor = $this.css('background-color');

            $this.attr('data-prod-bg-color', oldBgColor);
            $this.css('background-color', hoverBgColor);
        })

        $(window).on("scroll", function(event) {
            var _screenTop = $(window).scrollTop();
            $("[data-load-effect]").each(function(index, el) {

                var loadEffect = $(el).data('load-effect');

                if ($(el).isOnScreen()) {
                    if (!$(el).attr("anim-loaded")) {
                        $(el).addClass(loadEffect + " animated animateing").attr("anim-loaded", true);
                        setTimeout(function() {
                            $(el).removeClass('animateing')
                        }, 500)
                    }
                } else {
                    if ($(el).hasClass('animateing')) {
                        return false;
                    }
                    $(el).removeAttr("anim-loaded").removeClass('animated ' + loadEffect);
                }

            });
        })

        $.fn.isOnScreen = function() {

            var win = $(window);

            var viewport = {
                top: win.scrollTop()
            };

            viewport.bottom = viewport.top + win.height();

            var bounds = this.offset();
            bounds.bottom = bounds.top + this.outerHeight();

            return (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));

        };

        $(window).trigger("scroll");



        $(window).on("scroll", function() {

            var scrollHgt = $(this).scrollTop(),
                _top = 0;

            $(".container-outer[data-outer-fixed]").each(function() {

                var $this = $(this);

                if ($(this).attr("data-outer-fixed") == "false") {
                    return true
                }

                if ($this.hasClass('outer-fixed')) {
                    var ofst = $this.data('offsetTop');
                    if (scrollHgt > ofst) {
                        $this.css('top', _top).addClass('outer-fixed');
                        _top += $(this).outerHeight();
                    } else {
                        $this.removeClass('outer-fixed').css('top', 'auto');
                    }
                } else {
                    var ofst = $this.offset().top;
                    if (scrollHgt > ofst) {
                        $this.data('offsetTop', ofst);
                        $this.css('top', _top).addClass('outer-fixed');
                        _top += $(this).outerHeight();
                    } else {
                        $this.removeClass('outer-fixed').css('top', 'auto');
                    }
                }
            })
        });

        $(document).on('mouseout', '[data-prod-bg-color-hover]', function() {
            var $this = $(this),
                oldBgColor = $this.attr('data-prod-bg-color');
            $this.css('background-color', oldBgColor);
        })

        /**
         * =======================================
         * Form Control Validate
         * =======================================
         */
        $(document).on('blur', '.control', function() {
            controlValidate($(this));
        });
        $(document).on('keydown', '.control', function() {
            var $this = $(this),
                $controls = $this.parent(),
                $group = $this.parents('.control-group'),
                $form = $this.parents('form'),
                value = $.trim($this.val()),
                type = $this.data('type'),
                maxlength = $this.attr('maxlength'),
                requiredTip = $form.data('required-tip'),
                maxlengthTip = $form.data('maxlength-tip'),
                lastlengthTip = $form.data('lastlength-tip');

            var lastChars = maxlength - value.length;
            lastlengthTip = lastlengthTip.replace('{n}', ' <b>' + lastChars + '</b> ');
            $controls.find('p.tip').remove();
            $controls.append('<p class="tip infor-tip">' + lastlengthTip + '</p>');
        });
        $(document).on('click', '.edit-from .edit-from-submit', function() {
            var $form = $(this).parents('.edit-from'),
                allowSave = true;
            $form.find('.control').each(function() {
                if (!controlValidate($(this))) allowSave = false;
            });
            if (allowSave && typeof(isDesign) == 'undefined') {
                //if(allowSave) {
                ajaxPostData('/post/save', $form);
            }
        });

        function controlValidate(e) {
            var $this = $(e),
                $controls = $this.parent(),
                $group = $this.parents('.control-group'),
                $form = $this.parents('form'),
                value = $.trim($this.val()),
                type = $this.data('type'),
                maxlength = $this.attr('maxlength'),
                requiredTip = $form.data('required-tip'),
                maxlengthTip = $form.data('maxlength-tip'),
                lastlengthTip = $form.data('lastlength-tip');

            $form.data('save', 'success');
            $group.removeClass('error');
            $controls.find('p.tip').remove();
            var isRequired = $this.data('required');
            if (isRequired == true || isRequired == 'true') {
                if (value.length == 0) {
                    $controls.append('<p class="tip error-tip">' + requiredTip + '</p>');
                    $group.addClass('error');
                    $form.data('save', 'error');
                    return false;
                } else {
                    switch (type) {
                        case 'email':
                            var reg = /^[A-Za-zd0-9]+([-_.][A-Za-zd0-9]+)*@([A-Za-zd0-9]+[-.])+[A-Za-zd]{2,7}$/;
                            var emailRegTip = $form.data('email-reg-tip');
                            if (!reg.test(value)) {
                                $controls.append('<p class="tip error-tip">' + emailRegTip + '</p>');
                                $group.addClass('error');
                                $form.data('save', 'error');
                                return false;
                            }
                            break;
                    }
                }
            }
            $this.val(value);
            return true;
        }

        /**
         * =======================================
         * Function: Detect Mobile Device
         * =======================================
         */
        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            },
        };
    });

    function ajaxPostData(url, form) {
        var $form = $(form),
            $result = $form.find('.edit-from-result');
        $.ajax({
            url: url,
            data: $form.serialize(),
            type: "POST",
            dataType: "JSON",
            beforeSend: function() {
                $form.find('.edit-from-submit').attr('disabled', 'disabled');
            },
            success: function(response) {

                if (typeof response.status !== 'undefined' && response.status == 500) {
                    $result.html(response.data);
                } else {
                    $form[0].reset();
                    //$result.html($form.data('success-tip'));
                    $form.find('.edit-from-submit').remove();
                    window.open('/', '_self')
                }
            },
            complete: function(XMLHttpRequest, status) {
                if (status == 'timeout') {
                    ajaxTimeoutTest.abort();
                }
                $form.find('.edit-from-submit').removeAttr('disabled');
            }
        });
    }

})(jQuery);

//widget.js
$(function() {
    //鎸夐渶鍔犺浇鑴氭湰
    window.loadScript = {

        dataReadyFunc: {

        },
        dataSource: {
            baiduMap: {
                url: 'http://api.map.baidu.com/api?v=2.0&ak=bP4VgRCy9i5sVAEFAWgkZ3KeKwYfXgqo&callback=mapCallback',
                ready: false
            },
            superSlide: {
                url: static0HttpUrl + 'jquery/plugs/jssor.slider.min.js',
                ready: false
            },
            tab: {
                url: static0HttpUrl + 'jquery/plugs/jztab.js',
                ready: false
            },
            share: {
                url: 'http://w.sharethis.com/button/buttons.js?publisher=2a38c4e2-0afb-4a2b-a54b-d58377f26c00',
                ready: false
            },
            iscroll: {
                url: static0HttpUrl + 'jquery/plugs/iscroll.js',
                ready: false
            },
            googleMap: {
                url: 'http://maps.googleapis.com/maps/api/js?libraries=places&callback=googleMapCallback&key=',
                ready: false
            }

        },
        isReady: function(modelName) {
            var isReady = true;
            if (this.dataSource[modelName].ready !== true) {
                isReady = false;
            }
            return isReady;
        },
        dataReady: function(key, func) {
            if (typeof func !== 'function') {
                return false;
            }
            this.dataReadyFunc[key] = func;
        },
        load: function(modelName, callback, params) {
            var self = this,
                obj = this.dataSource[modelName];

            if (true === this.isReady(modelName)) {

                this.dataReadyFunc[modelName]();

            } else if (this.dataSource[modelName].ready == "loading") {
                return false
            } else {

                this.dataSource[modelName].ready = "loading";
                this.dataReadyFunc[modelName] = callback;
                if (params) {
                    obj.url += params;
                }
                if (modelName == 'googleMap') {
                    var script = document.createElement('script');
                    script.setAttribute('type', 'text/javascript');
                    script.setAttribute('src', obj.url);
                    document.getElementsByTagName('head')[0].appendChild(script);
                    script.onload = self.dataReadyFunc[modelName](obj);
                } else {
                    $.getScript(obj.url, function() {
                        self.dataReadyFunc[modelName](obj);
                    })
                }
            }
        }
    }

    //缁勪欢JS浜嬩欢瀹夎鍣�
    function eventActionList() {
        this.methods = {}
    }
    eventActionList.prototype.checkStatus = function() {
        var _self = this,
            marks = this.marks;
        $("." + marks).each(function() {
            var status = $(this).attr("data-eastatus");
            if (status == "false") {
                var _function = $(this).attr("data-eaaction"),
                    checkMethod = typeof _self.methods[_function];

                if (checkMethod == "undefined") {
                    console.warn("The component does not have " + _function + " method!")
                    $(this).attr("data-eastatus", "error");
                } else {
                    $(this).attr("data-eastatus", true);
                    _self.methods[_function]($(this));
                }
            }
        })
    }

    eventActionList.prototype.addMethods = function(key, value) {
        this.methods[key] = value;
    }

    eventActionList.prototype.init = function(marks) {
        this.marks = marks
        this.checkStatus()
    }

    eventActionList.prototype.update = function() {
        this.checkStatus()
    }



    var ea = new eventActionList();

    //鍏ㄥ睆杞挱
    ea.addMethods("containerFullScreen", function($el) {

        /**
         * =======================================
         * Init Full screen
         * =======================================
         */
        var containerFullScreen = function() {

            $el.each(function() {

                var $this = $(this),
                    needFull = $this.attr("data-height");

                if (needFull != "full-screen") {

                    var _wHeight = parseInt(needFull);

                    if (isNaN(_wHeight) && console.error) {
                        console.error("Banner height error!")
                    } else if (!isNaN(_wHeight)) {
                        $this.height(_wHeight).find('.slides-li').height(_wHeight).closest('.full-screen-row').height(_wHeight);
                    }

                    return true
                }

                var _rowHeight = $this.parents('.full-screen-row').height(),
                    _wHeight = $(window).height(),
                    _wWidth = $(window).width(),
                    _maxHeight = (_wWidth + _wHeight) * 0.42,
                    _headerHeight = 0;
                $('.outer-header').each(function() {
                    if ($(this).css('position') != 'absolute')
                        _headerHeight += $(this).height();
                });
                _wHeight = _wHeight > _maxHeight ? _maxHeight : _wHeight;
                if (_headerHeight / _wHeight < 0.3) {
                    _wHeight = _wHeight - _headerHeight;
                }
                _wHeight = _wHeight < _rowHeight ? _rowHeight : _wHeight;
                $this.height(_wHeight).find('.slides-li').height(_wHeight).closest('.full-screen-row').height(_wHeight);
            });
        }
        containerFullScreen();

        /**
         * =======================================
         * Init Full screen responsiveSlides
         * =======================================
         */
        if (typeof($.fn.responsiveSlides) != 'undefined') {
            var $e = $el,
                enable = $e.data('enable'),
                intervalTime = $e.data('interval-time') ? $e.data('interval-time') : 7;
            if (enable == 1 || enable == undefined) {
                $el.find('.screen-slides').responsiveSlides({
                    speed: $(this).data('speed') ? $(this).data('speed') : 800,
                    timeout: intervalTime * 1000,
                    pauseControls: true,
                    nav: true,
                });
            }
        }

        /* =======================================
         * Resize window
         * =======================================
         */
        $(window).on('resize', function(event) {
            containerFullScreen();
        });

    })

    // 鍥剧墖缁勪欢 -- 鏂囧瓧鎻忚堪
    ea.addMethods('imgWrap', function($el) {
        var initImagDesc = function($el) {
            var $img = $el.find('.edit-img'),
                $link = $el.find('.edit-img-link'),
                $desc = $el.find('.edit-img-desc');
            if ($desc.length > 0) {
                $desc.css({
                    width: $img.width() + 'px',
                    left: $link.position().left + 'px',
                    // margin: '0 auto'
                });
            }
        };

        initImagDesc($el);

        $el.unbind('mouseover').bind('mouseover', '.edit-img-wrap', function() {
            initImagDesc($(this));
        });

        $el.closest('.edit-wrap').on('editResize', function() {
            initImagDesc($el);
        });

    });

    //浜у搧鍒嗙被 -- 鏍囬
    ea.addMethods("categoryHd", function($el) {
        var _self = this;
        $el.click(function() {
            var _sreen = $(window).innerWidth();

            if (_sreen > 768) {
                return false;
            }
            $(this).next(".site-widget-bd").slideToggle(400)
        })

        if (typeof(_self.categoryClickResize) != "undefined") {
            $(window).resize(function() {
                var _sreen = $(window).innerWidth();

                if (_sreen > 768) {
                    $(".wrap-categroy.productGroup-style-1 .site-widget-bd").show();
                }

                _self.categoryClickResize = true

            });
        }
    })

    //浜у搧鍒嗙被 -- 鏍峰紡1
    ea.addMethods("categoryClick", function($el) {

        $el.find(".slide-btn").click(function() {
            var _link = $(this).parent(".link-wrap"),
                _ele = _link.parent(".has-child");

            if (_ele.hasClass('cate-open')) {
                _link.siblings('.cate-slide').slideUp("fast", function() {
                    _ele.removeClass('cate-open')
                })
            } else {
                _link.siblings('.cate-slide').slideDown("fast", function() {
                    _ele.addClass('cate-open')
                })
            }
        })

    })

    //浜у搧鍒嗙被 -- 鏍峰紡2
    ea.addMethods("categoryHover", function($el) {
        if (typeof($.fn.hoverCategroy == "undefined")) {
            $.fn.hoverCategroy = function() {

                function showEl(el) {
                    var screen = $(window).innerWidth();

                    if (screen > 768) {
                        var elW = el.width(),
                            elPw = el.parent(".has-child").width(),
                            elRl = el.parent(".has-child").offset().left,
                            leftSpace = screen - elRl - elPw - elW;

                        var css = {
                            left: "100%",
                            right: "auto",
                            display: "block"
                        }
                        if (leftSpace < 0) {
                            css = {
                                right: "100%",
                                left: "auto",
                                display: "block"
                            }
                        }
                        return el.css(css)
                    } else {
                        return el.slideDown('fast');
                    }

                }

                function hideEl(el) {
                    var screen = $(window).innerWidth();

                    if (screen <= 768) {
                        return el.slideUp('fast');
                    }
                    var cssText = {
                        left: "100%",
                        right: "auto",
                        display: "none"
                    }
                    el.css(cssText);
                }

                this.find(".has-child").each(function(index, el) {

                    var slide = $(this).find(".cate-slide").eq(0);

                    $(this).hover(function() {
                        var screen = $(window).innerWidth();
                        if (screen > 768) {
                            showEl(slide)
                        }
                    }, function() {
                        var screen = $(window).innerWidth();
                        if (screen > 768) {
                            hideEl(slide)
                        }
                    });

                    var link = $(this).find(".link-wrap").eq(0);

                    link.click(function(e) {
                        if (e.target.tagName.toLowerCase() != "a") {

                            var status = link.parent(".has-child").hasClass('cate-open');

                            link.parent(".has-child").toggleClass('cate-open');

                            if (status) {
                                hideEl(slide)
                            } else {
                                showEl(slide)
                            }
                        }
                    })

                });
            }
        }
        $el.hoverCategroy();

    })

    //浜у搧璇︽儏 -- 鏀惧ぇ闀�
    ea.addMethods("zoomImg", function($el) {
        if (typeof($.fn.imagezoom) == 'function') {
            $el.find(".zoom-img img").imagezoom();
        }
    })

    //浜у搧璇︽儏 -- 鏀惧ぇ闀滃鑸�
    ea.addMethods("zoomImgNav", function($el) {
        var navScroll = {
            init: function() {
                var ele = $el.find(".scroll-wrap"),
                    item = ele.find(".item").eq(0),
                    itemLength = item.outerWidth(),
                    itemPadding = item.css("marginRight"),
                    length = parseFloat(itemLength) + parseFloat(itemPadding),
                    self = this,
                    itemAmount = ele.find(".item").length,
                    listLength = itemAmount * length;

                ele.width(listLength);

                ele.parent().siblings(".next").click(function() {
                    ele.stop(true, true);
                    self.scroll(ele, 1, length)
                });
                ele.parent().siblings(".prev").click(function() {
                    ele.stop(true, true);
                    self.scroll(ele, -1, length)
                });
                ele.find(".item").click(function() {
                    var imgSrc = $(this).find("img").attr("src"),
                        imgRel = $(this).find("img").attr("rel");

                    $(this).addClass("on").siblings(".on").removeClass("on");

                    var bigBox = $el.closest('.edit-wrap').find(".zoom-img");
                    bigBox.find("img").attr({
                        src: imgSrc,
                        rel: imgRel
                    });
                })
            },
            scroll: function(ele, dir, length) {

                var _position = ele.css("left"),
                    _position = _position == "auto" ? 0 : parseFloat(_position),
                    _width = parseFloat(ele.width());

                if (dir === 1) {

                    var _left = Math.abs(_position),
                        _wrapWidth = ele.parent().width();

                    if (_width - _left - length < _wrapWidth) {
                        return false;
                    }

                    ele.animate({
                        left: _position - length
                    }, 200)

                } else {

                    if (_position + length > 0) {
                        return false;
                    }

                    ele.animate({
                        left: _position + length
                    }, 200)
                }
            }
        }
        navScroll.init();
    })

    //浜у搧璇︽儏 -- 浜у搧鏁伴噺璁＄畻
    ea.addMethods("quantityCalc", function($el) {
        var ele = $el.find(".ipt-calc-group"),
            _max = ele.data("ipt-max"),
            _min = ele.data("ipt-min"),
            _init = ele.data("ipt-init");

        ele.find("input[type=text]").val(_init);

        ele.on("click", ".calc-add", function(e) {
            var _now = ele.find("input[type=text]").val();

            _now = parseInt(_now) + 1;

            ele.find("input[type=text]").val(_now);

            ele.find("input[type=text]").trigger('change');
            e.stopPropagation()

        })

        ele.on("click", ".calc-reduce", function(e) {
            var _now = ele.find("input[type=text]").val();

            _now = parseInt(_now) - 1;

            ele.find("input[type=text]").val(_now);

            ele.find("input[type=text]").trigger('change');
            e.stopPropagation()

        })

        ele.find("input[type=text]").change(function() {

            var _inputEle = ele.find("input[type=text]"),
                _val = parseInt(_inputEle.val());

            if (isNaN(_val)) {

                _inputEle.val(_min);

                return false;

            }

            var _now = parseInt(_val);

            if (_now > _max) {
                _inputEle.val(_max);
            } else if (_now < _min) {
                _inputEle.val(_min);
            }
        })
    })

    //浜у搧璇︽儏 -- 閫夋嫨灞炴€�
    ea.addMethods("descriptionBtn", function($el) {
        $el.find(".description-btn-wrap .item").click(function() {
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
        });
    })

    //浜у搧璇︽儏 -- Tab
    ea.addMethods("tabToggle", function($el) {
        $el.find(".j-tab-nav li").click(function() {
            $(this).addClass("on").siblings(".on").removeClass("on");

            var showId = $(this).data("tabid");

            $('#' + showId).show().siblings("div").hide();
        });
    })

    //浜у搧璇︽儏 -- Owl 杞挱
    ea.addMethods("owlSlider", function($el) {
        if (typeof($.fn.owlCarousel) != 'undefined') {
            $el.find(".pro-img-scroll").owlCarousel({
                items: 1,
                smartSpeed: 800
            });
        }
    })

    //楂樼骇瀵艰埅浜や簰
    ea.addMethods("navMenuToggle", function($el) {
        var _self = this;
        $el.find(".ico-wap-down").unbind('click').click(function(e) {
            var _item = $(this).parent(".has-child"),
                _list = _item.find('.is-child');

            if (_item.hasClass('hover')) {
                _list.slideUp(300, function() {
                    $(this).removeAttr('style')
                })
                _item.removeClass('hover')
            } else {
                _list.slideDown(300)
                _item.addClass('hover')
            }
            e.stopPropagation();
            return false;
        });
        $el.find(".menu-toggle-btn").unbind('click').click(function() {
            var _nav = $(this).parents(".wrap-nav");
            _nav.toggleClass('open');
            //if($(this).parents(".outer-header").length!=0){
            if (_nav.hasClass('open')) {
                $(this).next(".ul-lev-1").slideDown(300)
            } else {
                $(this).next(".ul-lev-1").slideUp(300, function() {
                    $(this).removeAttr('style')
                })
            }
            //}
        });
        $el.find('.has-child').unbind('hover').hover(function() {
            var $hasChild = $(this),
                isActive = $hasChild.attr('data-is-active'),
                $wapTtoggle = $hasChild.closest('.site-widget-bd').find('.menu-toggle-btn');
            $hasChild.attr('data-is-active', 'active');
            if (isActive != 'active') {
                if ($wapTtoggle.css('display') == 'display') {
                    // if is moblie, hover show all child
                    $hasChild.find('.is-child').slideDown();
                } else {
                    // if not moblie, hover show recent child
                    $hasChild.find('>.is-child').show();
                }
            }
        }, function() {
            var $hasChild = $(this);

            if ($hasChild.hasClass('li-lev-1')) {
                // if lev 1, delay 100ms hidden child
                setTimeout(function() {
                    $hasChild.find('.is-child').hide();
                    $hasChild.attr('data-is-active', 'false');
                }, 100);
            } else {
                $hasChild.find('.is-child').hide();
                $hasChild.attr('data-is-active', 'false');
            }

        });

        if (typeof(_self.navMenuToggleResize) != "undefined") {
            $(window).resize(function() {
                $(".ul-lev-1 .is-child").removeAttr('style');
                _self.navMenuToggleResize = true
            })
        }


        //hover mask
        var widgetEl = $el.closest(".edit-wrap");
        if (widgetEl.hasClass("slide-style-f3")) {
            var temp = '<div class="nav-hover-mask" style="display: none;"></div>',
                slideHeight = $el.find(".ul-lev-2.is-child").outerHeight(),
                slideLeft = widgetEl.offset().left,
                screenWidth = $(document).innerWidth();
            if (widgetEl.children(".nav-hover-mask").length == 0) {
                widgetEl.append(temp);
            }

            var tempNode = widgetEl.find(".nav-hover-mask");


            tempNode.css({
                height: slideHeight + "px",
                bottom: -slideHeight + "px",
                left: -slideLeft + "px",
                width: screenWidth + "px",
                zIndex: 10
            })

            $el.find(".li-lev-1.has-child").hover(function() {
                tempNode.show()
            }, function() {
                tempNode.hide()
            })
        }

    })

    // 璇█鏍忕偣鍑�
    ea.addMethods("langSelect", function($el) {
        $el.find('.lang-current').click(function() {
            $el.find('.lang-ul').toggleClass('active');
        });
        $el.click(function(e) {
            e.stopPropagation();
        });
        $(document).on("click", function() {
            $el.find('.lang-ul').removeClass('active');
        })
    })
    // 鍒嗕韩缁勪欢渚ц竟缂撳瓨婊氬姩
    ea.addMethods("shareFix", function($el) {
        // $(window).scroll(function(){
        //     var before = $(window).scrollTop();
        //     $(window).scroll(function() {
        //         if($el.hasClass("left-align")||$el.hasClass("right-align")){
        //             var wHeight = parseInt($(window).height());
        //             var shareHeight = parseInt($(".edit-share-list").height());
        //             var shareBottom = wHeight - shareHeight;
        //             var shareTop = parseInt(shareBottom/2);
        //             var after = $(window).scrollTop();

        //                 if (before<after) {//鍚戜笅婊氬姩
        //                     $('.edit-share-list').stop(true, true).css({
        //                         top: 0,
        //                         opacity: 0
        //                     }).animate({ 'top': shareTop, opacity: 1 }, 400);
        //                     before = after;
        //                 }
        //                 if (before>after) {//鍚戜笂婊氬姩
        //                     $('.edit-share-list').stop(true, true).css({
        //                         top: shareBottom + 'px',
        //                         opacity: 0
        //                     }).animate({ 'top': shareTop, opacity: 1 }, 400);
        //                     before = after;
        //                 }
        //             }
        //         });
        // })

        if (!window.setIntervalForFixShare) {
            window.setIntervalForFixShare = setInterval(function() {
                window._savePosition = $(window).scrollTop()
            }, 300)
        }
        if ($el.hasClass("left-align") || $el.hasClass("right-align")) {

            $(window).off('scroll.fixShare');
            $(window).on('scroll.fixShare', function() {
                var _shareR = $('.edit-share-list.right-align'),
                    _shareL = $('.edit-share-list.left-align'),
                    _wHeight = parseInt($(window).height()),
                    _shareHeight = parseInt($(".edit-share-list").height()),
                    _shareBottom = _wHeight - _shareHeight,
                    _shareTop = parseInt(_shareBottom / 2),
                    _nowPosition = $(window).scrollTop(),
                    _distance = _nowPosition - _savePosition;

                if (_shareR.length != 0) {
                    animateShare(_shareR)
                }

                if (_shareL.length != 0) {
                    animateShare(_shareL)
                }

                function animateShare(el) {
                    el.stop(true, true).css({
                        marginTop: _distance / 2,
                        opacity: 0
                    }).animate({ 'marginTop': -_shareHeight / 2 + 100, opacity: 1 }, 400);
                }

            });
        }
    })

    //鍦板浘鍒濆鍖�
    ea.addMethods("mapInit", function($el) {

        var _editwrap = $el.parents(".edit-wrap");

        $el.each(function() {
            var _editwrapId = $el.parents(".edit-wrap").attr("id"),
                _editwrapId = _editwrapId + "-map";

            $(this).attr("id", _editwrapId)

        })

        var mapInit = function() {
            var elId = $el.attr("id"),
                mark = $el.attr("data-mark"),
                mapx = $el.attr("data-mapx"),
                mapy = $el.attr("data-mapy"),
                type = $el.attr("data-type");
            type = type ? parseInt(type) : 1;
            if (type == 1) {
                var _mapType = BMAP_NORMAL_MAP;
            } else if (type == 2) {
                var _mapType = BMAP_SATELLITE_MAP;
            } else if (type == 3) {
                var _mapType = BMAP_HYBRID_MAP;
            }
            var map = new BMap.Map(elId, {
                mapType: _mapType
            });
            var new_point = new BMap.Point(mapx, mapy);
            var myIcon = new BMap.Icon("http://s0.meetsite.com/style/myt/images/common/pic-icon/markers_ico.png", new BMap.Size(23, 25));
            var marker = new BMap.Marker(new_point, {
                icon: myIcon
            }); // 鍒涘缓鏍囨敞
            map.addOverlay(marker); // 灏嗘爣娉ㄦ坊鍔犲埌鍦板浘涓�
            if (mark) {
                var label = new BMap.Label(mark, {
                    offset: new BMap.Size(20, -10)
                });
                marker.setLabel(label);
            }
            map.centerAndZoom(new_point, 15);
            map.enableScrollWheelZoom(); //鍚敤婊氳疆鏀惧ぇ缂╁皬
            //map.addControl(new BMap.MapTypeControl());          //娣诲姞鍦板浘绫诲瀷鎺т欢 鍙湁閮ㄥ湴鍖烘墠鏈変笁缁村湴鍥�


            var navigationControl = new BMap.NavigationControl({
                // 闈犲乏涓婅浣嶇疆
                anchor: BMAP_ANCHOR_TOP_LEFT,
                // LARGE绫诲瀷
                type: BMAP_NAVIGATION_CONTROL_LARGE,
                // 鍚敤鏄剧ず瀹氫綅
                enableGeolocation: true
            });
            map.addControl(navigationControl);
        }

        //鍒ゆ柇鏄惁鍔犺浇
        if (loadScript.isReady("baiduMap")) {
            mapInit($el)
        } else {
            $el.attr("data-eastatus", "false");
            //寮€濮嬪姞杞�
            loadScript.load("baiduMap", function(obj) {
                //绛夊緟鍦板浘鍔犺浇锛屾敞鍐宑allback
                window.mapCallback = function() {
                    obj.ready = true
                    ea.update();
                }
            })
        }
    })

    //璇㈢洏椤佃〃鍗曞垹闄ゆ寜閽�
    ea.addMethods("prodTabDel", function($el) {

        $el.click(function(e) {
            e.preventDefault();
            var trNum = $(this).parents("tbody").find("tr").length;

            if (trNum > 1) {
                $(this).closest("tr").remove();
            } else if (trNum = 1) {
                $(this).closest("table").remove();
            }

        })
    })

    var _inqueryForm =
        '<form id="productInquireForm" action="/inquire.html" method="post">' +
        '<input name="_csrf" type="hidden">' +
        '<input name="inquireType" type="hidden">' +
        '<input name="inquireAct" type="hidden">' +
        '<input name="productID" type="hidden">' +
        '<input name="productName" type="hidden">' +
        '<input name="productPic" type="hidden">' +
        '<input name="productLink" type="hidden">' +
        '<input name="productQuantity" type="hidden">' +
        '<input name="productParams" type="hidden">' +
        '</form>';

    //浜у搧鍒楄〃椤电殑璇㈢洏鎸夐挳鐐瑰嚮浜嬩欢
    ea.addMethods("inquireBtn", function($el) {
        if (typeof(isDesign) === "undefined") {
            if ($("#productInquireForm").length == 0) {
                $el.parents(".bd-product-inquery").append(_inqueryForm);
            }
            $el.click(function() {
                var productID = $el.attr("data-pid");
                var productName = $el.attr("data-product-name");
                var productPic = $el.attr("data-product-pic");
                var productLink = $el.attr("data-product-link");
                var quantity = $el.parents(".bd-product-inquery").find('.product_quantity').val();
                var inquiry_type = $el.attr("data-inquire-type")?$el.attr("data-inquire-type"):1;
                var productParams = new Array();
                $el.parents(".bd-product-inquery").find('.inquiry-spec-li li.active').each(function(i) {
                    if($(this).length>0){
                        var _arr = {};
                        _arr.act = $(this).attr('data-spec-img') ? 1 : 0;
                        _arr.group = $(this).attr('data-spec-group');
                        _arr.val = $(this).attr('data-spec-value');
                        _arr.valimg = $(this).attr('data-spec-img');
                        productParams.push(_arr);
                    }
                })
                productParams = productParams.length>0 ? JSON.stringify(productParams) : '';
                var _csrf = $("meta[name=csrf-token]").attr('content');

                $("#productInquireForm").find('input[name="inquireAct"]').val(0);
                $("#productInquireForm").find('input[name="productID"]').val(productID);
                $("#productInquireForm").find('input[name="productName"]').val(productName);
                $("#productInquireForm").find('input[name="productPic"]').val(productPic);
                $("#productInquireForm").find('input[name="productLink"]').val(productLink);
                $("#productInquireForm").find('input[name="productQuantity"]').val(quantity);
                $("#productInquireForm").find('input[name="productParams"]').val(productParams);
                $("#productInquireForm").find('input[name="inquireType"]').val(inquiry_type);
                $("#productInquireForm").find('input[name="_csrf"]').val(_csrf);
                $("#productInquireForm").submit();
            })
        }
    })

    //浜у搧鍒楄〃椤电殑鍔犲叆璇环鍒楄〃鎸夐挳鐐瑰嚮浜嬩欢
    ea.addMethods("inquireListBtn", function($el) {
        if (typeof(isDesign) === "undefined") {
            if ($("#productInquireForm").length == 0) {
                $el.parents(".bd-product-inquery").append(_inqueryForm);
            }
            var _csrf = $("meta[name=csrf-token]").attr('content');
            $el.click(function() {
                var productID = $el.attr("data-pid");
                var productName = $el.attr("data-product-name");
                var productPic = $el.attr("data-product-pic");
                var productLink = $el.attr("data-product-link");
                var quantity = $el.parents(".bd-product-inquery").find('.product_quantity').val();

                var productParams = new Array();
                $el.parents(".bd-product-inquery").find('.inquiry-spec-li li.active').each(function(i) {
                    var _arr = {};
                    _arr.act = $(this).attr('data-spec-img') ? 1 : 0;
                    _arr.group = $(this).attr('data-spec-group');
                    _arr.val = $(this).attr('data-spec-value');
                    _arr.valimg = $(this).attr('data-spec-img');
                    productParams.push(_arr);
                })
                productParams = productParams ? JSON.stringify(productParams) : '';

                var _loadIndex = '';

                $.ajax({
                    url: '/post/inquiry-basket',
                    data: {
                        'inquireAct': 'add',
                        'productID': productID,
                        'productName': productName,
                        'productPic': productPic,
                        'productLink': productLink,
                        'productQuantity': quantity,
                        'productParams': productParams
                    },
                    type: "POST",
                    dataType: "JSON",
                    beforeSend: function() {
                        _loadIndex = mytQuery.load();
                    },
                    success: function(response) {
                        if (typeof response.status !== 'undefined' && response.status == 500) {
                            mytQuery.alert("鍙戠敓閿欒浜嗭紝鏈嶅姟鍣ㄥ唴閮ㄩ敊璇�", 'warning');
                        } else {
                            $("#prodInquireBasket").find('.basket-lists ul').empty();
                            if (response.data.num == 0) {
                                $("#prodInquireBasket").hide();
                            } else {
                                $("#prodInquireBasket").find('.selectInquireCount').text(response.data.num);
                                $("#prodInquireBasket").find('.basket-lists ul').append(response.data.strHtml);
                                $("#prodInquireBasket").show();
                                $("#prodInquireBasket").find('.basket-lists-animatewrap').show();
                            }
                        }
                    },
                    complete: function() {
                        mytQuery.close(_loadIndex);
                    }
                });
            })
        }
    })

    //inquireBasketList
    ea.addMethods("inquireBasketList", function($el) {
        if (typeof(isDesign) === "undefined") {

            // 鐐瑰嚮涓婁笅鏄剧ず
            $el.find(".basket-title").click(function() {
                if ($(this).hasClass("down")) {
                    $(this).toggleClass("up");
                }
                $(".basket-lists-animatewrap").slideToggle();
            });

            // 鐐瑰嚮鍒犻櫎
            $el.on("click", ".basket-list-delate", function() {
                var _id = $(this).attr('data-id');
                $.ajax({
                    url: '/post/inquiry-basket',
                    data: {
                        'inquireAct': 'delete',
                        'id': _id
                    },
                    type: "POST",
                    dataType: "JSON",
                    success: function(response) {
                        $("#prodInquireBasket").find('.basket-lists ul').empty();
                        if (response.data.num == 0) {
                            $("#prodInquireBasket").hide();
                        } else {
                            $("#prodInquireBasket").find('.selectInquireCount').text(response.data.num);
                            $("#prodInquireBasket").find('.basket-lists ul').append(response.data.strHtml);
                            $("#prodInquireBasket").show();
                            $("#prodInquireBasket").find('.basket-lists-animatewrap').show();
                        }
                    }
                });
            })

            // 鐐瑰嚮鎻愪氦璇环
            $el.find(".basketInquire").click(function() {
                var _csrf = $("meta[name=csrf-token]").attr('content');
                $("#prodInquireBasket").find('input[name="inquireAct"]').val(1);
                $("#prodInquireBasket").find('input[name="_csrf"]').val(_csrf);
                $("#prodInquireBasket").find('.basketForm').submit();
            });

            // 榛樿椤甸潰鎵撳紑鏃惰幏鍙栬浠峰垪琛�
            $.ajax({
                url: '/post/inquiry-basket',
                data: {
                    'inquireAct': 'view'
                },
                type: "POST",
                dataType: "JSON",
                success: function(response) {
                    $("#prodInquireBasket").find('.basket-lists ul').empty();
                    if (response.data.num == 0) {
                        $("#prodInquireBasket").hide();
                    } else {
                        $("#prodInquireBasket").find('.selectInquireCount').text(response.data.num);
                        $("#prodInquireBasket").find('.basket-lists ul').append(response.data.strHtml);
                        $("#prodInquireBasket").show();
                    }
                }
            });
        }
    })

    //杞挱缁勪欢
    ea.addMethods("superSlider", function($el) {

        if ($el.find('img').length == 0) {
            return false
        }

        var _outer = $el.find(".edit-slide-content"),
            _parent = $el.closest(".edit-wrap"),
            _parentId = _parent.attr("id"),
            _slideId = _parentId == "undefined" ? "id-" + new Date() : _parentId + "-slide",
            backForEdit = $el.prop("outerHTML");

        function getImageScale(url, callback) {
            var img = new Image();
            img.src = url;
            if (img.complete) {
                callback(img.width / img.height, img.height);
            } else {
                img.onload = function() {
                    callback(img.width / img.height, img.height);
                }
            }

        }
        //杞挱瀹瑰櫒灏哄鍒濆鍖栧嚱鏁�
        function editSize(scale, trueHeight) {
            //鑾峰緱缁勪欢灏哄
            var editWidth = _parent.innerWidth(),
                editHeight = 0;
            //鍒濆鍖栧鍣↖D
            _outer.attr("id", _slideId);
            var opt = {
                height: parseInt(editWidth / scale),
                width: editWidth
            }
            if (opt.height > trueHeight) {
                opt.height = trueHeight
            }
            //鍒濆鍖栧鍣ㄥ昂瀵�
            _outer.css(opt).find(".edit-slide-inner").css(opt);
        }

        getImageScale($el.find("img").eq(0).attr('src'), function(scale, height) {
            //杞挱瀹瑰櫒灏哄鍒濆鍖�
            editSize(scale, height);

            //鍒ゆ柇杞挱鏀寔搴撴槸鍚﹀姞杞�
            if (loadScript.isReady("superSlide")) {
                //鍔ㄧ敾搴�
                var _animateAll = [{
                        $Duration: 1200,
                        x: -0.3,
                        $During: {
                            $Left: [0.3, 0.7]
                        },
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInCubic,
                            $Opacity: $JssorEasing$.$EaseLinear
                        },
                        $Opacity: 2
                    }, {
                        $Duration: 1200,
                        x: 0.3,
                        y: 0.3,
                        $Cols: 2,
                        $Rows: 2,
                        $During: {
                            $Left: [0.3, 0.7],
                            $Top: [0.3, 0.7]
                        },
                        $SlideOut: true,
                        $ChessMode: {
                            $Column: 3,
                            $Row: 12
                        },
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInCubic,
                            $Top: $JssorEasing$.$EaseInCubic,
                            $Opacity: $JssorEasing$.$EaseLinear
                        },
                        $Opacity: 2
                    }, {
                        $Duration: 1800,
                        x: 1,
                        y: 0.2,
                        $Delay: 30,
                        $Cols: 10,
                        $Rows: 5,
                        $Clip: 15,
                        $During: {
                            $Left: [0.3, 0.7],
                            $Top: [0.3, 0.7]
                        },
                        $SlideOut: true,
                        $Reverse: true,
                        $Formation: $JssorSlideshowFormations$.$FormationStraightStairs,
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInOutSine,
                            $Top: $JssorEasing$.$EaseOutWave,
                            $Clip: $JssorEasing$.$EaseInOutQuad
                        },
                        $Assembly: 2050,
                        $Round: {
                            $Top: 1.3
                        }
                    }, {
                        $Duration: 1200,
                        $Delay: 20,
                        $Clip: 12,
                        $SlideOut: true,
                        $Easing: {
                            $Clip: $JssorEasing$.$EaseOutCubic,
                            $Opacity: $JssorEasing$.$EaseLinear
                        },
                        $Assembly: 260,
                        $Opacity: 2
                    }, {
                        $Duration: 1200,
                        x: 0.2,
                        y: -0.1,
                        $Delay: 80,
                        $Cols: 8,
                        $Rows: 4,
                        $Clip: 15,
                        $During: {
                            $Left: [0.3, 0.7],
                            $Top: [0.3, 0.7]
                        },
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInWave,
                            $Top: $JssorEasing$.$EaseInWave,
                            $Clip: $JssorEasing$.$EaseOutQuad
                        },
                        $Outside: true,
                        $Round: {
                            $Left: 1.3,
                            $Top: 2.5
                        }
                    }, {
                        $Duration: 1200,
                        x: 0.2,
                        y: -0.1,
                        $Delay: 20,
                        $Cols: 8,
                        $Rows: 4,
                        $Clip: 15,
                        $During: {
                            $Left: [0.3, 0.7],
                            $Top: [0.3, 0.7]
                        },
                        $SlideOut: true,
                        $Formation: $JssorSlideshowFormations$.$FormationZigZag,
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInWave,
                            $Top: $JssorEasing$.$EaseInWave,
                            $Clip: $JssorEasing$.$EaseOutQuad
                        },
                        $Assembly: 260,
                        $Outside: true,
                        $Round: {
                            $Left: 1.3,
                            $Top: 2.5
                        }
                    }, {
                        $Duration: 1500,
                        x: 0.3,
                        y: -0.3,
                        $Delay: 20,
                        $Cols: 8,
                        $Rows: 4,
                        $Clip: 15,
                        $During: {
                            $Left: [0.2, 0.8],
                            $Top: [0.2, 0.8]
                        },
                        $Formation: $JssorSlideshowFormations$.$FormationSwirl,
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInJump,
                            $Top: $JssorEasing$.$EaseInJump,
                            $Clip: $JssorEasing$.$EaseOutQuad
                        },
                        $Assembly: 260,
                        $Outside: true,
                        $Round: {
                            $Left: 0.8,
                            $Top: 2.5
                        }
                    }, {
                        $Duration: 1500,
                        x: 0.3,
                        y: -0.3,
                        $Delay: 20,
                        $Cols: 8,
                        $Rows: 4,
                        $Clip: 15,
                        $During: {
                            $Left: [0.1, 0.9],
                            $Top: [0.1, 0.9]
                        },
                        $SlideOut: true,
                        $Formation: $JssorSlideshowFormations$.$FormationZigZag,
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInJump,
                            $Top: $JssorEasing$.$EaseInJump,
                            $Clip: $JssorEasing$.$EaseOutQuad
                        },
                        $Assembly: 260,
                        $Round: {
                            $Left: 0.8,
                            $Top: 2.5
                        }
                    }, {
                        $Duration: 1800,
                        x: 1,
                        y: 0.2,
                        $Delay: 30,
                        $Cols: 10,
                        $Rows: 5,
                        $Clip: 15,
                        $During: {
                            $Left: [0.3, 0.7],
                            $Top: [0.3, 0.7]
                        },
                        $Reverse: true,
                        $Formation: $JssorSlideshowFormations$.$FormationStraightStairs,
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInOutSine,
                            $Top: $JssorEasing$.$EaseOutWave,
                            $Clip: $JssorEasing$.$EaseInOutQuad
                        },
                        $Assembly: 2050,
                        $Outside: true,
                        $Round: {
                            $Top: 1.3
                        }
                    }, {
                        $Duration: 1200,
                        x: 2,
                        y: 1,
                        $Cols: 2,
                        $Zoom: 11,
                        $Rotate: 1,
                        $ChessMode: {
                            $Column: 15
                        },
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInCubic,
                            $Top: $JssorEasing$.$EaseInCubic,
                            $Zoom: $JssorEasing$.$EaseInCubic,
                            $Opacity: $JssorEasing$.$EaseOutQuad,
                            $Rotate: $JssorEasing$.$EaseInCubic
                        },
                        $Assembly: 2049,
                        $Opacity: 2,
                        $Round: {
                            $Rotate: 0.7
                        }
                    }, {
                        $Duration: 1400,
                        x: 0.25,
                        $Zoom: 1.5,
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInWave,
                            $Zoom: $JssorEasing$.$EaseInSine
                        },
                        $Opacity: 2,
                        $ZIndex: -10,
                        $Brother: {
                            $Duration: 1400,
                            x: -0.25,
                            $Zoom: 1.5,
                            $Easing: {
                                $Left: $JssorEasing$.$EaseInWave,
                                $Zoom: $JssorEasing$.$EaseInSine
                            },
                            $Opacity: 2,
                            $ZIndex: -10
                        }
                    }, {
                        $Duration: 1200,
                        x: 1,
                        $Delay: 40,
                        $Cols: 6,
                        $Formation: $JssorSlideshowFormations$.$FormationStraight,
                        $Easing: {
                            $Left: $JssorEasing$.$EaseInOutQuart,
                            $Opacity: $JssorEasing$.$EaseLinear
                        },
                        $Opacity: 2,
                        $ZIndex: -10,
                        $Brother: {
                            $Duration: 1200,
                            x: 1,
                            $Delay: 40,
                            $Cols: 6,
                            $Formation: $JssorSlideshowFormations$.$FormationStraight,
                            $Easing: {
                                $Top: $JssorEasing$.$EaseInOutQuart,
                                $Opacity: $JssorEasing$.$EaseLinear
                            },
                            $Opacity: 2,
                            $ZIndex: -10,
                            $Shift: -100
                        }
                    }, {
                        $Duration: 1000,
                        y: 1,
                        $Easing: $JssorEasing$.$EaseInBounce
                    }, {
                        $Duration: 1500,
                        x: -1,
                        y: -0.5,
                        $Delay: 50,
                        $Cols: 8,
                        $Rows: 4,
                        $Formation: $JssorSlideshowFormations$.$FormationRectangleCross,
                        $Easing: {
                            $Left: $JssorEasing$.$EaseSwing,
                            $Top: $JssorEasing$.$EaseInJump
                        },
                        $Assembly: 260,
                        $Round: {
                            $Top: 1.5
                        }
                    }, {
                        $Duration: 1500,
                        y: -0.5,
                        $Delay: 60,
                        $Cols: 15,
                        $Formation: $JssorSlideshowFormations$.$FormationCircle,
                        $Easing: $JssorEasing$.$EaseInWave,
                        $Round: {
                            $Top: 1.5
                        }
                    }],
                    _animate = [],
                    _auto = true,
                    _autoTime = 3000,
                    _chanceToShow = 2;

                //鑾峰彇鐢ㄦ埛璁惧畾鍙傛暟
                var aniData = parseInt($el.attr("data-slide-animate")),
                    timeData = parseInt($el.attr("data-slide-time")),
                    chanceData = parseInt($el.attr("data-slide-arrowshow")),
                    autoData = parseInt($el.attr("data-slide-auto"));

                //璁惧畾鏄惁鑷姩杞挱
                if (autoData == 2) {
                    _auto = false
                }

                //璁惧畾杞挱鏁堟灉
                if (aniData && aniData != 1 && aniData != 2) {
                    _animate.push(_animateAll[aniData - 3])
                } else if (aniData == 1) {
                    _animate = _animateAll
                } else if (aniData == 2) {
                    _animate = []
                }

                //璁惧畾杞挱闂撮殧
                if (timeData && timeData >= 1 && timeData <= 8) {
                    _autoTime = timeData * 1000
                }

                //璁惧畾瀵艰埅鏄剧ず鏂瑰紡
                if (chanceData && chanceData == 2) {
                    _chanceToShow = 1
                }

                //杞挱鍙傛暟
                var options = {
                    $AutoPlay: _auto,
                    $Idle: _autoTime,
                    $BulletNavigatorOptions: {
                        $Class: $JssorBulletNavigator$,
                        $ChanceToShow: _chanceToShow,
                        $AutoCenter: 1,
                        $Steps: 1,
                        $Rows: 1,
                        $SpacingX: 10,
                        $SpacingY: 10,
                        $Orientation: 1
                    },
                    $ArrowNavigatorOptions: {
                        $Class: $JssorArrowNavigator$,
                        $ChanceToShow: 2,
                        $AutoCenter: 2,
                        $Steps: 1
                    },
                    $SlideshowOptions: {
                        $Class: $JssorSlideshowRunner$,
                        $Transitions: _animate,
                        $TransitionsOrder: 1,
                    }
                };

                //鍒濆鍖栬疆鎾�
                var obj = new $JssorSlider$(_slideId, options);
                $el.addClass('inited');
                //娉ㄥ唽缁勪欢瀹藉害鍙樻洿鍙嶉浜嬩欢
                _parent.on("editResize", function() {
                    var appendNode = $(backForEdit);
                    appendNode.attr("data-eastatus", false);
                    $el.parent().append(appendNode);
                    $el.remove();
                    ea.update();
                })
            } else {
                $el.attr("data-eastatus", "false");
                //寮€濮嬪姞杞�
                loadScript.load("superSlide")

                //鍔犺浇瀹屾垚鎵ц
                loadScript.dataReady("superSlide", function(obj) {
                    obj.ready = true;
                    ea.update();
                })
            }
        })
    })
    //鍒濆鍖�

    //璇︽儏椤靛垎浜粍浠�
    ea.addMethods("shareForDetail", function($el) {

        var shareType = $el.attr("data-lang");
        if (shareType == 'zh-cn' && !window._bd_share_config) {
            window._bd_share_config = {
                "common": {
                    "bdSnsKey": {},
                    "bdText": "",
                    "bdMini": "2",
                    "bdMiniList": false,
                    "bdPic": "",
                    "bdStyle": "0",
                    "bdSize": "16"
                },
                "share": {}
            };
            with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
        } else if (shareType != 'zh-cn' && !window.switchTo5x) {
            window.switchTo5x = true;
            //鍒ゆ柇鏄惁鍔犺浇
            if (loadScript.isReady("share")) {
                stLight.options({
                    publisher: "2a38c4e2-0afb-4a2b-a54b-d58377f26c00",
                    doNotHash: false,
                    doNotCopy: false,
                    hashAddressBar: false
                });
            } else {
                $el.attr("data-eastatus", "false");
                //寮€濮嬪姞杞�
                loadScript.load("share", function(obj) {
                    obj.ready = true
                    ea.update();
                })
            }
        }

    })

    //澶氬浘杞挱
    ea.addMethods("itemScroll", function($el) {

        var _loop = $el.attr('data-show-style') == 2,
            _autoPlay = $el.attr('data-is-roll') == 1,
            _showArrow = $el.attr('data-show-button') == 1,
            _showPage = $el.attr('data-show-page') == 1,
            _arrowStyle = 'nav-' + $el.attr('data-button-style'),
            _margin = $el.attr('data-img-margin'),
            _responsive = $el.attr('data-img-num-type') == 1,
            _pageStyle = 'dot-' + $el.attr('data-page-style');

        _margin = _margin == '' ? 10 : _margin;

        if (_responsive) {
            var _responsiveMethods = {
                0: {
                    items: 1
                },
                460: {
                    items: 1
                },
                768: {
                    items: 3
                },
                960: {
                    items: 4
                },
                1290: {
                    items: 5
                }
            }
        } else {
            var _optArray = $el.attr('data-img-num').split(",");
            var _responsiveMethods = {
                0: {
                    items: _optArray[4]
                },
                460: {
                    items: _optArray[3]
                },
                768: {
                    items: _optArray[2]
                },
                960: {
                    items: _optArray[1]
                },
                1290: {
                    items: _optArray[0]
                }
            }
        }

        var opt = {
            loop: _loop,
            autoplay: _autoPlay ? 5000 : false,
            dots: _showPage,
            nav: _showArrow,
            dotsClass: _pageStyle,
            navContainerClass: _arrowStyle,
            margin: parseInt(_margin),
            navText: ["<", ">"],
            mouseDrag: false,
            slideSpeed: 400,
            responsive: _responsiveMethods
        };
        if (_arrowStyle == 'nav-4') {
            opt.controlsClass = 'ctl-4'
        }
        $el.find('.edit-slide-inner').owlCarousel(opt);

    })

    //tab椤电
    ea.addMethods('tabToggleView', function($el) {
        //鍒ゆ柇鏄惁鍔犺浇
        if (loadScript.isReady("tab")) {
            $el.jzTab();
            var classArray = ['xlg-screen', 'lg-screen', 'md-screen', 'sm-screen'];

            wrapWidthReset();

            function wrapWidthReset() {
                var _length = classArray.length,
                    _width = $el.width();
                for (var i = 0; i < _length; i++) {
                    $el.removeClass(classArray[i])
                }

                if (_width >= 1100) {
                    $el.addClass('lg-screen')
                    $el.find('.pdl-item').removeAttr('style');
                } else if (_width >= 640) {
                    $el.addClass('md-screen');
                    $el.find('.pdl-item').css('width', '33.33%');
                } else if (_width >= 420) {
                    $el.addClass('sm-screen');
                    $el.find('.pdl-item').css('width', '50%');
                } else {
                    $el.addClass('xsm-screen');
                    $el.find('.pdl-item').css({
                        width: '100%',
                        margin: '0 auto 20px'
                    })
                }
            }

            $el.closest('.edit-wrap').on('editResize', function(e) {
                wrapWidthReset();
            })

            var productTabType = 0;
            if ($el.find('.tab-wrap-product.style-1').length != 0) {
                productTabType = 1;
            } else if ($el.find('.tab-wrap-product.style-2').length != 0) {
                productTabType = 2;
            } else if ($el.find('.tab-wrap-product.style-3').length != 0) {
                productTabType = 3;
            } else if ($el.find('.tab-wrap-product.style-4').length != 0) {
                productTabType = 3;
            }

            var picTabType = 0;
            if ($el.find('.tab-wrap-pictext.style-1').length != 0) {
                picTabType = 1;
            } else if ($el.find('.tab-wrap-pictext.style-2').length != 0) {
                picTabType = 2;
            } else if ($el.find('.tab-wrap-pictext.style-3').length != 0) {
                picTabType = 3;
            }

            if (productTabType) {
                switch (productTabType) {
                    case 1:
                        var _proTab = $el.find('.tab-wrap-product');
                        if (_proTab.length != 0) {
                            var _scale = _proTab.data('img-scale'),
                                _picBox = _proTab.find('.pdl-inner'),
                                _scale = _scale.split('-');

                            function setBoxHeight() {
                                var _itemWidth = _proTab.find('.pdl-item-box .pdl-cell').eq(0).innerWidth(),
                                    boxHeight = parseInt(_scale[1] * _itemWidth / _scale[0]);
                                _picBox.height(boxHeight);
                            }

                            function numHeight() {
                                var _items = _proTab.find('.pdl-item'),
                                    _item = _items.eq(0),
                                    _itemWidth = _item.innerWidth() + parseInt(_item.css('marginRight')) + parseInt(_item.css('marginLeft')),
                                    _wrapWidth = _proTab.find('.bd-product-list').innerWidth(),
                                    _num = Math.ceil(_wrapWidth / _itemWidth);
                                if (!_num) {
                                    return false
                                }
                                var i = 0,
                                    _length = _items.length,
                                    _list = [];

                                for (; i < _length; i++) {
                                    var key = parseInt(i / _num);
                                    if (!_list[key]) {
                                        _list[key] = [];
                                    }
                                    _list[key].push(_items.eq(i));
                                }

                                $.each(_list, function(index, el) {
                                    var _length = el.length,
                                        _height = 0;
                                    for (var i = 0; i < _length; i++) {
                                        if (el[i].find('.height-control').outerHeight() > _height) {
                                            _height = el[i].find('.height-control').outerHeight();
                                        }
                                    }
                                    for (var z = 0; z < _length; z++) {
                                        el[z].find('.height-control').outerHeight(_height);
                                    }
                                })
                            }

                            setBoxHeight();
                            numHeight();
                            //缁勪欢瀹藉害resize
                            $el.closest('.edit-wrap').on('editResize', function() {
                                setBoxHeight();
                                numHeight();
                            })
                        }

                        break;
                    case 2:
                        break;
                    case 3:

                        $el.find('.pdl-item').each(function(index, el) {
                            var _height = 0,
                                _img = $(el).find('.pdl-display'),
                                _dir = $(el).find('.pdl-describe-wrap');

                            _height = _img.height() > _dir.height() ? _img.height() : _dir.height();
                            $(el).css({
                                minHeight: _height
                            });
                        });


                        break;
                    default:

                }
            }

            if (picTabType) {
                switch (picTabType) {
                    case 1:
                        break;
                    case 2:
                    function setImgData(imgArray, maxCheck, rowHeight, callback) {
                        var checkNum = 0,
                            height = 100,
                            loadNum = 0,
                            allLoad = false;

                        var timer = setInterval(function() {
                            $.each(imgArray, function(index, el) {
                                if (el.complete) {
                                    var $el = $(el),
                                        _scale = $el.width() / $el.height(),
                                        _h = rowHeight,
                                        _w = parseInt(_scale * _h);
                                    $el.closest('.item').attr({
                                        "data-w": _w,
                                        "data-h": _h
                                    })
                                    loadNum++
                                }
                            })
                            if (loadNum === imgArray.length) {
                                allLoad = true
                            }
                            checkNum++;
                            if (allLoad || checkNum === maxCheck) {
                                clearInterval(timer)
                                callback();
                            }
                        }, 50)
                    }
                        setImgData($el.find('.tab-wrap-pictext.style-2').find('.item img'), 100, 200, function() {
                            $el.find('.tab-wrap-pictext').flexImages({
                                rowHeight: 250
                            });
                        });
                        break;
                    case 3:
                    function waitImgLoad(imgArray, maxCheck, callback) {
                        var checkNum = 0,
                            height = 100,
                            loadNum = 0,
                            allLoad = false;

                        var timer = setInterval(function() {
                            $.each(imgArray, function(index, el) {
                                if (el.complete) {
                                    loadNum++
                                }
                            })
                            if (loadNum === imgArray.length) {
                                allLoad = true
                            }
                            checkNum++;
                            if (allLoad || checkNum === maxCheck) {
                                clearInterval(timer)
                                callback();
                            }
                        }, 50)
                    }
                        waitImgLoad($el.find('.tab-wrap-pictext.style-3 .pic-text-wrap img'), 100, function() {
                            $el.find('.tab-wrap-pictext.style-3 .pic-text-wrap').masonry({
                                itemSelector: '.item',
                                columnWidth: 220,
                                resize: false
                            });
                            $el.closest('.edit-wrap').on('editResize', function() {
                                $el.find('.tab-wrap-pictext.style-3 .pic-text-wrap').masonry({
                                    itemSelector: '.item',
                                    columnWidth: 220,
                                    resize: false
                                });
                            })
                        })
                        break;
                }
            }

            $el.closest('.edit-wrap').on('editResize', function(e) {
                setTimeout(function() {
                    $el.find('.tab-content').height($el.find('.selected .tab-wrap').height());
                    console.log(e)
                }, 200)
            })


        } else {
            $el.attr("data-eastatus", "false");
            0
            //寮€濮嬪姞杞�
            loadScript.load("tab", function(obj) {
                obj.ready = true;
                ea.update();
            })
        }
    })

    //鍙嬫儏閾炬帴
    ea.addMethods('friendLink', function($el) {

        function setWidth() {
            var _numData = $el.attr('data-friend-link-num'),
                _num = null;

            if (!_numData || _numData == "auto") {
                return false;
            }

            _num = _numData.split('-');

            var _screenWidth = $(window).innerWidth();

            function areaSense(width) {
                var _screen = [1200, 960, 720, 640, 0],
                    stall = 0;
                $.each(_screen, function(index, item) {
                    if (width >= item) {
                        stall = item;
                        return false;
                    }
                })
                return stall
            }

            var screenType = areaSense(_screenWidth);

            switch (screenType) {
                case 1200:
                    var _itemWidth = 100 / _num[0];
                    break;
                case 960:
                    var _itemWidth = 100 / _num[1];
                    break;
                case 720:
                    var _itemWidth = 100 / _num[2];
                    break;
                case 640:
                    var _itemWidth = 100 / _num[3];
                    break;
                case 0:
                    var _itemWidth = 100 / _num[4];
                    break;
            }
            $el.find('.item').css('width', _itemWidth + '%');

        }
        setWidth();
        $el.closest('.edit-wrap').on('editResize', function() {
            setWidth();
        })
    })

    //杩斿洖椤堕儴
    ea.addMethods("goTop", function($el) {
        $el.find('.service-top').on('click', function() {
            $('html,body').animate({ 'scrollTop': 0 }, 300);
        })
    })

    //鎵嬫満绔湪绾垮鏈�
    ea.addMethods('wapScroll', function($el) {
        if($el.hasClass('fixed-left')||$el.hasClass('fixed-right')){
            var iScrollRun = false;
            function wapOnService() {
                var screenWidth = window.innerWidth,
                    thisItem = $el.find('.service-item'),
                    thisUl = $el.find('.service-ul'),
                    thisList = $el.find('.service-list');

                if(screenWidth <= 767){
                    var itemWidth = $(window).width()/thisItem.length;

                    if(itemWidth<50){
                        thisList.width('');
                        thisItem.width(50);
                        thisUl.width(thisItem.length*50);

                        if (iScrollRun == false && loadScript.isReady("iscroll")) {
                            $.fn.iscroll = function(options){
                                if(this.data('iScrollReady') == null){
                                    var that = this;
                                    var options =  $.extend({}, options);
                                    options.vScroll = false;
                                    options.hScrollbar = false;
                                    options.vScrollbar = false;
                                    for(var i=0;i<this.length;i++){
                                        arguments.callee.object  = new iScroll(this.get(i), options);
                                        this.data('iScrollReady', true);
                                    }
                                }
                                return arguments.callee.object;
                            };
                            $el.find('.service-list').iscroll();
                            iScrollRun = true;

                        }else if(iScrollRun == false && !loadScript.isReady("iscroll")){
                            $el.attr("data-eastatus", "false");
                            loadScript.load("iscroll", function(obj) {
                                obj.ready = true;
                                ea.update();
                            })
                        }
                    }else{
                        thisList.width('');
                        thisUl.width('');
                        thisItem.width(itemWidth);
                    }
                }
                else{
                    thisUl.width('');
                    thisItem.width('');
                    thisList.width(thisUl.width());
                }
            }
            wapOnService();
            $(window).on('resize',function () {
                wapOnService();
            });
        }
    })

    //瑙嗛
    ea.addMethods("videoControl", function($el) {
        var _settingHeight = $el.attr("data-height"),
            _settingWidth = $el.attr("data-width"),
            _iframe = $el.find('iframe');

        if (!_iframe) {
            return false
        }
        var _originalWidth = _iframe.attr("width"),
            _originalHeigth = _iframe.attr("height");

        function pack(a, b) {
            var obj = new Object();
            if (a) {
                obj.height = a
            }
            if (b) {
                obj.width = b
            }
            return obj
        }

        var opt1 = pack(_settingHeight, _settingWidth);
        var opt2 = pack(_originalHeigth, _originalWidth);
        var opt = $.extend({}, opt2, opt1);
        _iframe.attr(opt);
        $el.scale = opt.height / opt.width;

        $el.closest('.edit-wrap').on('editResize', function() {
            var _width = $el.width();
            if (_width > opt.width) {
                if ($el._opt) {
                    _iframe.attr(opt);
                }
                return
            } else {
                var _height = $el.scale * _width;
                $el._opt = pack(_height, _width);
                _iframe.attr($el._opt);
            }
        })
    })
    //google鍦板浘
    ea.addMethods("googleMapInit", function($el) {
        function initMap(lat, lng, markValue,types) {
            var myLatLng = { lat: lat, lng: lng };
            var map = new google.maps.Map($el[0], {
                zoom: 12,
                center: myLatLng
            });
            if(types == 'SATELLITE'){
                map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
            }else if(types == 'HYBRID'){
                map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            }else{
                map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            }
            var infowindow = new google.maps.InfoWindow();

            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map
            });
            if($.trim(markValue)){
                infowindow.setContent('<div><strong>' + $.trim(markValue) + '</strong>');
                infowindow.open(map, marker);
            }
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

        }
        //鍒ゆ柇鏄惁鍔犺浇
        var key = $el.attr("data-api"),
            title = $el.attr("data-mark"),
            lng = parseFloat($el.attr("data-mapx")),
            lat = parseFloat($el.attr("data-mapy")),
            types = $el.attr("data-type");
        if (!key) {
            return false;
        }
        if (loadScript.isReady("googleMap")) {
            initMap(lat, lng, title , types);
        } else {
            $el.attr("data-eastatus", "false");
            //寮€濮嬪姞杞�
            loadScript.load("googleMap", function(obj) {
                //绛夊緟鍦板浘鍔犺浇锛屾敞鍐宑allback
                window.googleMapCallback = function() {
                    obj.ready = true
                    ea.update();
                }
            }, key)
        }
    })
    //鎼滅储缁勪欢
    ea.addMethods("searchInput", function($el) {
        $el.find('.select_box').on('mouseover',function(){
            $(this).find('.son_ul').show();
        });

        $el.find('.select_box').on('mouseout',function(){
            $(this).find('.son_ul').hide();
        });

        $el.find('.select_box .son_ul li').on('click',function(){
            var searchType = $(this).attr('data-value');
            $.each($el.find('.search-keywords .keyw'),function (i,v) {
                if($(v).attr('data-type') == searchType){
                    $(v).show()
                }else{
                    $(v).hide();
                }
            })
            $el.find('.select_box span').html($(this).text());
            $el.find('input[name="searchType"]').val(searchType);
            $el.find('.select_box .son_ul').hide();
        });

        var _dataPosition = $el.attr('data-position');
        if(_dataPosition == 5){
            $el.find('input[name="searchValue"]').on('focus click',function(event){
                event.stopPropagation();
                $el.find('.search-keywords').show();
            });

            $(document).on('click',function(){
                $el.find('.search-keywords').hide();

            });
        }
    })
    ea.init("j-ea-control");
    //杩斿洖瀹炰緥鍒板叏灞€鐜
    window.ea = ea;
})
