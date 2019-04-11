function createNewArrayData(numDataPts) {
    var dataset = [];                   //Initialize empty array
    var xRange = Math.random() * 100;  //Max range of new x values
    for (var i = 0; i < numDataPts; i++) {                   //Loop numDataPoints times
        var newNumber1 = Math.floor(Math.random() * xRange);    //New random integer
        var newNumber2 = Math.floor(Math.random() * xRange);    //New random integer
        dataset.push([newNumber1, newNumber2]);                 //Add new number to array
    }
    return dataset
}

function createNewData(numDataPts) {
    var dataset = [];                   //Initialize empty array
    var xRange = Math.random() * 100;  //Max range of new x values
    for (var i = 0; i < numDataPts; i++) {                   //Loop numDataPoints times
        dataset.push(Math.floor(Math.random() * xRange));                 //Add new number to array
    }
    return dataset
}
