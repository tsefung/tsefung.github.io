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

exports.load = function (src, isSeries, onload) {
    if (typeof onload !== "function") {
        return;
    }
    if (!src) {
        onload([]);
        return;
    }

    var series = [];

    fetch(src).then(
        function (resp) {
            resp.text().then(
                function (text) {
                    if (isSeries) {
                        var p = null;
                        var a = text.split("\\n");
                        for (var i = 0; i < a.length; i++) {
                            var s = a[i].trim();
                            if (s.length === 0) {
                                continue;
                            }

                            if (s.match(/lesson\s+\d+/i)) {
                                if (p) {
                                    series.push(p);
                                }
                                p = {
                                    title: s,
                                    lines: []
                                };
                            } else {
                                if (p) {
                                    p.lines.push(s);
                                }
                            }
                        }
                        if (p) {
                            series.push(p);
                        }

                        onload(series);
                    } else {
                        onload(chineseString2array(text));
                    }
                }
            );
        }
    );
};