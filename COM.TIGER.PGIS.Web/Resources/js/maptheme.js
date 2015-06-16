/// <reference path="extjs4.2/ext-all-dev.js" />
/// <reference path="Config.js" />
/// <reference path="MapHelper.js" />
/// <reference path="../../Population/populationDetail.js" />
/// <reference path="../../Buildings/buildingQuery.js" />


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
    var resultcontainerid = 'extEast';

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
                        url: String.Format('{0}maptheme', basic_url),
                        params: { tp: me.mod, x1: coords[0].X, y1: coords[0].Y, x2: coords[2].X, y2: coords[2].Y },
                        callback: function (a, b, c) {
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

    //查询指定大楼的人员信息
    $.queryTotal = function (ownerid) {

        var mask = maskGenerate.start({ msg: '正在加载数据模块，请稍后 ...' });
        loadBuildingQueryHandler(function () {
            mask.stop();

            var c = Ext.getCmp(resultcontainerid);
            c.removeAll(true);
            var grid = buildingQuery.Population.grid.Grid({
                ids: ownerid,
                req: 'poponbdt&tid='+_instance.mod,
                columns: [
                    { xtype: 'rownumberer', width: 30, sortable: false, renderer: function (a, b, c, d) { return d + 1; } },
                    { dataIndex: 'Name', text: '姓名', sortable: false, hidden: false, width: 80 },
                    {
                        dataIndex: 'ID', text: '操作', sortable: false, hidden: false, width: 45, renderer: function (a, b, c) {
                            var data = c.getData();
                            var val = buildingQuery.encodeObj(data);
                            var str = String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', 'buildingQuery.Population.grid.ShowDetail', val);
                            return str;
                        }
                    }
                ]
            });
            c.add(grid);

            if (c.collapsed) {
                c.expand();
            }
        });
    };

    $.Dispose = function () {
        _instance = null;
        $maptheme = null;
        return false;
    };

    var loadBuildingQueryHandler = function (callback) {
        if (typeof buildingQuery !== 'undefined') {
            return callback();
        }

        LoadModlues.loadJS(typeof buildingQuery, 'Buildings/buildingQuery.js', function () {
            callback();
        });
    };

    //渲染图层
    function render(d) {
        var defaults = { MEH_MOI_ID: 0, MEH_CenterX: 0, MEH_CenterY: 0, Record: 0 };
        Ext.apply(defaults, d);

        var html = String.Format('<div class="context-cut a" style="color:red; font-size:11px; font-weight:700; background-color:#ddd; text-align:center; line-height:{1}px;" title="点击查询详情" onclick="parent.$maptheme.queryTotal(\'{2}\')">{0}</div>', defaults.Record, 16, defaults.MEH_MOI_ID);
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