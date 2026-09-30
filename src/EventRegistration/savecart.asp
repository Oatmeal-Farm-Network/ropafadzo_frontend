<% 
   Option Explicit
   Response.Buffer=True       
   Const vDebug = 0  
%>
<!--#include file="SFLib/db.conn.open.asp"-->
<!--#include file="SFLib/adovbs.inc"-->
<!--#include file="error_trap.asp"-->
<!--#include file="sfLib/incDesign.asp"-->
<!--#include file="SFLib/incGeneral.asp"-->
<!--#include file="SFLib/incAddProduct.asp"-->
<!--#include file="SFLIB/incAE.asp"-->
<!--#include file="SFLIB/incAE.js"-->
<%
'@BEGINVERSIONINFO

'@APPVERSION: 50.3007.0.1

'@FILENAME: savecart.asp
 


'@DESCRIPTION: Displayes all products on sale

'@STARTCOPYRIGHT
'The contents of this file is protected under the United States
'copyright laws and is confidential and proprietary to
'LaGarde, Incorporated.  Its use or disclosure in whole or in part without the
'expressed written permission of LaGarde, Incorporated is expressly prohibited.
'
'(c) Copyright 2000, 2001 by LaGarde, Incorporated.  All rights reserved.
'@ENDCOPYRIGHT

'@ENDVERSIONINFO
'Modified 10/25/01 
'Storefront Ref#'s: 177 'JF
'-------------------------------------------------------
' Check if custID exists 
'-------------------------------------------------------
Dim bCustIdExists, iCustID
Dim CurrencyISO 
CurrencyISO = getCurrencyISO(Session.LCID )
iCustID = Request.Cookies("sfCustomer")("custID")
If iCustID <> "" Then
	   	bCustIdExists = CheckCustomerExists(iCustID)
    	If bCustIdExists = false Then
    		Response.Cookies("sfCustomer")("CustID") = ""
	   		Response.Cookies("sfCustomer").Expires = NOW()
	   	Else
			Response.Cookies("sfCustomer")("CustID") = iCustID
			Response.Cookies("sfCustomer").Expires = Date() + 730
		End If
End If	

If Request.Cookies("sfOrder")("SessionID") = Session("SessionID") AND Request.Cookies("sfOrder")("SessionID") <> ""  AND bCustIdExists Then
	bLoggedIn = true
End If

'-------------------------------------------------------
' If login button is depressed
'-------------------------------------------------------
Dim sCondition, sEmail, sPassword, iAuthenticate, bLoggedIn
If Trim(Request.Form("btnLogin.x")) <> "" Then
	sEmail			= Trim(Request.Form("Email"))
	sPassword		= Trim(Request.Form("Password"))
	
	' Authenticate
	iCustID = customerAuth(sEmail,sPassword,"loose")
		
	If iCustID > 0 AND iCustID <> ""  Then
		
'		If Request.Cookies("sfCustomer")("custID") <> "" AND TRIM(iCustID) <> TRIM(Request.Cookies("sfCustomer")("CustID"))  Then
'
'			Dim bSvdCartCust
'			bSvdCartCust = CheckSavedCartCustomer(Request.Cookies("sfCustomer")("custID"))
'			
'			If vDebug = 1 Then Response.write "Saved Cart Cust?" & Request.Cookies("sfCustomer")("custID") & "False?" & bSvdCartCust 
'			If bSvdCartCust Then
'				' Delete SvdCartCustomer Row
'				Call DeleteCustRow(Request.Cookies("sfCustomer")("custID"))
'				' See if saved cart has any remaining saved
'				Call setUpdateSavedCartCustID(iCustID,Request.Cookies("sfCustomer")("custID"))
'			End If
'		End If	
		Response.Cookies("sfOrder")("SessionID") = Session("SessionID")
		Response.Cookies("sfOrder").Expires = Date() + 1
		Response.Cookies("sfCustomer")("custID") = iCustID 
		Response.Cookies("sfCustomer").Expires = Date() + 730
		Session("CustID") = iCustID 
		bLoggedIn = true
		
	Else 	
		If customerAuth(sEmail,sPassword,"loosest") > 0 Then
			sCondition = "EmailMatch"   
			Response.Cookies("sfCustomer").Expires = Now()
		Else 
			sCondition = "WrongCombination"
			Response.Cookies("sfCustomer").Expires = Now()		
		End If			
	End If			
