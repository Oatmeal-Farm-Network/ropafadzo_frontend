<%@ Language=VBScript %>

<%
	'option explicit
	Response.Buffer = True

	'@BEGINVERSIONINFO


	'@APPVERSION: 5.3001.0.2

	'@FILENAME: search_results.asp
 

	

	'@DESCRIPTION: Displays search results

	'@STARTCOPYRIGHT
	'The contents of this file is protected under the United States
	'copyright laws and is confidential and proprietary to
	'LaGarde, Incorporated.  Its use or disclosure in whole or in part without the
	'expressed written permission of LaGarde, Incorporated is expressly prohibited.
	'
	'(c) Copyright 2000, 2001 by LaGarde, Incorporated.  All rights reserved.
	'@ENDCOPYRIGHT

	'@ENDVERSIONINFO

'Modified 11/20/01 
'Storefront Ref#'s: 128 'JF
'Storefront Ref#'s: 219 'DP
	' Constant Declarations
	const varDebug  = 0		'DeBug Setting
	const iPageSize	= 10 'Records Per Page 
	const iMaxRecords = 0   'Maximum amount of records returned, 0 is no maximum
	
	Dim txtsearchParamTxt, txtsearchParamType, txtsearchParamCat, txtFromSearch,  txtsearchParamMan
	Dim txtCatName, txtsearchParamVen, txtImagePath, txtOutput, txtDateAddedStart
	Dim txtDateAddedEnd, txtPriceStart, txtPriceEnd, txtSale, SQL, sAmount, rsCatImage
	Dim iAttCounter, irsSearchAttRecordCount, iAttDetailCounter, irsSearchAttDetailRecordCount
	Dim iPage, iRec, iNumOfPages, iDesignCounter, iVarPageSize, iSearchRecordCount, icounter, iDesign
	Dim rsCat, rsSearch, rsSearchAtt, rsSearchAttDetail, arrAttDetail, arrProduct, arrAtt, rsManufacturer, rsVendor
	dim CurrencyISO,sSubCat,sALLSUB,X,sMainCat ,iLevel,sNextLevel
		'sfAE
		dim bDuplicate,iDupRec
    
	 
	iDesign	= C_DesignType		'Layout Selection
	iDesignCounter = 2
	iVarPageSize = iPageSize ' Records Per Page
	
	txtFromSearch = Trim(Request.Form("txtFromSearch"))
    sSubCat = Request.item("subcat")
    if  sSubCat = "" then
     
         sSubCat = Request.item("txtsearchParamCat")
        
    end if

    sALLSUB = Request.item("txtsearchParamCat")
    iLevel  = Request.item("iLevel")
    if ilevel = 2 and  sALLSUB = "ALL" then
     sSubCat = Request.item("subcat")
    end if 
   ' Requests the variables depending on how the page is entered
	If txtFromSearch = "fromSearch" Then
	  txtsearchParamTxt	= trim(Replace(Replace(Request.Form("txtsearchParamTxt"), "'", "''"), "*", ""))
	  txtsearchParamType	= trim(Request.Form("txtsearchParamType"))
	   if Ilevel = 2 and sALLSUB = "ALL" then
	     txtsearchParamCat	= sSubCat
	     Ilevel = 1 
	   else 
    	 txtsearchParamCat	= trim(Request.QueryString("txtsearchParamCat"))
       end if
	  txtsearchParamMan	= trim(Request.Form("txtsearchParamMan"))
	  txtsearchParamVen	= trim(Request.Form("txtsearchParamVen"))
	  txtDateAddedStart	= MakeUSDate(trim(Request.Form("txtDateAddedStart")))
	  txtDateAddedEnd 	= MakeUSDate(trim(Request.Form("txtDateAddedEnd")))
	  txtPriceStart		= trim(Request.Form("txtPriceStart"))
	  txtPriceEnd 		= trim(Request.Form("txtPriceEnd"))
	  txtSale			= trim(Request.Form("txtSale"))
	Else
	  txtsearchParamTxt	= trim(Replace(Replace(Request.QueryString("txtsearchParamTxt"), "'", "''"), "*", ""))
	  txtsearchParamType	= trim(Request.QueryString("txtsearchParamType"))
	   if Ilevel = 2 and sALLSUB = "ALL" then
	     txtsearchParamCat	= sSubCat
	     Ilevel = 1 
	   else 
    	 txtsearchParamCat	= trim(Request.QueryString("txtsearchParamCat"))
	   end if
	  txtsearchParamMan	= trim(Request.QueryString("txtsearchParamMan"))
	  txtsearchParamVen	= trim(Request.QueryString("txtsearchParamVen"))
	  txtDateAddedStart	= MakeUSDate(trim(Request.QueryString("txtDateAddedStart")))
	  txtDateAddedEnd 	= MakeUSDate(trim(Request.QueryString("txtDateAddedEnd")))
	  txtPriceStart		= trim(Request.QueryString("txtPriceStart"))
	  txtPriceEnd 		= trim(Request.QueryString("txtPriceEnd"))
	  txtSale			= trim(Request.QueryString("txtSale"))
	End If 
