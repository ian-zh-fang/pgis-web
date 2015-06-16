/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/qForm.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/ImgPlayer.js" />
/// <reference path="../Company/Company.js" />


var buildingQuery = buildingQuery || {};
(function ($) {

    var basic_url = $.basic_url = 'Buildings/BuildingHelp.ashx?req=';
    var resultcontainerid = 'extEast';
    var wind = null;
    var tab = null;

    var Show = $.Show = function () {
        var form = qForm.getQueryForm(qForm.qFormType.buildingQuery, query);
        return form;
    };

    var ShowDetail = $.ShowDetail = function (options) {
        var defaults = {
            title: '楼房详细信息...', height: 400, width: 700, layout: 'fit', listeners: { 'close': dispose }
        };
        Ext.apply(defaults, options);

        init(options);

        wind = $.window = $.window || ExtHelper.CreateWindow(defaults);
        wind.add(tab.tab);
    };

    var Add = $.Add = function (options) {
        var defaults = { com: null, title: '这里是选项卡名称', closable: false };
        Ext.apply(defaults, options);

        if (!defaults.com)
            throw new ReferenceError('null reference');

        tab.add({ component: defaults.com, closable: defaults.closable, title: defaults.title });
    };

    var createSupper = $.createSupper = function (name) {
        return Object.$Supper($, name);
    };

    var Get = $.Get = function (options) {
        /// <summary>获取数据</summary>
        /// <param name="options" type="Object">
        /// <para>String p</para>
        /// <para>String url</para>
        /// <para>Function(Array) callback</para>
        /// </param>
        /// <returns type="Ext.data.JsonStore" />

        var defaults = { p: null, msg:null, url: null, fields:[], callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        if (!defaults.url)
            throw new ReferenceError('null reference.');

        if (!defaults.fields)
            throw new ReferenceError('null reference.');

        if (!(defaults.fields instanceof Array))
            throw new TypeError('must be array.');

        if (!defaults.fields.length)
            throw new RangeError('out of range.');
        
        var maskinstance = null;
        var store = new Ext.data.JsonStore({
            storeId: identityManager.createId(),
            fields: defaults.fields || [],
            proxy: {
                type: 'ajax',
                url: defaults.url,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            listeners: {
                'beforeload': function () { maskinstance = maskGenerate.start({ p: defaults.p, msg: defaults.msg || '正在获取数据...' }); },
                'load': function (a, b, c) {
                    if (maskinstance) maskinstance.stop();

                    if (b && b.length) {
                        defaults.callback([].concat(b));
                    }
                }
            }
        });
        store.load();
        return store;
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

    (function (me) {
        var tp = me.type = identityManager.createId('model');
        var model = Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'MOI_ID' },//大楼ID
                { name: 'MOI_MEH_ID' },//热区详细ID
                { name: 'Building_ID' },//大楼子表ID
                { name: 'MOI_LabelName' },//大楼标题，应该和名称一致
                { name: 'MOI_OwnerName' },//大楼名称
                { name: 'MOI_OwnerAddress' },//地址
                { name: 'MOI_OwnerTel' },//联系电话
                { name: 'MEH_Croods' },//座标
                { name: 'MOI_OwnerDes' },//备注
                { name: 'StreetName' },//街道
                { name: 'StreetNumber' },//门牌号
                { name: 'FloorsCount' },//楼层数
                { name: 'RoomsCount' },//房间总数
                { name: 'AdminID' },//行政区划ID
                { name: 'AdminName' },//行政区划名称
                { name: 'RoomStructureID' },//大楼结构ID
                { name: 'RoomStructure' },//大楼结构名称
                { name: 'ElementHot' },  //热区信息详细信息
                { name: 'MEH_CenterX' },
                { name: 'MEH_CenterY' }
            ]
        });
    })(Object.$Supper($, 'model'));
    
    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), req: 'pagebdby', params: {}, total: true, pageSize: 20, model: $.model.type };
            Ext.apply(defaults, options);
            defaults.url = encodeURI(String.Format("{0}{1}", basic_url, defaults.req));

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })(Object.$Supper($, 'store'));

    (function (me) {

        var columns = [
            {
                xtype: 'rownumberer', width: 30, sortable: false, text: '序', renderer: function (value, obj, record, index) {
                    return index + 1;
                }
            },
            { dataIndex: 'MOI_OwnerName', text: '大楼名称', flex: 1, hidden: false },
            { dataIndex: 'MOI_OwnerAddress', text: '详细地址', flex: 1, hidden: true },
            { dataIndex: 'MOI_OwnerTel', text: '联系电话', flex: 1, hidden: true },
            { dataIndex: 'MOI_OwnerDes', text: '备注', flex: 1, hidden: true },
            {
                dataIndex: 'MOI_ID', /*text: '',*/ width: 80, renderer: function (a, b, c) {
                    var data = c.getData();
                    var v = encodeObj(data);
                    var str = String.Format('<span class="a" onclick="{0}(\'{1}\')">&nbsp;查看</span>', 'buildingQuery.grid.Detail', v);
                    str += "&nbsp;&nbsp;&nbsp;";
                    str += String.Format('<span class="a" onclick="{0}(\'{1}\')">&nbsp;定位</span>', 'buildingQuery.grid.Location', v);

                    return str;
                }
            }
        ];

        me.Grid = function (options) {
            var defaults = { pager: true, params: {} };
            Ext.apply(defaults, options);

            var store = $.store.Store({params:defaults.params, total:defaults.pager});
            var grid = ExtHelper.CreateGridNoCheckbox({ columns: columns, store: store, pager: defaults.pager });
            return grid;
        };

        me.Detail = function (v) {
            var d = decodeObj(v);
            ShowDetail(d);
        };

        me.Location = function (v) {
            var data = decodeObj(v);
            var defaults = { MEH_CenterX: 0, MEH_CenterY: 0, MOI_OwnerName: '', MOI_OwnerAddress: '', MOI_ID: 0 };
            Ext.apply(defaults, data);

            //var html = String.Format('<div style="cursor:pointer; color:#15498b; font-size:11px; font-weight:700; background-color:#ddd; text-align:center; line-height:{1}px;" title="{0}({2})   点击查看详细" >{0}</div>', defaults.MOI_OwnerName, 16, defaults.MOI_OwnerAddress);
            //EMap.AppendEntityEx({
            //    id: String.Format("x-bd-locate-{0}", defaults.MOI_ID),
            //    width: 65,
            //    height: 16,
            //    x: defaults.MEH_CenterX,
            //    y: defaults.MEH_CenterY,
            //    innerHTML: html,
            //    className: 'content-cut a',
            //    click: function () {
            //        ShowDetail(data);
            //    }
            //});

            EMap.ShowBuildingPop({ ID: defaults.MOI_ID, Name: defaults.MOI_LabelName, Cx: defaults.MEH_CenterX, Cy: defaults.MEH_CenterY });
            EMap.MoveTo(defaults.MEH_CenterX, defaults.MEH_CenterY);
        };

    })(Object.$Supper($, 'grid'));
    
    function init(options) {
        var defaults = {
            MOI_ID: 0, MOI_MEH_ID: 0, MOI_LabelName: null, MOI_OwnerName: null, MOI_OwnerAddress: null, MOI_OwnerTel: null, MOI_OwnerDes: null,
            ElementHot: {
                MEH_ID: 0, MEH_MOI_ID: 0, MEH_CenterX: 0, MEH_CenterY: 0, MEH_Croods: null, MEH_HotLevel: '0,1,'
            }
        };
        Ext.apply(defaults, options);

        tab = $.tabpanel = $.tabpanel || ExtHelper.CreateTabPanelFn();

        Add({ com: $.Basic.Form(options), title: '基本信息' });
        Add({ com: $.Population.grid.Grid({ ids: defaults.MOI_ID }), title: '人口信息' });
        Add({ com: $.Company.grid.Grid({ ids: defaults.MOI_ID }), title: '单位信息' });

        tab.tab.setActiveTab(0);
    }

    function query(form) {
        var c = Ext.getCmp(resultcontainerid);
        c.removeAll(true);

        var items = form.items.items;
        var params = {};
        for (var i = 0; i < items.length; i++) {
            var cp = items[i];
            params[cp.name] = cp.rawValue;
        }
        c.add($.grid.Grid({ params: params }));

        if (c.collapsed) {
            c.expand();
        }
        EMap.Clear();
    }

    function dispose() {
        /// <summary>回收系统资源</summary>

        wind = $.window = null;
        tab = $.tabpanel = null;
    }

})(buildingQuery);

