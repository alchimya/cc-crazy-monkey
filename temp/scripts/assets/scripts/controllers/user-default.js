"use strict";
cc._RFpush(module, 'ac85aN0yDZAy5qM8en8FeDQ', 'user-default');
// scripts/controllers/user-default.js

var UserDefaultKeys = require('user-default-keys')();
var UserDefault = cc.Class({
    'extends': cc.Component,

    properties: {
        localStorage: {
            'default': null,
            visible: false,
            type: Object
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.localStorage = cc.sys.localStorage;
        //init the singleton instance
        UserDefault.instance = this;
    },
    statics: {
        instance: null
    },
    getCurrentCredit: function getCurrentCredit(defaultValue) {
        var data = this.localStorage.getItem(UserDefaultKeys.CURRENT_CREDIT);
        if (!data) {
            data = defaultValue;
        }
        return data ? parseInt(data) : 0;
    },
    setCurrentCredit: function setCurrentCredit(value) {
        this.localStorage.setItem(UserDefaultKeys.CURRENT_CREDIT, value);
    }
});

cc._RFpop();