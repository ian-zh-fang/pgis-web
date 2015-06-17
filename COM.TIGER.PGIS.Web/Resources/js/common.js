/// <reference path="Config.js" />
/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="maskLoad.js" />

//==================>视频播放处理开始

//工具函数---start
function CreateEmptyString(l) {
    var a = [];
    for (var i = 0; i < l; i++) {
        a[i] = '*';
    }
    return a.join('');
}


//向列表中添加表项
function AddList(sel, text, value) {
    var option = document.createElement("option");
    option.appendChild(document.createTextNode(text));
    option.setAttribute("value", value);
    sel.appendChild(option);
    return;
}


//去除时间格式内的HTTP关键字
function FormatTime(time) {
    var tmp_string = time.split(' ');
    var tmp_string_cp = tmp_string[1].split(':');
    return tmp_string[0] + '%20' + tmp_string_cp[0] + '%3A' + tmp_string_cp[1] + '%3A' + tmp_string_cp[2];
}



var IS_SHOW_DEBUG = 0;  //0-关闭, 1-开启

function DebugAlert(str) {
    if (IS_SHOW_DEBUG == 1) {
        alert(str);
    }
}

String.prototype.replaceAll = function (f, r) {
    var s = new String(this);
    while (s.indexOf(f) != -1) {
        s = s.replace(f, r);
    }
    return s.toString();
}

/**
 * 解析从控件返回的xml字符串
 */
function loadXML(xmlString) {
    if (!g_xmlActive) {
        return;
    }
    g_xmlActive.loadXML(xmlString);
    if (0 == g_xmlActive.parseError.errorCode) {
        return g_xmlActive;
    }
    else {
        alert("xml解析错误:" + g_xmlActive.parseError.reason);
        return null;
    }
}

function getElementById(dom, tagName) {
    for (var i = 0; i < dom.childNodes.length; i++) {
        var node = dom.childNodes[i];
        if (node.baseName == tagName) {
            return node.nodeTypedValue;
        }
        else {
            if (node.childNodes.length != 0) {
                getElementById(dom.childNodes[i], tagName);
            }
        }
    }
}

//工具函数---end


var g_UserLoginId = '';
var g_UserName = 'loadmin';    //登录用户名
var g_PassWord = 'loadmin';    //登录用户密码
var g_ServerIP = '10.162.28.83';    //服务器IP地址
var g_ServerPort = 8800;    //服务器端口
var g_imosActivePlayer = null;
var g_curFrameNum = '1';
var g_xmlActive = null;
var g_PlayFrame1 = null;

//初始化播放控件
function InitActiveX() {

    g_imosActivePlayer = document.all.small_active;
    g_PlayFrame1 = document.all.xcameraobject;
    if (!g_imosActivePlayer) {
        errorState.show("未安装控件，请先安装后再使用本页面");
    }

    var xmldoc;
    try {
        xmldoc = new ActiveXObject("Microsoft.XMLDOM");
        if (!xmldoc) {
            xmldoc = new ActiveXObject("MSXML2.DOMDocument.3.0");
        }
    }
    catch (e) {
    }
    g_xmlActive = xmldoc;
    if (!g_xmlActive) {
        errorState.show("xml解析器获取错误，将导致某些功能不可用");
    }
    else {
        g_xmlActive.async = "false";
    }
}

//登录    
function DoLogin() {
    if (!g_imosActivePlayer) {
        errorState.show("未安装控件，请先安装后再使用本页面");
        return false;
    }
    var serverIP = g_ServerIP;
    var userName = g_UserName;
    var passWd = g_PassWord;
    if (passWd == "") {
        passWd = "";
    }
    //alert(typeof passWd);
    var flag = g_imosActivePlayer.IMOSAX_InitOCX(serverIP, g_ServerPort, userName, passWd, 0);
    if (flag == 0) {

        g_imosActivePlayer.IMOSAX_SetPlayWnd(1, g_PlayFrame1.PLAYFM_GetFrameHandle());
        //获取用户信息
        var retStr = g_imosActivePlayer.IMOSAX_GetUserLoginInfo();
        var userObj = loadXML(retStr);
        g_UserLoginId = userObj.documentElement.selectNodes("//LOGININFO/UserLoginIDInfo/UserLoginCode")[0].text;
        
        return true;
    }

    alert(Ext.util.Format.format("平台登陆失败，错误代码：{0}", flag));
    return false;
}

//退出登录
function DoLogout() {
    if (g_imosActivePlayer) {
        var flag = g_imosActivePlayer.IMOSAX_UnregOCX();
        if (0 != flag) {
            //暂时不提示
        }
    }
}

