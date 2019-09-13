import kontra from "kontra";
import { keyPressed, Sprite, SpriteSheet } from "kontra/src/kontra";
import { getImage } from "../helper";
import martyImagePath from "../../assets/marty2.png";



export async function getMarty(findDescriptionSprite) {
  const martyImage = await getImage(martyImagePath);

  const martySpriteSheet = SpriteSheet({
    image: martyImage,
    type: 'marty',
    frameWidth: 50,
    frameHeight: 52.5,
    animations: {
      // create a named animation:
      fly: {
        frames: '0..2',
        frameRate: 3
      },

      fly2: {
        frames: '0..2',
        frameRate: 3,
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
        frames: '43..45', //36..38
        frameRate: 3
      },

      flyUp: {
        frames: '11..13',
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


  const marty = Sprite({
    type: 'marty',
    x: 100,
    y: 500,
    width: 70,
    height: 70,
    dx: 0,
    dy: 0,
    radius: 10,
    stop() {
      this.ddx = this.dx = 0;
    },
    stopY() {
      this.ddy = this.dy = 0;
    },
    collidesWithRound(object) {
      let dx = (this.x + this.width / 2) - (object.x + object.width / 2);
      let dy = (this.y + this.height / 2) - (object.y + object.height / 2);
      let distance = Math.sqrt(dx * dx + dy * dy);

      return distance < this.radius + object.radius;
    },

    // required for an animation sprite
    animations: martySpriteSheet.animations,

    update() {
      this.advance();
      if (this.x <= 0) {
        this.x = 0
      }
      if (this.x >= canvas.width - this.width) {
        this.stop();
        this.x = canvas.width - this.width;
      }
      if (this.y <= 0 && !marty.dying) {
        this.y = 0
      }
      if (this.y >= canvas.height - this.height) {
        this.stopY();
        this.y = canvas.height - this.height;
      }

      if (marty.dying || marty.ouch || findDescriptionSprite() || marty.currentAnimation === marty.animations.salto) {
        return
      }
      // rotate the element left or right. --> do I need this?
      function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
      }
      const cos = Math.cos(degreesToRadians(this.rotation));
      const sin = Math.sin(degreesToRadians(this.rotation));
      console.log(keyPressed("up"), keyPressed('right'), keyPressed('down'));
      if (keyPressed('down')) {
        // this.rotation += -1
        this.dx = 1;
        this.dy = 1.5;

        marty.playAnimation('flyDown')
      } else if (keyPressed('up')) {
        // this.rotation += 1
        this.dx = 1;
        this.dy = -1.5;

        marty.playAnimation('flyUp')

      } else if (keyPressed('space')) {
        this.dx = 1.5;
        this.dy = -4;
        setTimeout(() => {
          this.dx = 1;
          this.dy = 4
        }, 1000);

        setTimeout(() => {
          this.dx = 0;
          this.dy = 0;
          marty.playAnimation('fly')
        }, 2000)

        marty.playAnimation('salto');
        zzfx(.8, 0, 220, 1, .1, 1.2, 0, 0, 0); // ZzFX 0
      } else {
        this.dy = 0;
        marty.playAnimation('fly')
      }
      // move marty forward in the direction it's facing

      if (keyPressed('right')) {
        this.ddx = cos * 0.05;
        this.ddy = sin * 0.05;
        zzfx(1, .1, 12, .4, .02, 1.1, 0, 0, .22); // ZzFX 4869
        marty.playAnimation('fly')
        this.width = 70;
      } else if (keyPressed('left')) {
        this.ddx = cos * -0.05;
        this.ddy = sin * -0.05;
        this.width = -70;
        marty.playAnimation('fly2')
      } else {
        this.ddx = this.ddy = 0;
      }
    }
  });
  return marty;
}
