/// <reference path="../Resources/js/extjs4.2/ext-all.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/MapHelper.js" />

//标注管理
var markinfo = markinfo || {};
(function ($) {
    //私有全局变量
    var url = 'Mark/MarkHelp.ashx?req=';
    var iconpath = "../Resources/images/mark/";
    var title = '标注管理';
    var showsupperwindow = true;
    var supperwindow = null;

    //公有变量


    //原型
    $.fn = $.constructor.prototype;

    $.url = url;

    $.getTitle = function () {
        return title;
    };

    //模型
    $.model = { type: 'com.tigerhz.pgis.model.mark' };
    $.model.model = function () {
        var m = Ext.define($.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'Coordinates' },
                { name: 'X' },
                { name: 'Y' },
                { name: 'Color' },
                { name: 'IconCls' },
                { name: 'MarkTypeID' },
                { name: 'Description' },
                { name: 'MarkTypeID' },
                { name: 'MarkType' }
            ]
        });
        return m;
    }();
    //标注类型
    $.model.Category = { type: 'com.tigerhz.pgis.model.marktype' };
    $.model.Category.model = function () {
        var m = Ext.define($.model.Category.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'IconCls' },
                { name: 'Color' },
                { name: 'Type' },
                { name: 'Remark' }
            ]
        });
        return m;
    }();

    //列表
    $.grid = {};
    $.grid.store = { id: 'com_tigerhz_pgis_store_mark_grid' };
    $.grid.store.store = function () {
        var s = ExtHelper.CreateStore({
            storeId: $.grid.store.id,
            url: url + '1',
            model: $.model.type,
            total: true
        });
        return s;
    }();

    $.grid.store.Category = { id: String.Format("store_{0}", new Date().getTime()) };
    $.grid.store.Category.store = function () {
        var s = new Ext.data.Store({
            storeId: $.grid.store.Category.id,
            model: $.model.Category.type,
            proxy: {
                type: 'ajax',
                url: url + '3',
                simpleSortMode: true
            }
        });
        s.load();
        return s;
    }();

    $.grid.columns = function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            {
                dataIndex: 'Name', text: '名称', width:90, sortable: false
            },
            { dataIndex: 'Coordinates', text: '座标组', flex: 1, sortable: false, hidden:true },
            {
                dataIndex: 'X', text: '中心座标', width: 90, sortable: false, renderer: function (value, obj, record) {
                    return '{' + record.data.X + ', ' + record.data.Y + '}';
                }
            },
            {
                dataIndex: 'Color', text: '颜色', width: 40, sortable: false, renderer: function (val, record) {
                    if (val) {
                        return '<DIV style="width:13px;height:13px;background-color:#' + val + ';"  title="标注颜色"></DIV>';
                    }

                    if (record.record.raw.MarkType.Color) {
                        return '<DIV style="width:13px;height:13px;background-color:#' + record.record.raw.MarkType.Color + ';"  title="标注颜色"></DIV>';
                    }
                    
                    return '';
                }
            },
            {
                dataIndex: 'IconCls', text: '图标', width: 40, sortable: false, renderer: function (val, record) {
                    if (val) {
                        return "<img style='width:16px;height:16px;' src='" + iconpath + val + "'  title='标注图标'></img>";
                    }
                    if (record.record.raw.MarkType.IconCls) {
                        return "<img style='width:16px;height:16px;' src='" + iconpath + record.record.raw.MarkType.IconCls + "'  title='标注图标'></img>";
                    }
                    return '';
                }
            },
            {
                dataIndex: 'MarkType', text: '类型', flex: 1, renderer: function (val) {
                    return val.Name;
                }
            },
            { dataIndex: 'Description', text: '标注描述信息', flex: 3, sortable: false }
        ];
        return c;
    }();
    $.grid.toolbar = {};
    $.grid.toolbar.menus = {};
    $.grid.toolbar.menus.add = { id: String.Format('grid_toolbar_menu_add_{0}', new Date().getTime()) };
    $.grid.toolbar.menus.add.clickback = menuItemClickCallback;
    $.grid.grid = function () {
        var g = ExtHelper.CreateGrid({
            store: $.grid.store.store,
            columns: $.grid.columns,
            pager: true,
            toolbar: {
                enable: true, del: delFn, add:addFnEx
                //items: [{
                //    text: '添加标注',
                //    id:$.grid.toolbar.menus.add.id,
                //    iconCls: 'badd',
                //    menu: Ext.create('Ext.menu.Menu', {
                //        style: 'text-align:left;',
                //        items: []
                //    })
                //}], insert: true
            }
        });
        return g;
    }();
    $.form = function (options) {
        var defaults = {
            title: '标注信息编辑', req: 'add', width: 580, height: 325, data: null, singlecoords: true, coords: undefined, typeid:undefined, nameid:undefined
        };
        options = options || {};
        Ext.apply(defaults, options);

        supperwindow = markManager.window;
        supperwindow.hide();

        var form = ExtHelper.CreateForm({ url: url + defaults.req, callback: submitFn });
        var colorid = String.Format("color_{0}", new Date().getTime());
        var typeid = String.Format("type_{0}", new Date().getTime());
        var iconid = String.Format("icon_{0}", new Date().getTime());
        var nameid = String.Format("nameid_{0}", new Date().getTime());
        var coordid = 'markCoordinates';

        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'id',
            name: 'ID',
            value: '0'
        }, {
            xtype: 'textfield',
            fieldLabel: '名称',
            name: 'Name',
            id:nameid,
            allowBlank: false
        }, {
            xtype: 'combobox',
            id: typeid,
            fieldLabel: '标注类型',
            name: 'MarkTypeID',
            hiddenName: 'MarkTypeID',
            store: $.grid.store.Category.store,
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
                        var data = obj.valueModels[0].raw;
                        switch (data.Type) {
                            case 1:
                                form.getComponent(colorid).hide();
                                form.getComponent(iconid).show();
                                break;
                            case 2:
                            case 3:
                                form.getComponent(iconid).hide();
                                form.getComponent(colorid).show();
                                break;
                            default:
                                form.getComponent(colorid).hide();
                                form.getComponent(iconid).hide();
                                break;
                        }
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
                        var cbxtype = form.getComponent(typeid);
                        defaults.typeid = cbxtype.value;
                        if (!defaults.typeid) {
                            errorState.show('请选择标注类型!!!');
                            return;
                        }
                        var data = cbxtype.valueModels[0].raw;
                        defaults.singlecoords = data.Type == 1;
                        defaults.nameid = form.getComponent(nameid).getValue();
                        showsupperwindow = false;
                        w.close();
                        if (defaults.singlecoords) {
                            EMap.GetSingleCoords({
                                callback: function (coords) {
                                    defaults.coords = coords;
                                    $.form(defaults);
                                    showsupperwindow = true;
                                }
                            });
                        } else {
                            EMap.GetCoords({
                                coorded: function (coords) {
                                    defaults.coords = coords;
                                    $.form(defaults);
                                    showsupperwindow = true;
                                }
                            });
                        }
                    }
                }
            }
        }, {
            xtype: 'filefield',
            fieldLabel: '选择图标',
            id: iconid,
            name: 'IconCls',
            blankText: '',
            buttonText: '浏览...',
            buttonConfig: {
                iconCls: 'bzoomin'
            },
            textAlign: 'center'
        }, {
            xtype: 'colorfield',
            id:colorid,
            fieldLabel: '分辨颜色',
            name: 'Color'
        }, {
            xtype: 'htmleditor',
            fieldLabel: '描述信息',
            name: 'Description',
            width: 550,
            height: 140
        });

        if (defaults.singlecoords) {
            form.getComponent(colorid).hide();
        } else {
            form.getComponent(iconid).hide();
        }

        if (defaults.typeid) {
            form.getComponent(typeid).setValue(defaults.typeid);
        }

        if (defaults.nameid) {
            form.getComponent(nameid).setValue(defaults.nameid);
        }

        if (defaults.data) {
            form.loadRecord(defaults.data);
        }

        //在添加标注的时候
        if (defaults.coords) {
            form.getComponent(coordid).setValue(defaults.coords);
        }

        var w = ExtHelper.CreateWindow({ title: defaults.title, width: defaults.width, height: defaults.height });
        w.center().add(form);
        //此处需要侦听窗口的关闭事件
        w.on('close', function () {
            if (showsupperwindow) {
                supperwindow.show();
            }
        });
        

        return form;
    };

    /***********************************************
     *  私有方法
     ***********************************************
    */

    //打开新增表单
    function addFn(options) {
        var defaults = { ID: undefined, Name: undefined, IconCls: undefined, Color: undefined, Type: undefined, Remark: undefined, window: undefined };
        Ext.apply(defaults, options);

        //操作父窗口
        supperwindow = defaults.window;
        supperwindow.hide();

        var opts = { title: '添加标注', req: 'add', singlecoords: true, typeid: defaults.ID,coords:'' };
        Ext.apply(opts, options);
        //分类获取坐标点
        switch (defaults.Type) {
            case 1:
                EMap.GetSingleCoords({
                    callback: function (coords) {
                        opts.coords = coords;
                        $.form(opts);
                    }
                });
                break;
            case 2:
            case 3:
                EMap.GetCoords({
                    coorded: function (coords) {
                        opts.coords = coords;
                        opts.singlecoords = false;
                        $.form(opts);
                    }
                });
                break;
            default: break;
        }
    }

    function addFnEx(grid) {
        //debugger;
        $.form({ title: '添加标注', req: 'add', coords: '' });
    }
    //移除标注
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
                url: url + 'del',
                method: "POST",
                params: { ids: ids.join(',') }, //发送的参数  
                success: function (response, option) {
                    response = Ext.JSON.decode(response.responseText);
                    if (response.success == true) {
                        if (response.result && response.result > 0) {
                            $.grid.store.store.load();
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
    //打开更新表单
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
        $.form.form({ title: '修改标注', req: 'up', data: r[0] });
    }
    //表单提交
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
                    $.grid.store.store.load();
                },
                failure: function (form, action) {
                    Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                }
            });
        }
    }
    //分类增加标注按钮回掉函数
    function menuItemClickCallback(options) {
        addFn(options);
    }

})(markinfo);

