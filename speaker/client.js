var Speech = require("../media/speech");
var ui = require("../ui/basic");

module.exports = function (container) {

    var speech = Speech.getInstance();

    var canplay = false;
    var lines = [];

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

    //----------------------------------------------------

    var titlePanel = ui.div().$style({
        color: "#87bdf7",
        fontSize: "36px",
        textAlign: "center"
    });

    var subtitlePanels = [];
    for (var i = 0; i < 5; i ++) {
        var p = ui.div().$style({
            color: "#aaa",
            // border: "1px dotted #ccc",
            // borderRadius: "5px",
            margin: "15px 0",
            padding: "15px 5px",
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

    var btnPanel = ui.div().$append([prevBtn, playBtn, nextBtn]).$style({
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "15px",
        textAlign: "center"
    });

    //----------------------------------------------------

    function play(src, title) {

        canplay = false;

        speech.load({
            src: src,
            // continous: true,
            onload: function (e) {
                canplay = true;
                lines = e;
                // console.log(e);

                titlePanel.innerText = title;
                for (var i = 0; i < 5; i ++) {
                    subtitlePanels[i].innerText = (i < lines.length ? lines[i] : "");
                    subtitlePanels[i].style.fontSize = (i === 0 ? "24px" : "16px");
                    subtitlePanels[i].style.color = (i === 0 ? "#333" : "#ccc");
                }
            },
            onplay: function (cur) {
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
                        if (end < 0) {
                            // This scenaro will not occur, because lines.length is 1 at least.
                            end = 0;
                        }
                    }
                } else if (end >= lines.length) {
                    end = lines.length - 1;

                    start = end - 4;
                    if (start < 0) {
                        start = 0;
                    }
                }

                for (var i = 0, j = start; i < subtitlePanels.length; i ++, j ++) {
                    subtitlePanels[i].innerText = (j <= end ? lines[j] : "");
                    subtitlePanels[i].style.fontSize = (j === cur ? "24px" : "16px");
                    subtitlePanels[i].style.color = (j === cur ? "#333" : "#ccc");
                }

                progressIndex.style.width = (Math.round(100 * (cur + 1) / lines.length) + "%");
            },
            onpause: function (cur) {
                playBtn.$enable();
                prevBtn.$enable();
                nextBtn.$enable();
            }
        });
    };

    //----------------------------------------------------

    ui.div().$append(titlePanel).$append(subtitlePanels).$append([progressPanel, btnPanel]).$parent(container);

    //----------------------------------------------------

    return {
        play: play
    };
};