/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/MapHelper.js" />
/// <reference path="../Resources/js/maskLoad.js" />

var patroltrackManger = patroltrackManger || {};
(function ($) {

    //@private param

    //@basic uri
    var url = 'PatrolTrack/PatrolTrackHelp.ashx?req=';
    //@selection trackid
    var panelid = identityManager.createId();
    var leftid = identityManager.createId();
    var rightid = identityManager.createId();
    //图元线条ID
    var lineid = identityManager.createId();
    //图元设备ID
    var camreid = identityManager.createId('camreid');
    //监控设备图片位置
    var imgpath = '../Resources/images/';
    var trackid = -1;
    var selectionrowindex = -1;
    //选中的设备信息
    var selectiondevices = [];
    //标识是否路线信息发生变更，True标识发生变更
    var isdirty = false;
    //临时放置默认的巡逻路线
    var temptrackdevices = [];
    //ToUp Or ToLower evnents callback
    var toUpOrToLowerEventsCallback = Ext.emptyFn;

    //@public

    //@prototype
    $.fn = $.constructor.prototype;

    //@model
    $.model = { namespace: 'model' };

    //@model patroltrack
    $.model.Track = { type: identityManager.createId($.model.namespace) };
    $.model.Track.model = function () {
        var model = Ext.define($.model.Track.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'SettedTime' },
                { name: 'UpdatedTime' }
            ]
        });
        $.model.Track.defaults = { ID: 0, Name: null, SettedTime: null, UpdatedTime: null };
        return model;
    }();

    //@model monitordevice
    $.model.Device = { type: identityManager.createId($.model.namespace) };
    $.model.Device.model = function () {
        var model = Ext.define($.model.Device.type, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Name' },
                { name: 'Num' },
                { name: 'DeviceID' },
                { name: 'AddressID' },
                { name: 'DeviceTypeID' },
                { name: 'DeviceTypeName' },
                { name: 'DoTypeID' },
                { name: 'DoTypeName' },
                { name: 'IP' },
                { name: 'Port' },
                { name: 'Acct' },
                { name: 'Pwd' },
                { name: 'X' },
                { name: 'Y' },
                { name: 'Address' },
                { name: 'AdministrativeID' },
                { name: 'AdministrativeName' },
                { name: 'AddressContext' }
            ]
        });
        $.model.Device.defaults = {
            ID: 0, Name: null, Num: null, DeviceID: 0, AddressID: 0, DeviceTypeID: 0, DeviceTypeName: null, DoTypeID: 0, DoTypeName: null, IP: null, Port: 0, Acct: null, Pwd: null, X: 0, Y: 0,
            Address: {}, AdministrativeID: 0, AdministrativeName: null, AddressContext: null
        };
        return model;
    }();

    //@store
    $.store = {};
    $.store.Store = function (options) {
        var defaults = { req: null, model:null, total:false, size:15, id: identityManager.createId(), loadedcallback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var store = ExtHelper.CreateStore({
            storeId: defaults.id,
            url: String.Format("{0}{1}", url, defaults.req),
            model: defaults.model,
            total: defaults.total,
            pageSize:defaults.size
        });
        store.on('load', defaults.loadedcallback || Ext.emptyFn);
        return store;
    };

    //@store patroltrack
    $.store.Track = {};
    $.store.Track.store = $.store.Store({ req: 'track', model: $.model.Track.type, total: true });

    //@grid
    $.grid = {};
    
    //@grid patroltrack
    $.grid.Track = {};
    $.grid.Track.click = trackClickCallback;
    $.grid.Track.columns = function () {
        var columns = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'ID', text: '路线标识', flex: 1, sortable: false, hidden: true },
            {
                dataIndex: 'Name', text: '路线', flex: 1, renderer: function (value, obj, record) {
                    var data = record.getData();
                    return String.Format('<span onclick="patroltrackManger.grid.Track.click(\'{0}\')">{1}</span>', data.ID, data.Name);
                }
            },
            {
                dataIndex: 'SettedTime', text: '设置时间', sortable: false, hidden: true, renderer: function (value, obj, record) {
                    return value;
                }
            },
            {
                dataIndex: 'UpdatedTime', text: '更新时间', sortable: false, hidden: true, renderer: function (value, obj, record) {
                    return value;
                }
            }
        ];
        return columns;
    }();
    $.grid.Track.grid = function () {
        $.store.Track.store.on('load', trackstoreLoadCallback);
        var grid = ExtHelper.CreateGrid({
            columns: $.grid.Track.columns,
            store: $.store.Track.store,
            height:368,
            pager: true,
            toolbar: { enable: true, add: trackAddCallback, update: trackUpdateCallback, del: trackDelCallback }
        });

        return grid;
    }();

    //@grid device
    $.grid.Device = {};
    $.grid.Device.Columns = function (options) {
        var defaults = { actionbar: false, saveaction:false };
        Ext.apply(defaults, options);

        var c = [
            { xtype: 'rownumberer', width: 30, sortable: false, text: '序' },
            { dataIndex: 'Name', text: '设备名称', flex: 1, sortable: false, hidden: false },
            { dataIndex: 'Num', text: '设备编号', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'DeviceID', text: '设备ID', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'DeviceTypeName', text: '设备类型', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'DoTypeName', text: '设备用途', flex: 1, sortable: false, hidden: true },
            {
                dataIndex: 'IP', text: 'IP/PORT', flex: 2, sortable: false, hidden: true, renderer: function (value, obj, record) {
                    var data = record.getData();
                    return String.Format("{0} / {1}", data.IP, data.Port);
                }
            },
            { dataIndex: 'Acct', text: '登陆账户', flex: 1, sortable: false, hidden: true },
            { dataIndex: 'Pwd', text: '登陆密码', flex: 1, sortable: false, hidden: true }
        ];
        if (defaults.actionbar) {
            c.push({
                dataIndex: 'ID', text: '操作', width: 60, sortable: false, hidden: false, renderer: function (value, obj, record, rowindex) {
                    if (!selectiondevices.length) {
                        getTrackDevices();
                    }
                    var val = record.get("ID");
                    if (rowindex == 0) {
                        return String.Format('<div class="a" style="font-size:10px;" onclick="patroltrackManger.grid.Device.ToLower(\'{0}\', {1})">下移</div>', val, defaults.saveaction);
                    }

                    if (rowindex == selectiondevices.length - 1) {
                        return String.Format('<div class="a" style="font-size:10px;" onclick="patroltrackManger.grid.Device.ToUp(\'{0}\', {1})">上移</div>', val, defaults.saveaction);
                    }

                    return String.Format('<span class="a" style="font-size:10px;" onclick="patroltrackManger.grid.Device.ToUp(\'{0}\', {1})">上移</span><span style="margin-left:5px; font-size:10px;" class="a" onclick="patroltrackManger.grid.Device.ToLower(\'{0}\', {1})">下移</span>', val, defaults.saveaction);
                }
            });
        }
        return c;
    };
    $.grid.Device.columns = function () {
        return $.grid.Device.Columns({ actionbar: true,saveaction:true });
    }();
    $.grid.Device.Grid = function (options) {
        var me = this;
        var defaults = { req: 'trackdevice', trackid: 0 };
        Ext.apply(defaults, options);

        var store = me.store = $.store.Store({
            req: String.Format('{0}&trackid={1}', defaults.req, defaults.trackid), model: $.model.Device.type, total: false, loadedcallback: function () {
                isdirty = false;
                temptrackdevices = [];
            }
        });
        var grid = me.grid =  ExtHelper.CreateGridNoCheckbox({
            //title: '巡逻线路设备信息...',
            store: store,
            columns: me.columns,
            pager: false,
            toolbar: {
                enable: true, items: [{
                    xtype: 'button',
                    text: '追加路径信息',
                    iconCls: 'badd',
                    handler: deviceTrackUpdateCallback
                },{
                    xtype: 'button',
                    text: '显示地图轨迹',
                    iconCls: 'bwebcam',
                    handler: deviceDrawTrackCallback
                }]
            }
        });
        return grid;
    };

    $.grid.Device.ToUp = function (id, saveaction) {
        if (!isdirty) {
            temptrackdevices = selectiondevices.concat([]);
            isdirty = true;
        }
        var index = selectiondevices.IndexOf(function (e) {
            return e.ID == id;
        });
        var temp = selectiondevices[index];
        selectiondevices[index] = selectiondevices[index - 1];
        selectiondevices[index - 1] = temp;

        if (saveaction) {
            saveNewTrackDevices({
                callback: function () {

                }
            });
        }

        $.grid.Device.store.loadData(selectiondevices);
        drawGlyph();
    };

    $.grid.Device.ToLower = function (id, saveaction) {
        if (!isdirty) {
            temptrackdevices = selectiondevices.concat([]);
            isdirty = true;
        }
        var index = selectiondevices.IndexOf(function (e) {
            return e.ID == id;
        });
        var temp = selectiondevices[index];
        selectiondevices[index] = selectiondevices[index + 1];
        selectiondevices[index + 1] = temp;

        if (saveaction) {
            saveNewTrackDevices({
                callback: function () {

                }
            });
        }

        $.grid.Device.store.loadData(selectiondevices);
        drawGlyph();
    };

    //@form
    $.form = {};

    //@form track
    $.form.Track = {};
    $.form.Track.Form = function (options) {
        var defaults = { req: '', data: null };
        Ext.apply(defaults, options);

        var form = ExtHelper.CreateForm({
            url: String.Format('{0}{1}', url, defaults.req),
            callback: trackSubmitCallback
        });
        
        form.add({
            xtype: 'hiddenfield',
            fieldLabel: 'id',
            name: 'ID'
        }, {
            xtype: 'textfield',
            fieldLabel: '线路',
            name: 'Name',
            allowBlank: false
        });

        if (defaults.data) {
            form.loadRecord(defaults.data);
        }

        return form;
    };
    $.form.Track.Show = function (options) {
        var me = this;
        var defaults = { req: '', data: null, title: '编辑电子巡逻路线信息' };
        Ext.apply(defaults, options);

        var wind = ExtHelper.CreateWindow({ title: defaults.title, width: 400, height: 108 });
        var form = me.Form(defaults);
        wind.add(form);

        $.window.window.hide();
        wind.on('close', function () {
            $.window.window.show();
        });

        return wind;
    };

    //@window
    $.window = {};
    $.window.Show = function () {
        var me = this;

        var win = me.window = ExtHelper.CreateWindow({
            title: '电子巡逻路线管理...',
            layout:'fit'
        });
        win.on('close', function () {
            me.window = null;
        });
        win.add({
            //xtype: 'viewport',
            layout: 'border',
            border: 0,
            id: panelid,
            items: [{
                xtype: 'panel',
                border: 0,
                layout: 'fit',
                id: leftid,
                region: 'center'
            }, {
                xtype: 'panel',
                border: 1,
                id: rightid,
                region: 'east',
                width: 0,
                layout: 'fit'

            }]
        });
        
        var panel = win.getComponent(panelid);
        var leftpanel = panel.getComponent(leftid);
        var rightpanel = panel.getComponent(rightid);
        var grid = $.grid.Track.grid;
        grid.on('select', function (eOpts, record, index) {
            selectionrowindex = index;
            var data = record.getData();
            selectiondevices = [];
            trackid = data.ID;
            rightpanel.items.clear();
            var g = $.grid.Device.Grid({ trackid: data.ID });
            rightpanel.add(g);
            //创建右边栏，并显示
            rightpanel.setWidth(335);
        });
        grid.on('deselect', function (eOpts, record, index) {
            if (selectionrowindex != index) {
                return;
            }
            //移除右边栏
            hideRightPanel();
        });
        leftpanel.add(grid);
    };

    //@private function

    //@store device loadcallback
    function deviceLoadCallback(obj, records, eOpts) {

    }

    //@track name clickcallback
    function trackClickCallback(id) {

    }

    //@form track action

    //add
    function trackAddCallback() {
        $.form.Track.Show({
            req: 'add',
            title: '添加新的巡逻线路...'
        });
    }
    //update
    function trackUpdateCallback(grid) {
        var rows = grid.grid.getSelectionModel().getSelection();
        if (rows.length == 0) {
            errorState.show(errorState.SelectRow);
            return;
        }
        if (rows.length > 1) {
            errorState.show(errorState.SelectOnlyRow);
            return;
        }
        $.form.Track.Show({
            req: 'upd',
            title: '更改巡逻线路...',
            data: rows[0]
        });
    }
    //del
    function trackDelCallback(grid) {
        deleteActionCallback({
            grid: grid,
            req: 'del',
            callback: function () {
                $.store.Track.store.load();
            }
        });
    }
    //form submit
    function trackSubmitCallback() {
        var me = this;
        submitActionCallback({
            form: me,
            callback: function () {
                $.store.Track.store.load();
            }
        });
    }

    //@form device action

    function deviceTrackUpdateCallback(grid) {
        showDevicesTree({ title: '追加路径信息...', req: 'alldevice' });
    }
    //draw track line
    function deviceDrawTrackCallback(grid) {
        getTrackDevices();
        drawGlyph();
        var grid = ExtHelper.CreateGridNoCheckbox({
            store: $.grid.Device.store,
            columns: $.grid.Device.Columns({actionbar:true}),
            pager: false,
            toolbar: {
                enable: true, items: ['显示地图轨迹', '-', '->', {
                    xtype: 'button',
                    text: '确  定',
                    iconCls: 'bsave',
                    handler: function () {
                        if (temptrackdevices.length > 0) {
                            var mask = maskGenerate.start({ p: win.getId(), msg: '正在保存，请稍等 ...' });
                            saveNewTrackDevices({
                                callback: function (f) {

                                    mask.stop();

                                    if (f)
                                        win.close();
                                }
                            });
                        } else {
                            isdirty = false;
                            win.close();
                        }
                    }
                }]
            }
        });
        var win = getGlypghWindow({ title: '显示地图轨迹...' });
        win.add(grid);
    }
    //form submit
    function deviceSubmitCallback() { }
    //patroltrack store loaded callback function
    function trackstoreLoadCallback() {
        hideRightPanel();
    }

    //@common
    function submitActionCallback(options) {
        var defaults = { /*Ext.form.Panel*/form: null, /*Function*/callback: null };
        Ext.apply(defaults, options);

        var form = defaults.form.up('form');
        var wind = form.up('window');
        form = form.getForm();
        if (form.isValid()) {
            form.submit({
                success: function (form, action) {
                    if (action.result.success) {
                        wind.close();
                        defaults.callback();
                    } else {
                        Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                    }
                },
                failure: function (form, action) {
                    Ext.Msg.alert(errorState.SysPrompt, action.result ? action.result.message : errorState.SubmitFail);
                }
            });
        }
    }

    function deleteActionCallback(options) {
        var defaults = {/*Ext.grid.Panel*/grid: null, /*String*/req: '', /*Function*/callback: null };
        Ext.apply(defaults, options);

        var rows = defaults.grid.grid.getSelectionModel().getSelection();
        if (rows.length == 0) {
            errorState.show(errorState.SelectRow);
            return;
        }

        errorState.confirmYes(String.Format("确定删除这 {0} 条记录吗?", rows.length), function () {
            var ids = [];
            Ext.Array.each(rows, function (record) {
                var id = record.get('ID');
                if (id) {
                    ids.push(id);
                }
            });
            Ext.Ajax.request({
                url: String.Format("{0}{1}", url, defaults.req),
                method: "POST",
                params: { ids: ids.join(',') }, //发送的参数  
                success: function (response, option) {
                    response = Ext.JSON.decode(response.responseText);
                    if (response.success == true) {
                        if (response.result && response.result > 0) {
                            //提交成功，触发回调函数
                            defaults.callback();
                        } else {
                            Ext.MessageBox.alert(errorState.SysPrompt, errorState.DeleteFail);
                        }
                    }
                    else { Ext.MessageBox.alert(errorState.SysPrompt, response.msg); }
                },
                failure: function () { Ext.Msg.alert(errorState.SysPrompt, errorState.DeleteFail); }
            });
        });
    }

    function hideRightPanel() {
        selectionrowindex = -1;
        trackid = -1;
        var panel = $.window.window.getComponent(panelid).getComponent(rightid);
        panel.setWidth(0);
        panel.items.clear();
    }

    function showDevicesTree(options) {
        var defaults = { title: '巡逻路线设备信息...', req: '' };
        Ext.apply(defaults, options);

        var tree = getDeviceTree({
            req: defaults.req, callback: function () {
                win.close();
            }
        });

        var win = getGlypghWindow({ title: defaults.title });
        win.add(tree);
    }

    function getGlypghWindow(options) {
        var defaults = { title: '' };
        Ext.apply(defaults, options);

        var querypanel = Ext.getCmp('extWest');
        var win = ExtHelper.CreateWindow({
            title: defaults.title, width: 0, height: 0, modal: false, draggable: false, layout: 'fit',
            listeners: {
                show: {
                    fn: function () {
                        $.window.window.hide();
                        temptrackdevices = [];
                    }
                },
                close: {
                    fn: function () {
                        $.window.window.show();
                        EMap.Clear();
                        if (temptrackdevices.length > 0) {
                            $.grid.Device.store.loadData(temptrackdevices);
                        }
                    }
                }
            }
        });
        var xy = querypanel.getXY();
        win.animate({
            to: { width: querypanel.getWidth() + 5, height: querypanel.getHeight(), x: xy[0], y: xy[1] }
        });
        return win;
    }

    function getDeviceTree(options) {
        var defaults = { req: '', roottext:'监控设备信息', callback:Ext.emptyFn };
        Ext.apply(defaults, options);
        //获取当前路线的设备信息
        var deviceids = getTrackDevices();

        var store = new Ext.data.TreeStore({
            proxy: {
                type: 'ajax',
                url:String.Format('{0}{1}', url, defaults.req)
            },
            loadMask: true,
            autoLoad: true,
            listeners: {
                append: {
                    fn: function (parent, node, eOpts) {
                        if (parent && deviceids.FindIndex(node.raw.ID) >= 0) {
                            node.set('checked', true);
                            node.data.checked = true;
                        }
                    }
                },
                load: {
                    fn: function () {
                        drawGlyph();
                    }
                }
            }
        });

        var treeid = identityManager.createId();
        var tree = new MyApp.lib.Tree({
            model: $.model.Device.type,
            store: store,
            border: false,
            id:treeid,
            rootVisible: false,
            checkModel: 'cascade',
            requestMethod: 'post',
            animate: false,
            viewConfig: {
                loadMask: true
            },
            tbar: [{
                xtype: 'trigger',
                triggerCls: 'x-form-search-trigger',
                onTriggerClick: function () {
                    var me = this;
                    var value = me.getRawValue();
                    if (value) {
                        Ext.getCmp(treeid).filterByText(value);
                    } else {
                        Ext.getCmp(treeid).clearFilter();
                    }
                },
                width: 100,
                emptyText: '快速检索设备',
                enableKeyEvents: true,
                listeners: {
                    'keyup': function (field, e) {
                        var me = this;
                        if (Ext.EventObject.ENTER == e.getKey()) {
                            var value = me.getRawValue();
                            if (value) {
                                Ext.getCmp(treeid).filterByText(value);
                            } else {
                                Ext.getCmp(treeid).clearFilter();
                            }
                        }
                    },
                    'blur': function () {
                        var me = this;
                        if (!me.getRawValue()) {
                            Ext.getCmp(treeid).clearFilter();
                        }
                    }
                }
            }, '->', {
                xtype: 'button',
                text: '保 存',
                iconCls: 'bsave',
                handler: function () {
                    saveNewTrackDevices({
                        callback: defaults.callback
                    });
                }
            }],
            listeners: {
                checkchange: {
                    fn: function (record, checked, eOpts) {
                        var data = record.raw;
                        if (checked) {
                            selectiondevices.push(data);
                        } else {
                            var index = selectiondevices.IndexOf(function (e) {
                                return e.ID == data.ID;
                            });
                            selectiondevices[index] = null;
                        }
                        //重新绘图
                        drawGlyph();
                    }
                }
            },
            root: { text: defaults.roottext }
        });
        return tree;
    }

    //初始化选定设备组，并添加当前已经选定的设备组，返回当前选定设备ID组
    function getTrackDevices() {
        var store = $.grid.Device.store;
        var records = store.data.items;
        var datas = [];
        selectiondevices = [];
        records.Each(function (record) {
            var data = record.getData();
            selectiondevices.push(data);
            datas.push(data.ID);
        });
        return datas;
    }

    //获取选定设备的ID组
    function getSelectDeviceIDS() {
        var ids = [];
        selectiondevices.Each(function (e) {
            if (e) {
                ids.push(e.ID);
            }
        });
        return ids;
    }

    //绘制图元
    function drawGlyph() {
        EMap.Clear();
        var tickcount = 0;
        var coords = [];
        selectiondevices.Each(function (e) {
            if (e) {
                coords.push(e.X);
                coords.push(e.Y);
                var html = String.Format('<div style="width:32px; text-align:center;"><img style="width:32px;height:32px;" src="{0}camera.png"  title="{1}" ></img><div style="height:16px; width:16px; line-height:16px; font-size:13px; background-color:#fff;">{2}</div></div>', imgpath, e.Name, ++tickcount);
                EMap.AppendEntity(String.Format('{0}{1}', camreid, e.ID), { x: e.X, y: e.Y, exX: 16, exY: 16 }, { html: html, callback: Ext.emptyFn, args: e });
            }
        });
        if (coords.length > 0) {
            //绘制线条
            EMap.DrawLine(lineid, { coords: coords, color: '#ff0000' });
        }
        //selectiondevices.Each(function (e, index) {
        //    if (e) {
        //        var html = String.Format('<div style="width:32px; text-align:center;"><img style="width:32px;height:32px;" src="{0}camera.png"  title="{1}" ></img><div style="height:16px; width:16px; line-height:16px; font-size:13px; background-color:#fff;">{2}</div></div>', imgpath, e.Name, ++tickcount);
        //        EMap.AppendEntity(String.Format('{0}{1}', camreid, e.ID), { x: e.X, y: e.Y, exX: 16, exY: 16 }, { html: html, callback: Ext.emptyFn, args: e });
        //    }
        //});
    }

    //保存新的巡逻路线信息
    function saveNewTrackDevices(options) {
        var defaults = { callback: Ext.emptyFn };
        Ext.apply(defaults, options);

        var ids = getSelectDeviceIDS();
        Ext.Ajax.request({
            url: String.Format("{0}savedevice", url),
            method: "POST",
            params: { ids: ids.join(','), id: trackid }, //发送的参数  
            success: function (response, option) {
                response = Ext.JSON.decode(response.responseText);
                if (response.success == true) {
                    if (response.result && response.result > 0) {
                        $.grid.Device.store.load();
                        defaults.callback(true);
                    } else {
                        defaults.callback(false);
                        Ext.MessageBox.alert(errorState.SysPrompt, errorState.SubmitFail);
                    }
                }
                else {
                    defaults.callback(false);
                    Ext.MessageBox.alert(errorState.SysPrompt, response.msg);
                }
            },
            failure: function () {
                defaults.callback(false);
                Ext.Msg.alert(errorState.SysPrompt, errorState.SubmitFail);
            }
        });
    }

})(patroltrackManger);