// ----------------------------
// Inicialización de Variables:
// ----------------------------
var scene = null,
  camera = null,
  renderer = null,
  controls = null,
  clock = null,
  light = null;

var player = null,
  fallingObjects = []
fallingEnemies = [],
  fallingObjectives = [],
  explsionObjects = [],
  health = 3,
  kill = 0,
  score = 0,
  time = 0,
  gameOver = false,
  speed = 0.7,
  speedObj = 0.4,
  gravity = 0.02,
  maxObjects = 9999999999999,
  gravityIncrement = 0.001,
  modelBomb = null;

const keys = {
  left: false,
  right: false,
  up: false,
  down: false
};

// Array para almacenar los proyectiles
const projectiles = [];

//saber el tiempo inicial
let previousTime = Date.now();

// Variable para rastrear el tiempo del último disparo
let lastShotTime = 0;

//sonidos
let explosionSound;
let shotSound;

// UI Elements
const healthDisplay = document.getElementById("health");
const scoreDisplay = document.getElementById("score");
const killDisplay = document.getElementById("kills");
const timeDisplay = document.getElementById("time");
const resultMessage = document.getElementById("resultMessage");
const restartBtn = document.getElementById("restartBtn");

var color = new THREE.Color();

// ----------------------------
// Funciones de creación init:
// ----------------------------
function start() {
  window.onresize = onWindowResize;

  initScene();
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,
    window.innerHeight);
}

function initScene() {

  //acomodar camara


  initBasicElements(); // Scene, Camera and Render

  initSound();         // To generate 3D Audio
  createLight();       // Create light

  


}

function setBackground() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load('./src/img/desertBackground2.jpg', function (texture) {
    // Establecer la textura como fondo de la escena
    scene.background = texture;
  });
}


function initBasicElements() {

  const colorFog = 0x000000,
    nearFog = 10,
    far = 90;
  scene = new THREE.Scene();

  setBackground();
  //scene.background = new THREE.Color(colorFog);



  camera = new THREE.PerspectiveCamera(
    80,                                     // Ángulo "grabación" - De abaja -> Arriba 
    window.innerWidth / window.innerHeight, // Relación de aspecto 16:9
    0.1,                                    // Mas cerca (no renderiza) 
    1000                                    // Mas lejos (no renderiza)
  );

  // renderer = new THREE.WebGLRenderer();

  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#app") });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  scene.fog = new THREE.Fog(colorFog, nearFog, far);

  //camera.rotateX(Math.PI / -7);
  camera.position.z = 6;

  //carga el sonido de explosion
  //loadCollisionSound("explosion");
  //loadCollisionSound("shoot");

  //crearJugador
  createPlayer();
  createBomb();

  //agrega mapa
  createMap();
  //generateTerrain();
  //generateTerrain("grass");
  //generateTerrain("tree");

  // Iniciar la caída de enemigos y intervalo en el que aparecen

  //spawnEnemy();
  setInterval(countdown, 1000);
  animate();
}

function createPlayer() {

  // Crear jugador 

  var generalPath = "../src/modelos/player/";
  var fileObj = "player.obj";
  var fileMtl = "player.mtl";

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(generalPath);
  mtlLoader.setPath(generalPath);
  mtlLoader.load(fileMtl, function (materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(generalPath);
    objLoader.load(fileObj, function (object) {

      player = object;

      scene.add(player);
      player.position.y = 0;
      player.position.z = -0.5;
      player.rotation.y = 160.2;
      player.rotation.x = 0;
      player.scale.set(2, 2, 2);


    });
  });


  // Evento de teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowUp') keys.up = true;
    if (e.key === 'ArrowDown') keys.down = true;
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowUp') keys.up = false;
    if (e.key === 'ArrowDown') keys.down = false;

  });

}

