/// <reference path="extjs4.2/ext-all-dev.js" />
/// <reference path="common.js" />
/// <reference path="Config.js" />
/// <reference path="Utils.js" />
/// <reference path="MapHelper.js" />
/// <reference path="mapGDI.js" />

var AreaManager = (function () {    

    var url = 'Area/AreaHandler.ashx?req=';

    Ext.define("Com.tigerhz.Pgis.Arearange", {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'PID' },
            { name: 'Name' },
            { name: 'NewCode' },
            { name: 'OldCode' },
            { name: 'BelongToID' },
            { name: 'BelongToName' },
            { name: 'Description' }
        ]
    });

    Ext.define("Com.tigerhz.Pgis.Range", {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'Range' },
            { name: 'X' },
            { name: 'Y' },
            { name: 'Color' },
            { name: 'AreaID' }
        ]
    });

    var o = {
        areaStore: function () {
            var s = Ext.create('Ext.data.TreeStore', {
                proxy: {
                    type: 'ajax',
                    url: url + 'al'
                },
                loadMask: true,
                autoLoad: true
            });
            return s;
        },
        createTree: function () {
            var store = this.areaStore();
            var tree = new Ext.tree.TreePanel({
                model:'Com.tigerhz.Pgis.Arearange',
                store: store,
                border: false,
                rootVisible: true,
                multiSelect: true,
                checkModel: 'cascade',
                requestMethod: 'post',
                animate: true,
                listeners: {
                    itemclick: {
                        fn: function (view, record, item, index, e, eOpts) {
                            if (record.raw.Ranges && record.raw.Ranges instanceof Array && record.raw.Ranges.length > 0) {
                                Ext.Array.each(record.raw.Ranges, function (o, index) {

                                    var id = 'PolyLayer_' + record.raw.ID + '_' + index;
                                    var data = { coords: o.Range, fillcolor: '#' + o.Color, name: record.raw.Name, description: record.raw.Description };
                                    var center = { x: o.X, y: o.Y };
                                    EMap.DrawPoly(id, data, center, function () {

                                        var content = "<div style='width:300px;margin-top:20px;'><div style='padding:5px 0px'><b>名称：</b>" + data.name + "</div><div style='padding:5px 0px'><b>简介：</b>" + data.description + "</div></div>";
                                        vM.InfoWindow.Open(content, center.x, center.y);
                                    });
                                });
                            }
                        }
                    }
                },
                root: {
                    text: '桐梓县公安局'
                }
            });
            return tree;
        },
        queryForm: function (id) {
            var tree = this.createTree();
            var eid = 'extWest';
            if (typeof (id) != 'undefined') {
                eid = id;
            }
            var c = Ext.getCmp(eid);
            c.remove('AreaID');
            c.insert(0,{
                title: '辖区分布',
                id:'AreaID',
                border: false,
                //iconCls: 'barea',
                //autoScroll: true,
                overflowX: 'hidden',
                overflowY: 'auto',
                //bodyPadding: 5,
                items: [tree]
            });
        }
    };
    return o;
})();