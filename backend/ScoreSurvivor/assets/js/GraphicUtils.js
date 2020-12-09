import { TicTacToeGameState } from './TicTacToe.js';

export var createQuestionTable = function(scene, room){
  let dialog, sumWidthHeight=GET_SCREEN_WIDTH() + GET_SCREEN_HEIGHT(), iconItem;
  scene.createCoverBackgroundPanel2();

  // load tic tac toe game to fight with bot
  if(room.isSpecialChest){
    // init game
    TIC_TAC_TOE = new TicTacToeGameState(room.id);

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
    iconItem = scene.add.image(0, 0, 'questions', room.questionMap.id + '.png');
    dialog = scene.rexUI.add.dialog({
      x: GET_SCREEN_WIDTH()/2,
      y: GET_SCREEN_HEIGHT()/2,

      questionId: room.id,

      background: scene.add.image(0, 0, 'tables', 'table_question' + '.png'),

      title: createCloseLabel(scene),

      content: scene.add.text(0, 0, 'Problem', {
        font: sumWidthHeight/75 + 'px monospace',
        color: '#000000'
      }),

      description: scene.add.image(0, 0, 'questions', room.questionMap.id + '.png').setScale(sumWidthHeight/2.5/(iconItem.width > iconItem.height ? iconItem.width : iconItem.height)),

      choices: [
        createLabel(scene, 'A. ' + room.questionMap.answers[0], room, true),
        createLabel(scene, 'B. ' + room.questionMap.answers[1], room, true),
        createLabel(scene, 'C. ' + room.questionMap.answers[2], room, true),
        createLabel(scene, 'D. ' + room.questionMap.answers[3], room, true)
      ],

      align: {
        title: 'center',
      },

      space: {
      	title: sumWidthHeight/100,
        content: sumWidthHeight/80,
        description: sumWidthHeight/80,
        choices: sumWidthHeight/150,

        choice: sumWidthHeight/300,

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

  if(iconItem){
    iconItem.destroy();
  }

  return dialog;
}

var createLabel = function(scene, text, room=null, isButton=false, isCenter=false){
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
      if(room){
        // answer question
        SSSocket.emit('answer-question', {
          questionId: room.id,
          name: userId,
          answer: text
        });
      }
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

export var createCongratulation = function(score='10', winner=undefined){
  let label, sumWidthHeight = GET_SCREEN_WIDTH()+GET_SCREEN_HEIGHT();

  if(TIC_TAC_TOE){
    TIC_TAC_TOE = null;
  }
  if(SSScene.currentQuestion){
    SSScene.currentQuestion.destroy();
  }

  // congratulation
  if(winner){
    label = SSScene.rexUI.add.label({
      x: sumWidthHeight/30, y: sumWidthHeight/30,
      text: SSScene.add.text(0, 0, ['CONGRATULATION!', 'The Winner: ' + winner], {
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
  } else {
    label = SSScene.rexUI.add.label({
      x: sumWidthHeight/30, y: sumWidthHeight/30,
      text: SSScene.add.text(0, 0, 'SCORE: ' + score, {
        font: sumWidthHeight/50 + 'px monospace',
        color: 'rgba(0, 255, 200, 1)'
      }),

      space: {
        left: sumWidthHeight/150,
        right: sumWidthHeight/150,
        top: sumWidthHeight/150,
        bottom: sumWidthHeight/150,
      }
    }).layout();
  }

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

  let scoreList = otherPlayers.concat([player]); // set up list
  scoreList.sort((a, b)=> b.score-a.score); // sort score max->min

  let label = scene.rexUI.add.label({
    orientation: 1, // vertical

    text: scene.add.text(0, 0, 'Score list', {
      font: sumWidthHeight/75 + 'pt monospace',
      padding: { x: 10, y: 5 },
      backgroundColor: '#adadad'
    }), // title
    action: scene.rexUI.add.label({
      orientation: 0, // horizontal

      text: scene.add.text(0, 0, scoreList.map((user, idx)=>user.player_id), {
        font: sumWidthHeight/100 + 'pt monospace'
      }),
      action: scene.add.text(0, 0, scoreList.map((user, idx)=>user.score), {
        font: sumWidthHeight/100 + 'pt monospace'
      }),

      space: {
        text: sumWidthHeight/100, // btw name and test
      }
    }), // score list

    space: {
      text: sumWidthHeight/150, // btw title and list

      top: sumWidthHeight/100,
      left: sumWidthHeight/100,
      right: sumWidthHeight/100,
      bottom: sumWidthHeight/100
    }
  }).layout().setDepth(100);

  scene.plugins.get('rexanchorplugin').add(label, {
    left: '0%+0',
    // right: '0%+0',
    // centerX: '0%+0',
    // x: '0%+0',

    top: '0%+0',
    // bottom: '0%+0',
    // centerY: '0%+0',
    // y: '0%+0'
  });

  label.setScrollFactor(0);

  return label;
}

export var refreshScoreTable = function(scene){
  let scoreList = otherPlayers.concat([player]); // set up list
  scoreList.sort((a, b)=> b.score-a.score); // sort score max->min

  scene.scoreTable.getElement('action').getElement('text').setText(scoreList.map((user, idx)=>user.player_id));
  scene.scoreTable.getElement('action').getElement('action').setText(scoreList.map((user, idx)=>user.score));
}

export var createLimitCountDown = function(scene, time={ mm: 10, ss: 0 }){
  let sumWidthHeight = (GET_SCREEN_WIDTH() + GET_SCREEN_HEIGHT());

  let label = scene.rexUI.add.label({
    text: scene.add.text(0, 0, '~~ ' + ':' + ' ~~', {
      font: sumWidthHeight/50 + 'pt monospace',
      padding: { x: 10, y: 5 },
      color: '#ff4423',
      backgroundColor: 'rgba(200, 200, 200, 0.5)'
    }), // time

    space: {
      text: sumWidthHeight/150, // btw title and list

      top: sumWidthHeight/100,
      left: sumWidthHeight/100,
      right: sumWidthHeight/100,
      bottom: sumWidthHeight/100
    }
  }).layout().setDepth(100);

  scene.plugins.get('rexanchorplugin').add(label, {
    // left: '0%+0',
    // right: '0%+0',
    centerX: '50%+0',
    // x: '0%+0',

    top: '0%+0',
    // bottom: '0%+0',
    // centerY: '0%+0',
    // y: '0%+0'
  });

  label.setScrollFactor(0);

  return label;
}

export var refreshLimitCountDown = function(scene, time={ mm: 10, ss: 0 }){
  scene.limitCountDown.getElement('text').setText(time.mm.toString().padStart(2, '0') + ':' + time.ss.toString().padStart(2, '0'));
}