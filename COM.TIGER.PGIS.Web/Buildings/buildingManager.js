/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Company/Company.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Population/populationDetail.js" />

var buildingManager = buildingManager || {};

(function ($) {
    var basic_def = {
        title: '楼房信息管理...', layout: 'fit', width: 800, height: 500, listeners: {
            'close': dispose
        }
    };
    var wind = null;
    var tabpanel = ExtHelper.CreateTabPanelFn();

    //@ basic_uri
    var basic_url = $.basic_url = 'Buildings/BuildingHelp.ashx?req=';

    $.Show = function () {

        //初始化
        init();

        wind = $.window = ExtHelper.CreateWindow(basic_def);
        wind.add(tabpanel.tab);
    };

    var Add = $.Add = function (options) {
        var defaults = { component: null, title: null, closable: true };
        Ext.apply(defaults, options);

        return tabpanel.add(defaults);
    };

    var createObj = $.createObj = function (/*String*/name) {
        var obj = $[name] = $[name] || {};
        obj.parent = $;
        return obj;
    };

    var encodeObj = $.encodeObj = function (obj) {
        obj = JSON.stringify(obj);
        obj = encodeURI(obj);
        return obj;
    };

    var decodeObj = $.decodeObj = function (obj) {
        obj = decodeURI(obj);
        obj = JSON.parse(obj);
        return obj;
    };
    
    var getSelections = $.getSelections = function (grid) {
        var rows = grid.grid.getSelectionModel().getSelection();
        if (rows.length == 0) {
            errorState.show(errorState.SelectRow);
        }
        return [].concat(rows);
    }

    var getOnlySelection = $.getOnlySelection =function (grid) {
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
            startMask({ p: defaults.p, msg: '正在提交，请稍后...' });

            defaults.form.submit({
                clientValidation: true,
                url:String.Format('{0}{1}', basic_url, defaults.req),
                success: function (form, action) {
                    stopMask();

                    defaults.callback(action);
                },
                failure: function (form, action) {
                    stopMask();
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

    var startMask = $.startMask = function (options) {
        var defaults = { p: null, msg: '' };
        Ext.apply(defaults, options);

        maskHandler.mask.Show(defaults);
    }

    var loadPopulationHandler = $.loadPopulationHandler = function (callback) {
        if (typeof $populationdetail !== 'undefined') {
            return callback();
        }

        LoadModlues.loadJS(typeof $populationdetail, 'Population/populationDetail.js', function () {
            callback();
        });
    };

    function stopMask() {
        maskHandler.mask.Hide();
    }

    //@ 初始化
    function init() {
        
        Add({ component: $.struct.grid.grid, title: '大楼结构信息管理', closable: false });
        addBuildingGrid();
    }

    function addBuildingGrid() {
        var id = identityManager.createId();
        var infogrid = $.info.grid.grid;
        var component = new Ext.panel.Panel({
            layout: 'border',
            border:0,
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
                comp.removeAll();
                comp.add($.unit.grid.Grid({ ids: ids, ownerinfo: rows[0].getData() }));
                comp.setWidth(340);
            } else {
                comp.setWidth(0);
            }
        })

        Add({ component: component, title: '大楼信息管理', closable: false });
    }
    
    function dispose() {
        $.population.dispose();
    }

})(buildingManager);

//@ owerninfo
(function ($) {

    //@ model
    (function (me) {

        var tp = me.type = identityManager.createId('model');
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
                { name: 'ElementHot' }  //热区信息详细信息
            ]
        });

        //@ 默认值
        var defaults = me.defaults = {
            MOI_ID: 0, MOI_MEH_ID: 0, MOI_LabelName: null, MOI_OwnerName: null, MOI_OwnerAddress: null, MOI_OwnerTel: null, MOI_OwnerDes: null,
            ElementHot: {
                MEH_ID: 0, MEH_MOI_ID: 0, MEH_CenterX: 0, MEH_CenterY: 0, MEH_Croods: null, MEH_HotLevel: '0,1,'
            }
        };

    })($.model = $.model || {});

    //@ store
    (function (me) {

        me.getStore = function (options) {
            var defaults = { storeId: identityManager.createId(), model: $.model.type, req: null, total: false, pageSize: 17 };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.parent.basic_url, defaults.req);

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })($.store = $.store || {});

    //@ grid
    (function (me) {

        var columns = [
            {
                xtype: 'rownumberer', width: 30, sortable: false, text: '序', renderer: function (value, obj, record, index) {
                    return index + 1;
                }
            },
            { dataIndex: 'MOI_OwnerName', text: '大楼名称', flex: 1, hidden: false },
            { dataIndex: 'MOI_OwnerAddress', text: '详细地址', flex: 1, hidden: false },
            { dataIndex: 'MOI_OwnerTel', text: '联系电话', flex: 1, hidden: false },
            { dataIndex: 'MOI_OwnerDes', text: '备注', flex: 1, hidden: true }
        ];

        var store = me.store = $.store.getStore({ req: 'pagebd', total: true });

        var grid = me.grid = ExtHelper.CreateGrid({
            columns: columns, store: store, pager: true,
            toolbar: {
                enable: true, add: addbd, update: editbd, del: delbd,
                items: [{
                    xtype: 'button',
                    text: '楼房照片管理',
                    iconCls:'bphotos',
                    handler:photoFn
                }]
            }
        });

        //@ 添加大楼热区
        function addbd() { $.form.Show({ req: 'addbd' }); }
        //@ 编辑大楼热区
        function editbd(grid) {
            $.parent.updateCallback({
                grid: grid,
                callback: function (data) { $.form.Show({ req: 'upbd', data: data }); }
            });
        }
        //@ 移除大楼热区
        function delbd(grid) {
            $.parent.deleteCallback({
                grid: grid,
                callback: delCallback
            });
        }

        function photoFn(grid) {
            $.parent.updateCallback({
                grid: grid,
                callback: function (record) {
                    var data = record.getData();
                    $.parent.photo.grid.Show({ id: data.MOI_ID });
                }
            });
        }

        function delCallback(data, grid) {
            var ids = data.Each(function (a) { return a.get('MOI_ID'); });
            
            $.parent.deleteAction({
                req: 'delbd', ids: ids, callback: function (r) {
                    if (r.result) {
                        $.grid.store.load();
                    } else {
                        errorState.show(errorState.DeleteFail);
                    }
                }
            });
        }

        function getSelections(grid) {
            return $.parent.getSelections(grid);
        }

        function getOnlySelection(grid) {
            return $.parent.getOnlySelection(grid);
        }

    })($.grid = $.grid || {});

    //@ form
    (function (me) {

        var Form = me.Form = function (options) {
            var defaults = { req: null, data: null, callback:Ext.emptyFn };
            Ext.apply(defaults, options);

            var form = $.parent.getForm({ req: defaults.req, callback: defaults.callback });

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
                id:nameid,
                allowBlank: false
            }, {
                xtype: 'hiddenfield',
                fieldLabel: '联系地址',
                //emptyText: '请输入联系地址',
                name: 'MOI_OwnerAddress',
                id:addressid,
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

                        me.window.hide();
                        EMap.GetCoords({
                            coorded: function (c) {
                                comp.setValue(c);
                                me.window.show();
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
                store: $.parent.struct.grid.store,
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                forceSelection: true,
                editable:false,
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
                value:'',
                allowBlank: false
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: '大楼位置',
                id:streetboxid,
                layout: 'hbox',
                items: [{
                    xtype: 'textfield',
                    name: 'StreetName',
                    id:streetid,
                    flex: 3,
                    emptyText: '请输入街道名称',
                    value: '',
                    allowBlank: false,
                    listeners: {
                        'change': function () {
                            var comp = this;
                            var addressbox = form.getComponent(addressid);
                            var streetnum = form.getComponent(streetboxid).getComponent(streetnumid);
                            var val  = comp.getValue();
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
                    id:streetnumid,
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
                height:150,
                allowBlank: true
            });

            if (defaults.data) {

                form.loadRecord(defaults.data);
                //form.getComponent(streetboxid).getComponent(streetnumid).setValue(defaults.data.getData().StreetNumber);
            }

            return form;
        };

        var Show = me.Show = function (options) {
            var defaults = { title: '编辑大楼信息', width: 600, height: 479, req: null, data: null, callback: Ext.emptyFn };
            Ext.apply(defaults, options);

            var form = Form({ req: defaults.req, data: defaults.data, callback: submitCallback });

            var wind = me.window = ExtHelper.CreateWindow({
                title: defaults.title, height: defaults.height, width: defaults.width,
                listeners: {
                    'show': function () {
                        $.parent.window.hide();
                    },
                    'close': function () {
                        $.parent.window.show();
                        me.window = null;
                    }
                }
            });
            wind.add(form);
        };

        function submitCallback(options) {
            var defaults = { action: { result: { success: false } } };
            Ext.apply(defaults, options);

            if (defaults.action.result && defaults.action.result.success) {
                $.grid.store.load();
                me.window.close();
            } else {
                errorState.show(errorState.SubmitFail);
            }
        }

    })($.form = $.form || {});

})(buildingManager.createObj('info'));

//@ unit 大楼单元信息：例如一单元，二单元，三单元...，或者一幢，二幢，三幢...，或者A座，B座，C座...等等
(function ($) {

    //@ model
    (function (me) {

        var tp = me.type = identityManager.createId('model');

        var model = me.model = Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Unit_ID' },
                { name: 'UnitName' },
                { name: 'OwnerInfoID' },
                { name: 'Sort' }
            ]
        });

        var defaults = me.defaults = { Unit_ID: 0, UnitName: null, OwnerInfoID: 0, Sort: 0 };

    })($.model = $.model || {});

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), model:$.model.type, req: null, total: false, pageSize: 15 };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.parent.basic_url, defaults.req);

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })($.store = $.store || {});
    
    //@ grid
    (function (me) {
        //@ 大楼信息
        var buildinginfo = null;

        var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'Unit_ID', text: '楼房ID', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'UnitName', text: '楼房名称', sortable: false, hidden: false, flex: 1 },
            { dataIndex: 'OwnerInfoID', text: '大楼', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Sort', text: '排序', sortable: false, hidden: true, flex: 1 }
        ];

        //@ 信息管理被点击时触发
        me.clickactionCallback = function (data) {
            data = $.parent.decodeObj(data);
            var defaults = Ext.apply({}, data, $.model.defaults);
            buildingManager.room.grid.Show({ id: defaults.Unit_ID, buildinginfo: buildinginfo });
        };

        me.Grid = function (options) {
            var defaults = { req: 'units', ids: 0, pager: false, title: '楼房信息', ownerinfo: null };
            Ext.apply(defaults, options);
            buildinginfo = defaults.ownerinfo;

            var store = me.store = $.store.Store({ req: String.Format('{0}&ids={1}', defaults.req, defaults.ids), total:defaults.pager });
            var grid = ExtHelper.CreateGrid({
                columns: columns, store: store, pager: defaults.pager,height:440,
                toolbar: {
                    enable: true,
                    items: [String.Format('<div class="content-cut" style=" width:80px; height:{0}px; line-height:{0}px; text-align:left; font-weight:700;">{1}:</div>', 21, defaults.ownerinfo.MOI_OwnerName), '-', '->',
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

            $.form.Show({ req: 'addunit', ownerinfo: defaults.ownerinfo });
        }

        function updFn(grid) {
            $.parent.updateCallback({
                grid: grid,
                callback: function (data) {
                    $.form.Show({ req: 'upunit', data:data });
                }
            });
        }

        function delFn(grid) {
            $.parent.deleteCallback({
                grid: grid,
                callback: function (data) {
                    var ids = data.Each(function (a) { return a.get('Unit_ID'); });
                    $.parent.deleteAction({ req: 'delunits', ids: ids, callback: delCallback });
                }
            });
        }

        function delCallback(result) {
            var defaults = { result: undefined, msg: errorState.DeleteFail, success: false };
            Ext.apply(defaults, result);
            
            if (defaults.result) {
                $.grid.store.load();
            } else {
                errorState.show(errorState.DeleteFail);
            }
        }

        function infoCallback(grid) {
            $.parent.updateCallback({
                grid: grid,
                callback: infoActionCallback
            });
        }

        function infoActionCallback(data, grid) {
            data = data.getData();
            $.parent.room.grid.Show({ id: data.Unit_ID, unitinfo:data, buildinginfo: buildinginfo });
        };

    })($.grid = $.grid || {});

    //@ form
    (function (me) {

        var Form = me.Form = function (options) {
            var defaults = { req: null, data: null, callback: Ext.emptyFn, ownerinfo: null };
            Ext.apply(defaults, options);

            var form = $.parent.getForm({ req: defaults.req, callback: defaults.callback });

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
                xtype: 'textfield',
                emptyText: '',
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

        var Show = me.Show = function (options) {
            var defaults = { title: '编辑信息...', req: null, data: null, width: 500, height: 135, callback: submitCallback, ownerinfo: null };
            Ext.apply(defaults, options);

            var form = Form(defaults);
            var wind = me.window = ExtHelper.CreateWindow({
                title: defaults.title, width: defaults.width, height: defaults.height,
                listeners: {
                    'show': function () { $.parent.window.hide(); },
                    'close': function () {
                        me.window = null;
                        $.parent.window.show();
                    }
                }
            });
            wind.add(form);
        };

        function submitCallback(result) {
            var defaults = { result: undefined, msg: errorState.SubmitFail, success: false };
            Ext.apply(defaults, result.action.result);

            if (defaults.result > 0) {
                $.grid.store.load();
                me.window.close();
            } else {
                errorState.show(errorState.SubmitFail);
            }
        }

    })($.form = $.form || {});

})(buildingManager.createObj('unit'));

//@ room
(function ($) {

    //@ model
    (function (me) {

        var tp = me.type = identityManager.createId('model');

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

        var defaults = me.defaults = { Room_ID: 0, RoomName: null, RoomName2: null, RoomArea: null, RoomUseID: 0, RoomUse: null, RoomAttributeID: 0, RoomAttribute: null, UnitID: 0, UnitName: null, OwnerInfoID: 0 };

    })($.model = $.model || {});

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { req:'rooms', storeId: identityManager.createId(), model: $.model.type, total: true, pageSize: 18, callback:Ext.emptyFn };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.parent.basic_url, defaults.req);

            var store = ExtHelper.CreateStore(defaults);
            store.on('load', function (a, b, c) {
                defaults.callback(a, b, c);
            });
            return store;
        };

    })($.store = $.store || {});

    //@ grid
    (function (me) {

        //@ 大楼信息
        var buildinginfo = null;
        var unitinfo = null;

        var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable:false, renderer: function (a, b, c, d) { return d + 1; } },
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

        var tabpanel = null;

        me.Grid = function (options) {
            var defaults = { id: 0, callback: Ext.emptyFn };
            Ext.apply(defaults, options);

            var store = me.store = $.store.Store({ total: false, req: String.Format('rooms&id={0}', defaults.id) });
            var grid = me.grid = ExtHelper.CreateGrid({
                columns: columns, store: store, pager: false,height:444,
                toolbar: {
                    enable: true, add: addFn, update: updFn, del: delFn
                }
            });
            return grid;
        };

        me.Show = function (options) {
            
            var defaults = { title: '楼房信息管理...', /*大楼ID*/id: 0, /* @大楼信息*/buildinginfo: null,unitinfo:null };
            Ext.apply(defaults, options);
            buildinginfo = me.buildinginfo = defaults.buildinginfo;
            unitinfo = me.unitinfo = defaults.unitinfo;
            
            init(defaults.id,{buildinginfo: defaults.buildinginfo,unitinfo:defaults.unitinfo});

            var wind = me.window = ExtHelper.CreateWindow({
                title: defaults.title, layout:'fit', width:800, height:500,
                listeners: {
                    'close': function () {
                        $.parent.window.show();
                        me.window = null;
                    },
                    'show': function () {
                        $.parent.window.hide();
                    }
                }
            });

            wind.add(tabpanel.tab);
        };

        var Add = me.Add = function (options) {
            var defaults = { component: null, title: null, closable: true };
            Ext.apply(defaults, options);

            return tabpanel.add(defaults);
        };
        
        var show = me.show = function () {
            me.window.show();
        };

        var hide = me.hide = function () {
            me.window.hide();
        };

        function init(/*大楼ID*/id, options) {
            var defaults = { buildinginfo: null, unitinfo: null };
            Ext.apply(defaults, options);

            tabpanel = ExtHelper.CreateTabPanelFn();
            
            Add({ component: $.parent.usetype.grid.grid, title: '房屋用途', closable: false });
            Add({ component: $.parent.property.grid.grid, title: '房屋属性', closable: false });
            addRooms(id, { buildinginfo: defaults.buildinginfo, unitinfo: defaults.unitinfo });
            addCompanys(defaults.unitinfo.OwnerInfoID, { buildinginfo: defaults.buildinginfo, unitinfo: defaults.unitinfo });
            addPopulations(defaults.unitinfo.OwnerInfoID, { buildinginfo: defaults.buildinginfo, unitinfo: defaults.unitinfo });

            tabpanel.tab.setActiveTab(2);
        }

        function addRooms(id) {
            var roomgrid = me.Grid({
                id: id, callback: function () {

                }
            });
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
                    border:0,
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
                        split:true,
                        items: []
                    }]
                }]
            });
            roomgrid.on('selectionchange', function () {
                var records = roomgrid.getSelectionModel().getSelection();
                var ids = records.Each(function (a) { return a.get('Room_ID'); });
                var panel = component.getComponent(panelid);
                if (ids.length) {
                    var northpanel = panel.getComponent(northid);
                    northpanel.removeAll();
                    northpanel.add($.parent.company.grid.Grid({ ids: ids, buildinginfo: buildinginfo, unitinfo: unitinfo, roominfo: records[0].getData() }));

                    var centerpanel = panel.getComponent(centerid);
                    centerpanel.removeAll();
                    centerpanel.add($.parent.population.grid.Grid({ ids: ids, height: 283, buildinginfo: buildinginfo, unitinfo: unitinfo, roominfo: records[0].getData() }));

                    panel.setWidth(300);
                    panel.doLayout();
                    centerpanel.doLayout();
                } else {
                    panel.setWidth(0);
                }
            });

            Add({ component: component, title: '房屋信息', closable: false });
        }

        function addCompanys(id, options) {
            var defaults = { buildinginfo: null, unitinfo: null };
            Ext.apply(defaults, options);

            var comp = $.parent.company.grid.Grid({ ids: id, req: 'compsonhouse', enable: true, buildinginfo: defaults.buildinginfo, unitinfo: defaults.unitinfo });

            for (var i = comp.columns.length - 1; i >= 0; i -= 1) {
                var col = comp.columns[i];
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

            Add({ component: comp, title: '单位信息', closable: false });
        }

        function addPopulations(id, options) {
            var defaults = { buildinginfo: null, unitinfo: null };
            Ext.apply(defaults, options);

            var comp = $.parent.population.grid.Grid({ ids: id, req: 'popsonhouse', pager: true, enable: true, buildinginfo: defaults.buildinginfo, unitinfo: defaults.unitinfo });
            for (var i = comp.columns.length - 1; i >= 0; i -= 1) {
                var col = comp.columns[i];
                switch (col.dataIndex) {
                    case "CardNo":
                    case "Nation":
                    //case "Education":
                    //case "PoliticalStatus":
                    //case "SoldierStatus":
                    //case "MarriageStatus":
                    //case "Religion":
                    case "IsPsychosis":
                    //case "LiveType":
                        col.show();
                        break;
                    default:
                        break;
                }
            }

            Add({ component: comp, title: '人员信息', closable: false });
        }

        function addFn() {
            $.form.Show({req:'addroom'});
        }

        function updFn(grid) {
            $.parent.updateCallback({
                grid: grid,
                callback: function (data) {
                    $.form.Show({ req: 'uproom', data:data });
                }
            });
        }

        function delFn(grid) {
            $.parent.deleteCallback({
                grid: grid,
                callback: function (data) {
                    var ids = data.Each(function (a) { return a.get('Room_ID'); });
                    
                    $.parent.deleteAction({
                        req: 'delrooms', ids: ids, callback: function (result) {
                            var defaults = { result: undefined, msg: errorState.DeleteFail, success: false };
                            Ext.apply(defaults, result);

                            if (defaults.result) {
                                me.store.load();
                            } else {
                                errorState.show(errorState.DeleteFail);
                            }
                        }
                    });
                }
            });
        }

    })($.grid = $.grid || {});

    //@ form
    (function (me) {

        var Form = me.Form = function (options) {
            var defaults = { req: null, data: null, callback: Ext.emptyFn };
            Ext.apply(defaults, options);

            var form = $.parent.getForm({ req: defaults.req, callback: defaults.callback });
            
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
                value: $.grid.unitinfo? $.grid.unitinfo.Unit_ID:'0'
            }, {
                xtype: 'hiddenfield',
                fieldLabel: 'UnitName',
                name: 'UnitName',
                value: $.grid.unitinfo ? $.grid.unitinfo.UnitName : ''
            }, {
                xtype: 'hiddenfield',
                fieldLabel: 'OwnerInfoID',
                name: 'OwnerInfoID',
                value: $.grid.unitinfo ? $.grid.unitinfo.OwnerInfoID : '0'
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
                id:nameid,
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
                store: $.parent.usetype.grid.store,
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
                id:useid,
                value: ''
            }, {
                xtype: 'combobox',
                fieldLabel: '房屋属性',
                emptyText: '请选择房屋属性',
                name: 'RoomAttributeID',
                hiddenName: 'RoomAttributeID',
                store: $.parent.property.grid.store,
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
                id:propid,
                value: ''
            });

            if (defaults.data) {
                form.loadRecord(defaults.data);
            }

            return form;
        };

        var Show = me.Show = function (options) {
            var defaults = { req: null, data: null, title: '编辑信息...', width: 600, height: 216, callback: submitCallback };
            Ext.apply(defaults, options);

            var form = Form({ req: defaults.req, data: defaults.data, callback: defaults.callback });
            
            var wind = me.window = ExtHelper.CreateWindow({
                title: defaults.title, width: defaults.width, height: defaults.height,
                listeners: {
                    'close': function () {  },
                    'show': function () {  }
                }
            });
            wind.add(form);
        };

        function submitCallback(result) {
            var defaults = { result: undefined, msg: errorState.SubmitFail, success: false };
            Ext.apply(defaults, result.action.result);

            if (defaults.result > 0) {
                $.grid.store.load();
                me.window.close();
            } else {
                errorState.show(errorState.SubmitFail);
            }
        }

    })($.form = $.form || {});

})(buildingManager.createObj('room'));

