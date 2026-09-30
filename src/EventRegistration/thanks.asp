<!--#include file="SFLib/db.conn.open.asp"-->
<!--#include file="SFLib/ADOVBS.inc"-->
<!--#include file="SFLib/incGeneral.asp"-->
<%
'@BEGINVERSIONINFO

'@APPVERSION: 50.3007.0.1

'@FILENAME: thanks.asp
 


'@DESCRIPTION: Popup Confirmation Page

'@STARTCOPYRIGHT
'The contents of this file is protected under the United States
'copyright laws and is confidential and proprietary to
'LaGarde, Incorporated.  Its use or disclosure in whole or in part without the
'expressed written permission of LaGarde, Incorporated is expressly prohibited.
'
'(c) Copyright 2000, 2001 by LaGarde, Incorporated.  All rights reserved.
'@ENDCOPYRIGHT

'@ENDVERSIONINFO

Dim sHas, sProdName, iQuantity, sProdUnit, sProdMessage, sResponseMessage
'sSearchPath = Request.ServerVariables("HTTP_REFERER")

sProdName = Request.QueryString("sProdName")
iQuantity = Request.QueryString("iQuantity")
sProdUnit = Request.QueryString("sProdUnit")
sProdMessage = Request.QueryString("sProdMessage")
sResponseMessage = Request.QueryString("sResponseMessage")

If Request.Cookies("sfThanks")("PreviousAction") <> "" Then
	Response.Cookies("sfThanks").Expires = Now()
End If

' For Safety
'If sSearchPath = "" Or instr(1,sSearchPath,"login.asp",1) Then
'	sSearchPath = "search.asp"
'End If	

closeObj(cnn)	
%>
<SCRIPT language="javascript">
function linkCorrect() {
	if (window.document.links.length > 1) {
		for (i=0;i<window.document.links.length;i++) {
			if (window.document.links[i].href != "javascript:window.close()") {
				temp = window.document.links[i].href
				window.document.links[i].href = "javascript:openParent('" + temp + "')"
			}
		}
	}
}
function openParent(sHref) {
	window.opener.location = sHref;
	window.close();
}
</SCRIPT>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Order Item Confirmation</title>
<meta name="GENERATOR" content="Microsoft FrontPage 5.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>

<!--#include file="sfLib/incDesign.asp"-->
<body bgcolor="#F4ECE1"  link="<%= C_LINK %>" vlink="<%= C_VLINK %>" alink="<%= C_ALINK %>" onLoad="javascript:linkCorrect()">

<table border="0" cellpadding="1" cellspacing="0" bgcolor="<%= C_BORDERCOLOR1 %>" width="100%" align="center">
  <tr>
    <td>
      <table width="100%" border="0" cellspacing="1" cellpadding="3">
        <tr>
          <td align="middle"  bgcolor="<%= C_BGCOLOR1 %>"><b><font face="<%= C_FONTFACE1 %>" color="<%= C_FONTCOLOR1 %>" SIZE="<%= C_FONTSIZE1 %>">The Shop at the Barn</font></b></td>
    
        </tr>
        <tr>
          <td background="<%= C_BKGRND4 %>" bgcolor="<%= C_BGCOLOR4 %>">
            <%if iQuantity=0 then%>
            <hr noshade color="#000000" size="1" width="90%">
            <p align="center"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 + 2 %>"><b>We're Sorry!</b></font><br>
            <font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>">
            <b><%= sResponseMessage %></b></font>
            <br>
            <%else%>
            <hr noshade color="#000000" size="1" width="90%">
            <p align="center"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 + 2 %>"><b>Thank You!</b></font><br>
            
            <font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>"><b><%= iQuantity %> &nbsp; <%= sProdUnit %> 
            <%= sProdName %> <b><%= sResponseMessage %></b></font>
            <p align="center">
            <font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>"><b><%= sProdMessage %></font><br>
            
            <%end if%>
            <br>
	        <b><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4+1 %>"><a href="javascript:window.close()">Close</a></font>
            <hr noshade color="#000000" size="1" width="90%">
            </b></b>
	        </td>        
            </tr>
            <tr>
              <td background="<%= C_BKGRND7 %>" bgcolor="<%= C_BGCOLOR7 %>"><p align="center"><b><font face="<%= C_FONTFACE7 %>" color="<%= C_FONTCOLOR7 %>" size="<%= C_FONTSIZE7 %>">&nbsp;</td>
                </tr>
                </table>
              </td>
            </tr>
            </table>
            </body>
          </html>



