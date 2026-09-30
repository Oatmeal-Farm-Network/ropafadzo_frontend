<% 
   'Option Explicit
   Response.Buffer=True       
   Const vDebug = 0
%>
<!--#include file="SFLib/db.conn.open.asp"-->
<!--#include file="SFLib/adovbs.inc"-->
<!--#include file ="SFLib/incOrder.asp"-->
<!--#include file="error_trap.asp"-->
<!--#include file="sfLib/incDesign.asp"-->
<!--#include file="SFLib/incGeneral.asp"-->
<%
'@BEGINVERSIONINFO

'@APPVERSION: 50.3007.0.1

'@FILENAME: neworder.asp
 

'

'@DESCRIPTION: Retrieves Order

'@STARTCOPYRIGHT
'The contents of this file is protected under the United States
'copyright laws and is confidential and proprietary to
'LaGarde, Incorporated.  Its use or disclosure in whole or in part without the
'expressed written permission of LaGarde, Incorporated is expressly prohibited.
'
'(c) Copyright 2000, 2001 by LaGarde, Incorporated.  All rights reserved.
'@ENDCOPYRIGHT

'@ENDVERSIONINFO

If iConverion = 1 Then Response.Write "<script language=""JavaScript"" src=""http://www.oanda.com/cgi-bin/fxcommerce/fxcommerce.js?user=" & sUserName & """></script>"

'@BEGINCODE
Dim sSql, rsAllOrders, sProdID, aProduct, sProdName, sProdPrice, iProdAttrNum, iCounter, bLoggedIn, sCondition, iAttCounter
Dim sAttrUnitPrice, sUnitPrice, iQuantity, sProductSubtotal, dProductSubtotal, dTotalPrice, iOrderID, aProdAttrID, sEmail, sPassword
Dim iProductCounter, sBgColor, sFontFace, sFontColor, iFontSize,bHasProducts,sBkGrnd, rsProdOrders, iCustID, rsOrderProdAtt
Dim CurrencyISO 
CurrencyISO = getCurrencyISO(Session.LCID )
	' Check Login
	'-------------------------------------------------------
	' Check if custID exists 
	'-------------------------------------------------------
	iCustID = Request.Cookies("sfCustomer")("custiD")
	If iCustID <> "" Then
	 Dim bCustIdExists
	   	bCustIdExists = CheckCustomerExists(iCustID)
    	If bCustIdExists = false Then
    		Response.Cookies("sfCustomer")("custID") = ""
	   		Response.Cookies("sfCustomer").Expires = NOW()
	   	Else
	   		If Request.Cookies("sfCustomer")("custID") = "" Then
				Response.Cookies("sfCustomer")("custID") = iCustID
				Response.Cookies("sfCustomer").Expires = Date() + 730
			End If
		End If
	End If	
	
	'-------------------------------------------------------
	' If login button is depressed
	'-------------------------------------------------------
	If Trim(Request.Form("btnLogin.x")) <> "" Then
	
	sEmail			= Trim(Request.Form("Email"))
	sPassword		= Trim(Request.Form("Password"))
	
	' Authenticate
	iCustID	= customerAuth(sEmail,sPassword,"loose")

	If iCustID > 0 Then
		If Request.Cookies("sfCustomer")("custID") <> "" AND iCustID <> Request.Cookies("sfCustomer")("custID")  Then
			Dim bSvdCartCust
			bSvdCartCust = CheckSavedCartCustomer(Request.Cookies("sfCustomer")("custID"))
			'Response.write "Saved Cart Cust?" & Request.Cookies("sfCustomer")("custID") & "False?" & bSvdCartCust 
			If bSvdCartCust Then
				' Delete SvdCartCustomer Row
				Call DeleteCustRow(Request.Cookies("sfCustomer")("custID"))
				' See if saved cart has any remaining saved
				Call setUpdateSavedCartCustID(iCustID,Request.Cookies("sfCustomer")("custID"))
			End If
		End If	
		Response.Cookies("sfOrder")("SessionID") = Session("SessionID")
		Response.Cookies("sfOrder").Expires = Date() + 1
		Response.Cookies("sfCustomer")("custID") = iCustID
		Response.Cookies("sfCustomer").Expires = Date() + 730
		Session("custID") = iCustID
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
	End If		

	' Determine if it is recalculate action
	' Product counter initialize
	iProductCounter = 0	
	dTotalPrice = 0 
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>StoreFront Retrieve Order Page</title>
<meta name="GENERATOR" content="Microsoft FrontPage 4.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
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
          <td align="center" bgcolor="<%= C_BGCOLOR2 %>" background="<%= C_BKGRND2 %>"><b><font face="<%= C_FONTFACE2 %>" color="<%= C_FONTCOLOR2 %>" SIZE="<%= C_FONTSIZE2 %>">Retrieve Your Order</font></b></td>
        </tr>
        <tr>
          <td bgcolor="<%= C_BGCOLOR3 %>" background="<%= C_BKGRND3 %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" size="<%= C_FONTSIZE3 %>">Your
            previous order is shown below. To add items to your current order,
            select 'Add to Cart'.</font>
          </tr>
          <tr>
            <td bgcolor="<%= C_BGCOLOR4 %>" background="<%= C_BKGRND4 %>">        
              <table border="0" width="100%" cellspacing="0" cellpadding="5">
   <%           
	'-----------------------------------------------------------------
	' Collect all orders associated with Old Order ::: Begin
	'-----------------------------------------------------------------
	' Check cookies and other indicators of login
	If (Request.Cookies("sfCustomer")("custID") = "" OR Request.Cookies("sfOrder")("SessionID") = "" OR Request.Cookies("sfOrder")("SessionID") <> Session("SessionID")) Then
	Dim sSubmitAction
		sSubmitAction = "this.form=true;return sfCheck(this);"
		bLoggedIn = false
		bHasProducts = false
	%>
			    <tr>
			      <td colspan="5" width="40%" align="center">		
			        <br>	  	
		      	 	<form action="neworder.asp" method="post" onSubmit="javascript:<%= sSubmitAction %>"> 
		        	  <table border="0" width="50%" cellpadding="0" cellspacing="1">
		                <tr>
		                  <td width="50%" align="center" bgcolor="<%= C_BGCOLOR4 %>" align="center" valign="center">
					        <table border="0" bgcolor="#000000" width="100%" cellpadding="3" cellspacing="1">
						      <tr>
						        <td width="100%" align="center" bgcolor="<%= C_BGCOLOR3 %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" size="<%= C_FONTSIZE3 + 1 %>"><b>Login</b></font></td>		        
						      </tr>
						      <% If sCondition = "EmailMatch" Then %>
						      <tr>
						        <td width="100%" align="center" bgcolor="<%= C_BGCOLOR4 %>"><font face="<%= C_FONTFACE4 %>" size="<%= C_FONTSIZE4 %>" color="red"><b>Email Match</b></font>
						          <br><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>">Please choose another email account</font></td>	
						  		        
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
							            <input Type="image" src="<%= C_BTN16 %>" name="btnLogin" border="0">   
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
		

			sSql = "SELECT * FROM sfOrders WHERE ordercustID = " & Request.Cookies("sfCustomer")("custID") & " Order by orderID"
			If vDebug = 1 Then Response.Write "<br> " & sSql
			Set rsAllOrders = cnn.execute(sSql)
			
			If rsAllOrders.EOF OR rsAllOrders.BOF Then 
			bHasProducts = False	
	%>
			    <tr>
			      <td colspan="4" width="40%" align="center">		
			        <br>	  	
		      	 	
		        	  <table border="0" width="50%" cellpadding="0" cellspacing="1">
		        	  	  <tr>
						       <td width="100%" height="50" valign="center" align="center" bgcolor="<%= C_BGCOLOR4 %>"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 + 1 %>"><b>No Previous Orders Found</b></font></td>		        
						  </tr>
					<!--<form action="neworder.asp" method="post" onSubmit="javascript:<%= sSubmitAction %>"> 	  
		               <tr>
						       <td width="100%" align="middle" colspan="2">
						           <input Type="image" src="<%= C_BTN16 %>" name="btnLogin" border="0">   
						        </td>
						 </tr>
						 <tr>
						      <td width="100%" align="center" bgcolor="<%= C_BGCOLOR4  %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" size="<%= C_FONTSIZE3 %>"><a href="login.asp?FPWD=true">Forgot your password?</a> <br></font></td>		        
						  </tr>
				 		</form>--> 		  
		              </table>	
		           
			     	</td>
	             	</tr> 		          		
	<%	Else 			
			Do While Not rsAllOrders.EOF
			Dim sTmpOrderID
			sTmpOrderID = rsAllOrders.Fields("orderID")
	%>	
<tr>
	<td valign="bottom" bgcolor="<%= C_BGCOLOR4 %>" background="<%= C_BKGRND4 %>" colspan="5"><b><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 %>">
				  	Order ID: <%= sTmpOrderID %></font>
	</td>
</tr>		
		         <tr>
                  <td width="40%" bgcolor="<%= C_BGCOLOR5 %>" background="<%= C_BKGRND5 %>"><b><font face="<%= C_FONTFACE5 %>" color="<%= C_FONTCOLOR5 %>" SIZE="<%= C_FONTSIZE5 %>">item</font></b></td>
                  <td width="15%" align="center" bgcolor="<%= C_BGCOLOR5 %>" background="<%= C_BKGRND5 %>"><b><font face="<%= C_FONTFACE5 %>" color="<%= C_FONTCOLOR5 %>" SIZE="<%= C_FONTSIZE5 %>">unit price</font></b></td>
                  <td width="15%" align="center" bgcolor="<%= C_BGCOLOR5 %>" background="<%= C_BKGRND5 %>"><b><font face="<%= C_FONTFACE5 %>" color="<%= C_FONTCOLOR5 %>" SIZE="<%= C_FONTSIZE5 %>">qty</font></b></td>
                  <td width="15%" align="center" bgcolor="<%= C_BGCOLOR5 %>" background="<%= C_BKGRND5 %>"><b><font face="<%= C_FONTFACE5 %>" color="<%= C_FONTCOLOR5 %>" SIZE="<%= C_FONTSIZE5 %>">price</font></b></td>
</tr>
			
	<%	
	sSql = "SELECT * FROM sfOrderDetails WHERE odrdtOrderId = " & sTmpOrderID & " Order by odrdtOrderId"
			Set rsProdOrders = cnn.Execute(sSQL)				
				bHasProducts = True
				Do While NOT rsProdOrders.EOF
					iOrderID = rsProdOrders.Fields("odrdtID")
					sProdID = rsProdOrders.Fields("odrdtProductID")
					iQuantity = rsProdOrders.Fields("odrdtQuantity")
					sProdName = rsProdOrders.Fields("odrdtProductName")
					sProdPrice = rsProdOrders.Fields("odrdtPrice")
	    	    			'Get an array of 3 values from getProduct()
				   	'++ On Error Resume Next
					ReDim aProduct(3)
						aProduct = getProduct(sProdID)		
						sCheckProduct = aProduct(0)
	  					iProdAttrNum = aProduct(2)	  			
					'++ Call CheckForError()
					If Trim(sCheckProduct) = "" Then
						sCheckProduct = "deleted"
					End If
					'If not an array, then the product does not exist 
					If NOT IsArray(aProduct) Then
						Response.Write "<br>Product No Longer In Inventory"
						'++ Needs to MoveNext to iterate through the rest of the order			
					Else
						If NOT IsNumeric(iProdAttrNum)Then 
							iProdAttrNum = 0
						End If	
						
						' Response Write all Output
						If vDebug = 1 And IsArray(aProdAttrID) Then 
							Response.Write "<p>Product = " & sProdID & "<br>ProdName = " & sProdName & "<br>ProdPrice = " & sProdPrice & "<br>ProdAttrNum = " & iProdAttrNum
						
							For iCounter = 0 To iProdAttrNum -1 
								Response.Write "<br>Attribute :" & aProdAttrID(iCounter)
							Next			
					
						End If	 
				
						iProductCounter = iProductCounter + 1
		
						' Do alternating colors and fonts	
						If (iProductCounter mod 2) = 1 Then 
							sBgColor = C_ALTBGCOLOR1
							sBkGrnd	= C_ALTBKGRND1
							sFontFace = C_ALTFONTFACE1
							sFontColor = C_ALTFONTCOLOR1
							iFontSize = C_ALTFONTSIZE1
						Else 	
							sBgColor = C_ALTBGCOLOR2
							sBkGrnd	= C_ALTBKGRND2
							sFontFace = C_ALTFONTFACE2
							sFontColor = C_ALTFONTCOLOR2
							iFontSize = C_ALTFONTSIZE2
						End If	
		
					%>
<form name="<%= sProdID %>" action="addproduct.asp" method="post">
	                <tr>
	                  <td width="40%" valign="top" bgcolor="<%= sBgColor %>" background="<%= sBkGrnd %>" nowrap>
	                  <font face="<%= sFontFace %>" color="<%= sFontColor %>" SIZE="<%= iFontSize %>"><b><%= sProdName %></b></font><br>
	                  <font face="<%= sFontFace %>" color="<%= sFontColor %>" SIZE="<%= iFontSize - 1 %>">   
<% 	
	'----------------------------------------------------
	'Get Order Attributes
	'----------------------------------------------------
	sSQL = "SELECT * FROM sfOrderAttributes WHERE odrattrOrderDetailId = " & rsProdOrders.Fields("odrdtID")
	Set rsOrderProdAtt = cnn.execute(sSql)
	Do While Not rsOrderProdAtt.EOF
%>
<%= rsOrderProdAtt.Fields("odrattrName") %>: <%= rsOrderProdAtt.Fields("odrattrAttribute")  %>
<br>
<%
	rsOrderProdAtt.MoveNext
	Loop	
	%>
</td>
	<%
	' Set Unit Price for Product
		If iConverion = 1 Then
			sUnitPrice = "<script>var ihomecurrency;ihomecurrency=OANDAconvert(1, " & chr(34) & CurrencyISO & chr(34) & ");ihomecurrency=ihomecurrency.substring(ihomecurrency.length-7,ihomecurrency.length-4);document.write(""" & FormatCurrency(cDbl(sAttrUnitPrice) + cDbl(sProdPrice)) & " = "" + OANDAconvert(" & cDbl(sAttrUnitPrice) + cDbl(sProdPrice) & ", " & chr(34) & CurrencyISO & chr(34) & ", ihomecurrency) + "" "" + ihomecurrency)</script>"
		Else
			sUnitPrice = FormatCurrency(cDbl(sAttrUnitPrice) + cDbl(sProdPrice))
		End If
	dProductSubtotal = iQuantity * (cDbl(sAttrUnitPrice) + cDbl(sProdPrice))
		If iConverion = 1 Then
			sProductSubtotal = "<script>var ihomecurrency;ihomecurrency=OANDAconvert(1, " & chr(34) & CurrencyISO & chr(34) & ");ihomecurrency=ihomecurrency.substring(ihomecurrency.length-7,ihomecurrency.length-4);document.write(""" & FormatCurrency(dProductSubtotal) & " = "" + OANDAconvert(" & dProductSubtotal & ", " & chr(34) & CurrencyISO & chr(34) & ", ihomecurrency) + "" "" + ihomecurrency)</script>"
		Else
			sProductSubtotal = FormatCurrency(dProductSubtotal)
		End If
	dTotalPrice = dTotalPrice + cDbl(dProductSubtotal)
