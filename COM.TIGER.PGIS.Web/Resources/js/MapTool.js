
/// <reference path="extjs4.2/ext-all-dev.js" />
/// <reference path="MapHelper.js" />
/// <reference path="Config.js" />

var addFlag = true;
var cFlag = true;

//EXT准备完成
Ext.onReady(function () {
    view();
    loadMap();
});

function view() {
    ///<summary>
    /// 创建左面布局
    ///</summary>

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        //border: false,
        id: 'containerbody',
        items: [{
            id: 'extCenter',
            region: 'center',
            //layout: 'fit',
            contentEl: 'maplayer',
            listeners: {
                resize: function (p, w, h) {
                    if (typeof (vEdushiMap) != 'undefined') {
                        w = (w <= 0 ? 0 : w);
                        h = (h <= 0 ? 0 : h);
                        vEdushiMap.MapWidth(w);
                        vEdushiMap.MapHeight(h);
                    }
                }
            }
        }]
    });
}

function loadMap() {
    ///<summary>
    /// 加载地图数据
    ///</summary>

    var w = Ext.fly('extCenter').getWidth();
    var work = Ext.create('ENetwork');
    var url = mapConfig.Url + "?mapid=maplayer&city=" + mapConfig.City + "&w=" + w + "&x=" + mapConfig.CenterX + "&y=" + mapConfig.CenterY + "&eye=false&s=" + mapConfig.Layer;
    work.DownloadScript(url, function () {
        if (typeof (vEdushiMap) != 'undefined') {
            vEdushiMap.LoadModule('PointerTip', function () {})
            initMapGDI(loadControl);
            loadCSS('Resources/css/MapIcon.css');
        }
    })
}

function loadControl() {
    ///<summary>
    /// 加载其他的空间信息
    ///</summary>
    var type;//添加坐标的类型 0：单位 1：卡口
    
    Ext.get('addbtn').on('click', function () {
        if (addFlag) {
            type = 0;
            addFlag = false;
            cFlag = true;
            addHandler(type, "单位");
            Ext.get('addbtn').setHTML("取消");
            vEdushiMap.PointerTip.Show('<div style="background-color:White; font-size:12px;padding:2px 3px;">鼠标左键点击需要添加单位的楼房！</div>', 1, 1);
            Ext.get('addmonitorbtn').setHTML("卡口添加");
        }
        else {
            
            Ext.get('addbtn').setHTML("单位添加");
            mapGDI.StopCoords();
            
            addFlag = true;
            cFlag = false;
            Ext.getDom('form').innerHTML = "";
            //Ext.getDom('form').isDisabled = false;
            vEdushiMap.PointerTip.Hide();
        }
    });

    Ext.get('addmonitorbtn').on('click', function () { 
        if (addFlag == true) {
            type = 1;
            addFlag = false;
            addHandler(type, "卡口");
            Ext.get('addmonitorbtn').setHTML("取消");
            vEdushiMap.PointerTip.Show('<div style="background-color:White; font-size:12px;padding:2px 3px;">鼠标左键在地图上取点！</div>', 1, 1);
            Ext.get('addbtn').setHTML("单位添加");
        }
        else {
            //
            Ext.get('addmonitorbtn').setHTML("卡口添加");
            mapGDI.StopCoords();
            addFlag = true;
            Ext.getDom('form').innerHTML = "";
            vEdushiMap.PointerTip.Hide();
            //Ext.getDom('form').isDisabled = false;
        }
    });

    Ext.get('listbtn').on('click', function () {
        type = 0;
        listHandler(type, "单位");
    });
}

function addHandler(type, name) {
    ///<summary>
    /// 添加按钮处理程序
    ///</summary>
    var coord = "";
    if (type == 0) {
        
            vEdushiMap.Zoom(1);
            vEdushiMap.attachEvent(AlaMap.KeyWord.EventName.SpotClick, function (spot) {
                //Ext.getCmp("extEast").expand(true);

                //alert(spot.Cx + ',' + spot.Cy);
                //alert(cFlag);
                
                if (cFlag) {
                    createForm(spot.Cx, spot.Cy, type, name);
                }
            });
        
        return;
    }
    //取点
    mapGDI.GetSingle(function (o, coords) {
        createForm(coords[0], coords[1],type,name);
    });
   
}

