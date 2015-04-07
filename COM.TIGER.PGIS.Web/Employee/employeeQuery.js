/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Resources/js/qForm.js" />
/// <reference path="../Population/populationDetail.js" />

var $employeequery = $employeequery || {};

(function ($) {

    var basic_url = $.basic_url = 'Employee/EmployeeHelp.ashx?req=';

    var loadPopulationHandler = $.loadPopulationHandler = function (callback) {

        if (typeof $populationdetail !== 'undefined')
            return callback();

        LoadModlues.loadJS(typeof $populationdetail, 'Population/populationDetail.js', function () {
            callback();
        });
    };

})($employeequery);

(function ($) {

    var resultcontainerid = 'extEast';

    $.GetOnCompany = function () {
        return Form({ req: 'getoncompnay' });
    };

    $.GetOnHotel = function () {
        return Form({ req: 'getonhotel' });
    };

    function Form(options) {    
        var form = qForm.getQueryForm(qForm.qFormType.employee, function (form) { callback(options, form) });
        return form;
    }

    function callback(options, form) {
        var defaults = { req: 'qform' };
        Ext.apply(defaults, options);

        var c = Ext.getCmp(resultcontainerid);
        c.removeAll(true);

        var items = form.items.items;
        var params = {};
        for (var i = 0; i < items.length; i++) {
            var cp = items[i];
            params[cp.name] = cp.rawValue;
        }
        c.add($.supper.grid.Grid({ params: params, req: defaults.req }));

        if (c.collapsed) {
            c.expand();
        }
        EMap.Clear();
    }

})(Object.$Supper($employeequery, 'query'));

(function ($) {

    var tp = $.type = identityManager.createId('model');
    var model = $.model = Ext.define(tp, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' }, //从业人员主键
            { name: 'OrganID' }, //从业机构主键
            { name: 'OrganTypeID' }, //机构类别ID
            { name: 'OrganTypeName' }, //机构类别名称
            { name: 'Name' }, //姓名
            { name: 'CardTypeID' }, //证件类别
            { name: 'CardTypeName' }, //证件类别名称
            { name: 'IdentityCardNum' }, //证件号码
            { name: 'GenderID' }, //性别
            { name: 'GenderDesc' }, //性别描述
            { name: 'ProvinceID' }, //户籍省ID
            { name: 'ProvinceName' }, //户籍省
            { name: 'CityID' }, //户籍市ID
            { name: 'CityName' }, //户籍市
            { name: 'Address' }, //现住址
            { name: 'Tel' }, //电话
            { name: 'Seniority' }, //工龄
            { name: 'Func' }, //职务
            { name: 'JobTypeID' }, //工作性质ID
            { name: 'JobTypeName' }, //工作性质名称
            { name: 'EntryTime' }, //入职时间
            { name: 'IsInService' }, //是否在职
            { name: 'QuitTime' } //离职时间
        ]
    });

})(Object.$Supper($employeequery, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { storeId: identityManager.createId(), params: {}, model: $.supper.model.type, req: null, total: false, pageSize: 15 };
        Ext.apply(defaults, options);

        if (!defaults.req)
            throw new ReferenceError();

        defaults.url = String.Format('{0}{1}{2}', $.supper.basic_url, defaults.req, getParams(defaults.params));
        defaults.url = encodeURI(defaults.url);
        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($employeequery, 'store'));

(function ($) {

    var cols = $.columns = [
        { xtype: 'rownumberer', width: 25, text: '', sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', text: '员工姓名', sortable: false, hidden: false, flex:1 },
        {
            dataIndex: 'ID', text: '', sortable: false, hidden: false, width: 45, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);
                return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', '$employeequery.grid.Detail', val);
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

    var Detail = $.Detail = function (val) {
        var data = Object.$DecodeObj(val);

        var mask = maskGenerate.start({msg:'正在获取，请稍等...'});
        $employeequery.loadPopulationHandler(function () {
            $populationdetail.GetByCode(data.IdentityCardNum, function (a, b, c, d) {

                if (c) {
                    $populationdetail.population.detail.Show(a.result);
                } else {
                    errorState.show(errorState.LoadError);
                }
                                
                mask.stop();
            });
        });
    };

})(Object.$Supper($employeequery, 'grid'));