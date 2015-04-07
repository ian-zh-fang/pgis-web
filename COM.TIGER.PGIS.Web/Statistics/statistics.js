/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Utils.js" />

Ext.require('Ext.chart.*');

var $statistics = $statistics || {};
(function ($) {

    var Statistics = $.Statistics = function (options, p) {
        var defaults = {
            style: null, animate: true, shadow: true, legend: 'bottom',
            xfields:[], yfields:[], xtitle:'', ytitle:'', xField:'', yField:'',
            url: '', fields: [], min:0, max:0,
            title:'', store:null, vertical:true
        };
        Ext.apply(defaults, options);

        if (defaults.store && defaults.max && defaults.max <= 10)
            defaults.max = 10;

        var mask = null;
        if (!defaults.store)
            mask = maskGenerate.start({ p: p, msg: '正在获取数据，请稍等' });
        
        var chart = new Ext.chart.Chart({
            style: defaults.style || 'background:#fff',
            animate: defaults.animate,
            shadow: defaults.shadow,
            store: defaults.store || {
                fields: defaults.fields,
                proxy: {
                    type: 'ajax',
                    url: defaults.url,
                    reader: { type: 'json' }
                },
                autoLoad: true,
                listeners: {
                    'load': function (a, b, c, d) {
                        mask.stop();
                    }
                }
            },
            legend: {
                position: defaults.legend
            },
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: defaults.yfields,
                minimum: defaults.min || -0.1,
                maximum: defaults.max || 1000,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0')
                },
                //grid: true,
                title: defaults.ytitle
            }, {
                type: 'Category',
                position: 'bottom',
                fields: defaults.xfields,
                title: defaults.xtitle
            }],
            series: [{
                type: 'column',
                axis: 'bottom',
                xField: defaults.xField,
                yField: defaults.yField,
                showInLegend: true,
                showMarkers: true,
                title: defaults.title,
                tips: {
                    trackMouse: true,
                    width: 160,
                    //height: 48,
                    renderer: function (a, b) {
                        this.setTitle(String.Format(' {0},{1}<br />数量：{2}', b.value[0], a.get(String.Format('{0}Name', b.yField)), b.value[1]));
                    }
                },
                label: {
                    display: 'insideEnd',
                    field: defaults.yfields,
                    //renderer: function (a, b, c, d, e, f, g) {
                    //    var defaults = { attr: { width: 0 }, value: ['未知', '0'], yField: 'Records' };
                    //    Ext.apply(defaults, d);

                    //    //if (defaults.attr && defaults.attr.width && defaults.attr.width >= 80)
                    //    //    return String.Format('{0}:{1}', c.get(String.Format('{0}Name', defaults.yField)), a);

                    //    //if (defaults.attr && defaults.attr.width && defaults.attr.width >= 11)
                    //    //    return a;

                    //    //return '';

                    //    //return String.Format('<span class="content-cut" style="width:{0}px;">{1}</span>', defaults.attr.width, a);
                    //    return a;
                    //},
                    orientation: defaults.vertical ? 'vertical' : 'horizontal',//vertical,horizontal
                    //color: '#FF0000',
                    'text-anchor': 'center'
                }
            }]
        });

        return chart;
    };

    //$.Store = function () {

    //};

    $.test = function () {
        var wind = ExtHelper.CreateWindow({ title: '统计柱形图测试 ...', width: 600, height: 400, layout: 'fit' });
        wind.add(Statistics({
            xfields: ['Name'],
            yfields: ['Records', 'Records1', 'Records2', 'Records3', 'Records4'],
            xField: ['Name'],
            yField: ['Records', 'Records1', 'Records2', 'Records3', 'Records4'],
            xtitle: ['哈哈'],
            ytitle: ['嘿嘿'],
            url: 'Statistics/StatisticsHelp.ashx?req=',
            fields: ['LiveType', 'AdminID', 'ID', 'Name', 'Records', 'Records1', 'Records2', 'Records3', 'Records4'],
            title: ['111', '222', '333', '444', '555']
        }, p));
    };

})($statistics);