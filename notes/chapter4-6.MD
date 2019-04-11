# Interactive Data Visualisation for the Web, Scott Murray

## Chapter 4 - Setup

We need a server to help run our stuff. 
**PYTHON**
2.7 - `python -m SimpleHTTPServer port_number &.`
3   - `python -m http.server port_number &.`
`&.` - runs things in the background  
`jobs` to see whats running in the background  
`kill %job_number` - stop the server  

**PHP**
`php -S localhost:5000` 

xamp, lamp, wamp....

## Chapter 5 - Data
Data - structured information with the potential for meaning.  
most common types - `.txt, .csv, .json`  


first command: Add a paragraph.
`d3.select("body").append("p").text("New paragraph")` 

A breakdown, 
 1. `d3` is the d3 object that has all the functions and items associated with it.  
 2. select the body tag, - give the select method a css selector, it will return the first element in the DOM that matches. Use `selectAll()` if you need all elements.    
 3. add a paragraph to it, - `append()` creates whatever new DOM element you specify and appends it to the end, but just inside the selection. `append()` returns a reference to the new element it just created.   
 4. and within the paragrpah add the text. `text()` takes a string and inserts it between the openeing and closing tags of the current selection (the p ). Existing content would be overwritten.

**Chaining**  
Chain methods together with `.` - can perform multiple actions in one line of code.  
Many D3 methods return a selection, which is what enables the chaining. 
WHEN YOURE CHAINING ORDER MATTERS. 

##### BINDING DATA  
Binding - attaching/associating 
We use d3's `data()` method to bind data.  
we need 2 things to bind data - data, and a selection of elements to bind it to  

get the data 
```javascript  
d3.csv("file_name.csv", function(data) {
    console.log("data");
})
```

`.csv()` takes 2 arguments, a string representing the path of the file, and an anonymous function to be used after.  
 note when data is taken in that each value is a string - so if youre workign with numbers you need to be aware of this.  

 You can add in parser functions that will parse the data as you would like it 
```javascript  
var rowConverter = function(d) {
    return {
        Food: d.Food,
        Deliciousness: parseFloat(d.Deliciousness)
    };
}

d3.csv("food.csv", rowConverter, function(error, data) {
    if (error) {
        console.log(error)
    } else {
        console.log('data');
        // do what you want with data
    }
})
```  

Now that we have our data we can bind it to elements.  
```javascript  
d3.select("body").selectAll("p")
    .data(dataset)
    .enter()
    .append("p")
    .text(function(d) { return d; })
    .style("color", function(d) {
        return (d > 15) ? "red" : "black"; 
    });  
```  

`d3.select('body')` - select the body element and hand it off
`selectAll('p')` - select all the paragraph elements in the body (there arent any so returns an empty selection)  
`.data(dataset)` - counts and parses our data values. The code passed this point is executed for each data value in our dataset.  
`.enter()` - This method looks at the selection (our empty p selection) and the data to bind. if there are more data values than elements `enter()` creates a new placeholder element - and hands off this placeholder to the next method  
`.append("p")` - takes the empty placholder and appends a p element in its place - and hands off that element to the next step.  
`.text()` - takes the handed off element and adds the text to it.   


when you chain methods together anytime after you call `data()` you can create an anonymous function that accepts d as input. The `data()` method ensures tht d is set to the corresponding value in your original dataset.  

## Chapter 6 - Drawing with Data  

##### Drawing with Divs  

```javascript  
var dataset = [5, 10, 15, 20, 25]  
// to create our bar 
d3.select('body').selectAll('div')  
    .data(dataset)  
    .enter()  
    .append('div')  
    .attr('class', 'bar')

```
```css  
div .bar { 
    display : inline-block; 
    width : 20px; 
    height : 75px; /* We'll override height later */ 
    background-color: teal; 
}
``` 
The above is one big rectangle becuase there is no space in between them.
Go into your console and inspect element and you can see each div.  pg 98-99

Add a class to an element using D3 using the `attr()` method.  Different to `.style()`.    
`attr()` - sets DOM attribute values - an HTML Attribute is any property:value pair that you include on a DOM element. (id, calss, width, src, alt)   
`style()` - applies CSS styles directly to an element  
`.attr('class', 'bar')`   
Best only to use `style()` when deviating from the norm.  
`classed('bar', true)` - classed takes the passed in class and either adds it, `true`, or removes it `false`.  

Now our bar charts are all the same height so to override the height and use our data to set the height we can use the `style()` function.  
```javascript  
// add the below to our previous function  

.style('height', function(d) {
    return (d * 5) "px";
})
```  

Changing the dataset adds more to the graph. The magic of `data` it loops through as much as it needs to.  

```javascript  
var dataset = []; //Initialize empty array 
for ( var i = 0 ; i < 25 ; i ++ ) { 
    //Loop 25 times 
    var newNumber = Math.random() * 30 ; //New random number (0-30) 
    dataset.push(newNumber); //Add new number to array }
```  

##### Drawing with SVGs  


