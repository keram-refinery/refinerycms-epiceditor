(function() {
  refinery.admin.ImagesDialog.prototype.options.url = '../../components/refinerycms-clientside/test/fixtures/images_dialog.json';

  refinery.admin.ResourcesDialog.prototype.options.url = '../../components/refinerycms-clientside/test/fixtures/resources_dialog.json';

  refinery.admin.LinksDialog.prototype.options.url = '../../components/refinerycms-clientside/test/fixtures/links_dialog.json';

  refinery.epiceditor.EpicEditor.prototype.options.basePath = '../../';

  refinery.epiceditor.EpicEditor.prototype.options.theme.base = 'styles/themes/base/epiceditor.css';

  refinery.epiceditor.EpicEditor.prototype.options.theme.editor = 'styles/themes/preview/refinery.css';

  refinery.epiceditor.EpicEditor.prototype.options.theme.preview = 'styles/themes/editor/refinery.css';

  describe('Refinery EpicEditor on Tabs', function() {
    before(function(done) {
      var body_text, container, side_body_text;
      this.container = container = $('#container');
      refinery.PageUI = new refinery.admin.UserInterface();
      this.body_text = body_text = 'This is body text';
      this.side_body_text = side_body_text = 'Some other text in Side body part';
      return $.get('../../components/refinerycms-clientside/test/fixtures/page_new_parts_default.html', function(response) {
        container.html(response);
        $('#page_parts_attributes_2_body').val(body_text);
        $('#page_parts_attributes_3_body').val(side_body_text);
        refinery.PageUI.init(container);
        return done();
      });
    });
    after(function() {
      refinery.PageUI.destroy();
      return this.container.empty();
    });
    it('have content of textarea', function() {
      var editor;
      editor = refinery.PageUI.objects.filter(function(o) {
        return o.name === 'EpicEditor';
      })[0];
      return expect($(editor.getElement('editor').body).text().replace(/\s/g, '')).to.be.equal(this.body_text.replace(/\s/g, ''));
    });
    return describe('ui destroy and reinitialize', function() {
      before(function() {
        this.text_before = $('#page_parts_attributes_1_body').val();
        this.keys_before = Object.keys(refinery.Object.instances.all());
        refinery.PageUI.destroy();
        refinery.PageUI = new refinery.admin.UserInterface().init(this.container);
        this.keys_after = Object.keys(refinery.Object.instances.all());
        return this.text_after = $('#page_parts_attributes_1_body').val();
      });
      it('not change number of objects', function() {
        return expect(this.keys_after.length).to.be.equal(this.keys_before.length);
      });
      return it('not change content of textareas', function() {
        return expect(this.text_before).to.be.equal(this.text_after);
      });
    });
  });

}).call(this);
