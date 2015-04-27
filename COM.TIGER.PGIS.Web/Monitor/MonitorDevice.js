/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/qForm.js" />

var $monitordevice = $monitordevice || { isInit: false };

(function ($) {

    if ($.isInit)
        return true;

    $.isInit = true;

    var basic_url = 'Monitor/MonitorHelp.ashx?req=';
    var imgpath = '../Resources/images/';

    $.show = function (options) {
        var defaults = { callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var mask = maskGenerate.start({ msg: '正在加载监控设备信息，请稍等 ...' });
        var url = Ext.util.Format.format('{0}al', basic_url);
        Ext.Ajax.request({
            url: url,
            callback: function (opts, succ, response) {
                mask.stop();
                if (!succ) {
                    errorState.show('数据获取失败！');
                    return;
                }

                var data = Ext.JSON.decode(response.responseText);
                Ext.Array.forEach(data, function (e) {
                    drawEntity(e);
                });
            }
        });
    };

    //绘制图标信息，并显示在地图上
    function drawEntity(data) {
        var defaults = {
            ID: 0, Name: null, Num: null, DeviceID: null, AddressID: 0, DeviceTypeID: 0, DeviceTypeName: null, DoTypeID: 0, DoTypeName: null, IP: null, Port: 0, Acct: null, Pwd: null, X: 0, Y: 0,
            Address: {
                ID: 0, Content: null, AdminID: 0, OwnerInfoID: 0, StreetID: 0, NumID: 0, UnitID: 0, RoomID: 0,
                Administrative: { ID: 0, Name: null, Code: null, PID: 0, FirstLetter: null, AreaID: 0, AreaName: null, Parent: null, Area: null, FullName: null, Items: [], Streets: [] },
                OwnerInfo: null, Street: null, StreetNum: null, Unit: null, Room: null
            }
        };
        Ext.apply(defaults, data);

        //绘制图像
        var html = String.Format("<img style='width:32px;height:32px;' src='{0}camera.png'  title='{1}\n点击显示详细情况' ></img>", imgpath, defaults.Name);
        EMap.AppendEntity(defaults.ID, { x: defaults.X, y: defaults.Y, exX: 16, exY: 16 }, { html: html, callback: entityCallback, args: data });
        //移动到当前座标
        EMap.MoveTo(defaults.X, defaults.Y);
    }

    //图标被点击回调函数，显示详细情况
    function entityCallback(data) {
        var defaults = {
            ID: 0, Name: null, Num: null, DeviceID: null, AddressID: 0, DeviceTypeID: 0, DeviceTypeName: null, DoTypeID: 0, DoTypeName: null, IP: null, Port: 0, Acct: null, Pwd: null, X: 0, Y: 0,
            Address: {
                ID: 0, Content: null, AdminID: 0, OwnerInfoID: 0, StreetID: 0, NumID: 0, UnitID: 0, RoomID: 0,
                Administrative: { ID: 0, Name: null, Code: null, PID: 0, FirstLetter: null, AreaID: 0, AreaName: null, Parent: null, Area: null, FullName: null, Items: [], Streets: [] },
                OwnerInfo: null, Street: null, StreetNum: null, Unit: null, Room: null
            }
        };
        Ext.apply(defaults, data);

        ExtHelper.CameraPlay(defaults);
    }

})($monitordevice);