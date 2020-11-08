var ui = require("../ui/basic");

//----------------------------------------------------------------------------

var OPERATOR_ADD = 0;
var OPERATOR_SUB = 1;
var OPERATOR_MULTIP = 2;
var OPERATOR_DIV = 3;

var OPERATOR_CHARACTERS = ["+", "-", "×", "÷"];

function rand(max, min) {
    return Math.round(Math.random() * (max - min)) + min;
};

//----------------------------------------------------------------------------

module.exports = function (container) {

    var parent = (container ? container : document.body);

    //----------------------------------------------------

    var correctCnt = 0;
    var errorCnt = 0;

    var minutes = 0;
    var seconds = 0;

    var operands = [0, 0, 0];
    var operators = [0, 0];
    var ans = 0;

    var maxMiniute = 3;
    var maxErrorCnt = 5;
    var maxOperand = 10;
    var maxResult = 10;

    var numberOfOperator = 1;
    var maxOperator = 1;

    var running = false;

    //----------------------------------------------------

    var nw = Math.floor(window.innerWidth / 50) * 10;
    var nh = Math.floor(window.innerHeight / (ui.protrait() ? 80 : 70)) * 10;
    var size = (nh < nw ? nh : nw);

    var fontSize = "16";
    if (size > 72) {
        fontSize = "48";
    } else if (size > 48) {
        fontSize = "36";
    } else if (size > 36) {
        fontSize = "24";
    }

    var panelStyle = {
        position: "relative",
        width: size.toString() + "px",
        height: size.toString() + "px",
        lineHeight: size.toString() + "px",
        fontSize: fontSize + "px",
        textAlign: "center",
        border: "1px solid #ccc",
        borderRadius: "5px",
        color: "#777",
        margin: "0 2px"
    };

    //----------------------------------------------------

    var questionPanel = ui.div().$style({
        position: "absolute",
        top: "0px",
        left: "0px",
        right: "0px",
        height: size.toString() + "px",
        display: "inline-flex",
        textAlign: "center"
    });

    //----------------------------------------------------

    var operandPanels = [];
    var operatorPanels = [];

    var t = ui.div().$style({
        display: "inline-flex",
        margin: "auto"
    }).$parent(questionPanel);;

    for (var i = 0; i < operands.length; i++) {
        operandPanels[i] = ui.div().$style(panelStyle).$parent(t);

        if (i < operators.length) {
            operatorPanels[i] = ui.div().$style(panelStyle).$parent(t);
        }
    }

    //----------------------------------------------------

    var timerPanel = ui.div().$style({
        position: "absolute",
        top: (size + 5).toString() + "px",
        left: "0px",
        right: "0px",
        height: size.toString() + "px",
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
        top: (size * 2 + 10).toString() + "px",
        left: "0px",
        right: "0px",
        height: size.toString() + "px",
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

    //----------------------------------------------------

    var controlPanel = ui.div().$style({
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        textAlign: "center"
    });

    function initInputPanel() {
        inputPanel.innerHTML = "";

        var numberOfInputsPerRow = Math.floor(window.innerWidth / size);
        var row = null;
        for (var i = 0, j = 0; i <= maxResult; i++, j++) {
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
                        running = false;
                    }
                    render();
                };
            })(i)).$style({
                margin: "0px",
                fontSize: fontSize + "px",
                lineHeight: size + "px",
                width: size + "px",
                height: size + "px"
            }).$parent(row);
        }

        //------------------------------------------------

        correctCnt = 0;
        errorCnt = 0;

        minutes = 0;
        seconds = -1;

        running = true;

        next();
        renderTimer();
        render();
    };

    ui.button("L1", function () {
        maxOperand = 10;
        maxResult = 10;

        initInputPanel();
    }).$style({
        margin: "0px",
        fontSize: fontSize + "px",
        lineHeight: size + "px",
        width: size + "px",
        height: size + "px"
    }).$parent(controlPanel);

    ui.button("L2", function () {
        maxOperand = 10;
        maxResult = 15;

        initInputPanel();
    }).$style({
        margin: "0px",
        fontSize: fontSize + "px",
        lineHeight: size + "px",
        width: size + "px",
        height: size + "px"
    }).$parent(controlPanel);

    ui.button("L3", function () {
        maxOperand = 10;
        maxResult = 20;

        initInputPanel();
    }).$style({
        margin: "0px",
        fontSize: fontSize + "px",
        lineHeight: size + "px",
        width: size + "px",
        height: size + "px"
    }).$parent(controlPanel);

    //----------------------------------------------------

    function next() {
        // Generate operators.
        for (var i = 0; i < operators.length; i++) {
            if (i < numberOfOperator) {
                operators[i] = rand(maxOperator, 0);
            } else {
                operators[i] = OPERATOR_ADD;
            }
        }

        // Generate operands.
        switch (operators[0]) { // The first operand.
            case OPERATOR_SUB:
                operands[0] = rand(maxOperand, 3);
                break;

            case OPERATOR_ADD:
                operands[0] = rand(maxOperand - 1, 1);
                break;
        }
        switch (operators[0]) { // The second operand.
            case OPERATOR_SUB:
                operands[1] = rand(operands[0] - 1, 1);
                break;

            case OPERATOR_ADD:
                operands[1] = rand(maxResult < maxOperand + operands[0] ? maxResult - operands[0] : maxOperand, 1);
                break;
        }
        if (numberOfOperator === 2) {
            // TODO:
            // The third operand.
        } else {
            operators[1] = OPERATOR_ADD;
            operands[2] = 0;
        }

        // Compute the answer.
        ans = 0;
        switch (operators[0]) {
            case OPERATOR_ADD:
                ans = operands[0] + operands[1];
                break;

            case OPERATOR_SUB:
                ans = operands[0] - operands[1];
                break;

            case OPERATOR_MULTIP:
                ans = operands[0] * operands[1];
                break;

            case OPERATOR_DIV:
                ans = operands[0] / operands[1];
                break;
        }
        switch (operators[1]) {
            case OPERATOR_ADD:
                ans += operands[2];
                break;

            case OPERATOR_SUB:
                ans -= operands[2];
                break;
        }
    };

    function renderTimer() {
        if (running) {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
            }

            if ((minutes < maxMiniute) && (errorCnt < maxErrorCnt)) {
                setTimeout(renderTimer, 1e3);

                renderMinutesAndSeconds();
            } else {
                running = false;

                render();
            }
        }
    };

    function renderMinutesAndSeconds() {
        minutePanel.innerText = (minutes < 10 ? "0" : "") + minutes.toString() + "'";
        secondPanel.innerText = (seconds < 10 ? "0" : "") + seconds.toString() + "\"";
    };

    function renderCounters() {
        correctPanel.innerText = correctCnt.toString();
        errorPanel.innerText = errorCnt.toString();
    };

    function render() {
        parent.innerHTML = "";

        var showResult = running || minutes > 0 || seconds > 0;

        //------------------------------------------------

        for (var i = 0; i < operators.length; i++) {
            if (i < numberOfOperator) {
                operatorPanels[i].$show().innerText = OPERATOR_CHARACTERS[operators[i]];
            } else {
                operatorPanels[i].$hide();
            }
        }
        for (var i = 0; i < operands.length; i++) {
            if (i <= numberOfOperator) {
                operandPanels[i].$show().innerText = showResult ? operands[i].toString() : "?";
            } else {
                operandPanels[i].$hide();
            }
        }

        //------------------------------------------------

        if (showResult) {
            // minutePanel.$show().innerText = (minutes < 10 ? "0" : "") + minutes.toString() + "'";
            // secondPanel.$show().innerText = (seconds < 10 ? "0" : "") + seconds.toString() + "\"";

            // correctPanel.$show().innerText = correctCnt.toString();
            // errorPanel.$show().innerText = errorCnt.toString();

            renderMinutesAndSeconds();
            renderCounters();
        } else {
            timerPanel.$hide();
            counterPanel.$hide();
        }

        //------------------------------------------------

        if (running) {
            inputPanel.$show();
            controlPanel.$hide();
        } else {
            inputPanel.$hide();
            controlPanel.$show();
        }

        //------------------------------------------------

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