%>
<!--#include file="SFLib/db.conn.open.asp"-->
<!--#include file="SFLib/adovbs.inc"-->
<!--#include file="SFLib/incSearchResult.asp"-->
<!--#include file="SFLib/incGeneral.asp"-->
<!--#include file="sfLib/incDesign.asp"-->
<!--#include file="sfLib/incText.asp"-->
<!--#include file="sflib/incAE.asp"--> 
<!--#include file="sflib/incAE.js"-->
<%
CurrencyISO = getCurrencyISO(Session.LCID)
If iConverion = 1 Then Response.Write  "<script language=""JavaScript"" src=""http://www.oanda.com/cgi-bin/fxcommerce/fxcommerce.js?user=" & sUserName & """></script>"
	Set rsSearch = Server.CreateObject("ADODB.RecordSet")
	' -------------------------------------------
	' RecordSet Paging Setup --------------------
	' -------------------------------------------
	if Application("AppName")="StoreFrontAE" then
	   dim iSubCat
	   iSubCat = sSubCat
	   SQL = getProductSQLAE(txtsearchParamType, txtsearchParamTxt, txtsearchParamCat, txtsearchParamMan, _
	   txtsearchParamVen, txtDateAddedStart, txtDateAddedEnd, txtPriceStart, txtPriceEnd, txtSale,iSubCat,iLevel)

	   if txtsearchParamCat <> "ALL" then
	      sNextLevel = getSubCategoryList(ilevel,sSubcat)
           if trim(snextlevel) <> ""  then
            iLevel = Ilevel + 1
	       end if
	   End if   
	 
	else	
    	 SQL = getProductSQL(txtsearchParamType, txtsearchParamTxt, txtsearchParamCat, txtsearchParamMan, _
	     txtsearchParamVen, txtDateAddedStart, txtDateAddedEnd, txtPriceStart, txtPriceEnd, txtSale)
	     
	end if
	  
	If varDebug = 1 Then Response.Write SQL & "<br><br>"
	With rsSearch
		.CursorLocation = adUseClient
		.CacheSize = iVarPageSize
		.MaxRecords = iMaxRecords
		.Open SQL, cnn, adOpenForwardOnly, adLockReadOnly, adCmdText 
		.PageSize = iVarPageSize
	End With
'Response.Write SQL
'Response.end
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
	'create arrays for display
        'arrProduct = rsSearch.GetRows(iVarPageSize)
 if rsSearch.BOF and rsSearch.EOF then
 iSearchRecordCount=0
 else
     
         arrProduct = rsSearch.GetRows()
      
    iSearchRecordCount=ubound(arrProduct,2) + 1 
	iNumOfPages = Int(iSearchRecordCount / iPageSize)
end if	
	If CInt(iNumOfPages+1) = CInt(iPage) Then iVarPageSize = iSearchRecordCount - (iNumOfPages * iPageSize) 
    'Response.Write "<BR>iVarPageSize " & iVarPageSize & "<BR>iSearchRecordCount - (iNumOfPages * iPageSize)" 
	'Response.Write "<BR>"  & iSearchRecordCount &  "-" & "(" & iNumOfPages & " * " & iPageSize & ") = " & iSearchRecordCount - (iNumOfPages * iPageSize) 
	'Corrects Number of Pages if there is overflow less then records per page 
	
If iSearchRecordCount mod iPageSize <> 0 Then iNumOfPages = iNumOfPages + 1                    	

If rsSearch.bof=false and rsSearch.eof=true then
  rsSearch.movefirst
end if
	
If NOT rsSearch.EOF Then rsSearch.AbsolutePage = CInt(iPage)
	
	' Create Attribute Record Sets for product on page
	SQL = getAttributeSQL(rsSearch, iVarPageSize, iPage)

		
	If varDebug = 1 Then Response.Write SQL & "<br><br>"	
	Set rsSearchAtt = Server.CreateObject("ADODB.RecordSet")
	If SQL <> "" Then 
		rsSearchAtt.Open SQL, cnn, adOpenKeyset, adLockReadOnly, adCmdText
		SQL = getAttributeDetailSQL(rsSearchAtt)
		If varDebug = 1 Then Response.Write  SQL & "<br><br>"
		If SQL <> "" Then
			Set rsSearchAttDetail = Server.CreateObject("ADODB.RecordSet")
			rsSearchAttDetail.Open SQL, cnn, adOpenKeyset, adLockReadOnly, adCmdText
		End If 
	End If 
	
	If txtsearchParamCat = "ALL" Then
		txtCatName = "All " & C_CategoryNameP
	Else
        If Not rsSearch.EOF Then
		  if Application("AppName")<> "StoreFrontAE" then  
	     	txtCatName = rsSearch.Fields("catName")
		  else
		      Dim arrTemp
		      on error resume next
		      if txtsearchParamCat = "ALL" then
				arrTemp = GetFullPath(rsSearch.Fields("CatHierarchy"),1,iSubCat)
	     	  else
               	arrTemp = GetFullPath(rsSearch.Fields("CatHierarchy"),1,iSubCat)
 	     	  end if  
		          txtCatName = arrtemp
           end if
		Else
		   if Application("AppName")<> "StoreFrontAE" then  
	     	set rsCat = Server.CreateObject("ADODB.RecordSet")
			SQL = getCategorySQL(txtsearchParamCat)
			rsCat.Open SQL, cnn, adOpenForwardOnly, adLockReadOnly, adCmdText
			txtCatName = rsCat.Fields("catName")
			closeObj(rsCat)
		   else
		      on error resume next
		      txtCatName =GetFullPath(Request.Item("txtCatName"),1,iSubCat) 
           end if      
		   
		
		End If 
    End If
	If txtsearchParamTxt = "" Then txtsearchParamTxt = "*"

%>
<html>

<head>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Artisan Barn Store</title>
<meta name="GENERATOR" content="Microsoft FrontPage 4.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
<link rel="stylesheet" type="text/css" href="<%=Style%>">

<SCRIPT language="javascript" src="SFLib/sfCheckErrors.js"></SCRIPT>
<SCRIPT language="javascript" src="SFLib/sfEmailFriend.js"></SCRIPT>
</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<a name="top"></a>

<!--#Include file="Header.asp"-->
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "700" height = "200">
  <tr>
    <td><br>
      <table width="100%" border="0" cellspacing="1" cellpadding="2">
       
        <tr>
          <td><table border = "0" width = "700"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
					<tr>
			       
									<td ><h1><%= txtCatName %> for Sale</h1>
									</td>
									<td align = "right">
									<form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
										<input type="hidden" name="cmd" value="_cart">
										<input type="hidden" name="business" value="jhartwig@clearwire.net">
									
										<input type="hidden" name="display" value="1">
										<input type="image" src="images/ShoppingCart.gif" alt="Submit button" border="0" name="submit"  Value = "View Cart" height = "30" >

									</form>
									
									</td>
					</tr>
					<tr>
						<td colspan = "2"   height = "2"  background = "images/Underline.jpg"><img src = "images/px.gif". height = "2"></td>
					</tr>
               </table>
	      </td>
        </tr>

           
        
        <tr>
          <td >
            <table border="0" width="100%">
              <tr>
	   <td width="100%"><p align="center"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 - 1 %>">
           
       <%
        If iNumOfPages <> 1 And iNumOfPages <> 0 Then  Response.Write bottomPaging(iPage, iPageSize, iSearchRecordCount, iNumOfPages, "Search")
		%>
                   
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
        & "<td><center><font face=" & C_FONTFACE4 & " color=" & C_FONTCOLOR4 & " SIZE=" & C_FONTSIZE4 + 2 & ">Sorry, No Matching Records Returned!</center></td></tr>" _
        & "<tr>" _
        & "<td width=""100%""; colspan=""2""><hr noshade color=""#000000"" size=""1"" width=""90%"">" _
        & "</td>" _
        & "</tr>" _
        & "</table>"
       Response.Write   txtOutput
        'Response.End
    Else
    
    
    
    
        ' -------------------------------------------
        ' SEARCH RESULT PRODUCT OUTPUT ::: BEGIN ----
        ' -------------------------------------------
 
        arrProduct = rsSearch.GetRows(iVarPageSize)

        If Not rsSearchAtt.EOF Then 
			arrAtt = rsSearchAtt.GetRows
			irsSearchAttRecordCount = rsSearchAtt.RecordCount-1
			If Not rsSearchAttDetail.EOF Then 
				arrAttDetail = rsSearchAttDetail.GetRows
				irsSearchAttDetailRecordCount = rsSearchAttDetail.RecordCount-1 
			End If
		End If
	   
        For iRec = 0 to iVarPageSize - 1 
			   SearchResults_CheckInventoryTracked 'SFAE  b2   
		    'sfAE
		       If iRec > (iVarPageSize-1) then EXIT FOR 'SFAE b2 
			
                ' Set Default Image if none specified for product
              
                If arrProduct(2, iRec) <> "" Then
                    txtImagePath = "/uploads/Artwork/" & arrProduct(2, iRec)
                Else
                    txtImagePath = ""
                End If
      			icounter = 1 

%>				
			  

            
                <table border="0" width="700" align = "center" >
                 <form method="post" name="<%= arrProduct(0, iRec)%>" action="addproduct.asp" onSubmit="this.QUANTITY.quantityBox=true;return sfCheck(this);">
                  <input TYPE="hidden" NAME="PRODUCT_ID" VALUE="<%= arrProduct(0, iRec)%>">         
                
                  <tr>

                    <% If iDesign = "1" Then %>   
                    <td width="30%" align="center" class = "body">
					
					<% If Trim(arrProduct(3, iRec)) <> "" Then %>
							<a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><% End If %><%If txtImagePath <> "" Then%><img border="1" width = "200" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link <%End If%><% If Trim(arrProduct(3, iRec)) <> "" Then %></a><% End If %><br>
                    </td>
                    <% ElseIf iDesign = "3" And (iDesignCounter / 2) = Int(iDesignCounter / 2) Then%>
		            <td width="30%" align="center"><% If Trim(arrProduct(3, iRec)) <> "" Then %><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><% End If %><%If txtImagePath <> "" Then%><img border="1" width = "200" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link<%End If%><% If Trim(arrProduct(3, iRec)) <> "" Then %></a><% End If %><br>
                    </td>
                    <% End If %>
                    <td width="70%" valign="top" class = "body">
                      <b><%= C_ProductID %>:</b>&nbsp;<%= arrProduct(0, iRec) %>&nbsp;&nbsp;&nbsp;
                      <b><%= C_CategoryNameS %>:</b>&nbsp;<%if Application("AppName")="StoreFrontAE" then
                                                               Response.write getfullpath(arrProduct(7, iRec),0,iSubCat)
                                                            else   
                                                             Response.write  arrProduct(7, iRec)
                                                            end if 
                                                               %><br>
                      <b><font size="<%= C_FONTSIZE4 + 1 %>"><%= arrProduct(1, iRec) %></b><br>
                      <b><%= C_Description %>:</b>&nbsp;<%If arrProduct(11, iRec) <> "" Then%><%= arrProduct(11, iRec) %><%Else%><%= arrProduct(8, iRec) %><%End If%><br>
                      
					  
			
					  <b><%= C_Price %>:</b>&nbsp;
	
	
							<% 
						
							conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
									"Data Source=" & server.mappath(DatabasePath) & ";" & _
									"User Id=;Password=;" '& _ 
									sql = "select * from sfProducts where ProdID =  '" &   arrProduct(0, iRec)  & "'"
									'response.write(sql)
									Set rsx = Server.CreateObject("ADODB.Recordset")
									 rsx.Open sql, conn, 3, 3   

									ProdCustID = rsx("CustID")
									ProdSellStore = rsx("ProdSellStore")

									If ProdSellStore = false  Then %>
												<br>Please contact the seller to learn more:<br>
												

												<% 
									
									 sql = "select * from sfCustomers where custID =  " & ProdCustID

									'response.write (sql)
									  Set rs2 = Server.CreateObject("ADODB.Recordset")
									  rs2.Open sql, conn, 3, 3   
									  If not rs2.eof then
											custFirstName = rs2("custFirstName")
											custLastname = rs2("custLastName")
											custCity = rs2("custCity")
											custState = rs2("custState")
											custPhone = rs2("custPhone")
											custEmail = rs2("custEmail")
											%>
											
											&nbsp;&nbsp;<%=custFirstName%>&nbsp;<%=custLastName%><br>
											<% If Len(custCity) > 1 Then %>
											&nbsp;&nbsp;<%=custCity%>
											<% End If %>
											<% If Len(custState) > 1 Then %>
												, &nbsp;<%=custState%><br>
											<% End If %>
											<% If Len(custPhone) > 1 Then %>
											&nbsp;&nbsp;Phone: <%=custPhone%><br>
											<% End If %>
											&nbsp;&nbsp;Email: <a href = "mailto:<%=custEmail%>" class = "body"><%=custEmail%></a>
								      <% 	End If %>
								<% Else %>

								

			          <% If iConverion = 1 Then
					If arrProduct(5, iRec) = 1 Then 
							Response.Write "<i><strike><script>document.write(""" & FormatCurrency(arrProduct(4, iRec)) & " = ("" + OANDAconvert(" & trim(arrProduct(4, iRec)) & "," & chr(34) & CurrencyISO & chr(34) & ") + "")"");</script></strike></i><br>"
							Response.Write "<font color=#FF0000><b>" & C_SPrice & ": <script>document.write(""" & FormatCurrency(arrProduct(6, iRec)) & " = ("" + OANDAconvert(" & trim(arrProduct(6, iRec)) & ", " & chr(34) & CurrencyISO & chr(34) & ")+ "")"");</script></b><br>"
							Response.Write "<font color=#FF0000><i>" & C_YSave & ": <script>document.write(""" & FormatCurrency(CDbl(arrProduct(4, iRec))-CDbl(arrProduct(6, iRec))) & " = ("" + OANDAconvert(" & trim(CDbl(arrProduct(4, iRec))-CDbl(arrProduct(6, iRec))) & ", " & chr(34) & CurrencyISO & chr(34) & ")+ "")"");</script></i><br>"
					Else
							Response.Write "<script>document.write(""" & FormatCurrency(arrProduct(4, iRec)) & " = ("" + OANDAconvert(" & trim(arrProduct(4, iRec)) & ", " & chr(34) & CurrencyISO & chr(34) & ")+ "")"");</script>"
					End If 
			   Else
					If arrProduct(5, iRec) = 1 Then 
							Response.Write "<i><strike>" & FormatCurrency(arrProduct(4, iRec)) & "</strike></i><br>"
							Response.Write "<font color=#FF0000><b>" & C_SPrice & ": " & FormatCurrency(arrProduct(6, iRec)) & "</b><br>"
							Response.Write "<font color=#FF0000><i>" & C_YSave & ": " & FormatCurrency(CDbl(arrProduct(4, iRec))-CDbl(arrProduct(6, iRec))) & "</i><br>"
					Else
							Response.Write FormatCurrency(arrProduct(4, iRec))
					End If 
			   End If
			   	
			%>
				  <% SearchResults_GetProductInventory arrProduct(0, iRec) 'SFAE %>								
				  <% SearchResults_ShowMTPricesLink arrProduct(0, iRec) 'SFAE%> 
				  
			          <br>
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
                          <td align="right"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 %>"><%= arrAtt(1, iAttCounter) %></td>
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
                            </select></td>
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
					  
                      <p align="center"><center><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 %>"><%= C_Quantity %>: <input style="<%= C_FORMDESIGN %>"  type="text" name="QUANTITY" title="Quantity" size="3"><br>
                      <%SearchResults_GetGiftWrap arrProduct(0, iRec) 'SFAE%>
                      <input type="image" name="AddProduct" border="0" src="images/AddToCart.jpg" alt="Add To Cart"><br>
                      <% If iSaveCartActive = 1 Then
                      if Application("AppName")="StoreFrontAE" then%>
                      <input type="image" name="SaveCart" border="0" src="images/WishList.jpg" alt="Add to Wish List">
                      <%else%>
                      <input type="image" name="SaveCart" border="0" src="images/SaveToCart.jpg" alt="Save To Cart">
                      <%end if%>

                      <%
       
        
		iEmailActive = 0   
        If iEmailActive = 1 Then
        %>
                      <a href="javascript:emailFriend('<%= server.urlencode(arrProduct(0, iRec)) %>')"><img border="0" src="images/emailfriend.jpg" alt="Email a Friend"></a>
                      <% End If %>


   <% End If %><br>
					 <center>
