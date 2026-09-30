<%
option explicit
Response.Buffer = True


'@BEGINVERSIONINFO

'@APPVERSION: 50.3007.0.3

'@FILENAME: NewProduct.asp
	 
'Access Version

'@DESCRIPTION:   Retrieves New Products for Display

'@STARTCOPYRIGHT
'The contents of this file is protected under the United States
'copyright laws as an unpublished work, and is confidential and proprietary to
'LaGarde, Incorporated.  Its use or disclosure in whole or in part without the
'expressed written permission of LaGarde, Incorporated is expressly prohibited.
'
'(c) Copyright 2000 by LaGarde, Incorporated.  All rights reserved.
'@ENDCOPYRIGHT

'@ENDVERSIONINFO	

	' Constant Declarations
	const varDebug  = 0		'DeBug Setting
	const iPageSize	= 10	'Number of Records per Page 
	const iMaxRecords = 0   'Maximum amount of records returned, 0 is no maximum
	const iDaysBack = 14 'Number of days back to look for Added products
	
	Dim txtsearchParamTxt, txtsearchParamType, txtsearchParamCat, txtFromSearch,  txtsearchParamMan, srchDate
	Dim txtCatName, txtsearchParamVen, txtImagePath, txtOutput, txtDateAddedStart
	Dim txtDateAddedEnd, txtPriceStart, txtPriceEnd, txtSale, SQL, sAmount
	Dim iAttCounter, irsSearchAttRecordCount, iAttDetailCounter, irsSearchAttDetailRecordCount
	Dim iPage, iRec, iNumOfPages, iDesignCounter, iVarPageSize, iSearchRecordCount, icounter
	Dim rsCat, iDesign,rsSearch, rsSearchAtt, rsSearchAttDetail, rsCatImage, arrAttDetail, arrProduct, arrAtt, CurrencyISO

	%>
	<!--#include file="SFLib/db.conn.open.asp"-->
	<!--#include file="SFLib/adovbs.inc"-->
	<!--#include file="SFLib/incSearchResult.asp"-->
	<!--#include file="SFLib/incGeneral.asp"-->
	<!--#include file="SFLib/incDesign.asp"-->
	<!--#include file="SFLib/incText.asp"-->
	<!--#include file="sflib/incAE.js"-->
	<!--#include file="sflib/incAE.asp"-->
	<%	
	CurrencyISO = getCurrencyISO(Session.LCID)
	If iConverion = 1 Then Response.Write "<script language=""JavaScript"" src=""http://www.oanda.com/cgi-bin/fxcommerce/fxcommerce.js?user=" & sUserName & """></script>"
	iDesign = C_DesignType 'Page Layout
	iDesignCounter = 2
	iVarPageSize = iPageSize ' Records Per Page
	txtsearchParamCat = "ALL"
	srchDate = MakeUSDate(Date()-iDaysBack)
	Set rsSearch = Server.CreateObject("ADODB.RecordSet")
	' -------------------------------------------
	' RecordSet Paging Setup --------------------
	' -------------------------------------------
	
   if Application("AppName")="StoreFrontAE" then	
    'SQL = "SELECT sfProducts.prodID, sfProducts.prodName, sfProducts.prodImageSmallPath, sfProducts.prodLink, sfProducts.prodPrice, sfProducts.prodSaleIsActive," _
    ' & " sfProducts.prodSalePrice, sfProducts.prodDescription, sfProducts.prodAttrNum, sfProducts.prodCategoryId, sfProducts.prodShortDescription," _
    ' & " sfSub_Categories.CatHierarchy "_ 
    ' & " FROM (sfProducts INNER JOIN sfSubCatDetail ON sfProducts.prodID = sfSubCatDetail.ProdID) INNER JOIN sfSub_Categories ON sfSubCatDetail.subcatCategoryId = sfSub_Categories.subcatID" _
    ' & " WHERE (sfProducts.prodDateAdded >= #" & srchDate & "#  AND sfProducts.prodEnabledIsActive = 1)"
     SQL = "SELECT ProdID, prodName, prodImageSmallPath, prodLink, prodPrice, prodSaleIsActive, prodSalePrice, ProdID, prodDescription, prodAttrNum, prodCategoryId, prodShortDescription " _
			& "FROM sfProducts  WHERE (prodDateAdded >= #" & srchDate & "#  AND prodEnabledIsActive = 1)"
	
   else
	SQL = "SELECT ProdID, prodName, prodImageSmallPath, prodLink, prodPrice, prodSaleIsActive, prodSalePrice, catName, prodDescription, prodAttrNum, prodCategoryId, prodShortDescription " _
			& "FROM sfProducts INNER JOIN sfCategories ON sfProducts.prodCategoryId = sfCategories.catID WHERE (prodDateAdded >= #" & srchDate & "#  AND prodEnabledIsActive = 1)"
	
   end if
  ' Response.Write sql
	If varDebug = 1 Then Response.Write SQL & "<br><br>"
	With rsSearch
		.CursorLocation = adUseClient
		.CacheSize = iVarPageSize
		.MaxRecords = iMaxRecords
		.Open SQL, cnn, adOpenForwardOnly, adLockReadOnly, adCmdText 
		.PageSize = iVarPageSize
	End With
	
	' Determine the page user is requesting
	If Request.QueryString("PAGE") = "" Then
		iPage = 1
	Else
		iPage = CInt(Request.QueryString("PAGE"))
		' Protect against out of range pages, in case
		' of a user specified page number
		If iPage < 1 Then
			iPage = 1
		Else
			If iPage > rsSearch.PageCount Then
				iPage = rsSearch.PageCount
			Else
				iPage = CInt(Request.QueryString("PAGE"))
			End If
		End If
	End If
	
	iSearchRecordCount = rsSearch.RecordCount
	iNumOfPages = Int(iSearchRecordCount / iPageSize)
	
	If CInt(iNumOfPages+1) = CInt(iPage) Then iVarPageSize = rsSearch.RecordCount - (iNumOfPages * iPageSize) 

	If NOT rsSearch.EOF Then rsSearch.AbsolutePage = CInt(iPage)
	
	' Create Attribute Record Sets for product on page
	SQL = getAttributeSQL(rsSearch, iVarPageSize, iPage)
	If varDebug = 1 Then Response.Write SQL & "<br><br>"	
	Set rsSearchAtt = Server.CreateObject("ADODB.RecordSet")
	If SQL <> "" Then 
		rsSearchAtt.Open SQL, cnn, adOpenKeyset, adLockReadOnly, adCmdText
		SQL = getAttributeDetailSQL(rsSearchAtt)
		If varDebug = 1 Then Response.Write SQL & "<br><br>"
		If SQL <> "" Then
			Set rsSearchAttDetail = Server.CreateObject("ADODB.RecordSet")
			rsSearchAttDetail.Open SQL, cnn, adOpenKeyset, adLockReadOnly, adCmdText
		End If 
	End If 
	
	If txtsearchParamCat = "ALL" Then
		txtCatName = "All " & C_CategoryNameP
	Else
		If Not rsSearch.EOF Then
		  if Application("AppName")="StoreFrontAE" then	
			txtCatName =GetFullPath(rsSearch.Fields("ProdID"),1,"ALL")
		  else
		   txtCatName =rsSearch.Fields("CatNAME")
		  end if 
		Else
			Set rsCat = Server.CreateObject("ADODB.RecordSet")
			SQL = getCategorySQL(txtsearchParamCat)
			rsCat.Open SQL, cnn, adOpenForwardOnly, adLockReadOnly, adCmdText
			txtCatName = rsCat.Fields("catName")
			closeObj(rsCat)
		End If 
	End If
	If txtsearchParamTxt = "" Then txtsearchParamTxt = "*"
	'Corrects Number of Pages if there is overflow less then records per page 
	If iSearchRecordCount mod iPageSize <> 0 Then iNumOfPages = iNumOfPages + 1
                     	
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>SF New Products Page</title>
<meta name="GENERATOR" content="Microsoft FrontPage 4.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
<SCRIPT language="javascript" src="SFLib/sfCheckErrors.js"></SCRIPT>
<SCRIPT language="javascript" src="SFLib/sfEmailFriend.js"></SCRIPT>
</head>
<body background="<%= C_BKGRND %>" bgproperties="fixed" bgcolor="<%= C_BGCOLOR %>" link="<%= C_LINK %>" vlink="<%= C_VLINK %>" alink="<%= C_ALINK %>">
<table border="0" cellpadding="1" cellspacing="0" bgcolor="<%= C_BORDERCOLOR1 %>" width="<%= C_WIDTH %>" align="center">
  <tr>
    <td>
      <table width="100%" border="0" cellspacing="1" cellpadding="2">
        <tr>
          <%If C_BNRBKGRND = "" Then%>
            <td align="middle" background="<%= C_BKGRND1 %>" bgcolor="<%= C_BGCOLOR1 %>"><b><font face="<%= C_FONTFACE1 %>" color="<%= C_FONTCOLOR1 %>" SIZE="<%= C_FONTSIZE1 %>"><%= C_STORENAME %></font></b></td>
		  <%Else%>
			<td align="middle" bgcolor="<%= C_BNRBGCOLOR %>"><img src="<%= C_BNRBKGRND %>" border="0"></td>
		  <%End If%>
        </tr>
        <tr>
          <td>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
		      <tr>
		        <td align="left" background="<%= C_BKGRND2 %>"  bgcolor="<%= C_BGCOLOR2 %>" width = "20%">&nbsp;</td>
		        <td align="center" background="<%= C_BKGRND2 %>"  bgcolor="<%= C_BGCOLOR2 %>"><center><b><font face="<%= C_FONTFACE2 %>" color="<%= C_FONTCOLOR2 %>" SIZE="<%= C_FONTSIZE2 %>">New Products</font></b></center></td>
		        <td align="right" background="<%= C_BKGRND2 %>"  bgcolor="<%= C_BGCOLOR2 %>" width="20%"><a href="<%= C_HomePath %>order.asp"><img src="<%= C_BTN13 %>" border="0" align="right" valign="top" alt="Check Out"></a></td>
		      </tr>
	        </table>
	      </td>
        </tr>
        <tr>
    
          <!-- ### SEARCH RESULT QUERY OUTPUT ::: BEGIN ### -->    
          <%IF Application("AppName")="StoreFrontAE" Then
          if rsSearch.EOF and rsSearch.BOF then%>  
			<td align="middle" background="<%= C_BKGRND3 %>"  bgcolor="<%= C_BGCOLOR3 %>">
          <%else%>
          <td align="middle" background="<%= C_BKGRND3 %>"  bgcolor="<%= C_BGCOLOR3 %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" SIZE="<%= C_FONTSIZE3-1 %>">Search for: <b><%= txtsearchParamTxt %></b> in <%= C_CategoryNameS %>: <b><%= GetFullPath(rsSearch.Fields("ProdId"),0,"ALL") %></b>
          <%end if
         Else
          %>
          <td align="middle" background="<%= C_BKGRND3 %>"  bgcolor="<%= C_BGCOLOR3 %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" SIZE="<%= C_FONTSIZE3-1 %>">Search for: <b><%= txtsearchParamTxt %></b> in <%= C_CategoryNameS %>: <b><%= txtCatName %></b>
         <%
         End if
         %> 
            <br><b><%= iSearchRecordCount %></b> Records Returned <b><%= iVarPageSize %></b> Records Displayed.<br><a href="search.asp" style="color:<%= C_FONTCOLOR3%>;font-size:7pt;font-family:<%= C_FONTFACE3 %>"><b>New Search</b></a>|<a href="advancedsearch.asp" style="color:<%= C_FONTCOLOR3%>;font-size:7pt;font-family:<%= C_FONTFACE3 %>"><b>Advanced Search</b></a></font></td>
          <!-- ### SEARCH RESULT QUERY OUTPUT ::: END ### -->            
        </tr>
        <tr>
          <td background="<%= C_BKGRND4 %>"  bgcolor="<%= C_BGCOLOR4 %>">
            <table border="0" width="100%">
              <tr>
		        <td width="100%"><p align="center"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 - 1 %>">
                  <%
        If iNumOfPages <> 1 And iNumOfPages <> 0 Then Response.Write bottomPaging(iPage, iPageSize, iSearchRecordCount, iNumOfPages, "NewProducts")
		%>
                  </font>
                  <hr noshade color="#000000" size="1" width="90%">
                  </td>
                </tr>
		      </table>
              <%
	' -------------------------------------------
    ' Empty Search Results ----------------------
    ' -------------------------------------------
    If rsSearch.EOF Then
        txtOutput = "<table border=0 width=100&#37;>" _
        & "<tr>" _
        & "<td><center><font face=" & C_FONTFACE4 & " color=" & C_FONTCOLOR4 & " SIZE=" & C_FONTSIZE4 + 2 & ">Sorry, No Items are Newly Added!</font></center></td></tr>" _
        & "<tr>" _
        & "<td width=""100%""; colspan=""2""><hr noshade color=""#000000"" size=""1"" width=""90%"">" _
        & "</td>" _
        & "</tr>" _
        & "</table>"
        Response.Write txtOutput
        'Response.End
    Else
        ' -------------------------------------------
        ' SEARCH RESULT PRODUCT OUTPUT ::: BEGIN ----
        ' -------------------------------------------
        'create arrays for display
        arrProduct = rsSearch.GetRows(iVarPageSize)
        If Not rsSearchAtt.EOF Then 
			arrAtt = rsSearchAtt.GetRows
			irsSearchAttRecordCount = rsSearchAtt.RecordCount-1
			If Not rsSearchAttDetail.EOF Then 
				arrAttDetail = rsSearchAttDetail.GetRows
				irsSearchAttDetailRecordCount = rsSearchAttDetail.RecordCount-1 
			End If
		End If
		'sfAE
		 
     For iRec = 0 to iVarPageSize-1 
			
				
				
				SearchResults_CheckInventoryTracked 'SFAE  b2   
                ' Set Default Image if none specified for product
                If arrProduct(2, iRec) = "" Then
                   ' Set rsCatImage = Server.CreateObject("ADODB.RecordSet")
                   ' SQL = "SELECT catImage FROM sfCategories WHERE catID = " & arrProduct(10, iRec)
                   ' rsCatImage.Open SQL, cnn, adOpenForwardOnly, adLockReadOnly, adCmdText
                    'txtImagePath = rsCatImage.Fields("catImage")
                  '  closeObj(rsCatImage) 
                Else
                    txtImagePath = arrProduct(2, iRec)
                End If
      			icounter = 1 
				'Response.Write   arrProduct(11, iRec) & "<bR>"
				'Response.Write   arrProduct(7, iRec)
				       

%>		
              <form method="post" name="<%= arrProduct(0, iRec)%>" action="<%= C_HomePath %>addproduct.asp" onSubmit="this.QUANTITY.quantityBox=true;return sfCheck(this);">            
                <input TYPE="hidden" NAME="PRODUCT_ID" VALUE="<%= arrProduct(0, iRec)%>">         
                <table border="0" width="100%" background="<%= C_BKGRND4 %>" >
                  <tr>
                    <% If iDesign = "1" Then %>            
                    <td width="30%" align="center"><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><%If txtImagePath <> "" Then%><img border="1" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link<%End If%></a><br>
                    </td>
                    <% ElseIf iDesign = "3" And (iDesignCounter / 2) = Int(iDesignCounter / 2) Then%>
		            <td width="30%" align="center"><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><%If txtImagePath <> "" Then%><img border="1" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link<%End If%></a><br>
                    </td>
                    <% End If %>
                    <td width="70%" valign="top"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 %>">
                      <b><%= C_ProductID %>:</b>&nbsp;<%= arrProduct(0, iRec) %>&nbsp;&nbsp;&nbsp;
                      <b><%= C_CategoryNameS %>:</b>&nbsp;<% if Application("AppName")="StoreFrontAE" then	
                        Response.Write  GetFullPath(arrProduct(7, iRec),0,"ALL")
                     else
                        Response.Write arrProduct(7, iRec)
                     end if   
                      %><br>
                      <b><font size="<%= C_FONTSIZE4 + 1 %>"><%= arrProduct(1, iRec) %></font></b><br>
                      <b><%= C_Description %>:</b>&nbsp;
                      <%
                          If arrProduct(11, iRec) <> "" Then
                            Response.Write arrProduct(11, iRec) 
                          Else 
                            Response.Write arrProduct(8, iRec) 
                          End If
                      
                           %><br>
                 	<b><%= C_Price %>:</b>&nbsp;
			          <% If iConverion = 1 Then
					If arrProduct(5, iRec) = 1 Then 
							Response.Write "<i><strike><script>document.write(""" & FormatCurrency(arrProduct(4, iRec)) & " = ("" + OANDAconvert(" & trim(arrProduct(4, iRec)) & "," & chr(34) & CurrencyISO & chr(34) & ") + "")"");</script></strike></i><br>"
							Response.Write "<font color=#FF0000><b>" & C_SPrice & ": <script>document.write(""" & FormatCurrency(arrProduct(6, iRec)) & " = ("" + OANDAconvert(" & trim(arrProduct(6, iRec)) & ", " & chr(34) & CurrencyISO & chr(34) & ")+ "")"");</script></b></font><br>"
							Response.Write "<font color=#FF0000><i>" & C_YSave & ": <script>document.write(""" & FormatCurrency(CDbl(arrProduct(4, iRec))-CDbl(arrProduct(6, iRec))) & " = ("" + OANDAconvert(" & trim(CDbl(arrProduct(4, iRec))-CDbl(arrProduct(6, iRec))) & ", " & chr(34) & CurrencyISO & chr(34) & ")+ "")"");</script></i></font><br>"
					Else
							Response.Write "<script>document.write(""" & FormatCurrency(arrProduct(4, iRec)) & " = ("" + OANDAconvert(" & trim(arrProduct(4, iRec)) & ", " & chr(34) & CurrencyISO & chr(34) & ")+ "")"");</script>"
					End If 
			   Else
					If arrProduct(5, iRec) = 1 Then 
							Response.Write "<i><strike>" & FormatCurrency(arrProduct(4, iRec)) & "</strike></i><br>"
							Response.Write "<font color=#FF0000><b>" & C_SPrice & ": " & FormatCurrency(arrProduct(6, iRec)) & "</b></font><br>"
							Response.Write "<font color=#FF0000><i>" & C_YSave & ": " & FormatCurrency(CDbl(arrProduct(4, iRec))-CDbl(arrProduct(6, iRec))) & "</i></font><br>"
					Else
							Response.Write FormatCurrency(arrProduct(4, iRec))
					End If 
			   End If
			%>	  <% SearchResults_GetProductInventory arrProduct(0, iRec) 'SFAE b2 %>								
				  <% SearchResults_ShowMTPricesLink arrProduct(0, iRec) 'SFAE%> 
				  
			          </font><br>
                      <table border="0" align="center">
                        <%
                            ' -------------------------------------------
                            ' SEARCH RESULT ATTRIBUTE OUTPUT ::: BEGIN --
                            ' -------------------------------------------
                            If irsSearchAttRecordCount <> "" Then
								For iAttCounter = 0 to irsSearchAttRecordCount
									If arrProduct(0, iRec) = arrAtt(2, iAttCounter) Then
