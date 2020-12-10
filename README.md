# Score Survivor

This is dungeon game based on grid map for player studying and enjoying the randomness questions of mathematic and logic with the easy one to hard one besides the competetion of solving questions by dealing time with others.

### Features!

  - Select the room to enter with given rooms on home page
  - Host is the first client enter the room
  - After every clients ready, host can start
  - The end of game will return to the home page

Game explaination: In the game, player has to find the chest and answer the question to get score. The score will be divided by the power of the answer times (even wrong or right answer). There are 2 special chests of Tic Tac Toe 4x4 game (TTT). In TTT, you have to fight with Alphabeta Agent. At first, there is a number of zombies find the shortest paths to their corresponding chests. Player can follow them to find chest. When the time is over, the highest score will be winner.

#### Questions Type
   - Normal question:

![Normal](https://i.ibb.co/vZ8mPrd/Untitled.png)

   - Special question(TTT):

![TTT](https://i.ibb.co/ky7y1Mc/Untitled2.png)

The rules of TTT are:
- The diagonal on the middle must be 4 to win
- The diagonal not the middle must be 3 to win
- The horizontal or vertical must be 4 to win

### UML
   - Architecture

![alt text](https://i.ibb.co/qmT02C5/Architecture-UML.png)

   - Activity Diagram

![alt text](https://i.ibb.co/Kz4QfBM/Activity-UML.png)

### AI techniques
   - A* Algorithm with manhattan distance as heuristic

![manhattan distance](https://media.geeksforgeeks.org/wp-content/uploads/gfg-44.png)
![game zombies](https://i.ibb.co/hFHG0VN/Untitled1.png)

   - Alphabeta

![alphabeta](https://static.javatpoint.com/tutorial/ai/images/alpha-beta-pruning-step3.png)

Based on TTT rules, we can define the winner, and score for the state of AI:
- If the AI win: it will get 100 scores on that state
- If the player win: it will get -100 scores on that state
- If no more move - draw: it will get 20 scores on that state
- Moreover, the position on the board will have its on bias
- And add the randomness on different move

### Installation

   - Frontend side:
Install the dependencies and start the server on frontend.
```sh
$ cd frontend
$ npm install
$ npm start
```

   - For backend side:
Install the dependencies and start the server.
```sh
$ cd backend
$ npm install
$ node Server.js
```

### Tech

We use these libraries, frameworks to build up the game:

* [Reactjs] - JavaScript library for building single-page application
* [Nodejs] - back-end JavaScript
* [@mikewesthad/dungeon] - dungeon generator
* [Phaser 3] - fast canvas support library
* [Expressjs] - fast node.js network app framework converter

