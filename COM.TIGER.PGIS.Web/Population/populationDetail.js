/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />

var $populationdetail = $populationdetail || {};

(function ($) {

    var basic_url = $.basic_url = 'Population/PopulationHelp.ashx?req=';

    var GetByCode = $.GetByCode = function (code, callback, maskid) {
        /// <summary>获取指定身份证编号的人员详细信息</summary>
        /// <param name="code" type="String">公民身份证编号</param>
        /// <param name="callback" type="Function">
        /// 数据获取之后的回调方法
        /// <para>Object data 返回数据</para>
        /// <para>Object opts 请求参数</para>
        /// <para>Boolean success 请求状态，True标识请求成功</para>
        /// <para>Object response 请求回应</para>
        /// </param>
        /// <param name="maskid" type="String">tip 被遮罩层遮罩的对象 ID。默认是 Body 元素</param>
        /// <returns type="Object" />

        Object.$Get({
            url: String.Format('{0}idcode', basic_url),
            params: { code: code },
            callback: function (opts, success, response) {
                var data = null;
                if (success) {
                    data = JSON.parse(response.responseText);
                }

                callback(data, opts, success, response);
            }
        });
    };

})($populationdetail);

(function ($) {
    var me = $;
    var basic_url = $.basic_url = 'Buildings/BuildingHelp.ashx?req=';
})(Object.$Supper($populationdetail, 'population'));

