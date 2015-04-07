<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MapTool.aspx.cs" Inherits="COM.TIGER.PGIS.Web.MapTool" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>桐梓县三维警务地理信息系统</title>
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <link href="Resources/js/extjs4.2/resources/css/ext-all.css" rel="stylesheet" />
    <link href="Resources/css/Default.css" rel="stylesheet" />
    <link href="Resources/css/ExtShare.css" rel="stylesheet" />
    <link href="Resources/js/extjs4.2/ux/css/TabScrollerMenu.css" rel="stylesheet" />
    <script type="text/javascript" src="Resources/js/extjs4.2/bootstrap.js"></script>
    <script type="text/javascript" src="Resources/js/extjs4.2/locale/ext-lang-zh_CN.js"></script> 
    <script type="text/javascript" src="Resources/js/Config.js"></script>
    <script type="text/javascript" src="Resources/js/MapTool.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div style="position:absolute;left:10px;top:20px">
        <span id="addbtn" style=" display:inline-block;padding:3px 5px; background:#fff; color:#000; border-radius:5px; margin-right:5px; cursor:pointer;">单位添加</span>
        <span id="addmonitorbtn" style=" display:inline-block;padding:3px 5px; background:#fff; color:#000; border-radius:5px; margin-right:5px; cursor:pointer;">卡口添加</span>
        <span id="listbtn" style=" display:inline-block;padding:3px 5px; background:#fff; color:#000; border-radius:5px; cursor:pointer;">列表</span>
    </div>
    <div id="maplayer"></div>
    <div id="form" style="margin:200px auto; width:420px"></div>
<%--    <div id="grid"></div>--%>
    </form>
</body>
</html>
