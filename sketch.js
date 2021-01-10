/* POSTHUMAN KOAN

*/
let w, h, moveZ;
let angle;

let video, poseNet, skeleton, pose, nose, face;

let pillarBack1, pillarBack2;

let waterfall, clouds, poem;

let cantarell, cantarell_italic;

let _line1;

let poemText = ["I_am", "now_a", "temple", "in_the", "fire"];

let Lrot = 0;
let Lerot = 0;
let Rrot = 0;
let Rerot = 0;

let start = false;
let count = 0;

function preload() {
  pillarBack1 = loadModel('assets/obj/stonePillar_1.obj', true); 
  
  for (var i = 0; i < poemText.length; i++){
    poemText[i] = loadModel('assets/obj/' + i + '.obj', true);
  }  
  
  waterfall = createVideo('assets/waterfall.mov');
  waterfall.hide();
  
  poem = loadSound('assets/postHumanKoan_poem.mp3');
  cantarell = loadFont('assets/Cantarell-Bold.ttf');
  cantarell_italic = loadFont('assets/Cantarell-BoldItalic.ttf');
  
  clouds = loadImage('assets/storm-clouds.jpg');
}

function setup() {
  w = window.innerWidth; //640;
  h = window.innerHeight; //480;
  createCanvas(w, h, WEBGL);
  video = createCapture(VIDEO);
  video.size(w, h);
  
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses); //gotPoses callback does...
  video.hide();
  
  colorMode(HSB, 360, 100, 100);
  angle = 0;
  
  //font
  textFont(cantarell);
  fill(255);
  textSize(40);
  frameRate(30);
  //Opening screen
  _line1 = createGraphics(w - 4, h - 4);
}

function modelReady() {
  console.log('Model loaded!');
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function drawSkeleton() {
  if (pose) {
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      
      if (i == 5) { //left Shoulder        
        push(); //mapping y coordinate of elbow to rotate arm
        let pX  = 20;
        let pY = 15;
        let LelbowV = createVector(pose.leftElbow.x, pose.leftElbow.y);
        let LshoulderRot = map(LelbowV.y, 0, height, -PI/9, PI/6 - 0.4);
        Lrot = lerp(LshoulderRot, Lrot, 0.5); //smooth rotation
        
        noStroke();
        specularMaterial(25, 100, 20);
        translate(x + pX, y + pY);
        rotateZ(-PI/6);
        rotateZ(Lrot*6);
        scale(1, 1.5, 1); //make Y dimension longer
        translate(0, 0 + (pY*6)); //offset
        model(pillarBack1);
        pop();
      }
      if (i == 7) { //Left elbow
        push();
        let pX = 10;
        let pY = 20;
        let LwristV = createVector(pose.leftWrist.x, pose.leftWrist.y);
        let LElbowRot = map(LwristV.y, 0, height, -PI/2, PI/2);
        Lerot = lerp(LElbowRot, Lerot, 0.5);
        
        noStroke();
        specularMaterial(25, 100, 20);
        translate(x + pX, y + pY);
        rotateZ(LElbowRot*2);
        translate(0, 0 + (pY*6)); //offset
        model(pillarBack1);
        pop();
      }
      if (i == 6) { //Right Shoulder        
        push(); //mapping y coordinate of elbow to rotate arm
        let pX  = 20;
        let pY = 15;
        let RelbowV = createVector(pose.rightElbow.x, pose.rightElbow.y);
        let RshoulderRot = map(RelbowV.y, 0, height, PI/9, - PI/6 + 0.4);
        Rrot = lerp(RshoulderRot, Rrot, 0.5); //smooth rotation
        
        noStroke();
        specularMaterial(25, 100, 20);
        translate(x + pX, y + pY);
        rotateZ(PI/6);
        rotateZ(RshoulderRot*6);
        scale(1, 1.5, 1); //make Y dimension longer
        translate(0, 0 + (pY*6)); //offset
        model(pillarBack1);
        pop();
      }
      if (i == 8) { //Right elbow
        push();
        let pX = 10;
        let pY = 20;
        let RwristV = createVector(pose.rightWrist.x, pose.rightWrist.y);
        let RElbowRot = map(RwristV.y, 0, height, PI/2, - PI/2);
        Rerot = lerp(RElbowRot, Rerot, 0.2);
        noStroke();
        specularMaterial(25, 100, 20);
        translate(x + pX, y + pY);
        rotateZ(RElbowRot*2);
        translate(0, 0 + (pY*6)); //offset
        model(pillarBack1);
        pop();
      }
    }
  }
}
function draw() {
  if (!start) {
    startScreen();
  } else {
    console.log(count);
    background(210, 100, 100);
  
  ambientLight(30, 0, 100); // ambient white light
  directionalLight(0, 50, 50, 0.75, 1, 1); //pink light coming from the top right back
  let pointY = map(mouseY, 0, height, -50, 50);
  let brightness = map(sin(frameCount * 0.01), -1, 1, 0, 100);
  pointLight(240, 100, brightness, mouseX, mouseY, 500);
  
  push(); //back plane with clouds
  noStroke();
  ambientMaterial(210, 100, 100);
  translate(0, -h/2 + 50, -w);
  texture(clouds);
  plane(w*4, h*4);
  pop();
    
  push();
  scale(-1, 1);
  translate(-width/2, -height/2); //position correctly
  drawSkeleton(); //draws pillars
    
    if (pose){
      let ang1 = TWO_PI * noise(0.01*frameCount + 10);
      let eyeR = pose.rightEye;
      let eyeL = pose.leftEye;
      let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
      
      translate(pose.nose.x, pose.nose.y, 10 + d); // Place waterfall box on face/nose position
      normalMaterial();
      noStroke();
      texture(waterfall); //It looks like p5js flips texture in th z-axis, causing two sides of the box to have a stretched sideways video. 
      rotateY(angle*0.02);
      box(300, 170, 300);
      pop();
    }
      push();
      drawPoem();
      pop();
  } 
}

