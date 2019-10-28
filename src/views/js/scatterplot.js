define(['d3', 'dom'], function (d3, dom) {
    function build(options) {

        const promises = [d3.json(options.pointsURL), d3.json(options.pointsDetails)];
        Promise.all(promises)
            .then(function (data) {
                const points = JSON.parse(JSON.parse(data[0]));
                const pointDetails = JSON.parse(JSON.parse(data[1]));
                const mergedPoints = [];
                // add the tooltip area to the webpage

                // add svg element
                const svg = dom.svg(options.selector, options.width + options.marginLeft, options.height)
                    .attr('id', options.containerId)
                    .attr('transform', `translate(${options.marginLeft}, 0)`);

                // get the x coordinates of every point
                const coorXs = points.map(function (point) {
                    return point[0]
                });

                // get the y coordinates of every point
                const coorYs = points.map(function (point) {
                    return point[1];
                });

                pointDetails.forEach(function (details) {
                    details.forEach(function (d) {
                        const p = points.slice(d[0], d[1] + 1).map(function (p, idx) {
                            p.push(...d.slice(2, d.length));
                            p.push(idx);
                            return p;
                        });

                        mergedPoints.push(...p);
                    })
                });

                // define xscale, yscale and plot x Axis and y Axis
                const xScale = d3.scaleLinear().domain([d3.min(coorXs), d3.max(coorXs)]).range([options.offset, options.width]);
                const xAxis = d3.axisBottom(xScale).tickValues(options.xTickValues).tickSizeOuter(5);
                const yScale = d3.scaleLinear().domain([d3.min(coorYs), d3.max(coorYs)]).range([options.height - 30, 10]);
                const yAxis = d3.axisLeft(yScale).tickValues(options.yTickValues).tickSizeOuter(5);

                // shift xAxis
                svg.append('g')
                    .attr('transform', `translate(0, ${options.height - 20})`)
                    .call(xAxis)
                ;

                // shift yAxis
                svg.append('g')
                    .attr('transform', `translate(${options.marginLeft + 20}, 0)`)
                    .call(yAxis);

                // add points to the scatter plot
                svg.selectAll('.dot')
                    .data(mergedPoints)
                    .enter()
                    .append('circle')
                    .attr('class', 'dot')
                    .attr("r", 10)
                    .attr("cx", function (p) { return xScale(p[0])})
                    .attr("cy", function (p) { return yScale(p[1])})
                    .style('fill',  function (p) {
                        return p[2];
                    })
                    .style('fill-opacity', function (p) {
                        return p[3];
                    })
                    .on('mouseover', function (p) {
                        d3.select(this)
                            .transition(200)
                            .style('opacity', 0.2)
                    })
                    .on('mouseout', function (p) {
                        d3.select(this)
                            .transition(100)
                            .style('opacity', p[3]);
                    })
                    .on('click', function (p) {
                        d3.select(options.globalTopicSelector)
                            .attr('value', `${p[4]};${p[5]};${p[6]}`)
                            .dispatch('change');

                    })
                    .append("title")
                    .text(function(p) {
                        return `Year: ${p[5]} \n Type: ${p[4]}`;
                    })
                ;

                // draw legend
                var legend = svg.selectAll(".legend")
                    .data(options.legends)
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                // draw legend colored rectangles
                legend.append("rect")
                    .attr("x", options.width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", function (legend) {
                        return legend.color;
                    });

                // draw legend text
                legend.append("text")
                    .attr("x", options.width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function(l) { return l.text;});

            });
    }

    return {build}
});