/// <reference path="maskLoad.js" />
/// <reference path="extjs4.2/ext-all-dev.js" />



(function () {

    Ext.onReady(function () {

        //在此校验浏览器和版本信息
        checkBrowser();

        Ext.create('Ext.form.Panel', {
            bodyPadding: 17,
            width: 350,
            layout: 'anchor',
            border: 0,
            defaults: {
                anchor: '100%',
                labelWidth: 55,
                regex: /^[a-zA-Z0-9]{1}[a-zA-Z0-9_]{5,}$/ //@验证数据，以字母，数字或者下划线组合，以字母或者数字开头
            },
            buttonAlign: 'center',
            items: [{
                xtype: 'textfield',
                fieldLabel: '登陆账户',
                name: 'username',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: '登陆密码',
                name: 'password',
                inputType: 'password',
                allowBlank: false
            }],
            buttons: [{
                xtype: 'button',
                text: '登 陆',
                handler: submit
            }, {
                xtype: 'button',
                text: '重 置',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            }],
            renderTo: 'formcontent'
        });
    });

    function checkBrowser(cb) {
        cb = cb || Ext.emptyFn;

        if (!isIE()) {
            tip('平台仅支持IE浏览器.', cb);
            return false;
        }

        if (!checkVersion()) {
            tip('平台仅支持IE8，或者以上版本.点击<a style="font-weight:700" href="Resources/Docs/IE8-WindowsXP-x86-CHS.2728888507.exe">&nbsp;此处&nbsp;</a>下载新的IE8补丁', cb);
            return false;
        }

        return true;
    }

    function checkVersion() {
        if (Ext.isIE6 /*|| Ext.isIE7 || Ext.isIE7m || Ext.isIE7p*/)
            return false;

        var versionArr = navigator.appVersion.split(';')[1]
            .replace(/[ ]/g, '')
            .replace(/(\w{4})(\w{1})(.*?)/g, '$1-$2-$3')
            .split('-');
        var version = parseInt(versionArr[1]);
        if (version < 7)
            return false;

        return true;
    }

    function isIE() {
        if (Ext.isIE)
            return true;

        if (navigator.appName && navigator.appName == 'Microsoft Internet Explorer')
            return true;

        var version = navigator.appVersion.split(';')[1].replace(/[ ]/g, '');
        if (/MSIE/g.test(version))
            return true;

        return false;
    }

    //@表单提交方法
    function submit() {
        if (!checkBrowser(function () {
            window.close();
        })) {
            return false;
        }

        var form = this.up('form').getForm();
        if (form.isValid()) {
            startMask();
            form.submit({
                clientValidation: true,
                url: 'Login.aspx?req=login',
                success: function (form, action) {
                    var response = Ext.JSON.decode(action.response.responseText);
                    if (response.result.statue) {
                        location.href = 'Default.aspx';
                    } else {
                        stopMask();
                        tip(response.result.msg);
                    }
                },
                failure: function (form, action) {
                    stopMask();
                    tip('异常，系统登陆失败。');
                }
            });
        }
    }

    //@提示框
    function tip(msg, cb) {
        //return Ext.MessageBox.alert({
        //    title: '系统提示:',
        //    icon: Ext.MessageBox.INFO,
        //    buttons: Ext.MessageBox.OK,
        //    msg: msg,
        //    animate: true,
        //    closable: false
        //}, msg, function () {
        //    debugger;
        //});
        Ext.MessageBox.alert("系统提示", msg, cb || Ext.emptyFn);

    }

    function startMask() {
        var defaults = { p: 'wrapper', msg: '正在登陆...' };
        maskHandler.mask.Show(defaults);
    }

    function stopMask() {
        maskHandler.mask.Hide();
    }

})();