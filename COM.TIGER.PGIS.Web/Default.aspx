<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="COM.TIGER.PGIS.Web.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <title>桐梓县三维警务地理信息系统</title>
    <link href="Resources/js/extjs4.2/resources/css/ext-all.css" rel="stylesheet" />
    <link href="Resources/css/Default.css" rel="stylesheet" />
    <link href="Resources/css/common.css" rel="stylesheet" />
    <link href="Resources/css/ExtShare.css" rel="stylesheet" />
    <link href="Resources/css/CustomDef.css" rel="stylesheet" />
    <link href="Resources/js/extjs4.2/ux/css/TabScrollerMenu.css" rel="stylesheet" />
    <script type="text/javascript" src="Resources/js/extjs4.2/bootstrap.js"></script>
    <script type="text/javascript" src="Resources/js/extjs4.2/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="Resources/js/maskLoad.js"></script>
    <script type="text/javascript" src="Resources/js/Config.js"></script>
    <script type="text/javascript" src="Resources/js/Init.js"></script>

</head>
<body>
    <form id="form1" runat="server">

        <div id="topDiv" class="x-hide-display">
            <object data="Resources/images/20140916.swf" type="application/x-shockwave-flash" width="100%" height="80">
                <param name="movie" value="Resources/images/20140916.swf" />
                <param name="wmode" value="transparent" />
                <embed style="WIDTH: 100%; HEIGHT: 80px" src="Resources/images/20140916.swf" type="application/octet-stream" quality="high" wmode="transparent" menu="false"></embed>
            </object>
        </div>
        <div id="mapLayer" class="x-hide-display">
            <div id="map"></div>
            <!--鹰眼控件载体-->
            <div id="mapeyePanel">
            </div>
            <div id="eyemap"></div>

            <div id="btf" style="position: absolute; right: 0px; top: 0px; z-index: 9998;">
                <div style="background: url(Resources/images/1-1.gif); cursor: pointer; width: 22px; height: 61px;"
                    title="三维图" id="3d">
                </div>
                <div style="background: url(Resources/images/2.gif); cursor: pointer; width: 22px; height: 61px;"
                    title="卫星图" id="wx">
                </div>
                <div style="background: url(Resources/images/3.gif); cursor: pointer; width: 22px; height: 61px;"
                    title="二维图" id="2d">
                </div>
            </div>

        </div>
        <div id="editwindow"></div>
        <div id="bottomDiv" class="x-hide-display">桐梓县公安局 &copy; 2014</div>
    </form>
    <object classid="CLSID:067A4418-EBAC-4394-BFBE-8C533BA6503A" id="small_active" events="true" height="0" width="0"></object>
    <!--ActiveX控件事件, 初始化完成后会触发, 告知界面当前的播放器ID-->
    <script type="text/javascript" for= "Play_Frame1" event="eventDblClick()"></script>
    <script type="text/javascript" for= "Play_Frame1" event="eventClickFrame()"></script>
    <script type="text/javascript" for= "h3c_IMOS_ActiveX" event="eventClickFrame(ulFrameNum,  pcFrameInfo)">
        if(typeof dealEventClickFrame == "function"){
            dealEventClickFrame(ulFrameNum,  pcFrameInfo);
        }
    </script>
    <script type="text/javascript" for= "h3c_IMOS_ActiveX" event=" eventPostRunInfo(ulRunInfoType, strRunInfo)">
         if(8 == ulRunInfoType){
            g_PlayFrame1.PLAYFM_Invalidate();
        }     
    </script>
</body>
</html>
