/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Population/populationDetail.js" />
/// <reference path="hotelStay.js" />

var $hotelstaydetail = $hotelstaydetail || {};

(function ($) {

    var basic_url = $.basic_url = 'Hotel/HotelHelp.ashx?req=';

    var loadPopulationHandler = $.loadPopulationHandler = function (callback) {
        if (typeof $populationdetail !== 'undefined')
            return callback();

        LoadModlues.loadJS(typeof $populationdetail, 'Population/populationDetail.js', function () {
            callback();
        });
    };

    var loadStay = $.loadStay = function (c) {
        if (typeof $hotelstay !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $hotelstay, 'Hotel/hotelStay.js', function () { c();});
    };

})($hotelstaydetail);

(function ($) {

    var Instance = $.Instance = function (options) {
        var defaults = { title: '住宿人员详细信息 ...', width: 600, height: 400, layout: 'fit' };
        Ext.apply(defaults, options);

        function constructor() {
            this.show = function () {
                var wind = ExtHelper.CreateWindow(defaults);
                options.p = wind.getId();
                var tab = this.tab = getTab(options);
                wind.add(tab.tab);
            };
        }

        var instance = new constructor();
        return instance;
    };

    var getPopulation = $.getPopulation = function (code, p) {

        var mask = maskGenerate.start({ p: p, msg: '正在获取，请稍等 ...' });
        $hotelstaydetail.loadPopulationHandler(function () {
            $populationdetail.GetByCode(code, function (a, b, c) {
                if (c) {
                    $populationdetail.population.detail.Show(a.result);
                } else {
                    errorState.show(errorState.LoadError);
                }

                mask.stop();
            });
        });
    };

    function getTab(options) {
        var defaults = { ID: 0, PutinRoomNum: null, PutinTime: null };
        Ext.apply(defaults, options);

        var tab = ExtHelper.CreateTabPanelFn();

        tab.add({ component: getForm(options), title: '详细信息', closable: false });

        $hotelstaydetail.loadStay(function () {
            var agrid = $hotelstay.grid.Grid({ pager: false, req: String.Format('getonroom&id={0}&putintime={1}&roomnum={2}', defaults.ID, defaults.PutinTime, defaults.PutinRoomNum) });
            tab.add({ component: agrid.grid, title: '同住人员', closable: false });

            var bgrid = $hotelstay.grid.Grid({ pager: false, req: String.Format('getontogether&id={0}&putintime={1}', defaults.ID, defaults.PutinTime) });
            tab.add({ component: bgrid.grid, title: '同行人员', closable: false });

            var cgrid = $hotelstay.grid.Grid({ req: String.Format('getonmove&id={0}', defaults.ID) });
            tab.add({ component: cgrid.grid, title: '入住轨迹', closable: false });


            tab.tab.setActiveTab(0);
        });

        return tab;
    }

    function getForm(options) {
        var defaults = { ID: 0, Nationality: null, Name: null, FirstName: null, LastName: null, Gender: 0, GenderDesc: null, CredentialsID: 0, Credentials: null, CredentialsNum: null, PutinTime: null, GetoutTime: null, PutinRoomNum: null, HotelID: 0, HotelName: null, Hotel: null };
        Ext.apply(defaults, options);

        var id = identityManager.createId('panel');
        var panel = new Ext.panel.Panel({
            id:id,
            layout: 'border',
            border: 0,
            items: [{ region: 'north', height: 16, border: 0 },
                {
                    region: 'center',
                    border: 0,
                    layout: 'border',
                    items: [{
                        region: 'west',
                        border: 0,
                        width: 260,
                        split:true,
                        items: [{
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">住宿人</span>：{0}", defaults.Name || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">英文名</span>：{0}", defaults.FirstName || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">英文姓</span>：{0}", defaults.LastName || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">性别</span>：{0}", defaults.GenderDesc || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">证件号码</span>：{0}", defaults.CredentialsNum? String.Format('<span class="a" title="点击 查看详细信息" onclick="{1}(\'{0}\', \'{2}\')">{0}</span>', defaults.CredentialsNum, '$hotelstaydetail.detail.getPopulation', defaults.p): '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">入住房间</span>：{0}", defaults.PutinRoomNum || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">入住时间</span>：{0}", defaults.PutinTime || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">离开时间</span>：{0}", defaults.GetoutTime || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }, {
                        region: 'center',
                        border: 0,
                        layout: 'border',
                        items: [{
                            region: 'north',
                            layout:'fit',
                            border:0,
                            height: 22,
                            style:'border-bottom:1px solid #ddd;',
                            html: String.Format('<div style="font-weight:700; height:22px; line-height:22px; color:#660000; font-size:11px; margin-left:8px;">酒店：<span style="color:darkblue;">{0}</span></div>', defaults.HotelName)
                        }, {
                            region: 'center',
                            border: 0,
                            items: [{
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">联系电话</span>：{0}", defaults.Hotel ? defaults.Hotel.Tel : '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">联系地址</span>：{0}", defaults.Hotel && defaults.Hotel.Address ? defaults.Hotel.Address.Content : '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }]
                        }]
                    }]
                }, {region:'south', border:0, height:10}]
        });
        return panel;
    }

})(Object.$Supper($hotelstaydetail, 'detail'));