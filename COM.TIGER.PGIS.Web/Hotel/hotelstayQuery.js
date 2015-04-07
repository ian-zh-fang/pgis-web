/// <reference path="../Resources/js/qForm.js" />
/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Hotel/hotelStay.js" />
/// <reference path="../Population/populationDetail.js" />

var $hotelstayquery = $hotelstayquery || {};

(function ($) {

    var basic_url = $.basic_url = 'Hotel/HotelHelp.ashx?req=';

    var loadDetail = $.loadDetail = function (c) {
        if (typeof $hotelstaydetail !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $hotelstaydetail, 'Hotel/hotelstayDetail.js', function () { c(); });
    };

    var loadStay = $.loadStay = function (c) {
        if (typeof $hotelstay !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $hotelstay, 'Hotel/hotelStay.js', function () {
            c();
        });
    };

})($hotelstayquery);

(function ($) {

    var cols = $.columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false },
        { dataIndex: 'Name', text: '住宿人员姓名', sortable: false, hidden: false, flex: 1 },
        {
            dataIndex: 'ID', text: '', width: 45, sortable: false, hidden: false, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);

                return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', '$hotelstayquery.grid.Detail', val);
            }
        }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { req: 'sqform', params: {}, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var url = String.Format('{0}{1}{2}', $hotelstayquery.basic_url, defaults.req, getParams(defaults.params));
        $hotelstayquery.loadStay(function () {

            var grid = $hotelstay.grid.Grid({ url: encodeURI(url), columns: cols, pager:true, tool:false });
            defaults.callback(grid);
        });
    };

    var Detail = $.Detail = function (val) {
        var data = Object.$DecodeObj(val);

        var mask = maskGenerate.start({ msg: '正在获取，请稍等 ...' });
        $hotelstay.loadDetail(function () {
            $hotelstaydetail.detail.Instance(data).show();
            mask.stop();
        });
    };

})(Object.$Supper($hotelstayquery, 'grid'));

(function ($) {

    var resultcontainerid = 'extEast';
    $.form = qForm.getQueryForm(qForm.qFormType.hotelStay, submit);

    function submit(form) {
        var c = Ext.getCmp(resultcontainerid);
        c.removeAll(true);

        var items = form.items.items;
        var params = {};
        for (var i = 0; i < items.length; i++) {
            var cp = items[i];
            params[cp.name] = cp.rawValue;
        }
        $.supper.grid.Grid({
            params: params, callback: function (grid) {
                c.add(grid.grid);
                
            }
        })

        if (c.collapsed) {
            c.expand();
        }
        EMap.Clear();
    }

})(Object.$Supper($hotelstayquery, 'query'));