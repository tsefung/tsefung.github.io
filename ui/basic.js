const { win } = require("../../clients/sdk/ui");

function isObject(o) {
    return typeof o === "object";
};

function isString(s) {
    return typeof s === "string";
};

function isNumber(n) {
    return typeof n === "number";
};

function isFunction(f) {
    return typeof f === "function";
};

//----------------------------------------------------------------------------

var ua = navigator ? navigator.userAgent : "";

var isAndroid = (ua && ua.match(/android/i) ? true : false);
var isiOS = (ua && ua.match(/ipad|iphone/i) ? true : false);
var isMac = (ua && ua.match(/mac\sos/i) ? true : false);
var isWeChat = (ua && ua.match(/wechat|micromessenger|weixin/i) ? true : false);

var isSafari = (ua && ua.match(/safari/i) && (!ua.match(/chrome/i)) ? true : false);

var chromeVersion = 0;
if (ua) {
    var a = ua.match(/chrome\/(\d+)/i);
    if (a && (a.length >= 2)) {
        chromeVersion = parseInt(a[1]);
        if (chromeVersion === NaN) {
            chromeVersion = 0;
        }
    }
}

var ul = (navigator ? navigator.userLanguage || navigator.language : "");
var isEnglish = (ul && (ul.indexOf("zh") >= 0) ? false : true);

var supportMSE = (MediaSource && MediaSource.isTypeSupported("video/mp4; codecs=\"avc1.42E01E,mp4a.40.2\"") ? true : false);
var supportM3U8 = isAndroid || isiOS || (isMac && isSafari);

function isPortrait() {
    if (isAndroid || isiOS) {
        switch (window.orientation) {
            case 0:
            case 180:
                return true;

            case -90:
            case 90:
                return false;
        }

        return screen.availHeight > screen.availWidth;
    }

    return false;
};

//----------------------------------------------------------------------------

var icon = {
    input: {
        CHECKBOX_ON: "\ue918",
        CHECKBOX_OFF: "\ue919",

        RADIO_ON: "\ue91a",
        RADIO_OFF: "\ue916",

        START_ON: "\ue91b",
        START_HALF: "\ue91c",
        START_OFF: "\ue91d",

        ADD: "\ue911",
        REMOVE: "\ue914",

        UPLOAD: "\ue915",
        DOWNLOAD: "\ue910"
    },
    win: {
        CONFIRM: "\ue924",
        INFO: "\ue922",
        ERROR: "\ue900",

        MAX: "",
        RESTORE: "",
        MIN: "",

        CLOSE: "\ue913"
    },
    player: {
        PLAY: "\ue905",
        PAUSE: "\ue904",
        STOP: "\ue90b",
        
        FRONT: "\ue90a",
        PREVIOUS: "\ue902",
        NEXT: "\ue901",
        TAIL: "\ue909",

        VOLUME_UP: "\ue90f",
        VOLUME_DOWN: "\ue90c",
        VOLUME_OFF: "\ue90e",
        
        REPEAT: "\ue906",
        REPEAT_ONE: "\ue907",

        FULLSCREEN: "\ue91e",
        EXIT_FULLSCREEN: "\ue91f",

        SETTINGS: "\ue917"
    }
};

var style = {
};

var color = {
    background: {
        light: ["#ffe", "#fef", "#eff", "#eef", "#efe", "#fee"]
    }
};

//----------------------------------------------------------------------------

function create(tagName) {
    var e = document.createElement(tagName);

    //----------------------------------------------------

    e.$parent = function (o) {
        if (isObject(o) && isFunction(o.appendChild)) {
            o.appendChild(e);
        } else {
            document.body.appendChild(e);
        }
        return e;
    };
    e.$append = function (o) {
        if (isObject(o)) {
            if (o.length > 0) {
                for (var i = 0; i < o.length; i++) {
                    e.appendChild(o[i]);
                }
            } else {
                e.appendChild(o);
            }
        }
        return e;
    };
    e.$remove = function() {
        var p = e.parentNode;
        if (isObject(p) && p) {
            p.removeChild(e);
        }
        return e;
    };
    e.$empty = function () {
        e.innerHTML = "";
        return e;
    };

    //----------------------------------------------------

    e.$bind = function (events) {
        if (isObject(events)) {
            for (var event in events) {
                var handle = events[event];
                if (isFunction(handle)) {
                    e[event] = handle;
                }
            }
            if (isFunction(events.onclick)) {
                e.style.cursor = "pointer";
            }
        }
        return e;
    };

    //----------------------------------------------------

    // var lastDisplay
    e.$hide = function () {
        e.setAttribute("hidden", "hidden");
        return e;
    };
    e.$show = function () {
        e.removeAttribute("hidden");
        return e;
    };

    //----------------------------------------------------

    e.$style = function (styles) {
        if (isObject(styles)) {
            for (var key in styles) {
                if (isString(styles[key])) {
                    e.style[key] = styles[key];
                }
            }
        }
        return e;
    };
    e.$class = function (s) {
        if (isString(s)) {
            e.className = s;
        }
        return e;
    };
    e.$icon = function (s) {
        if (isString(s)) {
            e.innerText = s;
        }
        e.className = "ui";
        return e;
    };

    return e;
};

