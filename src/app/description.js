import { getCanvas, Sprite } from "kontra/src/kontra";

export function getDescription() {
  return genDescription(getCanvas().width, getCanvas().height);
}

function genDescription() {
  const descrCtx = getCanvas();
  // draw a random starfield on the canvas
  return Sprite({
    type: "description",
    x: 0,
    y: 0,
    height: descrCtx.height,
    width: descrCtx.width,
    opacity: 0,
    render() {

      this.context.save();
      this.context.globalAlpha = this.opacity;
      this.context.fillStyle = `rgba(0,0,0,${this.opacity})`;
      this.context.fillRect(this.x, this.y, this.width, this.height);
      this.context.font = "24px Marker Felt";
      this.context.fillStyle = "white";

      this.context.fillText("Marty! The Delorean needs fuel to bring you and Doc Brown back. Be Quick and collect 20 nuclear sticks", 250, 150);
      this.context.fillText("to get the Delorean running. But be carefull to not hit the moon or the sun!",250, 190);
      this.context.restore();
    },
    update() {
      this.advance();
      if (this.opacity < 0.75) {
        this.opacity += 0.02;
      }
    }
  });
}

