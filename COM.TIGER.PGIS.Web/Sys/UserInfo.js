/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Init.js" />

var userHandler = userHandler || {};
(function ($) {

    var basic_url = 'Sys/UserHandler.ashx?req=';

    //@ 密码处理程序
    (function (me) {
        var oldpasswordid = identityManager.createId();
        var newpasswordid = identityManager.createId();
        var confirmpasswordid = identityManager.createId();

        var form = me.form = ExtHelper.CreateForm({
            callback: submit
        });
        form.add({
            xtype: 'textfield',
            fieldLabel: '旧密码',
            //emptyText: '请输入登陆密码',
            name: 'oldpassword',
            id: oldpasswordid,
            inputType: 'password',
            allowBlank: false,
            regex: /^[a-zA-Z0-9]{1}[a-zA-Z0-9_]{5,}$/ //@验证数据，以字母，数字或者下划线组合，以字母或者数字开头
        }, {
            xtype: 'textfield',
            fieldLabel: '新密码',
            //emptyText: '请输入登陆密码',
            name: 'newpassword',
            id: newpasswordid,
            inputType: 'password',
            allowBlank: false,
            regex: /^[a-zA-Z0-9]{1}[a-zA-Z0-9_]{5,}$/ //@验证数据，以字母，数字或者下划线组合，以字母或者数字开头
        }, {
            xtype: 'textfield',
            fieldLabel: '确认密码',
            //emptyText: '请输入登陆密码',
            name: 'confirmpassword',
            id: confirmpasswordid,
            inputType: 'password',
            allowBlank: false,
            regex: /^[a-zA-Z0-9]{1}[a-zA-Z0-9_]{5,}$/ //@验证数据，以字母，数字或者下划线组合，以字母或者数字开头
        });

        me.Show = function () {
            var wind = ExtHelper.CreateWindow({ title: '修改用户密码', width:300, height:162 });
            wind.add(me.form);
        };

        function submit() {
            var form = this.up('form');
            var oldpassword = form.getComponent(oldpasswordid).getValue();
            var newpassword = form.getComponent(newpasswordid).getValue();
            var confirmpassword = form.getComponent(confirmpasswordid).getValue();
            var win = form.up('window');
            form = form.getForm();
            if (form.isValid()) {
                if (x_current_user.Password != oldpassword) {
                    errorState.show('旧密码错误。');
                    form.reset();
                    return;
                }

                if (newpassword != confirmpassword) {
                    errorState.show('新密码和确认密码不一致。');
                    form.reset();
                    return;
                }

                startMask();
                form.submit({
                    url: String.Format('{0}changepwd', basic_url),
                    params: {
                        id: x_current_user.ID,
                        pwd:confirmpassword
                    },
                    success: function (form, action) {
                        stopMask();
                        var response = Ext.JSON.decode(action.response.responseText);
                        if (response.success) {
                            win.close();
                            errorState.show('修改密码成功。');
                            location.href = 'Login.aspx';
                        }
                    },
                    failure: function (form, action) {
                        stopMask();
                        errorState.show('修改密码失败。');
                    }
                });
            }
        }

    })($.password = $.password || {});

    //@ 用户资料
    (function (me) {

        var user_defaults = {
            //用户信息
            ID: 0, Code: null, UserName: null, Password: null, Name: null, DepartmentID: 0, Gender: 0, Lvl: 0, Disabled: 0, CPassword: null, DepartmentName: null, OfficerID: 0,
            //组织机构信息
            Department: { ID: 0, PID: 0, Code: null, Name: null, Remarks: null, ChildDepartments: [], text: null },
            //警员信息
            Officer: { ID: 0, Num: null, Name: null, IdentityID: null, Tel: null }
        };

        //@ 标识用户资料是否发生改变；True表示发生改变。该字段仅在【保存】按钮被点击触发时才能起作用
        var isDirty = false;

        //@ 
        me.Show = function () {
            //var xy = Ext.getCmp('extWest').getXY();
            var wind = ExtHelper.CreateWindow({ title: '用户资料卡...', width: 430, height: 270, layout: 'fit' });
            var form = new Ext.form.Panel({
                layout: 'fit',
                border: 0,
                items: [getForm({
                    callback: function () {
                        wind.close();
                    },
                    savecallback: function (btn) {
                        submit(btn, wind);
                    }
                })]
            });
            wind.add(form);
        };

        //获取用户资料卡
        function getForm(options) {
            var defaults = { callback: Ext.emptyFn, savecallback:Ext.emptyFn ,labelWidth:60 };
            Ext.apply(defaults, options);
            //获取当前登录的用户信息
            var user = Ext.apply({}, x_current_user, user_defaults);

            //用户资料卡
            return {
                xtype: 'panel',
                layout: 'fit',
                border: 0,
                items: [{
                    layout: 'fit',
                    bodyPadding: 8,
                    border:0,
                    items: [{
                        xtype: 'fieldset',
                        border:0,
                        bodyPadding: 10,
                        defaults: {
                            anchor: '100%',
                            labelWidth:defaults.labelWidth
                        },
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: '用户姓名',
                            allowBlank: false,
                            name:'Name',
                            value: user.Name,
                            listeners: {
                                'change': function () {
                                    changeCallback();
                                }
                            }
                        },{
                            xtype: 'textfield',
                            fieldLabel: '身份证',
                            name: 'IdentityID',
                            value: user.Officer ? user.Officer.IdentityID : '未知',
                            allowBlank: false,
                            listeners: {
                                'change': function () {
                                    changeCallback();
                                }
                            }
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '电话',
                            name: 'Tel',
                            value: user.Officer ? user.Officer.Tel : '未知',
                            allowBlank: false,
                            listeners: {
                                'change': function () {
                                    changeCallback();
                                }
                            }
                        }, {
                            xtype: 'combobox',
                            fieldLabel: '用户性别',
                            name: 'Gender',
                            store: genderItems,
                            queryMode: 'local',
                            displayField: 'd',
                            valueField: 'v',
                            emptyText: '请选择',
                            forceSelection: true,// 必须选择一个选项
                            blankText: '请选择',
                            triggerAction: 'all',// 显示所有下列数据，一定要设置属性triggerAction为all
                            selectOnFocus: true,
                            allowBlank: false,
                            value: user.Gender,
                            listeners: {
                                'change': function () {
                                    changeCallback();
                                }
                            }
                        }, {
                            xtype: 'label',
                            html: String.Format('<div style="margin-top:10px;"><div style="width:{0}px; float:left;">警号:</div>&nbsp;{1}</div>', defaults.labelWidth, user.Officer ? user.Officer.Num : '未知')
                        }, {
                            xtype: 'label',
                            html: String.Format('<div style="margin-top:10px;"><div style="width:{0}px; float:left;">组织机构:</div>&nbsp;{1}</div>', defaults.labelWidth, user.DepartmentName)
                        }, {
                            xtype: 'label',
                            html: String.Format('<div style="margin-top:10px;"><div style="width:{0}px; float:left;">登陆账户:</div>&nbsp;{1}</div>', defaults.labelWidth, user.UserName)
                        }]
                    }]
                }],
                bbar: ['->', {
                    xtype: 'button',
                    iconCls:'bsave',
                    text: '保 存',
                    handler: function () {
                        defaults.savecallback(this);
                    }
                },'-', {
                    xtype: 'button',
                    text: '离 开',
                    iconCls: 'bquit',
                    handler: function () {
                        defaults.callback(this);
                    }
                }]
            };
        }

        //@ 数据发生改变，回调此方法
        function changeCallback() {
            isDirty = true;
        }

        function submit(btn, w) {
            if (!isDirty) {
                w.close();
                return;
            }

            var form = btn.up('form').getForm();
            if (form.isValid()) {
                startMask({ msg: '正在保存数据...', p: w.getId() });
                form.submit({
                    url: String.Format('{0}updata', basic_url),
                    success: function (form, action) {
                        stopMask();
                        w.close();
                        var response = Ext.JSON.decode(action.response.responseText);
                        if (response.success) {
                            errorState.show('保存数据成功');
                            getUserInfo();
                        } else {
                            errorState.show('保存数据失败');
                        }
                    },
                    failure: function (form, action) {
                        stopMask();
                        errorState.show('保存数据失败');
                        w.close();
                    }
                });
            }
        }

    })($.info = $.info || {});

    function startMask(options) {
        var defaults = { p: Ext.getBody(), msg: '正在修改...' };
        Ext.apply(defaults, options);
        maskHandler.mask.Show(defaults);
    }

    function stopMask() {
        maskHandler.mask.Hide();
    }

})(userHandler);