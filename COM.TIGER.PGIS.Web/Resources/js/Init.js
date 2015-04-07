/// <reference path="maskLoad.js" />
/// <reference path="common.js" />
/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="Utils.js" />
/// <reference path="qForm.js" />
/// <reference path="MapHelper.js" />
/// <reference path="Business.js" />
/// <reference path="Config.js" />
/// <reference path="Menu.js" />
/// <reference path="menuHandler.js" />
/// <reference path="maptheme.js" />

//@当前登录用户
var x_current_user = null;

var ManageCenterMenu = Ext.create("Ext.menu.Menu", {
    id: "ManageCenterMenu",
    style: 'text-align:left;',
    items: [
        {
            text: "参数管理",
            style: 'color:#000000',
            key: "Param",
            handler: onItemClick
        }, {
            text: "辖区管理",
            style: 'color:#000000',
            key: "Area",
            handler: onItemClick
        }, '-', {
            text: "菜单信息管理",
            style: 'color:#000000',
            key: "Menu",
            handler: onItemClick
        }, {
            text: "角色信息管理",
            style: 'color:#000000',
            key: "Role",
            handler: onItemClick
        }, {
            text: "组织机构管理",
            style: 'color:#000000',
            key: "Department",
            handler: onItemClick
        }, {
            text: "用户信息管理",
            style: 'color:#000000',
            key: "User",
            handler: onItemClick
        }
    ]
});

/*加载工具菜单*/
var toolCenterMenu = new Ext.menu.Menu({
    id: "toolCenterMenu",
    style: 'text-align:left;',
    items: [
        {
            text: "工具箱",
            code: 6,
            enableToggle: true,
            style: 'color:#000000',
            checked: true,
            checkHandler: onItemToggle
        }, {
            text: "滑杆缩放",
            code: 4,
            enableToggle: true,
            style: 'color:#000000',
            checked: true,
            checkHandler: onItemToggle
        }, {
            text: "鹰眼地图",
            code: 3,
            enableToggle: true,
            style: 'color:#000000',
            checked: false,
            checkHandler: onItemToggle
        }, {
            text: "状态栏",
            code: 8,
            enableToggle: true,
            style: 'color:#000000',
            checked: true,
            checkHandler: onItemToggle
        }, {
            text: "地图全屏",
            code: "fullscr",
            enableToggle: true,
            style: 'color:#000000',
            checked: false,
            checkHandler: onItemToggle
        }
    ],
    listeners: {
        mouseout: function (obj, e, itm) {
            if (!e.getRelatedTarget().contains(e.getTarget()) && !obj.getEl().contains(e.getRelatedTarget())) obj.hide();
            else if (e.getRelatedTarget().contains(obj.getEl().dom)) obj.hide();
        }
    }
});

