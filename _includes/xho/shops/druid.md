## Alchimia Botanica

_Alchimista, e seguace di branca druidica particolarmente scientifica_

> La Scienza Botanica è un'arte, una magia, e una tecnologia, modestamente.

![](https://i.imgur.com/jNMS1RF.png){: width="300" }

Gestore: **Torgga Foglianera**, nana F, barbuta, Generalmente volto coperto da simil-maschera da saldatore, strano dato il lavoro per un non esperto. Pezzi di armatura di metallo verde scuro, con parti di legno.

Sul cortile a lato del negozio, con terra relativamente verde che pochi giorni prima dell'apertura così non era, sono presenti numerosi particolari fiori e piante, molti in apparente movimento come una sorta di macchina. Diversi raggi magici vengono lanciati dai fiori, diversi dentro al negozio, sul retro.

### Costruttore

**Discipline**

-   _Alchimista_: CD 23
-   _Erborista_: CD 23
-   _Veleni_: CD 23

### Negozio

{% assign alch_potions = site.data.shops.xho.alchemist | where_exp: "row", "row.magicspecific"  %}
{% assign alch_misc = site.data.shops.xho.alchemist  | where_exp: "row", "row.magicspecific != 'x'" %}
{% assign alch_mat = site.data.shops.xho.alchemist_materials %}

<table>
    <tr>
        <th>Nome</th>
        <th>Descrizione</th>
        <th>Prezzo</th>
        <th>Rarità</th>
        <th>Quantità</th>
    </tr>
    {% for row in alch_potions %}
        <tr>
            <td>
            {% if row["new"] %}<span class="new"></span>{% endif %}
            {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
            {% if row["link"] %}<a href="{{ row['link'] }}">{% endif %}
            {% if row["amount"] == "0" %}<del>{% endif %}
            {% if row["magicspecific"] %}<em>{% endif %}
            {% if row["special"] %}<strong>{% endif %}
            <span markdown="1">{{ row["name"] }}</span>
            {% if row["special"] %}</strong>{% endif %}
            {% if row["magicspecific"] %}</em>{% endif %}
            {% if row["amount"] == "0" %}</del>{% endif %}
            {% if row["link"] %}</a>{% endif %}
            </td>
            <td>{{ row["desc"] }} {% if row["attunement"] %}(s){% endif %}</td>
            <td style="text-align:center">{{ row["price"] }}</td>
            <td style="text-align:center">{{ row["rarity"] }}</td>
            <td style="text-align:center">{{ row["amount"] }}</td>
        </tr>
    {% endfor %}
    <tr>
        <td>—</td>
        <td>—</td>
        <td style="text-align:center">—</td>
        <td style="text-align:center">—</td>
        <td style="text-align:center">—</td>
    </tr>
    {% for row in alch_misc %}
        <tr>
            <td>
            {% if row["new"] %}<span class="new"></span>{% endif %}
            {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
            {% if row["link"] %}<a href="{{ row['link'] }}">{% endif %}
            {% if row["amount"] == "0" %}<del>{% endif %}
            {% if row["magicspecific"] %}<em>{% endif %}
            {% if row["special"] %}<strong>{% endif %}
            <span markdown="1">{{ row["name"] }}</span>
            {% if row["special"] %}</strong>{% endif %}
            {% if row["magicspecific"] %}</em>{% endif %}
            {% if row["amount"] == "0" %}</del>{% endif %}
            {% if row["link"] %}</a>{% endif %}
            </td>
            <td>{{ row["desc"] }} {% if row["attunement"] %}(s){% endif %}</td>
            <td style="text-align:center">{{ row["price"] }}</td>
            <td style="text-align:center">{{ row["rarity"] }}</td>
            <td style="text-align:center">{{ row["amount"] }}</td>
        </tr>
    {% endfor %}
    <tr class="tablesep">
        <td><strong>Materiali</strong></td>
        <td></td><td></td><td></td><td></td>
    </tr>
    {% for row in alch_mat %}
        <tr>
            <td>
            {% if row["new"] %}<span class="new"></span>{% endif %}
            {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
            {% if row["link"] %}<a href="{{ row['link'] }}">{% endif %}
            {% if row["amount"] == "0" %}<del>{% endif %}
            <span markdown="1">{{ row["name"] }}</span>
            {% if row["amount"] == "0" %}</del>{% endif %}
            {% if row["link"] %}</a>{% endif %}
            </td>
            <td>-</td>
            <td style="text-align:center">{{ row["price"] }}</td>
            <td style="text-align:center">{{ row["rarity"] }}</td>
            <td style="text-align:center">{{ row["amount"] }}</td>
        </tr>
    {% endfor %}
</table>

