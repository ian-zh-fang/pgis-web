/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/qForm.js" />
/// <reference path="../Resources/js/totalCase.js" />

var jcjDistribute = jcjDistribute || {};
(function ($) {
    //全局私有变量
    var intervalHandler = null;//获取数据循环，当停止时，需要释放当前的循环，并清空
    var intervalTime = 10000;//
    var url = 'JCJ_JJDB/JCJ_JJDBHandler.ashx?req=';

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

    $.form = qForm.getQueryForm(qForm.qFormType.JCJDistributed, queryFormCallback);

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
        var defaults = { ID: null, Num: null, TypeID: null, TypeName: null, Tel: null, AlarmMan: null, Location: null, X: null, Y: null, AlarmTime: null, AdminID: null, AdminName: null };
        Ext.apply(defaults, options);

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
            { dataIndex: 'TodayTickCount', text: '当天案件数', flex: 1 },
            { dataIndex: 'ThisWeekTickCount', text: '本周案件数', flex: 1 },
            { dataIndex: 'ThisMonthTickCount', text: '本月案件数', flex: 1 },
            { dataIndex: 'ThisYearTickCount', text: '本年案件数', flex: 1 }
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
        var defaults = { ID: null, Num: null, TypeID: null, TypeName: null, Tel: null, AlarmMan: null, Location: null, X: null, Y: null, AlarmTime: null, AdminID: null, AdminName: null };
        Ext.apply(defaults, options);

        var form = ExtHelper.CreateForm({
            anchor: '100%', layout: 'column', buttonstext: '关闭（<u>C</u>）', callback: function () {
                $.detail.window.close();
                $.detail.window = null;
            }
        });
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

    $.realtime = function () {
        clearInterval(intervalHandler);
        intervalHandler = setInterval(function () {
            var now = new Date();
            now = new Date(now.getTime() - 60000);
            intervalCallback({
                TimeStart: now
            });
        }, intervalTime);
    };

    //转换时间格式 '/Date(1406158863000+0800)/' 为 格林威治标准时间
    function parseDate(dateStr) {
        var date = null;
        if (dateStr)
            date = eval('new ' + dateStr.replace(/\//g, ''));
        return date;
    }

    //全局私有函数
    function queryFormCallback(form, button) {
        //debugger;
        var tipstart = '开 始(S)';
        var tipstop = '停 止(T)';
        switch (button.text) {
            case '开 始(S)':
                //debugger;
                //开始事件           
                var defaults = { TimeInterval: undefined, TimeStart: undefined };
                var data = getFields();
                Ext.apply(defaults, data);
                if (defaults.TimeInterval) {
                    defaults.TimeInterval = new Number(defaults.TimeInterval);
                    if (defaults.TimeInterval < 1) {
                        errorState.show("间隔时间不能小于1。");
                        return;
                    }
                    if (defaults.TimeInterval > 600) {
                        errorState.show("间隔时间不能大于600。");
                        return;
                    }
                    if (intervalHandler) {
                        clearInterval(intervalHandler);
                        intervalHandler = null;
                    }
                    intervalHandler = setInterval(function () {
                        intervalCallback(defaults);
                    }, defaults.TimeInterval * 1000);
                    intervalCallback(defaults);
                } else {
                    errorState.show("请输入间隔时间。该时间是不能小于1，并不能大于600的正整数。");
                    return;
                }
                button.setText(tipstop);
                break;
            case '停 止(T)':
                button.setText(tipstart);
                //停止事件
                if (intervalHandler) {
                    clearInterval(intervalHandler);
                    intervalHandler = null;
                }
                break;
            default:
                break;
        }

        function getFields() {
            var items = form.items.items;
            var params = {};
            for (var i = 0; i < items.length; i++) {
                var cp = items[i];
                if (cp.name) {
                    params[cp.name] = cp.rawValue;
                }
            }
            return params;
        }
    }
    
    function intervalCallback(options) {
        var defaults = { TimeStart: undefined };
        Ext.apply(defaults, options);
        //获取后台数据
        Ext.Ajax.request({
            url: url + '3',
            method: 'POST',
            params: { timestart: defaults.TimeStart },
            success: function (response, options) {
                //debugger;
                if (response.status == 200) {
                    var data = Ext.JSON.decode(response.responseText);
                    for (var i = 0; i < data.length; i++) {
                        showCase(data[i]);
                    }
                }
            },
            failure: function (response) {
                //errorState.show(errorState.LoadException);
            }
        });
    }

    //显示案件信息到地图
    function showCase(options) {
        //debugger;
        var defaults = { ID: null, Num: null, TypeID: null, TypeName: null, Tel: null, AlarmMan: null, Location: null, X: null, Y: null, AlarmTime: null, AdminID: null, AdminName: null };
        Ext.apply(defaults, options);

        var point = ELatLng2EPoint({ Lat: defaults.X, Lng: defaults.Y });
        defaults.X = point.X + 121382;
        defaults.Y = point.Y + 53652;

        if (defaults.X && defaults.Y) {
            //绘制图像
            var html = String.Format("<img style='width:32px;height:32px;' src='../Resources/images/case/{0}.gif'  title='{1}'></img>", $.alarm.alarm_110, defaults.Location || defaults.Num);
            EMap.AppendEntity(defaults.ID, { x: defaults.X, y: defaults.Y, exX: 16, exY: 16 }, {
                html: html, callback: function () {
                    if (defaults.AlarmTime && !(defaults.AlarmTime instanceof Date)) {
                        defaults.AlarmTime = parseDate(defaults.AlarmTime);
                    }
                    var panel = $.detail.Panel(defaults);
                    $.detail.window = ExtHelper.CreateWindow({ title: '案件详情...' });
                    $.detail.window.add(panel);
                }
            });
            //移动到当前座标
            EMap.MoveTo(defaults.X, defaults.Y);
        }
    }
})(jcjDistribute);

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