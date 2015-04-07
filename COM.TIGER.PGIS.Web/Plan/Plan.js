/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />

var planQuery = planQuery || {};
(function ($) {
    //@基础地址
    var basic_url = $.basic_url = 'Plan/PlanHelp.ashx?req=';
    //结果面板容器ID
    var resultcontainerid = $.resultcontainerid = 'extEast';

    //@model
    (function (Q) {

        //@model plan
        (function (me) {
            var tp = me.type = identityManager.createId('model');
            var model = Ext.define(tp, {
                extend: 'Ext.data.Model',
                fields: [
                    { name: 'ID' },
                    { name: 'Name' },
                    { name: 'Description' }
                ]
            });
        })(Q.plan = Q.plan || {});

        //@model tag
        (function (me) {
            var tp = me.type = identityManager.createId('model');
            var model = Ext.define(tp, {
                extend: 'Ext.data.Model',
                fields: [
                    { name: 'ID' },
                    { name: 'Name' },
                    { name: 'Coordinates' },
                    { name: 'X' },
                    { name: 'Y' },
                    { name: 'Color' },
                    { name: 'IconCls' },
                    { name: 'Type' },
                    { name: 'Description' }
                ]
            });
        })(Q.tag = Q.tag || {});

    })($.model = $.model || {});

    //@store
    (function (Q) {

        //@store plan
        (function (me) {
            var store = me.store = ExtHelper.CreateStore({
                model: $.model.plan.type,
                url: String.Format('{0}pg_al', basic_url),
                total: true
            });
        })(Q.plan = Q.plan || {});

        //@store tag
        (function (me) {

            me.Store = function (options) {
                var defaults = { id: 0, loadcallback: Ext.emptyFn };
                Ext.apply(defaults, options);

                var store = ExtHelper.CreateStore({
                    model: $.model.tag.type,
                    url: String.Format('{0}tag&treq=all&id={1}', basic_url, defaults.id),
                    total: false
                });
                store.on('load', function (store, records, successful) {
                    defaults.loadcallback(store, records, successful);
                });
                return store;
            };
        })(Q.tag = Q.tag || {});

    })($.store = $.store || {});

    //@grid
    (function (Q) {
        
        var columns = [
            {
                xtype: 'rownumberer', width: 25, sortable: false, text: '序', renderer: function (value, obj, record, index) {
                    return index + 1;
                }
            },
            { dataIndex: 'Name', text: '预案名称', flex: 1, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
            {
                dataIndex: 'ID', width: 35, sortable: false, hidden: false, renderer: function (a, b, c) {
                    var data = c.getData();
                    var val = Object.$EncodeObj(data);
                    return String.Format('<span class="a" onclick="{0}(\'{1}\')">文档</span>', 'planQuery.docs', val); 
                }
            }
        ];
        var grid = Q.grid = ExtHelper.CreateGrid({
            columns: columns,
            store: $.store.plan.store,
            hideHeaders: true,
            pager: true
        });
        grid.on('select', function (row, record, index) {
            EMap.Clear();
            var data = record.getData();

            var store = $.store.tag.Store({
                id: data.ID, loadcallback: storeLoadCallback
            });
            var tgrid = $.result.Grid(store);

            ExtHelper.ShowResult(tgrid);
        });
        grid.on('deselect', function () {
            EMap.Clear();
        });

        //@数据获取完毕回调函数
        function storeLoadCallback(store, records, successful) {
            records.Each(function (record) {
                var raw = record.getData();
                var id = identityManager.createId() + raw.ID;

                //标识已经存在根节点，在此追加子节点
                switch (raw.Type) {
                    case 1:
                        //画点
                        mapGDI.DrawDot(id, { x: raw.X, y: raw.Y }, { iconcls: raw.IconCls, text: raw.Name });
                        EMap.AppendLabel({
                            id: raw.ID, x: raw.X, y: raw.Y, title: raw.Name
                        });
                        break;
                    case 2:
                        //画线
                        mapGDI.DrawLine(id, { coords: raw.Coordinates, color: '#' + raw.Color }, { x: raw.X, y: raw.Y });
                        var coords = raw.Coordinates.split(',');
                        EMap.AppendLabel({
                            id: raw.ID, x: raw.X, y: raw.Y, title: raw.Name
                        });
                        break;
                    case 3:
                        //画面
                        mapGDI.DrawPloy(id, { coords: raw.Coordinates, fillcolor: '#' + raw.Color }, { x: raw.X, y: raw.Y });
                        EMap.AppendLabel({
                            id: raw.ID, x: raw.X, y: raw.Y, title: raw.Name
                        });
                        break;
                    default: break;
                }
            });
        }

    })($.grid = $.grid || {});

    $.docs = function (v) {
        var data = Object.$DecodeObj(v);
        $.doc.show({ id: data.ID });
    };

})(planQuery);

(function ($) {

    var tp = identityManager.createId('model');
    Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'Name' },
            { name: 'Coordinates' },
            { name: 'X' },
            { name: 'Y' },
            { name: 'Color' },
            { name: 'IconCls' },
            { name: 'Type' },
            { name: 'Description' }
        ]
    });

    var columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', text: '标注', flex: 1, sortable: false, hidden: false, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
        {
            dataIndex: 'ID', width: 35, sortable: false, hidden: false, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);
                return String.Format('<span class="a" onclick="{0}(\'{1}\')">定位</span>', 'planQuery.result.loaction', val);
            }
        }
    ];

    $.loaction = function (v) {
        var data = Object.$DecodeObj(v);
        EMap.MoveTo(data.X, data.Y);
    };

    $.Grid = function (store) {
        return ExtHelper.CreateGridNoCheckbox({ store: store, columns: columns, pager: false });
    };

})(Object.$Supper(planQuery, 'result'));

(function ($) {

    var url = String.Format('{0}doc&dreq=', planQuery.basic_url);

    var tp = identityManager.createId();
    Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'Name' },
            { name: 'Alias' },
            { name: 'Suffix' },
            { name: 'Path' }
        ]
    });

    var columns = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Alias', text: '文档名称', renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } }
    ];

    $.Grid = function (options) {
        var defaults = { id: 0, pager:false };
        Ext.apply(defaults, options);

        var store = ExtHelper.CreateStore({ storeId: identityManager.createId(), model: tp, total: defaults.pager, url: String.Format('{0}fl&id={1}', url, defaults.id) });
        var grid = ExtHelper.CreateGrid({
            store: store, columns: columns, pager:defaults.pager, toolbar: {
                enable: true,
                items: [{
                    xtype: 'button',
                    text: '下载文档',
                    iconCls: 'bdown',
                    handler: function (grid) {

                        var rows = grid.grid.getSelectionModel().getSelection();
                        if (!rows.length)
                            return errorState.show('请选择要下载的文件！');

                        rows.Each(function (e) {

                            var params = getParams(e.raw);
                            location.href = String.Format('{0}down{1}', url, params);
                        });

                    }
                }]
            }
        });

        return grid;
    };

    $.show = function (options) {
        var defaults = { id: 0, title: '方案预案文档信息', width: 600, height: 400 };
        Ext.apply(defaults, options);

        var grid = $.Grid({ id: defaults.id });
        var wind = ExtHelper.CreateWindow({ title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit' });
        wind.add(grid);
    };

})(Object.$Supper(planQuery, 'doc'));