refinery.admin.ImagesDialog.prototype.options.url = '../../components/refinery/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url = '../../components/refinery/test/fixtures/resources_dialog.json'
refinery.admin.LinksDialog.prototype.options.url = '../../components/refinery/test/fixtures/links_dialog.json'
refinery.editor.EpicEditor.prototype.options.basePath = '../../'
refinery.editor.EpicEditor.prototype.options.theme.base = 'styles/epiceditor/themes/base/epiceditor.css'
refinery.editor.EpicEditor.prototype.options.theme.editor = 'styles/epiceditor/themes/preview/refinery.css'
refinery.editor.EpicEditor.prototype.options.theme.preview = 'styles/epiceditor/themes/editor/refinery.css'

describe 'Refinery EpicEditor on Tabs', ->

  before (done) ->
    container = $('#container')
    ui = new refinery.admin.UserInterface();
    $.get('../../components/refinery/test/fixtures/page_new_parts_default.html', (response) ->
      container.html(response)
      $('#page_parts_attributes_0_body').val('Some text')
      $('#page_parts_attributes_1_body').val('Some other text in Side body part')
      ui.init(container)
      done()
    )

    @ui = ui
    @container = container

  after ->
    @container.empty()

  it 'have content of textarea', ->
    expect( refinery.Object.instances.get(
      $('#page_part_body').data('refinery-instances')
    ).editor.getElement('editor').body.innerHTML ).to.have.string('Some text')

  describe 'ui reload', ->
    before ->
      @text_before = $('#page_parts_attributes_0_body').val()
      @keys_before = Object.keys(refinery.Object.instances.all())
      @ui.reload(@container)
      @keys_after = Object.keys(refinery.Object.instances.all())
      @text_after = $('#page_parts_attributes_0_body').val()

    it 'not change number of objects', ->
      expect( @keys_after.length ).to.be.equal(@keys_before.length)

    it 'not change content of textareas', ->
      expect( @text_before ).to.be.equal(@text_after)

  describe 'new tab', ->
    before ->
      @text_before = $('#page_parts_attributes_0_body').val()
      @editors_before = $('.epiceditor-holder')

      @getJSONstub = sinon.stub($, 'getJSON')

      @okResponse = () ->
        d = $.Deferred()
        d.resolve(
          {"html":["\u003Cdiv class=\"page-part\" id=\"page_part_lorem\"\u003E\n  \u003Clabel class=\"js-hide\" for=\"page_parts_attributes_2_body\"\u003Elorem\u003C/label\u003E\n  \u003Cinput class=\"part-title\" id=\"page_parts_attributes_2_title\" name=\"page[parts_attributes][2][title]\" type=\"hidden\" value=\"lorem\" /\u003E\n  \u003Ctextarea class=\"replace-with-editor\" id=\"page_parts_attributes_2_body\" name=\"page[parts_attributes][2][body]\" \u003E\n\u003C/textarea\u003E\n  \u003Cinput class=\"part-position\" id=\"page_parts_attributes_2_position\" name=\"page[parts_attributes][2][position]\" type=\"hidden\" value=\"2\" /\u003E\n\u003C/div\u003E\n"]},
          'success',
          {
            getResponseHeader: (args) ->
              false
          }
        )
        d.promise()

      @getJSONstub.returns(@okResponse())

      $('#add-page-part').click()
      $('#new-page-part-title').val('lorem')
      $('.ui-dialog .button.submit-button').click()
      @text_after = $('#page_parts_attributes_0_body').val()
      @editors_after = $('.epiceditor-holder')

    it 'not change content of exists textareas', ->
      expect( @text_before ).to.be.equal(@text_after)

    it 'add editor to new tab', ->
      expect( @editors_after.length ).to.be.equal(@editors_before.length + 1)
