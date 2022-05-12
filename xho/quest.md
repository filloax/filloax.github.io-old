[Torna a campagna](./campaign.md)

# Quest

Missioni assegnate dalla Gilda del Den Fres'tynn.

## Incarichi

Ricerca o caccia di mostri, ritrovamento di oggetto correlati, e altre missioni con un obiettivo specifico.

{% include_relative includes/quest_index.md %}

{% comment %}
{% include_relative incarichi.html %}
{% endcomment %}

{% for file in site.static_files %}
{% if file.path contains "/xho/includes/quest/" %}
{% assign file_name = file.path | remove:  "/xho/" %}
{% include_relative {{ file_name }} %}
{% endif %}
{% endfor %}

## Esplorazione

Zone da esplorare, partendo da un accampamento nelle vicinanze. Sia nebbie del lutto, che aree particolari.

*(al momento nessuna pronta)*
