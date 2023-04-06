[Torna a indice](/homebrew/index)

<script src="/assets/js/items.js"></script>
<link rel="stylesheet" href="{{ '/assets/css/homebrew.css' | relative_url }}">

## Oggetti homebrew

<table class="index">
<thead>
    <tr>
        <td>Oggetto</td>
        <td>Rarità</td>
    </tr>
</thead>
<tbody>

<!-- Rarity first, name second -->
{% assign sorted_items = site.data.homebrew.items | sort: "name", "last" %}
{% for rarity in site.data.homebrew.strings.rarity %}
{% assign sorted_rarity_items = sorted_items | where_exp: "item","item.rarity == forloop.index0" %}
{% for item in sorted_rarity_items %}

<tr>
    <td><a href="#{{ item.name | slugify }}">{{ item.name }}</a></td>
    {% assign it_rarity = site.data.homebrew.strings.rarity[item.rarity] %}
    <td>{{ it_rarity }}</td>
</tr>

{% endfor %}
{% endfor %}

</tbody>
</table>

<form>
    <input type="checkbox" id="showone" name="showone">
    <label for="showone">Mostra uno alla volta</label>
</form>

<div class="itemcard-container">

<!-- Rarity first, name second -->
{% for rarity in site.data.homebrew.strings.rarity %}
{% assign sorted_rarity_items = sorted_items | where_exp: "item","item.rarity == forloop.index0" %}
{% for item in sorted_rarity_items %}

<div class="itemcard" markdown="1">

{% include homebrew/itemcard.md item=item %}

</div>

{% endfor %}
{% endfor %}

</div>