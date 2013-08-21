var chart = d3.select("#chart");
var chartWidth = $("#chart-div").width();
var chartHeight = $(window).height() - 60 - 60;

var BAR_WIDTH = 10;


d3.json("resources.json", function(data) {
    data = data.filter(function(elem) {
        return elem.duration !== null && elem.duration !== undefined;
    });

    tip = d3.tip().html(function(d) {
        return "<div class='d3-tip'>" +
            "<pre>" + JSON.stringify(d, null, '\t') + "</pre>" +
            "</div>";
    });
    chart.call(tip);

    data.sort(function(a, b) {
        var x = getDuration(a);
        var y = getDuration(b);
        return d3.descending(x, y);
    });

    var computeHeight = d3.scale.linear()
    .domain([1, d3.max(data, getDuration)])
    .range([1, chartHeight]);

    chart.attr("width", data.length * BAR_WIDTH)
        .attr("height", chartHeight);
    chart.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d, i) { return i * BAR_WIDTH; })
        .attr("y", function(d, i) { return chartHeight - computeHeight(getDuration(d)); })
        .attr("height", function(d, i) { return computeHeight(getDuration(d)); })
        .attr("width", BAR_WIDTH)
        .on('mouseover', function(d) {
            tip.show(d);
            // center it horizontally
            var tipWidth = $('.d3-tip').width();
            $('.d3-tip').css('left', $(window).width() / 2 - tipWidth / 2 + 'px');
        })
        .on('mouseout', tip.hide);
});

function getCpuTime(testData) {
    return testData.cpu_times.system + testData.cpu_times.user;
}

function getDuration(testData) {
    return testData.duration;
}

