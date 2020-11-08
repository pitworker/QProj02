let url = 'https://api.nytimes.com/svc/search/v2/';
let query = 'articlesearch.json?fq=section_name:("obituaries") AND subject:("Coronavirus (2019-nCoV)")&sort=oldest&page=';
let keyQ = '&api-key=' + key;

let covidURL = 'https://api.covidtracking.com/v1/us/daily.json';

let getCMD = url + query + keyQ;

console.log(getCMD);

let candles = [];

const OCCUPATIONS = {
  aviation: "https://i.imgur.com/eTHCCwn.png",
  art: "https://i.imgur.com/wK6PjWu.png",
  business: "https://i.imgur.com/nz0Y5fX.png",
  education: "https://i.imgur.com/Q67WbQG.png",
  media: "https://i.imgur.com/Mg75pli.png",
  medical: "https://i.imgur.com/N2QFRsF.png",
  service: "https://i.imgur.com/yAUNJZa.png",
  technology: "https://i.imgur.com/6222Qav.png",
  law: "https://i.imgur.com/9jHFSHn.png",
  religion: "http://img1.wikia.nocookie.net/__cb20091122220338/bionicle/es/images/c/ce/Takanuva_%29.jpg",
  x: "http://images2.wikia.nocookie.net/__cb20110228194246/random-ness/images/a/a8/Clipart_21.gif"
};
const OCCUPATION_KEYS = {
  aviation: [
    "pilot",
    "steward",
    "stewardess",
    "airplane",
    "plane",
    "helicopter",
    "astronaut",
    "space",
    "nasa"
  ],
  art: [
    "artist",
    "art",
    "sculptor",
    "painter",
    "maker",
    "designer",
    "architect",
    "creator",
    "sculpture",
    "painting"
  ],
  business: [
    "finance",
    "business",
    "businessperson",
    "founder",
    "businessman",
    "businesswoman",
    "banker",
    "bank",
    "mogul"
  ],
  education: [
    "teacher",
    "professor",
    "headmaster",
    "educator",
    "education",
    "school",
    "college",
    "university",
    "coach"
  ],
  media: [
    "singer",
    "dance",
    "filmmaker",
    "actor",
    "editor",
    "director",
    "camera",
    "movie",
    "music",
    "song",
    "video",
    "film",
    "emmy",
    "grammy",
    "tony",
    "academy award",
    "game",
    "model",
    "fashion",
    "soccer",
    "football",
    "basketball",
    "olympics",
    "swim",
    "horse",
    "baseball",
    "cricket",
    "sport",
    "tv",
    "show",
    "broadway",
    "comedy",
    "comedian",
    "comedienne",
    "entertainer",
    "clown",
    "humor"
  ],
  medical: [
    "medicine",
    "doctor",
    "hospital",
    "surgeon",
    "cure",
    "medical",
    "clinic",
    "pharmacist",
    "therapist",
    "dentist",
    "psychiatrist",
    "psychologist",
    "drug",
    "treatment",
    "physician",
    "nurse"
  ],
  service: [
    "waiter",
    "waitress",
    "cashier",
    "custodian",
    "janitor",
    "server",
    "delivery",
    "chef",
    "cook",
    "food",
    "hospitality",
    "teller",
    "plumber",
    "mechanic",
    "electrician"
  ],
  technology: [
    "researcher",
    "inventor",
    "scientist",
    "computer",
    "algorithm",
    "technology",
    "nobel prize",
    "computer",
    "system"
  ],
  law: [
    "lawyer",
    "judge",
    "politician",
    "police",
    "president",
    "senator",
    "representative",
    "congress",
    "law",
    "attorney",
    "justice",
    "political",
    "activist",
    "mayor",
    "delegate",
    "ambassador",
    "secretery",
    "legislation",
    "legislator",
    "legislature",
    "parliament",
    "embassy",
    "statesman",
    "stateswoman"
  ],
  religion: [
    "priest",
    "pastor",
    "church",
    "temple",
    "imam",
    "rabbi",
    "religious",
    "monk",
    "missionary",
    "judaism",
    "christianity",
    "islam",
    "buddhism",
    "bible",
    "god",
    "prophet",
    "hinduism",
    "sikh",
    "nun",
    "catholic",
    "evangelical",
    "orthodox",
    "faith",
    "preacher",
    "minister"
  ],
  x: []
}

let occupationImages = {};

const SHELF_MARGIN = 35;
const UPPER_SHELF_Y = 1.0/2.0;
const LOWER_SHELF_Y = 1.0;

const NUM_CANDLES = 20;
const CANDLES_PER_ROW = 10;
const CANDLE_WIDTH = 100;
const DATE_HEIGHT = 10;
const MARK_HEIGHT = 60;
const MARK_WIDTH = 60;
const RIBBON_HEIGHT = 100;
const RIBBON_WIDTH = 100;
const WICK_LENGTH = 15;
const CANDLE_HEIGHT_MIN = 120;
const CANDLE_HEIGHT_MAX = 260;

