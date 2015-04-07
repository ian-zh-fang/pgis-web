/// <reference path="../Resources/js/qForm.js" />
/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="hoteldetail.js" />

var $hotelquery = $hotelquery || {};

(function ($) {

    var basic_url = $.basic_url = 'Hotel/HotelHelp.ashx?req=';

    var loaddetail = $.loaddetail = function (callback) {
        if (typeof $hoteldetail !== 'undefined') {
            return callback();
        }

        LoadModlues.loadJS(typeof $hoteldetail, 'Hotel/hoteldetail.js', function () {
            callback();
        });
    };

})($hotelquery);

(function ($) {

    var resultcontainerid = 'extEast';
    $.form = qForm.getQueryForm(qForm.qFormType.hotel, submit);

    function submit(form) {
        var c = Ext.getCmp(resultcontainerid);
        c.removeAll(true);

        var items = form.items.items;
        var params = {};
        for (var i = 0; i < items.length; i++) {
            var cp = items[i];
            params[cp.name] = cp.rawValue;
        }
        c.add($.supper.grid.Grid({ params: params }));

        if (c.collapsed) {
            c.expand();
        }
        EMap.Clear();
    }


})(Object.$Supper($hotelquery, 'query'));

(function ($) {

    var tp = $.type = identityManager.createId('model');

    var mod = $.model = Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },//@  旅馆ID
            { name: 'Name' },//@  旅馆名称
            { name: 'Tel' },//@  联系电话
            { name: 'SafetyTel' },//@  保安部电话
            { name: 'Corporation' },//@  法人
            { name: 'Official' },//@  负责人
            { name: 'PoliceOffcial' },//@  治安负责人
            { name: 'RoomCount' },//@  房间数
            { name: 'BedCount' },//@  床位数
            { name: 'StarLevel' },//@  星级
            { name: 'Disable' },//@  启用/禁用标识
            { name: 'AddressID' },//@  详细地址ID
            { name: 'Address' }//@  详细地址
        ]
    });

})(Object.$Supper($hotelquery, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { req: null, params:{}, storeId: identityManager.createId(), model: $hotelquery.model.type, total: false, pageSize: 15 };
        Ext.apply(defaults, options);
        defaults.url = String.Format('{0}{1}{2}', $hotelquery.basic_url, defaults.req, getParams(defaults.params));
        defaults.url = encodeURI(defaults.url);

        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($hotelquery, 'store'));

(function ($) {

    var cols = $.columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', text: '酒店名称', flex: 1, sortable: false, hidden: false },
        {
            dataIndex: 'ID', text: '', width: 45, sortable: false, hidden: false, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);
                return String.Format('<span class="a" title="查看详情" onclick="{0}(\'{1}\')">详细...</span>', '$hotelquery.grid.Detail', val);
            }
        }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { columns: cols, req: 'qform', params:{}, pager: true, enable: false, title: '酒店，宾馆，旅店信息:' };
        Ext.apply(defaults, options);

        var store = $hotelquery.store.Store({ req: defaults.req, params: defaults.pager, total: defaults.pager });
        var grid = ExtHelper.CreateGridNoCheckbox({
            store: store, columns: defaults.columns, pager: defaults.pager,
            toolbar: {
                enable: defaults.enable, items: [defaults.title, '->']
            }
        });
        return grid;
    };

    var Detail = $.Detail = function (val) {
        var data = Object.$DecodeObj(val);

        var mask = maskGenerate.start({ msg: '正在获取，请稍等 ...' });
        $hotelquery.loaddetail(function () {
            $hoteldetail.detail.Show(data);

            mask.stop();
        });
    };

})(Object.$Supper($hotelquery, 'grid'));