ElseIf Trim(Request.Form("SignUp.x")) <> "" Then	
	sEmail			= Trim(Request.Form("Email"))
	sPassword		= Trim(Request.Form("Password"))
	
	' Authenticate
	iCustID	= customerAuth(sEmail,sPassword,"loose")
	If iCustID > 0 Then
		Response.Cookies("sfOrder")("SessionID") = Session("SessionID")
		Response.Cookies("sfOrder").Expires = Date() + 1
		Response.Cookies("sfCustomer")("custID") = iCustID
		Response.Cookies("sfCustomer").Expires = Date() + 730
		Session("custID") = iCustID
		bLoggedIn = true
	Else
		iCustID = getSvdCustomer(sEmail,sPassword)
		Response.Cookies("sfOrder")("SessionID") = Session("SessionID")
		Response.Cookies("sfOrder").Expires = Date() + 1
		Response.Cookies("sfCustomer")("custID") = iCustID 		
		Response.Cookies("sfCustomer").Expires = Date() + 730
		Session("custID") = iCustID
		bLoggedIn = true
	End If	
End If	

If iConverion = 1 Then Response.Write "<script language=""JavaScript"" src=""http://www.oanda.com/cgi-bin/fxcommerce/fxcommerce.js?user=" & sUserName & """></script>"


%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>SF Save Cart Page</title>
<script language="javascript" src="SFLib/sfCheckErrors.js"></script>
</head>
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
          <td align="center" background="<%= C_BKGRND2 %>" bgcolor="<%= C_BGCOLOR2 %>"><b><font face="<%= C_FONTFACE2 %>" color="<%= C_FONTCOLOR2 %>" SIZE="<%= C_FONTSIZE2 %>">Your <%=Application("CartName")%></font></b></td>
        </tr>
        <tr>
          <td background="<%= C_BKGRND3 %>" bgcolor="<%= C_BGCOLOR3 %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" size="<%= C_FONTSIZE3 %>">Please review your <%=Application("CartName")%> items as shown below. To modify the quantity of any item, simply input the desired quantity and select the
            <b>Recalculate <%=Application("CartName")%></b> button. To delete an item click on <b>DELETE</b>. To ADD an item to your order 
             for purchase, click on <b>ADD</b>.
      If you want to add new items, you can do so by pressing RETURN TO SHOP and click on <%=Application("CartSaveButton")%> for the appropriate product.
      You can access your <%=Application("CartName")%> at any time.</font>
        </tr>
        <tr>
          <td bgcolor="<%= C_BGCOLOR4 %>" background="<%= C_BKGRND4 %>">        
            <table border="0" width="100%" cellspacing="0" cellpadding="4">
              <tr>
                <td width="40%" bgcolor="<%= C_BGCOLOR5 %>"><b><font face="<%= C_FONTFACE5 %>" color="<%= C_FONTCOLOR5 %>" SIZE="<%= C_FONTSIZE5 %>">product</font></b></td>
                <td width="15%" align="center" bgcolor="<%= C_BGCOLOR5 %>"><b><font face="<%= C_FONTFACE5 %>" color="<%= C_FONTCOLOR5 %>" SIZE="<%= C_FONTSIZE5 %>">unit price</font></b></td>
                <td width="15%" align="center" bgcolor="<%= C_BGCOLOR5 %>"><b><font face="<%= C_FONTFACE5 %>" color="<%= C_FONTCOLOR5 %>" SIZE="<%= C_FONTSIZE5 %>">qty</font></b></td>
                <td width="15%" align="center" bgcolor="<%= C_BGCOLOR5 %>"><b><font face="<%= C_FONTFACE5 %>" color="<%= C_FONTCOLOR5 %>" SIZE="<%= C_FONTSIZE5 %>">price</font></b></td>
                <td width="15%" align="center" bgcolor="<%= C_BGCOLOR5 %>"><b><font face="<%= C_FONTFACE5 %>" color="<%= C_FONTCOLOR5 %>" SIZE="<%= C_FONTSIZE5 %>">action</font></b></td>
              </tr>
              <%
'@BEGINCODE
'-----------------------------------------------------------
' BEGIN PRODUCT DETAIL OUTPUT ------------------------------
' Note: will need code to alternate the colors between:
' C_ALTBGCOLOR1 and C_ALTBGCOLOR2 (and other items)
'-----------------------------------------------------------

Dim sSql, rsAllSvdOrders, sProdID, aProduct, aProdAttr, sProdName, sProdPrice, iProdAttrNum, iCounter 
Dim sAttrUnitPrice, sUnitPrice, iQuantity, iNewQuantity, sProductSubtotal, dProductSubtotal, dTotalPrice, iSvdOrderID, aProdAttrID, sTotalPrice, sProductPrice
Dim iProductCounter, sBgColor, sFontFace, sFontColor, iFontSize
Dim sPaymentList, bHasProducts, sBtnAction, sAddCart, sDelete, iTmpCartID,sRecalculate, iAddFind, iDeleteFind, sReferer
Dim sErrorDescription, sSearchPath, aProdValues, iShip 
Dim bProd_Inactive	
	' Determine action and OrderID
	For iCounter = 1 to Request.Form("iProductCounter")
		sAddCart = Request.Form("AddToCart" & iCounter & ".x")
			If sAddCart <> "" Then  
				iAddFind = iCounter
				sBtnAction = "AddToCart"
				Exit For
			End If	
		
		sDelete	= Request.Form("DeleteFromOrder" & iCounter & ".x")		
			If sDelete <> "" Then
				iDeleteFind = iCounter
				sBtnAction = "DeleteFromCart"
				Exit For
			End If	
	Next 
	' Determine if it is recalculate action
	sRecalculate  = Request.Form("Recalculate.x") 
	If sRecalculate <> "" Then
		sBtnAction = "Recalculate"	
	End If	 	

	' Recalculate subtotal
	If sBtnAction = "Recalculate" Then
			Dim iTmpOrderID, iOldQuantity 		
			For iCounter = 1 To Request.Form("iProductCounter") 			
				iNewQuantity = Request.Form("FormQuantity" & iCounter)
				iOldQuantity = Request.Form("iQuantity" & iCounter)
				iSvdOrderID = Request.Form("iSvdOrderID" & iCounter)
			if not isnumeric(iNewQuantity) or trim(iNewQuantity) ="" then
	               iNewQuantity = iOldQuantity
	           end if 
				If iNewQuantity <> "" Then 				
					If iNewQuantity = 0 Then
						' Delete if 0
						Call setDeleteOrder("odrdtsvd",iSvdOrderID)
					ElseIf iNewQuantity <> iOldQuantity Then						
						' Update Quantity For Product
						Call setReplaceQuantity("odrdtsvd",iNewQuantity,iSvdOrderID)					
					End If
				Else
					' Delete if Null Value
					Call setDeleteOrder("odrdtsvd",iSvdOrderID)
				End If	
			Next	
	
	' Save to Cart
	ElseIf sBtnAction = "AddToCart" Then
			sProdID = Request.Form("sProdID" & iAddFind)
			iSvdOrderID = Request.Form("iSvdOrderID" & iAddFind)
			iQuantity = Request.Form("iQuantity" & iAddFind)	  
			iProdAttrNum = Request.Form("iProdAttrNum" & iAddFind)
			iCustID = Request.Cookies("sfCustomer")("custID")
	  		sReferer = Session("HttpReferer")
	  		iNewQuantity = Request.Form("FormQuantity" & iAddFind)
	  		aProdValues = getProdValues(sProdID,iQuantity)		

	  		iShip = aProdValues(3)

	  		 ' Check to see if custID exists in customer table
		    If iCustID <> "" Then
		    	bCustIdExists = CheckCustomerExists(iCustID)
		    	If bCustIdExists = false Then
		    		Response.Cookies("sfCustomer")("custID") = ""
		    		Response.Cookies("sfCustomer").Expires = NOW()
		    	End If	
		    End If
	  		  
	  		' In the case that one types in a new quantity and hits add 
	  		If iNewQuantity <> iQuantity And iNewQuantity <> "" Then
	  			iQuantity = iNewQuantity
	  		End If	  
	  		  
			If iProdAttrNum <> "" AND iProdAttrNum > 0 Then
			   Redim aProdAttr(iProdAttrNum)
			   aProdAttr = getProdAttr("odrattrsvd",iSvdOrderID,iProdAttrNum)  	  	  	  	  
			End If		
	  		  	  
			iTmpCartID = getOrderID("odrdttmp","odrattrtmp", sProdID,aProdAttr,cInt(iProdAttrNum))					

			If iTmpCartID <> "" Then
					' New Row in SavedCartDetails
					If iTmpCartID < 0 Then									
							' Write as new row
			  				iTmpCartID = getTmpTable(aProdAttr,sProdID,iQuantity,sReferer, iShip)
					
					' Existing cart
					Else				
							' Update Quantity
							Call setUpdateQuantity("odrdttmp",iQuantity,iTmpCartID)
					' End existing saved cart If					
					End If		
			Else
				Response.Write "<p>Number of attributes not equal to the product specs or database writing error"			
				' ++ Response.Redirect("error.asp")
			' End iTmpCartID Null If
			End If	
		
			SaveCart_WriteSvdtmpAERecord  'SFAE
			
			' delete from sfSavedOrderDetails
			
			Call setDeleteOrder("odrdtsvd",iSvdOrderID)

	ElseIf sBtnAction = "DeleteFromCart" Then
			' Remove from cart
			
			iSvdOrderID = Request.Form("iSvdOrderID" & iDeleteFind)	
			Call setDeleteOrder("odrdtsvd",iSvdOrderID)
	End If
	
		iProductCounter = 0	
		dTotalPrice = 0 
		
		
	'-----------------------------------------------------------------
	' Collect all orders associated with Session ::: Begin
	'-----------------------------------------------------------------
	' Get a RecordSet of all orders
	' Check cookies and other indicators of login
	If (Request.Cookies("sfCustomer")("custID") = "" OR Request.Cookies("sfOrder")("SessionID") = "" OR Request.Cookies("sfOrder")("SessionID") <> Session("SessionID")) Then
	Dim sSubmitAction
	sSubmitAction = "this.form=true;return sfCheck(this);"
	bLoggedIn = false
	%>
			<tr>
			<td colspan="5" width="40%" align="center">		
			<br>	  	
		      	 	<form action="savecart.asp" method="post" onSubmit="javascript:<%= sSubmitAction %>"> 
		        	<table border="0" width="50%" cellpadding="0" cellspacing="1">
		          <tr>
		            <td width="50%" align="center" bgcolor="<%= C_BGCOLOR4 %>" align="center" valign="center">
					  <table border="0" bgcolor="#000000" width="100%" cellpadding="3" cellspacing="1">
						<tr>
						  <td width="100%" align="center" bgcolor="<%= C_BGCOLOR3 %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" size="<%= C_FONTSIZE3 + 1 %>"><b><%=Application("CartName")%> Login</b></font></td>		        
						</tr>
						<% If sCondition = "EmailMatch" Then %>
						<tr>
						  <td width="100%" align="center" bgcolor="<%= C_BGCOLOR4 %>"><font face="<%= C_FONTFACE4 %>" size="<%= C_FONTSIZE4 %>" color="red"><b>Email Match</b></font>
						  <br><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>">Please choose another email account</font></td>	
						  </td>		        
						</tr>

						<% ElseIf sCondition = "WrongCombination" Then %>
						<tr>
						  <td width="100%" align="center" bgcolor="<%= C_BGCOLOR4 %>"><font face="<%= C_FONTFACE4 %>" size="<%= C_FONTSIZE4 %>" color="red"><b>Wrong Combination of email/password</b></font>	        
						  <br><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>">Please try again</font></td>		
						</tr>

						<% End If %>
						<tr>
						  <td width="100%" align="center" valign="center" bgcolor="<%= C_BGCOLOR4 %>">
					        <table border="0" width="100%" cellpadding="2">
							  <tr>
							    <td width="15%" align="right"><b><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>"> E-Mail:</font></b></td>
							    <td width="85%"><input type="text" size="40" name="Email"  title="E-Mail Address" style="<%= C_FORMDESIGN %>"></td>
							  </tr>
							  <tr>
							    <td width="15%" align="right"><b><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>">Password:</font></b></td>
							    <td width="85%"><input type="password" size="40" name="Password" title="Password" style="<%= C_FORMDESIGN %>"></td>
							  </tr>
							  <tr>
							    <td width="100%" align="middle" colspan="2">
							      <input Type="image" src="<%= C_BTN16 %>" name="btnLogin" border="0"><input type="image" src="<%= C_BTN12 %>" width="108" height="21" border="0" name="SignUp">   
							    </td>
							  </tr>
					        </table>					    
						  </td>
						</tr>
						<tr>
						  <td width="100%" align="center" bgcolor="<%= C_BGCOLOR4  %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" size="<%= C_FONTSIZE3 %>"><a href="login.asp?FPWD=true">Forgot your password?</a> <br></font></td>		        
						</tr>
					  </table>
				    </td>
				   </tr>
		        </table>	
		        </form>	
          </td>
			</tr>
			      <%					
	Else		
		iCustID = Request.Cookies("sfCustomer")("custID")  
		Call setCombineProducts(iCustID)
		sSql = "SELECT * FROM sfSavedOrderDetails WHERE odrdtsvdCustID=" & iCustID
		If vDebug = 1 Then 	Response.Write "<br> " & sSql
					
		Set rsAllSvdOrders = cnn.execute(sSql)
		
		' Check for no orders
		If rsAllSvdOrders.EOF Then
			bHasProducts = False	
			%>
	              <tr>
	                <td colspan="5" width="40%" background="<%= C_ALTBKGRND1 %>" bgcolor="<%= C_ALTBGCOLOR1 %>"><font face="<%= C_ALTFONTFACE1 %>" color="<%= C_ALTFONTCOLOR1 %>" SIZE="<%= C_ALTFONTSIZE1 +1 %>">
	                  <p style="margin-top:25pt">
	                  <center><b><font size="+1">No Items in <%=Application("CartName")%></font></b>
	                  <br>Please press return to shop button to begin searching for items.	                  
	                  <br>
	                  </font>
	                  </center> 
				      </td>			
	                </tr>					
			        <%
		Else
			bHasProducts = True
			
			Do While NOT rsAllSvdOrders.EOF
            bProd_Inactive = False
			' Get the ProdIDs
			iSvdOrderID = rsAllSvdOrders.Fields("odrdtsvdID")
			sProdID = rsAllSvdOrders.Fields("odrdtsvdProductID")
			iQuantity = rsAllSvdOrders.Fields("odrdtsvdQuantity")
	    
	    	' Get an array of 3 values from getProduct()
		    '++ On Error Resume Next
			ReDim aProduct(3)
				aProduct = getProduct(sProdID)	
				If  trim(aProduct(0)) ="" Then
				 bProd_Inactive = True
                 aProduct(0) = "No longer Available"  				
				 aProduct(1) = "-"
				 aProduct(2) = "-"
			    End if	 
	  			sProdName = aProduct(0)
	  			sProdPrice = aProduct(1)
	  			iProdAttrNum = aProduct(2)
			' ++ Call CheckForError()
			
			
				' If not an array, then the product does not exist 
				If NOT IsArray(aProduct) Then
					Response.Write "<br>Product Does Not Exist"
					' ++ Needs to MoveNext to iterate through the rest of the order			
				Else
						If NOT IsNumeric(iProdAttrNum)Then 
							iProdAttrNum = 0
						End If	
						
						' Get Associated Attribute IDs in an array
						If iProdAttrNum <> "" Then							
							ReDim aProdAttrID(iProdAttrNum)
							aProdAttrID = getProdAttr("odrattrsvd",iSvdOrderID,iProdAttrNum)	
						End If
		
						' Response Write all Output
						If vDebug = 1 Then 
							Response.Write "<p>Product = " & sProdID & "<br>ProdName = " & sProdName & "<br>ProdPrice = " & sProdPrice & "<br>ProdAttrNum = " & iProdAttrNum
							'Call ShowRow("odrdtsvd","odrattrsvd",iSvdOrderID,sProdID)
							If IsArray(aProdAttrID) Then
								For iCounter = 0 To iProdAttrNum -1 
									Response.Write "<br>Attribute :" & aProdAttrID(iCounter)
								Next			
							End If
					
						End If	 
				
						iProductCounter = iProductCounter + 1
		
						' Do alternating colors and fonts	
						If (iProductCounter mod 2) = 1 Then 
							sBgColor = C_ALTBGCOLOR1
							sFontFace = C_ALTFONTFACE1
							sFontColor = C_ALTFONTCOLOR1
							iFontSize = C_ALTFONTSIZE1
						Else 	
							sBgColor = C_ALTBGCOLOR2
							sFontFace = C_ALTFONTFACE2
							sFontColor = C_ALTFONTCOLOR2
							iFontSize = C_ALTFONTSIZE2
						End If	
		
				%>
	                <tr>
	                  <td nowrap width="40%" valign="top" bgcolor="<%= sBgColor %>"><font face="<%= sFontFace %>" color="<%= sFontColor %>" SIZE="<%= iFontSize %>"><b><%= sProdName %></b></font><br>
	                    <font face="<%= sFontFace %>" color="<%= sFontColor %>" SIZE="<%= iFontSize - 1 %>">
	                    <%
						' Begin with 0
						sAttrUnitPrice = 0
						
						' Iterate Through Attributes
						If iProdAttrNum > 0 And IsArray(aProdAttrID) Then
							Dim sAttrSubtotal, aAttrDetails, sAttrName, sAttrPrice, iAttrType
							For iCounter = 0 To iProdAttrNum - 1 
								aAttrDetails = getAttrDetails(aProdAttrID(iCounter))												
								sAttrName = aAttrDetails(0)
								sAttrPrice = aAttrDetails(1)
								iAttrType = aAttrDetails(2)
							
								' Calculate Subtotal
								sAttrUnitPrice =  getAttrUnitPrice(sAttrUnitPrice,sAttrPrice,iAttrType)								
					%>										                
	                &nbsp;&nbsp;<%=sAttrName%>
	                    <br>                									
					    <%		
							' ProdAttr Loop
							Next
						' Else the attributes don't exist in database.  Best to delete it?
						Elseif iProdAttrNum > 0 And NOT IsArray(aProdAttrID) Then 
							Response.Write "<br>Error: No Attributes found for " & iSvdOrderID
							Response.Write "<br> Deleting from" & Application("CartName") & ". Sorry for the inconvenience."
													
							Call setDeleteOrder("odrdtsvd",iSvdOrderID)
							If vDebug = 1 Then Response.Write "<p><font color=""red"">" & iSvdOrderID & "</font>"						
						' End Product Attribute If
						End If	
						
						' Set Unit Price for Product
						If  bProd_Inactive = False Then 'djp  
								If iConverion = 1 Then
									sUnitPrice = "<script>document.write(""" & FormatCurrency(cDbl(sAttrUnitPrice) + cDbl(sProdPrice)) & " = ("" + OANDAconvert(" & cDbl(sAttrUnitPrice) + cDbl(sProdPrice) & "," & chr(34) & CurrencyISO & chr(34) & ") + "")"");</script>"
								Else
									sUnitPrice = FormatCurrency(cDbl(sAttrUnitPrice) + cDbl(sProdPrice))
								End If
								dProductSubtotal = iQuantity * (cDbl(sAttrUnitPrice) + cDbl(sProdPrice))
								If iConverion = 1 Then
									sProductSubtotal = "<script>document.write(""" & FormatCurrency(dProductSubtotal) & " = ("" + OANDAconvert(" & dProductSubtotal & ", " & chr(34) & CurrencyISO & chr(34) & ") + "")"");</script>"
								Else
									sProductSubtotal = FormatCurrency(dProductSubtotal)
								End If
						     dTotalPrice = dTotalPrice + cDbl(dProductSubtotal)
						 End if    
					%>
	                    </font>
	                  </td>
	                  <form method="POST" action="savecart.asp" id="form2" name="form2">
					    <td width="15%" align="center" bgcolor="<%= sBgColor %>" valign="top" nowrap><font face="<%= C_ALTFONTFACE2 %>" color="<%= C_ALTFONTCOLOR1 %>" SIZE="<%= C_ALTFONTSIZE1 %>"><%= sUnitPrice %></font></td>
					    <td width="15%" align="center" bgcolor="<%= sBgColor %>" valign="top" nowrap><input type="text" style="<%= C_FORMDESIGN %>" name="FormQuantity<%= iProductCounter%>" size="2" value="<%= iQuantity %>"></td>
					    <td width="15%" align="center" bgcolor="<%= sBgColor %>" valign="top" nowrap><font face="<%= C_ALTFONTFACE2 %>" color="<%= C_ALTFONTCOLOR1 %>" SIZE="<%= C_ALTFONTSIZE1 %>"><%= sProductSubtotal %></font></td>
					    <td width="15%" align="center" bgcolor="<%= sBgColor %>" valign="top" nowrap>
					      <input type="hidden" name="sProdID<%= iProductCounter%>" value="<%=sProdID%>">
					      <input type="hidden" name="iSvdOrderID<%= iProductCounter%>" value="<%=iSvdOrderID%>">
					      <input type="hidden" name="iQuantity<%= iProductCounter%>" value="<%=iQuantity%>">
					      <input type="hidden" name="iProdAttrNum<%= iProductCounter%>" value="<%=iProdAttrNum%>">
					      <input type="image" src="<%= C_BTN06 %>" border="0" name="DeleteFromOrder<%= iProductCounter%>"><br>
					      <%If bProd_Inactive = False Then%>
					       <input type="image" border="0" src="<%= C_BTN22 %>" name="AddToCart<%= iProductCounter%>">
					      <%End if%> 
					    </td>	          
	                  </tr>
				      <%
				' End IsArray If
				End If
	
			' Move to next RecordSet
			rsAllSvdOrders.MoveNext		
			
		' loop through recordset	
		Loop
	
	'@ENDCODE

	'-----------------------------------------------------------
	' END PRODUCT DETAIL OUTPUT --------------------------------
	'-----------------------------------------------------------
	%>             
	                  <tr>
	                    <td width="40%"></td>
	                    <td width="15%" align="center" valign="top"></td>
	                    <!--<td width="15%" align="center" valign="top"></td>-->
	                    <td nowrap colspan=2 width="30%" align="center" valign="top"><font face="<%= C_FONTFACE4 %>" color="#ff0000" size="<%= C_FONTSIZE4 %>"></font></td>
	                    <td width="15%" align="center" valign="top">
	                      <input type="hidden" name="iProductCounter" value="<%= iProductCounter%>">
	           	            <input type="image" src="<%= C_BTN14 %>" border="0" name="Recalculate"> 
	                      <p style="line-height:8pt;margin-top:1pt;"><font face="<%= C_FONTFACE3 %>" color="<%= C_ALTFONTCOLOR1 %>" size="<%= C_FONTSIZE3-1 %>">Update <%=Application("CartName")%></font>
	                      </td>
	                    </tr>
	                    <tr>
	                      <td width="100%" colspan="5" align="center">
	                        <hr noshade color="#000000" size="1" width="90%">
	                      </td>
	                    </tr>
	                  </table>	            
	                </form>       
	                <%
	'----------------------------------------------------------- 
	' SUBTOTAL OUTPUT  taken out 'SFUPDATE 
	'-----------------------------------------------------------
	%>
	                <table border="0" width="100%" cellspacing="0" cellpadding="2">
	                 <%
	 ' End rsAllSvdOrders If
	End If

