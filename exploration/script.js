let url = 'https://api.nytimes.com/svc/search/v2/';
let query = 'articlesearch.json?fq=section_name:("obituaries")';
let keyQ = '&api-key=' + key;

let getCMD = url + query + keyQ;

console.log(getCMD);

let candles = [];

const SHELF_HEIGHT = 100;
const SHELF_MARGIN = 25;

const CANDLE_WIDTH = 60;
const DATE_HEIGHT = 10;
const MARK_HEIGHT = 40;
const MARK_WIDTH = 20;
const WICK_LENGTH = 15;

const NUM_STARS = 25;
const STAR_RADIUS = [5,10];
const STAR_POINTS = [4,12];

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

function getObits(url) {
    let http = new XMLHttpRequest();
    http.open("GET", url, false);
    http.send(null);
    return http.responseText;
}

function findName(h) {
    //console.log(h);
    let i = h.indexOf(',');
    return h.substring(0,i);
}

function pullObits() {
    let response = JSON.parse(getObits(getCMD));

    let w = width - SHELF_MARGIN * 2;
    let offsetUnit = w / (response.response.docs.length + 1);

    let candles = [];

    //console.log(response.response);
    for (let i = 0; i < response.response.docs.length; i++) {
        let r = response.response.docs[i];
        let candle = {
            name: findName(r.headline.main),
            age: -1,
            ocptn: null,
            loc: {
                x: SHELF_MARGIN + offsetUnit * (i + 1),
                y: SHELF_HEIGHT
            },
            height: 120,
            headline: r.headline,
            content: r['abstract'],
            date: r.pub_date.substring(0,10),
            url: r.web_url
        };
        candles.push(candle);
    }
    this.candles = candles;
    //console.log(this.candles);
}

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

function drawStars() {
    for (let i = 0; i < this.stars.length; i++) {
        let s = this.stars[i];
        drawStar(s.x, s.y, s.r, s.n);
    }
}

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
    //console.log(this.stars);
}

function drawMark(o,x,y) {
    strokeWeight(2);
    stroke(this.labelColor);
    noFill();
    circle(x, height - y - MARK_HEIGHT, MARK_WIDTH);
    circle(x, height - y - MARK_HEIGHT, MARK_WIDTH * 0.5);
}

function drawDate(d,x,y) {
    noStroke();
    fill(this.labelColor);
    textAlign(CENTER,BOTTOM);
    textSize(8);
    text('~' + d, x, height - y - DATE_HEIGHT);
}

function drawFlame(h,x,y) {
    let bottom = height - y - h - WICK_LENGTH;
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

function drawCandle(p,x,y) {
    strokeWeight(2);
    stroke(this.shelfColor);
    noFill();
    line(x,
         height - y - this.candles[p].height,
         x,
         height - y - this.candles[p].height -  WICK_LENGTH);

    strokeWeight(2);
    stroke(this.labelColor);
    fill(this.candleColor);
    rectMode(CORNER);
    rect(x - CANDLE_WIDTH / 2,
         height - y,
         CANDLE_WIDTH,
         -(this.candles[p].height));

    drawMark(this.candles[p].ocptn, x, y);
    drawDate(this.candles[p].date, x, y);

    drawFlame(this.candles[p].height, x, y);
}

function drawCandles() {
    for (let i = 0;  i < this.candles.length; i++) {
        drawCandle(i, this.candles[i].loc.x, this.candles[i].loc.y);
    }
}

function drawShelf() {
    stroke(this.shelfColor);
    strokeWeight(5);

    line(SHELF_MARGIN, height - SHELF_HEIGHT,
         width - SHELF_MARGIN, height - SHELF_HEIGHT);
}

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

function drawCandleCard(c) {
    stroke(this.labelColor);
    strokeWeight(2);
    fill(this.cardColor);
    rectMode(CORNERS);
    rect(this.CANDLE_CARD[0].x, this.CANDLE_CARD[0].y,
         this.CANDLE_CARD[1].x, this.CANDLE_CARD[1].y);

    drawCandle(c,
               this.CANDLE_CARD[0].x
               + (this.CANDLE_CARD[1].x - this.CANDLE_CARD[0].x) / 2,
               height - this.CANDLE_CARD[1].y + CARD_MARGIN);

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

function drawCard(c) {
    //console.log('drawing card for candle ' + c);
    //console.log(this.candles[0]);
    //console.log(this.candles[c]);

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

function setup() {
    createCanvas(windowWidth, windowHeight);

    this.card = -1;

    setColors();
    angleMode(DEGREES);
    createStars(NUM_STARS);
    setFrames();

    pullObits();
}

function draw() {
    background(this.bkgColor);

    drawStars();

    if (this.card < 0) {
        drawShelf();
        drawCandles();
    } else {
        drawCard(this.card);
    }
}

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
                && mY < height - this.candles[i].loc.y
                && mY > height - this.candles[i].loc.y
                - this.candles[i].height) {
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
