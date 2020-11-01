let candles = {};

const OCCUPATIONS = [
    "aviation",
    "art",
    "business",
    "education",
    "media",
    "medical",
    "service",
    "technology",
    "law",
    "x"
];

var aviationurl = "https://i.imgur.com/eTHCCwn.png"
var arturl = "https://i.imgur.com/wK6PjWu.png"
var businessurl = "https://i.imgur.com/nz0Y5fX.png"
var educationurl = "https://i.imgur.com/Q67WbQG.png"
var mediaurl = "https://i.imgur.com/Mg75pli.png"
var medicalurl = "https://i.imgur.com/N2QFRsF.png"
var serviceurl = "https://i.imgur.com/yAUNJZa.png"
var technologyurl = "https://i.imgur.com/6222Qav.png"
var lawurl = "https://i.imgur.com/9jHFSHn.png"

const SHELF_MARGIN = 25;
const LOWER_SHELF_Y = 600;
const UPPER_SHELF_Y = 300;

const NUM_CANDLES = 5;
const CANDLES_PER_ROW = 5;
const CANDLE_WIDTH = 60;
const DATE_HEIGHT = 10;
const MARK_HEIGHT = 40;
const MARK_WIDTH = 20;
const WICK_LENGTH = 15;
const CANDLE_HEIGHT_MIN = 80;
const CANDLE_HEIGHT_MAX = 120;

const NUM_STARS = 25;
const STAR_RADIUS = [5,10];
const STAR_POINTS = [4,12];

let candleColor;
let bkgColor;
let cardColor;
let flameColor;
let labelColor;
let starColor;
let shelfColor;

let stars;

/*
 * Sets the color constants
 */
function setColors() {
    this.candleColor = color('#fff4e2');
    this.bkgColor = color('#0f172d');
    this.cardColor = color('#599a9e');
    this.flameColor = [
        color('#de4300'),
        color('#ee6d10'),
        color('#ff8730'),
        color('#ffac71'),
        color('#ffddaa')
    ];
    this.labelColor = color('#000000');
    this.starColor = color('#ffffff');
    this.shelfColor = color('#f2ead2');
}

/*
 * Draws a vertex for a given angle.
 * Takes in a starting point (x,y), the offset distance (r), and the angle (t)
 * This function is used in the drawStar function.
 */
function vertexAtAngle(x,y,r,t) {
    let neg = false;
    t = t % 360 - 90;
    if (t >= 90) {
        neg = true;
        t = t - 180;
    }

    if (r != 0 && !neg) {
        x += cos(t) * r;
        y += sin(t) * r;
    } else if (r != 0) {
        x -= cos(t) * r;
        y -= sin(t) * r;
    }

    vertex(x,y);
}

/*
 * Draws a star at the given x/y positions with the given radius (r)
 * and the given number of points (n)
 */
function drawStar(x,y,r,n) {
    noStroke();
    fill(this.starColor);
    beginShape();
    let t = 360 / n;
    for (let i = 0; i < n; i++) {
        vertexAtAngle(x, y, r, i * t);
        vertexAtAngle(x, y, r / 2.75, i * t + t / 2);
    }
    endShape(CLOSE);
}

/*
 * Draws the stars in the background
 */
function drawStars() {
    for (let i = 0; i < this.stars.length; i++) {
        let s = this.stars[i];
        drawStar(s.x, s.y, s.r, s.n);
    }
}

/*
 * Generates the given number (n) of stars for the background
 */
function createStars(n) {
    let stars = [];
    for (let i = 0; i < n; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * (STAR_RADIUS[1] - STAR_RADIUS[0])
                + STAR_RADIUS[0],
            n: map(Math.floor(Math.random() * 9),
                   0, 9,
                   STAR_POINTS[0], STAR_POINTS[1])
        });
    }
    this.stars = stars;
}

/*
 * Creates the candles based on the given input number (n)
 * Currently these candles are placeholders
 */
