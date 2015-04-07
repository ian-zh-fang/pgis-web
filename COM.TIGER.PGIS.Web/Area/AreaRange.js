/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="common.js" />
/// <reference path="Config.js" />
/// <reference path="mapGDI.js" />
/// <reference path="MapHelper.js" />

var arearangeManager = (function () {
    var tabID = 'tabscrollermenu';
    var url = 'Area/AreaHandler.ashx?req=';
    var textareaid = 'arearangetextarea';
    var formFlag;
    //保存PID组
    var pids = [];

    //设置PID
    function pushPid(grid, id, fex)
    {
        fex = fex || '_pid';
        var pid = grid + fex;
        pids.push(pid);
        pids[pid] = id;
    }

    //获取PID
    function popPid(grid, fex) {
        fex = fex || '_pid';
        var pid = grid + fex;
        return pids[pid];
    }

    Ext.define("Com.tigerhz.Pgis.Arearange", {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'PID' },
            { name: 'Name' },
            { name: 'NewCode' },
            { name: 'OldCode' },
            { name: 'BelongToID' },
            { name: 'BelongToName' },
            { name: 'Description' }
        ]
    });

    Ext.define("Com.tigerhz.Pgis.Range", {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'Range' },
            { name: 'X' },
            { name: 'Y' },
            { name: 'Color' },
            { name: 'AreaID' }
        ]
    });

    var p = {
        store: function () {
            var s = ExtHelper.CreateStore({
                storeId: 'belongtoGridStoreID',
                url: url + '1',
                model: 'Com.tigerhz.Pgis.Arearange',
                total: true
            });
            return s;
        }(),
        win: function () {
            var w = 600;
            var h = 400;
            var t = '区域信息管理';
            var win = ExtHelper.CreateWindow({ title: t, width: w, height: h,layout:'fit' });
            win.on('close', function () {
                //清除冗余数据
                for (var i = 0; i < pids.length; i++)
                {
                    delete pids[i];
                }
                pids.length = 0;
            });
            return win;
        }()
    };

    var o = {
        columns: [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            {
                dataIndex: 'Name', text: '辖区名称', flex: 2, renderer: function (value, obj, record) {
                    return '<a href="#" onclick="arearangeManager.createGridTab(' + record.data.ID +', \''+value+'\')" >' + value + '</a>';
                }
            },
            { dataIndex: 'NewCode', text: '新代码', flex: 1 },
            { dataIndex: 'OldCode', text: '旧代码', flex: 1 },
            { dataIndex: 'BelongToName', text: '数据归属单位类型', flex:3, sortable: false }
        ],
        createGrid: function (options) {
            var d = { store: null, title: '区域信息管理', close: false };
            options = Ext.apply({}, options, d);
            var s = options.store || p.store;
            var t = options.title || "区域信息管理";
            var g = ExtHelper.CreateGrid({
                store: s,
                columns: this.columns,
                pager: true,
                toolbar: {
                    enable: true,
                    add: this.add,
                    update: this.update,
                    del: this.del,
                    items: [
                        //'->',
                        {
                            xtype: 'button',
                            text: '辖区范围',
                            iconCls: 'bpath',
                            handler: this.createRangeGrid
                        }
                    ]
                }
            });
            return {
                title: t,
                layout: 'fit',
                border: false,
                tabTip: t,
                closable: options.close,
                items: [g],
                listeners: {

                }
            };
        },
        createRootGrid: function () {
            p.win.add({
                xtype: 'tabpanel',
                border: false,
                activeTab: 0,
                itemId: tabID,
                plugins: [{
                    ptype: 'tabscrollermenu',
                    maxText: 15,
                    pageSize: 5
                }],
                items: [this.createGrid()],
                listeners: {

                }
            }).show();
        },
        createForm: function (options) {
            var d = { title: undefined, req: undefined, pid:0, submit: null, w: 530, h: 300, data: undefined };
            var o = Ext.apply({}, options, d);
            formFlag = 1;
            var f = ExtHelper.CreateForm({ url: url + o.req, buttonstext: '提交', callback: o.submit });
            var store = new Ext.data.Store({
                storeId: 'areabelongtotStore',
                model: Ext.define('Com.BelongTo', {
                    extend: 'Ext.data.Model',
                    fields: [
                        { name: 'ID' },
                        { name: 'Code' },
                        { name: 'Name' },
                        { name: 'Description' }
                    ]
                }),
                proxy: {
                    type: 'ajax',
                    url: url + '3'
                    , simpleSortMode: true
                }
            });
            store.load();

            f.add({
                xtype: 'hiddenfield',
                fieldLabel: 'id',
                name: 'ID',
                value: '0'
            }, {
                xtype: 'hiddenfield',
                fieldLabel: 'pid',
                name: 'PID',
                value: o.pid || 0
            }, {
                xtype: 'textfield',
                fieldLabel: '名称',
                name: 'Name',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '新代码',
                name: 'NewCode',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '旧代码',
                name: 'OldCode'
            }, {
                xtype: 'combobox',
                id: 'AreaBelongToID',
                fieldLabel: '数据归属单位类型',
                name: 'BelongToID',
                hiddenName: 'BelongToID',
                store: store,
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                emptyText: '请选择',
                forceSelection: true,// 必须选择一个选项
                blankText: '请选择',
                triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
                selectOnFocus: true,
                allowBlank: false,
                value: 1
            }, {
                xtype: 'htmleditor',
                fieldLabel: '描述信息',
                name: 'Description',
                height: 100,
                allowBlank: true
            });

            if (o.data) f.loadRecord(o.data);
            ExtHelper.CreateWindow({ title: o.title, width: o.w, height: o.h , layout:'fit'})
            .center().add(f);
        },
        createGridTab: function (id, value) {
            var c = this.createGrid({
                title: value + ' 子区域管理',
                close: true,
                store: function () {
                    var s = ExtHelper.CreateStore({
                        storeId: 'belongtoGridStoreID_' + id,
                        url: url + 'cl&pid=' + id,
                        model: 'Com.tigerhz.Pgis.Arearange',
                        total: true
                    });
                    return s;
                }()
            });
            pushPid(c.items[0].id, id);
            var tab = p.win.getComponent(tabID);
            tab.add(c);
            var index = tab.items.length > 0 ? (tab.items.length - 1) : 0;
            tab.setActiveTab(index);
        },
        createRangeGrid: function (o) {
            var r = o.grid.getSelectionModel().getSelection();
            if (r.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else if (r.length > 1) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            } else {
                var c = arearangeManager.getRangeGrid(r[0].data.ID, r[0].data.Name);
                var tab = p.win.getComponent(tabID);
                tab.add(c);
                var index = tab.items.length > 0 ? (tab.items.length - 1) : 0;
                tab.setActiveTab(index);
            }
        },
        createRangeForm: function (options) {
            var d = { title: '编辑坐标区域', req: undefined, areaid: 0, submit: null, w: 530, h: 190, data: undefined, close: true };
            var o = Ext.apply({}, options, d);
            formFlag = 2;
            var f = ExtHelper.CreateForm({ url: url + o.req, buttonstext: '提交', callback: o.submit });
            f.add({
                xtype: 'hiddenfield',
                fieldLabel: 'id',
                name: 'ID',
                value: '0'
            }, {
                xtype: 'hiddenfield',
                fieldLabel: 'areaid',
                name: 'AreaID',
                value: o.areaid || 0
            }, {
                xtype: 'textarea',
                id: textareaid,
                fieldLabel: '范围座标组',
                emptyText: '请选择区域',
                name: 'Range',
                width: 500,
                height: 80,
                allowBlank: false,
                readOnly: true,
                listeners: {
                    focus: {
                        fn: function () {
                            //debugger;
                            var me = this;
                            var f = me.up('form');
                            var w = f.up('window');
                            w.hide();

                            mapGDI.GetCoords(null, function (o, coords) {
                                me.setValue(coords);
                                w.show();
                            }, true);
                        }
                    }
                }
            }, {
                xtype: 'colorfield',
                fieldLabel: '分辨颜色',
                emptyText: '请选择颜色',
                name: 'Color',
                allowBlank: false
            });
            t= {
                title: options.title,
                layout: 'fit',
                border: false,
                tabTip: options.title,
                closable: true,
                items: [f]
            };
            if (o.data) f.loadRecord(o.data);
            var tab = p.win.getComponent(tabID);
            tab.add(t).show();
            var index = tab.items.length > 0 ? (tab.items.length - 1) : 0;
            tab.setActiveTab(index);

            //var wd = ExtHelper.CreateWindow({
            //    title: o.title, width: o.w, height: o.h, listeners: {
            //        close: {
            //            fn: function () {
            //                p.win.show();
            //            }
            //        },
            //        show: {
            //            fn: function () {
            //                p.win.hide();
            //            }
            //        }
            //    }
            //}).center().add(f);
        },
        getRangeGrid: function (areaid, val) {
            var store = ExtHelper.CreateStore({
                storeId: 'rangeGridStoreID',
                url: url + 'rg&id=' + areaid,
                model: 'Com.tigerhz.Pgis.Range'
            });
            var column = [
                { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
                { dataIndex: 'Range', text: '座标组', flex: 5, sortable: false },
                {
                    dataIndex: 'X', text: '中心座标', flex: 1, sortable: false, renderer: function (value, obj, record) {
                        return record.data.X + ', ' + record.data.Y;
                    }
                },
                {
                    dataIndex: 'Color', text: '辖区颜色', flex: 1, sortable: false, renderer: function (val) {
                        return '<DIV id="imgtb" style="width:13px;height:13px;background-color:#'+val+';"  title="辖区颜色"></DIV>';
                    }
                }
            ];
            var t = val + ' 区域范围信息管理';
            var g = ExtHelper.CreateGrid({
                store: store,
                columns: column,
                pager: false,
                toolbar: {
                    enable: true,
                    add: this.addR,
                    update: this.upR,
                    del: this.delR
                }
            });
            pushPid(g.getId(), areaid, "_areaid");
            return {
                title: t,
                layout: 'fit',
                border: false,
                tabTip: t,
                closable: true,
                items: [g]
            };
        },
        submit: function (s, f) {
            var res = function () {
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
                            s.load();
                            if (formFlag == 1) {
                                w.close();
                            }
                            else if (formFlag == 2) {
                                var tab = p.win.getComponent(tabID);
                                var index = tab.getActiveTab();
                                tab.remove(index);
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
            //debugger;
            var sub = arearangeManager.submit(o.grid.store)
            var pid = popPid(o.grid.id);
            arearangeManager.createForm({
                title: '新增区域信息', req: 'add', submit: sub, pid: pid
            });
        },
        update: function (o) {
            var r = o.grid.getSelectionModel().getSelection();
            if (r.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else if (r.length > 1) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            } else {
                arearangeManager.createForm({ title: "修改区域信息", req: "up", data: r[0], submit: arearangeManager.submit(o.grid.store) });
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
                                url: url + 'del',
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
        },
        addR: function (o) {
            var sub = arearangeManager.submit(o.grid.store)
            var aid = popPid(o.grid.id, "_areaid");
            arearangeManager.createRangeForm({
                title: '新增区域范围信息', req: 'radd', submit: sub, areaid: aid
            });
        },
        upR: function (o) {
            var r = o.grid.getSelectionModel().getSelection();
            if (r.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else if (r.length > 1) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            } else {
                arearangeManager.createRangeForm({ title: "修改区域范围信息", req: "rup", data: r[0], submit: arearangeManager.submit(o.grid.store) });
            }
        },
        delR: function (o) {
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
                                url: url + 'rdel',
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