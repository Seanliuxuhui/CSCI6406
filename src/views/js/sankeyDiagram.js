define(['dom', 'd3', 'd3Sankey', 'buildWordCloud'], function (dom, d3, d3Sankey) {
    function build(options) {

        const promises = [d3.json(options.linksURL), d3.json(options.nodesURL)];
        Promise.all(promises)
            .then(function (data) {
                const links = JSON.parse(JSON.parse(data[0]));
                const nodes = JSON.parse(JSON.parse(data[1]));

                const svg = dom.svg(options.selector, options.width, options.height)
                    .attr('id', options.id);

                const sankey = d3Sankey.sankey()
                    .nodeAlign(d3Sankey.sankeyCenter)
                    .nodeWidth(20)
                    .nodePadding(15)
                    .size([options.width, options.height-30]);

                const graph = sankey({
                    nodes,
                    links
                });

                // add links
                const link = svg
                    .append('g')
                    .selectAll('g')
                    .data(graph.links)
                    .enter()
                    .append('g')
                    .append('path')
                    .attr('d', d3Sankey.sankeyLinkHorizontal())
                    .attr('stroke', function (d) {return d.color})
                    .style('stroke-width', function (d) {
                        return Math.max(1, d.width);
                    })
                    .attr('fill', 'none')
                    .on('mouseover', function (d) {
                        d3.select(this)
                            .append('title')
                            .text(`${d.source.name} -> ${d.target.name} \n ${d.source.type} ${d.source.year} -> ${d.target.type} ${d.target.year} \n${d.value}`)
                            .style('font-size', '18px');
                        d3.select(this)
                            .transition(200)
                            .style('opacity', 0.4)
                    })
                    .on('mouseout', function (d) {
                        d3.select(this)
                            .transition(300)
                            .select('title')
                            .remove();
                        d3.select(this)
                            .transition(200)
                            .style('opacity', 1)
                    })
                ;

                link.append('title')
                    .text(function (d) {
                        return `${d.source.name} -> ${d.target.name} \n ${d.source.type} ${d.source.year} -> ${d.target.type} ${d.target.year} \n${d.value}`;
                    });

                // add nodes
                const node = svg
                    .append('g')
                    .selectAll('.node')
                    .data(graph.nodes)
                    .enter()
                    .append('g')
                    .attr('class', 'node')

                // append the rectangles for the nodes
                node.append('rect')
                    .attr('x', function (d) { return d.x0; })
                    .attr('y', function (d) { return d.y0; })
                    .attr('stroke', function (d) {return d.stroke;})
                    .attr('height', function (d) {
                        return d.y1 - d.y0;
                    })
                    .attr('width', function (d) {
                        return d.x1 - d.x0;
                    })
                    .attr('fill', function (d) {return d.color;})
                    .on('mouseover', function (d) {
                        d3.select(this)
                            .transition(200)
                            .style('opacity', 0.4)
                    })
                    .on('mouseout', function (d) {
                        d3.select(this)
                            .transition(200)
                            .style('opacity', 1)
                    })
                    .on('click', function (d) {
                        d3.select(options.globalTopicSelector)
                            .attr('value', `${d.type};${d.year};${d.name}`)
                            .dispatch('change');

                    })
                    .append('title')
                    .text(function (d) {
                        return `${d.name} (${d.type} ${d.year}) \n  Freq: ${ Math.round(d.value / d.sourceLinks.length)}`
                    })
                ;

                // add title
                svg.append('g')
                    .style('font', '12px sans-serif')
                    .selectAll('text')
                    .data(graph.nodes)
                    .enter()
                    .append('text')
                    .attr('x', function (d) {return d.x0 < options.width /2 ? d.x1 + 6: d.x0 -6})
                    .attr('y', function (d) {return (d.y1 + d.y0)/ 2;})
                    .attr('dy', '0.35em')
                    .attr('text-anchor', function (d) {
                        return d.x0 < options.width / 2? 'start': 'end';
                    })
                    .text(function (d) {
                        return ` ${d.nodeId}: ${d.name}`;
                    })
                    .on('mouseover', function (d) {
                        d3.select(this)
                            .transition(200)
                            .text(`(${d.year} ${d.type})`)
                            .style('dy', '0.5em')
                            .style('font-size', '18px');
                    })
                    .on('mouseout', function (d) {
                        d3.select(this)
                            .transition(300)
                            .text(`${d.nodeId}: ${d.name}`)
                            .style('font-size', '12px')
                        ;
                    })
                    .on('click', function (d) {
                        d3.select(options.globalTopicSelector)
                            .attr('value', `${d.type};${d.year};${d.name}`)
                            .dispatch('change');
                    });
            })
    }

    return {build}
})