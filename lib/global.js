//Game State
GAMESTATE = {
	0: "MENU",
	1: "INTRO",
	2: "GAME",
	3: "END",
	10: "PAUSE"
}
//Some ENUMs of entity position
POSITION = {
	character: {x: 200, y : 300},
	ball: {x: 1000, y : 300},
	trendmail: {x: 200, y: 400},
	background: {x: 0 , y: 0},
	question:{x:500, y: 500},
	feedback:{x:500, y: 500},
	score: {x:500, y: 500}
}
//Screen Resolution
screenResolution = {
	width: 1024,
	height: 768
}
//Text & Pic Array
TEXTS = [];
PICS = [];
//Text and picture id;
tid = 0;
pid = 0;
//Count for statistics
questionCount = 0;
correctCount = 0;
wrongCount = 0;
//Unit Length for moving
unitLength = 40;



/*@Class Text Constructor
 *@Param string: string to display
 *		 x: x-axis position
 *       y: y-axis position
 *		 stage: corresponding display stage
 *@Property	entity: PIXI.text object
 *          getEntity(): get PIXI.text object
 *          getPosition(): get position data for the object
 */
function initText(string, x, y, stage){
	//TODO: to adjust some parameters
	me = this;
	text = new PIXI.Text(string,{font: "bold 60px Podkova", fill: "#cc00ff", align: "left", stroke: "#FFFFFF", strokeThickness: 1});
	text.position.x = x;
	text.position.y = y;
	this.tid = tid++;
	TEXTS.push(text);
	stage.addChild(text);
	me.entity = text
	this.getEntity = function(){
		return(TEXTS[me.tid])
	}
	this.getPosition = function(){
		return (TEXTS[me.tid].position);
	}
}

function initPicFromImage(path, x, y, stage){
	me = this;
	pic = new PIXI.Sprite.fromImage(path);
	pic.position.x = x;
	pic.position.y = y;
	this.entity = pic;
	//this.index = index || 0;
	PICS.push(pic);
	stage.addChild(pic);
}