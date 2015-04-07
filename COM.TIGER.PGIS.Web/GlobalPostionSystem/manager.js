/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Resources/js/maskLoad.js" />

//GPS绑定信息管理

var $gpsmanager = $gpsmanager || { isInit: false };

(function ($) {

    if ($.isInit)
        return true;
    
    //获取警员模块
    function getOfficer() {
        var me = {};

        var tp = me.type = Ext.id('model');
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
        var id = Ext.id();
        var store = me.store = ExtHelper.CreateStore({
            storeId: id,
            url: 'Officer/OfficerHelp.ashx?req=all',
            model: tp,
            total: false
        });

        return me;
    }

    function submitCallback(options) {
        var defaults = {
            form: null,
            action: {
                response: {
                    status: 0
                },
                result: {
                    msg: '',
                    result: null,
                    success: false
                }
            },
            window: null,
            callback: Ext.emptyFn
        };
        Ext.apply(defaults, options);

        if (defaults.action.result && defaults.action.result.result == -2) {
            errorState.show("设备，或者警员，或者车牌已经存在。");
            return 0;
        }

        if (defaults.action.result && defaults.action.result.result) {
            defaults.window.close();
            defaults.callback(defaults);
            return 0;
        }

        errorState.show(defaults.action.result ? defaults.action.result.msg : "啊哦，出错了！");
    }

    function addAction(btn) {
        $.form.Show({
            req: 'add',
            callback: function (options) {
                Ext.apply(options, {
                    callback: function () {
                        var store = btn.grid.getStore();
                        store.load();
                    }
                });
                submitCallback(options);
            }
        });
    }

    function updateAction(btn) {
        var r = btn.grid.getSelectionModel().getSelection();
        if (r.length == 0) {
            errorState.show(errorState.SelectRow);
        } else if (r.length > 1) {
            errorState.show(errorState.SelectOnlyRow);
        } else {
            $.form.Show({
                req: 'mod',
                data:r[0],
                callback: function (options) {
                    Ext.apply(options, {
                        callback: function () {
                            var store = btn.grid.getStore();
                            store.load();
                        }
                    });
                    submitCallback(options);
                }
            });
        }
    }

    function delAction(btn) {
        var r = btn.grid.getSelectionModel().getSelection();
        if (r.length == 0) {
            errorState.show(errorState.SelectRow);
        } else {
            Ext.Msg.confirm(errorState.SysPrompt, "确定删除这" + r.length + "条记录吗?",
                function (button) {
                    if (button == "yes") {
                        var mask = maskGenerate.start({ p: btn.grid.getId(), msg: '正在删除，请稍等...' });
                        var ids = [];
                        Ext.Array.each(r, function (record) {
                            var id = record.get('DeviceID');
                            if (id) {
                                ids.push(id);
                            }
                        });
                        Ext.Ajax.request({
                            url: Ext.util.Format.format("{0}del", $gpsmanager.basic_url),
                            method: "POST",
                            params: { ids: ids.join(',') }, //发送的参数  
                            success: function (response, option) {
                                mask.stop();
                                response = Ext.JSON.decode(response.responseText);
                                if (response.success == true) {
                                    if (response.result) {
                                        btn.grid.getStore().load();
                                    } else {
                                        errorState.show(errorState.DeleteFail);
                                    }
                                }
                                else {
                                    errorState.show(response.msg);
                                }
                            },
                            failure: function () {
                                mask.stop();
                                errorState.show(errorState.DeleteFail);
                            }
                        });
                    }
                })
        }
    }

    $.model = Ext.id("model");
    Ext.define($.model, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'DeviceID' },
            { name: 'OfficerID' },
            { name: 'BindTime' },
            { name: 'CarID' },
            { name: 'CarNum' },
            { name: 'Number' },
            { name: 'ProvinceLessName' },
            { name: 'DType' }
        ]
    });

    var imgpath = $.imgpath = '../Resources/images/';
    $.basic_url = 'GlobalPostionSystem/GpsHandler.ashx?req=';
    
    $.officer = null;//警员模块，该对象将在Grid完成加载并且在窗口上显示之后创建。

    $.Grid = function (options) {
        var defaults = {
            req: null,
            params: {},
            pager: true,
            pageSize:7,
            loaded: Ext.emptyFn,
            add: Ext.emptyFn,
            update: Ext.emptyFn,
            del: Ext.emptyFn,
            toolbar:true,
            model: $.model,
            columns: [
                { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
                { dataIndex: 'DeviceID', text: '设备编号', align: 'center', flex: 1, sortable: false, hidden: false },
                {
                    dataIndex: 'OfficerID', text: '警员编号', align: 'center', flex: 1, sortable: false, hidden: false, renderer: function (a, b, c) {
                        return a || '——';
                    }
                },
                {
                    dataIndex: 'CarNum', text: '车牌号', align: 'center', flex: 1, sortable: false, hidden: false, renderer: function (a, b, c) {
                        var dat = c.getData();
                        return dat.Number ? a : '——';
                    }
                },
                { dataIndex: 'BindTime', text: '绑定时间', align: 'center', width: 130, sortable: false, hidden: false },
                {
                    dataIndex: 'DType', text: '绑定类型', align: 'center', width: 60, sortable: false, hidden: false, renderer: function (a, b, c) {
                        var dat = c.getData();
                        var imgname = 'policeman.png';
                        if (a == 2) {
                            imgname = 'police.png';
                        }

                        var html = Ext.util.Format.format('<div style="text-align:center; cursor:pointer;"><img style="width:23px;height:23px;" src="{0}{1}"  title="{2}" ></img></div>', imgpath, imgname, dat.OfficerID || dat.CarNum);
                        return html;
                    }
                }
            ]
        };
        Ext.apply(defaults, options);

        var store = ExtHelper.CreateStore({
            storeId: Ext.id(),
            model: defaults.model,
            url: Ext.util.Format.format("{0}{1}", $.basic_url, defaults.req),
            total: defaults.pager,
            pageSize:defaults.pageSize,
            params: defaults.params,
            listeners: {
                'load': function (s, records, successful, eOpts) {
                    Ext.Array.each(records, function (record, index, arr) {
                        var dat = record.getData();
                        defaults.loaded(dat);
                    });
                }
            }
        });

        var querytype = 1;//查询方式：1-设备编号；2-警员编号；3-车牌号。
        var grid = ExtHelper.CreateGrid({
            store: store,
            columns: defaults.columns,
            pager: defaults.pager,
            toolbar: {
                enable: defaults.toolbar,
                add: defaults.add,
                update: defaults.update,
                del: defaults.del,
                items: ['->', {
                    xtype: 'combobox',
                    store: new Ext.data.SimpleStore({
                        fields: ['v', 'd'],
                        data: [
                            [1, '设备编号'],
                            [2, '警员编号'],
                            [3, '车牌号']
                        ]
                    }),
                    queryMode: 'local',
                    displayField: 'd',
                    valueField: 'v',
                    forceSelection: true,
                    editable: false,
                    triggerAction: 'all',
                    allowBlank: false,
                    width:80,
                    value:1,
                    listeners: {
                        'change': function (obj, value, eOpts) {
                            querytype = value;
                        }
                    }
                }, {
                    xtype: 'trigger',
                    triggerCls: 'x-form-search-trigger',
                    onTriggerClick: function () {
                        var me = this;
                        var value = me.getRawValue();
                        var pa = { num: value };

                        var req = "pgallbind";
                        switch (querytype) {
                            case 1:
                                req = "pgbindatnum";
                                break;
                            case 2:
                                req = "pgbindatoff";
                                break;
                            case 3:
                                req = "pgbindatcar";
                                break;
                            default:
                                break;
                        }
                        if (!value)
                            req = "pgallbind";

                        Ext.apply(store.proxy.extraParams, pa);
                        store.proxy.url = encodeURI(Ext.util.Format.format('{0}{1}', $.basic_url, req));
                        
                        store.load();
                    },
                    width: 200,
                    emptyText: '输入大楼名称，快速检索',
                    enableKeyEvents: true
                }]
            }
        });

        return grid;
    };

    $.Show = function (options) {
        var defaults = {
            title: 'GPS 单兵作战设备绑定信息管理',
            width: 640,
            height: 360,
            req: null,
            params: {},
            loaded: Ext.emptyFn,
            resizable: false,
            draggable: false,
            add: addAction,
            update: updateAction,
            del:delAction
        };
        Ext.apply(defaults, options);

        var grid = $.Grid({
            req: defaults.req,
            params: defaults.params,
            loaded: defaults.loaded,
            add: defaults.add,
            update: defaults.update,
            del:defaults.del
        });

        var wind = ExtHelper.CreateWindow({
            title: defaults.title,
            width: defaults.width,
            height: defaults.height,
            layout: 'fit',
            resizable: defaults.resizable,
            draggable: defaults.draggable,
            listeners: {
                'show': function () {
                    $.officer = $.officer || getOfficer();
                },
                'close': function () {
                    $.officer = null;
                    delete $.officer;
                }
            }
        });
        wind.add(grid);
        return wind;
    };

    return $.isInit = true;

})($gpsmanager);