function createMap() {

  var generalPath = "../src/modelos/SkydodgeMap/";
  var fileObj = "SkydodgeMap.obj";
  var fileMtl = "SkydodgeMap.mtl";

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(generalPath);
  mtlLoader.setPath(generalPath);
  mtlLoader.load(fileMtl, function (materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(generalPath);
    objLoader.load(fileObj, function (object) {

      scene.add(object);
      object.position.y = -9;
      object.position.z = -30;
      //object.rotation.x = 0.1;
      object.scale.set(3, 3, 15);


    });
  });

  generateTree();
  generateCaptus();
  generateGrass();

}

function spawnEnemy() {

  maxObjects++;

  var generalPath = "../src/modelos/EnemyPlane/";
  var fileObj = "EnemyPlane.obj";
  var fileMtl = "EnemyPlane.mtl";

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(generalPath);
  mtlLoader.setPath(generalPath);
  mtlLoader.load(fileMtl, function (materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(generalPath);
    objLoader.load(fileObj, function (object) {

      object.scale.set(2, 2, 2);
      object.position.set((Math.random() - 0.5) * 10, (Math.random() - 1) * 3, -150);

      object.name = "basicEnemy" + time;

      var soundEnemy;

      soundEnemy = createSound("./src/songs/explosion.mp3");

      soundEnemy.name = "basicEnemy" + time;
      soundEnemy.id = "basicEnemy" + time;

      explsionObjects.push(soundEnemy);

      fallingEnemies.push(object);
      scene.add(object);


    });
  });



  // Añadir la clase de animación al objeto
  const canvasElement = renderer.domElement;
  canvasElement.classList.add('fallingEnemies');

  // Seguir generando objetos hasta el límite
  if (!gameOver && fallingEnemies.length < maxObjects) {
    setTimeout(spawnEnemy, Math.random() * 1500 + 500);
  }
}

function createBomb() {


  var generalPath = "../src/modelos/bomb/";
  var fileObj = "bomb.obj";
  var fileMtl = "bomb.mtl";

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(generalPath);
  mtlLoader.setPath(generalPath);
  mtlLoader.load(fileMtl, function (materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(generalPath);
    objLoader.load(fileObj, function (object) {

      bomb = object;
      //scene.add(bomb);


    });
  });

}

function spawnObjective() {

  maxObjects++;

  var generalPath = "../src/modelos/castle/";
  var fileObj = "castle.obj";
  var fileMtl = "castle.mtl";

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(generalPath);
  mtlLoader.setPath(generalPath);
  mtlLoader.load(fileMtl, function (materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(generalPath);
    objLoader.load(fileObj, function (object) {

      object.scale.set(1, 1, 1);
      object.position.set((Math.random() - 0.5) * 10, -7, -150);

      object.name = "baseObjective" + time;

      var soundEnemy;

      soundEnemy = createSound("./src/songs/explosion.mp3");

      soundEnemy.name = "baseObjective" + time;
      soundEnemy.id = "BaseObjective" + time;

      explsionObjects.push(soundEnemy);

      fallingObjectives.push(object);
      scene.add(object);


    });
  });



  // Añadir la clase de animación al objeto
  const canvasElement = renderer.domElement;
  canvasElement.classList.add('fallingObjectives');

  // Seguir generando objetos hasta el límite
  if (!gameOver && fallingObjectives.length < maxObjects) {
    setTimeout(spawnObjective, Math.random() * 20000 + 1000);
  }
}

function countdown() {
  if (gameOver) return;
  time++;
  timeDisplay.innerText = `Time: ${time}`;

  // Incrementa la gravedad con el tiempo
  if (time <= 30 && time > 20) {
    gravity += gravityIncrement * 0.5;  // Aumenta la gravedad ligeramente en los primeros 10 segundos
  } else if (time <= 20 && time > 10) {
    gravity += gravityIncrement * 1;    // Aumenta más rápido en los siguientes 10 segundos
  } else if (time <= 10) {
    gravity += gravityIncrement * 1.5;  // Aumenta aún más rápido en los últimos 10 segundos
  }

  /*
  if (time <= 0) {
    endGame(false);
  }
  */
}

