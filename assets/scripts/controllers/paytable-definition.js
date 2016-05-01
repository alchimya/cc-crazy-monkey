//defines the paytables

/*
PAY TABLE BET MAX
--------------------------------------------------------------------------------------------
SYMBOL		TOTAL SYMBOLS			5/R 			4/R                 3/R 			2/R
--------------------------------------------------------------------------------------------
BONUS			5					2000			1600                1000			800
BANANA			17					300				260                 200 			100
BEGAMOT			19					200 			160                 100 			50
COCODRILE		19 					200 			160                 100 			50
COCKTAIL		19 					200 			160                 100 			--
KAKADU			20 					100 			90                  75				--
MAN				20 					100 			90                  75				--
MONKEY			20 					100 			90                  75				--
LION			21					50				40                  25				--
--------------------------------------------------------------------------------------------

PAY TABLE BET ONE

--------------------------------------------------------------------------------------------
SYMBOL		TOTAL SYMBOLS			5/R 			4/R             3/R 			2/R
--------------------------------------------------------------------------------------------
BONUS			5					200 			170             100 			50
BANANA			17					100				80              20  			10
BEGAMOT			19					50  			40              10  			5
COCODRILE		19 					50  			40              10  			5
COCKTAIL		19 					20  			15              10  			2
KAKADU			20 					10  			8               5				2
MAN				20 					10  			8               5				2
MONKEY			20 					10  			8               5				1
LION			21					5				3               2				1
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
var StopTags=require('stop-tags')(),
    PayTableTags=require('paytable-tags')();
var paytableBetMax=
[
    {
        stopTag:StopTags.BONUS,
        5:2000,
        4:1600,
        3:1000,
        2:800
    },
    {
        stopTag:StopTags.BANANA,
        5:300,
        4:260,
        3:200,
        2:100
    },
    {
        stopTag:StopTags.BEGAMOT,
        5:200,
        4:160,
        3:100,
        2:50
    },
    {
        stopTag:StopTags.COCODRILE,
        5:200,
        4:160,
        3:100,
        2:50
    },
    {
        stopTag:StopTags.COCKTAIL,
        5:200,
        4:160,
        3:100,
        2:5
    },
    {
        stopTag:StopTags.KAKADU,
        5:100,
        4:90,
        3:75,
        2:5
    },
    {
        stopTag:StopTags.MAN,
        5:100,
        4:90,
        3:75,
        2:5
    },
    {
        stopTag:StopTags.MONKEY,
        5:100,
        4:90,
        3:75,
        2:2
    },
    {
        stopTag:StopTags.LION,
        5:50,
        4:40,
        3:25,
        2:2
    },
];
var paytableBetOne=
[
    {
        stopTag:StopTags.BONUS,
        5:200,
        4:170,
        3:100,
        2:50
    },
    {
        stopTag:StopTags.BANANA,
        5:100,
        4:80,
        3:20,
        2:10
    },
    {
        stopTag:StopTags.BEGAMOT,
        5:50,
        4:40,
        3:10,
        2:5
    },
    {
        stopTag:StopTags.COCODRILE,
        5:50,
        4:40,
        3:10,
        2:5
    },
    {
        stopTag:StopTags.COCKTAIL,
        5:20,
        4:15,
        3:10,
        2:2
    },
    {
        stopTag:StopTags.KAKADU,
        5:10,
        4:8,
        3:5,
        2:2
    },
    {
        stopTag:StopTags.MAN,
        5:10,
        4:8,
        3:5,
        2:2
    },
    {
        stopTag:StopTags.MONKEY,
        5:10,
        4:8,
        3:5,
        2:1
    },
    {
        stopTag:StopTags.LION,
        5:5,
        4:3,
        3:2,
        2:1
    },
];

var PayTableDefinition=function(paytableTag){
    switch (paytableTag){
        case PayTableTags.BET_ONE:
            return paytableBetOne;
        case PayTableTags.BET_MAX:
            return paytableBetMax;
        default:
            return paytableBetOne;
    }
};
module.exports=PayTableDefinition;



