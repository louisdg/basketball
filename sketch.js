let DIAMETER = 100;

let ball = {
    x: 0,
    y: 0,
    diameter: DIAMETER,
    radius: 0,
    thrown: false,
    prevx: 0,
    prevy: 0
}

let ballSpeed = {
    x: 0,
    y: 0
}

let shadow = {
    x: 0,
    y: 0,
    force: 0,
    size: 0
}

let hoop = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
}

let GRAVITY = 1;
let currentGravity;

let mousePress = {
    state: false,
    x: 0,
    y: 0
}
let mouseClick = {
    state: false,
    x: 0,
    y: 0
}
let ballPress = {
    state: false,
    x: 0,
    y: 0
}

let score = {
    current: 0,
    high: 0,
}

let scored = false;

let fontSize;

let gameState;

let col;
let up;

let i = 0;
let j = 20;

let boundary = {
    x: 0,
    y: 0
}

let bg = {
    r: 0,
    g: 127,
    b: 127
}

let prev = {
    x: 0,
    y: 0
}

function resetScore() {
    score.current = 0;
}

function resetBall() {
    ball.x = width / 4;
    ball.y = 3 * height / 4;
    ball.prevx = ball.x;
    ball.prevy = ball.y;
    ballSpeed.x = 0;
    ballSpeed.y = 0;
    ball.thrown = false;
    ballPress.state = false;
}

function resetGravity() {
    currentGravity = GRAVITY;
}

let grabbed = false;

function getCookie(name) {
    let re = new RegExp(name + "=([^;]+)");
    let value = re.exec(document.cookie);
    return (value != null) ? decodeURIComponent(value[1]) : null;
}

function clickBall() {
    if (mousePress.state && mousePress.x <= boundary.x && sqrt(pow(mousePress.x - ball.x, 2) + pow(mousePress.y - ball.y, 2)) <= ball.radius) {
        gameState = "play";
        grabbed = true;
        mousePress.state = false;
        ballPress.state = true;
        ballPress.x = mouseX - ball.x;
        ballPress.y = mouseY - ball.y;
        if (!ball.thrown) {
            clickSound.play();
        }
        i = 0;
        j = 20;
    }
}

function randomizeHoop() {
    hoop.x = random(3 * width / 4, 7 * width / 8);
    hoop.y = random(height / 4, 3 * height / 4);
    hoop.w = random(200, 300);
    hoop.h = 20;
}

function menu() {
    resetGravity();
    resetScore();
    resetBall();
    randomizeHoop();
    background(127, 63, 63);
    noStroke();
    fill(255, 255, 255);
    ellipse(ball.x, ball.y, ball.diameter, ball.diameter);
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(100 * fontSize);
    stroke(255);
    strokeWeight(40 * fontSize);
    text('BasketBall', width / 2, height / 2 - ball.diameter - 120);
    fill(255);
    stroke(0);
    strokeWeight(20 * fontSize);
    text('BasketBall', width / 2, height / 2 - ball.diameter - 120);
    fill(255, 255, 255, 127);
    noStroke();
    textSize(30 * fontSize);
    text('Hold the ball to start', width / 2, height / 2 - ball.diameter);
    textAlign(CENTER, BASELINE);
    text('High score', width / 2, height / 2 + ball.diameter);
    text(score.high, width / 2, height / 2 + ball.diameter + 30);
}

function updateSpeed() {
}

function updateSpeedX() {
    ballSpeed.x *= 0.85;
    ballSpeed.y *= 0.95;
}

function updateSpeedY() {
    ballSpeed.x *= 0.95;
    ballSpeed.y *= 0.85;
}

let font;
let clickSound;
let scoredSound;
let newRecordSound;

