refinery.admin.ImagesDialog.prototype.options.url = '../../components/refinery/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url = '../../components/refinery/test/fixtures/resources_dialog.json'
refinery.admin.LinksDialog.prototype.options.url = '../../components/refinery/test/fixtures/links_dialog.json'

refinery.editor.EpicEditor.prototype.options.basePath = '../../'
refinery.editor.EpicEditor.prototype.options.theme.base = 'styles/epiceditor/themes/base/epiceditor.css'
refinery.editor.EpicEditor.prototype.options.theme.editor = 'styles/epiceditor/themes/preview/refinery.css'
refinery.editor.EpicEditor.prototype.options.theme.preview = 'styles/epiceditor/themes/editor/refinery.css'

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

    it 'has instance of EpicEditor', ->
      expect( @editor.editor ).to.be.an.instanceof EpicEditor

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

    it 'has Images, Resources, Links dialog', ->
      expect( @util_bar.html() ).to.have.string('Image Dialog')
      expect( @util_bar.html() ).to.have.string('File Dialog')
      expect( @util_bar.html() ).to.have.string('Link Dialog')


    describe 'Insert image', ->
      after ->
        @textarea.val('')
        @editable_area.empty()

      context 'via Library', ->
        before (done) ->
          @editable_area.empty()
          @expectation = '![](/refinery/test/fixtures/300x200-a.jpg)'
          editor = @editor

          @libraryTab = ->
            $('a[href="#existing-image-area"]').click()
            editor.img_dialog.holder.find('div[aria-expanded="true"]').find('.insert-button').click()
            done()

          if editor.img_dialog.is('loaded')
            @libraryTab()
          else
            editor.img_dialog.on 'load', @libraryTab

          @util_bar.find('button.editor-images-dialog-btn').click()
          expect( editor.img_dialog.is('opened') ).to.be.true

        after ->
          @editable_area.empty()
          @textarea.val('')
          @editor.img_dialog.off 'load', @libraryTab


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
            tab = editor.img_dialog.holder.find('div[aria-expanded="true"]')
            tab.find('input[type="url"]').val(url)
            tab.find('.insert-button').click()
            done()

          @util_bar.find('button.editor-images-dialog-btn').click()
          expect( editor.img_dialog.is('opened') ).to.be.true

          if editor.img_dialog.is('loaded')
            @urlTab()
          else
            editor.img_dialog.on 'load', @urlTab

        after ->
          @editable_area.empty()
          @editor.img_dialog.off 'load', @urlTab

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
            editor.file_dialog.holder.find('div[aria-expanded="true"]').find('.insert-button').click()
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
          @textarea.focus()
          expect( @textarea.val() ).to.have.string(@expectation)


    describe 'Insert link', ->

      context 'via Library', ->
        before (done) ->
          @editable_area.empty()
          @expectation = '[Home](/)'
          editor = @editor

          @libraryTab = ->
            $('a[href="#links-dialog-pages"]').click()
            editor.link_dialog.holder.find('div[aria-expanded="true"]').find('.insert-button').click()
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

        it 'include link tag to text area', (done) ->
          @textarea.focus()

          expect( @textarea.val() ).to.have.string(@expectation)
          done()

      context 'via Url', ->
        before (done) ->
          @editable_area.empty()
          url = 'http://localhost:9000/refinery-epiceditor/'
          @expectation = '[localhost:9000/refinery-epiceditor/](' + url + ')'
          editor = @editor

          @urlTab = ->
            $('a[href="#links-dialog-website"]').click()
            tab = editor.link_dialog.holder.find('div[aria-expanded="true"]')
            tab.find('input[type="url"]').val(url)
            tab.find('.insert-button').click()
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
            tab.find('.insert-button').click()
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
