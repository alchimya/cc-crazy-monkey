"use strict";
cc._RFpush(module, '7c9d92+IOBMGKwSTChSoIVi', 'stop');
// scripts/controllers/stop.js

cc.Class({
    "extends": cc.Component,

    properties: {
        tag: {
            "default": 0,
            type: cc.Integer
        },
        blinkTimer: {
            "default": null,
            visible: false
        },
        blinkCounter: {
            "default": 0,
            visible: false
        }
    },
    // use this for initialization
    onLoad: function onLoad() {},
    blink: function blink() {

        var that = this;
        this.blinkTimer = setInterval(function () {

            that.blinkCounter++;
            that.node.active === true ? that.node.active = false : that.node.active = true;
            if (that.blinkCounter == 10) {
                that.blinkCounter = 0;
                that.node.active = true;
                clearInterval(that.blinkTimer);
            }
        }, 300);
    }

});

cc._RFpop();