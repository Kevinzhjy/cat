(function() {
    var src = $("script").last().attr("src"),
        path = src.substring(0, src.lastIndexOf("/") + 1);

    if (typeof layer == "undefined") {
        document.write("<script src='" + path + "layer.js'><\/script>");
    }
    if (typeof boottooltip == "undefined") {
        document.write("<script src='" + path + "tooltip.js'><\/script>");
    }

    function Pop() {
        this.theme = null;
    };

    Pop.prototype = {
        isReady: false,
        init: function() {
            //棰勫姞杞界毊鑲�

            var _self = this,
                clock = setInterval(function() {
                    if (typeof layer != "undefined") {
                        layer.config({
                            path: path + "layer/",
                            extend: ['skin/eminfo/style.css', 'skin/emsuccess/style.css', 'skin/emwarning/style.css', 'skin/emdanger/style.css', 'skin/emconfirm/style.css', 'skin/emmsg/style.css']
                        });
                        clearInterval(clock);
                        _self.isReady = true;
                    }
                }, 200);
            return this;
        },
        ready: function(callback) {
            var _self = this,
                clock = setInterval(function() {
                    if (_self.isReady) {
                        clearInterval(clock);
                        layer.ready(function(){
                            callback();
                        })
                    }
                }, 200)
        },
        loadSkin: function(name) {
            switch (name) {
                case 'info':
                    layer.config({
                        skin: 'layer-ext-eminfo'
                    });
                    break;
                case 'success':
                    layer.config({
                        skin: 'layer-ext-emsuccess'
                    });
                    break;
                case 'warning':
                    layer.config({
                        skin: 'layer-ext-emwarning'
                    });
                    break;
                case 'danger':
                    layer.config({
                        skin: 'layer-ext-emdanger'
                    });
                    break;
                case 'confirm':
                    layer.config({
                        skin: 'layer-ext-emconfirm'
                    });
                    break;
                case 'msg':
                    layer.config({
                        skin: 'layer-ext-emmsg'
                    });
                    break;
                default:
            }
        },
        open: function(theme, options) {
            this.loadSkin(theme);
            return layer.open(options);
        },
        alert: function(content, theme, options) {
            var opt = {
                    title: false,
                    btn: "纭畾"
                },
                type = "info";

            if (typeof theme == "string") {
                var type = theme;
            } else if (typeof theme == "object") {
                opt = $.extend({}, opt, theme);
            }

            if (typeof options == "object") {
                opt = $.extend({}, opt, options);
            }
            this.loadSkin(type);
            return layer.alert(content, opt);
        },
        msg: function(content) {
            return layer.msg(content, {
                skin: "layer-ext-emmsg"
            });
        },
        confirm: function(content, yes, no , btn) {
            var opt = {
                title: false,
                btn: ["纭畾", "鍙栨秷"]
            }
            if(typeof btn == "object"){
                opt.btn = btn
            }
            this.loadSkin("confirm");
            return layer.confirm(content, opt, yes, no);
        },
        load: function(type, opt) {
            if (typeof type == "object" && arguments.length == 1) {
                var times = type.time;
            } else if (typeof opt == "object") {
                var times = opt.time;
            } else {
                var times = false;
            }
            return layer.load(type, {
                shade: [0.25, '#000'],
                time: times
            });
        },
        close: function(index) {
            layer.close(index);
        },
        tooltip: function(ele, content, options) {
            var opt = {
                    trigger: "manual",
                    placement: "right",
                    title: content
                },
                abort = false;

            this.destroy = function() {
                $(ele).boottooltip("destroy");
                abort = true;
            }

            if (abort) {
                return this;
            }else if(typeof content == "undefined"){
                return this;
            }

            if (typeof options == "object" && typeof options.type != "undefined") {
                var tmp = '<div class="tooltip ' + options.type + ' "  role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
                opt.template = tmp;
                delete options.type;
            }
            if (typeof options != "undefined" && typeof options.time != "undefined") {
                var time = options.time;
                delete options.time;
            } else {
                var time = 4000;
            }

            opt = $.extend({}, opt, options);

            $(ele).boottooltip(opt);

            if (opt.trigger == "manual") {

                $(ele).boottooltip("show");
            }

            if (!time) {
                return this;
            }
            setTimeout(function() {
                $(ele).boottooltip("destroy");
            }, time);

            return this;
        },
        isEmpty: function(v) {
            return typeof(v) == 'undefined' || v == 'undefined' || v == '' || v == null;
        },
        openLink: function(url){
            var _self = this;

            if($('.open-link').length == 0) {
                $('body').append('<a class="open-link" target="_blank"></a>');
            }

            var target = _self.isEmpty(arguments[1]) ? '_blank' : arguments[1];
            $('.open-link').attr('target', target).attr('href', url);
            $('.open-link')[0].click();
        },
        getAjaxErrors: function(response) {
            var _errors = '', responseType = typeof(response.data);

            if(responseType == 'array') {
                _errors = response.data.join("<br />");
            } else if(responseType == 'object') {
                $.each(response.data, function(k, v) {
                    _errors = _errors + v + '<br />';
                });
            } else if(responseType == 'string') {
                _errors = response.data;
            } else {
                _errors = '鏈煡閿欒锛岃鑱旂郴瀹㈡湇澶勭悊銆�'
            }

            return _errors;
        }
    }
    var obj = new Pop();

    window.mytQuery = obj.init();
})()