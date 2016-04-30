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
        return data;
    },
    setCurrentCredit: function setCurrentCredit(value) {
        this.setItem.getItem(UserDefaultKeys.CURRENT_CREDIT, value);
    }
});

cc._RFpop();
},{"user-default-keys":"user-default-keys"}]},{},["game","user-default-keys","reel","paytable-definition","on-off-button","stop","paytable","audio-manager","user-default","stop-tags","paytable-tags","prng"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvYXVkaW8tbWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL2dhbWUuanMiLCJhc3NldHMvc2NyaXB0cy91aS9vbi1vZmYtYnV0dG9uLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvcGF5dGFibGUtZGVmaW5pdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL3BheXRhYmxlLXRhZ3MuanMiLCJhc3NldHMvc2NyaXB0cy9jb250cm9sbGVycy9wYXl0YWJsZS5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL3BybmcuanMiLCJhc3NldHMvc2NyaXB0cy9jb250cm9sbGVycy9yZWVsLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvc3RvcC10YWdzLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvc3RvcC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbnRyb2xsZXJzL3VzZXItZGVmYXVsdC1rZXlzLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29udHJvbGxlcnMvdXNlci1kZWZhdWx0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYTdkYmZLaCs1SkswNHI5YkxSU29QYTInLCAnYXVkaW8tbWFuYWdlcicpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9hdWRpby1tYW5hZ2VyLmpzXG5cbi8vL2RlaWZuZXMgYW4gaGVscGVyIChzaW5nbGV0b24pIGNsYXNzIHRvIHBsYXkgYXVzaW8gYXNzZXRzXG52YXIgQXVkaW9NYW5hZ2VyID0gY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vUFVCTElDIFBST1BFUlRJRVNcbiAgICAgICAgLy90aGUgcHJvcGVydGllcyBiZWxvdyBkZWZpbmUgYWxsIHRoZSBhdWRpbyBjbGlwcyB0aGF0IHRoZSBjbGFzcyBjYW4gcGxheVxuICAgICAgICBjb2luc1dpbjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBjb2luc0luc2VydDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBqYWNrcG90V2luOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIGxpbmVXaW46IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgcmVlbFN0YXJ0OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIHJlZWxSb2xsOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIHJlZWxTdG9wOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vZGVmaW5lcyB0aGUgc3RhdGljIChzaW5nbGV0b24pIGluc3RhbmNlXG4gICAgc3RhdGljczoge1xuICAgICAgICBpbnN0YW5jZTogbnVsbFxuICAgIH0sXG5cbiAgICBwbGF5Q29pbnNXaW46IGZ1bmN0aW9uIHBsYXlDb2luc1dpbigpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKHRoaXMuY29pbnNXaW4sIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlDb2luc0luc2VydDogZnVuY3Rpb24gcGxheUNvaW5zSW5zZXJ0KCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuY29pbnNJbnNlcnQsIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlKYWNrcG90V2luOiBmdW5jdGlvbiBwbGF5SmFja3BvdFdpbigpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmphY2twb3RXaW4sIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlMaW5lV2luOiBmdW5jdGlvbiBwbGF5TGluZVdpbigpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmxpbmVXaW4sIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlSZWVsU3RhcnQ6IGZ1bmN0aW9uIHBsYXlSZWVsU3RhcnQoKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5yZWVsU3RhcnQsIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlSZWVsUm9sbDogZnVuY3Rpb24gcGxheVJlZWxSb2xsKCkge1xuICAgICAgICB0aGlzLnBsYXlTb3VuZCh0aGlzLnJlZWxSb2xsKTtcbiAgICB9LFxuICAgIHBsYXlSZWVsU3RvcDogZnVuY3Rpb24gcGxheVJlZWxTdG9wKCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMucmVlbFN0b3AsIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlTb3VuZDogZnVuY3Rpb24gcGxheVNvdW5kKGF1ZGlvQ2xpcCkge1xuICAgICAgICAvL2F1ZGlvIHBsYXlcbiAgICAgICAgaWYgKCFhdWRpb0NsaXApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWMoYXVkaW9DbGlwLCBmYWxzZSk7XG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy9pbml0IHRoZSBzaW5nbGV0b24gaW5zdGFuY2VcbiAgICAgICAgQXVkaW9NYW5hZ2VyLmluc3RhbmNlID0gdGhpcztcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTdhMTA3aE9BMURqSmRHTkRta0JkM3knLCAnZ2FtZScpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9nYW1lLmpzXG5cbi8vZGVmaW5lcyB0aGUgbWFpbiBkcml2ZXIgb2YgdGhlIGdhbWVcbnZhciBSZWVsID0gcmVxdWlyZSgncmVlbCcpLFxuICAgIE9uT2ZmQnV0dG9uID0gcmVxdWlyZSgnb24tb2ZmLWJ1dHRvbicpLFxuICAgIEF1ZGlvTWFuYWdlciA9IHJlcXVpcmUoJ2F1ZGlvLW1hbmFnZXInKSxcbiAgICBQYXlUYWJsZVRhZ3MgPSByZXF1aXJlKCdwYXl0YWJsZS10YWdzJykoKTtcbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vUFVCTElDIFBST1BFUlRJRVNcbiAgICAgICAgLy9nZXRzL3NldHMgYW4gYXJyYXkgb2YgUmVlbCB0eXBlIChzZWUgcmVlbC5qcyBhc3NldCkgdXNlZCB0byBkZWZpbmUgdGhlIHNsb3QgcmVlbHNcbiAgICAgICAgcmVlbHM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogW10sXG4gICAgICAgICAgICB0eXBlOiBbUmVlbF1cbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGluaXRpYWwgY3JlZGl0LlxuICAgICAgICBjdXJyZW50Q3JlZGl0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDEwMCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIGFtb3VudCBvZiB0aGUgXCJvbmUgYmV0XCIgbW9kZVxuICAgICAgICBiZXRPbmVWYWx1ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAxLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgYW1vdW50IG9mIHRoZSBcIm1heCBiZXRcIiBtb2RlXG4gICAgICAgIGJldE1heFZhbHVlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDUsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBPbk9mZiBzcGluIGJ1dHRvblxuICAgICAgICBzcGluQnV0dG9uOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBPbk9mZkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgT25PZmYgYXV0by1zcGluIGJ1dHRvblxuICAgICAgICBhdXRvU3BpbkJ1dHRvbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogT25PZmZCdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIE9uT2ZmIGJldCBvbmUgYnV0dG9uXG4gICAgICAgIGJldE9uZUJ1dHRvbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogT25PZmZCdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIE9uT2ZmIGJldCBtYXggYnV0dG9uXG4gICAgICAgIGJldE1heEJ1dHRvbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogT25PZmZCdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdG90YWwgYmV0IGxhYmVsXG4gICAgICAgIHRvdGFsQmV0TGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIGNyZWRpdCBsYWJlbFxuICAgICAgICBjcmVkaXRMYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgaW5mbyBsYWJlbFxuICAgICAgICBiZXRJbmZvTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIGhvdyBtYW55IHJlZWxzIGhhdmUgYmVlbiBjb21wbGV0ZWQgdGhlIHJvbGwgb3BlcmF0aW9uXG4gICAgICAgIHJvbGxpbmdDb21wbGV0ZWRDb3VudDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBmbGFnIHRoYXQgYWxsb3dzIHRvIHVuZGVyc2F0bmQgaWYgYWxsIHRoZSByZWVscyBoYXZlIGJlZW4gY29tcGxldGVkIGl0cyByb2xsaW5nIG9wZXJhdGlvblxuICAgICAgICBpc1JvbGxpbmdDb21wbGV0ZWQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSB0b3RhbCBiZXQgdmFsdWVcbiAgICAgICAgdG90YWxCZXRWYWx1ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBjdXJyZW50IGJldCB2YWx1ZSAoYmV0IG9uZSBvciBiZXQgbWF4KVxuICAgICAgICBjdXJyZW50QmV0VmFsdWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgY3VycmVudCBwYXl0YWJsZSB0YWcgKHNlZSBwYXl0YWJsZS10YWdzLmpzIGFzc2V0KVxuICAgICAgICBjdXJyZW50UGF5VGFibGVUYWc6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMgc2V0IHRoZSBhdXRvLXNwaW4gZmxhZ1xuICAgICAgICBpc0F1dG9TcGluOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IGZhbHNlLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIHRpbWVyIGluc3RhbmNlIHVzZWQgZm9yIHRoZSBhdXRvL3NwaW4gIHRpbWVvdXRcbiAgICAgICAgYXV0b1NwaW5UaW1lcjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgLy9zZXRzIHRoZSBhdmFpbGFibGUgY3JlZGl0LlxuICAgICAgICB0aGlzLmNyZWRpdExhYmVsLnN0cmluZyA9IHRoaXMuY3VycmVudENyZWRpdC50b1N0cmluZygpO1xuICAgICAgICAvL2luaXQgYmV0IGluZm8gbGFiZWxcbiAgICAgICAgdGhpcy5iZXRJbmZvTGFiZWwuc3RyaW5nID0gXCJcIjtcblxuICAgICAgICAvL2ltcGxlbWVudHMgdGhlIHNwaW4gYnV0dG9uIG9uL29mZiBldmVudFxuICAgICAgICB0aGlzLnNwaW5CdXR0b24ubm9kZS5vbigncmVlbC1zcGluJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLmlzT24pIHtcbiAgICAgICAgICAgICAgICAvL3BsYXkgdGhlIGdhbWVcbiAgICAgICAgICAgICAgICB0aGF0LnNwaW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vaW1wbGVtZW50cyB0aGUgYXV0by1zcGluIGJ1dHRvbiBvbi9vZmYgZXZlbnRcbiAgICAgICAgdGhpcy5hdXRvU3BpbkJ1dHRvbi5ub2RlLm9uKCdyZWVsLWF1dG8tc3BpbicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy9wbGF5IHRoZSBnYW1lIGFzIHNpbmdsZSBzcGluIG9yIGF1dG8tc3BpblxuICAgICAgICAgICAgdGhhdC5pc0F1dG9TcGluID09PSB0cnVlID8gdGhhdC5pc0F1dG9TcGluID0gZmFsc2UgOiB0aGF0LmlzQXV0b1NwaW4gPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoYXQuaXNBdXRvU3Bpbikge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5kZXRhaWwuaXNPbikge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnNwaW4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGF0LmF1dG9TcGluVGltZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy9pbXBsZW1lbnRzIHRoZSBiZXQgb25lIGJ1dHRvbiBvbi9vZmYgZXZlbnRcbiAgICAgICAgdGhpcy5iZXRPbmVCdXR0b24ubm9kZS5vbignYmV0LW9uZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmRldGFpbC5pc09uKSB7XG4gICAgICAgICAgICAgICAgLy93aGVuIHRoaXMgYnV0dG9uIGlzIHB1c2hlZCBkb3duIHRoZSBiZXQgbWF4IGJ1dHRvbiB3aWxsIGJlIHJlc2V0XG4gICAgICAgICAgICAgICAgdGhhdC5iZXRNYXhCdXR0b24ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAvL3NldCBiZXQgdmFsdWVcbiAgICAgICAgICAgICAgICB0aGF0LmN1cnJlbnRCZXRWYWx1ZSA9IHRoYXQuYmV0T25lVmFsdWU7XG4gICAgICAgICAgICAgICAgdGhhdC5jdXJyZW50UGF5VGFibGVUYWcgPSBQYXlUYWJsZVRhZ3MuQkVUX09ORTtcbiAgICAgICAgICAgICAgICB0aGF0LmJldEluZm9MYWJlbC5zdHJpbmcgPSB0aGF0LmN1cnJlbnRCZXRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5pbnN0YW5jZS5wbGF5Q29pbnNJbnNlcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vaW1wbGVtZW50cyB0aGUgYmV0LW1heCBidXR0b24gb24vb2ZmIGV2ZW50XG4gICAgICAgIHRoaXMuYmV0TWF4QnV0dG9uLm5vZGUub24oJ2JldC1tYXgnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5kZXRhaWwuaXNPbikge1xuICAgICAgICAgICAgICAgIC8vd2hlbiB0aGlzIGJ1dHRvbiBpcyBwdXNoZWQgZG93biB0aGUgYmV0IG9uZSBidXR0b24gd2lsbCBiZSByZXNldFxuICAgICAgICAgICAgICAgIHRoYXQuYmV0T25lQnV0dG9uLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgLy9zZXQgYmV0IHZhbHVlXG4gICAgICAgICAgICAgICAgdGhhdC5jdXJyZW50QmV0VmFsdWUgPSB0aGF0LmJldE1heFZhbHVlO1xuICAgICAgICAgICAgICAgIHRoYXQuY3VycmVudFBheVRhYmxlVGFnID0gUGF5VGFibGVUYWdzLkJFVF9NQVg7XG4gICAgICAgICAgICAgICAgdGhhdC5iZXRJbmZvTGFiZWwuc3RyaW5nID0gdGhhdC5jdXJyZW50QmV0VmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIuaW5zdGFuY2UucGxheUNvaW5zSW5zZXJ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvL2ltcGxlbWVudHMgdGhlIHJvbGxpbmcgY29tcGxldGVkIGV2ZW50IG9mIHRoZSByZWxsLmpzIGNsYXNzXG4gICAgICAgIHRoaXMubm9kZS5vbigncm9sbGluZy1jb21wbGV0ZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vdGhpcyBtZXRob2QgY291bnRzIGFsbCB0aGUgY29tcGxldGVkIHJvbGxpbmcgcmVlbHMgYW5kIGV2YWx1YXRlIHRoZSByZXN1bHRzXG4gICAgICAgICAgICAvL2lmIGFsbCB0aGUgcmVsbHMgaGF2ZSBiZWVuIGZpbmlzaGVkIHRvIHJvbGwuXG4gICAgICAgICAgICB0aGF0LnJvbGxpbmdDb21wbGV0ZWRDb3VudCsrO1xuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnBsYXlSZWVsU3RvcCgpO1xuXG4gICAgICAgICAgICBpZiAodGhhdC5yb2xsaW5nQ29tcGxldGVkQ291bnQgPT0gdGhhdC5yZWVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnJvbGxpbmdDb21wbGV0ZWRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgLy9nZXRzIHRoZSBsaW5lIHN5bWJvbHMgdGFnc1xuICAgICAgICAgICAgICAgIHZhciBsaW5lU3ltYm9sc1RhZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBsaW5lU3ltYm9sc1RhZ3MgPSB0aGF0LmdldExpbmVTeW1ib2xzVGFnKCk7XG5cbiAgICAgICAgICAgICAgICAvL2NyZWF0ZSBhIHBheXRhYmxlIGluc3RhbmNlIGFuZCBjaGVja3MgaWYgdGhlIHRhZyBzeW1ib2xzIGlzIGEgd2lubmluZyBjb21iaW5hdGlvblxuICAgICAgICAgICAgICAgIHZhciBwYXl0YWJsZSA9IHRoYXQuZ2V0Q29tcG9uZW50KFwicGF5dGFibGVcIiksXG4gICAgICAgICAgICAgICAgICAgIHBheXRhYmxlUmV0ID0gcGF5dGFibGUuaXNXaW5uaW5nKGxpbmVTeW1ib2xzVGFncywgdGhhdC5jdXJyZW50UGF5VGFibGVUYWcpLFxuICAgICAgICAgICAgICAgICAgICBpc1dpbm5pbmcgPSBPYmplY3Qua2V5cyhwYXl0YWJsZVJldCkubGVuZ3RoID4gMDtcblxuICAgICAgICAgICAgICAgIGlmIChpc1dpbm5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9XT04hISFcbiAgICAgICAgICAgICAgICAgICAgLy9pZiB3b24gc3BpbiBhbmQgYXV0by1zcGluIHdpbGwgc3RvcCB0aGUgZXhlY3V0aW9uXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaXNSb2xsaW5nQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5pc0F1dG9TcGluID8gdGhhdC5hdXRvU3BpbkJ1dHRvbi5yZXNldCgpIDogdGhhdC5zcGluQnV0dG9uLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaXNBdXRvU3BpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAvL3BsYXkgc291bmRcbiAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnBsYXlMaW5lV2luKCk7XG4gICAgICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5pbnN0YW5jZS5wbGF5Q29pbnNXaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgLy9zaG93IHdpbm5pbmcgc3ltYm9scyAoYW5pbWF0aW9uKVxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNob3dXaW5uaW5nU3ltYm9sc0FuZFBheShwYXl0YWJsZVJldCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9MT1NUIHVwZGF0ZSBjcmVkaXRcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5jdXJyZW50Q3JlZGl0IC09IHRoYXQuY3VycmVudEJldFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmJldEluZm9MYWJlbC5zdHJpbmcgPSAoLXRoYXQuY3VycmVudEJldFZhbHVlKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmNyZWRpdExhYmVsLnN0cmluZyA9IHRoYXQuY3VycmVudENyZWRpdC50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC5pc0F1dG9TcGluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NwaW4gY29tcGxldGVkXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmlzUm9sbGluZ0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNwaW5CdXR0b24ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuYXV0b1NwaW5UaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYXV0by1zcGluIGNvbXBsZXRlZC4uLndpbGwgcmVzdGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc3BpbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuaXNSb2xsaW5nQ29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdW5sb2NrcyBhbGwgYnV0dG9uc1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnNldEJ1dHRvbnNMb2NrZWQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzcGluOiBmdW5jdGlvbiBzcGluKCkge1xuXG4gICAgICAgIC8vY2hlY2tzIGlmIHRoZXJlIGlzIGVub3VnaCBjcmVkaXQgdG8gcGxheVxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q3JlZGl0ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy9yZXNldCBsYWJlbCBpbmZvIHdpdGggY3VycmVudCBiZXQgdmFsdWVcbiAgICAgICAgdGhpcy5iZXRJbmZvTGFiZWwuc3RyaW5nID0gdGhpcy5jdXJyZW50QmV0VmFsdWUudG9TdHJpbmcoKTtcblxuICAgICAgICBpZiAodGhpcy5pc1JvbGxpbmdDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgIC8vc2V0cyB0b3RhbCBiZXQgTGFiZWxcbiAgICAgICAgICAgIHRoaXMudG90YWxCZXRWYWx1ZSArPSB0aGlzLmN1cnJlbnRCZXRWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMudG90YWxCZXRMYWJlbC5zdHJpbmcgPSB0aGlzLnRvdGFsQmV0VmFsdWUudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQXV0b1NwaW4pIHtcbiAgICAgICAgICAgICAgICAvL3RoaXMuc3BpbkJ1dHRvbi5pc0xvY2tlZD10cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNSb2xsaW5nQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2xvY2tzIGFsbCBidXR0b25zXG4gICAgICAgICAgICB0aGlzLnNldEJ1dHRvbnNMb2NrZWQodHJ1ZSk7XG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuaW5zdGFuY2UucGxheVJlZWxSb2xsKCk7XG4gICAgICAgICAgICAvL3N0YXJ0cyByZWVscyBzcGluXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxzW2ldLnNwaW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0QnV0dG9uc0xvY2tlZDogZnVuY3Rpb24gc2V0QnV0dG9uc0xvY2tlZChpc0xvY2tlZCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBdXRvU3Bpbikge1xuICAgICAgICAgICAgdGhpcy5hdXRvU3BpbkJ1dHRvbi5pc0xvY2tlZCA9IGlzTG9ja2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zcGluQnV0dG9uLmlzTG9ja2VkID0gaXNMb2NrZWQ7XG4gICAgICAgIHRoaXMuYmV0T25lQnV0dG9uLmlzTG9ja2VkID0gaXNMb2NrZWQ7XG4gICAgICAgIHRoaXMuYmV0TWF4QnV0dG9uLmlzTG9ja2VkID0gaXNMb2NrZWQ7XG4gICAgfSxcbiAgICBnZXRMaW5lU3ltYm9sc1RhZzogZnVuY3Rpb24gZ2V0TGluZVN5bWJvbHNUYWcoKSB7XG4gICAgICAgIHZhciBsaW5lU3ltYm9sc1RhZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCB0aGlzLnJlZWxzLmxlbmd0aDsgbSsrKSB7XG4gICAgICAgICAgICB2YXIgc3RvcE5vZGUgPSB0aGlzLnJlZWxzW21dLmdldFdpbm5lclN0b3AoKTtcbiAgICAgICAgICAgIHZhciBzdG9wQ29tcG9uZW50ID0gc3RvcE5vZGUuZ2V0Q29tcG9uZW50KFwic3RvcFwiKTtcbiAgICAgICAgICAgIGxpbmVTeW1ib2xzVGFncy5wdXNoKHN0b3BDb21wb25lbnQudGFnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGluZVN5bWJvbHNUYWdzO1xuICAgIH0sXG4gICAgLy9UT0RPIGNobmFnZSBuYW1lIG9mIHRoaXMgZnVuY3Rpb25cbiAgICBzaG93V2lubmluZ1N5bWJvbHNBbmRQYXk6IGZ1bmN0aW9uIHNob3dXaW5uaW5nU3ltYm9sc0FuZFBheShwYXl0YWJsZVJldCkge1xuXG4gICAgICAgIHZhciBzdG9wTm9kZSxcbiAgICAgICAgICAgIHN0b3BDb21wb25lbnQsXG4gICAgICAgICAgICB3aW5uaW5nQW1vdW50ID0gMDtcblxuICAgICAgICAvL2xvb3Agb24gIHRoZSB3aW5uaW5nIGNvbWJpbmF0aW9ucyB0aHJvdWdob3V0IHRoZSBzeW1ib2xzIGluZGV4XG4gICAgICAgIC8vbm90ZSB0aGF0IGl0J3MgcG9zc2libGUgdG8gaGF2ZSBvbmUgb3IgbW9yZSB3aW5uaW5nIGNvbWJpbmFpdG9uXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF5dGFibGVSZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gcGF5dGFibGVSZXRbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IGl0ZW0uaW5kZXhlcy5sZW5ndGg7IG4rKykge1xuICAgICAgICAgICAgICAgIHN0b3BOb2RlID0gdGhpcy5yZWVsc1tpdGVtLmluZGV4ZXNbbl1dLmdldFdpbm5lclN0b3AoKTtcbiAgICAgICAgICAgICAgICBzdG9wQ29tcG9uZW50ID0gc3RvcE5vZGUuZ2V0Q29tcG9uZW50KFwic3RvcFwiKTtcbiAgICAgICAgICAgICAgICBzdG9wQ29tcG9uZW50LmJsaW5rKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5uaW5nQW1vdW50ICs9IHBhcnNlSW50KGl0ZW0ud2lubmluZ1ZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vUEFZIHVwZGF0ZSBjcmVkaXRcbiAgICAgICAgdGhpcy5jdXJyZW50Q3JlZGl0ICs9IHdpbm5pbmdBbW91bnQ7XG4gICAgICAgIHRoaXMuYmV0SW5mb0xhYmVsLnN0cmluZyA9IHdpbm5pbmdBbW91bnQudG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy5jcmVkaXRMYWJlbC5zdHJpbmcgPSB0aGlzLmN1cnJlbnRDcmVkaXQudG9TdHJpbmcoKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNTM1N2JGOXk3cERqb1grZm1Ycm5XWTMnLCAnb24tb2ZmLWJ1dHRvbicpO1xuLy8gc2NyaXB0cy91aS9vbi1vZmYtYnV0dG9uLmpzXG5cbi8vZGVmaW5lcyBhIGNsYXNzIHRvIGltcGxlbWVudCBhbiBPbi9PZmYgYnV0dG9uXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy9QVUJMSUMgUFJPUEVSVElFU1xuICAgICAgICAvLy9nZXRzL3NldHMgdGhlIGV2ZW50IG5hbWUgdGhhdCB3aWxsIGJlIHJhaXNlZCB3bmVoIHRoZSBidXR0b24gaXMgdG91Y2hlZFxuICAgICAgICBtb3VzZURvd25OYW1lOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogXCJvbi1vZmYtbW91c2Vkb3duXCJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIHNwcml0ZSBidXR0b25cbiAgICAgICAgc3ByaXRlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgdGV4dHVyZSB1cmwgZm9yIHRoZSBvbiBzdGF0dXNcbiAgICAgICAgc3ByaXRlVGV4dHVyZURvd25Vcmw6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiLFxuICAgICAgICAgICAgdXJsOiBjYy5UZXh0dXJlMkRcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIG9uIHN0YXR1c1xuICAgICAgICBpc09uOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgLy9QUklWQVRFIFBST1BFUlRJRVNcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIHRleHR1cmUgZm9yIHRoZSBvZmYgc3RhdHVzXG4gICAgICAgIHNwcml0ZVRleHR1cmVVcDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCIsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHVybDogY2MuVGV4dHVyZTJEXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBjYWNoZWQgdGV4dHVyZSBmb3IgdGhlIG9mZiBzdGF0dXNcbiAgICAgICAgc3ByaXRlVGV4dHVyZURvd246IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB1cmw6IGNjLlRleHR1cmUyRFxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgbG9ja2VkIHN0YXR1cy4gSWYgaXRzIHZhbHVlIGlzIHRydWUgbm8gYWN0aW9ucyB3aWxsIGJlIHBlcmZvcm1lZCBvbiB0aGUgdG91Y2ggZXZlbnRcbiAgICAgICAgaXNMb2NrZWQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgLy9zZXRzIHRoZSB0ZXh0dXJlIGZvciBvbi9vZmZcbiAgICAgICAgdGhpcy5zcHJpdGVUZXh0dXJlVXAgPSB0aGlzLnNwcml0ZS5fc3ByaXRlRnJhbWUuX3RleHR1cmU7XG4gICAgICAgIHRoaXMuc3ByaXRlVGV4dHVyZURvd24gPSBjYy50ZXh0dXJlQ2FjaGUuYWRkSW1hZ2UodGhpcy5zcHJpdGVUZXh0dXJlRG93blVybCk7XG5cbiAgICAgICAgLy9kZWZpbmVzIGFuZCBzZXRzIHRoZSB0b3VjaCBmdW5jdGlvbiBjYWxsYmFja3NcbiAgICAgICAgZnVuY3Rpb24gb25Ub3VjaERvd24oZXZlbnQpIHtcbiAgICAgICAgICAgIHRoYXQub25PZmYoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblRvdWNoVXAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vRE8gTk9USElOR1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hzdGFydCcsIG9uVG91Y2hEb3duLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub24oJ3RvdWNoZW5kJywgb25Ub3VjaFVwLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub24oJ3RvdWNoY2FuY2VsJywgb25Ub3VjaFVwLCB0aGlzLm5vZGUpO1xuICAgIH0sXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBpZiAodGhpcy5pc09uKSB7XG4gICAgICAgICAgICAvL2lmIHdlIHdhbnQgdG8gYWN0aXZhdGUgdGhlIGJ1dHRvbiBvbiB0aGUgc3RhcnQtdXBcbiAgICAgICAgICAgIC8vd2UgbmVlZCB0byBpbnZlcnQgdGhlIGluaXRpYWwgc3RhdHVzKGZsYWcpOiBzZWUgb25PZmYgZnVuY3Rpb25cbiAgICAgICAgICAgIHRoaXMuaXNPbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5vbk9mZigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbk9mZjogZnVuY3Rpb24gb25PZmYoKSB7XG4gICAgICAgIC8vdXBkYXRlcyB0aGUgdGV4dHVyZSBmb3IgdGhlIG9uL29mZiBzdGF0dXNcbiAgICAgICAgaWYgKHRoaXMuaXNMb2NrZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzT24pIHtcbiAgICAgICAgICAgIC8vc2V0IHRvIG9mZlxuICAgICAgICAgICAgdGhpcy51cGRhdGVTcHJpdGVGcmFtZSh0aGlzLnNwcml0ZSwgdGhpcy5zcHJpdGVUZXh0dXJlVXApO1xuICAgICAgICAgICAgdGhpcy5pc09uID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL3NldCB0byBvblxuICAgICAgICAgICAgdGhpcy51cGRhdGVTcHJpdGVGcmFtZSh0aGlzLnNwcml0ZSwgdGhpcy5zcHJpdGVUZXh0dXJlRG93bik7XG4gICAgICAgICAgICB0aGlzLmlzT24gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vZW1pdHMgdGhlIGV2ZW50XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KHRoaXMubW91c2VEb3duTmFtZSwge1xuICAgICAgICAgICAgaXNPbjogdGhpcy5pc09uXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICAvL3Jlc2V0cyB0aGUgYnV0dG9uIHdpdGggdGhlIG9mZiBzdGF0dXNcbiAgICAgICAgdGhpcy5pc09uID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNMb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVTcHJpdGVGcmFtZSh0aGlzLnNwcml0ZSwgdGhpcy5zcHJpdGVUZXh0dXJlVXApO1xuICAgIH0sXG4gICAgdXBkYXRlU3ByaXRlRnJhbWU6IGZ1bmN0aW9uIHVwZGF0ZVNwcml0ZUZyYW1lKHNwcml0ZSwgdGV4dHVyZSkge1xuICAgICAgICAvL3VwZGF0ZXMgdGhlIHNwcml0ZSB0ZXh0dXJlXG4gICAgICAgIGlmICghc3ByaXRlIHx8ICF0ZXh0dXJlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHcgPSBzcHJpdGUubm9kZS53aWR0aCxcbiAgICAgICAgICAgIGggPSBzcHJpdGUubm9kZS5oZWlnaHQsXG4gICAgICAgICAgICBmcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZSh0ZXh0dXJlLCBjYy5yZWN0KDAsIDAsIHcsIGgpKTtcbiAgICAgICAgc3ByaXRlLnNwcml0ZUZyYW1lID0gZnJhbWU7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzRiOTRiV2VyMkpMcjdEQTRTbVdYMk5BJywgJ3BheXRhYmxlLWRlZmluaXRpb24nKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvcGF5dGFibGUtZGVmaW5pdGlvbi5qc1xuXG4vL2RlZmluZXMgdGhlIHBheXRhYmxlc1xuXG4vKlxuUEFZIFRBQkxFIEJFVCBNQVhcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5TWU1CT0xcdFx0VE9UQUwgU1lNQk9MU1x0XHRcdDUvUiBcdFx0XHQzL1IgXHRcdFx0Mi9SXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQk9OVVNcdFx0XHQ1XHRcdFx0XHRcdDIwMDBcdFx0XHQxMDAwXHRcdFx0ODAwXG5CQU5BTkFcdFx0XHQxN1x0XHRcdFx0XHQzMDBcdFx0XHRcdDIwMCBcdFx0XHQxMDBcbkJFR0FNT1RcdFx0XHQxOVx0XHRcdFx0XHQyMDAgXHRcdFx0MTAwIFx0XHRcdDUwXG5DT0NPRFJJTEVcdFx0MTkgXHRcdFx0XHRcdDIwMCBcdFx0XHQxMDAgXHRcdFx0NTBcbkNPQ0tUQUlMXHRcdDE5IFx0XHRcdFx0XHQyMDAgXHRcdFx0MTAwIFx0XHRcdC0tXG5LQUtBRFVcdFx0XHQyMCBcdFx0XHRcdFx0MTAwIFx0XHRcdDc1XHRcdFx0XHQtLVxuTUFOXHRcdFx0XHQyMCBcdFx0XHRcdFx0MTAwIFx0XHRcdDc1XHRcdFx0XHQtLVxuTU9OS0VZXHRcdFx0MjAgXHRcdFx0XHRcdDEwMCBcdFx0XHQ3NVx0XHRcdFx0LS1cbkxJT05cdFx0XHQyMVx0XHRcdFx0XHQ1MFx0XHRcdFx0MjVcdFx0XHRcdC0tXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5QQVkgVEFCTEUgQkVUIE9ORVxuXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuU1lNQk9MXHRcdFRPVEFMIFNZTUJPTFNcdFx0XHQ1L1IgXHRcdFx0My9SIFx0XHRcdDIvUlxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkJPTlVTXHRcdFx0NVx0XHRcdFx0XHQyMDAgXHRcdFx0MTAwIFx0XHRcdDUwXG5CQU5BTkFcdFx0XHQxN1x0XHRcdFx0XHQxMDBcdFx0XHRcdDIwICBcdFx0XHQxMFxuQkVHQU1PVFx0XHRcdDE5XHRcdFx0XHRcdDUwICBcdFx0XHQxMCAgXHRcdFx0NVxuQ09DT0RSSUxFXHRcdDE5IFx0XHRcdFx0XHQ1MCAgXHRcdFx0MTAgIFx0XHRcdDVcbkNPQ0tUQUlMXHRcdDE5IFx0XHRcdFx0XHQyMCAgXHRcdFx0MTAgIFx0XHRcdDJcbktBS0FEVVx0XHRcdDIwIFx0XHRcdFx0XHQxMCAgXHRcdFx0NVx0XHRcdFx0MlxuTUFOXHRcdFx0XHQyMCBcdFx0XHRcdFx0MTAgIFx0XHRcdDVcdFx0XHRcdDJcbk1PTktFWVx0XHRcdDIwIFx0XHRcdFx0XHQxMCAgXHRcdFx0NVx0XHRcdFx0MVxuTElPTlx0XHRcdDIxXHRcdFx0XHRcdDVcdFx0XHRcdDJcdFx0XHRcdDFcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiovXG4vKlxucGF5dGFibGUgb2JqZWN0IHN0cnVjdHVyZVxuICAgIHtcbiAgICAgICAgc3RvcFRhZzpTVE9QX1RBRyxcbiAgICAgICAgNTpWQUxVRSxcbiAgICAgICAgMzpWQUxVRSxcbiAgICAgICAgMjpWQUxVRVxuICAgIH1cbiovXG52YXIgU3RvcFRhZ3MgPSByZXF1aXJlKCdzdG9wLXRhZ3MnKSgpLFxuICAgIFBheVRhYmxlVGFncyA9IHJlcXVpcmUoJ3BheXRhYmxlLXRhZ3MnKSgpO1xudmFyIHBheXRhYmxlQmV0TWF4ID0gW3tcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5CT05VUyxcbiAgICA1OiAyMDAwLFxuICAgIDM6IDEwMDAsXG4gICAgMjogODAwXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuQkFOQU5BLFxuICAgIDU6IDMwMCxcbiAgICAzOiAyMDAsXG4gICAgMjogMTAwXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuQkVHQU1PVCxcbiAgICA1OiAyMDAsXG4gICAgMzogMTAwLFxuICAgIDI6IDUwXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuQ09DT0RSSUxFLFxuICAgIDU6IDIwMCxcbiAgICAzOiAxMDAsXG4gICAgMjogNTBcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5DT0NLVEFJTCxcbiAgICA1OiAyMDAsXG4gICAgMzogMTAwLFxuICAgIDI6IDVcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5LQUtBRFUsXG4gICAgNTogMTAwLFxuICAgIDM6IDc1LFxuICAgIDI6IDVcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5NQU4sXG4gICAgNTogMTAwLFxuICAgIDM6IDc1LFxuICAgIDI6IDVcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5NT05LRVksXG4gICAgNTogMTAwLFxuICAgIDM6IDc1LFxuICAgIDI6IDJcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5MSU9OLFxuICAgIDU6IDUwLFxuICAgIDM6IDI1LFxuICAgIDI6IDJcbn1dO1xudmFyIHBheXRhYmxlQmV0T25lID0gW3tcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5CT05VUyxcbiAgICA1OiAyMDAsXG4gICAgMzogMTAwLFxuICAgIDI6IDUwXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuQkFOQU5BLFxuICAgIDU6IDEwMCxcbiAgICAzOiAyMCxcbiAgICAyOiAxMFxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkJFR0FNT1QsXG4gICAgNTogNTAsXG4gICAgMzogMTAsXG4gICAgMjogNVxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkNPQ09EUklMRSxcbiAgICA1OiA1MCxcbiAgICAzOiAxMCxcbiAgICAyOiA1XG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuQ09DS1RBSUwsXG4gICAgNTogMjAsXG4gICAgMzogMTAsXG4gICAgMjogMlxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLktBS0FEVSxcbiAgICA1OiAxMCxcbiAgICAzOiA1LFxuICAgIDI6IDJcbn0sIHtcbiAgICBzdG9wVGFnOiBTdG9wVGFncy5NQU4sXG4gICAgNTogMTAsXG4gICAgMzogNSxcbiAgICAyOiAyXG59LCB7XG4gICAgc3RvcFRhZzogU3RvcFRhZ3MuTU9OS0VZLFxuICAgIDU6IDEwLFxuICAgIDM6IDUsXG4gICAgMjogMVxufSwge1xuICAgIHN0b3BUYWc6IFN0b3BUYWdzLkxJT04sXG4gICAgNTogNSxcbiAgICAzOiAyLFxuICAgIDI6IDFcbn1dO1xuXG52YXIgUGF5VGFibGVEZWZpbml0aW9uID0gZnVuY3Rpb24gUGF5VGFibGVEZWZpbml0aW9uKHBheXRhYmxlVGFnKSB7XG4gICAgc3dpdGNoIChwYXl0YWJsZVRhZykge1xuICAgICAgICBjYXNlIFBheVRhYmxlVGFncy5CRVRfT05FOlxuICAgICAgICAgICAgcmV0dXJuIHBheXRhYmxlQmV0T25lO1xuICAgICAgICBjYXNlIFBheVRhYmxlVGFncy5CRVRfTUFYOlxuICAgICAgICAgICAgcmV0dXJuIHBheXRhYmxlQmV0TWF4O1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHBheXRhYmxlQmV0T25lO1xuICAgIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IFBheVRhYmxlRGVmaW5pdGlvbjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2VhMmUyYWNWajFIbXBxM3NQY09BWW12JywgJ3BheXRhYmxlLXRhZ3MnKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvcGF5dGFibGUtdGFncy5qc1xuXG4vL2RlZmluZXMgdGhlIHBheXRiYWwgdGFnc1xuZnVuY3Rpb24gUGF5VGFibGVUYWdzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIEJFVF9PTkU6IDAsXG4gICAgICAgIEJFVF9NQVg6IDFcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBheVRhYmxlVGFncztcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzkxZjVmNWJWV3BGRFl2MlVNS0tYSlliJywgJ3BheXRhYmxlJyk7XG4vLyBzY3JpcHRzL2NvbnRyb2xsZXJzL3BheXRhYmxlLmpzXG5cbi8vZGVmaW5lcyB0aGUgbG9naWNvZiB0aGUgcGF5bGluZVxudmFyIFBheVRhYmxlRGVmaW5pdGlvbiA9IHJlcXVpcmUoJ3BheXRhYmxlLWRlZmluaXRpb24nKSxcbiAgICBTdG9wVGFncyA9IHJlcXVpcmUoJ3N0b3AtdGFncycpKCk7XG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuICAgIGlzV2lubmluZzogZnVuY3Rpb24gaXNXaW5uaW5nKGxpbmVTeW1ib2xzVGFncywgcGF5dGFibGVUYWcpIHtcbiAgICAgICAgLy9sb29wIHRocm91Z2hvdXQgYWxsIHRoZSBzeW1ib2wgdGFnc1xuICAgICAgICAvL2NoZWNraW5nIGZvciBhIHNlcXVlbmNlIG9mIGlkZW50aWNhbCBzeW1ib2wgdGFnc1xuICAgICAgICB2YXIgbGluZUNvbWJpbmF0aW9ucyA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVTeW1ib2xzVGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGZpcnN0SXRlbSA9IGxpbmVTeW1ib2xzVGFnc1tpXTtcbiAgICAgICAgICAgIHZhciBwcmV2aW91c0l0ZW0gPSBpID4gMCA/IGxpbmVTeW1ib2xzVGFnc1tpIC0gMV0gOiAtMTtcbiAgICAgICAgICAgIHZhciBpbmRleGVzID0gW107XG4gICAgICAgICAgICB2YXIgdGFncyA9IFtdO1xuICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgZm9yICh2YXIgbiA9IGkgKyAxOyBuIDwgbGluZVN5bWJvbHNUYWdzLmxlbmd0aDsgbisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBsaW5lU3ltYm9sc1RhZ3Nbbl07XG4gICAgICAgICAgICAgICAgaWYgKGZpcnN0SXRlbSA9PSBpdGVtICYmIGl0ZW0gIT0gcHJldmlvdXNJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYWRkIGl0ZW1zIHRvIGxpbmUgY29tYmluYXRpb25zXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChuKTtcbiAgICAgICAgICAgICAgICAgICAgbGluZUNvbWJpbmF0aW9uc1tmaXJzdEl0ZW1dID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhlczogaW5kZXhlc1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5lQ29tYmluYXRpb25zKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhsaW5lQ29tYmluYXRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfSxcbiAgICBjaGVjazogZnVuY3Rpb24gY2hlY2sobGluZUNvbWJpbmF0aW9ucywgcGF5dGFibGVUYWcpIHtcblxuICAgICAgICAvL2NoZWNrcyBpZiB0aGUgaWRlbnRpY2FsIGxpbmUgc3ltYm9scyBmb3VuZFxuICAgICAgICAvL2FyZSB2YWxpZCBjb21iaW5hdGlvbnMgZm9yIHRoZSBwYXl0YWJsZVxuXG4gICAgICAgIC8qXG4gICAgICAgIE5PVEUgdGhhdCB0aGUgcGF5dGFibGUgb2JqZWN0IHN0cnVjdHVyZSBpcyBhcyBmb2xsb3dcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdG9wVGFnOlNUT1BfVEFHLFxuICAgICAgICAgICAgICAgIDU6VkFMVUUsXG4gICAgICAgICAgICAgICAgMzpWQUxVRSxcbiAgICAgICAgICAgICAgICAyOlZBTFVFXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFuZCByZSByZXR1cm4gb2JqZWN0IGlzXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgaW5kZXhlczpbXSxcbiAgICAgICAgICAgICAgICB3aW5uaW5nVmFsdWU6bnVtYmVyLFxuICAgICAgICAgICAgICAgIHdpbm5pbmdUYWc6bnVtYmVyXG4gICAgICAgICAgICBdXG4gICAgICAgICAgICBcbiAgICAgICAgKi9cbiAgICAgICAgdmFyIHBheXRhYmxlID0gUGF5VGFibGVEZWZpbml0aW9uKHBheXRhYmxlVGFnKTtcbiAgICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgICBmb3IgKHZhciB0YWcgaW4gbGluZUNvbWJpbmF0aW9ucykge1xuICAgICAgICAgICAgaWYgKGxpbmVDb21iaW5hdGlvbnMuaGFzT3duUHJvcGVydHkodGFnKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXRPYmplY3QgPSBwYXl0YWJsZS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uc3RvcFRhZyA9PSB0YWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aW5uaW5nVmFsdWUgPSBwYXJzZUludChpdGVtW2xpbmVDb21iaW5hdGlvbnNbdGFnXS5pbmRleGVzLmxlbmd0aF0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lubmluZ1ZhbHVlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhlczogbGluZUNvbWJpbmF0aW9uc1t0YWddLmluZGV4ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbm5pbmdWYWx1ZTogaXRlbVtsaW5lQ29tYmluYXRpb25zW3RhZ10uaW5kZXhlcy5sZW5ndGhdLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbm5pbmdUYWc6IHRhZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjg2ZjVpejVETkpEcW9nUkM0VCtPSHUnLCAncHJuZycpO1xuLy8gc2NyaXB0cy9jb250cm9sbGVycy9wcm5nLmpzXG5cbi8vZGVmaW5lcyBhIHBzZXVkbyByYW5kb20gbnVtYmVyIGdlbmVyYXRvclxuZnVuY3Rpb24gUFJORygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICAvLyBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gKGluY2x1ZGVkKSBhbmQgbWF4IChpbmNsdWRlZClcbiAgICAgICAgLy8gVXNpbmcgTWF0aC5yb3VuZCgpIHdpbGwgZ2l2ZSB5b3UgYSBub24tdW5pZm9ybSBkaXN0cmlidXRpb24hXG4gICAgICAgIG5ld1ZhbHVlOiBmdW5jdGlvbiBuZXdWYWx1ZShtaW4sIG1heCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBSTkc7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczZDgwNUlTOEdkS2k0ZnBGb1JBRGVEcicsICdyZWVsJyk7XG4vLyBzY3JpcHRzL2NvbnRyb2xsZXJzL3JlZWwuanNcblxuLy9kZWZpbmVzIGEgc2xvdCByZWVsXG52YXIgUFJORyA9IHJlcXVpcmUoJ3BybmcnKSgpO1xuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy9QVUJMSUMgUFJPUEVSVElFU1xuICAgICAgICAvL2dldHMvc2V0cyBhbiBhcnJheSBvZiBzdG9wcyB0byBkZWZpbmUgdGhlIHJlZWxcbiAgICAgICAgc3RvcHM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogW10sXG4gICAgICAgICAgICB0eXBlOiBbY2MuUHJlZmFiXVxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgbWluIHZhbHVlIHVzZWQgd2l0aCB0aGUgUFJORyBjbGFzc1xuICAgICAgICBwcm5nTWluUmFuZ2U6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIG1heCB2YWx1ZSB1c2VkIHdpdGggdGhlIFBSTkcgY2xhc3NcbiAgICAgICAgcHJuZ01heFJhbmdlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDEwMDAwMDAwMDAsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vUFJJVkFURSBQUk9QRVJUSUVTXG4gICAgICAgIC8vZ2V0cy9zZXRzIGFuIGFycmF5IG9mIGNjLk5vZGUgbWFkZSBpbnN0YW50aWF0aW5nIGVhY2ggc3RvcFxuICAgICAgICAvL2RlZmluZWQgaW4gdG8gdGhlIHB1YmxpYyBzdG9wcyBhcnJheSBwcm9wZXJ0eVxuICAgICAgICBzdG9wTm9kZXM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogW10sXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IFtjYy5Ob2RlXVxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgbGFzdCBub2RlIG9mIHRoZSByZWVsIHRoYXRcbiAgICAgICAgLy9kdXJpbmcgdGhlIHJlZWwgbW90aW9uIHdpbGwgYmUgZGluYW1pY2FsbHkgdXBkYXRlZFxuICAgICAgICB0YWlsTm9kZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIGhvdyBtYW55IHN0b3BzIGFyZSB2aXNpYmxlIG9uIHRoZSByZWVsIGNvbnRhaW5lclxuICAgICAgICB2aXNpYmxlU3RvcHM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMyxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgYWRqYWNlbnQgdmVydGljYWwgc3BhY2UgYmV0d2VlbiB0d28gc3RvcHNcbiAgICAgICAgcGFkZGluZzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIHRoZSBoZWlnaHQgb2YgZWFjaCBzdG9wXG4gICAgICAgIHN0b3BIZWlnaHQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgYW1vdW50IG9mIHRoZSBZIHRyYW5zbGF0aW9uIHRoYXQgZGVmaW5lIHRoZSByZWVsIG1vdGlvblxuICAgICAgICBzdGVwWToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIGhvdyBtYW55IHRpbWUgdGhlIHJlZWwgcm9sbGluZyBoYXBwZW5lZFxuICAgICAgICByb2xsaW5nQ291bnQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICAvL2dldHMvc2V0cyB0aGUgd2lubmVyIHJlZWwgaW5kZXggY2FsY3VsYXRlZCByYW5kb21seVxuICAgICAgICB3aW5uZXJJbmRleDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIC8vZ2V0cy9zZXRzIGhvdyBtYW55IHRpbWVzIHRoZSByZWVsIHdpbGwgcm9sbCBiZWZvciBzdG9wIG9uIHRoZSB3aW5uZXIgc3ltYm9scyAoY2FsY3VsYXRlZCByYW5kb21seSlcbiAgICAgICAgc3RvcEFmdGVyUm9sbGluZ0NvdW50OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgdGhlIFkgb2YgdGhlIHdpbm5lciBsaW5lXG4gICAgICAgIHdpbm5lckxpbmVZOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy9nZXRzL3NldHMgYSBmbGFnIHRoYXQgaW5kaWNhdGUgaWYgdGhlIHJvbGxpbmcgaXMgY29tcGxldGVkXG4gICAgICAgIGlzUm9sbGluZ0NvbXBsZXRlZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBmYWxzZSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcblxuICAgICAgICAvL3NldHMgdGhlIHdpbm5yIGxpbmUgWSBhdCB0aGUgbWlkZGxlIG9mIHRoZSBub2RlIGhlaWdodFxuICAgICAgICB0aGlzLndpbm5lckxpbmVZID0gdGhpcy5ub2RlLmhlaWdodCAvIDI7XG5cbiAgICAgICAgLy9zZXRzIHRoZSBzdG9wIGhlaWdodCB1c2luZyB0aGUgZmlyc3Qgc3RvcFxuICAgICAgICB2YXIgZmlyc3RTdG9wID0gY2MuaW5zdGFudGlhdGUodGhpcy5zdG9wc1swXSk7XG4gICAgICAgIHRoaXMuc3RvcEhlaWdodCA9IGZpcnN0U3RvcC5oZWlnaHQ7XG5cbiAgICAgICAgLy9wYWRkaW5nOiBpcyB0aGUgc3BhY2UgYmV0d2VlbiB0d28gYWRqYWNlbnQgbm9kZXNcbiAgICAgICAgdGhpcy5wYWRkaW5nID0gKHRoaXMubm9kZS5oZWlnaHQgLSB0aGlzLnZpc2libGVTdG9wcyAqIHRoaXMuc3RvcEhlaWdodCkgLyAodGhpcy52aXNpYmxlU3RvcHMgKyAxKTtcblxuICAgICAgICAvL3NldHMgdGhlIGFtb3VudCBvZiB0aGUgWSB0cmFuc2xhdGlvbiB0aGF0IGRlZmluZSB0aGUgcmVlbCBtb3Rpb25cbiAgICAgICAgdGhpcy5zdGVwWSA9IHRoaXMuc3RvcEhlaWdodCAvIDU7XG5cbiAgICAgICAgLy9jb25zaWRlcmluZyB0aGF0IHRoZSBhbmNob3IgcG9pbnQgb2YgdGhlIHJlZWwgaXMgYXQgKDAsMClcbiAgICAgICAgLy90aGlzIGxvb3Agd2lsbCBsYXlvdSBhbGwgdGhlIHN0b3BzIG9uIHRoZSBub2RlIChyZWVsKVxuICAgICAgICB2YXIgc3RhcnRZID0gdGhpcy5ub2RlLmhlaWdodCAtIHRoaXMucGFkZGluZyAtIHRoaXMuc3RvcEhlaWdodDtcbiAgICAgICAgdmFyIHN0YXJ0WCA9IHRoaXMubm9kZS53aWR0aCAvIDIgLSBmaXJzdFN0b3Aud2lkdGggLyAyO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdG9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHN0b3AgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnN0b3BzW2ldKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChzdG9wKTtcbiAgICAgICAgICAgIHN0b3Auc2V0UG9zaXRpb24oY2MucChzdGFydFgsIHN0YXJ0WSkpO1xuICAgICAgICAgICAgc3RhcnRZID0gc3RhcnRZIC0gdGhpcy5wYWRkaW5nIC0gdGhpcy5zdG9wSGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5zdG9wTm9kZXMucHVzaChzdG9wKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhaWxOb2RlID0gdGhpcy5zdG9wTm9kZXNbdGhpcy5zdG9wTm9kZXMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgdGhpcy5pc1JvbGxpbmdDb21wbGV0ZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNSb2xsaW5nQ29tcGxldGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL3RoZSBsb29wIGJlbG93IHdpbGwgbW9vdmUgZWFjaCBzdG9wIG9mIHRoZSBzZXRwWSBhbW91bnQuXG4gICAgICAgIC8vV2hlbiB0aGUgZmlyc3Qgc3RvcCBpcyBvbiB0aGUgdG9wIG9mIHRoZSBub2RlLCB3aWxsIGJlIG1vdmVkIGFmdGVyIHRoZSBmaXJzdCBhbmQgd2lsbCBiZSBzZXQgYXMgdGFpbC5cbiAgICAgICAgLy9Gb3IgZnVydGhlciBpbmZvcm10YWlvbiB0YWtlIGEgbG9vayB0byB0aGUgb25saW5lIGdpdGh1YiBkb2N1bWVudGF0aW9uXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0b3BOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHN0b3AgPSB0aGlzLnN0b3BOb2Rlc1tpXTtcbiAgICAgICAgICAgIHN0b3AueSA9IHN0b3AueSArIHRoaXMuc3RlcFk7XG4gICAgICAgICAgICBpZiAoc3RvcC55IC0gdGhpcy5wYWRkaW5nID4gdGhpcy5ub2RlLmhlaWdodCkge1xuICAgICAgICAgICAgICAgIGlmIChpICsgMSA9PSB0aGlzLnN0b3BOb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb2xsaW5nQ291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RvcC55ID0gdGhpcy50YWlsTm9kZS55IC0gdGhpcy50YWlsTm9kZS5oZWlnaHQgLSB0aGlzLnBhZGRpbmc7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsTm9kZSA9IHN0b3A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnN0b3BBZnRlclJvbGxpbmdDb3VudCA9PSB0aGlzLnJvbGxpbmdDb3VudCAmJiBpID09IHRoaXMud2lubmVySW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RvcC55ID49IHRoaXMud2lubmVyTGluZVkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMud2lubmVySW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbW92ZSB0aGUgdGFpbCBub2RlIGJlZm9yZSB0aGUgZmlyc3Qgc3RvcCAoaW5kZXg9PT0wKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWlsTm9kZS55ID0gc3RvcC55ICsgc3RvcC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMudGFpbE5vZGUuc2V0UG9zaXRpb24oY2MucChzdG9wLngsIHN0b3AueSArIHN0b3AuaGVpZ2h0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhaWxOb2RlID0gdGhpcy5zdG9wTm9kZXNbdGhpcy5zdG9wTm9kZXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldFkoc3RvcCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSb2xsaW5nQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdyb2xsaW5nLWNvbXBsZXRlZCcsIHRydWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlc2V0WTogZnVuY3Rpb24gcmVzZXRZKGN1cnJlbnRTdG9wKSB7XG4gICAgICAgIC8vYXBwbGllcyBhIGNvcnJlY3Rpb24gdG8gYWxsIHRoZSBZIHN0b3BzIGFmdGVyIHRoYXRcbiAgICAgICAgLy8gdGhlIHJlZWwgaGFzIGJlZW4gc3RvcHBlZC5cbiAgICAgICAgdmFyIGRlbHRhWSA9IGN1cnJlbnRTdG9wLnkgLSB0aGlzLndpbm5lckxpbmVZICsgY3VycmVudFN0b3AuaGVpZ2h0IC8gMjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0b3BOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5ld1N0b3AgPSB0aGlzLnN0b3BOb2Rlc1tpXTtcbiAgICAgICAgICAgIG5ld1N0b3AueSA9IG5ld1N0b3AueSAtIGRlbHRhWTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3BpbjogZnVuY3Rpb24gc3BpbigpIHtcbiAgICAgICAgLy9zdGFydCB0aGUgcmVlbCBzcGlubmluZ1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy9UT0RPOiBpdCBkZXBlbmRzIG9mIHRoZSBudW1lYmVyIG9mIHJlZWwgc3RvcHNcbiAgICAgICAgdmFyIG1pbiA9IDE7XG4gICAgICAgIHZhciBtYXggPSAyO1xuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIHRoaXMucm9sbGluZ0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5zdG9wQWZ0ZXJSb2xsaW5nQ291bnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgICAgICAvL1BSTkdcbiAgICAgICAgLy9nZXRzIHJhbmRvbSB2YWx1ZSB3aXRoIFBSTkcgY2xhc3MgYmV0d2VlbiBhIG1pbiBhbmQgbWF4IHZhbHVlXG4gICAgICAgIHZhciByYW5kb21WYWx1ZSA9IFBSTkcubmV3VmFsdWUodGhpcy5wcm5nTWluUmFuZ2UsIHRoaXMucHJuZ01heFJhbmdlKTtcbiAgICAgICAgLy9ub3JtYWxpemUgd2l0aCB0aGUgbnVtYmVyIG9mIHN0b3BzXG4gICAgICAgIHRoaXMud2lubmVySW5kZXggPSByYW5kb21WYWx1ZSAlIHRoaXMuc3RvcHMubGVuZ3RoO1xuXG4gICAgICAgIHRoaXMuaXNSb2xsaW5nQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgIC8vY29uc29sZS5sb2cgKHRoaXMuc3RvcEFmdGVyUm9sbGluZ0NvdW50ICsgXCItXCIgKyB0aGlzLndpbm5lckluZGV4KTtcbiAgICB9LFxuICAgIGdldFdpbm5lclN0b3A6IGZ1bmN0aW9uIGdldFdpbm5lclN0b3AoKSB7XG4gICAgICAgIC8vcmV0dXJucyB0aGUgcmVlbCB3aW5ucmUgaW5kZXhcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcE5vZGVzW3RoaXMud2lubmVySW5kZXhdO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYjFmOGZjQ3lVbEFRWVhLbGEzWURYNS8nLCAnc3RvcC10YWdzJyk7XG4vLyBzY3JpcHRzL2NvbnRyb2xsZXJzL3N0b3AtdGFncy5qc1xuXG4vL2RlZmluZXMgdGhlIHN0b3AgdGFnc1xuZnVuY3Rpb24gU3RvcFRhZ3MoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgQkFOQU5BOiAxLFxuICAgICAgICBCRUdBTU9UOiAyLFxuICAgICAgICBCT05VUzogMyxcbiAgICAgICAgQ09DS1RBSUw6IDQsXG4gICAgICAgIENPQ09EUklMRTogNSxcbiAgICAgICAgS0FLQURVOiA2LFxuICAgICAgICBMSU9OOiA3LFxuICAgICAgICBNQU46IDgsXG4gICAgICAgIE1PTktFWTogOVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcFRhZ3M7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3YzlkOTIrSU9CTUdLd1NUQ2hTb0lWaScsICdzdG9wJyk7XG4vLyBzY3JpcHRzL2NvbnRyb2xsZXJzL3N0b3AuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRhZzoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IDAsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIGJsaW5rVGltZXI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgYmxpbmtDb3VudGVyOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG4gICAgYmxpbms6IGZ1bmN0aW9uIGJsaW5rKCkge1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5ibGlua1RpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB0aGF0LmJsaW5rQ291bnRlcisrO1xuICAgICAgICAgICAgdGhhdC5ub2RlLmFjdGl2ZSA9PT0gdHJ1ZSA/IHRoYXQubm9kZS5hY3RpdmUgPSBmYWxzZSA6IHRoYXQubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoYXQuYmxpbmtDb3VudGVyID09IDEwKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5ibGlua0NvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAgIHRoYXQubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhhdC5ibGlua1RpbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMzAwKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMjQ2YWI0YW5sZEtrWUNqcjdGaXJJRUsnLCAndXNlci1kZWZhdWx0LWtleXMnKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvdXNlci1kZWZhdWx0LWtleXMuanNcblxuZnVuY3Rpb24gVXNlckRlZmF1bHRLZXlzKCkge1xuICByZXR1cm4ge1xuICAgIENVUlJFTlRfQ1JFRElUOiBcIkN1cnJlbnRfQ3JlZGl0XCJcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyRGVmYXVsdEtleXM7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhYzg1YU4weURaQXk1cU04ZW44RmVEUScsICd1c2VyLWRlZmF1bHQnKTtcbi8vIHNjcmlwdHMvY29udHJvbGxlcnMvdXNlci1kZWZhdWx0LmpzXG5cbnZhciBVc2VyRGVmYXVsdEtleXMgPSByZXF1aXJlKCd1c2VyLWRlZmF1bHQta2V5cycpKCk7XG52YXIgVXNlckRlZmF1bHQgPSBjYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGxvY2FsU3RvcmFnZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UgPSBjYy5zeXMubG9jYWxTdG9yYWdlO1xuICAgICAgICAvL2luaXQgdGhlIHNpbmdsZXRvbiBpbnN0YW5jZVxuICAgICAgICBVc2VyRGVmYXVsdC5pbnN0YW5jZSA9IHRoaXM7XG4gICAgfSxcbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIGluc3RhbmNlOiBudWxsXG4gICAgfSxcbiAgICBnZXRDdXJyZW50Q3JlZGl0OiBmdW5jdGlvbiBnZXRDdXJyZW50Q3JlZGl0KGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oVXNlckRlZmF1bHRLZXlzLkNVUlJFTlRfQ1JFRElUKTtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG4gICAgc2V0Q3VycmVudENyZWRpdDogZnVuY3Rpb24gc2V0Q3VycmVudENyZWRpdCh2YWx1ZSkge1xuICAgICAgICB0aGlzLnNldEl0ZW0uZ2V0SXRlbShVc2VyRGVmYXVsdEtleXMuQ1VSUkVOVF9DUkVESVQsIHZhbHVlKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7Il19
