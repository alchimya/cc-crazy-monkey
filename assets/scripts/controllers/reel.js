//defines a slot reel
var PRNG=require('prng')();
cc.Class({
    extends: cc.Component,
    properties: {
        //PUBLIC PROPERTIES
        //gets/sets an array of stops to define the reel
        stops:{
            default:[],
            type:[cc.Prefab]
        },
        //gets/sets the min value used with the PRNG class
        prngMinRange:{
            default:1,
            type:cc.Integer
        },
        //gets/sets the max value used with the PRNG class
        prngMaxRange:{
            default:1000000000,
            type:cc.Integer
        },
        //PRIVATE PROPERTIES
        //gets/sets an array of cc.Node made instantiating each stop 
        //defined in to the public stops array property
        stopNodes:{
            default:[],
            visible:false,
            type:[cc.Node]
        },
        //gets/sets the last node of the reel that 
        //during the reel motion will be dinamically updated
        tailNode:{
            default:null,
            visible:false,
            type:cc.Node
        },
        //gets/sets how many stops are visible on the reel container
        visibleStops:{
            default:3,
            visible:false,
            type:cc.Integer
        },
        //gets/sets the adjacent vertical space between two stops
        padding:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        //gets/sets the height of each stop
        stopHeight:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        //gets/sets the amount of the Y translation that define the reel motion
        stepY:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        //gets/sets how many time the reel rolling happened
        rollingCount:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        //gets/sets the winner reel index calculated randomly
        winnerIndex:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        //gets/sets how many times the reel will roll befor stop on the winner symbols (calculated randomly)
        stopAfterRollingCount:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        //gets/sets the Y of the winner line
        winnerLineY:{
            default:0,
            visible:false,
            type:cc.Integer
        },
        //gets/sets a flag that indicate if the rolling is completed
        isRollingCompleted:{
            default:false,
            visible:false
        }
    },
    
    // use this for initialization
    
    onLoad: function () {
        
        //sets the winnr line Y at the middle of the node height
        this.winnerLineY=this.node.height/2;

        //sets the stop height using the first stop
        var firstStop = cc.instantiate(this.stops[0]);
        this.stopHeight=firstStop.height;
        
        //padding: is the space between two adjacent nodes
        this.padding=(this.node.height - (this.visibleStops*this.stopHeight))/(this.visibleStops+1)
        
        //sets the amount of the Y translation that define the reel motion
        this.stepY=this.stopHeight/5;
        
        
        //considering that the anchor point of the reel is at (0,0)
        //this loop will layou all the stops on the node (reel)
        var startY=this.node.height -this.padding-this.stopHeight;
        var startX=this.node.width/2-firstStop.width/2;
        
        for (var i=0;i<this.stops.length;i++){
            var stop = cc.instantiate(this.stops[i]);
            this.node.addChild(stop);
            stop.setPosition(cc.p(startX, startY));
            startY= startY -this.padding-this.stopHeight;
            this.stopNodes.push(stop);
        }
        this.tailNode=this.stopNodes[this.stopNodes.length-1];
        
        this.isRollingCompleted=true;
    
    },
    
    // called every frame, uncomment this function to activate update callback
     update: function (dt) {

        if (this.isRollingCompleted){
            return;
        }

        //the loop below will moove each stop of the setpY amount.
        //When the first stop is on the top of the node, will be moved after the first and will be set as tail.
        //For further informtaion take a look to the online github documentation
        
        for (var i=0;i<this.stopNodes.length;i++){
            var stop=this.stopNodes[i];
            stop.y=stop.y+this.stepY;
            if (stop.y-this.padding>this.node.height){
                if (i+1==this.stopNodes.length){
                    this.rollingCount++;
                }
                stop.y=this.tailNode.y - this.tailNode.height - this.padding;
                this.tailNode=stop;
            }
            
            if (this.stopAfterRollingCount==this.rollingCount && i==this.winnerIndex){
                if (stop.y>=this.winnerLineY){
                    if (this.winnerIndex===0){
                        //move the tail node before the first stop (index===0)
                        this.tailNode.y=stop.y + stop.height;
                        //this.tailNode.setPosition(cc.p(stop.x, stop.y + stop.height));
                        this.tailNode=this.stopNodes[this.stopNodes.length-2];
                    }
                    this.resetY(stop);
                    this.isRollingCompleted=true;
                    this.node.dispatchEvent( new cc.Event.EventCustom('rolling-completed', true) );
                }
            }
        }
        
     },
     resetY:function(currentStop){
        //applies a correction to all the Y stops after that
        //the reel has been stopped.
        var deltaY=currentStop.y-this.winnerLineY+currentStop.height/2;
        var lastItemWon =  (this.winnerIndex===this.stopNodes.length-1)
        for (var i=0;i<this.stopNodes.length;i++){
            var newStop=this.stopNodes[i];
            newStop.y=newStop.y-deltaY;
            if (lastItemWon && newStop.y < this.winnerLineY && i!=this.winnerIndex) {
                newStop.y=newStop.y+this.padding;
            }
        }
     },
     spin:function(){
        //start the reel spinning

        ///////////////////////////////////// 
        //TODO: it depends of the numeber of reel stops 
        var min=1;
        var max=2;
        /////////////////////////////////////
        this.rollingCount=0;
        this.stopAfterRollingCount=Math.floor(Math.random() * (max - min + 1)) + min;
        //PRNG 
        //gets random value with PRNG class between a min and max value
        var randomValue=PRNG.newValue(this.prngMinRange,this.prngMaxRange);
        //normalize with the number of stops
        this.winnerIndex=(randomValue % this.stops.length);
        
        this.isRollingCompleted=false;
        //console.log (this.stopAfterRollingCount + "-" + this.winnerIndex);
     },
     getWinnerStop:function(){
            //returns the reel winnre index
         return this.stopNodes[this.winnerIndex];
     }
});
