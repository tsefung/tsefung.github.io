const ui = require("../ui/basic");

var instance = null;

function string2array(s) {
    return s.split("\\n");
};

function chineseString2array(s) {
    var a = [];
    var n = s.length;
    var i = 0;

    var ss = s.replace(/\s/g, "");

    var t = "";
    var c = null;
    while (i < n) {
        c = ss.charAt(i);
        switch (c) {
            case "，":
            case "；":
            case "。":
            case "！":
            case "？":
                t += c;
                if (t.length > 1) {
                    a.push(t);
                }
                t = "";
                break;

            case "“":
                t += c;
                i++;

                // Find the corresponding "”".
                while (i < n) {
                    c = ss.charAt(i);
                    t += c;

                    if (c === "”") {
                        if (t.length > 20) {
                            var tt = "";
                            for (var j = 0; j < t.length; j++) {
                                c = t.charAt(j);
                                switch (c) {
                                    case "，":
                                    case "。":
                                    case "！":
                                    case "？":
                                        tt += c;
                                        if (tt.length > 1) {
                                            if (j === t.length - 2) {
                                                j++;
                                                tt += t.charAt(j);
                                            }
                                            a.push(tt);
                                        }
                                        tt = "";
                                        break;

                                    default:
                                        tt += c;
                                        break;
                                }
                            }
                            if (tt.length > 0) {
                                a.push(tt);
                            }
                            tt = "";
                        } else {
                            a.push(t);
                        }
                        t = ""
                        break;
                    }
                    i++;
                }
                break;

            default:
                t += c;
                break;
        }
        i++;
    }

    // Record the rest string.
    if (t.length > 0) {
        a.push(t);
    }

    return a;
};

var supported = true;
function showUnsupportedMessage() {
    ui.block(
        ui.en ?
            "Your browser does not support Speech Synthesis, try using " + (ui.iOS ? "Safari" : "Chrome (version 85 or abover)") + " instead." :
            "您的浏览器不支持语音合成，请使用 " + (ui.iOS ? "Safari " : "Chrome (版本 85 或以上)") + "浏览器访问。"
    );
};

function createNew() {
    var continous = false;
    var loop = true;
    var isChinese = false;

    var isSpeaking = false;

    var lines = [];
    var currentLine = -1;

    //----------------------------------------------------

    var utterance = {};
    try {
        utterance = new SpeechSynthesisUtterance();
    } catch (e) {
        supported = false;
        showUnsupportedMessage();
    }
    utterance.rate = 0.8;

    //----------------------------------------------------

    function load(options) {
        if (!options || (!options.src) && (!options.lines)) {
            return;
        }

        continous = !!options.continous;
        loop = !!options.loop;
        isChinese = !!options.isChinese;

        function onload() {
            currentLine = -1;

            utterance.onstart = function () {
                isSpeaking = true;

                if (typeof options.onplay === "function") {
                    options.onplay(currentLine);
                }
            };

            utterance.onend = function () {
                isSpeaking = false;

                if (typeof options.onpause === "function") {
                    options.onpause(currentLine);
                }

                if (continous) {
                    currentLine++;
                    if (currentLine >= lines.length) {
                        if (!loop) {
                            return;
                        }
                        currentLine = 0;
                    }

                    play();
                }
            };

            if (typeof options.onload === "function") {
                options.onload(lines);
            } else {
                play();
            }
        };

        lines = [];
        if (options.lines) {
            lines = options.lines;

            onload();
        } else {
            fetch(options.src).then(
                function (response) {
                    response.text().then(
                        function (text) {
                            lines = options.isChinese ? chineseString2array(text) : string2array(text);
                            if (lines.length === 0) {
                                return;
                            }

                            onload();
                        }
                    )
                }
            );
        }
    };

    function play() {
        if (!supported) {
            showUnsupportedMessage();
            return;
        }
        if (isSpeaking || lines.length === 0) {
            return;
        }

        if (currentLine < 0 || currentLine >= lines.length) {
            currentLine = 0;
        }

        if (isChinese) {
            utterance.text = lines[currentLine].replace(/[，；。：“”‘！？,;:";!?]/g, "");
        } else {
            var a = lines[currentLine].split(":");
            if (a.length === 2) {
                utterance.text = a[1];
            } else {
                utterance.text = lines[currentLine];
            }
        }
        speechSynthesis.speak(utterance);
    };

    function seek(i) {
        if (i < 0 || i >= lines.length) {
            return;
        }
        currentLine = i;
    };
    function front() {
        if (!isSpeaking) {
            currentLine = 0;
        }
    };
    function prev() {
        if (!isSpeaking) {
            currentLine--;
            if (currentLine < 0) {
                currentLine = 0;
            }
        }
    };
    function next() {
        if (!isSpeaking) {
            if (lines.length > 0) {
                currentLine++;

                if (currentLine >= lines.length) {
                    currentLine = lines.length - 1;
                }
            } else {
                currentLine = 0;
            }
        }
    };
    function tail() {
        if (!isSpeaking) {
            if (lines.length > 0) {
                currentLine = lines.length - 1;
            } else {
                currentLine = 0;
            }
        }
    };

    return {
        load: load,

        play: play,
        seek: seek,

        front: front,
        prev: prev,
        next: next,
        tail: tail
    };
};

//----------------------------------------------------------------------------

exports.createNew = createNew;

exports.getInstance = function () {
    if (!instance) {
        instance = createNew();
    }

    return instance;
};
