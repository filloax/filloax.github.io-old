[Torna a campagna](./campaign.md)

# Avventurieri della Gilda
{:.no_toc}

##### Personaggi Giocanti
{:.no_toc}

<div class="pctable">      
    <div class="cell willow"><a href="#willow" class="fill-div"></a></div>
    <div class="cell rath"><a href="#rath" class="fill-div"></a></div>
    <div class="cell xandra"><a href="#xandra" class="fill-div"></a></div>
    <div class="cell nikolaya"><a href="#nikolaya" class="fill-div"></a></div>
    <div class="cell kor"><a href="#kor" class="fill-div"></a></div>
    <div class="cell estia"><a href="#estia" class="fill-div"></a></div>
    <div class="cell kaizner"><a href="#kaizner" class="fill-div"></a></div>
    <div class="cell krieger"><a href="#krieger" class="fill-div"></a></div>
    <div class="cell kir"><a href="#kir" class="fill-div"></a></div>
    <div class="cell aris"><a href="#aris" class="fill-div"></a></div>
    <div class="cell kess"><a href="#kess" class="fill-div"></a></div>
    <!-- <div class="cell xian"><a href="#xian" class="fill-div"></a></div> -->
</div>

### Script vari

Andate a [pgscripts](/xho/pgscripts) per alcune web-app per i personaggi. Tipo il calcolo danni di Xandra, quella roba lì.

{% assign pg_pages = site.xho | where_exp: "page", "page.path contains 'pg'" %}

{% for page in pg_pages %}
{% unless page.priority %}
    {% assign page = page | addProp: "priority", 0 %}
{% endunless %}
{% endfor %}

{% assign sorted_pages = pg_pages | sort_stable: "player" | sort_stable: "priority" %}

{% for page in sorted_pages %}

{% assign page_id = page.id %}
{% unless page_id %}
    {% assign page_id = page.name | slugify %}
{% endunless %}

<section id="{{page.id}}" class="pcsection" markdown="1">

## {{ page.name }}

##### {{ page.player }}

{{ page.content | markdownify }}

</section>

{% endfor %}


## Pensionati
{:.no_toc}

## Lakario
{:.no_toc}

##### Matte
{:.no_toc}

*Aasimar M, chierico (tomba)*

Lungo individuo umanoide dalla pelle azzurra, e dagli occhi senza pupille.
Venera la Regina dei Corvi, Matrona della Morte.

## Xian

##### Gimmy
{:.no_toc}

![](../assets/img/pg/xian_faccia.webp)

*Goblin M, monaco (ego astrale)*

Goblin cieco, con bende che coprono gli occhi, anche se ha una incredibile
capacità di percepire i dintorni. Dopo l'addestramento nel monastero sui 
Monti Cinerei, viaggia per il mondo per acquisire conoscenza. 
Esperto di medicina.
