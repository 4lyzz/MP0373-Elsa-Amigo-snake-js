const GRID_MAX_COLS = 25; /* define una constante globar del programa siempre en mayúsculas */
const GRID_MAX_ROWS = 25; /* se define aquí en vez de dentro de la función para no tener que editar la función si se quieren más filas 
// const & var para crear variables, var variable que cambia a lo largo del tiempo, const es para crear una constante que cambia a lo largo del tiempo */
const SNAKE_INITIAL_SEGMENTS = 5; /* establece que los segmentos iniciales de la serpiente siempre sean 5 independemente de su posición incluyendo la cabeza */
const SNAKE_INITIAL_SPEED = 500; /* velocidad inicial de la serpiente */
const SNAKE_MAX_SPEED = 50; /* velocidad máxima de la serpiente */

const game = { /*define toda la información inicial del juego*/
    gameId: null,
    snake: {
    segments: [], /* array de segmentos para definir las posiciones */
    dir: "stop", /* esto es como un string de stop */
    speed: SNAKE_INITIAL_SPEED
    },
    applePosition: null,
    score: 0, /* puntuación inicial del contador del juego */
};
 

const buildCellID = function(x, y){ /* renombramos la variable td para que nos diga la coordenada de Row y de Column*/
    return "R" + y + "_C" + x; 
}

const getRandomNum = function (max) { /* sirve para obtener un número random */
    return Math.floor (Math.random () * max);
}

const getRandomPosition = function () { /* sirve para obtener una posición aleatoria */
    return {
        x: getRandomNum (GRID_MAX_COLS -1), /*sirve para calcular la posición de x*/
        y: getRandomNum (GRID_MAX_ROWS -1) /*sirve para calcular la posición de y*/
    };
}

const createGrid = function() {  /*función para crear la grid*/
const grid = document.querySelector("#grid"); /* Sirve para acceder al html entonces el querySelector busca el punto grid y lo devuelve como un objeto de JaveScript*/
if(grid) {
    for(var i = 0; i < GRID_MAX_ROWS; i++) {
        const tr = document.createElement("tr"); /* Crea un elemento tr que es un tag // por tanto crea una fila de tablas */
        var isOdd = i % 2 == 1;
        for(var j = 0; j < GRID_MAX_COLS; j++) { /* For para crear la cuadrícula dónde irá el snake*/
            const td = document.createElement("td"); /* Creo el td */
            td.className = isOdd ? "odd" : "even"; /*para crear los odd y even del tablero*/
            td.id = buildCellID(j, i);
            tr.appendChild(td); /* añado el td al tr */
            isOdd = !isOdd;
        }
        grid.appendChild(tr); /* Añade el tag de tr a la tabla */
    }
}
}

const createSnake = function () { /* nueva función para crer la serpiente */
    const num = getRandomNum(3); /* calculo un número del 0 al 3 para saber el movimiento incial de la serpiente */
    switch (num) {
        case 0: 
          game.snake.dir = "left"; /*para crear la serpiente a la izquierda*/
          break;
        case 1: 
            game.snake.dir = "down"; /*para crear la serpiente hacia abajo*/
            break;
        case 2:
            game.snake.dir = "right"; /*para crear la serpiente a la derecha*/
            break;
        case 3:
            game.snake.dir = "up"; /*para crear la serpiente hacia arriba*/
            break;
    }
    var x = Math.floor (GRID_MAX_COLS / 2); /* calculo el centro del grid */
    var y = Math.floor (GRID_MAX_ROWS / 2); /*divide los rows y los cols entre 2 para redondear hacia abajo*/
    for (var i = 0; i < SNAKE_INITIAL_SEGMENTS; i++) {
        switch (num) { /* construye los segmentos de la serpiente en el lado contrario de la dirección inicial de la cabeza */
            case 0:
                x++; /* right */
                break;
            case 1:
                y--; /* up */
                break;
            case 2:
                x--; /* left */
                break;
            case 3:
                y++; /* down */
                break;
        }
        game.snake.segments.push ({x: x, y: y});
    }
}

const drawSnakeSegment = function (segment, isHead) {
    const id = buildCellID(segment.x, segment.y); /* creas una variable ID que contenga el ID para buscar el td correspondiente de ese ID */
    const td = document.querySelector("#" + id); /* busca el ID */
        if (td) {
            td.classList.add("segment"); /* añade el segment */
        if (isHead) {
            td.classList.add("head"); /*añade la cabeza de la serpiente como valor aparte */
            }
        }

}
const clearGameObjects = function () {
   for (var i = 0; i < GRID_MAX_ROWS; i++) {
    for (var j = 0; j < GRID_MAX_COLS; j++) {
        const id = buildCellID (j, i);
        const td = document.querySelector ("#" + id);
        if (td) {
            td.classList.remove ("segment"); /* borra segmento de la serpiente*/
            td.classList.remove ("head");  /* borra la cabeza de la serpiente*/
            td.classList.remove ("apple");  /* borra la manzana*/
        }
    } 
   } 
}
const drawSnake = function () {
    for (var i = 0; i < game.snake.segments.length; i++) { /* esto recorre el array de segmentos de la serpiente */
        const isHead = i === 0;
        drawSnakeSegment (game.snake.segments[i], isHead); 
    }
}

const drawApple = function () { /*esta función dibuja la manzana*/
    if (game.applePosition) {
        const id = buildCellID(game.applePosition.x, game.applePosition.y);
        const td = document.querySelector ("td#" + id);
        if (td) {
            td.classList.add("apple");
        }
    }
}

