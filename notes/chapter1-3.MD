# Interactive Data Visualisation for the Web, Scott Murray

## Chapter 1 - Why Data Visualisation?

We are pattern recognition machines. Looking at numbers of rows vs a bar chart?  
We are visual.  
Visualisation is a process of mapping information to visuals.   
A picture tells a thousand words  

## Chapter 2 - Introducing D3?
D3 - Data Driven Documents.   

d3js.org  

D3 facilitates generation and manipulation of web documents with data.  
Does this by:  
 * loading data into the browsers memory  
 * Binding data to elements withing the document and creating new elements as needed  
 * Transforming those elements by interpreting each elements bound datum and setting its visual properties accordingly  
 * Transitioning elements between states in response to user input.  

 D3 doesnt generate predefined visualisations. 
 D3 is intended for customized visualisation work  
 Doesnt even try to support older browsers.  
 Doesnt hide your data - youre sharing your data on the browser so it is accessible.  


SERIOUS LIST OF TOOLS IN HERE.  

## Chapter 3 - Technology Fundamentals  
D3 uses CSS style selectors to identify elements on which to operate  
Selectors identify specific elements to which styles will be applied  

**TYPE**  
Simplest selectors. These match the tags/DOM elements of the same name  
`h1, p, em, div` etc  

**DESCENDANT SELECTORS**  
These match elements that are conatined by (or descended from) another element  
`h1 em` - selects `em` elements conatined within `h1` elements  
`div p` - selects all `p` elements that are in `div` elements  

**CLASS SELECTORS**
Select all elements of a specific class:    
`.class_name` 

**ID SELECTORS**  
Select the single element that has this id. Id's should be unique so there should only be one  

You can combine selectors to get very specific results and access very specific elements.  

##### THE SVG ELEMENT  
Scalable Vector Graphics.  
SVG is a text based image format  
Similar to HTML but actually XML based.  
Uninversal Browser support   
Before you can draw anything you must create an SVG element. Its like your canvas.  
HTML does have a canvas element that you can use but sticking with SVG.  

pixels are default measurement so if we dont declare units it defaults to pixels.  
SVG contains a number of visual elements  
 * `rect`  
 * `circle`  
 * `ellipse`  
 * `line`  
     * `x1 y1` start co-ords `x2 y2` end co-ords `stroke` color moust be set for line to be visible    
 * `text`  
     * renders text. `x` is position of the left edge. `y` vertical position of types baseline. 
 * `path`  
     * drawing complex items. 

Its a pixel based co-ordinate system so 0,0 refers to top left  
Increasing x value moves to the right  
increasing y value moves downward.  
```javascript  
<rect x="0" y="0" width="500" height="50" />
<circle cx="250" cy="25" r="25" />
// line - x1 y1 start co-ords x2 y2 end co-ords stroke color moust be set for line to be visible  
<line x1="0" y1="0" x2="500" y2="50" stroke="black" />  
```  

When something runs over the edge of the SVG it gets clipped  

**STYLING**  
 * `fill` - color value - fills the shape/item  
 * `stroke` - color value - the 'border' - except its aligned half in and half out. a 10px stroke would be 5px inside shape and 5px outside 
 * `stroke-width` - numeric - the width of the stroke  
 * `opacity` - 0:transparent - 1:opaque   

 You can style in the SVG or with CSS  
 No layers in SVG, no z-index, 2d.  
