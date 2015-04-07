
/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="common.js" />
/// <reference path="Config.js" />
/// <reference path="../Resources/js/maskLoad.js" />


var departmentManager = (function () {
    
    Ext.require([
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn'
    ]);

    Ext.define('Tiger.pgis.model.Department', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID', type: 'Number' },
            { name: 'PID', type: 'Number' },
            { name: 'Code', type: 'String' },
            { name: 'Name', type: 'String' },
            { name: 'Remarks', type: 'String' }
        ]
    });

    //默认值
    var defaultModel = { ID: 0, PID: 0, Code: undefined, Name: undefined, Remarks: undefined };

    var o = {
        createView: function () {
            var w = 600;
            var h = 400;
            var t = '组织结构信息管理';            

            ExtHelper.CreateWindow({
                title: t,
                height: h,
                width: w,
                layout:'fit'
            }).add(
            this.treegrid
            );
        },
        treegrid: (function () {
            var url = 'Sys/DepartmentHelp.ashx?req=1';
            var store = Ext.create("Ext.data.TreeStore", {
                model:Tiger.pgis.model.Department,
                proxy: { type: 'ajax', url: url },
                loadMask: true,
                autoLoad: true,
                root: {
                    text: '桐梓县公安局',
                    Name: '桐梓县公安局'
                }
            });

            var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
                clicksToMoveEditor: 1,
                //clicksToEdit:1,
                autoCancel: true,
                saveBtnText: '保存',
                cancelBtnText:'取消'
            });

            var tree = new Ext.tree.TreePanel({
                rootVisible: false,
                autoScroll: true,
                title: '',
                useArrows: true,
                loadMask: true,
                stripeRows: true,
                border: false,
                columnLines:true,
                columns: [
                    {
                        xtype: 'treecolumn', header: '机构名称', flex: 2, dataIndex: 'Name',
                        editor: {allowBlank:false}
                    },
                    {
                        header: '机构代码', flex: 1, dataIndex: 'Code',
                        editor: { allowBlank: false }
                    },
                    {
                        header: '描述信息', flex: 4, dataIndex: 'Remarks', sortable: false,
                        editor: { allowBlank: true }
                    },
                    {
                        text: '操作',
                        flex:1,
                        xtype: 'actioncolumn',
                        lock:true,
                        items: [
                            {
                                iconCls: 'badd pagis-icon-btn',
                                handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                    departmentManager.addFn(record.data.ID);
                                }
                            },
                            {
                                iconCls: 'bupdate pagis-icon-btn',
                                handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                    //if (record.data.parentId)
                                    //    departmentManager.upFn(record);
                                    //else
                                    //    Ext.MessageBox.show({
                                    //        title: errorState.SysPrompt,
                                    //        msg: '当前节点禁止操作',
                                    //        icon: Ext.MessageBox.INFO
                                    //    });

                                    departmentManager.upFn(record);
                                }
                            },
                            {
                                iconCls: 'bdel pagis-icon-btn',
                                handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                    //if (record.data.parentId)
                                    //    departmentManager.delFn([record.data.ID]);
                                    //else
                                    //    Ext.MessageBox.show({
                                    //        title: errorState.SysPrompt,
                                    //        msg: '当前节点禁止操作',
                                    //        icon: Ext.MessageBox.INFO
                                    //    });

                                    departmentManager.delFn([record.data.ID]);
                                }
                            }
                        ]
                    }
                ],
                tbar:{
                    enable: true,
                    items: [
                        {
                            xtype: 'button', text: '添加顶级项', iconCls: 'badd', handler: function () {
                                departmentManager.addFn();
                            }
                        },
                        '->',
                        {
                            xtype: 'button', text: "刷新", iconCls: 'brefresh', handler: function () {
                                departmentManager.treegrid.store.load();
                            }
                        }
                    ]
                },
                store: store,
                plugins: [rowEditing],
                listeners: {
                    //'selectionchange': function (view, records) { },
                    'edit': function (btn, record) {
                        var dat = Ext.apply({}, record.newValues, record.record.data, defaultModel);
                        Ext.Ajax.request({
                            url: 'Sys/DepartmentHelp.ashx?req=up',
                            method: 'post',
                            params: {ID:dat.ID, Name:dat.Name, PID:dat.PID, Code:dat.Code, Remarks:dat.Remarks},
                            success: function (response, option) {
                                departmentManager.treegrid.store.load();
                                response = Ext.JSON.decode(response.responseText);
                                if (response.success == true) {
                                    if (response.result && response.result > 0) {
                                        Ext.MessageBox.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                                    } else {
                                        Ext.MessageBox.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                                    }
                                }
                                else { Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }
                            },
                            failure: function () {
                                departmentManager.treegrid.store.load();
                                Ext.Msg.alert(errorState.SysPrompt, errorState.DeleteFail);
                            }
                        });
                    }
                }
            });
            return tree;
        })(),
        getForm: function (options) {
            var d = {
                req: undefined,
                data: undefined,
                //width: 350,
                title: undefined,
                text: "提交",
                pid:0,
                sub: this.submit
            };
            var obj = Ext.apply({}, options, d);
            var f = ExtHelper.CreateForm({
                url: 'Sys/DepartmentHelp.ashx?req=' + obj.req,
                width: obj.width,
                buttonstext: obj.text,
                callback: obj.sub
            });
            f.add({
                xtype: 'hiddenfield',
                fieldLabel: 'id',
                name: 'ID',
                value:'0'
            }, {
                xtype: 'hiddenfield',
                fieldLabel: 'pid',
                name: 'PID',
                value: obj.pid
            }, {
                xtype: 'textfield',
                fieldLabel: '机构名称',
                name: 'Name',
                allowBlank:false
            }, {
                xtype: 'textfield',
                fieldLabel: '机构代码',
                name: 'Code',
                allowBlank: false
            }, {
                xtype: 'textarea',
                fieldLabel: '描述信息',
                name: 'Remarks',
                width: 500,
                height: 50
            });

            if (obj.data) f.loadRecord(obj.data);
            ExtHelper.CreateWindow({
                title: obj.title,
                height: 190,
                width: 530
            }).add(f);
        },
        submit: function () {
            var f = this.up('form');
            var w = f.up('window');
            var form = f.getForm();
            if (form.isValid()) {
                var mask = maskGenerate.start({ p: w.getId(), msg: '正在提交，请稍等 ....' });
                form.submit({
                    success: function (form, action) {
                        mask.stop();
                        if (action.result.result > 0) {
                            //Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                            w.close();
                            departmentManager.treegrid.store.load();
                        } else if (action.result.result == -2) {
                            errorState.show('重复的机构代码！');
                        } else {
                            Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                        }
                    },
                    failure: function (form, action) {
                        mask.stop();
                        Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                    }
                });
            }
        },
        addFn: function (pid) {
            pid = pid || 0;
            this.getForm({
                title: '添加组织机构信息',
                req: 'add',
                pid: pid
            });
        },
        upFn: function (data) {
            this.getForm({
                title: '修改组织机构信息',
                req: 'up',
                data:data
            });
        },
        delFn: function (ids) {
            Ext.Msg.confirm(errorState.SysPrompt, "确定删除指定的记录吗?", function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: "Sys/DepartmentHelp.ashx?req=del",
                        method: "POST",
                        params: { ids: ids.join(',') }, //发送的参数  
                        success: function (response, option) {
                            departmentManager.treegrid.store.load();
                            response = Ext.JSON.decode(response.responseText);
                            if (response.success == true) {
                                if (response.result && response.result > 0) {
                                    Ext.MessageBox.alert(errorState.SysPrompt, errorState.DeleteSuccess);
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
    };
    return o;
})();