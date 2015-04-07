/*
案件统计
*/

/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="statistics.js" />

var $casestatistics = $casestatistics || {};

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

            var wind = ExtHelper.CreateWindow({ title: '报警数据统计 ...', width: 600, height: 400, layout: 'fit' });
            wind.add($.grid.Grid());
        });
    };
    
    $.showChart = function (options) {
        var wind = ExtHelper.CreateWindow({ title: '案件数据统计 ...', width: 600, height: 400, layout: 'fit' });
        wind.add(getChart(null, options));
    };

    function getChart(p, options) {
        var defaults = {
            xfields: ['Name'],
            yfields: ['Records', 'YJBJ', 'JCJJJDB'],
            xField: ['Name'],
            yField: ['Records', 'YJBJ', 'JCJJJDB'],
            xtitle: ['行政区划'],
            ytitle: ['数量'],
            url: String.Format('{0}case', basic_url),
            fields: ['ID', 'Name', 'Records', 'YJBJ', 'JCJJJDB', 'RecordsName', 'YJBJName', 'JCJJJDBName'],
            title: ['报警总数', '一键报警', '三台合一报警'],
            max:100000
        };
        Ext.apply(defaults, options);

        var chart = $statistics.Statistics(defaults, p);
        return chart;
    }

})($casestatistics);

(function ($) {

    var tp = $.type = identityManager.createId('model');

    Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'Name' },
            { name: 'YJBJ' },
            { name: 'JCJJJDB' },
            { name: 'Records' },
            { name: 'YJBJName' },
            { name: 'JCJJJDBName' },
            { name: 'RecordsName' }
        ]
    });

})(Object.$Supper($casestatistics, 'model'));

(function ($) {

    var columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', text: "行政区划", flex: 1, sortable: false, hidden: false, renderer: rendercallback },
        { dataIndex: 'YJBJ', text: "一键报警", width: 75, sortable: false, hidden: false, renderer: rendercallback },
        { dataIndex: 'JCJJJDB', text: "三台合一", width: 75, sortable: false, hidden: false, renderer: rendercallback },
        { dataIndex: 'Records', text: "合计", width: 45, sortable: false, hidden: false, renderer: rendercallback },
        {
            dataIndex: 'ID', text: "", width: 65, sortable: false, hidden: false, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);
                return String.Format('<span class="a" onclick="{0}(\'{1}\')">生成图表</span>', '$casestatistics.grid.ActionRender', val);
            }
        }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { pager: false, columns: columns, req: 'case' };
        Ext.apply(defaults, options);

        var toolbar = {
            enable: true,
            items: ['报警数据统计信息', '->', '-', {
                xtype: 'button',
                text: '查看图表',
                iconCls: 'bchart',
                handler: btnChart
            }]
        };

        var store = getStore({ url: String.Format('{0}{1}', $casestatistics.basic_url, defaults.req), total: defaults.pager });
        return ExtHelper.CreateGridNoCheckbox({ store: store, columns: defaults.columns, pager: defaults.pager, toolbar: toolbar });
    };

    $.ActionRender = function (v) {
        var dat = Object.$DecodeObj(v);
        var store = getChartStore(dat);
        var max = dat.Records;
        $casestatistics.showChart({ store: store, max: max + 10, vertical: false });
    };

    function getStore(options) {
        var defaults = { storeId: Ext.id(), url: $casestatistics.basic_url, model: $casestatistics.model.type, total: false, pageSize: 10 };
        Ext.apply(defaults, options);

        return ExtHelper.CreateStore(defaults);
    }

    function getChartStore(d) {

        var store = Ext.create('Ext.data.SimpleStore', {
            fields: ['ID', 'Name', 'Records', 'YJBJ', 'JCJJJDB', 'RecordsName', 'YJBJName', 'JCJJJDBName'],
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
        for (var i = 0; i < data.length; i++) {
            var d = data[i].getData();
            max = d.Records > max ? d.Records : max;
            arr.push(d);
        }
        var store = getChartStore(arr);
        $casestatistics.showChart({
            xfields: ['Name'],
            yfields: ['Records'],
            xField: ['Name'],
            yField: ['Records'],
            xtitle: ['行政区划'],
            ytitle: ['数量'],
            title: ['案件总数'],
            store: store,
            max: max + 10
        });
    }

})(Object.$Supper($casestatistics, "grid"));