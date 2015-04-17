/// <reference path="extjs4.2/ext-all-dev.js" />
/// <reference path="common.js" />
/// <reference path="Config.js" />
/// <reference path="ExtjsExtention.js" />
/// <reference path="maskLoad.js" />
/// <reference path="Utils.js" />

var $ttcase = $ttcase || {};

(function ($) {

    //@ 统计区域内一键报警案件数据
    $.YJTotalCasesOnArea = 'ytta';

    //@ 统计全县一键报警案件数据
    $.YJTotalCaseOn = 'ytty';

    //@ 统计区域内三台合一案件数据
    $.JDdTotalCasesOnArea = 'jdtta';

    //@ 统计全县三台合一案件数据
    $.JDJTotalCaseOn = 'jdtty';

})(Object.$Supper($ttcase, 'req'));

(function ($) {

    var wind = null;

    var basic_url = $.basic_url = 'YJBJ/YJBJHandler.ashx?req=';

    $.tip = function (r, tt) {

        tt = tt || '全县案件统计';

        var form = Ext.getCmp('extWest');
        var xy = form.getXY();
        var width = form.getWidth();
        var height = form.getHeight();

        if (wind)
            wind.close();

        var x = xy[0] + width + 5;
        var y = xy[1] + height - 100;

        wind = ExtHelper.CreateWindow({
            title: tt,
            width: 150,
            height: 100,
            layout:'fit',
            x: x,
            y: y,
            draggable: true,
            resizable: true,
            modal: false,
            closable: true
        });

        intervalTotal(wind, r);

        var hinterval = setInterval(function () {
            intervalTotal(wind, r);
        }, 30000);

        wind.on('close', function () {
            clearInterval(hinterval);
        });
    };

    $.areatip = function (r, cb) {
        Object.$Get({
            url: String.Format('{0}{1}', basic_url, r),
            callback: function (a, b, c) {

            }
        });
    };

    function intervalTotal(wind, r) {
        var mask = maskGenerate.start({ p: wind.getId(), msg: '正在统计，请稍等 ...' });
        Object.$Get({
            url: String.Format('{0}{1}', basic_url, r),
            callback: function (a, b, c) {
                mask.stop();
                if (b) {
                    var data = JSON.parse(c.responseText);
                    var items = createTip(data.result);
                    wind.removeAll();
                    wind.add(items);
                }
            }
        });
    }

    function createTip(d) {
        var defaults = { TodayTickCount: 0, ThisWeekTickCount: 0, ThisMonthTickCount: 0, ThisYearTickCount: 0 }
        Ext.apply(defaults, d);
        
        var height = 16;

        return {
            border: 0,
            items: [{
                xtype: 'panel',
                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">本年案件数</span>：{0} 件", defaults.ThisYearTickCount),
                border: 0,
                style: String.Format('height:{0}px; line-height:{0}px;', height)
            }, {
                xtype: 'panel',
                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">本月案件数</span>：{0} 件", defaults.ThisMonthTickCount),
                border: 0,
                style: String.Format('height:{0}px; line-height:{0}px;', height)
            }, {
                xtype: 'panel',
                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">本周案件数</span>：{0} 件", defaults.ThisWeekTickCount),
                border: 0,
                style: String.Format('height:{0}px; line-height:{0}px;', height)
            }, {
                xtype: 'panel',
                html: String.Format("<span style=\"font-weight:700; font-size:11px; color:#15498b;\">本日案件数</span>：{0} 件", defaults.TodayTickCount),
                border: 0,
                style: String.Format('height:{0}px; line-height:{0}px;', height)
            }]
        };
    }

})($ttcase);

(function ($) {

    $.tip = function () {
        $ttcase.tip($ttcase.req.YJTotalCaseOn, '全县一键报警数量统计');
    };

    $.areatip = function () {
        $ttcase.areatip($ttcase.req.YJTotalCasesOnArea, function () { });
    };

})(Object.$Supper($ttcase, 'YJBJ'));

(function ($) {

    $.tip = function () {
        $ttcase.tip($ttcase.req.JDJTotalCaseOn, '全县三台合一报警数量统计');
    };

    $.areatip = function () {
        $ttcase.areatip($ttcase.req.JDdTotalCasesOnArea, function () { });
    };

})(Object.$Supper($ttcase, 'JDJ'));