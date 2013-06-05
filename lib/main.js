	// create an array of assets to load
	var assetsToLoader = [ "SpriteSheet.json"];
	
	// create a new loader
	loader = new PIXI.AssetLoader(assetsToLoader);
	
	// use callback
	loader.onComplete = onAssetsLoaded
	
	//begin load
	loader.load();


	interactive = true;

	currentGameState = 2;
	//time factor for Tween
	timeFactor = 1;
	//Can player jump?
	jumpSwitch = true;
	//Is there a collision? 
	collisionSwitch = false;
	//Is jumping over the ball?
	isJumpOver = false;
	//The question is answered?
	isAnswered = false; 
	//Define game stages
	menuStage = new PIXI.Stage(0xFFFFFF, interactive);
	introStage = new PIXI.Stage(0xFFFFFF, interactive);
	gameStage = new PIXI.Stage(0xFFFFFF, interactive);
	//TODO: research on whether we need a new stage for the pauseStage;
	endStage = new PIXI.Stage(0xFFFFFF, interactive);

	renderer = PIXI.autoDetectRenderer(screenResolution.width, screenResolution.height);
	//Init character and ball
	character = new initPicFromImage("media/eggHead.png", 200, 300, gameStage);
	ball = new initPicFromImage("media/ball.png", 1000,380,gameStage);
	questionCount++;
	ball.answer = Math.floor(Math.random() * 2)
	ballMove(ball.entity);


	//For test purpose
	var ballText;

	document.body.appendChild(renderer.view);

	//Move the ball
	function ballMove(ball)
	{	
		ballTween = TweenLite.to(ball.position, timeFactor * 5, {x: -300, y: ball.position.y, onComplete: generateBall})
		jumpSwitch = true;
		isAnswered = false;	
	}

	//Generate the ball
	function generateBall()
	{
		PICS.pop();
		gameStage.removeChild(ball.entity);
		ball = new initPicFromImage("media/ball.png", 1000,380,gameStage);
		ball.answer = Math.floor(Math.random() * 2);
		questionCount++;
		if(isJumpOver)
			ballMove(ball.entity);
		else
			setTimeout(function(){ballMove(ball.entity)},1000);
	}
	//executing when the assets are loaded
	function onAssetsLoaded()
	{
		menuText = new initText("MENU PLACEHOLDER", 0, screenResolution.height / 2, menuStage);
		introText = new initText("INTRO PLACEHOLDER", 0, screenResolution.height / 2, introStage);

		ballText = new initText("", ball.entity.position.x + 40, ball.entity.position.y - 60, gameStage);
		

		endText = new initText("ENDING PL CEHOLDER", 0, screenResolution.height / 2, endStage);
		requestAnimFrame( update ); 
	}
	//Move to default position on the trendmail
	function moveDefault()
	{
		console.log("Default");
		position = character.entity.position;
		if(isAnswered)
			moveDefaultTween = TweenLite.to(position, timeFactor / 2, {x: position.x, y: 300, ease: Power2.easeIn, onComplete: moveCharacter})
		else
			moveDefaultTween = TweenLite.to(position, timeFactor / 2, {x: position.x, y: 300, ease: Power2.easeIn})
	}
	//Move forward
	function moveForward()
	{
		correctCount++;
		position = character.entity.position;
		characterMove(position, position.x + unitLength, position.y);	
	}
	//Move backward
	function moveBackward()
	{
		wrongCount++;   
		position = character.entity.position;
		characterMove(position, position.x - unitLength, position.y);
	}
 	//Movec haracter, using this one instead directly using moveForward() || moveBackward();
	function moveCharacter()
	{
		if(ball.answer)
		{
			if(isJumpOver)
				moveBackward();  
			else
				moveForward();
		}
		else
		{
			console.log(ball.answer+"X");
			if(isJumpOver)
				moveForward();
			else	
				moveBackward();
		}
	}

	//Abstract function to move an object
	function characterMove(entity, x, y){
		moveTween = TweenLite.to(entity, timeFactor, {x: x, y: y, ease: Elastic.easeInOut, onComplete: setJumpSwitch})
	}

	//Jumping motion
	function characterJump(position){
		console.log(isAnswered);
		if(jumpSwitch){
			jumpSwitch = false;
			jumpTween = TweenLite.to(position, timeFactor / 3, {x: position.x, y: 50, ease:Power2.easeOut, onComplete:moveDefault});
		}   
	}

	//update function
	function update()
	{
		requestAnimFrame( update );
		ballText.entity.setText(ball.answer.toString());
		ballText.entity.position.x = ball.entity.position.x + 40;
		ballText.entity.position.y = ball.entity.position.y - 60;

		//Game State Machine
		switch (currentGameState)
		{
			case 0:
			{
				renderer.render(menuStage)
				break;
			}
			case 1:
			{
				renderer.render(introStage)
				break;
			}
			case 2:
			{
				renderer.render(gameStage)
				collisionDetection();
				break;
			}
			case 3:
			{
				renderer.render(endStage)
				break;
			}
		}
	}

	//collision resolving function
	function collisionDetection()
	{
		ball.collision = {
			center: ball.entity.position,
			radius: 40
		}

		character.collision = {
			center: character.entity.position,
			width: 142,
			height: 157
		}
		collisionSwitch = intersects(ball.collision, character.collision)
		if(!isAnswered)
		{
			if(collisionSwitch)
			{ 
				console.log("Collider");
				//FIXME: Should modify jump mechanism.
				isAnswered = true;
				isJumpOver = false;
				jumpSwitch = false;
				moveDefault();
			}
			else if((ball.collision.center.x + ball.collision.radius < character.collision.center.x + character.collision.width / 2) && !isAnswered)
			{
				isAnswered = true;
				isJumpOver = true;
				setTimeout(function(){
					moveDefault();
				},500);
			}
		}
	}

	//judging collision between a circle and a rectangle
	function intersects(circle, rect)
	{
		circleDistance = {
			// circle.radius need to adjust because the picture
			x: Math.abs((circle.center.x + circle.radius) - (rect.center.x + rect.width / 2)),
			y: Math.abs((circle.center.y + circle.radius) - (rect.center.y + rect.height / 2))
		}
		if (circleDistance.x > (circle.radius + rect.width / 2))
			return false;
		if (circleDistance.y > (circle.radius + rect.height / 2))
			return false;
 
		if (circleDistance.x <= (rect.width / 2))
			return true;
		if (circleDistance.y <= (rect.height / 2))
			return true;

		cornerDistance_sq = (circleDistance.x - rect.width / 2) ^ 2 + (circleDistance.y - rect.height / 2) ^ 2
		return (cornerDistance_sq <= (circle.radius ^ 2))
	}

	//setJumpSwitch after jumping
	function setJumpSwitch()
	{
		if(isAnswered)
			jumpSwitch = false;
		else
			jumpSwitch = true;
	}

	//Monitor Keyboard Input
	$(document.body).keyup(function(event){
		//LOOKUP KEYCODE!!!
		var eventSwitch = true;
		me = this;
		if(event.keyCode == 32 && eventSwitch){
			characterJump(character.entity.position);
			eventSwitch = false
			setTimeout(function(){
				me.eventSwitch = true;
			},500)
		}
	})