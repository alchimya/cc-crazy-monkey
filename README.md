# cc-crazy-monkey
A Single Payline Slot Machine made with Cocos Creator...and love :)

# What is this?
Crazy Monkey is a 5-reel single-line slot machine developed with the new (amazing) game development tool Cocos Creator.
The project has been made starting with the first public beta version (0.71) and at the moment of this writing I'm using the 1.0.1

![ScreenShot](https://raw.github.com/alchimya/cc-crazy-monkey/master/screenshots/cc-crazy-monkey.png)
<br/>
Cocos Creator, released as public beta in march 2016, is a complete package of game development tools and workflow, including a game engine (based on Cocos2d-x), resource management, scene editing, game preview, debug and publish one project to multiple platforms.
In this project/tutorial, I'm going to show some useful Cocos Creator features and at the same time I'll speak about some basic slot machines concept.
For further informations about Cocos Creator visit http://cocos2d-x.org

# The slot machine
The slot machine discussed here, is a, cross-platform desktop and mobile, 5-reel single-line slot machine where each reel, made with a set of 9 symbols, has 32 stops.
Here the symbols used to make the reels:

1) BANANA
<br/>
2) BEGEMOT
<br/>
3) BONUS
<br/>
4) COCKTAIL
<br/>
5) COCODRILE
<br/>
6) KAKADU
<br/>
7) LION
<br/>
8) MAN
<br/>
9) MONKEY
<br/>

<b>Specs</b>

Description                 | Value
----------------------------|--------------
Number of reels       		  | 5            
Number of Symbols     		  | 9
Number of stops per reel    | 32
Slot combinations    		    | 33.554.432
Wild symbols    			      | NONE
Single Betting value    	  | 1
Max Betting value    		    | 5

<b>Symbol Distribution</b>

Symbol       | Reel 1 | Reel 2 | Reel 3 | Reel 4 | Reel 5 | Total
-------------|--------|--------|--------|--------|--------|--------
BONUS		     |	1	    |	1	     | 1	    | 1      | 1	  | 5
BANANA		   |	4	    |	4	     | 3	    | 3      | 3 	  | 17
BEGEMOT      |	4	    |	3	     | 3	    | 5      | 4      | 19
COCKTAIL     |	3	    |	5	     | 4	    | 4      | 3      | 19
COCODRILE    |	4	    |	3	     | 3	    | 4      | 5      | 19
KAKADU       |	4	    |	3	     | 4	    | 4      | 5      | 20
LION         |	4	    |	5	     | 5	    | 3      | 4      | 21
MAN          |	4	    |	4	     | 4	    | 4      | 4      | 20
MONKEY       |	4	    |	4	     | 5	    | 4      | 3      | 20
<b>TOTAL</b> | 32	    | 32     | 32     | 32     | 32     | 160

<b>Reel Strips</b>