//@ photo
(function ($) {

    //@ model
    (function (me) {

        var tp = me.type = identityManager.createId('model');

        var model = me.model = Ext.define(tp, {
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

        var defaults = me.defaults = { MOP_ID: 0, MOP_MOI_ID: 0, MOP_ImgName: null, MOP_ImgTitle: null, MOP_ImgRemark: null, MOP_ImgPath: null };

    })($.model = $.model || {});

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { req: 'picts', storeId: identityManager.createId(), model: $.model.type, total: false };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.parent.basic_url, defaults.req);

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })($.store = $.store || {});

    //@ grid
    (function (me) {

        var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'MOP_ID', text: '照片ID', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MOP_MOI_ID', text: '大楼ID', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MOP_ImgName', text: '名称', sortable: false, hidden: false, flex: 1 },
            { dataIndex: 'MOP_ImgTitle', text: '标题', sortable: false, hidden: false, flex: 1 },
            { dataIndex: 'MOP_ImgPath', text: '路径', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MOP_ImgRemark', text: '备注', sortable: false, hidden: false, flex: 2 }
        ];

        var Grid = me.Grid = function (options) {
            var defaults = { id: 0, pager:false };
            Ext.apply(defaults, options);

            var store = me.store = $.store.Store({ req: String.Format('picts&id={0}', defaults.id), total: defaults.pager });
            var grid = me.grid = ExtHelper.CreateGrid({
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

        var Show = me.Show = function (options) {
            var defaults = { title: '大楼照片管理...', height: 400, width: 600, id: 0 };
            Ext.apply(defaults, options);

            var wind = me.window = ExtHelper.CreateWindow({
                title: defaults.title, width: defaults.width, height: defaults.height, layout:'fit',
                listeners: {
                    'close': function () { $.parent.window.show(); },
                    'show': function () { $.parent.window.hide(); }
                }
            });
            wind.add(Grid({ id: defaults.id }));
        };

        function addFn(options) {
            var defaults = { id: 0, grid: null, button: null };
            Ext.apply(defaults, options);

            $.form.Show({ id: defaults.id });
        }

        function updFn(grid) {
            $.parent.updateCallback({
                grid: grid,
                callback: function (data) {
                    errorState.show(data.get('MOP_ID'));
                }
            });
        }

        function delFn(grid) {
            $.parent.deleteCallback({
                grid: grid,
                callback: function (data) {
                    var ids = data.Each(function (a) { return a.get('MOP_ID'); });
                    
                    $.parent.deleteAction({
                        req: 'delpics', ids: ids, callback: function (r) {
                            if (r.result) {
                                me.store.load();
                            } else {
                                errorState.show(errorState.DeleteFail);
                            }
                        }
                    });
                }
            });
        }

    })($.grid = $.grid || {});

    //@ form
    (function (me) {

        var Show = me.Show = function (options) {
            var defaults = { req: 'upload', title:'上传楼房照片...', id:0, width:700, height:300 };
            Ext.apply(defaults, options);

            var wind = me.window = ExtHelper.CreateWindow({
                title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit',
                listeners: {
                    'close': function () {
                        $.grid.store.load();
                        $.grid.window.show();
                    },
                    'show': function () { $.grid.window.hide(); }
                }
            });
            wind.add({
                xtype: 'uploadpanel',
                border: 0,
                addFileBtnText: '选择文件...',
                uploadBtnText: '上传',
                removeBtnText: '移除所有',
                cancelBtnText: '取消上传',
                upload_url: String.Format('{0}{1}&id={2}', $.parent.basic_url, defaults.req, defaults.id),
                completecallback:completecallback
            });
        };

        function completecallback(f) {
            var defaults = { id: 0, name: null, type: null, size: 0, filestatus: 0 };
            Ext.apply(defaults, f);

            
        }

    })($.form = $.form || {});

})(buildingManager.createObj('photo'));

//@ company
(function ($) {

    //@ model
    (function (me) {

        var tp = me.type = identityManager.createId('model');

        var model = me.model = Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' }, //单位表ID
                { name: 'TypeID' }, //单位大类ID
                { name: 'TypeName' },   //单位大类
                { name: 'GenreID' },    //单位小类ID
                { name: 'GenreName' },  //单位小类  
                { name: 'Name' },   //单位名称
                { name: 'AddressID' },  //地址ID
                { name: 'TradeID' },    //行业类型ID
                { name: 'TradeName' },  //行业类型
                { name: 'Capital' },    //注册资金
                { name: 'Corporation' },    //法人
                { name: 'Square' }, //经营面积
                { name: 'StartTimeStr' },  //开业日期
                { name: 'Tel' },    //单位电话
                { name: 'LicenceNum' }, //营业执照编号
                { name: 'LicenceStartTimeStr' },   //营业执照开始日期
                { name: 'LicenceEndTimeStr' }, //营业执照截止日期
                { name: 'MainFrame' },  //主营经营范围
                { name: 'Concurrently' },   //兼营经营范围
                { name: 'MigrantWorks' },   //外来务工人数
                { name: 'FireRating' }, //消防等级
                { name: 'OrganID' },    //所属管辖机关ID
                { name: 'OrganName' },  //所属管辖机关
                { name: 'RoomID' }, //RoomID
                { name: 'Address' }, //详细地址
                { name: 'Addr' }
            ]
        });

        /// <summary>类型默认值</summary>
        var defaults = me.defaults = {
            ID: 0, TypeID: 0, TypeName: null, GenreID: 0, GenreName: null, Name: null, AddressID: 0, TradeID: 0, TradeName: null, Capital: 0, Corporation: null,
            Square: 0.00, StartTimeStr: null, Tel: null, LicenceNum: null,
            LicenceStartTimeStr: null, LicenceEndTimeStr: null,
            MainFrame: null, Concurrently: null, MigrantWorks: 0, FireRating: 0, OrganID: 0, OrganName: null, RoomID: 0, Address: null
        };

    })($.model = $.model || {});

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), model: $.model.type, req: null, total: true, pageSize: 18 };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.parent.basic_url, defaults.req);

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })($.store = $.store || {});

    //@ grid
    (function (me) {

        var columns = [
            { xtype: 'rownumberer', text: '', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'Name', itemId: 'Name', text: '名称', sortable: false, hidden: false, flex: 1 },
            { dataIndex: 'Tel', itemId: 'Tel', text: '联系电话', sortable: false, hidden: false, width: 85 },
            { dataIndex: 'TypeName', itemId: 'TypeName', text: '单位大类', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'GenreName', itemId: 'GenreName', text: '单位小类', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'TradeName', itemId: 'TradeName', text: '行业类型', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Capital', itemId: 'Capital', text: '注册资金', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Corporation', itemId: 'Corporation', text: '法人', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Square', itemId: 'Square', text: '经营面积 (㎡)', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'StartTimeStr', itemId: 'StartTime', text: '开业日期', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LicenceNum', itemId: 'LicenceNum', text: '营业执照编号', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LicenceStartTimeStr', itemId: 'LicenceStartTime', text: '营业执照开始日期', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LicenceEndTimeStr', itemId: 'LicenceEndTime', text: '营业执照截止日期', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MainFrame', itemId: 'MainFrame', text: '主营经营范围', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Concurrently', itemId: 'Concurrently', text: '兼营经营范围', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MigrantWorks', itemId: 'MigrantWorks', text: '外来务工人数', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'FireRating', itemId: 'FireRating', text: '消防等级', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'OrganName', itemId: 'OrganName', text: '所属管辖机关', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'RoomID', itemId: 'RoomID', text: '所在房间ID', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Addr', itemId: 'AddressID', text: '联系地址', sortable: false, hidden: true, flex: 2 },
            {
                dataIndex: 'ID', text: '', sortable: false, hidden: false, width: 55, renderer: function (a, b, c) {
                    var data = c.getData();
                    var val = $.parent.encodeObj(data);
                    return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', 'buildingManager.company.grid.ShowDetail', val);
                }
            }
        ];

        me.Grid = function (options) {
            var defaults = { req: 'companys', ids: 0, enable: true, title: '', pager: false, hideHeaders: false, buildinginfo: null, unitinfo: null, roominfo: null };
            Ext.apply(defaults, options);
            var store = me.store = $.store.Store({ req: String.Format('{0}&ids={1}', defaults.req, defaults.ids) });
            var grid = ExtHelper.CreateGrid({
                columns: columns, store: store, pager: defaults.pager, hideHeaders: defaults.hideHeaders,
                toolbar: {
                    enable: defaults.enable, items: [String.Format('<span style="height:{0}px; line-height:{0}px; text-align:center; font-weight:700;">单位信息:</span>', 21), '-', '->',
                        {
                            xtype: 'button',
                            iconCls: 'badd',
                            text: '添加',
                            handler: function (grid) { addFn({ grid: grid, buildinginfo: defaults.buildinginfo, unitinfo: defaults.unitinfo, roominfo: defaults.roominfo }, this); }
                        }, '-', {
                            xtype: 'button',
                            iconCls: 'bupdate',
                            text: '修改',
                            handler: updFn
                        }, '-', {
                            xtype: 'button',
                            iconCls: 'bdel',
                            text: '删除',
                            handler: delFn
                        }]
                }
            });

            return grid;
        };

        me.ShowDetail = function (val) {
            $company.grid.Detail(val, buildingManager.room.grid.window.getId());
        };

        function showDetailCallback(data) {
            var defaults = Ext.apply({}, data, $.model.defaults);

            errorState.show(defaults.ID);
        }

        function addFn(options, button) {
            var defaults = {grid:null, buildinginfo: null, unitinfo: null, roominfo:null };
            Ext.apply(defaults, options);

            var address = defaults.buildinginfo.MOI_OwnerAddress;
            if (defaults.roominfo) {
                address = String.Format("{0},{1},{2}", address, defaults.unitinfo.UnitName, defaults.roominfo.RoomName);
            }
            $company.form.Show({
                req: 'add', addr: address, roomid: defaults.roominfo ? defaults.roominfo.Room_ID : 0, callback: function (a) {
                    me.store.load();
                    defaults.grid.grid.store.load();
                }
            });
        }

        function updFn(grid) {
            $.parent.updateCallback({                
                grid:grid,
                callback: function (data) {
                    $company.form.Show({
                        req: 'upd', data: data, callback: function (a) {
                            me.store.load();
                            grid.grid.store.load();
                        }
                    });
                }
            });
        }

        function delFn(grid) {
            $.parent.deleteCallback({
                grid: grid,
                callback: function (records) {
                    var ids = records.Each(function (r) { return r.get('ID'); });
                    $company.grid.DeleteAction(ids, function () {
                        me.store.load();
                        grid.grid.store.load();
                    });
                }
            });
        }

    })($.grid = $.grid || {});

    //@ form

})(buildingManager.createObj('company'));

