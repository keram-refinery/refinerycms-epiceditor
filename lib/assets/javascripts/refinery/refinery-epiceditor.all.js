
(function (window, $) {

// Source: ~./refinery-epiceditor/scripts/epiceditor.js
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
                img_btn, img_dialog;

            img_btn = $('<button/>', {
                'title': t('refinery.editor.images_dialog_button_title'),
                'class': 'editor-images-dialog-btn refinery-btn'
            }).prependTo(util_bar);

            img_dialog = refinery('admin.ImagesDialog');

            img_btn.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                img_dialog.init().open();

                return false;
            });

            img_dialog.on('insert',
                /** @param {images_dialog_object} img */
                function (img) {
                    var tpl = '![%alt](%url)';

                    tpl = tpl.replace('%alt', '');
                    tpl = tpl.replace('%url', img.original);

                    that.insert(tpl);
                }
            );

            /** @expose */
            that.img_dialog = img_dialog;
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

            /** @expose */
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

            /** @expose */
            that.link_dialog = link_dialog;
        },

        destroy: function (removeGlobalReference) {
            if (this.is('initialised')) {
                if (this.editor) {
                    // it also remove content of textarea which is bad
                    //this.editor.unload();
                    this.editor = null;
                }

                if (this.img_dialog) {
                    this.img_dialog.destroy();
                }

                if (this.file_dialog) {
                    this.file_dialog.destroy();
                }

                if (this.link_dialog) {
                    this.link_dialog.destroy();
                }

                this.holder.find('.epiceditor-holder').remove();
            }

            refinery.Object.prototype.destroy.apply(this, [removeGlobalReference]);

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
                that.holder = holder;

                textarea = holder.find('textarea');
                editor_holder = $('<div/>', {
                    'class': 'epiceditor-holder'
                }).appendTo(holder);

                that.options.container = editor_holder.get(0);
                that.options.textarea = textarea.get(0);

                textarea.hide();

                /** @expose */
                that.options.file['name'] = 'refinery' + this.uid;
                that.editor = new EpicEditor(that.options);

                that.editor.remove(that.options.file['name']);
                that.editor.load();

                that.util_bar = $(that.editor.getElement('wrapper')).find('#epiceditor-utilbar');

                that.init_images_dialog();
                that.init_resources_dialog();
                that.init_links_dialog();

                refinery.Object.attach(that.uid, holder);

                that.is({'initialised': true, 'initialising': false});
                that.trigger('init');
            }

            return that;
        }
    });

    /**
     * Editor initialization1
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