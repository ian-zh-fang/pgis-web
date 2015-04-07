/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Company/Company.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Population/populationDetail.js" />
/// <reference path="building.js" />
/// <reference path="../Company/companyDetail.js" />

var $bcompany = $bcompany || {};

(function ($) {

    var basic_url = $.basic_url = 'Buildings/BuildingHelp.ashx?req=';

    $.loadCompanyHandler = function (c) {
        if (typeof $companydetail !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $companydetail, 'Company/companyDetail.js', function () {
            c();
        });
    };

})($bcompany);

(function ($) {

    var tp = $.type = identityManager.createId('model');

    var model = $.model = Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' }, //单位表ID
            { name: 'TypeID' }, //单位大类ID
            { name: 'TypeName' },   //单位大类
            { name: 'GenreID' },    //单位小类ID
            { name: 'GenreName' },  //单位小类  
            { name: 'Name' },   //单位名称
            { name: 'AddressID' },  //地址ID
            { name: 'TradeID' },    //行业类型ID
            { name: 'TradeName' },  //行业类型
            { name: 'Capital' },    //注册资金
            { name: 'Corporation' },    //法人
            { name: 'Square' }, //经营面积
            { name: 'StartTimeStr' },  //开业日期
            { name: 'Tel' },    //单位电话
            { name: 'LicenceNum' }, //营业执照编号
            { name: 'LicenceStartTimeStr' },   //营业执照开始日期
            { name: 'LicenceEndTimeStr' }, //营业执照截止日期
            { name: 'MainFrame' },  //主营经营范围
            { name: 'Concurrently' },   //兼营经营范围
            { name: 'MigrantWorks' },   //外来务工人数
            { name: 'FireRating' }, //消防等级
            { name: 'OrganID' },    //所属管辖机关ID
            { name: 'OrganName' },  //所属管辖机关
            { name: 'RoomID' }, //RoomID
            { name: 'Address' }, //详细地址
            { name: 'Addr' }
        ]
    });

})(Object.$Supper($bcompany, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { storeId: identityManager.createId(), model: $bcompany.model.type, req: null, total: true, pageSize: 18, url: null };
        Ext.apply(defaults, options);
        defaults.url = defaults.url || String.Format('{0}{1}', $bcompany.basic_url, defaults.req);

        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($bcompany, 'store'));

(function ($) {
    
    var columns = [
            { xtype: 'rownumberer', text: '', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'Name', itemId: 'Name', text: '名称', sortable: false, hidden: false, flex: 1 },
            { dataIndex: 'Tel', itemId: 'Tel', text: '联系电话', sortable: false, hidden: false, width: 85 },
            { dataIndex: 'TypeName', itemId: 'TypeName', text: '单位大类', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'GenreName', itemId: 'GenreName', text: '单位小类', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'TradeName', itemId: 'TradeName', text: '行业类型', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Capital', itemId: 'Capital', text: '注册资金', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Corporation', itemId: 'Corporation', text: '法人', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Square', itemId: 'Square', text: '经营面积 (㎡)', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'StartTimeStr', itemId: 'StartTime', text: '开业日期', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LicenceNum', itemId: 'LicenceNum', text: '营业执照编号', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LicenceStartTimeStr', itemId: 'LicenceStartTime', text: '营业执照开始日期', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LicenceEndTimeStr', itemId: 'LicenceEndTime', text: '营业执照截止日期', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MainFrame', itemId: 'MainFrame', text: '主营经营范围', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Concurrently', itemId: 'Concurrently', text: '兼营经营范围', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MigrantWorks', itemId: 'MigrantWorks', text: '外来务工人数', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'FireRating', itemId: 'FireRating', text: '消防等级', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'OrganName', itemId: 'OrganName', text: '所属管辖机关', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'RoomID', itemId: 'RoomID', text: '所在房间ID', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Addr', text: '联系地址', sortable: false, hidden: true, flex: 2 },
            {
                dataIndex: 'ID', text: '', sortable: false, hidden: false, width: 45, renderer: function (a, b, c) {
                    var data = c.getData();
                    var val = Object.$EncodeObj(data);
                    return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', '$bcompany.grid.Detail', val);
                }
            }
    ];

    $.Grid = function (options) {
        var defaults = { req: 'companys', ids: 0, url: null, enable: true, title: '', pager: false, hideHeaders: false, buildinginfo: null, unitinfo: null, roominfo: null, callback:Ext.emptyFn };
        Ext.apply(defaults, options);

        function constructor() {
            var store = this.store = $bcompany.store.Store({ req: String.Format('{0}&ids={1}', defaults.req, defaults.ids), url: defaults.url, total: defaults.pager });
            var grid = this.grid = ExtHelper.CreateGrid({
                columns: columns, store: store, pager: defaults.pager, hideHeaders: defaults.hideHeaders,
                toolbar: {
                    enable: defaults.enable, items: [String.Format('<span style="height:{0}px; line-height:{0}px; text-align:center; font-weight:700;">单位信息:</span>', 21), '-', '->',
                        {
                            xtype: 'button',
                            iconCls: 'badd',
                            text: '添加',
                            handler: function (grid) { addFn(defaults, grid); }
                        }, '-', {
                            xtype: 'button',
                            iconCls: 'bdel',
                            text: '删除',
                            handler: function (grid) { delFn(defaults, grid);}
                        }]
                }
            });
        }

        return new constructor();
    };

    $.Detail = function (val) {
        var data = Object.$DecodeObj(val);
        var mask = maskGenerate.start({ msg: '正在获取，请稍等 ...' });

        $bcompany.loadCompanyHandler(function () {
            $companydetail.detail.Show(data);
            mask.stop();
        });
    }

    function addFn(options, grid) {
        var defaults = { buildinginfo: null, unitinfo: null, roominfo: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var address = defaults.buildinginfo.MOI_OwnerAddress;
        if (defaults.unitinfo) {
            address = String.Format("{0},{1}", address, defaults.unitinfo.UnitName);
        }
        if (defaults.roominfo) {
            address = String.Format("{0},{1}", address, defaults.roominfo.RoomName);
        }

        $bcompany.form.Show({ addr: address, callback:defaults.callback }, grid);
    }

    function delFn(options, grid) {
        var defaults = { callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var rows = grid.grid.getSelectionModel().getSelection();
        if (!rows.length) {
            return errorState.show('请选择要删除地址的单位信息.');
        }

        errorState.confirmYes(String.Format('是否删除选择的 {0} 项的地址信息?', rows.length), function () {

            var ids = rows.Each(function (e) {
                return e.get('ID');
            });

            $bcompany.form.submit({ ids: ids, p: grid.getId() }, grid, defaults.callback);
        })
    }

})(Object.$Supper($bcompany, 'grid'));

(function ($) {

    $.Show = function (options, grid) {
        var defaults = { addr: '', req: 'comadd', title: '添加单位信息 ...', width: 600, height: 400, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var wind = $.window = ExtHelper.CreateWindow({ title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit' });
        wind.add(getPanel({
            callback: function (grid) {
                var rows = grid.getSelectionModel().getSelection();
                if (!rows.length) {
                    return errorState.show('请选择要添加的单位信息.');
                }

                var ids = rows.Each(function (e) {
                    return e.get('ID');
                });

                submit({ req: defaults.req, ids: ids, addr: defaults.addr, p: wind.getId() }, grid, defaults.callback);
            }
        }));
    };

    var submit = $.submit = function (options, grid, callback) {
        var defaults = { req: 'comadd', ids: '', addr: '', p:'' };
        Ext.apply(defaults, options);

        var mask = maskGenerate.start({ p: defaults.p, msg: '正在提交数据，请稍等 ...' });
        //在此将数据提交到后台处理
        Object.$Get({
            url: String.Format('{0}{1}', $bcompany.basic_url, defaults.req),
            params: { addr: defaults.addr, ids: defaults.ids },
            callback: function (a, b, c) {

                mask.stop();

                if (!b) {
                    return errorState.show('啊哦，发生错误了.');
                }

                if (c.result <= 0) {
                    return errorState.show('啊哦，发生错误了.');
                }

                callback();
                if ($.window) $.window.close();
                errorState.show(errorState.SubmitSuccess);
            }
        });
    };

    function getPanel(options) {
        var defaults = { callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var centerid = identityManager.createId();
        var cqueryid = identityManager.createId();
        var queryid = identityManager.createId();
        var panel = new Ext.panel.Panel({
            layout: 'border',
            border: 0,
            buttonAlign: 'center',
            buttons: [{
                text: '添 加',
                iconCls: 'badd',
                handler: function () {
                    var grid = panel.getComponent(centerid).down('grid');
                    defaults.callback(grid);
                }
            }],
            items: [
                {
                    region: 'north',
                    layout: 'border',
                    height: 35,
                    border: 0,
                    style:'border-bottom:1px solid #ddd;',
                    items: [
                        { region: 'west', width: 150, border: 0 },
                        { region: 'north', height: 5, border: 0 },
                        { region: 'south', height: 5, border: 0 },
                        { region: 'east', width: 150, border: 0 },
                        {
                            region: 'center',
                            border: 0,
                            layout: 'column',
                            items: [
                                {
                                    layout: 'fit',
                                    columnWidth: .8,
                                    border: 0,
                                    id:cqueryid,
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'query',
                                            id: queryid,
                                            emptyText: '请输入单位或者企业名称 ...'
                                        }
                                    ]
                                }, {
                                    layout: 'fit',
                                    columnWidth: .2,
                                    border: 0,
                                    items: [
                                        {
                                            xtype: 'button',
                                            text: '查 询',
                                            iconCls: 'bselect',
                                            handler: function () {
                                                var mask = maskGenerate.start({ p: panel.getId(), msg: '正在处理，请稍等 ...' });
                                                var val = this.up('panel').up('panel').getComponent(cqueryid).getComponent(queryid).value;
                                                var cpanel = panel.getComponent(centerid);
                                                cpanel.removeAll();
                                                cpanel.add(getGrid({ query: val }));
                                                mask.stop();
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }, {
                    region: 'center',
                    layout: 'fit',
                    border: 0,
                    id: centerid,
                    items: [getGrid()]
                }
            ]
        });
        return panel;
    }

    function getGrid(options) {
        var defaults = { query: '', url: 'Company/CompanyHelp.ashx?req=pg' };
        Ext.apply(defaults, options);

        var grid = $bcompany.grid.Grid({ url: String.Format('{0}&query={1}', defaults.url, defaults.query), pager: true, enable: false });

        for (var i = grid.grid.columns.length - 1; i >= 0; i -= 1) {
            var col = grid.grid.columns[i];
            switch (col.dataIndex) {
                case "Addr":
                    //case "TradeName":
                    //case "MainFrame":
                    col.show();
                    break;
                default:
                    break;
            }
        }

        return grid.grid;
    };

})(Object.$Supper($bcompany, 'form'));