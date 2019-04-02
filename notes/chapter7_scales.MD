# Interactive Data Visualisation for the Web, Scott Murray

## Chapter 7 - Scales  

**Scales are functions that map from an input domain to an output range**  

The values in any dataset are unlikely to correspond exactly to pixel measurements for use in your visualisation.  
Scales provide a convenient way to map your data values to new values that are more suited to our visualisation.  

D3 scales are _functions_ with params that you define. Once they are created, you call the `scale()` function and pass it a data value and it returns your scaled output value. You can define and use as many scales as you like.  
A scale is a mathmatical relationship, with no direct visual output. 

Axes are visual representations of scales but its best to think of the two as related but different.  

There are a few different types of scales:
 * linear  
 * `scaleOrdinal` - nonquantitative scale  
 * `schemeCategory10`, `schemeCategory20`, ect - handy preset ordinal scales that output 10 or 20 categorical colors.   
 * `scaleLog` - a logarithmic scale  
 * `scaleSqrt` - a square root scale  
 * `scalePow` - a power scale - exponential  
 * `scaleQuantize` - a linear scale with discrete values for its output range, for when you want to sort data into buckets  
 * `scaleQuantile` - a linear sclae with discrete values for its input domain, for when you want already have buckets  
 * `scaleTime` - a scale method for date and time values  
 * etc  

Weve been mapping data values directly to pixels so far, but what happens when your data values become huge?  

##### Domains and Ranges  
Normalization.

Input domain is the range of data youre passing in. 
Output range is the range, you have chosen, of your output

Input = Domain
Output = Range  

The dataset looks to have a domain of 0-500 but hardcoding is rarely a good idea. 
d3 has methods to help with that:
`d3.min()` and `d3.max()`.
Pass in the dataset that you want to get the max from but because our dataset is an array of arrays we need to tell it which value to use.  
To tell max which specific values we want we need to pass an _accessor_ function

```javascript  
var scale = d3.scaleLinear()
                .domain([100, 500]) // input  
                .range([10, 350])   // output  

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

d3.max(dataset, function(d) {
    return d[0]
})

// So to set up our xScale and yScale
var xScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, function(d) { return d[0] } )]) 
                .range([0, w])   // output 

var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, function(d) { return d[1] } )]) 
                .range([0, h])   // output 

// scales are now in place so all we need to do is use them.  
ar svg = d3.select('body')
            .append('svg')
            .attr('width', w)
            .attr('height', h)  

// instead of rects we create circles  
svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
        return xScale(d[0])
    })
    .attr('cy', function(d) {
        return yScale(d[1])
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
            return xScale(d[0])
        })
        .attr('y', function(d) {
            return yScale(d[1])
        })
        //style it  
        .attr('font-family', 'sans-serif')
        .attr('font-size', '11px')
        .attr('fill', 'red')

// to change the issue with high y figures now being at the bottom we can change our range
.range(h, 0)

// now incorporate padding to push circles in from the edge
var padding = 20
xScale.range([padding, w-padding * 2])
yScale.range([h - padding, padding]) 
```

Padding done in the above way is simple yet can be problematic. Mike Bostock uses a marging convention that can be found here 
https://bl.ocks.org/mbostock/3019563  
We can also set up a custom radius scale. Again because we only need a realtional area and not an exact one we can create our own scale.
This scale will guarantee that all are datapoints are shown as even a 0 value will be represented by a range value of 2  
```javascript  
var rScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, function(d) { return d[1] } )])
                .range([2, 5])

// and then set the radius
.attr('r', function(d) {
    return rScale(d[1])
})
```
To see the power of scales, add an outlier to our data [600, 150] and watch how the graph copes with it.  
Then change the height of the graph

`d3.scaleLinear()` has some other methods worthy of mentioning:

 * `nice()` - tells scale to take whatever input domain that you gave it and expand both ends to nearest round value. This can be useful for readability.  
 * `rangeRound()` - use instead of `range()` and all vals output by the scale will be rounded to nearest whole number.  
 * `clamp()` - a linear scale can return a val outside of range when you pass a val outside of domain. Calling `clamp(true)` on a scale forces all values to be within the specified range.   
 * to use any of the above functions just chain them to the end of the scale.  

## Dates  
JavaScript and D3 can only perform time and date calculations on `Date` objects so working with dates in D3 involves:

 1. Converting strings to `Date` objects  
 2. Using time sclaes as needed  
 3. Formatting `Date` objects as human-friendly strings, for display to the user. 

`var parseTime = d3.timeParse("time parsing fomat") // "%d/%m/%y"`  
https://github.com/d3/d3-time-format#locale_format  
```javascript  
//Function for converting CSV values from strings to Dates and numbers 
var rowConverter = function(d) { 
    return { 
        Date: parseTime(d.Date), 
        Amount: parseInt(d.Amount) 
    }; 
}

// scaling time
xScale = d3.scaleTime()
            .domain([ 
                d3.min(dataset, function(d) { return d.Date; }), 
                d3.max(dataset, function(d) { return d.Date ; }) 
            ])
            .range ([ padding , w - padding ]);

// use it  
.attr("cx", function(d) { return xScale ( d . Date ); })

//For converting Dates to strings 
var formatTime = d3.timeFormat("%b %e");
.text(function(d) { 
    return formatTime(d.Date); 
})
```