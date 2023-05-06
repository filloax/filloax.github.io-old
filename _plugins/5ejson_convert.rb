# Declare module of your plugin under Jekyll module
module Jekyll::CustomFilter

  def conv_unit(amount, unit)
    if unit == "ft" then
      unit = "mt"
      amount = amount * 1.5 / 5
    elsif unit == "miles" then
      unit = "km"
      amount = amount * 1.6
    elsif unit == "lb" then
      return (amount / 2.205).round(1), "kg"
    end
    return amount, unit
  end

  # Each method of the module creates a custom Jekyll filter
  def json_dist(input)
    unit_strings = @context.registers[:site].data["homebrew"]["strings"]["units"]
    if unit_strings.key?(input["unit"]) then
      amount, unit = conv_unit(input["amount"], input["unit"])

      if amount == 1 then
        "#{amount} #{unit_strings[unit]["singular"]}"
      else
        "#{amount} #{unit_strings[unit]["plural"]}"
      end
    else
      "#{amount} #{unit}"
    end
  end

  def stripintfloat(num)
    return num.to_s.sub(/\.?0+$/, '')
  end

  def json_weprange(input)
    min, max = input.split('/')
    minn = min.to_i
    maxn = max.to_i
  
    minconv, _ = conv_unit(minn, "ft")
    maxconv, _ = conv_unit(maxn, "ft")
    return "(#{stripintfloat(minconv)}/#{stripintfloat(maxconv)} mt.)"
  end

  def json_range(input)
    misc_strings = @context.registers[:site].data["homebrew"]["strings"]["misc"]

    if input["type"] == "radius" then
      "#{misc_strings["range_self"].capitalize()} (#{json_dist(input["distance"])})"
    elsif input["type"] == "point" then
      if input["distance"]["type"] == "self" then
        misc_strings["range_self"].capitalize()
      end
    end
  end

  # {
  #     "v": true,
  #     "s": true,
  #     "m": "A heart prepared with onyx and diamond dust worth at least 10,000 gp"
  # },
  def json_components(input)
    misc_strings = @context.registers[:site].data["homebrew"]["strings"]["misc"]

    comps = []
    if input.key?("v") then
      comps.push(misc_strings["comp_verbal"])
    end
    if input.key?("s") then
      comps.push(misc_strings["comp_somatic"])
    end
    if input.key?("m") then
      comps.push("#{misc_strings["comp_material"]} (#{input["m"]})")
    end

    comps.join(", ")
  end

  # {
  #   "number": 1,
  #   "unit": "hour"
  # }

  def json_time(inputArr)
    unit_strings = @context.registers[:site].data["homebrew"]["strings"]["units"]

    if !(inputArr.kind_of?(Array)) then
      inputArr = [inputArr]
    end

    out = []

    inputArr.each do |input|
      cur = ""

      if unit_strings.key?(input["unit"]) || unit_strings.key?(input["type"]) then
        type = input.key?("unit") ? unit_strings[input["unit"]] : unit_strings[input["type"]]
        value = input.key?("number") ? input["number"] : input["amount"]
        if value == 1 then
          cur += "#{value} #{type["singular"]}"
        else
          cur += "#{value} #{type["plural"]}"
        end
      else
        cur += "#{value} #{input["unit"]}"
      end
      out.push(cur)  
    end

    out.join(", ")
  end

  # "duration": [
  #     {
  #         "type": "permanent",
  #         "ends": [
  #             "dispel"
  #         ]
  #     }
  # ],
  # "duration": [
  #   {
  #       "type": "timed",
  #       "duration": {
  #           "type": "minute",
  #           "amount": 10
  #       },
  #       "concentration": true
  #   }
  # ],
  def json_duration(inputArr)
    unit_strings = @context.registers[:site].data["homebrew"]["strings"]["units"]
    misc_strings = @context.registers[:site].data["homebrew"]["strings"]["misc"]

    out = []

    inputArr.each do |input|
      cur = ""

      if input["type"] == "permanent" then
        if input["ends"].include?("dispel") then
          cur += "#{misc_strings["duration_dispel"]}"
        end
      elsif input["type"] == "timed" then
        cur += "#{json_time(input["duration"])}"
      end
      if input["concentration"] then
        cur += " (#{misc_strings["concentration"]})"
      end

      out.push(cur)  
    end

    out.join(", ")
  end

  def format_single_entry(entry)
    print(entry, "\n")
    entry = entry.gsub(/\{@dice ([^\}]+)\}/, '<span class="hb-dice">\1</span>' )
    entry = entry.gsub(/\{@spell ([^\|\}]+?)(?:\s*\|\s*([^\}]+))\}/, '<span class="hb-spell"><a href="https://roll20.net/compendium/dnd5e/\1">\1</a></span>' )
    entry = entry.gsub(/\{@condition ([^\}]+)\}/, '<span class="hb-condition"><a href="https://roll20.net/compendium/dnd5e/Conditions">\1</a></span>')
    entry = entry.gsub(/\{@damage ([^\}]+)\}/, '<span class="hb-damage">\1</span>')
    entry = entry.gsub(/\{@item ([^\|\}]+)(?:\s*\|\s*([^\}]+))\}/, '<span class="hb-item">\1</span> <span class="hb-item-src">(from \2)</span>')
    entry = entry.gsub(/\{@skill ([^\}]+)\}/, '<span class="hb-skill">\1</span>')
    entry = entry.gsub(/\{@dc ([^\}]+)\}/, 'DC \1')
    entry = entry.gsub(/\{@hit ([^\}]+)\}/, '<span class="hb-hit">+\1</span>')
    return entry
  end

  def table_cell(content, col, table)
    if table.key?("colStyles") then
      return "<td style=\"#{table["colStyles"][col]}\">#{format_single_entry(content)}</td>"
    else
      return "<td>#{format_single_entry(content)}</td>"
    end
  end

  def json_entry(input)
    if input.is_a? String then
      return format_single_entry(input)
    elsif input["type"] == "list" then
      return input["items"].map { |item| "- #{json_entry(item)}" }.join("\n")
    elsif input["type"] == "entries" then
      out = ""
      if input.key?("name") then
        out += "**#{format_single_entry(input["name"])}.** "
      end
      out += input["entries"].map { |entry| json_entry(entry) }.join("\n")
      return out
    elsif input["type"] == "item" then
      out = ""
      if input.key?("name") then
        out += "**#{format_single_entry(input["name"])}.** "
      end
      out += json_entry(input["entry"])
      return out
    elsif input["type"] == "table" then
      out = "<table>"
      if input.key?("caption") then
        out += "<caption>#{input["caption"]}</caption>"
      end
      if input.key?("colLabels") then
        out += "<thead><tr>"
        input["colLabels"].each_with_index do |label, i|
          out += table_cell(label, i, input)
        end
        out += "</tr></thead>"
      end
      out += "<tbody>"
      input["rows"].each do |row|
        out += "<tr>"
        row.each_with_index do |cell, i|
          out += table_cell(cell, i, input)
        end
        out += "</tr>"
      end
      out += "</tbody>"
      out += "</table>"
      return out
    elsif input["type"] == "statblock" then
      src_strings = @context.registers[:site].data["homebrew"]["strings"]["sources"]

      tag = input["tag"]
      src = input["source"]
      src_name = src_strings["src"] ? src_strings["src"]["name"] : src
      name = input["name"]
      statblock_repo = nil

      if tag == "variantrule" then
        statblock_repo = @context.registers[:site].data["homebrew"]["variantrules"]
      else
        print("[WARN] Unknown statblock tag #{tag} for #{input}\n")
        return input
      end

      statblock = statblock_repo.find {|s| s["name"] == name and s["source"] == src}
      if not statblock then
        print("[WARN] Statblock #{name} of #{tag} not found\n")
        return input
      end

      block = "**#{name}**\n\n"
      block += statblock["entries"].map { |entry| json_entry(entry) }.join("\n\n")

      block = block.gsub(/^/, "> ")
    else
      print("[WARN] Could not convert #{input}\n")
      return input 
    end
  end

  def json_class(input)
    class_strings = @context.registers[:site].data["homebrew"]["strings"]["classes"]

    out = []

    if input.key?("fromClassList") then
      input["fromClassList"].each do |cls|
        classKey = cls["name"].downcase()
        if class_strings.key?(classKey) then
          out.push(class_strings[classKey]["name"])
        else
          out.push("\"#{classKey}\"")
        end
      end
    end

    return out.join(", ")
  end

  def json_money(input)
    if not input then
      return
    end
    if input % 100 == 0 then
      return "#{(input / 100).to_s} mo"
    elsif input % 10 == 0 then
      return "#{(input / 10).to_s} ma"
    else
      return "#{input} mr"
    end
  end
end

Liquid::Template.register_filter(Jekyll::CustomFilter)