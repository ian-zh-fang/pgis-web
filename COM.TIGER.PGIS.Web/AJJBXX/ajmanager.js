/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/qForm.js" />
/// <reference path="Detail.js" />


var $ajmanager = $ajmanager || {};
(function ($) {

    var basic_url = $.basic_url = 'AJJBXX/Handler.ashx?req=';
    //结果面板容器ID
    var resultcontainerid = 'extEast';

    var loadDetailHandler = $.loadDetailHandler = function (cb) {
        if (typeof $ajdetail !== 'undefined') {
            return cb();
        }

        LoadModlues.loadJS(typeof $ajdetail, 'AJJBXX/Detail.js', function () {
            cb();
        });
    };

    $.form = qForm.getQueryForm(qForm.qFormType.AJJBXX, submit);
    $.getForm = function () {
        return qForm.getQueryForm(qForm.qFormType.AJJBXX, submit);
    };

    function submit(form) {
        var c = Ext.getCmp(resultcontainerid);
        c.removeAll(true);

        var items = form.items.items;
        var params = {};
        for (var i = 0; i < items.length; i++) {
            var cp = items[i];
            params[cp.name] = cp.value;
        }
        c.add($.grid.Grid({
            params: params
        }));

        if (c.collapsed) {
            c.expand();
        }
    }

})($ajmanager);

(function ($) {

    var tp = $.type = identityManager.createId('model');
    Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            //标识符
            { name: 'ID' },
            //涉案人员公民身份证号码
            { name: 'CardNo' },
            //案件编号
            { name: 'Ajbh' },
            //涉案人员姓名
            { name: 'Xm' },
            //吸毒标识，1标识吸毒
            { name: 'IsDrup' },
            //网上追逃标识，1标识网上追逃
            { name: 'IsPursuit' },
            //涉案人员绰号
            { name: 'Alias' },
            //刑拘标识，1标识刑拘
            { name: 'IsArrest' },
            //涉案人员当前住址
            { name: 'CurrentAddr' },
            //案件说明
            { name: 'Proof' }
        ]
    });

})(Object.$Supper($ajmanager, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { storeId: identityManager.createId(), model: $ajmanager.model.type, req: '', url: null, total: true, pageSize: 23, cb:Ext.emptyFn };
        Ext.apply(defaults, options);
        defaults.url = defaults.url || String.Format('{0}{1}', $.supper.basic_url, defaults.req);
        defaults.url = encodeURI(defaults.url);
        defaults.listeners = {
            'load': defaults.cb
        };

        return ExtHelper.CreateStore(defaults);
    };

})(Object.$Supper($ajmanager, 'store'));

(function ($) {

    var columns = $.columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Xm', text: '姓名', flex: 1 },
        {
            dataIndex: 'Ajbh', text: '案件编号', flex: 1, renderer: function (a, b, c) {
                return a || '暂无';
            }
        },
        {
            dataIndex: 'ID', width: 45, sortable: false, hidden: false, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);
                return String.Format('<span class="a" title="点击 查看案件详细信息" onclick="{0}(\'{1}\')">详细</span>', '$ajmanager.grid.detailFn', val);
            }
        }
    ];

    var detailFn = $.detailFn = function (v) {
        var o = Object.$DecodeObj(v);
        var mask = maskGenerate.start({ msg: '正在获取，请稍等 ...' });
        $.supper.loadDetailHandler(function () {
            $ajdetail.form.Show(o);
            mask.stop();
        });
    };

    $.Grid = function (options) {
        var defaults = { req: 'query', total: true, params: {}, cb: Ext.emptyFn };
        Ext.apply(defaults, options);
        defaults.req = String.Format('{0}&{1}', defaults.req, defaults.params ? null : getParams(defaults.params));

        var store = $.supper.store.Store(defaults);
        var grid = ExtHelper.CreateGridNoCheckbox({ store: store, columns: columns, pager: defaults.total });
        return grid;
    };

})(Object.$Supper($ajmanager, 'grid'));