# Interactive Data Visualisation for the Web, Scott Murray

## Chapter 9 - Updates, Transitions, and Motion  
```javascript  
//Width and height
var w = 500;
var h = 100;
var barPadding = 1;

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", function(d, i) {
        return i * (w / dataset.length);
   })
   .attr("y", function(d) {
        return h - (d * 4);
   })
   .attr("width", w / dataset.length - barPadding)
   .attr("height", function(d) {
        return d * 4;
   })
   .attr("fill", function(d) {
        return "rgb(0, 0, " + Math.round(d * 10) + ")";
   });

svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
        return d;
   })
   .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
   })
   .attr("y", function(d) {
        return h - (d * 4) + 14;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white");
```

##### Ordinal scales  
Ordinal sclaes are typically used for ordinal data, usually categories with some inherent order to them. 
`scaleBand` is a specific type of ordinal scale.  
For an ordinal scale you dont set the low and high values, but specify an array with the category names.  

```javascript  
var xScale = d3.scaleBand()
                .domain(d3.d3.range(dataset.length)) 
                .d3.range([0, w])
                .paddingInner(0.05)

svg.selectAll("rect")
               .data(dataset)
               .enter()
               .append("rect")
               .attr("x", function(d, i) {
                    return xScale(i);
               })
               .attr("y", function(d) {
                    return h - yScale(d);
               })
               .attr("width", xScale.bandwidth())
               .attr("height", function(d) {
                    return yScale(d);
               })
               .attr("fill", function(d) {
                    return "rgb(0, 0, " + Math.round(d * 10) + ")";
               });
```  
Using the `paddingInner` and adding padding directly to the chart means we can use the `bandwidth()` function to do the maths on the bar width for us.  


## Updating  
```javascript  
function createNewData(numDataPts) {
    var dataset = [];                   //Initialize empty array
    var numDataPoints = numDataPts;             //Number of dummy data points to create
    var xRange = Math.random() * 100;  //Max range of new x values
    var yRange = Math.random() * 100;  //Max range of new y values
    for (var i = 0; i < numDataPoints; i++) {                   //Loop numDataPoints times
        var newNumber1 = Math.floor(Math.random() * xRange);    //New random integer
        var newNumber2 = Math.floor(Math.random() * yRange);    //New random integer
        dataset.push([newNumber1, newNumber2]);                 //Add new number to array
    }
    return dataset
}
````

We need something to trigger the update, some interaction. We'll use an event listener.  
An event listener is an anonymous function that listens for a pecific event on a specific element or elements.  
```javascript  
d3.select('p')
    .on('click', function() {
        // your code here. 
        // change the dataset and bind new data
        // update the graph
        var newData = createNewData(20)
        svg.selectAll("rect")
            .data(dataset)
            .attr("y", function(d) { 
                return h - yScale(d); 
            })
            .attr("height", function(d) { 
                return yScale(d); 
            });
    })
```
The data updated and was rebound but we labels and bar colors were not.  
update color:  
`.attr("fill", function(d) { return "rgb(0, 0, " + Math.round(d * 10) + ")" ; });`  
To update the lables we need to adjust their text content and their x and y vals.  
```javascript  
svg.selectAll("text")
    .data(dataset)
    .text(function(d) { 
        return d ; 
    })
    .attr("x", function(d, i) { 
        return xScale (i) + xScale.bandwidth() / 2 ; 
    })
    .attr("y", function(d) { 
        return h - yScale ( d) + 14 ; 
    });
```  

##### Transitions  
to smooth the transition all you need to do is add one simple function:  
`.transition()`  
Add this link to your chain where your selection is made above where your changes are made.  
`duration()` will give you control of how quickly the transition happens.  
Transitions can only operate on values that already exist. 
Set an initial value before transitioning to a new value.  

The quality of motion used for a transition is called easing.  
`ease()` must be specified after transition but before attr. Can come before or after duration.  

`delay()` specifies when the transition begins.  
Dynamic delays can be used to trigger transitions one after another. 


##### Updating Scale.  
Our scale needs to be updated whenever the dataset is updated. Whenever we plug in new data values, we should also recalibrate our scale to ensure that bars dont get too tall or short.  
When updating the scale all we need to do is update the domain. The range should stay the same (unless you want to change it)  
`yScale.domain([0, d3.max(newData)]);`  

You can update Axes similarly

##### Updating 
Select  
Update data  
Transition  
Duration  
extras  

##### Transition triggers  
Sometimes you might want to do something on a transition start or a transition end.  
Use the `on()` function.
`on()` takes 2 args:  
 1. "start" or "end"  
 2. an anonymous function to be executed either at the start or at the end.  

`this` in the anonymous function refers to the current element. helpful because:  
```javascript  
.on("start", function() {
    d3.select(this)
        .attr('fill', 'magenta')
        .attr("r", 3)
})
```  
**Only one transition can be active on any given element at any given time. Newer transitions will interrupt and override older transitions.**  

You can also just chain transitions together.  

##### Containing visual Elements with Clippath  
A clipping path (called a mask in other programs) is an SVG element that contains visual elements that, together, make up the clopping path or mask to be applied to other elements. When a mask is applied to an eleent, only the pixels that land within that masks shape are displayed.  
Much like `g`, `clipPath` has no visual prescence of its own, but it contains visual elements.  
```html  
<clipPath id="chart-area">  
    <rect x="30" y="30" width="410" height="240"></rect>
