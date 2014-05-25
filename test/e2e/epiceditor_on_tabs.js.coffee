refinery.admin.ImagesDialog.prototype.options.url = '../../components/refinerycms-clientside/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url = '../../components/refinerycms-clientside/test/fixtures/resources_dialog.json'
refinery.admin.LinksDialog.prototype.options.url = '../../components/refinerycms-clientside/test/fixtures/links_dialog.json'
refinery.epiceditor.EpicEditor.prototype.options.basePath = '../../'
refinery.epiceditor.EpicEditor.prototype.options.theme.base = 'styles/themes/base/epiceditor.css'
refinery.epiceditor.EpicEditor.prototype.options.theme.editor = 'styles/themes/preview/refinery.css'
refinery.epiceditor.EpicEditor.prototype.options.theme.preview = 'styles/themes/editor/refinery.css'

describe 'Refinery EpicEditor on Tabs', ->

  before (done) ->
    @container = container = $('#container')
    @ui = ui = new refinery.admin.UserInterface()
    @body_text = body_text = 'This is body text'
    @side_body_text = side_body_text = 'Some other text in Side body part'
    that = @
    $.get('../../components/refinerycms-clientside/test/fixtures/page_new_parts_default.html', (response) ->
      container.html(response)
      $('#page_parts_attributes_2_body').val(body_text)
      $('#page_parts_attributes_3_body').val(side_body_text)
      ui.init(container)
      done()
    )

  after ->
    @ui.destroy()
    @container.empty()

  # google chrome returns This&nbsp;is&nbsp;body&nbsp;text which is not our bug probably
  it 'have content of textarea', ->
    body_epiceditor_editable_iframe = $('#page_part_body').find('iframe').contents().find('#epiceditor-editor-frame')
    expect( normaliseText(body_epiceditor_editable_iframe.contents().find('body').text()) ).to.be.equal(normaliseText(@body_text))

  describe 'ui destroy and reinitialize', ->
    before ->
      @text_before = 'Spy Who Loved Me, The'
      $('#page_parts_attributes_2_body').val(@text_before)
      @ui.destroy()
      @ui = new refinery.admin.UserInterface().init(@container)
      @text_after = $('#page_parts_attributes_2_body').val()

    it 'not change content of textareas', ->
      expect( @text_before ).to.be.equal(@text_after)

  describe 'ui destroy and reinitialize', ->
    before ->
      @text_before = $('#page_parts_attributes_2_body').val()
      @ui.destroy()
      @ui = new refinery.admin.UserInterface().init(@container)
      @text_after = $('#page_parts_attributes_2_body').val()

    it 'not change content of textareas', ->
      expect( @text_before ).to.be.equal(@text_after)
