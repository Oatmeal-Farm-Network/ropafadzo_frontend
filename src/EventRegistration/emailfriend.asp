<%@ Language=VBScript %>
<%	option explicit 
	Response.Buffer = True
		
	'@BEGINVERSIONINFO


	'@APPVERSION: 5.3001.0.1

	'@FILENAME: emailfriend.asp
 

	'

	'@DESCRIPTION: Send Email of product to a friend

	'@STARTCOPYRIGHT
	'The contents of this file is protected under the United States
	'copyright laws and is confidential and proprietary to
	'LaGarde, Incorporated.  Its use or disclosure in whole or in part without the
	'expressed written permission of LaGarde, Incorporated is expressly prohibited.
	'
	'(c) Copyright 2000, 2001 by LaGarde, Incorporated.  All rights reserved.
	'@ENDCOPYRIGHT

	'@ENDVERSIONINFO

%>
<HTML>

<HEAD>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>SF Email a Friend Popup Window</title>
<meta name="GENERATOR" content="Microsoft FrontPage 4.0">
<meta name="ProgId" content="FrontPage.Editor.Document">


<SCRIPT LANGUAGE=javascript>
<!--
function chkEMail() {
if(frmEmailfriend.txtFriend2.value != ""){  
  var emailadd = frmEmailfriend.txtFriend2.value
  var stemp1 = emailadd.indexOf("@");
  var stemp2 = emailadd.indexOf(".");  
    if((stemp1 < 1 )||(stemp2 < 1))
     {
       alert("Must Use a valid friend two email Address");
        frmEmailfriend.txtFriend2.focus();
      }
       
 // }
  
  }
}
//-->
</SCRIPT>



</HEAD>
<!--#include file="SFLib/incDesign.asp"-->
<!--#include file="SFLib/db.conn.open.asp"-->
<!--#include file="SFLib/adovbs.inc"-->

<!--#include file="SFLib/incGeneral.asp"-->
<link rel="stylesheet" type="text/css" href="BarnStyle.css">
<SCRIPT language=javascript src="SFLib/sfCheckErrors.js"></SCRIPT>
<%
Dim sClosing
sClosing = ""

If Request.Form("btnEmailSubmit.x") <> "" Then
	Dim sInformation 
	sInformation = Request.Form("txtFriend") & "|" & Request.Form("txtEmail") & "|" & Request.Form("txtMessage")& "|" & Request.Form("prodID") & "|" & Request.Form("txtSubject") & "|" & Request.Form("txtFriend2")
	'Response.Write sInformation
	Call createMail ("EmailFriend",sInformation)
	sClosing = "onload=""javascript:window.close()"""
End If
%>

<body <% If Request.Form("btnEmailSubmit.x") <> "" Then response.write sClosing %> bgcolor="<%= C_BGCOLOR %>" background="black" link="<%= C_LINK %>" vlink="<%= C_VLINK %>" alink="<%= C_ALINK %>">

<table border="0" cellpadding="1" cellspacing="0" bgcolor="<%= C_BORDERCOLOR1 %>" width="100%" align="center">
  <tr>
    <td>
      <table width="100%" border="0" cellspacing="1" cellpadding="3">
        <tr>
          <td align="middle" background="<%= C_BKGRND1 %>" bgcolor="<%= C_BGCOLOR1 %>"><b><font face="<%= C_FONTFACE1 %>" color="<%= C_FONTCOLOR1 %>" SIZE="<%= C_FONTSIZE1 %>"><%= C_STORENAME %></font></b></td>
        </tr>
        <tr>
          <td background="<%= C_BKGRND4 %>" bgcolor="<%= C_BGCOLOR4 %>">
<form method="post" name="frmEmailfriend" onsubmit="javascript:this.txtFriend2.optional=true;return sfCheck(this)">  
<table border=0 width="100%">
    <tr>
      <td colspan=2 nowrap class = "body"><b>Use this form to e-mail information about this product to others.</b>
        &nbsp;<br>
        <br>
      </td>
    </tr>
    <tr>
      <td nowrap width="20%" class = "body">ToASM.ASM,./a-a.as
        E-Mail Address:</td>
      <td nowrap><input type=text size=40 name="txtFriend" title="Your Firend's Email Address"></td>
    </tr>
    <tr>
      <td nowrap width="20%" class = "body">CC
        E-Mail Address:</td>
      <td nowrap><input type=text size=40 name="txtFriend2"   onfocusout="chkEMail()"></td>
    </tr>
    <tr>
      <td nowrap width="20%" class = "body">From
        E-Mail Address:</td>
      <td nowrap><input type=text size=40 name="txtEmail" title="Your Email Address"></td>
    </tr>
    <tr>
      <td nowrap width="20%" class = "body">Subject:</td>
      <td nowrap><input type=text size=50 name="txtSubject" title="Email Subject"></td>
    </tr>
    <tr>
      <td colspan=2 nowrap class = "body">Message:</td>
    </tr>
    <tr>
      <td colspan=2 align=center nowrap class = "body"><textarea cols=70 rows=7 name="txtMessage" title="Message">Hello, <%=vbcrlf%>This link leads to <%= C_STORENAME%> where you'll find this product.</textarea></td>
    </tr>
    <tr>
      <td colspan=2 align=center nowrap><input type=image border="0" src="images/Submit.jpg" name="btnEmailSubmit"></td>
    </tr>
  <input type=hidden name=prodID value="<%= Request.QueryString("ProdID") %>">
</form></table>
            <tr>
              <td class = "body"><p align="center"><b><a href="javascript:window.close()">Close</a></b></td>
                </tr>
                </table>
              </td>
            </tr>
            </table>







</BODY>

<%
closeObj(cnn)
%>



