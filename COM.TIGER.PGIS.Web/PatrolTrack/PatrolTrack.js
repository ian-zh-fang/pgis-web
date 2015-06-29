/// <reference path="PatrolTrackManager.js" />
/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/Init.js" />
/// <reference path="PatrolRecords.js" />

var patroltrack = patroltrack || {};
(function ($) {

    EMap.Clear();

    //@private param

    //@basic uri
    var url = 'PatrolTrack/PatrolTrackHelp.ashx?req=';
    //@Array 保存被查看过的设备信息
    var deviceslooked = [];
    //图元线条ID
    var lineid = identityManager.createId();
    //图元设备ID
    var camreid = identityManager.createId('camreid');
    //监控设备图片位置
    var imgpath = '../Resources/images/';

    //@public

    //@prototype
    $.fn = $.constructor.prototype;
    //已经巡逻过的设备
    $.records = null;

    //@model
    $.model = { type: identityManager.createId('model') };
    $.model.model = function () {
        var model = Ext.define($.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'SettedTime' },
                { name: 'UpdatedTime' },
                { name: 'Devices' }//设备信息
            ]
        });
        $.model.defaults = { ID: 0, Name: null, SettedTime: null, UpdatedTime: null, Devices: [] };
        return model;
    }();

    //@store
    $.store = { id: identityManager.createId() };
    $.store.store = function () {
        var store = ExtHelper.CreateStore({
            storeId: $.store.id,
            url: String.Format('{0}track', url),
            model: $.model.type,
            total: true,
            pagerSize:15
        });
        return store;
    }();

    //@grid
    $.grid = {};
    $.grid.columns = function () {
        var columns = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'ID', text: '路线标识', flex: 1, sortable: false, hidden: true },
            {
                dataIndex: 'Name', text: '路线', flex: 1, renderer: function (value, obj, record) {
                    return value;
                }
            },
            {
                dataIndex: 'SettedTime', text: '设置时间', sortable: false, hidden: true, renderer: function (value, obj, record) {
                    return value;
                }
            },
            {
                dataIndex: 'UpdatedTime', text: '更新时间', sortable: false, hidden: true, renderer: function (value, obj, record) {
                    return value;
                }
            }
        ];
        return columns;
    }();
    $.grid.grid = function () {
        var grid = ExtHelper.CreateGrid({
            columns: $.grid.columns,
            store: $.store.store,
            pager: true,
            hideHeaders: true,
            listeners: {
                'select': function (row, record, index) {
                    EMap.Clear();
                    deviceslooked = [];
                    var data = record.getData();
                    drawGlyph(data);
                },
                'deselect': function (row, record, index) {
                    EMap.Clear();
                }
            }
        });
        return grid;
    }();

    //@form
    $.form = {};
    $.form.Form = function (options) {
        var defaults ={tickcount:0, data:{ ID: 0, Name: null, Num: null, DeviceID: 0, AddressID: 0, DeviceTypeID: 0, DeviceTypeName: null, DoTypeID: 0, DoTypeName: null, IP: null, Port: 0, Acct: null, Pwd: null, X: 0, Y: 0, /*路线信息*/TrackID: 0, TrackName: null }};
        defaults.callback = submit;
        Ext.apply(defaults, options, {/*警员信息*/OfficerID: x_current_user.Officer.ID, OfficerName: x_current_user.Officer.Name });

        var form = ExtHelper.CreateForm({
            buttonAlign: 'right',
            labelWidth: 35,
            anchor:'100%',
            url: String.Format('{0}formsubmit', url),
            callback: function () {
                var me = this;

                var values = {};
                for (var i = 0; i < form.items.items.length; i++) {
                    var x = form.items.items[i];
                    values[x.name] = x.rawValue;
                }

                defaults.callback({
                    tickcount: defaults.tickcount,
                    form:form,
                    data: defaults,
                    values:values
                });
            }
        });
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: '警员ID',
            name: 'PatrolID',
            value: defaults.OfficerID
            
        }, {
            xtype: 'textfield',
            fieldLabel: '警员',
            height: 22,
            name: 'Patrol',
            allowBlank: false,
            value: defaults.OfficerName,
            readOnly: true
        }, {
            xtype: 'hiddenfield',
            fieldLabel: '线路ID',
            name: 'PatrolMonitorID',
            value: defaults.data.TrackID
        }, {
            xtype: 'textfield',
            fieldLabel: '线路',
            height: 22,
            name: 'TrackName',
            allowBlank: false,
            value: defaults.data.TrackName,
            readOnly: true
        }, {
            xtype: 'hiddenfield',
            fieldLabel: '设备ID',
            name: 'DeviceID',
            value: defaults.data.ID
        }, {
            xtype: 'textfield',
            fieldLabel: '设备',
            height: 22,
            name: 'DeviceName',
            allowBlank: false,
            value: defaults.data.Name,
            readOnly: true
        }, {
            xtype: 'textarea',
            fieldLabel: '备注',
            name: 'Remark',
            height: 206,
            allowBlank: false,
            value: '正常'
        });

        return form;
    };
    $.form.DisplayPanel = function (options) {
        return ExtHelper.CreatePlayPanel(options);
    };
    $.form.Show = function (options) {
        var me = this;        
        var form = me.Form(options);
        var displaypanel = me.DisplayPanel({
            width: 350,
            height: 370,
            callback: function () {
                DoStopPlay();
                DoLogout();
                ExtHelper.CameraPlayEx(options.data);
            }
        });
        var wind = ExtHelper.CreateWindow({ title: '监控设备查看', layout: 'border', height: 373, resizable: false });
        wind.on('close', function () {
            DoStopPlay();
            DoLogout();
        });
        wind.add({
            region: 'west',
            //layout: 'fit',
            width: 350,
            height: 370,
            border: 0,
            tbar: ['视频播放区：'],
            items: [{
                width: 350,
                height: 370,
                style: String.Format('margin:{0}px {0}px {0}px {0}px;', 1),
                border: 0,
                items: [displaypanel]
            }]
        }, {
            region: 'center',
            layout: 'fit',
            //height: 100,
            //width: 250,
            border: 0,
            items: [form]
        });
    };

    //@public function    

    //@private function

    //表单提交
    function submit(options) {
        var defaults = { form: null, tickcount: 0, callback: Ext.emptyFn, data: {}, values: { Remark: '' } };
        Ext.apply(defaults, options);

        var wind = defaults.form.up('window');
        var form = defaults.form.getForm();
        if (form.isValid()) {
            var mask = maskGenerate.start({ p: 'extEast', msg: '正在提交，请稍等 ...' });
            form.submit({
                success: function (a, action) {
                    if (action.result.result > 0) {

                        loadRecords(function (f) {

                            if (!$.records) {
                                $.records = $patrolrecords.show();
                            }

                            $.records.add({
                                ID: 0,
                                PatrolID: defaults.data.OfficerID,
                                Patrol: defaults.data.OfficerName,
                                CurrentTime: new Date().toLocaleTimeString(),
                                Remark: defaults.values.Remark,
                                PatrolMonitorID: defaults.data.data.TrackID,
                                DeviceID: defaults.data.data.ID,
                                Device: defaults.data.data,
                                Track: null,
                                Officer:x_current_user.Officer
                            });
                            mask.stop();
                        });
                        
                        wind.close();
                        deviceslooked[defaults.tickcount] = defaults.tickcount + 1;
                        defaults.callback();

                    } else {

                        mask.stop();
                        errorState.show(errorState.SubmitFail);
                    }
                },
                failure: function (form, action) {

                    mask.stop();
                    errorState.show(action.result ? action.result.message : errorState.SubmitFail);
                }
            });
        }
    }

    //绘制图元
    function drawGlyph(data) {
        EMap.Clear();
        var tickcount = 0;
        var coords = [];
        data.Devices.Each(function (e) {
            if (e) {
                coords.push(e.X);
                coords.push(e.Y);
            }
        });
        if (coords.length > 0) {
            //绘制线条
            EMap.DrawLine(lineid, { coords: coords, color: 'ff0000' });
        }

        data.Devices.Each(function (e) {
            if (e) {
                e.TrackID = data.ID;
                e.TrackName = data.Name;

                var html = String.Format('<div style="width:32px; text-align:center;"><img style="width:32px;height:32px;" src="{0}camera.png"  title="{1}" ></img><div style="height:16px; width:16px; line-height:16px; font-size:13px; background-color:#fff;">{2}</div></div>', imgpath, e.Name, ++tickcount);
                EMap.AppendEntity(String.Format('{0}-{1}', camreid, e.ID), { x: e.X, y: e.Y, exX: 16, exY: 16 }, {
                    html: html, callback: showDisplayWindow, args: {
                        data: e,
                        tickcount: tickcount - 1
                    }
                });
            }
        });
    }

    //打开视频窗口
    function showDisplayWindow(options) {
        var defaults = {
            data: {},
            tickcount: 0
        };
        Ext.apply(defaults, options);

        if (defaults.tickcount == 0) {
            //显示当前设备信息
            $.form.Show(defaults);
            return;
        }

        if (defaults.tickcount && deviceslooked[defaults.tickcount - 1]) {
            //显示当前设备信息
            $.form.Show(defaults);
            return;
        }
        //上一级设备没有查看，或者没有提交查看的设备记录信息，所以当前设备信息禁止打开
        errorState.show(String.Format('请按照巡逻线路依次查看设备信息。<br /><br />优先查看设备编号为 {0}<br /><br />当前设备编号为 {1}', deviceslooked.length ? deviceslooked[deviceslooked.length - 1] + 1 : 1, defaults.tickcount + 1));
    }
   
    function loadRecords(cb) {
        if (typeof $patrolrecords !== 'undefined') {
            return cb(true);
        }

        LoadModlues.loadJS(typeof $patrolrecords, 'PatrolTrack/PatrolRecords.js', function () {
            cb(false);
        });
    }

})(patroltrack);