function preload() {
    font = loadFont('assets/baloobhaina.ttf');
    clickSound = loadSound('assets/click.mp3');
    scoredSound = loadSound('assets/scored.mp3');
    newRecordSound = loadSound('assets/new-record.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    boundary.x = width / 2;

    if (width <= 1000) {
        fontSize = map(width, 0, 1000, 0.5, 1);
    } else {
        fontSize = 1;
    }

    resetScore();
    resetBall();
    ball.radius = ball.diameter / 2;
    gameState = "menu";
    if (getCookie("highScore") == null) {
        document.cookie = "highScore=0";
    } else {
        score.high = getCookie("highScore");
    }
}

function draw() {
    if (gameState === "menu") {
        menu();
    } else if (gameState === "scored") {
        randomizeHoop();
        resetBall();
        gameState = "play";
    } else if (gameState === "play") {
        background(127, 63, 63);

        // boundary
        if (!ball.thrown) {
            stroke(255, 63, 63, 127);
            strokeWeight(10);
            line(boundary.x, 0, boundary.x, height);
            noStroke();
        }

        // score count
        fill(0, 0, 0, 63);
        noStroke();
        textSize(min(width, height) * 0.75);
        textAlign(CENTER, BASELINE);
        text(score.current, width / 2, height / 2 + min(width, height) * 0.25);

        // grab
        if (!ball.thrown && mouseIsPressed && ballPress.state) {
            if (mouseX > 0) {
                ballSpeed.x = mouseX - prev.x;
            } else {
                ballSpeed.x = 0;
            }
            ballSpeed.y = mouseY - prev.y;
            ball.x = max(ball.radius, mouseX - ballPress.x);
            ball.y = mouseY - ballPress.y;
        }
        if (!grabbed && ballPress.state || mouseX - ballPress.x > boundary.x && grabbed) {
            ball.thrown = true;
            grabbed = false;
            ballPress.state = false;
        }

        // ball
        noStroke();
        fill(255);
        ellipse(ball.x, ball.y, ball.diameter, ball.diameter);

        // computing
        if (ball.thrown) {
            ballSpeed.y += currentGravity;
            ball.prevx = ball.x;
            ball.prevy = ball.y;
            ball.x += ballSpeed.x;
            ball.y += ballSpeed.y;
        }

        prev.x = mouseX;
        prev.y = mouseY;

        // left collision
        if (ball.x < ball.radius) {
            ballSpeed.x = -ballSpeed.x;
            ball.x = ball.radius;
            updateSpeedX();
        }
        // right collision
        if (ball.x > width - ball.radius) {
            ballSpeed.x = -ballSpeed.x;
            ball.x = width - ball.radius;
            updateSpeedX();
        }

        // hoop
        fill(255, 127, 63);
        rectMode(CENTER);
        rect(hoop.x, hoop.y, hoop.w, hoop.h);

        updateSpeed();

        // score
        if (ball.prevy <= hoop.y && ball.y >= hoop.y && ball.x >= hoop.x - hoop.w / 2 && ball.x <= hoop.x + hoop.w / 2) {
            score.current++;
            scoredSound.amp(0.5);
            scoredSound.play();
            scored = true;
        }


        // death
        if (ball.y > 2 * height) {
            if (scored) {
                gameState = "scored";
                scored = false;
            } else {
                gameState = "end";
                mousePress.state = false;
                col = 0;
                up = true;
                document.cookie = "highScore=" + max(score.current, score.high);
                if (score.current > score.high) {
                    if (!newRecordSound.isPlaying()) {
                        newRecordSound.play();
                    }
                }
            }
        }
    } else if (gameState === "end") {
        background(127, 63, 63);
        textAlign(CENTER, CENTER);
        textSize(30 * fontSize);
        fill(255, 255, 255, 127);
        noStroke();
        text('Score', width / 2, height / 2 - 45);
        text(score.current, width / 2, height / 2 - 15);
        if (score.current <= score.high) {
            text('High score', width / 2, height / 2 + 15);
            text(score.high, width / 2, height / 2 + 45);
        } else {
            fill(255, 191 + col * 2, 255 - col * 4);
            textSize((48 + col / 2) * fontSize);
            stroke(255);
            strokeWeight((24 + col / 4) * fontSize);
            text('High score beaten!', width / 2, height / 2 + 30);
            stroke(0);
            strokeWeight((12 + col / 8) * fontSize);
            text('High score beaten!', width / 2, height / 2 + 30);
        }
        if (col >= 32) {
            up = false;
        } else if (col <= 0) {
            up = true;
        }
        if (up) {
            col++;
        } else {
            col--;
        }
        if (mousePress.state) {
            score.high = max(score.current, score.high);
            gameState = "menu";
            mousePress.state = false;
        }
    }
}

function mousePressed() {
    mousePress.state = true;
    mousePress.x = mouseX;
    mousePress.y = mouseY;
    clickBall();
}

function mouseClicked() {
    mouseClick.state = true;
    mouseClick.x = mouseX;
    mouseClick.y = mouseY;
    grabbed = false;
}

function mouseReleased() {
    mouseClick.state = false;
    mouseClick.x = mouseX;
    mouseClick.y = mouseY;
    grabbed = false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    boundary.x = width / 2;

    if (width <= 1000) {
        fontSize = map(width, 0, 1000, 0.5, 1);
    } else {
        fontSize = 1;
    }

    if (gameState === "menu") {
        menu();
    }
}