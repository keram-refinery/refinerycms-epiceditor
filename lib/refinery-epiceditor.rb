require 'redcarpet'
require 'refinery/epiceditor/markdown_content_renderer'

module Refinery
  module Epiceditor
    class Engine < ::Rails::Engine

      engine_name :refinery_epiceditor

      initializer 'register refinery_epiceditor plugin' do
        ::Refinery::Plugin.register do |plugin|
          plugin.name = 'epiceditor'
          plugin.hide_from_menu = true
          plugin.always_allow_access = true
          plugin.pathname = root
        end
      end

      initializer 'register refinery_epiceditor javascripts' do
        ::Refinery::I18n.locales.keys.each do |locale|
          file_path = "#{config.root}/lib/assets/javascripts/refinery/i18n/refinery-epiceditor-#{locale}.js"
          if File.exists?(file_path)
            Refinery::Core.config.register_admin_I18n_javascript locale, "refinery/i18n/refinery-epiceditor-#{locale}.js"
          end
        end

        Refinery::Core.config.register_admin_javascript(%w(
          vendor/epiceditor/epiceditor.js
          refinery/refinery-epiceditor.min.js
        ))
      end

      initializer 'register refinery_epiceditor stylesheets' do
        Refinery::Core.config.register_admin_stylesheet 'refinery/refinery-epiceditor'
      end

      initializer 'set content renderer to MarkdownContentRenderer' do
        Refinery.content_renderer = Refinery::EpicEditor::MarkdownContentRenderer.new(Refinery.content_renderer)
      end

    end
  end
end
