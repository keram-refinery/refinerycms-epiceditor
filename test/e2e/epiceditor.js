(function() {
  refinery.admin.ImagesDialog.prototype.options.url = '/components/refinerycms-clientside/test/fixtures/images_dialog.json';

  refinery.admin.ResourcesDialog.prototype.options.url = '/components/refinerycms-clientside/test/fixtures/resources_dialog.json';

  refinery.admin.LinksDialog.prototype.options.url = '/components/refinerycms-clientside/test/fixtures/links_dialog.json';

  refinery.epiceditor.EpicEditor.prototype.options.basePath = '../../';

  refinery.epiceditor.EpicEditor.prototype.options.theme.base = 'styles/themes/base/epiceditor.css';

  refinery.epiceditor.EpicEditor.prototype.options.theme.editor = 'styles/themes/preview/refinery.css';

  refinery.epiceditor.EpicEditor.prototype.options.theme.preview = 'styles/themes/editor/refinery.css';

  describe('Refinery EpicEditor', function() {
    before(function() {
      this.container = $('#container');
      this.container.html('<div class="field"><textarea cols=80 rows=5 id="textarea"></textarea></div>');
      return this.textarea = $('#textarea');
    });
    after(function() {
      return this.container.empty();
    });
    describe('Instance', function() {
      before(function() {
        return this.editor = new refinery.epiceditor.EpicEditor();
      });
      after(function() {
        return this.editor.destroy();
      });
      return it('is instance of refinery.Object', function() {
        return expect(this.editor).to.be.an["instanceof"](refinery.Object);
      });
    });
    describe('Initialization', function() {
      before(function() {
        this.editor = new refinery.epiceditor.EpicEditor();
        return this.editor.init($('#textarea').parent());
      });
      after(function() {
        return this.editor.destroy();
      });
      return context('#container', function() {
        it('contains div.wysiwyg-editor-holder', function() {
          return expect($('div.wysiwyg-editor-holder').length).to.eq(1);
        });
        return it('#textarea is not visible', function() {
          return expect($('#textarea').parent().hasClass('wysiwyg-editor-on')).to.be["true"];
        });
      });
    });
    describe('Dialogs', function() {
      before(function() {
        this.editor = new refinery.epiceditor.EpicEditor();
        this.editor.init($('#textarea').parent());
        this.editable_area = $(this.editor.editor.getElement('editor').body);
        return this.util_bar = $(this.editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');
      });
      after(function() {
        return this.editor.destroy();
      });
      it('has Resources (files) dialog', function() {
        return expect(this.util_bar.html()).to.have.string('Files Dialog');
      });
      it('has Images dialog', function() {
        return expect(this.util_bar.html()).to.have.string('Images Dialog');
      });
      return it('has Links dialog', function() {
        return expect(this.util_bar.html()).to.have.string('Links Dialog');
      });
    });
    describe('Insert image', function() {
      before(function(done) {
        this.editor = new refinery.epiceditor.EpicEditor();
        this.editor.init($('#textarea').parent());
        this.editable_area = $(this.editor.editor.getElement('editor').body);
        this.util_bar = $(this.editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');
        this.editor.images_dialog.on('load', function() {
          return done();
        });
        this.editor.images_dialog.on('insert', function(img) {});
        return this.util_bar.find('button.editor-images-dialog-btn').click();
      });
      after(function() {
        return this.editor.destroy();
      });
      context('via Library', function() {
        before(function(done) {
          this.util_bar.find('button.editor-images-dialog-btn').click();
          $('.ui-dialog:visible').find('.ui-tabs').tabs({
            active: 0
          });
          this.expectation = '![Image alt](/refinerycms-clientside/test/fixtures/500x350.jpg)';
          return $.getJSON('/components/refinerycms-clientside/test/fixtures/image_dialog.json', function(response) {
            var ajaxStub;
            ajaxStub = sinon.stub($, 'ajax');
            ajaxStub.returns(okResponse(response));
            uiSelect('#image-1');
            $('.ui-dialog:visible form').submit();
            return done();
          });
        });
        after(function() {
          $.ajax.restore();
          this.editable_area.empty();
          return this.textarea.val('');
        });
        it('include image tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string(this.expectation);
        });
        return it('include image tag to text area', function() {
          return expect(this.textarea.val()).to.have.string(this.expectation);
        });
      });
      return context('via Url', function() {
        before(function(done) {
          var tab, url;
          this.util_bar.find('button.editor-images-dialog-btn').click();
          $('.ui-dialog:visible').find('.ui-tabs').tabs({
            active: 1
          });
          url = 'http://localhost:9000/refinery-epiceditor/components/refinerycms-clientside/test/fixtures/sample.gif';
          this.expectation = '![](' + url + ')';
          tab = this.editor.images_dialog.holder.find('div[aria-expanded="true"]');
          tab.find('input[type="url"]').val(url);
          tab.find('input[type="submit"]:visible').click();
          return done();
        });
        after(function() {
          this.editable_area.empty();
          return this.textarea.val('');
        });
        it('include image tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string(this.expectation);
        });
        return it('include image tag to text area', function() {
          return expect(this.textarea.val()).to.have.string(this.expectation);
        });
      });
    });
    describe('Insert resource', function() {
      before(function() {
        this.editor = new refinery.epiceditor.EpicEditor();
        this.editor.init($('#textarea').parent());
        this.editable_area = $(this.editor.editor.getElement('editor').body);
        return this.util_bar = $(this.editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');
      });
      after(function() {
        return this.editor.destroy();
      });
      return context('via Library', function() {
        before(function(done) {
          var editor;
          this.expectation = 'programming_in_coffeescript.pdf';
          editor = this.editor;
          this.libraryTab = function() {
            $('a[href="#existing-resource-area"]').click();
            uiSelect($('.records li').first());
            return done();
          };
          editor.resources_dialog.on('load', this.libraryTab);
          this.util_bar.find('button.editor-resources-dialog-btn').click();
          return expect(editor.resources_dialog.is('opened')).to.be["true"];
        });
        after(function() {
          this.editable_area.empty();
          this.textarea.val('');
          return this.editor.resources_dialog.off('load', this.libraryTab);
        });
        it('include resource tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string(this.expectation);
        });
        return it('include resource tag to text area', function() {
          return expect(this.textarea.val()).to.have.string(this.expectation);
        });
      });
    });
    describe('Insert link', function() {
      before(function(done) {
        this.editor = new refinery.epiceditor.EpicEditor();
        this.editor.init($('#textarea').parent());
        this.editable_area = $(this.editor.editor.getElement('editor').body);
        this.util_bar = $(this.editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');
        this.editor.links_dialog.on('load', function() {
          return done();
        });
        return this.util_bar.find('button.editor-links-dialog-btn').click();
      });
      after(function() {
        return this.editor.destroy();
      });
      context('via Library', function() {
        before(function(done) {
          this.util_bar.find('button.editor-links-dialog-btn').click();
          $('.ui-dialog:visible').find('.ui-tabs').tabs({
            active: 0
          });
          this.expectation = '[Home](/)';
          this.editor.links_dialog.on('insert', function() {
            return done();
          });
          return uiSelect($('.records li').first());
        });
        after(function() {
          this.editable_area.empty();
          return this.textarea.val('');
        });
        it('include link tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string(this.expectation);
        });
        return it('include link tag to text area', function() {
          return expect(this.textarea.val()).to.have.string(this.expectation);
        });
      });
      context('via Url', function() {
        before(function(done) {
          var tab, url;
          this.util_bar.find('button.editor-links-dialog-btn').click();
          $('.ui-dialog:visible').find('.ui-tabs').tabs({
            active: 1
          });
          url = 'http://localhost:9000/refinery-epiceditor/';
          this.expectation = '[localhost:9000/refinery-epiceditor/](' + url + ')';
          $('a[href="#links-dialog-website"]').click();
          tab = this.editor.links_dialog.holder.find('div[aria-expanded="true"]');
          tab.find('input[type="url"]').val(url);
          tab.find('input[type="submit"]').click();
          return done();
        });
        after(function() {
          this.editable_area.empty();
          return this.textarea.val('');
        });
        it('include link tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string(this.expectation);
        });
        return it('include link tag to text area', function() {
          return expect(this.textarea.val()).to.have.string(this.expectation);
        });
      });
      return context('as Email link', function() {
        before(function(done) {
          var body, email, subject, tab;
          this.util_bar.find('button.editor-links-dialog-btn').click();
          $('.ui-dialog:visible').find('.ui-tabs').tabs({
            active: 2
          });
          email = 'lorem@ipsum.sk';
          subject = 'Hello Philip';
          body = 'some body';
          this.expectation = '[' + email + '](mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent(subject) + '&amp;body=' + encodeURIComponent(body) + ')';
          $('a[href="#links-dialog-email"]').click();
          tab = this.editor.links_dialog.holder.find('div[aria-expanded="true"]');
          tab.find('#email_address_text').val(email);
          tab.find('#email_default_subject_text').val(subject);
          tab.find('#email_default_body_text').val(body);
          tab.find('input[type="submit"]').click();
          return done();
        });
        after(function() {
          this.editable_area.empty();
          return this.textarea.val('');
        });
        it('include link tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string(this.expectation);
        });
        return it('include link tag to text area', function() {
          return expect(this.textarea.val()).to.have.string(this.expectation);
        });
      });
    });
    return describe('toggle button', function() {
      before(function(done) {
        var editor;
        this.editor = editor = new refinery.epiceditor.EpicEditor();
        this.editor.init($('#textarea').parent());
        this.editable_area = $(this.editor.editor.getElement('editor').body);
        this.util_bar = $(this.editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');
        this.expectation = 'lorem ipsum';
        this.editable_area.html(this.expectation);
        $('.wysiwyg-toggle-button').click();
        return done();
      });
      after(function() {
        this.editor.destroy();
        this.editable_area.empty();
        return this.textarea.val('');
      });
      context('first click', function() {
        return it('shows textarea instead of editor', function() {
          return expect($('#textarea').parent().hasClass('wysiwyg-editor-on')).to.be["false"];
        });
      });
      return context('second click', function() {
        before(function() {
          return $('.wysiwyg-toggle-button').click();
        });
        return it('shows again editor', function() {
          return expect($('#textarea').parent().hasClass('wysiwyg-editor-on')).to.be["true"];
        });
      });
    });
  });

}).call(this);
