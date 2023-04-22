require "nokogiri"

def markdownify(context, input)
    context.registers[:site].find_converter_instance(
      Jekyll::Converters::Markdown
    ).convert(input.to_s)
end

module Jekyll
    class LazyImageBlock < Liquid::Block

        # include Jekyll::Filters
        def initialize(tag_name, input, tokens)
            super
        end

        def render(context)
            text = super

            text = markdownify(context, text)
            
            html_content = Nokogiri::HTML::DocumentFragment.parse(text)

            html_content.css("img").each { |node|
                node["data-src"] = node["src"]
                node["src"] = ""
                if node.key?("class")
                    node["class"] += " lazy-img"
                elsif
                    node["class"] = "lazy-img"
                end
            }

            # Write the output HTML string
            output = ""
            output += "<noscript>"
            output += text
            output += "</noscript>"
            output += html_content.to_s

            # print("converted: #{output}")
            
            # Render it on the page by returning it
            return output;
        end
    end

    class CropImageBlock < Liquid::Block
        def initialize(tag_name, input, tokens)
            super
            @params = split_params(input)

        end
    
        def render(context)
            text = super
            text = markdownify(context, text)
            html_content = Nokogiri::HTML::DocumentFragment.parse(text)
            html_content.css("img").each do |img|
                new_node = doc.create_element "div"
                new_node.inner_html = self.get_html_text
                div.replace new_node
            end
        end

        def split_params(params)
            params.split(" ")
        end
    end
end

Liquid::Template.register_tag('imgl', Jekyll::LazyImageBlock)
Liquid::Template.register_tag('imgc', Jekyll::CropImageBlock)