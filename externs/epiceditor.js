/**
 * @param {*} options
 * @constructor
 */
function EpicEditor (options) {

}

EpicEditor.prototype = {
    load: function () {},
    edit: function () {},
    reflow: function () {},
    importFile: function (name, content, kind, meta) {},
    remove: function (name) {},
    getElement: function (element) {},

    editorIframeDocument: {
        execCommand: {}
    }
};

var epiceditor_config = {
    'container': 'epiceditor',
    'textarea': null,
    'basePath': '../../',
    'clientSideStorage': true,
    'localStorageName': 'epiceditor',
    'useNativeFullscreen': true,
    'parser': null,
    'file': {},
    'theme': {},
    'button': {},
    'focusOnLoad': false,
    'shortcut': {},
    'string': {}
};

var marked = {
    "setOptions": function () {},
    "options": function () {},
    "defaults": {
        "gfm": {},
        "tables": {},
        "breaks": {},
        "pedantic": {},
        "sanitize": {},
        "silent": {},
        "highlight": function () {}
    },
    "Parser": function () {},
    "parser": function () {},
    "Lexer": function () {},
    "lexer": function () {},
    "InlineLexer": function () {},
    "inlineLexer": function () {},
    "parse": function () {}
}

var localStorage,
    module,
    define,
    global;
