refinery.admin.ImagesDialog.prototype.options.url = '../../components/refinerycms-clientside/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url = '../../components/refinerycms-clientside/test/fixtures/resources_dialog.json'
refinery.admin.PagesDialog.prototype.options.url = '../../components/refinerycms-clientside/test/fixtures/pages_dialog.json'
refinery.epiceditor.EpicEditor.prototype.options.basePath = '../../'
refinery.epiceditor.EpicEditor.prototype.options.theme.base = 'styles/themes/base/epiceditor.css'
refinery.epiceditor.EpicEditor.prototype.options.theme.editor = 'styles/themes/preview/refinery.css'
refinery.epiceditor.EpicEditor.prototype.options.theme.preview = 'styles/themes/editor/refinery.css'

describe 'Refinery EpicEditor on Tabs', ->

  before (done) ->
    @container = container = $('#container')
    refinery.PageUI = new refinery.admin.UserInterface()
    @body_text = body_text = 'This is body text'
    @side_body_text = side_body_text = 'Some other text in Side body part'
    $.get('../../components/refinerycms-clientside/test/fixtures/page_new_parts_default.html', (response) ->
      container.html(response)
      $('#page_parts_attributes_2_body').val(body_text)
      $('#page_parts_attributes_3_body').val(side_body_text)
      refinery.PageUI.init(container)
      done()
    )

  after ->
    refinery.PageUI.destroy()
    @container.empty()

  # google chrome returns This&nbsp;is&nbsp;body&nbsp;text which is not our bug probably
  it 'have content of textarea', ->
    editor = refinery.Object.instances.get( $('#page_part_body').find('.wysiwyg-editor-wrapper').data('refinery-instances')[0] ).editor
    expect( $(editor.getElement('editor').body).text().replace(/\s/g, '') ).to.be.equal(@body_text.replace(/\s/g, ''))

  describe 'ui destroy and reinitialize', ->
    before ->
      @text_before = $('#page_parts_attributes_1_body').val()
      @keys_before = Object.keys(refinery.Object.instances.all())
      refinery.PageUI.destroy()
      refinery.PageUI = new refinery.admin.UserInterface().init(@container)
      @keys_after = Object.keys(refinery.Object.instances.all())
      @text_after = $('#page_parts_attributes_1_body').val()


    it 'not change number of objects', ->
      expect( @keys_after.length ).to.be.equal(@keys_before.length)

    it 'not change content of textareas', ->
      expect( @text_before ).to.be.equal(@text_after)

