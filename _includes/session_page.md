<link rel="stylesheet" href="{{ '/assets/css/recaps.css' | relative_url }}">

{% assign session_pages = include.folder | where_exp: "page", "page.path contains 'sessions'" %}
{%if include.recaps %}
{% assign recap_pages = site.data.gpt[include.recaps].out %}
{%endif%}

{% for page in session_pages %}
- <a href="#{{page.title | slugify}}" class="recap-index">{% if page.new %}<span class="new"></span>{% endif %}{{page.title}}    ({{page.date |  localize: '%d %b %Y'}})</a>{% endfor %}

<button type="button" class="expand-all">Espandi tutti</button>

<div class="noindent">

{% for page in session_pages %}

{% assign p1 = page.path | split: "/" %}
{% assign p2 = p1[-1] | split: ".md" %}
{% assign fn = p2[0] %}

{% assign title_num_part = page.title | split: " - " | first %}
{% assign title_title_part = page.title | split: " - " | last %}

<span id="{{title_num_part | slugify}}"></span><button type="button" class="collapsible coll-primary" id="{{page.title | slugify}}">{{title_num_part}} - <span class="recap-title">{{title_title_part}}</span></button>
<div class="collapsible-content recap click-parent" markdown="1">
{{ recap_pages[fn].recap }}
</div>
<div class="collapsible-content hidden" markdown="1">

##### {{page.date | localize: '%d %b %Y'}}

{% imgl %}

{{ page.content | markdownify }}

{% endimgl %}

</div>

{% endfor %}

</div>

*Nota: recap brevi creati automaticamente da ChatGPT, potrebbero contenere boiate o altro.*