%>
	              </font>
                   </td>
					  <td width="15%" align="center" bgcolor="<%= sBgColor %>" background="<%= sBkGrnd %>" valign="top" nowrap><font face="<%= C_ALTFONTFACE2 %>" color="<%= C_ALTFONTCOLOR1 %>" SIZE="<%= C_ALTFONTSIZE1 %>"><%= sUnitPrice %></font></td>
					  <td width="15%" align="center" bgcolor="<%= sBgColor %>" background="<%= sBkGrnd %>" valign="top" nowrap><input type="text" style="<%= C_FORMDESIGN %>" size="2" name="QUANTITY" size="2" value="<%= iQuantity %>"></td>
					  <td width="15%" align="center" bgcolor="<%= sBgColor %>" background="<%= sBkGrnd %>" valign="top" nowrap><font face="<%= C_ALTFONTFACE2 %>" color="<%= C_ALTFONTCOLOR1 %>" SIZE="<%= C_ALTFONTSIZE1 %>"><%= sProductSubtotal %></font></td>	          
	                </tr>


	</td>
<%	

	'--------------------------------------------------------------------
	'End Get Order Attributes
	'--------------------------------------------------------------------
	'--------------------------------------------------------------------
	'Get Product Attributes
	'--------------------------------------------------------------------
	
	If sCheckProduct = "deleted" Then
	%>
	<tr>
	<td><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 - 1 %>"><b>This Product is No Longer Available</b></td>
	</tr>
	<% Else
	
	sAttrUnitPrice = 0

	' Iterate Through Attributes
	iAttCounter = 1
	If iProdAttrNum > 0 Then
		Set rsAttribute = Server.CreateObject("ADODB.RecordSet")
		Set rsAttributeDetails = Server.CreateObject("ADODB.RecordSet")
		rsAttribute.CursorLocation = adUseClient
		rsAttributeDetails.CursorLocation = adUseClient
			sSQL = "SELECT * FROM sfAttributes WHERE attrProdId ='" & sProdId & "'"
			rsAttribute.Open sSQL, cnn, adOpenForwardOnly, adLockReadOnly, adCmdText
			While Not rsAttribute.EOF 								