<%= arrProduct(1, iRec) %>

					 <form target="_paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
		
	<input type="hidden" name="add" value="1">
	Quantity1:<input type="text" name="quantity" >
<input type="hidden" name="cmd" value="_cart">
<input type="hidden" name="business" value="jhartwig@clearwire.net">
<input type="hidden" name="item_name" value="<%= arrProduct(1, iRec) %>">
<input type="hidden" name="amount" value="<%=FormatCurrency(arrProduct(4, iRec))%> ">
<input type="hidden" name="no_shipping" value="0">
<input type="hidden" name="no_note" value="1">
<input type="hidden" name="currency_code" value="USD">
<input type="hidden" name="lc" value="US">
<input type="hidden" name="bn" value="PP-ShopCartBF">
<input type="hidden" name="return" value="http://www.ArtisanBarn.org/completion.asp">
<input type="hidden" name="cancel_return" value="http://www.ArtisanBarn.org/signup.asp">


<input type=submit   border="0" name="submit1"  Value = "Add to Cart1" >&nbsp;&nbsp;

</form> 


					 <form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
										<input type="hidden" name="cmd" value="_cart">
										<input type="hidden" name="business" value="jhartwig@clearwire.net">
									
										<input type="hidden" name="display" value="1">
										<input type="image" src="images/CheckOut.jpg" alt="Submit button" border="0" name="submit"  Value = "View Cart"  >

									</form>
					 
					 
				
                      </center></p>
					  <%  End If %>
                    </td>
                    <%  If iDesign = "2" Then %>            
		            <td width="30%" align="center"><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><%If txtImagePath <> "" Then%><img border="1" width = "200" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link<%End If%></a><br>
                    </td>
                    <%  ElseIf iDesign = "3" And (iDesignCounter / 2) <> Int(iDesignCounter / 2) Then %>
		            <td width="30%" align="center"><% If Trim(arrProduct(3, iRec)) <> "" Then %><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><% End If %><%If txtImagePath <> "" Then%><img border="1" width = "300" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link<%End If%><% If Trim(arrProduct(3, iRec)) <> "" Then %></a><% End If %><br>
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
If iNumOfPages <> 1 And iNumOfPages <> 0 Then Response.Write bottomPaging(iPage, iPageSize, iSearchRecordCount, iNumOfPages, "Search")
                ' -------------------------------------------   
                ' SEARCH RESULT PAGING OUTPUT ::: END -------
                ' -------------------------------------------
