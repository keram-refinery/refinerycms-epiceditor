(function() {
  refinery.admin.ImagesDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/images_dialog.json';

  refinery.admin.ResourcesDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/resources_dialog.json';

  refinery.admin.LinksDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/links_dialog.json';

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
    return describe('Insert image', function() {
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
          this.expectation = '![Image alt](/test/fixtures/500x350.jpg)';
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
  });

}).call(this);
