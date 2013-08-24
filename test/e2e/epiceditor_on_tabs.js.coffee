refinery.admin.ImagesDialog.prototype.options.url = '../../components/refinery/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url = '../../components/refinery/test/fixtures/resources_dialog.json'
refinery.admin.PagesDialog.prototype.options.url = '../../components/refinery/test/fixtures/pages_dialog.json'
refinery.editor.EpicEditor.prototype.options.basePath = '../../'
refinery.editor.EpicEditor.prototype.options.theme.base = 'styles/epiceditor/themes/base/epiceditor.css'
refinery.editor.EpicEditor.prototype.options.theme.editor = 'styles/epiceditor/themes/preview/refinery.css'
refinery.editor.EpicEditor.prototype.options.theme.preview = 'styles/epiceditor/themes/editor/refinery.css'

describe 'Refinery EpicEditor on Tabs', ->

  before (done) ->
    @container = container = $('#container')
    @ui = ui = new refinery.admin.UserInterface();
    @body_text = body_text = 'This is body text'
    @side_body_text = side_body_text = 'Some other text in Side body part'
    $.get('../../components/refinery/test/fixtures/page_new_parts_default.html', (response) ->
      container.html(response)
      $('#page_parts_attributes_1_body').val(body_text)
      $('#page_parts_attributes_2_body').val(side_body_text)
      ui.init(container)
      done()
    )

  after ->
    @container.empty()
    @ui.destroy(true)

  # google chrome returns This&nbsp;is&nbsp;body&nbsp;text which is not our bug probably
  it 'have content of textarea', ->
    editor = refinery.Object.instances.get( $('#page_part_body').data('refinery-instances') ).editor
    console.log($(editor.getElement('editor').body).html())
    expect( $(editor.getElement('editor').body).text().replace(/\s/g, '') ).to.be.equal(@body_text.replace(/\s/g, ''))

  describe 'ui reload', ->
    before ->
      @text_before = $('#page_parts_attributes_1_body').val()
      @keys_before = Object.keys(refinery.Object.instances.all())
      @ui.reload()
      @keys_after = Object.keys(refinery.Object.instances.all())
      @text_after = $('#page_parts_attributes_1_body').val()

    it 'not change number of objects', ->
      expect( @keys_after.length ).to.be.equal(@keys_before.length)

    it 'not change content of textareas', ->
      expect( @text_before ).to.be.equal(@text_after)

