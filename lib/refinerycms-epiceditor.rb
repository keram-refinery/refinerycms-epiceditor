require 'redcarpet'
require 'refinery/epiceditor/markdown_content_renderer'

module Refinery
  module Epiceditor
    class Engine < ::Rails::Engine

      engine_name :refinery_epiceditor

      initializer 'register refinery_epiceditor javascripts' do
        ::Refinery::I18n.locales.each do |locale|
          file_path = "#{config.root}/lib/assets/javascripts/refinery/i18n/epiceditor/epiceditor-#{locale}.js"
          if File.exists?(file_path)
            Refinery::Core.config.register_admin_I18n_javascript locale, "refinery/i18n/epiceditor/epiceditor-#{locale}.js"
          end
        end

        Refinery::Core.config.register_admin_javascript(%w(
          vendor/epiceditor/epiceditor.js
          refinery/epiceditor/epiceditor.min.js
        ))
      end

      initializer 'register refinery_epiceditor stylesheets' do
        Refinery::Core.config.register_admin_stylesheet 'refinery/epiceditor/epiceditor'
      end

      initializer 'set content renderer to MarkdownContentRenderer' do
        Refinery.content_renderer = Refinery::EpicEditor::MarkdownContentRenderer.new(Refinery.content_renderer)
      end

    end
  end
end