(function ($) {

    if ($.isInit)
        return true;
        
    function submitAction(options) {
        var defaults = {
            form: null,
            req: null,
            callback: Ext.emptyFn,
            p: null
        };
        Ext.apply(defaults, options);
        var wind = defaults.form.up('window');
        defaults.p = wind.getId();

        if (defaults.form.isValid()) {

            var mask = maskGenerate.start({ p: defaults.p, msg: '正在提交，请稍后...' });
            defaults.form.submit({
                clientValidation: true,
                url: String.Format('{0}{1}', $gpsmanager.basic_url, defaults.req),
                success: function (form, action) {
                    defaults.callback(action, wind);
                    mask.stop();
                },
                failure: function (form, action) {
                    mask.stop();
                    defaults.callback(action, wind);
                }
            });
        }
    }

    $.Form = function (options) {
        var defaults = {
            req: '',
            data: null,
            callback: Ext.emptyFn
        };
        Ext.apply(defaults, options);

        var form = ExtHelper.CreateForm({
            callback: function () {
                submitAction({
                    form: form, req: defaults.req, callback: function (a, w) {
                        defaults.callback({ form: form, action: a, window:w });
                    }
                });
            }
        });

        var nameid = Ext.id('textbox');
        var deviceid = Ext.id('textbox');
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'ID',
            name: 'ID',
            value: '0'
        }, {
            xtype: 'combobox',
            id: identityManager.createId(),
            fieldLabel: '警员编号',
            name: 'OfficerID',
            hiddenName: 'OfficerID',
            store: $gpsmanager.officer.store,
            queryMode: 'local',
            displayField: 'Num',
            valueField: 'Num',
            emptyText: '',
            forceSelection: false,// 必须选择一个选项
            //editable: false,
            blankText: '',
            triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
            selectOnFocus: true,
            allowBlank: true,
            listeners: {
                'change': function (a, b, c) {

                    if (a.lastSelection && a.lastSelection.length > 0) {
                        var data = a.lastSelection[0].getData();
                        form.getComponent(nameid).setValue(data.Name);
                    }
                },
                'blur': function (a,b,c) {
                    var val = a.getValue();
                    if (!val) {
                        form.getComponent(nameid).setValue("");
                    }
                }
            }
        }, {
            xtype: 'textfield',
            fieldLabel: '警员姓名',
            emptyText: '',
            id: nameid,
            name: 'Name',
            readOnly: true,
            allowBlank: true
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: '车牌号',
            layout: 'hbox',
            anchor: '100%',
            items: [{
                xtype: 'combobox',
                store: provinceLessNamesStore,
                name: 'ProvinceLessName',
                hiddenName: 'ProvinceLessName',
                queryMode: 'local',
                displayField: 'd',
                valueField: 'v',
                forceSelection: true,
                editable: false,
                triggerAction: 'all',
                allowBlank: true,
                value: '贵',
                width:70
            }, {
                xtype: 'textfield',
                emptyText: '',
                name: 'Number',
                id:deviceid,
                width: '68%',
                regex: /^[a-zA-z]{1}[a-zA-z0-9]{5}$/,
                allowBlank: true
            }]
        }, {
            xtype: 'textfield',
            fieldLabel: '设备编号',
            name: 'DeviceID',
            regex: /^[a-zA-z0-9]{1}[a-zA-z0-9-]{0,}$/,
            allowBlank: false
        });

        if (defaults.data)
            form.loadRecord(defaults.data);

        return form;
    };

    $.Show = function (options) {
        var defaults = {
            title: '编辑 GPS 单兵作战设备绑定信息',
            width: 400,
            height: 200,
            req: null,
            data: null,
            callback: Ext.emptyFn
        };
        Ext.apply(defaults, options);

        var form = $.Form({
            req: defaults.req,
            data: defaults.data,
            callback: defaults.callback
        });

        var wind = ExtHelper.CreateWindow({
            title: defaults.title,
            width: defaults.width,
            height: defaults.height,
            layout: 'fit',
            resizable: false,
            draggable: false
        });
        wind.add(form);

        return wind;
    };

    return $.isInit = true;

})($gpsmanager.form = $gpsmanager.form || { isInit: false });