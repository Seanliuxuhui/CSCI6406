// configurations for dependencies
require.config({
    baseUrL: '/',
    paths: {
        'dom': 'dom',
        'd3': 'd3/d3.min',
        'd3Tip': 'd3/d3-tip-re',
        'tagCanvas': 'tagcanvas',
        'd3-collection': 'd3/d3-collection',
        'd3-selection': 'd3/d3-selection',
        'jquery': 'jquery-1.7.2',
        'buildWordCloud': 'buildWordCloud',
        'scatterplot': 'scatterplot',
        'sankey': 'sankeyDiagram',
        'd3Sankey': 'd3/d3-sankey',
        'd3-array': 'd3/d3-array',
        'd3-shape': 'd3/d3-shape',
        'd3-path': 'd3/d3-path',
        'streamDiagram': 'streamDiagram'
    },
});

// start point of the application
require(['d3', 'dom', 'buildWordCloud', 'scatterplot', 'sankey', 'streamDiagram'], function (d3, dom, buildWordCloud, scatterplot, sankey, streamDiagram) {

    // initialize the application
    display();

    function display() {
        const globalTopicSelector = '#globalTopic';
        // define word cloud properties
        const wordCloudOptions = {
            topicContainer: "#topicsContainer",
            subTopicContainer: '#subtopicsContainer',
            topicContainerId: 'topicCloud',
            subTopicContainerId: 'subTopicCloud',
            subTopicTag: 'subTopicsTags',
            topicTag: 'topicsTags',
            topicTagId: '#topicsTags',
            subTopicTagId: '#subTopicsTags',
            defaultJournalYear: '2014',
            defaultJournalType: 'TKDE',
            topicContainerWithoutHashTag: 'topicsContainer',
            subTopicContainerWithoutHashTag: 'subTopicContainer',
            width: 500,
            height: 400,
            defaultTopicId: 0,
            colors: ['Green', 'Aqua', 'Teal', 'Blue', '#FF00FF', '#800080', '#C0C0C0', '#808080']
        };

        const journalTypes = ['TKDE', 'TVCG', 'TOG'];
        const journalYears = ['2014', '2015', '2016', '2017', '2018'];

        // add dropdown selections for journals
        d3.select('#topicsDropdown')
            .append('select')
            .attr('class', 'typesDropdown')
            .on('change', function () {
                wordCloudDropdownChangeHandler(wordCloudOptions);
            })
            .selectAll('option')
            .data(journalTypes)
            .enter()
            .append('option')
            .text(function (d) { return d })
        ;

        // add dropdown selections for years
        d3.select('#topicsDropdown')
            .append('select')
            .attr('class', 'yearsDropdown')
            .on('change', function () {
                wordCloudDropdownChangeHandler(wordCloudOptions);
            })
            .selectAll('option')
            .data(journalYears)
            .enter()
            .append('option')
            .text(function (d) { return d; })
        ;


        buildWordCloud.build(wordCloudOptions);

        // define scatter plot properties
        let scatterPlotOptions = {
            selector: '#scatterplotContainer',
            containerId: 'scatterplot',
            pointsURL: '/data/scatterplot/points.json',
            pointsDetails: '/data/scatterplot/pointsDetails.json',
            width: 500,
            height: 400,
            marginLeft: 10,
            offset: 50,
            xTickValues: [-0.75, -0.50, -0.25, 0.0, 0.25, 0.50, 0.75],
            yTickValues: [-1.0, -0.50, 0.00, 0.50, 1.00],
            legends: [{color: 'navy', text: 'TKDE'}, {color: 'turquoise', text: 'TOG'}, {color: 'darkorange', text: 'TVCG'}],
            globalTopicSelector: globalTopicSelector
        };

        scatterPlotOptions = Object.assign({}, scatterPlotOptions, wordCloudOptions);

        scatterplot.build(scatterPlotOptions);

        // define sankey diagram properties
        const sankeyOptions = {
            linksURL: '/data/sankeydiagram/links.json',
            nodesURL: '/data/sankeydiagram/nodes.json',
            selector: '#sankeyDiagram',
            id: 'sankey',
            width: 800,
            height: 800,
            globalTopicSelector: globalTopicSelector
        };

        sankey.build(sankeyOptions);

        // define stream diagram properties
        const streamDiagramOptions = {
            DataURL: '/data/streamDiagram/streamdiagramFreq.json',
            selector: '#streamDiagram',
            dropdownSelector: '#streamDiagramDropdown',
            id: 'stream',
            width: 550,
            height: 400,
            offset: 10,
            metrics: 980,
        };

        streamDiagram.build(streamDiagramOptions);

        // add a global hidden field to store the topic that is chosen to display. And propagate the change event when value of that field gets changed.
        const globalTopicContainer = '#globalTopicContainer';
        d3.select(globalTopicContainer)
            .append('input')
            .attr('value', 'default')
            .attr('type', 'text')
            .attr('class', 'invisible')
            .attr('id', 'globalTopic')
            .on('change', function () {
                const properties =d3.select(this)
                    .property('value').split(';');
                const type = properties[0],
                    year = properties[1],
                    topicId = !isNaN(parseInt(properties[2]))? parseInt(properties[2]) : properties[2];

                const typesDropdownSelector = '.typesDropdown',
                    yearsDropdownSelector = '.yearsDropdown';

                d3.select(typesDropdownSelector)
                    .property('value', type)
                    .dispatch('change');
                d3.select(yearsDropdownSelector)
                    .property('value', year)
                    .dispatch('change');

                const streamDiagramDropdown = '.topicDropdown';

                let topic = '';
                if (!isNaN(parseInt(properties[2]))) {
                    topic = d3.select(`#topic${topicId}`)
                        .text();
                } else {
                    topic = topicId;
                }


                d3.select(streamDiagramDropdown)
                    .property('value', topic)
                    .dispatch('change');


            });
    }

    function wordCloudDropdownChangeHandler (wordCloudOptions) {
        const selectedTypeValue = d3.select('.typesDropdown').property('value');
        const selectedYearValue = d3.select('.yearsDropdown').property('value');
        const updatedOptions = Object.assign({}, wordCloudOptions, {defaultJournalType: selectedTypeValue, defaultJournalYear: selectedYearValue});
        buildWordCloud.build(updatedOptions);
    }
});
