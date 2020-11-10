var ui = require("../ui/basic");


var OPERATOR_ADD = 0;
var OPERATOR_SUB = 1;
var OPERATOR_MULTIP = 2;
var OPERATOR_DIV = 3;

var OPERATOR_CHARACTERS = ["+", "-", "×", "÷"];

function rand(max, min) {
    return Math.round(Math.random() * (max - min)) + min;
};

function computeFontSize(px) {
    // if (px >= 72) {
    // return 56;
    // } else 
    if (px >= 56) {
        return 48;
    } else if (px >= 48) {
        return 36;
    } else if (px >= 36) {
        return 24;
    } else {
        return 16;
    }
};

function computeInputSize(n) {
    var nH = Math.ceil(Math.sqrt(n * window.innerHeight / (2 * window.innerWidth)));
    var nW = Math.ceil(n / nH);

    var pxH = Math.floor(window.innerHeight / (2 * nH));
    var pxW = Math.floor(window.innerWidth / nW);

    var px = pxH < pxW ? pxH : pxW;
    var fs = computeFontSize(px);

    return {
        cellsPerRow: nW,
        cellSize: px,
        fontSize: fs,

        style: {
            position: "relative",
            width: px + "px",
            height: px + "px",
            lineHeight: px + "px",
            fontSize: fs + "px",
            textAlign: "center",
            border: "1px solid #ccc",
            borderRadius: "5px",
            color: "#777",
            backgroundColor: "rgba(255,255,255,.3)",
            margin: "1px"
        }
    };
};

