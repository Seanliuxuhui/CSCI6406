define(['tagCanvas', 'd3', 'dom'], function (tagCanvas, d3, dom) {
    function build(options) {
        // clear the spot as word cloud plot will be frequently re-plotted
        d3.selectAll(`#${options.topicContainerId}`)
            .remove();

        d3.selectAll(`#${options.subTopicContainerId}`)
            .remove();

        // add canvas for two word clouds
        dom.canvas(options.topicContainer, options.width, options.height)
            .attr('id', options.topicContainerId);

        dom.canvas(options.subTopicContainer, options.width, options.height)
            .attr('id', options.subTopicContainerId);


        // the default journal  and default year
        const journalYear = options.defaultJournalYear,
            journalType = options.defaultJournalType;

        // get topics for given journal type and year
        d3.json(`/data/wordcloud/topics/${journalYear}_8_wordcloud_${journalType}_topics.cathy`).then(function (data) {
            const parsedData = JSON.parse(data);
            const featuresMap = [];
            const added = new Set();
            let topicId = 0;
            // process data
            parsedData.forEach(function (dataStr) {
                let skip = false;
                const topicPhrases = dataStr.split('\t');
                topicPhrases.forEach(function (phrase) {
                    if (!added.has(phrase) && !skip) {
                        added.add(phrase);
                        featuresMap.push(Object.assign({}, options, {
                            val: phrase,
                            color: options.colors[featuresMap.length],
                            link: '#',
                            subtopicURL: `/data/wordcloud/subtopics/${journalType}/${journalYear}`,
                            topicId: topicId,
                            type: journalType,
                            year: journalYear,
                            changeable: false
                        }));
                        skip = true;
                        // update topic Id
                        topicId += 1;
                    }
                });
            });

            // remove topic list
            d3.select(options.topicTagId)
                .select('ul')
                .remove();

            // add topic list with colors
            d3.select(options.topicTagId)
                .append('ul')
                .selectAll('li')
                .data(featuresMap)
                .enter()
                .append('li')
                .append('a')
                .attr('href', '#')
                .text(function(d) { return d.val;})
                .on('click', function (optionsData) {
                    d3.event.preventDefault();
                    buildSubTopic(optionsData);
                })
                .attr('style', function (d) {
                    return `color: ${d.color}`
                });

            // build sub word cloud
            buildSubTopic(Object.assign({}, options, {topicId: options.defaultTopicId, subtopicURL: `/data/wordcloud/subtopics/${journalType}/${journalYear}`, changeable: true}));

            // apply tagCanvas code to construct a word cloud
            try {
                tagCanvas.Start(options.topicContainerId, options.topicTag ,{
                    textColour: null,
                    reverse: true,
                    depth: 0.8,
                    maxSpeed: 0.05,
                    textFont: 'Impact,"Arial Black",sans-serif',
                    textHeight: 30,
                    wheelZoom: false,
                    weight: true,
                    weightMode: 'size'
                });

                document.getElementById(options.topicTag).style.display = 'none';

            } catch(e) {
                // something went wrong, hide the canvas container
                document.getElementById(options.topicContainerWithoutHashTag).style.display = 'none';
            }
        });
    }

    // build word cloud for subtopics
    function buildSubTopic(options) {
        d3.json(options.subtopicURL).then(function (data) {
            const subFeaturesMap = [];
            const added = new Set();
            const subTopicPhrases = data[options.changeable? Math.floor(Math.random() * data.length) : options.topicId];

            subTopicPhrases.forEach(function (phrase) {
                let skip = false;
                let count = 0;
                let defaultfontsize = 40;
                if (phrase === '') return;
                phrase = phrase.split('\t');

                phrase.forEach(function (p) {
                    if (!added.has(p) && !skip) {
                        added.add(p);
                        subFeaturesMap.push({
                            val: p,
                            link: '#',
                            color: options.colors[Math.floor(subFeaturesMap.length / 2)],
                            fontsize: defaultfontsize
                        });
                        // decrease fontsize of less probable words
                        defaultfontsize -= 10;
                        if (count === 2) {
                            skip = true;
                        }

                        count += 1;
                    }
                });
            });

            // first remove the subtopics tags if they exist
            d3.select(options.subTopicTagId)
                .selectAll('ul')
                .remove();

            // add sub topics to ul element
            d3.select(options.subTopicTagId)
                .append('ul')
                .selectAll('li')
                .data(subFeaturesMap)
                .enter()
                .append('li')
                .append('a')
                .on('click', function () {
                    d3.event.preventDefault();
                })
                .attr('style', function (d) {
                    return `color: ${d.color}`
                })
                .text(function(d) { return d.val;})
                .style('font-size', function (d) {
                    return `${d.fontsize}px`;
                });
            // apply tagCanvas to construct the word cloud
            try {
                var gradient = {
                    0:    '#f00', // red
                    0.33: '#ff0', // yellow
                    0.66: '#0f0', // green
                    1:    '#00f'  // blue
                };
                tagCanvas.Start(options.subTopicContainerId,options.subTopicTag,{
                    textColour: null,
                    reverse: true,
                    depth: 0.8,
                    maxSpeed: 0.05,
                    textFont: 'Impact,"Arial Black",sans-serif',
                    wheelZoom: false,
                    weight: true,
                    weightMode: 'size',
                    weigthGradient: gradient,
                    hideTags: true,
                });

                document.getElementById(options.subTopicTag).style.display = 'none';
            } catch(e) {
                // something went wrong, hide the canvas container
                document.getElementById(options.subTopicContainerWithoutHashTag).style.display = 'none';
            }

        });
    }

    return {build}
});