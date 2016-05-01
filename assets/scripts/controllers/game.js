//defines the main driver of the game
var Reel=require('reel'),
    OnOffButton=require('on-off-button'),
    AudioManager=require('audio-manager'),
    UserDefault=require('user-default'),
    PayTableTags=require('paytable-tags')();
cc.Class({
    extends: cc.Component,
    properties: {
        //PUBLIC PROPERTIES
        //gets/sets an array of Reel type (see reel.js asset) used to define the slot reels
        reels:{
            default:[],
            type:[Reel]
        },
        //gets/sets the initial credit.
        currentCredit:{
            default:100,
            type:cc.Integer
        },
        //gets/sets the amount of the "one bet" mode
        betOneValue:{
            default:1,
            type:cc.Integer
        },
        //gets/sets the amount of the "max bet" mode
        betMaxValue:{
            default:5,
            type:cc.Integer
        },
        //gets/sets the OnOff spin button
        spinButton:{
            default:null,
            type:OnOffButton
        },
        //gets/sets the OnOff auto-spin button
        autoSpinButton:{
            default:null,
            type:OnOffButton
        },
        //gets/sets the OnOff bet one button
        betOneButton:{
            default:null,
            type:OnOffButton
        },
        //gets/sets the OnOff bet max button
        betMaxButton:{
            default:null,
            type:OnOffButton
        },
        //gets/sets total bet label
        totalBetLabel:{
            default:null,
            type:cc.Label
        },
         //gets/sets credit label
        creditLabel:{
            default:null,
            type:cc.Label
        },
         //gets/sets info label
        betInfoLabel:{
            default:null,
            type:cc.Label
        },
         //gets/sets how many reels have been completed the roll operation
        rollingCompletedCount:{
            default:0,
            visible:false,
            type:cc.Integer
        },
         //gets/sets the flag that allows to undersatnd if all the reels have been completed its rolling operation
        isRollingCompleted:{
            default:true,
            visible:false
        },
        //gets/sets the total bet value
        totalBetValue:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        //gets/sets the current bet value (bet one or bet max)
        currentBetValue:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        //gets/sets the current paytable tag (see paytable-tags.js asset)
        currentPayTableTag:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        //gets set the auto-spin flag
        isAutoSpin:{
            default:false,
            visible:false
        },
        //gets/sets the timer instance used for the auto/spin  timeout
        autoSpinTimer:{
            default:null,
            visible:false
        }
    },
    
    onLoad: function () {
        
        var that = this;
        
        //sets the available credit.
        this.creditLabel.string=this.currentCredit.toString();
        //init bet info label
        this.betInfoLabel.string="";

        //implements the spin button on/off event
        this.spinButton.node.on('reel-spin', function (event) {
            if (event.detail.isOn){
                //play the game
                that.spin();
            }
        });
        //implements the auto-spin button on/off event
        this.autoSpinButton.node.on('reel-auto-spin', function (event) {
            //play the game as single spin or auto-spin
            that.isAutoSpin===true ? that.isAutoSpin=false : that.isAutoSpin=true; 
            if (that.isAutoSpin){
                if (event.detail.isOn){
                    that.spin();
                }
            }else{
               clearTimeout(that.autoSpinTimer);
            }
        });
        //implements the bet one button on/off event
        this.betOneButton.node.on('bet-one', function (event) {
            if (event.detail.isOn){
                //when this button is pushed down the bet max button will be reset
                that.betMaxButton.reset();
                //set bet value
                that.currentBetValue=that.betOneValue;
                that.currentPayTableTag=PayTableTags.BET_ONE;
                that.betInfoLabel.string=that.currentBetValue.toString();
                AudioManager.instance.playCoinsInsert();
            }
        });
        //implements the bet-max button on/off event
        this.betMaxButton.node.on('bet-max', function (event) {
            if (event.detail.isOn){
                //when this button is pushed down the bet one button will be reset
                that.betOneButton.reset();
                //set bet value
                that.currentBetValue=that.betMaxValue;
                that.currentPayTableTag=PayTableTags.BET_MAX;
                that.betInfoLabel.string=that.currentBetValue.toString();
                AudioManager.instance.playCoinsInsert();
            }
        });
        //implements the rolling completed event of the rell.js class
        this.node.on('rolling-completed', function (event) {
            //this method counts all the completed rolling reels and evaluate the results
            //if all the rells have been finished to roll.
            that.rollingCompletedCount++;
            AudioManager.instance.playReelStop();

            if (that.rollingCompletedCount==that.reels.length){
                that.rollingCompletedCount=0;
                //gets the line symbols tags
                var lineSymbolsTags=[];
                lineSymbolsTags=that.getLineSymbolsTag();
                
                //create a paytable instance and checks if the tag symbols is a winning combination
                var paytable=that.getComponent("paytable"),
                    paytableRet=paytable.isWinning(lineSymbolsTags,that.currentPayTableTag),
                    isWinning=Object.keys(paytableRet).length>0;
                    
                if (isWinning){
                    //WON!!!
                    //if won spin and auto-spin will stop the execution
                    that.isRollingCompleted=true;
                    that.isAutoSpin ? that.autoSpinButton.reset() : that.spinButton.reset();
                    that.isAutoSpin=false;
                    //play sound
                    AudioManager.instance.playLineWin();
                    AudioManager.instance.playCoinsWin();
                    //show winning symbols (animation)
                    that.showWinningSymbolsAndPay(paytableRet);
                }else{
                    //LOST update credit
                    that.updateCurrenCredit(that.currentCredit-that.currentBetValue);
                    that.betInfoLabel.string=(-that.currentBetValue).toString();
                    
                    if (!that.isAutoSpin){
                        //spin completed
                        that.isRollingCompleted=true;
                        that.spinButton.reset();
                    }else{
                        that.autoSpinTimer=setTimeout(function(){ 
                            //auto-spin completed...will restart
                            that.spin();
                        }, 1000);  
                    }
                }
                if (that.isRollingCompleted){
                    //unlocks all buttons
                    that.setButtonsLocked(false);
                    //update user default current credit
                    UserDefault.instance.setCurrentCredit(that.currentCredit);
                }
            }
        });
        
        
        
    },
    start:function(){
        //read all the user default
        this.loadUserDefault();
    },
    loadUserDefault:function(){
        //current credit
        this.updateCurrenCredit(UserDefault.instance.getCurrentCredit(this.currentCredit));
    },
    spin:function(){

        //checks if there is enough credit to play
        if (this.currentCredit===0){
            return;
        }
        //reset label info with current bet value
        this.betInfoLabel.string=this.currentBetValue.toString();
        
        if (this.isRollingCompleted){
            //sets total bet Label
            this.totalBetValue+=this.currentBetValue;
            this.totalBetLabel.string=this.totalBetValue.toString();
                
            if (!this.isAutoSpin){
                //this.spinButton.isLocked=true;
                this.isRollingCompleted=false;
            }
            //locks all buttons
            this.setButtonsLocked(true);
            AudioManager.instance.playReelRoll();
            //starts reels spin
            for (var i=0;i<this.reels.length;i++){
                this.reels[i].spin();
            }
        }
    },
    setButtonsLocked:function(isLocked){
        if (!this.isAutoSpin){
            this.autoSpinButton.isLocked=isLocked;    
        }
        
        this.spinButton.isLocked=isLocked;
        this.betOneButton.isLocked=isLocked;
        this.betMaxButton.isLocked=isLocked;
    },
    getLineSymbolsTag:function(){
        var lineSymbolsTags=[];
        for (var m=0;m<this.reels.length;m++){
            var stopNode=this.reels[m].getWinnerStop();
            var stopComponent=stopNode.getComponent("stop");
            lineSymbolsTags.push(stopComponent.tag);
        }
        return lineSymbolsTags;
    },
    showWinningSymbolsAndPay:function(paytableRet){
       
        var stopNode,
            stopComponent,
            winningAmount=0;

         //loop on  the winning combinations throughout the symbols index
         //note that it's possible to have one or more winning combinaiton
        for (var i=0;i<paytableRet.length;i++){
            var item=paytableRet[i];
            for (var n=0;n<item.indexes.length;n++){
                stopNode=this.reels[item.indexes[n]].getWinnerStop();
                stopComponent=stopNode.getComponent("stop");
                stopComponent.blink();
            }
            winningAmount+=parseInt(item.winningValue);
        }

        //PAY update credit
        this.updateCurrenCredit(this.currentCredit+winningAmount);
        this.betInfoLabel.string=winningAmount.toString();
    },
    updateCurrenCredit:function(value){
        this.currentCredit=value;
        this.creditLabel.string=this.currentCredit.toString();
        if (parseInt(this.currentCredit)<=0){
            AudioManager.instance.playGameOver();
            //TODO reset credit automatically
            this.updateCurrenCredit(100);
        }
    }

});
