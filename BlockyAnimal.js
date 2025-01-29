// ColoredPoints.js
// Vertex shader program
var VSHADER_SOURCE = `

    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    
    precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;
    }`

//Global Variables for webgl, glsl,rendering shapes

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){

    // Retrieve <canvas> element
    canvas = document.getElementById('webgl'); //Start of webgl
  
    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);

    gl = canvas.getContext("webgl", { preserveDrawingBuffer: "true"});

    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    } //End of webgl

    gl.enable(gl.DEPTH_TEST);


}
function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
      }
    
      // // Get the storage location of a_Position
      a_Position = gl.getAttribLocation(gl.program, 'a_Position');
      if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
      }
    
      // Get the storage location of u_FragColor
      u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
      if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
      }

      u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
      if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
      }

      u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
      if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
      }

      var identity_Matrix = new Matrix4();

      gl.uniformMatrix4fv(u_ModelMatrix, false, identity_Matrix.elements);
}


const POINT = 0;

const TRIANGLE = 1;

const CIRCLE = 2;

//Global variables for UI elements

let g_globalAngle= 0;

let g_globalAngle2= 0;

let g_left_front_leg = 0;

let g_right_front_leg = 0;

let g_left_back_leg = 0;

let g_right_back_leg = 0;

let g_head = 0;

let g_tail = 0;

let g_back_body = 0;

let g_front_body = 0;

let g_On = false;

var g_ShiftPressed = false;



function addActionsForHtmlUI(){

    document.getElementById("On").onclick = function() {g_On = true;};
    document.getElementById("Off").onclick = function() {g_On = false;};

    

    document.getElementById("left_front_leg_slider").addEventListener("mousemove", function(){g_left_front_leg = this.value; renderScene();});
    document.getElementById("right_front_leg_slider").addEventListener("mousemove", function(){g_right_front_leg = this.value; renderScene();});
    document.getElementById("left_back_leg_slider").addEventListener("mousemove", function(){g_left_back_leg = this.value; renderScene();});
    document.getElementById("right_back_leg_slider").addEventListener("mousemove", function(){g_right_back_leg = this.value; renderScene();});
    document.getElementById("head_slider").addEventListener("mousemove", function(){g_head = this.value; renderScene();});

    document.addEventListener("keydown", function(event) {if (event.key === "Shift") {g_ShiftPressed = true;}});

    document.addEventListener("keyup", function(event) {if (event.key === "Shift") {g_ShiftPressed = false;}});
    

    document.getElementById("angleSlide").addEventListener("mousemove", function() {g_globalAngle = this.value; renderScene(); });

    document.getElementById("tail").addEventListener("mousemove", function(){g_tail = this.value; renderScene();} );



}

function main() {

    setupWebGL(); //Setting up Canvas and GL elements

    connectVariablesToGLSL(); //Setting up GLSL shaders and connect to GLSL variables

    click();

    addActionsForHtmlUI(); //Actions for HTML UI

    canvas.onmousedown = click;

    canvas.onmousemove = function(ev) { if(ev.buttons == 1 ) {click(ev)}};


  
    // Specify the color for clearing <canvas>
    gl.clearColor(0.2, 0.2, 0.5, 1.0);
  
    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // renderScene();
    requestAnimationFrame(tick);

}

var g_StartTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_StartTime;


function tick(){

    g_seconds = performance.now()/1000.0-g_StartTime;

    // console.log(g_seconds);

    updateAnimationAngles();
    
    renderScene();

    requestAnimationFrame(tick);


}

function updateAnimationAngles(){

    if(g_On){

        g_left_front_leg = (40*Math.sin(g_seconds));

    }

    if(g_On){

        g_right_front_leg = (-40*Math.sin(g_seconds));

    }

    if(g_On){

        g_right_back_leg = (30*Math.sin(g_seconds));

    }

    if(g_On){

        g_left_back_leg = (-30*Math.sin(g_seconds));

    }

    if(g_On){

        g_tail = (15*Math.sin(g_seconds));

    }

    if(g_On){

        g_head = (5*Math.sin(g_seconds));
    }


}


