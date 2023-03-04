## Mastro Ner Tör

_Fabbro mutante della gilda_

> Hrrm.

**Gestore**: [Mastro Ner Tör](/xho/npc/frestynn#mastro-ner-tör). Orco e tiefling mutante, numerose corna ovunque.

Lavoratore della gilda: offre sconto o extra a membri della gilda.

### Costruttore

**Discipline**

-   _Fabbro_: CD 23
-   _Carpentiere_: CD 20

**Moltiplicatore di prezzo:** 85%

<h4 class="collapsible coll-blank">Informazioni</h4>

<div class="collapsible-content bordered" markdown="1">

Ricette e prezzi da fabbro a **pg. 43** del [PDF gratuito](pdf/crafting_free_version_reddit.pdf), o in alternativa pagina 219 sul manuale completo.

Può anche costruire da 0 (ha lui i materiali) tutte le cose che può costruire con materiali che possiede già, in quel caso costano il prezzo base
più un extra da costruzione, a seconda. In particolare, può così costruire armature e armi con modifiche (vedi regole _blacksmithing_ a
**pg. 50** del [PDF gratuito](pdf/crafting_free_version_reddit.pdf) o pagina 225 del manuale completo) e materiali particolari (vedi sotto), e
armi personalizzate. Certi materiali possono probabilmente essere fatti arrivare da altrove, ma costa e ci vuole più tempo.

Esempi di materiali speciali sono il ferronero, che da vantaggio all'ombra, o lo stahlrim, metallo gelato. I modificatori sono di varia natura.

</div>

### Negozio

<table>
    <tr>
        <th>Nome</th>
        <th>Descrizione</th>
        <th>Prezzo</th>
        <th>Rarità</th>
        <th>Quantità</th>
    </tr>
    {% for row in site.data.shops.xho.nertor %}
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
    {% for row in site.data.shops.xho.nertor_materials %}
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

<h4 class="collapsible coll-blank">Altri oggetti</h4>

<div class="collapsible-content bordered" markdown="1">

Oggetti trovabili normalmente da un fabbro:

-   Gratis quelli minimi necessari, o vari strumenti in prestito
-   85% del prezzo quelli mediamente costosi
-   Prezzo base quelli più costosi (non scroccate le armature grosse, sorry)

Altri oggetti:

-   Materiali da costruzione rilevanti a prezzo base, alcuni particolari evidenziati sotto. Elenco metalli speciali [qua](/xho/oggetti#metalli) o linkato nella tabella.
-   Oggetti speciali da Kibbles' Compendium of Craft and Creation, evidenziati [qua](/xho/oggetti), non tutti solo quelli interessanti

</div>