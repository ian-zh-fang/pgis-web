/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Company/Company.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Population/populationDetail.js" />
/// <reference path="building.js" />
/// <reference path="room.js" />

var $bunit = $bunit || {};

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

    $.loadRoomhandler = function (c) {
        if (typeof $room !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $building, 'Buildings/room.js', function () {
            c();
        });
    };

})($bunit);

(function ($) {

    var tp = $.type = identityManager.createId('model');

    var model = $.model = Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Unit_ID' },
            { name: 'UnitName' },
            { name: 'OwnerInfoID' },
            { name: 'Sort' }
        ]
    });

})(Object.$Supper($bunit, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { storeId: identityManager.createId(), model: $bunit.model.type, req: null, total: false, pageSize: 15, load:Ext.emptyFn };
        Ext.apply(defaults, options);
        defaults.url = String.Format('{0}{1}', $bunit.basic_url, defaults.req);
        defaults.listeners = {
            'load':defaults.load
        };

        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($bunit, 'store'));

(function ($) {

    //@ 大楼信息
    var buildinginfo = null;

    var columns = [
        { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Unit_ID', text: '楼房ID', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'UnitName', text: '楼房名称', sortable: false, hidden: false, flex: 1 },
        { dataIndex: 'OwnerInfoID', text: '大楼', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'Sort', text: '排序', sortable: false, hidden: true, flex: 1 }
    ];

    $.Grid = function (options) {
        var defaults = { req: 'units', ids: 0, pager: false, title: '楼房信息', ownerinfo: null, load:Ext.emptyFn };
        Ext.apply(defaults, options);
        buildinginfo = defaults.ownerinfo;

        var store = $.store = $bunit.store.Store({ req: String.Format('{0}&ids={1}', defaults.req, defaults.ids), total: defaults.pager, load:defaults.load });
        var grid = ExtHelper.CreateGrid({
            columns: columns, store: store, pager: defaults.pager, height: 440,
            toolbar: {
                enable: true,
                items: ['->',
                    {
                        xtype: 'button',
                        text: '添加',
                        iconCls: 'badd',
                        handler: function (grid) {
                            addFn({ grid: grid, ownerinfo: defaults.ownerinfo });
                        }
                    }, {
                        xtype: 'button',
                        text: '修改',
                        iconCls: 'bupdate',
                        handler: updFn
                    }, {
                        xtype: 'button',
                        text: '删除',
                        iconCls: 'bdel',
                        handler: delFn
                    }, {
                        xtype: 'button',
                        text: '信息管理',
                        iconCls: 'barea',
                        handler: infoCallback
                    }
                ]
            }
        });


        return grid;
    };

    function addFn(options) {
        var defaults = { grid: null, ownerinfo: null };
        Ext.apply(defaults, options);

        $bunit.form.Show({ req: 'addunit', ownerinfo: defaults.ownerinfo });
    }

    function updFn(grid) {
        var mask = maskGenerate.start({ p: grid.up('tabpanel').getId(), msg: '正在获取，请稍等 ...' });

        mask.stop();
        $bunit.loadBuildinghandler(function () {

            $building.updateCallback({
                grid: grid,
                callback: function (data) {
                    $bunit.form.Show({ req: 'upunit', data: data, ownerinfo: buildinginfo });
                }
            });
        });
    }

    function delFn(grid) {
        var mask = maskGenerate.start({ p: grid.up('tabpanel').getId(), msg: '正在获取，请稍等 ...' });
        $bunit.loadBuildinghandler(function () {
            mask.stop();

            $building.deleteCallback({
                grid: grid,
                callback: function (data) {
                    var ids = data.Each(function (a) { return a.get('Unit_ID'); });
                    $building.deleteAction({
                        req: 'delunits', ids: ids, callback: function (a) {
                            delCallback(a);
                        }
                    });
                }
            });
        });
        
    }

    function delCallback(result) {
        var defaults = { result: undefined, msg: errorState.DeleteFail, success: false };
        Ext.apply(defaults, result);

        if (defaults.result) {
            $bunit.grid.store.load();
        } else {
            errorState.show(errorState.DeleteFail);
        }
    }

    function infoCallback(grid) {
        var mask = maskGenerate.start({ p: grid.up('tabpanel').getId(), msg: '正在获取，请稍等 ...' });
        $bunit.loadBuildinghandler(function () {
            mask.stop();
            
            $building.updateCallback({
                grid: grid,
                callback: function (a, b) {
                    infoActionCallback(a, b);
                }
            });
        });
    }

    function infoActionCallback(data, grid) {
        $bunit.loadRoomhandler(function () {

            data = data.getData();
            //@ 在此显示房屋信息
            $room.Show({ id: data.OwnerInfoID, uid: data.Unit_ID, unitinfo: data, buildinginfo: buildinginfo });
        });
    };

})(Object.$Supper($bunit, 'grid'));

(function ($) {

    var Form = $.Form = function (options) {
        var defaults = { req: null, data: null, callback: Ext.emptyFn, ownerinfo: null };
        Ext.apply(defaults, options);

        var form = $building.getForm({ req: defaults.req, callback: defaults.callback });

        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'Address',
            name: 'Address',
            value: defaults.ownerinfo ? defaults.ownerinfo.MOI_OwnerAddress : ''
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'Unit_ID',
            name: 'Unit_ID',
            value: '0'
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'OwnerInfoID',
            name: 'OwnerInfoID',
            value: defaults.ownerinfo ? defaults.ownerinfo.MOI_ID : ''
        }, {
            xtype: 'textfield',
            emptyText: '请输入楼房名称。例如：一单元，一号楼，A座，B座 ...',
            fieldLabel: '楼房名称',
            name: 'UnitName',
            value: defaults.ownerinfo ? defaults.ownerinfo.MOI_OwnerName : '',
            allowBlank: false
        }, {
            xtype: 'hiddenfield',
            //emptyText: '',
            fieldLabel: '排序方式',
            name: 'Sort',
            value: '0',
            allowBlank: false
        });

        if (defaults.data) {
            form.loadRecord(defaults.data);
        }

        return form;
    };

    var Show = $.Show = function (options) {
        var defaults = { title: '编辑信息...', req: null, data: null, width: 500, height: 110, callback: submitCallback, ownerinfo: null };
        Ext.apply(defaults, options);

        var form = Form(defaults);
        var wind = $.window = ExtHelper.CreateWindow({
            title: defaults.title, width: defaults.width, height: defaults.height,
            listeners: {
                'close': function () {
                    $.window = null;
                }
            }
        });
        wind.add(form);
    };

    function submitCallback(result) {
        var defaults = { result: undefined, msg: errorState.SubmitFail, success: false };
        Ext.apply(defaults, result.action.result);

        if (defaults.result > 0) {
            $bunit.grid.store.load();
            $.window.close();
        } else if (defaults.result == -2) {
            errorState.show('重复的单元名称！');
        } else {
            errorState.show(errorState.SubmitFail);
        }
    }

})(Object.$Supper($bunit, 'form'));