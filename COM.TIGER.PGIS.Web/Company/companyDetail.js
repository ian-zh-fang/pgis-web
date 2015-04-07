/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Employee/Employee.js" />

var $companydetail = $companydetail || {};

(function ($) {

    var basic_uri = $.basic_uri = 'Company/CompanyHelp.ashx?req=';

    //@ 标识从业人员处理模块是否加载完毕，默认标识没有加载.
    var empReady = $.empReady = false;

    var loadEmployeeHandler = $.loadEmployeeHandler = function (cb) {
        cb = cb || Ext.emptyFn;

        if (empReady) {
            cb();
            return true;
        }

        LoadModlues.loadJS(typeof $employee, 'Employee/Employee.js', function () {
            $.empReady = true;
            cb();
        });
    };

})($companydetail);

(function ($) {

    var Form = $.Form = function (options) {
        var defaults = {
            ID: 0, TypeID: 0, TypeName: null, GenreID: 0, GenreName: null, Name: null, AddressID: 0, TradeID: 0, TradeName: null, Capital: 0, Corporation: null,
            Square: 0.00, StartTimeStr: null, Tel: null, LicenceNum: null,
            LicenceStartTimeStr: null, LicenceEndTimeStr: null,
            MainFrame: null, Concurrently: null, MigrantWorks: 0, FireRating: 0, OrganID: 0, OrganName: null, RoomID: 0, Address: null, Addr: ''
        };
        Ext.apply(defaults, options);

        var panel = new Ext.panel.Panel({
            border: 0, layout: 'border',
            items: [{
                region: 'north',
                layout: 'border',
                border: 0,
                height: 90,
                items: [{
                    region: 'north',
                    layout: 'fit',
                    height: 16,
                    border: 0
                    //,
                    //style: 'border-bottom:1px solid lightgray;',
                    //html: '<div style="font-weight:700; height:22px; line-height:22px; color:#660000; font-size:11px; margin-left:8px;">基本信息</div>'
                }, {
                    region: 'center',
                    border: 0,
                    items: [{
                        xtype: 'panel',
                        html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">单位名称</span>：{0}", defaults.Name || '暂无'),
                        border: 0,
                        style: 'height:22px; line-height:22px;'
                    }, {
                        xtype: 'panel',
                        html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">联系电话</span>：{0}", defaults.Tel || '暂无'),
                        border: 0,
                        style: 'height:22px; line-height:22px;'
                    }, {
                        xtype: 'panel',
                        html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">联系地址</span>：{0}", defaults.Addr || '暂无'),
                        border: 0,
                        style: 'height:22px; line-height:22px;'
                    }]
                }]
            }, {
                region: 'center',
                layout: 'border',
                border: 0,
                items: [{
                    region: 'north',
                    layout: 'fit',
                    height: 22,
                    border: 0,
                    style: 'border-bottom:1px solid #eee;',
                    html: '<div style="font-weight:700; height:22px; line-height:22px; color:#660000; font-size:11px; margin-left:8px;">其他</div>'
                }, {
                    region: 'center',
                    layout: 'border',
                    border: 0,
                    items: [{
                        region: 'north',
                        layout: 'border',
                        height: 140,
                        border: 0,
                        items: [{
                            region: 'west',
                            border: 0,
                            width: 250,
                            items: [{
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">注册资金</span>：{0}", defaults.Capital || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">法人</span>：{0}", defaults.Corporation || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">营业执照号</span>：{0}", defaults.LicenceNum || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">执照有效期</span>：{0} 至 {1}", defaults.LicenceStartTimeStr || '暂无', defaults.LicenceEndTimeStr || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">经营面积</span>：{0}", defaults.Square + ' ㎡' || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">开业日期</span>：{0}", defaults.StartTimeStr || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }]
                        }, {
                            region: 'center',
                            border: 0,
                            items: [{
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:5px;\">单位类型（大类）</span>：{0}", defaults.TypeName || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:5px;\">单位类型（小类）</span>：{0}", defaults.GenreName || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:5px;\">行业类型</span>：{0}", defaults.TradeName || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:5px;\">外来务工人数</span>：{0}", defaults.MigrantWorks || '无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:5px;\">消防等级</span>：{0}", getFireRatingDesc(defaults.FireRating)),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:5px;\">管辖机关</span>：{0}", defaults.OrganName || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }]
                        }]
                    }, {
                        region: 'center',
                        border: 0,
                        items: [{
                            xtype: 'panel',
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">主营</span>：{0}", defaults.MainFrame || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            xtype: 'panel',
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b; margin-left:15px;\">兼营</span>：{0}", defaults.Concurrently || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }]
                }]
            }]
        });
        return panel;
    };

    var tab = null;
    var Show = $.Show = function (options) {

        init(options);
        var wind = $.window = ExtHelper.CreateWindow({ title: '单位详细信息', height: 400, width: 600, layout: 'fit' });
        wind.add(tab.tab);
    };

    function getFireRatingDesc(v) {
        var index = FireRatingLevel.data.items.IndexOf(function (e) { return e.get('v') == v; });
        if (index < 0)
            return '暂无';

        return FireRatingLevel.data.items[index].get('d');
    }

    function init(options) {
        tab = ExtHelper.CreateTabPanelFn();
        tab.add({ component: Form(options), title: '基本信息', closable: false });
        addEmployee(options);

        tab.tab.setActiveTab(0);
    }

    function addEmployee(options) {
        var defaults = { ID: 0, Name: null };
        Ext.apply(defaults, options);

        $companydetail.loadEmployeeHandler(function () {
            var grid = $employee.grid.GridGenerator({
                req: String.Format('company&id={0}', defaults.ID),
                html: String.Format('<span style="color:#15498b; font-size:11px; font-weight:700;">单位名称：</span>{0}', defaults.Name),
                checkbox: false
            });
            tab.add({ component: grid.grid, closable: false, title: '从业人员' });

            var qgrid = $employee.grid.GridGenerator({
                req: String.Format('qcompany&id={0}', defaults.ID),
                html: String.Format('<span style="color:#15498b; font-size:11px; font-weight:700;">单位名称：</span>{0}', defaults.Name),
                checkbox: false
            });
            tab.add({ component: qgrid.grid, closable: false, title: '已离职人员' });

            tab.tab.setActiveTab(0);
        });
    };

})(Object.$Supper($companydetail, 'detail'));