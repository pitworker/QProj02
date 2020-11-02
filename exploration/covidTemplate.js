let covidURL = 'https://api.covidtracking.com/v1/us/daily.json';

const SHELF_MARGIN = 100;

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

let deaths;

let stars;

function getReq(url) {
    let http = new XMLHttpRequest();
    http.open("GET", url, false);
    http.send(null);
    return http.responseText;
}

function pullCovid() {
    let response = JSON.parse(getReq(covidURL));
    let deaths = [];
    let deathMax = 0;
    let deathMin = Number.MAX_SAFE_INTEGER;

    for (let i = response.length - 1; i >= 0; i--) {
        let death = {
            date: response[i].date,
            inc: response[i].deathIncrease,
            total: response[i].death
        };
        if (deathMax < response[i].deathIncrease) {
            deathMax = response[i].deathIncrease;
        }
        if (deathMin > response[i].deathIncrease) {
            deathMin = response[i].deathIncrease;
        }
        deaths.push(death);
    }

    let xOffset = (width - SHELF_MARGIN * 2) / (deaths.length - 1);
    let yOffset = (height - SHELF_MARGIN * 2) / (deathMax - deathMin);

    for (let i = 0; i < deaths.length; i++) {
        deaths[i].loc = {
            x: SHELF_MARGIN + xOffset * i,
            y: height - SHELF_MARGIN - yOffset * deaths[i].inc
        };
    }

    this.deaths = deaths;
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
}

function drawShelf() {
    stroke(this.shelfColor);
    strokeWeight(5);

    line(SHELF_MARGIN, height - SHELF_MARGIN,
         width - SHELF_MARGIN, height - SHELF_MARGIN);
}

function drawCovid() {
    stroke(this.cardColor);
    strokeWeight(3);
    noFill();
    beginShape();
    for (let i = 0; i < this.deaths.length; i++) {
        let d = this.deaths[i];
        vertex(d.loc.x, d.loc.y);
    }
    endShape();
}

function deathLabel(d) {
    let label = 'DATE: ' + d.date
        + '\nNEW DEATHS: ' + d.inc
        + '\nTOTAL DEATHS: ' + d.total;

    textAlign(LEFT,BOTTOM);
    textSize(16);

    rectMode(CORNER);
    stroke(this.candleColor);
    strokeWeight(3);
    fill(this.cardColor);
    rect(d.loc.x, d.loc.y, textWidth('TOTAL DEATHS: ' + d.total) + 20, -78)

    noStroke();
    fill(this.candleColor);
    text(label, d.loc.x + 10, d.loc.y - 10);
}

function highlightCovid() {
    let mX = mouseX;
    let mY = mouseY;

    for(let i = 0; i < this.deaths.length; i++) {
        let d = this.deaths[i];
        const R = 4;
        if (mX < d.loc.x + R && mX > d.loc.x - R
            && mY < d.loc.y + R && mY > d.loc.y - R) {
            noStroke();
            fill(this.flameColor[1]);
            circle(d.loc.x, d.loc.y, 10);
            deathLabel(d);
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    setColors();
    angleMode(DEGREES);
    createStars(NUM_STARS);

    pullCovid();
}

function draw() {
    background(this.bkgColor);

    drawStars();

    drawShelf();

    drawCovid();

    highlightCovid();
}
