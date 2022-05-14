function drawGrid(context: CanvasRenderingContext2D, cellSize: number, canvasWidth: number, canvasHeight: number, color: string) {
    let x = cellSize
    let y = cellSize

    // Define stroke color
    context.fillStyle = color

    // Draws vertical grid lines
    while (x < canvasWidth) {
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, canvasHeight)
        context.lineWidth = 0.2
        context.stroke()
        x+=cellSize
    }

    // Draws horizontal grid lines
    while (y < canvasHeight) {
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(canvasWidth, y)
        context.lineWidth = 0.2
        context.stroke()
        y+=cellSize
    }
}

function draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'rgb(0,0,0)'
    context.fillRect(0, 0, 50, 50)
}

function drawCell(context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    context.fillStyle = color
    context.fillRect(x, y, size, size)
}

function clearCanvas(context: CanvasRenderingContext2D, width: number, height: number, color: string) {
    context.fillStyle = color
    context.fillRect(0, 0, width, height)
}

function drawBG(context: CanvasRenderingContext2D, width: number, height: number, color: string) {
    context.fillStyle = color
    context.fillRect(0, 0, width, height)
}

function drawgameMatrix(context: CanvasRenderingContext2D, gameMatrix: number[][], cellSize: number) {
    for (let i = 0; i < gameMatrix.length; i++) {
        for (let j = 0; j < gameMatrix[i].length; j++) {
            // Draws snake head part
            if (gameMatrix[i][j] == 2) {
                drawCell(context, cellSize * i, cellSize * j, cellSize, 'red')
            }
            
            // Draws snake body parts
            if (gameMatrix[i][j] == 1) {
                drawCell(context, cellSize * i, cellSize * j, cellSize, 'black')
            }
        }
    }
}

function drawSnake(context: CanvasRenderingContext2D, snake: Array<{ x: number; y: number; }>, cellSize: number) {
    for (let i = 0; i < snake.length; i++) {
        var x = snake[i].x
        var y = snake[i].y
    
        if (i == 0) {
            context.fillStyle = 'lime'
            context.fillRect(x, y, cellSize, cellSize)
        } else {
            context.fillStyle = 'black'
            context.fillRect(x, y, cellSize, cellSize)
        }
    }
}

function test(canvas: HTMLCanvasElement) {
    if (canvas.getContext) {
        alert("Working!")
    } else {
        alert("Not Working!")
    }
}

function printArray(array: Array<Array<number>>) {
    let result = ""
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            result += `Pos(${i},${j}) -> ${array[i][j]}\n`
        }
    }

    return result
}

function moveSnake(snake: Array<{ "x": number; "y": number; }>, nextMovementDirection: string, cellSize: number, hasEatenFood: boolean) {
    switch (nextMovementDirection) {
        case 'up':
            snake.unshift({"x": snake[0].x, "y": snake[0].y - cellSize})
            if (!hasEatenFood) {
                snake.pop()
            }
            break
        case 'right':
            snake.unshift({"x": snake[0].x + cellSize, "y": snake[0].y})
            if (!hasEatenFood) {
                snake.pop()
            }
            break
        case 'left':
            snake.unshift({"x": snake[0].x - cellSize, "y": snake[0].y})
            if (!hasEatenFood) {
                snake.pop()
            }
            break
        case 'down':
            snake.unshift({"x": snake[0].x, "y": snake[0].y + cellSize})
            if (!hasEatenFood) {
                snake.pop()
            }
            break
        default:
            break
    }
}

function handleMovementKeys(key, movementDirection: Array<string>): Array<string> {
    const LEFT_ARROW = 37
    const RIGHT_ARROW = 39
    const UP_ARROW = 38
    const DOWN_ARROW = 40
    let previousMovementDirection = movementDirection[1]
    let nextMovementDirection: string = ''
    let warning = `Invalid key option (${key.code}): Can't invert movement direction!`
    
    switch (key.keyCode) {
        case LEFT_ARROW:
            if (previousMovementDirection == 'right') {
                nextMovementDirection = 'right'
                console.log(warning)
            } else {
                nextMovementDirection = 'left'
            }
            break
        case UP_ARROW:
            if (previousMovementDirection == 'down') {
                nextMovementDirection = 'down'
                console.log(warning)
            } else {
                nextMovementDirection = 'up'
            }
            break
        case RIGHT_ARROW:
            if (previousMovementDirection == 'left') {
                nextMovementDirection = 'left'
                console.log(warning);
            } else {
                nextMovementDirection = 'right'
            }
            break
        case DOWN_ARROW:
            if (previousMovementDirection == 'up') {
                nextMovementDirection = 'up'
                console.log(warning)
            } else {
                nextMovementDirection = 'down'
            }
            break
        default:
            return movementDirection
    }

    console.log("Key pressed code: " + key.code)
    return [previousMovementDirection, nextMovementDirection]
}