function startScreen() {
  background(0);
  
  moveZ = map(mouseY, 0, height, 0, 100);
  _line1.textFont(cantarell);
  _line1.textAlign(CENTER);
  _line1.textSize(30);
  _line1.fill(255, moveZ, moveZ/2);
  _line1.text('Welcome. Click to begin. Stand 1 metre away to move as the pillars',w*0.5, h*0.5);
  
  push(); //Poem line 1
  noStroke();
  texture(_line1); //texture plane from graphics buffer
  translate(0, 0, moveZ);
  plane(w, h);
  pop();
}
function drawPoem() {
  count+=1;
  if (pose) { //only draws once pose is detected so loads at same time
  let ang1 = PI/2 * noise(0.01*frameCount + 20);
  let ang2 = TWO_PI * noise(0.01*frameCount + 80);
  push();
    translate(-180, -10, 425);
    rotateX(PI);
    rotateY(-ang1);
    scale(0.5);
    noStroke();
    specularMaterial(300, 100, 100); //pink
    model(poemText[0]); // "I am"
  pop();
  push();
    translate(-100, 20, 400);
    rotateX(PI); // PI is normal. 
    rotateY(-PI/4);
    rotateY(-ang1);
    scale(0.5);
    noStroke();
    specularMaterial(330, 100, 100); //reddish bright pink
    model(poemText[1]); // "now a"
  pop();
  push();
    translate(0, -25 + (ang2*2), 400);
    rotateX(PI);
    if (count >= 500 && count <= 620) {
      rotateX(angle*0.05);
    }
    noStroke();
    specularMaterial(0, 50, 100); //light red/pink
    model(poemText[2]); // "temple"
  pop();
  push();
    translate(90, 25, 400);
    rotateX(PI);
    rotateY(PI/2);
    rotateY(ang1 * -1);
    scale(0.5);
    noStroke();
    specularMaterial(30, 100, 100); //red
    model(poemText[3]); // "in the"
  pop();
  push();
    translate(200, 0, 400);
    rotateX(PI);
    rotateY(ang1);
    scale(0.5);
    noStroke();
    specularMaterial(60, 100, 100);
    model(poemText[4]); // "fire"
  pop();
  angle++;
  }
}
function mousePressed() {
  start = true;
  
  waterfall.play();
  waterfall.loop();
  
  poem.play();
  poem.onended(replayPoem);
}

function replayPoem() {
  count = 0;
  poem.play();
}