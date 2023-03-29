[Torna a indice](/homebrew/index)

<style>
.hb-source {
    font-style: italic;
    opacity: 90%;
    font-size: 0.9em;
}
.hb-damage {
    font-weight: bold;
}
.hb-dice {
    font-weight: bold;
}
.hb-spell {
    font-style: italic;
}
.hb-condition {
    font-style: italic;
}
</style>

## Oggetti homebrew

<table>
<thead>
    <tr>
        <td>Oggetto</td>
        <td>Rarità</td>
    </tr>
</thead>
<tbody>

<!-- Rarity first, name second -->
{% assign sorted_items = site.data.homebrew.items | sort: "name", "last" %}
{% for rarity in site.data.homebrew.rarity %}
{% assign sorted_rarity_items = sorted_items | where_exp: "item","item.rarity == forloop.index0" %}
{% for item in sorted_rarity_items %}

<tr>
    <td><a href="#{{ item.name | slugify }}">{{ item.name }}</a></td>
    {% assign it_rarity = site.data.homebrew.rarity[item.rarity] %}
    <td>{{ it_rarity }}</td>
</tr>

{% endfor %}
{% endfor %}

</tbody>
</table>

<!-- Rarity first, name second -->
{% for rarity in site.data.homebrew.rarity %}
{% assign sorted_rarity_items = sorted_items | where_exp: "item","item.rarity == forloop.index0" %}
{% for item in sorted_rarity_items %}

<h3 id="{{ item.name | slugify }}">{{ item.name }}</h3>

{% assign src_data = site.data.homebrew.sources[item.source]  %}
{% assign it_type = site.data.homebrew.item_types[item.type].name  %}
{% assign it_rarity = site.data.homebrew.rarity[item.rarity]  %}

<p class="hb-source">Da {{ src_data.name }}</p>

*{{ it_type | capitalize }}, {{ it_rarity }}{% if item.reqAttune %} (richiede sintonia){% endif %}*

{% for entry in item.entries %}

{% assign filtered_entry = entry 
    | regex_replace: '{@damage (.*)}', '<span class="hb-damage">\1</span>' 
    | regex_replace: '{@dice (.*)}', '<span class="hb-dice">\1</span>' 
    | regex_replace: '{@spell (.*)}', '<span class="hb-spell"><a href="https://roll20.net/compendium/dnd5e/\1">\1</a></span>' 
    | regex_replace: '{@condition (.*)}', '<span class="hb-condition"><a href="https://roll20.net/compendium/dnd5e/Conditions">\1</a></span>' 
%}
{{ filtered_entry }}

{% endfor %}

{% endfor %}
{% endfor %}