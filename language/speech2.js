var ui = require("../ui/basic");

module.exports = function (onstart, onend) {
    var supported = true;

    function showUnsupportedMessage() {
        ui.block(
            ui.en ?
                "Your browser does not support Speech Synthesis, try using " + (ui.iOS ? "Safari" : "Chrome (version 85 or abover)") + " instead." :
                "您的浏览器不支持语音合成，请使用 " + (ui.iOS ? "Safari " : "Chrome (版本 85 或以上)") + "浏览器访问。"
        );
    };

    //----------------------------------------------------

    var utterance = {};

    try {
        utterance = new SpeechSynthesisUtterance();

        utterance.onstart = onstart;
        utterance.onend = onend;
    } catch (e) {
        supported = false;

        showUnsupportedMessage();
    }

    utterance.rate = 0.8;

    //----------------------------------------------------

    function speak(s, isChinese) {
        if (!supported) {
            showUnsupportedMessage();
            return;
        }

        if (isChinese) {
            utterance.text = s.replace(/[，；。：“”‘！？,;:";!?]/g, "");
        } else {
            var a = s.split(":");
            if (a.length === 2) {
                utterance.text = a[1];
            } else {
                utterance.text = s;
            }
        }
        speechSynthesis.speak(utterance);
    };

    return {
        speak: speak
    };
};