// Checks if snake has collided with edges
function hasCollidedWithEdges(snake: Array<{ x: number; y: number; }>, canvasWidth: number, canvasHeight: number, cellSize: number): boolean {
    let head = snake[0]
    if (head.x < 0 || head.x > canvasWidth - cellSize || head.y < 0 || head.y > canvasHeight - cellSize) {
        return true
    }

    for (let i = 1; i < snake.length; i++) {
        if (head == snake[i]) {
            return true
        }
    }

    return false
}

// Checks if snake has collided with itself
function hasCollidedWithItself(snake: Array<{ x: number; y: number; }>): boolean {
    for (let i = 0; i < snake.length; i++) {
        if (i > 0 && snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            return true
        }
    }

    return false
}

// Returns food's generated coordinates
function generateFood(snake: Array<{ x: number; y: number; }>, canvasWidth: number, canvasHeight: number, cellSize: number): Array<number> {   
    let randomX = -1
    let randomY = -1
    let randomRangeX = canvasWidth / cellSize
    let randomRangeY = canvasHeight / cellSize
    
    do {
        randomX = Math.floor(Math.random() * randomRangeX) * cellSize
        randomY = Math.floor(Math.random() * randomRangeY) * cellSize
    } while (snake.includes({x: randomX, y: randomY}))
    
    return [randomX, randomY]
}

function drawFood(context: CanvasRenderingContext2D, food: Array<number>, cellSize: number) {
    if (food != null) {
        context.fillStyle = 'red'
        context.fillRect(food[0], food[1], cellSize, cellSize)
    }
}

// Checks if snake has collided with food
function hasCollidedWithFood(snake: Array<{ x: number; y: number; }>, foodCoordinates: Array<number>) {
    let head = snake[0]
    
    if (head.x == foodCoordinates[0] && head.y == foodCoordinates[1]) {
        return true
    }

    return false
}

function gameLoop() {
    var canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
    var ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    var width: number = canvas.width
    var height: number = canvas.height
    var fps: number = 30
    var cellSize: number = 20
    var gameMatrix: Array<Array<number>> = []
    var snake: Array<{x: number, y: number}> = []
    var movementDirection: Array<string> = ['', 'up']

    // Game data (temp)
    var score = 0
    var food = generateFood(snake, width, height, cellSize)
    var inProgress = false
    var hasEatenFood = false

    // Set initial snake position (initial length -> 3)
    snake[0] = {"x": 15*cellSize, "y": 15*cellSize}
    snake[1] = {"x": 15*cellSize, "y": 16*cellSize}
    snake[2] = {"x": 15*cellSize, "y": 17*cellSize}

    // DEBUG
    console.log("Width: " + width + ", Height: " + height)
    console.log("Score: " + score)
    // console.log(gameMatrix)

    // Handle key presses
    document.addEventListener('keydown', key => {
        inProgress = true
        movementDirection = handleMovementKeys(key, movementDirection)
        console.log("Changed Movement Direction: " + movementDirection)
    });
    
    // Update snake position
    setInterval(function () {
        // Check if snake has collided with food
        if (hasCollidedWithFood(snake, food)) {
            hasEatenFood = true
            score++
            food = null
            food = generateFood(snake, width, height, cellSize)
        }

        // Check if snake has collided with edges
        if (!hasCollidedWithEdges(snake, width, height, cellSize) && !hasCollidedWithItself(snake)) {
            if (inProgress) {
                moveSnake(snake, movementDirection[1], cellSize, hasEatenFood);
                hasEatenFood = false;
            }
        } else {
            alert(`GAME OVER! (Score: ${score})`)
        }

    }, 150)
    
    // Canvas Update
    setInterval(function () {
        clearCanvas(ctx, width, height, 'white')
        drawBG(ctx, width, height, 'white')
        drawGrid(ctx, cellSize, width, height, 'black')
        drawSnake(ctx, snake, cellSize)
        drawFood(ctx, food, cellSize)
    }, 1000 / fps)
}

// Start game once window loads
window.onload = () => {
    gameLoop()
}
