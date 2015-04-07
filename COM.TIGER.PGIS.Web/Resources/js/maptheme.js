/// <reference path="extjs4.2/ext-all-dev.js" />
/// <reference path="Config.js" />
/// <reference path="MapHelper.js" />


var $maptheme = $maptheme || {};

(function ($) {

    //@ 常住人口
    $.CK = 1;

    //@ 暂住人口
    $.ZK = 2;

    //@ 重点人口
    $.ZHK = 3;

    //@ 境外人口
    $.Jw = 4;

})(Object.$Supper($maptheme, 'mod'));

(function ($) {

    //@ 唯一实例
    var _instance = null;
    //@ 数据请求地址
    var basic_url = $.basic_url = 'Population/PopulationHelp.ashx?req=';

    $.Generator = function (tp) {

        //@ 构造函数
        function constructor() {
            var me = this;
            //@ 当前主题模式
            this.mod = tp || $.mod.CK;
            //@ 数据加载
            this.Load = function () {
                EMap.GetCurrentWindowCoords(function (coords) {
                    Object.$Get({
                        url: String.Format('{0}maptheme', basic_url), params: { tp: me.mod, x1: coords[0].X, y1: coords[0].Y, x2: coords[2].X, y2: coords[2].Y }, callback: function (a, b, c) {
                            if (!b) {
                                return errorState.show(errorState.LoadError);
                            }
                            var data = JSON.parse(c.responseText);
                            EMap.Clear();
                            data.Each(function (e) {
                                render(e);
                            });
                        }
                    });
                });
            };
        }

        _instance = _instance || new constructor();
        _instance.mod = tp || _instance.mod;
        return _instance;
    };

    $.Dispose = function () {
        _instance = null;
        $maptheme = null;
        return false;
    };

    //渲染图层
    function render(d) {
        var defaults = { MEH_MOI_ID: 0, MEH_CenterX: 0, MEH_CenterY: 0, Record: 0 };
        Ext.apply(defaults, d);

        var html = String.Format('<div class="context-cut" style="color:#15498b; font-size:11px; font-weight:700; background-color:#ddd; text-align:center; line-height:{1}px;">{0}</div>', defaults.Record, 16);
        EMap.AppendEntityEx({
            id: defaults.MEH_MOI_ID,
            width: 28,
            height:16,
            x: defaults.MEH_CenterX,
            y: defaults.MEH_CenterY,
            innerHTML: html
        });
    }

})($maptheme);