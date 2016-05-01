///deifnes an helper (singleton) class to play ausio assets
var AudioManager = cc.Class({
    extends: cc.Component,

    properties: {
        //PUBLIC PROPERTIES
        //the properties below define all the audio clips that the class can play
        coinsWin: {
            default: null,
            url: cc.AudioClip
        },
        coinsInsert: {
            default: null,
            url: cc.AudioClip
        },
        jackpotWin: {
            default: null,
            url: cc.AudioClip
        },
        lineWin: {
            default: null,
            url: cc.AudioClip
        },
        reelStart: {
            default: null,
            url: cc.AudioClip
        },
        reelRoll: {
            default: null,
            url: cc.AudioClip
        },
        reelStop: {
            default: null,
            url: cc.AudioClip
        },
        gameOver: {
            default: null,
            url: cc.AudioClip
        }
    },
    //defines the static (singleton) instance
    statics: {
        instance: null
    },

    playCoinsWin () {
        cc.audioEngine.playMusic(this.coinsWin, false);
    },
    playCoinsInsert () {
        cc.audioEngine.playEffect(this.coinsInsert, false);
    },
    playJackpotWin () {
        cc.audioEngine.playEffect(this.jackpotWin, false);
    },
    playLineWin () {
        cc.audioEngine.playEffect(this.lineWin, false);
    },
    playReelStart () {
        cc.audioEngine.playEffect(this.reelStart, false);
    },
    playReelRoll () {
        this.playSound(this.reelRoll);
    },
    playReelStop () {
        cc.audioEngine.playEffect(this.reelStop, false);
    },
    playGameOver () {
        cc.audioEngine.playEffect(this.gameOver, false);
    },
    playSound:function(audioClip){
        //audio play
        if (!audioClip){
            return;
        }
        cc.audioEngine.playMusic(audioClip, false);
    },
    onLoad () {
        //init the singleton instance
        AudioManager.instance = this;
    }

});
