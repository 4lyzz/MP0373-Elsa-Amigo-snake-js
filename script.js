const GRID_MAX_COLS = 25; /* define una constante globar del programa siempre en mayúsculas */
const GRID_MAX_ROWS = 25; /* se define aquí en vez de dentro de la función para no tener que editar la función si se quieren más filas 
// const & var para crear variables, var variable que cambia a lo largo del tiempo, const es para crear una constante que cambia a lo largo del tiempo */
const SNAKE_INITIAL_SPEED = 500;

const snake = {
    segments: [], /* array de segmentos para definir las posiciones */
    dir: "stop", /* esto es como un string de stop */
    speed: SNAKE_INITIAL_SPEED
};

var applePosition = null;

const buildCellID = function(x, y){ /* renombramos la variable td para que nos diga la coordenada de Row y de Column*/
    return "R" + y + "_C" + x; 
}

const getRandomPosition = function () {
    return {
        x: Math.floor (Math.random() * (GRID_MAX_COLS - 1)),
        y: Math.floor (Math.random() * (GRID_MAX_ROWS - 1))
    };
}

const createGrid = function() { 
const grid = document.querySelector("#grid"); /* Sirve para acceder al html entonces el querySelector busca el punto grid y lo devuelve como un objeto de JaveScript*/
if(grid) {
    for(var i = 0; i < GRID_MAX_ROWS; i++) {
        const tr = document.createElement("tr"); /* Crea un elemento tr que es un tag // por tanto crea una fila de tablas */
        for(var j = 0; j < GRID_MAX_COLS; j++) { /* For para crear la cuadrícula dónde irá el snake*/
            const td = document.createElement("td"); /* Creo el td */
            td.id = buildCellID(j, i);
            tr.appendChild(td); /* añado el td al tr */
        }
        grid.appendChild(tr); /* Añade el tag de tr a la tabla */
    }
}
}

const createSnake = function () { /* nueva función para crer la serpiente */
    snake.segments.push ({ x: 5, y: 5}); /* posición para probar la función */
    /* push es para añadir un elemento a un array */
    snake.segments.push ({ x: 6, y: 5});
    snake.segments.push ({ x: 7, y: 5});
    snake.segments.push ({ x: 8, y: 5});
    snake.segments.push ({ x: 9, y: 5});
    snake.dir = "left";
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
            td.classList.remove("segment")
            td.classList.remove ("head");
        }
    } 
   } 
}
const drawGameObjects = function() { /* función paera dibujar el snake */
    for (var i = 0; i < snake.segments.length; i++) { /* esto recorre el array de segmentos de la serpiente */
        const isHead = i === 0;
        drawSnakeSegment (snake.segments[i], isHead);
    }
}

const moveSnake = function () { /* bucle para mover serpiente */
    var newHeadPosition = null; /* variable que contendrá la nueva posición de la cabeza */
    const x = snake.segments[0].x; /* coordenada x de la posición actual de la cabeza */
    const y = snake.segments[0].y; /* coordenada y de la posición actual de la cabeza */
    //
    switch (snake.dir) {
        case "left": /* para mover a la izquierda */
            if (x > 0) { 
                newHeadPosition = { 
                    x: x - 1,
                    y: y
                };
            }
            break;
    //
        case "right": /* para mover a la derecha */
            if (x < GRID_MAX_COLS -1) {
                newHeadPosition = {
                x: x + 1,
                y: y
                };
            }
            break;
    //
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
    //
    if (newHeadPosition) { /* añadimos un elemento al principio del array que será la nueva cabeza de la serpiente */
        snake.segments.unshift(newHeadPosition);
        snake.segments.pop(); /* borramos la cola antigua de la serpiente */
        clearGameObjects(); /* borra de la pantalla la serpiente anterior */
        drawGameObjects(); /* dibuja la nueva serpiente */
    }
}

const readKeyboard = function (event) { /* función para para capturar el mover la dirección de la serpiente según la lectura los eventos de teclado */
    switch (event.key) { 
        case "ArrowLeft": /* para mover a la izquierda */
            snake.dir = "left";
            break;

        case "ArrowRight": /* para mover a la derecha */
            snake.dir = "right";
            break;

        case "ArrowUp": /* para mover arriba */
            snake.dir = "up"
            break;

        case "ArrowDown": /* para mover abajo */
            snake.dir = "down"
            break;
    }
}

applePosition = getRandomPosition();
createGrid (); /* llamar a la función createGrid para que se ejecute la grid*/
createSnake (); /* crea  la serpiente */
drawGameObjects (); /* dibuja la serpiente */

const eventID = setInterval (moveSnake, snake.speed);

document.addEventListener ("keyup", readKeyboard);