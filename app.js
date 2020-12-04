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
        };

        var data = [trace];

        var layout = {
            title: "Top Ten OTU Identifications",
            xaxis: { title: "Operational Taxonomic Units"},
            yaxis: { title: "Frequency"}
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
                color: topTenSelectID
            },
            text: topTenSelectLabels

        };

        var bubbleLayout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1300
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
            return `<h5>ID: ${d.id}</h5><h5>Ethnicity: ${d.ethnicity}</h5><h5>Gender: ${d.gender}</h5><h5>Age: ${d.age}</h5><h5>Location: ${d.location}</h5>`
        });







        
    


    })
}



d3.selectAll("#selDataset").on("change", changedID);

function changedID() {
  let chosenID = d3.select("#selDataset").node().value;

  d3.selectAll("#table").remove();

  barPlot(chosenID);
  bubblePlot(chosenID);
  demographicInfo(chosenID);
}
init();