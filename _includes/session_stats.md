{% if include.format %}
    {% assign format = {{include.format}} %}
{% else %}
    {% assign format = "webp" %}
{% endif %}
{% capture attendance %}/assets/img/gen/{{ include.prefix }}attendance.{{ format }}{% endcapture %}
{% capture levelup %}/assets/img/gen/{{ include.prefix }}levelup.{{ format }}{% endcapture %}
{% capture has_attendance %}{% file_exists {{ attendance }} %}{% endcapture %}
{% capture has_levelup %}{% file_exists {{ has_levelup }} %}{% endcapture %}

<h4 class="collapsible coll-blank" id="stats">Statistiche</h4>
<div class="collapsible-content bordered hidden" markdown="1">

{% if has_attendance == "true" %}
![]({{attendance}})
{% endif %}
{% if has_levelup == "true" %}
![]({{levelup}})
{% endif %}
</div>

<br>