/// <reference path="extjs4.2/ext-all-dev.js" />
/// <reference path="common.js" />
/// <reference path="Config.js" />
/// <reference path="MapHelper.js" />

var MarkRangeManager = (function () {

    var url = 'Mark/MarkHelp.ashx?req=';

    Ext.define("Com.tigerhz.Pgis.Mark", {
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
                model: 'Com.tigerhz.Pgis.Mark',
                store: store,
                border: false,
                //rootVisible: false,
                //multiSelect: false,
                //checkModel: 'cascade',
                //requestMethod: 'post',
                //animate: true,
                listeners: {
                    itemclick: {
                        fn: function (view, record, item, index, e, eOpts) {
                            var id = 'PolyLayer_' + record.raw.ID + '_' + index;
                            var data = { coords: record.raw.coords, fillcolor: '#' + record.raw.Color };
                            var center = { x: record.raw.X, y: record.raw.Y };
                            mapGDI.DrawPloy(id, data, center);
                        }
                    }
                },
                root: {
                    text: '桐梓县'
                    //children: [{
                    //    text: '123',
                    //    children: {
                    //        text: '321',
                    //        leaf:true
                    //    }
                    //},
                    //{
                    //    text: '333',
                    //    leaf:true
                    //}]
                }
            });
            return tree;
        },
        GetTypeStore: function () {

        },
        InvokeSearchForm: function (id) {
            Ext.getCmp("cQueryCondition").removeAll();
            var c = qForm.getQueryForm(qForm.qFormType.mark, this.SearchFn);
            Ext.getCmp("cQueryCondition").add(c);
        },
        SearchFn:function(){

        }
    };
    return o;
})();