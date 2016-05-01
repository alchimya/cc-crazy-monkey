require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"audio-manager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a7dbfKh+5JK04r9bLRSoPa2', 'audio-manager');
// scripts/controllers/audio-manager.js

///deifnes an helper (singleton) class to play ausio assets
var AudioManager = cc.Class({
    "extends": cc.Component,

    properties: {
        //PUBLIC PROPERTIES
        //the properties below define all the audio clips that the class can play
        coinsWin: {
            "default": null,
            url: cc.AudioClip
        },
        coinsInsert: {
            "default": null,
            url: cc.AudioClip
        },
        jackpotWin: {
            "default": null,
            url: cc.AudioClip
        },
        lineWin: {
            "default": null,
            url: cc.AudioClip
        },
        reelStart: {
            "default": null,
            url: cc.AudioClip
        },
        reelRoll: {
            "default": null,
            url: cc.AudioClip
        },
        reelStop: {
            "default": null,
            url: cc.AudioClip
        },
        gameOver: {
            "default": null,
            url: cc.AudioClip
        }
    },
    //defines the static (singleton) instance
    statics: {
        instance: null
    },

    playCoinsWin: function playCoinsWin() {
        cc.audioEngine.playMusic(this.coinsWin, false);
    },
    playCoinsInsert: function playCoinsInsert() {
        cc.audioEngine.playEffect(this.coinsInsert, false);
    },
    playJackpotWin: function playJackpotWin() {
        cc.audioEngine.playEffect(this.jackpotWin, false);
    },
    playLineWin: function playLineWin() {
        cc.audioEngine.playEffect(this.lineWin, false);
    },
    playReelStart: function playReelStart() {
        cc.audioEngine.playEffect(this.reelStart, false);
    },
    playReelRoll: function playReelRoll() {
        this.playSound(this.reelRoll);
    },
    playReelStop: function playReelStop() {
        cc.audioEngine.playEffect(this.reelStop, false);
    },
    playGameOver: function playGameOver() {
        cc.audioEngine.playEffect(this.gameOver, false);
    },
    playSound: function playSound(audioClip) {
        //audio play
        if (!audioClip) {
            return;
        }
        cc.audioEngine.playMusic(audioClip, false);
    },
    onLoad: function onLoad() {
        //init the singleton instance
        AudioManager.instance = this;
    }

});

cc._RFpop();
},{}],"game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '17a107hOA1DjJdGNDmkBd3y', 'game');
// scripts/controllers/game.js

//defines the main driver of the game
var Reel = require('reel'),
    OnOffButton = require('on-off-button'),
    AudioManager = require('audio-manager'),
    UserDefault = require('user-default'),
    PayTableTags = require('paytable-tags')();
cc.Class({
    'extends': cc.Component,
    properties: {
        //PUBLIC PROPERTIES
        //gets/sets an array of Reel type (see reel.js asset) used to define the slot reels
        reels: {
            'default': [],
            type: [Reel]
        },
        //gets/sets the initial credit.
        currentCredit: {
            'default': 100,
            type: cc.Integer
        },
        //gets/sets the amount of the "one bet" mode
        betOneValue: {
            'default': 1,
            type: cc.Integer
        },
        //gets/sets the amount of the "max bet" mode
        betMaxValue: {
            'default': 5,
            type: cc.Integer
        },
        //gets/sets the OnOff spin button
        spinButton: {
            'default': null,
            type: OnOffButton
        },
        //gets/sets the OnOff auto-spin button
        autoSpinButton: {
            'default': null,
            type: OnOffButton
        },
        //gets/sets the OnOff bet one button
        betOneButton: {
            'default': null,
            type: OnOffButton
        },
        //gets/sets the OnOff bet max button
        betMaxButton: {
            'default': null,
            type: OnOffButton
        },
        //gets/sets total bet label
        totalBetLabel: {
            'default': null,
            type: cc.Label
        },
        //gets/sets credit label
        creditLabel: {
            'default': null,
            type: cc.Label
        },
        //gets/sets info label
        betInfoLabel: {
            'default': null,
            type: cc.Label
        },
        //gets/sets how many reels have been completed the roll operation
        rollingCompletedCount: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets/sets the flag that allows to undersatnd if all the reels have been completed its rolling operation
        isRollingCompleted: {
            'default': true,
            visible: false
        },
        //gets/sets the total bet value
        totalBetValue: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets/sets the current bet value (bet one or bet max)
        currentBetValue: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets/sets the current paytable tag (see paytable-tags.js asset)
        currentPayTableTag: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets set the auto-spin flag
        isAutoSpin: {
            'default': false,
            visible: false
        },
        //gets/sets the timer instance used for the auto/spin  timeout
        autoSpinTimer: {
            'default': null,
            visible: false
        }
    },

    onLoad: function onLoad() {

        var that = this;

        //sets the available credit.
        this.creditLabel.string = this.currentCredit.toString();
        //init bet info label
        this.betInfoLabel.string = "";

        //implements the spin button on/off event
        this.spinButton.node.on('reel-spin', function (event) {
            if (event.detail.isOn) {
                //play the game
                that.spin();
            }
        });
        //implements the auto-spin button on/off event
        this.autoSpinButton.node.on('reel-auto-spin', function (event) {
            //play the game as single spin or auto-spin
            that.isAutoSpin === true ? that.isAutoSpin = false : that.isAutoSpin = true;
            if (that.isAutoSpin) {
                if (event.detail.isOn) {
                    that.spin();
                }
            } else {
                clearTimeout(that.autoSpinTimer);
            }
        });
        //implements the bet one button on/off event
        this.betOneButton.node.on('bet-one', function (event) {
            if (event.detail.isOn) {
                //when this button is pushed down the bet max button will be reset
                that.betMaxButton.reset();
                //set bet value
                that.currentBetValue = that.betOneValue;
                that.currentPayTableTag = PayTableTags.BET_ONE;
                that.betInfoLabel.string = that.currentBetValue.toString();
                AudioManager.instance.playCoinsInsert();
            }
        });
        //implements the bet-max button on/off event
        this.betMaxButton.node.on('bet-max', function (event) {
            if (event.detail.isOn) {
                //when this button is pushed down the bet one button will be reset
                that.betOneButton.reset();
                //set bet value
                that.currentBetValue = that.betMaxValue;
                that.currentPayTableTag = PayTableTags.BET_MAX;
                that.betInfoLabel.string = that.currentBetValue.toString();
                AudioManager.instance.playCoinsInsert();
            }
        });
        //implements the rolling completed event of the rell.js class
        this.node.on('rolling-completed', function (event) {
            //this method counts all the completed rolling reels and evaluate the results
            //if all the rells have been finished to roll.
            that.rollingCompletedCount++;
            AudioManager.instance.playReelStop();

            if (that.rollingCompletedCount == that.reels.length) {
                that.rollingCompletedCount = 0;
                //gets the line symbols tags
                var lineSymbolsTags = [];
                lineSymbolsTags = that.getLineSymbolsTag();

                //create a paytable instance and checks if the tag symbols is a winning combination
                var paytable = that.getComponent("paytable"),
                    paytableRet = paytable.isWinning(lineSymbolsTags, that.currentPayTableTag),
                    isWinning = Object.keys(paytableRet).length > 0;

                if (isWinning) {
                    //WON!!!
                    //if won spin and auto-spin will stop the execution
                    that.isRollingCompleted = true;
                    that.isAutoSpin ? that.autoSpinButton.reset() : that.spinButton.reset();
                    that.isAutoSpin = false;
                    //play sound
                    AudioManager.instance.playLineWin();
                    AudioManager.instance.playCoinsWin();
                    //show winning symbols (animation)
                    that.showWinningSymbolsAndPay(paytableRet);
                } else {
                    //LOST update credit
                    that.updateCurrenCredit(that.currentCredit - that.currentBetValue);
                    that.betInfoLabel.string = (-that.currentBetValue).toString();

                    if (!that.isAutoSpin) {
                        //spin completed
                        that.isRollingCompleted = true;
                        that.spinButton.reset();
                    } else {
                        that.autoSpinTimer = setTimeout(function () {
                            //auto-spin completed...will restart
                            that.spin();
                        }, 1000);
                    }
                }
                if (that.isRollingCompleted) {
                    //unlocks all buttons
                    that.setButtonsLocked(false);
                    //update user default current credit
                    UserDefault.instance.setCurrentCredit(that.currentCredit);
                }
            }
        });
    },
    start: function start() {
        //read all the user default
        this.loadUserDefault();
    },
    loadUserDefault: function loadUserDefault() {
        //current credit
        this.updateCurrenCredit(UserDefault.instance.getCurrentCredit(this.currentCredit));
    },
    spin: function spin() {

        //checks if there is enough credit to play
        if (this.currentCredit === 0) {
            return;
        }
        //reset label info with current bet value
        this.betInfoLabel.string = this.currentBetValue.toString();

        if (this.isRollingCompleted) {
            //sets total bet Label
            this.totalBetValue += this.currentBetValue;
            this.totalBetLabel.string = this.totalBetValue.toString();

            if (!this.isAutoSpin) {
                //this.spinButton.isLocked=true;
                this.isRollingCompleted = false;
            }
            //locks all buttons
            this.setButtonsLocked(true);
            AudioManager.instance.playReelRoll();
            //starts reels spin
            for (var i = 0; i < this.reels.length; i++) {
                this.reels[i].spin();
            }
        }
    },
    setButtonsLocked: function setButtonsLocked(isLocked) {
        if (!this.isAutoSpin) {
            this.autoSpinButton.isLocked = isLocked;
        }

        this.spinButton.isLocked = isLocked;
        this.betOneButton.isLocked = isLocked;
        this.betMaxButton.isLocked = isLocked;
    },
    getLineSymbolsTag: function getLineSymbolsTag() {
        var lineSymbolsTags = [];
        for (var m = 0; m < this.reels.length; m++) {
            var stopNode = this.reels[m].getWinnerStop();
            var stopComponent = stopNode.getComponent("stop");
            lineSymbolsTags.push(stopComponent.tag);
        }
        return lineSymbolsTags;
    },
    showWinningSymbolsAndPay: function showWinningSymbolsAndPay(paytableRet) {

        var stopNode,
            stopComponent,
            winningAmount = 0;

        //loop on  the winning combinations throughout the symbols index
        //note that it's possible to have one or more winning combinaiton
        for (var i = 0; i < paytableRet.length; i++) {
            var item = paytableRet[i];
            for (var n = 0; n < item.indexes.length; n++) {
                stopNode = this.reels[item.indexes[n]].getWinnerStop();
                stopComponent = stopNode.getComponent("stop");
                stopComponent.blink();
            }
            winningAmount += parseInt(item.winningValue);
        }

        //PAY update credit
        this.updateCurrenCredit(this.currentCredit + winningAmount);
        this.betInfoLabel.string = winningAmount.toString();
    },
    updateCurrenCredit: function updateCurrenCredit(value) {
        this.currentCredit = value;
        this.creditLabel.string = this.currentCredit.toString();
        if (parseInt(this.currentCredit) <= 0) {
            AudioManager.instance.playGameOver();
            //TODO reset credit automatically
            this.updateCurrenCredit(100);
        }
    }

});