(function ($) {

    var Show = $.Show = function (options) {
        var defaults = { title: '人员信息详细...', width: 600, height: 400 };
        Ext.apply(defaults, options);

        var tab = getTable(options);
        var wind = ExtHelper.CreateWindow({ title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit' });
        wind.add(tab.tab);
    };

    var Form = $.Form = function (options) {
        var defaults = {
            ID: 0, Name: null, OtherName: null, SexID: 0, Sex: null, LiveTypeID: 0, LiveType: null, Nation: null,
            EducationID: 0, Education: null, OriginProvinceID: 0, OriginProvince: null, OriginCityID: 0, OriginCity: null,
            Stature: null, PoliticalStatusID: 0, PoliticalStatus: null, CardNo: null, BloodTypeID: 0, BloodType: null,
            SoldierStatusID: 0, SoldierStatus: null, MarriageStatusID: 0, MarriageStatus: null, Religion: null, LivePhone: null,
            Telephone1: null, Domicile: null, IsPsychosis: 0, PsychosisTypeID: 0, PsychosisType: null,
            HouseholdNo: null, HRelationID: 0, HRelation: null, PhotoPath: null, HomeAddrID: 0, CurrentAddrID: 0,
            HomeAddress: null, CurrentAddress: null
        };
        Ext.apply(defaults, options);

        var panel = new Ext.panel.Panel({
            border: 0, layout: 'border',
            items: [{
                xtype: 'panel',
                border: 0,
                region: 'north',
                html: '<span style="font-size:12px; font-weight:700; color:#660000; margin-left:15px;">基本信息:</span>',
                style: 'border-bottom:1px solid lightgray; line-height:35px;',
                height: 30
            }, {
                xtype: 'panel',
                border: 0,
                region: 'center',
                layout: 'border',
                items: [{
                    xtype: 'panel',
                    border: 0,
                    region: 'west',
                    width: 100,
                    items: [{
                        xtype: 'panel',
                        border: 0,
                        html: String.Format('<img style="height:90px; width:85px; margin-left:5px; margin-top:5px;" src="{0}" alt="{1}" />', defaults.PhotoPath || 'Resources\\images\\portrait.png', defaults.Name || '暂无')
                    }]
                }, {
                    xtype: 'panel',
                    border: 0,
                    region: 'center',
                    layout: 'border',
                    items: [{
                        xtype: 'panel',
                        border: 0,
                        region: 'center',
                        layout: 'border',
                        items: [{
                            xtype: 'panel',
                            region: 'west',
                            border: 0,
                            width: 150,
                            items: [{
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">姓名</span>：{0}", defaults.Name || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">曾用名</span>：{0}", defaults.OtherName || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">性别</span>：{0}", defaults.Sex || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">民族</span>：{0}", defaults.Nation || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">身高</span>：{0}", defaults.Stature ? defaults.Stature + ' 厘米' : '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">血型</span>：{0}", defaults.BloodType || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">户籍地</span>：{0}", defaults.Domicile || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }]
                        }, {
                            xtype: 'panel',
                            region: 'center',
                            border: 0,
                            items: [{
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">证件号码</span>：{0}", defaults.CardNo || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">文化程度</span>：{0}", defaults.Education || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">婚姻状况</span>：{0}", defaults.MarriageStatus || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">兵役状况</span>：{0}", defaults.SoldierStatus || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">政治面貌</span>：{0}", defaults.PoliticalStatus || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">宗教信仰</span>：{0}", defaults.Religion || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">籍贯</span>：{0},{1}", defaults.OriginProvince || '暂无', defaults.OriginCity || '暂无'),
                                border: 0,
                                style: 'height:22px; line-height:22px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;'
                            }]
                        }]
                    }, {
                        xtype: 'panel',
                        border: 0,
                        region: 'south',
                        height: 50,
                        items: [{
                            xtype: 'panel',
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">家庭住址</span>：{0}", defaults.HomeAddress || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            xtype: 'panel',
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">当前住址</span>：{0}", defaults.CurrentAddress || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }]
                }]
            }, {
                xtype: 'panel',
                border: 0,
                region: 'south',
                height: 105,
                layout: 'border',
                items: [{
                    xtype: 'panel',
                    border: 0,
                    region: 'north',
                    html: '<span style="font-size:12px; font-weight:700; color:#660000; margin-left:15px;">其它:</span>',
                    style: 'border-bottom:1px solid lightgray; line-height:22px;',
                    height: 22
                }, {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'border',
                    border: 0,
                    items: [{
                        xtype: 'panel',
                        region: 'west',
                        border: 0,
                        width: 200,
                        items: [{
                            xtype: 'panel',
                            html: String.Format("<span style=\"margin-left:25px; font-weight:700; font-size:11px; color:#15498b;\">人口性质</span>：{0}", defaults.LiveType || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }, {
                        xtype: 'panel',
                        region: 'center',
                        border: 0,
                        items: [{
                            xtype: 'panel',
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">重口类别</span>：{0}", defaults.PsychosisType || '暂无'),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }]
                }]
            }]
        });
        return panel;
    };

    //@ 获取户籍信息
    function getHRelation(data) {
        var panel = new Ext.panel.Panel({
            border: 0, layout: 'fit', items: [$.parent.HRelation.Grid({ n: data.HouseholdNo })]
        });
        return panel;
    };

    //@ 获取从业经历
    function getCompanies(data) {

        var panel = new Ext.panel.Panel({
            border: 0, layout: 'fit', items: [$.parent.Company.grid.Grid({ id: data.CardNo })]
        });
        return panel;
    };

    //@ 获取移动轨迹
    function getMovetrack(data) {

        var panel = new Ext.panel.Panel({
            border: 0, layout: 'fit', items: [$.parent.Temporary.grid.Grid({ id: data.ID })]
        });
        return panel;
    };

    //@ 获取出入境信息
    function getAbroad(data) {

        var panel = new Ext.panel.Panel({
            border: 0, layout: 'fit', items: [$.parent.Abroad.grid.Grid({ id: data.ID })]
        });
        return panel;
    };

    function getTable(options) {

        var tab = ExtHelper.CreateTabPanelFn();

        tab.add({ component: Form(options), title: '基本信息', closable: false });
        tab.add({ component: getHRelation(options), title: '户籍信息', closable: false });
        tab.add({ component: getCompanies(options), title: '从业经历', closable: false });
        tab.add({ component: getMovetrack(options), title: '移动轨迹', closable: false });
        tab.add({ component: getAbroad(options), title: '出入境信息', closable: false });
        tab.tab.setActiveTab(0);
        return tab;
    }

})($populationdetail.population.detail = $populationdetail.population.detail || { parent: $populationdetail.population });

//@ 户籍信息
(function ($) {

    //@ model
    (function (me) {

        var tp = me.type = identityManager.createId('model');

        var model = me.model = Ext.define(tp, {
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

        var defaults = me.defaults = {
            ID: 0, Name: null, OtherName: null, SexID: 0, Sex: null, LiveTypeID: 0, LiveType: null, Nation: null,
            EducationID: 0, Education: null, OriginProvinceID: 0, OriginProvince: null, OriginCityID: 0, OriginCity: null,
            Stature: null, PoliticalStatusID: 0, PoliticalStatus: null, CardNo: null, BloodTypeID: 0, BloodType: null,
            SoldierStatusID: 0, SoldierStatus: null, MarriageStatusID: 0, MarriageStatus: null, Religion: null, LivePhone: null,
            Telephone1: null, Domicile: null, IsPsychosis: 0, PsychosisTypeID: 0, PsychosisType: null,
            HouseholdNo: null, HRelationID: 0, HRelation: null, PhotoPath: null, HomeAddrID: 0, CurrentAddrID: 0,
            HomeAddress: null, CurrentAddress: null
        };

    })($.model = $.model || {});

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), req: 'pops', ids: null, model: $.model.type, total: false, pagerSize: 25 };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}&ids={2}', $.parent.basic_url, defaults.req, defaults.ids);

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })($.store = $.store || {});

    var columns = [
        { xtype: 'rownumberer', width: 25, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', text: '人员姓名', flex: 1, sortable: false },
        { dataIndex: 'HRelation', text: '与户主关系', flex: 1, sortable: false },
        { dataIndex: 'HouseholdNo', text: '户号', flex: 1, sortable: false }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { req: 'pophre', n: 0, pager: false };
        Ext.apply(defaults, options);

        var store = $.store.Store({ req: String.Format("{0}&n={1}", defaults.req, defaults.n), total: defaults.pager, ids: '0' });
        var grid = ExtHelper.CreateGridNoCheckbox({
            columns: columns,
            pager: defaults.pager,
            store: store
        });
        return grid;
    };

})($populationdetail.population.HRelation = $populationdetail.population.HRelation || { parent: $populationdetail.population });

(function ($) {

    (function (me) {

        var tp = me.Type = identityManager.createId('model');
        Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'OrganID' },
                { name: 'OrganTypeID' },
                { name: 'OrganTypeID' },
                { name: 'IdentityCardNum' },
                { name: 'Name' },
                { name: 'Address' },
                { name: 'Tel' },
                { name: 'Seniority' },
                { name: 'Func' },
                { name: 'JobTypeID' },
                { name: 'JobTypeName' },
                { name: 'CompanyName' },
                { name: 'Company' }
            ]
        });

    })($.model = $.model || {});

    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), model: $.model.Type, req: null, total: false, pageSize: 25 };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.parent.basic_url, defaults.req);

            return ExtHelper.CreateStore(defaults);
        };

    })($.store = $.store || {});

    (function (me) {

        var columns = [
            { xtype: 'rownumberer', width: 25, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'CompanyName', text: '单位名称', flex: 1, sortable: false, hidden: false },
            { dataIndex: 'EntryTime', text: '入职时间', width: 80, sortable: false, hidden: false },
            { dataIndex: 'QuitTime', text: '离职时间', width: 80, sortable: false, hidden: false },
            { dataIndex: 'OrganID', text: '操作', width: 40, sortable: false, hidden: false }
        ];

        var Grid = me.Grid = function (options) {
            var defaults = { req: 'popcom', id: null, pager: false };
            Ext.apply(defaults, options);
            var store = $.store.Store({ req: String.Format("{0}&id={1}", defaults.req, defaults.id), total: defaults.pager });
            return ExtHelper.CreateGridNoCheckbox({ store: store, columns: columns, pager: defaults.pager });
        };

    })($.grid = $.grid || {});

})($populationdetail.population.Company = $populationdetail.population.Company || { parent: $populationdetail.population });

