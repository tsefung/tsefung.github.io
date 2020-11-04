
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

var icon = {
    player: {
        PLAY: "\ue905",
        PAUSE: "\ue904",
        STOP: "\ue90b",
        FRONT: "\ue90a",
        PREVIOUS: "\ue902",
        NEXT: "\ue901",
        TAIL: "\ue909",
        REPEAT: "\ue906",
        REPEAT_ONE: "\ue907"
    }
};

//----------------------------------------------------------------------------

var body = document.body;
var get = document.getElementById;
var log = console.log;

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
                    e.addEventListener(event, handle);
                }
            }
            if (events["click"]) {
                e.style.cursor = "pointer";
            }
        }
        return e;
    };

    //----------------------------------------------------

    e.$hide = function () {
        e.setAttribtue("hidden", "hidden");
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
            e.text = s;
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

module.exports = {
    icon: icon,

    div: div,
    span: span,
    img: img,

    textInput: textInput,
    passwordInput: passwordInput,
    fileInput: fileInput,
    button: button
};