const NUM_STARS = 25;
const STAR_RADIUS = [5,10];
const STAR_POINTS = [4,12];

const CARD_CANDLE_WIDTH = CANDLE_WIDTH * 1.5;
const CARD_CANDLE_HEIGHT_MIN = CANDLE_HEIGHT_MIN * 1.5;
const CARD_CANDLE_HEIGHT_MAX = CANDLE_HEIGHT_MAX * 1.5;
const CARD_DATE_HEIGHT = DATE_HEIGHT * 1.5;
const CARD_MARK_HEIGHT = MARK_HEIGHT * 1.5;
const CARD_MARK_WIDTH = MARK_WIDTH * 1.5;
const CARD_RIBBON_HEIGHT = RIBBON_HEIGHT * 1.5;
const CARD_RIBBON_WIDTH = RIBBON_WIDTH * 1.5;
const CARD_WICK_LENGTH = WICK_LENGTH * 1.5;

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
let mon;

let deaths;

let obitRes;
let covidRes;

let allObits;

/*
 * Makes an API request with the given URL (url)
 */
function getReq(url) {
  let http = new XMLHttpRequest();
  http.open("GET", url, false);
  http.send(null);
  return http.responseText;
}

/*
 * Extracts the person out of a given article (a)
 */
function findPerson(a) {
  let k = a.keywords;
  for (let i = 0; i < k.length; i++) {
    if (k[i].name == "persons") {
      return k[i].value;
    }
  }
  return null;
}

/*
 * Extracts the name out of the given article (a)
 */
function findName(a) {
  let p = findPerson(a);

  if (p != null) {
    let i = p.indexOf(',');
    let j = p.indexOf('(');
    return p.substring(i + 2, j) + p.substring(0,i);
  }

  //let h = a.headline.main;
  //let i = h.indexOf(',');
  //return h.substring(0,i);
  return null;
}

/*
 * Extracts the age out of the given article (a)
 */
function findAge(a) {
  let h = a.headline.main;

  let age = h.match(/\d+/);

  if (age == "" || age == null || age == NaN || age == undefined) {
    let p = findPerson(a);
    let i = p != null ? p.indexOf('(') : null;
    let j = p != null ? p.indexOf('-') : null;
    let k = p != null ? p.indexOf(')') : null;

    if (p != null && i > -1 && j > i && k > j
        && Number(p.substring(j+1, k)) != NaN
        && Number(p.substring(i+1, j)) != NaN) {
      age = Number(p.substring(j+1, k)) - Number(p.substring(i+1, j));
    } else {
      age = 72; //If can't determine age, assume average life expectency
    }
  }

  return age;
}

/*
 * Checks if the given article (a) contains the given subject keyword (w)
 */
function containsSubject(a,w) {
  for (let i = 0; i < a.keywords.length; i++) {
    if (a.keywords[i].name == "subject"
        && a.keywords[i].value.toLowerCase().includes(w)) {
      return true;
    }
  }
  return false;
}

/*
 * Extracts the occupation from the given article (a)
 */
function findOcptn(a) {
  for (let i = 0; i < Object.keys(OCCUPATIONS).length; i++) {
    let o = Object.keys(OCCUPATIONS)[i];
    if (o == 'x') {
      return 'x';
    }
    for (let j = 0; j < OCCUPATION_KEYS[o].length; j++) {
      let w = OCCUPATION_KEYS[o][j];
      if (a.headline.main.toLowerCase().includes(w)
          || a['abstract'].toLowerCase().includes(w)
          || containsSubject(a,w)) {
        return o;
      }
    }
  }
}

/*
 * Extracts the geo location from the keywords (a)
 */
function findGeo(a) {
  let k = a.keywords;
  for (let i = 0; i < k.length; i++) {
    if (k[i].name == "glocations") {
      return k[i].value;
    }
  }
  return null;
}

/*
 * Pulls obituaries
 */
function pullObits() {
  let response = JSON.parse(getReq(url + query + 0 + keyQ));
  this.obitRes = response.response;

  let numPages = Math.floor(Number(response.response.meta.hits) / 10);

  for (let i = 1; i <= numPages; i++) {
    let prom = new Promise(function(resolve,reject) {
      setTimeout(function() { resolve(i); }, Math.floor(i / 9) * 60000);
    });

    prom.then(function(i) {
      console.log(url + query + i + keyQ);

      let req = JSON.parse(getReq(url + query + i + keyQ));
      console.log(req);

      this.obitRes.docs = this.obitRes.docs
        .concat(req.response.docs);
      if (i == numPages - 1) this.allObits = 0;
    });
  }
}

