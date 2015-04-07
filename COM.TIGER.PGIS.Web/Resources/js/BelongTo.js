/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="Config.js" />
/// <reference path="common.js" />

var belongtoManager = (function () {
    
    Ext.define('Com.tigerhz.Pgis.BelongTo', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'Code' },
            { name: 'Name' },
            { name: 'Description' }
        ]
    });

    var p = {
        store: function () {
            var s = ExtHelper.CreateStore({
                storeId: 'belongtoGridStoreID',
                url: 'Area/AreaHandler.ashx?req=2',
                model: 'Com.tigerhz.Pgis.BelongTo',
                total: true
            });
            return s;
        }(),
        win: function () {
            var w = 600;
            var h = 400;
            var t = '数据归属单位类型信息管理';
            var win = ExtHelper.CreateWindow({ title: t, width: w, height: h });
            return win;
        }()
    };

    var o = {
        columns: [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Code', text: '归属单位类型代码', flex: 1 },
            { dataIndex: 'Name', text: '归属单位类型名称', flex: 2 },
            { dataIndex: 'Description', text: '归属单位类型备注', flex: 4 }
        ],
        createGrid: function () {
            var g = ExtHelper.CreateGrid({
                store: p.store,
                columns: this.columns,
                pager: true,
                toolbar: {
                    enable:true,
                    add: this.add,
                    update: this.update,
                    del:this.del
                }
            });
            p.win.add(g);
        },
        createForm: function (options) {
            var d = {
                title: undefined,
                req: undefined,
                submit: this.submit,
                w: 530,
                h: 180,
                data: undefined,
                btext: '提交'
            };
            var obj = Ext.apply({}, options, d);
            var url = 'Area/AreaHandler.ashx?req=' + obj.req;
            var f = ExtHelper.CreateForm({ url: url, buttonstext: obj.btext, callback: obj.submit });
            f.add({
                xtype: 'hiddenfield',
                fieldLabel: 'id',
                name: 'ID',
                value: '0'
            }, {
                xtype: 'textfield',
                fieldLabel: '类型代码',
                name: 'Code',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '类型名称',
                name: 'Name',
                allowBlank: false
            }, {
                xtype: 'textarea',
                fieldLabel: '描述信息',
                name: 'Description',
                width: 500,
                height: 50
            });
            if (obj.data) f.loadRecord(obj.data);
            ExtHelper.CreateWindow({ title: obj.title, width: obj.w, height: obj.h })
            .center().add(f);
        },
        submit: function () {
            var f = this.up('form');
            var w = f.up('window');
            var form = f.getForm();
            if (form.isValid()) {
                form.submit({
                    success: function (form, action) {
                        if (action.result.success) {
                            Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                            p.store.load();
                            w.close();
                        } else {
                            Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                        }
                    },
                    failure: function (form, action) {
                        Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                    }
                });
            }
        },
        add: function () {
            belongtoManager.createForm({ title: '添加新的数据归属单位类型', req: 'badd' });
        },
        update: function (o) {
            var r = o.grid.getSelectionModel().getSelection();
            if (r.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else if (r.length > 1) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            } else {
                belongtoManager.createForm({ title: "修改数据归属单位类型记录", req: "bup", data: r[0] });
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
                                url: "Area/AreaHandler.ashx?req=bdel",
                                method: "POST",
                                params: { ids: ids.join(',') }, //发送的参数  
                                success: function (response, option) {
                                    response = Ext.JSON.decode(response.responseText);
                                    if (response.success == true) {
                                        if (response.result && response.result > 0) {
                                            Ext.MessageBox.alert(errorState.SysPrompt, errorState.DeleteSuccess);
                                            p.store.load();
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