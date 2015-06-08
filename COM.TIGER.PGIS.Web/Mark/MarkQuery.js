/// <reference path="../Resources/js/extjs4.2/ext-all.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/qForm.js" />

var markQuery = markQuery || {};
(function ($) {

    //私有变量
    var url = 'Mark/MarkHelp.ashx?req=';
    //结果面板容器ID
    var resultcontainerid = 'extEast';

    //原型
    $.fn = $.constructor.prototype;
    $.locationCallback = function (val) {
        //debugger;
        val = decodeURI(val);
        var data = Ext.JSON.decode(val);
        locationMark(data);
    };

    //查询面板
    $.query = {};
    $.query.form = function () {
        var f = qForm.getQueryForm(qForm.qFormType.mark, queryCallback);
        return f;
    };
    //列表
    $.query.grid = {};
    //模型
    $.query.grid.model = { type: String.Format("model_{0}", new Date().getTime()) };
    $.query.grid.model.model = function () {
        var m = Ext.define($.query.grid.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'Coordinates' },
                { name: 'X' },
                { name: 'Y' },
                { name: 'Color' },
                { name: 'IconCls' },
                { name: 'MarkTypeID' },
                { name: 'Description' },
                { name: 'MarkTypeID' },
                { name: 'MarkType' }
            ]
        });
        return m;
    }();
    //数据仓储
    $.query.grid.store = { id: String.Format("store_{0}", new Date().getTime()) };
    $.query.grid.store.store = function (options) {
        var defaults = { params: undefined };
        Ext.apply(defaults, options);
        var lurl = url + 's';
        if (defaults.params) {
            lurl = lurl + defaults.params;
        }

        var s = s || ExtHelper.CreateStore({
            storeId: this.id,
            url: encodeURI(lurl),
            model: $.query.grid.model.type,
            total: true
        });
        return s;
    };
    //列
    $.query.grid.columns = function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Name', text: '名称', flex: 1 },
            {
                dataIndex: 'ID', text: '操作', lock: true, sortable: false, width: 35, renderer: function (value, obj, record) {
                    //debugger;
                    var data = record.getData();
                    var val = Ext.JSON.encode(data);
                    val = encodeURI(val);
                    return "<a href=\"#\" onclick=\"markQuery.locationCallback('" + val + "')\" >定位</a>";
                }
            }
            //,
            //{
            //    text: '操作',
            //    width:35,
            //    xtype: 'actioncolumn',
            //    sortable: false,
            //    lock: true,
            //    items: [
            //        {
            //            iconCls: 'location_small',
            //            tooltip: '定位',
            //            handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
            //                locationMark(record.getData());
            //            }
            //        }
            //    ]
            //}
        ];
        return c;
    }();
    //表格
    $.query.grid.grid = function (options) {
        var store = this.store.store(options);
        var g = g || ExtHelper.CreateGridNoCheckbox({
            store: store,
            width: 198,
            height:513,
            columns: this.columns,
            pager: true
        });
        return g;
    };

    //分布树
    $.tree = {};
    //数据模型
    $.tree.model = { type: String.Format("model_{0}", new Date().getTime()) };
    $.tree.model.model = function () {
        var m = Ext.define($.tree.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'IconCls' },
                { name: 'Color' },
                { name: 'Type' },
                { name: 'Remark' },
                { name: 'Marks' }
            ]
        });
        return m;
    }();
    //数据仓储
    $.tree.store = { id: String.Format("{0}", new Date().getTime()) };
    $.tree.store.store = function () {
        var store = Ext.create('Ext.data.TreeStore', {
            proxy: { type: 'ajax', url: url + 'tree' },
            loadMask: true,
            autoLoad: true,
            listeners: {
                beforeappend: {
                    fn: function (parent, node, eOpts) {
                        var data = node.getData();
                        if (data.id == 'root') {
                            return;
                        }
                        if (data.children && data.children instanceof Array && data.children.length > 0) {
                            var raw = node.raw;
                            //绘图
                            for (var i = 0; i < data.children.length; i++) {
                                var d = data.children[i];
                                d.MarkType = raw;
                                locationMark(d);
                            }
                        }
                    }
                }
            }
        });
        return store;
    };
    $.tree.tree = function () {
        var store = this.store.store();
        var t = new Ext.tree.TreePanel({
            model: this.model.type,
            store: store,
            autoScroll:true,
            border: false,
            rootVisible: false,
            multiSelect: false,
            checkModel: 'cascade',
            requestMethod: 'post',
            animate: true,
            listeners: {
                itemclick: {
                    fn: function (view, record, item, index, e, eOpts) {
                        var data = record.raw;
                        if (data && data.X && data.Y) {
                            EMap.MoveTo(data.X, data.Y);
                        }
                    }
                }
            },
            root: {
                text: '桐梓县标注分布'
            }
        });
        return t;
    };

    //定位标注点
    function locationMark(options) {
        var defaults = {
            ID: undefined, Name: undefined, Color: undefined, IconCls: undefined, Coordinates: undefined, X: undefined, Y: undefined,
            MarkType: { ID: undefined, Color: undefined, IconCls: undefined, Type:undefined }
        };
        Ext.apply(defaults, options);
        var color = defaults.Color || defaults.MarkType.Color;
        var icon = defaults.IconCls || defaults.MarkType.IconCls;
        switch (defaults.MarkType.Type) {
            case 1:
                //标注点
                var html = String.Format("<img style='width:32px;height:32px;' src='../Resources/images/mark/{0}'  title='{1}'></img>", icon, defaults.Name);
                EMap.DrawDot(defaults.ID, { x: defaults.X, y: defaults.Y, exX:16, exY:16 }, { iconCls: icon, text: defaults.Name, html: html });
                break;
            case 2:
                //标注线
                EMap.DrawLine(defaults.ID, { coords: defaults.Coordinates, color: '#' + color }, { x: defaults.X, y: defaults.Y });
                break;
            case 3:
                //标注面
                EMap.DrawPoly(defaults.ID, { coords: defaults.Coordinates, fillcolor: '#' + color }, { x: defaults.X, y: defaults.Y });
                break;
            default: break;
        }
        EMap.MoveTo(defaults.X, defaults.Y);
    }
    //查询标注点
    function queryCallback(form) {
        //添加到查询结果容器中
        //debugger;
        var c = Ext.getCmp(resultcontainerid);
        c.removeAll(true);

        var items = form.items.items;
        var p = '';
        for (var i = 0; i < items.length; i++)
        {
            var cp = items[i];
            if (cp.value) {
                p += '&' + cp.name + '=' + cp.value;
            }
        }        

        c.add($.query.grid.grid({
            params: p
        }));
        if (c.collapsed) {
            c.expand();
        }
        EMap.Clear();
    }
})(markQuery);