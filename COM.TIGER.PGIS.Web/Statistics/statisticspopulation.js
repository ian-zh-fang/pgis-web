/*
人口统计
*/

/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="statistics.js" />


var $popstatistics = $popstatistics || {};

(function ($) {

    var basic_url = $.basic_url = 'Statistics/StatisticsHelp.ashx?req=';

    $.loadStatistics = function (c) {
        if (typeof $statistics !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $statistics, 'Statistics/statistics.js', function () {
            c();
        });
    };

    $.show = function () {
        $.loadStatistics(function () {

            var wind = $.window = ExtHelper.CreateWindow({ title: '人口数据统计 ...', width: 600, height: 400, layout: 'fit' });
            wind.add($.grid.Grid());
        });
    };

    $.showChart = function (options) {
        var wind = ExtHelper.CreateWindow({ title: '人口数据统计图表 ...', width: 600, height: 400, layout: 'fit' });
        wind.add(getChart($.window.getId(), options));
    };

    function getChart(p, options) {
        var defaults = {
            xfields: ['Name'],
            yfields: ['Records', 'Records1', 'Records2', 'Records3', 'Records4', 'Records5'],
            xField: ['Name'],
            yField: ['Records', 'Records1', 'Records2', 'Records3', 'Records4', 'Records5'],
            xtitle: ['行政区划'],
            ytitle: ['数量'],
            //fields: ['ID', 'Name', 'Records', 'Records1', 'Records2', 'Records3', 'Records4', 'Records5', 'RecordsName', 'Records1Name', 'Records2Name', 'Records3Name', 'Records4Name', 'Records5Name'],
            title: ['实有人口', '常住人口', '暂住人口', '重点人口', '境外人口', '其他'],
            max: 100,
            store:null
        };
        Ext.apply(defaults, options);

        var chart = $statistics.Statistics(defaults, p);
        return chart;
    }

})($popstatistics);

(function ($) {

    var tp = $.type = identityManager.createId('model');

    Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'Name' },
            { name: 'Records1' },
            { name: 'Records2' },
            { name: 'Records3' },
            { name: 'Records4' },
            { name: 'Records5' },
            { name: 'Records' },
            { name: 'Records1Name' },
            { name: 'Records2Name' },
            { name: 'Records3Name' },
            { name: 'Records4Name' },
            { name: 'Records5Name' },
            { name: 'RecordsName' }
        ]
    });

})(Object.$Supper($popstatistics, 'model'));

(function ($) {

    var columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', text: "行政区划", flex: 1, sortable: false, hidden: false, renderer: rendercallback },
        { dataIndex: 'Records1', text: "常口", width: 45, sortable: false, hidden: false, renderer: rendercallback },
        { dataIndex: 'Records2', text: "暂口", width: 45, sortable: false, hidden: false, renderer: rendercallback },
        { dataIndex: 'Records3', text: "重口", width: 45, sortable: false, hidden: false, renderer: rendercallback },
        { dataIndex: 'Records4', text: "出入境", width: 65, sortable: false, hidden: false, renderer: rendercallback },
        { dataIndex: 'Records', text: "实有", width: 45, sortable: false, hidden: false, renderer: rendercallback },
        {
            dataIndex: 'ID', text: "", width: 65, sortable: false, hidden: false, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);
                return String.Format('<span class="a" onclick="{0}(\'{1}\')">生成图表</span>', '$popstatistics.grid.ActionRender', val);
            }
        }
    ];
    
    var Grid = $.Grid = function (options) {
        var defaults = { pager: false, columns: columns, req: 'popu' };
        Ext.apply(defaults, options);

        var toolbar = {
            enable:true,
            items: ['人口数据统计信息','->','-',{
                xtype: 'button',
                text: '查看图表',
                iconCls: 'bchart',
                handler: btnChart
            }]
        };

        var store = getStore({ url: String.Format('{0}{1}', $popstatistics.basic_url, defaults.req), total: defaults.pager });
        return ExtHelper.CreateGridNoCheckbox({ store: store, columns: defaults.columns, pager: defaults.pager, toolbar: toolbar });
    };

    $.ActionRender = function (v) {
        var dat = Object.$DecodeObj(v);
        var store = getChartStore(dat);
        var max = dat.Records;
        $popstatistics.showChart({ store: store, max: max + 100, vertical: false });
    };

    function getStore(options) {
        var defaults = { storeId: Ext.id(), url: $popstatistics.basic_url, model: $popstatistics.model.type, total: false, pageSize: 10 };
        Ext.apply(defaults, options);

        return ExtHelper.CreateStore(defaults);
    }

    function getChartStore(d) {

        var store = Ext.create('Ext.data.SimpleStore', {
            fields: ['ID', 'Name', 'Records', 'Records1', 'Records2', 'Records3', 'Records4', 'Records5', 'RecordsName', 'Records1Name', 'Records2Name', 'Records3Name', 'Records4Name', 'Records5Name'],
            data: []
        });
        store.loadData([].concat(d));
        return store;
    }

    function rendercallback(v) {
        return String.Format('<span title="{0}">{0}</span>', v);
    }

    function btnChart(g) {
        var data = g.grid.store.data.items;
        var arr = [];
        var max = 0;
        for (var i = 0; i < data.length; i++)
        {
            var d = data[i].getData();
            max = d.Records > max ? d.Records : max;
            arr.push(d);
        }
        var store = getChartStore(arr);
        $popstatistics.showChart({
            xfields: ['Name'],
            yfields: ['Records'],
            xField: ['Name'],
            yField: ['Records'],
            xtitle: ['行政区划'],
            ytitle: ['数量'],
            title: ['实有人口'],
            store: store,
            max: max + 100
        });
    }

})(Object.$Supper($popstatistics, "grid"));