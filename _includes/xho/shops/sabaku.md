## Il Grifone del Deserto

_Studioso e mercante di oggetti magici_

> Benvenuti, benvenuti. Ogni merce qua ha la sua storia, sapete?

![](../assets/img/Grifone-deserto-logo.webp){: width="800" }

**Gestore**: [Shaba-ku di Marquet](/xho/npc/merchant#shaba-ku-di-marquet), con [Cyd O'neal](/xho/npc/merchant#cyd-oneal) che assiste

La sua offerta di oggetti magici cambia spesso. Ogni oggetto ha una storia, che sarà ben felice di raccontare.

### Negozio

{% 
    assign sabMain = site.data.shops.xho.sabaku 
    | where_exp: "row", "row.rarity != 'comune'" 
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

<table>
    <tr>
        <th>Nome</th>
        <th>Descrizione</th>
        <th>Sintonia</th>
        <th>Prezzo</th>
        <th>Rarità</th>
    </tr>
    {% for row in sabMain %}
        <tr>
            <td>
            {% if row["new"] %}<span class="new"></span>{% endif %}
            {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
            {% if row["link"] %}<a href="{{ row['link'] }}">{% endif %}
            <span markdown="1">{{ row["name"] }}</span>
            {% if row["link"] %}</a>{% endif %}
            </td>
            <td><span markdown="1">_{{ row["desc"] }}_</span></td>
            <td style="text-align:center">{{ row["attunement"] }}</td>
            <td style="text-align:center">{{ row["price"] }}</td>
            <td style="text-align:center">{{ row["rarity"] }}</td>
        </tr>
    {% endfor %}
    <tr class="tablesep">
        <td><strong>Comuni</strong></td>
        <td></td><td></td><td></td><td></td>
    </tr>
    {% for row in sabCommon %}
        <tr>
            <td>
            {% if row["new"] %}<span class="new"></span>{% endif %}
            {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
            {% if row["link"] %}<a href="{{ row['link'] }}">{% endif %}
            <span markdown="1">{{ row["name"] }}</span>
            {% if row["link"] %}</a>{% endif %}
            </td>
            <td><span markdown="1">_{{ row["desc"] }}_</span></td>
            <td style="text-align:center">{{ row["attunement"] }}</td>
            <td style="text-align:center">{{ row["price"] }}</td>
            <td style="text-align:center">{{ row["rarity"] }}</td>
        </tr>
    {% endfor %}
    <tr class="tablesep collapsible coll-blank">
        <td><strong>Venduti</strong></td>
        <td></td><td></td><td></td><td></td>
    </tr>
    {% for row in sabSold %}
        <tr class="collapsible-content">
            <td>
            {% if row["new"] %}<span class="new"></span>{% endif %}
            {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
            {% if row["link"] %}<a href="{{ row['link'] }}">{% endif %}
            <span markdown="1">~~{{ row["name"] }}~~</span>
            {% if row["link"] %}</a>{% endif %}
            </td>
            <td><span markdown="1">_{{ row["desc"] }}_</span></td>
            <td style="text-align:center">{{ row["attunement"] }}</td>
            <td style="text-align:center"><del>{{ row["price"] }}</del></td>
            <td style="text-align:center">{{ row["rarity"] }}</td>
        </tr>
    {% endfor %}
</table>