/*
 * Makes the candles based on the given obit response (rs).
 */
function makeCandles(rs) {
  const OFFSET_UNIT = (width - SHELF_MARGIN * 2) / (CANDLES_PER_ROW + 1);
  const CANDLE_START = SHELF_MARGIN + OFFSET_UNIT;

  let candles = [];

  let monthStart = 0;
  let thisMonth = "";

  for (let i = 0; i < rs.docs.length; i++) {
    let r = rs.docs[i];

    console.log("r[" + i + "]");
    console.log(r);

    let name = findName(r);
    if (name != null) {
      if(thisMonth != r.pub_date.substring(0,7)) {
        monthStart = 0;
        thisMonth = r.pub_date.substring(0,7);
      } else {
        monthStart++;
      }

      let age = findAge(r);
      let ocptn = findOcptn(r);
      let geo = findGeo(r);
      let candle = {
        name: name,
        age: age,
        ocptn: ocptn,
        loc: {
          x: CANDLE_START + OFFSET_UNIT * ((monthStart) % CANDLES_PER_ROW),
          y: (height - SHELF_MARGIN)
            * (monthStart < CANDLES_PER_ROW ? UPPER_SHELF_Y : LOWER_SHELF_Y)
        },
        height: (age / 100.0)
          * (CANDLE_HEIGHT_MAX - CANDLE_HEIGHT_MIN)
          + CANDLE_HEIGHT_MIN,
        headline: r.headline,
        content: r['abstract'],
        date: r.pub_date.substring(0,10),
        geo: geo,
        url: r.web_url
      };
      candles.push(candle);
    }
  }

  this.candles = candles;
  console.log("candles:");
  console.log(this.candles);
}

/*
 * Pull the Covid Data
 */
function pullCovid() {
  this.covidRes = JSON.parse(getReq(covidURL));
}

/*
 * Makes the covid death data based on the covid data response (rs)
 */
function makeCovid(rs) {
  let response = rs;
  let deaths = [];
  let deathMax = 0;
  let deathMin = Number.MAX_SAFE_INTEGER;

  for (let i = response.length - 1; i >= 0; i--) {
    let death = {
      date: response[i].date,
      inc: response[i].deathIncrease,
      total: response[i].death
    };
    deaths.push(death);
  }

  deaths = deathsByMonth(deaths);

  for (let i = 0; i < deaths.length; i++) {
    if (deathMax < deaths[i].inc) {
      deathMax = deaths[i].inc;
    }
    if (deathMin > deaths[i].inc) {
      deathMin = deaths[i].inc;
    }
  }

  let xOffset = (width - SHELF_MARGIN * 2) / (deaths.length - 1);
  let yOffset = (height - SHELF_MARGIN * 2) / (deathMax - deathMin);

  for (let i = 0; i < deaths.length; i++) {
    deaths[i].loc = {
      x: SHELF_MARGIN + xOffset * i,
      y: height - SHELF_MARGIN  - yOffset * deaths[i].inc
    };
    deaths[i].star = {
      r: Math.random() * (STAR_RADIUS[1] - STAR_RADIUS[0])
        + STAR_RADIUS[0],
      n: map(Math.floor(Math.random() * 9),
             0, 9,
             STAR_POINTS[0], STAR_POINTS[1])
    }
  }

  this.deaths = deaths;
  console.log("deaths: ");
  console.log(this.deaths);
}

/*
 * Given the number of deaths by day (d), returns the number of deaths by month
 */
function deathsByMonth(d) {
  let deaths = [];

  for (let i = 0; i < d.length; i++) {
    if (deaths.length == 0
        || deaths[deaths.length - 1].date != Math.floor(d[i].date / 100)) {
      let death = d[i];
      death.date = Math.floor(d[i].date / 100);
      deaths.push(death);
    } else {
      let death = deaths[deaths.length - 1];
      death.inc += d[i].inc;
      death.total = d[i].total;
      deaths[deaths.length - 1] = death;
    }
  }

  return deaths;
}

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
function drawStar(x,y,r,n,c) {
  noStroke();
  fill(c);
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
    drawStar(s.x, s.y, s.r, s.n, this.starColor);
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
  //console.log(this.stars);
}

/*
 * Draws the mark for the given occupation (o) at the given x and y positions
 * Assigns certain variables based on card mode (m).
 */
