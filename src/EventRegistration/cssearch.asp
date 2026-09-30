<%	'option explicit 
	Response.Buffer = True
		
	'@BEGINVERSIONINFO

	'@APPVERSION: 5.3001.0.1

	'@FILENAME: search.asp
 

	

	'@DESCRIPTION: Search Page
	
	'@STARTCOPYRIGHT
	'The contents of this file is protected under the United States
	'copyright laws and is confidential and proprietary to
	'LaGarde, Incorporated.  Its use or disclosure in whole or in part without the
	'expressed written permission of LaGarde, Incorporated is expressly prohibited.
	'
	'(c) Copyright 2000, 2001 by LaGarde, Incorporated.  All rights reserved.
	'@ENDCOPYRIGHT

	'@ENDVERSIONINFO

	If Trim(Request.QueryString("referer")) <> "" Then
		Session("TradingPartnerID") = Request.QueryString("referer")
	End If	

	Session("HttpReferer") = Request.ServerVariables("HTTP_REFERER") 
%>
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Club Sunglass Search</title>
<meta name="GENERATOR" content="Microsoft FrontPage 4.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
<link rel="stylesheet" type="text/css" href="/style.css">
</head>
<!--#include file="SFLib/db.conn.open.asp"-->
<!--#include file="SFLib/incSearchResult.asp"-->
<!--#include file="sfLib/incDesign.asp"-->
<!--#include file="sfLib/incText.asp"-->
<!--#include file="SFLib/adovbs.inc"-->
<!--#include file="SFLib/incGeneral.asp"-->
<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" border=0 	cellpadding=0 cellspacing=0 >


<table border="0" cellpadding="0" cellspacing="0" width="790" bgcolor="white" align="center" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" >
	<tr>
		<td colspan = "3">

		</td>
	</tr>
	<tr>
		<td class="menu" width = "160" bgcolor = "#ecf0f7">

		</td>
		<td>

<table border="0" cellpadding="1" cellspacing="0"  align="center">
  <tr>
    <td>
      <table border="0" cellpadding="0" cellspacing="0"  bgcolor="white" align="center" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  height = "350">
        
        <tr>
          <td  class = "body" valign = "top"><center><H1>Search Club Sunglass</h1></center>
            Please input the
            word(s) that you would like to search for in our product
            database. For additional control you may choose to search on
            &quot;All Words&quot; or &quot;Any Words&quot; or for the
            &quot;Exact Phrase.&quot;&nbsp; 
            
		    <form method="get" name="searchForm" action="cssearch_results.asp">
		
              <table border="0" cellpadding="0" cellspacing="5" width="100%">
                <tr>
			      <td colspan="2" width="75%" align="right"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>"><b>Search</b>&nbsp;&nbsp;<input type="text" style="<%= C_FORMDESIGN %>" name="txtsearchParamTxt" size="20">&nbsp;&nbsp;<b>In</b>&nbsp;&nbsp;<select size="1" name="txtsearchParamCat" style="<%= C_FORMDESIGN %>"><option value="ALL">All
                      <%= C_CategoryNameP %></option><%= getCategoryList(0) %></select></font></td>
			        <td width="25%" align="left"><input type="image" name="btnSearch" src="<%= C_BTN01 %>" alt="Search" border="0"></td>
            
                  </tr>
                  <tr>
                    <td width="100%" colspan="3" align="center"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 - 1 %>">
            	      <p align="center"><input type="radio" value="ALL" checked name="txtsearchParamType"> <b>ALL</b> Words <input type="radio" name="txtsearchParamType" value="ANY"> <b>ANY</b> Words <input type="radio" name="txtsearchParamType" value="Exact"> Exact Phrase </font>           
                      </td>
                    </tr>
                  </table>
                   <input type="hidden" name="iLevel" value="1">
                   <input type="hidden" name="txtsearchParamMan" value="ALL"><input type="hidden" name="txtsearchParamVen" value="ALL"><input type="hidden" name="txtFromSearch" value="fromSearch">
		        </form>
	          </td>
            </tr>
            
    
          </table>
        </td>
      </tr>
	  
    </table>
	</td>
            </tr>

	</table>
    <font face="verdana" size="2" color="<%= C_FONTCOLOR3 %>">
    <%
closeObj(cnn)
%>
    </font>
 
  
  
  </body>
</html>