%>                    

<tr>
	<td><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 - 1 %>"><%= rsAttribute("attrName") %>:</td><td>  <select size="1" name="attr<%= iAttCounter %>" style="<%= C_FORMDESIGN %>">
<%
	sSQL = "SELECT * FROM sfAttributeDetail WHERE attrdtAttributeId = " & rsAttribute("attrID")
	rsAttributeDetails.Open sSQL, cnn, adOpenForwardOnly, adLockReadOnly, adCmdText
	While Not rsAttributeDetails.EOF 
	sAmount = ""
		Select Case rsAttributeDetails("attrdtType")
		Case 1 
			sAmount = " (add " & FormatCurrency(rsAttributeDetails("attrdtPrice")) & ")"
		Case 2 
			sAmount = " (subtract " & FormatCurrency(rsAttributeDetails("attrdtPrice")) & ")"
		End Select
%>
	<option value="<%= rsAttributeDetails("attrdtID") %>"><%= rsAttributeDetails("attrdtName") & sAmount %></option>
<%
	rsAttributeDetails.MoveNext 
	Wend 
	rsAttributeDetails.Close 
	iAttCounter = iAttCounter + 1
	rsAttribute.MoveNext 
%>
</select></font><br></td></tr>
</tr>
<%  
	Wend
		rsAttribute.Close 
						
		Set rsAttribute = Nothing
		Set rsAttributeDetails = Nothing	
		rsOrderProdAtt.Close 
		Set rsOrderProdAtt = Nothing
	End If 
