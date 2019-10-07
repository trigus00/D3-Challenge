var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(healthdata, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthdata, d => d[chosenXAxis]) * 0.8,
      d3.max(healthdata, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "Poverty % ";
  }
  else {
    var label = " Age ";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.poverty}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
  if (err) throw err;
    // console.log(data)
    // parse data
  data.forEach(function(data) {
   data.poverty = +data.poverty;
   data.healthcare = +data.healthcare;
   data.obesity = +data.obesity;
   data.smokes = +data.smokes;
   data.age = +data.age;
   data.income = +data.income;

  });


  var xLinearScale = xScale(data, chosenXAxis);

  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.obesity)])
  .range([height, 0]);

// Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
 
 // append x axis 
 var xAxis = chartGroup.append("g")
                       .classed("x-axis",true)
                       .attr("transfor",`translate(0,${height})`)
                       .call(bottomAxis);
// append y axis 
chartGroup.append("g")
          .call(leftAxis);

var circlesGroup = chartGroup.selectAll("circle")  
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", d => xLinearScale(d[chosenXAxis]))
                            .attr("cy", d => yLinearScale([d.obesity]))
                            .attr("fill","lightblue")
                            .attr("opacity",".5")

                              // Create group for  2 x- axis labels
var labelsGroup = chartGroup.append("g")
                            .attr("transform", `translate(${width / 2}, ${height + 20})`);
                            
var povertyLabel = labelsGroup.append("text")
                            .attr("x", 0)
                            .attr("y", 20)
                            .attr("value", "poverty") // value to grab for event listener
                            .classed("active", true)
                            .text("Poverty % ");
                            
var ageLabel = labelsGroup.append("text")
                            .attr("x", 0)
                            .attr("y", 40)
                            .attr("value", "age") // value to grab for event listener
                            .classed("inactive", true)
                            .text("Age");
                            chartGroup.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 0 - margin.left)
                            .attr("x", 0 - (height / 2))
                            .attr("dy", "1em")
                            .classed("axis-text", true)
                            .text("Obesity");
                        
                        

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


                        
                            


                        

// x axis labels event listener
labelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    xLinearScale = xScale(data, chosenXAxis);

    // updates x axis with transition
    xAxis = renderAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenXAxis === "poverty") {
        povertyLabel
        .classed("active", true)
        .classed("inactive", false);
        obesityLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
        povertyLabel
        .classed("active", false)
        .classed("inactive", true);
        obesityLabel
        .classed("active", true)
        .classed("inactive", false);
    }
  }
});

 
}).catch(function(error) {
  console.log(error);
});

