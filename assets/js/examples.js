var examples = {
  capitalize : {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.b.c",
      "capitalize" : true
    }
  },
  upcase: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.b.c",
      "upcase" : true
    }
  },
  downcase: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.b.c",
      "upcase" : true,
      "downcase" : true
    }
  },
  first: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "first" : true
    }
  },
  last: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "last" : true
    }
  },
  sort: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "sort" : true,
      "first": true
    }
  },
  "sort 2": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "sort" : true
    }
  },
  length: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "length" : true
    }
  },
  plus: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.e",
      "plus" : 3
    }
  },
  minus: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.e",
      "minus" : 2
    }
  },
  times: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.e",
      "times" : 2
    }
  },
  dividedBy: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.e",
      "times" : 2,
      "dividedBy": 3
    }
  },
  join: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "join" : "/"
    }
  },
  truncate: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "join" : "/",
      "truncate": 3
    }
  },
  truncateWords: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "join" : " ",
      "truncateWords": 2
    }
  },
  prepend: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.e",
      "cast" : "string",
      "prepend": "#"
    }
  },
  append: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "join": "/",
      "truncate" : 3,
      "append": "..."
    }
  },
  shift: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "join": "/",
      "truncate" : 3,
      "shift": 2
    }
  },
  replace: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "join" : "/",
      "replace": "/"
    }
  },
  "replace 2": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get": "a.d",
      "join" : "/",
      "replace": ["/", "|"]
    }
  },
  mapping: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : ['C', 'B', 'A'],
        "e" : 3
      }
    },
    "stylesheet": {
      "get" : "a.b.c",
      "mapping" : {
        "value" : 1
      }
    }
  },
  "mapping 2": {
    "input": 1,
    "stylesheet": {
      "mapping" : ['a','b','c']
    }
  },
  "mapping 3": {
    "input": [1, 2],
    "stylesheet": {
      "mapping" : ['a','b','c']
    }
  },
  "mapping 4": {
    "input": ["a", "b"],
    "stylesheet": {
      "mapping": {
        "a": "Aha!",
        "b": "Baby"
      }
    }
  },
  mappingVar: {
    "input": {
      "arg": { "a": "Aha!", "b": "Baby"},
      "input": "a"
    },
    "stylesheet": {
      "mappingVar": ["input","arg"]
    }
  },
  min: {
    "input": [2, 4, 1, 7, 9, 3],
    "stylesheet": {
      "min" : true
    }
  },
  max: {
    "input": [2, 4, 1, 7, 9, 3],
    "stylesheet": {
      "max" : true
    }
  },
  "min obj": {
    "input": {a: 9, b: 4, c: 3, d: 5},
    "stylesheet": {
      "min" : true
    }
  },
  flatten: {
    "input": [ ['a', 'b'], ['c', 'd'], 'e'],
    "stylesheet": {
      "flatten" : true
    }
  },
  deduplicate: {
    "input": [ 1, 2, 3, 1, 2],
    "stylesheet": {
      "deduplicate" : true
    }
  },
  "remove integer": {
    "input": [ 1, 2, 3],
    "stylesheet": {
      "remove" : 2
    }
  },
  "remove empty": {
    "input": [ "a", "", "b"],
    "stylesheet": {
      "remove" : ""
    }
  },
  "remove string": {
    "input": [ "a", "b", "c"],
    "stylesheet": {
      "remove" : "b"
    }
  },
  "remove multiple": {
    "input": [ "a", "b", "c", ""],
    "stylesheet": {
      "remove#1" : "",
      "remove#2" : "b"
    }
  },
  "getindex array": {
    "input": [ "a", "b", "c"],
    "stylesheet": {
      "getindex" : 2
    }
  },
  "getproperty object": {
    "input": { "a": 0, "b": 1, "c":2 },
    "stylesheet": {
      "getproperty": "b"
    }
  },
  "getindexvar array": {
    "input": {
      "i": 1,
      "t": ["a","b","c"]
    },
    "stylesheet": {
      "getIndexVar": ["t", "i"]
    }
  },
  "getpropertyvar object": {
    "input": {
      "i" : "b",
      "o" : { "a": 0, "b": 1, "c":2 },
    },
    "stylesheet": {
      "getPropertyVar": ["o", "i"]
    }
  },
  "array2object 1": {
    "input": [
      {
        "_id": "2007",
        "value": 538
      }, {
        "_id": "2008",
        "value": 577
      }, {
        "_id": "2009",
        "value": 611
    }],
    "stylesheet": {
      "array2object": true
    }
  },
  "array2object 2": {
    "input": [
      {
        "key": "2007",
        "val": 538
      }, {
        "key": "2008",
        "val": 577
      }, {
        "key": "2009",
        "val": 611
    }],
    "stylesheet": {
      "array2object": ["key","val"]
    }
  },
  "arrays2objects 1": {
    "input": [ [ "Afghanistan", "AFG" ],
               [ "Aland Islands", "ALA" ] ],
    "stylesheet": {
      "arrays2objects": true
    }
  },
  "arrays2objects 2": {
    "input": [ [ "Afghanistan", "AFG" ],
               [ "Aland Islands", "ALA" ] ],
    "stylesheet": {
      "arrays2objects": ["key","val"]
    }
  },
  zip: {
    "input": {
      "array1": [{"_id": "1", "value": 1},  {"_id": "2", "value": 2}],
      "array2": [{"_id": "1", "value": 10}, {"_id": "2", "value": 20}]
    },
    "stylesheet": {
      "zip": ["array1","array2"]
    }
  },
  round: {
    "input": {
      "a" : 20,
      "b" : 3
    },
    "stylesheet": {
      "compute": "round(a / b)"
    }
  },
  "round this": {
    "input": {
      "a" : 20,
      "b" : 3
    },
    "stylesheet": {
      "compute#1": "a / b",
      "compute#2": "round(this)"
    }
  },
  "variables ($)": {
    "input": {
      "a" : 20,
      "b" : 3
    },
    "stylesheet": {
      "$x" : {
        "compute#1": "a / b",
        "compute#2": "round(this)"
      },
      "$y" : {
        "path": "b"
      },
      "$z" : {
        "compute": "x + y",
      }
    }
  },
  csv: {
    "input": {
      "a" : {
        "b" : ["x","y","z"],
        "d" : null
      }
    },
    "stylesheet": {
      "$e" : {
        "find#0": "a",
        "mask": "b",
        "find#1": "b",
        "csv" : ",",
        "trim": true
      }
    }
  },
  parseCSV: {
    "input": {
      "a" : {
        "b" : ["x","y","z"],
        "d" : null
      }
    },
    "stylesheet": {
      "find": "a.b",
      "csv" : ",",
      "parseCSV": ","
    }
  },
  parseCSVFile: {
    "input": "\"Afghanistan\";\"AFG\"\n\"Aland Islands\";\"ALA\"",
    "stylesheet": { "parseCSVFile": ";" }
  },
  find: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "find" : "a.b.c"
    }
  },
  "find 2": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "find" : "a",
      "find#1" : "b.c"
    }
  },
  "find 3": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "find#0" : "a",
      "find#1" : "b",
      "find#2" : "c"
    }
  },
  coalesce: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "find" : ["x", "x.y", "a.b.c"],
      "coalesce" : true
    }
  },
  order: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
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
  },
  "foreach object": {
    "input": {
      "a" : {
        "b" : "x",
        "c" : "y",
        "d" : "z"
      }
    },
    "stylesheet":{
      "get" : "a",
      "foreach" : {
        "upcase" : true
      }
    }
  },
  "foreach array": {
    "input": {
      "a" : [
        { "b" : "x" },
        { "b" : "y" },
        { "b" : "z" }
      ]
    },
    "stylesheet":{
      "get" : "a",
      "foreach" : {
        "find": "b",
        "upcase" : true
      }
    }
  },
  "Foreach apply array": {
    "input": {
      "a" : [
        { "b" : "x", "c" : 0 },
        { "b" : "y", "c" : 1 },
        { "b" : "z", "c" : 2 }
      ]
    },
    "stylesheet": {
      "get" : "a",
      "foreach" : {
        "$b" : {
          "find": "b",
          "upcase" : true
        }
      }
    }
  },
  "JSON output": {
    "input": {
      "a" : {
        "b" : ["x","y","z"],
        "d" : null
      }
    },
    "stylesheet": {
      "$e" : {
        "find#0": "a",
        "mask": "b",
        "find#1": "b",
        "json" : ",",
      }
    }
  },
  parseJSON: {
    "input": {
      "a" : {
        "b" : ["x","y","z"],
        "d" : null
      }
    },
    "stylesheet": {
      "find": "a.b",
      "json" : true,
      "parseJSON": true
    }
  },
  mask: {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$a" : {
        "find": "a",
        "mask" : "b"
      }
    }
  },
  "find cast": {
    "input": {
      "a" : {
        "b" : {
          "c" : "1234"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$a" : {
        "find": "a.b.c",
        "cast" : "number"
      }
    }
  },
  "find default": {
    "input": {
      "a" : {
        "b" : {
          "c" : "1234"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$a" : {
        "find": "a.b.d",
        "default": "truc"
      }
    }
  },
  unjson: {
    "input": {
      "a" : {
        "b" : {
          "c" : "1234"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$a" : {
        "find": "a.b.d",
        "default": '["truc", "bidule"]',
        "unjson": true
      }
    }
  },
  required: {
    "input": {
      "a" : {
        "b" : {
          "c" : "1234"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$a" : {
        "find": "a.b.d",
        "required": true
      }
    }
  },
  extendWith: {
    "input": {
      "a" : {
        "b" : {
          "c" : "1234"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "extendWith": {
        "a" : {
          "b" : {
            "cc" : "val1"
          },
          "d" : "val2"
        }
      }
    }
  },
  set: {
    "input": {
      "a" : {
        "b" : {
          "c" : "1234"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "set": {
        "a" : {
          "b" : "val1",
          "e" : "val2"
        }
      }
    }
  },
  "select first 1": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$$" : {
        "select" : ".a > .b > .c",
        "first": true
      }
    }
  },
  "select first 2": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$d.e.f" : {
        "select" : ".a > .b > .c",
        "first": true
      }
    }
  },
  "select first 3": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$$" : {
        "select" : ".a",
        "first": true,
        "select#1" : ".b > .c",
        "first#1": true
      }
    }
  },
  "select first 4": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "select" : ".a",
      "first": true,
      "select#1" : ".b > .c",
      "first#1": true
    }
  },
  "select first 5": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$d.e" : {
        "select" : ".a",
        "first": true,
        "select#1" : ".b > .c",
        "first#1": true
      }
    }
  },
  "select first 6": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$$" : {
        "select#0" : ".a",
        "first#0": true,
        "select#1" : ".b",
        "first#1": true,
        "select#2" : ".c",
        "first#2": true
      }
    }
  },
  "select first 7": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "select#0" : ".a",
      "first#0": true,
      "select#1" : ".b",
      "first#1": true,
      "select#2" : ".c",
      "first#2": true
    }
  },
  "select first 8": {
    "input": {
      "a" : {
        "b" : {
          "c" : "value"
        },
        "d" : null
      }
    },
    "stylesheet": {
      "$d" : {
        "select#0" : ".a",
        "first#0": true,
        "select#1" : ".b",
        "first#1": true,
        "select#2" : ".c",
        "first#2": true
      }
    }
  },
  "empty default": {
    "stylesheet": {
      "default" : {
        "a" : {
          "b" : [
            { "#text" : "1" },
            { "#text" : "2" },
            { "#text" : "3" }
          ]
        }
      },
      "select" : ".a > .b .#text"
    }
  },
  "template": {
    "input": {
      "a" : {
        "b" : {
          "c" : "1"
        },
        "d" : "2",
        "e" : "4"
      },
      "f": "8"
    },
    "stylesheet": {
      "$a" : {
        "template": "X{{a.b.c}}X{{a.d}}X{{a.e}}X{{f}}",
      }
    }
  },
  "parseXML": {
    "stylesheet": {
      "default": "<root><item xml:id=\"1\">A</item><item xml:id=\"2\">B</item><item xml:id=\"3\">C</item></root>",
      "parseXML" : {
        "specialChar": "#",
        "longTag" : true
      }
    }
  },
  "xml": {
    "input": {
      "root" : {
        "item" : [
          { "index" : "1", "$t" : "A"},
          { "index" : "2", "$t" : "B"},
          { "index" : "3", "$t" : "C"}
        ]
      }
    },
    "stylesheet": {
      "xml" : {
        "indent": false
      }
    }
  },
  "assert": {
    "input": {
      "val" : "unmodified",
      "a" : 1,
      "b" : "one"
    },
    "stylesheet": {
      "$val" : {
        "get" : "a",
        "assert": "this == 1",
        "set" : "if val"
      }
    }
  },
  "assert else" : {
    "input" : {
      "val" : "unmodified",
      "a" : 2,
      "b" : "one"
    },
    "stylesheet": {
      "$val#1" : {
        "assert": "a == 1",
        "set" : "if val"
      },
      "$val#2" : {
        "get" : "val",
        "default": "else val",
      }
    }
  },
  "sum": {
    "input": [1,2,3],
    "stylesheet": {
      "sum": true
    }
  },
  "substring month": {
    "input": "20150310",
    "stylesheet": {
      "substring": [4,2]
    }
  },
  "substring day": {
    "input": "20150310",
    "stylesheet": {
      "substring": [-2]
    }
  }
};

