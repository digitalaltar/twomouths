let img; // Image variable
let buffer; // Graphics buffer for drawing
let xPos; // X position of the poem
let poems = [ /* Array of poems */
  `In the shadowed depths of speech's domain,
Two mouths entwined, a subtle, cryptic game.
An enigma veiled, a code switched and sought,
In the realms of tongues, a delicate plot.`,

  `One mouth, a vessel of eloquence so keen,
With polished words, it reigns as it convenes.
But hidden deep, in whispers undefined,
The other mouth reveals what's left behind.`,

  `With each switch, a shift, a seamless disguise,
A code-switcher's art, where wisdom lies.
In this dual existence, we find our way,
In languages entwined, we navigate the fray.`,

  `Two mouths, two paths, through shadows they roam,
Cryptic and elusive, secrets to be known.
A code-switcher's world, where meanings flow,
In this cryptic dance of tongues, we'll always grow.`
]; // Add more poems as needed

let poem; // Variable to hold the selected poem
let poemWidth; // Width of the poem text
let imageX, imageY; // Center coordinates for the image
let imgWidth, imgHeight; // Width and height of the resized image

function preload() {
  img = loadImage('twomouths.jpg'); // Load your image
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  buffer = createGraphics(windowWidth, windowHeight);

  img.loadPixels();

  // Calculate the scaling factors for both width and height to fit the image
  let scaleX = width / img.width;
  let scaleY = height / img.height;
  let scale = min(scaleX, scaleY);

  // Resize the image based on the minimum scaling factor to fit the screen
  img.resize(img.width * scale, img.height * scale);

  // Set image coordinates to center
  imageX = (width - img.width) / 2;
  imageY = (height - img.height) / 2;

  poem = random(poems);
  textSize(width / 10);
  textLeading(width / 15);
  textAlign(LEFT, CENTER);
  xPos = width;

  poemWidth = textWidth(poem);
}

function draw() {
  background(0);

  // Chromatic aberration effect
  let shiftX = sin(frameCount * 0.01) * 20;
  let shiftY = cos(frameCount * 0.01) * 20;

  buffer.clear();
  buffer.image(img, imageX, imageY); // Centered image
  applyChromaticAberration(shiftX, shiftY);

  // Semi-transparent text
  fill(255, 255, 255, 100); // White color with semi-transparency
  // Draw the poem text twice for continuous repetition
  text(poem, xPos, height / 1.3);
  text(poem, xPos + poemWidth, height / 1.3);

  xPos -= 2; // Move text to the left. Adjust speed as needed.

  // Reset xPos to create a repeating scroll effect
  if (xPos < -poemWidth) {
    xPos = width;
  }
  invertColorsAroundMouse(100);
}

function applyChromaticAberration(shiftX, shiftY) {
  // Apply chromatic aberration effect on separate channels
  push();
  blendMode(SCREEN);
  tint(255, 0, 0); // Red channel
  image(buffer, shiftX, shiftY);
  tint(0, 255, 0); // Green channel
  image(buffer, 0, 0);
  tint(0, 0, 255); // Blue channel
  image(buffer, -shiftX, -shiftY);
  pop();
  noTint(); // Reset tint
}

function invertColorsAroundMouse(size) {
  loadPixels();
  img.loadPixels();
  
  let d = pixelDensity();
  let halfSize = size / 2;
  
  for (let x = max(0, mouseX - halfSize); x < min(width, mouseX + halfSize); x++) {
    for (let y = max(0, mouseY - halfSize); y < min(height, mouseY + halfSize); y++) {
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          // Calculate the 1D location from a 2D grid
          let index = 4 * ((y * d + j) * width * d + (x * d + i));
          pixels[index] = 255 - pixels[index];       // Invert Red
          pixels[index + 1] = 255 - pixels[index + 1]; // Invert Green
          pixels[index + 2] = 255 - pixels[index + 2]; // Invert Blue
          // Alpha channel remains the same
        }
      }
    }
  }

  updatePixels();
}