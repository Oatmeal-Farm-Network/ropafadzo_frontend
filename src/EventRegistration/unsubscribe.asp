<%@ Language=VBScript %>
<%	option explicit 
	Response.Buffer = True
		
	'@BEGINVERSIONINFO

	'@APPVERSION: 5.3001.0.1

	'@FILENAME: unsubscribe.asp 
 
	

	'@DESCRIPTION: Unsubscribes Customers

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
<html>

<!--#include file="SFLib/adovbs.inc"-->
<!--#include file="SFLib/db.conn.open.asp"-->
<!--#include file="SFLib/incGeneral.asp"-->
<!--#include file="SFLib/incDesign.asp"-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>SF Unsubscribe to Mailing List Page</title>
<meta name="GENERATOR" content="Microsoft FrontPage 4.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>
<%
Dim sEmail, rs, sSQL

sEmail = trim(Request.QueryString("email"))

sSQL = "SELECT custID, custEmail, custIsSubscribed FROM sfCustomers WHERE custEmail = '" & sEmail & "'"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sSQL, cnn, adOpenStatic, adLockOptimistic, adCmdText
If Not (rs.EOF And rs.BOF) Then
	rs.Fields("custIsSubscribed") = 0
	rs.Update 
End If
closeObj(rs)
closeObj(cnn)

If sEmail = "" Then sEmail = "Nothing"

%>
<body background="<%= C_BKGRND %>" bgproperties="fixed" bgcolor="<%= C_BGCOLOR %>" link="<%= C_LINK %>" vlink="<%= C_VLINK %>" alink="<%= C_ALINK %>">

<table border="0" cellpadding="1" cellspacing="0" bgcolor="<%= C_BORDERCOLOR1 %>" width="<%= C_WIDTH %>" align="center">
  <tr>
    <td>
      <table width="100%" border="0" cellspacing="1" cellpadding="3">
        <tr>
          <%If C_BNRBKGRND = "" Then%>
            <td align="middle" background="<%= C_BKGRND1 %>" bgcolor="<%= C_BGCOLOR1 %>"><b><font face="<%= C_FONTFACE1 %>" color="<%= C_FONTCOLOR1 %>" SIZE="<%= C_FONTSIZE1 %>"><%= C_STORENAME %></font></b></td>
		  <%Else%>
			<td align="middle" bgcolor="<%= C_BNRBGCOLOR %>"><img src="<%= C_BNRBKGRND %>" border="0"></td>
		  <%End If%>
	    </tr>	
        <tr>
          <td align="center" background="<%= C_BKGRND2 %>" bgcolor="<%= C_BGCOLOR2 %>"><b><font face="<%= C_FONTFACE2 %>" color="<%= C_FONTCOLOR2 %>" SIZE="<%= C_FONTSIZE2 %>">Unsubscribe</font></b></td>
        </tr>
 	    <tr>
          <td bgcolor="<%= C_BGCOLOR4 %>">        
		    <table border="0" cellpadding="0" cellspacing="5" width="100%">
              <tr>
			    <td width="75%" align="center"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>"><b><%= sEmail %> has been removed from the mailing list of <%= C_STORENAME %></b></font></td>
            
              </tr>
            </table>
	      </td>
        </tr>
        <!--#include file="footer.txt"-->
    
      </table>
    </td>
  </tr>
</table>
<font face="verdana" size="2" color="<%= C_FONTCOLOR3 %>">
</font>
</body>
</html>



