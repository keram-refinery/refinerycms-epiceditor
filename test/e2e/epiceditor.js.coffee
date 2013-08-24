refinery.admin.ImagesDialog.prototype.options.url = '../../components/refinery/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url = '../../components/refinery/test/fixtures/resources_dialog.json'
refinery.admin.PagesDialog.prototype.options.url = '../../components/refinery/test/fixtures/pages_dialog.json'

refinery.editor.EpicEditor.prototype.options.basePath = '../../'
refinery.editor.EpicEditor.prototype.options.theme.base = 'styles/epiceditor/themes/base/epiceditor.css'
refinery.editor.EpicEditor.prototype.options.theme.editor = 'styles/epiceditor/themes/preview/refinery.css'
refinery.editor.EpicEditor.prototype.options.theme.preview = 'styles/epiceditor/themes/editor/refinery.css'

errorResponse = (data) ->
  data = data || {}
  d = $.Deferred()
  d.reject(data, 404, 'something went wrong')
  d.promise()

okResponse = (data) ->
  data = data || {}
  d = $.Deferred()
  d.resolve(
    data,
    'success',
    {
      getResponseHeader: (args) ->
        false
    }
  )
  d.promise()

describe 'Refinery EpicEditor', ->

  before ->
    @container = $('#container')
    @container.html('<div class="field"><textarea cols=80 rows=5 id="textarea"></textarea></div>')
    @textarea = $('#textarea')

  after ->
    #@container.empty()

  describe 'Instance', ->
    before ->
      @editor = new refinery.editor.EpicEditor()

    after ->
      @editor.destroy(true)

    it 'is instance of refinery.Object', ->
      expect( @editor ).to.be.an.instanceof refinery.Object


  describe 'Initialization', ->
    before ->
      @editor = new refinery.editor.EpicEditor()
      @editor.init($('#textarea').parent())

    after ->
      @editor.destroy(true)

    context '#container', ->
      it 'contains div.epiceditor-holder', ->
        expect( $('div.epiceditor-holder').length ).to.eq(1)

      it '#textarea is not visible', ->
        expect( $('#textarea:visible').length ).to.eq(0)


  describe 'Dialogs', ->
    before ->
      @editor = new refinery.editor.EpicEditor()
      @editor.init($('#textarea').parent())
      @editable_area = $(@editor.editor.getElement('editor').body)
      @util_bar = $(@editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');

    after ->
      @editor.destroy(true)

    it 'has Resources (files) dialog', ->
      expect( @util_bar.html() ).to.have.string('Files Dialog')

    it 'has Images dialog', ->
      expect( @util_bar.html() ).to.have.string('Images Dialog')

    it 'has Pages (links) dialog', ->
      expect( @util_bar.html() ).to.have.string('Pages Dialog')


  describe 'Insert image', ->
    before (done) ->
      @editor = new refinery.editor.EpicEditor()
      @editor.init($('#textarea').parent())
      @editable_area = $(@editor.editor.getElement('editor').body)
      @util_bar = $(@editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');
      @editor.images_dialog.on 'load', ->
        done()
      @util_bar.find('button.editor-images-dialog-btn').click()

    after ->
      @editor.destroy(true)

    context 'via Library', ->
      before (done) ->
        @util_bar.find('button.editor-images-dialog-btn').click()
        $('.ui-dialog:visible').find('.ui-tabs').tabs({ active: 0 })
        @expectation = '![Image alt](/refinery/test/fixtures/500x350.jpg)'

        $.getJSON '/refinery/test/fixtures/image_dialog.json', (response) ->
          ajaxStub = sinon.stub($, 'ajax')
          ajaxStub.returns(okResponse(response))

          uiSelect('#image-1')
          $('.ui-dialog:visible .insert-button:visible').click()
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
        url = 'http://localhost:9000/refinery-epiceditor/components/refinery/test/fixtures/sample.gif'
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


  describe 'Insert resource', ->
    before ->
      @editor = new refinery.editor.EpicEditor()
      @editor.init($('#textarea').parent())
      @editable_area = $(@editor.editor.getElement('editor').body)
      @util_bar = $(@editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');

    after ->
      @editor.destroy(true)

    context 'via Library', ->
      before (done) ->
        @expectation = 'programming_in_coffeescript.pdf'
        editor = @editor

        @libraryTab = ->
          $('a[href="#existing-resource-area"]').click()
          uiSelect($('.records li').first())
          done()

        editor.file_dialog.on 'load', @libraryTab

        @util_bar.find('button.editor-resources-dialog-btn').click()
        expect( editor.file_dialog.is('opened') ).to.be.true

      after ->
        @editable_area.empty()
        @textarea.val('')
        @editor.file_dialog.off 'load', @libraryTab

      it 'include resource tag to editable area', ->
        expect( @editable_area.html() ).to.have.string(@expectation)

      it 'include resource tag to text area', ->
        expect( @textarea.val() ).to.have.string(@expectation)


  describe 'Insert link', ->
    before (done) ->
      @editor = new refinery.editor.EpicEditor()
      @editor.init($('#textarea').parent())
      @editable_area = $(@editor.editor.getElement('editor').body)
      @util_bar = $(@editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');
      @editor.pages_dialog.on 'load', ->
        done()

      @util_bar.find('button.editor-pages-dialog-btn').click()

    after ->
      @editor.destroy(true)

    context 'via Library', ->
      before (done) ->
        @util_bar.find('button.editor-pages-dialog-btn').click()
        $('.ui-dialog:visible').find('.ui-tabs').tabs({ active: 0  })
        @expectation = '[Home](/)'
        @editor.pages_dialog.on 'insert', ->
          done()
        uiSelect($('.records li').first())

      after ->
        @editable_area.empty()
        @textarea.val('')

      it 'include link tag to editable area', ->
        expect( @editable_area.html() ).to.have.string(@expectation)

      it 'include link tag to text area', ->
        expect( @textarea.val() ).to.have.string(@expectation)


    context 'via Url', ->
      before (done) ->
        @util_bar.find('button.editor-pages-dialog-btn').click()
        $('.ui-dialog:visible').find('.ui-tabs').tabs({ active: 1 })
        url = 'http://localhost:9000/refinery-epiceditor/'
        @expectation = '[localhost:9000/refinery-epiceditor/](' + url + ')'

        $('a[href="#pages-dialog-website"]').click()
        tab = @editor.pages_dialog.holder.find('div[aria-expanded="true"]')
        tab.find('input[type="url"]').val(url)
        tab.find('input[type="submit"]').click()
        done()

      after ->
        @editable_area.empty()
        @textarea.val('')

      it 'include link tag to editable area', ->
        expect( @editable_area.html() ).to.have.string(@expectation)

      it 'include link tag to text area', ->
        expect( @textarea.val() ).to.have.string(@expectation)


    context 'as Email link', ->
      before (done) ->
        @util_bar.find('button.editor-pages-dialog-btn').click()
        $('.ui-dialog:visible').find('.ui-tabs').tabs({ active: 2 })
        email = 'lorem@ipsum.sk'
        subject = 'Hello Philip'
        body = 'some body'
        @expectation = '[' + email + '](mailto:' +
          encodeURIComponent(email) +
          '?subject=' + encodeURIComponent(subject) +
          '&amp;body=' + encodeURIComponent(body) + ')'

        $('a[href="#pages-dialog-email"]').click()
        tab = @editor.pages_dialog.holder.find('div[aria-expanded="true"]')
        tab.find('#email_address_text').val(email)
        tab.find('#email_default_subject_text').val(subject)
        tab.find('#email_default_body_text').val(body)
        tab.find('input[type="submit"]').click()
        done()

      after ->
        @editable_area.empty()
        @textarea.val('')

      it 'include link tag to editable area', ->
        expect( @editable_area.html() ).to.have.string(@expectation)

      it 'include link tag to text area', ->
        expect( @textarea.val() ).to.have.string(@expectation)


  describe 'toggle button', ->
    before (done) ->
      @editor = editor = new refinery.editor.EpicEditor()
      @editor.init($('#textarea').parent())
      @editable_area = $(@editor.editor.getElement('editor').body)
      @util_bar = $(@editor.editor.getElement('wrapper')).find('#epiceditor-utilbar');
      @expectation = 'lorem ipsum'
      @editable_area.html(@expectation)
      $('.epiceditor-toggle-button').click()
      done()

    after ->
      @editor.destroy(true)
      @editable_area.empty()
      @textarea.val('')

    context 'first click', ->
      it 'shows textarea instead of editor', ->
        expect( $('#textarea').is(':visible') ).to.be.true
        expect( $('.epiceditor-holder').is(':visible') ).to.be.false

    context 'second click', ->
      before ->
        $('.epiceditor-toggle-button').click()

      it 'shows again editor', ->
        expect( $('#textarea').is(':visible') ).to.be.false
        expect( $('.epiceditor-holder').is(':visible') ).to.be.true