cc._RFpop();
},{"audio-manager":"audio-manager","on-off-button":"on-off-button","paytable-tags":"paytable-tags","reel":"reel","user-default":"user-default"}],"on-off-button":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5357bF9y7pDjoX+fmXrnWY3', 'on-off-button');
// scripts/ui/on-off-button.js

//defines a class to implement an On/Off button
cc.Class({
    "extends": cc.Component,

    properties: {
        //PUBLIC PROPERTIES
        ///gets/sets the event name that will be raised wneh the button is touched
        mouseDownName: {
            "default": "on-off-mousedown"
        },
        //gets/sets the sprite button
        sprite: {
            "default": null,
            type: cc.Sprite
        },
        //gets/sets the texture url for the on status
        spriteTextureDownUrl: {
            "default": "",
            url: cc.Texture2D
        },
        //gets/sets the on status
        isOn: {
            "default": false
        },
        //PRIVATE PROPERTIES
        //gets/sets the texture for the off status
        spriteTextureUp: {
            "default": "",
            visible: false,
            url: cc.Texture2D
        },
        //gets/sets the cached texture for the off status
        spriteTextureDown: {
            "default": "",
            visible: false,
            url: cc.Texture2D
        },
        //gets/sets the locked status. If its value is true no actions will be performed on the touch event
        isLocked: {
            "default": false,
            visible: false
        }
    },

    onLoad: function onLoad() {
        var that = this;
        //sets the texture for on/off
        this.spriteTextureUp = this.sprite._spriteFrame._texture;
        this.spriteTextureDown = cc.textureCache.addImage(this.spriteTextureDownUrl);

        //defines and sets the touch function callbacks
        function onTouchDown(event) {
            that.onOff();
        }
        function onTouchUp(event) {
            //DO NOTHING
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    },
    start: function start() {
        if (this.isOn) {
            //if we want to activate the button on the start-up
            //we need to invert the initial status(flag): see onOff function
            this.isOn = false;
            this.onOff();
        }
    },
    onOff: function onOff() {
        //updates the texture for the on/off status
        if (this.isLocked) {
            return;
        }

        if (this.isOn) {
            //set to off
            this.updateSpriteFrame(this.sprite, this.spriteTextureUp);
            this.isOn = false;
        } else {
            //set to on
            this.updateSpriteFrame(this.sprite, this.spriteTextureDown);
            this.isOn = true;
        }
        //emits the event
        this.node.emit(this.mouseDownName, {
            isOn: this.isOn
        });
    },
    reset: function reset() {
        //resets the button with the off status
        this.isOn = false;
        this.isLocked = false;
        this.updateSpriteFrame(this.sprite, this.spriteTextureUp);
    },
    updateSpriteFrame: function updateSpriteFrame(sprite, texture) {
        //updates the sprite texture
        if (!sprite || !texture) {
            return;
        }
        var w = sprite.node.width,
            h = sprite.node.height,
            frame = new cc.SpriteFrame(texture, cc.rect(0, 0, w, h));
        sprite.spriteFrame = frame;
    }

});

cc._RFpop();
},{}],"paytable-definition":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4b94bWer2JLr7DA4SmWX2NA', 'paytable-definition');
// scripts/controllers/paytable-definition.js

//defines the paytables

/*
PAY TABLE BET MAX
--------------------------------------------------------------------------------------------
SYMBOL		TOTAL SYMBOLS			5/R 			3/R 			2/R
--------------------------------------------------------------------------------------------
BONUS			5					2000			1000			800
BANANA			17					300				200 			100
BEGAMOT			19					200 			100 			50
COCODRILE		19 					200 			100 			50
COCKTAIL		19 					200 			100 			--
KAKADU			20 					100 			75				--
MAN				20 					100 			75				--
MONKEY			20 					100 			75				--
LION			21					50				25				--
--------------------------------------------------------------------------------------------

PAY TABLE BET ONE

--------------------------------------------------------------------------------------------
SYMBOL		TOTAL SYMBOLS			5/R 			3/R 			2/R
--------------------------------------------------------------------------------------------
BONUS			5					200 			100 			50
BANANA			17					100				20  			10
BEGAMOT			19					50  			10  			5
COCODRILE		19 					50  			10  			5
COCKTAIL		19 					20  			10  			2
KAKADU			20 					10  			5				2
MAN				20 					10  			5				2
MONKEY			20 					10  			5				1
LION			21					5				2				1
--------------------------------------------------------------------------------------------

*/
/*
paytable object structure
    {
        stopTag:STOP_TAG,
        5:VALUE,
        3:VALUE,
        2:VALUE
    }
*/
var StopTags = require('stop-tags')(),
    PayTableTags = require('paytable-tags')();
var paytableBetMax = [{
    stopTag: StopTags.BONUS,
    5: 2000,
    3: 1000,
    2: 800
}, {
    stopTag: StopTags.BANANA,
    5: 300,
    3: 200,
    2: 100
}, {
    stopTag: StopTags.BEGAMOT,
    5: 200,
    3: 100,
    2: 50
}, {
    stopTag: StopTags.COCODRILE,
    5: 200,
    3: 100,
    2: 50
}, {
    stopTag: StopTags.COCKTAIL,
    5: 200,
    3: 100,
    2: 5
}, {
    stopTag: StopTags.KAKADU,
    5: 100,
    3: 75,
    2: 5
}, {
    stopTag: StopTags.MAN,
    5: 100,
    3: 75,
    2: 5
}, {
    stopTag: StopTags.MONKEY,
    5: 100,
    3: 75,
    2: 2
}, {
    stopTag: StopTags.LION,
    5: 50,
    3: 25,
    2: 2
}];
var paytableBetOne = [{
    stopTag: StopTags.BONUS,
    5: 200,
    3: 100,
    2: 50
}, {
    stopTag: StopTags.BANANA,
    5: 100,
    3: 20,
    2: 10
}, {
    stopTag: StopTags.BEGAMOT,
    5: 50,
    3: 10,
    2: 5
}, {
    stopTag: StopTags.COCODRILE,
    5: 50,
    3: 10,
    2: 5
}, {
    stopTag: StopTags.COCKTAIL,
    5: 20,
    3: 10,
    2: 2
}, {
    stopTag: StopTags.KAKADU,
    5: 10,
    3: 5,
    2: 2
}, {
    stopTag: StopTags.MAN,
    5: 10,
    3: 5,
    2: 2
}, {
    stopTag: StopTags.MONKEY,
    5: 10,
    3: 5,
    2: 1
}, {
    stopTag: StopTags.LION,
    5: 5,
    3: 2,
    2: 1
}];

var PayTableDefinition = function PayTableDefinition(paytableTag) {
    switch (paytableTag) {
        case PayTableTags.BET_ONE:
            return paytableBetOne;
        case PayTableTags.BET_MAX:
            return paytableBetMax;
        default:
            return paytableBetOne;
    }
};
module.exports = PayTableDefinition;

cc._RFpop();
},{"paytable-tags":"paytable-tags","stop-tags":"stop-tags"}],"paytable-tags":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ea2e2acVj1Hmpq3sPcOAYmv', 'paytable-tags');
// scripts/controllers/paytable-tags.js

//defines the paytbal tags
function PayTableTags() {
    return {
        BET_ONE: 0,
        BET_MAX: 1
    };
}

module.exports = PayTableTags;

cc._RFpop();
},{}],"paytable":[function(require,module,exports){
"use strict";
cc._RFpush(module, '91f5f5bVWpFDYv2UMKKXJYb', 'paytable');
// scripts/controllers/paytable.js

//defines the logicof the payline
var PayTableDefinition = require('paytable-definition'),
    StopTags = require('stop-tags')();
cc.Class({
    'extends': cc.Component,

    properties: {},
    onLoad: function onLoad() {},
    isWinning: function isWinning(lineSymbolsTags, paytableTag) {
        //loop throughout all the symbol tags
        //checking for a sequence of identical symbol tags
        var lineCombinations = {};
        for (var i = 0; i < lineSymbolsTags.length; i++) {
            var firstItem = lineSymbolsTags[i];
            var previousItem = i > 0 ? lineSymbolsTags[i - 1] : -1;
            var indexes = [];
            var tags = [];
            indexes.push(i);
            for (var n = i + 1; n < lineSymbolsTags.length; n++) {
                var item = lineSymbolsTags[n];
                if (firstItem == item && item != previousItem) {
                    //add items to line combinations
                    indexes.push(n);
                    lineCombinations[firstItem] = {
                        indexes: indexes
                    };
                } else {
                    break;
                }
            }
        }

        if (Object.keys(lineCombinations).length > 0) {
            return this.check(lineCombinations);
        }
        return [];
    },
    check: function check(lineCombinations, paytableTag) {

        //checks if the identical line symbols found
        //are valid combinations for the paytable

        /*
        NOTE that the paytable object structure is as follow
            {
                stopTag:STOP_TAG,
                5:VALUE,
                3:VALUE,
                2:VALUE
            }
            
            and re return object is
            [
                indexes:[],
                winningValue:number,
                winningTag:number
            ]
            
        */
        var paytable = PayTableDefinition(paytableTag);
        var ret = [];
        for (var tag in lineCombinations) {
            if (lineCombinations.hasOwnProperty(tag)) {
                var retObject = paytable.filter(function (item) {
                    if (item.stopTag == tag) {
                        var winningValue = parseInt(item[lineCombinations[tag].indexes.length].toString());
                        if (winningValue > 0) {
                            ret.push({
                                indexes: lineCombinations[tag].indexes,
                                winningValue: item[lineCombinations[tag].indexes.length].toString(),
                                winningTag: tag
                            });
                        }
                    }
                });
            }
        }
        return ret;
    }

});

cc._RFpop();
},{"paytable-definition":"paytable-definition","stop-tags":"stop-tags"}],"prng":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f86f5iz5DNJDqogRC4T+OHu', 'prng');
// scripts/controllers/prng.js

//defines a pseudo random number generator
function PRNG() {
    return {
        // Returns a random integer between min (included) and max (included)
        // Using Math.round() will give you a non-uniform distribution!
        newValue: function newValue(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
}

module.exports = PRNG;

cc._RFpop();
},{}],"reel":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3d805IS8GdKi4fpFoRADeDr', 'reel');
// scripts/controllers/reel.js

