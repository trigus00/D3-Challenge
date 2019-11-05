var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 200,
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

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

  
//updating x-scale var upon clicking on axis label
function xscale(healthdata, chosenXAxis) {
  // creating scale 
  var xLinearScale = d3.scaleLinear()
                        .domain([d3.min(healthdata, d => {
                          return d[chosenXAxis];
                        }) * 0.8,
                     d3.max(healthdata, d => {
                       return d[chosenXAxis];
                     }) * 1.2])
                       .range([0, width]);

return xLinearScale;

}

// updating y-scale var upon clicking on axis label
function yscale(healthdata, chosenYAxis) {
  //create scales
  var yLinearScale = d3.scaleLinear()
                       .domain([d3.min(healthdata, d => {
                         return d[chosenYAxis];
                       }) * 0.8,
                    d3.max(healthdata, d => {
                      return d[chosenYAxis];
                    }) * 1.2])
                      .range([height, 0]);

  return yLinearScale;
}
// Updating xAxis click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
                
                xAxis.transition()
                     .duration(1000)
                     .call(bottomAxis);

  return xAxis;
}
//updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
  let leftAxis = d3.axisLeft(newYScale);
              
              yAxis.transition()
                   .duration(1000)
                   .call(leftAxis);

  return yAxis;
}
// updating the circles in transition whether it's x or y axis 

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis ){
    circlesGroup.transition()
                .duration(1000)
                .attr("cx", data => {
                  return newXScale(data[chosenXAxis]);
                })
                .attr("cy", data => {
                  return newYScale(data[chosenYAxis]);
                });
                
                return circlesGroup;
}

//updating the labels when it's in transition
function renderText(textGroup, newXScale, chosenXAxis, newYScale , chosenYAxis ){
     textGroup.transition()
              .duration(1000)
              .attr("x", t => {
                return newXScale(t[chosenXAxis]);
              })
              .attr("y", t => {
                return newYScale(t[chosenYAxis]);
              });
              return textGroup;
}


