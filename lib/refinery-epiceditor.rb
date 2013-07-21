require 'redcarpet'

module Refinery
  module Epiceditor
    class Engine < ::Rails::Engine

      engine_name :refinery_epiceditor

      initializer 'register refinery_epiceditor plugin' do
        ::Refinery::Plugin.register do |plugin|
          plugin.name = 'refinery_epiceditor'
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

      initializer 'monkey patch PagePartSectionPresenter' do
        Refinery::Pages::PagePartSectionPresenter.class_eval do
          def initialize(page_part)
            super()

            self.fallback_html = markdown.render(page_part.body).html_safe if page_part.body
            self.id = convert_title_to_id(page_part.title) if page_part.title
          end

          def markdown
            @@markdown ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML, :autolink => true)
          end
        end
      end

    end
  end
end
