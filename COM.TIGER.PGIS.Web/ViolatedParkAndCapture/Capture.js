/// <reference path="../Resources/js/extjs4.2/ext-all.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />

var capture = capture || {};
(function ($) {
    //全局私有变量
    var now = new Date().getTime();
    var url = 'ViolatedParkAndCapture/Capture.ashx?req=';
    var iconpath = "../Resources/images/mark/";
    var win = null;
    var showsupperwindow = true;

    //原型
    $.fn = $.constructor.prototype;
    
    $.window = function () {
        win = win || ExtHelper.CreateWindow({ title: '违停抓拍（电子警察点，禁停区域，抓拍点等）信息管理', layout: 'fit' });
        return win;
    };

    $.model = { type: String.Format('model_{0}', now) };
    $.model.Model = function () {
        var m = Ext.define($.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'X' },
                { name: 'Y' },
                { name: 'Type' },
                { name: 'Coordinates' },
                { name: 'Remark' },
                { name: 'TypeInfo' }
            ]
        });
        return m;
    }();

    $.model.category = { type: String.Format("model_cate_{0}", now) };
    $.model.category.Model = function () {
        var m = Ext.define($.model.category.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'IconCls' },
                { name: 'Color' }
            ]
        });
        return m;
    }();

    $.store = { id: String.Format('store_{0}', now) };
    $.store.Store = function (options) {
        var defaults = { params: {}, req: '1' };
        Ext.apply(defaults, options);

        var uri = String.Format("{0}{1}{2}", url, defaults.req, getParams(defaults.params));
        var s = ExtHelper.CreateStore({
            storeId: this.id,
            model: $.model.type,
            total: true,
            url: uri
        });
        return s;
    };

    $.store.category = { id: String.Format("store_cate_{0}", now) };
    $.store.category.Store = function (options) {
        var defaults = { params: {}, req: '2' };
        Ext.apply(defaults, options);

        var s = ExtHelper.CreateStore({
            storeId: this.id,
            model: $.model.category.type,
            url: String.Format("{0}{1}{2}", url, defaults.req, getParams(defaults.params))
        });
        return s;
    };

    $.grid = {};
    $.grid.columns = function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'ID', text: '编码', width: 20, sortable: true, hidden: true },
            { dataIndex: 'Name', text: '名称', flex: 1, sortable: true },
            {
                dataIndex: 'X', text: '中心座标', width: 90, sortable: false, renderer: function (value, obj, record) {
                    //debugger;
                    return '{' + record.data.X + ', ' + record.data.Y + '}';
                }
            },
            {
                dataIndex: 'TypeInfo', text: '图标或颜色', width: 70, sortable: false, renderer: function (value, obj, record) {
                    //debugger;
                    if (!value) {
                        return '';
                    }

                    switch (value.Type) {
                        case 1:
                            return "<img style='width:16px;height:16px;' src='" + iconpath + value.IconCls + "'  title='违停抓拍图标'></img>";
                        case 2:
                        case 3:
                            return '<DIV style="width:50px;height:16px;background-color:#' + value.Color + ';"  title="违停抓拍颜色"></DIV>';
                        default: break;
                    }
                    return '';
                }
            },
            {
                dataIndex: 'TypeInfo', text: '类型', flex: 1, sortable: false, renderer: function (value, obj, record) {
                    //debugger;
                    if (!value) {
                        return '';
                    }
                    return value.Name;
                }
            },
            { dataIndex: 'Coordinates', text: '座标组', flex: 2, sortable: false },
            { dataIndex: 'Remark', text: '备注', flex: 2, sortable: false, hidden: true }
        ];
        return c;
    }();
    $.grid.store = $.store.Store();
    $.grid.grid = function () {
        var g = ExtHelper.CreateGrid({
            store: $.grid.store,
            columns: $.grid.columns,
            pager: true,
            toolbar: { enable: true, add: addFn, update: updFn, del: delFn }
        });
        return g;
    }();

    var formstore = $.store.category.Store();
    formstore.load();
    $.form = {};
    $.form.store = formstore;
    $.form.form = function (options) {

        var defaults = { req: 'add', data: null, typeid: '', nameid: '', coords: null, callback: submitFn };
        Ext.apply(defaults, options);
        defaults.url = url + defaults.req;

        var form = ExtHelper.CreateForm(defaults);
        var typeid = String.Format("typeid_{0}", now);
        var coordid = String.Format("coordid_{0}", now);
        var nameid = String.Format("nameid_{0}", now);
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'id',
            name: 'ID',
            value: '0'
        }, {
            xtype: 'textfield',
            fieldLabel: '名称',
            id: nameid,
            name: 'Name',
            allowBlank: false
        }, {
            xtype: 'combobox',
            id: typeid,
            fieldLabel: '违停抓拍类型',
            name: 'Type',
            hiddenName: 'Type',
            store: formstore,
            queryMode: 'local',
            displayField: 'Name',
            valueField: 'ID',
            emptyText: '请选择',
            forceSelection: true,
            blankText: '请选择',
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: false,
            listeners: {
                change: {
                    fn: function (obj, value, eOpts) {
                        form.getComponent(coordid).setValue('');
                    }
                }
            }
        }, {
            xtype: 'textfield',
            fieldLabel: '座标组',
            id: coordid,
            name: 'Coordinates',
            allowBlank: false,
            listeners: {
                focus: {
                    fn: function () {
                        //debugger;
                        var cbxtype = form.getComponent(typeid);
                        defaults.typeid = form.getComponent(typeid).getValue();
                        if (!defaults.typeid) {
                            errorState.show('请选择违停抓拍类型!!!');
                            return;
                        }
                        var data = cbxtype.valueModels[0].raw;
                        showsupperwindow = false;
                        defaults.nameid = form.getComponent(nameid).getValue();
                        w.close();

                        switch (data.Type) {
                            case 1:
                                EMap.GetSingleCoords({
                                    callback: function (coords) {
                                        defaults.coords = coords;
                                        showsupperwindow = true;
                                        $.form.form(defaults);
                                    }
                                });
                                break;
                            case 2:
                            case 3:
                                EMap.GetCoords({
                                    coorded: function (coords) {
                                        //debugger;
                                        defaults.coords = coords;
                                        showsupperwindow = true;
                                        $.form.form(defaults);
                                    }
                                });
                                break;
                            default: break;
                        }
                    }
                }
            }
        }, {
            xtype: 'htmleditor',
            fieldLabel: '备注',
            name: 'Remark',
            width: 550,
            height: 140,
            allowBlank: true
        });
        
        if (defaults.data) {
            form.loadRecord(defaults.data);
        }

        if (defaults.nameid) {
            form.getComponent(nameid).setValue(defaults.nameid);
        }

        if (defaults.typeid) {
            form.getComponent(typeid).setValue(defaults.typeid);
        }

        if (defaults.coords) {
            form.getComponent(coordid).setValue(defaults.coords);
        }
        //隐藏父窗口
        win.hide();
        //打开表单窗口
        var w = ExtHelper.CreateWindow({ title: '违停抓拍点（区域）编辑', width: 550, height: 320 }).center();
        w.add(form);
        w.on('close', function () {
            if (showsupperwindow) {
                win.show();
            }
        });

        return form;
    };

    function addFn() {
        $.form.form({ req: 'add' });
    }

    function updFn(grid) {
        var r = grid.grid.getSelectionModel().getSelection();
        if (r.length == 0) {
            Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            return;
        }
        if (r.length > 1) {
            Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            return;
        }
        $.form.form({ req: 'up', data: r[0] });
    }

    function delFn(grid) {
        var r = grid.grid.getSelectionModel().getSelection();
        if (r.length == 0) {
            Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            return;
        }

        errorState.confirmYes("确定删除这" + r.length + "条记录吗?", function () {
            var ids = [];
            Ext.Array.each(r, function (record) {
                var id = record.get('ID');
                if (id) {
                    ids.push(id);
                }
            });
            Ext.Ajax.request({
                url: url + 'del',
                method: "POST",
                params: { ids: ids.join(',') }, //发送的参数  
                success: function (response, option) {
                    response = Ext.JSON.decode(response.responseText);
                    if (response.success == true) {
                        if (response.result && response.result > 0) {
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
        var f = this.up('form');
        var w = f.up('window');
        var form = f.getForm();
        if (form.isValid()) {
            form.submit({
                success: function (form, action) {
                    if (action.result.success) {
                        if (!f) {
                            Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                        }
                    } else {
                        if (!f) {
                            Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                        }
                    }
                    w.close();
                    $.grid.store.load();
                },
                failure: function (form, action) {
                    Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                }
            });
        }
    }

})(capture);

var captureCategory = captureCategory || {};
(function ($) {

    var now = new Date().getTime();
    var url = 'ViolatedParkAndCapture/Capture.ashx?req=';
    var iconpath = "../Resources/images/mark/";

    $.fn = $.constructor.prototype;

    $.model = { type: String.Format('capturecate_model_{0}', now) };
    $.model.model = function () {
        var m = Ext.define($.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'IconCls' },
                { name: 'Color' },
                { name: 'Type' },
                { name: 'Remark' },
                { name: 'Sort' }
            ]
        });
        return m;
    }();

    $.store = { id: String.Format('capturecate_store_{0}', now) };
    $.store.Store = function (options) {
        var defaults = { params: {}, req: '2' };
        Ext.apply(defaults, options);

        var uri = String.Format("{0}{1}{2}", url, defaults.req, getParams(defaults.params));
        var s = ExtHelper.CreateStore({
            storeId: this.id,
            model: $.model.type,
            url: uri
        });
        return s;
    };

    $.grid = {};
    $.grid.store = $.store.Store();
    $.grid.columns = function () {
        var c = [
                { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
                { dataIndex: 'ID', text: '类型编码', flex: 1, sortable: false, hidden: true },
                { dataIndex: 'Name', text: '类型名称', flex: 1, sortable: false },
                {
                    dataIndex: 'IconCls', text: '图标', width: 35, sortable: false, renderer: function (val) {
                        //debugger;
                        if (val) {
                            return "<img style='width:16px;height:16px;' src='" + iconpath + val + "'  title='违停抓拍图标'></img>";
                        }
                    }
                },
                {
                    dataIndex: 'Color', text: '颜色', width: 35, sortable: false, renderer: function (val) {
                        //debugger;
                        return '<DIV style="width:16px;height:16px;background-color:#' + val + ';"  title="违停抓拍颜色"></DIV>';
                    }
                },
                {
                    dataIndex: 'Type', text: '违停抓拍类型', width: 55, sortable: false, renderer: function (val) {
                        //debugger;
                        var str = '';
                        switch (val) {
                            case 1:
                                str = '坐标点';
                                break;
                            case 2:
                                str = '线条';
                                break;
                            case 3:
                                str = '区域';
                                break;
                            default: break;
                        }
                        return str;
                    }
                },
                { dataIndex: 'Remark', text: '描述信息', flex: 2, sortable: false, hidden: false }
        ];
        return c;
    }();
    $.grid.grid = function () {
        var g = ExtHelper.CreateGrid({
            store: $.grid.store,
            columns: $.grid.columns,
            pager: false,
            toolbar: {
                enable: true, del: delFn, update: updFn, add: addFn
            }
        });
        return g;
    }();


    $.form = function (options) {
        var defaults = { req: 'tadd', data: null, title: '编辑违停抓拍类型表单', multiple: false, type: undefined, isUpdate: false/*是否修改表单标识*/ };
        Ext.apply(defaults, options);

        var form = ExtHelper.CreateForm({ url: url + defaults.req, callback: submitFn });
        var tid = 'IconCls';
        var cid = String.Format("color_{0}", new Date().getTime());
        var typeid = String.Format("type_{0}", new Date().getTime());
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'id',
            name: 'ID',
            value: '0'
        }, {
            xtype: 'textfield',
            fieldLabel: '违停抓拍名称',
            name: 'Name',
            emptyText: '请输入违停抓拍名称',
            allowBlank: false
        }, {
            xtype: 'combobox',
            fieldLabel: '违停抓拍类型',
            width: 'auto',
            id: typeid,
            name: 'Type',
            hiddenName: 'Type',
            store: markTypeItems,
            queryMode: 'local',
            displayField: 'd',
            valueField: 'v',
            emptyText: '',
            forceSelection: false,
            blankText: '',
            triggerAction: 'all',
            selectOnFocus: true,
            value: 1,
            listeners: {
                change: {
                    fn: function (obj, value, eOpts) {
                        switch (value) {
                            case 1:
                                form.getComponent(cid).hide();
                                form.getComponent(tid).show();
                                break;
                            case 2:
                            case 3:
                                form.getComponent(tid).hide();
                                form.getComponent(cid).show();
                                break;
                            default: break;
                        }
                    }
                }
            }
            //,
            //readOnly:true
        }, {
            xtype: 'colorfield',
            fieldLabel: '分辨颜色',
            blankText: '',
            name: 'Color',
            id: cid,
            allowBlank: true
        }, {
            xtype: 'filefield',
            fieldLabel: '选择图标',
            id: tid,
            name: 'IconCls',
            blankText: '',
            buttonText: '浏览...',
            buttonConfig: {
                iconCls: 'bzoomin'
            },
            textAlign: 'center'
        }, {
            xtype: 'textfield',
            fieldLabel: '排序',
            name: 'Sort',
            emptyText: '',
            value:'0',
            allowBlank: false
        }, {
            xtype: 'htmleditor',
            fieldLabel: '备注',
            name: 'Remark',
            width: 'auto',
            height: 120,
            allowBlank: true
        });

        if (defaults.multiple) {
            form.getComponent(tid).hide();
        } else {
            form.getComponent(cid).hide();
        }

        //修改信息，禁止选择类型
        if (defaults.isUpdate) {
            form.getComponent(typeid).setReadOnly(true);
        }

        if (defaults.data) {
            form.loadRecord(defaults.data);
        }

        if (defaults.type) {
            form.getComponent(id).setValue(defaults.type);
        }

        var win = ExtHelper.CreateWindow({ title: defaults.title, width: 580, height: 325 });
        win.add(form);
    };

    function addFn(options) {
        var defaults = { multiple: false, type: undefined, title: '添加违停抓拍类型', req: 'tadd' };
        Ext.apply(defaults, options);
        $.form(defaults);
    }

    function updFn(options) {
        var r = options.grid.getSelectionModel().getSelection();
        if (r.length == 0) {
            Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            return;
        }
        if (r.length > 1) {
            Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            return;
        }
        $.form({ title: '修改违停抓拍类型', req: 'tup', data: r[0], multiple: r[0].raw.Type > 1, isUpdate: true });
    }

    function delFn(options) {
        var r = options.grid.getSelectionModel().getSelection();
        if (r.length == 0) {
            Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            return;
        }

        errorState.confirmYes("确定删除这" + r.length + "条记录吗?", function () {
            var ids = [];
            Ext.Array.each(r, function (record) {
                var id = record.get('ID');
                if (id) {
                    ids.push(id);
                }
            });
            Ext.Ajax.request({
                url: url + 'tdel',
                method: "POST",
                params: { ids: ids.join(',') }, //发送的参数  
                success: function (response, option) {
                    response = Ext.JSON.decode(response.responseText);
                    if (response.success == true) {
                        if (response.result && response.result > 0) {
                            $.grid.store.load();
                            capture.form.store.load();
                            capture.grid.store.load();
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
        var f = this.up('form');
        var w = f.up('window');
        var form = f.getForm();
        if (form.isValid()) {
            form.submit({
                success: function (form, action) {
                    if (action.result.success) {
                        if (!f) {
                            Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                        }
                    } else {
                        if (!f) {
                            Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                        }
                    }
                    w.close();
                    $.grid.store.load();
                    capture.grid.store.load();
                    capture.form.store.load();
                },
                failure: function (form, action) {
                    Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                }
            });
        }
    }

})(captureCategory);

var captureManager = captureManager || {};
(function ($) {

    $.fn = $.constructor.prototype;
    $.tab = ExtHelper.CreateTabPanelFn();

    $.window = function () {
        this.tab.add({
            component: capture.grid.grid,
            title: '违停抓拍区域（点）管理',
            closable: false,
            callback: function () { }
        }).add({
            component: captureCategory.grid.grid,
            title: '违停抓拍类型管理',
            closable: false,
            callback: function () { }
        });

        this.tab.tab.setActiveTab(0);
        var w = capture.window();
        w.add(this.tab.tab);
        return w;
    };
    

})(captureManager);