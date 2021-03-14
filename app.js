// Canvas Background
const canvasBgEl = document.getElementById("canvas-bg");
const canvasBgCtx = canvasBgEl.getContext("2d");
// Grid
const gridEl = document.getElementById("grid");
const gridCtx = gridEl.getContext("2d");
// Canvas
const canvasEl = document.getElementById("canvas");
const ctx = canvasEl.getContext("2d");
const mouseInfo = document.getElementById("mouseInfo");
const tileInfo = document.getElementById("tileInfo");
const tileSize = {
  width: 50,
  height: 50,
};
const canvasSize = { width: 500, height: 500 };
const colors = {
  HOVER: "rgba(0,0,0,0.2)",
  WHITE: "rgb(255,255,255)",
  BLACK: "rgb(0,0,0)",
  BLUE: "#2196f3",
  LAND: "#D9BCA2",
};
const tileImages = [
  "./assets/brick1.png",
  "./assets/brick2.png",
  "./assets/ground1.png",
  "./assets/land1.png",
  "./assets/land2.png",
  "./assets/land3.png",
  "./assets/land4.png",
  "./assets/land5.png",
  "./assets/land6.png",
  "./assets/land7.png",
  "./assets/land8.png",
  "./assets/land9.png",
  "./assets/water1.png",
];
const imgHover = new Image();
const imgSelected = new Image();
imgHover.src = "./assets/pattern.png";
// Base Image
const baseImage = new Image();
baseImage.src = "./assets/pattern.png";

// imgHover.src = "https://i.imgur.com/c6qF2pm.png";
imgSelected.src = "https://i.imgur.com/RJDxCO3.png";
const allTools = document.querySelectorAll("#tools button");
const allSelections = document.querySelectorAll(".controls button");
const colorSelections = document.querySelectorAll("#color-control button");
const tileSelections = document.querySelectorAll("#tile-control button");

let row,
  col,
  mosX,
  mosY,
  mosInX,
  mosInY,
  mosInXPrev = null,
  mosInYPrev = null,
  imageInTile = [],
  isTileBeingHovered = false,
  toolType = 0,
  selectedType = "color",
  selectedColor = colors.BLACK,
  selectedTileImage = tileImages[0],
  canvasRect = canvasEl.getBoundingClientRect();

//  window
window.onresize = () => {
  canvasRect = canvasEl.getBoundingClientRect();
};

function init() {
  initCanvas();
  baseImage.onload = drawGrid; //  Draw when image has loaded
}

// Set Canvas Size
function initCanvas() {
  col = canvasSize.width / tileSize.width;
  row = canvasSize.height / tileSize.height;
  initCanvasSize([canvasBgCtx, gridCtx, ctx]);
}
function initCanvasSize(arr) {
  arr.forEach((ctx) => {
    ctx.canvas.width = canvasSize.width;
    ctx.canvas.height = canvasSize.height;
  });
}

// Grid
function drawGrid() {
  for (var i = 0; i <= col; i++) {
    for (var j = 0; j <= row; j++) {
      drawBgImage(j, i);
      drawBaseTile(j, i);
    }
  }
}
function drawBgImage(x, y) {
  canvasBgCtx.drawImage(
    baseImage,
    x * tileSize.width,
    y * tileSize.height,
    tileSize.width,
    tileSize.height
  );
}
function drawBaseTile(x, y) {
  gridCtx.beginPath();
  gridCtx.strokeStyle = "#ccc";
  gridCtx.strokeRect(
    x * tileSize.width,
    y * tileSize.height,
    tileSize.width,
    tileSize.height
  );
}

// ===Tile===
function drawTile(x, y) {
  if (selectedType === "color") {
    ctx.fillStyle = selectedColor;
    ctx.fillRect(
      x * tileSize.width,
      y * tileSize.height,
      tileSize.width,
      tileSize.height
    );
  } else if (selectedType === "tile") {
    drawImageInTile(getTileImage(selectedTileImage));
  }
}

// Drawing
function drawImageInTile(img) {
  ctx.drawImage(
    img,
    mosInX * tileSize.width,
    mosInY * tileSize.height,
    tileSize.width,
    tileSize.height
  );
}

