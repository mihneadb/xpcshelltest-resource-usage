var BAR_WIDTH = 10;
var MIN_HEIGHT = 5;

var data = null;
var plotted = false;

var getters = {
    'duration': function(d) {
        return d.duration;
    },
    'cpu_time': function(d) {
        return d.cpu_times.system + d.cpu_times.user;
    },
    'memory': function(d) {
        return d.ext_memory_info.rss;
    },
    'io': function(d) {
        return d.io_counters.read_count;
    }
};

function plotGraph(data) {
    var f = $("#file");
    // remove old chart and make new one
    $("#chart").remove();
    $("#chart-div").append('<svg id="chart"></svg>');
    var chart = d3.select("#chart");
    var chartWidth = $("#chart-div").width();
    var chartHeight = $(window).height() - $("#chart").position().top - 50;

    var key = $("#key")[0].value;
    var sort = $("#sort")[0].checked;
    var getterFunc = getters[key];

    // plot it
    data = data.filter(function(elem) {
        return getterFunc(elem) !== null && getterFunc(elem) !== undefined;
    });

    tip = d3.tip().html(function(d) {
        return "<div class='d3-tip'>" +
            "<pre>" + JSON.stringify(d, null, '\t') + "</pre>" +
            "</div>";
    });
    chart.call(tip);

    if (sort) {
        data.sort(function(a, b) {
            var x = getterFunc(a);
            var y = getterFunc(b);
            return d3.descending(x, y);
        });
    }

    var computeHeight = d3.scale.linear()
    .domain([0, d3.max(data, getterFunc)])
    .range([MIN_HEIGHT, chartHeight]);

    chart.attr("width", data.length * BAR_WIDTH)
        .attr("height", chartHeight);
    chart.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d, i) { return i * BAR_WIDTH; })
        .attr("y", function(d, i) { return chartHeight - computeHeight(getterFunc(d)); })
        .attr("height", function(d, i) { return computeHeight(getterFunc(d)); })
        .attr("width", BAR_WIDTH)
        .on('mouseover', function(d) {
            tip.show(d);
            $('.d3-tip').css('top', $("#chart").position().top + 'px');
            // center it horizontally
            var tipWidth = $('.d3-tip').width();
            $('.d3-tip').css('left', $(window).width() / 2 - tipWidth / 2 + 'px');
        })
        .on('mouseout', tip.hide);
    plotted = true;
}

function handleFile(ev) {
    var files = ev.target.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        data = JSON.parse(reader.result);
        plotGraph(data);
    };
    reader.readAsText(file);
}

var replot = function() {
    if (plotted) {
        plotGraph(data);
    }
};
window.onresize = replot;

$('#file').on('change', handleFile);
$('#key').on('change', replot);
$('#sort').on('change', replot);


// plot a default graph
d3.json("resources.json", function(d) {
    data = d;
    plotGraph(data);
});
