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
/// <reference path="../Company/Company.js" />
/// <reference path="buildingpopulation.js" />
/// <reference path="buildingcompany.js" />

var $room = $room || {};

(function ($) {

    var basic_url = $.basic_url = 'Buildings/BuildingHelp.ashx?req=';
    var tabpanel = ExtHelper.CreateTabPanelFn();

    $.loadBuildinghandler = function (c) {
        if (typeof $building !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $building, 'Buildings/building.js', function () {
            c();
        });
    };

    $.loadParamHandler = function (c) {
        if (typeof $param !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $param, 'Resources/js/Param.js', function () {
            c();
        });
    };

    $.loadCompanyHandler = function (c) {
        $.loadParamHandler(function () {
            if (typeof $bcompany !== 'undefined') {
                return c();
            }

            LoadModlues.loadJS(typeof $bcompany, 'Buildings/buildingcompany.js', function () {
                c();
            });
        });
    };

    $.loadPopHandler = function (c) {
        if (typeof $bpop !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $bpop, 'Buildings/buildingpopulation.js', function () {
            c();
        });
    };

    $.Show = function (options) {
        var defaults = { title: '楼房信息管理...', /*大楼ID*/id: 0, /*单位ID*/uid:0, /* @大楼信息*/buildinginfo: null, unitinfo: null };
        Ext.apply(defaults, options);

        init(defaults.id, defaults.uid, options);

        var wind = $.window = ExtHelper.CreateWindow({
            title: defaults.title, layout: 'fit', width: 800, height: 500,
            listeners: {
                'close': function () { $.window = null; }
            }
        });
        wind.add(tabpanel.tab);
    };

    function init(/*大楼ID*/id, /*单位ID*/uid, options) {
        var defaults = { buildinginfo: null, unitinfo: null };
        Ext.apply(defaults, options);

        $.grid.buildinginfo = defaults.buildinginfo;
        $.grid.unitinfo = defaults.unitinfo;

        tabpanel = ExtHelper.CreateTabPanelFn();
        addRooms(uid);

        $room.usetype.Grid(function (grid) {
            tabpanel.add({ component: grid.grid, title: '房屋用途', closable: false });
            tabpanel.tab.setActiveTab(0);
        });

        $room.property.Grid(function (grid) {
            tabpanel.add({ component: grid.grid, title: '房屋属性', closable: false });
            tabpanel.tab.setActiveTab(0);
        });

        $room.popu.Grid({ ids: uid, req: 'popsonhouse', pager: true, enable: true, buildinginfo: defaults.buildinginfo, unitinfo: defaults.unitinfo }, function (grid) {
            
            for (var i = grid.grid.columns.length - 1; i >= 0; i -= 1) {
                var col = grid.grid.columns[i];
                switch (col.dataIndex) {
                    case "CardNo":
                    case "Nation":
                    case "CurrentAddress":
                        //case "Education":
                        //case "PoliticalStatus":
                        //case "SoldierStatus":
                        //case "MarriageStatus":
                        //case "Religion":
                        //case "LiveType":
                        col.show();
                        break;
                    default:
                        break;
                }
            }
            tabpanel.add({ component: grid.grid, title: '人员信息', closable: false });
            tabpanel.tab.setActiveTab(0);
            $room.popu.bstores = grid.store;
        });

        $room.company.Grid({ ids: uid, req: 'compsonhouse', enable: true, buildinginfo: defaults.buildinginfo, unitinfo: defaults.unitinfo }, function (grid) {

            for (var i = grid.grid.columns.length - 1; i >= 0; i -= 1) {
                var col = grid.grid.columns[i];
                switch (col.dataIndex) {
                    case "Addr":
                        //case "TradeName":
                        //case "MainFrame":
                        col.show();
                        break;
                    default:
                        break;
                }
            }

            tabpanel.add({ component: grid.grid, title: '企业信息', closable: false });
            tabpanel.tab.setActiveTab(0);
            $room.company.bstores = grid.store;
        });
    }

    function addRooms(id) {
        var roomgrid = $.grid.Grid({ id: id, callback: Ext.emptyFn });

        var panelid = identityManager.createId();
        var northid = identityManager.createId();
        var centerid = identityManager.createId();
        var component = new Ext.panel.Panel({
            layout: 'border',
            border: 0,
            items: [{
                //xtype: 'panel',
                region: 'center',
                border: 0,
                items: [roomgrid]
            }, {
                //xtype: 'panel',
                region: 'east',
                border: 'border',
                id: panelid,
                border: 0,
                width: 0,
                items: [{
                    //xtype: 'panel',
                    region: 'north',
                    layout: 'fit',
                    height: 158,
                    id: northid,
                    items: []
                }, {
                    //xtype: 'panel',
                    region: 'center',
                    layout: 'fit',
                    id: centerid,
                    style: 'margin-top:1px;',
                    split: true,
                    items: []
                }]
            }]
        });
        roomgrid.on('selectionchange', function () {

            $room.company.rstores = null;
            $room.popu.rstores = null;

            var records = roomgrid.getSelectionModel().getSelection();
            var ids = records.Each(function (a) { return a.get('Room_ID'); });
            var panel = component.getComponent(panelid);
            if (ids.length) {
                panel.setWidth(300);

                var nmask = maskGenerate.start({ p: northid, msg: '正在获取，请稍等 ...' });
                $room.company.Grid({ ids: ids, buildinginfo: $room.grid.buildinginfo, unitinfo: $room.grid.unitinfo, roominfo: records[0].getData() }, function (grid) {

                    var northpanel = panel.getComponent(northid);
                    northpanel.removeAll();
                    northpanel.add(grid.grid);

                    nmask.stop();
                    $room.company.rstores = grid.store;
                });

                var cmask = maskGenerate.start({ p: centerid, msg: '正在获取，请稍等 ...' });
                $room.popu.Grid({ ids: ids, height: 283, buildinginfo: $room.grid.buildinginfo, unitinfo: $room.grid.unitinfo, roominfo: records[0].getData() }, function (grid) {

                    var centerpanel = panel.getComponent(centerid);
                    centerpanel.removeAll();
                    centerpanel.add(grid.grid);
                    centerpanel.doLayout();

                    cmask.stop();
                    $room.popu.rstores = grid.store;
                });

                panel.doLayout();
            } else {
                panel.setWidth(0);
            }
        });

        tabpanel.add({ component: component, title: '房屋信息', closable: false });
    }

})($room);

