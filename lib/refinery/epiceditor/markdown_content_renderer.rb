module Refinery
  module EpicEditor
    class MarkdownContentRenderer

      def initialize(renderer=nil)
        @original_renderer = renderer
      end

      def render(string='')
        return @original_renderer.render(markdown.render(string)) if @original_renderer.respond_to?(:render)
        markdown.render(string)
      end

      def markdown
        @@markdown ||= Redcarpet::Markdown.new(
          Redcarpet::Render::HTML.new({
            autolink: true,
            filter_html: false
          }))
      end
    end
  end
end