(function ($) {

    (function (me) {

        var tp = me.Type = identityManager.createId('model');
        Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'TP_ID' },
                { name: 'LandlordName' },
                { name: 'LandlordCard' },
                { name: 'LandlordPhone' },
                { name: 'TP_ReasonID' },
                { name: 'TP_Reason' },
                { name: 'ResidenceNo' },
                { name: 'TP_Date' },
                { name: 'Addr' }
            ]
        });

    })($.model = $.model || {});

    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), model: $.model.Type, req: null, total: false, pageSize: 25 };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.parent.basic_url, defaults.req);

            return ExtHelper.CreateStore(defaults);
        };

    })($.store = $.store || {});

    (function (me) {

        var columns = [
            { xtype: 'rownumberer', width: 25, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'Addr', text: '详细地址', flex: 1, sortable: false, hidden: false },
            {
                dataIndex: 'TP_Date', text: '来本址日期', width: 100, sortable: false, hidden: false, renderer: function (a, b, c) {
                    try{
                        var val = Date.formatDate(date);
                        return (val == '1-01-01') ? '' : val;
                    }
                    catch (e) {
                        return '';
                    }
                }
            }
        ];

        var Grid = me.Grid = function (options) {
            var defaults = { req: 'poptemp', id: null, pager: false };
            Ext.apply(defaults, options);
            var store = $.store.Store({ req: String.Format("{0}&id={1}", defaults.req, defaults.id), total: defaults.pager });
            return ExtHelper.CreateGridNoCheckbox({ store: store, columns: columns, pager: defaults.pager });
        };

    })($.grid = $.grid || {});

})($populationdetail.population.Temporary = $populationdetail.population.Temporary || { parent: $populationdetail.population });


