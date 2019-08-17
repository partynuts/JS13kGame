export function setCanvasSize() {
  const canvas = document.querySelector("#canvas");

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

export function getImage(url) {
  return new Promise(resolve => {
    let image = new Image();

    image.src = url;
    image.onload = function() {
      resolve(image);
    };
  });
}