function playerMove() {


  // Mover el jugador
  if (keys.left && player.position.x > -4) player.position.x -= 0.1;
  if (keys.right && player.position.x < 4) player.position.x += 0.1;
  if (keys.up && player.position.y < 1.6) player.position.y += 0.1;
  if (keys.down && player.position.y > -1.9) player.position.y -= 0.1;

  //mover entorno
  fallingObjects.forEach((object, index) => {

    object.position.z += speedObj + gravity;  // Usa la gravedad ajustada

  });

  fallingObjectives.forEach((object, index) => {

    object.position.z += speedObj + gravity;  // Usa la gravedad ajustada

  });

  // Mover enemigos
  fallingEnemies.forEach((object, index) => {
    object.position.z += speed + gravity;  // Usa la gravedad ajustada

    // Verificar colisión con el jugador

    if (player != null) {

      //console.log(player.position);

      if ((object.position.distanceTo(player.position) < 1.5) || (object.position.distanceTo(player.position) < -1.5)) {
        health--;
        healthDisplay.innerText = `Health: ${health}`;

        showExplosion(object.position.x, object.position.y, object.position.z);

        scene.remove(object);
        fallingEnemies.splice(index, 1);
        loadCollisionSound("explosion");

        console.log("reproduceExplosion");

        /*
        player.style.visibility = false; 
        setTimeout(1000);
        player.style.visibility = true;
        */

        if (health < 1) {
          loadCollisionSound("explosion");
          document.getElementById("lost").style.display = "block";
          document.getElementById("cointainerOthers").style.display = "none";
          pauseAudio(x);
          playAudio(y);
          endGame(false);

        }
      }

      // Eliminar objetos que caen fuera de la pantalla
      if (object.position.y < -5) {
        scene.remove(object);
        fallingObjects.splice(index, 1);
      }

    }


  });




  //updateCamera();
}

function animate() {

  if (gameOver) return;

  // Mover el jugador
  playerMove();

  //updateCamera();

  //disparar
  const currentTime = Date.now();
  const delta = (currentTime - previousTime) / 1000; // delta en segundos
  previousTime = currentTime;

  // Código existente en tu función animate
  updateProjectiles(); // Usa delta para actualizar la posición de los proyectiles
  checkCollisions(); // Verifica las colisiones entre proyectiles y enemigos

  requestAnimationFrame(animate);

  renderer.render(scene, camera);

}

//la camara sigue al jugador
/*
function updateCamera() {
  // Ajustar la posición de la cámara relativa al jugador

  if(player!=null){
        camera.position.set(
            player.position.x,       // Coincidir en el eje X
            player.position.y + 2,   // Elevar un poco la cámara en el eje Y
            player.position.z + 3  // Colocar la cámara detrás en el eje Z
        );
        // Hacer que la cámara mire hacia el jugador
        //camera.lookAt(player.position);
        
  }
}
*/
function endGame(victory) {
  gameOver = true;
  //resultMessage.classList.remove('hidden');
  //restartBtn.classList.remove('hidden');

  if (victory) {
    resultMessage.innerText = '¡Ganaste! ';
  } else {
    resultMessage.innerText = '¡Perdiste! ';
  }

  lost.addEventListener('click', restartGame);
}

function restartGame() {

  //quita pantalla de derrota
  document.getElementById('lost').style.display = 'none';
  document.getElementById('cointainerOthers').style.display = 'block';

  // Reiniciar variables
  playAudio(x);

  health = 3;
  score = 0;
  kills = 0;
  time = 0;
  gravity = 0.01;  // Reiniciar gravedad
  gameOver = false;
  healthDisplay.innerText = 'Health: 3';
  scoreDisplay.innerText = 'Points: 0';
  killDisplay.innerText = 'Kills: 0';
  timeDisplay.innerText = 'Time: 0';
  resultMessage.classList.add('hidden');
  restartBtn.classList.add('hidden');

  // Eliminar los objetos restantes
  fallingEnemies.forEach(obj => scene.remove(obj));
  fallingEnemies = [];

  fallingObjects.forEach(obj => scene.remove(obj));
  fallingObjects = [];

  player.position.x = 0;
  player.position.y = 0;
  player.position.z = -0.5;

  // Iniciar nuevamente
  generateTree();
  generateCaptus();
  generateGrass();
  spawnEnemy();
  animate();
}

