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
      var body_text, container, side_body_text, that, ui;
      this.container = container = $('#container');
      this.ui = ui = new refinery.admin.UserInterface();
      this.body_text = body_text = 'This is body text';
      this.side_body_text = side_body_text = 'Some other text in Side body part';
      that = this;
      return $.get('../../components/refinerycms-clientside/test/fixtures/page_new_parts_default.html', function(response) {
        container.html(response);
        $('#page_parts_attributes_2_body').val(body_text);
        $('#page_parts_attributes_3_body').val(side_body_text);
        ui.init(container);
        return done();
      });
    });
    after(function() {
      this.ui.destroy();
      return this.container.empty();
    });
    it('have content of textarea', function() {
      var body_epiceditor_editable_iframe;
      body_epiceditor_editable_iframe = $('#page_part_body').find('iframe').contents().find('#epiceditor-editor-frame');
      return expect(normaliseText(body_epiceditor_editable_iframe.contents().find('body').text())).to.be.equal(normaliseText(this.body_text));
    });
    describe('ui destroy and reinitialize', function() {
      before(function() {
        this.text_before = 'Spy Who Loved Me, The';
        $('#page_parts_attributes_2_body').val(this.text_before);
        this.ui.destroy();
        this.ui = new refinery.admin.UserInterface().init(this.container);
        return this.text_after = $('#page_parts_attributes_2_body').val();
      });
      return it('not change content of textareas', function() {
        return expect(this.text_before).to.be.equal(this.text_after);
      });
    });
    return describe('ui destroy and reinitialize', function() {
      before(function() {
        this.text_before = $('#page_parts_attributes_2_body').val();
        this.ui.destroy();
        this.ui = new refinery.admin.UserInterface().init(this.container);
        return this.text_after = $('#page_parts_attributes_2_body').val();
      });
      return it('not change content of textareas', function() {
        return expect(this.text_before).to.be.equal(this.text_after);
      });
    });
  });

}).call(this);