//@ population
(function ($) {

    //@ model
    (function (me) {

        var tp = me.type = identityManager.createId('model');

        var model = me.model = Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'OtherName' },
                { name: 'SexID' },
                { name: 'Sex' },
                { name: 'LiveTypeID' },
                { name: 'LiveType' },
                { name: 'Nation' },
                { name: 'EducationID' },
                { name: 'Education' },
                { name: 'OriginProvinceID' },
                { name: 'OriginProvince' },
                { name: 'OriginCityID' },
                { name: 'OriginCity' },
                { name: 'Stature' },
                { name: 'PoliticalStatusID' },
                { name: 'PoliticalStatus' },
                { name: 'CardNo' },
                { name: 'BloodTypeID' },
                { name: 'BloodType' },
                { name: 'SoldierStatusID' },
                { name: 'SoldierStatus' },
                { name: 'MarriageStatusID' },
                { name: 'MarriageStatus' },
                { name: 'Religion' },
                { name: 'LivePhone' },
                { name: 'Telephone1' },
                { name: 'Domicile' },
                { name: 'IsPsychosis' },
                { name: 'PsychosisTypeID' },
                { name: 'PsychosisType' },
                { name: 'HouseholdNo' },
                { name: 'HRelationID' },
                { name: 'HRelation' },
                { name: 'PhotoPath' },
                { name: 'HomeAddrID' },
                { name: 'CurrentAddrID' },
                { name: 'HomeAddress' },
                { name: 'CurrentAddress' }
            ]
        });

        var defaults = me.defaults = {
            ID: 0, Name: null, OtherName: null, SexID: 0, Sex: null, LiveTypeID: 0, LiveType: null, Nation: null,
            EducationID: 0, Education: null, OriginProvinceID: 0, OriginProvince: null, OriginCityID: 0, OriginCity: null,
            Stature: null, PoliticalStatusID: 0, PoliticalStatus: null, CardNo: null, BloodTypeID: 0, BloodType: null,
            SoldierStatusID: 0, SoldierStatus: null, MarriageStatusID: 0, MarriageStatus: null, Religion: null, LivePhone: null,
            Telephone1: null, Domicile: null, IsPsychosis: 0, PsychosisTypeID: 0, PsychosisType: null,
            HouseholdNo: null, HRelationID: 0, HRelation: null, PhotoPath: null, HomeAddrID: 0, CurrentAddrID: 0,
            HomeAddress:null,CurrentAddress:null
        };

    })($.model = $.model || {});

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), req: 'pops', ids:null, model: $.model.type, total: false, pagerSize: 25 };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}&ids={2}', $.parent.basic_url, defaults.req, defaults.ids);

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })($.store = $.store || {});

    //@ grid
    (function (me) {

        var stores = me.stores = [];

        var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'Name', text: '姓名', sortable: false, hidden: false, flex:1 },
            { dataIndex: 'OtherName', text: '曾用名', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'CardNo', text: '身份证', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Sex', text: '性别', sortable: false, hidden: false, width:45 },
            { dataIndex: 'Nation', text: '民族', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Education', text: '文化程度', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'OriginProvince', text: '籍贯省', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'OriginCity', text: '籍贯市', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Stature', text: '身高', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'PoliticalStatus', text: '政治面貌', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'BloodType', text: '血型', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'SoldierStatus', text: '兵役状况', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MarriageStatus', text: '婚姻状况', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Religion', text: '宗教信仰', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LivePhone', text: '住宅电话', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Telephone1', text: '手机', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Domicile', text: '户籍所在地', sortable: false, hidden: true, flex: 1 },
            {
                dataIndex: 'IsPsychosis', text: '重点人口', sortable: false, hidden: true, width: 100, renderer: function (a, b, c) {
                    switch (a) {
                        default:
                            return '未知';
                    }
                }
            },//标识常口，重口，暂口，境外人口以及相应类型
            //{ dataIndex: 'PsychosisType', text: '重点人口类别', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'HouseholdNo', text: '户号', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'HRelation', text: '与户主关系', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'PhotoPath', text: '人员照片', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'HomeAddrID', text: '家庭住址', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'CurrentAddrID', text: '当前住址', sortable: false, hidden: true, width:100 },
            {
                dataIndex: 'LiveType', text: '居住性质', sortable: false, hidden: true, flex: 1, renderer: function (a, b, c) {
                    switch (a) {
                        default:
                            return '未知';
                    }
                }
            },
            {
                dataIndex: 'ID', text: '操作', sortable: false, hidden: false, width: 55, renderer: function (a, b, c) {
                    var data = c.getData();
                    var val = $.parent.encodeObj(data);
                    return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', 'buildingManager.population.grid.ShowDetail', val);
                }
            }
        ];

        me.Grid = function (options) {
            var defaults = { req: 'pops', ids: null, pager: false, height: 200, enable: true, buildinginfo: null, unitinfo: null, roominfo:null };
            Ext.apply(defaults, options);

            var store = $.store.Store({ ids: defaults.ids, total: defaults.pager, req: defaults.req });
            stores.push(store);

            var grid = ExtHelper.CreateGrid({
                height:defaults.height,
                columns: columns,
                store: store,
                pager: defaults.pager,
                toolbar: {
                    enable: defaults.enable, items: [String.Format('<span style="height:{0}px; line-height:{0}px; text-align:center; font-weight:700;">人员信息:</span>', 21), '-', '->',
                        {
                            xtype: 'button',
                            iconCls: 'badd',
                            text: '添加',
                            handler: function (grid) { addFn({ grid: grid, buildinginfo: defaults.buildinginfo, unitinfo: defaults.unitinfo, roominfo: defaults.roominfo }, this); }
                        }, '-', {
                            xtype: 'button',
                            iconCls: 'bupdate',
                            text: '修改',
                            handler: updFn
                        }, '-', {
                            xtype: 'button',
                            iconCls: 'bdel',
                            text: '删除',
                            handler: delFn
                        }]
                }
            });
            grid.on('removed', function () {

                var index = me.stores.IndexOf(function (s) {
                    return s.storeId == store.storeId;
                });
                if (index >= 0) {
                    me.stores.splice(1, 1);
                }
            });
            return grid;
        };

        me.ShowDetail = function (val) {
            var data = $.parent.decodeObj(val);
            $.detail.Show(data);
        }

        function addFn(options, button) {
            var defaults = { grid: null, buildinginfo: null, unitinfo: null, roominfo: null };
            Ext.apply(defaults, options);

            var address = defaults.buildinginfo.MOI_OwnerAddress;
            if (defaults.roominfo) {
                address = String.Format("{0},{1},{2}", address, defaults.unitinfo.UnitName, defaults.roominfo.RoomName);
            }

            $.form.Show({ req: 'addpop', address: address });
        }

        function updFn(grid) {
            $.parent.updateCallback({
                grid: grid,
                callback: function (data) {
                    $.form.Show({ req: 'uppop', data: data });
                }
            });
        }

        function delFn(grid) {
            $.parent.deleteCallback({
                grid: grid,
                callback: function (records) {
                    var ids = records.Each(function (r) { return r.get('ID'); });
                    $.parent.deleteAction({
                        req: 'delpops', ids: ids,
                        callback: function (result) {
                            if (result.result) {
                                stores.Each(function (s) { s.load();});
                            } else {
                                errorState.show(errorState.DeleteFail);
                            }
                        }
                    });
                }
            });
        }

    })($.grid = $.grid || {});

    //@ form
    (function (me) {

        var Form = me.Form = function (options) {
            var defaults = { req: null, data: null, callback:Ext.emptyFn, address:'' };
            Ext.apply(defaults, options);

            var form = $.parent.getForm({ req: defaults.req, callback: defaults.callback });

            var sexid = identityManager.createId();
            var liveid = identityManager.createId();
            var eduid = identityManager.createId();
            var proid = identityManager.createId();
            var cityid = identityManager.createId();
            var polid = identityManager.createId();
            var bloodid = identityManager.createId();
            var soldierid = identityManager.createId();
            var marryid = identityManager.createId();
            var psyid = identityManager.createId();
            var hrelaid = identityManager.createId();

            form.add({
                xtype: 'hiddenfield', fieldLabel: 'ID', name: 'ID', value: '0'
            }, {
                xtype: 'textfield',
                fieldLabel: '姓名',
                name: 'Name',
                value: '',
                allowBlank:false
            }, {
                xtype: 'textfield',
                fieldLabel: '曾用名',
                name: 'OtherName',
                value:  ''
            }, {
                xtype: 'combobox', fieldLabel: '人员性别', //emptyText: '请选择人员性别',
                name: 'SexID', hiddenName: 'SexID',
                store: $.storeSex, queryMode: 'local', displayField: 'Name', valueField: 'ID',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: false,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(sexid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id:sexid, fieldLabel: 'Sex', name: 'Sex', value: ''
            }, {
                xtype: 'combobox', fieldLabel: '民族', 
                name: 'Nation', hiddenName: 'Nation',
                store: nationTypes, queryMode: 'local', displayField: 'd', valueField: 'd',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: false,
                value: '汉族'
            }, {
                xtype: 'textfield',
                fieldLabel: '身高(CM)',
                name: 'Stature',
                regex: /^[1-9]{1}[0-9]{1,2}$/,
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '身份证号',
                name: 'CardNo',
                //regex: /^\d{}$/,
                allowBlank: false
            }, {
                xtype: 'combobox', fieldLabel: '居住性质', //emptyText: '请选择居住性质',
                name: 'LiveTypeID', hiddenName: 'LiveTypeID',
                store: liveTypes, queryMode: 'local', displayField: 'd', valueField: 'v',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: false,
                value:1,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(liveid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id: liveid, fieldLabel: 'LiveType', name: 'LiveType', value: ''
            }, {
                xtype: 'combobox', fieldLabel: '文化程度', //emptyText: '请选择文化程度',
                name: 'EducationID', hiddenName: 'EducationID',
                store: $.storeEducation, queryMode: 'local', displayField: 'Name', valueField: 'ID',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: false,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(eduid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id: eduid, fieldLabel: 'Education', name: 'Education', value: ''
            }, {
                xtype: 'combobox', fieldLabel: '籍贯省', //emptyText: '请选择籍贯省',
                name: 'OriginProvinceID', hiddenName: 'OriginProvinceID',
                store: $.storeOriginProvince, queryMode: 'local', displayField: 'Name', valueField: 'ID',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: false,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(proid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id: proid, fieldLabel: 'OriginProvince', name: 'OriginProvince', value: ''
            }, {
                xtype: 'combobox', fieldLabel: '籍贯市', //emptyText: '籍贯市',
                name: 'OriginCityID', hiddenName: 'OriginCityID',
                store: $.storeOriginCity, queryMode: 'local', displayField: 'Name', valueField: 'ID',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: false,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(cityid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id: cityid, fieldLabel: 'OriginCity', name: 'OriginCity', value: ''
            }, {
                xtype: 'combobox', fieldLabel: '政治面貌', //emptyText: '请选择政治面貌',
                name: 'PoliticalStatusID', hiddenName: 'PoliticalStatusID',
                store: $.storePoliticalStatus, queryMode: 'local', displayField: 'Name', valueField: 'ID',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: false,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(polid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id: polid, fieldLabel: 'PoliticalStatus', name: 'PoliticalStatus', value: ''
            }, {
                xtype: 'combobox', fieldLabel: '人员血型', //emptyText: '人员血型',
                name: 'BloodTypeID', hiddenName: 'BloodTypeID',
                store: $.storeBloodType, queryMode: 'local', displayField: 'Name', valueField: 'ID',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: true,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(bloodid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id: bloodid, fieldLabel: 'BloodType', name: 'BloodType', value: ''
            }, {
                xtype: 'combobox', fieldLabel: '兵役状况', //emptyText: '请选择兵役状况',
                name: 'SoldierStatusID', hiddenName: 'SoldierStatusID',
                store: $.storeSoldierStatus, queryMode: 'local', displayField: 'Name', valueField: 'ID',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: false,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(soldierid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id: soldierid, fieldLabel: 'SoldierStatus', name: 'SoldierStatus', value: ''
            }, {
                xtype: 'combobox', fieldLabel: '婚姻状况', //emptyText: '请选择婚姻状况',
                name: 'MarriageStatusID', hiddenName: 'MarriageStatusID',
                store: $.storeMarriageStatus, queryMode: 'local', displayField: 'Name', valueField: 'ID',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: false,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(marryid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id: marryid, fieldLabel: 'MarriageStatus', name: 'MarriageStatus', value: ''
            }, {
                xtype: 'textfield',
                fieldLabel: '宗教信仰',
                name: 'Religion',
                value:'无'
            }, {
                xtype: 'textfield',
                fieldLabel: '住宅电话',
                regex: /^[0-9_]{7,16}$/,
                name: 'LivePhone'
            }, {
                xtype: 'textfield',
                fieldLabel: '手机',
                regex: /^[1-2]{1}\d{10}$/,
                name: 'Telephone1'
            }, {
                xtype: 'textfield',
                fieldLabel: '户籍地',
                name: 'Domicile',
                allowBlank: false,
                value:''
            }, {
                xtype: 'combobox', fieldLabel: '重点人口', //emptyText: '请选择重点类型',
                name: 'IsPsychosis', hiddenName: 'IsPsychosis',
                store: states, queryMode: 'local', displayField: 'd', valueField: 'v', value:0,
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: true
            }, {
                xtype: 'combobox', fieldLabel: '重点类型', //emptyText: '请选择重点类型',
                name: 'PsychosisTypeID', hiddenName: 'PsychosisTypeID',
                store: $.storePsychosisType, queryMode: 'local', displayField: 'Name', valueField: 'ID',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: true,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(psyid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id: psyid, fieldLabel: 'PsychosisType', name: 'PsychosisType', value: ''
            }, {
                xtype: 'textfield',
                fieldLabel: '户号',
                name: 'HouseholdNo',
                allowBlank: false
            }, {
                xtype: 'combobox', fieldLabel: '户主关系', //emptyText: '请选择户主关系',
                name: 'HRelationID', hiddenName: 'HRelationID',
                store: $.storeHRelation, queryMode: 'local', displayField: 'Name', valueField: 'ID',
                forceSelection: true, editable: false, triggerAction: 'all', allowBlank: false,
                listeners: {
                    'change': function (obj, value, eOpts) {
                        var comp = this;
                        form.getComponent(hrelaid).setValue(comp.getRawValue());
                    }
                }
            }, {
                xtype: 'hiddenfield', id: hrelaid, fieldLabel: 'HRelation', name: 'HRelation', value: ''
            }, {
                xtype: 'textfield',
                fieldLabel: '家庭住址',
                name: 'HomeAddress',
                value: defaults.address,
                readOnly: true
            }, {
                xtype: 'textfield',
                fieldLabel: '当前住址',
                name: 'CurrentAddress',
                value: defaults.address,
                readOnly: true
            });

            if (defaults.data) {
                form.loadRecord(defaults.data);
            }

            return form;
        };

        var Show = me.Show = function (options) {
            var defaults = { req: null, data: null, address:'', title: '编辑人员信息...', width: 600, height: 400, callback:submitCallback };
            Ext.apply(defaults, options);

            var form = Form(defaults);
            var wind = me.window = ExtHelper.CreateWindow({
                title: defaults.title, width: defaults.width, height: defaults.height,
                listeners: {
                    'close': function () {
                        $.parent.room.grid.window.show();
                        me.window.close();
                    },
                    'show': function () { $.parent.room.grid.window.hide();}
                }
            });
            wind.add(form);
        };

        function submitCallback(result) {
            var defaults = { result: undefined, msg: errorState.SubmitFail, success: false };
            Ext.apply(defaults, result.action.result);

            if (defaults.result > 0) {
                $.grid.stores.Each(function (s) { s.load();});
                me.window.close();
            } else {
                errorState.show(errorState.SubmitFail);
            }
        }

    })($.form = $.form || {});

})(buildingManager.createObj('population'));

//@ param
(function ($) {

    //@ model
    (function (me) {
        var tp = me.type = identityManager.createId('model');

        var model = Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'PID' },
                { name: 'Name' },
                { name: 'Code' },
                { name: 'Disabled' },
                { name: 'Sort' }
            ]
        });

        var defaults = me.defaults = { ID: 0, Name: null, Code: 0, Disabled: 0, Sort: 0 };

    })($.model = $.model || {});

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), model: $.model.type, req: null, total: false, pageSize: 15 };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.parent.basic_url, defaults.req);

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })($.store = $.store || {});

    (function (me) {

        me.Grid = function (options) {
            var defaults = { req: null, pager: false, columns: [], callback: Ext.emptyFn, close: Ext.emptyFn, show: Ext.emptyFn };
            Ext.apply(defaults, options);

            var store = $.store.Store({ req: defaults.req, total: defaults.pager });
            var grid = ExtHelper.CreateGrid({
                store: store, columns: defaults.columns, pager: defaults.pager,
                toolbar: {
                    enable: true,
                    add: function (grid) {
                        addFn({ grid: grid, req: String.Format('add{0}', defaults.req), callback:defaults.callback, close:defaults.close, show:defaults.show });
                    },
                    update: function (grid) {
                        updFn({ grid: grid, req: String.Format('upd{0}', defaults.req), callback: defaults.callback, close: defaults.close, show: defaults.show });
                    },
                    del: function (grid) {
                        delFn({ grid: grid, req: String.Format('del{0}', defaults.req), callback: defaults.callback, close: defaults.close, show: defaults.show });
                    }
                }
            });

            return {
                supper:$,
                store: store,
                grid: grid
            };
        };

    })($);

    //@ form
    (function (me) {

        me.Form = function (options) {
            var defaults = { req: null, data: null, callback: Ext.emptyFn };
            Ext.apply(defaults, options);

            var form = $.parent.getForm({
                req: defaults.req, callback: function (options) {
                    
                    Ext.apply(options, { callback: defaults.callback });
                    submitCallback(options);
                }
            });

            form.add({
                xtype: 'hiddenfield',
                fieldLabel: 'id',
                name: 'ID',
                value: '0'
            }, {
                xtype: 'hiddenfield',
                fieldLabel: 'pid',
                name: 'PID',
                value: '0'
            }, {
                xtype: 'textfield',
                fieldLabel: '项值名称',
                name: 'Name',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '项值代码',
                name: 'Code',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '项值排序',
                name: 'Sort',
                value: '0',
                allowBlank: false
            }, {
                xtype: 'combobox',
                id: 'ParamDisabled',
                fieldLabel: '是否启用',
                name: 'Disabled',
                hiddenName: 'Disabled',
                store: states,
                queryMode: 'local',
                displayField: 'd',
                valueField: 'v',
                emptyText: '请选择',
                forceSelection: true,// 必须选择一个选项
                blankText: '请选择',
                triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
                selectOnFocus: true,
                value: 1,
                allowBlank: false
            });

            if (defaults.data) {
                form.loadRecord(defaults.data);
            }

            return form;
        };

        me.Show = function (options) {
            var defaults = {
                req: null, data: null, title: '信息编辑...', width: 400, height: 189,
                close: function () {
                    $.parent.window.show();
                    me.window = null;
                },
                show: function () {
                    $.parent.window.hide();
                },
                callback:Ext.emptyFn
            };
            Ext.apply(defaults, options);

            var wind = me.window = ExtHelper.CreateWindow({
                title: defaults.title, width: defaults.width, height: defaults.height,
                listeners: {
                    'close': function () {
                        defaults.close();
                    },
                    'show': function () {
                        defaults.show();
                    }
                }
            });

            var form = me.Form({ req: defaults.req, data: defaults.data, callback: defaults.callback });
            wind.add(form);
        };

        function submitCallback(options) {
            var defaults = { action: { result: { success: false } }, callback: Ext.emptyFn };
            Ext.apply(defaults, options);
            
            if (defaults.action.result.success) {

                me.window.close();
                defaults.callback(options);
            } else {
                errorState.show(errorState.SubmitFail);
            }
        }

    })($.form = $.form || {});

    function addFn(options) {
        var defaults = { grid: null, req: null, callback: Ext.emptyFn, close: Ext.emptyFn, show: Ext.emptyFn };
        Ext.apply(defaults, options);

        $.form.Show({ req: defaults.req, callback: defaults.callback, close: defaults.close, show: defaults.show });
    }

    function updFn(options) {
        var defaults = { grid: null, req: null, callback: Ext.emptyFn, close: Ext.emptyFn, show: Ext.emptyFn };
        Ext.apply(defaults, options);

        $.parent.updateCallback({
            grid: defaults.grid,
            callback: function (d) {
                $.form.Show({ req: defaults.req, data: d, callback: defaults.callback, close: defaults.close, show: defaults.show });
            }
        });
    }

    function delFn(options) {
        var defaults = { grid: null, req: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);
        
        $.parent.deleteCallback({
            grid: defaults.grid,
            callback: function (d) {
                var ids = d.Each(function (a) { return a.get('ID'); });

                $.parent.deleteAction({
                    req: defaults.req, ids: ids, callback: function (result) {
                        if (result.success) {
                            defaults.callback(result);
                        }
                    }
                });
            }
        });
    }

})(buildingManager.createObj('param'));

