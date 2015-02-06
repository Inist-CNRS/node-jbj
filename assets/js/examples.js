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
    },
    "shift": {
      "get": "a.d",
      "join" : "/",
      "truncate": 3,
      "shift": 2
    },
    "replace": {
      "get": "a.d",
      "join" : "/",
      "replace": "/"
    },
    "replace 2": {
      "get": "a.d",
      "join" : "/",
      "replace": ["/", "|"]
    },
    "mapping": {
      "get" : "a.b.c",
      "mapping" : {
        "value" : 1
      }
    },
    "mapping 2": {
      "set" : 1,
      "mapping" : ['a','b','c']
    },
    "min": {
      "set" : [2, 4,1,7, 9,3],
      "min" : true
    },
    "max": {
      "set" : [2, 4, 1, 7, 9, 3],
      "max" : true
    },
    "min obj": {
      "set" : {a: 9, b: 4, c: 3, d: 5},
      "min" : true
    },
    "flatten": {
      "set"     : [ ['a', 'b'], ['c', 'd'], 'e'],
      "flatten" : true
    },
    "deduplicate": {
      "set"         : [ 1, 2, 3, 1, 2],
      "deduplicate" : true
    }
  },
  "Compute": {
    "input": {
      "a" : 20,
      "b" : 3,
      "c" : 5,
      "d" : 8
    },
    "round": {
      "$e" : {
        "compute": "round(a / b)",
        "cast": "number"
      }
    },
    "round this": {
      "$e" : {
        "compute#1": "a / b",
        "compute#2": "round(this)",
        "cast": "number"
      }
    },
    "variables": {
      "$x" : {
        "compute#1": "a / b",
        "compute#2": "round(this)",
        "cast": "number"
      },
      "$y" : {
        "path": "b",
        "cast": "number"
      },
      "$z" : {
        "compute": "x + y",
      }
    }
  },
  "CSV": {
    "input": {
      "a" : {
        "b" : ["x","y","z"],
        "d" : null
      }
    },
    "output": {
      "$e" : {
        "find#0": "a",
        "mask": "b",
        "find#1": "b",
        "csv" : ",",
        "trim": true
      }
    },
    "parseCSV": {
      "find": "a.b",
      "csv" : ",",
      "parseCSV": ","
    }
  },
  "Find": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "find": {
      "find" : "a.b.c"
    },
    "find 2": {
      "find" : "a",
      "find#1" : "b.c"
    },
    "find 3": {
      "find#0" : "a",
      "find#1" : "b",
      "find#2" : "c"
    },
    "coalesce": {
      "find" : ["x", "x.y", "a.b.c"],
      "coalesce" : true
    },
    "order": {
      "$x.y" : {
        "find" : ["x.y", "a.b.c"],
        "coalesce" : true,
        "upcase" : true
      },
      "$x.z" : {
        "find" : ["x.y", "a.b.c"],
        "first" : true
      }
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
  inputArea.value = JSON.stringify(input,null,"\t");
  stylesheetArea.value = JSON.stringify(stylesheet,null,"\t");
  var result      = JBJ.renderSync(stylesheet, input);
  outputArea.value = JSON.stringify(result,null,"\t");
};

var examplesList = document.getElementsByClassName('example');
var examplesLen  = examplesList.length;
for (var e = 0; e < examplesLen; e++) {
  var example     = examplesList[e];
  var exampleName = example.textContent;
  example.addEventListener('click', showExample);
}
