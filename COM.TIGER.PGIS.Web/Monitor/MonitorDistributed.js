/// <reference path="../Resources/js/extjs4.2/ext-all.js" />
/// <reference path="../Resources/js/qForm.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/Utils.js" />

var monitorDistributed = monitorDistributed || {};
(function ($) {
    
    var url = 'Monitor/MonitorHelp.ashx?req=';
    var imgpath = '../Resources/images/';
    //结果面板容器ID
    var resultcontainerid = 'extEast';

    //原型
    $.fn = $.constructor.prototype;

    $.model = { type: String.Format("model_{0}", new Date().getTime()) };
    $.model.model = function () {
        var m = Ext.define($.model.type, {
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
                { name: 'Address' }
            ]
        });
        $.model.defaults = {
            ID: 0, Name: null, Num: null, DeviceID: null, AddressID: 0, DeviceTypeID: 0, DeviceTypeName: null, DoTypeID: 0, DoTypeName: null, IP: null, Port: 0, Acct: null, Pwd: null, X: 0, Y: 0,
            Address: {
                ID: 0, Content: null, AdminID: 0, OwnerInfoID: 0, StreetID: 0, NumID: 0, UnitID: 0, RoomID: 0,
                Administrative: { ID: 0, Name: null, Code: null, PID: 0, FirstLetter: null, AreaID: 0, AreaName: null, Parent: null, Area: null, FullName: null, Items: [], Streets: [] },
                OwnerInfo: null, Street: null, StreetNum: null, Unit: null, Room: null
            }
        };
        return m;
    }();

    $.store = { id: String.Format("store_{0}", new Date().getTime()) };
    $.store.Store = function (options) {
        var defaults = { req: 'coords', params: {} };
        Ext.apply(defaults, options);

        var uri = url + defaults.req + getParams(defaults.params);
        var store = ExtHelper.CreateStore({
            storeId: $.store.id,
            url: encodeURI(uri),
            model: $.model.type,
            //total: true,
            pageSize: 15
        });
        store.on('load', function (obj, records, successful) {
            for (var i = 0; i < records.length; i++)
            {
                var data = records[i].getData();
                drawEntity(data);
            }
        });
        return store;
    };

    $.grid = {};
    $.grid.columns = function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Name', text: '设备名称', flex: 1 },
            {
                dataIndex: 'ID', text: '操作', lock: true, sortable: false, width: 70, renderer: function (value, obj, record) {
                    //debugger;
                    var data = record.getData();
                    var val = JSON.stringify(data);
                    val = encodeURI(val);
                    var html = String.Format('<span class="a" onclick="monitorDistributed.locationCallback(\'{0}\')">定位</span>', val);
                    html += "&nbsp;&nbsp;&nbsp;&nbsp;";
                    html += String.Format('<span class="a" onclick="monitorDistributed.displayCallback(\'{0}\')">查看</span>', val);
                    return html;
                }
            }];
        return c;
    }();
    $.grid.Grid = function (options) {
        var defaults = { req: 'coords', params: {} };
        Ext.apply(defaults, options);

        var me = this;
        me.store = $.store.Store(defaults);
        var grid = ExtHelper.CreateGridNoCheckbox({
            store: me.store,
            width: 198,
            height: 513,
            columns: me.columns
            //,
            //pager: true
        });
        return grid;
    };

    $.query = {};
    $.query.form = qForm.getQueryForm(qForm.qFormType.panelQuery, panelQueryCallback);

    //定位
    $.locationCallback = function (obj) {
        //debugger;
        var defaults = $.model.defaults;
        var val = decodeURI(obj);
        var data = JSON.parse(val);

        drawEntity(data);
        var html = String.Format('<div style="padding-top:20px; margin-left:5px; font-size:12px;"><div>设备名称：{0}</div><br /><div>设备位置：{1}</div></div>', defaults.Name, defaults.Address ? defaults.Address.Content || data.Name : data.Name);
        EMap.OpenInfoWindow({
            html: html,
            x: defaults.X,
            y: defaults.Y
        });
    };

    //查看视频
    $.displayCallback = function (obj) {
        var val = decodeURI(obj);
        var data = JSON.parse(val);

        ExtHelper.CameraPlay(data);
    }

    //获取到座标，从后台获取数据，并呈现
    function panelQueryCallback(coords) {
        //清楚各项图层信息
        EMap.Clear();
        var c = Ext.getCmp(resultcontainerid);
        c.removeAll(true);
        c.add($.grid.Grid({
            req:String.Format("coords&coords={0}", coords)
        }));
        if (c.collapsed) {
            c.expand();
        }
    }

    //获取得到座标信息，并绘制
    function ajaxqueryCallback(devices) {
        //debugger;
        for (var i = 0; i < devices.length; i++) {
            drawEntity(devices[i]);
        }
    }

    //绘制图标信息，并显示在地图上
    function drawEntity(data) {
        var defaults = $.model.defaults;
        Ext.apply(defaults, data);

        //绘制图像
        var html = String.Format("<img style='width:32px;height:32px;' src='{0}camera.png'  title='点击显示详细情况' ></img>", imgpath, defaults.Name);
        EMap.AppendEntity(defaults.ID, { x: defaults.X, y: defaults.Y, exX: 16, exY: 16 }, { html: html, callback:entityCallback,args:data });
        //移动到当前座标
        EMap.MoveTo(defaults.X, defaults.Y);
    }

    //图标被点击回调函数，显示详细情况
    function entityCallback(data) {
        var defaults = $.model.defaults;
        Ext.apply(defaults, data);

        //var html = String.Format('<div style="padding-top:20px; margin-left:5px; font-size:12px;"><div>设备名称：{0}</div><br /><div>设备位置：{1}</div></div>', defaults.Name, defaults.Address.Content);
        //EMap.OpenInfoWindow({
        //    html: html,
        //    x: defaults.X,
        //    y: defaults.Y
        //});
        ExtHelper.CameraPlay(defaults);
    }

})(monitorDistributed);