function initSound() {
  // 3d Sound
}

function createLight() {
  var light2 = new THREE.AmbientLight(0xffffff);
  light2.position.set(10, 10, 10);
  scene.add(light2);
  light = new THREE.DirectionalLight(0xffffff, 0, 1000);
  scene.add(light);
}

// ----------------------------------
// Funciones llamadas desde el index:
// ----------------------------------
function go2Play() {
  document.getElementById('blocker').style.display = 'none';
  document.getElementById('cointainerOthers').style.display = 'block';

  //quita pantalla de derrota
  //document.getElementById('lost').style.display = 'none';
  //document.getElementById('cointainerOthers').style.display = 'block';

  playAudio(x);
  spawnEnemy();
  spawnObjective();
}

function showNameStudents() {
  alert("Los estudiantes del grupo son: David Arango Aguirre y Juan Jose Cardona Serna");
}

//creacion de proyectiles

/*
function shootProjectile() {

  const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1); // Define el tamaño del proyectil
  const material = new THREE.MeshLambertMaterial({ color: 0xfffb00 }); // Color del proyectil
  const projectile = new THREE.Mesh(geometry, material);

  // Posiciona el proyectil en la posición del jugador
  projectile.position.copy(player.position);
  projectile.direction = new THREE.Vector3(0, 0, 1).applyQuaternion(player.quaternion); // Dirección hacia adelante

  scene.add(projectile);
  projectiles.push(projectile);

}
*/

function shootForwardProjectile() {
  const forwardProjectile = createProjectile("front", player.position, { x: 0, y: 0, z: -1 });
  projectiles.push(forwardProjectile);
}

// Función para disparar proyectiles hacia abajo
function shootDownwardProjectile() {
  const downwardProjectile = createProjectile("down", player.position, { x: 0, y: -1, z: 0 });
  projectiles.push(downwardProjectile);
}

// Función para crear un proyectil
function createProjectile(type, startPosition, direction) {

  

  var projectile;

  if (type == "front") {

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2); // Define el tamaño del proyectil
    const material = new THREE.MeshLambertMaterial({ color: 0xfffb00 }); // Color del proyectil
    projectile = new THREE.Mesh(geometry, material);

    projectile.id = "bullet";

  }

  if (type == "down") {

    
    projectile = bomb;

    projectile.id = "bomb";
    

  }

  // Ajustar la posición inicial del proyectil
  projectile.position.set(
    startPosition.x,
    startPosition.y,
    startPosition.z
  );

  // Agregar la dirección al proyectil para actualizar su movimiento
  projectile.userData = { direction: direction };

  // Agregar el proyectil a la escena
  scene.add(projectile);



  return projectile;
}

//actualiza movimiento de proyectiles

/*
function updateProjectiles(delta) {

  for (let i = projectiles.length - 1; i >= 0; i--) {

      const projectile = projectiles[i];
      projectile.position.add(projectile.direction.clone().multiplyScalar(delta * 20)); // Ajusta la velocidad del proyectil

      // eliminar proyectil si se va lejos
      if (projectile.position.length() > 50) {

          scene.remove(projectile);
          projectiles.splice(i, 1);
      }
  }
}
*/

