/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Employee/Employee.js" />
/// <reference path="companyDetail.js" />
/// <reference path="../Resources/js/qForm.js" />

var $companyquery = $companyquery || {};

(function ($) {

    var basic_url = $.basic_url = 'Company/CompanyHelp.ashx?req=';

    //@ 标识单位详细信息处理模块是否加载完毕，默认标识没有加载.
    var detailReady = $.detailReady = false;

    var loadDetailHandler = $.loadDetailHandler = function (cb) {
        cb = cb || Ext.emptyFn;

        if (detailReady) {
            cb();
            return true;
        }

        LoadModlues.loadJS(typeof $companydetail, 'Company/companyDetail.js', function () {
            detailReady = true;
            cb();
        });
    };

})($companyquery);

(function ($) {
    
    var resultcontainerid = 'extEast';
    $.form = qForm.getQueryForm(qForm.qFormType.company, submit);

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

})(Object.$Supper($companyquery, 'query'));

(function ($) {

    var tp = $.type = identityManager.createId('model');
    var md = $.model = Ext.define(tp, {
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
            { name: 'Addr' }
        ]
    });

})(Object.$Supper($companyquery, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { storeId: identityManager.createId(), params: {}, model: $.supper.model.type, req: null, total: false, pageSize: 15 };
        Ext.apply(defaults, options);

        if (!defaults.req)
            throw new ReferenceError();

        defaults.url = String.Format('{0}{1}{2}', $.supper.basic_url, defaults.req, defaults.params ? null : getParams(defaults.params));
        defaults.url = encodeURI(defaults.url);
        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($companyquery, 'store'));

(function ($) {

    var cols = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', itemId: 'Name', text: '名称', sortable: false, hidden: false, flex: 1 },
        {
            dataIndex: 'ID', text: '', sortable: false, hidden: false, width: 70, renderer: function (a, b, c, d, e, f, g) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);
                var html = String.Format('<span class="a" onclick="{0}(\'{1}\', this)">详细</span>&nbsp;&nbsp;&nbsp;', '$companyquery.grid.Detail', val);
                html += String.Format('<span class="a" onclick="{0}(\'{1}\', this)">定位</span>', '$companyquery.grid.location', val);
                return html;
            }
        }
    ];

    var Grid = $.Grid = function (options) {
        var defaults = { req: 'qform', params: {}, pager:true };
        Ext.apply(defaults, options);

        var store = $.supper.store.Store({ req: defaults.req, params: defaults.params, total:defaults.pager });
        var grid = ExtHelper.CreateGridNoCheckbox({ store: store, columns: cols, pager: defaults.pager });
        return grid;
    };

    var Detail = $.Detail = function (val, e) {
        var data = Object.$DecodeObj(val);
        var mask = maskGenerate.start({ msg: '正在加载数据，请稍等...' });
        $.supper.loadDetailHandler(function () {
            $companydetail.detail.Show(data);
            mask.stop();
        });
    };

    $.location = function (val) {
        var defaults = {
            Addr: null, Name: null,
            Address: {
                OwnerInfo: { MEH_CenterX: 0, MEH_CenterY: 0, MOI_OwnerName: '', MOI_OwnerAddress: '', MOI_ID: 0 }
            }
        };
        var data = Object.$DecodeObj(val);
        Ext.apply(defaults, data);
        if (defaults.Address && defaults.Address.OwnerInfo) {
            var html = '<br />';
            html += '<table border="0"><tr style="font-weight:700; font-size:11px;">';
            html += '<td style="color:#15498b; ">名称：</td><td><span class="a" onclick="parent.$companyquery.grid.Detail(\'' + val + '\')">' + defaults.Name + '</span></td>';
            html += '</tr><tr><td colspan="2"><hr /></td>';
            html += '</tr><tr style="font-size:13px; color:gray;">';
            html += '<td style="font-weight:700; font-size:11px; color:#15498b;">地址：</td><td>' + defaults.Addr + '</td>';
            html += '</tr></table>';

            EMap.OpenInfoWindow({ html: html, x: defaults.Address.OwnerInfo.MEH_CenterX, y: defaults.Address.OwnerInfo.MEH_CenterY });
        } else {
            errorState.show("定位失败，数据不存在。");
        }
    };

})(Object.$Supper($companyquery, 'grid'));