// function renderMouseHover() {
//   drawImageInTile(imgHover);
//   ctx.fillStyle = colors.HOVER;
//   ctx.fillRect(
//     mosInX * tileSize.width,
//     mosInY * tileSize.height,
//     tileSize.width,
//     tileSize.height
//   );
// }

// ===Image in Tile===
function setImageInTile() {
  let index = imageInTile.findIndex(
    (pos) => pos[0] === mosInX && pos[1] === mosInY
  );
  if (index === -1) {
    imageInTile.push([mosInX, mosInY]);
  } else {
    imageInTile.splice(index, 1);
  }
}

function isImageInTile(x, y) {
  let index = imageInTile.findIndex((pos) => pos[0] === x && pos[1] === y);
  return !(index === -1);
}

// ===Clear Canvas===
function clearCanvas(x, y) {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
}

function clearTile(x, y) {
  ctx.clearRect(
    x * tileSize.width,
    y * tileSize.height,
    tileSize.width,
    tileSize.height
  );
}

// function clearHover() {
//   // Clear rect
//   clearTile(mosInXPrev, mosInYPrev);
//   // Redraw image in tile
//   if (isImageInTile(mosInXPrev, mosInYPrev)) {
//     drawTile(mosInXPrev, mosInYPrev);
//   }
//   // Set new prev state
//   mosInXPrev = mosInX;
//   mosInYPrev = mosInY;
// }

// function isHoverout() {
//   return mosInXPrev !== mosInX || mosInYPrev !== mosInY;
// }
let isDrawing = false;

// ====Event Listeners & Handlers===
canvasEl.addEventListener("mousedown", () => {
  isDrawing = true;
});
canvasEl.addEventListener("mouseup", () => {
  if (isDrawing) {
    drawTileByType();
    isDrawing = false;
  }
});
canvasEl.addEventListener("mousemove", mouseMoveHandler);
canvasEl.addEventListener("mouseleave", () => {
  isDrawing = false;
});

function mouseMoveHandler(e) {
  // Set attributes
  mosX = e.clientX - canvasRect.left;
  mosY = e.clientY - canvasRect.top;
  mosInX = Math.floor(mosX / tileSize.width);
  mosInY = Math.floor(mosY / tileSize.height);
  // if (mosInXPrev === null && mosInYPrev === null) {
  //   mosInXPrev = mosInX;
  //   mosInYPrev = mosInY;
  // }

  // if (!isTileBeingHovered) {
  //   isTileBeingHovered = true;
  //   // renderMouseHover();
  // }
  // if (isHoverout()) {
  //   isTileBeingHovered = false;
  //   clearHover();
  // }
  if (isDrawing) {
    drawTileByType();
  }
  // Print
  if (mosX < 0 || mosY < 0) {
    return;
  } else {
    mouseInfo.innerText = `(${mosX}, ${mosY})`;
    tileInfo.innerText = `(${mosInX}, ${mosInY})`;
  }
}

function drawTileByType() {
  switch (toolType) {
    case 0:
      drawTile(mosInX, mosInY);
      break;
    case 1:
      clearTile(mosInX, mosInY);
      break;
    default:
      break;
  }
}

// ===== Utils =====
function getTileImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// let selectedColor = document.querySelector(
//   `button[data-color-index="${index}"]`
// );
// let selectedTile = document.querySelector(
//   `button[data-tile-image-index="${index}"]`
// );

function setSelection(el, type, index) {
  clearSelection(allSelections);
  el.classList.add("selected");
  switch (type) {
    case "color":
      setSelectedColor(index);
      break;
    case "tile":
      setSelectedTile(index);
      break;
    default:
      break;
  }
}

function setSelectedColor(index) {
  selectedType = "color";
  switch (index) {
    case 0:
      selectedColor = colors.BLACK;
      break;
    case 1:
      selectedColor = colors.WHITE;
      break;
    case 2:
      selectedColor = colors.BLUE;
      break;
    case 3:
      selectedColor = colors.LAND;
      break;
    default:
      break;
  }
}

function setTool(el, index) {
  clearSelection(allTools);
  el.classList.add("selected");
  toolType = index;
}

function setSelectedTile(index) {
  selectedType = "tile";
  selectedTileImage = tileImages[index];
}

function clearSelection(arr) {
  arr.forEach((item) => {
    item.classList.remove("selected");
  });
}

init();
