/// <reference path="extjs4.2/ext-all-dev.js" />
/// <reference path="common.js" />
/// <reference path="Config.js" />
/// <reference path="Utils.js" />
/// <reference path="MapHelper.js" />
/// <reference path="mapGDI.js" />

var PatrolAreaManager = (function () {

    var url = 'PatrolArea/PatrolAreaHandler.ashx?req=';

    Ext.define("Com.tigerhz.Pgis.PatrolArea", {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Id' },
            { name: 'Name' },
            { name: 'Manager' },
            { name: 'Phone' },
            { name: 'Coordinates' },
            { name: 'Centerx' },
            { name: 'Centery' },
            { name: 'Color' },
            { name: 'text' },
            { name: 'leaf' },
            { name: 'expend' },
            { name: 'Remark' }
        ]
    });
    var gridstore = null;
    var pids = [];
    var win;
    var o = {
        PatrolAreaTreeStore: function () {
            var s = Ext.create('Ext.data.TreeStore', {
                proxy: {
                    type: 'ajax',
                    url: url + 'al'
                },
                loadMask: true,
                autoLoad: true
            });
            return s;
        },
        CreateWindow: function () {
            var w = 600;
            var h = 400;
            var t = '巡防区域管理';
            win = ExtHelper.CreateWindow({ title: t, width: w, height: h, layout: 'fit' });
            win.on('close', function () {
                //清除冗余数据
            });
            return win;
        },
        CreateForm: function () {
            //debugger;
            var store = gridstore = ExtHelper.CreateStore({ storeId: 'PotrolAreaGrid', url: url + '1', model: 'Com.tigerhz.Pgis.PatrolArea', total: true });
            var columns = [
                { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
                { dataIndex: 'Name', text: '巡防区域名称' },
                { dataIndex: 'Manager', text: '巡防员' },
                { dataIndex: 'Phone', text: '联系电话' },
                { dataIndex: 'Remark', text: '巡防区域描述' }
            ];
            var grid = ExtHelper.CreateGrid({
                store: store, columns: columns, pager: true,
                toolbar: {
                    enable: true, add: PatrolAreaManager.add, update: PatrolAreaManager.update, del: PatrolAreaManager.del
                }
            });
            //debugger;
            this.CreateWindow().add(grid);
        },
        CreateFormPanel: function (s, pid) {
            var formpanel = ExtHelper.CreateForm({ title: '',isResetBtn:true, url: url + s, buttonstext: '提交', callback: PatrolAreaManager.formSubmit });
            formpanel.add({
                xtype: 'hiddenfield',
                fieldLabel: 'id：',
                name: 'Id'
            }, {
                xtype: 'textfield',
                fieldLabel: '区域名称',
                name: 'Name',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '巡防员',
                name: 'Manager',
                allowBlank: true
            }, {
                xtype: 'textfield',
                fieldLabel: '联系电话',
                name: 'Phone'
            }, {
                xtype: 'textarea',
                fieldLabel: '区域坐标',
                name: 'Coordinates',
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
                            win.hide();
                            mapGDI.GetCoords(null, function (o, coords) {
                                me.setValue(coords);
                                win.show();
                                w.show();
                                
                            }, true);
                        }
                    }
                }
            }, {
                xtype: 'colorfield',
                fieldLabel: '区域颜色',
                name: 'Color',
                allowBlank: false
            }, {
                xtype: 'htmleditor',
                fieldLabel: '区域描述',
                name: 'Remark',
                allowBlank: true
            });
            return formpanel;
        },
        formSubmit:function(){
            var form = this.up('form');
            var window = form.up('window');
            form = form.getForm();
            if (form.isValid()) {
                // Submit the Ajax request and handle the response
                form.submit({
                    success: function (form, action) {
                        //Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                        window.close();
                        gridstore.load();
                    },
                    failure: function (form, action) {
                        Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                    }
                });
            }
        },
        add: function (obj) {
            var pid = pids[obj.grid.getId()];
            var extWindow = ExtHelper.CreateWindow({ title: '巡防区域添加', height: 300, width: 500 });
            var formpanel = PatrolAreaManager.CreateFormPanel("add", pid);
            extWindow.add(formpanel);
        },
        update: function (obj) {
            var row = obj.grid.getSelectionModel().getSelection();
            if (row.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else if (row.length > 1) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            } else {
                var extWindow = ExtHelper.CreateWindow({ title: '巡防区域修改', height: 300, width: 500 });
                var formpanel = PatrolAreaManager.CreateFormPanel("up");
                formpanel.getForm().loadRecord(row[0]);
                extWindow.add(formpanel);
            }
        },
        del: function (obj) {
            var row = obj.grid.getSelectionModel().getSelection();
            if (row.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else {
                Ext.Msg.confirm(errorState.SysPrompt, "确定删除这" + row.length + "条记录吗?",
                    function (btn) {
                        if (btn == "yes") {
                            var ids = [];
                            Ext.Array.each(row, function (record) {
                                var id = record.get('Id');
                                if (id) {
                                    ids.push(id);
                                }
                            });
                            Ext.Ajax.request({
                                url: url + "3",
                                method: "POST",
                                params: { ids: ids.join(',') }, //发送的参数  
                                success: function (response, option) {
                                    response = Ext.JSON.decode(response.responseText);
                                    if (response.success == true) {
                                        obj.grid.store.load();
                                    }
                                    else { Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }
                                },
                                failure: function () { Ext.Msg.alert(errorState.SysPrompt, errorState.DeleteFail); }
                            });
                        }
                    })
            }
        },
        createTree: function () {
            var store = this.PatrolAreaTreeStore();
            var tree = new Ext.tree.TreePanel({
                model: 'Com.tigerhz.Pgis.PatrolArea',
                store: store,
                border: false,
                rootVisible: true,
                multiSelect: true,
                requestMethod: 'post',
                animate: true,
                listeners: {
                    itemclick: {
                        fn: function (view, record, item, index, e, eOpts) {
                            //debugger;
                            if (typeof (record.raw.Coordinates) != 'undefined' && typeof (record.raw.Centerx) != 'undefined' && typeof (record.raw.Centery) != 'undefined') {
                                var id = record.raw.Id + '_0';
                                var data = { coords: record.raw.Coordinates, fillcolor: '#' + record.raw.Color };
                                var center = { x: record.raw.Centerx, y: record.raw.Centery };

                                EMap.DrawPoly(id, data, center, function () {
                                    var content = '<div style="margin-top:15px;width:300px;"><div style="padding:2px;"><b>名称：</b>' + record.raw.Name + '</div><div style="padding:2px;"><b>巡防员：</b>' + record.raw.Manager + '</div><div style="padding:2px;"><b>联系电话：</b>' + record.raw.Phone + '</div><div style="padding:2px;"><b>简介：</b>' + record.raw.Remark + '</div></div>';
                                    vM.InfoWindow.Open(content, center.x, center.y);
                                });
                            }
                        }
                    }
                },
                root: {
                    text: '桐梓县'
                }
            });
            return tree;
        },
        queryForm: function (id) {
            var tree = this.createTree();
            var eid = 'extWest';
            if (typeof (id) != 'undefined') {
                eid = id;
            }
            var c = Ext.getCmp(eid);
            c.remove('PatrolAreaID');
            c.insert(1, {
                title: '巡防区域',
                id: 'PatrolAreaID',
                border: false,
                //iconCls: 'barea',
                //autoScroll: true,
                overflowX: 'hidden',
                overflowY: 'auto',
                //bodyPadding: 5,
                items: [tree]
            });
        }
    };
    return o;
})();