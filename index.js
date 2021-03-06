var ui = require("./ui/basic");
var Arithmetic = require("./arithmetic/client");
// var Language = require("./language/client2");

//----------------------------------------------------------------------------

var arithmetic = new Arithmetic();
// var language = new Language();

//----------------------------------------------------------------------------

var container = ui.div().$style({
    position: "fixed",
    left: "0px",
    right: "0px",
    top: "0px",
    bottom: "0px",
    display: "block",
    // backgroundImage: "url(/images/bg.png)",
    // backgroundSize: "100% 100%"
    background: "-webkit-gradient(linear,center top,center bottom,from(#86ABA0),to(#5CA4CE))"
});

var menu = [
    {
        title: "Arithmetic",
        icon: "images/arith.png",
        callback: function () {
            arithmetic.render(container);
        }
    // },
    // {
    //     title: "Look, Listen, Learn",
    //     icon: "images/english.png",
    //     callback: function () {
    //         language.render(container);
    //         language.load("language/resources/english/3l-1.txt", "", false);
    //     }
    // },
    // {
    //     title: "Story",
    //     icon: "images/physics.png",
    //     callback: function () {
    //         language.render(container);
    //         language.load("language/resources/chinese/t3.txt", "野天鹅", true);
    //     }
    }
];

//----------------------------------------------------------------------------

function render() {
    // Clear everything.
    document.body.innerHTML = "";
    document.body.style.margin = "0px";
    document.body.style.padding = "0px";

    container.innerHTML = "";
    container.$parent();

    // Branch 1: Render sub-pages.
    for (var i = 0; i < menu.length; i++) {
        if (window.history.state === menu[i].title) {
            menu[i].callback();
            return;
        }
    }

    // Branch 2: Render main menu.
    for (var i = 0; i < menu.length; i++) {
        ui.div().$style({
            fontSize: "18px",
            lineHeight: "72px",
            color: "#aaa",
            border: "1px solid #eee",
            borderRadius: "9px",
            margin: "9px",
            boxShadow: "0px 0px 9px #ccc",
            backgroundColor: "rgba(255,255,255,.5)",
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
        }).$parent(container);
    }
};

//----------------------------------------------------------------------------

window.onload = render;
window.onpopstate = render;

//----------------------------------------------------------------------------