function updateTooltip(chosenXAxis,chosenYAxis,circlesGroup){
  // choosing x axis 
          if(chosenXAxis ==='poverty'){
            var xLabel= "In Poverty (%) ";
          }
          //income
          else if (chosenXAxis ==='income'){
            var xLabel = "Median Income";
          }
          //age
          else {
            var xLabel = "age";
          }
          // low in healthcare
          if(chosenYAxis === 'healthcare'){
            var yLabel = "No Healthcare";
          }
          //obesity
          else if (chosenYAxis === 'obesity'){
            var yLabel = "Obesity";
          }
          //Smokers
          else {
            var yLabel = "Smokers";
          }

          var toolTip = d3.tip()
                          .attr("class", "tootip")
                          .offset([-8, 0])
                          .html(function(d) {
                            return (`${d.state}<br>${xLabel} ${(d[chosenXAxis],chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
                          });


            circlesGroup.call(toolTip);

            //add events
            circlesGroup.on("mouseover", function(data) {
              toolTip.show(data, this);
            })
            
              .on("mouseout", function(data, index) {
                toolTip.hide(data, this);
              });       

  return circlesGroup;

}

//function to style x-axis values for tooltips


// parse the data 

d3.csv("/StarterCode/Bonus/data/healthdata.csv").then(function(healthdata){
  console.log(healthdata);

  healthdata.forEach(function(data){
  
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty
    data.income = +data.income;
    
  });

// creating scales : https://www.tutorialsteacher.com/d3js/scales-in-d3

  let xLinearScale = xscale(healthdata,chosenXAxis);
  let yLinearScale = yscale(healthdata,chosenYAxis);
  
  //create axis functions y and x axis

  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  // add x axis to chart 
  var xAxis = chartGroup.append("g")
                        .classed("x-axis", true)
                        .attr("transform", `translate(0, ${height})`)
                        .call(bottomAxis);

  //append y axis
  
  var yAxis = chartGroup.append("g")
                        .classed("y-axis", true)
                        .call(leftAxis);


  //append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
                               .data(healthdata)
                               .enter()
                               .append("circle")
                               .classed("stateCircle", true)
                               .attr("cx", data => {
                                 return xLinearScale(data[chosenXAxis]);
                               })
                               .attr("cy", data => {
                                 return yLinearScale(data[chosenYAxis]);
                               })
                               .attr("r", 12)
                               .attr("opacity", ".5");

//append initial text
var textGroup = chartGroup.selectAll(".stateText")
                          .data(healthdata)
                          .enter()
                          .append("text")
                          .classed("stateText", true)
                          .attr("x", d => {
                            return xLinearScale(d[chosenXAxis]);
                          })
                          .attr("y", d => {
                            return yLinearScale(d[chosenYAxis]);
                          })
                          .attr("dy", 3)
                          .attr("font-size", "10px")
                          .text(function(d){
                            return d.abbr});

//create group for 3 x-axis labels
var xLabelsGroup = chartGroup.append("g")
                             .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

var povertyLabel = xLabelsGroup.append("text")
                               
                               .classed("active", true)
                               .attr("x", 0)
                               .attr("y", 20)
                               .attr("value", "poverty")
                               .text("In Poverty (%)");

var ageLabel = xLabelsGroup.append("text")
                           
                           .classed("inactive", true)
                           .attr("x", 0)
                           .attr("y", 40)
                           .attr("value", "age")
                           .text("Age (Median)")

var incomeLabel = xLabelsGroup.append("text")
                             
                              .classed("inactive", true)
                              .attr("x", 0)
                              .attr("y", 60)
                              .attr("value", "income")
                              .text("Household Income (Median)")

//create group for 3 y-axis labels
var yLabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

var healthcareLabel = yLabelsGroup.append("text")
                                 
                                  .classed("active", true)
                                  .attr("x", 0)
                                  .attr("y", 0 - 20)
                                  .attr("dy", "1em")
                                  .attr("transform", "rotate(-90)")
                                  .attr("value", "healthcare")
                                  .text("Lacks Healthcare (%)");

var smokesLabel = yLabelsGroup.append("text")
                              
                              .classed("inactive", true)
                              .attr("x", 0)
                              .attr("y", 0 - 40)
                              .attr("dy", "1em")
                              .attr("transform", "rotate(-90)")
                              .attr("value", "smokes")
                              .text("Smokes (%)");

var obesityLabel = yLabelsGroup.append("text")
                               
                               .classed("inactive", true)
                               .attr("x", 0)
                               .attr("y", 0 - 60)
                               .attr("dy", "1em")
                               .attr("transform", "rotate(-90)")
                               .attr("value", "obesity")
                               .text("Obese (%)");

//updateToolTip function with data
var circlesGroup = updateTooltip(chosenXAxis, chosenYAxis, circlesGroup);

xLabelsGroup.selectAll("text")
.on("click", function() {
    //get value of selection
    var value = d3.select(this).attr("value");

    //check if value is same as current axis
    if (value != chosenXAxis) {

        //replace chosenXAxis with value
        chosenXAxis = value;
        //console.log(chosenXaxis)

        //update x scale for new data
        xLinearScale = xScale(healthdata, chosenXAxis);

        //update x axis with transition
        xAxis = renderAxesX(xLinearScale, xAxis);

        //update circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update text with new x values
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update tooltips with new info
        circlesGroup = updateTooltip(chosenXAxis, circlesGroup);

        //change classes to change bold text
        if (chosenXAxis === "poverty") {
            povertyLabel.classed("active", true).classed("inactive", false);
            ageLabel.classed("active", false).classed("inactive", true);
            incomeLabel.classed("active", false).classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", true).classed("inactive", false);
            incomeLabel.classed("active", false).classed("inactive", true);
        }
        else {
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", false).classed("inactive", true);
            incomeLabel.classed("active", true).classed("inactive", false);
        }
    }
});

//y axis labels event listener
yLabelsGroup.selectAll("text")
.on("click", function() {
//get value of selection
var value = d3.select(this).attr("value");

//check if value is same as current axis
if (value != chosenYAxis) {

    //replace chosenYAxis with value
    chosenYAxis = value;

    //update y scale for new data
    yLinearScale = yScale(healthdata, chosenYAxis);

    //update y axis with transition
    yAxis = renderAxesY(yLinearScale, yAxis);

    //update circles with new y values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

    //update text with new y values
    textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

    //update tooltips with new info
    circlesGroup = updateTooltip(chosenXAxis, circlesGroup);

    //change classes to change bold text
    if (chosenYAxis === "obesity") {
        obesityLabel.classed("active", true).classed("inactive", false);
        smokesLabel.classed("active", false).classed("inactive", true);
        healthcareLabel.classed("active", false).classed("inactive", true);
    }
    else if (chosenYAxis === "smokes") {
        obesityLabel.classed("active", false).classed("inactive", true);
        smokesLabel.classed("active", true).classed("inactive", false);
        healthcareLabel.classed("active", false).classed("inactive", true);
    }
    else {
        obesityLabel.classed("active", false).classed("inactive", true);
        smokesLabel.classed("active", false).classed("inactive", true);
        healthcareLabel.classed("active", true).classed("inactive", false);
    }
}
});

});

