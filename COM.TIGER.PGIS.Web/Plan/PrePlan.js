/// <reference path="Utils.js" />
/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="common.js" />
/// <reference path="Config.js" />
/// <reference path="MapHelper.js" />
/// <reference path="mapGDI.js" />
/// <reference path="../Resources/js/Config.js" />

var PPM /*alias at preplanManager*/, preplanManager;
PPM = preplanManager = (function () {
    //debugger;
    //用于保存全局变量信息，减少内存碎片化
    var args = {};
    //名称空间
    args.namespace = 'Com.tigerhz.pgis';
    //预案数据处理模块地址
    args.url = 'Plan/PlanHelp.ashx?req=';
    //标注数据处理模块
    args.tagUrl = args.url + 'tag&treq=';
    //文档数据处理模块
    args.docUrl = args.url + 'doc&dreq=';
    //数据模型
    args.Model = {};
    //数据模型名称空间
    args.Model.namespace = args.namespace + '.model.ppm';
    //基础数据模型
    args.Model.Base = args.Model.namespace + '.Base';
    args.Model.defineBase = function () {
        var me = this;
        Ext.define(me.Base, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' }
            ]
        });
    };
    args.Model.defineBase();
    //预案标注数据模型
    args.Model.Tag = args.Model.namespace + '.Tag';
    args.Model.defineTag = function () {
        var me = this;
        Ext.define(me.Tag, {
            extend: me.Base,
            fields: [
                { name: 'Coordinates' },
                { name: 'X' },
                { name: 'Y' },
                { name: 'Color' },
                { name: 'IconCls' },
                { name: 'Type' },
                { name: 'Description' }
            ]
        });
    };
    args.Model.defineTag();
    //预案文档数据标注模型
    args.Model.Doc = args.Model.namespace + '.Doc';
    args.Model.defineDoc = function () {
        var me = this;
        Ext.define(me.Doc, {
            extend: me.Base,
            fields: [
                { name: 'Alias' },
                { name: 'Suffix' },
                { name: 'Path' }
            ]
        });
    };
    args.Model.defineDoc();
    //预案数据模型
    args.Model.Plan = args.Model.namespace + '.Plan';
    args.Model.definePlan = function () {
        var me = this;
        Ext.define(me.Plan, {
            extend: me.Base,
            fields: [
                { name: 'Description' },
                { name: 'UpFiles' }
            ]
        });
    };
    args.Model.definePlan();
    //表格列数据
    args.columns = {};
    //预案表格列数据
    args.columns.Plan = (function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Name', text: '预案名称', flex: 2 },
            { dataIndex: 'Description', text: '预案描述', flex: 4, sortable: false },
            {
                text: '文档', xtype: 'actioncolumn', width: 40, textAlign: 'center', lock: true,
                items: [{
                    iconCls: 'bdoc pagis-icon-btn',
                    tooltip: '查看文档',
                    handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                        args.grid.doc.Panel(record.data);
                    }
                }], sortable: false
            }
        ];
        return c;
    })();
    //标注表格列数据
    args.columns.Tag = (function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Name', text: '预案名称', flex: 1 },
            { dataIndex: 'Coordinates', text: '坐标组', flex: 2, sortable: false },
            {
                dataIndex: 'X', text: '中心原点坐标', width: 80, sortable: false, renderer: function (value, obj, record) {
                    return record.data.X + ', ' + record.data.Y;
                }
            },
            {
                dataIndex: 'Color', text: '标注颜色', width: 60, sortable: false, renderer: function (val) {
                    return '<DIV id="imgtb" style="width:13px;height:13px;background-color:#' + val + ';"  title="标注颜色"></DIV>';
                }
            },
            {
                dataIndex: 'Type', text: '标注类型', widthL: 60, sortable: false, renderer: function (val) {
                    var html = '';
                    switch (val) {
                        case 1:
                            html = '标签';
                            break;
                        case 2:
                            html = '线条';
                            break;
                        case 3:
                            html = '区域';
                            break;
                        default:
                            break;
                    }
                    return html;
                }
            },
            { dataIndex: 'Description', text: '描述信息', flex: 2, sortable: false }
        ];
        return c;
    })();
    //文档列数据
    args.columns.Doc = (function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Alias', text: '文档名称' }
        ];
        return c;
    })();
    //数据仓储
    args.store = {};
    //数据仓储名称空间
    args.store.namespace = 'Com_tigerhz_pgis_Store_';
    //其他数据仓储，以数组形式保存，采用keyvaluepair形式，key值为args.store.namespace+Component的ID值，value为Ext.data.Store对象的实例
    //  eg:args.store.Stores[args.store.namespace+'componentid'] = Ext.create('Ext.data.Store', options);
    args.store.Stores = [];
    args.store.getStore = function (options) {
        ///<summary>
        /// 获取指定ID的数据仓储
        ///</summary>
        ///<param name="options" type="Object">
        /// 数据仓储的设定值
        ///<para>id:String 数据仓储的ID值，一般为Component的ID值</para>
        ///<para>url:String 数据请求地址</para>
        ///<para>model:String 数据模型名称</para>
        ///<para>total:Boolean 分页标识，设为TRUE，标识需要分页。默认值为FALSE</para>
        ///</param>
        ///<returns>Ext.data.Store的新实例</returns>
        
        var me = this;
        //默认设定
        var defaults = { id: (new Date()).getTime(), url: null, model: null, total: false };
        //将自定义的值覆盖默认值
        Ext.apply(defaults, options);
        //加上名称空间，防止重复命名
        defaults.id = me.namespace + defaults.id;
        //查询当前ID的数据仓储对象，并返回
        //如果当前ID的数据仓储对象已存在，那么直接返回。否者，创建新的实例并返回。
        defaults.storeId = defaults.id;
        return me.Stores[defaults.id] = me.Stores[defaults.id] || ExtHelper.CreateStore(defaults);
    };
    //预案数据仓储
    args.store.Plan = (function () {
        var me = args;
        var s = args.store.getStore({
            model: me.Model.Plan,
            url: me.url + 'pg_al',
            total: true
        });
        return s;
    })();
    //窗体TabPanel
    args.tabpanel = {};
    args.tabpanel.namespace = 'Com_tigerhz_pgis_tabpanel_';
    args.tabpanel.Panel = (function () {
        var me = args.tabpanel;
        var id = me.namespace + 'ppm';
        var o = Ext.create('Ext.tab.Panel', {
            border: false,
            activeTab: 0,
            itemId: id,
            plugins: [{
                ptype: 'tabscrollermenu',
                maxText: 15,
                pageSize: 5
            }],
            items: [],
            listeners: {}
        });
        return o;
    })();
    args.tabpanel.Add = function (options) {
        ///<summary>
        /// 添加新的Tab，并激活新增的Tab
        ///</summary>
        ///<param name="options" type="Object">
        /// 添加新的tab
        ///<para>component:Object Ext.component.Component的新实例</para>
        ///<para>title:String 新增Tab标题</para>
        ///<para>closable:Boolean 关闭按钮显示/隐藏标识，设置为True，标识显示。默认设置为True</para>
        ///<para>listeners:Object 新增Tab的侦听事件处理函数</para>
        ///<para>callback:Function 添加完成回调函数，无论是否完成，都将触发此事件</para>
        ///</param>

        var me = this;
        var defaults = { component: {}, title: 'Tab_' + me.Panel.items.length, closable: true, listeners: {}, callback:null };
        //自定义设置
        Ext.apply(defaults, options);
        me.Panel.add({
            title: defaults.title,
            border: false,
            layout: 'fit',
            closable: defaults.closable,
            items: [defaults.component],
            listeners: defaults.listeners
        }).show();
        me.Panel.setActiveTab(me.Panel.items.length - 1);
        if (defaults.callback && defaults.callback instanceof Function) {
            defaults.callback();
        }
    };
    //主窗体
    //主窗体窗体中有且仅有一个TabPanel
    args.window = {};
    args.window.namespace = 'Com_tigerhz_pgis_window_';
    args.window.defaults = { id: args.window.namespace + 'ppm', width: 600, height: 400,layout:'fit', title: '方案预案数据管理', listeners: {} };
    args.window.Window = (function () {
        var me = args;
        var options = Ext.apply({}, me.window.defaults, {
            listeners: {
                close: {
                    fn: function () {
                        //to do something
                        //or dispose resource
                    }
                }
            }
        });
        var w = ExtHelper.CreateWindow(options);
        w.add(me.tabpanel.Panel);
        return w;
    })();
    //文件上传组件
    args.fileup = {};
    args.fileup.namespace = 'Com_tigerhz_pgis_fileup_';
    //定义文件上传模型
    args.fileup.model = args.Model.namespace+'.fileup';
    args.fileup.defineModel = function () {
        ///<summary>
        /// 定义上传文件模型
        ///</summary>

        var me = this;
        var supper = args;
        Ext.define(me.model, {
            extend: supper.Model.Base,
            fields: [
                { name: 'Size' },
                { name: 'Suffix' }
            ]
        });
    };
    args.fileup.defineModel();
    //上传文件表格
    args.fileup.grid = {};
    //上传文件表格列设置
    args.fileup.grid.columns = (function () {
        var l = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Name', text: '文档名称', flex:6, sortable: false },
            { dataIndex: 'Size', text: '文档大小（字节）', flex:2, sortable: false },
            { dataIndex: 'Suffix', text: '文档类型', flex:1, sortable: false }
        ];
        return l;
    })();
    //上传文件表格数据仓储
    args.fileup.grid.store = (function () {
        var me = args.fileup;
        var supper = args;
        var store = Ext.create('Ext.data.SimpleStore', {
            model: supper.fileup.model,
            data: []
        });
        return store;
    })();
    //绘制上传文件表格
    args.fileup.grid.Panel = function (callback) {
        ///<summary>
        /// 绘制上传文件表格
        ///</summary>
        ///<param name="callback" type="Function">按钮被单击时，触发此类事件</param>
        ///<returns></returns>

        var me = args.fileup;
        var supper = args;

        //计数器，添加一次文件，计数器加1
        var tikit = 0;
        var grid = ExtHelper.CreateGrid({
            store: me.grid.store,
            columns: me.grid.columns,
            width: 576,
            height: 100,
            toolbar: {
                enable: true,
                items: ['<strong>上传文件管理</strong>', '-', '->',
                    {
                        xtype:'button',
                        text: '添加文件',
                        iconCls: 'badd',
                        name: 'UpFiles',
                        id: me.namespace + 'filebtn',
                        listeners: {
                            click: {
                                fn: function () {
                                    //添加一次文件，计数器加1
                                    tikit++;

                                    if (callback && callback instanceof Function) {
                                        var eOpts = eOpts || {};
                                        Ext.apply(eOpts, { name: 'UpFiles', tikit: tikit });
                                        callback(this, eOpts);
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        });
        return grid;
    };
    //上传文件窗体
    args.fileup.form = {};
    args.fileup.form.File = function (options) {
        var me = this;
        var supper = args;

        var defaults = { window: null };
        Ext.apply(defaults, options);
        var file = Ext.create('Ext.form.field.File', {
            buttonText: '浏览...',
            buttonConfig:{
                iconCls: 'bzoomin'
            },
            width:supper.window.defaults.width - 90,
            listeners: {
                change: {
                    fn: function (obj, value, eOpts) {
                        var form = obj.up('form');
                        if (value) {
                            var file = me.File();
                            form.add(file);
                        } else {
                            obj.hide();
                        }
                    }
                }
            }
        });
        return file;
    };
    //文件上传窗体正文
    args.fileup.form.Panel = function (options) {
        var me = this;
        var supper = args;
        var callback = options.callback || null;
        var defaults = {
            req: 'upfile', buttonstext: '上传...', submit: supper.grid.submit({
                callback: function (args, form, action) {
                    if (callback && callback instanceof Function) {
                        callback(args, form, action);
                    }
                }
            })
        };
        Ext.apply(defaults, options);
        var form = ExtHelper.CreateForm({
            url: supper.docUrl + defaults.req,
            buttonstext:defaults.buttonstext,
            callback: defaults.submit
        });
        var win = ExtHelper.CreateWindow(Ext.apply({}, { id: supper.window.namespace + 'fileup', title: '文件上传' }, supper.window.defaults));
        var file = me.File({ window: win });
        form.add(file);
        win.add(form);
        return win;
    };
    //数据表格
    args.grid = {};
    args.grid.namespace = 'Com_tigerhz_pgis_grid_';
    //公共提交方法
    args.grid.submit = function (options) {
        ///<summary>
        /// 公共提交方法
        ///</summary>
        ///<param name="options" type="Object">
        /// 自定义设定参数
        ///<para>args:Object 回调方法实参</para>
        ///<para>callback:Function 执行成功回调方法</para>
        ///</param>
        ///<returns>Function</returns>
        
        var defaults = { args: null, callback: null };
        Ext.apply(defaults, options);
        var me = this;
        var res = function () {
            var form = this.up('form');
            var tab = form.up('tabpanel');
            form = form.getForm();
            if (form.isValid()) {
                form.submit({
                    waitMsg:'正在提交数据，请等待...',
                    success: function (form, action) {
                        var def = { form: null, response: null, result: { msg: '', result: 0, success: false } };
                        Ext.apply(def, action);
                        if (def.result.success) {
                            //提示
                            errorState.show(errorState.SubmitSuccess);
                            //回调
                            if (defaults.callback && defaults.callback instanceof Function)
                                defaults.callback(defaults.args, form, action);
                        } else {
                            errorState.show(errorState.SubmitFail);
                        }
                    },
                    failure: function (form, action) {
                        errorState.show(errorState.SubmitFail);
                    }
                });
            }
        };
        return res;
    };
    //公共移除方法
    args.grid.del = function (options) {
        ///<summary>
        /// 公共移除方法
        ///</summary>
        ///<param name="options" type="Object">
        /// 自定义设定参数
        ///<para>url:String 请求地址</para>
        ///<para>params:Object 请求执行参数</para>
        ///<para>args:Object 回调方法实参</para>
        ///<para>callback:Function 执行成功，回调方法</para>
        ///</param>

        var me = this;
        var defaults = { url: null, params: {}, args: null, callback: null };
        Ext.apply(defaults, options);
        if (defaults.url && typeof defaults.url == 'string') {
            //移除数据模块
            errorState.confirmYes('确定删除选中的数据记录么？', function () {
                Ext.Ajax.request({
                    url: defaults.url,
                    params: defaults.params,
                    method: 'POST',
                    success: function (response, options) {
                        response = Ext.JSON.decode(response.responseText);
                        if (response.success) {
                            //回调
                            if (defaults.callback && defaults.callback instanceof Function) {
                                defaults.callback(defaults.args);
                            }
                            //提示
                            errorState.show(errorState.DeleteSuccess);
                        } else {
                            errorState.show(errorState.DeleteFail);
                        }
                    },
                    faulure: function (response, options) {
                        errorState.show(errorState.DeleteFail);
                    }
                });
            });
        }
    };
    //获取指定表格中选中的行数据
    args.grid.getSelectionItems = function (grid) {
        ///<summary>
        /// 获取选中的行数据
        ///</summary>
        ///<param name="grid" type="Ext.grid.Panel">表格组件</param>
        ///<returns>Array</returns>
        
        var me = args.grid;
        var items = [];
        if (grid) {
            var obj = grid.getSelectionModel();
            items = obj.getSelection();
        }
        return items;
    };
    //获取指定表格中选中的行数据，并获取首条数据，如果不存在，返回null
    args.grid.popSelectionItems = function (grid) {
        ///<summary>
        /// 获取指定表格中选中的行数据，并获取首条数据，如果不存在，返回null
        ///</summary>
        ///<param name="grid" type="Ext.grid.Panel">表格组件</param>
        ///<returns>Array</returns>

        var me = this;
        var items = me.getSelectionItems(grid);
        return items.length > 0 ? items[0] : null;
    };
    // 获取指定表格中选中的行数据，并获取选中行数据ID值
    args.grid.getSelectionItemIds = function (grid) {
        ///<summary>
        /// 获取指定表格中选中的行数据，并获取选中行数据ID值
        ///</summary>
        ///<param name="grid" type="Ext.grid.Panel">表格组件</param>
        ///<returns>Array</returns>

        var me = this;
        var items = me.getSelectionItems(grid);
        var ids = items.Each(function (record) {
            return record.get('ID');
        });
        return ids;
    };
    //预案表格
    args.grid.plan = {};
    args.grid.plan.namespace = args.grid.namespace + 'plan_';
    //重新加载预案数据记录
    args.grid.plan.Reload = function (callback, cargs) {
        ///<summary>
        /// 重新加载数据记录
        ///</summary>
        ///<param name="callback" type="Function">回调函数</param>
        ///<param name="cargs" type="Object">回调函数参数</param>
        ///<returns>Function</returns>

        var me = this;
        var supper = args;
        var parentTab = supper.tabpanel.Panel.getActiveTab();
        var res = function () {
            supper.store.Plan.load();
            var tab = supper.tabpanel.Panel.getActiveTab();
            supper.tabpanel.Panel.remove(tab);
            parentTab.show();
            if (callback && callback instanceof Function) {
                callback(cargs);
            }
        };
        return res;
    };
    //预案编辑表单s
    args.grid.plan.getEditForm = function (options) {
        ///<summary>
        /// 获取预案信息编辑表单
        ///</summary>
        ///<param name="options" type="Object">
        ///自定义设定参数
        ///<para>req:String 指定后台指定当前表单提交的模块，默认值为add，后台处理程序为添加纪录处理程序</para>
        ///<para>data:Object 表单数据 [可选]</para>
        ///<para>buttonstext:String 表单submit按钮提示正文 [可选]</para>
        ///<para>submit:Function 表单submit按钮点击方法 [可选]</para>
        ///<para>callback:Function 表单提交成功回调函数 [可选]</para>
        ///<para>cargs:Object 表单提交成功回调函数参数 [可选]</para>
        ///<para>hasfile:Boolean 表单是否需要上传文件，设置为True标识需要上传文件。默认为False [可选]</para>
        ///<para>completed:Function(form) 表单创建完成，回调方法。参数为当前的表单对象 [可选]</para>
        ///</param>
        ///<returns>Ext.form.Form</returns>

        var me = this;
        var supper = args;
        options = options || {};
        var defaults = {
            req: 'add', buttonstext: '提交', submit: supper.grid.submit({
                callback: me.Reload(options.callback, options.cargs)
            }), data: undefined, hasfile: false, completed: null
        };
        Ext.apply(defaults, options);
        var form = ExtHelper.CreateForm({
            url: supper.url + defaults.req,
            buttonstext: defaults.buttonstext,
            callback: defaults.submit,
            fileUp: defaults.hasfile
            //,frame:true
        });
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'id',
            name: 'ID',
            value: '0'
        }, {
            xtype: 'textfield',
            fieldLabel: '预案名称',
            name: 'Name',
            width: 550,
            allowBlank: false
        }, {
            xtype: 'htmleditor',
            fieldLabel: '描述信息',
            name: 'Description',
            width: 550,
            height: defaults.hasfile ? 170 : 270,
            allowBlank: false
        });
        if (defaults.data) {
            form.loadRecord(defaults.data);
        }
        if (defaults.completed && defaults.completed instanceof Function) {
            defaults.completed(form);
        }
        return form;
    };
    //添加新的预案数据
    args.grid.plan.Add = function (o) {
        ///<summary>
        /// 添加新的预案数据记录
        ///</summary>

        var me = this;
        var supper = args;
        supper.grid.plan.getEditForm({
            hasfile:true,
            completed: function (form) {
                supper.tabpanel.Add({
                    component: form,
                    title: '新增预案'
                });
                form.add(supper.fileup.grid.Panel(function (btn, eOpts) {
                    //添加新的
                    //debugger;
                    var defaults = { name: 'UpFiles', tikit: 0 };
                    Ext.apply(defaults, eOpts);

                    //创建上传文件窗体
                    var filewin = supper.fileup.form.Panel({
                        callback: function (args, f, action) {
                            filewin.close();
                            supper.fileup.grid.store.loadData(action.result.result);
                            
                            var files = form.getComponent(supper.grid.plan.namespace + 'upfilesItem');
                            if (files) {
                                //重置内容
                                files.setValue(Ext.encode(action.result.result));
                            } else {
                                //新增值
                                form.add({
                                    xtype: 'hiddenfield',
                                    fieldLabel: '',
                                    id: supper.grid.plan.namespace + 'upfilesItem',
                                    name: 'upfiles',
                                    value: Ext.encode(action.result.result)
                                });
                            }
                        }
                    });
                }));
                supper.fileup.grid.store.load();
            }
        });        
    };
    //更改预案数据
    args.grid.plan.Update = function (o) {
        ///<summary>
        /// 变更选中的预案数据记录
        ///</summary>
        
        var me = this;
        var supper = args;
        var data = supper.grid.popSelectionItems(o.grid);
        if (data) {
            var form = supper.grid.plan.getEditForm({ req: 'up', data: data });
            supper.tabpanel.Add({ component: form, title: '变更预案记录' });
        }
    };
    //移除指定的预案数据
    args.grid.plan.Del = function (o) {
        ///<summary>
        /// 移除选中的预案数据记录
        ///</summary>
        
        var me = this;
        var supper = args;
        var ids = supper.grid.getSelectionItemIds(o.grid);
        if (ids.length > 0) {
            supper.grid.del({
                url: supper.url + 'del',
                params: { ids: ids },
                callback: function () {
                    supper.store.Plan.load();
                }
            });
        }
    };
    //表格视图
    args.grid.plan.View = (function () {
        var me = args.grid.plan;
        var supper = args;
        var grid = ExtHelper.CreateGrid({
            store: supper.store.Plan,
            columns: supper.columns.Plan,
            pager: true,
            toolbar: {
                enable: true,
                add: me.Add,
                update: me.Update,
                del:me.Del,
                items: [{
                    xtype: 'button',
                    text: '预案标注',
                    iconCls: 'bpath',
                    handler: function (o) {
                        var data = supper.grid.popSelectionItems(o.grid);
                        if (data) {
                            //ID,Name,Description
                            //supper.grid.tag.Panel(data.data);
                            supper.grid.tag.form.treePanel(data.data);
                        }
                    }
                }]
            }
        });
        supper.tabpanel.Add({
            component: grid,
            title: '预案管理',
            closable: false
        });
        return grid;
    })();
    //预案文档信息
    args.grid.doc = {};
    args.grid.doc.namespace = args.grid.namespace + 'doc_';
    //预案文档处理程序
    args.grid.doc.Panel = function (options) {

        var me = this;
        var supper = args;
        var defaults = { ID: 0, title:'预案文档数据记录' };
        Ext.apply(defaults, options);
        var grid = ExtHelper.CreateGrid({
            store: supper.store.getStore({
                url: supper.docUrl + 'fl&id=' + defaults.ID,
                model: supper.Model.Doc
            }),
            columns: supper.columns.Doc,
            toolbar: {
                enable: true,
                items: [{
                    xtype: 'button',
                    text: '添加文件',
                    iconCls: 'badd',
                    handler: function (options) {
                        var win = supper.fileup.form.Panel({
                            callback: function (args, form, action) {
                                win.close();
                                Ext.Ajax.request({
                                    url: supper.docUrl + 'add',
                                    params: {
                                        id: defaults.ID,
                                        upfiles:Ext.encode(action.result.result)
                                    },
                                    success: function (response, opts) {
                                        //重新加载数据
                                        grid.store.load();
                                    },
                                    failure: function (response, opts) {
                                        errorState.show('完鸟，发生错误了');
                                    }
                                });
                            }
                        });
                    }
                }, {
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'bdel',
                    handler: function (options) {
                        //ids instanceof Array
                        //debugger;
                        var items = supper.grid.getSelectionItems(options.grid);
                        if (items.length > 0) {
                            errorState.confirmYes("是否删除选中的" + items.length + "项数据记录？", function () {
                                items = items.Each(function (t) {
                                    return t.data;
                                });
                                Ext.Ajax.request({
                                    url: supper.docUrl + 'del',
                                    params: {
                                        upfiles: Ext.encode(items)
                                    },
                                    success: function (response, eOpts) {
                                        options.grid.store.load();
                                    },
                                    failure: function (response, eOpts) {
                                        errorState.show('啊哦，系统出问题了！');
                                    }
                                });
                            });
                        }
                    }
                }, {
                    xtype: 'button',
                    text: '下载',
                    iconCls: 'bdown',
                    handler: function (options) {

                        var data = supper.grid.popSelectionItems(options.grid);
                        if (data) {
                            var params = getParams(data.data);
                            location.href = String.Format('{0}down{1}', supper.docUrl, params);
                        } else {
                            errorState.show(errorState.SelectRow);
                        }
                    }
                }]
            }
        });
        supper.tabpanel.Add({
            component: grid,
            title: defaults.title
        });
    };
    

    args.grid.tag = {};
    args.grid.tag.namespace = args.grid.namespace + 'tag_';
    //预案标注处理程序
    args.grid.tag.Panel = function (options) {
        var me = this;
        var supper = args;
        var defaults = { ID: 0, title: '预案标注数据记录' };
        Ext.apply(defaults, options);
        var grid = ExtHelper.CreateGrid({
            store: supper.store.getStore({
                url: supper.tagUrl + 'tg&id' + defaults.ID,
                model: supper.Model.Tag
            }),
            columns: supper.columns.Tag,
            toolbar: {
                enable: true,
                add: me.add,
                update: me.update,
                del:me.del
            }
        });
        supper.tabpanel.Add({
            component: grid,
            title:defaults.title
        });
    };
    args.grid.tag.add = function (options) {
        errorState.show('add');
    };
    args.grid.tag.update = function (options) {
        errorState.show('up');
    };
    args.grid.tag.del = function (options) {
        errorState.show('del');
    };
    //
    args.grid.tag.form = {};
    args.grid.tag.form.namespace = args.grid.tag.namespace + 'form_';
    args.grid.tag.form.treePanel = function (options) {
        var me = this;
        var supper = args;
        var defaults = { ID: 0, Name: '', title: '预案标注信息', itemclick: null };
        Ext.apply(defaults, options);

        var c = Ext.getCmp('extWest');
        var store = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url:supper.tagUrl+'all&id='+defaults.ID
            },
            loadMask: true,
            autoLoad: true,
            listeners: {
                beforeappend: {
                    fn: function (parent, node, eOpts) {
                        if (parent) {
                            var raw = node.raw;
                            var id = me.namespace + raw.ID;

                            //标识已经存在根节点，在此追加子节点
                            switch (raw.Type) {
                                case 1:
                                    //画点
                                    mapGDI.DrawDot(id, { x: raw.X, y: raw.Y }, { iconcls: raw.IconCls, text: raw.Name });

                                    EMap.AppendLabel({
                                        id: raw.ID, x: raw.X, y: raw.Y, title: raw.Name
                                    });
                                    break;
                                case 2:
                                    //画线
                                    mapGDI.DrawLine(id, { coords: raw.Coordinates, color: '#' + raw.Color }, { x: raw.X, y: raw.Y });
                                    var coords = raw.Coordinates.split(',');
                                    EMap.AppendLabel({
                                        id: raw.ID, x: new Number(coords[2]), y: new Number(coords[3]), title: raw.Name
                                    });
                                    break;
                                case 3:
                                    //画面
                                    mapGDI.DrawPloy(id, { coords: raw.Coordinates, fillcolor: '#' + raw.Color }, { x: raw.X, y: raw.Y });
                                    EMap.AppendLabel({
                                        id: raw.ID, x: raw.X, y: raw.Y, title: raw.Name
                                    });
                                    break;
                                default: break;
                            }
                        }
                    }
                }
            }
        });
        var tree = new Ext.tree.TreePanel({
            model: supper.Model.Tag,
            store: store,
            border: false,
            rootVisible: true,
            multiSelect: false,
            checkModel: 'cascade',
            requestMethod: 'post',
            animate: true,
            tbar: [{
                text: '添加标注',
                iconCls:'badd',
                menu: Ext.create('Ext.menu.Menu', {
                    style: 'text-align:left;',
                    items: [{
                        text: '预案点',
                        handler: function () {
                            me.getSingle({
                                type: 1,
                                planid: defaults.ID,
                                callback: function () {
                                    loadCustomDefCss();
                                    store.load();
                                }
                            });
                        }
                    }, {
                        text: '预案线',
                        handler: function () {
                            me.getMultiple({
                                type: 2,
                                planid: defaults.ID,
                                callback: function () {
                                    store.load();
                                }
                            });
                        }
                    }, {
                        text: '预案面',
                        handler: function () {
                            me.getMultiple({
                                type: 3,
                                planid: defaults.ID,
                                callback: function () {
                                    store.load();
                                }
                            });
                        }
                    }]
                })
            }, '-'],
            listeners: {
                itemclick: {
                    fn: function (view, record, item, index, e, eOpts) {
                        if (record.raw.X && record.raw.Y) {
                            mapGDI.MoveTo({ x: record.raw.X, y: record.raw.Y });
                        }
                        if (defaults.itemclick && defaults.itemclick instanceof Function) {
                            defaults.itemclick(view, record, item, index, e, eOpts);
                        }
                    }
                }
            },
            root: {
                text:defaults.Name
            }
        });
        var win = ExtHelper.CreateWindow({
            title: defaults.title,
            width: 0,
            height: 0,
            modal: false,
            draggable: false,
            listeners: {
                show: { fn: function () { supper.window.Window.hide(); } },
                close: {
                    fn: function () {
                        supper.window.Window.show();
                        mapGDI.ClearLayer();
                    }
                }
            }
        });
        win.add({
            layout: 'fit',
            border: false,
            items: [tree]
        });
        var xy = c.getXY();
        win.animate({
            to: {
                width: c.getWidth() + 5,
                height: c.getHeight(),
                x: xy[0],
                y: xy[1]
            }
        });
    };
    args.grid.tag.form.getSingle = function (options) {
        var me = this;
        mapGDI.GetCoordsEx({
            getcoording: function (arg, coords) {
                //强制停止获取坐标动作
                arg.StopCoords();
            },
            getcoorded: function (arg, coords) {
                options = options || {};
                options.coords = coords;
                me.editForm(options);
            }
        });
    };
    args.grid.tag.form.getMultiple = function (options) {
        var me = this;
        mapGDI.GetCoordsEx({
            getcoording: function (arg, coords) { },
            getcoorded: function (arg, coords) {
                options = options || {};
                options.coords = coords;
                me.editForm(options);
            }
        });
    };
    args.grid.tag.form.editForm = function (options) {
        var me = this;
        var supper = args;
        var defaults = { req: 'add', planid:0, coords: '', title: '添加预案标注信息', data: null, type/*标注类型*/: 1, callback/*提交成功函数回调*/: function () { } };
        Ext.apply(defaults, options);

        var form = ExtHelper.CreateForm({
            url: supper.tagUrl + defaults.req+'&id='+defaults.planid,
            callback: supper.grid.submit({
                args: form,
                callback: function () {
                    var win = form.up('window');
                    win.close();
                    if (defaults.callback && defaults.callback instanceof Function) {
                        defaults.callback();
                    }
                }
            })
        });
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'id',
            name: 'ID',
            value: '0'
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'type',
            name: 'Type',
            value: defaults.type
        }, {
            xtype: 'textfield',
            fieldLabel: '标注名称',
            name: 'Name',
            width: 550,
            allowBlank: false,
            emptyText:'请填写标注名称'
        }, {
            xtype: 'textfield',
            fieldLabel: '标注坐标',
            width: 550,
            id:'tagcoordinates',
            name: 'Coordinates',
            allowBlank: false,
            value:defaults.coords,
            listeners: {
                focus: {
                    fn: function () {
                        //关闭当前窗体
                        form.up('window').close();
                        options.data = form.getRecord();
                        //重新选择坐标点
                        switch (defaults.type) {
                            case 1:
                                me.getSingle(options);
                                break;
                            case 2:
                            case 3:
                                me.getMultiple(options);
                                break;
                            default: break;
                        }
                    }
                }
            }
        });
        switch (defaults.type) {
            case 1:
                //点
                form.add({
                    xtype: 'combobox',
                    id: 'MenuIconcls',
                    fieldLabel: '标注图标',
                    width: 550,
                    name: 'Iconcls',
                    hiddenName: 'Iconcls',
                    store: menusIconBind,
                    queryMode: 'local',
                    displayField: 'd',
                    valueField: 'v',
                    emptyText: '',
                    forceSelection: false,// 必须选择一个选项
                    blankText: '请选择',
                    triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
                    selectOnFocus: true
                });
                form.add({
                    xtype: 'filefield',
                    fieldLabel: '添加图标;',
                    id: Ext.id(),
                    name: 'IconCls',
                    blankText: '',
                    buttonText: '浏览...',
                    buttonConfig: {
                        iconCls: 'bzoomin'
                    },
                    textAlign: 'center'
                });
                break;
            case 2:
                //线
            case 3:
                //面
                form.add({
                    xtype: 'colorfield',
                    width: 550,
                    fieldLabel: '标注颜色',
                    emptyText: '请选择颜色',
                    name: 'Color',
                    allowBlank: false
                });
                break;
            default: break;
        }
        form.add({
            xtype: 'htmleditor',
            fieldLabel: '描述信息',
            name: 'Description',
            width: 550,
            height: 156,
            allowBlank: false
        });
        if (defaults.data) {
            form.loadRecord(defaults.data);
        }
        form.getComponent('tagcoordinates').setValue(defaults.coords);
        var win = ExtHelper.CreateWindow({
            title: defaults.title,
            width: 580,
            height: 350
        });
        win.add(form);
        return form;
    };

    return args;
})();