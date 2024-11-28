# Skydodge Documentación

Lógica del Juego

Inicio del Juego


Cuando el usuario presiona una tecla o hace clic, el juego llama a go2Play(), que:
Oculta la pantalla de inicio (blocker).
Muestra la interfaz principal del juego (cointainerOthers).
Activa el fondo musical.
Inicia la generación continua de enemigos y bases enemigas.
Movimiento del Jugador


El avión del jugador responde a las flechas del teclado mediante las variables de estado (keys.left, keys.right, etc.).
Cada frame, la posición del avión se actualiza en la función playerMove() dependiendo de las teclas presionadas.
La cámara permanece estática, pero la posición de la mira se actualiza constantemente para estar frente al avión, simulando un HUD dinámico.
Disparo y Proyectiles


El jugador puede disparar hacia adelante (con la barra espaciadora) o lanzar bombas hacia abajo (con ControlLeft).
Los proyectiles se crean con createProjectile() y se almacenan en un array (projectiles).
En cada frame, la función updateProjectiles() mueve los proyectiles en la dirección especificada y los elimina si salen del área visible.
Generación de Enemigos y Objetivos


Los enemigos (fallingEnemies) y las bases enemigas (fallingObjectives) se generan periódicamente con spawnEnemy() y spawnObjective().
Cada enemigo o base tiene una posición inicial aleatoria y se mueve hacia adelante usando las variables de velocidad (speed y gravity).
La función playerMove() actualiza continuamente sus posiciones.
Colisiones


Las colisiones se verifican midiendo la distancia entre objetos:
checkCollisions() detecta si un proyectil impacta un enemigo.
checkCollisionsObjectives() verifica impactos en las bases enemigas.
Si ocurre una colisión:
Se reproduce un sonido de explosión.
El enemigo o base es eliminado de la escena.
Se incrementan las puntuaciones (kill para enemigos, score para bases).
La salud del jugador (health) disminuye si hay colisión con un enemigo.
Final del Juego


El juego termina cuando:
La salud del jugador llega a 0 (health < 1).
El jugador destruye al menos 10 bases enemigas (score > 9).
Se muestran pantallas de victoria o derrota, se pausa el audio y se eliminan todos los objetos restantes.

Animaciones del Juego
Actualización de la Escena


La función principal de animación es animate(), que es llamada continuamente con requestAnimationFrame(animate).
En cada frame:
Se actualizan las posiciones de los objetos móviles (enemigos, proyectiles, bases).
Se verifica la lógica del juego (colisiones, estado del jugador).
Se renderiza la escena con renderer.render(scene, camera).
Movimiento de Enemigos y Objetos


Enemigos y bases enemigas avanzan hacia el jugador con una velocidad ajustada por speed y gravity.
Los objetos decorativos (árboles, cactus, hierba) también tienen movimiento, aunque solo son visuales y no interactúan con el jugador.
Proyectiles


Los proyectiles tienen una dirección (userData.direction) y una velocidad específica (v).
Cada proyectil se mueve en la dirección especificada hasta colisionar o salir del área visible.
Explosiones


Cuando un proyectil impacta un enemigo o base, se genera una explosión visual con showExplosion().
La explosión se crea como un plano con una textura (explosionPixel.png) y se posiciona en el lugar del impacto.
La explosión desaparece tras 300 ms para optimizar recursos.
Mira del Jugador


La mira (aim) se actualiza en la función update() para que siga la posición del avión y se mantenga frente a él.

Detalles Técnicos de Animación
Interactividad:
 Los eventos de teclado (keydown y keyup) gestionan las acciones del jugador en tiempo real.
Velocidades dinámicas:
 La gravedad (gravity) aumenta con el tiempo para incrementar la dificultad del juego, especialmente en los últimos segundos.
Optimización:
Los objetos fuera del área visible son eliminados de la escena y sus recursos son liberados.
Los efectos visuales, como explosiones, se autodestruyen después de un corto periodo.

Conclusión
El juego utiliza un flujo basado en frames (requestAnimationFrame) para gestionar todas las animaciones y lógicas en tiempo real. La combinación de movimiento dinámico, detección de colisiones y efectos visuales como explosiones ofrece una experiencia de juego fluida y atractiva.

Descripción de funciones:

Solución de errores:

Efecto "estampida"

Para el codigo se presentaba un error en el cual al dejar una ventana en segundo plano se acumulaban los objetos de 3D, para solucionar este incoveniente se integro isTabVisible, una variable que se agregaria a todas las funciones que crearan un arreglo de elementos, desde enemigos hasta el entorno.

de ahi en document.addEventListener("visibilitychange", function() {}); se evalua por un condicional si la ventana es visible, a lo que si no es visible, en cada funcion de crear objetos se hace un retorno evitando la sobreacumulación. Si la ventana es visible el programa permite que se generen mas enemigos.
