/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="building.js" />

var $bphoto = $bphoto || {};

(function ($) {

    var basic_url = $.basic_url = 'Buildings/BuildingHelp.ashx?req=';

    $.loadBuildinghandler = function (c) {
        if (typeof $building !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $building, 'Buildings/building.js', function () {
            c();
        });
    };

})($bphoto);

(function ($) {

    var tp = $.type = identityManager.createId('model');

    var model = $.model = Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'MOP_ID' },
            { name: 'MOP_MOI_ID' },
            { name: 'MOP_ImgName' },
            { name: 'MOP_ImgTitle' },
            { name: 'MOP_ImgRemark' },
            { name: 'MOP_ImgPath' }
        ]
    });

})(Object.$Supper($bphoto, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { req: 'picts', storeId: identityManager.createId(), model: $bphoto.model.type, total: false };
        Ext.apply(defaults, options);
        defaults.url = String.Format('{0}{1}', $bphoto.basic_url, defaults.req);

        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($bphoto, 'store'));

(function ($) {

    var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'MOP_ID', text: '照片ID', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MOP_MOI_ID', text: '大楼ID', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MOP_ImgName', text: '名称', sortable: false, hidden: false, flex: 1 },
            { dataIndex: 'MOP_ImgTitle', text: '标题', sortable: false, hidden: false, flex: 1 },
            { dataIndex: 'MOP_ImgPath', text: '路径', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MOP_ImgRemark', text: '备注', sortable: false, hidden: false, flex: 2 }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { id: 0, pager: false };
        Ext.apply(defaults, options);

        var store = $.store = $bphoto.store.Store({ req: String.Format('picts&id={0}', defaults.id), total: defaults.pager });
        var grid = $.grid = ExtHelper.CreateGrid({
            columns: columns, store: store, pager: defaults.pager,
            toolbar: {
                enable: true, add: function (grid) {
                    var btn = this;

                    addFn({ id: defaults.id, grid: grid, button: btn });
                }, del: delFn
            }
        });
        return grid;
    };

    var Show = $.Show = function (options) {
        var defaults = { title: '大楼照片管理...', height: 400, width: 600, id: 0 };
        Ext.apply(defaults, options);

        var wind = $.window = ExtHelper.CreateWindow({
            title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit'
        });
        wind.add(Grid({ id: defaults.id }));
    };

    function addFn(options) {
        var defaults = { id: 0, grid: null, button: null };
        Ext.apply(defaults, options);

        $bphoto.form.Show({ id: defaults.id });
    }

    function updFn(grid) {
        $bphoto.loadBuildinghandler(function () {
            $building.updateCallback({
                grid: grid,
                callback: function (data) {
                    errorState.show(data.get('MOP_ID'));
                }
            });
        });
        
    }

    function delFn(grid) {
        $bphoto.loadBuildinghandler(function () {
            $building.deleteCallback({
                grid: grid,
                callback: function (data) {
                    var ids = data.Each(function (a) { return a.get('MOP_ID'); });

                    $building.deleteAction({
                        req: 'delpics', ids: ids, callback: function (r) {
                            if (r.result) {
                                $bphoto.grid.store.load();
                            } else {
                                errorState.show(errorState.DeleteFail);
                            }
                        }
                    });
                }
            });
        });
        
    }

})(Object.$Supper($bphoto, 'grid'));

(function ($) {

    var Show = $.Show = function (options) {
        var defaults = { req: 'upload', title: '上传楼房照片...', id: 0, width: 700, height: 300 };
        Ext.apply(defaults, options);

        var wind = $.window = ExtHelper.CreateWindow({
            title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit',
            listeners: {
                'close': function () {
                    $bphoto.grid.store.load();
                }
            }
        });
        wind.add({
            xtype: 'uploadpanel',
            border: 0,
            addFileBtnText: '选择文件...',
            uploadBtnText: '上传',
            removeBtnText: '移除所有',
            cancelBtnText: '取消上传',
            file_size_limit: 5,//MB
            file_types: '*.jpg; *.jpeg; *.gif; *.bmp; *.png',
            file_types_description: '图片',
            upload_url: String.Format('{0}{1}&id={2}', $bphoto.basic_url, defaults.req, defaults.id),
            completecallback: completecallback
        });
    };

    function completecallback(f) {
        var defaults = { id: 0, name: null, type: null, size: 0, filestatus: 0 };
        Ext.apply(defaults, f);


    }


})(Object.$Supper($bphoto, 'form'));