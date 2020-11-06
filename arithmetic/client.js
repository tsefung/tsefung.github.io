var ui = require("../ui/basic");

//----------------------------------------------------------------------------

var OPERATOR_ADD = 0;
var OPERATOR_SUB = 1;
var OPERATOR_PLUS = 2;
var OPERATOR_DIV = 3;

function generateOperatorForAdd(max, min) {
    var n = Math.floor(Math.random() * (max - min)) + min;
    return n;
};

//----------------------------------------------------------------------------

module.exports = function () {

    var correctCnt = 0;
    var errorCnt = 0;

    var minutes = 0;
    var seconds = 0;

    var operands = [0, 0, 0];
    var operators = [0, 0];
    var ans = 0;

    var maxMiniute = 3;
    var maxErrorCnt = 5;
    var maxOperand = 20;

    var numberOfOperator = 1;
    var maxOperator = 1;

    //----------------------------------------------------

    var eachPanelHeight = Math.floor((window.innerHeight - 300) / 30) * 10;

    var panelFontSize = "16";
    if (eachPanelHeight > 72) {
        panelFontSize = "48";
    } else if (eachPanelHeight > 48) {
        panelFontSize = "36";
    } else if (eachPanelHeight > 36) {
        panelFontSize = "24";
    }

    var panelStyle = {
        position: "relative",
        width: eachPanelHeight.toString() + "px",
        height: eachPanelHeight.toString() + "px",
        lineHeight: eachPanelHeight.toString() + "px",
        fontSize: panelFontSize + "px",
        textAlign: "center",
        border: "1px solid #ccc",
        borderRadius: "5px",
        color: "#777",
        margin: "auto"
    };

    var questionPanel = ui.div().$style({
        position: "absolute",
        top: "0px",
        left: "0px",
        right: "0px",
        height: eachPanelHeight.toString() + "px",
        display: "inline-flex",
        textAlign: "center"
    });

    var operandPanels = [];
    var operatorPanels = [];
    for (var i = 0; i < operands.length; i++) {
        operandPanels[i] = ui.div().$style(panelStyle).$parent(questionPanel);

        if (i < operators.length) {
            operatorPanels[i] = ui.div().$style(panelStyle).$parent(questionPanel);
        }
    }

    //----------------------------------------------------

    var timerPanel = ui.div().$style({
        position: "absolute",
        top: (eachPanelHeight + 10).toString() + "px",
        left: "0px",
        right: "0px",
        height: eachPanelHeight.toString() + "px",
        display: "inline-flex",
        textAlign: "center"
    });

    var minutePanel = ui.div().$style(panelStyle).$style({
        backgroundColor: "#ffe"
    });
    var secondPanel = ui.div().$style(panelStyle).$style({
        backgroundColor: "#ffe"
    });

    ui.div().$style({
        display: "inline-flex",
        margin: "auto"
    }).$append([minutePanel, secondPanel]).$parent(timerPanel);

    //----------------------------------------------------

    var counterPanel = ui.div().$style({
        position: "absolute",
        top: (eachPanelHeight * 2 + 20).toString() + "px",
        left: "0px",
        right: "0px",
        height: eachPanelHeight.toString() + "px",
        display: "inline-flex",
        textAlign: "center"
    });

    var correctPanel = ui.div().$style(panelStyle).$style({
        color: "#fff",
        backgroundColor: "#5fa85f"
    });
    var errorPanel = ui.div().$style(panelStyle).$style({
        color: "#fff",
        backgroundColor: "#df5555"
    });

    ui.div().$style({
        display: "inline-flex",
        margin: "auto"
    }).$append([correctPanel, errorPanel]).$parent(counterPanel);

    //----------------------------------------------------

    var inputPanel = ui.div().$style({
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        textAlign: "center"
    }).$hide();

    var numberOfInputsPerRow = Math.floor(window.innerWidth / 60);
    var row = null;
    for (var i = 0, j = 0; i <= maxOperand; i++, j ++) {
        if (j % numberOfInputsPerRow === 0) {
            row = ui.div().$style({
                display: "inline-flex"
            }).$parent(inputPanel);
        }

        ui.button(i.toString(), (function (result) {
            return function () {
                // Update result.
                if (ans === result) {
                    correctCnt++;
                    correctPanel.innerText = correctCnt.toString();
                } else {
                    errorCnt++;
                    errorPanel.innerText = errorCnt.toString();
                }

                if ((minutes < maxMiniute) && (errorCnt < maxErrorCnt)) {
                    // Show next question.
                    next();
                } else {
                    inputPanel.$hide();
                    controlPanel.$show();
                }
            };
        })(i)).$huge().$style({
            width: "56px"
        }).$parent(row);
    }

    //----------------------------------------------------

    var controlPanel = ui.div().$style({
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        textAlign: "center"
    });

    var startBtn = ui.button("Go", function () {
        correctCnt = 0;
        errorCnt = 0;

        minutes = 0;
        seconds = 0;

        controlPanel.$hide();
        inputPanel.$show();

        correctPanel.innerText = correctCnt.toString();
        errorPanel.innerText = errorCnt.toString();

        renderTimer();
    }).$huge().$parent(controlPanel);

    //----------------------------------------------------

    function rand(max, min) {
        return Math.round(Math.random() * (max - min)) + min;
    };

    // function start(options) {
    //     if (options.maxMiniute >= 0) {
    //         maxMiniute = options.maxMiniute;
    //     }
    //     if (options.maxErrorCnt >= 0) {
    //         maxErrorCnt = options.maxErrorCnt;
    //     }
    //     if (options.maxOperand >= 0) {
    //         maxOperand = options.maxOperand;
    //     }
    //     if (options.numberOfOperator >= 0) {
    //         numberOfOperator = options.numberOfOperator;
    //     }
    //     if (options.maxOperator >= 0) {
    //         maxOperator = options.maxOperator;
    //     }
    // };

    function next() {
        // Generate operators.
        for (var i = 0; i < operators.length; i++) {
            if (i < numberOfOperator) {
                operators[i] = rand(maxOperator, 0);
            } else {
                operators[i] = 0;
            }
        }


        // Generate operands.
        for (var i = 0; i < operands.length; i++) {
            if (i < numberOfOperator) {
                //
            } else {
                operands[i] = 0;
            }
        }

        // Compute the answer.
        ans = 0;
    };

    function renderTimer() {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
        }

        minutePanel.innerText = (minutes < 10 ? "0" : "") + minutes.toString() + "\'";
        secondPanel.innerText = (seconds < 10 ? "0" : "") + seconds.toString() + "\"";

        if ((minutes < maxMiniute) && (errorCnt < maxErrorCnt)) {
            setTimeout(renderTimer, 1e3);
        } else {
            controlPanel.$show();
            inputPanel.$hide();
        }
    };

    function render(container) {
        var parent = (container ? container : document.body);
        parent.innerHTML = "";

        for (var i = 0; i < operands.length; i ++) {
            if (i <= numberOfOperator) {
                operandPanels[i].$show();
            } else {
                operandPanels[i].$hide();
            }
        }
        for (var i = 0; i < operators.length; i ++) {
            if (i < numberOfOperator) {
                operatorPanels[i].$show();
            } else {
                operatorPanels[i].$hide();
            }
        }

        var frag = document.createDocumentFragment();

        frag.appendChild(questionPanel);
        frag.appendChild(counterPanel);
        frag.appendChild(timerPanel);
        frag.appendChild(inputPanel);
        frag.appendChild(controlPanel);

        parent.appendChild(frag);
    };

    //----------------------------------------------------

    return {
        render: render
    };
};