Create the SVG:
`var svg = d3.select('body').append('svg');`  
By creating the variable we are able to capture the reference handed back by `append()`  
Think of svg not as a variable but as a reference pointing to the SVG object we just created.  
Now, instead of having to search for the svg every time, `d3.select('svg')` we can use it directly  
`svg.attr('width', 500).attr('height', 50);`  
Its handier to put your `width` and `height` into variables at the top of your code so you can reference them later.  
`var w = 500, h = 50;`  
so our code now becomes:  
```javascript  
var svg = d3.select('body')
            .append('svg')  
            .attr('width', w)
            .attr('height', h)   
```  
Now add some circles  
```javascript  
var circles = svg.selectAll('circle')
                .data([5, 10, 15, 20, 25])
                .enter()
                .append('circle')

circles.attr("cx", function(d, i) {
            return (i * 50) + 25  
        })
        .attr("cy", h/2)
        .attr("r", function(d) {
            return d
        })
```  
cx is the x position of the centre of the circle. 
i here alludes to the convention of using i in for loops - i is the index of the current value
To make i available you must include it in the function definition (d, i).  
cy is the y position value of the centre of the circle. 
Given h is the height h/2 is the center of the SVG.  
Then we set the radius to the value of the current datum.  
we can add colors:
```
.attr('fill', "yellow")
.attr("stroke", "orange")  
.attr("stroke-width", function(d) {
    return d/2;
})  
```  

Back to our bar chart.  
```javascript
var h = 500
var w = 100
var barPadding = 1 
// create an empty SVG element  
// this inserts an svg of the specified height and width into our page
var svg = d3.select('body')
            .append('svg')  
            .attr('width', w)
            .attr('height', h)  

//instead of creating divs we create rects and add them to the svg.  
svg.selectAll('rect')
    .data(dataset)  
    .enter()
    .append()
    // .attr('x', 0) - puts them all in the same place so based on data:
    .attr('x', function(d, i) {
        // return i * 21   // bar width of 20 plus 1 for padding - but hard values arent good
        return i * (w/dataset.length)
    })
    .attr('y', function(d) {
        return h - d
    })
    .attr('height', function(d) {
        // return d but because svg starts at the top this will make bars go from top down
        return d
    })
    // .attr('weight', w)
    .attr('width', w / dataset.length - barPadding)
    .attr('fill', function(d) {
        return "rgb(0, 0, " + Math.round(d * 10) + ")"
    }) // not a particular uselful color encoding but gives an idea. 
```  

Visuals are good but its also good to include values or text in diagrams.  
```javascript  
svg.selectAll('text') 
    .data(dataset)  
    .enter()  
    .append('text')
    .text(function(d) {
        return d
    })
    // over the bars  
    .attr("x", function(d , i) { 
        return i * ( w / dataset .length); 
    }) 
    .attr("y", function(d) { 
        return h - ( d * 4 ); 
    });
    //at top of bars  
    .attr("x", function (d , i) { 
        return i * ( w / dataset .length) + 5 ; // +5 
    }) 
    .attr("y", function(d) { 
        return h - ( d * 4 ) + 15 ; // +15 
    });
    // style so they are legible in the bar  
    .attr("font-family", "sans-serif") 
    .attr("font-size", "11px") 
    .attr("fill", "white");

    // center text
    .attr('text-anchor', 'middle') // SVG attr  

    // change x position so it doesnt contain hard coded vals  
    .attr('x', function(d, i) {
        return i * (w/dataset.length) + (w/dataset.length - barPadding) /2 // set to left edge of bar plus half bar width
    })
```  


#### Scatter Plot  
```javascript  
var dataset = [
    [5, 20],
    [480, 90],
    [250, 50],
    [100, 33],
    [330, 95],
    [410, 12],
    [475, 44],
    [25, 67],
    [85, 21],
    [220, 88] 
];

// like our bar chart we set up our SVG  
var svg = d3.select('body')
            .append('svg')
            .attr('width', w)
            .attr('height', h)  

// instead of rects we create circles  
svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
        return d[0]
    })
    .attr('cy', function(d) {
        return d[1]
    })
    .attr('r', function(d) {
        return 5 
    })
    // as a general rule when visualising quantative values with circles encodoe vals as area, not radius. 
    // but we need to get area and then work out radius and use it that way.  
    // Area = pi * r2  
    // r = sqr(A/pi)  
    // our area val is d[1]
    .attr('r', function(d) {
        return Math.sqrt( (h - d[1])/ Math.PI)  // we could leave out the PI - we're visualising data not doing maths - its the relative area that matters not the actual area    
    })

    // label points  
    svg.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text(function(d) {
            return d[0] + ", " + d[1]
        })
        // now specify where the text should be  
        .attr('x', function(d) {
            return d[0]
        })
        .attr('y', function(d) {
            return d[1]
        })
        //style it  
        .attr('font-family', 'sans-serif')
        .attr('font-size', '11px')
        .attr('fill', 'red')

```