Stop     |Reel 1 	  | Reel 2      | Reel 3      | Reel 4      | Reel 5    
---------|------------|-------------|-------------|-------------|-----------
1		     |	LION      | KAKADU      | MONKEY	    | MAN		      | COCODRILE
2		     |	MONKEY	  | LION	      | COCODRILE	  | MONKEY	    | COCKTAIL
3		     |	COCODRILE | MAN		      | KAKADU	    | BONUS	      | BEGEMOT
4		     |	BANANA	  | COCKTAIL    | COCKTAIL	  | MAN		      | COCODRILE
5		     |	KAKADU	  | MONKEY	    | BEGEMOT	    | COCODRILE   | LION
6		     |	BANANA	  | MAN		      | LION		    | COCKTAIL	  | KAKADU
7		     |	BEGEMOT	  | COCKTAIL    | MAN		      | MONKEY	    | MONKEY
8	 	     |	COCKTAIL  | LION	      | BANANA	    | COCKTAIL	  | COCODRILE
9		     |	COCODRILE | BEGEMOT	    | KAKADU	    | LION		    | BEGEMOT
10		   |	MAN		    | COCKTAIL    | MAN		      | COCKTAIL	  | KAKADU
11		   |	LION	    | COCODRILE   | LION		    | KAKADU	    | MAN
12		   |	BONUS	    | BANANA	    | BEGEMOT	    | BEGEMOT	    | BANANA
13		   |	KAKADU	  | BEGEMOT	    | MONKEY	    | MAN		      | LION
14		   |	MONKEY	  | LION	      | COCKTAIL	  | BANANA	    | COCODRILE
15		   |	COCODRILE | MONKEY	    | KAKADU	    | COCODRILE   | MAN
16		   |	MAN		    | BANANA	    | BANANA	    | BANANA	    | BONUS
17		   |	COCKTAIL  | COCODRILE   | LION		    | KAKADU	    | KAKADU
18		   |	MONKEY	  | KAKADU	    | COCODRILE	  | BEGEMOT	    | MONKEY
19		   |	BEGEMOT	  | COCKTAIL    | BANANA	    | COCODRILE   | COCODRILE		
20		   |	LION	    | BANANA	    | MONKEY	    | MONKEY	    | MAN
21		   |	BANANA	  | MAN		      | BEGEMOT	    | BANANA	    | COCKTAIL
22		   |	BEGEMOT	  | BONUS	      | KAKADU	    | KAKADU	    | BEGEMOT
23		   |	KAKADU	  | LION	      | MAN		      | COCKTAIL	  | LION
24		   |	BANANA	  | MONKEY	    | COCKTAIL	  | MONKEY	    | KAKADU
25		   |	MAN		    | COCODRILE   | MONKEY	    | BEGEMOT	    | BANANA
26		   |	COCKTAIL  | KAKADU	    | LION		    | LION		    | BEGEMOT
27		   |	LION	    | BEGEMOT	    | COCODRILE	  | BEGEMOT	    | MONKEY
28		   |	BEGEMOT	  | BANANA	    | BONUS		    | MAN		      | BANANA
29		   |	COCODRILE | COCKTAIL    | MONKEY	    | COCODRILE   | MAN
30		   |	MONKEY	  | MAN		      | COCKTAIL	  | LION		    | LION
31		   |	KAKADU	  | LION	      | MAN		      | BEGEMOT	    | COCKTAIL
32		   |	MAN		    | MONKEY	    | LION		    | KAKADU	    | KAKADU	
<br/>

<b>Paytable Bet Max</b>

SYMBOL		  | TOTAL SYMBOLS		 | 5/R 	 | 4/R 	 | 3/R  | 2/R
------------|------------------|-------|-------|------|----
BONUS		    | 5			   	       | 2000  | 1600  |1000  |800
BANANA		  | 17			         | 300   | 260   |200   |100
BEGEMOT		  | 19			         | 200   | 160   |100   |50
COCODRILE	  | 19 			         | 200   | 160   |100   |50
COCKTAIL	  | 19 			         | 200   | 160   |100   |5
KAKADU		  | 20 			         | 100   | 90	   |75    |5
MAN			    | 20 			         | 100   | 90	   |75    |5
MONKEY		  | 20 			         | 100   | 90	   |75    |2
LION		    | 21			         | 50	   | 40	   |50   |2

<br/>
<b>Paytable Bet One</b>

SYMBOL		  | TOTAL SYMBOLS		 | 5/R 	 | 4/R 	 | 3/R  | 2/R
------------|------------------|-------|-------|------|----
BONUS		    | 5			   	       | 170   | 100   | 100  | 50
BANANA		  | 17			         | 80    | 20    | 20   | 10
BEGEMOT		  | 19			         | 40    | 10    | 10   | 5
COCODRILE	  | 19 			         | 40    | 10    | 10   | 5
COCKTAIL	  | 19 			         | 15    | 10    | 10   | 2
KAKADU		  | 20 			         | 8     | 5	   | 5    | 2
MAN			    | 20 			         | 8     | 5	   | 5    | 2
MONKEY		  | 20 			         | 8     | 5	   | 5    | 1
LION		    | 21			         | 3	   | 2	   | 2    | 1

# The Cocos Creator Project

