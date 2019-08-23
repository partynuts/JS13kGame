import kontra, {
  init,
  load,
  initKeys,
  Sprite,
  SpriteSheet,
  imageAssets,
  setImagePath,
  keyPressed,
  GameLoop,
  TileEngine
} from "kontra";
import { setCanvasSize, getImage } from "./helper";

(async () => {
  let { canvas, context } = init();
  kontra.initKeys();

  setCanvasSize();

  let score = 0;
  let sprites = [];

  function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "deeppink";
    context.fillText("Score: " + score, 8, 20);
  }

  function createNuclearStick(x, y, color) {
    let nuclearStick = kontra.Sprite({
      type: 'nuclearStick',
      x: x,
      y: y,
      width: 50,
      height: 50,
      dx: Math.random() * 1.5,
      dy: Math.random() * 1.5,
      // radius: radius,
      render() {
        this.context.strokeStyle = color;
        this.context.fillStyle = 'green';
        this.context.shadowBlur = 20;
        this.context.shadowColor = "yellow";
        this.context.fillRect(this.x, this.y, 5, 20);
        this.context.beginPath();  // start drawing a shape
        this.context.rect(this.x, this.y, 5, 20);
        this.context.stroke();     // outline the circle
      }
    });
    sprites.push(nuclearStick);
  }

  for (var i = 0; i < 40; i++) {
    createNuclearStick(100, 100, "springgreen");
  }

// setImagePath('assets');
  // Image asset can be accessed by both
  // name: imageAssets['assets/imgs/character']
  // path: imageAssets['assets/imgs/character.png']
  console.log('images', imageAssets)

  const martyImage = await getImage('assets/marty1.png');
  const obstacleImage = await getImage('assets/nuclearPlant.png');
  console.log('Image loaded.')
  const spriteSheet = SpriteSheet({
    image: martyImage,
    type: 'marty',
    frameWidth: 50,
    frameHeight: 52.5,
    animations: {
      // create a named animation: walk
      fly: {
        frames: '0..2',  // frames 0 through 9
        frameRate: 3
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
        frameRate: 4
      },

      break: {
        frames: '58..59',  // frames 0 through 9
        frameRate: 3
      },

      // speedDown: {
      //   frames: '54..56',  // frames 0 through 9
      //   frameRate: 3
      // }
    }
  });

  let spriteObstacle = Sprite({
    x: 700,
    y: 600,
    width: 100,
    height: 100,
    anchor: { x: 0.5, y: 0.5 },

    // required for an image sprite
    image: obstacleImage
  });

  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  const marty = Sprite({
    x: 100,
    y: 500,
    dx: 0,
    dy: 0,
    anchor: { x: 0.5, y: 0.5 },

    // required for an animation sprite
    animations: spriteSheet.animations,
    update() {
      console.log("cursor controll");
      // rotate the ship left or right
      const cos = Math.cos(degreesToRadians(this.rotation));
      const sin = Math.sin(degreesToRadians(this.rotation));
      console.log("cos", cos)
      if (kontra.keyPressed('down')) {
        // this.rotation += -1
        this.x += -1;
        this.y += 1.5;
        marty.playAnimation('flyDown')
      } else if (kontra.keyPressed('up')) {
        // this.rotation += 1
        this.x += 1;
        this.y += -1.5;
        marty.playAnimation('flyUp')

      } else if (kontra.keyPressed('space')) {
        // this.rotation += 1
        let movementUp = setInterval(() => {
          // this.x += 1.5;
          this.y += -3;
          this.ddx = cos * 0.1;
          this.ddy = sin * 0.1;
        }, 100);

        let movementDown = setInterval(() => {
          this.x += 1.5;
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

      }
      // move marty forward in the direction it's facing

      if (kontra.keyPressed('right')) {
        this.ddx = cos * 0.05;
        this.ddy = sin * 0.05;
        marty.playAnimation('fly')

      } else if (kontra.keyPressed('left')) {
        this.ddx = cos * -0.05;
        this.ddy = sin * -0.05;
      } else {
        this.ddx = this.ddy = 0;
      }
      this.advance();
    }
  });

  let buildingImg = new Image();
  buildingImg.src = 'assets/skyscraper.png';

  let spriteSkyscraper = Sprite({
    x: 200,
    y: 400,
    width: 900,
    height: 900,
    anchor: { x: 0.5, y: 0.5 },

    // required for an image sprite
    image: buildingImg
  });

  sprites.push(marty, spriteObstacle, spriteSkyscraper);

  buildingImg.onload = () => {
    console.log("########### TILE ENGINE STARTED ")

    let tileEngine = TileEngine({

      // tile size
      tilewidth: 100,
      tileheight: 200,

      // map size in tiles
      width: 30,
      height: 30,

      // tileset object
      tilesets: [{
        firstgid: 40,
        image: buildingImg
      }],

      // layer object
      layers: [{
        name: 'skyscraper',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 6, 7, 7, 8, 0, 0, 0,
          0, 6, 27, 24, 24, 25, 0, 0, 0,
          0, 23, 24, 24, 24, 26, 8, 0, 0,
          0, 23, 24, 24, 24, 24, 26, 8, 0,
          0, 23, 24, 24, 24, 24, 24, 25, 0,
          0, 40, 41, 41, 10, 24, 24, 25, 0,
          0, 0, 0, 0, 40, 41, 41, 42, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0]
      }]
    });
    console.log(buildingImg)
     tileEngine.render();
  };


  // const background = async function() {
  //   console.log("TILE ENGINE")
  //   const skyscraperImg = await getImage('assets/skyscraper.png');
  //
  //   console.log("background")
  //   let tileEngine = TileEngine({
  //       // tile size
  //       tilewidth: 64,
  //       tileheight: 64,
  //
  //       // map size in tiles
  //       width: 9,
  //       height: 9,
  //
  //       // tileset object
  //       tilesets: [{
  //         firstgid: 1,
  //         image: img
  //       }],
  //
  //       // layer object
  //       layers: [{
  //         name: 'skyscraper',
  //         data: [ 0,  0,  0,  0,  0,  0,  0,  0,  0,
  //           0,  0,  6,  7,  7,  8,  0,  0,  0,
  //           0,  6,  27, 24, 24, 25, 0,  0,  0,
  //           0,  23, 24, 24, 24, 26, 8,  0,  0,
  //           0,  23, 24, 24, 24, 24, 26, 8,  0,
  //           0,  23, 24, 24, 24, 24, 24, 25, 0,
  //           0,  40, 41, 41, 10, 24, 24, 25, 0,
  //           0,  0,  0,  0,  40, 41, 41, 42, 0,
  //           0,  0,  0,  0,  0,  0,  0,  0,  0 ]
  //       }]
  //     });
  //
  //    return tileEngine;
  // };

  // use kontra.gameLoop to play the animation
  console.log('Starting game loop...')
  GameLoop({
    update: () => {
      console.log('update');
      // collision detection
      for (let i = 0; i < sprites.length; i++) {
        // only check for collision against asteroids
        if (sprites[i].type === 'nuclearStick') {
          for (let j = 0; j < sprites.length; j++) {
            // don't check asteroid vs. asteroid collisions
            if (sprites[j].type !== 'nuclearStick') {
              let nuclearStick = sprites[i];
              let marty = sprites[j];
              // circle vs. circle collision detection
              let dx = nuclearStick.x - marty.x;
              let dy = nuclearStick.y - marty.y;

              if (Math.sqrt(dx * dx + dy * dy) < nuclearStick.width + marty.width - 60) {
                nuclearStick.ttl = 0;
                score++;
                console.log(score)
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
      sprites.map(sprite => sprite.render());
      drawScore();

    }
  }).start();


})();
