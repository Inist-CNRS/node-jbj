/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define('ace/theme/jsoneditor', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-jsoneditor";
exports.cssText = ".ace-jsoneditor .ace_gutter {\
background: #555;\
color: #ddd\
}\
\
.ace-jsoneditor.ace_editor {\
font-family: droid sans mono, monospace, courier new, courier, sans-serif;\
line-height: 1.3;\
}\
.ace-jsoneditor .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-jsoneditor .ace_scroller {\
background-color: transparent\
}\
.ace-jsoneditor .ace_text-layer {\
color: #ecf0f1;\
}\
.ace-jsoneditor .ace_variable {\
color: #f1c40f;\
}\
.ace-jsoneditor .ace_cursor {\
border-left: 2px solid #fff\
}\
.ace-jsoneditor .ace_overwrite-cursors .ace_cursor {\
border-left: 0px;\
border-bottom: 1px solid #000000\
}\
.ace-jsoneditor .ace_marker-layer .ace_selection {\
background: #2c3e50\
}\
.ace-jsoneditor.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #FFFFFF;\
border-radius: 2px\
}\
.ace-jsoneditor .ace_marker-layer .ace_step {\
background: rgb(255, 255, 0)\
}\
.ace-jsoneditor .ace_marker-layer .ace_bracket {\
border: 1px solid #BFBFBF\
}\
.ace-jsoneditor .ace_marker-layer .ace_active-line {\
background: #64307A\
}\
.ace-jsoneditor .ace_gutter-active-line {\
background-color : #2c3e50\
}\
.ace-jsoneditor .ace_marker-layer .ace_selected-word {\
border: 1px solid #D5DDF6\
}\
.ace-jsoneditor .ace_invisible {\
color: blue\
}\
.ace-jsoneditor .ace_keyword,\
.ace-jsoneditor .ace_meta,\
.ace-jsoneditor .ace_support.ace_constant.ace_property-value {\
color: pink\
}\
.ace-jsoneditor .ace_keyword.ace_operator {\
color: pink\
}\
.ace-jsoneditor .ace_keyword.ace_other.ace_unit {\
color: pink\
}\
.ace-jsoneditor .ace_constant.ace_language {\
color: #3498db\
}\
.ace-jsoneditor .ace_constant.ace_numeric {\
color: #F00\
}\
.ace-jsoneditor .ace_constant.ace_character.ace_entity {\
color: #3498db\
}\
.ace-jsoneditor .ace_invalid {\
color: #000;\
background-color: #fff;\
}\
.ace-jsoneditor .ace_fold {\
background-color: #AF956F;\
border-color: #000000\
}\
.ace-jsoneditor .ace_storage,\
.ace-jsoneditor .ace_support.ace_class,\
.ace-jsoneditor .ace_support.ace_function,\
.ace-jsoneditor .ace_support.ace_other,\
.ace-jsoneditor .ace_support.ace_type {\
color: pink\
}\
.ace-jsoneditor .ace_string {\
color: #bdc3c7\
}\
.ace-jsoneditor .ace_comment {\
color: yellow\
}\
.ace-jsoneditor .ace_entity.ace_name.ace_tag,\
.ace-jsoneditor .ace_entity.ace_other.ace_attribute-name {\
color: green\
}\
.ace-jsoneditor .ace_markup.ace_underline {\
text-decoration: underline\
}\
.jsoneditor{\
width: 89%;\
height: 440px;\
border-radius: 15px;\
border: 4px solid #555\
}\
.jsoneditor div.outer{\
margin: 0!important;\
padding: 0px!important\
}\
.ace_error{\
background-image: none!important;\
background: red;\
color: black\
}\
.ace-jsoneditor .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