module.exports = function () {
    var status = {
        correctCnt: 0,
        errorCnt: 0,

        minutes: 0,
        seconds: 0,

        running: false
    };

    var operands = [0, 0, 0];
    var operators = [0, 0];
    var ans = 0;

    var config = {
        maxMinutes: 3,
        maxErrorCnt: 5,
        maxOperand: 10,
        maxOperator: 1,
        maxResult: 20,

        numberOfOperator: 1
    };

    //----------------------------------------------------

    var questionPanel = ui.div().$style({
        textAlign: "center"
    });

    var operandPanel = [];
    for (var i = 0; i < operands.length; i++) {
        operandPanel.push(ui.div());
    }
    var operatorPanel = [];
    for (var i = 0; i < operators.length; i++) {
        operatorPanel.push(ui.div());
    }

    function generate() {
        //------------------------------------------------
        // Generate the first operator.

        operators[0] = rand(config.maxOperator, 0);

        //------------------------------------------------
        // Generate operands.

        // The first operand.
        var n = operands[0];
        while (n === operands[0]) {
            switch (operators[0]) {
                case OPERATOR_SUB:
                    n = rand(config.maxOperand, 3);
                    break;

                case OPERATOR_ADD:
                    n = rand(config.maxOperand - 1, 1);
                    break;
            }
        }
        operands[0] = n;

        // The second operand.
        switch (operators[0]) {
            case OPERATOR_SUB:
                operands[1] = rand(operands[0] - 1, 1);
                break;

            case OPERATOR_ADD:
                operands[1] = rand(config.maxResult < config.maxOperand + operands[0] ? config.maxResult - operands[0] : config.maxOperand, 1);
                break;
        }

        if (config.numberOfOperator === 2) {
            var t = 0;

            // The second operator and the third operand.
            switch (operators[0]) {
                case OPERATOR_ADD:
                    operators[1] = OPERATOR_SUB;

                    t = operands[0] + operands[1];
                    do {
                        operands[2] = rand(t, 1);
                    } while (operands[1] === operands[2]);
                    break;

                case OPERATOR_SUB:
                    operators[1] = OPERATOR_ADD;

                    t = operands[0] - operands[1];
                    do {
                        operands[2] = rand(config.maxResult < config.maxOperand + t ? config.maxResult - t : config.maxOperand, 1);
                    } while (operands[1] === operands[2]);
                    break;
            }
        } else {
            operators[1] = OPERATOR_ADD;
            operands[2] = 0;
        }

        //------------------------------------------------
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

        //------------------------------------------------

        for (var i = 0; i < operandPanel.length; i++) {
            operandPanel[i].innerText = operands[i].toString();
        }
        for (var i = 0; i < operatorPanel.length; i++) {
            operatorPanel[i].innerText = OPERATOR_CHARACTERS[operators[i]];
        }
    };

    function renderQuestion() {
        questionPanel.innerHTML = "";

        var w = Math.floor((window.innerWidth - 20) / (2 * config.numberOfOperator + 1));
        var h = Math.floor(window.innerHeight * 0.20);
        var x = w < h ? w : h;

        var style = {
            position: "relative",
            width: x + "px",
            height: x + "px",
            lineHeight: x + "px",
            fontSize: computeFontSize(x) + "px",
            textAlign: "center",
            border: "1px solid #ccc",
            borderRadius: "5px",
            margin: "1px",
            color: "#777"
        };

        var t = ui.div().$style({
            display: "inline-flex",
            margin: "auto"
        });
        for (var i = 0; i < config.numberOfOperator + 1; i++) {
            operandPanel[i].$style(style).$parent(t).innerText = status.running ? operands[i].toString() : "?";

            if (i < config.numberOfOperator) {
                operatorPanel[i].$style(style).$parent(t).innerText = status.running ? OPERATOR_CHARACTERS[operators[i]] : "+";
            }
        }
        t.$parent(questionPanel);
    };

    //----------------------------------------------------

    var statusPanel = ui.div().$style({
        position: "absolute",
        left: "0px",
        right: "0px",
        top: "25%",
        textAlign: "center"
    });

    var minutePanel = ui.div().$style({
        color: "#777",
        backgroundColor: "#ffe"
    });
    var secondPanel = ui.div().$style({
        color: "#777",
        backgroundColor: "#ffe"
    });

    var correctPanel = ui.div().$style({
        color: "#fff",
        backgroundColor: "#5fa85f"
    });
    var errorPanel = ui.div().$style({
        color: "#fff",
        backgroundColor: "#df5555"
    });

    ui.div().$style({
        display: "inline-flex",
        margin: "auto"
    }).$append([correctPanel, minutePanel, secondPanel, errorPanel]).$parent(statusPanel);

    function onTimer() {
        if (!status.running) {
            return;
        }

        status.seconds++;
        if (status.seconds >= 60) {
            status.seconds = 0;
            status.minutes++;
        }

        minutePanel.innerText = (status.minutes < 10 ? "0" : "") + status.minutes.toString() + "'";
        secondPanel.innerText = (status.seconds < 10 ? "0" : "") + status.seconds.toString() + "\"";

        if (status.minutes >= config.maxMinutes || status.errorCnt >= config.maxErrorCnt) {
            running = false;

            inputPanel.$hide();

            return;
        }

        setTimeout(onTimer, 1e3);
    };

    function renderStatus() {
        var w = Math.floor((window.innerWidth - 20) / 4);
        var h = Math.floor(window.innerHeight * 0.20);
        var x = w < h ? w : h;

        var style = {
            position: "relative",
            width: x + "px",
            height: x + "px",
            lineHeight: x + "px",
            fontSize: computeFontSize(x) + "px",
            textAlign: "center",
            border: "1px solid #ccc",
            borderRadius: "5px",
            margin: "1px"
        };

        minutePanel.$style(style);
        secondPanel.$style(style);

        correctPanel.$style(style);
        errorPanel.$style(style);

        if (status.running) {
            statusPanel.$show();
        } else {
            statusPanel.$hide();
        }
    };

    //----------------------------------------------------

    var inputPanel = ui.div().$style({
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        textAlign: "center"
    });

    function renderInputs() {
        inputPanel.innerHTML = "";

        var size = computeInputSize(config.maxResult + 1);
        var row = null;
        for (var i = 0, j = 0; i <= config.maxResult; i++, j++) {
            if (j % size.cellsPerRow === 0) {
                row = ui.div().$style({
                    display: "inline-flex"
                }).$parent(inputPanel);
            }

            ui.div(i.toString()).$style(size.style).$bind({
                onclick: (function (n) {
                    return function () {
                        if (n === ans) {
                            status.correctCnt++;
                            correctPanel.innerText = status.correctCnt.toString();

                            generate();
                        } else {
                            status.errorCnt++;
                            errorPanel.innerText = status.errorCnt.toString();

                            if (status.errorCnt >= config.maxErrorCnt) {
                                inputPanel.$hide();
                                controlPanel.$show();
                            }
                        }
                    };
                })(i)
            }).$parent(row);
        }

        if (status.running) {
            inputPanel.$show();
        } else {
            inputPanel.$hide();
        }
    };

    //----------------------------------------------------

    var controlPanel = ui.div().$style({
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        color: "#aaa",
        textAlign: "center"
    });

    function start() {
        status.minutes = 0;
        status.seconds = -1;

        status.correctCnt = 0;
        status.errorCnt = 0;

        correctPanel.innerText = status.correctCnt.toString();
        errorPanel.innerText = status.errorCnt.toString();

        status.running = true;

        generate();
        onTimer();

        controlPanel.$hide();
        statusPanel.$show();

        renderQuestion();
        renderInputs();
    };

    var levels = [
        {
            title: "Level 1",
            callback: function () {
                config.maxResult = 10;
                start();
            }
        },
        {
            title: "Level 2",
            callback: function () {
                config.numberOfOperator = 2;
                config.maxResult = 10;
                start();
            }
        },
        {
            title: "Level 3",
            callback: function () {
                config.maxResult = 20;
                start();
            }
        },
        {
            title: "Level 4",
            callback: function () {
                config.numberOfOperator = 2;
                config.maxResult = 20;
                start();
            }
        },
    ];

    function renderControls() {
        controlPanel.innerHTML = "";

        var style = {
            position: "relative",
            lineHeight: "50px",
            fontSize: "18px",
            textAlign: "center",
            backgroundColor: "rgba(255,255,255,.5)",
            border: "1px solid #ccc",
            borderRadius: "5px",
            margin: "3px 50px"
        };

        for (var i = 0; i < levels.length; i++) {
            ui.div(levels[i].title).$parent(controlPanel).$style(style).$bind({
                onclick: levels[i].callback
            });
        }

        if (status.running) {
            controlPanel.$hide();
        } else {
            controlPanel.$show();
        }
    };

    //----------------------------------------------------

    function render(container) {
        var parent = (container ? container : document.body);
        parent.innerHTML = "";

        renderQuestion();
        renderStatus();
        renderInputs();
        renderControls();

        var frag = document.createDocumentFragment();
        frag.appendChild(questionPanel);
        frag.appendChild(statusPanel);
        frag.appendChild(inputPanel);
        frag.appendChild(controlPanel);
        parent.appendChild(frag);
    };

    //----------------------------------------------------

    return {
        render: render
    };
};