%>
                        </p>


						
                      </td>
                    </tr>
                  </table>
    
                  <!--#include file="footer.asp"-->
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
           if Application("AppName")="StoreFrontAE" then 
                  %>
                    <form method="get" action="search_results.asp"  name="drilMe"> 
                     <input type="hidden" name="txtsearchParamType" value="<%= txtsearchParamType%>">
                    <input type="hidden" name="txtsearchParamCat" value="<%= txtsearchParamCat%>">
                    <input type="hidden" name="txtsearchParamMan" value="<%= txtsearchParamMan%>">
                    <input type="hidden" name="txtsearchParamVen" value="<%= txtsearchParamVen%>">
                    <input type="hidden" name="txtDateAddedStart" value="<%= txtDateAddedStart%>">
                    <input type="hidden" name="txtPriceEnd" value="<%= txtPriceEnd%>">
                    <input type="hidden" name="txtPriceStart" value="<%= txtPriceStart%>">
                    <input type="hidden" name="txtSale" value="<%= txtSale%>">
                    <input type="hidden" name="txtsearchParamTxt" value="<%=txtsearchParamTxt%>">
                    <input type="hidden" name="txtFromSearch" value="">
                    <input type="hidden" name="subcat" value="">
                     <input type="hidden" name="iLevel" value="<%= iLevel%>">   
                     <input type="hidden" name="txtCatName" value="<%= iLevel%>">   
                   </form>
               <SCRIPT LANGUAGE=javascript>
					<!--
					function drillmore(vId)
				 	  {
				 	    if(vId != "Drill me")
					    {
					     document.drilMe.subcat.value =vId
					     document.drilMe.submit() 
					    }
					  }
					//-->
    			</SCRIPT>

          <%end if  %>
























