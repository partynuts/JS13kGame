import kontra, {
  init,
  load,
  initKeys,
  Sprite,
  SpriteSheet,
  imageAssets,
  setImagePath,
  keyPressed,
  GameLoop
} from "kontra";
import { setCanvasSize, getImage } from "./helper";

(async () => {
  let { canvas, context } = init();
  kontra.initKeys();

  setCanvasSize();

  let sprites = [];

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

  for (var i = 0; i < 10; i++) {
    createNuclearStick(100, 100,  "springgreen");
  }

// setImagePath('assets');
  // Image asset can be accessed by both
  // name: imageAssets['assets/imgs/character']
  // path: imageAssets['assets/imgs/character.png']
  console.log('images', imageAssets)

  const image = await getImage('assets/marty.png');
  console.log('Image loaded.')
  const spriteSheet = SpriteSheet({
    image,
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
        frames: '22..24',  // frames 0 through 9
        frameRate: 3
      },

      flyDown: {
        frames: '18..20',  // frames 0 through 9
        frameRate: 3
      },

      salto: {
        frames: '25..31',  // frames 0 through 9
        frameRate: 3
      },

      break: {
        frames: '58..59',  // frames 0 through 9
        frameRate: 3
      },

      speedDown: {
        frames: '54..56',  // frames 0 through 9
        frameRate: 3
      }
    }
  });
  console.log(spriteSheet.type);
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
    // render() {
    //   this.context.save();
    //   // transform the origin and rotate around it
    //   // using the ships rotation
    //   this.context.translate(this.x, this.y);
    //   this.context.rotate(degreesToRadians(this.rotation));
    //   this.context.restore();
    // },

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
      }

      else if (kontra.keyPressed('up')) {
        // this.rotation += 1
        this.x += 1;
        this.y += -1.5;
      }
      // move the ship forward in the direction it's facing

      if (kontra.keyPressed('right')) {
        this.ddx = cos * 0.05;
        this.ddy = sin * 0.05;
      } else if (kontra.keyPressed('left')) {
        this.ddx = cos * -0.05;
        this.ddy = sin * -0.05;
      }
      else {
        this.ddx = this.ddy = 0;
      }
      this.advance();
    }
  });
  sprites.push(marty);

  // use kontra.gameLoop to play the animation
  console.log('Starting game loop...')
  GameLoop({
    update: () => {
      console.log('update')
      sprites.map(sprite => sprite.update());
    },
    render: () => {
      sprites.map(sprite => sprite.render());
    }
  }).start();


})();
