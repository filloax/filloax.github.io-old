---
rarity_order:
    - none
    - common
    - uncommon
    - rare
    - very rare
    - legendary
    - artifact
---

[Torna a indice](/homebrew/index)

<script src="/assets/js/homebrew.js"></script>
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

{% assign all_items = site.data.homebrew.items %}

<!-- Rarity first, name second -->
{% assign sorted_items = all_items | sort: "name", "last" %}
{% for rarity in page.rarity_order %}
{% assign sorted_rarity_items = sorted_items | where_exp: "item","item.rarity == rarity" %}
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

<div class="card-container">

<!-- Rarity first, name second -->
{% for rarity in page.rarity_order %}
{% assign sorted_rarity_items = sorted_items | where_exp: "item","item.rarity == rarity" %}
{% for item in sorted_rarity_items %}

<div class="card" markdown="1">

{% include homebrew/itemcard.md item=item %}

</div>

{% endfor %}
{% endfor %}

</div>