//启动实况
function DoStartPlay(cameraId) {
    if (!g_imosActivePlayer) {
        errorState.show("未安装控件，请先安装后再使用本页面");
        return;
    }

    var frameNum = g_curFrameNum;
    frameNum = parseInt(frameNum, 10);
    if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
        alert("请先选择一个窗格");
        return;
    }
    var flag = g_imosActivePlayer.IMOSAX_StartFrameLive(frameNum, cameraId);
    if (0 == flag) {
        //alert("实况播放成功");
    }
    else {
        alert("播放实况失败，错误码：" + flag);
    }
}

//释放实况
function DoStopPlay() {
    if (!g_imosActivePlayer) {
        errorState.show("未安装控件，请先安装后再使用本页面");
        return;
    }
    var frameNum = g_curFrameNum;
    if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
        errorState.show("请选择一个窗格");
        return;
    }
    var flag = g_imosActivePlayer.IMOSAX_StopFrameLive(frameNum);
    //if (0 == flag) {
    //    alert("停止实况成功");
    //}
    //else {
    //    errorState.show("停止实况失败，错误码：" + flag);
    //}
}

//================>事件处理函数event---start

/**
 * 窗格单击事件的处理函数
 */
function dealEventClickFrame(ulFrameNum, pcFrameInfo) {
    //当前窗格
    g_curFrameNum = ulFrameNum;
    pcFrameInfo = pcFrameInfo.replaceAll("\"", "\'");
    var tmpXmlDoc = loadXML(pcFrameInfo);
    if (!tmpXmlDoc) {
        return;
    }
    //将需要的数据从xml中获取，方便后续使用
}

//================>事件处理函数event---end

//========================================>视频播放处理结束

var __transformdata = {
    'Lat': {
        Intercept: 28.1330657075451,
        Variable1: 1.33787091963793E-06,
        Variable2: -0.0000020215162449493
    },
    'Lng': {
        Intercept: 106.789681858985,
        Variable1: 1.65852591313745E-06,
        Variable2: 2.58596774313365E-06
    },
    'X': {
        Intercept: -42366937.9472284,
        Variable1: 296730.555100016,
        Variable2: 379595.202327182
    },
    'Y': {
        Intercept: -14122049.5868561,
        Variable1: 196378.300462638,
        Variable2: -243454.671333262
    }
};


function EPoint2ELatLng(epoint) {
    ///<summary>2.5地图坐标转化成2维坐标 </summary>

    var p = { Lat: __transformdata.Lat.Variable1 * epoint.X + (__transformdata.Lat.Variable2) * epoint.Y + (__transformdata.Lat.Intercept), Lng: __transformdata.Lng.Variable1 * epoint.X + __transformdata.Lng.Variable2 * epoint.Y + (__transformdata.Lng.Intercept) };

    p.Lat = p.Lat.toFixed(6);
    p.Lng = p.Lng.toFixed(6);

    return p;
}

function ELatLng2EPoint(elatlng) {
    ///<summary>2维地图坐标转化成2.5坐标</summary>

    return {
        X: parseInt(
            __transformdata.X.Variable1 * elatlng.Lat +
            __transformdata.X.Variable2 * elatlng.Lng +
            (__transformdata.X.Intercept)
           ),
        Y: parseInt(
            __transformdata.Y.Variable1 * elatlng.Lat +
            __transformdata.Y.Variable2 * elatlng.Lng +
            (__transformdata.Y.Intercept)
           )
    };
}


