/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="common.js" />
/// <reference path="../../Mark/Mark.js" />
/// <reference path="Utils.js" />
/// <reference path="Config.js" />

//定义各查询方法Form

var qForm = function () {
    var tp;
    var paramType;

    //构造函数
    var defaults = {
        population: 'population',
        area: 'area',
        building: 'building',
        buildingQuery: 'buildingQuery',
        gps: 'gps',
        monitor: 'monitor',
        YJBJ: 'YJBJ',
        YJDistributed:'YJDistributed',
        JCJ_JJDB: 'JCJ_JJDB',
        JCJDistributed: 'JCJDistributed',
        AJJBXX:'AJJBXX',
        mark:'mark',
        panelQuery: 'panelQuery',
        trackRecordsQuery: 'trackRecordsQuery',
        syPopulation: 'syPopulation',
        ckPopulation: 'ckPopulation',
        zakPopulation: 'zakPopulation',
        jwPopulation: 'jwPopulation',
        zhkPopulation: 'zhkPopulation',
        company: 'company',
        employee: 'employee',
        hotel: 'hotel',
        hotelStay: 'hotelStay',
        gpsTrack: 'gpsTrack',
        gpsLocation: 'gpsLocation'
    };
    function constructor() {

        function getQueryForm(type, callback) {
            ///<summary>
            ///根据类型获取需要的组件
            ///</summary>
            ///<param name="type">（枚举类型）qForm.qFormType的值之一</param>

            //需要返回的组件
            var c = undefined;
            switch (type) {
                case defaults.population:
                    c = populationForm(callback);
                    break;
                case defaults.area:
                    c = areaForm(callback);
                    break;
                case defaults.building:
                    c = buildingForm(callback);
                    break;
                case defaults.buildingQuery:
                    c = buildingQuery(callback);
                    break;
                case defaults.gps:
                    c = gpsForm(callback);
                    break;
                case defaults.monitor:
                    c = monitorForm(callback);
                    break;
                case defaults.panelQuery:
                    c = panelQueryForm(callback);
                    break;
                case defaults.YJBJ:
                    c = YJBJForm(callback);
                    break;
                case defaults.YJDistributed:
                    c = YJDistributedForm(callback);
                    break;
                case defaults.JCJ_JJDB:
                    c = JCJ_JJDBForm(callback);
                    break;
                case defaults.JCJDistributed:
                    c = JCJDistributedForm(callback);
                    break;
                case defaults.mark:
                    c = MarkForm(callback);
                    break;
                case defaults.trackRecordsQuery:
                    c = trackRecordsQuery(callback);
                    break;
                case defaults.syPopulation:
                    c = syPopulation(callback);
                    break;
                case defaults.ckPopulation:
                    c = ckPopulation(callback);
                    break;
                case defaults.zakPopulation:
                    c = zakPopulation(callback);
                    break;
                case defaults.jwPopulation:
                    c = jwPopulation(callback);
                    break;
                case defaults.zhkPopulation:
                    c = zhkPopulation(callback);
                    break;
                case defaults.company:
                    c = company(callback);
                    break;
                case defaults.employee:
                    c = employee(callback);
                    break;
                case defaults.hotel:
                    c = hotel(callback);
                    break;
                case defaults.hotelStay:
                    c = hotelStay(callback);
                    break;
                case defaults.AJJBXX:
                    c = AJJBXXForm(callback);
                    break;
                case defaults.gpsTrack:
                    c = gpsTrack(callback);
                    break;
                case defaults.gpsLocation:
                    c = gpsLocation(callback);
                    break;
                default: break;
            }
            return c;
        }

        function queryForm(option) {
            ///<summary>
            ///（虚类）实例化组件
            ///<para>设置默认值</para>
            ///</summary>
            ///<param name="option">
            ///一个Ext.Object对象。
            ///<para>需要以下属性：</para>
            ///<para>items：Ext.form.field实例的数组</para>
            ///<para>url：表单提交路</para>
            ///<para>callback：表单提交成功，触发回调方法</para>
            ///</param>

            //默认值
            var _default = {
                items: [],
                url: undefined,
                callback: undefined
            };
            Ext.apply(_default, option);

            var c = ExtHelper.CreateForm({ frame: false, width: 'auto', clo: false, url: _default.url, buttonstext: _default.buttonstext || '查 询 (Q)', buttonAlign: _default.buttonAlign || 'right', callback: _default.callback });
            c.add(_default.items); //debugger;
            c.buttonAlign = 'right'; 
            return c;
        }

        function populationForm(callback) {
            ///<summary>
            ///人口查询组件
            ///</summary>

            var c = queryForm({
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '姓名',
                        name: 'txtId1'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '性别',
                        name: 'txtId2'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '出生日期',
                        name: 'txtId3'
                    }
                ],
                url: 'Area/AreaHandler.ashx?req=add',
                callback: callback
            });
            return c;
        }

        function areaForm(callback) {
            ///<summary>
            ///辖区查询组件
            ///</summary>

            var c = queryForm({
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '辖区1',
                        name: 'txtId1'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '辖区2',
                        name: 'txtId2'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '辖区3',
                        name: 'txtId3'
                    }
                ],
                url: 'Area/AreaHandler.ashx?req=1',
                callback: callback
            });
            return c;
        }

        function buildingForm(callback) {
            ///<summary>
            ///大楼查询组件
            ///</summary>

            var c = queryForm({
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '名称',
                        name: 'txtId1'
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '地址',
                        name: 'txtId2'
                    }
                ],
                url: 'Building/BuildingHelp.ashx?req=search',
                callback: callback
            });
            return c;
        }

        function buildingQuery(callback) {

            Ext.define("bdaddrQueryModel", {
                extend: 'Ext.data.Model',
                fields: [
                    { name: 'Content' }
                ]
            });

            var ds = Ext.create('Ext.data.Store', {
                model: 'bdaddrQueryModel',
                proxy: {
                    type: 'ajax',
                    url: 'Buildings/BuildingHelp.ashx?req=qbdaddr',
                    reader: {
                        type: 'json',
                        root: 'result'
                    },
                    simpleSortMode: true
                },
            });

            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '大楼名称',
                    name: 'Name',
                    allowBlank: true
                }, {
                    xtype: 'combo',
                    store: ds,
                    name: 'Addr',
                    fieldLabel: '详细地址',
                    displayField: 'Content',
                    typeAhead: false,
                    hideLabel: false,
                    hideTrigger: true,
                    minChars:2,
                    listConfig: {
                        loadingText: 'Searching...',
                        emptyText: '<div style="height:26px; line-height:26px; padding-left:15px; font-weight:700; color:darkred; font-size:12px;">没有匹配项</div>',
                        getInnerTpl: function () {
                            return '<div class="search-item" style="height:26px; line-height:26px;">' +
                                '{Content}' +
                            '</div>';
                        }
                    }
                }],
                callback: function () {
                    var me = this;
                    callback(c, me);
                }
            });
            return c;
        }

        function gpsForm(callback) {
            ///<summary>
            ///警务人员或车辆GPS查询组件
            ///</summary>

            var c = queryForm({
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'GPS1',
                        name: 'txtId1'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'GPS2',
                        name: 'txtId2'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'GPS3',
                        name: 'txtId3'
                    },
                ],
                url: 'Area/AreaHandler.ashx?req=1',
                callback: callback
            });
            return c;
        }

        function monitorForm(callback) {
            ///<summary>
            ///监控查询组件
            ///</summary>
            var url = 'Monitor/MonitorHelp.ashx?req=';
            var tp = String.Format("model_{0}", new Date().getTime());
            Ext.define(tp, {
                extend: 'Ext.data.Model',
                fields: [
                    { name: 'ID' },
                    { name: 'Name' }
                ]
            });
            var id = String.Format("store_{0}", new Date().getTime());
            var store = ExtHelper.CreateStore({
                storeId: id,
                model: tp,
                url: "Monitor/MonitorHelp.ashx?req=dotype"
            });


            //var mytype = String.Format("model_{0}", new Date().getTime());
            //Ext.define(mytype, {
            //    extend: 'Ext.data.Model',
            //    fields: [
            //        { name: 'ID' },
            //        { name: 'Content' }
            //    ]
            //});
            //var autofield = Autocompletefield.create({
            //    url: String.Format("{0}addr", url),
            //    modelType: mytype,
            //    rendercallback: renderCallback,
            //    displayField: 'Content',
            //    valueField: 'Content',
            //    fieldLabel: '设备地址',
            //    name: 'Addr'
            //});
            var dotypeid = identityManager.createId();
            var c = queryForm({
                items: [{
                    xtype: 'hiddenfield',
                    fieldLabel: 'DoTypeID',
                    name: 'DoTypeID',
                    id:dotypeid,
                    value: '0'
                },
                    {
                        xtype: 'textfield',
                        fieldLabel: '设备名称',
                        name: 'Name'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '设备编号',
                        name: 'Num'
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: '设备用途',
                        width: 550,
                        name: 'DoTypeName',
                        hiddenName: 'DoTypeName',
                        store: store,
                        queryMode: 'local',
                        displayField: 'Name',
                        valueField: 'ID',
                        emptyText: '',
                        forceSelection: false,
                        blankText: '',
                        triggerAction: 'all',
                        //selectOnFocus: true,
                        allowBlank: true,
                        editable: false,
                        listeners: {
                            change: {
                                fn: function () {
                                    c.getComponent(dotypeid).setValue(this.getValue());
                                }
                            }
                        }
                    }, getAutoComplete({ text: '设备地址', name: 'Addr' })
                ],
                url: String.Format("{0}search", url),
                callback: function () {
                    callback(c);
                }
            });
            return c;
        }

        function JCJ_JJDBForm(callback) {
            ///<summary>
            ///三台合一查询组件
            ///</summary>

            //var mytype = String.Format("model_{0}", new Date().getTime());
            //Ext.define(mytype, {
            //    extend: 'Ext.data.Model',
            //    fields: [
            //        { name: 'ID' },//主键
            //        { name: 'Num' },//报警编号
            //        { name: 'TypeID' },//报警类别ID
            //        { name: 'TypeName' },//报警类别名称
            //        { name: 'Tel' },//报警电话
            //        { name: 'AlarmMan' },//报警人
            //        { name: 'Location' },//报警地址
            //        { name: 'X' },//X坐标
            //        { name: 'Y' },//Y坐标
            //        { name: 'AlarmTime' },//报警时间
            //        { name: 'AdminName' },//行政区划名称
            //        { name: 'AdminID' }//行政区划ID
            //    ]
            //});

            //var autofield = Autocompletefield.create({
            //    url: 'JCJ_JJDB/JCJ_JJDBHandler.ashx?req=addr',
            //    modelType: mytype,
            //    rendercallback: renderCallback,
            //    displayField: 'Location',
            //    valueField: 'Location',
            //    fieldLabel: '报警地址',
            //    name: 'Location'
            //});

            var c = queryForm({
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '报警编号',
                        name: 'Num',
                        allowBlank: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '报警电话',
                        name: 'Tel',
                        allowBlank: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '报警人',
                        name: 'AlarmMan',
                        allowBlank: true
                    },
                    getAutoComplete({ text: '报警地址', name: 'Location' }),
                    {
                        xtype: 'datefield',
                        fieldLabel: '开始时间',
                        name: 'TimeStart',
                        editable: false,
                        allowBlank: true,
                        format: 'Y-m-d'
                    }, {
                        xtype: 'datefield',
                        fieldLabel: '结束时间',
                        name: 'TimeEnd',
                        editable: false,
                        allowBlank: true,
                        format: 'Y-m-d'
                    }
                ],
                url: 'JCJ_JJDB/JCJ_JJDBHandler.ashx?req=search',
                callback: function () {
                    callback(c);
                }
            });

            return c;
        }

        function YJBJForm(callback) {
            ///<summary>
            ///一键报警查询组件
            ///</summary>

            //var mytype = String.Format("model_{0}", new Date().getTime());
            //Ext.define(mytype, {
            //    extend: 'Ext.data.Model',
            //    fields: [
            //        { name: 'ID' },//主键
            //        { name: 'Num' },//报警编号
            //        { name: 'TypeID' },//报警类别ID
            //        { name: 'TypeName' },//报警类别名称
            //        { name: 'Tel' },//报警电话
            //        { name: 'AlarmMan' },//报警人
            //        { name: 'Location' },//报警地址
            //        { name: 'X' },//X坐标
            //        { name: 'Y' },//Y坐标
            //        { name: 'AlarmTime' },//报警时间
            //        { name: 'AdminName' },//行政区划名称
            //        { name: 'AdminID' }//行政区划ID
            //    ]
            //});

            //var autofield = Autocompletefield.create({
            //    url: 'YJBJ/YJBJHandler.ashx?req=addr',
            //    modelType: mytype,
            //    rendercallback: renderCallback,
            //    displayField: 'Location',
            //    valueField: 'Location',
            //    fieldLabel: '报警地址',
            //    name: 'Location'
            //});

            var c = queryForm({
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '报警编号',
                        name: 'Num',
                        allowBlank: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '报警电话',
                        name: 'Tel',
                        allowBlank: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '报警人',
                        name: 'AlarmMan',
                        allowBlank: true
                    },
                    getAutoComplete({ text: '报警地址', name: 'Location' }),
                    {
                        xtype: 'datefield',
                        fieldLabel: '开始时间',
                        name: 'TimeStart',
                        editable: false,
                        allowBlank: true,
                        format: 'Y-m-d'
                    }, {
                        xtype: 'datefield',
                        fieldLabel: '结束时间',
                        name: 'TimeEnd',
                        editable: false,
                        allowBlank: true,
                        format: 'Y-m-d'
                    }
                ],
                url: 'YJBJ/YJBJHandler.ashx?req=search',
                callback: function () {
                    callback(c);
                }
            });
            
            return c;
        }

        function AJJBXXForm(cb) {
            var c = queryForm({
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '案件编号',
                        name: 'bh',
                        allowBlank: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '人员姓名',
                        name: 'xm',
                        allowBlank: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '身份证号',
                        name: 'cnb',
                        allowBlank: true
                    },{
                        xtype: 'combobox',
                        fieldLabel: '是否吸毒',
                        name: 'isdrup',
                        hiddenName: 'isdrup',
                        store: states,
                        queryMode: 'local',
                        displayField: 'd',
                        valueField: 'v',
                        forceSelection: true,
                        triggerAction: 'all',
                        selectOnFocus: true,
                        allowBlank: false,
                        value: 0
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '是否追逃',
                        name: 'ispursuit',
                        hiddenName: 'ispursuit',
                        store: states,
                        queryMode: 'local',
                        displayField: 'd',
                        valueField: 'v',
                        forceSelection: true,
                        triggerAction: 'all',
                        selectOnFocus: true,
                        allowBlank: false,
                        value: 0
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '是否刑拘',
                        name: 'isarrest',
                        hiddenName: 'isarrest',
                        store: states,
                        queryMode: 'local',
                        displayField: 'd',
                        valueField: 'v',
                        forceSelection: true,
                        triggerAction: 'all',
                        selectOnFocus: true,
                        allowBlank: false,
                        value:0
                    }
                ],
                url: 'AJJBXX/Handler.ashx?req=search',
                callback: function () {
                    cb(c);
                }
            });

            return c;
        }

        //自动完成自定义呈现内容
        function renderCallback(name) {
            return String.Format('<div style="line-height:22px;padding:2px 10px" class="content-cut">{{0}}</div>', name);
        }

        function YJDistributedForm(callback) {
            var lineHeight = 30;

            var c = queryForm({
                items: [{
                    xtype: 'numberfield',
                    name: 'TimeInterval',
                    fieldLabel: '间隔时间',
                    value: 10,
                    maxValue: 600,//最大值 10 Minutes
                    minValue: 1,//最小值 1 Seconds
                    style: String.Format('height:{0}px; line-height:{0}px;', lineHeight)
                },  {
                    xtype: 'datefield',
                    fieldLabel: '开始时间',
                    name: 'TimeStart',
                    editable: false,
                    allowBlank: true,
                    value:new Date().getUTCDate(),
                    format: 'Y-m-d'
                }],
                callback: function () {
                    var me = this;
                    if (callback && callback instanceof Function) {
                        callback(c, me);
                    }
                },
                buttonstext: '开 始(S)'
            });
            return c;
        }

        function JCJDistributedForm(callback) {
            var lineHeight = 30;

            var c = queryForm({
                items: [{
                    xtype: 'numberfield',
                    name: 'TimeInterval',
                    fieldLabel: '间隔时间（秒）',
                    value: 10,
                    maxValue: 600,//最大值 10 Minutes
                    minValue: 1,//最小值 1 Seconds
                    style: String.Format('height:{0}px; line-height:{0}px;', lineHeight)
                }, {
                    xtype: 'datefield',
                    fieldLabel: '开始日期',
                    name: 'TimeStart',
                    editable: false,
                    allowBlank: true,
                    value: new Date().getUTCDate(),
                    format: 'Y-m-d'
                }],
                callback: function () {
                    var me = this;
                    if (callback && callback instanceof Function) {
                        callback(c, me);
                    }
                },
                buttonstext: '开 始(S)'
            });
            return c;
        }

        function MarkForm(callback) {
            ///<summary>
            ///标注查询组件
            ///</summary>

            var mtype = String.Format("model_{0}", new Date().getTime());
            Ext.define(mtype, {
                extend: 'Ext.data.Model',
                fields: [
                    { name: 'ID' },
                    { name: 'Name' },
                    { name: 'IconCls' },
                    { name: 'Color' },
                    { name: 'Type' },
                    { name: 'Remark' }
                ]
            });
            var url = 'Mark/MarkHelp.ashx?req=';
            var storeid = String.Format("store_{0}", new Date().getTime());
            var store = new Ext.data.Store({
                storeId: storeid,
                model: mtype,
                proxy: {
                    type: 'ajax',
                    url: url + '3',
                    simpleSortMode: true
                }
            });
            store.load();
            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '名称',
                    emptyText: '请输入标注名称',
                    name: 'Name'
                }, {
                    xtype: 'combo',
                    name: 'TypeID',
                    fieldLabel: '标注类别',
                    store: store,
                    displayField: 'Name',
                    valueField: 'ID'
                }
                ],
                url: url + 'search',
                callback: function () {
                    var form = this.up('form');
                    callback(form);
                }
            });
            return c;
        }

        function trackRecordsQuery(callback) {
            var lineHeight = 30;

            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '设备名称',
                    name: 'devicename',
                    allowBlank: true
                }, {
                    xtype: 'textfield',
                    fieldLabel: '警员名称',
                    name: 'officername',
                    allowBlank: true
                }, {
                    xtype: 'datefield',
                    fieldLabel: '开始日期',
                    name: 'timestart',
                    //editable: false,
                    allowBlank: true,
                    //value: new Date(),
                    format: 'Y-m-d H:i:s'
                }, {
                    xtype: 'datefield',
                    fieldLabel: '结束日期',
                    name: 'timeend',
                    //editable: false,
                    allowBlank: true,
                    //value: new Date(),
                    format: 'Y-m-d H:i:s'
                }],
                callback: function () {
                    var me = this;
                    if (callback && callback instanceof Function) {
                        callback(c, me);
                    }
                },
                buttonstext: '查  询'
            });
            return c;
        }

        function syPopulation(callback) {
            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '人员姓名',
                    name: 'Name',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '曾用名',
                    name: 'AliasName',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '证件号码',
                    name: 'CardNo',
                    allowBlank: true
                },
                getAutoComplete({ text: '详细地址', name: 'Addr' })
                ],
                callback: function () {
                    var me = this;
                    callback(c, me);
                }
            });
            return c;
        }

        function ckPopulation(callback) {
            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '人员姓名',
                    name: 'Name',
                    allowBlank: true
                },
                getAutoComplete({ text: '详细地址', name: 'Addr' })
                ],
                callback: function () {
                    var me = this;
                    callback(c, me);
                }
            });
            return c;
        }

        function zakPopulation(callback) {
            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '人员姓名',
                    name: 'Name',
                    allowBlank: true
                }, {
                    xtype: 'textfield',
                    fieldLabel: '暂住编号',
                    name: 'CNo',
                    allowBlank: true
                }, {
                    xtype: 'textfield',
                    fieldLabel: '房东姓名',
                    name: 'HName',
                    allowBlank: true
                },
                getAutoComplete({ text: '详细地址', name: 'Addr' })
                ],
                callback: function () {
                    var me = this;
                    callback(c, me);
                }
            });
            return c;
        }
        
        function jwPopulation(callback) {
            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '中文姓名',
                    name: 'CName',
                    allowBlank: true
                }, {
                    xtype: 'textfield',
                    fieldLabel: '英文名',
                    name: 'FName',
                    allowBlank: true
                }, {
                    xtype: 'textfield',
                    fieldLabel: '英文姓',
                    name: 'LName',
                    allowBlank: true
                }, {
                    xtype: 'combobox',
                    fieldLabel: '签证类型',
                    name: 'VisaID',
                    hiddenName: 'VisaID',
                    store: getParamStore({ code: 'qzzl' }),
                    queryMode: 'local',
                    displayField: 'Name',
                    valueField: 'ID',
                    forceSelection: true,
                    triggerAction: 'all',
                    selectOnFocus: true,
                    allowBlank: true
                }, {
                    xtype: 'combobox',
                    fieldLabel: '入境口岸',
                    name: 'PortID',
                    hiddenName: 'PortID',
                    store: getParamStore({ code: 'entryport' }),
                    queryMode: 'local',
                    displayField: 'Name',
                    valueField: 'Name',
                    forceSelection: true,
                    triggerAction: 'all',
                    selectOnFocus: true,
                    allowBlank: true
                },
                getAutoComplete({ text: '详细地址', name: 'Addr' })
                ],
                callback: function () {
                    var me = this;
                    callback(c, me);
                }
            });
            return c;
        }
        
        function zhkPopulation(callback) {
            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '人员姓名',
                    name: 'Name',
                    allowBlank: true
                }, {
                    xtype: 'combobox',
                    fieldLabel: '重点类型',
                    name: 'TypeID',
                    hiddenName: 'TypeID',
                    store: getParamStore({ code: 'zdrklb' }),
                    queryMode: 'local',
                    displayField: 'Name',
                    valueField: 'ID',
                    forceSelection: true,
                    triggerAction: 'all',
                    selectOnFocus: true,
                    allowBlank: true
                },
                getAutoComplete({ text: '详细地址', name: 'Addr' })
                ],
                callback: function () {
                    var me = this;
                    callback(c, me);
                }
            });
            return c;
        }

        function company(callback) {
            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '单位名称',
                    name: 'Name',
                    allowBlank: true
                }, getAutoComplete({ text: '详细地址', name: 'Addr' })],
                callback: function () {
                    var me = this;
                    callback(c, me);
                }
            });
            return c;
        }

        function employee(callback) {
            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '员工姓名',
                    name: 'Name',
                    allowBlank: true
                },
                //{
                //    xtype: 'combobox',
                //    fieldLabel: '证件类型',
                //    name: 'CardTypeID',
                //    hiddenName: 'CardTypeID',
                //    store: getParamStore({ code: 'zjlb' }),
                //    queryMode: 'local',
                //    displayField: 'Name',
                //    valueField: 'ID',
                //    forceSelection: true,
                //    triggerAction: 'all',
                //    selectOnFocus: true,
                //    allowBlank: true
                //},
                {
                    xtype: 'textfield',
                    fieldLabel: '身份证号',
                    name: 'IdentityCardNum',
                    allowBlank: true
                },
                getAutoComplete({ text: '住址', name: 'Addr' })],
                callback: function () {
                    var me = this;
                    callback(c, me);
                }
            });
            return c;
        }

        function hotel(callback) {
            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '酒店名称',
                    name: 'Name',
                    allowBlank: true
                }, getAutoComplete({ text: '详细地址', name: 'Addr' })],
                callback: function () {
                    var me = this;
                    callback(c, me);
                }
            });
            return c;
        }

        function hotelStay(callback) {
            var tp = identityManager.createId('model');

            var mod = Ext.define(tp, {
                extend: 'Ext.data.Model',
                fields: [
                    { name: 'ID' },//@  旅馆ID
                    { name: 'Name' }//@  旅馆名称
                ]
            });

            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '住宿人员',
                    name: 'Name',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '身份证号',
                    name: 'CredentialsNum',
                    allowBlank: true
                },
                getAutoComplete({ text: '入住酒店', name: 'HName', url: 'Hotel/Hotelhelp.ashx?req=match', tp: tp, val: 'Name', field: 'Name' }),
                {
                    xtype: 'textfield',
                    fieldLabel: '入住房间',
                    name: 'PutinRoomNum',
                    allowBlank: true
                }, {
                    xtype: 'datefield',
                    fieldLabel: '开始时间',
                    name: 'PutinTime',
                    editable: false,
                    allowBlank: true,
                    format: 'Y-m-d'
                }, {
                    xtype: 'datefield',
                    fieldLabel: '结束时间',
                    name: 'GetoutTime',
                    editable: false,
                    allowBlank: true,
                    format: 'Y-m-d'
                }],
                callback: function () {
                    var me = this;
                    callback(c, me);
                }
            });
            return c;
        }

        function gpsTrack(cb) {
            var c = queryForm({
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '设备编号',
                    name: 'Number',
                    allowBlank: true
                }, {
                    xtype: 'datefield',
                    fieldLabel: '开始时间',
                    name: 'TimeStart',
                    editable: false,
                    allowBlank: true,
                    value: new Date().getUTCDate(),
                    format: 'Y-m-d h:i:s'
                }, {
                    xtype: 'datefield',
                    fieldLabel: '结束时间',
                    name: 'TimeEnd',
                    editable: false,
                    allowBlank: true,
                    value: new Date().getUTCDate(),
                    format: 'Y-m-d h:i:s'
                }],
                callback: function () {
                    var me = this;
                    cb(c, me);
                }
            });
            return c;
        }

        function gpsLocation(cb) {
            var c = queryForm({
                items: [{
                    xtype: 'numberfield',
                    name: 'TimeInterval',
                    fieldLabel: '间隔时间',
                    value: 10,
                    maxValue: 100,//最大值 10 Minutes
                    minValue: 1,//最小值 1 Seconds
                    style: String.Format('height:{0}px; line-height:{0}px;', 30)
                }],
                callback: function () {
                    var me = this;
                    cb(c, me);
                },
                buttonstext:'开始获取实时分布数据',
                buttonAlign:'center'
            });
            return c;
        }

        function getParamStore(options) {
            var defaults = { code: null };
            Ext.apply(defaults, options);

            return getStore({ url: 'Sys/ParamHelp.ashx?req=bcode&code=' + defaults.code, model: paramType = paramType || defineParams() });
        }

        function getStore(options) {
            var defaults = { storeId: identityManager.createId(), total: false, url: null, model: null, pageSize: 10 };
            Ext.apply(defaults, options);

            return ExtHelper.CreateStore(defaults);
        }

        function defineParams() {
            var tp = identityManager.createId('model');
            Ext.define(tp, {
                extend: 'Ext.data.Model',
                fields: [
                    { name: 'ID' },
                    { name: 'Name' }
                ]
            });
            return tp;
        }

        function getAutoComplete(options) {
            var defaults = { url: 'XAddress/AddressHelper.ashx?req=mat', tp: tp = options.tp || defaultCompeteModel(), val: 'Content', field: 'Content', text: null, name: null, render: renderCallback };
            Ext.apply(defaults, options);

            var autofield = Autocompletefield.create({
                url: defaults.url,
                modelType: defaults.tp,
                rendercallback: defaults.render,
                displayField: defaults.field,
                valueField: defaults.val,
                fieldLabel: defaults.text,
                name: defaults.name
            });
            return autofield;
        }

        function defaultCompeteModel() {
            var tp = identityManager.createId('model');
            Ext.define(tp, {
                extend: 'Ext.data.Model',
                fields: [
                    { name: 'ID' },
                    { name: 'Content' },
                    { name: 'AdminID' },
                    { name: 'OwnerInfoID' },
                    { name: 'StreetID' },
                    { name: 'NumID' },
                    { name: 'UnitID' },
                    { name: 'RoomID' }
                ]
            });
            return tp;
        }

        //框选查询表单
        function panelQueryForm(callback) {
            var height = 50;
            var width = 50;
            qForm.panelQuery = {};
            qForm.panelQuery.callback = callback;
            var html = getPanelQueryButton({
                tip: '矩形选择查询', text: '矩形选择', imgsrc: '../Resources/images/rect.png', callback: function () {
                    EMap.PanelQuery({
                        callback:qForm.panelQuery.callback
                    });
                }
            });
            html += getPanelQueryButton({
                tip: '多边形选择查询', text: '多边形选择', imgsrc: '../Resources/images/poly.png', callback: function () {
                    //多边形选择
                    EMap.PolyQuery({
                        callback: qForm.panelQuery.callback
                    });
                }
            });
            return {
                xtype: 'panel',
                border:0,
                html: html
            };
        }

        //获取框选查询按钮
        function getPanelQueryButton(options) {
            var defaults = { height: 50, width: 50, callback: null, tip: '', text: '', imgsrc: '' };
            Ext.apply(defaults, options);

            return String.Format('<div onclick="panelQueryButtonHandler({8})" title="{5}" class="b-panel" style="height:{2}px; width:{3}px; float:left; text-align:center; vertical-align:top; margin-left:20px; margin-top:20px;"><img height="{0}" width="{1}" src="{6}" title="{5}" class="b-panel" /><div style="vertical-align:top; height:{4}px; width:{3}px; font-size:11px; text-align:center; line-height:{4}px;">{7}</div></div>', defaults.height, defaults.width, defaults.height + 16, defaults.width + 10, 16, defaults.tip, defaults.imgsrc, defaults.text, defaults.callback);
        }

        this.qFormType = defaults;
        this.getQueryForm = getQueryForm;
    }
    var s = s || new constructor();
    return s;
}();

function panelQueryButtonHandler(callback) {
    callback();
}