function renderScene(){

    var startTime = performance.now();


    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    var globalRotMatX = new Matrix4().rotate(g_globalAngle2, 1, 0, 0);

    globalRotMat.multiply(globalRotMatX);

    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    var globalDogMatrix = new Matrix4();
    globalDogMatrix.translate(0.0, 0.0, 0.0);
    globalDogMatrix.rotate(g_globalAngle, 0, 1, 0);

    // Dog's back body
    var back_body = new Cube();
    back_body.color = [0.8, 0.8, 0.8, 1];
    back_body.matrix.set(globalDogMatrix); 
    back_body.matrix.translate(-0.4, -0.35, 0.0);
    back_body.matrix.scale(0.5, 0.4, 0.5);
    back_body.matrix.rotate(g_back_body, 0,0,1);
    
    // Dog's front body
    var front_body = new Cube();
    front_body.color = [0.8, 0.8, 0.8, 1];
    front_body.matrix.set(globalDogMatrix); 
    front_body.matrix.translate(0.1, 0.1, 0); 
    front_body.matrix.rotate(90, 1, 0, 0); 
    front_body.matrix.scale(0.4, 0.6, 0.5); 
    // front_body.render();

    //Dog collar

    var collar = new Cube();
    collar.color = [1.0, 0.0, 0.0, 1.0];
    collar.matrix.set(globalDogMatrix); 
    collar.matrix.translate(0.51, 0.1, 0); 
    collar.matrix.rotate(90, 1, 0, 0); 
    collar.matrix.scale(0., 0.6, 0.5); 
    // collar.render();


    

    // Dog's head
    var head = new Cube();
    head.color = [0.8, 0.8, 0.8, 1];
    head.matrix.set(globalDogMatrix); 
    head.matrix.translate(0.4, -0.35, 0.1);
    head.matrix.rotate(g_head, 0, 0, 1);
    head.matrix.scale(0.3, 0.4, 0.4);

    // Left eye
    var left_eye = new Cube();
    left_eye.color = [0, 0, 0, 1];
    left_eye.matrix.set(head.matrix); 
    left_eye.matrix.translate(0.75, 0.6, 0.1); 
    left_eye.matrix.scale(0.3, 0.3, 0.3);

    // Right eye
    var right_eye = new Cube();
    right_eye.color = [0, 0, 0, 1];
    right_eye.matrix.set(head.matrix);
    right_eye.matrix.translate(0.75, 0.6, 0.6); 
    right_eye.matrix.scale(0.3, 0.3, 0.3);

    // Dog's left ear
    var left_ear = new Cube();
    left_ear.color = [0.8, 0.8, 0.8, 1];
    left_ear.matrix.set(head.matrix); 
    left_ear.matrix.translate(0.35, 1, 0.1); 
    left_ear.matrix.scale(0.3,0.4,0.3);

    // Dog's right ear
    var right_ear = new Cube();
    right_ear.color = [0.8, 0.8, 0.8, 1];
    right_ear.matrix.set(head.matrix); 
    right_ear.matrix.translate(0.35, 1, 0.6); 
    right_ear.matrix.scale(0.3, 0.4, 0.3);

    // Dog's nose
    var nose = new Cube();
    nose.color = [1.0, 0.8, 0.7, 1.0];
    nose.matrix.set(head.matrix); 
    nose.matrix.translate(0.8, 0.1, 0.25); 
    nose.matrix.scale(0.6, 0.4, 0.5);

    // Nose color
    var nose_color = new Cube();
    nose_color.color = [0, 0, 0, 1];
    nose_color.matrix.set(nose.matrix);
    nose_color.matrix.translate(0.55, 0.5,0.3);
    nose_color.matrix.scale(0.5, 0.4, 0.5);

    // nose_color.render();


    //Left Front leg

    var left_front_leg = new Cube();

    left_front_leg.color = [0.8, 0.8, 0.8, 1];
    left_front_leg.matrix.set(globalDogMatrix);
    left_front_leg.matrix.translate(.4, -.3, 0.1);
    left_front_leg.matrix.rotate(180,0,0,1);
    left_front_leg.matrix.rotate(g_left_front_leg, 0,0,1);
    left_front_leg.matrix.scale(0.1, 0.4, 0.1);
    // left_front_leg.render();


    //Right front leg

    var right_front_leg = new Cube();

    right_front_leg.color = [0.8, 0.8, 0.8, 1];
    right_front_leg.matrix.set(globalDogMatrix);
    right_front_leg.matrix.translate(.4, -.3, 0.4);
    right_front_leg.matrix.rotate(180,0,0,1);
    right_front_leg.matrix.rotate(g_right_front_leg, 0,0,1);

    right_front_leg.matrix.scale(0.1, 0.4, 0.1);
    // right_front_leg.render();

    //Right back leg

    var right_back_leg = new Cube();

    right_back_leg.color = [0.8, 0.8, 0.8, 1];
    right_back_leg.matrix.set(globalDogMatrix);
    right_back_leg.matrix.translate(-.2, -.2, 0.4);
    right_back_leg.matrix.rotate(180,0,0,1);
    right_back_leg.matrix.rotate(g_right_back_leg, 0, 0, 1);

    right_back_leg.matrix.scale(0.1, 0.5, 0.1);
    // right_back_leg.render();

    //Left back leg


    var left_back_leg = new Cube();

    left_back_leg.color = [0.8, 0.8, 0.8, 1];
    left_back_leg.matrix.set(globalDogMatrix);
    left_back_leg.matrix.translate(-.2, -.2, 0.1);
    left_back_leg.matrix.rotate(180,0,0,1);
    left_back_leg.matrix.rotate(g_left_back_leg,0,0,1);

    left_back_leg.matrix.scale(0.1, 0.5, 0.1);
    // left_back_leg.render();

    //Tail

    var tail = new Cube();

    tail.color = [0.8, 0.8, 0.8, 1];
    tail.matrix.set(globalDogMatrix);
    tail.matrix.translate(-.3, -.2, 0.2);
    tail.matrix.rotate(80,0,0,1);
    tail.matrix.rotate(g_tail, 0,0,1);

    tail.matrix.scale(0.1, 0.4, 0.1);

    // tail.render();

    //Spikes

    var cone = new Cone(0.2, 0.1, 6); // Height, radius, and number of segments

    cone.matrix.set(globalDogMatrix);
    cone.matrix.translate(0.35, 0.05, 0.3);
    
    // cone.render();
    
    var cone2 = new Cone(0.2, 0.1, 6); // Height, radius, and number of segments
    
    cone2.matrix.set(globalDogMatrix);
    cone2.matrix.translate(0.2, 0.05, 0.3);
        
        
    // cone2.render();
    
    var cone3 = new Cone(0.2, 0.1, 6); // Height, radius, and number of segments

    cone3.matrix.set(globalDogMatrix);
    cone3.matrix.translate(0, 0.05, 0.3);
        
        

    
    var cone4 = new Cone(0.2, 0.1, 6); // Height, radius, and number of segments
    
    cone4.matrix.set(globalDogMatrix);
    cone4.matrix.translate(-0.2, 0.05, 0.3);
        
        

    
    if (g_ShiftPressed) {

        var collar2 = new Cube();
        collar2.color = [1.0, 0.0, 0.0, 1.0];
        collar2.matrix.set(globalDogMatrix); 
        collar2.matrix.translate(0.1, 0.1, 0); 
        collar2.matrix.rotate(90, 1, 0, 0); 
        collar2.matrix.scale(0.001, 0.6, 0.5);
        collar2.matrix.translate(200, 0,0.4);  

        right_ear.matrix.translate(-2.2,-1.4,0);
        left_ear.matrix.translate(-2.2,-1.4,0)
        nose_color.matrix.translate(-2,-3,0);



        back_body.matrix.translate(-0.4, -0.5, 0.0);
        front_body.matrix.translate(-0.5, 0,0.4);
        tail.matrix.translate(-3,0.4,0);
        left_back_leg.matrix.translate(2,-0.1,0);
        right_back_leg.matrix.translate(2,-0.1,0);
        left_front_leg.matrix.translate(2,-0.1,0);
        right_front_leg.matrix.translate(2,-0.1,0);
        head.matrix.translate(-0.6,-0.5,0);
        nose.matrix.translate(-1,-1,0);
        right_eye.matrix.translate(-2,-1.7,0);
        left_eye.matrix.translate(-2,-1.7,0);
        
        
        cone.matrix.translate(-0.2, -0.2, 0);
        cone2.matrix.translate(-0.2, -0.2, 0);
        cone3.matrix.translate(-0.25, -0.2, 0);
        cone4.matrix.translate(-0.25,-0.2, 0);
        front_body.render();
        back_body.render();
        left_back_leg.render();
        right_back_leg.render();
        left_front_leg.render();
        right_front_leg.render();
        head.render();
        tail.render();
        cone.render();
        cone2.render();
        cone3.render();
        cone4.render();
        nose_color.render();
        collar2.render();
        right_eye.render();
        left_eye.render();
        left_ear.render();
        right_ear.render();
        nose_color.render();
        nose.render();


    }else{  nose.render();
            head.render();
            front_body.render();
            back_body.render();
            left_back_leg.render();
            right_back_leg.render();
            left_front_leg.render();
            right_front_leg.render();
            tail.render();
            cone.render();
            cone2.render();
            cone3.render();
            cone4.render();
            collar.render();
            right_eye.render();
            right_ear.render();
            left_ear.render();
            left_eye.render();
            nose_color.render();

    }


    var duration = performance.now() - startTime;

    sendingToHTML(" fps: " + Math.floor(10000/duration)/10, "fps");


}