(function ($) {

    $.Form = function (options) {
        var defaults = {
            MOI_ID: 0, MOI_MEH_ID: 0, MOI_LabelName: null, MOI_OwnerName: null, MOI_OwnerAddress: null, MOI_OwnerTel: null, MOI_OwnerDes: null,
            ElementHot: {
                MEH_ID: 0, MEH_MOI_ID: 0, MEH_CenterX: 0, MEH_CenterY: 0, MEH_Croods: null, MEH_HotLevel: '0,1,'
            }
        };
        Ext.apply(defaults, options);
        
        var maskid = identityManager.createId();
        var imgid = identityManager.createId();
        var fields = ['name', 'count', {name:'flag', type:'Boolean'}];
        var chart = ExtHelper.createChart({ fields: fields, displayField: 'name', valueField: 'count' });
        return {
            xtype: 'panel',
            layout: 'border',
            border: 0,
            style: 'border-right:1px solid lightgray;',
            items: [{
                xtype: 'panel',
                region: 'west',
                border: 0,
                layout: 'border',
                width: 200,
                split: true,
                defaults: {},
                items: [{
                    xtype: 'panel',
                    region: 'north',
                    border: 0,
                    layout: 'fit',
                    style:'border-bottom:1px solid lightgray;',
                    height: 22,
                    html: String.Format('<div style="margin-left:8px; color:#660000; font-weight:700; line-height:22px; " class="content-cut" title="{0}({1})">{0}<span style="color:#999; font-size:11px;" title="{0}&nbsp;({1})">&nbsp;({1})</span></div>', defaults.MOI_OwnerName, defaults.MOI_OwnerAddress)
                }, {
                    xtype: 'panel',
                    region: 'center',
                    border: 0,
                    layout: 'border',
                    id:maskid,
                    items: [{
                        xtype: 'panel',
                        region: 'center',
                        border: 0,
                        layout:'fit',
                        items: [chart.chart]
                    }, {
                        xtype: 'panel',
                        region: 'south',
                        border: 0,
                        height: 50,
                        layout: 'fit',
                        listeners: {
                            'boxready': function (a, b, c) {
                                //统计人口总数
                                //统计单位总数
                                
                                var me = this;
                                var url = String.Format('{0}ttb&id={1}', $.supper.basic_url, defaults.MOI_ID);
                                var s = $.supper.Get({
                                    p: maskid, msg: '正在统计数据...', url: url, fields: fields, callback: function (d) {
                                        var arr = [];
                                        d.Each(function (e) {
                                            e = e.getData();
                                            if (e.flag) {
                                                me.add({
                                                    xtype: 'label',
                                                    html: String.Format('<div style="height:{0}px; line-height:{0}px; margin-left:8px;" class="content-cut">{1}：{2}</div>', 20, e.name, e.count)
                                                });
                                            } else if(e.count){
                                                arr.push(e);
                                            }
                                        });
                                        chart.store.loadData(arr);
                                    }
                                });
                            }
                        },
                        items: []
                    }]
                }, {
                    xtype: 'panel',
                    region: 'south',
                    border: 0,
                    layout: 'border',
                    height: 130,
                    items: [{
                        xtype: 'panel',
                        region: 'north',
                        border: 0,
                        style: 'border-bottom:1px solid lightgray;',
                        height: 20,
                        html: '<div style="color:#15498b; font-size:11px; font-weight:700; margin-left:8px; line-height:18px;" class="content-cut">照片信息:</div>',
                        items:[]
                    }, {
                        xtype: 'panel',
                        region: 'center',
                        border: 0,
                        html: String.Format('<div style="margin-left:5px; margin-top:5px; " id="{0}"></div>', imgid),
                        listeners: {
                            'boxready': function (a, b, c) {
                                var me = this;

                                var url = String.Format('{0}picts&id={1}', $.supper.basic_url, defaults.MOI_ID);
                                var s = $.supper.Get({
                                    p: imgid, url: url, fields: ['MOP_ImgTitle', 'MOP_ImgPath', 'MOP_ImgName'], callback: function (d) {

                                        PImgPlayer.clearItem();
                                        d.Each(function (e) {
                                            e = e.getData();
                                            PImgPlayer.addItem(e.MOP_ImgTitle, '', String.Format('Uploads\\{0}', e.MOP_ImgName));
                                        });

                                        var width = me.getWidth() - 10;
                                        var height = me.getHeight() - 10;
                                        PImgPlayer.init(imgid, width, height, 3500, function (items, index) {
                                            //var img = items[index];
                                            buildingQuery.PicManager.init(items, index).show();                                            
                                        });
                                    }
                                });
                            }
                        },
                        items: []
                    }]
                }]
            }, {
                xtype: 'panel',
                region: 'center',
                border: 0,
                layout: 'border',
                items: [{
                    xtype: 'panel',
                    region: 'center',
                    border: 0,
                    layout: 'fit',
                    items: [$.supper.Room.grid.Grid({id:defaults.MOI_ID})]
                }]
            }]
        };
    };

})(buildingQuery.createSupper('Basic'));

