refinery.admin.ImagesDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/resources_dialog.json'
refinery.admin.LinksDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/links_dialog.json'

refinery.epiceditor.EpicEditor.prototype.options.basePath = '../../'
refinery.epiceditor.EpicEditor.prototype.options.theme.base = 'styles/themes/base/epiceditor.css'
refinery.epiceditor.EpicEditor.prototype.options.theme.editor = 'styles/themes/preview/refinery.css'
refinery.epiceditor.EpicEditor.prototype.options.theme.preview = 'styles/themes/editor/refinery.css'

describe 'Refinery EpicEditor', ->

  before ->
    @container = $('#container')
    @container.html('<div class="field"><textarea cols=80 rows=5 id="textarea"></textarea></div>')
    @textarea = $('#textarea')

  after ->
    @container.empty()

  describe 'Instance', ->
    before ->
      @editor = new refinery.epiceditor.EpicEditor()

    after ->
      @editor.destroy()

    it 'is instance of refinery.Object', ->
      expect( @editor ).to.be.an.instanceof refinery.Object


  describe 'Initialization', ->
    before ->
      @editor = new refinery.epiceditor.EpicEditor()
      @editor.init($('#textarea').parent())

    after ->
      @editor.destroy()

    context '#container', ->
      it 'contains div.wysiwyg-editor-holder', ->
        expect( $('div.wysiwyg-editor-holder').length ).to.eq(1)

      it '#textarea is not visible', ->
        expect( $('#textarea').parent().hasClass('wysiwyg-editor-on') ).to.be.true


  describe 'Dialogs', ->
    before ->
      @editor = new refinery.epiceditor.EpicEditor()
      @editor.init($('#textarea').parent())
      @editable_area = $(@editor.editor.getElement('editor').body)
      @util_bar = $(@editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');

    after ->
      @editor.destroy()

    it 'has Resources (files) dialog', ->
      expect( @util_bar.html() ).to.have.string('Files Dialog')

    it 'has Images dialog', ->
      expect( @util_bar.html() ).to.have.string('Images Dialog')

    it 'has Links dialog', ->
      expect( @util_bar.html() ).to.have.string('Links Dialog')


  describe 'Insert image', ->
    before (done) ->
      @editor = new refinery.epiceditor.EpicEditor()
      @editor.init($('#textarea').parent())
      @editable_area = $(@editor.editor.getElement('editor').body)
      @util_bar = $(@editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');
      @editor.images_dialog.on 'load', ->
        done()
      @editor.images_dialog.on 'insert', (img) ->

      @util_bar.find('button.editor-images-dialog-btn').click()

    after ->
      @editor.destroy()

    context 'via Library', ->
      before (done) ->
        @util_bar.find('button.editor-images-dialog-btn').click()
        $('.ui-dialog:visible').find('.ui-tabs').tabs({ active: 0 })
        @expectation = '![Image alt](/test/fixtures/500x350.jpg)'

        $.getJSON '/components/refinerycms-clientside/test/fixtures/image_dialog.json', (response) ->
          ajaxStub = sinon.stub($, 'ajax')
          ajaxStub.returns(okResponse(response))

          uiSelect('#image-1')
          $('.ui-dialog:visible form').submit()
          done()

      after ->
        $.ajax.restore()
        @editable_area.empty()
        @textarea.val('')

      it 'include image tag to editable area', ->
        expect( @editable_area.html() ).to.have.string(@expectation)

      it 'include image tag to text area', ->
        expect( @textarea.val() ).to.have.string(@expectation)

    context 'via Url', ->
      before (done) ->
        @util_bar.find('button.editor-images-dialog-btn').click()
        $('.ui-dialog:visible').find('.ui-tabs').tabs({ active:  1 })
        url = 'http://localhost:9000/refinery-epiceditor/components/refinerycms-clientside/test/fixtures/sample.gif'
        @expectation = '![](' + url + ')'

        tab = @editor.images_dialog.holder.find('div[aria-expanded="true"]')
        tab.find('input[type="url"]').val(url)
        tab.find('input[type="submit"]:visible').click()
        done()

      after ->
        @editable_area.empty()
        @textarea.val('')

      it 'include image tag to editable area', ->
        expect( @editable_area.html() ).to.have.string(@expectation)

      it 'include image tag to text area', ->
        expect( @textarea.val() ).to.have.string(@expectation)
