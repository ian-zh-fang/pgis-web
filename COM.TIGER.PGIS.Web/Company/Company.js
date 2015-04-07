/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Employee/Employee.js" />
/// <reference path="companyDetail.js" />

var $company = $company || {};


(function ($) {

    var basic_uri = $.basic_uri = 'Company/CompanyHelp.ashx?req=';

    //@ 标识从业人员处理模块是否加载完毕，默认标识没有加载.
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

    var encodeObj = $.encodeObj = function (obj) {
        return Object.$EncodeObj(obj);
    };

    var decodeObj = $.decodeObj = function (obj) {
        return Object.$DecodeObj(obj);
    };

})($company);

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

})(Object.$Supper($company, 'model'));

(function ($) {

    $.Store = function (options) {
        var defaults = { storeId: identityManager.createId(), model: $.supper.model.type, req: null, total: false, pageSize: 15 };
        Ext.apply(defaults, options);

        if (!defaults.req)
            throw new ReferenceError();

        defaults.url = String.Format('{0}{1}', $.supper.basic_uri, defaults.req);
        var store = ExtHelper.CreateStore(defaults);
        return store;
    };

})(Object.$Supper($company, 'store'));

(function ($) {

    var cols = $.columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'Name', itemId: 'Name', text: '名称', sortable: false, hidden: false, flex: 1 },
        { dataIndex: 'Tel', itemId: 'Tel', text: '联系电话', sortable: false, hidden: false, width: 85 },
        { dataIndex: 'TypeName', itemId: 'TypeName', text: '单位大类', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'GenreName', itemId: 'GenreName', text: '单位小类', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'TradeName', itemId: 'TradeName', text: '行业类型', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'Capital', itemId: 'Capital', text: '注册资金', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'Corporation', itemId: 'Corporation', text: '法人', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'Square', itemId: 'Square', text: '经营面积 (㎡)', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'StartTimeStr', itemId: 'StartTime', text: '开业日期', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'LicenceNum', itemId: 'LicenceNum', text: '营业执照编号', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'LicenceStartTimeStr', itemId: 'LicenceStartTime', text: '营业执照开始日期', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'LicenceEndTimeStr', itemId: 'LicenceEndTime', text: '营业执照截止日期', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'MainFrame', itemId: 'MainFrame', text: '主营经营范围', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'Concurrently', itemId: 'Concurrently', text: '兼营经营范围', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'MigrantWorks', itemId: 'MigrantWorks', text: '外来务工人数', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'FireRating', itemId: 'FireRating', text: '消防等级', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'OrganName', itemId: 'OrganName', text: '所属管辖机关', sortable: false, hidden: true, flex: 1 },
        { dataIndex: 'RoomID', itemId: 'RoomID', text: '房间', sortable: false, hidden: true, width: 65 },
        { dataIndex: 'Addr', itemId: 'Addr', text: '联系地址', sortable: false, hidden: false, flex: 2 },
        {
            dataIndex: 'ID', text: '', sortable: false, hidden: false, width: 55, renderer: function (a, b, c) {
                var data = c.getData();
                var val = $.supper.encodeObj(data);
                return String.Format('<span class="a" onclick="{0}(\'{1}\')">详细...</span>', '$company.grid.Detail', val);
            }
        }
    ];

    var tab = ExtHelper.CreateTabPanelFn();

    var Grid = $.Grid = function (options) {
        var defaults = { req: 'pgcomps', pager: true, tool: true };
        Ext.apply(defaults, options);

        var store = $.store = $.supper.store.Store({ req: defaults.req, total: defaults.pager });
        var grid = ExtHelper.CreateGrid({
            store: store, columns: cols, pager: defaults.pager,
            toolbar: { enable: defaults.tool, add: addFn, update: updFn, del: delFn }
        });
        return grid;
    };

    var Show = $.Show = function () {
        init({});
        var wind = $.window = ExtHelper.CreateWindow({
            title: '单位信息管理', width: 600, height: 400, layout: 'fit', listeners: {
                'close': function () { $.window = null; }
            }
        });
        wind.add(tab.tab);
    };

    var Detail = $.Detail = function (val) {
        var data = $.supper.decodeObj(val);
        $company.detail.Show(data);
    };

    var DeleteAction = $.DeleteAction = function (ids, cb) {
        errorState.confirmYes(String.Format('是否删除选中的 {0} 项数据?', ids.length), function () {
            Ext.Ajax.request({
                url: String.Format('{0}del', $company.basic_uri),
                params: { ids: ids },
                method: 'post',
                success: function (a, b) {
                    if ($.store)
                        $.store.load();
                    if (cb && cb instanceof Function)
                        cb(b);
                },
                failure: function (a, b) {
                    errorState.show(errorState.DeleteFail);
                }
            });
        });
    };

    function init(options) {
        tab = ExtHelper.CreateTabPanelFn();
        tab.add({ component: Grid(options), title: '单位信息管理', closable: false });
        tab.add({ component: $company.kind.grid.grid, title: '单位分类（大类）', closable: false });
        tab.add({ component: $company.genre.grid.grid, title: '单位类型（小类）', closable: false });
        tab.add({ component: $company.trade.grid.grid, title: '行业类型', closable: false });
        tab.tab.setActiveTab(0);
    }

    function addFn(options) {
        $company.form.Show({req:'add'});
    }

    function updFn(grid) {
        var rows = grid.grid.getSelectionModel().getSelection();
        if (!rows.length) {
            errorState.show(errorState.SelectRow);
            return false;
        }
        if (rows.length > 1) {
            errorState.show(errorState.SelectOnlyRow);
            return false;
        }

        $company.form.Show({ req: 'upd', data: rows[0] });
    }

    function delFn(grid) {
        var rows = grid.grid.getSelectionModel().getSelection();
        if (!rows.length) {
            errorState.show(errorState.SelectRow);
            return false;
        }
        var ids = [];
        rows.Each(function (e) {
            ids.push(e.get('ID'));
        });

        DeleteAction(ids);
    }

})(Object.$Supper($company, 'grid'));

