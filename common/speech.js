var Speech = Speech || (function () {

    //----------------------------------------------------

    var isSpeaking = false;

    var utterance = new SpeechSynthesisUtterance();
    utterance.rate = 0.6;
    utterance.onstart = function () {
        isSpeaking = true;
    };
    utterance.onend = function () {
        isSpeaking = false;

        currentLine++;
        play();
    };
    utterance.onpause = function () {
        //
    };
    utterance.onresume = function () {
        isSpeaking = true;
    };

    //----------------------------------------------------

    var lines = [];
    var currentLine = -1;

    var string2array = function (s) {
        var a = [];
        var n = s.length;
        var i = 0;

        var t = "";
        var c = null;
        while (i < n) {
            c = s.charAt(i);
            switch (c) {
                case "，":
                case "。":
                case "！":
                case "？":
                    t += c;
                    if (t.length > 1) {
                        a.push(t);
                    }
                    t = "";
                    break;

                case "\n":
                case "\r":
                case "\t":
                case " ":
                    break;

                case "“":
                    t += c;
                    i ++;

                    // Find the corresponding "”".
                    while (i < n) {
                        c = s.charAt(i);
                        t += c;

                        if (c === "”") {
                            a.push(t);
                            t = ""
                            break;
                        }
                        i ++;
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

    var load = function (url, onload, onplay, onpause) {
        fetch(url).then(
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

                        if (typeof onplay === "function") {
                            utterance.onstart = function () {
                                isSpeaking = true;

                                onplay(currentLine);
                            };
                        }

                        if (typeof onpause === "function") {
                            utterance.onend = function () {
                                isSpeaking = false;

                                onpause(currentLine);
                            };
                        }

                        if (typeof onload === "function") {
                            onload(lines);
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

        utterance.text = lines[currentLine];
        speechSynthesis.speak(utterance);
    };

    var prev = function () {
        if (!isSpeaking) {
            currentLine --;
        }
    };

    var next = function () {
        if (!isSpeaking) {
            currentLine ++;
        }
    };

    //----------------------------------------------------

    return {
        load: load,

        play: play,
        prev: prev,
        next: next
    };
})();