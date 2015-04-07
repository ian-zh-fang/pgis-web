/// <reference path="extjs4.2/ext-all-dev.js" />
/// <reference path="common.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Config.js" />
var ParamManager = (function () {
    var pids = [];
    var o = {
        CreateModel: function () {
            Ext.define('Param', {
                extend: 'Ext.data.Model',
                fields: [
                    { name: 'ID' },
                    { name: 'PID' },
                    { name: 'Name' },
                    { name: 'Code' },
                    { name: 'Disabled' },
                    { name: 'Sort' },
                    { name: 'ChildParams' }
                ]
            });
        },
        GetParam: function () {
            ParamManager.CreateModel();
            var extWindow = ParamManager.wind = ExtHelper.CreateWindow({ title: '参数管理', layout: 'fit' });
            extWindow.on('close', function () { ParamManager.wind = null; });

            var store = ExtHelper.CreateStore({ storeId: 'ParamGrid', url: 'Sys/ParamHelp.ashx?req=1', model: 'Param', total: true });
            var columns = [
                { xtype: 'rownumberer', width: 25, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
                { dataIndex: 'Name', text: '参数名称', flex:1, renderer: ParamManager.renderTopic },
                { dataIndex: 'Disabled', width:55, text: '是否启用', renderer: function (a) { return a == 0 ? '<span style="color:red; font-size:11px;">禁用</span>' : '<span style="color:blue; font-size:11px;">启用</span>'; } },
                { dataIndex: 'Sort', text: '排序', width:45, hidden: true }
            ];
            var grid = ExtHelper.CreateGrid({
                store: store, columns: columns, pager: true,
                toolbar: {
                    enable: false
                }
            });
            //debugger;
            extWindow.add(grid);

        },
        renderTopic: function (value, obj, record) {
            return '<a href="#" onclick="ParamManager.GetParamValue(' + record.data.ID + ')" >' + value + '</a>';
        },
        GetParamValue: function (id) {
            ParamManager.CreateModel();
            var extWindow = ExtHelper.CreateWindow({ title: '参数项值管理', layout: 'fit' });
            extWindow.on('show', function () { ParamManager.wind.hide(); });
            extWindow.on('close', function () { ParamManager.wind.show(); });

            var store = ExtHelper.CreateStore({ storeId: 'ParamGrid', url: 'Sys/ParamHelp.ashx?req=2&id=' + id, model: 'Param', total: false });
            var columns = [
                { xtype: 'rownumberer', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1;} },
                { dataIndex: 'Name', text: '参数项名称', flex:1 },
                { dataIndex: 'Disabled', width:55, text: '是否启用', renderer: function (a) { return a == 0 ? '<span style="color:red; font-size:11px;">禁用</span>' : '<span style="color:blue; font-size:11px;">启用</span>'; } },
                { dataIndex: 'Sort', text: '排序', hidden:true }
            ];
            var grid = ExtHelper.CreateGrid({
                store: store, columns: columns, pager: false,
                toolbar: {
                    enable: true, add: ParamManager.add, update: ParamManager.update, del: ParamManager.del
                }
            });
            pids[grid.getId()] = id;
            extWindow.add(grid);
        },
        formSubmit: function (a,o,c) {
            //debugger;
            var form = a.up('form').getForm();
            
            if (!form.isValid())
                return c(false);

            // Submit the Ajax request and handle the response
            form.submit({
                success: function (form, action) {
                    //Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                    if (action.result.result > 0)
                        return c(true);

                    c(false);
                    
                    if (action.result.result == -2)
                        return errorState.show("重复的代码！");

                    errorState.show(errorState.SubmitFail);
                },
                failure: function (form, action) {
                    Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                    c(false);
                }
            });
        },
        CreateFormPanel: function (s, pid, grid) {
            var formpanel = ExtHelper.CreateForm({
                title: '', url: 'Sys/ParamHelp.ashx?req=' + s, buttonstext: '提交', callback: function (o) {
                    var me = this;
                    var wind = formpanel.up('window');
                    var mask = maskGenerate.start({ p: wind.getId(), msg: '正在提交数据，请稍等 ...' });
                    ParamManager.formSubmit(me, o, function (f) {
                        mask.stop();

                        if (!f)
                            return;

                        grid.store.load();
                        wind.close();
                    });
                }
            });
            formpanel.add({
                xtype: 'hiddenfield',
                fieldLabel: 'id：',
                name: 'ID'
            }, {
                xtype: 'hiddenfield',
                fieldLabel: 'pid：',
                name: 'PID',
                value:pid
            }, {
                xtype: 'textfield',
                fieldLabel: '项值名称',
                name: 'Name',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '项值代码',
                name: 'Code'
            }, {
                xtype: 'textfield',
                fieldLabel: '项值排序',
                name: 'Sort',
                value:'0',
                allowBlank: false
            }, {
                xtype: 'combobox',
                id: 'ParamDisabled',
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
                value:1,
                allowBlank: false
            });
            return formpanel;
        },
        add: function (obj) {
            //debugger;
            var pid = pids[obj.grid.getId()];
            var extWindow = ExtHelper.CreateWindow({ title: '参数项值添加', height: 190, width: 400 });
            var formpanel = ParamManager.CreateFormPanel("add", pid, obj.grid);
            extWindow.add(formpanel);
        },
        update: function (obj) {
            //debugger;
            var row = obj.grid.getSelectionModel().getSelection();
            if (row.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else if (row.length > 1) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectOnlyRow);
            } else {
                var extWindow = ExtHelper.CreateWindow({ title: '参数项值修改', height: 190, width: 400 });
                var formpanel = ParamManager.CreateFormPanel("up", obj.grid.getId(), obj.grid);
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
                                var id = record.get('ID');
                                if (id) {
                                    ids.push(id);
                                }
                            });
                            Ext.Ajax.request({
                                url: "Sys/ParamHelp.ashx?req=3",
                                method: "POST",
                                params: { ids: ids.join(',') }, //发送的参数  
                                success: function (response, option) {
                                    //debugger;
                                    response = Ext.JSON.decode(response.responseText);
                                    if (response.result ) {
                                        //刷新列表  
                                        obj.grid.store.load();
                                    }
                                    else { Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }
                                },
                                failure: function () {
                                    //debugger;
                                    Ext.Msg.alert(errorState.SysPrompt, errorState.DeleteFail);
                                }
                            });
                        }
                    })
            }
        }
    };
    return o;
})();