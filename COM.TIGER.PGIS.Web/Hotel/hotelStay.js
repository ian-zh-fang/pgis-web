/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="hotelstayDetail.js" />

var $hotelstay = $hotelstay || {};

(function ($) {

    var basic_url = $.basic_url = 'Hotel/HotelHelp.ashx?req=';

    var loadDetail = $.loadDetail = function (c) {
        if (typeof $hotelstaydetail !== 'undefined') {
            return c();
        }

        LoadModlues.loadJS(typeof $hotelstaydetail, 'Hotel/hotelstayDetail.js', function () { c();});
    };

})($hotelstay);

(function ($) {

    var tp = $.type = identityManager.createId('model');
    var mod = $.model = Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'Nationality' },
            { name: 'Name' },
            { name: 'FirstName' },
            { name: 'LastName' },
            { name: 'Gender' },
            { name: 'GenderDesc' },
            { name: 'CredentialsID' },
            { name: 'Credentials' },
            { name: 'CredentialsNum' },
            { name: 'PutinTime' },
            { name: 'GetoutTime' },
            { name: 'PutinRoomNum' },
            { name: 'HotelID' },
            { name: 'HotelName' },
            { name: 'Hotel' }
        ]
    });

})(Object.$Supper($hotelstay, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { storeId: identityManager.createId(), model: $hotelstay.model.type, total: false, pageSize: 15, req:null, url: null };
        Ext.apply(defaults, options);
        defaults.url = defaults.url || String.Format('{0}{1}', $hotelstay.basic_url, defaults.req);
        
        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($hotelstay, 'store'));

(function ($) {

    var cols = $.columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', text: '姓名', width:65, sortable: false, hidden: false },
        { dataIndex: 'FirstName', text: '英文名', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'LastName', text: '英文姓', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'GenderDesc', text: '性别', width: 40, sortable: false, hidden: false },
        { dataIndex: 'Nationality', text: '国籍', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'CredentialsNum', text: '证件号码', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'HotelName', text: '酒店名称', flex: 1, sortable: false, hidden: false },
        { dataIndex: 'PutinTime', text: '入住时间', width:100, sortable: false, hidden: false },
        { dataIndex: 'PutinRoomNum', text: '入住房间', width:65, sortable: false, hidden: false },
        { dataIndex: 'GetoutTime', text: '离开时间', width:100, sortable: false, hidden: false },
        {
            dataIndex: 'ID', text: '', width: 45, sortable: false, hidden: false, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);

                return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', '$hotelstay.grid.Detail', val);
            }
        }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { req: null, url: null, columns: cols, pager: true, tool: true, title: '住宿人员详细信息:' };
        Ext.apply(defaults, options);

        function constructor() {
            this.store = $hotelstay.store.Store({ req: defaults.req, url: defaults.url, total: defaults.pager });
            this.grid = ExtHelper.CreateGridNoCheckbox({
                store: this.store, columns: defaults.columns, pager: defaults.pager,
                toolbar: { enable: defaults.tool, items: [defaults.title, '->'] }
            });
        }

        var instance = new constructor();
        return instance;
    };

    var Detail = $.Detail = function (val) {
        var data = Object.$DecodeObj(val);

        var mask = maskGenerate.start({ msg: '正在获取，请稍等 ...' });
        $hotelstay.loadDetail(function () {
            $hotelstaydetail.detail.Instance(data).show();
            mask.stop();
        });
    };

})(Object.$Supper($hotelstay, 'grid'));