//@ room's usertype 房间用途
(function ($) {

    var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'ID', text: '用途ID', hidden: true, width: 45 },
            { dataIndex: 'Name', text: '用途名称', flex: 2, sortable: false },
            { dataIndex: 'Code', text: '用途代码', flex: 1, sortable: false },
            { dataIndex: 'Disabled', text: '是否启用', width: 60, sortable: false, renderer: function (a, b, c) { return a ? "启用" : "禁用"; } },
            { dataIndex: 'Sort', text: '排序', width: 45, hidden: true, sortable: false }
    ];

    var grid = $.grid = $.parent.param.Grid({
        req: 'uses', columns: columns, callback: function (options) {
            grid.store.load();
        }, close: function () {
            grid.supper.parent.room.grid.show();
        }, show: function () {
            grid.supper.parent.room.grid.hide();
        }
    });

})(buildingManager.createObj('usetype'));

//@ room's properties 房间属性
(function ($) {
    
    var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'ID', text: '属性ID', hidden: true, width: 45 },
            { dataIndex: 'Name', text: '属性名称', flex: 2, sortable: false },
            { dataIndex: 'Code', text: '属性代码', flex: 1, sortable: false },
            { dataIndex: 'Disabled', text: '是否启用', width: 60, sortable: false, renderer: function (a, b, c) { return a ? "启用" : "禁用"; } },
            { dataIndex: 'Sort', text: '排序', width: 45, hidden: true, sortable: false }
    ];

    var grid = $.grid = $.parent.param.Grid({
        req: 'props', columns: columns, callback: function (options) {
            grid.store.load();
        }, close: function () {
            grid.supper.parent.room.grid.show();
        }, show: function () {
            grid.supper.parent.room.grid.hide();
        }
    });

})(buildingManager.createObj('property'));

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

    var grid = $.grid = $.parent.param.Grid({
        columns: columns, req: 'structs', callback: function (options) {
            grid.store.load();
        }
    });

})(buildingManager.createObj('struct'));

