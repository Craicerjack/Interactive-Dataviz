# D3 - Data Driven Documents  

### NOTES
Using D3 version 4
Not using ES2015 - just trying to keep it simple with what people might know. 
PHP server or Python Server


### WORKSHOP

D3 is built on top of several common web standards:
 * HTML (HyperText Markup Language) 
 * CSS  (Cascading Style Sheets)
 * The DOM (Document Object Model)  
 * SVG (Scalable Vector Graphics)  

```html
<div>
  <p>Normal paragraph</p>

  <p class="red">Red paragraph</p>
</div>

<ol>
  <li id="some-id">Unique element</li>
  <li>Another list element</li>
  <li>
    <p>Paragraph inside list element</p>
    <p>Second paragraph</p>
  </li>
</ol>
```
    
```javascript
// DOM API
document.getElementById('some-id');
// <li id="some-id">Unique element</li>
document.getElementsByTagName('p').length;
// 4
var reds = document.getElementsByClassName('red');
// [<p class="red">Red paragraph</p>]
reds[0].innerText
// "Red paragraph"
    

// D3 Selection API
d3.select('p').size(); // select() only finds one
// 1
d3.selectAll('p').size(); // selectAll() finds all
// 4
var reds = d3.selectAll('.red');
// [ > Array[1] ]
reds.text();
// "Red paragraph"


// DOM API
var clickMe = document.getElementById('click-me');
clickMe.onclick = function() {
  if (this.style.backgroundColor) {
    this.style.backgroundColor = '';
  } else {
    this.style.backgroundColor = 'red';
  }
}

// D3 Selection API. Note: it attaches the
// callbacks to each element in the selection
d3.selectAll('.hover-me')
  .on('mouseover', function() {
    this.style.backgroundColor = 'yellow';
  })
  .on('mouseleave', function() {
    this.style.backgroundColor = '';
  });

```   

### SVG  

SVG is an XML format used for drawing. 
Think of it in the same terms as the DOM; 
 * there are elements with parents and children and attributes  
 * you can respond to mouse/touch events  
 * CSS selectors and styles can be applied 
 * CSS - attribute/selector names might be different  

```
<svg width="300" height="180">
  <circle cx="30"  cy="50" r="25" />
  <circle cx="90"  cy="50" r="25" class="red" />
  <circle cx="150" cy="50" r="25" class="fancy" />

  <rect x="10"  y="80" width="40" height="40"
    fill="steelBlue" />
  <rect x="70"  y="80" width="40" height="40"
    style="fill: steelBlue" />
  <rect x="130" y="80" width="40" height="40"
    class="fancy" />
</svg>
    

.red {
  fill: red; /* not background-color! */
}

.fancy {
  fill: none;
  stroke: black; /* similar to border-color */
  stroke-width: 3pt; /* similar to border-width */
  stroke-dasharray: 3,5,10;
}
```
Where HTML has the <div> and <span> tags, SVG has the <g> tag for an arbitrary group
The <text> tag is good for simple labels. The <path> tag is powerful but complex, it can be used for either lines or arbitrary filled-in shapes depending on the styling.

D3 employs a declarative approach, operating on arbitrary sets of nodes called selections.

```
var paragraphs = document.getElementsByTagName("p");
for (var i = 0; i < paragraphs.length; i++) {
  var paragraph = paragraphs.item(i);
  paragraph.style.setProperty("color", "white", null);
}

d3.selectAll("p").style("color", "white");
```  

Using D3’s enter and exit selections, you can create new nodes for incoming data and remove outgoing nodes that are no longer needed. 
```
d3.select("body")
  .selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
  .enter().append("p")
    .text(function(d) { return "I’m number " + d + "!"; });
``` 

Updating nodes are the default selection—the result of the data operator. Thus, if you forget about the enter and exit selections, you will automatically select only the elements for which there exists corresponding data. A common pattern is to break the initial selection into three parts: the updating nodes to modify, the entering nodes to add, and the exiting nodes to remove.   
```
// Update…
var p = d3.select("body")
  .selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
    .text(function(d) { return d; });

// Enter…
p.enter().append("p")
    .text(function(d) { return d; });

// Exit…
p.exit().remove();
```  
By handling these three cases separately, you specify precisely which operations run on which nodes. This improves performance and offers greater control over transitions. For example, with a bar chart you might initialize entering bars using the old scale, and then transition entering bars to the new scale along with the updating and exiting bars. 


