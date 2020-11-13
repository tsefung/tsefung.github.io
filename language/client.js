var ui = require("../ui/basic");

var Speech = require("./speech");
var pinyin = require("./pinyin");

module.exports = function () {
    var speech = Speech.getInstance();

    var canplay = false;
    var lines = [];

    //----------------------------------------------------

    function getPinyin(s) {
        var r = "";

        var previousCharIsInvalid = false;
        var first = true;
        for (var i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            var py = pinyin.char2Pinyin[c];

            if (first) {
                first = false;
            } else if (!py && previousCharIsInvalid) {
                //
            } else {
                r += " ";
            }

            r += (py ? py : c);
            previousCharIsInvalid = !py;
        }

        if (r.length === 0) {
            return s;
        }
        return r + "\n" + s
    };

    //----------------------------------------------------

    var playBtn = ui.button(ui.icon.player.PLAY, function (e) {
        if (canplay) {
            speech.play();
        }
    }).$icon().$huge();

    var prevBtn = ui.button(ui.icon.player.PREVIOUS, function (e) {
        if (canplay) {
            speech.prev();
            speech.play();
        }
    }).$icon().$huge();
    var nextBtn = ui.button(ui.icon.player.NEXT, function (e) {
        if (canplay) {
            speech.next();
            speech.play();
        }
    }).$icon().$huge();

    var frontBtn = ui.button(ui.icon.player.FRONT, function (e) {
        if (canplay) {
            currentSeries --;
            if (currentSeries < 0) {
                currentSeries = 0;
            } else {
                speech.load({
                    // src: src,
                    lines: series[currentSeries].lines,
                    // continous: true,
                    isChinese: false,
                    onload: function (e) {
                        canplay = true;
                        lines = [];
                        for (var i = 0; i < e.length; i++) {
                            lines.push(!!isChinese ? getPinyin(e[i]) : e[i]);
                        }
        
                        titlePanel.innerText = series[currentSeries].title;
                        for (var i = 0; i < 5; i++) {
                            subtitlePanels[i].innerText = (i < lines.length ? lines[i] : "");
                            subtitlePanels[i].style.fontSize = "16px";
                            subtitlePanels[i].style.color = "#ccc";
                        }
                    },
                    onplay: onplay,
                    onpause: onpause
                });
            }
        }
    }).$icon().$huge();
    var tailBtn = ui.button(ui.icon.player.TAIL, function (e) {
        if (canplay) {
            currentSeries ++;
            if (currentSeries >= series.length) {
                currentSeries = series.length - 1;
            } else {
                speech.load({
                    // src: src,
                    lines: series[currentSeries].lines,
                    // continous: true,
                    isChinese: false,
                    onload: function (e) {
                        canplay = true;
                        lines = [];
                        for (var i = 0; i < e.length; i++) {
                            lines.push(!!isChinese ? getPinyin(e[i]) : e[i]);
                        }
        
                        titlePanel.innerText = series[currentSeries].title;
                        for (var i = 0; i < 5; i++) {
                            subtitlePanels[i].innerText = (i < lines.length ? lines[i] : "");
                            subtitlePanels[i].style.fontSize = "16px";
                            subtitlePanels[i].style.color = "#ccc";
                        }
                    },
                    onplay: onplay,
                    onpause: onpause
                });
            }
        }
    }).$icon().$huge();

    //----------------------------------------------------

    var titlePanel = ui.div().$style({
        color: "#87bdf7",
        fontSize: "36px",
        textAlign: "center"
    });

    var subtitlePanels = [];
    for (var i = 0; i < 5; i++) {
        var p = ui.div().$style({
            color: "#aaa",
            backgroundColor: "rgba(255,255,255,.7)",
            margin: "9px 5px",
            borderRadius: "5px",
            padding: "9px 5px",
            textAlign: "center"
        });

        subtitlePanels.push(p);
    }

    var progressPanel = ui.div().$style({
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "75px",
        height: "5px",
        backgroundColor: "#eee"
    });

    var progressIndex = ui.div().$parent(progressPanel).$style({
        height: "5px",
        width: "0%",
        backgroundColor: "#97e497"
    });

    var btnPanel = ui.div().$append([frontBtn, prevBtn, playBtn, nextBtn, tailBtn]).$style({
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "15px",
        textAlign: "center"
    });

    //----------------------------------------------------

    function onplay(cur) {
        playBtn.$disable();
        prevBtn.$disable();
        nextBtn.$disable();

        var start = cur - 2;
        var end = cur + 2;

        if (start < 0) {
            start = 0;

            end = 4;
            if (end >= lines.length) {
                end = lines.length - 1;
            }
        } else if (end >= lines.length) {
            end = lines.length - 1;

            start = end - 4;
            if (start < 0) {
                start = 0;
            }
        }

        for (var i = 0, j = start; i < subtitlePanels.length; i++, j++) {
            subtitlePanels[i].innerText = (j <= end ? lines[j] : "");
            subtitlePanels[i].style.fontSize = (j === cur ? "24px" : "16px");
            subtitlePanels[i].style.color = (j === cur ? "#333" : "#ccc");
        }

        progressIndex.style.width = (Math.round(100 * (cur + 1) / lines.length) + "%");
    };

    function onpause(cur) {
        playBtn.$enable();
        prevBtn.$enable();
        nextBtn.$enable();
    };

    function play(src, title, isChinese) {
        canplay = false;

        frontBtn.$hide();
        tailBtn.$hide();

        speech.load({
            src: src,
            // continous: true,
            isChinese: !!isChinese,
            onload: function (e) {
                canplay = true;
                lines = [];
                for (var i = 0; i < e.length; i++) {
                    lines.push(!!isChinese ? getPinyin(e[i]) : e[i]);
                }

                titlePanel.innerText = title;
                for (var i = 0; i < 5; i++) {
                    subtitlePanels[i].innerText = (i < lines.length ? lines[i] : "");
                    subtitlePanels[i].style.fontSize = "16px";
                    subtitlePanels[i].style.color = "#ccc";
                }
            },
            onplay: onplay,
            onpause: onpause
        });
    };

    function render(container) {
        var frag = document.createDocumentFragment();

        frag.appendChild(titlePanel);
        for (var i = 0; i < subtitlePanels.length; i++) {
            frag.appendChild(subtitlePanels[i]);
        }
        frag.appendChild(progressPanel);
        frag.appendChild(btnPanel);

        //------------------------------------------------

        var parent = (container ? container : document.body);
        parent.innerHTML = "";

        parent.appendChild(frag);
    };

    //----------------------------------------------------

    var series = [];
    var currentSeries = 0;

    function playSeries(src, isChinese) {
        canplay = false;

        frontBtn.$show();
        tailBtn.$show();

        fetch(src).then(
            function (response) {
                response.text().then(
                    function (text) {
                        series = [];

                        var node = null;
                        var a = text.split("\\n");
                        for (var i = 0; i < a.length; i++) {
                            var s = a[i].trim();
                            if (s.length === 0) {
                                continue;
                            }

                            if (s.match(/lesson\s+\d+/i)) {
                                if (node) {
                                    series.push(node);
                                }
                                node = {
                                    title: s,
                                    lines: []
                                };
                            } else {
                                if (node) {
                                    node.lines.push(s);
                                }
                            }
                        }
                        if (node) {
                            series.push(node);
                        }

                        console.log(series);

                        if (series.length === 0) {
                            return;
                        }

                        currentSeries = 0;

                        speech.load({
                            // src: src,
                            lines: series[0].lines,
                            // continous: true,
                            isChinese: !!isChinese,
                            onload: function (e) {
                                canplay = true;
                                lines = [];
                                for (var i = 0; i < e.length; i++) {
                                    lines.push(!!isChinese ? getPinyin(e[i]) : e[i]);
                                }
                
                                titlePanel.innerText = series[0].title;
                                for (var i = 0; i < 5; i++) {
                                    subtitlePanels[i].innerText = (i < lines.length ? lines[i] : "");
                                    subtitlePanels[i].style.fontSize = "16px";
                                    subtitlePanels[i].style.color = "#ccc";
                                }
                            },
                            onplay: onplay,
                            onpause: onpause
                        });
                    }
                )
            }
        );
    };

    //----------------------------------------------------

    return {
        render: render,

        play: play,
        playSeries: playSeries
    };
};