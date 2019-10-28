define(['dom', 'd3'], function (dom, d3) {
    // function to plot the stream diagram
    function build(options) {
        // function to draw stream diagram of any given topic
        function draw(options) {

            d3.select(`#${options.id}`)
                .remove();

            // initialize a svg component
            const svg = dom.svg(options.selector, options.width, options.height)
                .attr('id', options.id);

            // get all topics
            const topics = Object.keys(options.data);

            // set default topic
            options.defaultTopic = options.defaultTopic ? options.defaultTopic : topics[0];
            // get total years of this topic having been seen
            const years = [...new Set(options.data[options.defaultTopic].map(function (d) {return d[0]}))];

            // define xscale of the plot
            const xScale = d3.scaleTime()
                .domain([d3.min(years), d3.max(years)])
                .range([options.offset + 20, options.width - 10]);

            // draw x axis
            svg.append('g')
                .call(d3.axisBottom(xScale).tickValues(years).tickFormat(function (d) {return `${d}`}))
                .attr('transform', `translate(0, ${options.height - options.offset - 20})`)

            // define y scale
            const yScale = d3.scaleLinear()
                .domain([0, options.metrics])
                .range([options.height - 30, 0]);

            // draw y axis
            svg.append('g')
                .call(d3.axisLeft(yScale))
                .attr('transform', `translate(${options.offset + 20}, 0)`);

            // define area component
            const area = d3.area()
                .x(function (d) { return xScale(d.data.year)})
                .y0(function (d) { return yScale(d[0])})
                .y1(function (d) { return yScale(d[1])});

            // get the journal type where the given topic appears
            const types = [...new Set(options.data[options.defaultTopic].map(function (d) {return d[1]}))];

            // color palette
            var colorScale = d3.scaleOrdinal()
                .domain(types)
                .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'])

            // reformat data
            var dataReformated = years.map(function (y) {
                return {
                    year: y,
                };
            });

            options.data[options.defaultTopic].forEach(function (pd) {
                dataReformated.forEach(function (data) {
                    if (data.year === pd[0]) {
                        data[pd[1]] = pd[2]
                    }
                })
            });

            // stack data
            const stackedData = d3.stack()
                .keys(types)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);

            const series = stackedData(dataReformated);

            // draw the stacked stream diagram
            svg.append('g')
                .selectAll('path')
                .data(series)
                .enter()
                .append('path')
                .style('fill', function (d) {
                    return colorScale(d.key)
                })
                .attr('d', area)
                .on('mouseover', function (d, i) {
                    d3.select(this)
                        .transition(200)
                        .style('opacity', 0.4);
                    d3.select(this)
                        .append("title")
                        .text(function(d) {
                            var total = 0;
                            d.forEach(function(elem) {
                                total += elem[1] - elem[0];
                            });
                            return `Journal: ${d.key} \n Total frequency: ${total}`;
                        });

                })
                .on('mouseout', function (d) {
                    d3.select(this)
                        .transition(300)
                        .style('opacity', 1);
                    d3.select(this)
                        .selectAll('title')
                        .remove();
                })
            ;


            // draw legend
            var legend = svg.selectAll(".legend")
                .data(types)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            // draw legend colored rectangles
            legend.append("rect")
                .attr("x", options.width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function (d) {
                    return colorScale(d);
                });

            // draw legend text
            legend.append("text")
                .attr("x", options.width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d;})
        }
        const promises = [d3.json(options.DataURL)];
        Promise.all(promises)
            .then(function (data) {
                const parsedData = JSON.parse(JSON.parse(data));

                const types = Object.keys(parsedData).map(function (type, idx) {
                    return {
                        type: type,
                        id: idx
                    }
                });

                // add dropdown selection contain all topics
                d3.select(options.dropdownSelector)
                    .append('select')
                    .style('margin-bottom', `${options.offset}px`)
                    .attr('class', 'topicDropdown')
                    .on('change', function () {
                        const selectedTopic = d3.select('.topicDropdown').property('value');
                        const updatedOptions = Object.assign({}, options, {defaultTopic: selectedTopic})
                        draw(updatedOptions)
                    })
                    .selectAll('option')
                    .data(types)
                    .enter()
                    .append('option')
                    .text(function (d) {return d.type;})
                    .attr('id', function (d) {return `topic${d.id}`});
                ;

                options.data = parsedData;

                draw(options)

            }).catch(function (error) {
            console.log(error);
        })
    }

    return {build};
});
