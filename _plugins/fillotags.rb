require "nokogiri"

module Jekyll
    class LazyImageBlock < Liquid::Block
        def markdownify(context, input)
            context.registers[:site].find_converter_instance(
              Jekyll::Converters::Markdown
            ).convert(input.to_s)
        end

        # include Jekyll::Filters
        def initialize(tag_name, input, tokens)
            super
            @params = split_params(input)
        end

        def render(context)
            text = super

            text = markdownify(context, text)
            
            # imgurl = @params[0].strip
            # imgtext = @params.fetch(1, "sus").strip

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

        def split_params(params)
            params.split("|")
        end
    end
end

Liquid::Template.register_tag('imgl', Jekyll::LazyImageBlock)