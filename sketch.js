var database;

var drawing = [];
var currentPath = [];
var isDrawing = false;

function setup() {
  canvas = createCanvas(500, 500);

  canvas.mousePressed(startPath);
  canvas.parent('canvasBin');
  canvas.mouseReleased(endPath);

  var saveButton = select('#saveButton');
  saveButton.mousePressed(saveDrawing);

  var clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);

  var config = {
    apiKey: "AIzaSyBl6F4EjVCwYSK-hVME3yPB3HUrWffgK7M",
    authDomain: "canvasdrawing-d1b12.firebaseapp.com",
    databaseURL: "https://canvasdrawing-d1b12.firebaseio.com",
    projectId: "canvasdrawing-d1b12",
    storageBucket: "canvasdrawing-d1b12.appspot.com",
    messagingSenderId: "602947040577",
    appId: "1:602947040577:web:f5165526a0bda89c3addc0",
    measurementId: "G-QF1CEF926N"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  var params = getURLParams();
  console.log(params);

  if (params.id) {
    console.log(params.id);
    showDrawing(params.id);
  }

  var ref = database.ref('drawings');
  ref.on('value', gotData);
}

function draw() {
  background(0);

  if (isDrawing) {

    var point = {
      x: mouseX,
      y: mouseY
    };
    currentPath.push(point);

  }

  stroke(255);
  strokeWeight(4);
  noFill();

  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];

    beginShape();
    for (var j = 0; j < path.length; j++) {
      vertex(path[j].x, path[j].y);
    }
    endShape();

  }
}

function startPath() {
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
}
  
function endPath() {
    isDrawing = false;
}  

function saveDrawing() {
  var ref = database.ref('drawings');

  var data = {
    drawing: drawing
  };

  var result = ref.push(data, dataSent);
  console.log(result.key);

  function dataSent(err, status) {
  }
}

function gotData(data) {
  var selects = selectAll('.listing');

  for (var i = 0; i < selects.length; i++) {
    selects[i].remove();
  }

  var drawings = data.val();
  var keys = Object.keys(drawings);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    var li = createElement('li', '');
    li.class('listing');

    var refer = createA('#', key);
    refer.mousePressed(showDrawing);
    refer.parent(li);

    var perma = createA('?id=' + key, 'permalink');
    perma.parent(li);
    perma.style('padding', '4px');

    li.parent('drawinglist');
  }
}

function showDrawing(key) {
  if (key instanceof MouseEvent) {
    key = this.html();
  }

  var ref = database.ref('drawings/' + key);
  ref.once('value', oneDrawing);

  function oneDrawing(data) {
    var dbdrawing = data.val();
    drawing = dbdrawing.drawing;
  }
}

function clearDrawing() {
  drawing = [];
}