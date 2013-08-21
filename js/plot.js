var chart = d3.select("#chart");
var chartWidth = $("#chart-div").width()
var chartHeight = $(window).height() - 60 - 60


d3.json("resources.json", function(data) {
    data = data.filter(function(elem) {
        return elem.ext_memory_info !== null;
    });

    tip = d3.tip().html(function(d) {
        return "<div class='d3-tip'>" +
            "<pre>" + JSON.stringify(d, null, '\t') + "</pre>" +
            "</div>";
    });
    chart.call(tip);

    data.sort(function(a, b) {
        var x = getCpuTime(a);
        var y = getCpuTime(b);
        return d3.descending(x, y);
    });

    var computeHeight = d3.scale.linear()
    .domain([0, d3.max(data, getCpuTime)])
    .range([0, chartHeight]);

    chart.attr("width", data.length * 5)
        .attr("height", chartHeight);
    chart.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d, i) { return i * 5; })
        .attr("y", function(d, i) { return chartHeight - computeHeight(getCpuTime(d)); })
        .attr("height", function(d, i) { return computeHeight(getCpuTime(d)); })
        .attr("width", 5)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
});

function getCpuTime(testData) {
    return testData.cpu_times.system + testData.cpu_times.user;
}