/*标注类型管理*/
var markTypeManager = markTypeManager || {};
(function ($) {
    //路由地址
    var url = markinfo.url;
    var iconpath = "../Resources/images/mark/";

    //原型
    $.fn = $.constructor.prototype;

    $.model = { type: 'com.tigerhz.pgis.model.marktype' };
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
    //表格
    $.grid = {};
    $.grid.store = { id: 'com_tigerhz_pgis_marktype_grid_store' };
    $.grid.store.store = ExtHelper.CreateStore({ storeId: $.grid.store.id, url: url + '3', model: $.model.type, total: false });
    $.grid.column = function () {
        var c = [
                { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
                { dataIndex: 'ID', text: '类型编码', flex: 1, sortable: false, hidden: true },
                { dataIndex: 'Name', text: '类型名称', flex: 2, sortable: false },
                {
                    dataIndex: 'IconCls', text: '标注图标', flex: 1, sortable: false, renderer: function (val) {
                        //debugger;
                        if (val) {
                            return "<img style='width:16px;height:16px;' src='" + iconpath + val + "'  title='标注图标'></img>";
                        }
                    }
                },
                {
                    dataIndex: 'Color', text: '标注颜色', flex: 1, sortable: false, renderer: function (val) {
                        return '<DIV style="width:16px;height:16px;background-color:#' + val + ';"  title="标注颜色"></DIV>';
                    }
                },
                {
                    dataIndex: 'Type', text: '标注类型', width:55, sortable: false, renderer: function (val) {
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
                { dataIndex: 'Remark', text: '描述信息', flex: 4, sortable: false }
        ];
        return c;
    }();
    $.grid.grid = function () {
        var g = ExtHelper.CreateGrid({
            store: $.grid.store.store,
            columns: $.grid.column,
            pager: false,
            toolbar: {
                enable: true, del: delFn, update: updFn, add:addFn
                //items: [{
                //    text: '添加标注类型',
                //    iconCls: 'badd',
                //    menu: Ext.create('Ext.menu.Menu', {
                //        style: 'text-align:left;',
                //        items: [{
                //            text: '标注单点',
                //            handler: function () {
                //                addFn({ multiple: false, type:1 });
                //            }
                //        }, {
                //            text: '标注线条',
                //            handler: function () {
                //                addFn({ multiple: true, type: 2 });
                //            }
                //        }, {
                //            text: '标注区域',
                //            handler: function () {
                //                addFn({ multiple: true, type: 3 });
                //            }
                //        }]
                //    })
                //}],
                //insert:true
            }
        });
        return g;
    }();
    //表单
    $.form = {};
    $.form.form = function (options) {
        var defaults = { req: 'tadd', data: null, title: '编辑标注类型表单', multiple: false, type: undefined, isUpdate:false/*是否修改表单标识*/ };
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
            fieldLabel: '标注名称',
            name: 'Name',
            emptyText: '请输入标注名称',
            allowBlank: false
        }, {
            xtype: 'combobox',
            fieldLabel: '标注类型',
            width: 550,
            id:typeid,
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
            allowBlank: false,
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
            id:cid,
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
            textAlign: 'center',
            allowBlank: true
        }, {
            xtype: 'textfield',
            fieldLabel: '排序',
            name: 'Sort',
            emptyText: '',
            value:'0',
            allowBlank: true
        }, {
            xtype: 'htmleditor',
            fieldLabel: '备注',
            name: 'Remark',
            width: 550,
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

        var win = ExtHelper.CreateWindow({ title: defaults.title, width:580, height:325 });
        win.add(form);

        return form;
    };

    //添加
    function addFn(options) {
        var defaults = { multiple: false, type: undefined, title: '添加标注类型', req: 'tadd' };
        Ext.apply(defaults, options);
        $.form.form(defaults);
    }
    //移除
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
                            $.grid.store.store.load();
                            markinfo.grid.store.store.load();
                            markinfo.grid.store.Category.store.load();
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
    //修改
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
        $.form.form({ title: '修改标注类型', req: 'tup', data: r[0], multiple: r[0].raw.Type > 1, isUpdate:true});
    }
    //表单提交函数
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
                    $.grid.store.store.load();
                    markinfo.grid.store.store.load();
                    markinfo.grid.store.Category.store.load();
                },
                failure: function (form, action) {
                    Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                }
            });
        }
    }
})(markTypeManager);

