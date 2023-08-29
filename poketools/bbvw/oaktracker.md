---
layout: simple
---

<link rel="stylesheet" href="{{ '/assets-submodule/css/font/dsui.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets-submodule/css/wild_enc.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/pokemon-tracker.css' | relative_url }}">

[Back to index](/poketools)

# Blaze Black / Volt White 2 Redux 
## Prof. Oak Challenge Tracker

<h4 class="collapsible">Info</h4>
<div class="collapsible-content hidden" markdown=1>
A Professor Oak challenge is a challenge run where you must catch all available pokemon in each route, as you progress through the game, and eventually fill the Pokedex.

This is a (currently very simple) tracker with the encounter data as a table, and a checkbox for each Pokemon. The checkboxes are synced, meaning if you check a Pokemon all checkboxes for that Pokemon will be checked. This _should_ persist after closing the page, etc.
</div>

{% include poketools/wild-area-buttons.liquid %}

### Main story

{% include poketools/wild-area-tracker.liquid id="main" %}

---

### Postgame

{% include poketools/wild-area-tracker.liquid id="postgame" %}

{% include poketools/wild-area-scripts.liquid %}