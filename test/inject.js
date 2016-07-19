/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('inject', function () {
  it('with suffix', function(done) {
    var input = {
			"content": {
				"name" : "Lorem",
				"role": "Ipsum"
			}
		}
    var stylesheet = {
				"person" : {
					"login<" : {
						"get" : "content.name",
						"upcase" : true
					},
					"passwd<" : {
						"get" : "content.role",
						"upcase" : true
					},
					"title" : "efedalo"
        }
      };
      JBJ.inject(stylesheet, input, function(error, output) {
        console.log('output', error instanceof Error, error, output);
        assert.equal(error instanceof Error, false);
        assert.equal(output.person.login, "LOREM");
        assert.equal(output.person.passwd, "IPSUM");
        assert.equal(output.person.title, "efedalo");
        done();
      });
    });


    it('with prefix', function(done) {
    var input = {
			"content": {
				"name" : "Lorem",
				"role": "Ipsum"
			}
		}
    var stylesheet = {
				"person" : {
					"login<" : {
						"get" : "content.name",
						"upcase" : true
          },
          "title" : "efedalo",
          "<get" : "login",
          "<upcase" : true,
        }
      };
      JBJ.inject(stylesheet, input, function(error, output) {
        console.log('output', error instanceof Error, error, output);
        assert.equal(error instanceof Error, false);
        assert.equal(output.person, "LOREM");
        done();
      });
    });

    it('with no input', function(done) {
    var input = {
		}
    var stylesheet = {
      "<set" : {
        "name" : "Lorem",
        "role": "Ipsum"
      },
      "<get" : "name",
      "<upcase" : true,
    };
      JBJ.inject(stylesheet, function(error, output) {
        console.log('output', error instanceof Error, error, output);
        assert.equal(error instanceof Error, false);
        assert.equal(output, "LOREM");
        done();
      });
    });



  });