//defines a slot reel
var PRNG = require('prng')();
cc.Class({
    'extends': cc.Component,
    properties: {
        //PUBLIC PROPERTIES
        //gets/sets an array of stops to define the reel
        stops: {
            'default': [],
            type: [cc.Prefab]
        },
        //gets/sets the min value used with the PRNG class
        prngMinRange: {
            'default': 1,
            type: cc.Integer
        },
        //gets/sets the max value used with the PRNG class
        prngMaxRange: {
            'default': 1000000000,
            type: cc.Integer
        },
        //PRIVATE PROPERTIES
        //gets/sets an array of cc.Node made instantiating each stop
        //defined in to the public stops array property
        stopNodes: {
            'default': [],
            visible: false,
            type: [cc.Node]
        },
        //gets/sets the last node of the reel that
        //during the reel motion will be dinamically updated
        tailNode: {
            'default': null,
            visible: false,
            type: cc.Node
        },
        //gets/sets how many stops are visible on the reel container
        visibleStops: {
            'default': 3,
            visible: false,
            type: cc.Integer
        },
        //gets/sets the adjacent vertical space between two stops
        padding: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets/sets the height of each stop
        stopHeight: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets/sets the amount of the Y translation that define the reel motion
        stepY: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets/sets how many time the reel rolling happened
        rollingCount: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets/sets the winner reel index calculated randomly
        winnerIndex: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets/sets how many times the reel will roll befor stop on the winner symbols (calculated randomly)
        stopAfterRollingCount: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets/sets the Y of the winner line
        winnerLineY: {
            'default': 0,
            visible: false,
            type: cc.Integer
        },
        //gets/sets a flag that indicate if the rolling is completed
        isRollingCompleted: {
            'default': false,
            visible: false
        }
    },

    // use this for initialization

    onLoad: function onLoad() {

        //sets the winnr line Y at the middle of the node height
        this.winnerLineY = this.node.height / 2;

        //sets the stop height using the first stop
        var firstStop = cc.instantiate(this.stops[0]);
        this.stopHeight = firstStop.height;

        //padding: is the space between two adjacent nodes
        this.padding = (this.node.height - this.visibleStops * this.stopHeight) / (this.visibleStops + 1);

        //sets the amount of the Y translation that define the reel motion
        this.stepY = this.stopHeight / 5;

        //considering that the anchor point of the reel is at (0,0)
        //this loop will layou all the stops on the node (reel)
        var startY = this.node.height - this.padding - this.stopHeight;
        var startX = this.node.width / 2 - firstStop.width / 2;

        for (var i = 0; i < this.stops.length; i++) {
            var stop = cc.instantiate(this.stops[i]);
            this.node.addChild(stop);
            stop.setPosition(cc.p(startX, startY));
            startY = startY - this.padding - this.stopHeight;
            this.stopNodes.push(stop);
        }
        this.tailNode = this.stopNodes[this.stopNodes.length - 1];

        this.isRollingCompleted = true;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        if (this.isRollingCompleted) {
            return;
        }

        //the loop below will moove each stop of the setpY amount.
        //When the first stop is on the top of the node, will be moved after the first and will be set as tail.
        //For further informtaion take a look to the online github documentation

        for (var i = 0; i < this.stopNodes.length; i++) {
            var stop = this.stopNodes[i];
            stop.y = stop.y + this.stepY;
            if (stop.y - this.padding > this.node.height) {
                if (i + 1 == this.stopNodes.length) {
                    this.rollingCount++;
                }
                stop.y = this.tailNode.y - this.tailNode.height - this.padding;
                this.tailNode = stop;
            }

            if (this.stopAfterRollingCount == this.rollingCount && i == this.winnerIndex) {
                if (stop.y >= this.winnerLineY) {
                    if (this.winnerIndex === 0) {
                        //move the tail node before the first stop (index===0)
                        this.tailNode.y = stop.y + stop.height;
                        //this.tailNode.setPosition(cc.p(stop.x, stop.y + stop.height));
                        this.tailNode = this.stopNodes[this.stopNodes.length - 2];
                    }
                    this.resetY(stop);
                    this.isRollingCompleted = true;
                    this.node.dispatchEvent(new cc.Event.EventCustom('rolling-completed', true));
                }
            }
        }
    },
    resetY: function resetY(currentStop) {
        //applies a correction to all the Y stops after that
        // the reel has been stopped.
        var deltaY = currentStop.y - this.winnerLineY + currentStop.height / 2;
        for (var i = 0; i < this.stopNodes.length; i++) {
            var newStop = this.stopNodes[i];
            newStop.y = newStop.y - deltaY;
        }
    },
    spin: function spin() {
        //start the reel spinning

        /////////////////////////////////////
        //TODO: it depends of the numeber of reel stops
        var min = 1;
        var max = 2;
        /////////////////////////////////////
        this.rollingCount = 0;
        this.stopAfterRollingCount = Math.floor(Math.random() * (max - min + 1)) + min;
        //PRNG
        //gets random value with PRNG class between a min and max value
        var randomValue = PRNG.newValue(this.prngMinRange, this.prngMaxRange);
        //normalize with the number of stops
        this.winnerIndex = randomValue % this.stops.length;

        this.isRollingCompleted = false;
        //console.log (this.stopAfterRollingCount + "-" + this.winnerIndex);
    },
    getWinnerStop: function getWinnerStop() {
        //returns the reel winnre index
        return this.stopNodes[this.winnerIndex];
    }
});

cc._RFpop();
},{"prng":"prng"}],"stop-tags":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b1f8fcCyUlAQYXKla3YDX5/', 'stop-tags');
// scripts/controllers/stop-tags.js

//defines the stop tags
function StopTags() {
    return {
        BANANA: 1,
        BEGAMOT: 2,
        BONUS: 3,
        COCKTAIL: 4,
        COCODRILE: 5,
        KAKADU: 6,
        LION: 7,
        MAN: 8,
        MONKEY: 9
    };
}

module.exports = StopTags;

