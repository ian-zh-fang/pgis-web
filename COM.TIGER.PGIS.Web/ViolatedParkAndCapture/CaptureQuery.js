/// <reference path="../Resources/js/extjs4.2/ext-all.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/Utils.js" />

var captureQuery = captureQuery || {};
(function ($) {
    //全局私有变量
    var now = new Date().getTime();
    var url = 'ViolatedParkAndCapture/Capture.ashx?req=';
    var iconpath = "../Resources/images/mark/";

    //原型
    $.fn = $.constructor.prototype;

    $.model = { type: String.Format("model_{0}", now) };
    $.model.model = function () {
        var m = Ext.define($.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'Color' },
                { name: 'IconCls' },
                { name: 'Type' },
                { name: 'Remark' }
            ]
        });
        return m;
    }();

    $.store = { id: String.Format("store_{0}", now) };
    $.store.Store = function (options) {
        var defaults = { req: 'tree', params: {} };
        Ext.apply(defaults, options);

        var store = Ext.create('Ext.data.TreeStore', {
            proxy: { type: 'ajax', url: url + defaults.req + getParams(defaults.params) },
            loadMask: true,
            autoLoad: true,
            listeners: {
                beforeappend: {
                    fn: function (parent, node, eOpts) {
                        //debugger;
                        var data = node.getData();
                        if (data.id == 'root') {
                            EMap.Clear();
                            return;
                        }
                        if (data.children && data.children instanceof Array && data.children.length > 0) {
                            var raw = node.raw;
                            //绘图
                            for (var i = 0; i < data.children.length; i++) {
                                var d = data.children[i];
                                d.TypeInfo = raw;
                                locationMark(d);
                            }
                        }
                    }
                }
            }
        });
        return store;
    };

    $.tree = {};
    $.tree.store = $.store.Store({ req: 'tree' });
    $.tree.tree = function () {
        var t = new Ext.tree.TreePanel({
            model: $.model.type,
            store: $.tree.store,
            border: false,
            rootVisible: false,
            multiSelect: false,
            checkModel: 'cascade',
            requestMethod: 'post',
            animate: true,
            listeners: {
                itemclick: {
                    fn: function (view, record, item, index, e, eOpts) {
                        //debugger;
                        var data = record.raw;
                        if (data && data.X && data.Y) {
                            EMap.MoveTo(data.X, data.Y);
                        }
                    }
                }
            },
            root: {
                text: '桐梓县违停抓拍点（区域）分布'
            }
        });
        return t;
    }();

    //绘图
    function locationMark(options) {
        var defaults = {
            ID: undefined, Name: undefined, Coordinates: undefined, X: undefined, Y: undefined, Type: undefined,
            TypeInfo: { ID: undefined, Color: undefined, IconCls: undefined, Type: undefined }
        };
        Ext.apply(defaults, options);
        
        switch (defaults.TypeInfo.Type) {
            case 1:
                //标注点
                var html = String.Format("<img style='width:32px;height:32px;' src='{2}{0}'  title='{1}'></img>", defaults.TypeInfo.IconCls, defaults.Name, iconpath);
                EMap.DrawDot(defaults.ID, { x: defaults.X, y: defaults.Y, exX: 16, exY: 16 }, { iconCls: '', text: defaults.Name, html: html });
                break;
            case 2:
                //标注线
                EMap.DrawLine(defaults.ID, { coords: defaults.Coordinates, color: '#' + defaults.TypeInfo.Color }, { x: defaults.X, y: defaults.Y });
                break;
            case 3:
                //标注面
                //debugger;
                EMap.DrawPoly(defaults.ID, { coords: defaults.Coordinates, fillcolor: '#' + defaults.TypeInfo.Color }, { x: defaults.X, y: defaults.Y });
                break;
            default: break;
        }
        EMap.MoveTo(defaults.X, defaults.Y);
    }

})(captureQuery);