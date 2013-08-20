refinery.admin.ImagesDialog.prototype.options.url = '../../components/refinery/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url = '../../components/refinery/test/fixtures/resources_dialog.json'
refinery.admin.LinksDialog.prototype.options.url = '../../components/refinery/test/fixtures/links_dialog.json'

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
    @container.empty()

  describe 'Instance', ->
    before ->
      @editor = new refinery.editor.EpicEditor()

    after ->
      @editor.destroy(true)
      @editor = null

    it 'is instance of refinery.Object', ->
      expect( @editor ).to.be.an.instanceof refinery.Object


  describe 'Initialization', ->
    before ->
      @editor = new refinery.editor.EpicEditor()
      @editor.init($('#textarea').parent())

    after ->
      @editor.destroy(true)
      @editor = null

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
      @editor = null

    it 'has Images, Resources, Links dialog', ->
      expect( @util_bar.html() ).to.have.string('Image Dialog')
      expect( @util_bar.html() ).to.have.string('File Dialog')
      expect( @util_bar.html() ).to.have.string('Link Dialog')


    describe 'Insert image', ->
      context 'via Library', ->
        before (done) ->
          @editable_area.empty()
          @expectation = '![Image alt](/refinery/test/fixtures/500x350.jpg)'
          editor = @editor

          @libraryTab = ->
            $('a[href="#existing-image-area"]').click()
            $.getJSON '/refinery/test/fixtures/image_dialog.json', (response) ->
              ajaxStub = sinon.stub($, 'ajax')
              ajaxStub.returns(okResponse(response))

              $('.ui-dialog .insert-button:visible').click()
              $('.ui-dialog:visible .insert-button:visible').click()
              done()

          editor.images_dialog.on 'load', @libraryTab

          @util_bar.find('button.editor-images-dialog-btn').click()
          #expect( editor.images_dialog.is('opened') ).to.be.true

        after ->
          $.ajax.restore()
          @editable_area.empty()
          @editor.images_dialog.off 'load', @libraryTab

        it 'include image tag to editable area', ->
          expect( @editable_area.html() ).to.have.string(@expectation)

        it 'include image tag to text area', ->
          expect( @textarea.val() ).to.have.string(@expectation)

      context 'via Url', ->
        before (done) ->
          @editable_area.empty()
          url = 'http://localhost:9000/refinery-epiceditor/components/refinery/test/fixtures/sample.gif'
          @expectation = '![](' + url + ')'
          editor = @editor

          @urlTab = ->
            $('a[href="#external-image-area"]').click()
            tab = editor.images_dialog.holder.find('div[aria-expanded="true"]')
            tab.find('input[type="url"]').val(url)
            $('.ui-dialog:visible .insert-button:visible').click()
            done()

          @util_bar.find('button.editor-images-dialog-btn').click()
          expect( editor.images_dialog.is('opened') ).to.be.true

          if editor.images_dialog.is('loaded')
            @urlTab()
          else
            editor.images_dialog.on 'load', @urlTab

        after ->
          @editable_area.empty()
          @editor.images_dialog.off 'load', @urlTab

        it 'include image tag to editable area', ->
          expect( @editable_area.html() ).to.have.string(@expectation)

        it 'include image tag to text area', ->
          expect( @textarea.val() ).to.have.string(@expectation)


    describe 'Insert resource', ->
      context 'via Library', ->
        before (done) ->
          @editable_area.empty()
          @expectation = 'test_file.txt'
          editor = @editor

          @libraryTab = ->
            $('a[href="#existing-resource-area"]').click()
            $('.ui-dialog:visible .insert-button:visible').click()
            done()

          if editor.file_dialog.is('loaded')
            @libraryTab()
          else
            editor.file_dialog.on 'load', @libraryTab

          @util_bar.find('button.editor-resources-dialog-btn').click()
          expect( editor.file_dialog.is('opened') ).to.be.true

        after ->
          @editable_area.empty()
          @editor.file_dialog.off 'load', @libraryTab

        it 'include resource tag to editable area', ->
          expect( @editable_area.html() ).to.have.string(@expectation)

        it 'include resource tag to text area', ->
          expect( @textarea.val() ).to.have.string(@expectation)


    describe 'Insert link', ->
      context 'via Library', ->
        before (done) ->
          @editable_area.empty()
          @expectation = '[Home](/)'
          editor = @editor

          @libraryTab = ->
            $('a[href="#links-dialog-pages"]').click()
            $('.ui-dialog:visible .insert-button:visible').click()
            done()

          if editor.link_dialog.is('loaded')
            @libraryTab()
          else
            editor.link_dialog.on 'load', @libraryTab

          @util_bar.find('button.editor-links-dialog-btn').click()
          expect( editor.link_dialog.is('opened') ).to.be.true

        after ->
          @editable_area.empty()
          @editor.link_dialog.off 'load', @libraryTab


        it 'include link tag to editable area', ->
          expect( @editable_area.html() ).to.have.string(@expectation)

        it 'include link tag to text area', ->
          expect( @textarea.val() ).to.have.string(@expectation)

      context 'via Url', ->
        before (done) ->
          url = 'http://localhost:9000/refinery-epiceditor/'
          @expectation = '[localhost:9000/refinery-epiceditor/](' + url + ')'
          editor = @editor

          @urlTab = ->
            $('a[href="#links-dialog-website"]').click()
            tab = editor.link_dialog.holder.find('div[aria-expanded="true"]')
            tab.find('input[type="url"]').val(url)
            $('.ui-dialog:visible .insert-button:visible').click()
            done()

          @util_bar.find('button.editor-links-dialog-btn').click()
          expect( editor.link_dialog.is('opened') ).to.be.true

          if editor.link_dialog.is('loaded')
            @urlTab()
          else
            editor.link_dialog.on 'load', @urlTab

        after ->
          @editable_area.empty()
          @editor.link_dialog.off 'load', @urlTab

        it 'include link tag to editable area', ->
          expect( @editable_area.html() ).to.have.string(@expectation)

        it 'include link tag to text area', ->
          expect( @textarea.val() ).to.have.string(@expectation)

      context 'as Email link', ->
        before (done) ->
          @editable_area.empty()
          email = 'lorem@ipsum.sk'
          subject = 'Hello Philip'
          body = 'some body'
          @expectation = '[' + email + '](mailto:' +
            encodeURIComponent(email) +
            '?subject=' + encodeURIComponent(subject) +
            '&amp;body=' + encodeURIComponent(body) + ')'
          editor = @editor

          @emailTab = ->
            $('a[href="#links-dialog-email"]').click()
            tab = editor.link_dialog.holder.find('div[aria-expanded="true"]')
            tab.find('#email_address_text').val(email)
            tab.find('#email_default_subject_text').val(subject)
            tab.find('#email_default_body_text').val(body)
            $('.ui-dialog:visible .insert-button:visible').click()
            done()

          @util_bar.find('button.editor-links-dialog-btn').click()
          expect( editor.link_dialog.is('opened') ).to.be.true

          if editor.link_dialog.is('loaded')
            @emailTab()
          else
            editor.link_dialog.on 'load', @emailTab

        after ->
          @editable_area.empty()
          @editor.link_dialog.off 'load', @emailTab

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
