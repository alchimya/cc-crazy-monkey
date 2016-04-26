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
                    that.currentCredit -= that.currentBetValue;
                    that.betInfoLabel.string = (-that.currentBetValue).toString();
                    that.creditLabel.string = that.currentCredit.toString();

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
                }
            }
        });
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
    //TODO chnage name of this function
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
        this.currentCredit += winningAmount;
        this.betInfoLabel.string = winningAmount.toString();
        this.creditLabel.string = this.currentCredit.toString();
    }

});

cc._RFpop();
},{"audio-manager":"audio-manager","on-off-button":"on-off-button","paytable-tags":"paytable-tags","reel":"reel"}],"on-off-button":[function(require,module,exports){
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
},{}]},{},["game","reel","paytable-definition","on-off-button","stop","paytable","audio-manager","stop-tags","paytable-tags","prng"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvYXVkaW8tbWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL2dhbWUuanMiLCJhc3NldHMvc2NyaXB0cy91aS9vbi1vZmYtYnV0dG9uLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvcGF5dGFibGUtZGVmaW5pdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL3BheXRhYmxlLXRhZ3MuanMiLCJhc3NldHMvc2NyaXB0cy9jb250cm9sbGVycy9wYXl0YWJsZS5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL3BybmcuanMiLCJhc3NldHMvc2NyaXB0cy9jb250cm9sbGVycy9yZWVsLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvc3RvcC10YWdzLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvc3RvcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2E3ZGJmS2grNUpLMDRyOWJMUlNvUGEyJywgJ2F1ZGlvLW1hbmFnZXInKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvYXVkaW8tbWFuYWdlci5qc1xuXG4vLy9kZWlmbmVzIGFuIGhlbHBlciAoc2luZ2xldG9uKSBjbGFzcyB0byBwbGF5IGF1c2lvIGFzc2V0c1xudmFyIEF1ZGlvTWFuYWdlciA9IGNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvL1BVQkxJQyBQUk9QRVJUSUVTXG4gICAgICAgIC8vdGhlIHByb3BlcnRpZXMgYmVsb3cgZGVmaW5lIGFsbCB0aGUgYXVkaW8gY2xpcHMgdGhhdCB0aGUgY2xhc3MgY2FuIHBsYXlcbiAgICAgICAgY29pbnNXaW46IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgY29pbnNJbnNlcnQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgamFja3BvdFdpbjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBsaW5lV2luOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIHJlZWxTdGFydDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICByZWVsUm9sbDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICByZWVsU3RvcDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcbiAgICAvL2RlZmluZXMgdGhlIHN0YXRpYyAoc2luZ2xldG9uKSBpbnN0YW5jZVxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgaW5zdGFuY2U6IG51bGxcbiAgICB9LFxuXG4gICAgcGxheUNvaW5zV2luOiBmdW5jdGlvbiBwbGF5Q29pbnNXaW4oKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh0aGlzLmNvaW5zV2luLCBmYWxzZSk7XG4gICAgfSxcbiAgICBwbGF5Q29pbnNJbnNlcnQ6IGZ1bmN0aW9uIHBsYXlDb2luc0luc2VydCgpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmNvaW5zSW5zZXJ0LCBmYWxzZSk7XG4gICAgfSxcbiAgICBwbGF5SmFja3BvdFdpbjogZnVuY3Rpb24gcGxheUphY2twb3RXaW4oKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5qYWNrcG90V2luLCBmYWxzZSk7XG4gICAgfSxcbiAgICBwbGF5TGluZVdpbjogZnVuY3Rpb24gcGxheUxpbmVXaW4oKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5saW5lV2luLCBmYWxzZSk7XG4gICAgfSxcbiAgICBwbGF5UmVlbFN0YXJ0OiBmdW5jdGlvbiBwbGF5UmVlbFN0YXJ0KCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMucmVlbFN0YXJ0LCBmYWxzZSk7XG4gICAgfSxcbiAgICBwbGF5UmVlbFJvbGw6IGZ1bmN0aW9uIHBsYXlSZWVsUm9sbCgpIHtcbiAgICAgICAgdGhpcy5wbGF5U291bmQodGhpcy5yZWVsUm9sbCk7XG4gICAgfSxcbiAgICBwbGF5UmVlbFN0b3A6IGZ1bmN0aW9uIHBsYXlSZWVsU3RvcCgpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLnJlZWxTdG9wLCBmYWxzZSk7XG4gICAgfSxcbiAgICBwbGF5U291bmQ6IGZ1bmN0aW9uIHBsYXlTb3VuZChhdWRpb0NsaXApIHtcbiAgICAgICAgLy9hdWRpbyBwbGF5XG4gICAgICAgIGlmICghYXVkaW9DbGlwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKGF1ZGlvQ2xpcCwgZmFsc2UpO1xuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vaW5pdCB0aGUgc2luZ2xldG9uIGluc3RhbmNlXG4gICAgICAgIEF1ZGlvTWFuYWdlci5pbnN0YW5jZSA9IHRoaXM7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzE3YTEwN2hPQTFEakpkR05EbWtCZDN5JywgJ2dhbWUnKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvZ2FtZS5qc1xuXG4vL2RlZmluZXMgdGhlIG1haW4gZHJpdmVyIG9mIHRoZSBnYW1lXG52YXIgUmVlbCA9IHJlcXVpcmUoJ3JlZWwnKSxcbiAgICBPbk9mZkJ1dHRvbiA9IHJlcXVpcmUoJ29uLW9mZi1idXR0b24nKSxcbiAgICBBdWRpb01hbmFnZXIgPSByZXF1aXJlKCdhdWRpby1tYW5hZ2VyJyksXG4gICAgUGF5VGFibGVUYWdzID0gcmVxdWlyZSgncGF5dGFibGUtdGFncycpKCk7XG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvL1BVQkxJQyBQUk9QRVJUSUVTXG4gICAgICAgIC8vZ2V0cy9zZXRzIGFuIGFycmF5IG9mIFJlZWwgdHlwZSAoc2VlIHJlZWwuanMgYXNzZXQpIHVzZWQgdG8gZGVmaW5lIHRoZSBzbG90IHJlZWxzXG4gICAgICAgIHJlZWxzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IFtdLFxuICAgICAgICAgICAgdHlwZTogW1JlZWxdXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBpbml0aWFsIGNyZWRpdC5cbiAgICAgICAgY3VycmVudENyZWRpdDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAxMDAsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBhbW91bnQgb2YgdGhlIFwib25lIGJldFwiIG1vZGVcbiAgICAgICAgYmV0T25lVmFsdWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGFtb3VudCBvZiB0aGUgXCJtYXggYmV0XCIgbW9kZVxuICAgICAgICBiZXRNYXhWYWx1ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiA1LFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgT25PZmYgc3BpbiBidXR0b25cbiAgICAgICAgc3BpbkJ1dHRvbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogT25PZmZCdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIE9uT2ZmIGF1dG8tc3BpbiBidXR0b25cbiAgICAgICAgYXV0b1NwaW5CdXR0b246IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IE9uT2ZmQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBPbk9mZiBiZXQgb25lIGJ1dHRvblxuICAgICAgICBiZXRPbmVCdXR0b246IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IE9uT2ZmQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBPbk9mZiBiZXQgbWF4IGJ1dHRvblxuICAgICAgICBiZXRNYXhCdXR0b246IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IE9uT2ZmQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRvdGFsIGJldCBsYWJlbFxuICAgICAgICB0b3RhbEJldExhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyBjcmVkaXQgbGFiZWxcbiAgICAgICAgY3JlZGl0TGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIGluZm8gbGFiZWxcbiAgICAgICAgYmV0SW5mb0xhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyBob3cgbWFueSByZWVscyBoYXZlIGJlZW4gY29tcGxldGVkIHRoZSByb2xsIG9wZXJhdGlvblxuICAgICAgICByb2xsaW5nQ29tcGxldGVkQ291bnQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgZmxhZyB0aGF0IGFsbG93cyB0byB1bmRlcnNhdG5kIGlmIGFsbCB0aGUgcmVlbHMgaGF2ZSBiZWVuIGNvbXBsZXRlZCBpdHMgcm9sbGluZyBvcGVyYXRpb25cbiAgICAgICAgaXNSb2xsaW5nQ29tcGxldGVkOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgdG90YWwgYmV0IHZhbHVlXG4gICAgICAgIHRvdGFsQmV0VmFsdWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgY3VycmVudCBiZXQgdmFsdWUgKGJldCBvbmUgb3IgYmV0IG1heClcbiAgICAgICAgY3VycmVudEJldFZhbHVlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGN1cnJlbnQgcGF5dGFibGUgdGFnIChzZWUgcGF5dGFibGUtdGFncy5qcyBhc3NldClcbiAgICAgICAgY3VycmVudFBheVRhYmxlVGFnOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzIHNldCB0aGUgYXV0by1zcGluIGZsYWdcbiAgICAgICAgaXNBdXRvU3Bpbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBmYWxzZSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSB0aW1lciBpbnN0YW5jZSB1c2VkIGZvciB0aGUgYXV0by9zcGluICB0aW1lb3V0XG4gICAgICAgIGF1dG9TcGluVGltZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIC8vc2V0cyB0aGUgYXZhaWxhYmxlIGNyZWRpdC5cbiAgICAgICAgdGhpcy5jcmVkaXRMYWJlbC5zdHJpbmcgPSB0aGlzLmN1cnJlbnRDcmVkaXQudG9TdHJpbmcoKTtcbiAgICAgICAgLy9pbml0IGJldCBpbmZvIGxhYmVsXG4gICAgICAgIHRoaXMuYmV0SW5mb0xhYmVsLnN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgLy9pbXBsZW1lbnRzIHRoZSBzcGluIGJ1dHRvbiBvbi9vZmYgZXZlbnRcbiAgICAgICAgdGhpcy5zcGluQnV0dG9uLm5vZGUub24oJ3JlZWwtc3BpbicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmRldGFpbC5pc09uKSB7XG4gICAgICAgICAgICAgICAgLy9wbGF5IHRoZSBnYW1lXG4gICAgICAgICAgICAgICAgdGhhdC5zcGluKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvL2ltcGxlbWVudHMgdGhlIGF1dG8tc3BpbiBidXR0b24gb24vb2ZmIGV2ZW50XG4gICAgICAgIHRoaXMuYXV0b1NwaW5CdXR0b24ubm9kZS5vbigncmVlbC1hdXRvLXNwaW4nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vcGxheSB0aGUgZ2FtZSBhcyBzaW5nbGUgc3BpbiBvciBhdXRvLXNwaW5cbiAgICAgICAgICAgIHRoYXQuaXNBdXRvU3BpbiA9PT0gdHJ1ZSA/IHRoYXQuaXNBdXRvU3BpbiA9IGZhbHNlIDogdGhhdC5pc0F1dG9TcGluID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGF0LmlzQXV0b1NwaW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLmlzT24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zcGluKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhhdC5hdXRvU3BpblRpbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vaW1wbGVtZW50cyB0aGUgYmV0IG9uZSBidXR0b24gb24vb2ZmIGV2ZW50XG4gICAgICAgIHRoaXMuYmV0T25lQnV0dG9uLm5vZGUub24oJ2JldC1vbmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5kZXRhaWwuaXNPbikge1xuICAgICAgICAgICAgICAgIC8vd2hlbiB0aGlzIGJ1dHRvbiBpcyBwdXNoZWQgZG93biB0aGUgYmV0IG1heCBidXR0b24gd2lsbCBiZSByZXNldFxuICAgICAgICAgICAgICAgIHRoYXQuYmV0TWF4QnV0dG9uLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgLy9zZXQgYmV0IHZhbHVlXG4gICAgICAgICAgICAgICAgdGhhdC5jdXJyZW50QmV0VmFsdWUgPSB0aGF0LmJldE9uZVZhbHVlO1xuICAgICAgICAgICAgICAgIHRoYXQuY3VycmVudFBheVRhYmxlVGFnID0gUGF5VGFibGVUYWdzLkJFVF9PTkU7XG4gICAgICAgICAgICAgICAgdGhhdC5iZXRJbmZvTGFiZWwuc3RyaW5nID0gdGhhdC5jdXJyZW50QmV0VmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIuaW5zdGFuY2UucGxheUNvaW5zSW5zZXJ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvL2ltcGxlbWVudHMgdGhlIGJldC1tYXggYnV0dG9uIG9uL29mZiBldmVudFxuICAgICAgICB0aGlzLmJldE1heEJ1dHRvbi5ub2RlLm9uKCdiZXQtbWF4JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLmlzT24pIHtcbiAgICAgICAgICAgICAgICAvL3doZW4gdGhpcyBidXR0b24gaXMgcHVzaGVkIGRvd24gdGhlIGJldCBvbmUgYnV0dG9uIHdpbGwgYmUgcmVzZXRcbiAgICAgICAgICAgICAgICB0aGF0LmJldE9uZUJ1dHRvbi5yZXNldCgpO1xuICAgICAgICAgICAgICAgIC8vc2V0IGJldCB2YWx1ZVxuICAgICAgICAgICAgICAgIHRoYXQuY3VycmVudEJldFZhbHVlID0gdGhhdC5iZXRNYXhWYWx1ZTtcbiAgICAgICAgICAgICAgICB0aGF0LmN1cnJlbnRQYXlUYWJsZVRhZyA9IFBheVRhYmxlVGFncy5CRVRfTUFYO1xuICAgICAgICAgICAgICAgIHRoYXQuYmV0SW5mb0xhYmVsLnN0cmluZyA9IHRoYXQuY3VycmVudEJldFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnBsYXlDb2luc0luc2VydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy9pbXBsZW1lbnRzIHRoZSByb2xsaW5nIGNvbXBsZXRlZCBldmVudCBvZiB0aGUgcmVsbC5qcyBjbGFzc1xuICAgICAgICB0aGlzLm5vZGUub24oJ3JvbGxpbmctY29tcGxldGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAvL3RoaXMgbWV0aG9kIGNvdW50cyBhbGwgdGhlIGNvbXBsZXRlZCByb2xsaW5nIHJlZWxzIGFuZCBldmFsdWF0ZSB0aGUgcmVzdWx0c1xuICAgICAgICAgICAgLy9pZiBhbGwgdGhlIHJlbGxzIGhhdmUgYmVlbiBmaW5pc2hlZCB0byByb2xsLlxuICAgICAgICAgICAgdGhhdC5yb2xsaW5nQ29tcGxldGVkQ291bnQrKztcbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5pbnN0YW5jZS5wbGF5UmVlbFN0b3AoKTtcblxuICAgICAgICAgICAgaWYgKHRoYXQucm9sbGluZ0NvbXBsZXRlZENvdW50ID09IHRoYXQucmVlbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5yb2xsaW5nQ29tcGxldGVkQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIC8vZ2V0cyB0aGUgbGluZSBzeW1ib2xzIHRhZ3NcbiAgICAgICAgICAgICAgICB2YXIgbGluZVN5bWJvbHNUYWdzID0gW107XG4gICAgICAgICAgICAgICAgbGluZVN5bWJvbHNUYWdzID0gdGhhdC5nZXRMaW5lU3ltYm9sc1RhZygpO1xuXG4gICAgICAgICAgICAgICAgLy9jcmVhdGUgYSBwYXl0YWJsZSBpbnN0YW5jZSBhbmQgY2hlY2tzIGlmIHRoZSB0YWcgc3ltYm9scyBpcyBhIHdpbm5pbmcgY29tYmluYXRpb25cbiAgICAgICAgICAgICAgICB2YXIgcGF5dGFibGUgPSB0aGF0LmdldENvbXBvbmVudChcInBheXRhYmxlXCIpLFxuICAgICAgICAgICAgICAgICAgICBwYXl0YWJsZVJldCA9IHBheXRhYmxlLmlzV2lubmluZyhsaW5lU3ltYm9sc1RhZ3MsIHRoYXQuY3VycmVudFBheVRhYmxlVGFnKSxcbiAgICAgICAgICAgICAgICAgICAgaXNXaW5uaW5nID0gT2JqZWN0LmtleXMocGF5dGFibGVSZXQpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNXaW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vV09OISEhXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgd29uIHNwaW4gYW5kIGF1dG8tc3BpbiB3aWxsIHN0b3AgdGhlIGV4ZWN1dGlvblxuICAgICAgICAgICAgICAgICAgICB0aGF0LmlzUm9sbGluZ0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaXNBdXRvU3BpbiA/IHRoYXQuYXV0b1NwaW5CdXR0b24ucmVzZXQoKSA6IHRoYXQuc3BpbkJ1dHRvbi5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmlzQXV0b1NwaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy9wbGF5IHNvdW5kXG4gICAgICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5pbnN0YW5jZS5wbGF5TGluZVdpbigpO1xuICAgICAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIuaW5zdGFuY2UucGxheUNvaW5zV2luKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vc2hvdyB3aW5uaW5nIHN5bWJvbHMgKGFuaW1hdGlvbilcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zaG93V2lubmluZ1N5bWJvbHNBbmRQYXkocGF5dGFibGVSZXQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vTE9TVCB1cGRhdGUgY3JlZGl0XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuY3VycmVudENyZWRpdCAtPSB0aGF0LmN1cnJlbnRCZXRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5iZXRJbmZvTGFiZWwuc3RyaW5nID0gKC10aGF0LmN1cnJlbnRCZXRWYWx1ZSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5jcmVkaXRMYWJlbC5zdHJpbmcgPSB0aGF0LmN1cnJlbnRDcmVkaXQudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoYXQuaXNBdXRvU3Bpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zcGluIGNvbXBsZXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5pc1JvbGxpbmdDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zcGluQnV0dG9uLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmF1dG9TcGluVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2F1dG8tc3BpbiBjb21wbGV0ZWQuLi53aWxsIHJlc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNwaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGF0LmlzUm9sbGluZ0NvbXBsZXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAvL3VubG9ja3MgYWxsIGJ1dHRvbnNcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXRCdXR0b25zTG9ja2VkKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc3BpbjogZnVuY3Rpb24gc3BpbigpIHtcblxuICAgICAgICAvL2NoZWNrcyBpZiB0aGVyZSBpcyBlbm91Z2ggY3JlZGl0IHRvIHBsYXlcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENyZWRpdCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vcmVzZXQgbGFiZWwgaW5mbyB3aXRoIGN1cnJlbnQgYmV0IHZhbHVlXG4gICAgICAgIHRoaXMuYmV0SW5mb0xhYmVsLnN0cmluZyA9IHRoaXMuY3VycmVudEJldFZhbHVlLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNSb2xsaW5nQ29tcGxldGVkKSB7XG4gICAgICAgICAgICAvL3NldHMgdG90YWwgYmV0IExhYmVsXG4gICAgICAgICAgICB0aGlzLnRvdGFsQmV0VmFsdWUgKz0gdGhpcy5jdXJyZW50QmV0VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnRvdGFsQmV0TGFiZWwuc3RyaW5nID0gdGhpcy50b3RhbEJldFZhbHVlLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5pc0F1dG9TcGluKSB7XG4gICAgICAgICAgICAgICAgLy90aGlzLnNwaW5CdXR0b24uaXNMb2NrZWQ9dHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUm9sbGluZ0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9sb2NrcyBhbGwgYnV0dG9uc1xuICAgICAgICAgICAgdGhpcy5zZXRCdXR0b25zTG9ja2VkKHRydWUpO1xuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnBsYXlSZWVsUm9sbCgpO1xuICAgICAgICAgICAgLy9zdGFydHMgcmVlbHMgc3BpblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWVsc1tpXS5zcGluKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldEJ1dHRvbnNMb2NrZWQ6IGZ1bmN0aW9uIHNldEJ1dHRvbnNMb2NrZWQoaXNMb2NrZWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQXV0b1NwaW4pIHtcbiAgICAgICAgICAgIHRoaXMuYXV0b1NwaW5CdXR0b24uaXNMb2NrZWQgPSBpc0xvY2tlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3BpbkJ1dHRvbi5pc0xvY2tlZCA9IGlzTG9ja2VkO1xuICAgICAgICB0aGlzLmJldE9uZUJ1dHRvbi5pc0xvY2tlZCA9IGlzTG9ja2VkO1xuICAgICAgICB0aGlzLmJldE1heEJ1dHRvbi5pc0xvY2tlZCA9IGlzTG9ja2VkO1xuICAgIH0sXG4gICAgZ2V0TGluZVN5bWJvbHNUYWc6IGZ1bmN0aW9uIGdldExpbmVTeW1ib2xzVGFnKCkge1xuICAgICAgICB2YXIgbGluZVN5bWJvbHNUYWdzID0gW107XG4gICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgdGhpcy5yZWVscy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgdmFyIHN0b3BOb2RlID0gdGhpcy5yZWVsc1ttXS5nZXRXaW5uZXJTdG9wKCk7XG4gICAgICAgICAgICB2YXIgc3RvcENvbXBvbmVudCA9IHN0b3BOb2RlLmdldENvbXBvbmVudChcInN0b3BcIik7XG4gICAgICAgICAgICBsaW5lU3ltYm9sc1RhZ3MucHVzaChzdG9wQ29tcG9uZW50LnRhZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmVTeW1ib2xzVGFncztcbiAgICB9LFxuICAgIC8vVE9ETyBjaG5hZ2UgbmFtZSBvZiB0aGlzIGZ1bmN0aW9uXG4gICAgc2hvd1dpbm5pbmdTeW1ib2xzQW5kUGF5OiBmdW5jdGlvbiBzaG93V2lubmluZ1N5bWJvbHNBbmRQYXkocGF5dGFibGVSZXQpIHtcblxuICAgICAgICB2YXIgc3RvcE5vZGUsXG4gICAgICAgICAgICBzdG9wQ29tcG9uZW50LFxuICAgICAgICAgICAgd2lubmluZ0Ftb3VudCA9IDA7XG5cbiAgICAgICAgLy9sb29wIG9uICB0aGUgd2lubmluZyBjb21iaW5hdGlvbnMgdGhyb3VnaG91dCB0aGUgc3ltYm9scyBpbmRleFxuICAgICAgICAvL25vdGUgdGhhdCBpdCdzIHBvc3NpYmxlIHRvIGhhdmUgb25lIG9yIG1vcmUgd2lubmluZyBjb21iaW5haXRvblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBheXRhYmxlUmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHBheXRhYmxlUmV0W2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBpdGVtLmluZGV4ZXMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgICAgICBzdG9wTm9kZSA9IHRoaXMucmVlbHNbaXRlbS5pbmRleGVzW25dXS5nZXRXaW5uZXJTdG9wKCk7XG4gICAgICAgICAgICAgICAgc3RvcENvbXBvbmVudCA9IHN0b3BOb2RlLmdldENvbXBvbmVudChcInN0b3BcIik7XG4gICAgICAgICAgICAgICAgc3RvcENvbXBvbmVudC5ibGluaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2lubmluZ0Ftb3VudCArPSBwYXJzZUludChpdGVtLndpbm5pbmdWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL1BBWSB1cGRhdGUgY3JlZGl0XG4gICAgICAgIHRoaXMuY3VycmVudENyZWRpdCArPSB3aW5uaW5nQW1vdW50O1xuICAgICAgICB0aGlzLmJldEluZm9MYWJlbC5zdHJpbmcgPSB3aW5uaW5nQW1vdW50LnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuY3JlZGl0TGFiZWwuc3RyaW5nID0gdGhpcy5jdXJyZW50Q3JlZGl0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzUzNTdiRjl5N3BEam9YK2ZtWHJuV1kzJywgJ29uLW9mZi1idXR0b24nKTtcbi8vIHNjcmlwdHMvdWkvb24tb2ZmLWJ1dHRvbi5qc1xuXG4vL2RlZmluZXMgYSBjbGFzcyB0byBpbXBsZW1lbnQgYW4gT24vT2ZmIGJ1dHRvblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vUFVCTElDIFBST1BFUlRJRVNcbiAgICAgICAgLy8vZ2V0cy9zZXRzIHRoZSBldmVudCBuYW1lIHRoYXQgd2lsbCBiZSByYWlzZWQgd25laCB0aGUgYnV0dG9uIGlzIHRvdWNoZWRcbiAgICAgICAgbW91c2VEb3duTmFtZToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwib24tb2ZmLW1vdXNlZG93blwiXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBzcHJpdGUgYnV0dG9uXG4gICAgICAgIHNwcml0ZToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIHRleHR1cmUgdXJsIGZvciB0aGUgb24gc3RhdHVzXG4gICAgICAgIHNwcml0ZVRleHR1cmVEb3duVXJsOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIixcbiAgICAgICAgICAgIHVybDogY2MuVGV4dHVyZTJEXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBvbiBzdGF0dXNcbiAgICAgICAgaXNPbjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIC8vUFJJVkFURSBQUk9QRVJUSUVTXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSB0ZXh0dXJlIGZvciB0aGUgb2ZmIHN0YXR1c1xuICAgICAgICBzcHJpdGVUZXh0dXJlVXA6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB1cmw6IGNjLlRleHR1cmUyRFxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgY2FjaGVkIHRleHR1cmUgZm9yIHRoZSBvZmYgc3RhdHVzXG4gICAgICAgIHNwcml0ZVRleHR1cmVEb3duOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIixcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdXJsOiBjYy5UZXh0dXJlMkRcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGxvY2tlZCBzdGF0dXMuIElmIGl0cyB2YWx1ZSBpcyB0cnVlIG5vIGFjdGlvbnMgd2lsbCBiZSBwZXJmb3JtZWQgb24gdGhlIHRvdWNoIGV2ZW50XG4gICAgICAgIGlzTG9ja2VkOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogZmFsc2UsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIC8vc2V0cyB0aGUgdGV4dHVyZSBmb3Igb24vb2ZmXG4gICAgICAgIHRoaXMuc3ByaXRlVGV4dHVyZVVwID0gdGhpcy5zcHJpdGUuX3Nwcml0ZUZyYW1lLl90ZXh0dXJlO1xuICAgICAgICB0aGlzLnNwcml0ZVRleHR1cmVEb3duID0gY2MudGV4dHVyZUNhY2hlLmFkZEltYWdlKHRoaXMuc3ByaXRlVGV4dHVyZURvd25VcmwpO1xuXG4gICAgICAgIC8vZGVmaW5lcyBhbmQgc2V0cyB0aGUgdG91Y2ggZnVuY3Rpb24gY2FsbGJhY2tzXG4gICAgICAgIGZ1bmN0aW9uIG9uVG91Y2hEb3duKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGF0Lm9uT2ZmKCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb25Ub3VjaFVwKGV2ZW50KSB7XG4gICAgICAgICAgICAvL0RPIE5PVEhJTkdcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vZGUub24oJ3RvdWNoc3RhcnQnLCBvblRvdWNoRG93biwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaGVuZCcsIG9uVG91Y2hVcCwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaGNhbmNlbCcsIG9uVG91Y2hVcCwgdGhpcy5ub2RlKTtcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNPbikge1xuICAgICAgICAgICAgLy9pZiB3ZSB3YW50IHRvIGFjdGl2YXRlIHRoZSBidXR0b24gb24gdGhlIHN0YXJ0LXVwXG4gICAgICAgICAgICAvL3dlIG5lZWQgdG8gaW52ZXJ0IHRoZSBpbml0aWFsIHN0YXR1cyhmbGFnKTogc2VlIG9uT2ZmIGZ1bmN0aW9uXG4gICAgICAgICAgICB0aGlzLmlzT24gPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub25PZmYoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25PZmY6IGZ1bmN0aW9uIG9uT2ZmKCkge1xuICAgICAgICAvL3VwZGF0ZXMgdGhlIHRleHR1cmUgZm9yIHRoZSBvbi9vZmYgc3RhdHVzXG4gICAgICAgIGlmICh0aGlzLmlzTG9ja2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc09uKSB7XG4gICAgICAgICAgICAvL3NldCB0byBvZmZcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3ByaXRlRnJhbWUodGhpcy5zcHJpdGUsIHRoaXMuc3ByaXRlVGV4dHVyZVVwKTtcbiAgICAgICAgICAgIHRoaXMuaXNPbiA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9zZXQgdG8gb25cbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3ByaXRlRnJhbWUodGhpcy5zcHJpdGUsIHRoaXMuc3ByaXRlVGV4dHVyZURvd24pO1xuICAgICAgICAgICAgdGhpcy5pc09uID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvL2VtaXRzIHRoZSBldmVudFxuICAgICAgICB0aGlzLm5vZGUuZW1pdCh0aGlzLm1vdXNlRG93bk5hbWUsIHtcbiAgICAgICAgICAgIGlzT246IHRoaXMuaXNPblxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgLy9yZXNldHMgdGhlIGJ1dHRvbiB3aXRoIHRoZSBvZmYgc3RhdHVzXG4gICAgICAgIHRoaXMuaXNPbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzTG9ja2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlU3ByaXRlRnJhbWUodGhpcy5zcHJpdGUsIHRoaXMuc3ByaXRlVGV4dHVyZVVwKTtcbiAgICB9LFxuICAgIHVwZGF0ZVNwcml0ZUZyYW1lOiBmdW5jdGlvbiB1cGRhdGVTcHJpdGVGcmFtZShzcHJpdGUsIHRleHR1cmUpIHtcbiAgICAgICAgLy91cGRhdGVzIHRoZSBzcHJpdGUgdGV4dHVyZVxuICAgICAgICBpZiAoIXNwcml0ZSB8fCAhdGV4dHVyZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB3ID0gc3ByaXRlLm5vZGUud2lkdGgsXG4gICAgICAgICAgICBoID0gc3ByaXRlLm5vZGUuaGVpZ2h0LFxuICAgICAgICAgICAgZnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGV4dHVyZSwgY2MucmVjdCgwLCAwLCB3LCBoKSk7XG4gICAgICAgIHNwcml0ZS5zcHJpdGVGcmFtZSA9IGZyYW1lO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0Yjk0YldlcjJKTHI3REE0U21XWDJOQScsICdwYXl0YWJsZS1kZWZpbml0aW9uJyk7XG4vLyBzY3JpcHRzL2NvbnRyb2xsZXJzL3BheXRhYmxlLWRlZmluaXRpb24uanNcblxuLy9kZWZpbmVzIHRoZSBwYXl0YWJsZXNcblxuLypcblBBWSBUQUJMRSBCRVQgTUFYXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuU1lNQk9MXHRcdFRPVEFMIFNZTUJPTFNcdFx0XHQ1L1IgXHRcdFx0My9SIFx0XHRcdDIvUlxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkJPTlVTXHRcdFx0NVx0XHRcdFx0XHQyMDAwXHRcdFx0MTAwMFx0XHRcdDgwMFxuQkFOQU5BXHRcdFx0MTdcdFx0XHRcdFx0MzAwXHRcdFx0XHQyMDAgXHRcdFx0MTAwXG5CRUdBTU9UXHRcdFx0MTlcdFx0XHRcdFx0MjAwIFx0XHRcdDEwMCBcdFx0XHQ1MFxuQ09DT0RSSUxFXHRcdDE5IFx0XHRcdFx0XHQyMDAgXHRcdFx0MTAwIFx0XHRcdDUwXG5DT0NLVEFJTFx0XHQxOSBcdFx0XHRcdFx0MjAwIFx0XHRcdDEwMCBcdFx0XHQtLVxuS0FLQURVXHRcdFx0MjAgXHRcdFx0XHRcdDEwMCBcdFx0XHQ3NVx0XHRcdFx0LS1cbk1BTlx0XHRcdFx0MjAgXHRcdFx0XHRcdDEwMCBcdFx0XHQ3NVx0XHRcdFx0LS1cbk1PTktFWVx0XHRcdDIwIFx0XHRcdFx0XHQxMDAgXHRcdFx0NzVcdFx0XHRcdC0tXG5MSU9OXHRcdFx0MjFcdFx0XHRcdFx0NTBcdFx0XHRcdDI1XHRcdFx0XHQtLVxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuUEFZIFRBQkxFIEJFVCBPTkVcblxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblNZTUJPTFx0XHRUT1RBTCBTWU1CT0xTXHRcdFx0NS9SIFx0XHRcdDMvUiBcdFx0XHQyL1Jcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5CT05VU1x0XHRcdDVcdFx0XHRcdFx0MjAwIFx0XHRcdDEwMCBcdFx0XHQ1MFxuQkFOQU5BXHRcdFx0MTdcdFx0XHRcdFx0MTAwXHRcdFx0XHQyMCAgXHRcdFx0MTBcbkJFR0FNT1RcdFx0XHQxOVx0XHRcdFx0XHQ1MCAgXHRcdFx0MTAgIFx0XHRcdDVcbkNPQ09EUklMRVx0XHQxOSBcdFx0XHRcdFx0NTAgIFx0XHRcdDEwICBcdFx0XHQ1XG5DT0NLVEFJTFx0XHQxOSBcdFx0XHRcdFx0MjAgIFx0XHRcdDEwICBcdFx0XHQyXG5LQUtBRFVcdFx0XHQyMCBcdFx0XHRcdFx0MTAgIFx0XHRcdDVcdFx0XHRcdDJcbk1BTlx0XHRcdFx0MjAgXHRcdFx0XHRcdDEwICBcdFx0XHQ1XHRcdFx0XHQyXG5NT05LRVlcdFx0XHQyMCBcdFx0XHRcdFx0MTAgIFx0XHRcdDVcdFx0XHRcdDFcbkxJT05cdFx0XHQyMVx0XHRcdFx0XHQ1XHRcdFx0XHQyXHRcdFx0XHQxXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4qL1xuLypcbnBheXRhYmxlIG9iamVjdCBzdHJ1Y3R1cmVcbiAgICB7XG4gICAgICAgIHN0b3BUYWc6U1RPUF9UQUcsXG4gICAgICAgIDU6VkFMVUUsXG4gICAgICAgIDM6VkFMVUUsXG4gICAgICAgIDI6VkFMVUVcbiAgICB9XG4qL1xudmFyIFN0b3BUYWdzID0gcmVxdWlyZSgnc3RvcC10YWdzJykoKSxcbiAgICBQYXlUYWJsZVRhZ3MgPSByZXF1aXJlKCdwYXl0YWJsZS10YWdzJykoKTtcbnZhciBwYXl0YWJsZUJldE1heCA9IFt7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuQk9OVVMsXG4gICAgNTogMjAwMCxcbiAgICAzOiAxMDAwLFxuICAgIDI6IDgwMFxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkJBTkFOQSxcbiAgICA1OiAzMDAsXG4gICAgMzogMjAwLFxuICAgIDI6IDEwMFxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkJFR0FNT1QsXG4gICAgNTogMjAwLFxuICAgIDM6IDEwMCxcbiAgICAyOiA1MFxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkNPQ09EUklMRSxcbiAgICA1OiAyMDAsXG4gICAgMzogMTAwLFxuICAgIDI6IDUwXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuQ09DS1RBSUwsXG4gICAgNTogMjAwLFxuICAgIDM6IDEwMCxcbiAgICAyOiA1XG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuS0FLQURVLFxuICAgIDU6IDEwMCxcbiAgICAzOiA3NSxcbiAgICAyOiA1XG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuTUFOLFxuICAgIDU6IDEwMCxcbiAgICAzOiA3NSxcbiAgICAyOiA1XG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuTU9OS0VZLFxuICAgIDU6IDEwMCxcbiAgICAzOiA3NSxcbiAgICAyOiAyXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuTElPTixcbiAgICA1OiA1MCxcbiAgICAzOiAyNSxcbiAgICAyOiAyXG59XTtcbnZhciBwYXl0YWJsZUJldE9uZSA9IFt7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuQk9OVVMsXG4gICAgNTogMjAwLFxuICAgIDM6IDEwMCxcbiAgICAyOiA1MFxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkJBTkFOQSxcbiAgICA1OiAxMDAsXG4gICAgMzogMjAsXG4gICAgMjogMTBcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5CRUdBTU9ULFxuICAgIDU6IDUwLFxuICAgIDM6IDEwLFxuICAgIDI6IDVcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5DT0NPRFJJTEUsXG4gICAgNTogNTAsXG4gICAgMzogMTAsXG4gICAgMjogNVxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkNPQ0tUQUlMLFxuICAgIDU6IDIwLFxuICAgIDM6IDEwLFxuICAgIDI6IDJcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5LQUtBRFUsXG4gICAgNTogMTAsXG4gICAgMzogNSxcbiAgICAyOiAyXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuTUFOLFxuICAgIDU6IDEwLFxuICAgIDM6IDUsXG4gICAgMjogMlxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLk1PTktFWSxcbiAgICA1OiAxMCxcbiAgICAzOiA1LFxuICAgIDI6IDFcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5MSU9OLFxuICAgIDU6IDUsXG4gICAgMzogMixcbiAgICAyOiAxXG59XTtcblxudmFyIFBheVRhYmxlRGVmaW5pdGlvbiA9IGZ1bmN0aW9uIFBheVRhYmxlRGVmaW5pdGlvbihwYXl0YWJsZVRhZykge1xuICAgIHN3aXRjaCAocGF5dGFibGVUYWcpIHtcbiAgICAgICAgY2FzZSBQYXlUYWJsZVRhZ3MuQkVUX09ORTpcbiAgICAgICAgICAgIHJldHVybiBwYXl0YWJsZUJldE9uZTtcbiAgICAgICAgY2FzZSBQYXlUYWJsZVRhZ3MuQkVUX01BWDpcbiAgICAgICAgICAgIHJldHVybiBwYXl0YWJsZUJldE1heDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBwYXl0YWJsZUJldE9uZTtcbiAgICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBQYXlUYWJsZURlZmluaXRpb247XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdlYTJlMmFjVmoxSG1wcTNzUGNPQVltdicsICdwYXl0YWJsZS10YWdzJyk7XG4vLyBzY3JpcHRzL2NvbnRyb2xsZXJzL3BheXRhYmxlLXRhZ3MuanNcblxuLy9kZWZpbmVzIHRoZSBwYXl0YmFsIHRhZ3NcbmZ1bmN0aW9uIFBheVRhYmxlVGFncygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBCRVRfT05FOiAwLFxuICAgICAgICBCRVRfTUFYOiAxXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYXlUYWJsZVRhZ3M7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5MWY1ZjViVldwRkRZdjJVTUtLWEpZYicsICdwYXl0YWJsZScpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9wYXl0YWJsZS5qc1xuXG4vL2RlZmluZXMgdGhlIGxvZ2ljb2YgdGhlIHBheWxpbmVcbnZhciBQYXlUYWJsZURlZmluaXRpb24gPSByZXF1aXJlKCdwYXl0YWJsZS1kZWZpbml0aW9uJyksXG4gICAgU3RvcFRhZ3MgPSByZXF1aXJlKCdzdG9wLXRhZ3MnKSgpO1xuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcbiAgICBpc1dpbm5pbmc6IGZ1bmN0aW9uIGlzV2lubmluZyhsaW5lU3ltYm9sc1RhZ3MsIHBheXRhYmxlVGFnKSB7XG4gICAgICAgIC8vbG9vcCB0aHJvdWdob3V0IGFsbCB0aGUgc3ltYm9sIHRhZ3NcbiAgICAgICAgLy9jaGVja2luZyBmb3IgYSBzZXF1ZW5jZSBvZiBpZGVudGljYWwgc3ltYm9sIHRhZ3NcbiAgICAgICAgdmFyIGxpbmVDb21iaW5hdGlvbnMgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lU3ltYm9sc1RhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmaXJzdEl0ZW0gPSBsaW5lU3ltYm9sc1RhZ3NbaV07XG4gICAgICAgICAgICB2YXIgcHJldmlvdXNJdGVtID0gaSA+IDAgPyBsaW5lU3ltYm9sc1RhZ3NbaSAtIDFdIDogLTE7XG4gICAgICAgICAgICB2YXIgaW5kZXhlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHRhZ3MgPSBbXTtcbiAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgIGZvciAodmFyIG4gPSBpICsgMTsgbiA8IGxpbmVTeW1ib2xzVGFncy5sZW5ndGg7IG4rKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbGluZVN5bWJvbHNUYWdzW25dO1xuICAgICAgICAgICAgICAgIGlmIChmaXJzdEl0ZW0gPT0gaXRlbSAmJiBpdGVtICE9IHByZXZpb3VzSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAvL2FkZCBpdGVtcyB0byBsaW5lIGNvbWJpbmF0aW9uc1xuICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2gobik7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVDb21iaW5hdGlvbnNbZmlyc3RJdGVtXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ZXM6IGluZGV4ZXNcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGluZUNvbWJpbmF0aW9ucykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2sobGluZUNvbWJpbmF0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH0sXG4gICAgY2hlY2s6IGZ1bmN0aW9uIGNoZWNrKGxpbmVDb21iaW5hdGlvbnMsIHBheXRhYmxlVGFnKSB7XG5cbiAgICAgICAgLy9jaGVja3MgaWYgdGhlIGlkZW50aWNhbCBsaW5lIHN5bWJvbHMgZm91bmRcbiAgICAgICAgLy9hcmUgdmFsaWQgY29tYmluYXRpb25zIGZvciB0aGUgcGF5dGFibGVcblxuICAgICAgICAvKlxuICAgICAgICBOT1RFIHRoYXQgdGhlIHBheXRhYmxlIG9iamVjdCBzdHJ1Y3R1cmUgaXMgYXMgZm9sbG93XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RvcFRhZzpTVE9QX1RBRyxcbiAgICAgICAgICAgICAgICA1OlZBTFVFLFxuICAgICAgICAgICAgICAgIDM6VkFMVUUsXG4gICAgICAgICAgICAgICAgMjpWQUxVRVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBhbmQgcmUgcmV0dXJuIG9iamVjdCBpc1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIGluZGV4ZXM6W10sXG4gICAgICAgICAgICAgICAgd2lubmluZ1ZhbHVlOm51bWJlcixcbiAgICAgICAgICAgICAgICB3aW5uaW5nVGFnOm51bWJlclxuICAgICAgICAgICAgXVxuICAgICAgICAgICAgXG4gICAgICAgICovXG4gICAgICAgIHZhciBwYXl0YWJsZSA9IFBheVRhYmxlRGVmaW5pdGlvbihwYXl0YWJsZVRhZyk7XG4gICAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgdGFnIGluIGxpbmVDb21iaW5hdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChsaW5lQ29tYmluYXRpb25zLmhhc093blByb3BlcnR5KHRhZykpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0T2JqZWN0ID0gcGF5dGFibGUuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnN0b3BUYWcgPT0gdGFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2lubmluZ1ZhbHVlID0gcGFyc2VJbnQoaXRlbVtsaW5lQ29tYmluYXRpb25zW3RhZ10uaW5kZXhlcy5sZW5ndGhdLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbm5pbmdWYWx1ZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ZXM6IGxpbmVDb21iaW5hdGlvbnNbdGFnXS5pbmRleGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5uaW5nVmFsdWU6IGl0ZW1bbGluZUNvbWJpbmF0aW9uc1t0YWddLmluZGV4ZXMubGVuZ3RoXS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5uaW5nVGFnOiB0YWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Y4NmY1aXo1RE5KRHFvZ1JDNFQrT0h1JywgJ3BybmcnKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvcHJuZy5qc1xuXG4vL2RlZmluZXMgYSBwc2V1ZG8gcmFuZG9tIG51bWJlciBnZW5lcmF0b3JcbmZ1bmN0aW9uIFBSTkcoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLy8gUmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIChpbmNsdWRlZCkgYW5kIG1heCAoaW5jbHVkZWQpXG4gICAgICAgIC8vIFVzaW5nIE1hdGgucm91bmQoKSB3aWxsIGdpdmUgeW91IGEgbm9uLXVuaWZvcm0gZGlzdHJpYnV0aW9uIVxuICAgICAgICBuZXdWYWx1ZTogZnVuY3Rpb24gbmV3VmFsdWUobWluLCBtYXgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQUk5HO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnM2Q4MDVJUzhHZEtpNGZwRm9SQURlRHInLCAncmVlbCcpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9yZWVsLmpzXG5cbi8vZGVmaW5lcyBhIHNsb3QgcmVlbFxudmFyIFBSTkcgPSByZXF1aXJlKCdwcm5nJykoKTtcbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vUFVCTElDIFBST1BFUlRJRVNcbiAgICAgICAgLy9nZXRzL3NldHMgYW4gYXJyYXkgb2Ygc3RvcHMgdG8gZGVmaW5lIHRoZSByZWVsXG4gICAgICAgIHN0b3BzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IFtdLFxuICAgICAgICAgICAgdHlwZTogW2NjLlByZWZhYl1cbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIG1pbiB2YWx1ZSB1c2VkIHdpdGggdGhlIFBSTkcgY2xhc3NcbiAgICAgICAgcHJuZ01pblJhbmdlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDEsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBtYXggdmFsdWUgdXNlZCB3aXRoIHRoZSBQUk5HIGNsYXNzXG4gICAgICAgIHBybmdNYXhSYW5nZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAxMDAwMDAwMDAwLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL1BSSVZBVEUgUFJPUEVSVElFU1xuICAgICAgICAvL2dldHMvc2V0cyBhbiBhcnJheSBvZiBjYy5Ob2RlIG1hZGUgaW5zdGFudGlhdGluZyBlYWNoIHN0b3BcbiAgICAgICAgLy9kZWZpbmVkIGluIHRvIHRoZSBwdWJsaWMgc3RvcHMgYXJyYXkgcHJvcGVydHlcbiAgICAgICAgc3RvcE5vZGVzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IFtdLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBbY2MuTm9kZV1cbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGxhc3Qgbm9kZSBvZiB0aGUgcmVlbCB0aGF0XG4gICAgICAgIC8vZHVyaW5nIHRoZSByZWVsIG1vdGlvbiB3aWxsIGJlIGRpbmFtaWNhbGx5IHVwZGF0ZWRcbiAgICAgICAgdGFpbE5vZGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyBob3cgbWFueSBzdG9wcyBhcmUgdmlzaWJsZSBvbiB0aGUgcmVlbCBjb250YWluZXJcbiAgICAgICAgdmlzaWJsZVN0b3BzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDMsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGFkamFjZW50IHZlcnRpY2FsIHNwYWNlIGJldHdlZW4gdHdvIHN0b3BzXG4gICAgICAgIHBhZGRpbmc6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgaGVpZ2h0IG9mIGVhY2ggc3RvcFxuICAgICAgICBzdG9wSGVpZ2h0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGFtb3VudCBvZiB0aGUgWSB0cmFuc2xhdGlvbiB0aGF0IGRlZmluZSB0aGUgcmVlbCBtb3Rpb25cbiAgICAgICAgc3RlcFk6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyBob3cgbWFueSB0aW1lIHRoZSByZWVsIHJvbGxpbmcgaGFwcGVuZWRcbiAgICAgICAgcm9sbGluZ0NvdW50OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIHdpbm5lciByZWVsIGluZGV4IGNhbGN1bGF0ZWQgcmFuZG9tbHlcbiAgICAgICAgd2lubmVySW5kZXg6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyBob3cgbWFueSB0aW1lcyB0aGUgcmVlbCB3aWxsIHJvbGwgYmVmb3Igc3RvcCBvbiB0aGUgd2lubmVyIHN5bWJvbHMgKGNhbGN1bGF0ZWQgcmFuZG9tbHkpXG4gICAgICAgIHN0b3BBZnRlclJvbGxpbmdDb3VudDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBZIG9mIHRoZSB3aW5uZXIgbGluZVxuICAgICAgICB3aW5uZXJMaW5lWToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIGEgZmxhZyB0aGF0IGluZGljYXRlIGlmIHRoZSByb2xsaW5nIGlzIGNvbXBsZXRlZFxuICAgICAgICBpc1JvbGxpbmdDb21wbGV0ZWQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogZmFsc2UsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cbiAgICAgICAgLy9zZXRzIHRoZSB3aW5uciBsaW5lIFkgYXQgdGhlIG1pZGRsZSBvZiB0aGUgbm9kZSBoZWlnaHRcbiAgICAgICAgdGhpcy53aW5uZXJMaW5lWSA9IHRoaXMubm9kZS5oZWlnaHQgLyAyO1xuXG4gICAgICAgIC8vc2V0cyB0aGUgc3RvcCBoZWlnaHQgdXNpbmcgdGhlIGZpcnN0IHN0b3BcbiAgICAgICAgdmFyIGZpcnN0U3RvcCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc3RvcHNbMF0pO1xuICAgICAgICB0aGlzLnN0b3BIZWlnaHQgPSBmaXJzdFN0b3AuaGVpZ2h0O1xuXG4gICAgICAgIC8vcGFkZGluZzogaXMgdGhlIHNwYWNlIGJldHdlZW4gdHdvIGFkamFjZW50IG5vZGVzXG4gICAgICAgIHRoaXMucGFkZGluZyA9ICh0aGlzLm5vZGUuaGVpZ2h0IC0gdGhpcy52aXNpYmxlU3RvcHMgKiB0aGlzLnN0b3BIZWlnaHQpIC8gKHRoaXMudmlzaWJsZVN0b3BzICsgMSk7XG5cbiAgICAgICAgLy9zZXRzIHRoZSBhbW91bnQgb2YgdGhlIFkgdHJhbnNsYXRpb24gdGhhdCBkZWZpbmUgdGhlIHJlZWwgbW90aW9uXG4gICAgICAgIHRoaXMuc3RlcFkgPSB0aGlzLnN0b3BIZWlnaHQgLyA1O1xuXG4gICAgICAgIC8vY29uc2lkZXJpbmcgdGhhdCB0aGUgYW5jaG9yIHBvaW50IG9mIHRoZSByZWVsIGlzIGF0ICgwLDApXG4gICAgICAgIC8vdGhpcyBsb29wIHdpbGwgbGF5b3UgYWxsIHRoZSBzdG9wcyBvbiB0aGUgbm9kZSAocmVlbClcbiAgICAgICAgdmFyIHN0YXJ0WSA9IHRoaXMubm9kZS5oZWlnaHQgLSB0aGlzLnBhZGRpbmcgLSB0aGlzLnN0b3BIZWlnaHQ7XG4gICAgICAgIHZhciBzdGFydFggPSB0aGlzLm5vZGUud2lkdGggLyAyIC0gZmlyc3RTdG9wLndpZHRoIC8gMjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzdG9wID0gY2MuaW5zdGFudGlhdGUodGhpcy5zdG9wc1tpXSk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQoc3RvcCk7XG4gICAgICAgICAgICBzdG9wLnNldFBvc2l0aW9uKGNjLnAoc3RhcnRYLCBzdGFydFkpKTtcbiAgICAgICAgICAgIHN0YXJ0WSA9IHN0YXJ0WSAtIHRoaXMucGFkZGluZyAtIHRoaXMuc3RvcEhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuc3RvcE5vZGVzLnB1c2goc3RvcCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YWlsTm9kZSA9IHRoaXMuc3RvcE5vZGVzW3RoaXMuc3RvcE5vZGVzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIHRoaXMuaXNSb2xsaW5nQ29tcGxldGVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXG4gICAgICAgIGlmICh0aGlzLmlzUm9sbGluZ0NvbXBsZXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy90aGUgbG9vcCBiZWxvdyB3aWxsIG1vb3ZlIGVhY2ggc3RvcCBvZiB0aGUgc2V0cFkgYW1vdW50LlxuICAgICAgICAvL1doZW4gdGhlIGZpcnN0IHN0b3AgaXMgb24gdGhlIHRvcCBvZiB0aGUgbm9kZSwgd2lsbCBiZSBtb3ZlZCBhZnRlciB0aGUgZmlyc3QgYW5kIHdpbGwgYmUgc2V0IGFzIHRhaWwuXG4gICAgICAgIC8vRm9yIGZ1cnRoZXIgaW5mb3JtdGFpb24gdGFrZSBhIGxvb2sgdG8gdGhlIG9ubGluZSBnaXRodWIgZG9jdW1lbnRhdGlvblxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdG9wTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzdG9wID0gdGhpcy5zdG9wTm9kZXNbaV07XG4gICAgICAgICAgICBzdG9wLnkgPSBzdG9wLnkgKyB0aGlzLnN0ZXBZO1xuICAgICAgICAgICAgaWYgKHN0b3AueSAtIHRoaXMucGFkZGluZyA+IHRoaXMubm9kZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSArIDEgPT0gdGhpcy5zdG9wTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9sbGluZ0NvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0b3AueSA9IHRoaXMudGFpbE5vZGUueSAtIHRoaXMudGFpbE5vZGUuaGVpZ2h0IC0gdGhpcy5wYWRkaW5nO1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbE5vZGUgPSBzdG9wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zdG9wQWZ0ZXJSb2xsaW5nQ291bnQgPT0gdGhpcy5yb2xsaW5nQ291bnQgJiYgaSA9PSB0aGlzLndpbm5lckluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0b3AueSA+PSB0aGlzLndpbm5lckxpbmVZKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLndpbm5lckluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL21vdmUgdGhlIHRhaWwgbm9kZSBiZWZvcmUgdGhlIGZpcnN0IHN0b3AgKGluZGV4PT09MClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFpbE5vZGUueSA9IHN0b3AueSArIHN0b3AuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLnRhaWxOb2RlLnNldFBvc2l0aW9uKGNjLnAoc3RvcC54LCBzdG9wLnkgKyBzdG9wLmhlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWlsTm9kZSA9IHRoaXMuc3RvcE5vZGVzW3RoaXMuc3RvcE5vZGVzLmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRZKHN0b3ApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUm9sbGluZ0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgncm9sbGluZy1jb21wbGV0ZWQnLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICByZXNldFk6IGZ1bmN0aW9uIHJlc2V0WShjdXJyZW50U3RvcCkge1xuICAgICAgICAvL2FwcGxpZXMgYSBjb3JyZWN0aW9uIHRvIGFsbCB0aGUgWSBzdG9wcyBhZnRlciB0aGF0XG4gICAgICAgIC8vIHRoZSByZWVsIGhhcyBiZWVuIHN0b3BwZWQuXG4gICAgICAgIHZhciBkZWx0YVkgPSBjdXJyZW50U3RvcC55IC0gdGhpcy53aW5uZXJMaW5lWSArIGN1cnJlbnRTdG9wLmhlaWdodCAvIDI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdG9wTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBuZXdTdG9wID0gdGhpcy5zdG9wTm9kZXNbaV07XG4gICAgICAgICAgICBuZXdTdG9wLnkgPSBuZXdTdG9wLnkgLSBkZWx0YVk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNwaW46IGZ1bmN0aW9uIHNwaW4oKSB7XG4gICAgICAgIC8vc3RhcnQgdGhlIHJlZWwgc3Bpbm5pbmdcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vVE9ETzogaXQgZGVwZW5kcyBvZiB0aGUgbnVtZWJlciBvZiByZWVsIHN0b3BzXG4gICAgICAgIHZhciBtaW4gPSAxO1xuICAgICAgICB2YXIgbWF4ID0gMjtcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICB0aGlzLnJvbGxpbmdDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3RvcEFmdGVyUm9sbGluZ0NvdW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbiAgICAgICAgLy9QUk5HXG4gICAgICAgIC8vZ2V0cyByYW5kb20gdmFsdWUgd2l0aCBQUk5HIGNsYXNzIGJldHdlZW4gYSBtaW4gYW5kIG1heCB2YWx1ZVxuICAgICAgICB2YXIgcmFuZG9tVmFsdWUgPSBQUk5HLm5ld1ZhbHVlKHRoaXMucHJuZ01pblJhbmdlLCB0aGlzLnBybmdNYXhSYW5nZSk7XG4gICAgICAgIC8vbm9ybWFsaXplIHdpdGggdGhlIG51bWJlciBvZiBzdG9wc1xuICAgICAgICB0aGlzLndpbm5lckluZGV4ID0gcmFuZG9tVmFsdWUgJSB0aGlzLnN0b3BzLmxlbmd0aDtcblxuICAgICAgICB0aGlzLmlzUm9sbGluZ0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICAvL2NvbnNvbGUubG9nICh0aGlzLnN0b3BBZnRlclJvbGxpbmdDb3VudCArIFwiLVwiICsgdGhpcy53aW5uZXJJbmRleCk7XG4gICAgfSxcbiAgICBnZXRXaW5uZXJTdG9wOiBmdW5jdGlvbiBnZXRXaW5uZXJTdG9wKCkge1xuICAgICAgICAvL3JldHVybnMgdGhlIHJlZWwgd2lubnJlIGluZGV4XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3BOb2Rlc1t0aGlzLndpbm5lckluZGV4XTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2IxZjhmY0N5VWxBUVlYS2xhM1lEWDUvJywgJ3N0b3AtdGFncycpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9zdG9wLXRhZ3MuanNcblxuLy9kZWZpbmVzIHRoZSBzdG9wIHRhZ3NcbmZ1bmN0aW9uIFN0b3BUYWdzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIEJBTkFOQTogMSxcbiAgICAgICAgQkVHQU1PVDogMixcbiAgICAgICAgQk9OVVM6IDMsXG4gICAgICAgIENPQ0tUQUlMOiA0LFxuICAgICAgICBDT0NPRFJJTEU6IDUsXG4gICAgICAgIEtBS0FEVTogNixcbiAgICAgICAgTElPTjogNyxcbiAgICAgICAgTUFOOiA4LFxuICAgICAgICBNT05LRVk6IDlcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3BUYWdzO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnN2M5ZDkyK0lPQk1HS3dTVENoU29JVmknLCAnc3RvcCcpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9zdG9wLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB0YWc6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiAwLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICBibGlua1RpbWVyOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGJsaW5rQ291bnRlcjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuICAgIGJsaW5rOiBmdW5jdGlvbiBibGluaygpIHtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuYmxpbmtUaW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdGhhdC5ibGlua0NvdW50ZXIrKztcbiAgICAgICAgICAgIHRoYXQubm9kZS5hY3RpdmUgPT09IHRydWUgPyB0aGF0Lm5vZGUuYWN0aXZlID0gZmFsc2UgOiB0aGF0Lm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGF0LmJsaW5rQ291bnRlciA9PSAxMCkge1xuICAgICAgICAgICAgICAgIHRoYXQuYmxpbmtDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgICB0aGF0Lm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoYXQuYmxpbmtUaW1lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDMwMCk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7Il19