var ExtHelper = (function () {
    var _this = this;//私有属性
    var _myMask = {};
    var o = {
        Property: {},    //公有属性
        StartLoadMask: function (options) {
            /// <summary>
            /// 开始加载遮罩
            /// </summary>
            ///<param name="options">
            ///一个Object对象。
            ///<para>需要以下属性：</para>
            ///<para>p：需要遮盖的控件，默认值为整个页面</para>
            ///<para>msg：加载文字,默认值为 数据努力加载中……</para>
            ///</param>
            CreateLoadMask(options);
            _myMask.show();
            return _myMask;
        },
        StopLoadMask: function () {
            /// <summary>
            /// 关闭遮罩
            /// </summary>
            _myMask.hide();
        },
        CreateWindow: function (options) {
            /// <summary>
            /// 创建window窗口
            /// </summary>
            ///<param name="options" type="Object">
            ///<para>title：窗口标题，默认无标题</para>
            ///<para>height：窗口高度，默认300</para>
            ///<para>width：窗口宽度，默认400</para>
            ///<para>iconCls：窗口图标Class，默认为bserver</para>
            ///</param>
            var c = Ext.getCmp('extCenter');

            var d = {
                title: '',
                height: 400,
                width: 600,
                iconCls: 'bserver',
                closable: true,
                modal: true,
                listeners: null,
                x: 0,
                y: 0,
                collapsible: false,
                resizable:true,
                draggable: true,
                layout:'auto'
            };

            options = Ext.apply({}, options, d);
            title = options.title;
            height = options.height;
            width = options.width;
            iconCls = options.iconCls;
            layout = options.layout;

            var closable = options.closable;
            var modal = options.modal;

            var listeners = {};
            if (options.listeners && options.listeners instanceof Object) listeners = options.listeners;

            var x = options.x;
            var y = options.y;

            extWindow = new Ext.window.Window({
                title: title,
                height: height,
                width: width,
                iconCls: iconCls,
                layout: layout,
                constrain: true,
                constrainHeader: false,
                resizable: options.resizable,
                overflowX: 'hidden',
                overflowY: 'auto',
                closable: closable,
                collapsible: options.collapsible,
                draggable: options.draggable,//允许拖放，默认允许
                modal: modal,
                x: x,
                y: y,
                listeners: listeners
            });
            if (x == 0 && y == 0) {
                extWindow.center();
            }
            extWindow.show();
            return extWindow;
        },
        CreateGrid: function (options) {
            /// <summary>
            /// 创建grid表格
            /// </summary>
            ///<param name="options" type="Object">
            ///<para>title：标题，默认无标题</para>
            ///<para>height：高度，默认auto</para>
            ///<para>width：宽度，默认auto</para>
            ///<para>iconCls：图标Class，默认为bserver</para>
            ///<para>el：DOM容器ID</para>
            ///<para>store：表格数据，默认为Ext.create('Ext.data.ArrayStore', {})</para>
            ///<para>columns：表格字段，默认为[{ header: 'World' }]</para>
            ///<para>pager：是否分页，默认为false</para>
            ///<para>toolbar：工具栏，默认为{}</para>
            ///</param>
            options = options || {};
            title = options.title || "";
            height = options.height || 'auto';
            width = options.width || 'auto';
            iconCls = options.iconCls || "";
            el = options.el;
            store = options.store || Ext.create('Ext.data.ArrayStore', {});
            columns = options.columns || [{ header: 'World' }];
            pager = options.pager || false;
            toolbar = options.toolbar || {};
            enable = toolbar.enable || false;
            add = toolbar.add || null;
            update = toolbar.update || null;
            del = toolbar.del || null;
            var listeners = {};
            if (options.listeners && options.listeners instanceof Object) listeners = options.listeners;
            extGrid = Ext.create('Ext.grid.Panel', {
                store: store,
                iconCls: iconCls,
                width: width,
                height: height,
                border: false,
                title: title,
                selModel: Ext.create('Ext.selection.CheckboxModel'),
                columns: columns,
                renderTo: el,
                forceFit: true,
                hideHeaders: options.hideHeaders,
                features: options.features,
                listeners: listeners,
                loadMask:true
                //使用Paging Scroller分页插件  
                //, verticalScroller: 'paginggridscroller' 
                // do not reset the scrollbar when the view refreshs 
                //,invalidateScrollerOnRefresh: false,  
                // infinite scrolling does not support selection  
                //disableSelection: true
            });
            if (pager) {
                extGrid.addDocked({
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    store: store,
                    displayInfo: true
                });
            }
            var tb = Ext.create('Ext.toolbar.Toolbar', {
                xtype: 'toolbar',
                dock: 'top'
            });
            if (add != null) {
                tb.add({
                    xtype: 'button',
                    text: '新增',
                    iconCls: 'badd',
                    grid: extGrid,
                    handler: add
                });
            }
            if (update != null) {
                tb.add({
                    xtype: 'button',
                    text: '修改',
                    iconCls: 'bupdate',
                    grid: extGrid,
                    handler: update
                });
            }
            if (del != null) {
                tb.add({
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'bdel',
                    grid: extGrid,
                    handler: del
                });
            }
            //添加自定义按钮
            if (toolbar.items && toolbar.items instanceof Array) {
                for (var i = 0; i < toolbar.items.length; i++) {
                    toolbar.items[i].grid = extGrid;
                }
                //判断自定义按钮添加的位置，在默认值前面，或者是后面
                if (toolbar.insert) {
                    tb.insert(0, toolbar.items);
                } else {
                    tb.add(toolbar.items);
                }
            }

            if (enable) {
                extGrid.addDocked(tb);
            }
            return extGrid;
        },
        CreateGridNoCheckbox: function (options) {
            /// <summary>
            /// 创建grid表格
            /// </summary>
            ///<param name="options" type="Object">
            ///<para>title：标题，默认无标题</para>
            ///<para>height：高度，默认auto</para>
            ///<para>width：宽度，默认auto</para>
            ///<para>iconCls：图标Class，默认为bserver</para>
            ///<para>el：DOM容器ID</para>
            ///<para>store：表格数据，默认为Ext.create('Ext.data.ArrayStore', {})</para>
            ///<para>columns：表格字段，默认为[{ header: 'World' }]</para>
            ///<para>pager：是否分页，默认为false</para>
            ///<para>toolbar：工具栏，默认为{}</para>
            ///</param>
            options = options || {};
            title = options.title || "";
            height = options.height || 'auto';
            width = options.width || 'auto';
            iconCls = options.iconCls || "";
            el = options.el;
            store = options.store || Ext.create('Ext.data.ArrayStore', {});
            columns = options.columns || [{ header: 'World' }];
            pager = options.pager || false;
            toolbar = options.toolbar || {};
            enable = toolbar.enable || false;
            add = toolbar.add || null;
            update = toolbar.update || null;
            del = toolbar.del || null;
            var listeners = {};
            if (options.listeners && options.listeners instanceof Object) listeners = options.listeners;
            extGrid = Ext.create('Ext.grid.Panel', {
                store: store,
                iconCls: iconCls,
                width: width,
                height: height,
                border: false,
                title: title,
                //selModel: Ext.create('Ext.selection.CheckboxModel'),
                columns: columns,
                renderTo: el,
                forceFit: true,
                hideHeaders: options.hideHeaders,
                features:options.features,
                listeners: listeners
                //, viewConfig: {
                //    loadMask: true,
                //    loadMask: {
                //        msg:'loading...'
                //    }
                //}
                //使用Paging Scroller分页插件  
                //, verticalScroller: 'paginggridscroller' 
                // do not reset the scrollbar when the view refreshs 
                //,invalidateScrollerOnRefresh: false,  
                // infinite scrolling does not support selection  
                //disableSelection: true
            });
            if (pager) {
                extGrid.addDocked({
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    store: store,
                    displayInfo: true
                });
            }
            var tb = Ext.create('Ext.toolbar.Toolbar', {
                xtype: 'toolbar',
                dock: 'top'
            });
            if (add != null) {
                tb.add({
                    xtype: 'button',
                    text: '新增',
                    iconCls: 'badd',
                    grid: extGrid,
                    handler: add
                });
            }
            if (update != null) {
                tb.add({
                    xtype: 'button',
                    text: '修改',
                    iconCls: 'bupdate',
                    grid: extGrid,
                    handler: update
                });
            }
            if (del != null) {
                tb.add({
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'bdel',
                    grid: extGrid,
                    handler: del
                });
            }
            //添加自定义按钮
            if (toolbar.items && toolbar.items instanceof Array) {
                for (var i = 0; i < toolbar.items.length; i++) {
                    toolbar.items[i].grid = extGrid;
                }
                //判断自定义按钮添加的位置，在默认值前面，或者是后面
                if (toolbar.insert) {
                    tb.insert(0, toolbar.items);
                } else {
                    tb.add(toolbar.items);
                }
            }

            if (enable) {
                extGrid.addDocked(tb);
            }
            return extGrid;
        },
        CreateStore: function (options) {
            /// <summary>
            /// 创建grid数据
            /// </summary>
            ///<param name="options" type="Object">
            ///<para>storeId：storeId，默认simpsonsStore</para>
            ///<para>url：请求地址，默认空</para>
            ///<para>model：数据模型，默认空</para>
            ///<para>total：启用分页标识，默认false</para>
            ///<para>pageSize：每页记录数，默认20</para>
            ///</param>
            options = options || {};
            storeId = options.storeId || "simpsonsStore";
            url = options.url || '';
            model = options.model || '';
            total = options.total;
            pageSize = options.pageSize || 20;
            groupField = options.groupField;
            var reader;
            if (total) {
                reader = {
                    type: 'json',
                    root: 'Data',
                    totalProperty: 'TotalRecords'
                };
            } else {
                reader = {
                    type: 'json',
                    root: 'result'
                };
            }
            var store = Ext.create('Ext.data.Store', {
                storeId: storeId,
                model: model,
                //buffered: true,
                //leadingBufferZone: 20,
                pageSize: pageSize,
                proxy: {
                    type: 'ajax',
                    url: url,  //请求的服务器地址
                    reader: reader

                    , simpleSortMode: true
                },
                autoLoad: true,
                remoteGroup: true,
                groupField: groupField,
                listeners: options.listeners || {}
            });
            Ext.apply(store.proxy.extraParams, options.params || {});

            return store;
        },
        CreateForm: function (options) {
            /// <summary>
            /// 创建form面板
            /// </summary>
            ///<param name="options" type="Object">
            ///<para>title：标题</para>
            ///<para>url：请求地址，默认空</para>
            ///<para>clo：是否可以关闭，默认true</para>
            ///<para>frame：蓝色效果，默认true</para>
            ///<para>w：宽度，默认350</para>
            ///<para>fileUp：是否支持上传控件，默认true</para>
            ///<para>buttonstext：按钮文字，默认'提交'</para>
            ///<para>callback：按钮处理方法,默认空方法</para>
            ///</param>
            options = options || {};
            title = options.title || "";
            url = options.url || '';
            layout = options.layout || 'anchor';
            labelWidth = options.labelWidth || 60;
            anchor = options.anchor || '93%';
            clo = options.clo || true;
            frame = true;
            if (typeof (options.frame) != 'undefined' && options.frame!=true) {
                frame = false;
            } 
            buttonAlign = options.buttonAlign || 'center';
            w = options.width || 'auto';
            fileUp = options.fileUp || true;
            buttonstext = options.buttonstext || '提交';
            sub = options.callback || function () { };
            isResetBtn = options.isResetBtn || false;

            var btns = [];
            btns.push({
                text: buttonstext,
                style: {
                    marginRight: '18px'
                },
                handler: sub
            });
            if (isResetBtn) {
                btns.push({
                    text: '重置', handler: function () {
                        formpanel.getForm().reset();
                    }
                })
            };
            var formpanel = new Ext.form.Panel({
                title: title,
                layout: layout,
                bodyPadding: 5,
                style: 'padding-left:8px',
                border: 0,
                width: w,
                close: clo,
                buttonAlign: buttonAlign,
                frame: frame,
                defaults: {
                    anchor: anchor,
                    labelWidth: labelWidth
                },
                url: url,
                fileUpload: options.fileUp,
                buttons: btns
            });

            return formpanel;
        },
        CreateTabPanelFn: function () {
            var fn = {};

            fn.create = function (options) {
                ///<summary>
                /// 返回一个Ext.tan.Panel的对象，
                ///</summary>
                ///<param name="options" type="Object">
                /// 对象参数信息
                ///<para>id:String 控件ID，默认值为 tabpanel_ 加上当前时间</para>
                ///<para>index:Number 当前活动的选项卡编号，从0开始，默认值为0</para>
                ///<para>border:Boolean 是否显示选项卡边框，默认值为 false</para>
                ///<para>items:Array 初始化控件组</para>
                ///<para>listeners:Object 事件侦听对象</para>
                ///</param>
                var id = String.Format("tabpanel_{0}", new Date().getTime());
                var defaults = {
                    id: id,
                    index: 0,
                    border: false,
                    items: [],
                    listeners: {}
                };
                options = options || {};
                Ext.apply(defaults, options);

                var tab = Ext.create('Ext.tab.Panel', {
                    border: defaults.border,
                    activeTab: defaults.index,
                    itemId: defaults.id,
                    layout: 'fit',
                    plugins: [{
                        ptype: 'tabscrollermenu',
                        maxText: 15,
                        pageSize: 5
                    }],
                    items: defaults.items,
                    listeners: defaults.listeners
                });
                return tab;
            };

            /*获取当前的选项容器信息*/
            fn.tab = fn.tab || fn.create();

            fn.add = function (options) {
                ///<summary>
                /// 添加当前选项卡，并激活
                ///</summary>
                ///<param name="options" type="Object">
                /// 选项卡内容
                ///<para>component:Object Ext.component.Component的新实例</para>
                ///<para>title:String 新增Tab标题</para>
                ///<para>closable:Boolean 关闭按钮显示/隐藏标识，设置为True，标识显示。默认设置为True</para>
                ///<para>listeners:Object 新增Tab的侦听事件处理函数</para>
                ///<para>callback:Function 添加完成回调函数，无论是否完成，都将触发此事件</para>
                ///</param>

                var defaults = {
                    component: {},
                    title: 'Tab_' + this.tab.items.length,
                    closable: true,
                    listeners: {},
                    callback: null
                };
                options = options || {};
                Ext.apply(defaults, options);

                this.tab.add({
                    title: defaults.title,
                    border: false,
                    layout: 'fit',
                    closable: defaults.closable,
                    items: [defaults.component],
                    listeners: defaults.listeners
                }).show();
                this.tab.setActiveTab(this.tab.items.length - 1);
                this.tab.onAdded = function () {
                    if (defaults.callback && defaults.callback instanceof Function) {
                        defaults.callback(arguments);
                    }
                }

                return fn;
            };

            return fn;
        },
        CreatePlayPanel: function (options) {
            var defaults = { callback: Ext.emptyFn, height:'100%', width:'100%' };
            Ext.apply(defaults, options);

            return {
                xtype: 'panel',
                //region:'center',
                border: 0,
                html: Ext.util.Format.format('<OBJECT ID="xcameraobject" WIDTH="{1}" HEIGHT="{0}" CLASSID="CLSID:2ACC923B-1125-4EA7-B93A-5F12BB452ED2" events=“true” ></OBJECT>', defaults.height, defaults.width),
                listeners: {
                    'render': function () {
                        var obj = small_active.object;
                        if (obj) {
                            defaults.callback();
                        } else {
                            try{
                                window.location.href = "Resources/Docs/IMOS_ActiveX/Setup.exe";
                            }
                            catch (e) {
                                errorState.show(e.message);
                            }
                        }
                    }
                }
            };
        },
        CameraPlay: function (o) {
            var defaults = { ID: 0, DeviceID: '', IP: '10.162.28.83', Port: 8800, Pwd: 'loadmin', Acct: 'loadmin', Name: '' };
            Ext.apply(defaults, o);

            var width = 640, height = 360;
            var wind = this.CreateWindow({
                title: Ext.util.Format.format('视频播放-{0}', defaults.Name),
                width: width,
                height: height,
                layout: 'fit',
                resizable: false,
                draggable: false
            });

            wind.add(this.CreatePlayPanel({
                callback: function () {
                    ExtHelper.CameraPlayEx(defaults);
                }
            }));
            wind.on('close', function () {
                DoStopPlay();
                DoLogout();
            });
        },
        CameraPlayEx: function (options) {
            var defaults = { ID: 0, DeviceID: '', IP: '10.162.28.83', Port: 8800, Pwd: 'loadmin', Acct: 'loadmin', Name: '' };
            Ext.apply(defaults, options);

            g_UserName = defaults.Acct;
            g_PassWord = defaults.Pwd;
            g_ServerIP = defaults.IP;
            g_ServerPort = defaults.Port;

            if (!defaults.DeviceID)
                return alert('设备不存在.');

            InitActiveX();
            if (DoLogin()) {
                DoStartPlay(defaults.DeviceID);
            }
        },
        ShowResult: function (o) {
            var c = Ext.getCmp('extEast');
            c.removeAll(true);

            if (o)
                c.add(o);

            if (c.collapsed) {
                c.expand();
            }
        }
    };


    var CreateLoadMask = function (options) {    //私有方法
        options = options || {};
        p = options.p || Ext.getBody();
        msg = options.msg || loadState.state1;
        _myMask = new Ext.LoadMask(p, { msg: msg });
        //alert(o.Property);    //调用属性
    };
    return o;
})();

