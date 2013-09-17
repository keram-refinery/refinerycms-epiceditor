
(function (window, $) {

// Source: refinerycms-epiceditor/scripts/epiceditor.js
(function () {

    /**
     * @constructor
     * @class refinery.epiceditor.EpicEditor
     * @expose
     * @extends {refinery.Object}
     */
    refinery.Object.create({

        name: 'EpicEditor',

        module: 'epiceditor',

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
                'togglePreview': t('refinery.epiceditor.toggle_preview_mode'),
                'toggleEdit': t('refinery.epiceditor.toggle_edit_mode'),
                'toggleFullscreen': t('refinery.epiceditor.enter_fullscreen')
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
         * @param {!jQuery} util_bar
         * @return {undefined}
         */
        init_images_dialog: function (util_bar) {
            var that = this,
                images_btn, images_dialog;

            images_btn = $('<button/>', {
                'title': t('refinery.epiceditor.images_dialog_button_title'),
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
                'class': 'submit-button',
                'click': function () {
                    dialog.insert(dialog.holder);
                }
            }, {
                'text': 'Back to the library',
                'click': function () {
                    dialog.close();
                    dialog.destroy();
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
                    dialog.destroy();
                }
            );

            dialog.open();
        },

        /**
         *
         * @param {!jQuery} util_bar
         * @return {undefined}
         */
        init_resources_dialog: function (util_bar) {
            var that = this,
                file_btn, resources_dialog;

            file_btn = $('<button/>', {
                'title': t('refinery.epiceditor.resources_dialog_button_title'),
                'class': 'editor-resources-dialog-btn refinery-btn'
            }).prependTo(util_bar);

            resources_dialog = refinery('admin.ResourcesDialog');

            file_btn.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                resources_dialog.init().open();

                return false;
            });

            resources_dialog.on('insert',
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

            that.resources_dialog = resources_dialog;
        },

        /**
         *
         * @param {!jQuery} util_bar
         * @return {undefined}
         */
        init_pages_dialog: function (util_bar) {
            var that = this,
                pages_btn, pages_dialog;

            pages_btn = $('<button/>', {
                'title': t('refinery.epiceditor.pages_dialog_button_title'),
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

        unload_editor: function () {
            this.holder.removeClass('wysiwyg-editor-on');
            this.images_dialog.destroy();
            this.resources_dialog.destroy();
            this.pages_dialog.destroy();
            this.editor.unload();
        },

        destroy: function () {
            var textarea,
                tmp;

            if (this.is('initialised')) {
                if (this.editor && this.editor.is('loaded')) {
                    textarea = $(this.options.textarea);
                    tmp = /** @type {string} */(textarea.val());

                    // for bug:
                    // TypeError: editor is null
                    // editor.parentNode.removeChild(editor);
                    try {
                        this.unload_editor();

                    } catch (e) {
                        refinery.log(e);
                    }

                    this.editor = null;
                    textarea.val(tmp);
                }

                this.holder.find('.wysiwyg-editor-holder').remove();
                this.toggle_button.remove();
            }

            this._destroy();

            return this;
        },

        init_editor: function () {
            var that = this,
                holder = that.holder,
                textarea = holder.find('textarea'),
                options = that.options,
                editor;

            options.textarea = textarea.get(0);
            that.editor = editor = new EpicEditor(options);

            function load_editor () {
                var util_bar;

                holder.addClass('wysiwyg-editor-on');

                editor.remove(options.file.name);
                editor.load();

                util_bar = $(editor.getElement('wrapper')).find('#epiceditor-utilbar');
                that.init_images_dialog(util_bar);
                that.init_resources_dialog(util_bar);
                that.init_pages_dialog(util_bar);
            }

            that.toggle_button.on('click', function (e) {
                var tmp = textarea.val();

                e.preventDefault();

                if (holder.hasClass('wysiwyg-editor-on')) {
                    that.unload_editor();
                    textarea.val(tmp);
                } else {
                    load_editor();
                    editor.importFile(options.file.name, tmp);
                }
            });

            load_editor();
        },

        /**
         * Initialisation
         *
         * @param {!jQuery} holder
         *
         * @return {Object} self
         */
        init: function (holder) {
            var that = this, editor_holder;

            if (that.is('initialisable')) {
                that.is('initialising', true);
                that.attach_holder(holder);

                editor_holder = $('<div/>', {
                    'class': 'wysiwyg-editor-holder'
                }).appendTo(holder);

                that.options.container = editor_holder.get(0);
                that.options.file.name = 'refinery' + this.uid;

                that.toggle_button = $('<button/>', {
                    'class': 'wysiwyg-toggle-button',
                    'text': t('refinery.epiceditor.toggle_editor')
                }).appendTo(holder);

                that.init_editor();

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

        holder.find('.wysiwyg-editor-wrapper').each(function () {
            editors[editors.length] = refinery('epiceditor.EpicEditor').init($(this));
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
}(window, jQuery));