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
// function used for updating circles group with a transition to make new circles

function renderCircles(circlesGroup,newXScale,chosenXaxis){
  circlesGroup.transition()
  .duration(1000)
  .attr("cx", d => newXScale(d[chosenXaxis]));
  return circlesGroup;
}

function renderText(textsGroup , newXScale,chosenXaxis){
  textsGroup.duration(1000)
  .attr("cx",d => newXScale(d[chosenXAxis]));
  return textsGroup; 
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  
  var label;
  if (chosenXAxis === "poverty") {
    label = "In Poverty(%)";
  }
  else if (chosenXAxis === "age") {
    label = "Age (Median)";
  }
  else {
    label = "Household Income";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([60, -30])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data, this);
    });

  return circlesGroup;
}