(function ($) {

    var tp = $.type = identityManager.createId('model');

    var model = Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Room_ID' },
            { name: 'RoomName' },
            { name: 'RoomName2' },
            { name: 'RoomArea' },
            { name: 'RoomUseID' },
            { name: 'RoomUse' },
            { name: 'RoomAttributeID' },
            { name: 'RoomAttribute' },
            { name: 'UnitID' },
            { name: 'UnitName' },
            { name: 'OwnerInfoID' }
        ]
    });

})(Object.$Supper($room, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { req: 'rooms', storeId: identityManager.createId(), model: $room.model.type, total: true, pageSize: 18, callback: Ext.emptyFn };
        Ext.apply(defaults, options);
        defaults.url = String.Format('{0}{1}', $room.basic_url, defaults.req);

        var store = ExtHelper.CreateStore(Ext.apply(defaults, {
            listeners: {
                'load': function (a, b, c) {
                    defaults.callback(a, b, c);
                }
            }
        }));
        return store;
    };

})(Object.$Supper($room, 'store'));

(function ($) {

    //@ 大楼信息
    var buildinginfo = $.buildinginfo = null;
    //@ 单元信息
    var unitinfo = $.unitinfo = null;

    var columns = $.columns = [
        { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Room_ID', text: '房屋表ID', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'RoomName', text: '名称', flex: 1, sortable: false, hidden: false },
        { dataIndex: 'RoomName2', text: '别名', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'RoomArea', text: '面积 (㎡)', flex: 1, sortable: false, hidden: false },
        { dataIndex: 'RoomUseID', text: '房屋用途ID', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'RoomUse', text: '用途', flex: 1, sortable: false, hidden: false },
        { dataIndex: 'RoomAttributeID', text: '房屋属性ID', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'RoomAttribute', text: '属性', flex: 1, sortable: false, hidden: false },
        { dataIndex: 'UnitID', text: '所属单元ID', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'UnitName', text: '所属单元', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'OwnerInfoID', text: '所属楼房ID', flex: 1, sortable: false, hidden: true }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { id: 0, callback: Ext.emptyFn, pager:false };
        Ext.apply(defaults, options);

        var store = $.store = $room.store.Store({ total: defaults.pager, req: String.Format('rooms&id={0}', defaults.id) });
        var grid = $.grid = ExtHelper.CreateGrid({
            columns: columns, store: store, pager: defaults.pager, height: 444,
            toolbar: {
                enable: true, add: addFn, update: updFn, del: delFn
            }
        });
        return grid;
    };

    function addFn(grid) {
        $room.form.Show({ req: 'addroom' }, grid);
    }

    function updFn(grid) {
        $room.loadBuildinghandler(function () {
            
            $building.updateCallback({
                grid: grid,
                callback: function (data) {
                    $room.form.Show({ req: 'uproom', data: data }, grid);
                }
            });
        });
    }

    function delFn(grid) {
        var mask = maskGenerate.start({ p: grid.up('tabpanel').getId(), msg: '正在获取，请稍等 ...' });
        $room.loadBuildinghandler(function () {
            mask.stop();
            $building.deleteCallback({
                grid: grid,
                callback: function (data) {
                    var ids = data.Each(function (a) { return a.get('Room_ID'); });

                    $building.deleteAction({
                        req: 'delrooms', ids: ids, callback: function (result) {
                            var defaults = { result: undefined, msg: errorState.DeleteFail, success: false };
                            Ext.apply(defaults, result);

                            if (defaults.result) {
                                $room.grid.store.load();
                            } else {
                                errorState.show(errorState.DeleteFail);
                            }
                        }
                    });
                }
            });
        });
        
    }

})(Object.$Supper($room, 'grid'));

(function ($) {

    var Form = $.Form = function (options) {
        var defaults = { req: null, data: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var form = $building.getForm({ req: defaults.req, callback: defaults.callback });

        var useid = identityManager.createId();
        var propid = identityManager.createId();
        var nameid = identityManager.createId();
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'Room_ID',
            name: 'Room_ID',
            value: '0'
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'UnitID',
            name: 'UnitID',
            value: $room.grid.unitinfo ? $room.grid.unitinfo.Unit_ID : '0'
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'UnitName',
            name: 'UnitName',
            value: $room.grid.unitinfo ? $room.grid.unitinfo.UnitName : ''
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'OwnerInfoID',
            name: 'OwnerInfoID',
            value: $room.grid.unitinfo ? $room.grid.unitinfo.OwnerInfoID : '0'
        }, {
            xtype: 'textfield',
            fieldLabel: '房屋名称',
            emptyText: '请输入房屋名称',
            name: 'RoomName',
            allowBlank: false,
            listeners: {
                'blur': function () {
                    var comp = this;
                    var com = form.getComponent(nameid);
                    if (!com.getValue()) {
                        com.setValue(comp.getValue());
                    }
                }
            }
        }, {
            xtype: 'textfield',
            fieldLabel: '房屋别名',
            emptyText: '请输入房屋别名',
            name: 'RoomName2',
            id: nameid,
            allowBlank: false
        }, {
            xtype: 'textfield',
            fieldLabel: '面积(㎡)',
            emptyText: '请输入房屋面积',
            name: 'RoomArea',
            regex: /^[1-9]{1}[0-9.]{0,}$/,
            allowBlank: false
        }, {
            xtype: 'combobox',
            fieldLabel: '房屋用途',
            emptyText: '请选择房屋用途',
            name: 'RoomUseID',
            hiddenName: 'RoomUseID',
            store: function () {
                var data = [];
                $room.usetype.grid.store.data.items.Each(function (e) {
                    var d = e.getData();
                    if (d.Disabled)
                        data.push(d);
                });

                var s = new Ext.data.SimpleStore({
                    fields: ['ID', 'Name'],
                    data: []
                });
                s.loadData(data);
                return s;
            }(),
            queryMode: 'local',
            displayField: 'Name',
            valueField: 'ID',
            forceSelection: true,
            editable: false,
            triggerAction: 'all',
            allowBlank: false,
            listeners: {
                'change': function (obj, value, eOpts) {
                    var comp = this;
                    form.getComponent(useid).setValue(comp.getRawValue());
                }
            }
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'RoomUse',
            name: 'RoomUse',
            id: useid,
            value: ''
        }, {
            xtype: 'combobox',
            fieldLabel: '房屋属性',
            emptyText: '请选择房屋属性',
            name: 'RoomAttributeID',
            hiddenName: 'RoomAttributeID',
            store: function () {
                var data = [];
                $room.property.grid.store.data.items.Each(function (e) {
                    var d = e.getData();
                    if (d.Disabled)
                        data.push(d);
                });

                var s = new Ext.data.SimpleStore({
                    fields: ['ID', 'Name'],
                    data: []
                });
                s.loadData(data);
                return s;
            }(),
            queryMode: 'local',
            displayField: 'Name',
            valueField: 'ID',
            forceSelection: true,
            editable: false,
            triggerAction: 'all',
            allowBlank: false,
            listeners: {
                'change': function (obj, value, eOpts) {
                    var comp = this;
                    form.getComponent(propid).setValue(comp.getRawValue());
                }
            }
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'RoomAttribute',
            name: 'RoomAttribute',
            id: propid,
            value: ''
        });

        if (defaults.data) {
            form.loadRecord(defaults.data);
        }

        return form;
    };

    var Show = $.Show = function (options, grid) {
        var defaults = { req: null, data: null, title: '编辑信息...', width: 600, height: 216, callback: submitCallback };
        Ext.apply(defaults, options);

        var mask = maskGenerate.start({ p: grid.up('tabpanel').getId(), msg: '正在获取，请稍等 ...' });
        $room.loadBuildinghandler(function () {
            $room.loadParamHandler(function () {
                var form = Form({ req: defaults.req, data: defaults.data, callback: defaults.callback });

                var wind = $.window = ExtHelper.CreateWindow({
                    title: defaults.title, width: defaults.width, height: defaults.height
                });
                wind.add(form);

                mask.stop();
            });
        });        
    };

    function submitCallback(result) {
        var defaults = { result: undefined, msg: errorState.SubmitFail, success: false };
        Ext.apply(defaults, result.action.result);

        if (defaults.result > 0) {
            $room.grid.store.load();
            $.window.close();
        } else if (defaults.result == -2) {
            errorState.show('重复的名称或者别名！');
        } else {
            errorState.show(errorState.SubmitFail);
        }
    }

})(Object.$Supper($room, 'form'));

