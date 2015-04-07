/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="common.js" />
/// <reference path="Config.js" />

var menuManager = (function () {
    //格式化显示标题
    var renderText = function (value, obj, record) {
        //debugger;
        return '<a href="#" onclick="menuManager.getEntities(' + record.data.Id + ')" >' + value + '</a>';
    };
    //格式化显示 启用/禁用 标识
    var renderDisabled = function (v) {
        switch (v) {
            case 0:
                return '<font color="red">禁用</font>';
            case 1:
                return '<font color="darkgreen">启用</font>';
            default:
                return '未知';
        }
    };
    //格式化显示排序
    var renderSort = function (v) {
        if (v <= 25) return "低";
        if (v <= 50) return "正常";
        if (v <= 75) return "中等";
        return "高";
    }

    var menuGrid = "menuGrid";
    var subMenuGrid = "subMenuGrid";

    var pid = 0;

    var o = {
        model: Ext.define("Menu", {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id' },
                { name: 'PId' },
                { name: 'Text' },
                { name: 'Code' },
                { name: 'Disabled' },
                //{ name: 'Checked' },
                { name: 'Iconcls' },
                { name: 'Handler' },
                { name: 'Description' },
                { name: 'Sort' },
                { name: 'ChildMenus' }
            ]
        }),
        window: function (title) {
            var w = 600;
            var h = 400;
            return ExtHelper.CreateWindow({
                title: title,
                width: w,
                height: h,
                layout: 'fit'
            });
        },
        getGrid: function (sid, url, t, title, page) {
            //debugger;
            var g = ExtHelper.CreateGrid({
                store: this.getStore(sid, url, t),
                columns: this.columns,
                pager: page,
                toolbar: {
                    enable: true,
                    add: this.add,
                    update: this.update,
                    del: this.del
                }
            });
            this.window(title).add(g);
        },
        columns: [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Text', text: '菜单名称', sortable: false, width: 100, renderer: renderText },
            { dataIndex: 'Code', text: '菜单编码', width:60},
            { dataIndex: 'Handler', text: '处理程序', sortable: false, width:80 },
            //{ dataIndex: 'Checked', text: '复选框', sortable: false, width:40, renderer:renderDisabled },
            { dataIndex: 'Disabled', text: '是否启用', width:45, renderer:renderDisabled },
            { dataIndex: 'Sort', text: '排序', width:30 /*,renderer:renderSort*/ },
            { dataIndex: 'Description', text: '描述信息', sortable: false, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a);} }
        ],
        getStore: function (sid, url, t) {
            url = url || 'Sys/MenuHelp.ashx?req=1';
            var s = ExtHelper.CreateStore({
                storeId: sid,
                url: url,
                model: 'Menu', total: t
            });
            return s;
        },
        pagingTopMenu: function () {
            this.getGrid(menuGrid, "Sys/MenuHelp.ashx?req=2", true, "菜单管理", true);
        },
        getEntities: function (id) {
            pid = id;
            this.getGrid(subMenuGrid, "Sys/MenuHelp.ashx?req=3&id=" + id, false, "子菜单管理");
        },
        createForm: function (s, pid, submit) {
            var f = ExtHelper.CreateForm({ title: '', url: 'Sys/MenuHelp.ashx?req=' + s, buttonstext: '提交', callback: submit,isResetBtn:true });
            pid = pid || 0;
            f.add({
                xtype: 'hiddenfield',
                fieldLabel: 'id',
                name: 'Id',
                value: '0'
            }, {
                xtype: 'hiddenfield',
                fieldLabel: 'pid',
                name: 'PId',
                value: pid
            }, {
                xtype: 'textfield',
                fieldLabel: '菜单名称',
                name: 'Text',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '唯一编码',
                name: 'Code',
                allowBlank: false
            }, {
                xtype: 'combobox',
                id: 'MenuIconcls',
                fieldLabel: '图标名称',
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
            }, {
                xtype: 'combobox',
                id: 'MenuHandler',
                fieldLabel: '处理函数',
                name: 'Handler',
                hiddenName: 'Handler',
                store: menusFnBind,
                queryMode: 'local',
                displayField: 'd',
                valueField: 'v',
                emptyText: '',
                forceSelection: false,// 必须选择一个选项
                blankText: '请选择',
                triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
                selectOnFocus: true
            }, {
                xtype: 'textfield',
                fieldLabel: '优先级',
                name: 'Sort',
                value: 0,
                allowBlank: false
            }, {
                xtype: 'combobox',
                id: 'MenuChecked',
                fieldLabel: '复选框启用',
                name: 'Checked',
                hiddenName: 'Checked',
                store: checkBoxItems,
                queryMode: 'local',
                displayField: 'd',
                valueField: 'v',
                emptyText: '请选择',
                forceSelection: true,// 必须选择一个选项
                blankText: '请选择',
                triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
                selectOnFocus: true,
                allowBlank: false,
                value:0
            }, {
                xtype: 'combobox',
                id: 'MenuDisabled',
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
                allowBlank: false,
                value:1
            }, {
                xtype: 'textarea',
                fieldLabel: '描述信息',
                name: 'Description',
                width: 500,
                height:45
            });
            return f;
        },
        createWindow: function (options) {
            var d = { title: undefined, req: undefined, data: undefined, pid:undefined, submit:undefined };
            var o = Ext.apply({}, options, d);
            o.submit = o.submit || function () { };
            var w = ExtHelper.CreateWindow({ title:o.title, height: 330, width: 530 });
            var f = this.createForm(o.req, o.pid, o.submit);
            if (o.data) f.loadRecord(o.data);
            w.add(f);
        },
        submit: function (store) {
            var res = function () {
                var f = this.up('form');
                var w = f.up('window');
                var form = f.getForm();
                if (form.isValid()) {
                    form.submit({
                        success: function (form, action) {
                            if (action.result.result > 0) {
                                Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                                store.load();
                                w.close();
                            } else if (action.result.result == -2) {
                                errorState.show('重复的唯一编码！');
                            } else {
                                Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                            }
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                        }
                    });
                }
            };
            return res;
        },
        add: function (o) {
            var s = o.grid.store;
            switch(s.storeId)
            {
                case menuGrid:
                    menuManager.createWindow({ title: "添加菜单", req: "add", pid: 0, submit: menuManager.submit(s) });
                    break;
                case subMenuGrid:
                    menuManager.createWindow({ title: "添加菜单", req: "add", pid: pid, submit: menuManager.submit(s) });
                    break;
                default:break;
            }
        },
        update: function (o) {
            //debugger;
            var r = o.grid.getSelectionModel().getSelection();
            if (r.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else if (r.length > 1) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            } else {
                menuManager.createWindow({ title: "菜单修改", req: "up", data: r[0], submit: menuManager.submit(o.grid.store) });
            }
        },
        del: function (o) {
            //debugger;
            var r = o.grid.getSelectionModel().getSelection();
            if (r.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else {
                Ext.Msg.confirm(errorState.SysPrompt, "确定删除这" + r.length + "条记录吗?",
                    function (btn) {
                        if (btn == "yes") {
                            var ids = [];
                            Ext.Array.each(r, function (record) {
                                var id = record.get('Id');
                                if (id) {
                                    ids.push(id);
                                }
                            });
                            Ext.Ajax.request({
                                url: "Sys/MenuHelp.ashx?req=del",
                                method: "POST",
                                params: { ids: ids.join(',') }, //发送的参数  
                                success: function (response, option) {
                                    response = Ext.JSON.decode(response.responseText);
                                    if (response.success == true) {
                                        if (response.result && response.result > 0) {
                                            Ext.MessageBox.alert(errorState.SysPrompt, errorState.DeleteSuccess);
                                            o.grid.store.load();
                                        } else {
                                            Ext.MessageBox.alert(errorState.SysPrompt, errorState.DeleteFail);
                                        }
                                    }
                                    else { Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }
                                },
                                failure: function () { Ext.Msg.alert(errorState.SysPrompt, errorState.DeleteFail); }
                            });
                        }
                    })
            }
        }
    };
    return o;
})();