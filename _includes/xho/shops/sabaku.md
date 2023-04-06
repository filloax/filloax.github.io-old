<link rel="stylesheet" href="{{ '/assets/css/sabaku.css' | relative_url }}">
<script src="/assets/js/sabaku.js"></script>

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
        <th>Nome</th>
        <th class="sab-itemdesc-header">Descrizione</th>
        <th style="text-align: center">Sintonia</th>
        <th class="col-price">Prezzo</th>
        <!-- <th>Rarità</th> -->
    </tr>
    {% for rarity in rarities %}
        {% assign matching = sabMain | where_exp: "item","item.rarity == rarity" %}
        <tr class="tablesep">
            <td><strong>{{rarity | capitalize}}</strong></td>
            <td class="sab-itemdesc-header"></td><td></td><td></td><td></td>
        </tr>
        {% for row in matching %}
            <tr class="sab-item sab-hidden">
                <td>
                    {% if row["new"] %}<span class="new"></span>{% endif %}
                    {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
                    {% if row["link"] %}<a href="{{ row['link'] }}">{% endif %}
                    <span markdown="1">{{ row["name"] }}</span>
                    {% if row["link"] %}</a>{% endif %}
                </td>
                <td class="sab-itemdesc"><div>{{ row["desc"] | replace: "||","<br>" | markdownify }}</div></td>
                <td style="text-align:center">{{ row["attunement"] }}</td>
                <td class="col-price">{{ row["price"] }}</td>
                <!-- <td style="text-align:center">{{ row["rarity"] }}</td> -->
            </tr>
        {% endfor %}
    {% endfor %}
    <tr class="tablesep collapsible coll-blank">
        <td><strong>Venduti</strong></td>
        <td class="sab-itemdesc-header"></td><td></td><td></td><td></td>
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
            <td class="sab-itemdesc"><div>{{ row["desc"] | replace: "||","<br>" | markdownify }}</div></td>
            <td style="text-align:center">{{ row["attunement"] }}</td>
            <td style="text-align:center"><del>{{ row["price"] }}</del></td>
            <!-- <td style="text-align:center">{{ row["rarity"] }}</td> -->
        </tr>
    {% endfor %}

</table>