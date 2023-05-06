{% assign item = include.item %}

<h3 id="{{ item.name | slugify }}">{{ item.name }}</h3>

{% assign src_data = site.data.homebrew.strings.sources[item.source]  %}
{% if src_data %}
    {% assign src_name = src_data.name %}
{% else %}
    {% assign src_name = item.source %}
{% endif %}

{% if item.type %}
    {% assign it_type = site.data.homebrew.strings.item_types[item.type].name  %}
{% elsif item.wondrous %}
    {% assign it_type = site.data.homebrew.strings.item_types["WI"].name  %}
{% else %}
    {% assign it_type = ""  %}
{% endif %}
{% assign it_rarity = site.data.homebrew.strings.rarity[item.rarity]  %}

<p class="hb-source">Da {{ src_name }}</p>

{% if item.rarity == "none" %}
*{{ it_type | capitalize }}{% if item.reqAttune %} (richiede sintonia){% endif %}*
{% else %}
*{{ it_type | capitalize }}, {{ it_rarity }}{% if item.reqAttune %} (richiede sintonia){% endif %}*
{% endif %}

{% if item.weapon %}

{%- capture tags -%}
{%- if item.firearm -%}arma da fuoco,{{ " " }}{%- endif -%}
{%- if item.age -%}{{ site.data.homebrew.strings.misc.age[item.age] }},{{ " " }}{%- endif -%}
{{ site.data.homebrew.strings.misc.wep_category[item.weaponCategory] }}
{%- endcapture -%}

*{{ tags | capitalize }}*

<div class="weapontags">
<div>
{{ item.value | json_money }}, {{ item.weight | conv_unit: "lb" }}
</div>
<div>
{% assign dmgtype = site.data.homebrew.strings.damage_types[item.dmgType]  %}
{% if item.range %}{% assign range = item.range | json_weprange %}{% endif %}
{%- if item.property -%}{%- capture props -%}-{%- for prop in item.property -%}
{%- assign propd = site.data.homebrew.strings.weapon_properties[prop] -%}
{%- if forloop.index0 > 0 -%},{%- endif -%}{{ " " }}
{%- if propd.homebrew -%}*{%- endif -%}
{{- propd.name -}}
{%- if propd.homebrew -%}*{%- endif -%}
{%- endfor -%}{%- endcapture -%}{%- endif -%}
{{ item.dmg1 }} {{ dmgtype }} {{ range }} <span markdown="1">{{ props }}</span>
</div>
</div>
{% endif %}

{% for entry in item.entries %}

{% assign filtered_entry = entry | json_entry %}
{{ filtered_entry }}

{% endfor %}

{% if item.property %}
    {% for prop in item.property %}
        {% assign propdata = site.data.homebrew.strings.weapon_properties[prop] %}
        {% if propdata.desc %}
**{{ propdata.name | capitalize }}.** {{ propdata.desc }}
        {% endif %}
    {% endfor %}
{% endif %}