(function ($) {

    var createChart = $.createChart = function (options) {
        var defaults = { url: null, fields: [], displayField: null, valueField: null, callback: Ext.emptyFn, render:Ext.emptyFn };
        Ext.apply(defaults, options);

        var chart = {};

        (function ($$) {

            var store = $$.store = get(defaults);

            $$.chart = new Ext.chart.Chart({
                flex: 1,
                animate: {
                    duration: 250
                },
                store: store,
                shadow: true,
                legend: {
                    position: 'right',
                    update: true
                },
                insetPadding: 20,
                theme: 'Base:gradients',
                series: [{
                    donut: 15,
                    type: 'pie',
                    field: defaults.valueField,
                    showInLegend: true,
                    tips: {
                        trackMouse: true,
                        width: 200,
                        height: 22,
                        renderer: function(storeItem, item) {
                            var total = 0;
                            store.each(function(rec) {
                                total += rec.get(defaults.valueField);
                            });
                            this.setTitle(storeItem.get(defaults.displayField) + ': ' + storeItem.get(defaults.valueField)+'(' + Math.round(storeItem.get(defaults.valueField) / total * 100) + '%)');
                        }
                    },
                    highlight: {
                        segment: {
                            margin: 20
                        }
                    },
                    label: {
                        field: defaults.displayField,
                        display: 'rotate',
                        contrast: true,
                        color:'#fff',
                        font: '10px Arial',
                        renderer: function (a, b, record) {
                            var total = 0;
                            store.each(function (rec) {
                                total += rec.get(defaults.valueField);
                            });
                            return Math.round(record.get(defaults.valueField) / total * 100) + '%';
                        }
                    }
                }]
            });

        })(chart);

        function get(options) {
            var defaults = { url:null, fields: [], callback:Ext.emptyFn };
            Ext.apply(defaults, options);
            
            if (!defaults.fields)
                throw new ReferenceError();

            if (!(defaults.fields instanceof Array))
                throw new TypeError('must be Array');

            if (!defaults.fields.length)
                throw new RangeException('');

            var store = new Ext.data.JsonStore({
                storeId: identityManager.createId(),
                fields: defaults.fields,
                proxy: {
                    type:'ajax',
                    url: defaults.url,
                    reader: {
                        type:'json'
                    }
                },
                listeners: {
                    'load': function (a, b) {
                        if (defaults.callback && defaults.callback instanceof Function) {
                            defaults.callback(b);
                        }
                    }
                }
            });
            return store;
        }

        return chart;
    };

})(ExtHelper);

