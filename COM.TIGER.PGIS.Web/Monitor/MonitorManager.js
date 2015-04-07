/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/Utils.js" />


var paramHandler = paramHandler || {};
(function ($) {
    
    //@private param
    var url = 'Monitor/MonitorHelp.ashx?req=';

    //@public

    //prototype
    $.fn = $.constructor.prototype;
    $.instance = function () {
        return new constructor();
    };

    function constructor() {
        var obj = {};
        (function ($) {
            var now = new Date();

            //prototype
            $.fn = $.constructor.prototype;

            $.model = { type: String.Format("model_{0}{1}", now.getTime(), now.getMilliseconds()) };
            $.model.model = function () {
                var m = Ext.define($.model.type, {
                    extend: 'Ext.data.Model',
                    fields: [
                        { name: 'ID' },
                        { name: 'PID' },
                        { name: 'Name' },
                        { name: 'Code' },
                        { name: 'Disabled' },
                        { name: 'Sort' },
                        { name: 'ChildParams' }
                    ]
                });
                return m;
            }();

            $.store = { id: String.Format("store_{0}{1}", now.getTime(), now.getMilliseconds()) };
            $.store.Store = function (options) {
                var me = this;
                var store = me.store;
                if (store)
                    return store;

                var defaults = { req: '' };
                Ext.apply(defaults, options);

                store = me.store = ExtHelper.CreateStore({
                    storeId: me.id,
                    model: $.model.type,
                    url: String.Format("{0}{1}", url, defaults.req)
                });
                return store;
            };

            $.grid = {};
            $.grid.columns = function () {
                var columns = [
                    { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
                    { dataIndex: 'ID', text: '参数标识', flex: 1, sortable: false, hidden: true },
                    { dataIndex: 'Name', text: '参数项名称' },
                    { dataIndex: 'Code', text: '参数编码', flex: 1, sortable: false, hidden: true },
                    {
                        dataIndex: 'Disabled', text: '是否启用', sortable: false, hidden: false, renderer: function (value, obj, record) {
                            switch (value) {
                                case 0:
                                    return '<span style="color:red;">禁用</span>';
                                case 1:
                                    return '<span style="color:blue;">启用</span>';
                                default:
                                    return '';
                            }
                        }
                    },
                    {
                        dataIndex: 'Sort', text: '排序', sortable: false, hidden: true, renderer: function (value, obj, record) {
                            return value;
                        }
                    }
                ];
                return columns;
            }();
            $.grid.Grid = function (options) {
                var me = this;
                var grid = me.grid;
                if (grid)
                    return grid;

                var defaults = { req: '', addFn: null, updFn: null, delFn: null, height: 380 };
                Ext.apply(defaults, options);

                var store = $.store.Store(defaults);
                grid = me.grid = ExtHelper.CreateGrid({
                    height: defaults.height,
                    store: store,
                    columns: me.columns,
                    toolbar: {
                        enable: true,
                        add: defaults.addFn,
                        update: defaults.updFn,
                        del: defaults.delFn
                    }
                });
                return grid;
            };

            $.form = {};
            $.form.Form = function (options) {

                var defaults = { req: '', width: 320, height: 580, data: null, /*Function*/callback: null };
                Ext.apply(defaults, options);

                var me = this;
                var form = ExtHelper.CreateForm({
                    url: String.Format("{0}{1}", url, defaults.req),
                    w: defaults.width,
                    callback: function () {
                        var me = this;
                        defaults.callback({
                            form: me,
                            callback: submitCallback
                        });
                    }
                });
                form.add({
                    xtype: 'hiddenfield',
                    fieldLabel: 'id',
                    name: 'ID'
                }, {
                    xtype: 'hiddenfield',
                    fieldLabel: 'pid',
                    name: 'PID',
                    value: ''
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
                    //selectOnFocus: true,
                    editable:false,
                    value: 1,
                    allowBlank: false
                }); 
                
                if (defaults.data) {
                    form.loadRecord(defaults.data);
                }
                return form;
            };
            $.form.Show = function (options) {
                //debugger;
                var me = this;
                var defaults = { req: '', title: '编辑参数信息', height: 189, width: 400, data: null, /*Function*/callback: null };
                Ext.apply(defaults, options);

                var wind = ExtHelper.CreateWindow({ title: defaults.title, width: defaults.width, height: defaults.height });
                var form = me.Form({ req: defaults.req, data: defaults.data, callback: defaults.callback });
                wind.add(form);
                monitorHandler.window.hide();
                wind.on('close', function () {
                    monitorHandler.window.show();
                });
                return wind;
            };

            //@private function
            function submitCallback() {
                //重新加载列表数据
                $.store.store.load();
            }

        })(obj);
        return obj;
    }
})(paramHandler);

//监控管理
var monitorHandler = monitorHandler || {};
(function ($) {

    //@private param
    var url = 'Monitor/MonitorHelp.ashx?req=';
    var imgpath = '../Resources/images/';
    
    //@public 

    //prototype
    $.fn = $.constructor.prototype;

    //监控设备类型和用途信息
    $.param = {};
    //监控设备类型信息
    $.param.TypeInstance = { instance: paramHandler.instance() };
    $.param.TypeInstance.addFn = function () {
        $.param.TypeInstance.instance.form.Show({
            req: 'tadd',
            title: '添加设备类型',
            callback: submitActionCallback
        });
    };
    $.param.TypeInstance.upFn = function (grid) {
        var rows = grid.grid.getSelectionModel().getSelection();
        if (rows.length == 0) {
            errorState.show(errorState.SelectRow);
            return;
        }
        if (rows.length > 1) {
            errorState.show(errorState.SelectOnlyRow);
            return;
        }
        $.param.TypeInstance.instance.form.Show({
            req: 'tupd',
            title: '修改设备类型',
            data: rows[0],
            callback: submitActionCallback
        });
    };
    $.param.TypeInstance.delFn = function (grid) {
        deleteActionCallback({
            grid: grid,
            req: 'tdel',
            callback: function () {
                $.param.TypeInstance.instance.store.store.load();
            }
        });
    }
    $.param.TypeInstance.grid = function () {
        return $.param.TypeInstance.instance.grid.Grid({
            req: 'type',
            addFn: $.param.TypeInstance.addFn,
            updFn: $.param.TypeInstance.upFn,
            delFn: $.param.TypeInstance.delFn
        });
    }();

    //监控设备用途信息
    $.param.DoTypeInstance = { instance: paramHandler.instance() };
    $.param.DoTypeInstance.addFn = function () {
        $.param.DoTypeInstance.instance.form.Show({
            req: 'doadd',
            title: '添加设备用途',
            callback: submitActionCallback
        });
    };
    $.param.DoTypeInstance.upFn = function (grid) {
        var rows = grid.grid.getSelectionModel().getSelection();
        if (rows.length == 0) {
            errorState.show(errorState.SelectRow);
            return;
        }
        if (rows.length > 1) {
            errorState.show(errorState.SelectOnlyRow);
            return;
        }
        $.param.DoTypeInstance.instance.form.Show({
            req: 'doupd',
            title: '修改设备用途',
            data: rows[0],
            callback: submitActionCallback
        });
    };
    $.param.DoTypeInstance.delFn = function (grid) {
        deleteActionCallback({
            grid: grid,
            req: 'dodel',
            callback: function () {
                $.param.DoTypeInstance.instance.store.store.load();
            }
        });
    }
    $.param.DoTypeInstance.grid = function () {
        return $.param.DoTypeInstance.instance.grid.Grid({
            req: 'dotype',
            addFn: $.param.DoTypeInstance.addFn,
            updFn: $.param.DoTypeInstance.upFn,
            delFn: $.param.DoTypeInstance.delFn
        });
    }();


    //监控设备信息
    $.model = { type: String.Format("model_{0}", new Date().getTime()) };
    $.model.model = function () {
        var m = Ext.define($.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'Num' },
                { name: 'DeviceID' },
                { name: 'AddressID' },
                { name: 'DeviceTypeID' },
                { name: 'DeviceTypeName' },
                { name: 'DoTypeID' },
                { name: 'DoTypeName' },
                { name: 'IP' },
                { name: 'Port' },
                { name: 'Acct' },
                { name: 'Pwd' },
                { name: 'X' },
                { name: 'Y' },
                { name: 'Address' },
                { name: 'AdministrativeID' },
                { name: 'AdministrativeName' },
                { name: 'AddressContext' }
            ]
        });
        return m;
    }();

    //数据仓储
    $.store = { id: String.Format("store_{0}", new Date().getTime()) };
    $.store.Store = function (options) {
        var me = this;
        var store = me.store;
        if (store)
            return store;

        var defaults = { req: '1' };
        Ext.apply(defaults, options);

        store = me.store = ExtHelper.CreateStore({
            storeId: me.id,
            model: $.model.type,
            url: String.Format("{0}{1}", url, defaults.req),
            total:true
        });
        return store;
    };

    $.grid = {};
    $.grid.columns = function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'ID', text: '信息编码', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'Name', text: '设备名称', flex: 1, sortable: false, hidden: false },
            { dataIndex: 'Num', text: '设备编号', flex: 1, sortable: false, hidden: false },
            { dataIndex: 'DeviceID', text: '设备ID', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'DeviceTypeName', text: '设备类型', flex: 1, sortable: false, hidden: false },
            { dataIndex: 'DoTypeName', text: '设备用途', flex: 1, sortable: false, hidden: false },
            {
                dataIndex: 'IP', text: 'IP/PORT', flex: 2, sortable: false, hidden: true, renderer: function (value, obj, record) {
                    var data = record.getData();
                    return String.Format("{0} / {1}", data.IP, data.Port);
                }
            },
            { dataIndex: 'Acct', text: '登陆账户', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'Pwd', text: '登陆密码', flex: 1, sortable: false, hidden: true },
            {
                dataIndex: 'X', text: '地图坐标', flex: 1, sortable: false, hidden: true, renderer: function (value, obj, record) {
                    var data = record.getData();
                    return String.Format("{{0},{1}}", data.X, data.Y);
                }
            },
            //{ dataIndex: 'Address', text: '设备地址', flex: 2, sortable: false, hidden: true },
            {
                dataIndex: 'ID', text: '', width: 65, sortable: false, hidden: false, renderer: function (a, b, c) {
                    var data = c.getData();
                    var val = Object.$EncodeObj(data);

                    return String.Format('<span class="a" style="font-size:11px;" title="定位到地图" onclick="{0}(\'{1}\')">定位</span><span class="a" style="margin-left:5px; font-size:11px;" title="查看视频" onclick="{2}(\'{1}\')">查看</span>', 'monitorHandler.location', val, 'monitorHandler.play');
                }
            }
        ];
        return c;
    }();
    $.location = function (v) {
        var data = Object.$DecodeObj(v);
        var defaults = { ID: 0, X: 0, Y: 0, Name:'' };
        Ext.apply(defaults, data);

        $.window.close();
        //绘制图像
        var html = String.Format("<img style='width:32px;height:32px;' src='{0}camera.png'  title='{1} 点击打开视频播放窗口' ></img>", imgpath, defaults.Name);
        EMap.AppendEntity(defaults.ID, { x: defaults.X, y: defaults.Y, exX: 16, exY: 16 }, {
            html: html, callback: function () {
                Camera(data);
            }, args: data
        });
        //移动到当前座标
        EMap.MoveTo(defaults.X, defaults.Y);
    };
    $.play = function (v) {
        var data = Object.$DecodeObj(v);
        Camera(data);
    };
    var Camera = $.Camera = function (o) {
        ExtHelper.CameraPlay(o);
    };

    $.grid.Grid = function (options) {
        var me = this;
        var grid = me.grid;
        if (grid)
            return grid;

        var defaults = { req: '1' };
        Ext.apply(defaults, options);

        grid = me.grid = ExtHelper.CreateGrid({
            store: $.store.Store(defaults),
            columns: me.columns,
            pager: true,
            toolbar: {
                enable: true,
                add: addFn,
                update: updFn,
                del: delFn
            }
        });
        return grid;
    };

    $.form = {};
    $.form.Form = function (options) {
        var me = this;
        var defaults = { req: 'add', title: '编辑监控设备信息', /*String 地图坐标*/coords: '', width: 580, height: 320, data: null, /*Function*/callback: null };
        Ext.apply(defaults, options);

        var adminnameid = identityManager.createId();
        var typenameid = identityManager.createId();
        var dotypenameid = identityManager.createId();
        var xid = identityManager.createId();
        var yid = identityManager.createId();

        var form = ExtHelper.CreateForm({
            url: String.Format("{0}{1}", url, defaults.req),
            w: defaults.width,
            callback: function () {
                var me = this;
                defaults.callback({
                    form: me,
                    callback: submitCallbcak
                });
            }
        });
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'id',
            name: 'ID',
            value: '0'
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'X',
            name: 'X',
            id: xid,
            value: '0'
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'Y',
            name: 'Y',
            id: yid,
            value: '0'
        }, {
            xtype: 'textfield',
            fieldLabel: '设备名称',
            name: 'Name',
            //emptyText: '请输入设备名称',
            allowBlank: false
        }, {
            xtype: 'textfield',
            fieldLabel: '设备编号',
            name: 'Num',
            //emptyText: '请输入设备编号',
            allowBlank: false
        }, {
            xtype: 'textfield',
            fieldLabel: '设备ID号',
            name: 'DeviceID',
            //emptyText: '请输入设备ID号',
            allowBlank: false
        }, {
            xtype: 'combobox',
            fieldLabel: '设备类型',
            name: 'DeviceTypeID',
            hiddenName: 'DeviceTypeID',
            store: function () {
                var data = [];
                $.param.TypeInstance.instance.store.store.data.items.Each(function (e) {
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
            //emptyText: '请选择',
            forceSelection: true,// 必须选择一个选项
            //blankText: '请选择',
            triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
            //selectOnFocus: true,
            editable: false,
            //value: 1,
            allowBlank: false,
            listeners: {
                change: {
                    fn: function () {
                        var text = this.getRawValue();
                        form.getComponent(typenameid).setValue(text);
                    }
                }
            }
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'DeviceTypeName',
            name: 'DeviceTypeName',
            id: typenameid,
            value: ''
        }, {
            xtype: 'combobox',
            fieldLabel: '设备用途',
            name: 'DoTypeID',
            hiddenName: 'DoTypeID',
            store: function () {
                var data = [];
                $.param.DoTypeInstance.instance.store.store.data.items.Each(function (e) {
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
            //emptyText: '请选择',
            forceSelection: true,// 必须选择一个选项
            //blankText: '请选择',
            triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
            //selectOnFocus: true,
            editable: false,
            //value: 1,
            allowBlank: false,
            listeners: {
                change: {
                    fn: function () {
                        var text = this.getRawValue();
                        form.getComponent(dotypenameid).setValue(text);
                    }
                }
            }
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'DoTypeName',
            name: 'DoTypeName',
            id: dotypenameid,
            value: ''
        }, {
            xtype: 'textfield',
            fieldLabel: '设备IP',
            name: 'IP',
            //emptyText: '请输入设备IP',
            allowBlank: false,
            value: '0.0.0.0'
        }, {
            xtype: 'textfield',
            fieldLabel: '设备端口',
            name: 'Port',
            //emptyText: '请输入设备端口',
            allowBlank: false,
            value:'88'
        }, {
            xtype: 'textfield',
            fieldLabel: '登陆账户',
            name: 'Acct',
            //emptyText: '请输入设备名称',
            allowBlank: false,
            value:'admin'
        }, {
            xtype: 'textfield',
            fieldLabel: '登录密码',
            name: 'Pwd',
            //emptyText: '请输入设备名称',
            allowBlank: false,
            value: 'admin'
        }, {
            xtype: 'textfield',
            fieldLabel: '地图坐标',
            name: 'Coords',
            //emptyText: '请选择设备所在地图坐标',
            value: defaults.coords,
            allowBlank: false,
            listeners: {
                focus: {
                    fn: function () {
                        var component = this;
                        me.window.hide();
                        EMap.GetSingleCoords({
                            callback: function (coords) {
                                //debugger;
                                component.setValue(coords);
                                form.getComponent(xid).setValue(coords[0]);
                                form.getComponent(yid).setValue(coords[1]);
                                me.window.show();
                            }
                        });
                    }
                }
            }
        }, {
            xtype: 'combotree',
            url: 'Administrative/AdministrativeHelp.ashx?req=tree',
            name: 'AdministrativeName',
            valueField: 'ID',
            displayField: 'Name',
            fieldLabel: '行政区划',
            allowBlank: false,
            //emptyText: '请选择设备隶属行政区划',
            value: '',
            itemSelected: function (options) {
                var defaults = { ID: 0, Name: '' };
                Ext.apply(defaults, options);

                form.getComponent(adminnameid).setValue(defaults.ID);
            }
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'AdministrativeID',
            name: 'AdministrativeID',
            id: adminnameid,
            value: '0'
        },$address.getAutoComplete({ name: 'AddressContext', text: '设备位置' }));
        if (defaults.data) {
            form.loadRecord(defaults.data);
        }
        return form;
    }
    $.form.Show = function (options) {
        var me = this;
        var defaults = { req: '', title: '编辑参数信息', height: 403, coords:null, width: 600, data: null, /*Function*/callback: null };
        Ext.apply(defaults, options);

        var wind = ExtHelper.CreateWindow({ title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit' });
        var form = me.Form({ req: defaults.req, data: defaults.data, callback: defaults.callback, coords:defaults.coords });
        wind.add(form);

        $.window.hide();
        wind.on('close', function () {
            $.window.show();
        });

        me.window = wind;
        return wind;
    };

    $.tabpanel = { tab: ExtHelper.CreateTabPanelFn() };
    $.tabpanel.Show = function () {
        //添加各项grid，并呈现
        var me = this;
        me.tab.add({
            component: $.grid.Grid({}),
            title: '设备信息',
            closable: false,
            callback: function () { }
        }).add({
            component: $.param.TypeInstance.grid,
            title: '设备类型信息',
            closable: false,
            callback: function () { }
        }).add({
            component: $.param.DoTypeInstance.grid,
            title: '设备用途信息',
            closable: false,
            callback: function () { }
        });
        me.tab.tab.setActiveTab(0);
        $.window = ExtHelper.CreateWindow({ title: '监控设备信息管理', layout: 'fit', width:650 });
        $.window.add(me.tab.tab);
    };

    //@private function

    function addFn() {
        $.form.Show({
            req: 'add',
            title: '添加设备信息',
            callback: submitActionCallback
        });
    }

    function updFn(grid) {
        var rows = grid.grid.getSelectionModel().getSelection();
        if (rows.length == 0) {
            errorState.show(errorState.SelectRow);
            return;
        }
        if (rows.length > 1) {
            errorState.show(errorState.SelectOnlyRow);
            return;
        }
        var data = rows[0].getData();
        $.form.Show({
            req: 'upd',
            title: '修改设备信息',
            data: rows[0],
            coords: String.Format("{0},{1}", data.X, data.Y),
            callback: submitActionCallback
        });
    }

    function delFn(grid) {
        deleteActionCallback({
            grid: grid,
            req: 'del',
            callback: function () {
                $.store.store.load();
            }
        });
    }
    
    function submitCallbcak() {

        $.store.store.load();
    }
    //表单提交回调函数
    function submitActionCallback(options) {
        var defaults = { /*Ext.form.Panel*/form: null, /*Function*/callback: null };
        Ext.apply(defaults, options);

        var form = defaults.form.up('form');
        var wind = form.up('window');
        form = form.getForm();
        if (form.isValid()) {
            form.submit({
                success: function (form, action) {
                    if (action.result.result > 0) {
                        wind.close();
                        defaults.callback();
                    } else if (action.result.result == -2) {
                        errorState.show('重复的设备编号!');
                    } else {
                        Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                    }
                    
                },
                failure: function (form, action) {
                    Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                }
            });
        }
    }
    //移除数据回调函数
    function deleteActionCallback(options) {
        var defaults = {/*Ext.grid.Panel*/grid: null, /*String*/req: '', /*Function*/callback: null };
        Ext.apply(defaults, options);

        var rows = defaults.grid.grid.getSelectionModel().getSelection();
        if (rows.length == 0) {
            errorState.show(errorState.SelectRow);
            return;
        }

        errorState.confirmYes(String.Format("确定删除这 {0} 条记录吗?", rows.length), function () {
            var ids = [];
            Ext.Array.each(rows, function (record) {
                var id = record.get('ID');
                if (id) {
                    ids.push(id);
                }
            });
            Ext.Ajax.request({
                url: String.Format("{0}{1}", url, defaults.req),
                method: "POST",
                params: { ids: ids.join(',') }, //发送的参数  
                success: function (response, option) {
                    response = Ext.JSON.decode(response.responseText);
                    if (response.success == true) {
                        if (response.result && response.result > 0) {
                            //提交成功，触发回调函数
                            if (defaults.callback && defaults.callback instanceof Function) {
                                defaults.callback();
                            }
                        } else {
                            Ext.MessageBox.alert(errorState.SysPrompt, errorState.DeleteFail);
                        }
                    }
                    else { Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }
                },
                failure: function () { Ext.Msg.alert(errorState.SysPrompt, errorState.DeleteFail); }
            });
        });
    }

    function getCoordsCallback(options) {

    }
})(monitorHandler);