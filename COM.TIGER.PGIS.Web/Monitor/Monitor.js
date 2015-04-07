/// <reference path="extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/qForm.js" />
/// <reference path="common.js" />
/// <reference path="../Resources/js/common.js" />

var monitorManager = monitorManager || {};
(function ($) {
    /***************************************
    *@private params   全局私有变量
    ****************************************
    */

    var url = 'Monitor/MonitorHelp.ashx?req=';
    //结果面板容器ID
    var resultcontainerid = 'extEast';
    var imgpath = '../Resources/images/';

    /***************************************
    *@public params   公有变量
    ****************************************
    */

    //@prototype
    $.fn = $.constructor.prototype;

    /***************************************
    *@public functions   公有函数
    ****************************************
    */

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
        var defaults = { req: 'search', params: {} };
        Ext.apply(defaults, options);

        var uri = url + defaults.req + getParams(defaults.params);
        var store = ExtHelper.CreateStore({
            storeId: $.store.id,
            url: encodeURI(uri),
            model: $.model.type,
            total: true,
            pageSize: 15
        });
        return store;
    };

    $.grid = {};
    $.grid.columns = function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Name', text: '设备名称', flex: 1 },
            {
                dataIndex: 'ID', text: '', lock: true, sortable: false, width: 70, renderer: function (value, obj, record) {
                    //debugger;
                    var data = record.getData();
                    var val = JSON.stringify(data);
                    val = encodeURI(val);
                    var html = String.Format('<span class="a" onclick="monitorManager.locationCallback(\'{0}\')">定位</span>', val);
                    html += "&nbsp;&nbsp;&nbsp;&nbsp;";
                    html += String.Format('<span class="a" onclick="monitorManager.displayCallback(\'{0}\')">查看</span>', val);
                    return html;
                }
            }];
        return c;
    }();
    $.grid.Grid = function (options) {
        var defaults = { req: 'search', params: {} };
        Ext.apply(defaults, options);

        var me = this;
        me.store = $.store.Store(defaults);
        var grid = ExtHelper.CreateGridNoCheckbox({
            store: me.store,
            width: 198,
            height: 513,
            columns: me.columns,
            pager:true
        });
        return grid;
    };

    //定位
    $.locationCallback = function (obj) {
        //debugger;
        var defaults = $.model.defaults;
        var val = decodeURI(obj);
        var data = JSON.parse(val);
        Ext.apply(defaults, data);

        //绘制图像
        var html = String.Format("<img style='width:32px;height:32px;' src='{0}camera.png'  title='点击 显示详细情况' ></img>", imgpath, defaults.Name, obj);
        EMap.AppendEntity(defaults.ID, { x: defaults.X, y: defaults.Y, exX: 16, exY: 16 }, { html: html, callback: entityCallback, args: data });
        //移动到当前座标
        EMap.MoveTo(defaults.X, defaults.Y);
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

    $.query = {};
    $.query.form = qForm.getQueryForm(qForm.qFormType.monitor, submitFn);

    /***************************************
    *@private functions   全局私有函数
    ****************************************
    */

    //图标被点击回调函数
    function entityCallback(data) {
        var defaults = $.model.defaults;
        Ext.apply(defaults, data);

        //var html = String.Format('<div style="padding-top:20px; margin-left:5px; font-size:12px;"><div>设备名称：{0}</div><br /><div>设备位置：{1}</div></div>', defaults.Name, defaults.Address?defaults.Address.Content || data.Name:data.Name);
        //EMap.OpenInfoWindow({
        //    html: html,
        //    x: defaults.X,
        //    y: defaults.Y
        //});

        ExtHelper.CameraPlay(defaults);
    }

    //查询表单
    function submitFn(form) {
        //debugger;
        var c = Ext.getCmp(resultcontainerid);
        c.removeAll(true);

        var items = form.items.items;
        var params = {};
        for (var i = 0; i < items.length; i++) {
            var cp = items[i];
            params[cp.name] = cp.rawValue;
        }
        c.add($.grid.Grid({
            params: params
        }));

        if (c.collapsed) {
            c.expand();
        }
        EMap.Clear();
    }
})(monitorManager);