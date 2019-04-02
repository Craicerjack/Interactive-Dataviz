# Interactive Data Visualisation for the Web, Scott Murray

## Chapter 8 - Axes  
Axes are functions whose params you define. 
Unlike scales when an axis function is called, it doesnt return a value but generates the visual elememnts of the axis, including lines, labels, and ticks.  
Axis functions are SVG-specific, as they generate SVG elements.   
Axes are intended for use with quatative scales.  

There are 4 different axis function constructors:
 1. d3.axisTop  
 2. d3.axisBottom  
 3. d3.axisLeft  
 4. d3.axisRight  

Vertical axes - left and right  
Horizontal axis - top and bottom  
At a minimum each axis needs to be told on what scale to operate
To actually generate the axis and insert it into the svg we need to call it. 
Similar to scales where they are first comfigured and then called. 

```javascript  
var xAxis = d3.axisBottom()
                .scale(xScale)

// shortened, it can be  
var xAxis = d3.axisBottom(xScale)  
svg.append('g')
    .attr('class', 'axis')
    .call(xAxis)
```  

in SVG's a `g` element is a group element. 
Group elements are invisible/have no visual presence themselves.  
They are good for grouping elements together.  
We can apply transformations to g element, which can affect the elements within that group.  
Its good practice to add a class to your axes, it can help when graphs become complex  

#### D3 call 
D3's `call()` function takes the incoming selection, as received from the prior link in the chain, and hands that selection off to any function.  
In this case our g element.  

again because of SVG conventions our axis is at the top
this is where transformations come in  
```javascript  
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, '+ (h-padding)+')')
    .call(xAxis)
```

Translation transforms are specified with the syntax `translate(x, y)`  
so in the above we are pushing our axes to the bottom of the graph.  
`(h - padding)` - the groups top edge is set to `h`, the height of the entire image, minus the padding value we created earlier.  
`h -padding` is claculated to be 280 so that our final attr call is `.attr('transform', 'translate(0, 280)')`  

we can now use our class to style the axis element. 

```css
.axis path, 
.axis line {
    stroke: teal;
    shape-rendering: crispEdges;
}
.axis text {
    font-family: Optima,
    Futura , sans-serif ; font-weight: bold;
    font-size: 14px;
    fill: teal;
}
```  

#### Ticks  
D3 will auto add ticks but you can customize yourself.  

```javascript  
var xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(5)

var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5)

// shortened, it can be  
var xAxis = d3.axisBottom(xScale)  
svg.append('g')
    .attr('class', 'axis')
    .call(xAxis)

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate('+ padding +', 0)')
```
D3 will add extra ticks despite what you pass in if it makes sense, so that the ticks arent being added to strange data points.  
You can specify tick values manually  
`.tickValues([0, 100, 250, 600])`  

`tickFormat()`  
specify how to format labels.  
```javascript 
// set up formatter and then call it  
var formatAsPercentage = d3.format('1%')
xAxis.tickFormat(formatAsPercentage)
```

#### Time Based Axes  
See chapter 8 folder.  
