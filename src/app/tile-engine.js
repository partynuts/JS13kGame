// let tileEngine;
//   let buildingImg = new Image();
//   buildingImg.src = buildingPath;
//
//   let spriteSkyscraper = Sprite({
//     x: 200,
//     y: 400,
//     width: 900,
//     height: 900,
//     anchor: { x: 0.5, y: 0.5 },
//
//     // required for an image sprite
//     image: buildingImg
//   });


// buildingImg.onload = () => {
//   console.log("########### TILE ENGINE STARTED ")
//
//   tileEngine = TileEngine({
//
//     // tile size
//     tilewidth: 100,
//     tileheight: 100,
//
//     // map size in tiles
//     width: 20,
//     height: 50,
//
//     // tileset object
//     tilesets: [{
//       firstgid: 1,
//       margin: 30,
//       image: buildingImg
//     }],
//
//     // layer object
//     layers: [{
//       name: 'skyscraper',
//       data: [0, 0, 0, 0, 0, 0, 0, 0, 0,
//         0, 0, 6, 7, 7, 8, 0, 0, 0,
//         0, 6, 27, 24, 24, 25, 0, 0, 0,
//         0, 23, 24, 24, 24, 26, 8, 0, 0,
//         0, 23, 24, 24, 24, 24, 26, 8, 0,
//         0, 23, 24, 24, 24, 24, 24, 25, 0,
//         0, 40, 41, 41, 10, 24, 24, 25, 0,
//         0, 0, 0, 0, 40, 41, 41, 42, 0,
//         0, 0, 0, 0, 0, 0, 0, 0, 0]
//     }]
//   });
//   console.log(buildingImg)
// };