var CreateViewport = function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        id: 'viewport',
        items: [{
            region: 'north',
            id: 'extNorth',
            contentEl: 'topDiv',
            xtype: "panel",
            autoHeight: true,
            border: false,
            margins: '0 0 0 0',
            dockedItems: [{
                id: 'menuToolbar',
                xtype: 'toolbar',
                enableOverflow: true,
                dock: 'bottom'
            }]
        }, {
            //title: '左侧导航',
            region: 'west',
            header: false,
            collapsible: true,
            id: 'extWest',
            split: true,
            xtype: 'panel',
            layout: 'fit',
            width: westWidth,
            autoScroll: true
        }, {
            region: 'east',
            id: 'extEast',
            collapsible: true,
            collapsed: true,
            title: '查询结果',
            xtype: 'panel',
            width: eastWidth,
            autoScroll: true,
            layout: 'fit'
        }, {
            region: 'center',
            id: 'extCenter',
            tbar: {
                xtype: 'toolbar',
                height: 25,
                enableOverflow: true,
                items: [{
                    //text: '工具栏',
                    iconCls: 'bbookmark'
                }, '->', {
                    text: '鹰眼',
                    handler: onItemToggle,
                    code: 'yingyan',
                    iconCls: 'beye'
                }, {
                    text: '清除',
                    handler: onItemToggle,
                    code: 'qingchu',
                    iconCls: 'bclear'
                }, {
                    text: '放大',
                    handler: onItemToggle,
                    code: 'fangda',
                    iconCls: 'bzoomin'
                }, {
                    text: '缩小',
                    handler: onItemToggle,
                    code: 'suoxiao',
                    iconCls: 'bzoomout'
                }, {
                    text: '全图',
                    handler: onItemToggle,
                    code: 'quantu',
                    iconCls: 'bworld'
                }, {
                    text: '测距',
                    handler: onItemToggle,
                    code: 'ceju',
                    iconCls: 'bpath'
                }, {
                    text: '标签',
                    xtype: 'button',
                    enableToggle: true,
                    allowDepress: true,
                    handler: onItemToggle,
                    code: 'biaoqian',
                    iconCls: 'bflag'
                }, {
                    text: '刷新',
                    iconCls: 'brefresh',
                    key: "item-refresh",
                    handler: onItemClick
                }]
            },
            contentEl: 'mapLayer',
            listeners: {
                resize: function (p, w, h) {//debugger;
                    if (typeof (vEdushiMap) != 'undefined') {
                        w = (w <= 0 ? 0 : w);
                        h = (h <= 0 ? 0 : h);
                        vEdushiMap.MapWidth(w);
                        vEdushiMap.MapHeight(h - 25);
                    }
                }
            }
        }, {
            region: 'south',
            id: 'extSouth',
            style: { 'text-align': 'center' },
            bodyStyle: 'padding:5px 0px 0px 0px;',
            collapsible: false,          //不允许折叠
            contentEl: 'bottomDiv',
            split: false,
            height: 30,
            minHeight: 30
        }]
    });

    Ext.getCmp('extWest').add({
        layout: 'border',
        border: false,
        items: [{
            region: 'north',
            xtype: 'panel',
            frame:false,
            border: 0,
            style:'padding:5px 5px 0px 5px;background:#fff;',
            layout: 'fit',
            height: userinfoHeight,
            items: [{
                xtype: 'fieldset',
                title: '<b>系统信息</b>',
                id: 'cUserinfo',
                layout: 'fit'
            }],
            title: '系统信息',
            header: false,
            collapsible: true,
            split: true
        }, {
            title: '搜索面板',
            region: 'center',
            xtype: 'panel',
            id: 'cQueryCondition',
            overflowX: 'hidden',
            overflowY: 'auto',
            border: 0,
            layout:'fit'
        }, {
            region: 'south',
            xtype: 'tabpanel',
            id: 'cMapTool',
            layout: 'fit',
            header: false,
            activeTab: 0,
            collapsible: true,
            split: true,
            autoScroll: true,
            height:maptoolHeight,
            border: 0
        }]
    });    

    var eyePanel = Ext.create("Ext.Panel", {
        //title: '鹰眼地图',
        iconCls: 'beye',
        id: 'eyePanelID',
        collapsible: true,
        collapsed: true,
        width: eyeWidth,
        height: eyeHeight,
        renderTo: "mapeyePanel",
        contentEl: 'eyemap'
    });
};
Ext.onReady(function () {
    CreateViewport();
    InitMap();
    //InitMenu();
    InitArea();
    InitPatrolArea();
    getUserInfo(function () {
        var interval = setInterval(function () {
            if(typeof syQueryFn !== "undefined")
            {
                clearInterval(interval);
                syQueryFn();
            }
        }, 500);
    });
    EMap.ChangeLayer();
});

