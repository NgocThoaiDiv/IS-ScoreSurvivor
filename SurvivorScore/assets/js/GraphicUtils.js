import { TicTacToeGameState } from './TicTacToe.js';

export var createQuestionTable = function(scene, room, question=null){
  let dialog, sumWidthHeight=GET_SCREEN_WIDTH() + GET_SCREEN_HEIGHT();

  scene.createCoverBackgroundPanel2();

  // load tic tac toe game to fight with bot
  if(!room.isSpecialChest){
    // init game
    TIC_TAC_TOE = new TicTacToeGameState();

    // create grid button to play
    dialog = scene.rexUI.add.dialog({
      x: GET_SCREEN_WIDTH()/2,
      y: GET_SCREEN_HEIGHT()/2.5,

      background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, sumWidthHeight/200, COLOR_DARK_BROWN),

      title: scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, sumWidthHeight/200, COLOR_LIGHT_BROWN),
        align: 'right',
        orientation: 0, 

        icon: scene.add.text(0, 0, 'TIC TAC TOE', {
          font: sumWidthHeight/75 + 'px monospace',
          color: '#ffffff'
        }),
        text: createCloseLabel(scene, true),
        space: {
          icon: sumWidthHeight/80,

          top: sumWidthHeight/500,
          bottom: sumWidthHeight/500,
        }
      }),

      content: scene.rexUI.add.gridButtons({
        width: GET_SCREEN_HEIGHT()/1.5,
        height: GET_SCREEN_HEIGHT()/2,

        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, sumWidthHeight/200, COLOR_DARK_BROWN),

        buttons: [
          [createTTTButton(scene, 0), createTTTButton(scene, 1), createTTTButton(scene, 2), createTTTButton(scene, 3)],
          [createTTTButton(scene, 4), createTTTButton(scene, 5), createTTTButton(scene, 6), createTTTButton(scene, 7)],
          [createTTTButton(scene, 8), createTTTButton(scene, 9), createTTTButton(scene, 10), createTTTButton(scene, 11)],
          [createTTTButton(scene, 12), createTTTButton(scene, 13), createTTTButton(scene, 14), createTTTButton(scene, 15)]
        ],

        click: {
            mode: 'pointerup',
            clickInterval: 100
        },
        space: {
          row: sumWidthHeight/200,
          column: sumWidthHeight/200,

          left: sumWidthHeight/80,
          right: sumWidthHeight/80,
          top: sumWidthHeight/80,
          bottom: sumWidthHeight/80
        }
      }).layout(),

      align: {
        title: 'center',
      },

      space: {
        title: sumWidthHeight/100,

        left: sumWidthHeight/80,
        right: sumWidthHeight/80,
        top: sumWidthHeight/100,
        bottom: sumWidthHeight/80,
      },

      expand: {
        content: false,  // Content is attach to dialog
      },

      draggable: true
    }).layout();
  } else {
    // background: scene.add.image(0, 0, 'tableQuestion'),
    // background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, sumWidthHeight/300, COLOR_LIGHT_BROWN),
    dialog = scene.rexUI.add.dialog({
      x: GET_SCREEN_WIDTH()/2,
      y: GET_SCREEN_HEIGHT()/2,

      background: scene.add.image(0, 0, 'tables', 'table_question' + '.png'),

      title: createCloseLabel(scene),

      content: scene.add.text(0, 0, 'Question Name', {
        font: sumWidthHeight/75 + 'px monospace',
        color: '#000000'
      }),

      description: scene.add.text(0, 0, String(`description description description description description description description 
          	description description description description description description description 
          	description description description description description description description 
          	description description description description description description description`), {
        wordWrap: {
          width: sumWidthHeight/5,
        },
        font: sumWidthHeight/150 + 'px monospace',
        color: '#000000'
      }),

      choices: [
        createLabel(scene, 'A. ' + 'Answer A', true),
        createLabel(scene, 'B. ' + 'Answer B', true),
        createLabel(scene, 'C. ' + 'Answer C', true),
        createLabel(scene, 'D. ' + 'Answer D', true)
      ],

      align: {
        title: 'center',
      },

      space: {
      	title: sumWidthHeight/100,
        content: sumWidthHeight/80,
        description: sumWidthHeight/80,
        choices: sumWidthHeight/150,

        left: sumWidthHeight/80,
        right: sumWidthHeight/80,
        top: sumWidthHeight/100,
        bottom: sumWidthHeight/80,
      },

      expand: {
        content: false,  // Content is a pure text object
      },

      draggable: true
    }).layout();
  }

  return dialog;
}

var createLabel = function(scene, text, isButton=false, isCenter=false){
	let sumWidthHeight=GET_SCREEN_WIDTH() + GET_SCREEN_HEIGHT();

  let label = scene.rexUI.add.label({
    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, sumWidthHeight/300, COLOR_LIGHT_BROWN),

    align: isCenter ? 'center' : 'left',

    text: scene.add.text(0, 0, text, {
      font: sumWidthHeight/150 + 'pt monospace'
    }),

    space: {
      left: sumWidthHeight/300,
      right: sumWidthHeight/300,
      top: sumWidthHeight/300,
      bottom: sumWidthHeight/300
    }
  }).setDepth(scene.DEPTH_COUNT + 1);
  if(isButton){
  	// select answer
    label.setInteractive({useHandCursor: true})
    .on('pointerover', function(pointer, gameObject){
      this.getElement('background').setStrokeStyle(2, COLOR_WHITE);
    })
    .on('pointerout', function(pointer, gameObject){
      this.getElement('background').setStrokeStyle(2, COLOR_LIGHT_BROWN);
    })
    .on('pointerup', function(pointer, gameObject){
    	console.log(text);
      // answer question
    });
  }

  return label;
}

