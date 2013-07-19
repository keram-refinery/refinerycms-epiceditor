
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

    /**
     * Imports a file and it's contents and opens it
     * @param   {string} name The name of the file you want to import (will overwrite existing files!)
     * @param   {*} content Content of the file you want to import
     * @param   {string=} kind The kind of file you want to import (TBI)
     * @param   {Object=} meta Meta data you want to save with your file.
     * @returns {Object} EpicEditor will be returned
     */
    importFile: function (name, content, kind, meta) {},

    /**
     * Removes a page
     * @param   {string} name The name of the file you want to import (will overwrite existing files!)
     * @returns {Object} EpicEditor will be returned
     */
    remove: function (name) {},

    /**
     * @param {string} element
     */
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
