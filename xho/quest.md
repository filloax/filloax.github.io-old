[Torna a campagna](./campaign.md)

<style>
.new::before {
    content: "▶  ";
    color: #44ff55;
    font-size: 15px;
}
</style>

# Quest

Missioni assegnate dalla Gilda del Den Fres'tynn.

## Indice

<span class="new">Nuove missioni indicate con freccia!</span>

### Esplorazione

{% include_relative includes/explore_index.md %}

### Incarichi

{% include_relative includes/quest_index.md %}

<br>
<br>

## Incarichi

Ricerca o caccia di mostri, ritrovamento di oggetto correlati, e altre missioni con un obiettivo specifico.

{% comment %}
{% include_relative includes/quest_index.md %}
{% endcomment %}

{% comment %}
{% include_relative incarichi.html %}
{% endcomment %}

{% for file in site.static_files %}
{% if file.path contains "/xho/includes/quest/" %}
{% assign file_name = file.path | remove:  "/xho/" %}
{% include_relative {{ file_name }} %}
{% endif %}
{% endfor %}

<br>
<br>

## Esplorazione

Zone da esplorare, partendo da un accampamento nelle vicinanze. Sia nebbie del lutto, che aree particolari.

{% include_relative includes/explore_index.md %}

<br>

{% include_relative includes/explore_places.md %}

