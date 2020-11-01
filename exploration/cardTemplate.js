let candles = [];

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

const SHELF_MARGIN = 25;
const LOWER_SHELF_Y = 600;
const UPPER_SHELF_Y = 300;

const NUM_CANDLES = 10;
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

const CARD_CANDLE_WIDTH = CANDLE_WIDTH * 2;
const CARD_CANDLE_HEIGHT_MIN = CANDLE_HEIGHT_MIN * 2;
const CARD_CANDLE_HEIGHT_MAX = CANDLE_HEIGHT_MAX * 2;
const CARD_DATE_HEIGHT = DATE_HEIGHT * 2;
const CARD_MARK_HEIGHT = MARK_HEIGHT * 2;
const CARD_MARK_WIDTH = MARK_WIDTH * 2;
const CARD_WICK_LENGTH = WICK_LENGTH * 2;

const CARD_MARGIN = 100;
let CANDLE_CARD;
let OBIT_CARD;
let LINK_BUTTON;
let BACK_BUTTON;

let candleColor;
let bkgColor;
let cardColor;
let flameColor;
let labelColor;
let starColor;
let shelfColor;

let stars;

let card;

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
 * Sets the constants for the frame sizes in the card.
 */
function setFrames() {
    this.CANDLE_CARD = [
        {x: CARD_MARGIN, y: CARD_MARGIN},
        {x: (windowWidth - CARD_MARGIN * 2) / 3 - CARD_MARGIN / 2,
         y: windowHeight - CARD_MARGIN}
    ];
    this.OBIT_CARD = [
        {x: (windowWidth - CARD_MARGIN * 2) / 3 + CARD_MARGIN / 2,
         y: CARD_MARGIN},
        {x: windowWidth - CARD_MARGIN, y: windowHeight - CARD_MARGIN}
    ];
    this.LINK_BUTTON = [
        {x: this.OBIT_CARD[0].x, y: this.OBIT_CARD[1].y - 24},
        {x: this.OBIT_CARD[1].x, y: this.OBIT_CARD[1].y}
    ];
    this.BACK_BUTTON = [
        {x: 25, y: 25},
        {x: 115, y: 55}
    ];
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
    const CANDLE_START = SHELF_MARGIN + OFFSET_UNIT;
    let candles = [];
    for (let i = 0; i < n; i++) {
        let candle = {
            name: "John Doe",
            age: Math.floor(Math.random() * 100),
            ocptn: OCCUPATIONS[Math.floor(Math.random()
                                          * OCCUPATIONS.length)],
            loc: {
                x: CANDLE_START + OFFSET_UNIT * (i % CANDLES_PER_ROW),
                y: i < CANDLES_PER_ROW ? UPPER_SHELF_Y : LOWER_SHELF_Y
            },
            height: Math.random()
                * (CANDLE_HEIGHT_MAX - CANDLE_HEIGHT_MIN)
                + CANDLE_HEIGHT_MIN,
            width: CANDLE_WIDTH,
            headline: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vulputate ut pharetra sit amet. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Magna etiamtempor orci eu. Lorem donec massa sapien faucibus et molestie ac. Dictumst vestibulum rhoncus est pellentesque.",
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
 * Assigns certain variables based on card mode (m).
 */
function drawMark(o,x,y,m) {
    let markWidth = m < 0 ? MARK_WIDTH : CARD_MARK_WIDTH;
    let markHeight = m < 0 ? MARK_HEIGHT : CARD_MARK_HEIGHT;

    strokeWeight(2);
    stroke(this.labelColor);
    noFill();
    circle(x, y - markHeight, markWidth);
    circle(x, y - markHeight, markWidth * 0.5);
}

/*
 * Draws the given date (d) in the given x and y positions
 * Assigns certain variables based on card mode (m).
 */
function drawDate(d,x,y,m) {
    noStroke();
    fill(this.labelColor);
    textAlign(CENTER,BOTTOM);
    textSize(8);
    text('~' + d, x, y - (m < 0 ? DATE_HEIGHT : CARD_DATE_HEIGHT));
}

/*
 * Draws a flame with the given height (h), x and y positions, and color (c)
 * Assigns certain variables based on card mode (m).
 */
function drawFlame(h,x,y,m) {
    let bottom = y - h - (m < 0 ? WICK_LENGTH : CARD_WICK_LENGTH);
    let top = bottom - h / 5;

    strokeWeight(2);
    stroke(this.labelColor);
    fill(this.flameColor[2]);
    beginShape();
    vertex(x,bottom);
    bezierVertex(x + h / 7, bottom,
                 x + h / 7, bottom - (bottom - top) / 2,
                 x, top);
    bezierVertex(x - h / 7, bottom - (bottom - top) / 2,
                 x - h / 7, bottom,
                 x, bottom);
    endShape();
}

/*
 * Draws a candle with the based on the given candle (c)
 * Assigns certain variables based on card mode (m).
 */
function drawCandle(c,m) {
    strokeWeight(2);
    stroke(this.shelfColor);
    noFill();
    line(c.loc.x,
         c.loc.y - c.height,
         c.loc.x,
         c.loc.y - c.height -  (m < 0 ? WICK_LENGTH : CARD_WICK_LENGTH));

    strokeWeight(2);
    stroke(this.labelColor);
    fill(this.candleColor);
    rectMode(CORNER);
    rect(c.loc.x - (m < 0 ? CANDLE_WIDTH : CARD_CANDLE_WIDTH) / 2,
         c.loc.y,
         m < 0 ? CANDLE_WIDTH : CARD_CANDLE_WIDTH,
         -(c.height));

    drawMark(c.ocptn, c.loc.x, c.loc.y, m);
    drawDate(c.date, c.loc.x, c.loc.y, m);

    drawFlame(c.height, c.loc.x, c.loc.y, m);
}

/*
 * Draws all the candles in the frame.
 */
function drawCandles() {
    for (let i = 0;  i < this.candles.length; i++) {
        drawCandle(this.candles[i],-1);
    }
}

/*
 * Draws a shelf for the candles to be placed on with the given y position
 */
function drawShelf(y) {
    stroke(this.shelfColor);
    strokeWeight(5);

    line(SHELF_MARGIN, y,
         width - SHELF_MARGIN, y);
}

/*
 * Creates a new candle that has the properties of the input candle (c),
 * but a new x and y position, new height (h), and new width (w).
 */
function modifiedCandle(c,x,y,h,w) {
    let candle = {
        name: c.name,
        age: c.age,
        ocptn: c.ocptn,
        loc: {
            x: x,
            y: y
        },
        height: h,
        width: w,
        headline: c.headline,
        content: c.content,
        date: c.date,
        geo: c.geo,
        wordCount: c.wordCount,
        url: c.url
    };
    return candle;
}

/*
 * Draws the back arrow button on the candle card with the given card number (c)
 */
function drawBackArrow(c) {
    stroke(this.labelColor);
    strokeWeight(2);
    fill(this.cardColor);
    rectMode(CORNERS);
    rect(this.BACK_BUTTON[0].x, this.BACK_BUTTON[0].y,
         this.BACK_BUTTON[1].x, this.BACK_BUTTON[1].y);

    noFill();
    stroke(this.labelColor);
    strokeWeight(2);
    line(this.BACK_BUTTON[0].x + 10,
         this.BACK_BUTTON[0].y
         + (this.BACK_BUTTON[1].y - this.BACK_BUTTON[0].y) / 2,
         this.BACK_BUTTON[1].x - 10,
         this.BACK_BUTTON[0].y
         + (this.BACK_BUTTON[1].y - this.BACK_BUTTON[0].y) / 2);
    line(this.BACK_BUTTON[0].x + 10,
         this.BACK_BUTTON[0].y
         + (this.BACK_BUTTON[1].y - this.BACK_BUTTON[0].y) / 2,
         this.BACK_BUTTON[0].x + 20,
         this.BACK_BUTTON[0].y
         + (this.BACK_BUTTON[1].y - this.BACK_BUTTON[0].y) / 2 - 10);
    line(this.BACK_BUTTON[0].x + 10,
         this.BACK_BUTTON[0].y
         + (this.BACK_BUTTON[1].y - this.BACK_BUTTON[0].y) / 2,
         this.BACK_BUTTON[0].x + 20,
         this.BACK_BUTTON[0].y
         + (this.BACK_BUTTON[1].y - this.BACK_BUTTON[0].y) / 2 + 10);
}

/*
 * Draws the candle card for the given card number (c)
 */
function drawCandleCard(c) {
    stroke(this.labelColor);
    strokeWeight(2);
    fill(this.cardColor);
    rectMode(CORNERS);
    rect(this.CANDLE_CARD[0].x, this.CANDLE_CARD[0].y,
         this.CANDLE_CARD[1].x, this.CANDLE_CARD[1].y);

    drawCandle(modifiedCandle(this.candles[c],
                              this.CANDLE_CARD[0].x
                              + (this.CANDLE_CARD[1].x - this.CANDLE_CARD[0].x) / 2,
                              this.CANDLE_CARD[1].y - CARD_MARGIN,
                              map(this.candles[c].height,
                                  CANDLE_HEIGHT_MIN,
                                  CANDLE_HEIGHT_MAX,
                                  CARD_CANDLE_HEIGHT_MIN,
                                  CARD_CANDLE_HEIGHT_MAX),
                              CARD_CANDLE_WIDTH),
               c);

    noStroke();
    fill(this.labelColor);
    rectMode(CORNER);
    textAlign(CENTER,TOP);
    textSize(36);
    textStyle(BOLD);
    text(this.candles[c].name,
         this.CANDLE_CARD[0].x,
         this.CANDLE_CARD[0].y + CARD_MARGIN,
         this.CANDLE_CARD[1].x - this.CANDLE_CARD[0].x,
         CARD_MARGIN);
}

/*
 * Draws a card for a given card index c.
 */
function drawCard(c) {
    noStroke();
    fill(this.bkgColor);
    rectMode(CORNERS);
    rect(this.OBIT_CARD[0].x, this.OBIT_CARD[0].y,
         this.OBIT_CARD[1].x, this.OBIT_CARD[1].y);

    noStroke();
    fill(this.starColor);
    rectMode(CORNER);
    textAlign(LEFT,CENTER);
    textSize(24);
    textStyle(ITALIC);
    text('"' + this.candles[c].content + '"',
         this.OBIT_CARD[0].x,
         this.OBIT_CARD[0].y,
         this.OBIT_CARD[1].x - this.OBIT_CARD[0].x,
         this.OBIT_CARD[1].y - this.OBIT_CARD[0].y);

    fill(this.cardColor);
    textAlign(LEFT,BOTTOM);
    textSize(24);
    textStyle(NORMAL);
    text('READ FULL OBITUARY', this.LINK_BUTTON[0].x, this.LINK_BUTTON[1].y);

    noFill();
    stroke(this.cardColor);
    strokeWeight(2);
    line(this.LINK_BUTTON[0].x, this.LINK_BUTTON[1].y,
         this.LINK_BUTTON[0].x + textWidth('READ FULL OBITUARY'),
         this.LINK_BUTTON[1].y);


    drawCandleCard(c);
    drawBackArrow(c);
}

/*
 * p5 setup function. Called once on instantiation of canvas.
 */
function setup() {
    createCanvas(windowWidth, windowHeight);

    this.card = -1;

    setColors();
    angleMode(DEGREES);
    createStars(NUM_STARS);
    createCandles(NUM_CANDLES);
    setFrames();
}

/*
 * p5 draw function. Called on canvas update (30hz).
 */
function draw() {
    background(this.bkgColor);

    drawStars();

    if (this.card < 0) {
        drawShelf(LOWER_SHELF_Y);
        drawShelf(UPPER_SHELF_Y);
        drawCandles();
    } else {
        drawCard(this.card);
    }
}

/*
 * p5 mouseClicked function. Called whenver mouse is clicked.
 */
function mouseClicked() {
    let mX = mouseX;
    let mY = mouseY;

    console.log('mouse clicked');

    console.log(this.candles);
    console.log(this.card);

    if (this.card < 0) {
        for (let i = 0;  i < this.candles.length; i++) {
            if (mX < this.candles[i].loc.x + CANDLE_WIDTH / 2
                && mX > this.candles[i].loc.x - CANDLE_WIDTH / 2
                && mY < this.candles[i].loc.y
                && mY > this.candles[i].loc.y - this.candles[i].height) {
                this.card = i;
                console.log('card: ' + this.card);
            }
        }
    } else {
        if (mX < this.BACK_BUTTON[1].x && mX > this.BACK_BUTTON[0].x
            && mY < this.BACK_BUTTON[1].y && mY > this.BACK_BUTTON[0].y) {
            this.card = -1;
            console.log('card: ' + this.card);
        } else if (mX < this.LINK_BUTTON[1].x && mX > this.LINK_BUTTON[0].x
            && mY < this.LINK_BUTTON[1].y && mY > this.LINK_BUTTON[0].y) {
            window.open(this.candles[this.card].url, '_blank');
            console.log('open url');
        }
    }
}
