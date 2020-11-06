var ui = require("./ui/basic");
var Arithmetic = require("./arithmetic/client");
var Language = require("./language/client");

//----------------------------------------------------------------------------

var arithmetic = new Arithmetic();
var language = new Language();

//----------------------------------------------------------------------------

var menu = [
    {
        title: "Arithmetic",
        callback: arithmetic.render
    },
    {
        title: "Chinese",
        callback: function() {
            language.render();
            language.play("/language/resources/chinese/t3.txt", "野天鹅");
        }
    },
    {
        title: "English",
        callback: language.render
    }
];

//----------------------------------------------------------------------------

function render(e) {
    // Clear everything.
    document.body.style.margin = "0px";
    document.body.innerHTML = "";

    // Branch 1: Render sub-pages.
    for (var i = 0; i < menu.length; i++) {
        if (window.history.state === menu[i].title) {
            menu[i].callback();
            return;
        }
    }

    // Branch 2: Render main menu.
    for (var i = 0; i < menu.length; i++) {
        ui.div(menu[i].title).$style({
            fontSize: "24px",
            lineHeight: "100px",
            color: "#ccc",
            textAlign: "center",
            border: "1px solid #eee",
            borderRadius: "9px",
            margin: "9px",
            boxShadow: "0px 0px 9px #ccc",
            backgroundColor: ui.color.background.light[i % ui.color.background.light.length]
        }).$bind({
            onclick: (function (state, callback) {
                return function () {
                    history.pushState(state, "", "");
                    callback();
                };
            })(menu[i].title, menu[i].callback)
        }).$parent();
    }
};

//----------------------------------------------------------------------------

window.onload = render;
window.onpopstate = render;

//----------------------------------------------------------------------------
