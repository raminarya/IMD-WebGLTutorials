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
    
    //TODO setup three.js
    camera = new THREE.PerspectiveCamera(75,        //horizontal field of view angle
                                         960 / 540, //aspect ratio
                                         0.1,       //near clip plane
                                         1000);     //far clip plane
    startGame();
}

//we move all of geometry and object code into
//a new function so that we can reset if necessary
//** this function is obviously not the most efficient way to reset
//   a scene. Realistically, you should be able to move items back to the way they began
function startGame()
{
    //reset/create the scene
    scene = new THREE.Scene();
    
    //reset the camera to make sure it's in the middle
    camera.position.set(0, 0, 0);
    
    //TODO add geometry
    
    //create an empty object to store our mesh objects
    objects = {};
    
    //create a grey ground plane
    var planeGeometry = new THREE.PlaneGeometry(20, 20);
    var groundMaterial = new THREE.MeshLambertMaterial( {color: 0x666666 } );
    objects.ground = new THREE.Mesh(planeGeometry, groundMaterial);
    objects.ground.rotation.x = -Math.PI * 0.5;
    objects.ground.position.set(0, -1, 0);
    scene.add(objects.ground);
    
    
    objects.goals = [];
    var sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
    var lambertMaterial = new THREE.MeshLambertMaterial( {color: 0x00FF00, ambient: 0x00FF00} );
    objects.goals[0] = new THREE.Mesh( sphereGeometry, lambertMaterial );
    objects.goals[0].position.set(10, 0, 10);
    objects.goals[1] = new THREE.Mesh( sphereGeometry, lambertMaterial );
    objects.goals[1].position.set(-10, 0, 10);
    objects.goals[2] = new THREE.Mesh( sphereGeometry, lambertMaterial );
    objects.goals[2].position.set(10, 0, -10);
    objects.goals[3] = new THREE.Mesh( sphereGeometry, lambertMaterial );
    objects.goals[3].position.set(-10, 0, -10);
    scene.add( objects.goals[0] );
    scene.add( objects.goals[1] );
    scene.add( objects.goals[2] );
    scene.add( objects.goals[3] );
    
    
    //create red cylinders for enemies
    //parameters are:
    //top radius, bottom radius, height, radius segments, height segments, open ended
    objects.enemies = [];
    var cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.6, 2.0, 20, 1, false);
    var enemyMaterial = new THREE.MeshLambertMaterial( {color:0xFF0000, ambient: 0xFF0000});
    
    for(var i = 0; i < 3; ++i)
    {
        //create the mesh
        var enemy = new THREE.Mesh(cylinderGeometry, enemyMaterial);
        //position each enemy a little father from the center
        enemy.position.set(5 + (i * 2), 0, 0);
        //we add a custom property to keep track of its angle for 
        //rotational movement
        enemy.angle = 0;
        //we also add one for speed so that each enemy moves differently
        enemy.angularSpeed = 0.01 + (Math.random() * 0.01);
        //add it to the array
        objects.enemies.push(enemy); 
        scene.add(enemy);
    }
    
    //create a light and add it to the scene
    //parameters: light color, light intensity
    objects.directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    //move it to get an angle
    objects.directionalLight.position.set(2, -5, 1);
    scene.add( objects.directionalLight );
    
    //adding an ambient light will help with the harsh shadows
    objects.ambientLight = new THREE.AmbientLight( 0x333333 );
    scene.add( objects.ambientLight );
    
    
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
    
    //rotate our goal spheres around
    for(var i in objects.goals)
    {
        objects.goals[i].rotation.x += 0.02;
    }
    //we move the enemies around in a circle
    for(var i in objects.enemies)
    {
        objects.enemies[i].angle += objects.enemies[i].angularSpeed;
        objects.enemies[i].position.set(
            Math.cos(objects.enemies[i].angle) * (5 + (i * 2)),
            0,
            Math.sin(objects.enemies[i].angle) * (5 + (i * 2))
        );
    }
    
    //simple collision detection with goals and enemies
    //we iterate backwards to allow for item removal
    for(var i = objects.goals.length-1; i >= 0; --i)
    {
        if( collide(camera, objects.goals[i]) )
        {
            //there was a collision so remove the goal
            scene.remove( objects.goals[i] );
            //splice removes objects starting at the given index value
            //params: start index, number of items
            objects.goals.splice(i, 1);
            
            //here we check for the win
            if(objects.goals.length == 0)
            {
                //we just restart the game
                startGame();
            }
        }
    }
    //check enemy collisions and restart is we're hit
    for(var i = objects.enemies.length-1; i >= 0; --i)
    {
        if( collide(camera, objects.enemies[i]) )
        {
            //no need to fully restart, let's jut put the player
            //back in the middle
            camera.position.set(0, 0, 0);
        }
    }
    
    
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

function collide(obj1, obj2)
{
    //we use three's vector math to subtract our two positions
    //this gies us a vector between them
    var delta = new THREE.Vector3();
    delta.subVectors(obj2.position, obj1.position);
    
    //we then get the length squared of that vector
    //**we could get the reqular length but using length squared
    //  saves us processing power and time
    var distanceSquared = delta.lengthSq();
    
    //check the collision and return
    if(distanceSquared < 1)
        return true;
    return false;

}

//event handler for keyboard input
//it needs to take in the event object passed by the browser
//the event object contains info about the key event
function onKeyDown(event)
{
    //get the event if this is internet explorer
    if(!event) event = window.Event;
    
    //lets allow arrow keys and w,a,s,d
    switch(event.keyCode)
    {
        case KeyCodes.w:
        case KeyCodes.up: //forwards
            keyUp = true;
            break;
        case KeyCodes.s:
        case KeyCodes.down: //backwards
            keyDown = true;
            break;
        case KeyCodes.a:
        case KeyCodes.left: //left
            keyLeft = true;
            break;
        case KeyCodes.d:
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
        case KeyCodes.w:
        case KeyCodes.up: //forwards
            keyUp = false;
            break;
        case KeyCodes.s:
        case KeyCodes.down: //backwards
            keyDown = false;
            break;
        case KeyCodes.a:
        case KeyCodes.left: //left
            keyLeft = false;
            break;
        case KeyCodes.d:
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