function updateProjectiles() {

  var v;

  projectiles.forEach((projectile, index) => {
    // Mover el proyectil según su dirección

    if(projectile.id == "bullet"){

      v = 0.5;

    }

    else{
      v = 0.1;
    }
    projectile.position.x += projectile.userData.direction.x * v; // Velocidad en x
    projectile.position.y += projectile.userData.direction.y * v; // Velocidad en y
    projectile.position.z += projectile.userData.direction.z * v; // Velocidad en z

    // Eliminar proyectiles fuera del límite
    if (projectile.position.y < -5 || projectile.position.z > 5) {
      scene.remove(projectile);
      projectiles.splice(index, 1);
    }
  });
}

//colision con enemigos

function checkCollisions() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    for (let j = fallingEnemies.length - 1; j >= 0; j--) {
      const enemy = fallingEnemies[j];

      // Verifica la distancia entre el proyectil y el enemigo
      if (projectile.position.distanceTo(enemy.position) < 1.2) { // Ajusta el valor de colisión según sea necesario

        //activa sonido
        loadCollisionSound("explosion");

        // Eliminar enemigo y proyectil en colisión
        scene.remove(projectile);
        projectiles.splice(i, 1);

        console.log("se ha eliminado el enemigo: " + enemy.name);
        showExplosion(enemy.position.x, enemy.position.y, enemy.position.z);

        console.log("reproduceExplosion");

        kill++;

        killDisplay.innerText = `Kills: ${kill}`;

        scene.remove(enemy);
        fallingEnemies.splice(j, 1);

        // Puedes agregar algún efecto o sonido aquí

        break;
      }
    }
  }
}

//muestra explosion

function showExplosion(x, y, z) {

  //crea las texturas
  const textureLoader = new THREE.TextureLoader();
  const explosionTexture = textureLoader.load('./src/img/explosionPixel.png'); // Ruta de tu imagen

  // Crear un plano para la explosión
  const explosionGeometry = new THREE.PlaneGeometry(5, 5); // Tamaño ajustable
  const explosionMaterial = new THREE.MeshBasicMaterial({
    map: explosionTexture,
    transparent: true,
  });
  const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);

  // Establecer la posición de la explosión
  explosion.position.set(x, y, z);
  scene.add(explosion);

  // Eliminar la explosión después de 1 segundo
  setTimeout(() => {
    scene.remove(explosion);
    explosion.geometry.dispose();
    explosion.material.dispose();
  }, 300);

}

//control para disparar

// Evento para detectar teclas
/*
document.addEventListener('keydown', (event) => {

  if (event.code === 'Space') {

    const currentTime = Date.now();

    if((currentTime - lastShotTime) >= 300){

      lastShotTime = currentTime;
      console.log('¡Disparo!');

      shootProjectile(); // Llama a la función para disparar un proyectil
      //carga sonido
      loadCollisionSound("shoot");

    }

    else {
    console.log('Espera antes de disparar nuevamente.');
    }
      
      
      
  }

});
*/

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') { // Tecla Espaciadora para disparar hacia adelante

    const currentTime = Date.now();

    if ((currentTime - lastShotTime) >= 300) {

      lastShotTime = currentTime;
      console.log('¡Disparo!');

      shootForwardProjectile();
      //carga sonido
      loadCollisionSound("shoot");

    }

    else {
      console.log('Espera antes de disparar nuevamente.');
    }

  }

  else if (event.code === 'ControlLeft') { // Tecla Shift Izquierda para disparar hacia abajo


    const currentTime = Date.now();

    if ((currentTime - lastShotTime) >= 300) {

      lastShotTime = currentTime;
      console.log('¡Disparo!');

      shootDownwardProjectile();
      //carga sonido


    }

    else {
      console.log('Espera antes de disparar nuevamente.');
    }

  }
});
/*
function gameLoop() {
  requestAnimationFrame(gameLoop);

   // Actualizar la cámara para seguir al jugador
   

  // Otras actualizaciones del juego
  updateProjectiles();

  // Renderizar escena
  renderer.render(scene, camera);
}
*/
//funciones sonidos

