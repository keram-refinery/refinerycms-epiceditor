/*global EpicEditor, marked */
/*jslint sub: true */

(function () {

    'use strict';

    /**
     * @constructor
     * @class refinery.editor.EpicEditor
     * @expose
     * @extends {refinery.Object}
     */
    refinery.Object.create({

        name: 'EpicEditor',

        module: 'editor',

        /** @typedef {epiceditor_config} */
        options: {
            container: 'epiceditor',
            textarea: null,
            basePath: '/assets/refinery/epiceditor/',
            clientSideStorage: true,
            localStorageName: 'epiceditor',
            useNativeFullscreen: true,
            parser: marked,
            file: {
                'name': 'refinery',
                'defaultContent': '',
                'autoSave': false
            },
            theme: {
                'base':    'themes/base/epiceditor.css',
                'preview': 'themes/preview/refinery.css',
                'editor':  'themes/editor/refinery.css'
            },
            button: {
                'preview': true,
                'fullscreen': true
            },
            focusOnLoad: false,
            shortcut: {
                'modifier': 18,
                'fullscreen': 70,
                'preview': 80
            },
            string: {
                'togglePreview': t('refinery.editor.toggle_preview_mode'),
                'toggleEdit': t('refinery.editor.toggle_edit_mode'),
                'toggleFullscreen': t('refinery.editor.enter_fullscreen')
            }
        },


        /**
         * EpicEditor
         * @expose
         * @type {EpicEditor} EpicEditor
         */
        editor: null,

        /**
         * Insert string to EpicEditor
         * @param  {string} str
         * @return {undefined}
         */
        insert: function (str) {
            this.editor.edit();
            this.editor.editorIframeDocument.execCommand('insertText', false, str);
        },

        /**
         *
         * @return {undefined}
         */
        init_images_dialog: function () {
            var that = this,
                util_bar = that.util_bar,
                images_btn, images_dialog;

            images_btn = $('<button/>', {
                'title': t('refinery.editor.images_dialog_button_title'),
                'class': 'editor-images-dialog-btn refinery-btn'
            }).prependTo(util_bar);

            images_dialog = refinery('admin.ImagesDialog');

            images_btn.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                images_dialog.init().open();

                return false;
            });

            images_dialog.on('insert',
                /** @param {images_dialog_object} img */
                function (img) {
                    var tpl = '![%alt](%url)';

                    if (img.url) {
                        tpl = tpl.replace('%alt', /** @type {string} */(img.alt));
                        tpl = tpl.replace('%url', /** @type {string} */(img.url));
                        that.insert(tpl);
                    } else {
                        that.init_image_dialog(img.id);
                    }
                }
            );

            that.images_dialog = images_dialog;
        },

        init_image_dialog: function (image_id) {
            var that = this,
                dialog, buttons;


            buttons = [ {
                'text': 'Insert',
                'click': function () {
                    dialog.insert(dialog.holder);
                }
            }, {
                'text': 'Back to the library',
                'click': function () {
                    dialog.close();
                    that.images_dialog.open();
                }
            }];

            dialog = refinery('admin.ImageDialog', {
                    'image_id': image_id,
                    'buttons': buttons
                }).init();

            dialog.on('insert',
                /** @param {image_dialog_object} img */
                function (img) {
                    var tpl = '![%alt](%url)';

                    tpl = tpl.replace('%alt', img.alt);
                    tpl = tpl.replace('%url', img.sizes[img.size]);

                    that.insert(tpl);
                    dialog.destroy(true);
                }
            );

            dialog.open();
        },

        /**
         *
         * @return {undefined}
         */
        init_resources_dialog: function () {
            var that = this,
                util_bar = that.util_bar,
                file_btn, file_dialog;

            file_btn = $('<button/>', {
                'title': t('refinery.editor.resources_dialog_button_title'),
                'class': 'editor-resources-dialog-btn refinery-btn'
            }).prependTo(util_bar);

            file_dialog = refinery('admin.ResourcesDialog');

            file_btn.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                file_dialog.init().open();

                return false;
            });

            file_dialog.on('insert',
                /** @param {file_dialog_object} file */
                function (file) {
                    var tpl;

                    tpl = '<a href="' + file.url + '" ' +
                            'class="file ' + file.ext + '" ' +
                            'title="' + file.name + ' - ' + file.size + ' bytes " >' +
                            file.name +
                            '</a>';

                    that.insert(tpl);
                }
            );

            that.file_dialog = file_dialog;
        },

        /**
         *
         * @return {undefined}
         */
        init_pages_dialog: function () {
            var that = this,
                util_bar = that.util_bar,
                pages_btn, pages_dialog;

            pages_btn = $('<button/>', {
                'title': t('refinery.editor.pages_dialog_button_title'),
                'class': 'editor-pages-dialog-btn refinery-btn'
            }).prependTo(util_bar);

            pages_dialog = refinery('admin.PagesDialog');

            pages_btn.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                pages_dialog.init().open();

                return false;
            });

            pages_dialog.on('insert',
                /** @param {pages_dialog_object} link */
                function (link) {
                    var tpl = '[%title](%url)';

                    tpl = tpl.replace('%title', link.title);
                    tpl = tpl.replace('%url', link.url);

                    that.insert(tpl);
                }
            );

            that.pages_dialog = pages_dialog;
        },

        destroy: function (removeGlobalReference) {
            var textarea,
                tmp;

            if (this.is('initialised')) {
                if (this.editor) {
                    textarea = $(this.options.textarea);
                    tmp = /** @type {string} */(textarea.val());

                    // for bug:
                    // TypeError: editor is null
                    // editor.parentNode.removeChild(editor);
                    try {
                        this.editor.unload();
                    } catch (e) {
                        if (typeof console === 'object' && typeof console.log === 'function') {
                            console.log(e);
                        }
                    }

                    this.editor = null;
                    textarea.val(tmp);
                }

                if (this.images_dialog) {
                    this.images_dialog.destroy(true);
                }

                if (this.file_dialog) {
                    this.file_dialog.destroy(true);
                }

                if (this.pages_dialog) {
                    this.pages_dialog.destroy(true);
                }

                this.holder.find('.epiceditor-holder').remove();
                this.toggle_button.remove();
            }

            this._destroy(removeGlobalReference);

            return this;
        },

        /**
         * Initialisation
         *
         * @param {!jQuery} holder
         *
         * @return {Object} self
         */
        init: function (holder) {
            var that = this, textarea, editor_holder;

            if (that.is('initialisable')) {
                that.is('initialising', true);
                that.attach_holder(holder);

                textarea = holder.find('textarea');
                editor_holder = $('<div/>', {
                    'class': 'epiceditor-holder'
                }).appendTo(holder);


                that.options.container = editor_holder.get(0);
                that.options.textarea = textarea.get(0);

                textarea.hide();

                that.options.file['name'] = 'refinery' + this.uid;

                that.editor = new EpicEditor(that.options);

                that.editor.remove(that.options.file['name']);
                that.editor.load();

                that.util_bar = $(that.editor.getElement('wrapper')).find('#epiceditor-utilbar');

                that.toggle_button = $('<button/>', {
                    'class': 'epiceditor-toggle-button',
                    'text': t('refinery.editor.toggle_editor')
                }).appendTo(holder);

                that.toggle_button.on('click', function (e) {
                    var tmp = textarea.val();

                    e.preventDefault();

                    editor_holder.toggle();
                    textarea.toggle();

                    if (textarea.is(':visible')) {
                        textarea.val(tmp);
                    } else {
                        that.editor.importFile(that.options.file['name'], tmp);
                    }
                });

                that.init_images_dialog();
                that.init_resources_dialog();
                that.init_pages_dialog();

                that.is({'initialised': true, 'initialising': false});
                that.trigger('init');
            }

            return that;
        }
    });

    /**
     * Editor initialization
     *
     * @expose
     * @param  {jQuery} holder
     * @return {undefined}
     */
    refinery.admin.ui.editorEpicEditor = function (holder) {
        var tabs = holder.find('.ui-tabs'), editors = [];

        holder.find('textarea.replace-with-editor').each(function () {
            var holder = $(this).parent();

            editors[editors.length] = refinery('editor.EpicEditor').init(holder);
        });

        tabs.on('tabsactivate', function () {
            for (var i = editors.length - 1; i >= 0; i--) {
                if (editors[i].editor) {
                    editors[i].editor.reflow();
                }
            }
        });
    };

}());

