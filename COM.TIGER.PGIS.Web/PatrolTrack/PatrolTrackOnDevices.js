/// <reference path="PatrolTrackManager.js" />
/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="PatrolRecords.js" />
/// <reference path="../Resources/js/Init.js" />

var trackOnDevice = trackOnDevice || {};
(function ($) {

    EMap.Clear();

    //@basic uri
    var url = 'PatrolTrack/PatrolTrackHelp.ashx?req=';
    //图元线条ID
    var lineid = identityManager.createId();
    //图元设备ID
    var camreid = identityManager.createId('camreid');
    //监控设备图片位置
    var imgpath = '../Resources/images/';
    //@Array 保存被查看过的设备坐标值
    var deviceslooked = [];
    //@Array 保存被查看过的设备ID值
    var devicesidlooked = [];

    //已经巡逻过的设备
    $.records = null;

    //@model
    (function () {
        $.model = { type: identityManager.createId('model') };
        $.model.model = Ext.define($.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'Num' },
                { name: 'DeviceID' },
                { name: 'AddressID' },
                { name: 'DeviceTypeID' },
                { name: 'DeviceTypeName' },
                { name: 'DoTypeID' },
                { name: 'DoTypeName' },
                { name: 'IP' },
                { name: 'Port' },
                { name: 'Acct' },
                { name: 'Pwd' },
                { name: 'X' },
                { name: 'Y' },
                { name: 'Address' },
                { name: 'AdministrativeID' },
                { name: 'AdministrativeName' },
                { name: 'AddressContext' }
            ]
        });
    })();

    //@store
    (function () {
        var deviceurl = 'Monitor/MonitorHelp.ashx?req=1';
        var me = $.store = { id: identityManager.createId() };
        var store = me.store = ExtHelper.CreateStore({
            storeId: me.id,
            model: $.model.type,
            url: deviceurl,
            total: true,
            pageSize:17
        });
        store.on('load', function (storeObj, records, successful) {
            devicesidlooked = [];
            deviceslooked = [];

            EMap.Clear();
            records.Each(function (record, index) {
                var data = record.getData();
                Ext.apply(data, {/*路线信息*/TrackID: 0, TrackName: '随机巡逻线路' });
                drawGryph({
                    tickcount: index + 1,
                    data: data
                });
            });
        });

        //绘制图元信息
        function drawGryph(options) {
            var defaults = { tickcount: 0, data: { ID: 0, Name: null, Num: null, DeviceID: 0, AddressID: 0, DeviceTypeID: 0, DeviceTypeName: null, DoTypeID: 0, DoTypeName: null, IP: null, Port: 0, Acct: null, Pwd: null, X: 0, Y: 0, /*路线信息*/TrackID: 0, TrackName: '随机巡逻线路' } };
            Ext.apply(defaults, options);

            var e = defaults.data;
            if (e.X && e.Y) {
                var html = String.Format('<div style="width:32px; text-align:center;"><img style="width:32px;height:32px;" src="{0}camera.png"  title="{1}" ></img><div style="height:16px; width:16px; line-height:16px; font-size:13px; background-color:#fff;">{2}</div></div>', imgpath, e.Name, defaults.tickcount);
                EMap.AppendEntity(String.Format('{0}{1}', camreid, e.ID), { x: e.X, y: e.Y, exX: 16, exY: 16 }, {
                    html: html, callback: showDisplayWindow, args: {
                        data: e,
                        tickcount: defaults.tickcount
                    }
                });
            }
        }

        //打开视频窗口
        function showDisplayWindow(options) {
            var defaults = {
                data: {},
                tickcount: 0
            };
            Ext.apply(defaults, options, {/*警员信息*/OfficerID: x_current_user.Officer.ID, OfficerName: x_current_user.Officer.Name });

            //EMap.CloseInfoWindow();
            $.form.Show(defaults);
        }
    })();

    //@grid
    (function () {
        var me = $.grid = {};

        var columns = [
            {
                xtype: 'rownumberer', width: 30, sortable: false, text: '序', renderer: function (value, obj, record, index) {
                    return index + 1;
                }
            },
            { dataIndex: 'Name', text: '设备名称', flex: 1, sortable: false, hidden: false }
        ];

        var grid = me.grid = ExtHelper.CreateGridNoCheckbox({
            hideHeaders:true,
            store: $.store.store,
            columns: columns,
            pager: true
        });
        grid.on('select', function (row, record, index) {
            var data = record.getData();
            var html = String.Format('<div style="padding-top:20px; margin-left:5px; font-size:12px;"><div>设备名称：{0}</div><br /><div>设备位置：{1}</div></div>', data.Name, data.Address ? data.Address.Content || data.Name : data.Name);
            EMap.OpenInfoWindow({
                html: html,
                x: data.X,
                y: data.Y
            });
        });
    })();

    //@form
    (function (me) {
        //表单
        me.Form = function (options) {
            var defaults = { tickcount: 0, data: { ID: 0, Name: null, Num: null, DeviceID: 0, AddressID: 0, DeviceTypeID: 0, DeviceTypeName: null, DoTypeID: 0, DoTypeName: null, IP: null, Port: 0, Acct: null, Pwd: null, X: 0, Y: 0, /*路线信息*/TrackID: 0, TrackName: null } };
            defaults.callback = submit;
            Ext.apply(defaults, options, {/*警员信息*/OfficerID: x_current_user.Officer.ID, OfficerName: x_current_user.Officer.Name });

            var form = ExtHelper.CreateForm({
                buttonAlign: 'right',
                labelWidth: 35,
                anchor: '100%',
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
                        form: me,
                        data: defaults,
                        values: values
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
        //视频窗口
        me.DisplayPanel = function (options) {
            return ExtHelper.CreatePlayPanel(options);
        };
        //显示
        me.Show = function (options) {
            var form = me.Form(options);
            var displaypanel = me.DisplayPanel({});
            var wind = ExtHelper.CreateWindow({ title: '监控设备查看', layout: 'border', height: 373, resizable: false });
            wind.add({
                region: 'center',
                layout: 'fit',
                border: 0,
                tbar: ['视频播放区：'],
                items: [{
                    style: String.Format('margin:{0}px {0}px {0}px {0}px;', 1),
                    border: 0,
                    items: [displaypanel]
                }]
            }, {
                region: 'east',
                layout: 'fit',
                //height: 100,
                width: 250,
                border: 0,
                items: [form]
            });
        };

        //表单提交
        function submit(options) {
            var defaults = { form: null, data: {}, tickcount: 0, callback: submitCallback };
            Ext.apply(defaults, options);

            var form = defaults.form.up('form');
            var wind = form.up('window');
            form = form.getForm();
            if (form.isValid()) {
                var mask = maskGenerate.start({ p: 'extEast', msg: '正在提交，请稍等 ...' });
                form.submit({
                    success: function (form, action) {
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
                                    Officer: x_current_user.Officer
                                });

                                mask.stop();
                            });

                            wind.close();
                            defaults.callback(defaults.data);
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

        //表单提交成功回调函数
        function submitCallback(options) {
            var defaults = { tickcount: 0, data: { ID: 0, Name: null, Num: null, DeviceID: 0, AddressID: 0, DeviceTypeID: 0, DeviceTypeName: null, DoTypeID: 0, DoTypeName: null, IP: null, Port: 0, Acct: null, Pwd: null, X: 0, Y: 0, /*路线信息*/TrackID: 0, TrackName: null } };
            Ext.apply(defaults, options, {/*警员信息*/OfficerID: x_current_user.Officer.ID, OfficerName: x_current_user.Officer.Name });
            
            //此时座标组是一定存在的
            if (devicesidlooked.FindIndex(defaults.tickcount) < 0) {
                devicesidlooked.push(defaults.tickcount);
                deviceslooked.push(defaults.data.X);
                deviceslooked.push(defaults.data.Y);
            }

            drawGlyph();
        }

        //绘制图元信息，根据已经被选择的设备信息，绘制一条线路图
        function drawGlyph() {
            if (deviceslooked.length >= 4 && deviceslooked.length % 2 == 0) {
                EMap.DrawLine(lineid, { coords: deviceslooked.concat([]), color: 'ff0000' });
            }
        }

    })($.form = $.form || {});
    
    function loadRecords(cb) {
        if (typeof $patrolrecords !== 'undefined') {
            return cb(true);
        }

        LoadModlues.loadJS(typeof $patrolrecords, 'PatrolTrack/PatrolRecords.js', function () {
            cb(false);
        });
    }

})(trackOnDevice);