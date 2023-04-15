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

  def json_entry(input)
    if input.is_a? String then
      return input
    elsif input["type"] == "list" then
      return input["items"].map { |item| "- #{item}" }.join("\n")
    elsif input["type"] == "entries" then
      out = ""
      if input.key?("name") then
        out += "**#{input["name"]}.** "
      end
      out += input["entries"].map { |entry| json_entry(entry) }.join("\n")
      return out
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