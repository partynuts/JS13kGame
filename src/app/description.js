import { getCanvas, Sprite } from "kontra/src/kontra";

export function getDescription(descriptionText) {
  return genDescription(descriptionText, getCanvas().width, getCanvas().height);
}

function genDescription(descriptionText) {
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
      this.context.font = "32px Courier New bold";
      this.context.fillStyle = "white";

      this.context.fillText(descriptionText.line1,250, 150);
      this.context.fillText(descriptionText.line2,250, 190);
      this.context.fillText(descriptionText.line3,250, 230);
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

