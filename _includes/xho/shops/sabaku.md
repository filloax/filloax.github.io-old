<link rel="stylesheet" href="{{ '/assets/css/sabaku.css' | relative_url }}">
<script src="/assets/js/sabaku.js"></script>
<script src="https://kit.fontawesome.com/e2e8523316.js" crossorigin="anonymous"></script>

## Il Grifone del Deserto

_Studioso e mercante di oggetti magici_

> Benvenuti, benvenuti. Ogni merce qua ha la sua storia, sapete?

![](../assets/img/Grifone-deserto-logo.webp){: width="800" }

**Gestore**: [Shaba-ku di Marquet](/xho/npc/merchant#shaba-ku-di-marquet), con [Cyd O'neal](/xho/npc/merchant#cyd-oneal) che assiste

La sua offerta di oggetti magici cambia spesso. Ogni oggetto ha una storia, che sarà ben felice di raccontare.

### Negozio

{% 
    assign sabMain = site.data.shops.xho.sabaku 
    | where_exp: "row", "row.sold != true" 
%}
{% 
    assign sabCommon = site.data.shops.xho.sabaku 
    | where: "rarity", "comune" 
    | where_exp: "row", "row.sold != true" 
%}
{% 
    assign sabSold = site.data.shops.xho.sabaku 
    | where: "sold", "true"
%}
{%
    assign rarities = site.data.shops.xho.sabaku
    | map: "rarity"
    | uniq | compact
%}

<ul>
{% for rarity in rarities %}
<li>{{rarity}}</li>
{% endfor %}
</ul>
<table class="sab">
    <tr>
        <th class="col-name">Nome</th>
        <th class="sab-itemdesc-header col-desc">Descrizione</th>
        <th class="col-attunement">Sintonia</th>
        <th class="col-price">Prezzo</th>
        <!-- <th>Rarità</th> -->
    </tr>
    {% for rarity in rarities %}
        {% assign matching = sabMain | where_exp: "item","item.rarity == rarity" %}
        <tr class="tablesep">
            <td colspan="4"><strong>{{rarity | capitalize}}</strong></td>
        </tr>
        {% for row in matching %}
            <tr class="sab-item sab-hidden">
                <td class="col-name"><div>
                    {% if row["new"] %}<span class="new"></span>{% endif %}
                    {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
                    {% if row["link"] %}<a href="{{ row['link'] }}">{% endif %}
                    <span markdown="1">{{ row["name"] }}</span>
                    {% if row["link"] %}</a>{% endif %}
                </div></td>
                <td class="sab-itemdesc col-desc"><div>{{ row["desc"] | replace: "||","<br>" | markdownify }}</div></td>
                <td class="col-attunement">{{ row["attunement"] }}</td>
                <td class="col-price">{{ row["price"] | intcomma: '.' }}</td>
                <!-- <td style="text-align:center">{{ row["rarity"] }}</td> -->
            </tr>
        {% endfor %}
    {% endfor %}
    <tr class="tablesep collapsible coll-blank">
        <td colspan="4"><strong>Venduti</strong></td>
    </tr>
    {% for row in sabSold %}
        <tr class="collapsible-content hidden sab-item sab-hidden">
            <td>
            {% if row["new"] %}<span class="new"></span>{% endif %}
            {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
            {% if row["link"] %}<a href="{{ row['link'] }}">{% endif %}
            <span markdown="1">~~{{ row["name"] }}~~</span>
            {% if row["link"] %}</a>{% endif %}
            </td>
            <td class="sab-itemdesc col-desc"><div>{{ row["desc"] | replace: "||","<br>" | markdownify }}</div></td>
            <td class="col-attunement">{{ row["attunement"] }}</td>
            <td class="col-price"><del>{{ row["price"] }}</del></td>
            <!-- <td style="text-align:center">{{ row["rarity"] }}</td> -->
        </tr>
    {% endfor %}

</table>