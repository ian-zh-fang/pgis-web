/// <reference path="extjs4.2/ext-all-dev.js" />
/// <reference path="maskLoad.js" />
/// <reference path="Config.js" />
/// <reference path="common.js" />
/// <reference path="Utils.js" />

var $param = $param || {};
(function ($) {

    //在这里做一些通用的东西

})($param);

(function ($) {

    var tp = $.type = identityManager.createId('model');

    var model = $.model = Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'PID' },
            { name: 'Name' },
            { name: 'Code' },
            { name: 'Disabled' },
            { name: 'Sort' }
        ]
    });

})(Object.$Supper($param, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { storeId: identityManager.createId(), model: $param.model.type, total: false, pageSize: 15, url: null };
        Ext.apply(defaults, options);

        if (!defaults.url)
            throw new ReferenceError();

        if (typeof defaults.url !== 'string')
            throw new TypeError();

        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($param, 'store'));

(function ($) {

    var cols = $.columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return ++d; } },
        { dataIndex: 'Name', text: '名称', sortable: false, flex: 1, hidden: false },
        { dataIndex: 'Code', text: '编码', sortable: false, flex: 1, hidden: false },
        {
            dataIndex: 'Disabled', text: '启用', sortable: false, flex: 1, hidden: true, renderer: function (a, b, c) {
                if (a) return '<span style="color:darkblue;">启用</span>';

                return '<span style="color:red;">禁用</span>';
            }
        },
        { dataIndex: 'Sort', text: '排序', sortable: false, flex: 1, hidden: true }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { columns: cols, url: { grid: null, add: null, upd: null, del: null }, tool: true, pager: false, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        function constructor() {
            var me = this;

            var store = me.store = $param.store.Store({ url: defaults.url.grid, total: defaults.pager });
            var grid = me.grid = ExtHelper.CreateGrid({
                store: store, columns: defaults.columns, pager: defaults.pager,
                toolbar: {
                    enable: defaults.tool,
                    add: function () {
                        addFn(grid, defaults.url.add, function (a, b) {
                            store.load();
                            defaults.callback(a, b, me);
                        });
                    },
                    update: function () {
                        updFn(grid, defaults.url.upd, function (a, b) {
                            store.load();
                            defaults.callback(a, b, me);
                        });
                    },
                    del: function () {
                        delFn(grid, defaults.url.del, function (a, b) {
                            store.load();
                            defaults.callback(a, b, me);
                        });
                    }
                }
            });
        }

        var grid = new constructor();
        return grid;
    };

    $.Add = addFn;
    $.Update = updFn;
    $.Delete = delFn;

    function addFn(grid, url, cb) {
        $param.form.Show({ url: url, callback: cb }).show();
    }

    function updFn(grid, url, cb) {
        var rows = grid.getSelectionModel().getSelection();
        if (!rows.length) {
            errorState.show(errorState.SelectRow);
            return false;
        }
        if (rows.length > 1) {
            errorState.show(errorState.SelectOnlyRow);
            return false;
        }

        $param.form.Show({ url: url, callback: cb, data: rows[0] }).show();
    }

    function delFn(grid, url, cb) {
        var rows = grid.getSelectionModel().getSelection();
        if (!rows.length) {
            errorState.show(errorState.SelectRow);
            return false;
        }
        var ids = [];
        rows.Each(function (e) {
            ids.push(e.get('ID'));
        });

        errorState.confirmYes(String.Format('是否删除选中的 {0} 项数据?', rows.length), function () {
            Ext.Ajax.request({
                url: url,
                params: { ids: ids },
                method: 'post',
                success: function (a, b) {
                    if (cb && cb instanceof Function)
                        cb(b, true);
                },
                failure: function (a, b) {
                    errorState.show(errorState.DeleteFail);
                    if (cb && cb instanceof Function)
                        cb(b, false);
                }
            });
        });
    }

})(Object.$Supper($param, 'grid'));

(function ($) {

    var Form = $.Form = function (options) {
        var defaults = { url: null, data: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var form = ExtHelper.CreateForm({
            url: defaults.url,
            callback: function () {
                submit(form, defaults.callback);
            }
        });

        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'id',
            name: 'ID',
            value: '0'
        }, {
            xtype: 'hiddenfield',
            fieldLabel: 'pid',
            name: 'PID',
            value: '0'
        }, {
            xtype: 'textfield',
            fieldLabel: '项值名称',
            name: 'Name',
            allowBlank: false
        }, {
            xtype: 'textfield',
            fieldLabel: '项值代码',
            name: 'Code',
            allowBlank: false
        }, {
            xtype: 'textfield',
            fieldLabel: '项值排序',
            name: 'Sort',
            value: '0',
            allowBlank: false
        }, {
            xtype: 'combobox',
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
            value: 1,
            allowBlank: false
        });

        if (defaults.data)
            form.loadRecord(defaults.data);

        return form;
    };

    var Show = $.Show = function (options) {
        var defaults = { url: null, callback: Ext.emptyFn, data: null, title:'编辑信息...', width: 400, height: 200 };
        Ext.apply(defaults, options);

        function construtor() {
            var me = this;

            var form = Form(defaults);
            me.show = function () {
                var wind = me.window = ExtHelper.CreateWindow({ title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit' });
                wind.add(form);
            };
        }

        return new construtor();
    };

    function submit(form, cb) {
        if (!form.isValid())
            return false;
        var wind = form.up('window');
        var mask = maskGenerate.start({ p: wind.getId(), msg: '正在提交数据，请稍等...' });
        form.submit({
            clientValidation: true,
            success: function (form, action) {
                mask.stop();
                if (cb && cb instanceof Function)
                    cb(action, true);
                wind.close();
            },
            failure: function (form, action) {
                mask.stop();
                if (cb && cb instanceof Function)
                    cb(action, false);
                errorState.show(errorState.SubmitFail);
            }
        });
    }

})(Object.$Supper($param, 'form'));