var createCloseLabel = function(scene, isWithTitle=false){
	let sumWidthHeight=GET_SCREEN_WIDTH() + GET_SCREEN_HEIGHT();

	let label = scene.rexUI.add.label({
    text: scene.rexUI.add.label({
    	background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, sumWidthHeight/200, COLOR_DARK_BROWN),
    	text: scene.add.image(0, 0, 'tables', 'table_close' + '.png').setScale(sumWidthHeight/75/127),
    }),
    align: 'right',

    space: {
      top: sumWidthHeight/200,
      bottom: sumWidthHeight/200
    }
  }).setDepth(scene.DEPTH_COUNT + 1);

	label.getElement('text')
	.setInteractive({useHandCursor: true})
  .on('pointerover', function(pointer, gameObject){
    this.getElement('background').setStrokeStyle(2, COLOR_WHITE);
  })
  .on('pointerout', function(pointer, gameObject){
    this.getElement('background').setStrokeStyle(2, COLOR_LIGHT_BROWN);
  })
  .on('pointerup', function(pointer, gameObject){
    let dialog = (isWithTitle ? this.rexContainer.parent.rexContainer.parent.rexContainer.parent : this.rexContainer.parent.rexContainer.parent);

  	dialog.destroy();
  	scene.destroyCoverBackgroundPanel2();
  });

  return label;
}

// button for handle tic tac toe game
var createTTTButton = function(scene, position){
  return scene.rexUI.add.label({
    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10).setStrokeStyle(2, COLOR_LIGHT_BROWN),
    text: scene.add.text(0, 0, ' ', {
      fontSize: (GET_SCREEN_WIDTH() + GET_SCREEN_HEIGHT())/50 + 'px monospace',
      color: '#ffffff'
    }),
    align: 'center'
  }).setDepth(1)
  .setInteractive({useHandCursor: true})
  .on('pointerover', function(pointer, gameObject){
    this.getElement('background').setStrokeStyle(2, COLOR_WHITE);
  })
  .on('pointerout', function(pointer, gameObject){
    this.getElement('background').setStrokeStyle(2, COLOR_LIGHT_BROWN);
  })
  .on('pointerup', function(pointer, gameObject){
    if(TIC_TAC_TOE.isYourTurn){
      TIC_TAC_TOE.setMarkPosition(position, this);
    }
  });
}

export var createCongratulationScore = function(score='10'){
  let sumWidthHeight = GET_SCREEN_WIDTH()+GET_SCREEN_HEIGHT();

  if(TIC_TAC_TOE){
    TIC_TAC_TOE = null;
  }
  if(SSScene.currentQuestion){
    SSScene.currentQuestion.destroy();
  }

  // congratulation
  let label = SSScene.rexUI.add.label({
    x: sumWidthHeight/30, y: sumWidthHeight/30,
    text: SSScene.add.text(0, 0, 'SCORE: ' + score, {
      font: sumWidthHeight/30 + 'px monospace',
      color: 'rgba(0, 255, 200, 1)'
    }),

    space: {
      left: sumWidthHeight/150,
      right: sumWidthHeight/150,
      top: sumWidthHeight/150,
      bottom: sumWidthHeight/150,
    }
  }).layout();

  label.setScrollFactor(0);

  SSScene.plugins.get('rexanchorplugin').add(label, {
    // left: '0%+0',
    // right: '0%+0',
    centerX: '50%+0',
    // x: '0%+0',

    // top: '0%+0',
    // bottom: '0%+0',
    centerY: '50%+0',
    // y: '0%+0'
  });

  var tween = SSScene.tweens.add({
    targets: label,
    alpha: { from: 0.2, to: 1 },
    ease: 'Quad.Out',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
    duration: 1000,
    repeat: 0,            // -1: infinity
    yoyo: true,

    onComplete: function(){
      tween.remove();
      label.destroy();
      SSSceneUI.destroyCoverBackgroundPanel2();
    }
  });
};

export var loadScoreTable = function(scene){
  let sumWidthHeight = (GET_SCREEN_WIDTH() + GET_SCREEN_HEIGHT());

  // let label = scene.add.text(0, 0, 'Arrows keys to move', {
  //   fontSize: '18px',
  //   padding: { x: 10, y: 5 },
  //   backgroundColor: '#ffffff',
  //   fill: '#000000'
  // });

  // scene.plugins.get('rexanchorplugin').add(label, {
  //   // left: '0%+0',
  //   // right: '0%+0',
  //   centerX: '50%+0',
  //   // x: '0%+0',

  //   // top: '0%+0',
  //   // bottom: '0%+0',
  //   centerY: '50%+0',
  //   // y: '0%+0'
  // });

  // label.setScrollFactor(0);
}