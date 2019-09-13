import {
  init,
  load,
  initKeys,
  Sprite,
  SpriteSheet,
  imageAssets,
  setImagePath,
  GameLoop,
  getCanvas
} from "kontra/src/kontra";
import { setCanvasSize, getImage } from "./helper";
import docImagePath from '../assets/doc.gif';
import sunPath from "../assets/sun.png";
import moonPath from "../assets/moon.png";
import deloreanOpenPath from '../assets/deloreanOpen.png';
import deloreanClosedPath from '../assets/deloreanClosed.png';
import { getBackground } from "./background";
import { getDescription } from "./description";
import { descriptionText } from "./description-texts";
import { getMarty } from "./entities/marty";

(async () => {
  let { canvas, context } = init();
  initKeys();
  setCanvasSize();

  let score = 0;
  let energy = 3;
  let sprites = [];

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
    context.fillText("Life-Energy: " + (marty.dying ? 0 : energy), 100, 20);
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
      radius: 50,
      update() {
        if (findDescriptionSprite()) {
          return
        }
        this.advance()
      },
      collidesWithRound(object) {
        let dx = this.x - object.x;
        let dy = this.y - object.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.radius + object.radius;
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

  // place nuclear Sticks on screen
  for (let i = 0; i < 20; i++) {
    createNuclearStick(200, -10, "springgreen");
    createNuclearStick(550, -10, "springgreen");
  }

  const docImage = await getImage(docImagePath);
  const sunObstacleImage = await getImage(sunPath);
  const moonObstacleImage = await getImage(moonPath);
  const deloreanOpen = await getImage(deloreanOpenPath);
  const deloreanClosed = await getImage(deloreanClosedPath);
  const marty = await getMarty(findDescriptionSprite);

  const docSpriteSheet = SpriteSheet({
    image: docImage,
    type: 'doc',
    frameWidth: 50,
    frameHeight: 52.5,
    animations: {
      // create a named animation:
      talk: {
        frames: '0..1',
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
      radius: 50,
      dx: Math.random() * -2 - 1,
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
    width: 200,
    height: 80,
    radius: 20,
    image: deloreanOpen,
    collidesWithRound(object) {
      let dx = this.x - object.x;
      let dy = this.y - object.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      return distance < this.radius + object.radius;
    },
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
    } else if (marty.level2) {
      (console.log("NEXT LEVEL!"))
    }
  }

  getCanvas().addEventListener("click", removeDescriptionFromScreen);


  // use kontra.gameLoop to play the animation
  GameLoop({
    update: () => {
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
              // let dx = nuclearStickSprite.x - martySprite.x;
              // let dy = nuclearStickSprite.y - martySprite.y;

              // if (Math.sqrt(dx * dx + dy * dy) < nuclearStickSprite.width + martySprite.width - 60) {
              if (nuclearStickSprite.collidesWithRound(martySprite)) {
                if (!marty.dying) {
                  nuclearStickSprite.ttl = 0;
                  score++;
                  zzfx(1, .1, 397, .5, .17, 0, .1, 0, .17); // ZzFX 14565
                }
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
              if (martySprite.collidesWithRound(obstacle)) {
                // if (martySprite.collidesWith(obstacle)) {
                if (energy === 1) {
                  setInterval(() => {
                    marty.dx = 0;
                    marty.dy = -4;
                    marty.playAnimation('die');
                    marty.dying = true;
                  }, 100);

                  setTimeout(() => sprites.push(getDescription(descriptionText.dead)), 1500);
                  getCanvas().addEventListener("click", removeDescriptionFromScreen);
                } else {
                  marty.playAnimation('fall');
                  energy -= 1;
                  marty.x += -90 * marty.dx;
                  marty.y -= 90 * marty.dy;
                  marty.dx = 0;
                  marty.ouch = true;
                  setTimeout(() => {
                    marty.ouch = false
                  }, 500);
                  zzfx(1, .1, 52, .5, .26, .3, 4.4, 17.8, .03); // ZzFX 33201
                }
              }
            } else if (sprites[j].type === 'delorean') {
              let martySprite = sprites[i];
              let delorean = sprites[j];
              let dx = martySprite.x - delorean.x;
              let dy = martySprite.y - delorean.y;

              if (score >= 2 && spriteDelorean.image === deloreanOpen && martySprite.collidesWithRound(delorean)) {
                marty.ttl = 0;
                marty.level2 = true;
                spriteDelorean.image = deloreanClosed;
                sprites = sprites.filter(s => s !== docSprite);
                setTimeout(() => {
                  spriteDelorean.ddx = 0.04
                }, 500)
                setTimeout(() => sprites.push(getDescription(descriptionText.level2)), 1500);
                getCanvas().addEventListener("click", removeDescriptionFromScreen);
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