</clipPath>
```
So there are three steps to using a clipPath:  
 1. Define the `clipPath` and give it an ID  
 2. Put visual elements within the clipPath  
 3. Add a reference to the clipPath from whatever els you wish to be masked.  

```javascript  
// define clippinng area  
// make a clippath and assign an id for later reference
// within the clipPath create a rectangle and set its position and size
svg.append('clipPath')  
    .attr('id', 'chart-area')  
    .append('rect')  
    .attr('x', padding)  
    .attr('y', padding)  
    .attr('width', w-padding*3)  
    .attr('height', h-padding*2)

// create circles  
// instead of adding all circles to clipPath add them to a g and then add that to clipPath  
svg.append('g')  
    .attr('id', 'circles')  
    .attr('clip-path', 'url(#chart-area)')
    .selectAll('circle')  
    .data(dataset)  
    .enter()  
    .append('cirlce')   
```  

### Other Updating  
**Adding a new value to our data**  
Generate a new number and add it to our dataset.  
New data point means new bar which means we need to update our scale.  
`xScale.domain(d3.range(dataset.length));`  
`select` returns a `selection` but so too does `data()`.  
So we can select all the bars and then rebind the new data to those bars and grab the update selection all in one go.  
`var bars = svg.selectAll('rect').data(dataset)`;  

When we changed our data values but not the length of the dataset we didnt have to worry about an update selection, we just rebound the data and transitioned to the new data. 
Now we have added a new value. So dataset.length is now 21. 
Whenever there are more data values than DOM elements the `enter()` selection contains references to elements that dont yet exist.  
We have seen:  
`selectAll()` -> `data()` -> `enter()` -> `append()`  
We can now use `enter()` to update our new element.  
```javascript  
bars.enter()  
    .append('rect')  
    .attr('x', w)  
    .attr('y', function(d) {
        return h - yScale(d)
    })  
    .attr('width', xScale.bandwidth())  
    .attr('height', function(d) {
        return yScale(d)
    })  
    .attr('fill', function(d) {
        return 'rgb(0, 0, '+Math.round(d * 10)+')'
    })
```  
bars contains the updated data so it has one new element so `enter()` gets that new reference and then appends it to the DOM.  
In this case the new bar has an `x` value of `w` so is out of sight in the SVG  
The code above contains the new rect. We can now merge it with all the others using `merge()`  
```javascript  
.merge(bars)    // merge it with all the others  
.transition()  
.duration(500)  
.attr('x', function(d, i) {
    return xScale(i) 
})
.attr('y', function(d) {
    return h - yScale(d)
})  
.attr('width', xScale.bandwidth())  
.attr('y', function(d) {
    return yScale(d)
})
```

**Removing values from our data**  
`exit()`  
We can use `shift()` to remove the first element from the dataset or `pop()` to remove the last
`remove()` is a special transition method that waits until the transition is complete and then deletes the element from the DOM forever  
Its good practice to perform a transition first rather than simply removing elements straight away. 
The below does not remove labels or update bar colours. 
Even though we are removing the first elements of the dataset its the bar on the very right that is being removed.  
The values are updating correctly but the bars and graph are not.
```javascript  
bars.exit()  
    .transition()  
    .duration(500)  
    .attr('x', w)  
    .remove()
```

#### Data Joins  
A data join happens whenever you bind data to DOM elements - everytime you call `data()`  
The default join is by index order; first datum is bound to the first DOM element.  
Use a key function to move away from the above. 
Instead of an array we now have an array of objects and instead of using `d` we need to use `d.value`.  
Define a key function  
Then use the key function in the data function
```javascript  
var key = function(d) {
  return d.key;
}  
.data(dataset, key)     // include key function here. 

// set bar to go off the left of the graph  
bars.exit()  
  .transition()  
  .duration(500)  
  .attr('x', -xScale.bandwidth())  
  .remove()
```

 * `data()` binds data to elements, but also returns the update selection  
 * The update selection can contain `enter` and `exit` selections which can be accessed via `enter()` or `exit()`  
 * `merge()` is used to merge the enter and update selections.  
 * Data joins determine how values are matched with elements - defaults to index  
 