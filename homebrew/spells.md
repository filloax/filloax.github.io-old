[Torna a indice](/homebrew/index)

<script src="/assets/js/homebrew.js"></script>
<link rel="stylesheet" href="{{ '/assets/css/homebrew.css' | relative_url }}">

## Incantesimi homebrew

<form class="showall">
    <input type="checkbox" id="showall" name="showall">
    <label for="showall">Mostra tutti</label>
</form>

<div id="homebrew-container" class="showone">

<div class="index">
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
</div>

<div class="card-container">

<!-- Rarity first, name second -->
{% for level in (0..9) %}
{% assign sorted_rarity_spells = sorted_spells | where_exp: "spell","spell.level == level" %}
{% for spell in sorted_rarity_spells %}

<div class="card hidden" markdown="1">

{% include homebrew/spellcard.md spell=spell %}

</div>

{% endfor %}
{% endfor %}

</div>

</div>