const drawBoard = function () { /* sirve para escribir la puntuación del juego mediante seleccionar el ID de score en el html y llamar a la función */
    const span = document.querySelector("#score")
    if (span) {
        span.textContent = game.score;
    }
    const div = document.querySelector("#message");
    if (div) { /* porque si hay game ID el juego está en marcha, si game ID es null el juego aún no está en marcha */
        div.textContent = game.gameId ? "Game running..." : "Game over"; /*escribe game running o game over si el juego acaba*/
    }
}

const drawGameObjects = function() { /* función paera dibujar los game objects */
    drawSnake (); /*dibuja la serpiente*/
    drawApple (); /*dibuja la manzana*/
    drawBoard (); /*dibuja el tablero*/
}

const isSamePosition = function (pos1, pos2) { /* sirve para comprobar si la manzana está en la misma posición que la cabeza o si la serpiente se choca consigo misma */
    if (! pos1 || ! pos2) {
        return false; /* comprueba si alguno de los dos vale null, si no hay posición 1 o posición 2 devuelve null porque no pueden ser iguales */
    }
    if (pos1.x === pos2.x && pos1.y === pos2.y) {
        return true;  /* entonces te devuelve la posición igualada si  */
    }
    else {
        return false;
    }
}

const appleEaten = function () { /*sirve para detectar cuando la serpiente se come la manzana*/
    game.score++;
    game.applePosition = getRandomPosition(); 
    if (game.snake.speed > SNAKE_MAX_SPEED) { 
        game.snake.speed -= (game.snake.speed / 10); /*sube la velocidad de la serpiente*/
        startMoving ();
    }
}

const isCollision = function (newHeadPosition) {  /*sirve para detectar si la serpiente se choca consigo misma o con las paredes*/
    for (var i = 0; i < game.snake.segments.length; i++){
        if (isSamePosition(newHeadPosition, game.snake.segments[i])){
            return true;
        }
    }
    return false;
}



const moveSnake = function () { /* bucle para mover serpiente */
    var newHeadPosition = null; /* variable que contendrá la nueva posición de la cabeza */
    const x = game.snake.segments[0].x; /* coordenada x de la posición actual de la cabeza */
    const y = game.snake.segments[0].y; /* coordenada y de la posición actual de la cabeza */
    switch (game.snake.dir) {
        case "left": /* para mover a la izquierda */
            if (x > 0) { /* como las coordenadas son igual a 0, cuando la serpiente se choca con el borde esta no se mueve */ 
                newHeadPosition = { 
                    x: x - 1,
                    y: y
                };
            }
            break;

        case "right": /* para mover a la derecha */
            if (x < GRID_MAX_COLS -1) {
                newHeadPosition = {
                    x: x + 1,
                    y: y
                };
            }
            break;

        case "up": /* para mover arriba */
            if (y > 0) {
                newHeadPosition = {
                    x: x,
                    y: y - 1
                };
            }
            break;

        case "down": /* para mover abajo */
            if (y < GRID_MAX_ROWS -1) {
                newHeadPosition = {
                    x: x,
                    y: y + 1
                };
            }
            break;
    }
    if (!newHeadPosition || isCollision(newHeadPosition)) {
        endGame(); /* para detectar cuando la serpiente se choca consigo misma */
    }
    else { /* añadimos un elemento al principio del array que será la nueva cabeza de la serpiente */
        game.snake.segments.unshift (newHeadPosition);
        if (isSamePosition (newHeadPosition, game.applePosition)) { /* si la cabeza y la manzana están en la misma posición */
            appleEaten ();
        }
        else  {
            game.snake.segments.pop(); /* borramos la cola antigua de la serpiente excepto cuando la manzana y la cabeza están en la misma posición */
        }
        clearGameObjects(); /* borra de la pantalla la serpiente anterior */
        drawGameObjects(); /* dibuja la nueva serpiente */
    }
}

const readKeyboard = function (event) { /* función para para capturar el mover la dirección de la serpiente según la lectura los eventos de teclado */
    switch (event.key) { 
        case "ArrowLeft": /* para mover a la izquierda */
            game.snake.dir = "left";
            break;

        case "ArrowRight": /* para mover a la derecha */
            game.snake.dir = "right";
            break;

        case "ArrowUp": /* para mover arriba */
            game.snake.dir = "up"
            break;

        case "ArrowDown": /* para mover abajo */
            game.snake.dir = "down"
            break;
    }
}

const stopMoving = function () {
    if (game.gameId) {
        clearInterval(game.gameId);  /* elimina el intervalo que hace que la serpiente se mueva */
        game.gameId = null; /* borra el game ID para que ponga game over */
    }
}

const startMoving = function () {
    stopMoving (); /* si había un game id creado lo borra */
    game.gameId = setInterval (moveSnake, game.snake.speed); /* crea un intervalo que moverá la serpiente. El identificador del intervalo se guarda en el Game ID */
}

const endGame = function () {
    stopMoving (); /* para la serpiente */
    drawGameObjects (); /* dibuja los game objects una última vez */

}

const startGame = function () {
    game.speed = SNAKE_INITIAL_SPEED;
    game.applePosition = getRandomPosition();
    game.snake.segments = [];
    game.score = 0;
    createSnake (); /* crea  la serpiente */
    clearGameObjects ();
    drawGameObjects (); /* dibuja la serpiente */
    startMoving ();
}

const prepareGame = function () { /*esta función sirve para preparar el juego antes de iniciar o al reiniciar*/
    createGrid (); /* llamar a la función createGrid para que se ejecute la grid*/
    document.addEventListener("keyup", readKeyboard);
    const btn = document.querySelector("#start");
    if (btn) {
        btn.addEventListener("click", function (ev) { /* esta función sin nombre se ejecuta cuando el usuario hace click en el botón start game y inicia el juego */
            ev.preventDefault();
            startGame();
        });
    }
}

prepareGame ();