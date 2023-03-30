[Torna a campagna](./campaign.md)

# Sessioni
{:.no_toc}

Riassunti delle sessioni.

{% assign recap_pages = site.star | where_exp: "page", "page.path contains 'sessions'" %}

{% for page in recap_pages %}
- <a href="#{{page.title | slugify}}" class="recap-index">{% if page.new %}<span class="new"></span>{% endif %}{{page.title}}    ({{page.date |  localize: '%d %b %Y'}})</a>{% endfor %}

<button type="button" class="expand-all">Espandi tutti</button>

<div class="noindent">

{% for page in recap_pages %}

{% assign title_num_part = page.title | split: " - " | first %}
{% assign title_title_part = page.title | split: " - " | last %}

<button type="button" class="collapsible coll-primary" id="{{page.title | slugify}}">{{title_num_part}} - <span class="recap-title">{{title_title_part}}</span></button>
<div class="collapsible-content" markdown="1">

##### {{page.date | localize: '%d %b %Y'}}

{{ page.content | markdownify }}

</div>

{% endfor %}

</div>