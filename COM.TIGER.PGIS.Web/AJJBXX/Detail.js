/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Population/populationDetail.js" />
/// <reference path="ajmanager.js" />

var $ajdetail = $ajdetail || {};

(function ($) {
    
    var basic_url = $.basic_url = 'AJJBXX/Handler.ashx?req=';

    var loadPopulationHandler = $.loadPopulationHandler = function (cb) {
        if (typeof $populationdetail !== 'undefined') {
            return cb();
        }

        LoadModlues.loadJS(typeof $populationdetail, 'Population/populationDetail.js', function () {
            cb();
        });
    };

    var loadManager = $.loadManager = function (cb) {
        if (typeof $ajmanager !== 'undefined') {
            return cb();
        }

        LoadModlues.loadJS(typeof $ajmanager, 'AJJBXX/ajmanager.js', function () {
            cb();
        });
    };

})($ajdetail);

(function ($) {

    $.Show = function (d, cb) {
        cb = cb || Ext.emptyFn;

        $.supper.loadManager(function () {

            var pn = panel(d, function () {
                wind.close();
            });
            var wind = $.window = ExtHelper.CreateWindow({ title: '案事件-案件详细信息', width: 600, height: 400, layout: 'fit' });
            wind.add(pn);
        });
    };

    $.Desc = function (v, d) {
        //var d = Object.$DecodeObj(d);
        
        var mask = maskGenerate.start({ p: $.window.getId(), msg: '正在获取，请稍等 ...' });
        var form = ExtHelper.CreateForm({
            anchor: '100%', layout: 'fit', buttonstext: '关闭（<u>C</u>）', callback: function () {
                wind.close();
            }
        });
        form.add({
            xtype: 'textareafield',
            labelWidth: 0,
            border: 0,
            readOnly:true,
            value:v
        });

        var wind = ExtHelper.CreateWindow({ title: '案事件-案件描述信息', height: 280, width: 400, layout: 'fit' });
        wind.add(form);
        mask.stop();
    };

    function panel(d, cb) {
        var defaults = {
            //标识符
            ID: 0,
            //涉案人员公民身份证号码
            CardNo: null,
            //案件编号
            Ajbh: null,
            //涉案人员姓名
            Xm: null,
            //涉案人员绰号
            Alias: null,
            //吸毒标识，1标识吸毒
            IsDrup: 0,
            //网上追逃标识，1标识网上追逃
            IsPursuit: 0,
            //刑拘标识，1标识刑拘
            IsArrest: 0,
            //涉案人员当前住址
            CurrentAddr: null,
            //涉案人员当前住址
            Proof: null
        };
        Ext.apply(defaults, d);

        var form = ExtHelper.CreateForm({ anchor: '100%', layout: 'column', buttonstext: '关闭（<u>C</u>）', callback: cb });
        form.add({
            xtype: 'label',
            columnWidth: 1,
            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">案件编号</span>：{0}", defaults.Ajbh || '暂无'),
            style: 'height:25px;'
        }, {
            xtype: 'label',
            columnWidth: 1,
            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">案件描述</span>：<span class=\"a\" title=\"点击 查看案件描述信息\" onclick=\"{1}('{0}', '{2}')\" >{0}</span>", defaults.Proof || '暂无', '$ajdetail.form.Desc', Object.$EncodeObj(defaults)),
            style: 'height:25px;'
        }, {
            xtype: 'fieldset',
            layout: 'anchor',
            style: 'padding-bottom:5px',
            defaults: { anchor: '100%' },
            columnWidth: 1,
            title: '涉案人员名单',
            items: [$.supper.grid.Grid({ params: { bh: defaults.Ajbh || '' } })]
        });
        return form;
    }

})(Object.$Supper($ajdetail, 'form'));

(function ($) {

    var columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Xm', text: '姓名', width: 60, sortable: false, hidden: false, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a);} },
        {
            dataIndex: 'CardNo', text: '证件号码', width: 140, sortable: false, hidden: false, renderer: function (a) {
                return a.ReplaceFormat(2, 18);
            }
        },
        {
            dataIndex: 'IsDrup', text: '吸毒', width: 40, sortable: false, hidden: false, renderer: function (a) {
                return a > 0 ? '<span style="color:red; font-weight:700;">是</span>' : '<span style="color:darkblue; font-weight:700;">否</span>';
            }
        },
        {
            dataIndex: 'IsPursuit', text: '追逃', width: 40, sortable: false, hidden: false, renderer: function (a) {
                return a > 0 ? '<span style="color:red; font-weight:700;">是</span>' : '<span style="color:darkblue; font-weight:700;">否</span>';
            }
        },
        {
            dataIndex: 'IsArrest', text: '刑拘', width: 40, sortable: false, hidden: false, renderer: function (a) {
                return a > 0 ? '<span style="color:red; font-weight:700;">是</span>' : '<span style="color:darkblue; font-weight:700;">否</span>';
            }
        },
        { dataIndex: 'CurrentAddr', text: '住址', flex: 1, sortable: false, hidden: false, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
        {
            dataIndex: 'ID', width: 45, sortable: false, hidden: false, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);

                return String.Format('<span class="a" title="点击 查看人员详细信息" onclick="{0}(\'{1}\')">详细</span>', '$ajdetail.grid.Detail', val);
            }
        }
    ];

    $.Grid = function (options) {
        var defaults = { req: 'qbybh', total: false, params: {} };
        Ext.apply(defaults, options);
        defaults.req = String.Format('{0}&{1}', defaults.req, getParams(defaults.params));

        var store = $ajmanager.store.Store(defaults);
        var grid = ExtHelper.CreateGridNoCheckbox({
            store: store, columns: columns, pager: defaults.total, height:240, toolbar: {
                enable: false,
                items:['涉案人员名单', '-']
            }
        });
        return grid;
    };

    $.Detail = function (v) {
        var data = Object.$DecodeObj(v);
        var mask = maskGenerate.start({ p: $.supper.form.window.getId(), msg: '正在获取，请稍后 ...' });
        $.supper.loadPopulationHandler(function () {
            $populationdetail.GetByCode(data.CardNo, function (a, b, c, d) {
                if (!c) {
                    return errorState.show('信息获取失败.');
                    mask.stop();
                }

                $populationdetail.population.detail.Show(a.result);
                mask.stop();
            });
        });
    };

})(Object.$Supper($ajdetail, 'grid'));