/**
 * Initialize Examples list
 * @param  {Object} examples Array of examples
 */
(function (examples) {
  var examplesUl = document.getElementById('examples-list');
  for (var example in examples) {
    var nExample = document.createElement('li');
    nExample.className = "example";
    var tExampleName = document.createTextNode(example);
    nExample.appendChild(tExampleName);
    examplesUl.appendChild(nExample);
  }
})(examples);

var inputArea      = document.getElementById('input');
var stylesheetArea = document.getElementById('stylesheet');
var outputArea     = document.getElementById('output');

var showExample = function showExample(e) {
  var exampleClicked = document.getElementsByClassName("exampleClicked");
  if(exampleClicked.length > 0){
    for(var i = 0 ; i < exampleClicked.length ; i++){
      exampleClicked[i].className = "example";
    }
  }
  e.target.className = e.target.className + " exampleClicked";

  var exampleName = e.target.textContent;
  var input       = examples[exampleName].input;
  var stylesheet  = examples[exampleName].stylesheet;
  inputEditor.set(input);
  stylesheetEditor.set(stylesheet);
  var result           = JBJ.renderSync(stylesheet, input);
  outputEditor.set(result);
};

var examplesList = document.getElementsByClassName('example');
var examplesLen  = examplesList.length;
for (var e = 0; e < examplesLen; e++) {
  var example     = examplesList[e];
  var exampleName = example.textContent;
  example.addEventListener('click', showExample);
}
