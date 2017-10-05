    "use strict";
    // CHECK IF WINDOW LOADED
    window.addEventListener("load", function () {
        window.loaded = true;
    });

    function logLoaded() {
        console.log("loaded");
    }

    (function listen() {
        if (window.loaded) {
            lifecycle.windowLoadEvents();
        } else {
            console.log("notLoaded");
            window.setTimeout(listen, 50);
        }
    })();

    // IIFE - Immediately Invoked Function Expression
    (function (init) {

        init(window.jQuery, window, document);

    }(function ($, window, document) {
        //  DOM Ready!
        $(lifecycle.init);

    }));
    
    // ZOOM FIELDS CONTROL
    function setSelectedZoomItem(selectedItem) {
        manipulateDOM.zoomFields.eventZoom(selectedItem);
    }
    