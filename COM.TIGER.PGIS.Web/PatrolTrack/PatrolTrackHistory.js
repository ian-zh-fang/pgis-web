/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/qForm.js" />

var patroltrackHistory = patroltrackHistory || {};
(function ($) {
    //@basic uri
    var url = 'PatrolTrack/PatrolTrackHelp.ashx?req=';
    var imgpath = '../Resources/images/';
    //结果面板容器ID
    var resultcontainerid = 'extEast';

    (function (me) {
        var tp = me.type = identityManager.createId('model');
        //定义数据模型
        Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'PatrolID' },
                { name: 'Patrol' },
                { name: 'CurrentTime' },
                { name: 'Remark' },
                { name: 'PatrolMonitorID' },
                { name: 'DeviceID' },
                { name: 'Device' },
                { name: 'Track' },
                { name: 'Officer' }
            ]
        });


    })($.model = $.model || {});
    
    (function (me) {
        me.Store = function (options) {
            var defaults = { req: 'pagerecords', params: [] };
            Ext.apply(defaults, options);

            var uri = url + defaults.req + "&" + defaults.params.join('&');
            var store = ExtHelper.CreateStore({
                storeId: identityManager.createId(),
                url: encodeURI(uri),
                model: $.model.type,
                total: true,
                pageSize: 15
            });
            return store;
        }
    })($.store = $.store || {});

    (function (me) {

        var columns = me.columns = [
            {
                xtype: 'rownumberer', width: 25, sortable: false, text: '序', renderer: function (value, obj, record, index) {
                    return index + 1;
                }
            },
            {
                dataIndex: 'ID', text: '设备', flex: 1, renderer: function (value, obj, record) {
                    var data = record.getData();
                    return String.Format('<span title="{0}">{0}</span>', data.Device ? data.Device.Name : '未知');
                }
            },
            {
                dataIndex: 'ID', text: '警员', width: 45, renderer: function (value, obj, record) {
                    var data = record.getData();
                    return String.Format('<span title="{0}">{0}</span>', data.Officer ? data.Officer.Name : '未知');
                }
            },
            {
                dataIndex: 'ID', text: '', lock: true, sortable: false, width: 65, renderer: function (value, obj, record) {
                    //debugger;
                    var data = record.getData();
                    var val = Object.$EncodeObj(data);
                    var html = "<a href=\"#\" onclick=\"patroltrackHistory.detail.detailCallback('" + val + "')\" >详细</a>";
                    html += '&nbsp;&nbsp;';
                    html += "<a href=\"#\" onclick=\"patroltrackHistory.loaction('" + val + "')\" >定位</a>";
                    return html;
                }
            }
        ];

        me.Grid = function (options) {
            var defaults = { params: {} };
            Ext.apply(defaults, options);

            var store = $.store.Store(defaults);
            var grid = ExtHelper.CreateGridNoCheckbox({
                store: store,
                width: 198,
                height: 513,
                columns: columns,
                pager: true
            });
            return grid;
        };

    })($.grid = $.grid || {});

    $.loaction = function (v) {
        var data = Object.$DecodeObj(v);
        var defaults = { ID: 0, X: 0, Y: 0, Name: '' };
        Ext.apply(defaults, data.Device);

        //绘制图像
        var html = String.Format("<img style='width:32px;height:32px;' src='{0}camera.png'  title='{1} 点击打开视频播放窗口' ></img>", imgpath, defaults.Name);
        EMap.AppendEntity(defaults.ID, { x: defaults.X, y: defaults.Y, exX: 16, exY: 16 }, {
            html: html, callback: function () {
                Camera(defaults);
            }, args: data
        });
        //移动到当前座标
        //EMap.MoveTo(defaults.X, defaults.Y);
        var html = String.Format('<div style="padding-top:20px; margin-left:5px; font-size:12px;"><div>设备名称：{0}</div><br /><div>设备位置：{1}</div></div>', defaults.Name, defaults.Address ? defaults.Address.Content || defaults.Name : defaults.Name);
        EMap.OpenInfoWindow({
            html: html,
            x: defaults.X,
            y: defaults.Y
        });
    };

    var Camera = $.Camera = function (o) {
        ExtHelper.CameraPlay(o);
    };

    (function (me) {

        me.detailCallback = function (val) {
            var data = Object.$DecodeObj(val);
            detailShow(data);
        };

        //@显示详细信息
        function detailShow(options) {
            var defaults = { title: '电子巡逻历史记录详细情况...', width: 230, height: 300 };
            Ext.apply(defaults, options);

            if (me.window) {
                me.window.close();
            }

            var xy = Ext.getCmp(resultcontainerid).getXY();
            var wind = me.window = ExtHelper.CreateWindow({ modal: false, draggable: false, layout: 'fit', x:xy[0] - defaults.width - 1, y:xy[1], title: defaults.title, width: defaults.width, height: defaults.height });
            var labelwidth = 30;
            wind.add({
                layout: 'anchor',
                border: 0,
                bodyPadding: 5, defaults: {
                    anchor: '100%',
                    labelWidth: labelwidth
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '设备',
                    //labelWidth: labelwidth,
                    value: defaults.Device ? defaults.Device.Name : '未知',
                    readOnly: true
                }, {
                    xtype: 'textfield',
                    fieldLabel: '位置',
                    //labelWidth: labelwidth,
                    value: defaults.Device ? defaults.Device.AddressContext || defaults.Device.Name : '未知',
                    readOnly: true
                }, {
                    xtype: 'textfield',
                    fieldLabel: '时间',
                    //labelWidth: labelwidth,
                    value: defaults.CurrentTime,
                    readOnly: true
                }, {
                    xtype: 'textfield',
                    fieldLabel: '警员',
                    //labelWidth: labelwidth,
                    value: defaults.Officer ? defaults.Officer.Name : '未知',
                    readOnly: true
                }, {
                    xtype: 'textarea',
                    fieldLabel: '备注',
                    //labelWidth: labelwidth,
                    value: defaults.Remark,
                    height: 106,
                    readOnly: true
                }],
                //buttonAlign:'center',
                bbar: [{
                    xtype: 'button',
                    text: '关  闭',
                    handler: function () {
                        me.window = null;
                        wind.close();
                    }
                }]
            });
        }

    })($.detail = $.detail || {});

    (function (me) {

        me.form = qForm.getQueryForm(qForm.qFormType.trackRecordsQuery, formsubmitCallback);

        function formsubmitCallback(form) {
            var c = Ext.getCmp(resultcontainerid);
            c.removeAll(true);

            var params = [];
            form.items.items.Each(function (e) {
                params.push(String.Format("{0}={1}", e.name, e.rawValue));
            });

            c.add($.grid.Grid({ params: params }));

            if (c.collapsed) {
                c.expand();
            }
            EMap.Clear();
        }
    })($.form = $.form || {});

})(patroltrackHistory);