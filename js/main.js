/*** Garden Gypsy (c) Bridget Lane bridgetlane.com ***/
window.onload = function() {    
    "use strict";
    var width = 600;
    var height = 300;
    var game = new Phaser.Game(
                                width, height,      // Width, height of game in px
                                Phaser.AUTO,        // Graphic rendering
                                'game',     
                                { preload: preload, // Preload function
                                  create: create,   // Creation function
                                  update: update }  // Update function
                               );
    var sun; var sunActions = [playRightSun, playLeftSun, playNoSun]; var sunMaxActions = 3; var sunCurrentAction = 0;
    var rain; var rainPositions = [50, 150, 250, 350, 450, 550]; var rainPositionX = 0; var rainPositionMax = 6;
    var sKEY; var wKEY;
    var bitmap;
    var first; var second; var third; var fourth; var fifth; var sixth;
    var stems = [ first = { INDEX: 0, DATA: 0, X: 50, HEIGHT: height - (height/5), FLOWER: 0, IMG: 'flower_a', STATE: 0, HEALTH: 10, TEXT: 0 },
                  second = { INDEX: 1, DATA: 0, X: 150, HEIGHT: height - (height/5), FLOWER: 0, IMG: 'flower_b', STATE: 0, HEALTH: 10, TEXT: 0 },
                  third = { INDEX: 2, DATA: 0, X: 250, HEIGHT: height - (height/5), FLOWER: 0, IMG: 'flower_a', STATE: 0, HEALTH: 10, TEXT: 0 },
                  fourth = { INDEX: 3, DATA: 0, X: 350, HEIGHT: height - (height/5), FLOWER: 0, IMG: 'flower_b', STATE: 0, HEALTH: 10, TEXT: 0 },
                  fifth = { INDEX: 4, DATA: 0, X: 450, HEIGHT: height - (height/5), FLOWER: 0, IMG: 'flower_a', STATE: 0, HEALTH: 10, TEXT: 0 },
                  sixth = { INDEX: 5, DATA: 0, X: 550, HEIGHT: height - (height/5), FLOWER: 0, IMG: 'flower_b', STATE: 0, HEALTH: 10, TEXT: 0 }
                ];
    var animations = ['Happy', 'Needs\nSun', 'Needs\nWater', 'Needs\nBoth', 'Overloaded', 'Dead'];
    var gameBegun = false;
    var fin; var finUpdate = 0;

    function preload(){
        game.load.spritesheet('sun', 'assets/img/sun.png', 64, 64);//sun
        game.load.spritesheet('rain', 'assets/img/rain.png', 64, 64);//rain
        game.load.image('placeholder_64', 'assets/img/placeholder_64.png');
        game.load.image('line-texture', 'assets/img/line-texture.png');
        game.load.spritesheet('flower_a', 'assets/img/flower_a.png', 64, 64);//flower a
        game.load.spritesheet('flower_b', 'assets/img/flower_b.png', 64, 64);//flower b
        game.load.spritesheet('welcome', 'assets/img/welcome.png', 600, 300);//welcome img
        game.load.audio('bg', ['assets/audio/bg.mp3'], ['assets/audio/bg.ogg']);
    };
    
    function create(){
        var music = game.add.audio('bg', 1, true);
        music.play('', 0, 1, true);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.stage.backgroundColor = '#AFEEEE';//'#33CCCC';

        var welcome = game.add.sprite(game.world.centerX, game.world.centerY, 'welcome');
        welcome.anchor.set(0.5);
        welcome.inputEnabled = true;
        welcome.animations.add('startup', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 11, true);
        welcome.play('startup');
        welcome.events.onInputDown.add(function(){ welcome.destroy(); start(); gameBegun = true; }, this);
    
        fin = game.add.text(game.world.centerX, 50, 
                               "", 
                               { font: "24px Arial", fill: "#000", align: "center" }//#888
                            );
        fin.anchor.set(0.5);

        //start();
    };

    function update(){
        if (gameBegun) redraw();//redraw bitmap
        if ((stems[0].STATE === 5) && (stems[1].STATE === 5) && (stems[2].STATE === 5) && 
            (stems[3].STATE === 5) && (stems[4].STATE === 5) && (stems[5].STATE === 5) && (finUpdate === 0)){
            fin.setText("You survived for " + (game.time.now/1000).toString() + " seconds");
            finUpdate = 1;
        }
    };

    function redraw(){
        bitmap.context.clearRect(0, 0, game.width, game.height);
        var buffer = 50;
        stems.forEach(function(stem){
            stem.HEIGHT = height - ((stem.HEALTH) + (height/4));
            //console.log(stem.HEIGHT);
            stem.DATA.setTo(stem.X, height, stem.X, stem.HEIGHT);
            stem.FLOWER.position.y = stem.HEIGHT;
            stem.TEXT.position.y = stem.HEIGHT - 50;
            bitmap.textureLine(stem.DATA, 'line-texture', 'repeat'); 
        });
        bitmap.dirty = true;
    };

    function start(){
        createSun();
        createRain();
        setBitmap();
        createKeys();
    };

    function createSun(){
        sun = game.add.sprite(width - 30, 30, 'placeholder_64');
        sun.animations.add('right', [0, 1, 2, 3, 4, 5, 6], 5, true);
        sun.animations.add('left', [7, 8, 9, 10, 11, 12, 13], 5, true);
    };
    function playRightSun(){
        sun.loadTexture('sun');
        sun.position.x = width - 30; sun.position.y = 30;
        sun.anchor.setTo(0.5, 0.5);
        sun.play('right');
        sun.bringToTop();
    };
    function playLeftSun(){
        sun.loadTexture('sun');
        sun.position.x = 30; sun.position.y = 30;
        sun.anchor.setTo(0.5, 0.5);
        sun.play('left');
        sun.bringToTop();
    };
    function playNoSun(){
        sun.loadTexture('placeholder_64');
    };

    function createRain(){
        rain = game.add.sprite(game.world.centerX, 80, 'placeholder_64');
        rain.anchor.setTo(0.5, 0.5);
        rain.animations.add('raining', [0, 1, 2], 6, true);
        rain.health = 0;//indicate it is not raining
    };
    function shiftRain(){
        if ((rainPositionX + 1) > rainPositionMax){
            rain.loadTexture('placeholder_64');
            rainPositionX = 0;
            rain.health = 0;
        }
        else{
            rain.position.x = rainPositions[rainPositionX];
            rain.loadTexture('rain');
            rain.play('raining');
            rainPositionX++;
            rain.health = 1;//indicate it is raining
        }
    };

    function setBitmap(){
        //bitmap
        bitmap = game.add.bitmapData(game.width, game.height);
        game.add.image(0, 0, bitmap);
           
        //lines
        stems.forEach(function(stem){
            stem.DATA = new Phaser.Line(stem.X, height, stem.X, stem.HEIGHT);
            bitmap.textureLine(stem.DATA, 'line-texture', 'repeat');     
            stem.FLOWER = game.add.sprite(stem.X, stem.HEIGHT, stem.IMG);
            stem.FLOWER.anchor.setTo(0.5, 0.5);
            stem.FLOWER.animations.add(animations[0], [1], 3, true);
            stem.FLOWER.animations.add(animations[1], [0, 1, 2, 1], 3, true);
            stem.FLOWER.animations.add(animations[2], [3], 3, true);
            stem.FLOWER.animations.add(animations[3], [4, 5, 6, 7, 6, 5], 4, true);
            stem.FLOWER.animations.add(animations[4], [3, 4, 5, 4], 4, true);
            stem.FLOWER.animations.add(animations[5], [7], 3, true);
            stem.FLOWER.play(animations[stem.STATE]);
            stem.TEXT = game.add.text(
                                        stem.X, stem.HEIGHT - 50, 
                                        animations[stem.STATE] + "\n" + stem.HEALTH.toString(), 
                                        { font: "14px Arial", fill: "#888", align: "center" }//#888
                                     );
            stem.TEXT.anchor.set(0.5);

            var stemLoop = game.time.events.loop(1000, function(){
                if (stem.STATE <= 4){
                    var s = game.rnd.integerInRange(0, 3);
                    stem.STATE = s;
                    stem.FLOWER.play(animations[stem.STATE]);
                    stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                    //console.log(stem.FLOWER, " ", stem.STATE);

                    if (stem.STATE === 0){//flower is happy
                        var rainPresent = false; var sunPresent = false;
                        var stemOverloaded = 0;
                        var presentOverloadCount = 0;
                        game.time.events.repeat(Phaser.Timer.SECOND, 7, function(){
                                if ((sunPresent || rainPresent)
                                    && (((sunCurrentAction === 2 && stem.INDEX <3) || (sunCurrentAction === 1 && stem.INDEX >= 3)) ||
                                            ((rainPositions[rainPositionX - 1] === stem.X) && (rain.health === 1)))){
                                    stem.STATE = 4;//mark flower as overloaded
                                    stem.FLOWER.play(animations[stem.STATE]);
                                    stem.HEALTH = stem.HEALTH - 2; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                    stemOverloaded++;
                                    presentOverloadCount++;
                                }
                                else if (((stemOverloaded === 0) && (rainPositions[rainPositionX - 1] === stem.X) && (rain.health === 1))
                                    || ((stemOverloaded === 0) && (((sunCurrentAction === 2) && (stem.INDEX < 3)) || ((sunCurrentAction === 1) && (stem.INDEX >= 3)))))
                                {
                                    stem.HEALTH++; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                    ((rainPositions[rainPositionX - 1] === stem.X) && (rain.health === 1)) ? rainPresent = true : sunPresent = true;
                                }
                                else if (stemOverloaded === 0){
                                    stem.HEALTH++; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                    rainPresent = false; sunPresent = false;
                                }
                                if (stemOverloaded > 0){
                                    //flower has been overloaded for 3 seconds and something has been present for 3 seconds, kill
                                    if ((stemOverloaded > 3) && (presentOverloadCount > 3)){
                                        stem.STATE = 5;
                                        stem.FLOWER.play(animations[stem.STATE]);
                                        stem.TEXT.setText(animations[stem.STATE] + "\n0");
                                        game.time.events.remove(stemLoop);
                                    }
                                }
                                if (stem.HEALTH <= 0){
                                    stem.STATE = 5;
                                    stem.FLOWER.play(animations[stem.STATE]);
                                    stem.TEXT.setText(animations[stem.STATE] + "\n0");
                                    game.time.events.remove(stemLoop);
                                }
                            }
                        , this);
                    }
                    if (stem.STATE === 1){//flower needs sun
                        game.time.events.repeat(Phaser.Timer.SECOND, 7, function(){
                                if ((sunCurrentAction === 2 && stem.INDEX <3) || (sunCurrentAction === 1 && stem.INDEX >= 3)){
                                    //if given sun, increment health
                                    stem.HEALTH++; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                }
                                else{//if not given sun, decrement health
                                    stem.HEALTH--; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                }
                                if (stem.HEALTH <= 0){
                                    stem.STATE = 5;
                                    stem.FLOWER.play(animations[stem.STATE]);
                                    stem.TEXT.setText(animations[stem.STATE] + "\n0");
                                    game.time.events.remove(stemLoop);
                                }
                            }
                        , this);
                    }
                    if (stem.STATE === 2){//flower needs water
                        game.time.events.repeat(Phaser.Timer.SECOND, 7, function(){
                                if ((rainPositions[rainPositionX - 1] === stem.X) && (rain.health === 1)){
                                    //if given rain, increment health
                                    stem.HEALTH++; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                }
                                else{//if not given rain, decrement
                                    stem.HEALTH--; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                }
                                if (stem.HEALTH <= 0){
                                    stem.STATE = 5;
                                    stem.FLOWER.play(animations[stem.STATE]);
                                    stem.TEXT.setText(animations[stem.STATE] + "\n0");
                                    game.time.events.remove(stemLoop);
                                }
                            }
                        , this);
                    }
                    if (stem.STATE === 3){//flower needs sun and water
                        game.time.events.repeat(Phaser.Timer.SECOND, 7, function(){
                                if (((rainPositions[rainPositionX - 1] === stem.X) && (rain.health === 1)) && 
                                    ((sunCurrentAction === 2 && stem.INDEX <3) || (sunCurrentAction === 1 && stem.INDEX >= 3))){
                                    stem.HEALTH = stem.HEALTH + 2; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                }
                                else if ((rainPositions[rainPositionX - 1] === stem.X) && (rain.health === 1)){
                                    stem.HEALTH = stem.HEALTH + 1; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                }
                                else if ((sunCurrentAction === 2 && stem.INDEX <3) || (sunCurrentAction === 1 && stem.INDEX >= 3)){
                                    stem.HEALTH = stem.HEALTH + 1; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                }
                                else{
                                    stem.HEALTH = stem.HEALTH - 2; stem.TEXT.setText(animations[stem.STATE] + "\n" + stem.HEALTH.toString());
                                }
                                if (stem.HEALTH <= 0){
                                    stem.STATE = 5;
                                    stem.FLOWER.play(animations[stem.STATE]);
                                    stem.TEXT.setText(animations[stem.STATE] + "\n0");
                                    game.time.events.remove(stemLoop);
                                }
                            }
                        , this);
                    }
                    if (stem.HEALTH <= 0){
                        stem.STATE = 5;
                        stem.FLOWER.play(animations[stem.STATE]);
                        stem.TEXT.setText(animations[stem.STATE] + "\n0");
                        game.time.events.remove(stemLoop);
                    }
                }
                if (stem.STATE === 5){//flower died
                    stem.FLOWER.play(animations[stem.STATE]);
                    stem.TEXT.setText(animations[stem.STATE] + "\n0");
                    game.time.events.remove(stemLoop);
                }
                if (stem.HEALTH <= 0){
                        stem.STATE = 5;
                        stem.FLOWER.play(animations[stem.STATE]);
                        stem.TEXT.setText(animations[stem.STATE] + "\n0");
                        game.time.events.remove(stemLoop);
                }
                stemLoop.delay = 7000;
            }, this);
        });
    };

    function createKeys(){
        sKEY = game.input.keyboard.addKey(Phaser.Keyboard.S);
        sKEY.onDown.add(function(sKEY){
            sunActions[sunCurrentAction]();
            if ((sunCurrentAction + 1) < sunMaxActions){
                sunCurrentAction++;
            }
            else{
                sunCurrentAction = 0;
            }
        }, this);

        wKEY = game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKEY.onDown.add(function(wKEY){
            shiftRain();
        }, this);
    };
};