cc._RFpop();
},{}],"stop":[function(require,module,exports){
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
},{}],"user-default-keys":[function(require,module,exports){
"use strict";
cc._RFpush(module, '246ab4anldKkYCjr7FirIEK', 'user-default-keys');
// scripts/controllers/user-default-keys.js

function UserDefaultKeys() {
  return {
    CURRENT_CREDIT: "Current_Credit"
  };
}

module.exports = UserDefaultKeys;

cc._RFpop();
},{}],"user-default":[function(require,module,exports){
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
},{"user-default-keys":"user-default-keys"}]},{},["game","user-default-keys","reel","paytable-definition","on-off-button","stop","paytable","user-default","audio-manager","stop-tags","paytable-tags","prng"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvYXVkaW8tbWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL2dhbWUuanMiLCJhc3NldHMvc2NyaXB0cy91aS9vbi1vZmYtYnV0dG9uLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvcGF5dGFibGUtZGVmaW5pdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL3BheXRhYmxlLXRhZ3MuanMiLCJhc3NldHMvc2NyaXB0cy9jb250cm9sbGVycy9wYXl0YWJsZS5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL3BybmcuanMiLCJhc3NldHMvc2NyaXB0cy9jb250cm9sbGVycy9yZWVsLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvc3RvcC10YWdzLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvc3RvcC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL3VzZXItZGVmYXVsdC1rZXlzLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvdXNlci1kZWZhdWx0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9TQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYTdkYmZLaCs1SkswNHI5YkxSU29QYTInLCAnYXVkaW8tbWFuYWdlcicpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9hdWRpby1tYW5hZ2VyLmpzXG5cbi8vL2RlaWZuZXMgYW4gaGVscGVyIChzaW5nbGV0b24pIGNsYXNzIHRvIHBsYXkgYXVzaW8gYXNzZXRzXG52YXIgQXVkaW9NYW5hZ2VyID0gY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vUFVCTElDIFBST1BFUlRJRVNcbiAgICAgICAgLy90aGUgcHJvcGVydGllcyBiZWxvdyBkZWZpbmUgYWxsIHRoZSBhdWRpbyBjbGlwcyB0aGF0IHRoZSBjbGFzcyBjYW4gcGxheVxuICAgICAgICBjb2luc1dpbjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBjb2luc0luc2VydDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBqYWNrcG90V2luOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIGxpbmVXaW46IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgcmVlbFN0YXJ0OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIHJlZWxSb2xsOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIHJlZWxTdG9wOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIGdhbWVPdmVyOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vZGVmaW5lcyB0aGUgc3RhdGljIChzaW5nbGV0b24pIGluc3RhbmNlXG4gICAgc3RhdGljczoge1xuICAgICAgICBpbnN0YW5jZTogbnVsbFxuICAgIH0sXG5cbiAgICBwbGF5Q29pbnNXaW46IGZ1bmN0aW9uIHBsYXlDb2luc1dpbigpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKHRoaXMuY29pbnNXaW4sIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlDb2luc0luc2VydDogZnVuY3Rpb24gcGxheUNvaW5zSW5zZXJ0KCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuY29pbnNJbnNlcnQsIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlKYWNrcG90V2luOiBmdW5jdGlvbiBwbGF5SmFja3BvdFdpbigpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmphY2twb3RXaW4sIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlMaW5lV2luOiBmdW5jdGlvbiBwbGF5TGluZVdpbigpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmxpbmVXaW4sIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlSZWVsU3RhcnQ6IGZ1bmN0aW9uIHBsYXlSZWVsU3RhcnQoKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5yZWVsU3RhcnQsIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlSZWVsUm9sbDogZnVuY3Rpb24gcGxheVJlZWxSb2xsKCkge1xuICAgICAgICB0aGlzLnBsYXlTb3VuZCh0aGlzLnJlZWxSb2xsKTtcbiAgICB9LFxuICAgIHBsYXlSZWVsU3RvcDogZnVuY3Rpb24gcGxheVJlZWxTdG9wKCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMucmVlbFN0b3AsIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlHYW1lT3ZlcjogZnVuY3Rpb24gcGxheUdhbWVPdmVyKCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuZ2FtZU92ZXIsIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlTb3VuZDogZnVuY3Rpb24gcGxheVNvdW5kKGF1ZGlvQ2xpcCkge1xuICAgICAgICAvL2F1ZGlvIHBsYXlcbiAgICAgICAgaWYgKCFhdWRpb0NsaXApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWMoYXVkaW9DbGlwLCBmYWxzZSk7XG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy9pbml0IHRoZSBzaW5nbGV0b24gaW5zdGFuY2VcbiAgICAgICAgQXVkaW9NYW5hZ2VyLmluc3RhbmNlID0gdGhpcztcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTdhMTA3aE9BMURqSmRHTkRta0JkM3knLCAnZ2FtZScpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9nYW1lLmpzXG5cbi8vZGVmaW5lcyB0aGUgbWFpbiBkcml2ZXIgb2YgdGhlIGdhbWVcbnZhciBSZWVsID0gcmVxdWlyZSgncmVlbCcpLFxuICAgIE9uT2ZmQnV0dG9uID0gcmVxdWlyZSgnb24tb2ZmLWJ1dHRvbicpLFxuICAgIEF1ZGlvTWFuYWdlciA9IHJlcXVpcmUoJ2F1ZGlvLW1hbmFnZXInKSxcbiAgICBVc2VyRGVmYXVsdCA9IHJlcXVpcmUoJ3VzZXItZGVmYXVsdCcpLFxuICAgIFBheVRhYmxlVGFncyA9IHJlcXVpcmUoJ3BheXRhYmxlLXRhZ3MnKSgpO1xuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy9QVUJMSUMgUFJPUEVSVElFU1xuICAgICAgICAvL2dldHMvc2V0cyBhbiBhcnJheSBvZiBSZWVsIHR5cGUgKHNlZSByZWVsLmpzIGFzc2V0KSB1c2VkIHRvIGRlZmluZSB0aGUgc2xvdCByZWVsc1xuICAgICAgICByZWVsczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFtSZWVsXVxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgaW5pdGlhbCBjcmVkaXQuXG4gICAgICAgIGN1cnJlbnRDcmVkaXQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMTAwLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgYW1vdW50IG9mIHRoZSBcIm9uZSBiZXRcIiBtb2RlXG4gICAgICAgIGJldE9uZVZhbHVlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDEsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBhbW91bnQgb2YgdGhlIFwibWF4IGJldFwiIG1vZGVcbiAgICAgICAgYmV0TWF4VmFsdWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogNSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIE9uT2ZmIHNwaW4gYnV0dG9uXG4gICAgICAgIHNwaW5CdXR0b246IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IE9uT2ZmQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBPbk9mZiBhdXRvLXNwaW4gYnV0dG9uXG4gICAgICAgIGF1dG9TcGluQnV0dG9uOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBPbk9mZkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgT25PZmYgYmV0IG9uZSBidXR0b25cbiAgICAgICAgYmV0T25lQnV0dG9uOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBPbk9mZkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgT25PZmYgYmV0IG1heCBidXR0b25cbiAgICAgICAgYmV0TWF4QnV0dG9uOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBPbk9mZkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0b3RhbCBiZXQgbGFiZWxcbiAgICAgICAgdG90YWxCZXRMYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgY3JlZGl0IGxhYmVsXG4gICAgICAgIGNyZWRpdExhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyBpbmZvIGxhYmVsXG4gICAgICAgIGJldEluZm9MYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgaG93IG1hbnkgcmVlbHMgaGF2ZSBiZWVuIGNvbXBsZXRlZCB0aGUgcm9sbCBvcGVyYXRpb25cbiAgICAgICAgcm9sbGluZ0NvbXBsZXRlZENvdW50OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGZsYWcgdGhhdCBhbGxvd3MgdG8gdW5kZXJzYXRuZCBpZiBhbGwgdGhlIHJlZWxzIGhhdmUgYmVlbiBjb21wbGV0ZWQgaXRzIHJvbGxpbmcgb3BlcmF0aW9uXG4gICAgICAgIGlzUm9sbGluZ0NvbXBsZXRlZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIHRvdGFsIGJldCB2YWx1ZVxuICAgICAgICB0b3RhbEJldFZhbHVlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGN1cnJlbnQgYmV0IHZhbHVlIChiZXQgb25lIG9yIGJldCBtYXgpXG4gICAgICAgIGN1cnJlbnRCZXRWYWx1ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBjdXJyZW50IHBheXRhYmxlIHRhZyAoc2VlIHBheXRhYmxlLXRhZ3MuanMgYXNzZXQpXG4gICAgICAgIGN1cnJlbnRQYXlUYWJsZVRhZzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cyBzZXQgdGhlIGF1dG8tc3BpbiBmbGFnXG4gICAgICAgIGlzQXV0b1NwaW46IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogZmFsc2UsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgdGltZXIgaW5zdGFuY2UgdXNlZCBmb3IgdGhlIGF1dG8vc3BpbiAgdGltZW91dFxuICAgICAgICBhdXRvU3BpblRpbWVyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAvL3NldHMgdGhlIGF2YWlsYWJsZSBjcmVkaXQuXG4gICAgICAgIHRoaXMuY3JlZGl0TGFiZWwuc3RyaW5nID0gdGhpcy5jdXJyZW50Q3JlZGl0LnRvU3RyaW5nKCk7XG4gICAgICAgIC8vaW5pdCBiZXQgaW5mbyBsYWJlbFxuICAgICAgICB0aGlzLmJldEluZm9MYWJlbC5zdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIC8vaW1wbGVtZW50cyB0aGUgc3BpbiBidXR0b24gb24vb2ZmIGV2ZW50XG4gICAgICAgIHRoaXMuc3BpbkJ1dHRvbi5ub2RlLm9uKCdyZWVsLXNwaW4nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5kZXRhaWwuaXNPbikge1xuICAgICAgICAgICAgICAgIC8vcGxheSB0aGUgZ2FtZVxuICAgICAgICAgICAgICAgIHRoYXQuc3BpbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy9pbXBsZW1lbnRzIHRoZSBhdXRvLXNwaW4gYnV0dG9uIG9uL29mZiBldmVudFxuICAgICAgICB0aGlzLmF1dG9TcGluQnV0dG9uLm5vZGUub24oJ3JlZWwtYXV0by1zcGluJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAvL3BsYXkgdGhlIGdhbWUgYXMgc2luZ2xlIHNwaW4gb3IgYXV0by1zcGluXG4gICAgICAgICAgICB0aGF0LmlzQXV0b1NwaW4gPT09IHRydWUgPyB0aGF0LmlzQXV0b1NwaW4gPSBmYWxzZSA6IHRoYXQuaXNBdXRvU3BpbiA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhhdC5pc0F1dG9TcGluKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmRldGFpbC5pc09uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc3BpbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoYXQuYXV0b1NwaW5UaW1lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvL2ltcGxlbWVudHMgdGhlIGJldCBvbmUgYnV0dG9uIG9uL29mZiBldmVudFxuICAgICAgICB0aGlzLmJldE9uZUJ1dHRvbi5ub2RlLm9uKCdiZXQtb25lJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLmlzT24pIHtcbiAgICAgICAgICAgICAgICAvL3doZW4gdGhpcyBidXR0b24gaXMgcHVzaGVkIGRvd24gdGhlIGJldCBtYXggYnV0dG9uIHdpbGwgYmUgcmVzZXRcbiAgICAgICAgICAgICAgICB0aGF0LmJldE1heEJ1dHRvbi5yZXNldCgpO1xuICAgICAgICAgICAgICAgIC8vc2V0IGJldCB2YWx1ZVxuICAgICAgICAgICAgICAgIHRoYXQuY3VycmVudEJldFZhbHVlID0gdGhhdC5iZXRPbmVWYWx1ZTtcbiAgICAgICAgICAgICAgICB0aGF0LmN1cnJlbnRQYXlUYWJsZVRhZyA9IFBheVRhYmxlVGFncy5CRVRfT05FO1xuICAgICAgICAgICAgICAgIHRoYXQuYmV0SW5mb0xhYmVsLnN0cmluZyA9IHRoYXQuY3VycmVudEJldFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnBsYXlDb2luc0luc2VydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy9pbXBsZW1lbnRzIHRoZSBiZXQtbWF4IGJ1dHRvbiBvbi9vZmYgZXZlbnRcbiAgICAgICAgdGhpcy5iZXRNYXhCdXR0b24ubm9kZS5vbignYmV0LW1heCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmRldGFpbC5pc09uKSB7XG4gICAgICAgICAgICAgICAgLy93aGVuIHRoaXMgYnV0dG9uIGlzIHB1c2hlZCBkb3duIHRoZSBiZXQgb25lIGJ1dHRvbiB3aWxsIGJlIHJlc2V0XG4gICAgICAgICAgICAgICAgdGhhdC5iZXRPbmVCdXR0b24ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAvL3NldCBiZXQgdmFsdWVcbiAgICAgICAgICAgICAgICB0aGF0LmN1cnJlbnRCZXRWYWx1ZSA9IHRoYXQuYmV0TWF4VmFsdWU7XG4gICAgICAgICAgICAgICAgdGhhdC5jdXJyZW50UGF5VGFibGVUYWcgPSBQYXlUYWJsZVRhZ3MuQkVUX01BWDtcbiAgICAgICAgICAgICAgICB0aGF0LmJldEluZm9MYWJlbC5zdHJpbmcgPSB0aGF0LmN1cnJlbnRCZXRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5pbnN0YW5jZS5wbGF5Q29pbnNJbnNlcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vaW1wbGVtZW50cyB0aGUgcm9sbGluZyBjb21wbGV0ZWQgZXZlbnQgb2YgdGhlIHJlbGwuanMgY2xhc3NcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdyb2xsaW5nLWNvbXBsZXRlZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy90aGlzIG1ldGhvZCBjb3VudHMgYWxsIHRoZSBjb21wbGV0ZWQgcm9sbGluZyByZWVscyBhbmQgZXZhbHVhdGUgdGhlIHJlc3VsdHNcbiAgICAgICAgICAgIC8vaWYgYWxsIHRoZSByZWxscyBoYXZlIGJlZW4gZmluaXNoZWQgdG8gcm9sbC5cbiAgICAgICAgICAgIHRoYXQucm9sbGluZ0NvbXBsZXRlZENvdW50Kys7XG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuaW5zdGFuY2UucGxheVJlZWxTdG9wKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGF0LnJvbGxpbmdDb21wbGV0ZWRDb3VudCA9PSB0aGF0LnJlZWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoYXQucm9sbGluZ0NvbXBsZXRlZENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAvL2dldHMgdGhlIGxpbmUgc3ltYm9scyB0YWdzXG4gICAgICAgICAgICAgICAgdmFyIGxpbmVTeW1ib2xzVGFncyA9IFtdO1xuICAgICAgICAgICAgICAgIGxpbmVTeW1ib2xzVGFncyA9IHRoYXQuZ2V0TGluZVN5bWJvbHNUYWcoKTtcblxuICAgICAgICAgICAgICAgIC8vY3JlYXRlIGEgcGF5dGFibGUgaW5zdGFuY2UgYW5kIGNoZWNrcyBpZiB0aGUgdGFnIHN5bWJvbHMgaXMgYSB3aW5uaW5nIGNvbWJpbmF0aW9uXG4gICAgICAgICAgICAgICAgdmFyIHBheXRhYmxlID0gdGhhdC5nZXRDb21wb25lbnQoXCJwYXl0YWJsZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcGF5dGFibGVSZXQgPSBwYXl0YWJsZS5pc1dpbm5pbmcobGluZVN5bWJvbHNUYWdzLCB0aGF0LmN1cnJlbnRQYXlUYWJsZVRhZyksXG4gICAgICAgICAgICAgICAgICAgIGlzV2lubmluZyA9IE9iamVjdC5rZXlzKHBheXRhYmxlUmV0KS5sZW5ndGggPiAwO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzV2lubmluZykge1xuICAgICAgICAgICAgICAgICAgICAvL1dPTiEhIVxuICAgICAgICAgICAgICAgICAgICAvL2lmIHdvbiBzcGluIGFuZCBhdXRvLXNwaW4gd2lsbCBzdG9wIHRoZSBleGVjdXRpb25cbiAgICAgICAgICAgICAgICAgICAgdGhhdC5pc1JvbGxpbmdDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmlzQXV0b1NwaW4gPyB0aGF0LmF1dG9TcGluQnV0dG9uLnJlc2V0KCkgOiB0aGF0LnNwaW5CdXR0b24ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5pc0F1dG9TcGluID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIC8vcGxheSBzb3VuZFxuICAgICAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIuaW5zdGFuY2UucGxheUxpbmVXaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnBsYXlDb2luc1dpbigpO1xuICAgICAgICAgICAgICAgICAgICAvL3Nob3cgd2lubmluZyBzeW1ib2xzIChhbmltYXRpb24pXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2hvd1dpbm5pbmdTeW1ib2xzQW5kUGF5KHBheXRhYmxlUmV0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL0xPU1QgdXBkYXRlIGNyZWRpdFxuICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZUN1cnJlbkNyZWRpdCh0aGF0LmN1cnJlbnRDcmVkaXQgLSB0aGF0LmN1cnJlbnRCZXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuYmV0SW5mb0xhYmVsLnN0cmluZyA9ICgtdGhhdC5jdXJyZW50QmV0VmFsdWUpLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LmlzQXV0b1NwaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc3BpbiBjb21wbGV0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuaXNSb2xsaW5nQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc3BpbkJ1dHRvbi5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5hdXRvU3BpblRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hdXRvLXNwaW4gY29tcGxldGVkLi4ud2lsbCByZXN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zcGluKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhhdC5pc1JvbGxpbmdDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy91bmxvY2tzIGFsbCBidXR0b25zXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0QnV0dG9uc0xvY2tlZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlIHVzZXIgZGVmYXVsdCBjdXJyZW50IGNyZWRpdFxuICAgICAgICAgICAgICAgICAgICBVc2VyRGVmYXVsdC5pbnN0YW5jZS5zZXRDdXJyZW50Q3JlZGl0KHRoYXQuY3VycmVudENyZWRpdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgLy9yZWFkIGFsbCB0aGUgdXNlciBkZWZhdWx0XG4gICAgICAgIHRoaXMubG9hZFVzZXJEZWZhdWx0KCk7XG4gICAgfSxcbiAgICBsb2FkVXNlckRlZmF1bHQ6IGZ1bmN0aW9uIGxvYWRVc2VyRGVmYXVsdCgpIHtcbiAgICAgICAgLy9jdXJyZW50IGNyZWRpdFxuICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbkNyZWRpdChVc2VyRGVmYXVsdC5pbnN0YW5jZS5nZXRDdXJyZW50Q3JlZGl0KHRoaXMuY3VycmVudENyZWRpdCkpO1xuICAgIH0sXG4gICAgc3BpbjogZnVuY3Rpb24gc3BpbigpIHtcblxuICAgICAgICAvL2NoZWNrcyBpZiB0aGVyZSBpcyBlbm91Z2ggY3JlZGl0IHRvIHBsYXlcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENyZWRpdCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vcmVzZXQgbGFiZWwgaW5mbyB3aXRoIGN1cnJlbnQgYmV0IHZhbHVlXG4gICAgICAgIHRoaXMuYmV0SW5mb0xhYmVsLnN0cmluZyA9IHRoaXMuY3VycmVudEJldFZhbHVlLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNSb2xsaW5nQ29tcGxldGVkKSB7XG4gICAgICAgICAgICAvL3NldHMgdG90YWwgYmV0IExhYmVsXG4gICAgICAgICAgICB0aGlzLnRvdGFsQmV0VmFsdWUgKz0gdGhpcy5jdXJyZW50QmV0VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnRvdGFsQmV0TGFiZWwuc3RyaW5nID0gdGhpcy50b3RhbEJldFZhbHVlLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5pc0F1dG9TcGluKSB7XG4gICAgICAgICAgICAgICAgLy90aGlzLnNwaW5CdXR0b24uaXNMb2NrZWQ9dHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUm9sbGluZ0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9sb2NrcyBhbGwgYnV0dG9uc1xuICAgICAgICAgICAgdGhpcy5zZXRCdXR0b25zTG9ja2VkKHRydWUpO1xuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnBsYXlSZWVsUm9sbCgpO1xuICAgICAgICAgICAgLy9zdGFydHMgcmVlbHMgc3BpblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWVsc1tpXS5zcGluKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldEJ1dHRvbnNMb2NrZWQ6IGZ1bmN0aW9uIHNldEJ1dHRvbnNMb2NrZWQoaXNMb2NrZWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQXV0b1NwaW4pIHtcbiAgICAgICAgICAgIHRoaXMuYXV0b1NwaW5CdXR0b24uaXNMb2NrZWQgPSBpc0xvY2tlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3BpbkJ1dHRvbi5pc0xvY2tlZCA9IGlzTG9ja2VkO1xuICAgICAgICB0aGlzLmJldE9uZUJ1dHRvbi5pc0xvY2tlZCA9IGlzTG9ja2VkO1xuICAgICAgICB0aGlzLmJldE1heEJ1dHRvbi5pc0xvY2tlZCA9IGlzTG9ja2VkO1xuICAgIH0sXG4gICAgZ2V0TGluZVN5bWJvbHNUYWc6IGZ1bmN0aW9uIGdldExpbmVTeW1ib2xzVGFnKCkge1xuICAgICAgICB2YXIgbGluZVN5bWJvbHNUYWdzID0gW107XG4gICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgdGhpcy5yZWVscy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgdmFyIHN0b3BOb2RlID0gdGhpcy5yZWVsc1ttXS5nZXRXaW5uZXJTdG9wKCk7XG4gICAgICAgICAgICB2YXIgc3RvcENvbXBvbmVudCA9IHN0b3BOb2RlLmdldENvbXBvbmVudChcInN0b3BcIik7XG4gICAgICAgICAgICBsaW5lU3ltYm9sc1RhZ3MucHVzaChzdG9wQ29tcG9uZW50LnRhZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmVTeW1ib2xzVGFncztcbiAgICB9LFxuICAgIHNob3dXaW5uaW5nU3ltYm9sc0FuZFBheTogZnVuY3Rpb24gc2hvd1dpbm5pbmdTeW1ib2xzQW5kUGF5KHBheXRhYmxlUmV0KSB7XG5cbiAgICAgICAgdmFyIHN0b3BOb2RlLFxuICAgICAgICAgICAgc3RvcENvbXBvbmVudCxcbiAgICAgICAgICAgIHdpbm5pbmdBbW91bnQgPSAwO1xuXG4gICAgICAgIC8vbG9vcCBvbiAgdGhlIHdpbm5pbmcgY29tYmluYXRpb25zIHRocm91Z2hvdXQgdGhlIHN5bWJvbHMgaW5kZXhcbiAgICAgICAgLy9ub3RlIHRoYXQgaXQncyBwb3NzaWJsZSB0byBoYXZlIG9uZSBvciBtb3JlIHdpbm5pbmcgY29tYmluYWl0b25cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXl0YWJsZVJldC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBwYXl0YWJsZVJldFtpXTtcbiAgICAgICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgaXRlbS5pbmRleGVzLmxlbmd0aDsgbisrKSB7XG4gICAgICAgICAgICAgICAgc3RvcE5vZGUgPSB0aGlzLnJlZWxzW2l0ZW0uaW5kZXhlc1tuXV0uZ2V0V2lubmVyU3RvcCgpO1xuICAgICAgICAgICAgICAgIHN0b3BDb21wb25lbnQgPSBzdG9wTm9kZS5nZXRDb21wb25lbnQoXCJzdG9wXCIpO1xuICAgICAgICAgICAgICAgIHN0b3BDb21wb25lbnQuYmxpbmsoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbm5pbmdBbW91bnQgKz0gcGFyc2VJbnQoaXRlbS53aW5uaW5nVmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9QQVkgdXBkYXRlIGNyZWRpdFxuICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbkNyZWRpdCh0aGlzLmN1cnJlbnRDcmVkaXQgKyB3aW5uaW5nQW1vdW50KTtcbiAgICAgICAgdGhpcy5iZXRJbmZvTGFiZWwuc3RyaW5nID0gd2lubmluZ0Ftb3VudC50b1N0cmluZygpO1xuICAgIH0sXG4gICAgdXBkYXRlQ3VycmVuQ3JlZGl0OiBmdW5jdGlvbiB1cGRhdGVDdXJyZW5DcmVkaXQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50Q3JlZGl0ID0gdmFsdWU7XG4gICAgICAgIHRoaXMuY3JlZGl0TGFiZWwuc3RyaW5nID0gdGhpcy5jdXJyZW50Q3JlZGl0LnRvU3RyaW5nKCk7XG4gICAgICAgIGlmIChwYXJzZUludCh0aGlzLmN1cnJlbnRDcmVkaXQpIDw9IDApIHtcbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5pbnN0YW5jZS5wbGF5R2FtZU92ZXIoKTtcbiAgICAgICAgICAgIC8vVE9ETyByZXNldCBjcmVkaXQgYXV0b21hdGljYWxseVxuICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW5DcmVkaXQoMTAwKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc1MzU3YkY5eTdwRGpvWCtmbVhybldZMycsICdvbi1vZmYtYnV0dG9uJyk7XG4vLyBzY3JpcHRzL3VpL29uLW9mZi1idXR0b24uanNcblxuLy9kZWZpbmVzIGEgY2xhc3MgdG8gaW1wbGVtZW50IGFuIE9uL09mZiBidXR0b25cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvL1BVQkxJQyBQUk9QRVJUSUVTXG4gICAgICAgIC8vL2dldHMvc2V0cyB0aGUgZXZlbnQgbmFtZSB0aGF0IHdpbGwgYmUgcmFpc2VkIHduZWggdGhlIGJ1dHRvbiBpcyB0b3VjaGVkXG4gICAgICAgIG1vdXNlRG93bk5hbWU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIm9uLW9mZi1tb3VzZWRvd25cIlxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgc3ByaXRlIGJ1dHRvblxuICAgICAgICBzcHJpdGU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSB0ZXh0dXJlIHVybCBmb3IgdGhlIG9uIHN0YXR1c1xuICAgICAgICBzcHJpdGVUZXh0dXJlRG93blVybDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCIsXG4gICAgICAgICAgICB1cmw6IGNjLlRleHR1cmUyRFxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgb24gc3RhdHVzXG4gICAgICAgIGlzT246IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAvL1BSSVZBVEUgUFJPUEVSVElFU1xuICAgICAgICAvL2dldHMvc2V0cyB0aGUgdGV4dHVyZSBmb3IgdGhlIG9mZiBzdGF0dXNcbiAgICAgICAgc3ByaXRlVGV4dHVyZVVwOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIixcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdXJsOiBjYy5UZXh0dXJlMkRcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGNhY2hlZCB0ZXh0dXJlIGZvciB0aGUgb2ZmIHN0YXR1c1xuICAgICAgICBzcHJpdGVUZXh0dXJlRG93bjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCIsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHVybDogY2MuVGV4dHVyZTJEXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBsb2NrZWQgc3RhdHVzLiBJZiBpdHMgdmFsdWUgaXMgdHJ1ZSBubyBhY3Rpb25zIHdpbGwgYmUgcGVyZm9ybWVkIG9uIHRoZSB0b3VjaCBldmVudFxuICAgICAgICBpc0xvY2tlZDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IGZhbHNlLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAvL3NldHMgdGhlIHRleHR1cmUgZm9yIG9uL29mZlxuICAgICAgICB0aGlzLnNwcml0ZVRleHR1cmVVcCA9IHRoaXMuc3ByaXRlLl9zcHJpdGVGcmFtZS5fdGV4dHVyZTtcbiAgICAgICAgdGhpcy5zcHJpdGVUZXh0dXJlRG93biA9IGNjLnRleHR1cmVDYWNoZS5hZGRJbWFnZSh0aGlzLnNwcml0ZVRleHR1cmVEb3duVXJsKTtcblxuICAgICAgICAvL2RlZmluZXMgYW5kIHNldHMgdGhlIHRvdWNoIGZ1bmN0aW9uIGNhbGxiYWNrc1xuICAgICAgICBmdW5jdGlvbiBvblRvdWNoRG93bihldmVudCkge1xuICAgICAgICAgICAgdGhhdC5vbk9mZigpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9uVG91Y2hVcChldmVudCkge1xuICAgICAgICAgICAgLy9ETyBOT1RISU5HXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaERvd24sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hlbmQnLCBvblRvdWNoVXAsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hjYW5jZWwnLCBvblRvdWNoVXAsIHRoaXMubm9kZSk7XG4gICAgfSxcbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzT24pIHtcbiAgICAgICAgICAgIC8vaWYgd2Ugd2FudCB0byBhY3RpdmF0ZSB0aGUgYnV0dG9uIG9uIHRoZSBzdGFydC11cFxuICAgICAgICAgICAgLy93ZSBuZWVkIHRvIGludmVydCB0aGUgaW5pdGlhbCBzdGF0dXMoZmxhZyk6IHNlZSBvbk9mZiBmdW5jdGlvblxuICAgICAgICAgICAgdGhpcy5pc09uID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm9uT2ZmKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uT2ZmOiBmdW5jdGlvbiBvbk9mZigpIHtcbiAgICAgICAgLy91cGRhdGVzIHRoZSB0ZXh0dXJlIGZvciB0aGUgb24vb2ZmIHN0YXR1c1xuICAgICAgICBpZiAodGhpcy5pc0xvY2tlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNPbikge1xuICAgICAgICAgICAgLy9zZXQgdG8gb2ZmXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNwcml0ZUZyYW1lKHRoaXMuc3ByaXRlLCB0aGlzLnNwcml0ZVRleHR1cmVVcCk7XG4gICAgICAgICAgICB0aGlzLmlzT24gPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vc2V0IHRvIG9uXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNwcml0ZUZyYW1lKHRoaXMuc3ByaXRlLCB0aGlzLnNwcml0ZVRleHR1cmVEb3duKTtcbiAgICAgICAgICAgIHRoaXMuaXNPbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy9lbWl0cyB0aGUgZXZlbnRcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQodGhpcy5tb3VzZURvd25OYW1lLCB7XG4gICAgICAgICAgICBpc09uOiB0aGlzLmlzT25cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIC8vcmVzZXRzIHRoZSBidXR0b24gd2l0aCB0aGUgb2ZmIHN0YXR1c1xuICAgICAgICB0aGlzLmlzT24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0xvY2tlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZVNwcml0ZUZyYW1lKHRoaXMuc3ByaXRlLCB0aGlzLnNwcml0ZVRleHR1cmVVcCk7XG4gICAgfSxcbiAgICB1cGRhdGVTcHJpdGVGcmFtZTogZnVuY3Rpb24gdXBkYXRlU3ByaXRlRnJhbWUoc3ByaXRlLCB0ZXh0dXJlKSB7XG4gICAgICAgIC8vdXBkYXRlcyB0aGUgc3ByaXRlIHRleHR1cmVcbiAgICAgICAgaWYgKCFzcHJpdGUgfHwgIXRleHR1cmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdyA9IHNwcml0ZS5ub2RlLndpZHRoLFxuICAgICAgICAgICAgaCA9IHNwcml0ZS5ub2RlLmhlaWdodCxcbiAgICAgICAgICAgIGZyYW1lID0gbmV3IGNjLlNwcml0ZUZyYW1lKHRleHR1cmUsIGNjLnJlY3QoMCwgMCwgdywgaCkpO1xuICAgICAgICBzcHJpdGUuc3ByaXRlRnJhbWUgPSBmcmFtZTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNGI5NGJXZXIySkxyN0RBNFNtV1gyTkEnLCAncGF5dGFibGUtZGVmaW5pdGlvbicpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9wYXl0YWJsZS1kZWZpbml0aW9uLmpzXG5cbi8vZGVmaW5lcyB0aGUgcGF5dGFibGVzXG5cbi8qXG5QQVkgVEFCTEUgQkVUIE1BWFxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblNZTUJPTFx0XHRUT1RBTCBTWU1CT0xTXHRcdFx0NS9SIFx0XHRcdDMvUiBcdFx0XHQyL1Jcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5CT05VU1x0XHRcdDVcdFx0XHRcdFx0MjAwMFx0XHRcdDEwMDBcdFx0XHQ4MDBcbkJBTkFOQVx0XHRcdDE3XHRcdFx0XHRcdDMwMFx0XHRcdFx0MjAwIFx0XHRcdDEwMFxuQkVHQU1PVFx0XHRcdDE5XHRcdFx0XHRcdDIwMCBcdFx0XHQxMDAgXHRcdFx0NTBcbkNPQ09EUklMRVx0XHQxOSBcdFx0XHRcdFx0MjAwIFx0XHRcdDEwMCBcdFx0XHQ1MFxuQ09DS1RBSUxcdFx0MTkgXHRcdFx0XHRcdDIwMCBcdFx0XHQxMDAgXHRcdFx0LS1cbktBS0FEVVx0XHRcdDIwIFx0XHRcdFx0XHQxMDAgXHRcdFx0NzVcdFx0XHRcdC0tXG5NQU5cdFx0XHRcdDIwIFx0XHRcdFx0XHQxMDAgXHRcdFx0NzVcdFx0XHRcdC0tXG5NT05LRVlcdFx0XHQyMCBcdFx0XHRcdFx0MTAwIFx0XHRcdDc1XHRcdFx0XHQtLVxuTElPTlx0XHRcdDIxXHRcdFx0XHRcdDUwXHRcdFx0XHQyNVx0XHRcdFx0LS1cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblBBWSBUQUJMRSBCRVQgT05FXG5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5TWU1CT0xcdFx0VE9UQUwgU1lNQk9MU1x0XHRcdDUvUiBcdFx0XHQzL1IgXHRcdFx0Mi9SXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQk9OVVNcdFx0XHQ1XHRcdFx0XHRcdDIwMCBcdFx0XHQxMDAgXHRcdFx0NTBcbkJBTkFOQVx0XHRcdDE3XHRcdFx0XHRcdDEwMFx0XHRcdFx0MjAgIFx0XHRcdDEwXG5CRUdBTU9UXHRcdFx0MTlcdFx0XHRcdFx0NTAgIFx0XHRcdDEwICBcdFx0XHQ1XG5DT0NPRFJJTEVcdFx0MTkgXHRcdFx0XHRcdDUwICBcdFx0XHQxMCAgXHRcdFx0NVxuQ09DS1RBSUxcdFx0MTkgXHRcdFx0XHRcdDIwICBcdFx0XHQxMCAgXHRcdFx0MlxuS0FLQURVXHRcdFx0MjAgXHRcdFx0XHRcdDEwICBcdFx0XHQ1XHRcdFx0XHQyXG5NQU5cdFx0XHRcdDIwIFx0XHRcdFx0XHQxMCAgXHRcdFx0NVx0XHRcdFx0MlxuTU9OS0VZXHRcdFx0MjAgXHRcdFx0XHRcdDEwICBcdFx0XHQ1XHRcdFx0XHQxXG5MSU9OXHRcdFx0MjFcdFx0XHRcdFx0NVx0XHRcdFx0Mlx0XHRcdFx0MVxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuKi9cbi8qXG5wYXl0YWJsZSBvYmplY3Qgc3RydWN0dXJlXG4gICAge1xuICAgICAgICBzdG9wVGFnOlNUT1BfVEFHLFxuICAgICAgICA1OlZBTFVFLFxuICAgICAgICAzOlZBTFVFLFxuICAgICAgICAyOlZBTFVFXG4gICAgfVxuKi9cbnZhciBTdG9wVGFncyA9IHJlcXVpcmUoJ3N0b3AtdGFncycpKCksXG4gICAgUGF5VGFibGVUYWdzID0gcmVxdWlyZSgncGF5dGFibGUtdGFncycpKCk7XG52YXIgcGF5dGFibGVCZXRNYXggPSBbe1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkJPTlVTLFxuICAgIDU6IDIwMDAsXG4gICAgMzogMTAwMCxcbiAgICAyOiA4MDBcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5CQU5BTkEsXG4gICAgNTogMzAwLFxuICAgIDM6IDIwMCxcbiAgICAyOiAxMDBcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5CRUdBTU9ULFxuICAgIDU6IDIwMCxcbiAgICAzOiAxMDAsXG4gICAgMjogNTBcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5DT0NPRFJJTEUsXG4gICAgNTogMjAwLFxuICAgIDM6IDEwMCxcbiAgICAyOiA1MFxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkNPQ0tUQUlMLFxuICAgIDU6IDIwMCxcbiAgICAzOiAxMDAsXG4gICAgMjogNVxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLktBS0FEVSxcbiAgICA1OiAxMDAsXG4gICAgMzogNzUsXG4gICAgMjogNVxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLk1BTixcbiAgICA1OiAxMDAsXG4gICAgMzogNzUsXG4gICAgMjogNVxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLk1PTktFWSxcbiAgICA1OiAxMDAsXG4gICAgMzogNzUsXG4gICAgMjogMlxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkxJT04sXG4gICAgNTogNTAsXG4gICAgMzogMjUsXG4gICAgMjogMlxufV07XG52YXIgcGF5dGFibGVCZXRPbmUgPSBbe1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkJPTlVTLFxuICAgIDU6IDIwMCxcbiAgICAzOiAxMDAsXG4gICAgMjogNTBcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5CQU5BTkEsXG4gICAgNTogMTAwLFxuICAgIDM6IDIwLFxuICAgIDI6IDEwXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuQkVHQU1PVCxcbiAgICA1OiA1MCxcbiAgICAzOiAxMCxcbiAgICAyOiA1XG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuQ09DT0RSSUxFLFxuICAgIDU6IDUwLFxuICAgIDM6IDEwLFxuICAgIDI6IDVcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5DT0NLVEFJTCxcbiAgICA1OiAyMCxcbiAgICAzOiAxMCxcbiAgICAyOiAyXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuS0FLQURVLFxuICAgIDU6IDEwLFxuICAgIDM6IDUsXG4gICAgMjogMlxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLk1BTixcbiAgICA1OiAxMCxcbiAgICAzOiA1LFxuICAgIDI6IDJcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5NT05LRVksXG4gICAgNTogMTAsXG4gICAgMzogNSxcbiAgICAyOiAxXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuTElPTixcbiAgICA1OiA1LFxuICAgIDM6IDIsXG4gICAgMjogMVxufV07XG5cbnZhciBQYXlUYWJsZURlZmluaXRpb24gPSBmdW5jdGlvbiBQYXlUYWJsZURlZmluaXRpb24ocGF5dGFibGVUYWcpIHtcbiAgICBzd2l0Y2ggKHBheXRhYmxlVGFnKSB7XG4gICAgICAgIGNhc2UgUGF5VGFibGVUYWdzLkJFVF9PTkU6XG4gICAgICAgICAgICByZXR1cm4gcGF5dGFibGVCZXRPbmU7XG4gICAgICAgIGNhc2UgUGF5VGFibGVUYWdzLkJFVF9NQVg6XG4gICAgICAgICAgICByZXR1cm4gcGF5dGFibGVCZXRNYXg7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gcGF5dGFibGVCZXRPbmU7XG4gICAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gUGF5VGFibGVEZWZpbml0aW9uO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZWEyZTJhY1ZqMUhtcHEzc1BjT0FZbXYnLCAncGF5dGFibGUtdGFncycpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9wYXl0YWJsZS10YWdzLmpzXG5cbi8vZGVmaW5lcyB0aGUgcGF5dGJhbCB0YWdzXG5mdW5jdGlvbiBQYXlUYWJsZVRhZ3MoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgQkVUX09ORTogMCxcbiAgICAgICAgQkVUX01BWDogMVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGF5VGFibGVUYWdzO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTFmNWY1YlZXcEZEWXYyVU1LS1hKWWInLCAncGF5dGFibGUnKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvcGF5dGFibGUuanNcblxuLy9kZWZpbmVzIHRoZSBsb2dpY29mIHRoZSBwYXlsaW5lXG52YXIgUGF5VGFibGVEZWZpbml0aW9uID0gcmVxdWlyZSgncGF5dGFibGUtZGVmaW5pdGlvbicpLFxuICAgIFN0b3BUYWdzID0gcmVxdWlyZSgnc3RvcC10YWdzJykoKTtcbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG4gICAgaXNXaW5uaW5nOiBmdW5jdGlvbiBpc1dpbm5pbmcobGluZVN5bWJvbHNUYWdzLCBwYXl0YWJsZVRhZykge1xuICAgICAgICAvL2xvb3AgdGhyb3VnaG91dCBhbGwgdGhlIHN5bWJvbCB0YWdzXG4gICAgICAgIC8vY2hlY2tpbmcgZm9yIGEgc2VxdWVuY2Ugb2YgaWRlbnRpY2FsIHN5bWJvbCB0YWdzXG4gICAgICAgIHZhciBsaW5lQ29tYmluYXRpb25zID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZVN5bWJvbHNUYWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3RJdGVtID0gbGluZVN5bWJvbHNUYWdzW2ldO1xuICAgICAgICAgICAgdmFyIHByZXZpb3VzSXRlbSA9IGkgPiAwID8gbGluZVN5bWJvbHNUYWdzW2kgLSAxXSA6IC0xO1xuICAgICAgICAgICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciB0YWdzID0gW107XG4gICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICBmb3IgKHZhciBuID0gaSArIDE7IG4gPCBsaW5lU3ltYm9sc1RhZ3MubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGxpbmVTeW1ib2xzVGFnc1tuXTtcbiAgICAgICAgICAgICAgICBpZiAoZmlyc3RJdGVtID09IGl0ZW0gJiYgaXRlbSAhPSBwcmV2aW91c0l0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy9hZGQgaXRlbXMgdG8gbGluZSBjb21iaW5hdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKG4pO1xuICAgICAgICAgICAgICAgICAgICBsaW5lQ29tYmluYXRpb25zW2ZpcnN0SXRlbV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleGVzOiBpbmRleGVzXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGxpbmVDb21iaW5hdGlvbnMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGxpbmVDb21iaW5hdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuICAgIGNoZWNrOiBmdW5jdGlvbiBjaGVjayhsaW5lQ29tYmluYXRpb25zLCBwYXl0YWJsZVRhZykge1xuXG4gICAgICAgIC8vY2hlY2tzIGlmIHRoZSBpZGVudGljYWwgbGluZSBzeW1ib2xzIGZvdW5kXG4gICAgICAgIC8vYXJlIHZhbGlkIGNvbWJpbmF0aW9ucyBmb3IgdGhlIHBheXRhYmxlXG5cbiAgICAgICAgLypcbiAgICAgICAgTk9URSB0aGF0IHRoZSBwYXl0YWJsZSBvYmplY3Qgc3RydWN0dXJlIGlzIGFzIGZvbGxvd1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0b3BUYWc6U1RPUF9UQUcsXG4gICAgICAgICAgICAgICAgNTpWQUxVRSxcbiAgICAgICAgICAgICAgICAzOlZBTFVFLFxuICAgICAgICAgICAgICAgIDI6VkFMVUVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYW5kIHJlIHJldHVybiBvYmplY3QgaXNcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBpbmRleGVzOltdLFxuICAgICAgICAgICAgICAgIHdpbm5pbmdWYWx1ZTpudW1iZXIsXG4gICAgICAgICAgICAgICAgd2lubmluZ1RhZzpudW1iZXJcbiAgICAgICAgICAgIF1cbiAgICAgICAgICAgIFxuICAgICAgICAqL1xuICAgICAgICB2YXIgcGF5dGFibGUgPSBQYXlUYWJsZURlZmluaXRpb24ocGF5dGFibGVUYWcpO1xuICAgICAgICB2YXIgcmV0ID0gW107XG4gICAgICAgIGZvciAodmFyIHRhZyBpbiBsaW5lQ29tYmluYXRpb25zKSB7XG4gICAgICAgICAgICBpZiAobGluZUNvbWJpbmF0aW9ucy5oYXNPd25Qcm9wZXJ0eSh0YWcpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldE9iamVjdCA9IHBheXRhYmxlLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5zdG9wVGFnID09IHRhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdpbm5pbmdWYWx1ZSA9IHBhcnNlSW50KGl0ZW1bbGluZUNvbWJpbmF0aW9uc1t0YWddLmluZGV4ZXMubGVuZ3RoXS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aW5uaW5nVmFsdWUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleGVzOiBsaW5lQ29tYmluYXRpb25zW3RhZ10uaW5kZXhlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lubmluZ1ZhbHVlOiBpdGVtW2xpbmVDb21iaW5hdGlvbnNbdGFnXS5pbmRleGVzLmxlbmd0aF0udG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lubmluZ1RhZzogdGFnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmODZmNWl6NUROSkRxb2dSQzRUK09IdScsICdwcm5nJyk7XG4vLyBzY3JpcHRzL2NvbnRyb2xsZXJzL3BybmcuanNcblxuLy9kZWZpbmVzIGEgcHNldWRvIHJhbmRvbSBudW1iZXIgZ2VuZXJhdG9yXG5mdW5jdGlvbiBQUk5HKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIC8vIFJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiAoaW5jbHVkZWQpIGFuZCBtYXggKGluY2x1ZGVkKVxuICAgICAgICAvLyBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcbiAgICAgICAgbmV3VmFsdWU6IGZ1bmN0aW9uIG5ld1ZhbHVlKG1pbiwgbWF4KSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUFJORztcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzNkODA1SVM4R2RLaTRmcEZvUkFEZURyJywgJ3JlZWwnKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvcmVlbC5qc1xuXG4vL2RlZmluZXMgYSBzbG90IHJlZWxcbnZhciBQUk5HID0gcmVxdWlyZSgncHJuZycpKCk7XG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvL1BVQkxJQyBQUk9QRVJUSUVTXG4gICAgICAgIC8vZ2V0cy9zZXRzIGFuIGFycmF5IG9mIHN0b3BzIHRvIGRlZmluZSB0aGUgcmVlbFxuICAgICAgICBzdG9wczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFtjYy5QcmVmYWJdXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBtaW4gdmFsdWUgdXNlZCB3aXRoIHRoZSBQUk5HIGNsYXNzXG4gICAgICAgIHBybmdNaW5SYW5nZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAxLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgbWF4IHZhbHVlIHVzZWQgd2l0aCB0aGUgUFJORyBjbGFzc1xuICAgICAgICBwcm5nTWF4UmFuZ2U6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMTAwMDAwMDAwMCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9QUklWQVRFIFBST1BFUlRJRVNcbiAgICAgICAgLy9nZXRzL3NldHMgYW4gYXJyYXkgb2YgY2MuTm9kZSBtYWRlIGluc3RhbnRpYXRpbmcgZWFjaCBzdG9wXG4gICAgICAgIC8vZGVmaW5lZCBpbiB0byB0aGUgcHVibGljIHN0b3BzIGFycmF5IHByb3BlcnR5XG4gICAgICAgIHN0b3BOb2Rlczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBbXSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogW2NjLk5vZGVdXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBsYXN0IG5vZGUgb2YgdGhlIHJlZWwgdGhhdFxuICAgICAgICAvL2R1cmluZyB0aGUgcmVlbCBtb3Rpb24gd2lsbCBiZSBkaW5hbWljYWxseSB1cGRhdGVkXG4gICAgICAgIHRhaWxOb2RlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgaG93IG1hbnkgc3RvcHMgYXJlIHZpc2libGUgb24gdGhlIHJlZWwgY29udGFpbmVyXG4gICAgICAgIHZpc2libGVTdG9wczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAzLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBhZGphY2VudCB2ZXJ0aWNhbCBzcGFjZSBiZXR3ZWVuIHR3byBzdG9wc1xuICAgICAgICBwYWRkaW5nOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGhlaWdodCBvZiBlYWNoIHN0b3BcbiAgICAgICAgc3RvcEhlaWdodDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBhbW91bnQgb2YgdGhlIFkgdHJhbnNsYXRpb24gdGhhdCBkZWZpbmUgdGhlIHJlZWwgbW90aW9uXG4gICAgICAgIHN0ZXBZOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgaG93IG1hbnkgdGltZSB0aGUgcmVlbCByb2xsaW5nIGhhcHBlbmVkXG4gICAgICAgIHJvbGxpbmdDb3VudDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSB3aW5uZXIgcmVlbCBpbmRleCBjYWxjdWxhdGVkIHJhbmRvbWx5XG4gICAgICAgIHdpbm5lckluZGV4OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgaG93IG1hbnkgdGltZXMgdGhlIHJlZWwgd2lsbCByb2xsIGJlZm9yIHN0b3Agb24gdGhlIHdpbm5lciBzeW1ib2xzIChjYWxjdWxhdGVkIHJhbmRvbWx5KVxuICAgICAgICBzdG9wQWZ0ZXJSb2xsaW5nQ291bnQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgWSBvZiB0aGUgd2lubmVyIGxpbmVcbiAgICAgICAgd2lubmVyTGluZVk6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyBhIGZsYWcgdGhhdCBpbmRpY2F0ZSBpZiB0aGUgcm9sbGluZyBpcyBjb21wbGV0ZWRcbiAgICAgICAgaXNSb2xsaW5nQ29tcGxldGVkOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IGZhbHNlLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXG4gICAgICAgIC8vc2V0cyB0aGUgd2lubnIgbGluZSBZIGF0IHRoZSBtaWRkbGUgb2YgdGhlIG5vZGUgaGVpZ2h0XG4gICAgICAgIHRoaXMud2lubmVyTGluZVkgPSB0aGlzLm5vZGUuaGVpZ2h0IC8gMjtcblxuICAgICAgICAvL3NldHMgdGhlIHN0b3AgaGVpZ2h0IHVzaW5nIHRoZSBmaXJzdCBzdG9wXG4gICAgICAgIHZhciBmaXJzdFN0b3AgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnN0b3BzWzBdKTtcbiAgICAgICAgdGhpcy5zdG9wSGVpZ2h0ID0gZmlyc3RTdG9wLmhlaWdodDtcblxuICAgICAgICAvL3BhZGRpbmc6IGlzIHRoZSBzcGFjZSBiZXR3ZWVuIHR3byBhZGphY2VudCBub2Rlc1xuICAgICAgICB0aGlzLnBhZGRpbmcgPSAodGhpcy5ub2RlLmhlaWdodCAtIHRoaXMudmlzaWJsZVN0b3BzICogdGhpcy5zdG9wSGVpZ2h0KSAvICh0aGlzLnZpc2libGVTdG9wcyArIDEpO1xuXG4gICAgICAgIC8vc2V0cyB0aGUgYW1vdW50IG9mIHRoZSBZIHRyYW5zbGF0aW9uIHRoYXQgZGVmaW5lIHRoZSByZWVsIG1vdGlvblxuICAgICAgICB0aGlzLnN0ZXBZID0gdGhpcy5zdG9wSGVpZ2h0IC8gNTtcblxuICAgICAgICAvL2NvbnNpZGVyaW5nIHRoYXQgdGhlIGFuY2hvciBwb2ludCBvZiB0aGUgcmVlbCBpcyBhdCAoMCwwKVxuICAgICAgICAvL3RoaXMgbG9vcCB3aWxsIGxheW91IGFsbCB0aGUgc3RvcHMgb24gdGhlIG5vZGUgKHJlZWwpXG4gICAgICAgIHZhciBzdGFydFkgPSB0aGlzLm5vZGUuaGVpZ2h0IC0gdGhpcy5wYWRkaW5nIC0gdGhpcy5zdG9wSGVpZ2h0O1xuICAgICAgICB2YXIgc3RhcnRYID0gdGhpcy5ub2RlLndpZHRoIC8gMiAtIGZpcnN0U3RvcC53aWR0aCAvIDI7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0b3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3RvcCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc3RvcHNbaV0pO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHN0b3ApO1xuICAgICAgICAgICAgc3RvcC5zZXRQb3NpdGlvbihjYy5wKHN0YXJ0WCwgc3RhcnRZKSk7XG4gICAgICAgICAgICBzdGFydFkgPSBzdGFydFkgLSB0aGlzLnBhZGRpbmcgLSB0aGlzLnN0b3BIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLnN0b3BOb2Rlcy5wdXNoKHN0b3ApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFpbE5vZGUgPSB0aGlzLnN0b3BOb2Rlc1t0aGlzLnN0b3BOb2Rlcy5sZW5ndGggLSAxXTtcblxuICAgICAgICB0aGlzLmlzUm9sbGluZ0NvbXBsZXRlZCA9IHRydWU7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcblxuICAgICAgICBpZiAodGhpcy5pc1JvbGxpbmdDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vdGhlIGxvb3AgYmVsb3cgd2lsbCBtb292ZSBlYWNoIHN0b3Agb2YgdGhlIHNldHBZIGFtb3VudC5cbiAgICAgICAgLy9XaGVuIHRoZSBmaXJzdCBzdG9wIGlzIG9uIHRoZSB0b3Agb2YgdGhlIG5vZGUsIHdpbGwgYmUgbW92ZWQgYWZ0ZXIgdGhlIGZpcnN0IGFuZCB3aWxsIGJlIHNldCBhcyB0YWlsLlxuICAgICAgICAvL0ZvciBmdXJ0aGVyIGluZm9ybXRhaW9uIHRha2UgYSBsb29rIHRvIHRoZSBvbmxpbmUgZ2l0aHViIGRvY3VtZW50YXRpb25cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RvcE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3RvcCA9IHRoaXMuc3RvcE5vZGVzW2ldO1xuICAgICAgICAgICAgc3RvcC55ID0gc3RvcC55ICsgdGhpcy5zdGVwWTtcbiAgICAgICAgICAgIGlmIChzdG9wLnkgLSB0aGlzLnBhZGRpbmcgPiB0aGlzLm5vZGUuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgKyAxID09IHRoaXMuc3RvcE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvbGxpbmdDb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdG9wLnkgPSB0aGlzLnRhaWxOb2RlLnkgLSB0aGlzLnRhaWxOb2RlLmhlaWdodCAtIHRoaXMucGFkZGluZztcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWxOb2RlID0gc3RvcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc3RvcEFmdGVyUm9sbGluZ0NvdW50ID09IHRoaXMucm9sbGluZ0NvdW50ICYmIGkgPT0gdGhpcy53aW5uZXJJbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChzdG9wLnkgPj0gdGhpcy53aW5uZXJMaW5lWSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy53aW5uZXJJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9tb3ZlIHRoZSB0YWlsIG5vZGUgYmVmb3JlIHRoZSBmaXJzdCBzdG9wIChpbmRleD09PTApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhaWxOb2RlLnkgPSBzdG9wLnkgKyBzdG9wLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy50YWlsTm9kZS5zZXRQb3NpdGlvbihjYy5wKHN0b3AueCwgc3RvcC55ICsgc3RvcC5oZWlnaHQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFpbE5vZGUgPSB0aGlzLnN0b3BOb2Rlc1t0aGlzLnN0b3BOb2Rlcy5sZW5ndGggLSAyXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0WShzdG9wKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JvbGxpbmdDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ3JvbGxpbmctY29tcGxldGVkJywgdHJ1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXRZOiBmdW5jdGlvbiByZXNldFkoY3VycmVudFN0b3ApIHtcbiAgICAgICAgLy9hcHBsaWVzIGEgY29ycmVjdGlvbiB0byBhbGwgdGhlIFkgc3RvcHMgYWZ0ZXIgdGhhdFxuICAgICAgICAvLyB0aGUgcmVlbCBoYXMgYmVlbiBzdG9wcGVkLlxuICAgICAgICB2YXIgZGVsdGFZID0gY3VycmVudFN0b3AueSAtIHRoaXMud2lubmVyTGluZVkgKyBjdXJyZW50U3RvcC5oZWlnaHQgLyAyO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RvcE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbmV3U3RvcCA9IHRoaXMuc3RvcE5vZGVzW2ldO1xuICAgICAgICAgICAgbmV3U3RvcC55ID0gbmV3U3RvcC55IC0gZGVsdGFZO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzcGluOiBmdW5jdGlvbiBzcGluKCkge1xuICAgICAgICAvL3N0YXJ0IHRoZSByZWVsIHNwaW5uaW5nXG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvL1RPRE86IGl0IGRlcGVuZHMgb2YgdGhlIG51bWViZXIgb2YgcmVlbCBzdG9wc1xuICAgICAgICB2YXIgbWluID0gMTtcbiAgICAgICAgdmFyIG1heCA9IDI7XG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgdGhpcy5yb2xsaW5nQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnN0b3BBZnRlclJvbGxpbmdDb3VudCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG4gICAgICAgIC8vUFJOR1xuICAgICAgICAvL2dldHMgcmFuZG9tIHZhbHVlIHdpdGggUFJORyBjbGFzcyBiZXR3ZWVuIGEgbWluIGFuZCBtYXggdmFsdWVcbiAgICAgICAgdmFyIHJhbmRvbVZhbHVlID0gUFJORy5uZXdWYWx1ZSh0aGlzLnBybmdNaW5SYW5nZSwgdGhpcy5wcm5nTWF4UmFuZ2UpO1xuICAgICAgICAvL25vcm1hbGl6ZSB3aXRoIHRoZSBudW1iZXIgb2Ygc3RvcHNcbiAgICAgICAgdGhpcy53aW5uZXJJbmRleCA9IHJhbmRvbVZhbHVlICUgdGhpcy5zdG9wcy5sZW5ndGg7XG5cbiAgICAgICAgdGhpcy5pc1JvbGxpbmdDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyAodGhpcy5zdG9wQWZ0ZXJSb2xsaW5nQ291bnQgKyBcIi1cIiArIHRoaXMud2lubmVySW5kZXgpO1xuICAgIH0sXG4gICAgZ2V0V2lubmVyU3RvcDogZnVuY3Rpb24gZ2V0V2lubmVyU3RvcCgpIHtcbiAgICAgICAgLy9yZXR1cm5zIHRoZSByZWVsIHdpbm5yZSBpbmRleFxuICAgICAgICByZXR1cm4gdGhpcy5zdG9wTm9kZXNbdGhpcy53aW5uZXJJbmRleF07XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiMWY4ZmNDeVVsQVFZWEtsYTNZRFg1LycsICdzdG9wLXRhZ3MnKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvc3RvcC10YWdzLmpzXG5cbi8vZGVmaW5lcyB0aGUgc3RvcCB0YWdzXG5mdW5jdGlvbiBTdG9wVGFncygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBCQU5BTkE6IDEsXG4gICAgICAgIEJFR0FNT1Q6IDIsXG4gICAgICAgIEJPTlVTOiAzLFxuICAgICAgICBDT0NLVEFJTDogNCxcbiAgICAgICAgQ09DT0RSSUxFOiA1LFxuICAgICAgICBLQUtBRFU6IDYsXG4gICAgICAgIExJT046IDcsXG4gICAgICAgIE1BTjogOCxcbiAgICAgICAgTU9OS0VZOiA5XG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdG9wVGFncztcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzdjOWQ5MitJT0JNR0t3U1RDaFNvSVZpJywgJ3N0b3AnKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvc3RvcC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGFnOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogMCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgYmxpbmtUaW1lcjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBibGlua0NvdW50ZXI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcbiAgICBibGluazogZnVuY3Rpb24gYmxpbmsoKSB7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLmJsaW5rVGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHRoYXQuYmxpbmtDb3VudGVyKys7XG4gICAgICAgICAgICB0aGF0Lm5vZGUuYWN0aXZlID09PSB0cnVlID8gdGhhdC5ub2RlLmFjdGl2ZSA9IGZhbHNlIDogdGhhdC5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhhdC5ibGlua0NvdW50ZXIgPT0gMTApIHtcbiAgICAgICAgICAgICAgICB0aGF0LmJsaW5rQ291bnRlciA9IDA7XG4gICAgICAgICAgICAgICAgdGhhdC5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGF0LmJsaW5rVGltZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAzMDApO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyNDZhYjRhbmxkS2tZQ2pyN0ZpcklFSycsICd1c2VyLWRlZmF1bHQta2V5cycpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy91c2VyLWRlZmF1bHQta2V5cy5qc1xuXG5mdW5jdGlvbiBVc2VyRGVmYXVsdEtleXMoKSB7XG4gIHJldHVybiB7XG4gICAgQ1VSUkVOVF9DUkVESVQ6IFwiQ3VycmVudF9DcmVkaXRcIlxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJEZWZhdWx0S2V5cztcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2FjODVhTjB5RFpBeTVxTThlbjhGZURRJywgJ3VzZXItZGVmYXVsdCcpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy91c2VyLWRlZmF1bHQuanNcblxudmFyIFVzZXJEZWZhdWx0S2V5cyA9IHJlcXVpcmUoJ3VzZXItZGVmYXVsdC1rZXlzJykoKTtcbnZhciBVc2VyRGVmYXVsdCA9IGNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbG9jYWxTdG9yYWdlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IGNjLnN5cy5sb2NhbFN0b3JhZ2U7XG4gICAgICAgIC8vaW5pdCB0aGUgc2luZ2xldG9uIGluc3RhbmNlXG4gICAgICAgIFVzZXJEZWZhdWx0Lmluc3RhbmNlID0gdGhpcztcbiAgICB9LFxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgaW5zdGFuY2U6IG51bGxcbiAgICB9LFxuICAgIGdldEN1cnJlbnRDcmVkaXQ6IGZ1bmN0aW9uIGdldEN1cnJlbnRDcmVkaXQoZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShVc2VyRGVmYXVsdEtleXMuQ1VSUkVOVF9DUkVESVQpO1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEgPSBkZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGEgPyBwYXJzZUludChkYXRhKSA6IDA7XG4gICAgfSxcbiAgICBzZXRDdXJyZW50Q3JlZGl0OiBmdW5jdGlvbiBzZXRDdXJyZW50Q3JlZGl0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oVXNlckRlZmF1bHRLZXlzLkNVUlJFTlRfQ1JFRElULCB2YWx1ZSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
