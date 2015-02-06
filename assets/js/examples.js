var examples = {
  "Basic": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "capitalize": {
      "get": "a.b.c",
      "capitalize" : null
    },
    "upcase": {
      "get": "a.b.c",
      "upcase" : null
    },
    "downcase": {
      "get": "a.b.c",
      "upcase" : null,
      "downcase" : null
    },
    "first": {
      "get": "a.d",
      "first" : null
    },
    "last": {
      "get": "a.d",
      "last" : null
    },
    "sort": {
      "get": "a.d",
      "sort" : null,
      "first" : null
    },
    "length": {
      "get": "a.d",
      "length" : null,
    },
    "plus": {
      "get": "a.e",
      "plus" : 3,
    },
    "minus": {
      "get": "a.e",
      "minus" : 2
    },
    "times":{
      "get": "a.e",
      "times" : 2
    },
    "dividedBy": {
      "get": "a.e",
      "times" : 2,
      "dividedBy" : 3
    },
    "join": {
      "get": "a.d",
      "join" : "/"
    },
    "truncate": {
      "get": "a.d",
      "join" : "/",
      "truncate": 3
    },
    "truncateWords": {
      "get": "a.d",
      "join" : " ",
      "truncateWords": 2
    },
    "prepend": {
      "get": "a.e",
      "cast" : "string",
      "prepend": "#"
    },
    "append": {
      "get": "a.d",
      "join" : "/",
      "truncate": 3,
      "append": "..."
    }
  }
};

var inputArea = document.getElementById('input');
var stylesheetArea = document.getElementById('stylesheet');
var outputArea = document.getElementById('output');

var showExample = function showExample(e) {
  var exampleName = e.toElement.textContent;
  var difficulty  = exampleName.split(':')[0];
  var subName     = exampleName.split(':')[1].trim();
  var input       = examples[difficulty].input;
  var stylesheet  = examples[difficulty][subName];
  var result      = JBJ.renderSync(stylesheet, input);
  inputArea.value = JSON.stringify(input,null,"\t");
  stylesheetArea.value = JSON.stringify(stylesheet,null,"\t");
  outputArea.value = JSON.stringify(result,null,"\t");
};

var examplesList = document.getElementsByClassName('example');
var examplesLen  = examplesList.length;
for (var e = 0; e < examplesLen; e++) {
  var example     = examplesList[e];
  var exampleName = example.textContent;
  example.addEventListener('click', showExample);
}