function createForm(x,y,type,name) {
    Ext.getDom('form').innerHTML = "";
    //创建表单
    var form = new Ext.form.FormPanel({
        title: '添加坐标',
        defaultType: 'textfield',
        url: 'ToolHelp/ToolHandler.ashx?req=add',
        frame: true,
        width: 420,
        height: 200,
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 50
        },
        items: [{
            fieldLabel: '坐标',
            value: x+','+y,
            disabled: true
        }, {
            xtype: 'hiddenfield',
            fieldlable: 'x',
            name: 'X',
            value: x
        }, {
            xtype: 'hiddenfield',
            fieldlable: 'y',
            name: 'Y',
            value: y
        },
        {
            fieldLabel: name,
            name: 'Name',
            width: 360
        },
        {
            fieldLabel: '电话',
            name: 'Telephone',
            width: 360
        },
        {
            fieldLabel: '备注',
            name: 'Description',
            width: 360
        },
        {
            fieldLabel: '类型',
            width: 360,
            value: type,
            name: 'Type',
            xtype: 'hiddenfield'
        }],
        buttons: [{
            text: '确定',
            handler: function () {
                var f = this.up('form');
                form.getForm().submit({
                    success: function (form, action) {
                        if (action.result.success) {
                            if (!f) {
                                Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitSuccess);
                            }
                        } else {
                            if (!f) {
                                Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                            }
                        }
                        f.close();
                        if (type == 1) {
                            mapGDI.GetSingle(function (o, coords) {
                                createForm(coords[0], coords[1], type, name);
                            });
                        }
                    },
                    failure: function (form, action) {
                        Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                    }
                });
            }
        },
    {
        text: '取消',
        handler: function () {
            
            var f = this.up('form');
            f.close();
            Ext.get('addbtn').setHTML("单位添加");
            Ext.get('addmonitorbtn').setHTML("卡口添加");
            addFlag = true;
            cFlag = false;
            vEdushiMap.PointerTip.Hide();
        }
    }]
    }, true);
    form.render("form");
}

function listHandler(type,name) {
    //<summary>
    // 列表按钮处理程序
    //</summary>
    var tabID = 'tabscrollermenu';
    Ext.define("Com.tigerhz.Pgis.CompanyMark", {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'Name' },
            { name: 'X' },
            { name: 'Y' },
            { name: 'Telephone' },
            { name: 'Description' },
            { name: 'Type' }
        ]
    });
    var p = {
        store: function () {
            var s = ExtHelper.CreateStore({
                url: 'ToolHelp/ToolHandler.ashx?req='+type,
                model: 'Com.tigerhz.Pgis.CompanyMark',
                total: true
            });
            return s;
        }(),
        win: function () {
            var w = 600;
            var h = 400;
            
            var win = ExtHelper.CreateWindow({ title: name+"列表", width: w, height: h });
            return win;
        }()
    };

    var o = {
        columns: [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            {
                dataIndex: 'Name', text: name+'名称', flex: 2
            },
            { dataIndex: 'X', text: '横坐标', flex: 1 },
            { dataIndex: 'Y', text: '纵坐标', flex: 1 },
            { dataIndex: 'Telephone', text: '电话', flex: 1 },
            { dataIndex: 'Description', text: '备注信息', flex: 1 },
            { dataIndex: 'Type', text: '类型', flex: 1,hidden:true}
        ],
        createGrid: function (options) {
            var d = { store: null, title: '单位标注列表', close: false };
            options = Ext.apply({}, options, d);
            var s = options.store || p.store;
            var t = options.title || "单位标注列表";
            var g = ExtHelper.CreateGrid({
                store: s,
                columns: this.columns,
                pager: true,
                toolbar: {
                    items: [
                        {
                            xtype: 'button',
                            text: '单位',
                            handler: function () {
                                p.win.close();
                                
                                listHandler(0,"单位");
                            }
                        },
                        '-',
                        {
                            xtype: 'button',
                            text: '卡口',
                            handler: function () {
                                p.win.close();
                                
                                listHandler(1,"卡口");
                            }
                        }
                    ],
                    enable: true,
                    del: this.del
                }
            });
            return g;
        },
        createRootGrid: function () {
            var me = this;
            p.win.add(me.createGrid());
        },
        del: function (o) {
            var r = o.grid.getSelectionModel().getSelection();
            if (r.length == 0) {
                Ext.Msg.alert(errorState.SysPrompt, errorState.SelectRow);
            } else {
                Ext.Msg.confirm(errorState.SysPrompt, "确定删除这" + r.length + "条记录吗?",
                    function (btn) {
                        if (btn == "yes") {
                            var ids = [];
                            Ext.Array.each(r, function (record) {
                                var id = record.get('ID');
                                if (id) {
                                    ids.push(id);
                                }
                            });
                            Ext.Ajax.request({
                                url: 'ToolHelp/ToolHandler.ashx?req=del',
                                method: "POST",
                                params: { ids: ids.join(',') }, //发送的参数  
                                success: function (response, option) {
                                    response = Ext.JSON.decode(response.responseText);
                                    if (response.success == true) {
                                        if (response.result && response.result > 0) {
                                            Ext.MessageBox.alert(errorState.SysPrompt, errorState.DeleteSuccess);
                                            o.grid.store.load();
                                        } else {
                                            Ext.MessageBox.alert(errorState.SysPrompt, errorState.DeleteFail);
                                        }
                                    }
                                    else { Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }
                                },
                                failure: function () { Ext.Msg.alert(errorState.SysPrompt, errorState.DeleteFail); }
                            });
                        }
                    })
            }
        }
    };
    o.createRootGrid();
    return o;
}