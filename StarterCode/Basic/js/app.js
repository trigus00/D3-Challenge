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

  // //create scale functions for x and y 
  // var xLinearScale = d3.scaleLinear()
  //                    .domain([10,d3.max(heathdata,d => d.poverty)])
  //                    .range([0,width]);
  // var yLinearScale = d3.scaleLinear()
  //                    .domain([0,d3.max(heathdata,d => d.healthcare)])
  //                    .range([height,0]);

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   if (chosenXAxis === "poverty") {
//     var label = "Poverty (%):";
//   }


//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }

// Retrieve data from the CSV file and execute everything below

d3.csv("/StarterCode/Basic/data/healthdata.csv").then(function(healthdata){
  console.log(healthdata);

  healthdata.forEach(function(data){
  
    
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty
    data.abbr = data.abbr
    data.state = +data.state
    data.id = +data.id
 
    
  });
  // xLinearScale function above csv import
  var xLinearScale = d3.scaleLinear()
                     .domain([7,d3.max(healthdata,d => d.poverty)])
                     .range([0,width]);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
                      .domain([0, d3.max(healthdata, d => d.healthcare)])
                      .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
chartGroup.append("g")
          .classed("x-axis", true)
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);

  // append y axis
chartGroup.append("g")
          .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
                               .data(healthdata)
                               .enter()
                               .append("circle")
                               .attr("cx", d => xLinearScale(d.poverty))
                               .attr("cy", d => yLinearScale(d.healthcare))
                               .attr("r", "10")
                               .attr("fill", "lightblue")
                               .attr("opacity", ".5");

  var textGroup = circlesGroup.selectAll("text")
                            .data(healthdata)
                            .enter()
                            .append("text")
                            .style("fill", "black")
                            .attr('x',d => xLinearScale(d.poverty))
                            .attr('y',d => yLinearScale(d.healthcare))
                            .attr("cy", "10px") 
                            .attr("cx", "10px ") 
                            .attr("text-anchor", "middle")
                            .text(d => d.id);
                            console.log(healthdata)
    
// append y axis
  chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("axisText", true)
            .text("Lacks Healthcare (%)");
// append x axis
  chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");

}).catch(function(error) {
  console.log(error);
});