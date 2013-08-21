var chart = d3.select("#chart");
var chartWidth = $("#chart-div").width()
var chartHeight = $(window).height() - 60 - 60


d3.json("resources.json", function(data) {
    data = data.filter(function(elem) {
        return elem.ext_memory_info !== null;
    });
    chart.attr("width", data.length * 5)
        .attr("height", chartHeight);
    chart.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d, i) { return i * 5; })
        .attr("y", function(d, i) { return chartHeight - getCpuTime(d) * 10000; })
        .attr("height", function(d, i) { return getCpuTime(d) * 10000; })
        .attr("width", 5);
});

function getCpuTime(testData) {
    return testData.cpu_times.system + testData.cpu_times.user;
}