%>
<tr>
<td colspan="3">&nbsp;</td>
<td width="15%" align="center" valign="top">
<input type="hidden" name="PRODUCT_ID" value="<%=sProdID%>">
<input type="image" border="0" src="<%= C_BTN03 %>" name="AddProduct">
</td>
</tr>
</form>
<%
	End If
	' End IsArray If
	End If
	
	' Move to next RecordSet
	rsProdOrders.MoveNext		
	' loop through recordset	
	Loop
%>
<tr>
<td colspan="5" width="100%">
<hr size="2" width="100%"> 
</td>
<tr>
<%
	rsAllOrders.MoveNext
	'Loop thorugh next order
	Loop
	' End if not empty orders if
	End If
	
	'-----------------------------------------------------------
	' END PRODUCT DETAIL OUTPUT --------------------------------
	'-----------------------------------------------------------
   ' End rsAllOrders If
	End If %>
	</td>
	</tr>  
</table>	      
     
						<%	If bHasProducts Then %>  
	                	<table border="0" width="100%" cellspacing="0" cellpadding="2">
                      <tr>
                        <td width="100%" colspan="5" align="center">
                          <a href="order.asp"><img src="<%= C_BTN05 %>" alt="View Order" border="0"></a>
                        </td>
                      </tr>
                    	</table>
 						<% End If %>
                  	</td>
                		</tr>
                <!--#include file="footer.txt"-->
                                </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    <%
closeObj(rsAllOrders)
closeObj(cnn)
%>



































