function createCandles(n) {
    const OFFSET_UNIT = (width - SHELF_MARGIN * 2) / (CANDLES_PER_ROW + 1);
    let candles = [];
    for (let i = 0; i < n; i++) {
        let candle = {
            name: "John Doe",
            age: Math.floor(Math.random() * 100),
            ocptn: OCCUPATIONS[Math.floor(Math.random()
                                          * OCCUPATIONS.length)],
            loc: {
                x: SHELF_MARGIN + OFFSET_UNIT,
                y: i < CANDLES_PER_ROW ? UPPER_SHELF_Y : LOWER_SHELF_Y
                // x: 100,
                // y: 300
            },
            candleHeight: Math.random()
                * (CANDLE_HEIGHT_MAX - CANDLE_HEIGHT_MIN)
                + CANDLE_HEIGHT_MIN,
            headline: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vulputate ut pharetra sit amet. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Magna etiam tempor orci eu. Lorem donec massa sapien faucibus et molestie ac. Dictumst vestibulum rhoncus est pellentesque.",
            date: "2020-10-31",
            geo: "New York, NY",
            wordCount: Math.floor(Math.random() * 800 + 500),
            url: "https://youtu.be/xuCn8ux2gbs"
        }

        candles.push(candle);
    }

    this.candles = candles;
    console.log(this.candles);
}

/*
 * Draws the mark for the given occupation (o) at the given x and y positions
 */
function drawMark(o,x,y) {
    strokeWeight(2);
    stroke(this.labelColor);
    noFill();
    image(aviationPng, x, height - y - MARK_HEIGHT);
    // circle(x, height - y - MARK_HEIGHT, MARK_WIDTH);
    // circle(x, height - y - MARK_HEIGHT, MARK_WIDTH * 0.5);
}

/*
 * Draws the given date (d) in the given x and y positions
 */
function drawDate(d,x,y) {
    noStroke();
    fill(this.labelColor);
    textAlign(CENTER,BOTTOM);
    textSize(8);
    text('~' + d, x, height - y - DATE_HEIGHT);
}

/*
 * Draws a flame with the given height (h), x and y positions, and color (c)
 */
function drawFlame(h,x,y,c) {
    // TODO: Draw the flame based on the given inputs.
}

/*
 * Draws a candle with the based on the given candle (c).
 */
function drawCandle(c) {
    // TODO: Draw the candle that was input.
    //       this function should also call drawFlame, drawDate, and drawMark
    fill(this.candleColor);
    rect(c.loc.x, c.loc.y, CANDLE_WIDTH, CANDLE_HEIGHT_MAX);
    drawMark(this.candles.ocptn, c.loc.x, c.loc.y);
    // drawFlame(this.candles.height, c.loc.x, c.loc.y+100);
    drawDate(this.candles.date, c.loc.x, c.loc.y);
}

/*
 * Draws all the candles in the frame.
 */
function drawCandles() {
    for (let i = 0;  i < this.candles.length; i++) {
        drawCandle(this.candles[i]);
    }
}

/*
 * Draws a shelf for the candles to be placed on with the given y position
 */
function drawShelf(y) {
    // TODO: draw the a shelf based on the input y position
}

/*
 * Draws the shelves in the frame
 */
function drawShelves() {
    drawShelf(LOWER_SHELF_Y);
    drawShelf(UPPER_SHELF_Y);
}

/*
 * p5 preload function. Preloads all the pngs. 
 */
function preload() {
	aviationPng = loadImage(aviationurl);
	artPng = loadImage(arturl);
	businessPng = loadImage(businessurl);
	educationPng = loadImage(educationurl);
	mediaPng = loadImage(mediaurl);
	medicalPng = loadImage(medicalurl);
	servicePng = loadImage(serviceurl);
	technologyPng = loadImage(technologyurl);
	lawPng = loadImage(lawurl);
	currentImageIndex = 0;
}

/*
 * p5 setup function. Called once on the instantiation of the canvas.
 */
function setup() {
    createCanvas(windowWidth, windowHeight);

    setColors();
    angleMode(DEGREES);

    createStars(NUM_STARS);
    createCandles(NUM_CANDLES);
}

/*
 * p5 draw function. Called every time the frame updates (30hz)
 */
function draw() {
    background(this.bkgColor);
    image(aviationPng, 20, 20);
    image(artPng, 100, 100);
    //resizing pngs to fit candle 
    // aviationPng.resize(100, 0);
    drawStars();
    drawShelf();
    drawCandles();
}
