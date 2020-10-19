let url = 'https://api.nytimes.com/svc/search/v2/';
let query = 'articlesearch.json?fq=section_name:("obituaries")';
let keyQ = '&api-key=' + key;

let getCMD = url + query + keyQ;

console.log(getCMD);

let graves = [];

function getObits(url) {
    let http = new XMLHttpRequest();
    http.open("GET", url, false);
    http.send(null);
    return http.responseText;
}

function findName(h) {
    console.log(h);
    let i = h.indexOf(',');
    return h.substring(0,i);
}

function setup() {
    let response = JSON.parse(getObits(getCMD));
    console.log(response.response);
    for (let i = 0; i < response.response.docs.length; i++) {
        let r = response.response.docs[i];
        let grave = {
            name: findName(r.headline.main),
            loc: {
                x: Math.random() * windowWidth,
                y: Math.random() * windowHeight
            },
            headline: r.headline,
            content: r['abstract']
        };
        graves.push(grave);
    }
    console.log(graves);

    createCanvas(windowWidth, windowHeight);
}

function draw() {
    let mX = mouseX;
    let mY = mouseY;
    let hovering = -1;
    background(50);
    for (let i = 0; i < graves.length; i++) {
        textAlign(LEFT,TOP);
        textSize(32);

        let w = textWidth(graves[i].name);

        strokeWeight(3);
        stroke(255);
        fill(25,0,150);
        rect(graves[i].loc.x - 10, graves[i].loc.y - 10,
             w + 20, 52);

        noStroke();
        fill(255);
        text(graves[i].name, graves[i].loc.x, graves[i].loc.y);

        if (mX > graves[i].loc.x - 30 && mX < graves[i].loc.x + 30
            && mY > graves[i].loc.y - 30 && mY < graves[i].loc.y + 30) {
            hovering = i;
            console.log('hovering ' + i);
        }
    }

    if (hovering > -1) {
        textAlign(LEFT,TOP);
        textSize(16);

        let w = textWidth(graves[hovering].content);

        strokeWeight(3);
        stroke(255);
        fill(150,0,55);
        rect(graves[hovering].loc.x - 10, graves[hovering].loc.y - 10,
             w + 20, 36);

        noStroke();
        fill(255);
        text(graves[hovering].content,
             graves[hovering].loc.x,
             graves[hovering].loc.y);
    }
}
