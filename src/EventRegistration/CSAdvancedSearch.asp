<%	option explicit 
	Response.Buffer = True
	
'@BEGINVERSIONINFO

'@APPVERSION: 50.3007.0.1

'@FILENAME: advancedsearch.asp
 
'

'@DESCRIPTION: Product Search Page

'@STARTCOPYRIGHT
'The contents of this file is protected under the United States
'copyright laws and is confidential and proprietary to
'LaGarde, Incorporated.  Its use or disclosure in whole or in part without the
'expressed written permission of LaGarde, Incorporated is expressly prohibited.
'
'(c) Copyright 2000, 2001 by LaGarde, Incorporated.  All rights reserved.
'@ENDCOPYRIGHT

'@ENDVERSIONINFO
 dim sSubCategories
 dim FrontPage_Form1 

%>
<!--#include file="SFLib/db.conn.open.asp"-->
<!--#include file="SFLib/incSearchResult.asp"-->
<!--#include file="sfLib/incDesign.asp"-->
<!--#include file="sfLib/incText.asp"-->
<!--#include file="SFLib/adovbs.inc"-->
<!--#include file="SFLib/incGeneral.asp"-->
<html>

<head>




<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>SF Advanced Search Engine Page</title>
<meta name="GENERATOR" content="Microsoft FrontPage 4.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>
<%
 
%>
<body background="<%= C_BKGRND %>" bgproperties="static" bgcolor="<%= C_BGCOLOR %>" link="<%= C_LINK %>" vlink="<%= C_VLINK %>" alink="<%= C_ALINK %>">
<!--#Include virtual="/Header.asp"--> 
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
        <td align="center" bgcolor="<%= C_BGCOLOR2 %>" background="<%= C_BKGRND2 %>"><font face="<%= C_FONTFACE2 %>" color="<%= C_FONTCOLOR2 %>" size="<%= C_FONTSIZE2 %>"><b>Advanced Search</b></font></td>
        <tr>
          <td bgcolor="<%= C_BGCOLOR3 %>" background="<%= C_BKGRND3 %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" size="<%= C_FONTSIZE3 %>">Use the options below to perform a more selective search of our product database.  You can confine your search to only certain Manufacturers, Categories, or Vendors.  You can also choose to search only by items that have been added within a certain time range, or search within a specific price range.</font>
            <tr>
              <td bgcolor="<%= C_BGCOLOR4 %>" background="<%= C_BKGRND4 %>">
                <form method="get" action="search_results.asp"  name="FrontPage_Form1"> 
                  
                  <table border="0" width="100%" cellpadding="4">
                    <tr>
                      <td width="100%"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>"><b>Enter Keyword(s):</b><br>
            &nbsp;&nbsp;&nbsp;&nbsp; <input style="<%= C_FORMDESIGN %>" name="txtsearchParamTxt" size="40">
                        <p><b>Search using:</b><br>
            &nbsp;&nbsp;&nbsp;&nbsp; <select size="1" style="<%= C_FORMDESIGN %>" name="txtsearchParamType">
                          <option selected value="ALL">All of the Keywords</option>
                          <option value="ANY">Any of the Keywords</option>
                          <option value="Exact">Exact Phrase</option></select></p>
                        <%If C_CategoryIsActive <> 0 Then%>  
                        <p><b>Select a <%= C_CategoryNameS %>:</b><br>
            &nbsp;&nbsp;&nbsp;&nbsp; <select style="<%= C_FORMDESIGN %>" size="1" name="txtsearchParamCat">
                          <option value="ALL">All <%= C_CategoryNameP %></option><%= getCategoryList(0) %></select></p>
                        <%Else%>
                        <input type="hidden" name= "txtsearchParamCat" value="ALL">
			            
			            <%End If           
			            If C_MFGIsActive <> 0 Then%>
			            <p><b>Select a <%= C_ManufacturerNameS %>:</b><br>
			&nbsp;&nbsp;&nbsp;&nbsp; <select style="<%= C_FORMDESIGN %>" size="1" name="txtsearchParamMan">
                          <option value="ALL">All <%= C_ManufacturerNameP %></option><%= getManufacturersList(0) %></select></p>
                        <%Else%>
                        <input type="hidden" name= "txtsearchParamMan" value="ALL">
                        <%End If%>
                        <%If C_VendorIsActive <> 0 Then%>
                        <p><b>Select a <%= C_VendorNameS %>:</b><br>
            &nbsp;&nbsp;&nbsp;&nbsp; <select style="<%= C_FORMDESIGN %>" size="1" name="txtsearchParamVen">
                          <option value="ALL">All <%= C_VendorNameP %></option><%= getVendorList(0) %></select></p>
                        <%Else%>
                        <input type="hidden" name= "txtsearchParamVen" value="ALL">
                        <%End If%>
                        <%If C_AddedIsActive <> 0 Then%>
                        <p><b>Added to Inventory Between:</b><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="text" style="<%= C_FORMDESIGN %>" name="txtDateAddedStart" size="8"> <b>And</b> 
                         <input type="text" style="<%= C_FORMDESIGN %>" name="txtDateAddedEnd" size="8"></p>
			            <%End If%>
			            <%If C_PriceIsActive <> 0 Then%>
			            <p><b>Price Between:</b><br>
			&nbsp;&nbsp;&nbsp;&nbsp;<input style="<%= C_FORMDESIGN %>" type="text" name="txtPriceStart" size="8"> <b>To</b>  
                         <input style="<%= C_FORMDESIGN %>" type="text" name="txtPriceEnd" size="8"></p>
			            <%End If%>
			            <%If C_SaleIsActive <> 0 Then%>
			            <p>&nbsp;&nbsp;&nbsp;<input type="checkbox" name="txtSale" value="1"><b>Only Sale Items</b></font>
			            <%End If%>
			            <p align="center"><input type="image" name="btnSearch" src="<%= C_BTN21 %>" alt="Search" border="0"></p>
			            </td>
                      </tr>
                    </table>
                    <input type="hidden" name="txtFromSearch" value="fromSearch">
                    <input type="hidden" name="iLevel" value="1">

	            </td>
                <!--#include file="footer.txt"-->
              </table>
            </td>
          </tr>
        </table>
 <%
   closeObj(cnn)     
%>
  
  </form>  
      
      </body>

    </html>




