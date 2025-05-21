// www.lomz.net - 2019.
// https://stihilus.github.io/lomz/generated_p5js_portraits.html
// Modified version with proportional canvas and Notion-style UI

var sourceImg;
var vScale = 8; // Fixed scale value for height
var vScaleWidth; // Width scale will be calculated based on proportion
var fileInput, saveButton;
var originalImage = null; // Store the original image
var defaultImage; // Default image is loaded in preload.js
var isLoading = false; // Track loading state

function setup() {
  // Create a default canvas 
  createCanvas(800, 600);
  pixelDensity(2);
  frameRate(15);
  
  // Calculate width scale based on proportion 1.92:1
  vScaleWidth = vScale * 1.92;
  
  // Get references to UI elements
  fileInput = select('#file-input');
  saveButton = select('#save-button');
  
  // Add event handlers
  fileInput.changed(handleFileUpload);
  saveButton.mousePressed(saveImage);
  
  // Load default image on start
  loadDefaultImage();
}

// Load the default image
function loadDefaultImage() {
  if (defaultImage) {
    console.log("Loading default image");
    originalImage = defaultImage;
    adjustCanvasToImage(defaultImage);
    loop();
  } else {
    console.error('Default image not loaded properly');
  }
}

// Handle file upload
function handleFileUpload() {
  const file = fileInput.elt.files[0];
  
  if (file && file.type.match(/^image/)) {
    // Create URL for the uploaded file
    const fileUrl = URL.createObjectURL(file);
    
    // Load the image
    loadImage(fileUrl, img => {
      originalImage = img; // Store original image
      
      // Adjust canvas to match the image proportions
      adjustCanvasToImage(img);
      
      // Start drawing after image is loaded
      loop();
    }, error => {
      console.error('Error loading image:', error);
    });
    
    // Stop drawing until image is loaded
    noLoop();
  }
}

// Adjust canvas to match image proportions
function adjustCanvasToImage(img) {
  // Calculate canvas size while maintaining maximum dimensions
  let canvasWidth, canvasHeight;
  
  // Calculate canvas size while maintaining maximum dimensions
  // and preserving the original image aspect ratio
  if (img.width > img.height) {
    // Landscape image
    canvasWidth = min(img.width, 900);
    canvasHeight = (canvasWidth / img.width) * img.height;
  } else {
    // Portrait or square image
    canvasHeight = min(img.height, 700);
    canvasWidth = (canvasHeight / img.height) * img.width;
  }
  
  // Resize canvas to match image proportions
  resizeCanvas(Math.floor(canvasWidth), Math.floor(canvasHeight));
  
  // Create a scaled version for the mosaic
  sourceImg = img.get();
  // Adjust the width dimension to account for the new rectangle proportions
  sourceImg.resize(Math.floor(width / vScaleWidth), Math.floor(height / vScale));
}

// Save the canvas as an image
function saveImage() {
  saveCanvas('mosaic', 'png');
}

function draw() {
  background(255);
  
  // Check if image is loaded
  if (!sourceImg) return;
  
  sourceImg.loadPixels();
  
  // Calculate total width and height of the mosaic
  var totalWidth = sourceImg.width * vScaleWidth;
  var totalHeight = sourceImg.height * vScale;
  
  // Calculate offsets to center the mosaic in the canvas
  var offsetX = (width - totalWidth) / 2;
  var offsetY = (height - totalHeight) / 2;
  
  for (var y = 0; y < sourceImg.height; y++) {
    for (var x = 0; x < sourceImg.width; x++) {
      var index = (x + y * sourceImg.width) * 4;
      var r = sourceImg.pixels[index + 0];
      var g = sourceImg.pixels[index + 1];
      var b = sourceImg.pixels[index + 2];
      var bright = (r + g + b) / 3;
      if (isNaN(bright)) bright = 0;
      var w = Math.floor(map(bright, 0, 255, 0, 8));
      noStroke();
      fill(255);
      rectMode(CENTER);

      // select image from images array
      var assets_array = [img01, img02, img03, img04, img05, img06, img07, img08, img09];
      var asset = assets_array[w];
      // Use vScaleWidth for width and vScale for height to create rectangles with 1.92:1 proportion
      // Add offsets to center the mosaic
      image(asset, offsetX + x * vScaleWidth, offsetY + y * vScale, vScaleWidth, vScale);
    }
  }
}

// Сохранить текущую мозаику как изображение
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('mosaic', 'png');
  }
}