//----------------------------------------------------------------------------

function div(s) {
    var e = create("div");
    if (isString(s)) {
        e.innerText = s;
    }

    return e;
};

function span(s) {
    var e = create("span");
    if (isString(s)) {
        e.innerText = s;
    }

    return e;
};

function img(url, onload, onerror) {
    var e = create("img");
    if (isFunction(onload)) {
        e.onload = onload;
    }
    if (isFunction(onerror)) {
        e.onerror = onerror;
    }
    if (isString(s)) {
        e.src = url;
    }

    return e;
};

//----------------------------------------------------------------------------

function input() {
    var e = create("input");
    e.$enable = function () {
        e.removeAttribute("disabled");
        return e;
    };
    e.$disable = function () {
        e.setAttribute("disabled", "disabled");
        return e;
    };

    e.$huge = function () {
        e.style.fontSize = "36px";
        e.style.lineHeight = "36px";
        return e;
    };
    e.$large = function () {
        e.style.fontSize = "28px";
        e.style.lineHeight = "28px";
        return e;
    };
    e.$medium = function () {
        e.style.fontSize = "20px";
        e.style.lineHeight = "20px";
        return e;
    };
    e.$small = function () {
        e.style.fontSize = "12px";
        e.style.lineHeight = "12px";
        return e;
    };

    e.style.color = "#555";
    e.style.padding = "5px";

    return e;
};

function textInput(s) {
    var e = input();
    e.type = "text";
    if (isString(s)) {
        e.placeholder = s;
    }

    return e;
};

function passwordInput() {
    var e = input();
    e.type = "password";

    return e;
};

function fileInput() {
    var e = input();
    e.type = "file";

    return e;
};

function button(s, onclick) {
    var e = input();
    e.type = "button";
    e.value = s;
    e.style.margin = "0 1px";
    e.style.cursor = "pointer";
    e.onclick = onclick;

    return e;
};

//----------------------------------------------------------------------------

function lock(s) {
    var r = div().$style({
        position: "fixed",
        left: "0px",
        right: "0px",
        top: "0px",
        bottom: "0px",
        backgroundColor: "rgba(0,0,0,.7)"
    });

    return r;
};
function unlock() {
    //
};

function pop (s, iconText, iconColor) {
    var mask = lock();

    var w = Math.floor(window.innerWidth * (isPortrait() ? 0.9 : 0.6));
    if (w % 2 === 1) {
        w += 1;
    }

    var px = Math.floor((window.innerWidth - w) / 2);
    var py = 10;

    var dialog = div().$style({
        position: "absolute",
        left: px + "px",
        right: px + "px",
        top: py + "px",
        padding: "9px",
        fontSize: "14px",
        color: "#333",
        backgroundColor: "#eee",
        border: "1px solid #ccc",
        borderRadius: "5px",
        display: "inline-flex",
        alignItems: "center"
    }).$append(
        div().$icon(iconText).$style({
            color: iconColor,
            fontSize: "30px"
        })
    ).$append(
        div(s).$style({
            marginLeft: "9px"
        })
    ).$append(
        div().$icon(icon.win.CLOSE).$style({
            color: "#aaa",
            fontSize: "20px"
        }).$bind({
            onclick: function () {
                dialog.$remove();
                mask.$remove();
            }
        })
    );

    //----------------------------------------------------

    var frag = document.createDocumentFragment();
    frag.appendChild(mask);
    frag.appendChild(dialog);
    document.body.appendChild(frag);
};

function info (s) {
    pop(s, icon.win.INFO, "limegreen");
};
function error (s) {
    pop(s, icon.win.ERROR, "red");
};
function confirm (s) {
    // TODO:
    pop(s, icon.win.CONFIRM, "orange")
};

//----------------------------------------------------------------------------

module.exports = {
    iOS: isiOS,
    android: isAndroid,
    chrome: chromeVersion,
    mse: supportMSE,
    m3u8: supportM3U8,
    en: isEnglish,
    protrait: isPortrait,

    icon: icon,
    style: style,
    color: color,

    div: div,
    span: span,
    img: img,

    textInput: textInput,
    passwordInput: passwordInput,
    fileInput: fileInput,
    button: button,

    info: info,
    error: error,

    confirm: confirm
};