//String Extension
(function (s) {
    s.Format = function () {
        ///<summary>
        /// 格式化输出字符串
        ///</summary>
        //debugger;
        var me = this;
        var args = arguments;
        if (args.length == 0) return '';
        var str = args[0];
        if (!str) return '';
        if ('string' != typeof str) return '';
        //校验序列从0开始
        if (!/{[0]}/g.test(str)) throw new RangeError();

        str = str.replace(/{(\d+)}/g, function () {
            var index = new Number(arguments[1]);

            if ('undefined' === typeof args[index + 1]) {
                //不存在设置的值，抛出错误
                //throw new RangeError();
                //提示警告信息
                Ext.log(String.Format('args[{0}]', index + 1), String.Format('args[{0}] is undefined', index + 1));
                return '';
            }

            if (args[index + 1] == null) {

                //提示警告信息
                Ext.log(String.Format('args[{0}]', index + 1), String.Format('args[{0}] is null', index + 1));
                return '';
            }
            return args[index + 1].toString();
        });
        return str;
    };
    s.prototype.Format = function () {
        ///<summary>
        /// 格式化输出字符串
        ///</summary>

        var me = this;
        var args = arguments;
        if (arguments.length == 0) return me;
        if (!/{[0]}/g.test(me)) throw new RangeError();
        var str = me.replace(/{(\d+)}/g, function (m, num) {
            var index = new Number(num);
            if ('undefined' === typeof args[index])
                //不存在设置的值，抛出错误
                throw new RangeError();
            return args[index].toString();
        });
        return str;
    };
    s.prototype.ReplaceFormat = function (n, l) {
        /// <summary>用*代替字符串，并保留开头和结尾，长度由传入的值决定</summary>
        /// <param name="n" type="Number">开头和结尾保留原值的长度</param>
        /// <param name="l" type="Number">替换后的字符串长度</param>
        /// <returns type="String" />

        var me = this;
        n = n || 1;
        l = l - n * 2;

        if (typeof n !== 'number')
            throw new TypeError('n must be number');
        if (n < 0)
            throw new RangeError('n must be more then 0');
        if (n > me.length)
            throw new RangeError(String.Format('n must be less then {0}', me.length));
        if (l < 0)
            throw new RangeError('n must be more then 0');

        var start = me.substr(0, n);
        var end = me.substr(me.length - n, n);
        var str = '';
        for (var i = 0; i < l; i++) {
            str += '*';
        }
        return String.Format('{0}{1}{2}', start, str, end);
    };
})(String);

