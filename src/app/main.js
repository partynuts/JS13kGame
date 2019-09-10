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
import docImagePath from '../assets/doc.png';
import sunPath from "../assets/sun.png";
import moonPath from "../assets/moon.png";
import buildingPath from "../assets/buildings.png";
import deloreanOpenPath from '../assets/deloreanOpen.png';
import deloreanClosedPath from '../assets/deloreanClosed.png';
import { getBackground } from "./background";
import { getDescription } from "./description";

(async () => {
  let { canvas, context } = init();
  initKeys();
  setCanvasSize();

  let score = 0;
  let energy = 3;
  let sprites = [];

  const descriptionText = {
    level1: {
      line1: "Marty! The Delorean needs fuel to bring you and Doc Brown back. Be Quick and collect 20 nuclear sticks",
      line2: "to get the Delorean running. But be carefull to not hit the moon or the sun!",
      line3: "Click to start!"
    },
    dead: {
      line1: "You are dead and the world is lost now.",
      line2: "",
      line3: "Click to start new game!"
    }
  };

  console.log("DESC", descriptionText.level1)

  function findDescriptionSprite() {
    return sprites.find(s => s.type === "description")
  }

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
      update() {
        if (findDescriptionSprite()) {
          return
        }
        this.advance()
      },
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

  const martyImage = await getImage(martyImagePath);
  const docImage = await getImage(docImagePath);
  const sunObstacleImage = await getImage(sunPath);
  const moonObstacleImage = await getImage(moonPath);
  const deloreanOpen = await getImage(deloreanOpenPath);
  const deloreanClosed = await getImage(deloreanClosedPath);
  // console.log('Image loaded.')
  const martySpriteSheet = SpriteSheet({
    image: martyImage,
    type: 'marty',
    frameWidth: 50,
    frameHeight: 52.5,
    flipX: true,
    animations: {
      // create a named animation:
      fly: {
        frames: '0..2',
        frameRate: 3
      },

      fly2: {
        frames: '0..2',
        frameRate: 3,
        flipX: true
      },

      accelerate: {
        frames: '4..6',
        frameRate: 3
      },

      speedDown1: {
        frames: '21..23',
        frameRate: 3
      },

      flyDown: {
        frames: '36..38',
        frameRate: 3
      },

      flyUp: {
        frames: '15..17',
        frameRate: 3
      },

      salto: {
        frames: '43..52',
        frameRate: 4,
        loop: false
      },

      break: {
        frames: '58..59',
        frameRate: 3
      },

      fall: {
        frames: '96..97',
        frameRate: 4,
        loop: false
      },

      die: {
        frames: '99..100',
        frameRate: 4,
      }

      // speedDown: {
      //   frames: '54..56',  // frames 0 through 9
      //   frameRate: 3
      // }
    }
  });

  const docSpriteSheet = SpriteSheet({
    image: docImage,
    type: 'doc',
    frameWidth: 50,
    frameHeight: 52.5,
    flipX: true,
    animations: {
      // create a named animation:
      talk: {
        frames: '2..3',
        frameRate: 0.5
      },
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
      dx: Math.random() * -2 - 1,
      // anchor: { x: 0.5, y: 0.5 },
      image: obstacleType === "sun" ? sunObstacleImage : moonObstacleImage,
      update() {
        if (findDescriptionSprite()) {
          return
        }
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

// placing obstacles
  for (let i = 0; i < 5; i++) {
    let posX = Math.random() * (window.screen.width * 0.55) + (window.screen.width * 0.3);
    let posY = Math.random() * (window.screen.height * 0.3) + (window.screen.height * 0.5);
    // let posX = Math.random() * 5000 + 300;
    let collision = true;

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
    y: window.screen.height * 0.45,
    // anchor: { x: 0.5, y: 0.5 },
    image: deloreanOpen,
    render() {
      this.draw();
      if (this.image === deloreanOpen) {
        this.context.save();
        this.context.font = "16px Arial";
        this.context.fillStyle = "red";
        this.context.fillText("Quick Marty, get in!", this.x, this.y - 10);
        this.context.restore();
      }
    }
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
    animations: martySpriteSheet.animations,

    update() {
      this.advance();

      if (marty.dying) {
        return
      }

      // rotate the element left or right. --> do I need this?
      const cos = Math.cos(degreesToRadians(this.rotation));
      const sin = Math.sin(degreesToRadians(this.rotation));

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
        marty.playAnimation('salto');
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

  const docSprite = Sprite({
    type: 'doc',
    x: window.screen.width * 0.8,
    y: window.screen.height * 0.4,
    width: 70,
    height: 70,
    dx: 0,
    dy: 0,
    // required for an animation sprite
    animations: docSpriteSheet.animations,

    update() {
      this.advance();
      docSprite.playAnimation("talk");
    }
  });

  sprites.push(marty);
  sprites.push(getDescription(descriptionText.level1));

  function removeDescriptionFromScreen() {
    sprites = sprites.filter(s => s.type !== "description");
    getCanvas().removeEventListener("click", removeDescriptionFromScreen);
    if (marty.dying) {
      location.reload();
    }
  }

  getCanvas().addEventListener("click", removeDescriptionFromScreen);


  // use kontra.gameLoop to play the animation
  GameLoop({
    update: () => {
      // console.log('update');
      if (score === 2) {
        sprites.push(spriteDelorean, docSprite);
        // setTimeout(() => {sprites = sprites.filter(s => s !== infoTexts)}, 2000);
      }
      // collision detection
      for (let i = 0; i < sprites.length; i++) {
        if (sprites[i].type === 'nuclearStick') {
          for (let j = 0; j < sprites.length; j++) {
            if (sprites[j].type === 'marty') {
              let nuclearStickSprite = sprites[i];
              let martySprite = sprites[j];
              let dx = nuclearStickSprite.x - martySprite.x;
              let dy = nuclearStickSprite.y - martySprite.y;

              // if (Math.sqrt(dx * dx + dy * dy) < nuclearStickSprite.width + martySprite.width - 60) {
              if (nuclearStickSprite.collidesWith(martySprite)) {
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
                  setInterval(() => {
                    marty.dx = 0;
                    marty.y += -1;
                    marty.playAnimation('die');
                    marty.dying = true;
                  }, 100);

                  setTimeout(()=> sprites.push(getDescription(descriptionText.dead)), 1500);
                  getCanvas().addEventListener("click", removeDescriptionFromScreen);
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
              let dx = martySprite.x - delorean.x;
              let dy = martySprite.y - delorean.y;

              if (score >= 2 && spriteDelorean.image === deloreanOpen && (Math.sqrt(dx * dx + dy * dy) < martySprite.width + delorean.width - 100)) {
                marty.ttl = 0;
                spriteDelorean.image = deloreanClosed;
                sprites = sprites.filter(s => s !== docSprite);
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
      // tileEngine && tileEngine.render();
      sprites.map(sprite => sprite.render());
      drawScore();
      drawEnergy();

    }
  }).start();


})();
