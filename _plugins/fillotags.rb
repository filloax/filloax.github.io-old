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
        CopyKeys = [
            "width",
            "height",
            "max-width",
            "max-height",
            "min-width",
            "min-height",
            "float",
        ]
        RenameKeys = {
            "size" => "background-size",
            "pos" => "background-position",
        }

        def initialize(tag_name, input, tokens)
            super
            @params = split_params(input)

        end
    
    
        # <div style="width: 25%; background-image: url('https://i.imgur.com/OuNs0Cc.jpg'); 
        # background-position: top 0% right 50%; background-size: 200%; float: none;" 
        # class="portrait"> <a href="https://i.imgur.com/OuNs0Cc.jpg" class="fill-div"></a></div>

        def render(context)
            text = super
            text = markdownify(context, text)
            html_content = Nokogiri::HTML::DocumentFragment.parse(text)
            html_content.css("img").each do |img|
                src = img["src"]

                portrait_div = html_content.document.create_element "div"

                style = {}
                if img["style"] then
                    img["style"].split(/\s*;\s*/).each do |val|
                        pair = val.split(/\s*:\s*/)
                        style[pair[0]] = pair[1]
                    end
                end
                CopyKeys.each do |key| 
                    if img[key] then style[key] = img[key] end    
                end
                RenameKeys.each_pair do |key, value| 
                    if img[key] then style[value] = img[key] end
                end 

                if !img.key?("float") then
                    style["float"] = "none"
                end
                
                style["background-image"] = "url(#{src})"

                portrait_div["style"] = style.map{|k,v| "#{k}: #{v}"}.join('; ')
                portrait_div["class"] = "portrait"

                link = img.key?("altlink") ? img["altlink"] : src

                portrait_div.add_child "<a class=\"fill-div\" href=\"#{link}\"></a>"
                
                img.replace portrait_div

                if portrait_div.parent.name == 'p' then
                    portrait_div.parent = portrait_div.parent.parent
                end
            end

            html_content.css("p").each do |p|
                if p.children().empty? then
                    p.remove
                end
            end

            # print("text: #{text}")
            # print("converted: #{html_content.to_s}")

            return html_content.to_s
        end

        def split_params(params)
            params.split(" ")
        end
    end
end

Liquid::Template.register_tag('imgl', Jekyll::LazyImageBlock)
Liquid::Template.register_tag('imgc', Jekyll::CropImageBlock)