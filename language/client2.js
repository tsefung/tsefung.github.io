var ui = require("../ui/basic");

var Speech = require("./speech2");
var Loader = require("./loader");
var Pinyin = require("./pinyin");

module.exports = function () {

    var isSpeaking = false;

    var speech = new Speech(
        function () {
            isSpeaking = true;
            renderLines();
        },
        function () {
            isSpeaking = false;
        }
    );

    //----------------------------------------------------

    var isSeries = false;
    var isChinese = false;

    var title = "";

    var lines = [];
    var currentLine = -1;

    var series = [];
    var currentSeries = 0;

    function load(src, s, cn) {
        isSeries = !s;
        isChinese = !!cn;

        title = s;
        currentLine = -1;
        currentSeries = 0;

        Loader.load(
            src,
            isSeries,
            function (a) {
                if (isSeries) {
                    series = a;
                    if (series.length === 0) {
                        return;
                    }

                    lines = series[0].lines;
                    title = series[0].title;
                } else {
                    lines = a;
                    if (lines.length === 0) {
                        return;
                    }
                }

                renderLines();
            }
        );
    };

    //----------------------------------------------------

    function speak() {
        if (currentLine < 0) {
            currentLine = 0;
        }
        speech.speak(lines[currentLine], isChinese);
    };

    //----------------------------------------------------

    var playBtn = ui.button(ui.icon.player.PLAY, function () {
        if (isSpeaking) {
            return;
        }
        if (lines.length === 0) {
            return;
        }

        speak();
    }).$icon().$huge();

    var prevBtn = ui.button(ui.icon.player.PREVIOUS, function () {
        if (isSpeaking) {
            return;
        }
        if (lines.length === 0) {
            return;
        }
        currentLine --;
        if (currentLine < 0) {
            currentLine = 0;
            return;
        }

        speak();
    }).$icon().$huge();
    var nextBtn = ui.button(ui.icon.player.NEXT, function () {
        if (isSpeaking) {
            return;
        }
        if (lines.length === 0) {
            return;
        }
        currentLine ++;
        if (currentLine >= lines.length) {
            currentLine = lines.length - 1;
        }

        speak();
    }).$icon().$huge();

    var frontBtn = ui.button(ui.icon.player.FRONT, function () {
        if (isSpeaking) {
            return;
        }
        if (series.length === 0) {
            return;
        }
        currentSeries --;
        if (currentSeries < 0) {
            currentSeries = 0;
            return;
        }

        title = series[currentSeries].title;
        lines = series[currentSeries].lines;

        currentLine = -1;
        renderLines();

    }).$icon().$huge();
    var tailBtn = ui.button(ui.icon.player.TAIL, function () {
        if (isSpeaking) {
            return;
        }
        if (series.length === 0) {
            return;
        }
        currentSeries ++;
        if (currentSeries >= series.length) {
            currentSeries = series.length - 1;
            return;
        }

        title = series[currentSeries].title;
        lines = series[currentSeries].lines;

        currentLine = -1;
        renderLines();
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

    function renderLines() {
        if (lines.length === 0) {
            return;
        }

        titlePanel.innerText = title;

        for (var i = 0, j = (currentLine >= 0 ? currentLine : 0); i < subtitlePanels.length; i++, j ++) {
            var s = "";
            if (j < lines.length) {
                s = (isChinese ? Pinyin.getPinyin(lines[j]) + "\n" : "") + lines[j];
            }
            subtitlePanels[i].innerText = s;

            subtitlePanels[i].style.fontSize = (j === currentLine ? "24px" : "16px");
            subtitlePanels[i].style.color = (j === currentLine ? "#333" : "#ccc");
        }
    };

    //----------------------------------------------------

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

    return {
        render: render,

        load: load
    };
};