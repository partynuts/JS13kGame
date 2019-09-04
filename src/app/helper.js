export function setCanvasSize() {
  const canvases = document.querySelectorAll("canvas");

  canvases.forEach(canvas => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}

export function getImage(url) {
  return new Promise(resolve => {
    let image = new Image();

    image.src = url;
    image.onload = function () {
      resolve(image);
    };
  });
}
