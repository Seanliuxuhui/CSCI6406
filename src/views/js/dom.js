define(['d3', 'd3Tip'], function (d3, d3Tip) {
    // set the shape of input DOM element
    function setShape(elem, width, height) {
        return elem.attr('width', width).attr('height', height);
    }
    // create a canvas element
    function canvas (selector, width, height) {
        return setShape(d3.select(selector).append('canvas'), width, height);
    }
    // create a svg element
    function svg (selector, width, height) {

        return setShape(d3.select(selector).append('svg'), width, height);
    }

    // a general tooltip function
    function tooltip() {
        const tooltip = d3Tip()
            .attr('class', 'd3-tip')
            .attr('font-size', '30px')
            .html(function (d) {
                return `<strong>${d.value}</strong> `
            })
            .offset([-40, -15]);

        return tooltip;
    }

    return {canvas, svg, tooltip}
});

