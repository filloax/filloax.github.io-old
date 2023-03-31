## Arcanerie Diaboliche di Mavreus Vessac

_Artefice tiefling decisamente impulsivo_

> Una piccola modifica qua e... oh no. Però che figata!

![](https://i.imgur.com/zfsX6Ow.png){: width="300" }

**Gestore:** [Mavreus Vessac](/xho/npc/merchant#mavreus-vessac)

### Costruttore

**Discipline:**

-   _Incantatore_: CD 22
-   _Inventore_: CD 22
-   _Scriba di rune, accademico_: CD 22
-   _Ingegnere_: CD 20
-   _Creatore di bacchette magiche_: CD 20
-   _Intagliatore_: CD 18
-   _Carpentiere_: CD 17
-   _Fabbro_: CD 16

<h4 class="collapsible coll-blank">Informazioni</h4>

<div class="collapsible-content bordered hidden" markdown="1">

Può costruire diversi tipi di oggetti magici e affini. Ricette e prezzi per gli oggetti di questo tipo stanno sotto, in ordine, alle sezioni di

-   _Enchanting_: oggetti magici
-   _Runecarving_: miglioramenti specifici per alcuni tipi di oggetti, solo categoria "accademica", solo nel manuale completo
-   _Wand whittling_: bacchette magiche e scettri
-   _Tinkering_: alcuni oggetti meccanici non magici particolari, come rampini, autocaricatori, freccie speciali, ecc; cose a molla, orologeria, e quant'altro.

Il tutto (tranne _runecarving_ e _tinkering_ che sono solo sul manuale completo) è presente sul solito [PDF gratuito](pdf/crafting_free_version_reddit.pdf).

Utili meno spesso _woodcarving_, roba di legno varia, _engineering_, creazione di grandi strutture, trappole, e macchine da battaglia.

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
    {% for row in site.data.shops.xho.mavreus %}
        <tr>
            <td>
            {% if row["new"] %}<span class="new"></span>{% endif %}
            {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
            {% if row["link"] %}<a href="{{ row['link'] }}">{% endif %}
            {% if row["amount"] == "0" %}<del>{% endif %}
            {% if row["magicspecific"] %}<em>{% endif %}
            {% if row["special"] %}<strong>{% endif %}
                {{ row["name"] }}
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
    {% for row in site.data.shops.xho.mavreus_materials %}
        <tr>
            <td>
            {% if row["new"] %}<span class="new"></span>{% endif %}
            {% if row["restocked"] %}<span class="restocked"></span>{% endif %}
            {% if row["amount"] == "0" %}<del>{% endif %}
            {{ row["name"] }}
            {% if row["amount"] == "0" %}</del>{% endif %}
            </td>
            <td>-</td>
            <td style="text-align:center">{{ row["price"] }}</td>
            <td style="text-align:center">{{ row["rarity"] }}</td>
            <td style="text-align:center">{{ row["amount"] }}</td>
        </tr>
    {% endfor %}
</table>

Oltre a quelli elencati vende anche tutti gli oggetti di basso prezzo nella sezione _tinkering_ del manuale completo del crafting.