%>                    
                        <tr>                
                          <td align="right"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 %>"><%= arrAtt(1, iAttCounter) %></font></td>
                          <td><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 %>"><select size="1" name="attr<%= icounter %>" style="<%= C_FORMDESIGN %>">
                              <%
										For iAttDetailCounter = 0 to irsSearchAttDetailRecordCount
											If arrAtt(0, iAttCounter) = arrAttDetail(1, iAttDetailCounter) Then
														sAmount = ""
												Select Case arrAttDetail(4, iAttDetailCounter)
													Case 1 
														sAmount = " (add " & FormatCurrency(arrAttDetail(3, iAttDetailCounter)) & ")"
													Case 2 
														sAmount = " (subtract " & FormatCurrency(arrAttDetail(3, iAttDetailCounter)) & ")"
												End Select
												Response.Write "<option value=" & arrAttDetail(0, iAttDetailCounter) & ">" & arrAttDetail(2, iAttDetailCounter) & sAmount & "</option>"
											End If
										Next
%>
                            </select></font></td>
                        </tr>
                        <%  
									icounter = icounter + 1
									End If 
								Next
							End If 
                            ' -------------------------------------------
                            ' SEARCH RESULT ATTRIBUTE OUTPUT ::: END
                            ' -------------------------------------------
                     
