/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/qForm.js" />
/// <reference path="../Resources/js/MapHelper.js" />



var populationQuery = populationQuery || {};
(function ($) {

    $.sy = createObj();
    $.ck = createObj();
    $.zak = createObj();
    $.jw = createObj();
    $.zhk = createObj();
    $.population = createObj();
    $.kx = createObj();

    var basic_url = $.basic_url = 'Population/PopulationHelp.ashx?req=';
    //结果面板容器ID
    var resultcontainerid = $.resultcontainerid = 'extEast';

    var query = $.query = function (form, req) {
        var c = Ext.getCmp(resultcontainerid);
        c.removeAll(true);
        
        var items = form.items.items;
        var params = {};
        for (var i = 0; i < items.length; i++) {
            var cp = items[i];
            params[cp.name] = cp.getValue();
        }
        c.add($.grid.Grid({ req: req, params: params }));

        if (c.collapsed) {
            c.expand();
        }
        EMap.Clear();
    };

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
            var defaults = { storeId: identityManager.createId(), req: null, ids: null, model: $.model.type, total: true, pagerSize: 15 };
            Ext.apply(defaults, options);
            defaults.url = encodeURI(String.Format('{0}{1}', basic_url, defaults.req));

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })($.store = $.store || {});

    (function (me) {

        var columns = [
            { xtype: 'rownumberer', width: 20, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'Name', text: '姓名', flex: 1, sortable: false },
            {
                dataIndex: 'ID', width: 70, sortable: false, renderer: function (a, b, c) {
                    var data = c.getData();
                    var val = encodeObj(data);
                    return String.Format('<span class="a" onclick="{2}(\'{1}\')">定位</span>&nbsp;&nbsp;<span class="a" onclick="{0}(\'{1}\')">详细</span>', 'populationQuery.grid.ShowDetail', val, 'populationQuery.grid.location');
                }
            }
        ];

        me.Grid = function (options) {
            var defaults = { req: null, params: {}, pager: true };
            Ext.apply(defaults, options);
            
            var store = $.store.Store({ req: String.Format('{0}{1}', defaults.req, getParams(defaults.params)), total: defaults.pager });
            return ExtHelper.CreateGridNoCheckbox({ store: store, columns: columns, pager: defaults.pager });
        };

        me.ShowDetail = function (val) {
            var data = decodeObj(val);
            $.population.detail.Show(data);
        }

        me.location = function (v) {
            var data = decodeObj(v);            
            var mask = maskGenerate.start({ p: resultcontainerid, msg: '正在定位，请稍等 ...' });
            Object.$Get({
                url: String.Format('{0}loc',$.basic_url),
                params: { id: data.CurrentAddrID },
                callback: function (a, b, c) {
                    mask.stop();
                    if (!b) {
                        return errorState.show('坐标数据获取失败！');
                    }

                    var dat = JSON.parse(c.responseText);
                    dat = Ext.apply({ result: null }, dat);
                    if (dat.result) {
                        var def = { MEH_CenterX: 0, MEH_CenterY: 0 };
                        Ext.apply(def, dat.result);

                        EMap.AppendLabelEx({
                            id: String.Format('x-popu-locate-{0}', data.ID),
                            x: def.MEH_CenterX,
                            y: def.MEH_CenterY,
                            text: data.Name,
                            title: String.Format('{0}({1}) 点击查看详细', data.Name, data.CurrentAddress),
                            click: function () {
                                $.population.detail.Show(data);
                            }
                        });
                        EMap.MoveTo(def.MEH_CenterX, def.MEH_CenterY);

                    } else {
                        errorState.show('座标不明确，定位失败！');
                    }
                }
            });
        };

    })($.grid = $.grid || {});
    
    function createObj() {
        return { parent: $ };
    };

    var encodeObj = $.encodeObj = function (obj) {
        obj = JSON.stringify(obj);
        obj = encodeURI(obj);
        return obj;
    };

    var decodeObj = $.decodeObj = function (obj) {
        obj = decodeURI(obj);
        obj = JSON.parse(obj);
        return obj;
    };

})(populationQuery);

