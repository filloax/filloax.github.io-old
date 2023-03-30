[Torna a indice](/homebrew/index)

<link rel="stylesheet" href="{{ '/assets/css/homebrew.css' | relative_url }}">

## Incantesimi homebrew

<table>
<thead>
    <tr>
        <td>Incantesimo</td>
        <td>Livello</td>
        <td>Scuola</td>
    </tr>
</thead>
<tbody>

<!-- Rarity first, name second -->
{% assign sorted_spells = site.data.homebrew.spells | sort: "name", "last" %}
{% for level in (0..9) %}
{% assign sorted_rarity_spells = sorted_spells | where_exp: "spell","spell.level == level" %}
{% for spell in sorted_rarity_spells %}

<tr>
    <td><a href="#{{ spell.name | slugify }}">{{ spell.name }}</a></td>
    <td>{% if spell.level == 0 %} T {% else %} {{ spell.level }} {% endif %}</td>
    <td>{{ site.data.homebrew.strings.spell_schools[spell.school] }}</td>
</tr>

{% endfor %}
{% endfor %}

</tbody>
</table>

<!-- Rarity first, name second -->
{% for level in (0..9) %}
{% assign sorted_rarity_spells = sorted_spells | where_exp: "spell","spell.level == level" %}
{% for spell in sorted_rarity_spells %}

<h3 id="{{ spell.name | slugify }}">{{ spell.name }}</h3>

{% assign src = site.data.homebrew.strings.sources[spell.source].name  %}
{% assign school = site.data.homebrew.strings.spell_schools[spell.school] %}

<p class="hb-source">Da {{ src }}</p>

{% if spell.level == 0 %}
*Trucchetto di {{ school }}*
{% else %}
*{{ school | capitalize }} di livello {{ spell.level }}*
{% endif %}

**Tempo di lancio:** {{ spell.time | json_time }}

**Gittata:** {{ spell.range | json_range }}

**Componenti:** {{ spell.components | json_components }}

**Durata:** {{ spell.duration | json_duration }}

{% for entry in spell.entries %}

{% assign filtered_entry = entry 
    | json_entry
    | regex_replace: '{@damage (.*)}', '<span class="hb-damage">\1</span>' 
    | regex_replace: '{@dice (.*)}', '<span class="hb-dice">\1</span>' 
    | regex_replace: '{@spell (.*)}', '<span class="hb-spell"><a href="https://roll20.net/compendium/dnd5e/\1">\1</a></span>' 
    | regex_replace: '{@condition (.*)}', '<span class="hb-condition"><a href="https://roll20.net/compendium/dnd5e/Conditions">\1</a></span>' 
    | regex_replace: '{@creature ([^\|]+)\|([^\|]+)\|([^\|]+)}', '<span class="hb-creature">\3</span>' 
    | regex_replace: '{@creature ([^\|]+)\|([^\|]+)}', '<span class="hb-creature">\1</span>' 
%}
{{ filtered_entry }}

{% endfor %}

{% endfor %}
{% endfor %}