%>

                      </table>
                      <p align="center"><center><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 %>"><%= C_Quantity %>:</font> <input style="<%= C_FORMDESIGN %>"  type="text" name="QUANTITY" title="Quantity" size="3"><br>
                      <%SearchResults_GetGiftWrap arrProduct(0, iRec) 'SFAE%>
                      <input type="image" name="AddProduct" border="0" src="<%= C_BTN03 %>" alt="Add To Cart"><br>

                      <% If iSaveCartActive = 1 Then%>
                      <input type="image" name="SaveCart" border="0" src="<%= C_BTN02 %>" alt="Save To Cart">
                      <%
        End if
        If iEmailActive = 1 Then
        %>
                      <a href="javascript:emailFriend('<%= server.urlEncode(arrProduct(0, iRec)) %>')"><img border="0" src="<%= C_BTN24 %>" alt="Email a Friend"></a>
                      <% End If %>
                      </center></p>
                    </td>
                    <%  If iDesign = "2" Then %>            
		            <td width="30%" align="center"><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><%If txtImagePath <> "" Then%><img border="1" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link<%End If%></a><br>
                    </td>
                    <%  ElseIf iDesign = "3" And (iDesignCounter / 2) <> Int(iDesignCounter / 2) Then %>
		            <td width="30%" align="center"><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><%If txtImagePath <> "" Then%><img border="1" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link<%End If%></a><br>
                    </td>
                    <%  End If %>
                  </tr>
                  <tr>
                    <td width="100%" colspan="2"><hr noshade color="#000000" size="1" width="90%">
                    </td>
                  </tr>    
                   
                  <%              
				Response.Write "</table></form>"
				Response.Flush
            If iDesign = "3" Then iDesignCounter = iDesignCounter + 1
          
        Next
        ' -------------------------------------------
        ' SEARCH RESULT PRODUCT OUTPUT ::: END ------
        ' -------------------------------------------
    End If 
%>        
                  <table border="0" width="100%">
                    <tr>
                      <td width="100%"><p align="center"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 - 1 %>">
                        <%
                ' -------------------------------------------   
                ' SEARCH RESULT PAGING OUTPUT ::: BEGIN -----
                ' -------------------------------------------
If iNumOfPages <> 1 And iNumOfPages <> 0 Then Response.Write bottomPaging(iPage, iPageSize, iSearchRecordCount, iNumOfPages, "NewProducts")
                ' -------------------------------------------   
                ' SEARCH RESULT PAGING OUTPUT ::: END -------
                ' -------------------------------------------
%>
                        </font></p>
                      </td>
                    </tr>
                  </table>
<!--#include file="footer.txt"-->
                </table>
              </td>
            </tr>
          </table>
        </body>

        <%
	' Object Cleanup
	closeObj(rsSearch)
	closeObj(rsSearchAtt)
	closeObj(rsSearchAttDetail)
	closeObj(cnn)
%>


























