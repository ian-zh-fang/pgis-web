/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Population/populationDetail.js" />

var $employee = $employee || {};

(function ($) {

    var basic_url = $.basic_url = 'Employee/EmployeeHelp.ashx?req=';

    var loadPopulationHandler = $.loadPopulationHandler = function (callback) {
        if (typeof $populationdetail !== 'undefined')
            return callback();

        LoadModlues.loadJS(typeof $populationdetail, 'Population/populationDetail.js', function () {
            callback();
        });
    };

})($employee);

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

})(Object.$Supper($employee, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { storeId: identityManager.createId(), model: $employee.model.type, url: null, total: false, pageSize: 15 };
        Ext.apply(defaults, options);

        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($employee, 'store'));

(function ($) {

    var cols = $.columns = [
        { xtype: 'rownumberer', width: 25, text: '', sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', text: '员工姓名', sortable: false, hidden: false, width:55 },
        { dataIndex: 'GenderDesc', text: '性别', sortable: false, hidden: false, width:40 },
        { dataIndex: 'CardTypeName', text: '证件名称', sortable: false, hidden: true, width:55 },
        { dataIndex: 'IdentityCardNum', text: '证件号码', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'Tel', text: '联系电话', sortable: false, hidden: false, width:80 },
        { dataIndex: 'Address', text: '联系地址', sortable: false, hidden: false, flex: 1 },
        { dataIndex: 'ProvinceName', text: '籍贯省', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'CityName', text: '籍贯市', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'OrganName', text: '单位名称', sortable: false, hidden: false, flex: 1 },
        { dataIndex: 'OrganTypeName', text: '单位类型', sortable: false, hidden: true, width:55 },
        { dataIndex: 'Seniority', text: '工龄', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'Func', text: '职务', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'JobTypeName', text: '工作性质', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'EntryTime', text: '入职时间', sortable: false, hidden: true, flex: 1 },
        {
            dataIndex: 'IsInService', text: '状态', sortable: false, hidden: false, width: 45, renderer: function (a, b, c) {
                if (a)
                    return '<span style="font-weight:700; color:darkblue;">在职</span>';

                return '<span style="font-weight:700; color:red;">离职</span>';
            }
        },
        { dataIndex: 'QuitTime', text: '离职时间', sortable: false, hidden: true, flex: 1 },
        {
            dataIndex: 'ID', text: '', sortable: false, hidden: false, width: 45, renderer: function (a, b, c) {
                var data = c.getData();
                var val = Object.$EncodeObj(data);
                return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', '$employee.grid.Detail', val);
            }
        }
    ];

    var GridGenerator = $.GridGenerator = function (options) {
        /// <summary>从业人员信息列表处理模块入口</summary>
        /// <param name="options" type="Object">
        /// <para>String req 必填，标识具体的请求和参数信息</para>
        /// <para>String [html] 可选，标题内容</para>
        /// <para>Boolean [pager] 可选，标识是否显示分页栏；默认显示</para>
        /// <para>Boolean [tool] 可选，标识表格是否显示工具栏；默认显示</para>
        /// <para>Boolean [checkbox] 可选，标识表格是否显示 CheckBox；默认显示</para>
        /// </param>
        /// <returns type="Object" >{Ext.grid.Panel:grid, Ext.data.Store:store}</returns>

        var defaults = { req: null, pager: true, tool: true, html: '从业人员信息:', checkbox: true };
        Ext.apply(defaults, options);
        
        if (!defaults.req)
            throw new ReferenceError();

        var url = String.Format('{0}{1}', $employee.basic_url, defaults.req);
        function constructor() {
            var me = this;
            var store = me.store = $employee.store.Store({ url: url, total: defaults.pager });
            if (defaults.checkbox) {
                var grid = me.grid = ExtHelper.CreateGrid({
                    store: store, columns: cols, pager: defaults.pager, toolbar: {
                        enable: defaults.tool, items: [defaults.html]
                    }
                });
            } else {
                var grid = me.grid = ExtHelper.CreateGridNoCheckbox({
                    store: store, columns: cols, pager: defaults.pager, toolbar: {
                        enable: defaults.tool, items: [defaults.html]
                    }
                });
            }
        }

        return new constructor();
    };

    var Detail = $.Detail = function (val) {
        var data = Object.$DecodeObj(val);

        var mask = maskGenerate.start({msg:'正在获取，请稍等 ...'});
        $employee.loadPopulationHandler(function () {
            $populationdetail.GetByCode(data.IdentityCardNum, function (a, b, c) {
                if (c) {
                    $populationdetail.population.detail.Show(a.result);
                } else {
                    errorState.show(errorState.LoadError);
                }

                mask.stop();
            });
        });
    };

})(Object.$Supper($employee, 'grid'));