/// <summary>
/// 工具菜单点击事件事件
/// </summary>
/// <param name="item">单个菜单项</param>
/// <param name="pressed">按钮状态</param>
function onItemToggle(item, pressed) {
    //debugger;
    if (item.code == 'biaoqian') {
        EMap.ViewLabel(pressed);
    } else if (item.code == 'qingchu') {
        EMap.Clear();
        if (typeof $maptheme !== 'undefined' && $maptheme) {
            $maptheme.Dispose();
        }
    } else if (item.code == 'ceju') {
        EMap.Scale();
    } else if (item.code == 'fangda') {
        EMap.ZoomOut();
    } else if (item.code == 'suoxiao') {
        EMap.ZoomIn();
    } else if (item.code == 'quantu') {
        EMap.FullMap();
    } else if (item.code == 'yingyan') {
        EMap.EyeMap();
    }
};
/// <summary>
/// 后台菜单的事件
/// </summary>
/// <param name="item">单个菜单项</param>
function onItemClick(item, d, p) {
    switch (item.key) {
        case "Param":
            paramFn();
            break;
        case "User":
            userFn();
            break;
        case "Area":
            areaFn();
            break;
        case "Role":
            roleFn();
            break;
        case "Department":
            departmentFn();
            break;
        case "Menu":
            menuFn();
            break;
        case "item-refresh":
            location.href = location.href.replace("#", "");
            break;
        case "item-exit":
            Ext.Msg.show({
                title: '系统提示?',
                msg: '确定退出系统?',
                buttonText: { yes: '退出系统', no: '切换用户', cancel: '取消' },
                buttons: Ext.Msg.YESNOCANCEL,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case "yes":
                            window.close();
                            break;
                        case "no":
                            var a = window.location.href;
                            var b = "";
                            b = a.substring(0, a.lastIndexOf('/', a.length));
                            window.location.href = b + "/login.aspx";
                            break;
                        case "cancel":
                            break;
                    }
                },
                animEl: 'elId',
                icon: Ext.MessageBox.QUESTION
            });
            break;
        default:
            Ext.menu.MenuMgr.hideAll();
            break;
    }
};
function OtherMenu() {
    //Ext.getCmp("menuToolbar").add(
    //        {
    //            text: '维护中心',
    //            menu: ManageCenterMenu,
    //            iconCls: 'bcog'
    //        },'-');
    Ext.getCmp("menuToolbar").add(
             '->', {
                 text: '安全退出',
                 key: "item-exit",
                 iconCls: 'bquit',
                 handler: onItemClick
             });
}
function InitMenu() {
    var url = 'Sys/MenuHelp.ashx?req=1' + '&id=' + x_current_user.ID;
    var myMask = new Ext.LoadMask(Ext.getBody(), { msg: "菜单加载中,请稍后..." });
    myMask.show();
    Ext.Ajax.request({
        url: url,
        success: function (response) {
            if (response.responseText != "") {
                //debugger;
                var d = Ext.decode(response.responseText);
                var toolbar = eval(d.result);
                for (var i = 0; i < toolbar.length; i++) {
                    Ext.getCmp("menuToolbar").add(toolbar[i]);
                }
            } else {
                Ext.Msg.alert("系统提示：", "加载菜单出现异常!");
            }
            OtherMenu();
            myMask.hide();
        },
        failure: function () {
            OtherMenu();
            myMask.hide();
            Ext.Msg.alert("系统提示：", "服务器未响应!");
        }
    });
};
//初始化辖区
function InitArea() {
    areaFn('cMapTool');
}
function InitPatrolArea() {
    PatrolAreaFn('cMapTool');
}

function getUserInfo(c) {
    ///<summary>
    /// @获取当前用户信息用户信息
    ///</summary>

    var defaults = { p: 'cUserinfo', msg: '正在获取用户信息...' };
    var mask = maskGenerate.start(defaults);
    Ext.Ajax.request({
        url: 'Sys/UserHandler.ashx?req=',
        success: function (response) {

            //判定用户是否登陆:
            //  如果用户登录显示用户信息
            //  如果用户未登录，显示登录框
            //
            response = Ext.apply({}, response, responseDefault);
            var data = Ext.decode(response.responseText);
            if (data.result.state) {
                c();
                showInfomation({
                    component: {
                        xtype: 'panel',
                        border: 0,
                        html: displayAt(data)
                    }
                });
            } else {
                showInfomation({
                    component: {
                        xtype: 'panel',
                        border: 0,
                        html: '<div style="height:40px; line-height:40px; text-align:center;"><span>获取用户信息失败,</span><span class="a" onclick="getUserInfo()">点击重新获取</span></div>'
                    }
                });
                //Ext.Msg.alert("系统提示：", "获取用户信息失败。");
            }
            mask.stop();
        },
        failure: function () {
            mask.stop();
            //Ext.Msg.alert("系统提示：", "服务器未响应！");
            showInfomation({
                component: {
                    xtype: 'panel',
                    border: 0,
                    html: '<div style="height:40px; line-height:40px; text-align:center;"><span>服务器未响应,</span><span class="a" onclick="getUserInfo()">点击重新获取</span></div>'
                }
            });
        }
    });

    function showInfomation(options) {
        var defaults = { component: null };
        Ext.apply(defaults, options);

        if (defaults.component) {
            var cUser = Ext.getCmp("cUserinfo");
            cUser.items.clear();
            cUser.add(defaults.component);
        }
    }

    function displayAt(data) {
        var defaults = {
            //用户信息
            ID: 0, Code: null, UserName: null, Password: null, Name: null, DepartmentID: 0, Gender: 0, Lvl: 0, Disabled: 0, CPassword: null, DepartmentName: null, OfficerID: 0,
            //组织机构信息
            Department: { ID: 0, PID: 0, Code: null, Name: null, Remarks: null, ChildDepartments: [], text: null },
            //警员信息
            Officer: { ID: 0, Num: null, Name: null, IdentityID: null, Tel: null }
        };
        Ext.apply(defaults, data.result.result);
        x_current_user = defaults;
        InitMenu();

        var now = new Date();
        var html = '';
        html += '<div style="height:24px; line-height:24px;">' + defaults.Name + '，' + String.Format("{0}", now.getHours() > 12 ? "下" : "上") + '午好！</div>';
        html += '<div style="height:24px; line-height:24px;">现在是：' + now.toLocaleString() + '</div>';
        return html;
    }
}