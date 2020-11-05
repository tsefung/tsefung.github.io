
var ui = require("../ui/basic");

var instance = null;

var string2array = function (s) {
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

var createNew = function () {

    var continous = false;
    var loop = true;

    var isSpeaking = false;

    var lines = [];
    var currentLine = -1;

    //----------------------------------------------------

    var utterance = new SpeechSynthesisUtterance();
    utterance.rate = 0.8;

    //----------------------------------------------------

    var load = function (options) {
        if (!options || !options.src) {
            return;
        }

        continous = !!options.continous;
        loop = !!options.loop;

        fetch(options.src).then(
            function (response) {
                response.text().then(
                    function (text) {
                        lines = [];
                        currentLine = -1;

                        lines = string2array(text);

                        if (lines.length === 0) {
                            return;
                        }

                        currentLine = 0;

                        //--------------------------------


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
                    }
                )
            }
        );
    };

    var play = function () {
        if (isSpeaking || lines.length === 0) {
            return;
        }

        if (currentLine < 0 || currentLine >= lines.length) {
            currentLine = 0;
        }

        utterance.text = lines[currentLine].replace(/[，；。：“”‘！？,;.:"'!?]/g, "");
        speechSynthesis.speak(utterance);
    };

    var front = function () {
        if (!isSpeaking) {
            currentLine = 0;
        }
    };
    var prev = function () {
        if (!isSpeaking) {
            currentLine--;
            if (currentLine < 0) {
                currentLine = 0;
            }
        }
    };
    var next = function () {
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
    var tail = function () {
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
