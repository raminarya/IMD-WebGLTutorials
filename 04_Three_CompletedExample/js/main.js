/*

Three.js Tutorial - Starting Point

Ryan Bottriell - 2014
ryanbottriell@live.ca

*/

//TODO declare global variables
var renderer, scene, camera, objects;

//for input
var keyUp = false,
    keyDown = false,
    keyLeft = false,
    keyRight = false;

//to be used for cameras look direction
var lookVector;

//called when the page is done loading
function onPageLoaded()
{
    //TODO initalize input events
    
    //set the look vector as a new THREE.Vector3
    lookVector = new THREE.Vector3();
    lookVector.angle = 0;
    
    //this function takes a string denoting the event type to listen to
    //and a callback function for the event
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    
    //get pointer lock when the canvas is clicked on
    var canvasWrapper = document.getElementById('canvas-wrapper');
    canvasWrapper.addEventListener('mousedown', function(event){
        canvasWrapper.requestPointerLock();
    });

    
    //TODO initialize three.js renderer
    renderer = new THREE.WebGLRenderer();
    
    //attach the renderers output canvas to
    //the DOM tree under our wrapper div
    //var canvasWrapper = document.getElementById('canvas-wrapper');
    canvasWrapper.appendChild( renderer.domElement );
    
    //set the size to match the wrapper
    renderer.setSize( 960, 540 );
    
    //TODO setup three.js scene
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75,        //horizontal field of view angle
                                         960 / 540, //aspect ratio
                                         0.1,       //near clip plane
                                         1000);     //far clip plane
    
    //TODO add geometry
    
    //create a cylinder
    //parameters are:
    //top radius, bottom radius, height, radius segments, height segments, open ended
    var cylinderGeometry = new THREE.CylinderGeometry(1.0, 1.0, 2.0, 20, 1, false);
    
    //now we make a material
    var basicMaterial = new THREE.MeshBasicMaterial();
    
    //create an empty object to store our mesh objects
    objects = {};
    //create the cylinder
    objects.cylinder = new THREE.Mesh(cylinderGeometry, basicMaterial);
    //the camera points down the z axis by default so 
    //move the cylinder down in from of the camera
    objects.cylinder.position.set(0, 0, -5);
    
    //add our cylinder to the scene
    scene.add(objects.cylinder);
    
    //create a light and add it to the scene
    //parameters: light color, light intensity
    objects.directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    //move it to get an angle
    objects.directionalLight.position.set(2, -5, 1);
    scene.add( objects.directionalLight );

    //create a sphere lambert material for shading
    //params: radius, width segments, height segments
    var sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
    var lambertMaterial = new THREE.MeshLambertMaterial();
    objects.sphere = new THREE.Mesh( sphereGeometry, lambertMaterial );
    objects.sphere.position.set(3, 0, -5);
    scene.add( objects.sphere );
    
    //adding an ambient light will help with the harsh shadows
    objects.ambientLight = new THREE.AmbientLight( 0x333333 );
    scene.add( objects.ambientLight );
    
    //let's load the external model
    //we load the texture first
    var cubeTexture = THREE.ImageUtils.loadTexture( "assets/box_color.png" );
    //we create a lambert material and add the texture as a map
    var cubeMaterial = new THREE.MeshLambertMaterial( {map : cubeTexture} );
    
    //then we load the cude geometry
    //we create a json loader and then pass it the url to our json object
    //we also define the callback function for when the geometry
    //is done loading
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load( "assets/cube.js", function( geometry ){
        objects.cube = new THREE.Mesh( geometry, cubeMaterial );
        objects.cube.position.set(-3, 0, -5);
        scene.add( objects.cube );
    });
    
    //requestAnimationFrame lets the browser
    //know that we have drawing to do
    //we pass it a callback function
    window.requestAnimationFrame(update);
}

function update()
{
    //this allows us to keep the loop going
    window.requestAnimationFrame(update);
    
    // update code here //
    
    //rotate our objects around a little for fun
    objects.cylinder.rotation.x += 0.02;
    objects.sphere.rotation.y += 0.03;
    //because this one loads async, we do a simple check
    if(objects.cube)
        objects.cube.rotation.y += 0.01;
    
    
    //move the camera with the arrow keys
    var moveX = 0,
        moveZ = 0;
    if(keyUp) 
    {
        //forward towards look vector
        moveX += Math.cos(lookVector.angle);
        moveZ += Math.sin(lookVector.angle);
    }
    if(keyDown)
    {
        //the opposite of look vector
        moveX += Math.cos(lookVector.angle + Math.PI);
        moveZ += Math.sin(lookVector.angle + Math.PI);
    }
    if(keyLeft)
    {
        //90 degrees counter-clockwise of look vector
        moveX += Math.cos(lookVector.angle - 0.5 * Math.PI);
        moveZ += Math.sin(lookVector.angle - 0.5 * Math.PI);
    }
    if(keyRight)
    {
        //90 degrees clockwise of look vector
        moveX += Math.cos(lookVector.angle + 0.5 * Math.PI);
        moveZ += Math.sin(lookVector.angle + 0.5 * Math.PI);
    }
    //multiply by a small number to slow it down
    camera.position.x += moveX * 0.1;
    camera.position.z += moveZ * 0.1;
    
    //////////////////////
    
    render();
}

function render()
{
    // render code here //
    
    renderer.render(scene, camera);
    
    //////////////////////
}

//event handler for keyboard input
//it needs to take in the event object passed by the browser
//the event object contains info about the key event
function onKeyDown(event)
{
    //get the event if this is internet explorer
    if(!event) event = window.Event;
    
    switch(event.keyCode)
    {
        case KeyCodes.up: //forwards
            keyUp = true;
            break;
        case KeyCodes.down: //backwards
            keyDown = true;
            break;
        case KeyCodes.left: //left
            keyLeft = true;
            break;
        case KeyCodes.right: //right
            keyRight = true;
            break;
    }
}
function onKeyUp(event)
{
    //get the event if this is internet explorer
    if(!event) event = window.Event;
    
    switch(event.keyCode)
    {
        case KeyCodes.up: //forwards
            keyUp = false;
            break;
        case KeyCodes.down: //backwards
            keyDown = false;
            break;
        case KeyCodes.left: //left
            keyLeft = false;
            break;
        case KeyCodes.right: //right
            keyRight = false;
            break;
    }
}

function onMouseMove(event)
{
    if(!event) event = window.Event;
    
    //we only want to continue if the pointer lock is activated
    //and the movement property exists
    if( null == document.pointerLockElement ) return;

    //adjust the angle of the look vector and
    //calculate the x and z components
    //angles are in radians, so we multiply by a 
    //small number so that it doesn't move to fast
    lookVector.angle += event.movementX * 0.002;
    lookVector.x = Math.cos(lookVector.angle);
    lookVector.z = Math.sin(lookVector.angle);
    
    //now we adjust the y value of the vector directly with
    //the mouse y movement. Clamp the values so that you 
    //don't get stuck with a huge number
    lookVector.y -=  event.movementY * 0.02;
    if(lookVector.y > 3) lookVector.y = 3;
    else if(lookVector.y < -3) lookVector.y = -3;
    
    //add this to the camera position to get 
    //the global position
    var pointAt = new THREE.Vector3();
    //this function sets pointAt to the sum of the given vectors
    pointAt.addVectors(camera.position, lookVector);
    
    //point the camera at this spot
    camera.lookAt(pointAt);
}