//@ 实有人口查询
(function ($) {

    var req = 'sy';

    $.Form = function () {
        return qForm.getQueryForm(qForm.qFormType.syPopulation, callback);
    }

    function callback(form) {
        $.parent.query(form, req);
    }

})(populationQuery.sy);

//@ 常住人口查询
(function ($) {

    var req = 'ck';

    $.Form = function () {
        return qForm.getQueryForm(qForm.qFormType.ckPopulation, callback);
    }

    function callback(form) {
        $.parent.query(form, req);
    }

})(populationQuery.ck);

//@ 暂住人口查询
(function ($) {

    var req = 'zak';

    $.Form = function () {
        return qForm.getQueryForm(qForm.qFormType.zakPopulation, callback);
    }

    function callback(form) {
        $.parent.query(form, req);
    }

})(populationQuery.zak);

//@ 境外人口查询
(function ($) {

    var req = 'jw';

    $.Form = function () {
        return qForm.getQueryForm(qForm.qFormType.jwPopulation, callback);
    }

    function callback(form) {
        $.parent.query(form, req);
    }

})(populationQuery.jw);

//@ 重点人口查询
(function ($) {

    var req = 'zhk';

    $.Form = function () {
        return qForm.getQueryForm(qForm.qFormType.zhkPopulation, callback);
    }

    function callback(form) {
        $.parent.query(form, req);
    }

})(populationQuery.zhk);

(function ($) {
    var me = $;
    var basic_url = $.basic_url = 'Buildings/BuildingHelp.ashx?req=';
})(populationQuery.population);

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
                        html: String.Format('<img style="height:110px; width:85px; margin-left:5px; margin-top:5px;" src="{0}" alt="{1}" />', defaults.PhotoPath || 'photo.png', defaults.Name)
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
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">姓名</span>：{0}", defaults.Name),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">曾用名</span>：{0}", defaults.OtherName),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">性别</span>：{0}", defaults.Sex),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">民族</span>：{0}", defaults.Nation),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">身高</span>：{0} 厘米", defaults.Stature),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">血型</span>：{0}", defaults.BloodType),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">户籍地</span>：{0}", defaults.Domicile),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }]
                        }, {
                            xtype: 'panel',
                            region: 'center',
                            border: 0,
                            items: [{
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">证件号码</span>：{0}", defaults.CardNo),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">文化程度</span>：{0}", defaults.Education),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">婚姻状况</span>：{0}", defaults.MarriageStatus),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">兵役状况</span>：{0}", defaults.SoldierStatus),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">政治面貌</span>：{0}", defaults.PoliticalStatus),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">宗教信仰</span>：{0}", defaults.Religion),
                                border: 0,
                                style: 'height:22px; line-height:22px;'
                            }, {
                                xtype: 'panel',
                                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">籍贯</span>：{0},{1}", defaults.OriginProvince, defaults.OriginCity),
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
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">家庭住址</span>：{0}", defaults.HomeAddress),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }, {
                            xtype: 'panel',
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">当前住址</span>：{0}", defaults.CurrentAddress),
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
                            html: String.Format("<span style=\"margin-left:25px; font-weight:700; font-size:11px; color:#15498b;\">人口性质</span>：{0}", defaults.LiveType),
                            border: 0,
                            style: 'height:22px; line-height:22px;'
                        }]
                    }, {
                        xtype: 'panel',
                        region: 'center',
                        border: 0,
                        items: [{
                            xtype: 'panel',
                            html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">重口类别</span>：{0}", defaults.PsychosisType || '无'),
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
            border: 0, layout: 'fit', items: [$.parent.Abroad.grid.Grid({ id: data.CardNo })]
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

})(populationQuery.population.detail = populationQuery.population.detail || { parent: populationQuery.population });

