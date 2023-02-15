[Torna a campagna](./campaign.md)

<style>
p {
    
}
</style>

# Sessioni
{:.no_toc}

Recap delle sessioni.

* Indice
{:toc}

{% for file in site.static_files %}
{% if file.path contains "/xho/includes/sessioni/" %}
{% assign file_name = file.path | remove:  "/xho/" %}
{% include_relative {{ file_name }} %}
{% endif %}
{% endfor %}