(function ($) {
    var me = $;

    //@param 性别
    var storeSex = me.storeSex = $.parent.param.store.Store({ req: 'sex' });
    //@param 居住性质，停止使用
    var storeLiveType = me.storeLiveType = null; // $.parent.param.store.Store({ req: 'live' });
    //@param 文化程度
    var storeEducation = me.storeEducation = $.parent.param.store.Store({ req: 'edu' });
    //@param 籍贯省
    var storeOriginProvince = me.storeOriginProvince = $.parent.param.store.Store({ req: 'prov' });
    //@param 籍贯市
    var storeOriginCity = me.storeOriginCity = $.parent.param.store.Store({ req: 'city' });
    //@param 政治面貌
    var storePoliticalStatus = me.storePoliticalStatus = $.parent.param.store.Store({ req: 'poli' });
    //@param 血型
    var storeBloodType = me.storeBloodType = $.parent.param.store.Store({ req: 'blood' });
    //@param 兵役状况
    var storeSoldierStatus = me.storeSoldierStatus = $.parent.param.store.Store({ req: 'soldier' });
    //@param 婚姻状况
    var storeMarriageStatus = me.storeMarriageStatus = $.parent.param.store.Store({ req: 'marry' });
    //@param 重点人口类别
    var storePsychosisType = me.storePsychosisType = $.parent.param.store.Store({ req: 'psych' });
    //@param 与户主关系
    var storeHRelation = me.storeHRelation = $.parent.param.store.Store({ req: 'hrelation' });

    var dispose = $.dispose = function () {
        if (storeBloodType) storeBloodType.destroy();
        if (storeEducation) storeEducation.destroy();
        if (storeHRelation) storeHRelation.destroy();
        if (storeLiveType) storeLiveType.destroy();
        if (storeMarriageStatus) storeMarriageStatus.destroy();
        if (storeOriginCity) storeOriginCity.destroy();
        if (storeOriginProvince) storeOriginProvince.destroy();
        if (storePoliticalStatus) storePoliticalStatus.destroy();
        if (storePsychosisType) storePsychosisType.destroy();
        if (storeSex) storeSex.destroy();
        if (storeSoldierStatus) storeSoldierStatus.destroy();
    }

})(buildingManager.population);

