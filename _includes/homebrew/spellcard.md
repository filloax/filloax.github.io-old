{% assign spell = include.spell %}

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

*Classe: {{ spell.classes | json_class }}*
