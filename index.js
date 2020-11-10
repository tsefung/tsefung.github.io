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
        icon: "/images/arith.png",
        callback: arithmetic.render
    },
    {
        title: "Chinese",
        icon: "/images/physics.png",
        callback: function () {
            language.render();
            language.play("/language/resources/chinese/t3.txt", "野天鹅");
        }
    // },
    // {
    //     title: "English",
    //     icon: "/images/english.png",
    //     callback: language.render
    }
];

//----------------------------------------------------------------------------

function render() {
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

    var parent = ui.div().$style({
        display: "block"
    });

    // Branch 2: Render main menu.
    for (var i = 0; i < menu.length; i++) {
        ui.div().$style({
            fontSize: "18px",
            lineHeight: "72px",
            color: "#ccc",
            border: "1px solid #eee",
            borderRadius: "9px",
            margin: "9px",
            boxShadow: "0px 0px 9px #ccc",
            backgroundColor: ui.color.background.light[i % ui.color.background.light.length],
            display: "flex"
        }).$append(
            ui.img(menu[i].icon)
        ).$append(
            ui.div(menu[i].title).$style({
                width: "100%",
                textAlign: "center"
            })
        ).$bind({
            onclick: (function (state, callback) {
                return function () {
                    history.pushState(state, "", "");
                    callback();
                };
            })(menu[i].title, menu[i].callback)
        }).$parent(parent);
    }

    parent.$parent();
};

//----------------------------------------------------------------------------

window.onload = render;
window.onpopstate = render;

//----------------------------------------------------------------------------