function loadCollisionSound(sonido) {

  const listener = new THREE.AudioListener();
  camera.add(listener); // Agrega el listener al objeto cámara o a la escena

  // Carga el archivo de audio
  const audioLoader = new THREE.AudioLoader();

  if (sonido == "explosion") {



    explosionSound = new THREE.Audio(listener);
    audioLoader.load('./src/songs/' + sonido + '.mp3', function (buffer) {

      explosionSound.setBuffer(buffer);
      explosionSound.setVolume(0.3); // Ajusta el volumen si es necesario

      //countdown
      const currentTime = Date.now();

      if ((currentTime - lastShotTime) >= 0) {

        explosionSound.play();

      }

    });

  }

  if (sonido == "shoot") {

    shotSound = new THREE.Audio(listener);
    audioLoader.load('./src/songs/' + sonido + '.mp3', function (buffer) {

      shotSound.setBuffer(buffer);
      shotSound.setVolume(1); // Ajusta el volumen si es necesario

      shotSound.play();

    });

  }



}

//crea sonido

function playNewSound(sonido) {

  const sound = createSound('./src/songs/' + sonido + '.mp3');


}

function createSound(path) {

  const listener = new THREE.AudioListener();
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();

  audioLoader.load(path, (buffer) => {

    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(0.5);

  });

  return sound;

}

//decoracion mapa

function generateCaptus() {

  //maxObjects++;

  var generalPath = "../src/modelos/captus/";
  var fileObj = "captus.obj";
  var fileMtl = "captus.mtl";

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(generalPath);
  mtlLoader.setPath(generalPath);
  mtlLoader.load(fileMtl, function (materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(generalPath);
    objLoader.load(fileObj, function (object) {

      object.scale.set(2, 2, 2);
      object.position.set((Math.random() - 0.5) * 10, -7, -150);

      fallingObjects.push(object);
      scene.add(object);


    });
  });

  // Añadir la clase de animación al objeto
  const canvasElement = renderer.domElement;
  canvasElement.classList.add('fallingObject');

  // Seguir generando objetos hasta el límite
  if (!gameOver && fallingObjects.length < maxObjects) {
    setTimeout(generateCaptus, Math.random() * 1000 + 500);
  }
}

function generateTree() {

  //maxObjects++;

  var generalPath = "../src/modelos/tree/";
  var fileObj = "tree.obj";
  var fileMtl = "tree.mtl";

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(generalPath);
  mtlLoader.setPath(generalPath);
  mtlLoader.load(fileMtl, function (materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(generalPath);
    objLoader.load(fileObj, function (object) {

      object.scale.set(3.5, 3.5, 3.5);
      object.position.set((Math.random() - 0.5) * 10, -7, -150);

      fallingObjects.push(object);
      scene.add(object);


    });
  });

  // Añadir la clase de animación al objeto
  const canvasElement = renderer.domElement;
  canvasElement.classList.add('fallingObject');

  // Seguir generando objetos hasta el límite
  if (!gameOver && fallingObjects.length < maxObjects) {
    setTimeout(generateTree, Math.random() * 1000 + 500);
  }
}


function generateGrass() {

  //maxObjects++;

  var generalPath = "../src/modelos/grass/";
  var fileObj = "grass.obj";
  var fileMtl = "grass.mtl";

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(generalPath);
  mtlLoader.setPath(generalPath);
  mtlLoader.load(fileMtl, function (materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(generalPath);
    objLoader.load(fileObj, function (object) {

      object.scale.set(1, 1, 1);
      object.position.set((Math.random() - 0.5) * 10, -8, -150);

      fallingObjects.push(object);
      scene.add(object);


    });
  });

  // Añadir la clase de animación al objeto
  const canvasElement = renderer.domElement;
  canvasElement.classList.add('fallingObject');

  // Seguir generando objetos hasta el límite
  if (!gameOver && fallingObjects.length < maxObjects) {
    setTimeout(generateGrass, Math.random() * 1000 + 500);
  }
}