(function ($) {

    var _items = [];
    var _index = 0;

    $.init = function (items, index) {
        _items = [].concat(items);
        _index = index ? index : 0;

        return $;
    };

    $.show = function () {
        var img = _items[_index];
        var wnd = ExtHelper.CreateWindow({ title: '大楼图片查看，点击图片查看下一张', height: 500, width: 800 });
        wnd.add({
            layout: 'fit',
            html: Ext.util.Format.format('<img src="{0}" height="463" width="790" title="点击查看下一张" onclick="buildingQuery.PicManager.next(this)" style="cursor:pointer;"></img>', img.img)
        });

        return wnd;
    };

    $.next = function (imgElement) {
        setIndex();
        var img = _items[_index];
        if (img)
            imgElement.setAttribute('src', img.img);
    }

    function setIndex() {
        if (_index < 0)
            return _index = 0;
        
        _index++;
        if (_index >= _items.length)
            return _index = 0;

        return _index;
    }

})(buildingQuery.createSupper('PicManager'));

(function ($) {

    //@ model
    (function (me) {

        var tp = me.type = identityManager.createId('model');

        var model = Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Room_ID' },
                { name: 'RoomName' },
                { name: 'RoomName2' },
                { name: 'RoomArea' },
                { name: 'RoomUseID' },
                { name: 'RoomUse' },
                { name: 'RoomAttributeID' },
                { name: 'RoomAttribute' },
                { name: 'UnitID' },
                { name: 'UnitName' },
                { name: 'OwnerInfoID' }
            ]
        });

        var defaults = me.defaults = { Room_ID: 0, RoomName: null, RoomName2: null, RoomArea: null, RoomUseID: 0, RoomUse: null, RoomAttributeID: 0, RoomAttribute: null, UnitID: 0, UnitName: null, OwnerInfoID: 0 };

    })(Object.$Supper($, 'model'));

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { req: 'rooms', storeId: identityManager.createId(), groupField: 'UnitName', model: $.model.type, total: false, pageSize: 18, callback: Ext.emptyFn };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.supper.basic_url, defaults.req);

            var store = ExtHelper.CreateStore(defaults);
            store.on('load', function (a, b, c) {
                defaults.callback(a, b, c);
            });
            return store;
        };

    })(Object.$Supper($, 'store'));

    //@ grid
    (function (me) {

        var columns = [
            //{ xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'RoomName', text: '名称', width:100, sortable: false, hidden: false },
            { dataIndex: 'RoomName2', text: '别名', width: 100, sortable: false, hidden: true },
            { dataIndex: 'RoomArea', text: '面积 (㎡)', width:70, sortable: false, hidden: false },
            { dataIndex: 'RoomUseID', text: '房屋用途ID', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'RoomUse', text: '用途', flex: 1, sortable: false, hidden: false },
            { dataIndex: 'RoomAttributeID', text: '房屋属性ID', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'RoomAttribute', text: '属性', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'UnitID', text: '所属单元ID', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'UnitName', text: '单元&座', width:60, sortable: false, hidden: false },
            { dataIndex: 'OwnerInfoID', text: '所属楼房ID', flex: 1, sortable: false, hidden: true },
            {
                dataIndex: 'Room_ID', text: '', width: 45, sortable: false, hidden: false, renderer: function (a, b, c) {
                    var data = c.getData();
                    var val = $.supper.encodeObj(data);
                    return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', 'buildingQuery.Room.grid.ShowDetail', val);
                }
            }
        ];

        me.Grid = function (options) {
            var defaults = { id: 0, callback: Ext.emptyFn };
            Ext.apply(defaults, options);

            var store = $.store.Store({ total: false, req: String.Format('hrooms&id={0}', defaults.id) });
            var grid = ExtHelper.CreateGridNoCheckbox({
                columns: columns, store: store, pager: false, features: [{ ftype: 'grouping' }]
            });
            return grid;
        };

        me.ShowDetail = function (v) {
            var data = $.supper.decodeObj(v);
            Show(data);
        };

        function Show(d) {
            var defaults = me.defaults = { Room_ID: 0, RoomName: null, RoomName2: null, RoomArea: null, RoomUseID: 0, RoomUse: null, RoomAttributeID: 0, RoomAttribute: null, UnitID: 0, UnitName: null, OwnerInfoID: 0 };
            Ext.apply(defaults, d);

            var tab = init(defaults.Room_ID);
            var wind = ExtHelper.CreateWindow({ title: String.Format('房屋：{0}', defaults.RoomName), width: 600, height: 400, layout: 'fit' });
            wind.add(tab);
        }

        function init(id) {
            var tab = ExtHelper.CreateTabPanelFn();
            tab.add({ component: $.supper.Population.grid.Grid({ req: 'pops', ids: id, pager: false }), closable: false, title: '人员信息' });
            tab.add({ component: $.supper.Company.grid.Grid({ req: 'companys', ids: id }), closable: false, title: '单位信息' });
            tab.tab.setActiveTab(0);

            return tab.tab;
        }

    })(Object.$Supper($, 'grid'));

})(buildingQuery.createSupper('Room'));

