<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="test.aspx.cs" Inherits="COM.TIGER.PGIS.Web.test" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>测试页面</title>
    <link href="Resources/js/extjs4.2/resources/css/ext-all.css" rel="stylesheet" />
    <link href="Resources/css/Default.css" rel="stylesheet" />
    <script type="text/javascript" src="Resources/js/extjs4.2/bootstrap.js"></script>
    <script type="text/javascript" src="Resources/js/extjs4.2/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript">
        Ext.create('Ext.form.Panel', {
            title: 'Basic Form',
            renderTo: Ext.getBody(),
            bodyPadding: 5,
            width: 350,
            url: 'save-form.php',
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Field',
                name: 'theField'
            }],
            buttons: [{
                text: 'Submit',
                handler: function () {
                    // The getForm() method returns the Ext.form.Basic instance:
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        // Submit the Ajax request and handle the response
                        form.submit({
                            success: function (form, action) {
                                Ext.Msg.alert('Success', action.result.message);
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                            }
                        });
                    }
                }
            }]
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div id="aa" runat="server">
    
    </div>
    </form>
</body>
</html>
