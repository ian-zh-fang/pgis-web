/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Init.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Tools.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/common.js" />

var $patrolrecords = $patrolrecords || {};

(function ($) {

    //结果面板容器ID
    var resultcontainerid = $.resultcontainerid = 'extEast';

    $.show = function () {
        var c = Ext.getCmp(resultcontainerid);
        c.removeAll(true);

        var grid = $.grid.Grid();
        c.add(grid.grid);

        if (c.collapsed) {
            c.expand();
        }
        
        return grid;
    };

})($patrolrecords);

(function ($) {

    var columns  = [
            { xtype: 'rownumberer', width: 25, sortable: false, text: '序', renderer: function (value, obj, record, index) { return index + 1; } },
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
                    var html = "<span class='a' onclick=\"$patrolrecords.grid.detail('" + val + "')\" >详细</span>";
                    html += '&nbsp;&nbsp;';
                    html += "<span class='a' onclick=\"$patrolrecords.grid.location('" + val + "')\" >定位</span>";
                    return html;
                }
            }
    ];
    
    $.Grid = function () {

        function constructor() {
            var records = [];

            var store = this.store = createStore()
            var grid = this.grid = ExtHelper.CreateGridNoCheckbox({ store: store, columns: columns, pager: false });

            this.add = function (data) {
                if (data)
                    records.push(data);

                if (records.length)
                    this.grid.store.loadData(records);
            };
        }

        return new constructor();
    };

    $.detail = function (v) {
        var data = Object.$DecodeObj(v);
        detailShow(data);
    };

    $.location = function (v) {
        var data = Object.$DecodeObj(v);
        data = data.Device;
        var html = String.Format('<div style="padding-top:20px; margin-left:5px; font-size:12px;"><div>设备名称：{0}</div><br /><div>设备位置：{1}</div></div>', data.Name, data.Address ? data.Address.Content || data.Name : data.Name);
        EMap.OpenInfoWindow({
            html: html,
            x: data.X,
            y: data.Y
        });
    };

    function createStore(options) {

        var defaults = { id: identityManager.createId(), url: 'PatrolTrack/PatrolTrackHelp.ashx?req=', model: $patrolrecords.model.type };
        Ext.apply(defaults, options);

        var store = Ext.create('Ext.data.Store', {
            storeId: defaults.id,
            model: defaults.model,
            //buffered: true,
            //leadingBufferZone: 20,
            //pageSize: 10,
            proxy: {
                type: 'ajax',
                url: defaults.url,  //请求的服务器地址
                reader: {
                    type: 'json',
                    root: 'result'
                },
                simpleSortMode: false
            },
            autoLoad: false
        });
        return store;
    }

    //@显示详细信息
    function detailShow(options) {
        var defaults = { title: '电子巡逻历史记录详细情况...', width: 230, height: 300 };
        Ext.apply(defaults, options);

        if ($.window) {
            $.window.close();
        }

        var xy = Ext.getCmp($patrolrecords.resultcontainerid).getXY();
        var wind = $.window = ExtHelper.CreateWindow({ modal: false, draggable: false, layout: 'fit', x: xy[0] - defaults.width - 1, y: xy[1], title: defaults.title, width: defaults.width, height: defaults.height });
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
                    $.window = null;
                    wind.close();
                }
            }]
        });
    }

})(Object.$Supper($patrolrecords, 'grid'));

(function ($) {

    var tp = $.type = identityManager.createId('model');
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

})(Object.$Supper($patrolrecords, 'model'));