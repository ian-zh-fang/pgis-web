/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="common.js" />
/// <reference path="Config.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Config.js" />

var roleManager = (function () {

    //当前选中的角色ID
    //在必须的时候应该重置这个值
    var rid = -1;

    var o = {
        model: Ext.define("Role", {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'Remarks' }
            ]
        }),
        column: [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Name', text: '角色名称', width: 60, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } },
            { dataIndex: 'Remarks', text: '描述信息', sortable: false, renderer: function (a) { return String.Format('<span title="{0}">{0}</span>', a); } }
        ],
        initFn: function () {
            rid = -1;
            roleManager.menuTree.store.load();
        },
        getWindow: function (title, w, h,layout) {
            var c = Ext.getCmp('extCenter');
            w = w || 600;
            h = h || 400;
            return ExtHelper.CreateWindow({
                title: title,
                width: w,
                height: h,
                layout:layout||'fit'
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
                    if (node.raw.Id == items[i].MenuID)
                    {
                        flag = true;
                        break;
                    }
                }
                roleManager.nodeChecked(node, flag);
            }

            function setNodeChecked(id) {
                ///<summary>
                /// 设置选中角色菜单信息
                ///</summary>

                var mask = maskGenerate.start({ p: wind.getId(), msg: '正在获取，请稍等 ...' });
                Ext.Ajax.request({
                    url: 'Sys/RoleHelp.ashx?req=2',
                    params: { id: id },
                    method: 'post',
                    success: function (response, option) {
                        response = Ext.JSON.decode(response.responseText);
                        if (response.success == true) {
                            var root = roleManager.menuTree.getRootNode();
                            setChecked(root, response.result);
                        }
                        else { Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }

                        mask.stop();
                    },
                    failure: function () {
                        mask.stop();
                        Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitFail);
                    }
                });
            }

            function clearNodeChecked() {
                var root = roleManager.menuTree.getRootNode();
                setChecked(root, []);
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

                if (items.length > 0) {
                    setNodeChecked(rid = items[0].data.ID);
                } else {
                    rid = -1;
                    var mask = maskGenerate.start({ p: roleManager.window.getId(), msg: '正在处理，请稍等 ...' });
                    clearNodeChecked();
                    mask.stop();
                }
            });

            var contrainid = identityManager.createId();
            var wind = roleManager.window = this.getWindow("角色权限管理").add({
                layout: 'border',
                border: false,
                items: [
                    {
                        layout: 'fit',
                        region: 'center',
                        border: false,
                        items: [g]
                    }, {
                        layout: 'fit',
                        region: 'east',
                        border: false,
                        frame: true,
                        id:contrainid,
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        split: true,
                        width: 300,
                        items: [this.menuTree]
                    }
                ]
            });
        },
        nodeChecked: function (n, ck) {
            n.set('checked', ck);
            n.data.checked = ck;
            n.raw.checked = ck;
        },
        menuTree: (function () {
            var url = 'Sys/MenuHelp.ashx?req=4';
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
                animate: true,
                listeners: {
                    itemclick: {
                        fn: function (view, record, item, index, e, eOpts) { }
                    },
                    checkchange: {
                        fn: function (node, checked) {

                            function childChecked(n) {
                                n.eachChild(function (view) {
                                    childChecked(view);
                                });                                
                                roleManager.nodeChecked(n, checked);
                            }
                            function parentChecked(n) {
                                roleManager.nodeChecked(n, isChecked(n));
                                if (n.parentNode) {
                                    parentChecked(n.parentNode);
                                }
                            }
                            function isChecked(n) {
                                var flag = false;
                                for (var i = 0; i < n.childNodes.length; i++) {
                                    if (n.childNodes[i].get('checked')) {
                                        flag = true;
                                        break;
                                    }
                                }
                                return flag;
                            }

                            childChecked(node);
                            parentChecked(node.parentNode);
                        }
                    }
                }
            });
            var tb = Ext.create('Ext.toolbar.Toolbar', {
                xtype: 'toolbar',
                dock: 'top',
                height: 26,
                items: ["当前选中角色菜单信息", "-", "->", {
                    xtype: 'button',
                    iconCls:'bsave',
                    text: '保 存',
                    handler: function () {
                        if (rid <= 0) {
                            Ext.MessageBox.show({
                                title: errorState.SysPrompt,
                                msg: '必须选择一个角色',
                                icon: Ext.MessageBox.INFO
                            });
                            return false;
                        }
                        var records = tree.getView().getChecked();
                        var ids = [];
                        Ext.Array.each(records, function (rec) {
                            ids.push(rec.raw.Id);
                        });

                        var mask = maskGenerate.start({ p: roleManager.window.getId(), msg: '正在提交，请稍等 ...' });

                        Ext.Ajax.request({
                            url: 'Sys/RoleHelp.ashx?req=3',
                            params: { id: rid, ids:ids.join(',') },
                            method: 'post',
                            success: function (response, option) {

                                response = Ext.JSON.decode(response.responseText);
                                if (response.result > 0) {
                                    Ext.MessageBox.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                                }
                                else { Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }

                                mask.stop();
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
            url = url || 'Sys/RoleHelp.ashx?req=1';
            var s = ExtHelper.CreateStore({
                storeId: 'roleGrid',
                url: url,
                model: 'Role',
                total: true
            });
            return s;
        },
        pagingRole: function () {
            this.getGrid();
        },
        createForm: function (options) {
            var d = { title: undefined, req: undefined, submit: null, w: undefined, h: undefined, data: undefined,l:undefined };
            //title, req, submit
            var o = Ext.apply({}, options, { w: 530, h: 150,l:'auto' }, d);
            var f = ExtHelper.CreateForm({ url: 'Sys/RoleHelp.ashx?req=' + o.req, buttonstext: '提交', callback: o.submit });
            f.add({
                xtype: 'hiddenfield',
                fieldLabel: 'id',
                name: 'ID',
                value: '0'
            }, {
                xtype: 'textfield',
                fieldLabel: '角色名称',
                name: 'Name',
                allowBlank: false
            }, {
                xtype: 'textarea',
                fieldLabel: '描述信息',
                name: 'Remarks',
                width: 500,
                height: 50
            });
            if (o.data) f.loadRecord(o.data);
            this.getWindow(o.title, o.w, o.h,o.l).add(f);
        },
        submitFn: function (s) {
            var res = function () {
                var f = this.up('form');
                var w = f.up('window');
                var form = f.getForm();
                if (form.isValid()) {
                    form.submit({
                        success: function (form, action) {
                            if (action.result.success) {
                                Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                                s.load();
                                w.close();
                            } else {
                                Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                            }
                            roleManager.initFn();//重新初始化
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
            //debugger;
            var submit = roleManager.submitFn(o.grid.store);
            roleManager.createForm({ title: '添加新角色', req: 'add', submit: submit });
        },
        update: function (o) {
            //debugger;
            var r = o.grid.getSelectionModel().getSelection();
            if (r.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else if (r.length > 1) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            } else {
                roleManager.createForm({ title: "修改角色记录", req: "up", data: r[0], submit: roleManager.submitFn(o.grid.store) });
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
                                var id = record.get('ID');
                                if (id) {
                                    ids.push(id);
                                }
                            });
                            Ext.Ajax.request({
                                url: "Sys/RoleHelp.ashx?req=del",
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
                                        roleManager.initFn();//重新初始化
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