(function ($) {



})(buildingQuery.createSupper('Photo'));

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
            defaults.url = String.Format('{0}{1}&ids={2}', $.basic_url, defaults.req, defaults.ids);

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })($.store = $.store || {});

    //@ grid
    (function (me) {

        var columns = [
            { xtype: 'rownumberer', text: '序', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'Name', text: '姓名', sortable: false, hidden: false, width:80 },
            { dataIndex: 'OtherName', text: '曾用名', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'CardNo', text: '身份证', sortable: false, hidden: false, flex: 1 },
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
                dataIndex: 'IsPsychosis', text: '重点人口', sortable: false, hidden: false, width: 100, renderer: function (a, b, c) {
                    switch (a) {
                        case 1:
                            return 'Yes';
                        default:
                            return 'N/A';
                    }
                }
            },//标识常口，重口，暂口，境外人口以及相应类型
            //{ dataIndex: 'PsychosisType', text: '重点人口类别', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'HouseholdNo', text: '户号', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'HRelation', text: '与户主关系', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'PhotoPath', text: '人员照片', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'HomeAddress', text: '家庭住址', sortable: false, hidden: false, flex: 2 },
            { dataIndex: 'CurrentAddress', text: '当前住址', sortable: false, hidden: true, flex: 2 },
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
                    var val = $.supper.encodeObj(data);
                    var str = String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', 'buildingQuery.Population.grid.ShowDetail', val);
                    return str;
                }
            }
        ];

        me.Grid = function (options) {
            var defaults = { req: 'poponbd', ids: null, columns: columns, pager: true, height: 200, enable: true };
            Ext.apply(defaults, options);

            var store = $.store.Store({ ids: defaults.ids, total: defaults.pager, req: defaults.req });

            var grid = ExtHelper.CreateGridNoCheckbox({
                height: defaults.height, columns: defaults.columns, store: store, pager: defaults.pager
            });
            return grid;
        };

        me.ShowDetail = function (val) {
            var data = $.supper.decodeObj(val);
            $.detail.Show(data);
        }

    })($.grid = $.grid || {});

})(buildingQuery.createSupper('Population'));

