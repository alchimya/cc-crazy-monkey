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