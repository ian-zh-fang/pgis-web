/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/qForm.js" />
/// <reference path="../Resources/js/totalCase.js" />

var JCJ_JJDBManager = JCJ_JJDBManager || {};

(function ($) {
    //私有全局变量
    var url = 'JCJ_JJDB/JCJ_JJDBHandler.ashx?req=';
    //结果面板容器ID
    var resultcontainerid = 'extEast';

    //原型
    $.fn = $.constructor.prototype;

    //报警类型，与图标文件名称一致
    $.alarm = {
        alarm_110: '110',
        alarm_122: '122',
        alarm_school: 'school',
        alarm_bank: 'bank',
        alarm_other: 'other'
    };
    $.model = { type: String.Format("model_{0}", new Date().getTime()) };
    $.model.defaults = { ID: null, Num: null, TypeID: null, TypeName: null, Tel: null, AlarmMan: null, Location: null, X: null, Y: null, AlarmTime: null, AdminID: null, AdminName: null };
    $.model.model = function () {
        var m = Ext.define($.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },//主键
                { name: 'Num' },//报警编号
                { name: 'TypeID' },//报警类别ID
                { name: 'TypeName' },//报警类别名称
                { name: 'Tel' },//报警电话
                { name: 'AlarmMan' },//报警人
                { name: 'Location' },//报警地址
                { name: 'X' },//X坐标
                { name: 'Y' },//Y坐标
                { name: 'AlarmTime' },//报警时间
                { name: 'AdminName' },//行政区划名称
                { name: 'AdminID' }//行政区划ID
            ]
        });
        return m;
    }();
    $.store = {};
    $.store.Store = function (options) {
        //debugger;
        var defaults = { req: '1', params: {}, id: String.Format("store_{0}", new Date().getTime()) };
        Ext.apply(defaults, options);

        var uri = url + defaults.req + getParams(defaults.params);
        //uri = encodeURI(uri);
        var store = ExtHelper.CreateStore({
            storeId: defaults.id,
            url: encodeURI(uri),
            model: $.model.type,
            total: true, pageSize: 15
        });
        $.store.id = defaults.id;
        return store;
    };
    $.grid = {};
    $.grid.columns = function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Num', text: '案件编号', flex: 1 },
            {
                dataIndex: 'ID', text: '操作', lock: true, sortable: false, width: 70, renderer: function (value, obj, record) {
                    //debugger;
                    var data = record.getData();
                    var val = Ext.JSON.encodeValue(data);
                    val = encodeURI(val);
                    var html = "<a href=\"#\" onclick=\"JCJ_JJDBManager.detailCallback('" + val + "')\" >详细</a>";
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                    html += "<a href=\"#\" onclick=\"JCJ_JJDBManager.locationCallback('" + val + "')\" >定位</a>";
                    return html;
                }
            }];
        return c;
    }();
    $.grid.Grid = function (options) {
        //debugger;
        var defaults = { req: '1', params: {} };
        Ext.apply(defaults, options);

        this.store = $.store.Store(defaults);
        var grid = ExtHelper.CreateGridNoCheckbox({
            store: this.store,
            width: 198,
            height: 513,
            columns: this.columns,
            pager: true
        });
        return grid;
    };
    $.form = qForm.getQueryForm(qForm.qFormType.JCJ_JJDB, submitFn);

    /******************************************************
     *@public function  公有函数
     ******************************************************
     */

    $.locationCallback = function (s) {
        locationCallback(decodeData(s));
    };

    $.detailCallback = function (s) {
        detailCallback(decodeData(s));
    };

    /******************************************************
     *@detailpanel  详细情况
     ******************************************************
     */

    $.detail = {};
    $.detail.grid = {};
    $.detail.grid.model = { type: String.Format("model_{0}", new Date().getTime()) };
    $.detail.grid.model.model = function () {
        var m = Ext.define($.detail.grid.model.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'TypeID' },
                { name: 'TypeName' },
                { name: 'TodayTickCount' },
                { name: 'ThisWeekTickCount' },
                { name: 'ThisMonthTickCount' },
                { name: 'ThisYearTickCount' }
            ]
        });
        return m;
    }();
    $.detail.grid.store = { id: String.Format("store_{0}", new Date().getTime()) };
    $.detail.grid.store.Store = function (options) {
        var defaults = Ext.apply({}, options, $.model.defaults);

        var store = ExtHelper.CreateStore({
            storeId: $.detail.grid.store.id,
            url: String.Format("{0}2&adminid={1}", url, defaults.AdminID),
            model: $.detail.grid.model.type
        });
        return store;
    };
    $.detail.grid.columns = function () {
        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'TypeID', text: '分类编号', flex: 1, hidden: true },
            {
                dataIndex: 'TypeName', text: '分类名称', flex: 2, renderer: function (value, obj, record) {
                    return value || '未知';
                }
            },
            { dataIndex: 'TodayTickCount', text: '当天警情数', flex: 1 },
            { dataIndex: 'ThisWeekTickCount', text: '本周警情数', flex: 1 },
            { dataIndex: 'ThisMonthTickCount', text: '本月警情数', flex: 1 },
            { dataIndex: 'ThisYearTickCount', text: '本年警情数', flex: 1 }
        ];
        return c;
    }();
    $.detail.grid.Grid = function (options) {
        //如果当前表格存在，直接返回当前表格
        if (this.grid) {
            this.grid.grid;
        }
        //如果当前表格不存在，那么创建当前表格，并返回
        var store = this.store.Store(options);
        this.grid = { store: store };
        this.grid.grid = ExtHelper.CreateGridNoCheckbox({
            columns: this.columns,
            store: store,
            height: 150
        });
        return this.grid.grid;
    };
    $.detail.Panel = function (options) {
        //debugger;
        var defaults = Ext.apply({}, options, $.model.defaults);
        var form = ExtHelper.CreateForm({ anchor: '100%', layout: 'column', buttonstext: '关闭（<u>C</u>）', callback: detailFormCallback });
        form.add({
            xtype: 'label',
            columnWidth: .4,
            html: String.Format("报警编号：{0}", defaults.Num),
            style: 'height:25px;'
        }, {
            xtype: 'label',
            columnWidth: .6,
            //html: String.Format("地图座标：{{0}, {1}}", defaults.X, defaults.Y),
            style: 'height:25px;'
        }, {
            xtype: 'label',
            columnWidth: .4,
            html: String.Format("警报类别：{0}", defaults.TypeName || '未知'),
            style: 'height:25px;'
        }, {
            xtype: 'label',
            columnWidth: .6,
            html: String.Format("报警时间：{0}", defaults.AlarmTime ? defaults.AlarmTime.toLocaleString() : ''),
            style: 'height:25px;'
        }, {
            xtype: 'label',
            columnWidth: .4,
            html: String.Format("报警人：{0}", defaults.AlarmMan || '匿名'),
            style: 'height:25px;'
        }, {
            xtype: 'label',
            columnWidth: .6,
            html: String.Format("行政区划：{0}", defaults.AdminName || '无'),
            style: 'height:25px;'
        }, {
            xtype: 'label',
            columnWidth: 1,
            html: String.Format("报警电话：{0}", defaults.Tel || '无'),
            style: 'height:25px;'
        }, {
            xtype: 'label',
            columnWidth: 1,
            html: String.Format("报警地址：{0}", defaults.Location || '无'),
            style: 'height:25px;'
        }, {
            xtype: 'label',
            columnWidth: 1,
            style: 'height:12px;'
        }, {
            xtype: 'fieldset',
            layout: 'anchor',
            style: 'padding-bottom:5px',
            defaults: { anchor: '100%' },
            columnWidth: 1,
            title: '当前行政区划案件统计',
            items: [this.grid.Grid(defaults)]
        });
        return form;
    };


    /******************************************************
     *@private function  私有全局函数
     ******************************************************
     */

    //反序列化数据
    function decodeData(s) {
        s = decodeURI(s);
        var data = Ext.JSON.decode(s);
        return data;
    }
    //定位
    function locationCallback(options) {
        //debugger;
        var defaults = Ext.apply({}, options, $.model.defaults);

        var point = ELatLng2EPoint({ Lat: defaults.X, Lng: defaults.Y });
        defaults.X = point.X + 121382;
        defaults.Y = point.Y + 53652;

        if (defaults.X && defaults.Y) {
            //绘制图像
            var html = String.Format("<img style='width:32px;height:32px;' src='../Resources/images/case/{0}.gif'  title='{1}'></img>", $.alarm.alarm_110, defaults.Location || defaults.Num);
            EMap.AppendEntity(defaults.ID, { x: defaults.X, y: defaults.Y, exX: 16, exY: 16 }, { html: html });
            //移动到当前座标
            EMap.MoveTo(defaults.X, defaults.Y);
        } else {
            errorState.show('坐标不明确，定位失败！');
        }
    }
    //详细窗口提交按钮回调函数
    function detailFormCallback() {
        $.detail.window.close();
        $.detail.window = null;
    }
    //详细
    function detailCallback(options) {
        //debugger;
        var defaults = Ext.apply({}, options, $.model.defaults);
        if (defaults.AlarmTime && !(defaults.AlarmTime instanceof Date)) {
            defaults.AlarmTime = parseDate(defaults.AlarmTime);
        }
        var panel = $.detail.Panel(defaults);
        $.detail.window = ExtHelper.CreateWindow({ title: '案件详情...' });
        $.detail.window.add(panel);
    }
    //转换时间格式 '/Date(1406158863000+0800)/' 为 格林威治标准时间
    function parseDate(dateStr) {
        var date = null;
        if (dateStr)
            date = eval('new ' + dateStr.replace(/\//g, ''));
        return date;
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

})(JCJ_JJDBManager);

(function (c) {

    if (typeof $ttcase !== 'undefined') {
        return c();
    }

    LoadModlues.loadJS(typeof $ttcase, 'Resources/js/totalCase.js', function () {
        c();
    });

})(function () {

    $ttcase.JDJ.tip();
    $ttcase.JDJ.areatip();
});