[Torna a campagna](./campaign.md)

# Sessioni
{:.no_toc}

Recap delle sessioni.

* Indice
{:toc}

{% for file in site.static_files %}
{% if file.path contains "/star/includes/sessioni/" %}
{% assign file_name = file.path | remove:  "/star/" %}
{% include_relative {{ file_name }} %}
{% endif %}
{% endfor %}