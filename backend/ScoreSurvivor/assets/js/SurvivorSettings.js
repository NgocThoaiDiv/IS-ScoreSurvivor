// map lack of decoration position for AI to avoid

const GET_SCREEN_HEIGHT = ()=> document.documentElement.clientHeight;
const GET_SCREEN_WIDTH = ()=> document.documentElement.clientWidth;

const GET_TILE_SIZE = ()=> (GET_SCREEN_WIDTH() < GET_SCREEN_HEIGHT() ? GET_SCREEN_WIDTH() : GET_SCREEN_HEIGHT())/10;

const SSSocket = io();

// scene for game, scene for mobile helper, main cam follow player, and zombies state
var SSScene, SSSceneUI, SSMainCam, SSBotState;

const BG_COLOR = '#ababab';

const COLOR_WHITE = 0xffffff;
const COLOR_BLACK = 0x000000;
const COLOR_DARK_BLACK = 0x222222;
const COLOR_GRAY = 0x333333;

const COLOR_BROWN = 0x4e342e; // brown
const COLOR_LIGHT_BROWN = 0x7b5e57; // light brown
const COLOR_DARK_BROWN = 0x260e04; // heavy brown
const COLOR_NOTIFICATION = 0x777777;

var controls, cursors, activeRoom, isLockCamera;
var dungeon, layer, map, player, otherPlayers=[];
var TIC_TAC_TOE;

var debug = false;

const TILES = {
  TOP_LEFT_WALL: 3,
  TOP_RIGHT_WALL: 4,
  BOTTOM_RIGHT_WALL: 23,
  BOTTOM_LEFT_WALL: 22,
  TOP_WALL: [
    { index: 39, weight: 4 },
    { index: [57, 58, 59], weight: 1 }
  ],
  LEFT_WALL: [
    { index: 21, weight: 4 },
    { index: [76, 95, 114], weight: 1 }
  ],
  RIGHT_WALL: [
    { index: 19, weight: 4 },
    { index: [77, 96, 115], weight: 1 }
  ],
  BOTTOM_WALL: [
    { index: 1, weight: 4 },
    { index: [78, 79, 80], weight: 1 }
  ],
  FLOOR: [
    { index: 6, weight: 20 },
    { index: [7, 8, 26], weight: 1 }
  ]
};

const allPossibleMove = {
  'top': [0, -1],
  'down': [0, 1],
  'right': [1, 0],
  'left': [-1, 0]
}, cost = 10;

function isMobile(){
  return (GET_SCREEN_WIDTH() < 768);
}