(function ($) {

    (function (me) {

        var tp = me.Type = identityManager.createId('model');
        Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'AP_ID' },
                { name: 'PoID' },
                { name: 'FirstName' },
                { name: 'LastName' },
                { name: 'Country' },
                { name: 'CardTypeName' },
                { name: 'CardNo' },
                { name: 'ValidityDate' },
                { name: 'VisaTypeName' },
                { name: 'VisaNoAndValidity' },
                { name: 'StayValidityDate' },
                { name: 'EntryPort' },
                { name: 'EntryDate' },
                { name: 'ArrivalDate' },
                { name: 'LiveDate' },
                { name: 'LeaveDate' },
                { name: 'StayReason' },
                { name: 'ReceivePerson' },
                { name: 'Phone' }
            ]
        });

    })($.model = $.model || {});

    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), model: $.model.Type, req: null, total: false, pageSize: 25 };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.parent.basic_url, defaults.req);
            //errorState.show(defaults.url);

            return ExtHelper.CreateStore(defaults);
        };

    })($.store = $.store || {});

    (function (me) {

        var columns = [
            { xtype: 'rownumberer', width: 25, renderer: function (a, b, c, d) { return d + 1; } },
            {
                dataIndex: 'FirstName', text: '英文姓名', width: 120, sortable: false, hidden: false, renderer: function (a, b, c) {
                    var data = c.getData();
                    return String.Format("{0}·{1}", data.FirstName, data.LastName);
                }
            },
            { dataIndex: 'Country', text: '国籍', width: 100, sortable: false, hidden: true },
            { dataIndex: 'CardTypeName', text: '证件类型', width: 100, sortable: false, hidden: true },
            { dataIndex: 'CardNo', text: '证件编号', width: 100, sortable: false, hidden: true },
            { dataIndex: 'ValidityDate', text: '证件有效期至', width: 100, sortable: false, hidden: true },
            { dataIndex: 'VisaTypeName', text: '签证类型', width: 100, sortable: false, hidden: true },
            { dataIndex: 'VisaNoAndValidity', text: '签证号码及期限', width: 100, sortable: false, hidden: true },
            { dataIndex: 'EntryPort', text: '入境口岸', flex: 1, sortable: false, hidden: false },
            { dataIndex: 'EntryDate', text: '入境时间', width: 100, sortable: false, hidden: false },
            { dataIndex: 'LeaveDate', text: '离境时间', width: 100, sortable: false, hidden: false },
            { dataIndex: 'LiveDate', text: '拟往日期', width: 100, sortable: false, hidden: true },
            { dataIndex: 'ArrivalDate', text: '抵达日期', width: 100, sortable: false, hidden: true },
            { dataIndex: 'StayReason', text: '停留事由', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'StayValidityDate', text: '停留有效期至', width: 100, sortable: false, hidden: true },
            { dataIndex: 'ReceivePerson', text: '接待单位/人', width: 100, sortable: false, hidden: true },
            { dataIndex: 'Phone', text: '单位/人电话', width: 100, sortable: false, hidden: true }
        ];

        var Grid = me.Grid = function (options) {
            var defaults = { req: 'popabroad', id: null, pager: false };
            Ext.apply(defaults, options);
            var store = $.store.Store({ req: String.Format("{0}&id={1}", defaults.req, defaults.id), total: defaults.pager });
            return ExtHelper.CreateGridNoCheckbox({ store: store, columns: columns, pager: defaults.pager });
        };

    })($.grid = $.grid || {});

})($populationdetail.population.Abroad = $populationdetail.population.Abroad || { parent: $populationdetail.population });