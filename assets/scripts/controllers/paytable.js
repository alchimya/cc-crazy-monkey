//defines the logicof the payline
var PayTableDefinition=require('paytable-definition'),
    StopTags=require('stop-tags')();
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad: function () {

    },
    isWinning:function(lineSymbolsTags,paytableTag){
        //loop throughout all the symbol tags 
        //checking for a sequence of identical symbol tags
        var lineCombinations={};
        for (var i=0;i<lineSymbolsTags.length;i++){
            var firstItem=lineSymbolsTags[i];
            var previousItem = i>0 ? lineSymbolsTags[i-1] : -1;
            var indexes=[];
            var tags=[];
            indexes.push(i);
            for (var n=i+1;n<lineSymbolsTags.length;n++){
                var item=lineSymbolsTags[n];
                if (firstItem == item && item != previousItem){
                    //add items to line combinations
                    indexes.push(n);
                    lineCombinations[firstItem]={
                        indexes:indexes
                    };
                }else{
                    break;
                }
            }
        }

        if (Object.keys(lineCombinations).length>0){
            return this.check(lineCombinations);
        }
        return [];
    },
    check:function(lineCombinations,paytableTag){

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
        var paytable=PayTableDefinition(paytableTag);
        var ret=[];
        for (var tag in lineCombinations){
            if (lineCombinations.hasOwnProperty(tag)) {
                var retObject =paytable.filter(function(item) {
                    if ( item.stopTag == tag ){
                        var winningValue=parseInt(item[lineCombinations[tag].indexes.length].toString());
                        if (winningValue>0){
                            ret.push({
                                indexes:lineCombinations[tag].indexes,
                                winningValue:item[lineCombinations[tag].indexes.length].toString(),
                                winningTag:tag
                            })
                        }

                    }
                });
            }
        } 
        return ret;
    }

});