(function ($) {   

    var Show = $.Show = function (options) {
        //var defaults = { title: '人员信息详细...', width: 600, height: 400 };
        //Ext.apply(defaults, options);

        //var tab = getTable(options);
        //var wind = ExtHelper.CreateWindow({ title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit' });
        //wind.add(tab.tab);

        var mask = maskGenerate.start({ p: buildingManager.room.grid.window.getId(), msg: '正在获取，请稍等 ...' });
        buildingManager.loadPopulationHandler(function () {
            $populationdetail.population.detail.Show(options);
            mask.stop();
        });
    };

    var Form = $.Form = function (options) {
        var defaults = {
            ID: 0, Name: null, OtherName: null, SexID: 0, Sex: null, LiveTypeID: 0, LiveType: null, Nation: null,
            EducationID: 0, Education: null, OriginProvinceID: 0, OriginProvince: null, OriginCityID: 0, OriginCity: null,
            Stature: null, PoliticalStatusID: 0, PoliticalStatus: null, CardNo: null, BloodTypeID: 0, BloodType: null,
            SoldierStatusID: 0, SoldierStatus: null, MarriageStatusID: 0, MarriageStatus: null, Religion: null, LivePhone: null,
            Telephone1: null, Domicile: null, IsPsychosis: 0, PsychosisTypeID: 0, PsychosisType: null,
            HouseholdNo: null, HRelationID: 0, HRelation: null, PhotoPath: null, HomeAddrID: 0, CurrentAddrID: 0,
            HomeAddress: null, CurrentAddress: null
        };
        Ext.apply(defaults, options);

        var panel = new Ext.panel.Panel({
            border: 0, layout: 'border',
            items: [{
                xtype: 'panel',
                border: 0,
                region: 'north',
                html: '<span style="font-size:12px; font-weight:700; color:#660000; margin-left:15px;">基本信息:</span>',
                style: 'border-bottom:1px solid lightgray; line-height:35px;',
                height: 30
            },{
                xtype: 'panel',
                border: 0,
                region: 'center',
                layout:'border',
                items: [{
                    xtype: 'panel',
                    border: 0,
                    region: 'west',
                    width: 100,
                    items: [{
                        xtype: 'panel',
                        border: 0,
                        html:String.Format('<img style="height:110px; width:85px; margin-left:5px; margin-top:5px;" src="{0}" alt="{1}" />', defaults.PhotoPath || 'photo.png', defaults.Name)
                    }]
                }, {
                    xtype: 'panel',
                    border: 0,
                    region: 'center',
                    layout:'border',
                    items: [{
                        xtype: 'panel',
                        border: 0,
                        region: 'center',
                        layout:'border',
                        items: [{
                            xtype: 'panel',
                            region: 'west',
                            border: 0,
                            width: 150,
                            items: [{
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">姓名</span>：{0}", defaults.Name),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">曾用名</span>：{0}", defaults.OtherName),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">性别</span>：{0}", defaults.Sex),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">民族</span>：{0}", defaults.Nation),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">身高</span>：{0} 厘米", defaults.Stature),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">血型</span>：{0}", defaults.BloodType),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">户籍地</span>：{0}", defaults.Domicile),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }]
                        }, {
                            xtype: 'panel',
                            region: 'center',
                            border: 0,
                            items: [{
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">证件号码</span>：{0}", defaults.CardNo),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">文化程度</span>：{0}", defaults.Education),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">婚姻状况</span>：{0}", defaults.MarriageStatus),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">兵役状况</span>：{0}", defaults.SoldierStatus),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">政治面貌</span>：{0}", defaults.PoliticalStatus),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">宗教信仰</span>：{0}", defaults.Religion),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">籍贯</span>：{0},{1}", defaults.OriginProvince, defaults.OriginCity),
                                border: 0,
                                style: 'height:22px; line-height:22px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;'
                            }]
                        }]
                    }, {
                        xtype: 'panel',
                        border: 0,
                        region: 'south',
                        height: 50,
                        items: [{
                            xtype: 'panel',
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">家庭住址</span>：{0}", defaults.HomeAddress),
                            border:0,
                            style:'height:22px; line-height:22px;'
                        }, {
                            xtype: 'panel',
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">当前住址</span>：{0}", defaults.CurrentAddress),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }]
                }]
            }, {
                xtype: 'panel',
                border: 0,
                region: 'south',
                height: 105,
                layout:'border',
                items: [{
                    xtype: 'panel',
                    border: 0,
                    region: 'north',
                    html: '<span style="font-size:12px; font-weight:700; color:#660000; margin-left:15px;">其它:</span>',
                    style: 'border-bottom:1px solid lightgray; line-height:22px;',
                    height: 22
                }, {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'border',
                    border:0,
                    items: [{
                        xtype: 'panel',
                        region: 'west',
                        border:0,
                        width: 200,
                        items: [{
                            xtype: 'panel',
                            html: String.Format("<span style=\"margin-left:25px; font-weight:700; font-size:11px; color:#15498b;\">人口性质</span>：{0}", defaults.LiveType),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }, {
                        xtype: 'panel',
                        region: 'center',
                        border:0,
                        items: [{
                            xtype: 'panel',
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">重口类别</span>：{0}", defaults.PsychosisType || '无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }]
                }]
            }]
        });
        return panel;
    };

})(buildingManager.population.detail = buildingManager.population.detail || { parent: buildingManager.population });

LoadModlues.loadJS(typeof $company, 'Resources/js/Param.js', function () {
    LoadModlues.loadJS(typeof $company, 'Company/Company.js');
});