//标注信息管理
var markManager = markManager || {};
(function ($) {
    //debugger;
    /*原型*/
    $.fn = $.constructor.prototype;
    $.tab = ExtHelper.CreateTabPanelFn();

    //侦听标注类型发生变化（增加/修改）时，数据加载完成事件，并触发自定义回调方法
    //markTypeManager.grid.store.store.on("load", marktypeLoadedCallback);

    $.tab.add({
        component: markinfo.grid.grid,
        title: '标注管理',
        closable: false,
        callback: function () { }
    }).add({
        component: markTypeManager.grid.grid,
        title: '标注类型管理',
        closable: false,
        callback: function () { }
    });
    $.tab.tab.setActiveTab(0);
    $.window = ExtHelper.CreateWindow({ title: '标注信息管理', layout: 'fit' });
    $.window.add($.tab.tab);
    
    //全局函数
    //标注类型从新加载完成，总是回调此方法
    function marktypeLoadedCallback(s, d) {

        var cps = [];
        for (var i = 0; i < d.length; i++)
        {
            var o = markMenuItemInstance(d[i].getData());
            cps.push(o);
        }

        var m = Ext.getCmp(markinfo.grid.toolbar.menus.add.id).menu;
        m.removeAll();
        m.add(cps);
    }
    //标注分类添加按钮对象
    function markMenuItemInstance(options) {
        var defaults = { ID: undefined, Name: undefined, IconCls: undefined, Color: undefined, Type: undefined, Remark: undefined };
        Ext.apply(defaults, options);
        defaults.window = $.window;

        var o = {
            text: "标注 " + defaults.Name,
            enableToggle: true,
            handler: function () {
                markinfo.grid.toolbar.menus.add.clickback(defaults);
            }
        };
        return o;
    }
})(markManager);