(function ($) {

    $.prototype.format = function (format) //author: meizz
    {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),    //day
            "h+": this.getHours(),   //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
    $.formatTime = function (val) {
        var re = /-?\d+/;
        var m = re.exec(val);
        var d = new Date(parseInt(m[0]) + 0800);
        return d.format("yyyy-MM-dd hh:mm:ss");
    }
    $.formatDate = function (val) {
        var re = /-?\d+/;
        var m = re.exec(val);
        var d = new Date(parseInt(m[0]) + 0800);
        return d.format("yyyy-MM-dd");
    }

})(Date)

//定义自动完成对象
var Autocompletefield = Autocompletefield || {};
(function ($) {

    //原型
    $.fn = $.constructor.prototype;

    $.store = { id: String.Format("store_{0}", new Date().getTime()) };
    $.store.Store = function (options) {
        var defaults = { url: undefined, modelType: undefined};
        Ext.apply(defaults, options);

        if (!defaults.url)
            throw ReferenceError('uri no found.');

        if (!defaults.modelType)
            throw ReferenceError('model no found.');

        var store = ExtHelper.CreateStore({
            storeId: this.id,
            url: defaults.url,
            model: defaults.modelType
        });
        return store;
    };

    $.create = function (options) {
        var defaults = {
            url: undefined, //自动完成数据获取地址
            modelType: undefined,   //自动完成数据模型（名称）
            rendercallback: undefined,   //自动完成数据获取之后，渲染的回调方法，需要自定义此方法来渲染呈现的数据
            emptyHtml: '',    //空数据时显示的内容
            displayField: undefined,
            valueField: undefined,
            fieldLabel: '',
            name: '',
            id:String.Format('combo_{0}', new Date().getTime()),
            typeAhead: true,
            hideLabel: false,
            hideTrigger: true,
            allowBlank:true,
            minChars: 1,    //定义输入最少输入多少个字符的时候获取数据 
            value:''
        };
        Ext.apply(defaults, options);

        if (!defaults.displayField) {
            throw ReferenceError('displayField no found.');
        }

        if (!defaults.valueField) {
            throw ReferenceError('valueField no found.');
        }

        var field = {};
        field.model = defaults.modelType;
        field.store = this.store.Store({ url: defaults.url, modelType: defaults.modelType });
        field.field = {
            xtype: 'combo',
            store: field.store,
            displayField: defaults.displayField,
            valueField: defaults.valueField,
            fieldLabel: defaults.fieldLabel,
            name: defaults.name,
            id: defaults.id,
            typeAhead: defaults.typeAhead,
            hideLabel: defaults.hideLabel,
            hideTrigger: defaults.hideTrigger,
            minChars: defaults.minChars,
            listConfig: {
                emptyText: defaults.emptyHtml,
                getInnerTpl: defaults.rendercallback   //自定义展示内容
            },
            value: defaults.value,
            allowBlank: defaults.allowBlank
        };
        return field.field;
    };

})(Autocompletefield);

