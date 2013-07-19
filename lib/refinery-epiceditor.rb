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
        registered = false
        ::Refinery::I18n.locales.keys.each do |locale|
          file_path = "../assets/javascripts/refinery/i18n/refinery-epiceditor-#{locale}.js"
          if File.exists?(File.expand_path(file_path, __FILE__)) && !registered
            Refinery::Core.config.register_admin_I18n_javascript(locale,
              "refinery/i18n/refinery-epiceditor-#{locale}.js"
            )

            registered = true
          end
        end

        Refinery::Core.config.register_admin_javascript(%w(
          vendor/epiceditor/epiceditor.js
          refinery/refinery-epiceditor.all.js
        ))

      end

      initializer 'register refinery_epiceditor stylesheets' do
        Refinery::Core.config.register_admin_stylesheet(
          "refinery/refinery-epiceditor.css"
        )

      end

    end
  end
end


#module Refinery
#  module Pages
#    class PagePartSectionPresenter < SectionPresenter
#
#      def to_html(can_use_fallback = true)
#        @markdown ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML, :autolink => true)
#        content_tag :section, @markdown.render(sections_html(can_use_fallback)).html_safe,
#                    :id => 'body_content',
#                    :class => blank_section_css_classes(can_use_fallback).join(' ')
#      end
#    end
#  end
#end
