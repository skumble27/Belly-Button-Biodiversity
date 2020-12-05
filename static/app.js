// Setting up the initial function to display the first dataset on the website
function init(){
    d3.json("data/samples.json").then(function(data){
        console.log(data);

        let name_id = data.names;
        var id_menu_dropdown = d3.select('#selDataset');

        console.log(name_id);
        

        // Within the dropdown menu, we will need to append the entire list of identificaiton numbers
        name_id.forEach(function(id){
            id_menu_dropdown.append("option").text(id).property("value",id);
        });

        // Providing a plot for the initial Data Identification Number
        barPlot(name_id[0]);
        bubblePlot(name_id[0]);
        demographicInfo(name_id[0]);
        washingGuage(name_id[0]);
    });
}

function barPlot(id){
    // Read the json file
    d3.json("data/samples.json").then(function(plotId){
        console.log(plotId);

        // Filtering the data based on selected ID
        let idSelect = plotId.samples.filter(sample => sample.id === id);
        console.log(idSelect);

        // Obtaining the top ten ten OTU_values out of the chosen ID
        let topTenSelectID = idSelect[0].otu_ids.slice(0,10).reverse();
        let topTenSelectSampleValue = idSelect[0].sample_values.slice(0,10).reverse();
        let topTenSelectLabels = idSelect[0].otu_labels.slice(0,10).reverse();

        console.log(topTenSelectID);
        console.log(topTenSelectSampleValue);
        console.log(topTenSelectLabels);


        // Need to format the OTU ids for a suitable bar plot
        let topTenSelectIDFormat = topTenSelectID.map(id_format => "OTU " + id_format);

        console.log(topTenSelectIDFormat);

        var trace = {
            x: topTenSelectSampleValue,
            y: topTenSelectIDFormat,
            text: topTenSelectLabels,
            type:'bar',
            orientation: 'h',
            marker:{
                color:'#ffcdf8'                
                }
        };

        var data = [trace];

        var layout = {
            title: "Top Ten OTU Identifications",
            xaxis: { 
                title: "Operational Taxonomic Units",
                gridcolor:'white',
                zerolinecolor:'white',
                },
            yaxis: { 
                title: "Frequency",
                gridcolor:'white',
                zerolinecolor:'white'    
            },
            paper_bgcolor:'black',
            plot_bgcolor:'black',
            font:{
                color:'white'
            }
          };
        // Creating a Bar plot of the data that has been filtered
        Plotly.newPlot("bar", data, layout);

    });   

    
    

}

function bubblePlot(id){
    // Retrieving the samples from the JSON file
    d3.json("data/samples.json").then(function(bubbleID){
        console.log(`Bubble ID`);
        console.log(bubbleID);

        // Filtering the data based on selected ID
        let idSelect = bubbleID.samples.filter(sample => sample.id === id);
        console.log(idSelect);

        let topTenSelectID = idSelect[0].otu_ids;
        let topTenSelectSampleValue = idSelect[0].sample_values;
        let topTenSelectLabels = idSelect[0].otu_labels.slice(0,10).reverse();

        console.log(topTenSelectID);
        console.log(topTenSelectSampleValue);
        console.log(topTenSelectLabels);


        // Need to format the OTU ids for a suitable bar plot
        let topTenSelectIDFormat = topTenSelectID.map(id_format => "OTU " + id_format);

        var bubbleTrace = {
            x: topTenSelectID,
            y: topTenSelectSampleValue,
            mode:'markers',
            marker: {
                size: topTenSelectSampleValue,
                color: topTenSelectID,
                colorscale:[[0, '#00ff37'], [0.25, '#ffdbf6'], [0.45, '#ff70db'], [0.65, '#828282'], [0.85, '#ff00cc'], [1, '#00fbff']]
            },
            text: topTenSelectLabels,
            

        };

        var bubbleLayout = {
            xaxis:{
                title: "OTU ID",
                gridcolor:'white',
                zerolinecolor:'white'},
            yaxis:{
                gridcolor:'white',
                zerolinecolor:'white',
            },
            height: 600,
            width: 1100,
            paper_bgcolor:'black',
            plot_bgcolor:'black',
            font:{
                color:'white'
            }
            
            

        };

        var bubbleData = [bubbleTrace];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    })
}

function demographicInfo(id){
    // read the json file to get data
    d3.json("data/samples.json").then(function(demographic){
        console.log(demographic);

        // Checking to see if the Metadata can be extracted
        console.log(demographic.metadata);
        
        // Filtering the data based on selected ID
        let selectedID = demographic.metadata.filter(metadataID => metadataID.id == id);
        console.log(selectedID);

        // Emptying the demographic panel
        let demographicTable = d3.select("#sample-metadata");

        demographicTable.html("");

        demographicTable.selectAll('h5')
        .data(selectedID)
        .enter()
        .append('h5')
        .html(function(d){
            return `<h5>ID: ${d.id}</h5><h5>Gender: ${d.ethnicity}</h5><h5>Gender: ${d.gender}</h5><h5>Age: ${d.age}</h5><h5>Location: ${d.location}</h5><h5>bbtype: ${d.bbtype}</h5><h5>wfreq: ${d.wfreq}</h5>`
        });     
    
    })
}
// BONUS SECTION //
function washingGuage(id){
    // reading the json file
    d3.json("data/samples.json").then(function(wash){
        console.log('Wash')
        console.log(wash);

        // Checking to see if the Metadata can be extracted
        console.log(wash.metadata);
        
        // Filtering the data based on selected ID
        let selectedID = wash.metadata.filter(metadataID => metadataID.id == id);
        console.log(selectedID);

        // Creating a variable for wash frequency
        let wfreq = selectedID[0].wfreq;
        console.log(wfreq);

        // Creating the guage Meter
        var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wfreq,
              title: { text: "Washing Frequency" },
              type: "indicator",
              mode: "gauge+number+delta",
              delta: { reference: 9 },
              gauge: {
                axis: { range: [null, 9] },
                bar: { color: "#00eeff" },
                steps: [
                  { range: [0, 1], color: "#ffe8fc" },
                  { range: [1, 2], color: "#ffb5f5" },
                  { range: [2, 3], color: "#ff82ee" },
                  { range: [3, 4], color: "#ff54e8" },
                  { range: [4, 5], color: "#ff29e2" },
                  { range: [5, 6], color: "#d900bb" },
                  { range: [6, 7], color: "#b5009c" },
                  { range: [7, 8], color: "#a3008d" },
                  { range: [8, 9], color: "#8c0079" },
                  
                ],
                threshold: {
                  line: { color: "white", width: 10 },
                  thickness: 0.75,
                  value: 490
                }
              }
            }
          ];
          
          var layout = {width: 500, 
                height: 450, 
                margin: { t: 0, b: 0 },
                paper_bgcolor:'black',
                plot_bgcolor:'black',
                font:{
                color:'white'
                }             
                        
       };
          Plotly.newPlot('gauge', data, layout);




    })
}

// The syntax below will allows users to select a specific ID to obtain relevant information
d3.selectAll("#selDataset").on("change", changedID);

function changedID() {
  let chosenID = d3.select("#selDataset").node().value;

  d3.selectAll("#table").remove();

  barPlot(chosenID);
  bubblePlot(chosenID);
  demographicInfo(chosenID);
  washingGuage(chosenID);
}
init();