function drawMark(o,x,y,m) {
  let markWidth = m < 0 ? MARK_WIDTH : CARD_MARK_WIDTH;
  let markHeight = m < 0 ? MARK_HEIGHT : CARD_MARK_HEIGHT;

  imageMode(CENTER);
  image(this.occupationImages[o], x, y - markHeight*2, markHeight, markWidth);
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
 * Draws all the candles in the frame for the given month (m).
 */
function drawCandles(m) {
  let drawnCandles = 0;
  for (let i = 0;  i < this.candles.length; i++) {
    if (drawnCandles >= NUM_CANDLES) break;

    let date = this.candles[i].date;
    let mon = Number(date.substring(0,4)) * 100 + Number(date.substring(5,7));

    if (mon == m) {
      drawCandle(this.candles[i],-1);
      drawnCandles++;
    } else if (mon > m) break;
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
 * Draws a graph of covid deaths
 */
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

  for(let i = 0; i < this.deaths.length; i++) {
    let d = this.deaths[i];
    drawStar(d.loc.x, d.loc.y, d.star.r, d.star.n, this.starColor);
  }
}

/*
 * Given a death (d), draws a label
 */
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

/*
 * Checks proximity of mouse pointer to each COVID data point and highlights
 * those in range.
 */
function highlightCovid() {
  let mX = mouseX;
  let mY = mouseY;

  for(let i = 0; i < this.deaths.length; i++) {
    let d = this.deaths[i];
    const R = 4;
    if (mX < d.loc.x + R && mX > d.loc.x - R
        && mY < d.loc.y + R && mY > d.loc.y - R) {
      noStroke();
      fill(this.flameColor[0]);
      drawStar(d.loc.x, d.loc.y, d.star.r * 2, d.star.n, this.flameColor[4]);
      deathLabel(d);
    }
  }
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
                            + (this.CANDLE_CARD[1].x - this.CANDLE_CARD[0].x)
                            / 2,
                            (this.CANDLE_CARD[1].y) - CARD_MARGIN,
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
 * p5 preload function. Preloads all the pngs.
 */
function preload() {
  this.allObits = -1;
  this.occupationImages = {
    aviation: loadImage(OCCUPATIONS.aviation),
    art: loadImage(OCCUPATIONS.art),
    business: loadImage(OCCUPATIONS.business),
    education: loadImage(OCCUPATIONS.education),
    media: loadImage(OCCUPATIONS.media),
    medical: loadImage(OCCUPATIONS.medical),
    service: loadImage(OCCUPATIONS.service),
    technology: loadImage(OCCUPATIONS.technology),
    law: loadImage(OCCUPATIONS.law),
    religion: loadImage(OCCUPATIONS.religion),
    x: loadImage(OCCUPATIONS.x)
  };
  pullObits();
  pullCovid();
}

/*
 * p5 setup function. Called once on instantiation of canvas.
 */
function setup() {
  createCanvas(windowWidth, windowHeight);

  this.card = -2;
  this.mon = 0;

  setColors();
  angleMode(DEGREES);
  createStars(NUM_STARS);
  setFrames();
}

/*
 * p5 draw function. Called on canvas update (30hz).
 */
function draw() {
  if (this.allObits == 0) {
    makeCandles(this.obitRes);
    makeCovid(this.covidRes);
    this.allObits = 1;
  } else if (this.allObits > 0) {
    background(this.bkgColor);

    drawStars();

    if (this.card == -1) {
      drawShelf((height - SHELF_MARGIN) * LOWER_SHELF_Y);
      drawShelf((height - SHELF_MARGIN) * UPPER_SHELF_Y);
      drawCandles(this.mon);
      highlightCovid();
      drawBackArrow(this.card);
    } else if (this.card < -1) {
      drawShelf((height - SHELF_MARGIN));
      drawCovid();
      highlightCovid();
    } else {
      drawCard(this.card);
    }
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

  if (this.card == -1) {
    if (mX < this.BACK_BUTTON[1].x && mX > this.BACK_BUTTON[0].x
        && mY < this.BACK_BUTTON[1].y && mY > this.BACK_BUTTON[0].y) {
      this.card = -2;
      this.mon = 0;
      console.log('card: ' + this.card);
    }
    let drawnCandles = 0;
    for (let i = 0;  i < this.candles.length; i++) {
      if (drawnCandles >= NUM_CANDLES) break;

      let date = this.candles[i].date;
      let mon = Number(date.substring(0,4)) * 100 + Number(date.substring(5,7));

      if (this.mon == mon) {
        drawnCandles++;
      }
      if (this.mon == mon
          && mX < this.candles[i].loc.x + CANDLE_WIDTH / 2
          && mX > this.candles[i].loc.x - CANDLE_WIDTH / 2
          && mY < this.candles[i].loc.y
          && mY > this.candles[i].loc.y - this.candles[i].height) {
        this.card = i;
        console.log('card: ' + this.card);
      } else if (mon > this.mon) break;
    }
  } else if (this.card < -1) {
    for(let i = 0; i < this.deaths.length; i++) {
      let d = this.deaths[i];
      const R = 4;
      if (mX < d.loc.x + R && mX > d.loc.x - R
          && mY < d.loc.y + R && mY > d.loc.y - R) {
        this.card = -1;
        this.mon = this.deaths[i].date;
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