//@ 户籍信息
(function ($) {

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), req: 'pops', ids: null, model: $.parent.parent.model.type, total: false, pagerSize: 25 };
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

})(populationQuery.population.HRelation = populationQuery.population.HRelation || { parent: populationQuery.population });

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
                { name: 'Company' },
                { name: 'EntryTime' },
                { name: 'QuitTime' }
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
            { dataIndex: 'EntryTime', text: '入职时间', width: 120, sortable: false, hidden: false, renderer: parseString },
            { dataIndex: 'QuitTime', text: '离职时间', width: 120, sortable: false, hidden: false, renderer: parseString }//,
            //{ dataIndex: 'OrganID', text: '操作', width: 40, sortable: false, hidden: false }
        ];

        var Grid = me.Grid = function (options) {
            var defaults = { req: 'popcom', id: null, pager: false };
            Ext.apply(defaults, options);
            var store = $.store.Store({ req: String.Format("{0}&id={1}", defaults.req, defaults.id), total: defaults.pager });
            return ExtHelper.CreateGridNoCheckbox({ store: store, columns: columns, pager: defaults.pager });
        };

    })($.grid = $.grid || {});

})(populationQuery.population.Company = populationQuery.population.Company || { parent: populationQuery.population });

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
            { dataIndex: 'TP_Date', text: '来本址日期', width: 100, sortable: false, hidden: false }
        ];

        var Grid = me.Grid = function (options) {
            var defaults = { req: 'poptemp', id: null, pager: false };
            Ext.apply(defaults, options);
            var store = $.store.Store({ req: String.Format("{0}&id={1}", defaults.req, defaults.id), total: defaults.pager });
            return ExtHelper.CreateGridNoCheckbox({ store: store, columns: columns, pager: defaults.pager });
        };

    })($.grid = $.grid || {});

})(populationQuery.population.Temporary = populationQuery.population.Temporary || { parent: populationQuery.population });


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
                { name: 'ValidityDate', type:'string' },
                { name: 'VisaTypeName' },
                { name: 'VisaNoAndValidity' },
                { name: 'StayValidityDate', type: 'string' },
                { name: 'EntryPort' },
                { name: 'EntryDate', type: 'string' },
                { name: 'ArrivalDate', type: 'string' },
                { name: 'LiveDate', type: 'string' },
                {
                    name: 'LeaveDate',
                    type: 'string'
                },
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
            {
                dataIndex: 'ValidityDate', text: '证件有效期至', width: 100, sortable: false, hidden: true, renderer: parseString
            },
            { dataIndex: 'VisaTypeName', text: '签证类型', width: 100, sortable: false, hidden: true },
            { dataIndex: 'VisaNoAndValidity', text: '签证号码及期限', width: 100, sortable: false, hidden: true },
            { dataIndex: 'EntryPort', text: '入境口岸', flex: 1, sortable: false, hidden: false },
            {
                dataIndex: 'EntryDate', text: '入境时间', width: 100, sortable: false, hidden: false, renderer: parseString
            },
            {
                dataIndex: 'LeaveDate', text: '离境时间', width: 100, sortable: false, hidden: false, renderer: parseString
            },
            { dataIndex: 'LiveDate', text: '拟往日期', width: 100, sortable: false, hidden: true, renderer: parseString },
            {
                dataIndex: 'ArrivalDate', text: '抵达日期', width: 100, sortable: false, hidden: true, renderer: parseString
            },
            { dataIndex: 'StayReason', text: '停留事由', flex: 1, sortable: false, hidden: true },
            {
                dataIndex: 'StayValidityDate', text: '停留有效期至', width: 100, sortable: false, hidden: true, renderer: parseString
            },
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

})(populationQuery.population.Abroad = populationQuery.population.Abroad || { parent: populationQuery.population });

(function ($) {
    
    var interval = setInterval(function () {
        if (typeof qForm !== 'undefined') {
            clearInterval(interval);
            $.form = qForm.getQueryForm(qForm.qFormType.panelQuery, panelQueryCallback);
        }
    }, 500);

    //获取到座标，从后台获取数据，并呈现
    function panelQueryCallback(coords) {
        //清楚各项图层信息
        EMap.Clear();
        var c = Ext.getCmp(populationQuery.resultcontainerid);
        c.removeAll(true);
        c.add(populationQuery.grid.Grid({
            req: String.Format("coords&coords={0}", coords)
        }));
        if (c.collapsed) {
            c.expand();
        }
    }

})(populationQuery.kx);

function parseString(date) {
    var val = Date.formatDate(date);
    return (val == '1-01-01') ? '' : val;
}