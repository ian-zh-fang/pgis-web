/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="common.js" />
/// <reference path="Config.js" />
/// <reference path="../Resources/js/Utils.js" />

var userManager = (function () {

    //用户ID
    var uid = -1

    var o = {
        model: Ext.define("User", {
            extend: "Ext.data.Model",
            fields: [
                { name: 'ID' },
                { name: 'OfficerID' },
                { name: 'Code' },
                { name: 'UserName' },
                { name: 'Password' },
                { name: 'CPassword' },
                { name: 'Name' },
                { name: 'DepartmentID' },
                { name: 'DepartmentName' },
                { name: 'Gender' },
                { name: 'Lvl' },
                { name: 'Disabled' }
            ]
        }),
        column: [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Code', text: '警员编号', width: 65, sortable: false, hidden: false, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
            { dataIndex: 'Name', text: '警员姓名', flex: 1, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
            { dataIndex: 'UserName', text: '用户名称', sortable: false, flex: 1, hidden: true, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
            { dataIndex: 'Gender', text: '性别', width: 40, renderer: function (a) { return genderItems.data.items[a].get('d'); } },
            { dataIndex: 'DepartmentName', text: '部门', sortable: false, hidden: false, flex: 1, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
            //{ dataIndex: 'Lvl', text: '等级', width: 65, hidden: true },
            {
                dataIndex: 'Disabled', text: '状态', width: 40, sortable: false, hidden: false, renderer: function (val) {
                    switch (val) {
                        case 0:
                            return '<font style="color:red;">禁用</font>';
                        case 1:
                            return '<font style="color:green;">启用</font>';
                        default:
                            return '未知';
                    }
                }
            }
        ],
        initFn: function () {
            uid = -1;
            userManager.roleTree.store.load();
        },
        getWindow: function (title, w, h) {
            var c = Ext.getCmp('extCenter');
            w = w || 600;
            h = h || 400;
            return ExtHelper.CreateWindow({
                title: title,
                width: w,
                height: h,
                layout: 'fit'
            });
        },
        getGrid: function (url) {
            function setChecked(node, items) {
                ///<summary>
                /// 设置节点状态
                ///</summary>
                node.eachChild(function (view) {
                    setChecked(view, items);
                });
                var flag = false;
                for (var i = 0; i < items.length; i++) {
                    if (node.raw.ID == items[i].RoleID) {
                        flag = true;
                        break;
                    }
                }
                userManager.nodeChecked(node, flag);
            }

            //用户信息
            function setNodeChecked(id) {
                ///<summary>
                /// 设置选中角色菜单信息
                ///</summary>

                var mask = maskGenerate.start({ p: wind.getId(), msg: '正在获取，请稍等 ...' });
                Ext.Ajax.request({
                    url: 'Sys/UserHandler.ashx?req=2',
                    params: { id: id },
                    method: 'post',
                    success: function (response, option) {
                        response = Ext.JSON.decode(response.responseText);
                        if (response.success == true) {
                            var root = userManager.roleTree.getRootNode();
                            setChecked(root, response.result);
                            mask.stop();
                        }
                        else {
                            mask.stop();
                            Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }
                    },
                    failure: function () {
                        mask.stop();
                        Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitFail);
                    }
                });
            }

            var s = this.getStore(url);
            var g = ExtHelper.CreateGrid({
                columns: this.column,
                store: s,
                pager: true,
                toolbar: {
                    enable: true,
                    add: this.add,
                    update: this.update,
                    del: this.del
                }
            });
            g.on('selectionchange', function (view, items) {
                if (items.length == 1) {
                    setNodeChecked(uid = items[0].data.ID);
                } else {
                    uid = -1;
                    var root = userManager.roleTree.getRootNode();
                    setChecked(root, []);
                }
            });

            var wind = userManager.window = this.getWindow("用户信息管理");
            wind.add({
                xtype:'panel',
                layout: 'border',
                border: 0,
                items: [
                    {
                        layout: 'fit',
                        region: 'center',
                        border: 0,
                        items: [g]
                    }, {
                        layout: 'fit',
                        region: 'east',
                        border: 1,
                        split: true,
                        width: 150,
                        items: [this.roleTree]
                    }
                ]
            });
        },
        nodeChecked: function (n, ck) {
            n.set('checked', ck);
            n.data.checked = ck;
            n.raw.checked = ck;
        },
        roleTree: (function () {
            var me = this;
            //角色信息
            var url = 'Sys/RoleHelp.ashx?req=';
            var store = Ext.create("Ext.data.TreeStore", {
                proxy: {
                    type: 'ajax',
                    url: url
                },
                loadMask: true,
                autoLoad: true
            });
            var tree = new Ext.tree.TreePanel({
                store: store,
                border: false,
                rootVisible: false,
                multiSelect: true,
                checkModel: 'cascade',
                requestMethod: 'post',
                animate: true
            });
            var tb = Ext.create('Ext.toolbar.Toolbar', {
                xtype: 'toolbar',
                dock: 'top',
                height: 26,
                items: ["系统角色", "-", "->", {
                    xtype: 'button',
                    iconCls:'bsave',
                    text: '保 存',
                    handler: function () {
                        if (uid <= 0) {
                            Ext.MessageBox.show({
                                title: errorState.SysPrompt,
                                msg: '必须选择一个用户',
                                icon: Ext.MessageBox.INFO
                            });
                            return false;
                        }
                        var records = tree.getView().getChecked();
                        var ids = [];
                        Ext.Array.each(records, function (rec) {
                            ids.push(rec.raw.ID);
                        });

                        var mask = maskGenerate.start({ p: userManager.window.getId(), msg: '正在保存，请稍等 ...' });
                        Ext.Ajax.request({
                            url: 'Sys/UserHandler.ashx?req=3',
                            params: { id: uid, ids: ids.join(',') },
                            method: 'post',
                            success: function (response, option) {
                                mask.stop();
                                response = Ext.JSON.decode(response.responseText);
                                if (response.success == true) {
                                    Ext.MessageBox.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                                }
                                else { Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }
                            },
                            failure: function () {
                                mask.stop();
                                Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitFail);
                            }
                        });
                    }
                }]
            });
            tree.addDocked(tb);
            return tree;
        })(),
        getStore: function (url) {
            url = url || 'Sys/UserHandler.ashx?req=1';
            var s = ExtHelper.CreateStore({
                storeId: 'userGrid',
                url: url,
                model: 'User',
                total: true
            });
            return s;
        },
        departmentStore: function () {
            var store = new Ext.data.Store({
                storeId: 'userdepartmentStore',
                model: Ext.define('userdepartment', {
                    extend: 'Ext.data.Model',
                    fields: [
                        { name: 'ID', type: 'Number' },
                        { name: 'PID', type: 'Number' },
                        { name: 'Code', type: 'String' },
                        { name: 'Name', type: 'String' },
                        { name: 'Remarks', type: 'String' }
                    ]
                }),
                proxy: {
                    type: 'ajax',
                    url: 'Sys/DepartmentHelp.ashx?req='
                    , simpleSortMode: true
                }
            });
            store.load();
            return store;
        }(),
        officer: function () {
            var me = {};

            var tp = me.type = identityManager.createId('model');
            var model = Ext.define(tp, {
                extend: 'Ext.data.Model',
                fields: [
                    { name: 'ID' },
                    { name: 'Num' },
                    { name: 'Name' },
                    { name: 'IdentityID' },
                    { name: 'Tel' },
                    { name: 'Gender' },
                    { name: 'DeptID' }//隶属部门ID
                ]
            });
            var id = identityManager.createId();
            var store = me.store = ExtHelper.CreateStore({
                storeId: id,
                url: 'Officer/OfficerHelp.ashx?req=all',
                model: tp,
                total: false
            });

            return me;
        }(),
        createForm: function (options) {
            var d = {
                req: undefined,
                data: undefined,
                width: 350,
                title: undefined,
                text: "提交",
                sub: null
            };
            var obj = Ext.apply({}, options, d);
            

            var nameid = identityManager.createId();
            var codeid = identityManager.createId();
            var deptid = identityManager.createId();
            var sexid = identityManager.createId();

            var f = ExtHelper.CreateForm({ title: '', url: 'Sys/UserHandler.ashx?req=' + obj.req, buttonstext: obj.text, callback: obj.sub });
            f.add({
                xtype: 'hiddenfield',
                fieldLabel: 'id',
                name: 'ID',
                value: '0'
            }, {
                xtype: 'combobox',
                id: identityManager.createId(),
                fieldLabel: '警员编号',
                name: 'OfficerID',
                hiddenName: 'OfficerID',
                store: this.officer.store,
                queryMode: 'local',
                displayField: 'Num',
                valueField: 'ID',
                emptyText: '请选择警号',
                forceSelection: true,// 必须选择一个选项
                blankText: '请选择警号',
                triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
                selectOnFocus: true,
                allowBlank: false,
                listeners: {
                    'change': function (a, b, c) {
                        if (a.lastSelection.length > 0) {
                            var data = a.lastSelection[0].getData();
                            f.getComponent(nameid).setValue(data.Name);
                            f.getComponent(codeid).setValue(data.Num);
                            f.getComponent(deptid).setValue(data.DeptID);
                            f.getComponent(sexid).setValue(data.Gender);
                        }
                    }
                }
            }, {
                xtype: 'hiddenfield',
                fieldLabel: 'DepartmentID',
                name: 'DepartmentID',
                id: deptid,
                value: 0
            }, {
                xtype: 'hiddenfield',
                fieldLabel: 'Gender',
                name: 'Gender',
                id: sexid,
                value: 0
            }, {
                xtype: 'textfield',
                fieldLabel: '名称',
                id:nameid,
                name: 'Name',
                allowBlank: false,
                readOnly:true
            }, {
                xtype: 'textfield',
                fieldLabel: '代码',
                id:codeid,
                name: 'Code',
                allowBlank: false,
                readOnly: true
            }, {
                xtype: 'textfield',
                fieldLabel: '用户名称',
                name: 'UserName',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '用户密码',
                name: 'Password',
                inputType: 'password',
                id: 'UserPassword',
                allowBlank: false,
                regex: /^[A-Za-z0-9]{6,20}$/,
                regexText: '格式错误，长度必须至少6个字符，并且不能超过20个字符'
            }, {
                xtype: 'textfield',
                fieldLabel: '确认密码',
                id: 'UserCPassword',
                inputType: 'password',
                name: 'CPassword',
                confirmPwd: {
                    first: 'UserPassword',
                    second: 'UserCPassword'
                },
                vtype: 'confirmPwd',
                allowBlank: false
            }, {
                xtype: 'hiddenfield',
                fieldLabel: '用户等级',
                name: 'Lvl',
                value:0
            },{
                xtype: 'combobox',
                id: 'UserDisabled',
                fieldLabel: '是否启用',
                name: 'Disabled',
                hiddenName: 'Disabled',
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
                value: 1
            });
            
            Ext.apply(Ext.form.VTypes, {
                confirmPwd: function (val, field) {
                    if (field.confirmPwd) {
                        var firstPwdId = field.confirmPwd.first;
                        var secondPwdId = field.confirmPwd.second;
                        this.firstField = Ext.getCmp(firstPwdId);
                        this.secondField = Ext.getCmp(secondPwdId);
                        var firstPwd = this.firstField.getValue();
                        var secondPwd = this.secondField.getValue();
                        if (firstPwd == secondPwd) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                confirmPwdText: '两次输入的密码不一致!'
            });

            if (obj.data) f.loadRecord(obj.data);
            var wind = userManager.getWindow(obj.title, 510, 270);
            wind.add(f);
        },
        submit: function (store) {
            var res = function () {
                var f = this.up('form');
                var w = f.up('window');
                var form = f.getForm();
                if (form.isValid()) {
                    form.submit({
                        success: function (form, action) {
                            if (action.result.result.success) {
                                store.load();
                                w.close();
                            } else {
                                errorState.show(action.result.result.message);
                            }
                            userManager.initFn();
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitFail);
                        }
                    });
                }
            };
            return res;
        },
        add: function (o) {
            var s = o.grid.store;
            userManager.createForm({ req: 'add', title: '添加用户信息', sub: userManager.submit(s) });
        },
        update: function (o) {
            var r = o.grid.getSelectionModel().getSelection();
            if (r.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else if (r.length > 1) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            } else {
                userManager.createForm({ req: 'up', title: '修改用户信息', data: r[0], sub: userManager.submit(o.grid.store) });
            }
        },
        del: function (o) {
            var r = o.grid.getSelectionModel().getSelection();
            if (r.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else {
                Ext.Msg.confirm(errorState.SysPrompt, "确定删除这" + r.length + "条记录吗?",
                    function (btn) {
                        if (btn == "yes") {
                            var ids = [];
                            Ext.Array.each(r, function (record) {
                                var id = record.get('ID');
                                if (id) {
                                    ids.push(id);
                                }
                            });
                            Ext.Ajax.request({
                                url: "Sys/UserHandler.ashx?req=del",
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

                                    userManager.initFn();
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