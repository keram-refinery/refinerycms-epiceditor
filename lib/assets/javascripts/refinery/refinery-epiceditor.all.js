
(function (window, $) {

// Source: ~/refinery-epiceditor/scripts/epiceditor.js
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

                    if (img.type == 'library') {
                        that.init_image_dialog(img.id);
                    } else {
                        tpl = tpl.replace('%alt', '');
                        tpl = tpl.replace('%url', img[img.size]);
                        that.insert(tpl);
                    }
                }
            );

            that.images_dialog = images_dialog;
        },

        init_image_dialog: function (image_id) {
            var that = this,
                dialog = refinery('admin.ImageDialog', {
                    'url': '/refinery/dialogs/image/' + image_id
                });

            dialog.init();

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
                    var tpl = '<a href="%url" class="file">%title</a>';
                    tpl = tpl.replace('%url', file.url);

                    switch (file.type) {
                    case 'external':

                        break;
                    case 'library':
                        tpl = tpl.replace('%title', file.html);

                        break;
                    default:
                        break;
                    }

                    that.insert(tpl);
                }
            );

            that.file_dialog = file_dialog;
        },

        /**
         *
         * @return {undefined}
         */
        init_links_dialog: function () {
            var that = this,
                util_bar = that.util_bar,
                link_btn, link_dialog;

            link_btn = $('<button/>', {
                'title': t('refinery.editor.links_dialog_button_title'),
                'class': 'editor-links-dialog-btn refinery-btn'
            }).prependTo(util_bar);

            link_dialog = refinery('admin.LinksDialog');

            link_btn.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                link_dialog.init().open();

                return false;
            });

            link_dialog.on('insert',
                /** @param {link_dialog_object} link */
                function (link) {
                    var tpl = '[%title](%url)';

                    tpl = tpl.replace('%title', link.title);
                    tpl = tpl.replace('%url', link.url);

                    that.insert(tpl);
                }
            );

            that.link_dialog = link_dialog;
        },

        destroy: function (removeGlobalReference) {
            var textarea,
                tmp;

            if (this.is('initialised')) {
                if (this.editor) {
                    textarea = $(this.options.textarea);
                    tmp = /** @type {string} */(textarea.val());
                    this.editor.unload();
                    this.editor = null;
                    textarea.val(tmp);
                }

                if (this.images_dialog) {
                    this.images_dialog.destroy(true);
                }

                if (this.file_dialog) {
                    this.file_dialog.destroy(true);
                }

                if (this.link_dialog) {
                    this.link_dialog.destroy(true);
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
                that.init_links_dialog();

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
}(window, jQuery));