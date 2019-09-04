import {
  init,
  load,
  initKeys,
  Sprite,
  SpriteSheet,
  imageAssets,
  setImagePath,
  keyPressed,
  GameLoop,
  TileEngine,
  getCanvas
} from "kontra/src/kontra";
import { setCanvasSize, getImage } from "./helper";
import martyImagePath from '../assets/marty1.png';
import nuclerPlantPath from "../assets/nuclearPlant.png";
import sunPath from "../assets/sun.png";
import moonPath from "../assets/moon.png";
import buildingPath from "../assets/buildings.png";
import deloreanOpenPath from '../assets/deloreanOpen.png';
import deloreanClosedPath from '../assets/deloreanClosed.png';
import { getBackground } from "./background";

(async () => {
  let { canvas, context } = init();
  initKeys();
  setCanvasSize();

  let score = 0;
  let energy = 3;
  let sprites = [];
  sprites.push(getBackground());

  function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "deeppink";
    context.fillText("Score: " + score, 8, 20);
  }

  function drawEnergy() {
    context.font = "16px Arial";
    context.fillStyle = "yellow";
    context.fillText("Life-Energy: " + energy, 100, 20);
  }

  function createNuclearStick(x, y, color) {
    let nuclearStick = Sprite({
      type: 'nuclearStick',
      x: x,
      y: y,
      width: 50,
      height: 50,
      dx: Math.random() * 1.2,
      dy: Math.random() * 1.2,
      // radius: radius,
      render() {
        this.context.save();
        this.context.strokeStyle = color;
        this.context.fillStyle = 'springgreen';
        this.context.shadowBlur = 10;
        this.context.shadowColor = "springgreen";
        this.context.fillRect(this.x, this.y, 5, 20);
        this.context.beginPath();  // start drawing a shape
        this.context.rect(this.x, this.y, 5, 20);
        this.context.stroke();     // outline the circle
        this.context.restore();
      }
    });
    sprites.push(nuclearStick);
  }

  for (let i = 0; i < 20; i++) {
    createNuclearStick(200, -10, "springgreen");
    createNuclearStick(550, -10, "springgreen");
  }

// setImagePath('assets');
  // Image asset can be accessed by both
  // name: imageAssets['assets/imgs/character']
  // path: imageAssets['assets/imgs/character.png']
  // console.log('images', imageAssets)

  const martyImage = await getImage(martyImagePath);
  const obstacleImage = await getImage(nuclerPlantPath);
  const sunObstacleImage = await getImage(sunPath);
  const moonObstacleImage = await getImage(moonPath);
  const deloreanOpen = await getImage(deloreanOpenPath);
  const deloreanClosed = await getImage(deloreanClosedPath);
  // console.log('Image loaded.')
  const spriteSheet = SpriteSheet({
    image: martyImage,
    type: 'marty',
    frameWidth: 50,
    frameHeight: 52.5,
    flipX: true,
    animations: {
      // create a named animation: walk
      fly: {
        frames: '0..2',  // frames 0 through 9
        frameRate: 3
      },

      fly2: {
        frames: '0..2',  // frames 0 through 9
        frameRate: 3,
        flipX: true
      },

      accelerate: {
        frames: '4..6',  // frames 0 through 9
        frameRate: 3
      },

      speedDown1: {
        frames: '21..23',  // frames 0 through 9
        frameRate: 3
      },

      flyDown: {
        frames: '36..38',  // frames 0 through 9
        frameRate: 3
      },

      flyUp: {
        frames: '15..17',  // frames 0 through 9
        frameRate: 3
      },

      salto: {
        frames: '43..52',  // frames 0 through 9
        frameRate: 4,
        loop: false
      },

      break: {
        frames: '58..59',  // frames 0 through 9
        frameRate: 3
      },

      fall: {
        frames: '96..97',  // frames 0 through 9
        frameRate: 4,
        loop: false
      },

      die: {
        frames: '99..100',  // frames 0 through 9
        frameRate: 4,
      }

      // speedDown: {
      //   frames: '54..56',  // frames 0 through 9
      //   frameRate: 3
      // }
    }
  });

  function createObstacle(x, y, obstacleType) {
    const spriteObstacle = Sprite({
      type: obstacleType,
      x: x,
      y: y,
      width: 130,
      height: 130,
      radius: 1,
      dx: Math.random() * -2 -1,
      // anchor: { x: 0.5, y: 0.5 },
      image: obstacleType === "sun" ? sunObstacleImage : moonObstacleImage,
      update() {
        this.__proto__.update.call(this);
        if (this.x + this.width <= 0) {
          this.x = getCanvas().width + 65;
          this.y = Math.random() * getCanvas().height
        }
      }
    });

    sprites.push(spriteObstacle);
  }

  function collides(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

// placing nuclear plants
  for (let i = 0; i < 5; i++) {
    // console.log("plant loop")
    let posX = Math.random() * (window.screen.width * 0.55) + (window.screen.width * 0.3);
    let posY = Math.random() * (window.screen.height * 0.3) + (window.screen.height * 0.5);
    // let posX = Math.random() * 5000 + 300;
    let collision = true;

    // console.log("plant loop 2")
    while (collision) {
      collision = false;
      sprites.filter(s => s.type === "sun" || s.type === "moon").forEach(sprite => {
        if (collides(sprite, { x: posX, y: posY, height: 300, width: 300 })) {
          collision = true;
          posX -= 100;
          posY -= 100;

        }
      });
    }
    const obstacleType = ["moon", "sun"][Math.round(Math.random())];
    createObstacle(posX, posY, obstacleType);
  }

  let spriteDelorean = Sprite({
    type: 'delorean',
    x: window.screen.width * 0.85,
    y: 400,
    // anchor: { x: 0.5, y: 0.5 },
    image: deloreanOpen
  });

  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  const marty = Sprite({
    type: 'marty',
    x: 100,
    y: 500,
    width: 70,
    height: 70,
    dx: 0,
    dy: 0,
    // anchor: { x: 0.5, y: 0.5 },

    // required for an animation sprite
    animations: spriteSheet.animations,

    update() {
      this.advance();

      if (marty.dying) {
        return
      }

      // rotate the ship left or right
      const cos = Math.cos(degreesToRadians(this.rotation));
      const sin = Math.sin(degreesToRadians(this.rotation));
      // console.log("cos", cos)


      if (keyPressed('down')) {
        // this.rotation += -1
        this.x += -1;
        this.y += 1.5;
        marty.playAnimation('flyDown')
      } else if (keyPressed('up')) {
        // this.rotation += 1
        this.x += 1;
        this.y += -1.5;
        marty.playAnimation('flyUp')

      } else if (keyPressed('space')) {
        // this.rotation += 1
        let movementUp = setInterval(() => {
          // this.x += 1.5;
          this.y += -4;
          this.ddx = cos * 0.1;
          this.ddy = sin * 0.1;
        }, 100);

        let movementDown = setInterval(() => {
          this.x += 1;
          this.y += 1.5;
          this.ddx = cos * 0.1;
          this.ddy = sin * 0.1;
        }, 100);


        setTimeout(() => clearInterval(movementUp), 1000);
        setTimeout(() => movementDown(), 1000);
        setTimeout(() => clearInterval(movementDown), 2000);
        // this.x += 1.5;
        // this.y += -3.5;
        // this.ddx = cos * 0.2;
        // this.ddy = sin * 0.2;
        marty.playAnimation('salto')
        zzfx(.8, 0, 220, 1, .1, 1.2, 0, 0, 0); // ZzFX 0
      }
      // move marty forward in the direction it's facing

      if (keyPressed('right')) {
        this.ddx = cos * 0.05;
        this.ddy = sin * 0.05;
        zzfx(1, .1, 12, .4, .02, 1.1, 0, 0, .22); // ZzFX 4869
        marty.playAnimation('fly')

      } else if (keyPressed('left')) {
        this.ddx = cos * -0.05;
        this.ddy = sin * -0.05;
        marty.playAnimation('fly2')
      } else {
        this.ddx = this.ddy = 0;
      }
    }
  });
// let tileEngine;
//   let buildingImg = new Image();
//   buildingImg.src = buildingPath;
//
//   let spriteSkyscraper = Sprite({
//     x: 200,
//     y: 400,
//     width: 900,
//     height: 900,
//     anchor: { x: 0.5, y: 0.5 },
//
//     // required for an image sprite
//     image: buildingImg
//   });

  sprites.push(marty);

  // buildingImg.onload = () => {
  //   console.log("########### TILE ENGINE STARTED ")
  //
  //   tileEngine = TileEngine({
  //
  //     // tile size
  //     tilewidth: 100,
  //     tileheight: 100,
  //
  //     // map size in tiles
  //     width: 20,
  //     height: 50,
  //
  //     // tileset object
  //     tilesets: [{
  //       firstgid: 1,
  //       margin: 30,
  //       image: buildingImg
  //     }],
  //
  //     // layer object
  //     layers: [{
  //       name: 'skyscraper',
  //       data: [0, 0, 0, 0, 0, 0, 0, 0, 0,
  //         0, 0, 6, 7, 7, 8, 0, 0, 0,
  //         0, 6, 27, 24, 24, 25, 0, 0, 0,
  //         0, 23, 24, 24, 24, 26, 8, 0, 0,
  //         0, 23, 24, 24, 24, 24, 26, 8, 0,
  //         0, 23, 24, 24, 24, 24, 24, 25, 0,
  //         0, 40, 41, 41, 10, 24, 24, 25, 0,
  //         0, 0, 0, 0, 40, 41, 41, 42, 0,
  //         0, 0, 0, 0, 0, 0, 0, 0, 0]
  //     }]
  //   });
  //   console.log(buildingImg)
  // };

  // use kontra.gameLoop to play the animation
  // console.log('Starting game loop...')
  GameLoop({
    update: () => {
      // console.log('update');
      if (score === 2) {
        sprites.push(spriteDelorean);
      }
      // collision detection
      for (let i = 0; i < sprites.length; i++) {
        // only check for collision against asteroids
        if (sprites[i].type === 'nuclearStick') {
          for (let j = 0; j < sprites.length; j++) {
            // don't check asteroid vs. asteroid collisions
            if (sprites[j].type === 'marty') {
              let nuclearStickSprite = sprites[i];
              let martySprite = sprites[j];
              // circle vs. circle collision detection
              let dx = nuclearStickSprite.x - martySprite.x;
              let dy = nuclearStickSprite.y - martySprite.y;

              if (Math.sqrt(dx * dx + dy * dy) < nuclearStickSprite.width + martySprite.width - 60) {
                nuclearStickSprite.ttl = 0;

                score++;
                zzfx(1, .1, 397, .5, .17, 0, .1, 0, .17); // ZzFX 14565
                // console.log(score)
              }
            }
          }
        } else if (sprites[i].type === 'marty') {
          for (let j = 0; j < sprites.length; j++) {
            // don't check asteroid vs. asteroid collisions
            if (sprites[j].type === 'sun' || sprites[j].type === 'moon') {
              let martySprite = sprites[i];
              let obstacle = sprites[j];
              // circle vs. circle collision detection
              let dx = martySprite.x - obstacle.x;
              let dy = martySprite.y - obstacle.y;

              // if (Math.sqrt(dx * dx + dy * dy) < martySprite.width + obstacle.width - 160) {
              if (martySprite.collidesWith(obstacle)) {
              console.log("COLLISION")
                // if (martySprite.collidesWith(obstacle)) {
                if (energy === 1) {
                  // marty.ttl = 0;
                  setInterval(() => {
                    marty.dx = 0;
                    marty.y += -1;
                    // marty.ddx = 2;
                    // marty.ddy = 2;
                    marty.playAnimation('die');
                    marty.dying = true;
                  }, 100);

                  // setTimeout(()=> alert("Game Over!"), 2000)
                } else {
                  marty.playAnimation('fall');
                  energy -= 1;
                  marty.x = obstacle.x - 200;
                  marty.dx = 0;
                  zzfx(1, .1, 52, .5, .26, .3, 4.4, 17.8, .03); // ZzFX 33201
                }
              }
            } else if (sprites[j].type === 'delorean') {
              let martySprite = sprites[i];
              let delorean = sprites[j];
              // circle vs. circle collision detection
              let dx = martySprite.x - delorean.x;
              let dy = martySprite.y - delorean.y;

              if (score >= 2 && spriteDelorean.image === deloreanOpen && (Math.sqrt(dx * dx + dy * dy) < martySprite.width + delorean.width - 100)) {
                console.log("#######################")
                marty.ttl = 0;
                spriteDelorean.image = deloreanClosed;
                setTimeout(() => {
                  spriteDelorean.ddx = 0.04
                }, 500)
              }
            }
          }
        }
      }
      sprites = sprites.filter(sprite => sprite.isAlive());
      sprites.map(sprite => sprite.update());
    },
    render: async () => {
      // (await background()).render();
      // kontra.render();
      // tileEngine && tileEngine.render();
      sprites.map(sprite => sprite.render());
      drawScore();
      drawEnergy();

    }
  }).start();


})();
