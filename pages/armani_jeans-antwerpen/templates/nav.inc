<nav>
  <ul>
  {% for key,nav in pagevars.nav %}
    <li class="{{ nav['url_alias'] in pagevars.args ? 'active' : '' }}"><a href="{{ pagevars.baseurl }}category/{{ nav['url_alias'] }}">{{ nav['catName'] }}</a></l1>
  {% endfor %}
  </ul>
</nav>

<footer>
  <span class="simpleCart_quantity"></span> 
  <div class="wrapper">
    Cart Value <span class="simpleCart_total"></span> /  <a href="{{ pagevars.baseurl }}cart/view" class="">View Cart</a>
  </div>
</footer>