/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Config.js" />

var administrative = administrative || {};
(function ($) {
    //@private param
    var url = 'Administrative/AdministrativeHelp.ashx?req=';

    $.instance = function () {
        return new constructor();
    };

    //@private function

    var store = Ext.create('Ext.data.TreeStore', {
        root: { expanded: true },
        proxy: { type: 'ajax', url: 'Area/AreaHandler.ashx?req=al' },
        loadMask: true,
        autoLoad: true
    });
    
    //构造函数
    function constructor() {
        var _instance = {};
        (function ($) {

            //@private param
            var now = new Date();
            
            $.fn = $.constructor.prototype;

            $.model = { type: String.Format("model_{0}{1}", now.getTime(), now.getMilliseconds()) };
            $.model.model = function () {
                var m = Ext.define($.model.type, {
                    extend: 'Ext.data.Model',
                    fields: [
                        { name: 'ID' },
                        { name: 'Name' },
                        { name: 'Code' },
                        { name: 'PID' },
                        { name: 'FirstLetter' },
                        { name: 'AreaID' },
                        { name: 'AreaName' }
                    ]
                });
                return m;
            }();

            $.store = { };
            $.store.Store = function (options) {
                var me = this;
                var defaults = { req: '1' };
                Ext.apply(defaults, options);

                var store = ExtHelper.CreateStore({
                    storeId: String.Format("store_{0}{1}", now.getTime(), now.getMilliseconds()),
                    url: String.Format("{0}{1}", url, defaults.req),
                    model: $.model.type,
                    total: true
                });
                return store;
            };

            $.grid = {};
            $.grid.columns = function () {
                var c = [
                    { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
                    { dataIndex: 'ID', text: '区划标识', flex: 1, sortable: false, hidden: true },
                    {
                        dataIndex: 'Name', text: '区划名称', flex: 2, sortable: false, hidden: false, renderer: function (value, obj, record) {
                            //debugger;
                            var data = record.getData();
                            return String.Format('<a href="#" onclick="adminManager.tabpanel.Add(\'{1}\', \'{2}\')">{0}</a>', value, data.ID, data.Name);
                        }
                    },
                    { dataIndex: 'Code', text: '区划代码', flex: 1, sortable: false, hidden: false },
                    { dataIndex: 'FirstLetter', text: '名称首字母', flex: 1, sortable: false, hidden: true },
                    { dataIndex: 'AreaID', text: '辖区ID', flex: 1, sortable: false, hidden: true },
                    { dataIndex: 'AreaName', text: '辖区', flex: 2, sortable: false, hidden: false }
                ];

                return c;
            }();
            $.grid.Grid = function (options) {
                var me = this;
                var defaults = { req: '1', pid: 0 };
                Ext.apply(defaults, options);

                //上一级行政区划ID
                me.PID = defaults.pid;
                me.store = $.store.Store(defaults);
                var grid = me.grid = ExtHelper.CreateGrid({
                    store: me.store,
                    columns: me.columns,
                    pager: true,
                    toolbar: {
                        enable: true,
                        add: addFn,
                        update: upFn,
                        del: delFn
                    }
                });
                return grid;
            };

            $.form = {};
            $.form.Form = function (options) {
                var me = this;
                var defaults = { req: '', title: '编辑行政区划信息', width: 580, height: 120, data: null };
                Ext.apply(defaults, options);

                var form = ExtHelper.CreateForm({
                    url: String.Format("{0}{1}", url, defaults.req),
                    w: defaults.width,
                    callback: submitFn
                });
                var areaid = String.Format("areaid_{0}{1}", new Date().getTime(), new Date().getMilliseconds());
                var AreaID = String.Format("areaid_value_{0}{1}", new Date().getTime(), new Date().getMilliseconds());
                var AreaName = String.Format("areaname_value_{0}{1}", new Date().getTime(), new Date().getMilliseconds());
                form.add({
                    xtype: 'hiddenfield',
                    fieldLabel: 'id',
                    name: 'ID',
                    value: '0'
                }, {
                    xtype: 'hiddenfield',
                    fieldLabel: 'pid',
                    name: 'PID',
                    value: $.grid.PID
                }, {
                    xtype: 'textfield',
                    fieldLabel: '区划名称',
                    name: 'Name',
                    emptyText: '请输入区划名称',
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    fieldLabel: '区划代码',
                    name: 'Code',
                    emptyText: '请输入区划代码',
                    allowBlank: false
                }, {
                    xtype: 'combotree',
                    url: 'Area/AreaHandler.ashx?req=al',
                    name: 'AreaName',
                    id:areaid,
                    valueField: 'ID',
                    displayField:'Name',
                    fieldLabel: '隶属辖区',
                    allowBlank: false,
                    value:'',
                    itemSelected: function (options) {
                        var defaults = { ID: 0, Name: '' };
                        Ext.apply(defaults, options);

                        form.getComponent(AreaID).setValue(defaults.ID);
                    }
                }, {
                    xtype: 'hiddenfield',
                    fieldLabel: 'id',
                    name: 'AreaID',
                    id:AreaID,
                    value: 0
                });

                if (defaults.data) {
                    form.loadRecord(defaults.data);
                }
                return form;
            };
            $.form.Show = function (options) {
                var me = this;
                var defaults = { req: '', title: '编辑行政区划信息', width: 300, height: 162, data: null };
                Ext.apply(defaults, options);

                var wind = ExtHelper.CreateWindow({ title: defaults.title, width: defaults.width, height: defaults.height });
                var form = me.Form({ req: defaults.req, data: defaults.data, callback: defaults.callback });
                wind.add(form);

                adminManager.window.hide();
                wind.on('close', function () {
                    adminManager.window.show();
                });

                return wind;
            }

            //@private function
            function addFn() {
                $.form.Show({ req: 'add' });
            }

            function upFn(grid) {
                var rows = grid.grid.getSelectionModel().getSelection();
                if (rows.length == 0) {
                    errorState.show(errorState.SelectRow);
                    return;
                }
                if (rows.length > 1) {
                    errorState.show(errorState.SelectOnlyRow);
                    return;
                }
                $.form.Show({ req: 'up', data: rows[0] });
            }

            function delFn(grid) {
                var rows = grid.grid.getSelectionModel().getSelection();
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
                        url: String.Format("{0}del", url),
                        method: "POST",
                        params: { ids: ids.join(',') }, //发送的参数  
                        success: function (response, option) {
                            response = Ext.JSON.decode(response.responseText);
                            if (response.success == true) {
                                if (response.result && response.result > 0) {
                                    //提交成功，触发回调函数
                                    $.grid.store.load();
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

            function submitFn() {
                var form = this.up('form');
                var wind = form.up('window');
                form = form.getForm();
                if (form.isValid()) {
                    form.submit({
                        success: function (form, action) {
                            if (action.result.result > 0) {
                                wind.close();
                                $.grid.store.load();
                            } else if (action.result.result == -2) {
                                errorState.show('重复的名称或者代码！');
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

        })(_instance);

        return _instance;
    }

})(administrative);

var adminManager = adminManager || {};
(function ($) {

    //@private param

    $.fn = $.constructor.prototype;

    $.tabpanel = { tab: ExtHelper.CreateTabPanelFn() };
    $.tabpanel.Show = function () {
        var me = this;
        me.tab.add({
            component: administrative.instance().grid.Grid({ req: '1' }),
            title: '顶级 区划管理',
            closable: false,
            callback: function () { }
        });
        $.window = ExtHelper.CreateWindow({ title: '行政区划信息管理', layout: 'fit' });
        $.window.add(me.tab.tab);
    };
    $.tabpanel.Add = function (id, name) {
        //debugger;
        var me = this;

        me.tab.add({
            component: administrative.instance().grid.Grid({ req: String.Format("2&id={0}", id), pid: id }),
            title: String.Format("{0} 管理", name),
            closable: true,
            callback: function () { }
        });
    };

    //@private function

})(adminManager);