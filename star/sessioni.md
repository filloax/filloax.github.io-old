[Torna a campagna](./campaign.md)

# Sessioni
{:.no_toc}

Riassunti delle sessioni.

{% assign recap_pages = site.pages | where_exp: "page", "page.path contains 'star/includes/sessioni/'" %}

{% for page in recap_pages %}
- <a href="#{{page.title | slugify}}" class="recap-index">{% if page.new %}<span class="new"></span>{% endif %}{{page.title}}    ({{page.date}})</a>{% endfor %}

<button type="button" class="expand-all">Espandi tutti</button>

<div class="noindent">

{% for page in recap_pages %}

{% assign title_num_part = page.title | split: " - " | first %}
{% assign title_title_part = page.title | split: " - " | last %}

<button type="button" class="collapsible coll-primary" id="{{page.title | slugify}}">{{title_num_part}} - <span class="recap-title">{{title_title_part}}</span></button>
<div class="collapsible-content" markdown="1">

##### {{page.date}}

{{ page.content }}

</div>
{% endfor %}

</div>

<script>
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling ;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

var expAll = document.getElementsByClassName("expand-all");

for (let i = 0; i < expAll.length; i++) {
    const el = expAll[i]
    el.addEventListener("click", function() {
        for (let j = 0; j < coll.length; j++) {
            coll[j].click()
        }
    });
}

var indexlinks = document.getElementsByClassName("recap-index");
for (let i = 0; i < indexlinks.length; i++) {
    const el = indexlinks[i]
    el.addEventListener("click", function() {
        const anchor = event.target.closest("a");
        if (!anchor) return;                      
        const targ = document.getElementById(anchor.getAttribute('href').replace(/^#/, ""))
        if (targ.tagName !== "BUTTON") return;
        targ.click()
    });
}
</script>