(function ($) {

    var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'ID', text: '用途ID', hidden: true, width: 45 },
            { dataIndex: 'Name', text: '用途名称', flex: 2, sortable: false },
            { dataIndex: 'Code', text: '用途代码', flex: 1, sortable: false },
            { dataIndex: 'Disabled', text: '是否启用', width: 60, sortable: false, renderer: function (a, b, c) { return a ? "启用" : "禁用"; } },
            { dataIndex: 'Sort', text: '排序', width: 45, hidden: true, sortable: false }
    ];

    var Grid = $.Grid = function (c) {
        $room.loadParamHandler(function () {
            var grid = $.grid = $param.grid.Grid({
                columns: columns, url: {
                    grid: String.Format('{0}uses', $building.basic_url),
                    add: String.Format('{0}adduses', $building.basic_url),
                    upd: String.Format('{0}upduses', $building.basic_url),
                    del: String.Format('{0}deluses', $building.basic_url)
                }, callback: function (options) {
                    grid.store.load();
                }
            });
            c(grid);
        });
    };

})(Object.$Supper($room, 'usetype'));

(function ($) {

    var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'ID', text: '属性ID', hidden: true, width: 45 },
            { dataIndex: 'Name', text: '属性名称', flex: 2, sortable: false },
            { dataIndex: 'Code', text: '属性代码', flex: 1, sortable: false },
            { dataIndex: 'Disabled', text: '是否启用', width: 60, sortable: false, renderer: function (a, b, c) { return a ? "启用" : "禁用"; } },
            { dataIndex: 'Sort', text: '排序', width: 45, hidden: true, sortable: false }
    ];

    var Grid = $.Grid = function (c) {
        $room.loadParamHandler(function () {
            var grid = $.grid = $param.grid.Grid({
                columns: columns, url: {
                    grid: String.Format('{0}props', $building.basic_url),
                    add: String.Format('{0}addprops', $building.basic_url),
                    upd: String.Format('{0}updprops', $building.basic_url),
                    del: String.Format('{0}delprops', $building.basic_url)
                }, callback: function (options) {
                    grid.store.load();
                }
            });
            c(grid);
        });
    };

})(Object.$Supper($room, 'property'));

(function ($) {

    var bstores = $.bstores = null;
    var rstores = $.rstores = null;

    $.Grid = function (options, c) {
        $room.loadCompanyHandler(function () {
            var grid = $bcompany.grid.Grid(Ext.apply(options, {
                callback: function () {

                    if ($.bstores)
                        $.bstores.load();

                    if ($.rstores)
                        $.rstores.load();
                }
            }));
            c(grid);
        });
    };

    $.Add = function (s) {
        stores.push(s);
    };

})(Object.$Supper($room, 'company'));

(function ($) {

    var bstores = $.bstores = null;
    var rstores = $.rstores = null;

    $.Grid = function (options, c) {
        $room.loadPopHandler(function () {
            var grid = $bpop.grid.Grid(Ext.apply(options, {
                callback: function () {

                    if ($.bstores)
                        $.bstores.load();

                    if ($.rstores)
                        $.rstores.load();
                }
            }));
            c(grid);
        });
    };

})(Object.$Supper($room, 'popu'));