' End Cookie If
End If

	' Determine search path
	If Request.Cookies("sfSearch")("SearchPath") <> "" Then
		sSearchPath = Request.Cookies("sfSearch")("SearchPath")
		If InStr(LCase(sSearchPath), LCase("login.asp")) <> 0 Then
			sSearchPath = "search.asp"
		End If 
	Else
		sSearchPath = "search.asp"
	End If  
	%>               
                          <td width="100%" colspan="5" align="center">
                            <a href="order.asp"><img src="<%= C_BTN10 %>" alt="View Cart" border="0"></a>
                            <a href="<%= sSearchPath %>"><img src="<%= C_BTN09 %>" border="0" alt="Return to Shop"></a>
			                
							 <% If bLoggedIn = true Then %>
							    <form action="login.asp" method="post" id=form1 name=form1><input type="image" src="<%= C_BTN11 %>" name="ChangeCart" border="0"></form>
			                <% End If %>			                         
			                <%SaveCart_ShowEmailWishListButton 'SFAE%>
                            <%If bHasProducts Then %>  
                            <font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4-1 %>">Please Note: None of these items will be in checkout unless you explicitly add them to your
                            order.</font></td>
                          <%End If %>
                        </tr>
                      </table>
       
                    </tr>
                    <!--#include file="footer.txt"-->
                  </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
      <%
closeObj(rsAllSvdOrders)
closeObj(cnn)
%>