(function ($) {

    //@ model
    (function (me) {

        var tp = me.type = identityManager.createId('model');

        var model = me.model = Ext.define(tp, {
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
                { name: 'Addr'}
            ]
        });

        /// <summary>类型默认值</summary>
        var defaults = me.defaults = {
            ID: 0, TypeID: 0, TypeName: null, GenreID: 0, GenreName: null, Name: null, AddressID: 0, TradeID: 0, TradeName: null, Capital: 0, Corporation: null,
            Square: 0.00, StartTimeStr: null, Tel: null, LicenceNum: null,
            LicenceStartTimeStr: null, LicenceEndTimeStr: null,
            MainFrame: null, Concurrently: null, MigrantWorks: 0, FireRating: 0, OrganID: 0, OrganName: null, RoomID: 0, Address: null
        };

    })($.model = $.model || {});

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), model: $.model.type, req: null, total: true, pageSize: 18 };
            Ext.apply(defaults, options);
            defaults.url = String.Format('{0}{1}', $.supper.basic_url, defaults.req);

            var store = ExtHelper.CreateStore(defaults);
            return store;
        };

    })($.store = $.store || {});

    //@ grid
    (function (me) {

        var columns = [
            { xtype: 'rownumberer', text: '', width: 25, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
            { dataIndex: 'Name', itemId: 'Name', text: '名称', sortable: false, hidden: false, flex: 1 },
            { dataIndex: 'Tel', itemId: 'Tel', text: '联系电话', sortable: false, hidden: false, width: 85 },
            { dataIndex: 'TypeName', itemId: 'TypeName', text: '单位大类', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'GenreName', itemId: 'GenreName', text: '单位小类', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'TradeName', itemId: 'TradeName', text: '行业类型', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Capital', itemId: 'Capital', text: '注册资金', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Corporation', itemId: 'Corporation', text: '法人', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Square', itemId: 'Square', text: '经营面积 (㎡)', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'StartTimeStr', itemId: 'StartTimeStr', text: '开业日期', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LicenceNum', itemId: 'LicenceNum', text: '营业执照编号', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LicenceStartTimeStr', itemId: 'LicenceStartTimeStr', text: '营业执照开始日期', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'LicenceEndTimeStr', itemId: 'LicenceEndTimeStr', text: '营业执照截止日期', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MainFrame', itemId: 'MainFrame', text: '主营经营范围', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'Concurrently', itemId: 'Concurrently', text: '兼营经营范围', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'MigrantWorks', itemId: 'MigrantWorks', text: '外来务工人数', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'FireRating', itemId: 'FireRating', text: '消防等级', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'OrganName', itemId: 'OrganName', text: '所属管辖机关', sortable: false, hidden: true, flex: 1 },
            { dataIndex: 'RoomID', itemId: 'RoomID', text: '房间', sortable: false, hidden: true, width:65 },
            { dataIndex: 'Addr', itemId: 'Addr', text: '联系地址', sortable: false, hidden: false, flex: 2 },
            {
                dataIndex: 'ID', text: '', sortable: false, hidden: false, width: 55, renderer: function (a, b, c) {
                    var data = c.getData();
                    var val = $.supper.encodeObj(data);
                    return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', 'buildingQuery.Company.grid.ShowDetail', val);
                }
            }
        ];

        me.Grid = function (options) {
            var defaults = { req: 'comonbd', ids: 0, title: '', pager: false, hideHeaders: false };
            Ext.apply(defaults, options);
            var store = me.store = $.store.Store({ req: String.Format('{0}&ids={1}', defaults.req, defaults.ids) });
            var grid = ExtHelper.CreateGridNoCheckbox({
                columns: columns, store: store, pager: defaults.pager, hideHeaders: defaults.hideHeaders
            });

            return grid;
        };

        me.ShowDetail = function (val) {
            var data = $.supper.decodeObj(val);
            $company.detail.Show(data);
        };

    })($.grid = $.grid || {});

})(buildingQuery.createSupper('Company'));

(function ($) {
    var me = $;
    var basic_url = $.basic_url = $.supper.basic_url;
})(buildingQuery.Population);

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

})(buildingQuery.Population.detail = buildingQuery.Population.detail || { parent: buildingQuery.Population });

(function ($) {

    //@ store
    (function (me) {

        me.Store = function (options) {
            var defaults = { storeId: identityManager.createId(), req: 'pops', ids: null, model: $.parent.model.type, total: false, pagerSize: 25 };
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

})(buildingQuery.Population.HRelation = buildingQuery.Population.HRelation || { parent: buildingQuery.Population });

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

})(buildingQuery.Population.Company = buildingQuery.Population.Company || { parent: buildingQuery.Population });

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

})(buildingQuery.Population.Temporary = buildingQuery.Population.Temporary || { parent: buildingQuery.Population });

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

})(buildingQuery.Population.Abroad = buildingQuery.Population.Abroad || { parent: buildingQuery.Population });

LoadModlues.loadJS(typeof $company, 'Resources/js/Param.js', function () {
    LoadModlues.loadJS(typeof $company, 'Company/Company.js');
});