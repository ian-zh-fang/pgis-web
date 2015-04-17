/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="hoteldetail.js" />

var $hotel = $hotel || {};

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

})($hotel);

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

})(Object.$Supper($hotel, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { req: null, storeId: identityManager.createId(), model: $hotel.model.type, total: false, pageSize: 15 };
        Ext.apply(defaults, options);
        defaults.url = String.Format('{0}{1}', $hotel.basic_url, defaults.req);

        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($hotel, 'store'));

(function ($) {

    var cols = $.columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', text: '名称', flex: 1, sortable: false, hidden: false },
        { dataIndex: 'Tel', text: '联系电话', width:80, sortable: false, hidden: false },
        { dataIndex: 'SafetyTel', text: '保安部电话', width:80, sortable: false, hidden: true },
        { dataIndex: 'Corporation', text: '法人', width:55, sortable: false, hidden: true },
        { dataIndex: 'Official', text: '负责人', width: 55, sortable: false, hidden: true },
        { dataIndex: 'PoliceOffcial', text: '治安负责人', flex: 1, sortable: false, hidden: true },
        { dataIndex: 'RoomCount', text: '房间数', width: 55, sortable: false, hidden: false },
        { dataIndex: 'BedCount', text: '床位数', width:55, sortable: false, hidden: false },
        { dataIndex: 'StarLevel', text: '星级', width: 45, sortable: false, hidden: true },
        { dataIndex: 'Disable', text: '有效', width: 45, sortable: false, hidden: true },
        {
            dataIndex: 'Address', text: '详细地址', flex: 2, sortable: false, hidden: false, renderer: function (a, b, c) {
                if (a)
                    return a.Content;

                return '<span style="color:red;">N/A</span>';
            }
        },
        {
            dataIndex: 'ID', text: '', width: 45, sortable: false, hidden: false, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);
                return String.Format('<span class="a" title="查看详情" onclick="{0}(\'{1}\')">详细...</span>', '$hotel.grid.Detail', val);
            }
        }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { columns: cols, req: 'page', pager: false, enable: true, btnText: '地址变更', btnHandler: btnHandler, title:'酒店，宾馆，旅店信息:' };
        Ext.apply(defaults, options);

        function constructor() {
            this.store = $hotel.store.Store({ req: defaults.req, total: defaults.pager });
            this.grid = ExtHelper.CreateGrid({
                columns: defaults.columns, store: this.store, pager: defaults.pager,
                toolbar: {
                    enable: defaults.enable, items: [defaults.title, '->', '-', {
                        xtype: 'button',
                        iconCls: 'brefresh',
                        text: defaults.btnText,
                        handler: defaults.btnHandler
                    }]
                }
            });
        }

        var instance = new constructor();
        return instance;
    };

    var Show = $.Show = function (options) {
        var defaults = { title: '酒店，宾馆，旅店信息管理', width: 600, height: 400, layout: 'fit' };
        Ext.apply(defaults, options);

        var grid = Grid({ req: 'page', pager:true });
        var wind = $.window = ExtHelper.CreateWindow(defaults);
        wind.add(grid.grid);
    };

    var Detail = $.Detail = function (val) {
        var data = Object.$DecodeObj(val);

        var mask = maskGenerate.start({ p: $.window ? $.window.getId() : null, msg: '正在获取，请稍等 ...' });
        $hotel.loaddetail(function () {
            $hoteldetail.detail.Show(data);

            mask.stop();
        });
    };

    function btnHandler(grid) {
        var rows = grid.grid.getSelectionModel().getSelection();
        if (!rows.length) {
            return errorState.show(errorState.SelectRow);
        }

        if (rows.length > 1) {
            return errorState.show(errorState.SelectOnlyRow);
        }

        var id = rows[0].get('ID');
        $hotel.form.Show({
            id: id, callback: function () {
                grid.grid.store.load();
            }
        });
    }

})(Object.$Supper($hotel, 'grid'));

(function ($) {

    var Show = $.Show = function (options) {
        var defaults = { title: '酒店，宾馆，旅店地址变更 ...', width: 600, height: 110, layout: 'fit' };
        Ext.apply(defaults, options);

        var wind = ExtHelper.CreateWindow(defaults);
        wind.add(Form(options));
    };

    function Form(options) {
        var defaults = { id: 0, callback:Ext.emptyFn };
        Ext.apply(defaults, options);

        var form = ExtHelper.CreateForm({
            url: String.Format('{0}upd', $hotel.basic_url), callback: function () {
                submit({ callback: defaults.callback, form: form });
            }
        });
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'id',
            name: 'ID',
            value: defaults.id
        }, $address.getAutoComplete({ text: '联系地址', name: 'Addr', allowBlank: false }));

        return form;
    }

    function submit(options) {
        var defaults = { callback: Ext.emptyFn, form: null };
        Ext.apply(defaults, options);

        var wind = defaults.form.up('window');
        var form = defaults.form.getForm();
        if (form.isValid()) {
            form.submit({
                success: function (a, b) {
                    if (b.result.result > 0) {
                        defaults.callback();
                        wind.close();
                    }else if(b.result.result == -100){
                        errorState.show("当前地址不存在.");
                    } else {
                        errorState.show(errorState.SubmitFail);
                    }
                },
                failure: function (a, b) {
                    errorState.show(errorState.SubmitFail);
                }
            });
        }
    }

})(Object.$Supper($hotel, 'form'));