(function ($) {

    var Form = $.Form = function (options) {
        var defaults = { req: '', callback: Ext.emptyFn, addr: null, roomid: 0, data: null, readonly: false };
        Ext.apply(defaults, options);

        var form = ExtHelper.CreateForm({
            labelWidth: 90,
            url: String.Format('{0}{1}', $company.basic_uri, defaults.req),
            callback: function () {
                var me = this;
                submit({ obj: me, form: form, callback: defaults.callback });
            }
        });

        var typeid = identityManager.createId();
        var genreid = identityManager.createId();
        var tradeid = identityManager.createId();
        var deptid = identityManager.createId();
        form.add({
            xtype: 'hiddenfield', fieldLabel: 'id', name: 'ID', value: '0'
        }, {
            xtype: 'textfield', fieldLabel: '单位名称', name: 'Name', value: '', allowBlank: false
        }, {
            xtype: 'textfield', fieldLabel: '注册资金(万元)', name: 'Capital', value: '', allowBlank: false,
            regex: /^[1-9]\d{0,}([.]\d+)?$/
        }, {
            xtype: 'textfield', fieldLabel: '法人代表', name: 'Corporation', value: '', allowBlank: false
        }, {
            xtype: 'textfield', fieldLabel: '经营面积(㎡)', name: 'Square', value: '', allowBlank: false,
            regex: /^[1-9]\d{0,}([.]\d+)?$/
        }, {
            xtype: 'textfield', fieldLabel: '联系电话', name: 'Tel', value: '', allowBlank: false
        },
        $address.getAutoComplete({ text: '联系地址', name: 'Addr', value: defaults.addr, allowBlank: false }),
        {
            xtype: 'textfield', fieldLabel: '主营经营', name: 'MainFrame', value: '', allowBlank: false
        }, {
            xtype: 'textfield', fieldLabel: '兼营经营', name: 'Concurrently', value: '', allowBlank: false
        }, {
            xtype: 'textfield', fieldLabel: '外来务工人数', name: 'MigrantWorks', value: '0', allowBlank: false,
            regex: /^\d+$/
        }, {
            xtype: 'datefield',
            fieldLabel: '开业日期',
            name: 'StartTimeStr',
            editable: false,
            allowBlank: false,
            format: 'Y-m-d', allowBlank: false
        }, {
            xtype: 'textfield', fieldLabel: '营业执照编号', name: 'LicenceNum', value: '', allowBlank: false,
            regex: /^\w+$/, allowBlank: false
        }, {
            xtype: 'datefield',
            fieldLabel: '执照开始日期',
            name: 'LicenceStartTimeStr',
            editable: false,
            allowBlank: false,
            format: 'Y-m-d', allowBlank: false
        }, {
            xtype: 'datefield',
            fieldLabel: '执照截止日期',
            name: 'LicenceEndTimeStr',
            editable: false,
            allowBlank: false,
            format: 'Y-m-d', allowBlank: false
        }, {
            xtype: 'combobox',
            fieldLabel: '单位大类',
            name: 'TypeID',
            hiddenName: 'TypeID',
            store: $company.kind.grid.store,
            queryMode: 'local',
            displayField: 'Name',
            valueField: 'ID',
            forceSelection: true,
            editable: false,
            triggerAction: 'all',
            allowBlank: false,
            listeners: {
                'change': function (obj, value, eOpts) {
                    var comp = this;
                    form.getComponent(typeid).setValue(comp.getRawValue());
                }
            }
        }, {
            xtype: 'hiddenfield', id: typeid, fieldLabel: 'typeid', name: 'TypeName', value: ''
        }, {
            xtype: 'combobox',
            fieldLabel: '单位小类',
            name: 'GenreID',
            hiddenName: 'GenreID',
            store: $company.genre.grid.store,
            queryMode: 'local',
            displayField: 'Name',
            valueField: 'ID',
            forceSelection: true,
            editable: false,
            triggerAction: 'all',
            allowBlank: false,
            listeners: {
                'change': function (obj, value, eOpts) {
                    var comp = this;
                    form.getComponent(genreid).setValue(comp.getRawValue());
                }
            }
        }, {
            xtype: 'hiddenfield', id: genreid, fieldLabel: 'genreid', name: 'GenreName', value: ''
        }, {
            xtype: 'combobox',
            fieldLabel: '行业类型',
            name: 'TradeID',
            hiddenName: 'TradeID',
            store: $company.trade.grid.store,
            queryMode: 'local',
            displayField: 'Name',
            valueField: 'ID',
            forceSelection: true,
            editable: false,
            triggerAction: 'all',
            allowBlank: false,
            listeners: {
                'change': function (obj, value, eOpts) {
                    var comp = this;
                    form.getComponent(tradeid).setValue(comp.getRawValue());
                }
            }
        }, {
            xtype: 'hiddenfield', id: tradeid, fieldLabel: 'tradeid', name: 'TradeName', value: ''
        }, {
            xtype: 'combobox',
            fieldLabel: '消防等级',
            name: 'FireRating',
            hiddenName: 'FireRating',
            store: FireRatingLevel,
            queryMode: 'local',
            displayField: 'd',
            valueField: 'v',
            forceSelection: true,
            editable: false,
            triggerAction: 'all',
            allowBlank: false,
            value: 3
        }, {
            xtype: 'hiddenfield', fieldLabel: 'roomid', name: 'RoomID', value: defaults.roomid || '0'
        }, {
            xtype: 'combotree',
            url: 'Sys/DepartmentHelp.ashx?req=1',
            name: 'OrganName',
            valueField: 'Name',
            displayField: 'Name',
            fieldLabel: '所属管辖机关',
            allowBlank: false,
            value: '',
            itemSelected: function (options) {
                var defaults = { ID: 0, Name: '' };
                Ext.apply(defaults, options);

                form.getComponent(deptid).setValue(defaults.ID);
            }
        }, {
            xtype: 'hiddenfield', id: deptid, fieldLabel: 'OrganID', name: 'OrganID', value: ''
        });

        if (defaults.data) {
            form.loadRecord(defaults.data);
        }

        return form;
    };

    var Show = $.Show = function (options) {
        var defaults = { req: '', addr: '', roomid: 0, data: null, callback: Ext.emptyFn, title: '信息编辑...', width: 600, height: 558 };
        Ext.apply(defaults, options);

        var form = Form({ req: defaults.req, addr: defaults.addr, roomid: defaults.roomid, data: defaults.data, callback: defaults.callback });
        var wind = $.window = ExtHelper.CreateWindow({
            title: defaults.title, width: defaults.width, height: defaults.height, layout: 'fit', listeners: {
                'show': function () {
                    if ($company.grid.window) $company.grid.window.hide();
                },
                'close': function () {
                    if ($company.grid.window) $company.grid.window.show();
                }
            }
        });
        wind.add(form);
    };

    function submit(options) {
        var defaults = { form: null, callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        if (!defaults.form.isValid()) return false;

        defaults.form.submit({
            success: function (a, b) {
                if (b.result.result > 0) {
                    if ($company.grid.store)
                        $company.grid.store.load();
                    if (defaults.callback && defaults.callback instanceof Function) {
                        defaults.callback(b);
                    }

                    defaults.form.up('window').close();
                } else {
                    errorState.show(errorState.SubmitFail);
                }
            },
            failure: function (a, b) { errorState.show(errorState.SubmitFail); }
        });
    }

})(Object.$Supper($company, 'form'));

(function ($) {

    var Show = $.Show = function (options, id) {
        if (!id && $company.grid.window)
            id = $company.grid.window.getId();
        
        var mask = maskGenerate.start({ p: id, msg: '正在获取，请稍后 ...' });
        $company.loadDetailHandler(function () {
            $companydetail.detail.Show(options);
            mask.stop();
        });
    };

})(Object.$Supper($company, 'detail'));

//大类分类
(function ($) {

    var url = {
        grid: String.Format('{0}kind', $.supper.basic_uri),
        add: String.Format('{0}kadd', $.supper.basic_uri),
        upd: String.Format('{0}pupd', $.supper.basic_uri),
        del: String.Format('{0}pdel', $.supper.basic_uri)
    };
    var grid = $.grid = $param.grid.Grid({ url: url });

})(Object.$Supper($company, 'kind'));

//小类分类
(function ($) {
    var url = {
        grid: String.Format('{0}genre', $.supper.basic_uri),
        add: String.Format('{0}gadd', $.supper.basic_uri),
        upd: String.Format('{0}pupd', $.supper.basic_uri),
        del: String.Format('{0}pdel', $.supper.basic_uri)
    };
    var grid = $.grid = $param.grid.Grid({ url: url });

})(Object.$Supper($company, 'genre'));

//行业类型
(function ($) {
    var url = {
        grid: String.Format('{0}trade', $.supper.basic_uri),
        add: String.Format('{0}tadd', $.supper.basic_uri),
        upd: String.Format('{0}pupd', $.supper.basic_uri),
        del: String.Format('{0}pdel', $.supper.basic_uri)
    };
    var grid = $.grid = $param.grid.Grid({ url: url });

})(Object.$Supper($company, 'trade'));
