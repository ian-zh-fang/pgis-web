/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/maskLoad.js" />

var officermanager = officermanager || {};
(function ($) {

    var basic_url = 'Officer/OfficerHelp.ashx?req=';

    //@ model
    (function (me) {

        var tp = me.type = identityManager.createId('model');

        var model = Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Num' },
                { name: 'Name' },
                { name: 'IdentityID' },
                { name: 'Tel' },
                { name: 'DeptID' },//隶属部门ID
                { name: 'DeptName' },
                { name: 'Gender' }
            ]
        });

    })($.model = $.model || {});

    //@ store
    (function (me) {

        var id = identityManager.createId();

        var store = me.store = ExtHelper.CreateStore({
            storeId: id,
            url: String.Format('{0}1', basic_url),
            model: $.model.type,
            total: true
        });

    })($.store = $.store || {});

    //@ grid
    (function (me) {

        var columns = [
            {
                xtype: 'rownumberer', width: 30, sortable: false, text: '序', renderer: function (value, obj, record, index) {
                    return index + 1;
                }
            },
            { dataIndex: 'ID', text: '警员标识', flex: 1, hidden: true },
            { dataIndex: 'Name', text: '警员姓名', flex: 1 },
            { dataIndex: 'Num', text: '警员编号', flex: 1 },
            { dataIndex: 'IdentityID', text: '身份证', flex: 2 },
            { dataIndex: 'Gender', text: '性别', width: 40, renderer: function (a) { return genderItems.data.items[a].get('d'); } },
            { dataIndex: 'Tel', text: '联系电话', flex: 2 }
        ];

        var grid = ExtHelper.CreateGrid({
            store: $.store.store,
            columns: columns,
            pager: true,
            toolbar: { enable: true, add: addFn, update: upFn, del: delFn }
        });

        me.Show = function () {
            var wind = me.window = ExtHelper.CreateWindow({ title: '警员信息管理...', layout: 'fit' });
            wind.add(grid);
        };

        function addFn() {
            $.form.Show({ title: '添加警员信息...', req: 'add' });
        }

        function upFn(grid) {
            var rows = grid.grid.getSelectionModel().getSelection();
            if (rows.length == 0) {
                errorState.show(errorState.SelectRow);
                return;
            }

            if (rows.length > 1) {
                errorState.show(errorState.SelectOnlyRow);
                return;
            }

            $.form.Show({ title: '修改警员信息...', req: 'up', data: rows[0] });
        }

        function delFn(grid) {
            var rows = grid.grid.getSelectionModel().getSelection();
            if (rows.length == 0) {
                errorState.show(errorState.SelectRow);
                return;
            }

            errorState.confirmYes(String.Format("确定删除这 {0} 条记录吗?", rows.length), function () {
                startMask({ p: me.window.getId() });
                var ids = [];
                Ext.Array.each(rows, function (record) {
                    var id = record.get('ID');
                    if (id) {
                        ids.push(id);
                    }
                });
                Ext.Ajax.request({
                    url: String.Format("{0}del", basic_url),
                    method: "POST",
                    params: { ids: ids.join(',') }, //发送的参数  
                    success: function (response, option) {
                        stopMask();
                        var response = Ext.JSON.decode(response.responseText);
                        if (response.success && response.result && response.result > 0) {
                            $.store.store.load();
                        } else {
                            errorState.show(errorState.DeleteFail);
                        }
                    },
                    failure: function () {
                        stopMask();
                        errorState.show(errorState.DeleteFail);
                    }
                });
            });
        }

    })($.grid = $.grid || {});

    //@ form
    (function (me) {

        me.Form = function (options) {
            var defaults = { title: '编辑警员信息...', req: '', data: null, callback:Ext.emptyFn };
            Ext.apply(defaults, options);

            var form = ExtHelper.CreateForm({
                url: String.Format('{0}{1}', basic_url, defaults.req),
                callback: function () {
                    var btn = this;
                    submit({ button: btn, callback: defaults.callback });
                }
            });
            var deptid = identityManager.createId();
            form.add({
                xtype: 'hiddenfield',
                fieldLabel: '警员标识',
                name: 'ID',
                value: '0'
            }, {
                xtype: 'textfield',
                fieldLabel: '警员姓名',
                //emptyText: '请输入警员姓名',
                name: 'Name',
                value: '',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '警员编号',
                //emptyText: '请输入警员编号',
                name: 'Num',
                value: '',
                allowBlank: false
            }, {
                xtype: 'combobox',
                id: 'UserGender',
                fieldLabel: '警员性别',
                name: 'Gender',
                hiddenName: 'Gender',
                store: genderItems,
                queryMode: 'local',
                displayField: 'd',
                valueField: 'v',
                //emptyText: '请选择',
                forceSelection: true,// 必须选择一个选项
                //blankText: '请选择',
                triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
                selectOnFocus: true,
                allowBlank: false,
                value: 1
            }, {
                xtype: 'textfield',
                fieldLabel: '身份证',
                //emptyText: '请输入身份证',
                name: 'IdentityID',
                value: '',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '联系电话',
                //emptyText: '请输入联系电话',
                name: 'Tel',
                value: ''
            }, {
                xtype: 'combotree',
                url: 'Sys/DepartmentHelp.ashx?req=1',
                name: 'DeptName',
                valueField: 'ID',
                displayField: 'Name',
                fieldLabel: '隶属部门',
                allowBlank: false,
                value: '',
                itemSelected: function (options) {
                    var defaults = { ID: 0, Name: '' };
                    Ext.apply(defaults, options);

                    form.getComponent(deptid).setValue(defaults.ID);
                }
            },{
                xtype: 'hiddenfield',
                fieldLabel: '部门ID',
                id:deptid,
                name: 'DeptID',
                value: 0
            });

            if (defaults.data) {
                form.loadRecord(defaults.data);
            }

            return form;
        };

        me.Show = function (options) {
            var defaults = {
                title: '编辑警员信息...', req: '', data: null, callback: function () {
                    wind.close();
                }
            };
            Ext.apply(defaults, options);

            var wind = me.window = ExtHelper.CreateWindow({
                title: defaults.title, width: 400, height: 243,
                listeners: {
                    'close': function () {
                        $.grid.window.show();
                    },
                    'show': function () {
                        $.grid.window.hide();
                    }
                }
            });
            wind.add(me.Form(defaults));
        };
        
        function submit(options) {
            var defaults = { button: null, callback: Ext.emptyFn };
            Ext.apply(defaults, options);

            var form = defaults.button.up('form').getForm();
            if (form.isValid()) {
                startMask({ p: me.window.getId() });
                form.submit({
                    success: function (form, action) {
                        stopMask();
                        var response = Ext.JSON.decode(action.response.responseText);
                        if (response.success && response.result && response.result > 0) {
                            $.store.store.load();
                            defaults.callback();
                        } else if (response.success && response.result && response.result == -2) {
                            errorState.show('重复的警号!');
                        } else {
                            errorState.show(errorState.SubmitFail);
                        }
                    },
                    failure: function (form, action) {
                        stopMask();
                        errorState.show(errorState.SubmitFail);
                    }
                });
            }
        }

    })($.form = $.form || {});



    function startMask(options) {
        var defaults = { p: Ext.getBody(), msg: '正在提交...' };
        Ext.apply(defaults, options);

        maskHandler.mask.Show(defaults);
    }

    function stopMask() {
        maskHandler.mask.Hide();
    }

})(officermanager);