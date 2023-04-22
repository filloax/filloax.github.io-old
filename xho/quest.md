[Torna a campagna](./campaign.md)

# Quest

Missioni assegnate dalla Gilda del Den Fres'tynn.

## Indice

<span class="new">Nuove missioni indicate con freccia verde!</span><br>
<span class="restocked">Missioni in corso indicate con freccia arancione!</span>

### Esplorazione

{% include_relative includes/explore_index.md %}

### Incarichi

{% assign quest_pages = site.xho | where_exp: "page", "page.path contains 'quest'" %}
{% assign completed_quests = quest_pages | where_exp: "page", "page.completed" %}
{% assign incomplete_quests_good = quest_pages | where_exp: "page", "page.completed != true" | where_exp: "page", "page.overleveled != true" %}
{% assign incomplete_quests_bad = quest_pages | where_exp: "page", "page.completed != true" | where_exp: "page", "page.overleveled" %}

| Incarico | Luogo | Mandante | Ricompensa |
| :------- | :---- | :------: | :--------: |
{% for page in incomplete_quests_good %}| [{% if page.running %}<span class="restocked"></span>{% elsif page.new %}<span class="new"></span>{% endif %}**{{page.title}}**](#{{page.title | slugify}}) | {{page.location}} | {{page.giver}} | {{page.reward}} |
{% endfor %}| *LIVELLO BASSO* | --- | --- | --- |
{% for page in incomplete_quests_bad %}| [{% if page.running %}<span class="restocked"></span>{% elsif page.new %}<span class="new"></span>{% endif %}{{page.title}}](#{{page.title | slugify}}) | {{page.giver}} | {{page.reward}} |
{% endfor %}| **SVOLTE** | --- | --- | --- |
{% for page in completed_quests %}| [~~{{page.title}}~~](#{{page.title | slugify}}) | {{page.giver}} | {{page.reward}} |
{% endfor %}

<br>
<br>

## Incarichi

Ricerca o caccia di mostri, ritrovamento di oggetto correlati, e altre missioni con un obiettivo specifico.

{% for page in quest_pages %}

<h3 id="{{page.title | slugify}}">{{page.title}}</h3>

{% if page.completed %}#### COMPLETA{% endif %}
{% if page.running %}#### IN CORSO{% endif %}

* **Luogo.**  {{page.location}}
* **Ricompensa.** {{page.reward}}
* **Mandante.** {{page.giver}}
* **Informazioni**

{{page.content}}

{% endfor %}


<br>
<br>

## Esplorazione

Zone da esplorare, partendo da un accampamento nelle vicinanze. Sia nebbie del lutto, che aree particolari.

{% include_relative includes/explore_index.md %}

<br>

{% include_relative includes/explore_places.md %}

