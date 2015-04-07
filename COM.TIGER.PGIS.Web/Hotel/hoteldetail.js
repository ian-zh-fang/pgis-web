/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Employee/Employee.js" />
/// <reference path="hotelStay.js" />

var $hoteldetail = $hoteldetail || {};

(function ($) {

    var basic_url = $.basic_url = 'Hotel/HotelHelp.ashx?req=';

    var loadEmployeeHandler = $.loadEmployeeHandler = function (c) {
        if (typeof $employee !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $employee, 'Employee/Employee.js', function () {
            c();
        });
    };

    var loadHotelStayHandler = $.loadHotelStayHandler = function (c) {
        if (typeof $hotelstay !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $hotelstay, 'Hotel/hotelStay.js', function () {
            c();
        });
    };

})($hoteldetail);

(function ($) {

    var tab = ExtHelper.CreateTabPanelFn();

    var Show = $.Show = function (options) {
        var defaults = { title: '酒店，宾馆，旅店详细信息 ...', width: 600, height: 400, layout:'fit' };
        Ext.apply(defaults, options);

        init(options);
        var window = ExtHelper.CreateWindow(defaults);
        window.on('close', function () { tab = null; });
        window.add(tab.tab);
    };

    var Form = $.Form = function (options) {
        var defaults = { ID: 0, Name: null, AddressID: 0, Tel: null, SafetyTel: null, Corporation: null, Official: null, PoliceOffcial: null, RoomCount: 0, BedCount: 0, StarLevel: 0, Disable: 0, Address:null };
        Ext.apply(defaults, options);

        var panel = new Ext.panel.Panel({
            layout: 'border',
            border: 0,
            items: [{
                layout: 'border',
                region: 'north',
                height: 100,
                border: 0,
                items: [{ layout: 'fit', region: 'north', border: 0, height: 18 },
                    {
                        region: 'center',
                        border: 0,
                        items: [{
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">酒店名称</span>：{0}", defaults.Name || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">联系电话</span>：{0}", defaults.Tel || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">联系地址</span>：{0}", defaults.Address ? defaults.Address.Content : '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }]
            }, {
                layout: 'border',
                region: 'center',
                border: 0,
                items: [{
                    region: 'north',
                    layout: 'fit',
                    height: 22,
                    border: 0,
                    style: 'border-bottom:1px solid #eee;',
                    html: '<div style="font-weight:700; height:22px; line-height:22px; color:#660000; font-size:11px; margin-left:8px;">其他</div>'
                }, {
                    layout: 'border',
                    region: 'center',
                    border: 0,
                    items: [{
                        region: 'center',
                        border: 0,
                        items: [{
                            layout: 'fit',
                            border: 0,
                            height:8
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">房间总数</span>：{0}", defaults.RoomCount ? defaults.RoomCount + ' 间' : '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">床位总数</span>：{0}", defaults.BedCount ? defaults.BedCount + ' 张' : '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">星级</span>：{0}", defaults.StarLevel ? defaults.StarLevel + ' 星' : '未评级'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">法人</span>：{0}", defaults.Corporation || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">负责人</span>：{0}", defaults.Official || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">治安负责人</span>：{0}", defaults.PoliceOffcial || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">保安部电话</span>：{0}", defaults.SafetyTel || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }]
                }]
            }]
        });

        return panel;
    };

    function init(options) {
        tab = tab || ExtHelper.CreateTabPanelFn();
        
        tab.add({ component: Form(options), title: '基本信息', closable: false });

        addEmployee(options);
        addHotelStay(options);
    }

    function addEmployee(options) {
        var defaults = { ID: 0, Name: null };
        Ext.apply(defaults, options);
        
        $hoteldetail.loadEmployeeHandler(function () {

            var grid = $employee.grid.GridGenerator({
                req: String.Format('hotel&id={0}', defaults.ID),
                html: String.Format('<span style="color:#15498b; font-size:11px; font-weight:700;">酒店名称：</span>{0}', defaults.Name),
                checkbox: false
            });
            tab.add({ component: grid.grid, closable: false, title: '从业人员' });

            var qgrid = $employee.grid.GridGenerator({
                req: String.Format('qhotel&id={0}', defaults.ID),
                html: String.Format('<span style="color:#15498b; font-size:11px; font-weight:700;">酒店名称：</span>{0}', defaults.Name),
                checkbox: false
            });
            tab.add({ component: qgrid.grid, closable: false, title: '已离职人员' });

            tab.tab.setActiveTab(0);
        });
    }

    function addHotelStay(options) {
        var defaults = { ID: 0, Name: null };
        Ext.apply(defaults, options);

        $hoteldetail.loadHotelStayHandler(function () {
            var grid = $hotelstay.grid.Grid({ req: String.Format('getonhotel&id={0}', defaults.ID) });
            tab.add({ component: grid.grid, title: '住宿人员信息', closable: false });

            tab.tab.setActiveTab(0);
        });
    }

})(Object.$Supper($hoteldetail, 'detail'));