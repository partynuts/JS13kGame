import { getCanvas, Sprite } from "kontra/src/kontra";

export function getBackground() {
  console.log("Background")
  const backImage = genRandomStarsImage(getCanvas().width, getCanvas().height);

  return Sprite({
    x: 0, y: 0, dx: -1,
    update() {
      this.advance();
      if (this.x <= -backImage.width) {
        this.x = 0;
      }
    },
    render() {
      this.context.drawImage(backImage, this.x, 0);
      this.context.drawImage(backImage, backImage.width + this.x, 0);
    }
  });
}

function genRandomStarsImage(width, height) {
  const backgroundCanvas = document.createElement('canvas');
  backgroundCanvas.width = width;
  backgroundCanvas.height = height;
  const bkCtx = backgroundCanvas.getContext('2d');
  // draw a random starfield on the canvas
  bkCtx.beginPath();
  bkCtx.fillStyle = "midnightblue";
  bkCtx.rect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  bkCtx.fill();
  bkCtx.beginPath();
  for (let n = 0; n < 100; n++) {
    let x = parseInt(Math.random() * backgroundCanvas.width);
    let y = parseInt(Math.random() * backgroundCanvas.height);
    let radius = Math.random() * 3;
    bkCtx.arc(x, y, radius, 0, Math.PI * 2, false);
    bkCtx.closePath();
  }
  bkCtx.fillStyle = "yellow";
  bkCtx.fill();

  // create an new image using the starfield canvas
  const backgroundImg = document.createElement("img");
  backgroundImg.src = backgroundCanvas.toDataURL();
  return backgroundImg;
}