var populationType = populationType || {};
(function ($) {

    var colors = {/*@ 常口*/ck: '#0000FF', /*@ 暂口*/zak: '#008000', /*@ 境外人员*/jw: '#FF6600', /*@ 重点人口*/zhk: '#FF0000', def: '#AEAEAE' };

    var tips = {/*@ 常口*/ck: '常住人口', /*@ 暂口*/zak: '暂住人口', /*@ 境外人员*/jw: '境外人员', /*@ 重点人口*/zhk: '重点人口', def: '其他' };

    var types = { /*@ 常口*/ck: 1, /*@ 暂口*/zak: 2, /*@ 境外人员*/jw: 3, /*@ 重点人口*/zhk: 4 };

    var block = { /*@ 显示块宽度*/width: 20, /*@ 显示快高度*/height: 13 };

    var show = $.show = function (type, n) {
        var html = '';
        switch (type) {
            case types.ck:
                html = String.Format('<div style="width:{0}px; height:{1}px; background-color:{2}; float:left;" title="{3}">{3}</div><span style="font-size:11px; color:#15498b;">{4}</span>',
                    block.width, block.height, colors.ck, n || '', n ? '' : tips.ck);
                break;
            case types.zak:
                html = String.Format('<div style="width:{0}px; height:{1}px; background-color:{2}; float:left;" title="{3}">{3}</div><span style="font-size:11px; color:#15498b;">{4}</span>',
                    block.width, block.height, colors.zak, n || '', n ? '' : tips.zak);
                break;
            case types.jw:
                html = String.Format('<div style="width:{0}px; height:{1}px; background-color:{2}; float:left;" title="{3}">{3}</div><span style="font-size:11px; color:#15498b;">{4}</span>',
                    block.width, block.height, colors.jw, n || '', n ? '' : tips.jw);
                break;
            case types.zhk:
                html = String.Format('<div style="width:{0}px; height:{1}px; background-color:{2}; float:left;" title="{3}">{3}</div><span style="font-size:11px; color:#15498b;">{4}</span>',
                    block.width, block.height, colors.zhk, n || '', n ? '' : tips.zhk);
                break;
            default:
                html = String.Format('<div style="width:{0}px; height:{1}px; background-color:{2}; float:left;" title="{3}">{3}</div><span style="font-size:11px; color:#15498b;">{4}</span>',
                    block.width, block.height, colors.def, n || '', n ? '' : tips.def);
                break;
        }
        return html;
    };

})(populationType);