function convertCoordinatesEventToGl(ev){


    var x = ev.clientX; // x coordinate of a mouse pointer

    var y = ev.clientY; // y coordinate of a mouse pointer

    var rect = ev.target.getBoundingClientRect();
  
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return ([x,y]);
}


let frameCount = 0;
let lastTime = performance.now();
let fps = 0;

function sendingToHTML(text, HTMLID){

    var HTMLEL = document.getElementById('fps').innerText = `FPS: ${fps}`;

    let now = performance.now();
    let deltaTime = now - lastTime;

    frameCount++;
    if (deltaTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = now;


    if(!HTMLEL) {

        console.log("Failed to get " + HTMLID + " from HTML");
        return;
    } 

    HTMLEL.innerHTML= text;

    }
}

function click() {
    let lastMouseX = -1, lastMouseY = -1;
    let mouseDragged = false;

    canvas.onmousedown = function(ev) {
        let [x, y] = convertCoordinatesEventToGl(ev);
        lastMouseX = x;
        lastMouseY = y;
        mouseDragged = true;
    };

    canvas.onmouseup = function() {
        mouseDragged = false;
    };

    canvas.onmousemove = function(ev) {
        if (mouseDragged) {
            let [x, y] = convertCoordinatesEventToGl(ev);
            let deltaX = x - lastMouseX;
            let deltaY = y - lastMouseY;

            g_globalAngle += deltaX * 100; 
            g_globalAngle2 -= deltaY * 100;

            lastMouseX = x;
            lastMouseY = y;

            renderScene();
        }
    };
}
