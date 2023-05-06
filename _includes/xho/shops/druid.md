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

{% include csvshop.liquid csv=alch_potions secondary_csv=alch_misc materials_csv=alch_mat %}
