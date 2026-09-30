<%	option explicit 
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
<title>SF Search Engine Page</title>
<meta name="GENERATOR" content="Microsoft FrontPage 4.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>
<!--#include file="SFLib/db.conn.open.asp"-->
<!--#include file="SFLib/incSearchResult.asp"-->
<!--#include file="sfLib/incDesign.asp"-->
<!--#include file="sfLib/incText.asp"-->
<!--#include file="SFLib/adovbs.inc"-->
<!--#include file="SFLib/incGeneral.asp"-->
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
          <td align="center" background="<%= C_BKGRND2 %>" bgcolor="<%= C_BGCOLOR2 %>"><b><font face="<%= C_FONTFACE2 %>" color="<%= C_FONTCOLOR2 %>" SIZE="<%= C_FONTSIZE2 %>">Search Store</font></b></td>
        </tr>
        <tr>
          <td bgcolor="<%= C_BGCOLOR3 %>" style="margin-top: 0; margin-bottom: 0">
            <p style="margin-left: 0; margin-right: 0"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" size="<%= C_FONTSIZE3 %>">Please input the
            word(s) that you would like to search for in our product
            database. For additional control you may choose to search on
            &quot;All Words&quot; or &quot;Any Words&quot; or for the
            &quot;Exact Phrase.&quot;&nbsp; For additional search options use <i>Advanced Search</i>.</font>
            </p>
          </td>
	    </tr>
	    <tr>
          <td bgcolor="<%= C_BGCOLOR4 %>">        
		    <form method="get" name="searchForm" action="search_results.asp">
		
              <table border="0" cellpadding="0" cellspacing="5" width="100%">
                <tr>
			      <td colspan="2" width="75%" align="right"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>"><b>Search</b>&nbsp;&nbsp;<input type="text" style="<%= C_FORMDESIGN %>" name="txtsearchParamTxt" size="20">&nbsp;&nbsp;<b>In</b>&nbsp;&nbsp;<select size="1" name="txtsearchParamCat" style="<%= C_FORMDESIGN %>"><option value="ALL">All
                      <%= C_CategoryNameP %></option><%= getCategoryList(0) %></select></font></td>
			        <td width="25%" align="left"><input type="image" name="btnSearch" src="<%= C_BTN01 %>" alt="Search" border="0"></td>
            
                  </tr>
                  <tr>
                    <td width="100%" colspan="3" align="center"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 - 1 %>">
            	      <p align="center"><input type="radio" value="ALL" checked name="txtsearchParamType"> <b>ALL</b> Words <input type="radio" name="txtsearchParamType" value="ANY"> <b>ANY</b> Words <input type="radio" name="txtsearchParamType" value="Exact"> Exact Phrase |
                      <a href="advancedsearch.asp"> Advanced Search</a></font>           
                      </td>
                    </tr>
                  </table>
                   <input type="hidden" name="iLevel" value="1">
                   <input type="hidden" name="txtsearchParamMan" value="ALL"><input type="hidden" name="txtsearchParamVen" value="ALL"><input type="hidden" name="txtFromSearch" value="fromSearch">
		        </form>
	          </td>
            </tr>
            <!--#include file="footer.txt"-->
    
    
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






