var Client = require("./client");

window.onload = function () {
    (new Client()).play("/speaker/chinese/t3.txt", "野天鹅");
    // ("/chinese/t1.txt", "皇帝的新装");
    // ("/chinese/t2.txt", "丑小鸭");
};