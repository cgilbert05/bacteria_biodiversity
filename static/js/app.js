// @TODO: Complete the following function that builds the metadata panel

function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function (data) {

    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    var sampMeta = d3.select("#sample-metadata");
    sampMeta.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function ([key, value]) {
      sampMeta.append("h6").text(`${key}: ${value}`);
    });
  })
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots

  d3.json(`/samples/${sample}`).then(function (sampData) {
    var ids = sampData.otu_ids;
    var values = sampData.sample_values;
    var labels = sampData.otu_labels;

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: ids,
      y: values,
      mode: 'markers',
      marker: {
        color: ids,
        size: values, 
        colorscale: 'Bluered'
      }
    };

    var bubbleLayout = {
      title: 'All Bacteria',
      showlegend: true,
    };

    var bubbleData = [trace1];

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // slice works because the samples were already sorted in by values in app.py
    var trace2 = {
      labels: ids.slice(0, 10),
      values: values.slice(0, 10),
      type: "pie"
    };

    var pieLayout = {
      title: 'Top 10 Bacteria',
    };

    var pieData = [trace2];

    Plotly.newPlot("pie", pieData, pieLayout)
  })

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
