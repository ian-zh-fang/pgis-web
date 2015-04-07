/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Company/Company.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Population/populationDetail.js" />
/// <reference path="buildingunit.js" />
/// <reference path="buildingphoto.js" />
/// <reference path="buildingQuery.js" />
/// <reference path="buildingpopulation.js" />
/// <reference path="buildingcompany.js" />

var $building = $building || {};

(function ($) {

    var basic_url = $.basic_url = 'Buildings/BuildingHelp.ashx?req=';
    var wind = $.window = null;
    var tabpanel = ExtHelper.CreateTabPanelFn();

    $.loadParamHandler = function (c) {
        if (typeof $param !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $param, 'Resources/js/Param.js', function () {
            c();
        });
    };

    $.loadUnitHandler = function (c) {
        if (typeof $bunit !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $bunit, 'Buildings/buildingunit.js', function () {
            c();
        });
    };

    $.loadPhotoHandler = function (c) {
        if (typeof $bphoto !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $bphoto, 'Buildings/buildingphoto.js', function () {
            c();
        });
    };

    $.loadDetailHandler = function (c) {
        if (typeof buildingQuery !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof buildingQuery, 'Buildings/buildingQuery.js', function () {
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

    $.Show = function () {
        
        wind = $.window = ExtHelper.CreateWindow({ title: '楼房信息管理...', layout: 'fit', width: 850, height: 500 });

        var mask = maskGenerate.start({ p: wind.getId(), msg: '正在获取，请稍等 ...' });
        //初始化
        init(function () { }, function () { mask.stop(); });

        wind.add(tabpanel.tab);
    };

    var Add = $.Add = function (options) {
        var defaults = { component: null, title: null, closable: true };
        Ext.apply(defaults, options);

        return tabpanel.add(defaults);
    };

    var getSelections = $.getSelections = function (grid) {
        var rows = grid.grid.getSelectionModel().getSelection();
        if (rows.length == 0) {
            errorState.show(errorState.SelectRow);
        }
        return [].concat(rows);
    }

    var getOnlySelection = $.getOnlySelection = function (grid) {
        var rows = getSelections(grid);
        if (rows.length > 1) {
            errorState.show(errorState.SelectOnlyRow);
            return null;
        }
        return rows[0];
    }

    var updateCallback = $.updateCallback = function (options) {
        /// <summary>Delete Action</summary>
        /// <param name="options" type="Object">
        /// <para>grid:Ext.grid.Panel</para>
        /// <para>callback:Function(Object record)</para>
        /// </param>

        var defaults = { grid: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var data = null;
        if (data = getOnlySelection(defaults.grid)) {
            defaults.callback(data, defaults.grid);
        }
    };

    var deleteCallback = $.deleteCallback = function (options) {
        /// <summary>Delete Action</summary>
        /// <param name="options" type="Object">
        /// <para>grid:Ext.grid.Panel</para>
        /// <para>callback:Function(Array records)</para>
        /// </param>

        var defaults = { grid: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var data = getSelections(defaults.grid);
        if (data.length) {
            errorState.confirmYes(String.Format("是否删除选中的 {0} 项数据?", data.length), function () {
                defaults.callback(data, defaults.grid);
            });
        }
    };

    var deleteAction = $.deleteAction = function (options) {
        /// <summary>Delete Action</summary>
        /// <param name="options" type="Object">
        /// <para>req:String</para>
        /// <para>ids:String/Array</para>
        /// <para>callback:Function(Object result)</para>
        /// </param>

        var defaults = { req: null, ids: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);
        maskHandler.mask.Show();
        Ext.Ajax.request({
            url: String.Format('{0}{1}', basic_url, defaults.req),
            params: { ids: defaults.ids },
            method: 'post',
            success: function (a, b) {
                maskHandler.mask.Hide();
                var opts = { result: null, success: false, msg: errorState.DeleteFail };
                var result = Ext.JSON.decode(a.responseText);
                Ext.apply(opts, result);
                defaults.callback(opts);
            },
            failure: function (a, b) {
                maskHandler.mask.Hide();
                errorState.show(errorState.DeleteFail);
            }
        });
    };

    var submitAction = $.submitAction = function (options) {
        /// <summary>Form Submit Action</summary>
        /// <param name="options" type="Object">
        /// <para>req:String</para>
        /// <para>callback:Function(Object result)</para>
        /// </param>

        var defaults = { form: null, callback: Ext.emptyFn, req: null };
        Ext.apply(defaults, options);
        defaults.p = defaults.form.up('window').getId();

        if (defaults.form.isValid()) {
            
            var mask = maskGenerate.start({ p: defaults.p, msg: '正在提交，请稍后...' });
            defaults.form.submit({
                clientValidation: true,
                url: String.Format('{0}{1}', basic_url, defaults.req),
                success: function (form, action) {
                    defaults.callback(action);
                    mask.stop();
                },
                failure: function (form, action) {
                    mask.stop();
                    defaults.callback(action);
                }
            });
        }
    }

    var getForm = $.getForm = function (options) {
        /// <summary>Get Form Instance</summary>
        /// <param name="options" type="Object">
        /// <para>req:String</para>
        /// <para>callback:Function(Object result)</para>
        /// </param>

        var defaults = { req: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var form = ExtHelper.CreateForm({
            callback: function () {
                submitAction({
                    form: form, req: defaults.req, callback: function (a) {
                        defaults.callback({ form: form, action: a });
                    }
                });
            }
        });
        return form;
    }

    //@ 初始化
    function init(a,b) {

        addBuildingGrid(a,b);
        $.struct.Grid(function (options) {
            var defaults = { grid: null, store: null };
            Ext.apply(defaults, options);

            Add({ component: defaults.grid, title: '大楼结构信息管理', closable: false });
            tabpanel.tab.setActiveTab(0);
        });
    }

    function addBuildingGrid(a,b) {
        var id = identityManager.createId();
        var infogrid = $.grid.Grid({ beforeload: a || Ext.emptyFn, loaded: b || Ext.emptyFn });
        var component = new Ext.panel.Panel({
            layout: 'border',
            border: 0,
            items: [{
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                border: 0,
                items: [infogrid]
            }, {
                xtype: 'panel',
                region: 'east',
                width: 0,
                border: 1,
                id: id,
                //tbar: [String.Format('<span style="height:{0}px; line-height:{0}px; text-align:center; font-weight:700;">楼房信息:</span>', 21), '-'],
                items: []
            }]
        });

        infogrid.on('selectionchange', function () {

            var rows = infogrid.getSelectionModel().getSelection();
            var ids = rows.Each(function (a) { return a.getData().MOI_ID; });
            var comp = component.getComponent(id);
            if (ids.length == 1) {
                comp.setWidth(240);
                comp.removeAll();
                //comp.add($.unit.grid.Grid({ ids: ids, ownerinfo: rows[0].getData() }));
                var mask = maskGenerate.start({ p: id, msg: '正在获取，请稍等 ...' });
                $building.loadUnitHandler(function () {
                    var grid = $bunit.grid.Grid({ ids: ids, ownerinfo: rows[0].getData(), load: function () { mask.stop();} });
                    comp.add(grid);
                });
            } else {
                comp.setWidth(0);
            }
        });

        Add({ component: component, title: '大楼信息管理', closable: false });
    }

})($building);

(function ($) {

    var tp = $.type = identityManager.createId('model');
    var model = Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'MOI_ID' },//大楼ID
            { name: 'MOI_MEH_ID' },//热区详细ID
            { name: 'Building_ID' },//大楼子表ID
            { name: 'MOI_LabelName' },//大楼标题，应该和名称一致
            { name: 'MOI_OwnerName' },//大楼名称
            { name: 'MOI_OwnerAddress' },//地址
            { name: 'MOI_OwnerTel' },//联系电话
            { name: 'MEH_Croods' },//座标
            { name: 'MOI_OwnerDes' },//备注
            { name: 'StreetName' },//街道
            { name: 'StreetNumber' },//门牌号
            { name: 'FloorsCount' },//楼层数
            { name: 'RoomsCount' },//房间总数
            { name: 'AdminID' },//行政区划ID
            { name: 'AdminName' },//行政区划名称
            { name: 'RoomStructureID' },//大楼结构ID
            { name: 'RoomStructure' },//大楼结构名称
            { name: 'ElementHot' },  //热区信息详细信息
            { name: 'MEH_CenterX' },
            { name: 'MEH_CenterY' }
        ]
    });

})(Object.$Supper($building, 'model'));

(function ($) {

    $.getStore = function (options) {
        var defaults = { storeId: identityManager.createId(), model: $building.model.type, req: null, total: false, pageSize: 17, beforeload: Ext.emptyFn, loaded: Ext.emptyFn };
        Ext.apply(defaults, options);
        defaults.url = String.Format('{0}{1}', $building.basic_url, defaults.req);
        defaults.listeners = {
            'beforeload': defaults.beforeload,
            'load': defaults.loaded
        };

        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($building, 'store'));

(function ($) {

    var columns = $.columns = [
            {
                xtype: 'rownumberer', width: 30, sortable: false, text: '序', renderer: function (value, obj, record, index) { return index + 1; }
            },
            { dataIndex: 'MOI_OwnerName', text: '大楼名称', flex: 1, hidden: false, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
            { dataIndex: 'MOI_OwnerAddress', text: '详细地址', flex: 1, hidden: false, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
            { dataIndex: 'MOI_OwnerTel', text: '联系电话', flex: 1, hidden: false, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
            { dataIndex: 'MOI_OwnerDes', text: '备注', flex: 1, hidden: true, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
            {
                dataIndex: 'MOI_ID', text: '', width: 45, hidden: false, renderer: function (a, b, c) {
                    var data = c.getData();
                    var val = Object.$EncodeObj(data);
                    return String.Format('<span class="a" onclick="{0}(\'{1}\')" title="点击 定位到地图">定位</span>', '$building.grid.Location', val);
                }
            }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { req: 'pagebd', pager: true, beforeload: Ext.emptyFn, loaded: Ext.emptyFn };
        Ext.apply(defaults, options);

        var store = $.store = $building.store.getStore({ req: defaults.req, total: defaults.pager, beforeload: defaults.beforeload, loaded: defaults.loaded });
        var grid = $.grid = ExtHelper.CreateGrid({
            columns: columns, store: store, pager: defaults.pager,
            toolbar: {
                enable: true, add: addbd, update: editbd, del: delbd,
                items: [{
                    xtype: 'button',
                    text: '大楼人员',
                    iconCls: 'bgroup',
                    handler: popuFn
                }, {
                    xtype: 'button',
                    text: '大楼单位',
                    iconCls: 'bdwxx',
                    handler: companyFn
                }, {
                    xtype: 'button',
                    text: '大楼照片',
                    iconCls: 'bphotos',
                    handler: photoFn
                }, {
                    xtype: 'trigger',
                    triggerCls: 'x-form-search-trigger',
                    onTriggerClick: function () {
                        var me = this;
                        var value = me.getRawValue();
                        var mask = maskGenerate.start({ p: $building.window.getId(), msg: '正在获取，请稍等 ...' });
                        store.on('load', function () { mask.stop(); });
                        store.proxy.url = encodeURI(String.Format('{0}{1}&name={2}', $building.basic_url, defaults.req, value));
                        store.load();
                    },
                    width: 180,
                    emptyText: '输入大楼名称，快速检索',
                    enableKeyEvents: true
                }]
            }
        });
        return grid;
    };

    $.Location = function (v) {
        var data = Object.$DecodeObj(v);
        var defaults = { MEH_CenterX: 0, MEH_CenterY: 0, MOI_OwnerName: '', MOI_OwnerAddress: '', MOI_ID: 0 };
        Ext.apply(defaults, data);

        var html = String.Format('<div style="cursor:pointer; color:#15498b; font-size:11px; font-weight:700; background-color:#ddd; text-align:center; line-height:{1}px;" title="{0}({2})   点击查看详细" >{0}</div>', defaults.MOI_OwnerName, 16, defaults.MOI_OwnerAddress);
        EMap.AppendEntityEx({
            id: String.Format("x-bd-locate-{0}", defaults.MOI_ID),
            width: 65,
            height: 16,
            x: defaults.MEH_CenterX,
            y: defaults.MEH_CenterY,
            innerHTML: html,
            className: 'content-cut a',
            click: function () {
                Detail(data);
            }
        });

        EMap.MoveTo(defaults.MEH_CenterX, defaults.MEH_CenterY);
        $building.window.close();
    };

    var Detail = $.Detail = function (d, id) {
        var mask = maskGenerate.start({ p: id, msg: '正在获取，请稍等 ...' });
        $building.loadDetailHandler(function () {
            buildingQuery.ShowDetail(d);
            mask.stop();
        });
    };

    //@ 添加大楼热区
    function addbd() {
        $building.form.Show({ req: 'addbd' });
    }
    //@ 编辑大楼热区
    function editbd(grid) {
        $building.updateCallback({
            grid: grid,
            callback: function (data) { $building.form.Show({ req: 'upbd', data: data }); }
        });
    }
    //@ 移除大楼热区
    function delbd(grid) {
        $building.deleteCallback({
            grid: grid,
            callback: delCallback
        });
    }

    function photoFn(grid) {
        $building.updateCallback({
            grid: grid,
            callback: function (record) {
                var data = record.getData();
                var mask = maskGenerate.start({ p: grid.up('tabpanel').getId(), msg: '正在获取，请稍等 ...' });
                $building.loadPhotoHandler(function () {
                    $bphoto.grid.Show({ id: record.get('MOI_ID') });
                    mask.stop();
                });
            }
        });
    }
    
    function delCallback(data, grid) {
        var ids = data.Each(function (a) { return a.get('MOI_ID'); });

        $building.deleteAction({
            req: 'delbd', ids: ids, callback: function (r) {
                if (r.result) {
                    grid.grid.store.load();
                } else {
                    errorState.show(errorState.DeleteFail);
                }
            }
        });
    }

    function popuFn(grid) {
        $building.updateCallback({
            grid: grid,
            callback: function (record) {
                var data = record.getData();
                var mask = maskGenerate.start({ p: grid.up('tabpanel').getId(), msg: '正在获取，请稍等 ...' });
                $building.loadPopHandler(function () {
                    $building.popu.Grid({ ids: data.MOI_ID, req: 'poponbd', pager: true, enable: true, buildinginfo: data }, function (grid) {

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
                        
                        var wind = ExtHelper.CreateWindow({ title: String.Format('入住 {0} 的所有人员：', data.MOI_OwnerName), width: 600, height: 400, layout: 'fit' });
                        wind.add(grid.grid);
                        $building.popu.bstores = grid.store;
                        mask.stop();
                    });
                });
            }
        });
    }

    function companyFn(grid) {
        $building.updateCallback({
            grid: grid,
            callback: function (record) {
                var data = record.getData();
                var mask = maskGenerate.start({ p: grid.up('tabpanel').getId(), msg: '正在获取，请稍等 ...' });
                $building.loadCompanyHandler(function () {
                    $building.company.Grid({ ids: data.MOI_ID, req: 'comonbd', enable: true, buildinginfo: data }, function (grid) {

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
                        
                        var wind = ExtHelper.CreateWindow({ title: String.Format('入驻 {0} 的所有单位：', data.MOI_OwnerName), width: 600, height: 400, layout: 'fit' });
                        wind.add(grid.grid);
                        $building.company.bstores = grid.store;
                        mask.stop();
                    });
                });
            }
        });
    }

})(Object.$Supper($building, 'grid'));

(function ($) {

    var Form = $.Form = function (options) {
        var defaults = { req: null, data: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var form = $building.getForm({ req: defaults.req, callback: defaults.callback });

        var nameid = identityManager.createId();
        var adminid = identityManager.createId();
        var structid = identityManager.createId();
        var streetboxid = identityManager.createId();
        var streetid = identityManager.createId();
        var streetnumid = identityManager.createId();
        var addressid = identityManager.createId();
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'MOI_ID',
            name: 'MOI_ID',
            value: '0'
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'MOI_MEH_ID',
            name: 'MOI_MEH_ID',
            value: '0'
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'Building_ID',
            name: 'Building_ID',
            value: '0'
        }, {
            xtype: 'textfield',
            fieldLabel: '大楼标签',
            emptyText: '请输入大楼标签',
            name: 'MOI_LabelName',
            allowBlank: false,
            listeners: {
                'change': function (a, b) {
                    //var comp = form.getComponent(nameid);
                    //if (!comp.getValue()) {
                    //    comp.setValue(b);
                    //}
                }
            }
        }, {
            xtype: 'textfield',
            fieldLabel: '大楼名称',
            emptyText: '请输入大楼名称',
            name: 'MOI_OwnerName',
            id: nameid,
            allowBlank: false
        }, {
            xtype: 'hiddenfield',
            fieldLabel: '联系地址',
            //emptyText: '请输入联系地址',
            name: 'MOI_OwnerAddress',
            id: addressid,
            allowBlank: true
        }, {
            xtype: 'textfield',
            fieldLabel: '座标组',
            emptyText: '请画出大楼轮廓',
            name: 'MEH_Croods',
            allowBlank: false,
            listeners: {
                'focus': function () {
                    var comp = this;

                    $.window.hide();
                    EMap.GetCoords({
                        coorded: function (c) {
                            comp.setValue(c);
                            $.window.show();
                        }
                    });
                }
            }
        }, {
            xtype: 'textfield',
            fieldLabel: '楼层数',
            emptyText: '请输入大楼的楼层数',
            name: 'FloorsCount',
            //value: '2',
            regex: /^[1-9]{1}\d{0,2}$/,
            allowBlank: false
        }, {
            xtype: 'textfield',
            emptyText: '请输入大楼的总房间数',
            fieldLabel: '总房间数',
            name: 'RoomsCount',
            //value: '2',
            regex: /^[1-9]{1}\d{0,5}$/,
            allowBlank: false
        }, {
            xtype: 'combotree',
            url: 'Administrative/AdministrativeHelp.ashx?req=tree',
            name: 'AdminName',
            valueField: 'ID',
            displayField: 'Name',
            emptyText: '请选择大楼所属行政区划',
            fieldLabel: '行政区划',
            allowBlank: false,
            value: '',
            itemSelected: function (d) {
                form.getComponent(adminid).setValue(d.ID);
            }
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'AdminID',
            name: 'AdminID',
            id: adminid,
            value: '0'
        }, {
            xtype: 'combobox',
            fieldLabel: '大楼结构',
            emptyText: '请选择大楼结构',
            name: 'RoomStructureID',
            hiddenName: 'RoomStructureID',
            store: function () {
                var data = [];
                $building.struct.grid.store.data.items.Each(function (e) {
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
                    form.getComponent(structid).setValue(comp.getRawValue());
                }
            }
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'RoomStructure',
            name: 'RoomStructure',
            id: structid,
            value: '0'
        }, {
            xtype: 'textfield',
            fieldLabel: '联系电话',
            emptyText: '请输入联系电话',
            name: 'MOI_OwnerTel',
            value: '',
            allowBlank: false
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: '大楼位置',
            id: streetboxid,
            layout: 'hbox',
            items: [{
                xtype: 'textfield',
                name: 'StreetName',
                id: streetid,
                flex: 3,
                emptyText: '请输入街道名称',
                value: '',
                allowBlank: false,
                listeners: {
                    'change': function () {
                        var comp = this;
                        var addressbox = form.getComponent(addressid);
                        var streetnum = form.getComponent(streetboxid).getComponent(streetnumid);
                        var val = comp.getValue();
                        if (!val) {
                            streetnum.setValue('');
                            addressbox.setValue('');
                            return;
                        }

                        addressbox.setValue(String.Format("{0},{1}", val, streetnum.getValue()));
                    }
                }
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'textfield',
                name: 'StreetNumber',
                regex: /^[1-9]{1}\d{0,5}$/,
                id: streetnumid,
                flex: 2,
                emptyText: '请输入门牌号码',
                value: '',
                allowBlank: false,
                listeners: {
                    'change': function () {
                        var comp = this;
                        if (!comp.getValue()) {
                            return;
                        }

                        var street = form.getComponent(streetboxid).getComponent(streetid);
                        var streetvalue = street.getValue();

                        if (!streetvalue) {
                            errorState.show('请输入街道名称');
                            comp.setValue('');
                            return;
                        }

                        var streetnum = form.getComponent(streetboxid).getComponent(streetnumid);
                        var streetnumvalue = streetnum.getValue();

                        form.getComponent(addressid).setValue(String.Format("{0},{1}", streetvalue, streetnumvalue));
                    }
                }
            }]
        }, {
            xtype: 'htmleditor',
            fieldLabel: '描述信息',
            name: 'MOI_OwnerDes',
            height: 150,
            allowBlank: true
        });

        if (defaults.data) {
            form.loadRecord(defaults.data);
        }

        return form;
    };

    var Show = $.Show = function (options) {
        var defaults = { title: '编辑大楼信息', width: 600, height: 479, req: null, data: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var form = Form({ req: defaults.req, data: defaults.data, callback: submitCallback });

        var wind = $.window = ExtHelper.CreateWindow({
            title: defaults.title, height: defaults.height, width: defaults.width,
            listeners: {
                'show': function () {
                    $building.window.hide();
                },
                'close': function () {
                    $building.window.show();
                    $.window = null;
                }
            }
        });
        wind.add(form);
    };

    function submitCallback(options) {
        var defaults = { action: { result: { success: false } } };
        Ext.apply(defaults, options);

        if (defaults.action.result && defaults.action.result.success) {
            $building.grid.store.load();
            $.window.close();
        } else {
            errorState.show(errorState.SubmitFail);
        }
    }

})(Object.$Supper($building, 'form'));

//@ buildingtype 描述楼房结构信息:例如土木，砖石，混泥土等等...
(function ($) {

    var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'ID', text: '结构ID', hidden: true, width: 45 },
            { dataIndex: 'Name', text: '结构名称', flex: 2, sortable: false },
            { dataIndex: 'Code', text: '结构代码', flex: 1, sortable: false },
            { dataIndex: 'Disabled', text: '是否启用', width: 60, sortable: false, renderer: function (a, b, c) { return a ? "启用" : "禁用"; } },
            { dataIndex: 'Sort', text: '排序', width: 45, hidden: true, sortable: false }
    ];

    var Grid = $.Grid = function (c) {
        $building.loadParamHandler(function () {
            var grid = $.grid = $param.grid.Grid({
                columns: columns, url: { 
                    grid: String.Format('{0}structs', $building.basic_url),
                    add: String.Format('{0}addstructs', $building.basic_url),
                    upd: String.Format('{0}updstructs', $building.basic_url),
                    del: String.Format('{0}delstructs', $building.basic_url)
                }, callback: function (options) {
                    grid.store.load();
                }
            });
            c(grid);
        });
    };

})(Object.$Supper($building, 'struct'));

(function ($) {

    var bstores = $.bstores = null;
    var rstores = $.rstores = null;

    $.Grid = function (options, c) {
        $building.loadCompanyHandler(function () {
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

})(Object.$Supper($building, 'company'));

(function ($) {

    var bstores = $.bstores = null;
    var rstores = $.rstores = null;

    $.Grid = function (options, c) {
        $building.loadPopHandler(function () {
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

})(Object.$Supper($building, 'popu'));