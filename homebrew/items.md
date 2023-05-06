---
rarity_order:
    - none
    - varies
    - common
    - uncommon
    - rare
    - very rare
    - legendary
    - artifact
exclude_sources:
    - DMG
    - XGE
    - TCE
    - EGW
    - CRCotN
---

[Torna a indice](/homebrew/index)

<script src="/assets/js/homebrew.js"></script>
<link rel="stylesheet" href="{{ '/assets/css/homebrew.css' | relative_url }}">

## Oggetti homebrew

<form class="showall">
    <input type="checkbox" id="showall" name="showall">
    <label for="showall">Mostra tutti</label>
</form>

<div id="homebrew-container" class="showone">
{% assign all_items = site.data.homebrew.items %}
{% for file_hash in site.data.homebrew.itemsextra %}
    {% assign file = file_hash[1] %}
    {% for item in file %}
        {% assign matching_items = all_items | where_exp: "item2", 'item2["name"] == item["name"] and item2["source"] == item["source"]' %}
        {% unless page.exclude_sources contains item.source or matching_items.size > 0 %}
        {% assign all_items = all_items | push: item %}
        {% endunless  %}
    {% endfor %}
{% endfor %}

<div class="index">
<table>
<thead>
    <tr>
        <td>Oggetto</td>
        <td>Rarità</td>
    </tr>
</thead>
<tbody>

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
</div>

<div class="card-container">

<!-- Rarity first, name second -->
{% for rarity in page.rarity_order %}
{% assign sorted_rarity_items = sorted_items | where_exp: "item","item.rarity == rarity" %}
{% for item in sorted_rarity_items %}

<div class="card hidden" markdown="1">

{% include homebrew/itemcard.jekyll item=item %}

</div>

{% endfor %}
{% endfor %}

</div>
</div>