<b>The Canvas</b>
<br/>
The main Canvas tree structure, can be described as follow:
<br/>
-->Canvas
<br/>
------>Background layer
<br/>
------>Game layer
<br/>
------>Top layer
<br/>
------>Bottom layer
<br/>
![ScreenShot](https://raw.github.com/alchimya/cc-crazy-monkey/master/screenshots/layers.png)
where:
- Background layer: is a sprite with a Widget component that allowos to autosize the background changing device and resolution.
- Top layer: is a node that contains all the UI components placed ont the top of the game layer. Here mainly there are the score UI components.
<br/>The layout of this node is driven by a widget with a Top constraint.
- Bottom layer: is a node that contains all the UI components placed below the game layer. Here mainly there are the game buttons controls.
<br/>The layout of this node is driven by a widget with constraints on the top, bottom,right and left.
- Game layer: this node can be described as the reels container.
<br/> It contains a tree node structure as follow:
<br/>
-->Reels
<br/>
------>Reel 1
<br/>
------>Reel 2
<br/>
------>Reel 3
<br/>
------>Reel 4
<br/>
------>Reel 5

<br/>
To "crop" the reels layer with a proper visible area, there has been used a Mask component.

<b>Assets</b>
<br/>
The assets branch, can be described as follow
-->assets
<br/>
------>audio
<br/>
------>prefabs
<br/>
------>scenes
<br/>
------>scripts
<br/>
---------->controllers
<br/>
---------->ui
<br/>
------>textures

<br/>
where:
- scripts: contains all the Javascript classes that define the game logic.
- prefabs: contains all the prefabs components. Here you can find the stops (symbols) reel prefab.
- textures: contains all the textures used with sprites and prefabs

<b>Scripting</b>
<br/>
<b>1.1 Reel</b>
<br/>
A reel is a class that extends a cc.Component object.
<br/>
It defines the following public properties:

  name                        |     type                    |   description    
------------------------------| ----------------------------|--------------------------------------------------------
stops                     	  | [cc.Prefab]                 | allows to define the reel stops
prngMinRange                  | cc.Integer                  | allows to define the min value for the PRNG
prngMaxRange                  | cc.Integer                  | allows to define the max value for the PRNG

<br/>
The layout logic of the (32) symbols is quite easy to understand.
<br>
Looping throughout the stops array the Y value of each node will be decreased of a padding value and the stop node height.
<br/>
Bear in mind that each anchor point of a stop node has been defined as (0,0).
<br/>
Moreover note that the starting y has been calculated using the reel node height.
<br/>
![ScreenShot](https://raw.github.com/alchimya/cc-crazy-monkey/master/screenshots/stops_layout.png)

<b>1.2 Stops Reel Motion</b>
<br/>
The reel motion is quite esay to understand.
<br/>
Overriding the update() method (cc.Component superclass), each Y node (each item of the stops array property) is increased of an arbitrary value that can be expressed as:
<br/>
<b>StepY=StopHeight/N</b>
<br/>
It's quite easy to understand that if <b>N->0</b> then <b>StpeY->∞</b>, so for <b>N->0</b> the reel speed will increase.
<br/>
When a stop Y is greater or equal than the node (reel) height, it will moved after the last (tail) item:
<br/>
![ScreenShot](https://raw.github.com/alchimya/cc-crazy-monkey/master/screenshots/stops_motion.png)

<b>1.3 Reel (P)RNG</b>
<br/>
The winning logic of a reel object, is driven by a <b>Pseudo Random Number Generator (PRNG)</b> see prng.js assets script.
<br/>
On each reel it is possible to set the range, as min and max value, within the random number will be generated.
<br/>
Here the values used for the five reels to generate the winning index.

  reel   |     min        |   max    
---------| ---------------|--------------------
1        | 1              | 1000000000
2        | 1000000001     | 2000000000
3        | 2000000001     | 3000000000
4        | 3000000001     | 4000000000
5        | 4000000001     | 5000000000

Note that the number of how many times the reel will rool, is generated randomly too.

<b>1.4 How the reel winning stop does it work?</b>
This is a slot machine with a single pay line placed at the center of the reels container.
<br/>
When the reel is rolling its last round, when the Y of the winning stop is greater or equal of the pay line Y, the rolling will be stopped.
<br/>
To place the center of the winning stop exactly on the winning line, each reel stop Y will be recalculated subtracting an amount equale to:
<br/>
<b>deltaY=winningStop.y-payLineY+winningStop.height/2</b>
