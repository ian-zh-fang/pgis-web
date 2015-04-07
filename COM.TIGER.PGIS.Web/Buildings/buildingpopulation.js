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

var $bpop = $bpop || {};

(function ($) {

    var basic_url = $.basic_url = 'Buildings/BuildingHelp.ashx?req=';

    $.loadPopulationHandler = function (c) {
        if (typeof $populationdetail !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $populationdetail, 'Population/populationDetail.js', function () {
            c();
        });
    };

})($bpop);

(function ($) {

    var tp = $.type = identityManager.createId('model');

    var model = $.model = Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'Name' },
            { name: 'OtherName' },
            { name: 'SexID' },
            { name: 'Sex' },
            { name: 'LiveTypeID' },
            { name: 'LiveType' },
            { name: 'Nation' },
            { name: 'EducationID' },
            { name: 'Education' },
            { name: 'OriginProvinceID' },
            { name: 'OriginProvince' },
            { name: 'OriginCityID' },
            { name: 'OriginCity' },
            { name: 'Stature' },
            { name: 'PoliticalStatusID' },
            { name: 'PoliticalStatus' },
            { name: 'CardNo' },
            { name: 'BloodTypeID' },
            { name: 'BloodType' },
            { name: 'SoldierStatusID' },
            { name: 'SoldierStatus' },
            { name: 'MarriageStatusID' },
            { name: 'MarriageStatus' },
            { name: 'Religion' },
            { name: 'LivePhone' },
            { name: 'Telephone1' },
            { name: 'Domicile' },
            { name: 'IsPsychosis' },
            { name: 'PsychosisTypeID' },
            { name: 'PsychosisType' },
            { name: 'HouseholdNo' },
            { name: 'HRelationID' },
            { name: 'HRelation' },
            { name: 'PhotoPath' },
            { name: 'HomeAddrID' },
            { name: 'CurrentAddrID' },
            { name: 'HomeAddress' },
            { name: 'CurrentAddress' }
        ]
    });

})(Object.$Supper($bpop, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { storeId: identityManager.createId(), req: 'pops', url:null, ids: null, model: $bpop.model.type, total: false, pagerSize: 25 };
        Ext.apply(defaults, options);
        defaults.url = defaults.url || String.Format('{0}{1}&ids={2}', $bpop.basic_url, defaults.req, defaults.ids);

        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($bpop, 'store'));

(function ($) {

    var columns = [
            { xtype: 'rownumberer', width: 25, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'Name', text: '姓名', sortable: false, hidden: false, flex: 1 },
            { dataIndex: 'OtherName', text: '曾用名', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'CardNo', text: '身份证', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Sex', text: '性别', sortable: false, hidden: false, width: 45 },
            { dataIndex: 'Nation', text: '民族', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Education', text: '文化程度', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'OriginProvince', text: '籍贯省', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'OriginCity', text: '籍贯市', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Stature', text: '身高', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'PoliticalStatus', text: '政治面貌', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'BloodType', text: '血型', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'SoldierStatus', text: '兵役状况', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MarriageStatus', text: '婚姻状况', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Religion', text: '宗教信仰', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LivePhone', text: '住宅电话', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Telephone1', text: '手机', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Domicile', text: '户籍所在地', sortable: false, hidden: true, flex: 1 },
            {
                dataIndex: 'IsPsychosis', text: '重点人口', sortable: false, hidden: true, width: 100, renderer: function (a, b, c) {
                    switch (a) {
                        default:
                            return '未知';
                    }
                }
            },//标识常口，重口，暂口，境外人口以及相应类型
            //{ dataIndex: 'PsychosisType', text: '重点人口类别', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'HouseholdNo', text: '户号', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'HRelation', text: '与户主关系', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'PhotoPath', text: '人员照片', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'CurrentAddress', text: '当前住址', sortable: false, hidden: true, flex:2 },
            {
                dataIndex: 'LiveType', text: '居住性质', sortable: false, hidden: true, flex: 1, renderer: function (a, b, c) {
                    switch (a) {
                        default:
                            return '未知';
                    }
                }
            },
            {
                dataIndex: 'ID', text: '操作', sortable: false, hidden: false, width: 55, renderer: function (a, b, c) {
                    var data = c.getData();
                    var val = Object.$EncodeObj(data);
                    return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', '$bpop.grid.Detail', val);
                }
            }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { req: 'pops', ids: null, url:null, pager: false, height: 200, enable: true, buildinginfo: null, unitinfo: null, roominfo: null, callback:Ext.emptyFn };
        Ext.apply(defaults, options);

        function constructor() {
            var store = this.store = $bpop.store.Store({ ids: defaults.ids, total: defaults.pager, req: defaults.req, url: defaults.url });
            var grid = this.grid = ExtHelper.CreateGrid({
                columns: columns, store: store, pager: defaults.pager, toolbar: {
                    enable: defaults.enable, items: [String.Format('<span style="height:{0}px; line-height:{0}px; text-align:center; font-weight:700;">人员信息:</span>', 21), '-', '->',
                        {
                            xtype: 'button',
                            iconCls: 'badd',
                            text: '添加',
                            handler: function (grid) { addFn(defaults, grid); }
                        }, '-', {
                            xtype: 'button',
                            iconCls: 'bdel',
                            text: '删除',
                            handler: function (grid) { delFn(defaults, grid); }
                        }]
                }
            });
        }

        return new constructor();
    };

    $.Detail = function (val) {
        //@ 在此处显示人员详细信息
        var data = Object.$DecodeObj(val);
        var mask = maskGenerate.start({ msg: '正在获取，请稍等 ...' });
        $bpop.loadPopulationHandler(function () {
            $populationdetail.population.detail.Show(data);
            mask.stop();
        });
    };

    function addFn(options, grid) {
        var defaults = { buildinginfo: null, unitinfo: null, roominfo: null, callback:Ext.emptyFn };
        Ext.apply(defaults, options);

        var address = defaults.buildinginfo.MOI_OwnerAddress;
        if (defaults.unitinfo) {
            address = String.Format("{0},{1}", address, defaults.unitinfo.UnitName);
        }
        if (defaults.roominfo) {
            address = String.Format("{0},{1}", address, defaults.roominfo.RoomName);
        }

        $bpop.form.Show({ addr: address, callback: defaults.callback });
    }

    function delFn(options, grid) {
        var defaults = { callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var rows = grid.grid.getSelectionModel().getSelection();
        if (!rows.length) {
            return errorState.show('请选择要删除地址的人员信息.');
        }

        errorState.confirmYes(String.Format('是否删除选择的 {0} 项的地址信息?', rows.length), function () {

            var ids = rows.Each(function (e) {
                return e.get('ID');
            });

            $bpop.form.submit({ ids: ids, p: grid.getId() }, grid, defaults.callback);
        })
    }

})(Object.$Supper($bpop, 'grid'));

(function ($) {

    $.Show = function (options) {
        var defaults = { addr: '', req: 'padd', title: '添加人员信息 ...', width: 600, height: 400, callback:Ext.emptyFn };
        Ext.apply(defaults, options);

        var wind = $.window = ExtHelper.CreateWindow({ title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit' });
        wind.add(getPanel({
            callback: function (grid) {
                var rows = grid.getSelectionModel().getSelection();
                if (!rows.length) {
                    return errorState.show('请选择要添加的人员信息.');
                }

                var ids = rows.Each(function (e) {
                    return e.get('ID');
                });

                submit({ req: defaults.req, ids: ids, addr: defaults.addr, p: wind.getId() }, grid, defaults.callback);
            }
        }));
    };
    
    var submit = $.submit = function (options, grid, callback) {
        var defaults = { req: 'padd', ids: '', addr: '', p: '' };
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
            buttonAlign:'center',
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
                    style: 'border-bottom:1px solid #ddd;',
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
                                    id: cqueryid,
                                    border: 0,
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'query',
                                            id:queryid,
                                            emptyText: '请输入人员姓名或者公民身份证编号 ...'
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
                    id:centerid,
                    items:[getGrid()]
                }
            ]
        });
        return panel;
    }

    function getGrid(options) {
        var defaults = { query: '', url: 'Population/PopulationHelp.ashx?req=pg' };
        Ext.apply(defaults, options);

        var grid = $bpop.grid.Grid({ url: String.Format('{0}&query={1}', defaults.url, defaults.query), pager: true, enable: false });

        for (var i = grid.grid.columns.length - 1; i >= 0; i -= 1) {
            var col = grid.grid.columns[i];
            switch (col.dataIndex) {
                case "CardNo":
                case "Nation":
                case "IsPsychosis":
                    //case "Education":
                    //case "PoliticalStatus":
                    //case "SoldierStatus":
                    //case "MarriageStatus":
                    //case "Religion":
                    //case "LiveType":
                    col.show();
                    break;
                default:
                    break;
            }
        }

        return grid.grid;
    };

})(Object.$Supper($bpop, 'form'));