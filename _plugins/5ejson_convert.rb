# Declare module of your plugin under Jekyll module
module Jekyll::CustomFilter

  # Each method of the module creates a custom Jekyll filter
  def json_dist(input)
    unit_strings = @context.registers[:site].data["homebrew"]["strings"]["units"]
    if unit_strings.key?(input["unit"]) then
      unit = input["unit"]
      amount = input["amount"]

      if unit == "ft" then
        unit = "mt"
        amount = amount * 1.5 / 5
      elsif unit == "miles" then
        unit = "km"
        amount = amount * 1.6
      end

      if amount == 1 then
        "#{amount} #{unit_strings[unit]["singular"]}"
      else
        "#{amount} #{unit_strings[unit]["plural"]}"
      end
    else
      "#{amount} #{unit}"
    end
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
    end
  end
end

Liquid::Template.register_filter(Jekyll::CustomFilter)