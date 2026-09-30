<%@ Language=VBScript %>

<%
	option explicit
	Response.Buffer = True

	'@BEGINVERSIONINFO


	'@APPVERSION: 5.3001.0.2

	'@FILENAME: cssearch_results.asp
 

	

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
Response.Write SQL
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
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Club Sunglass, inc.</title>
<meta name="GENERATOR" content="Microsoft FrontPage 4.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
<link rel="stylesheet" type="text/css" href="/style.css">

<SCRIPT language="javascript" src="SFLib/sfCheckErrors.js"></SCRIPT>
<SCRIPT language="javascript" src="/store/SFLib/sfEmailFriend.js"></SCRIPT>
</head>
<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" border=0 	cellpadding=0 cellspacing=0 >


<table border="0" cellpadding="0" cellspacing="0" width="790" bgcolor="white" align="center" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" >
	<tr>
		<td colspan = "3">

		</td>
	</tr>
	<tr>
		<td class="menu"  nowrap bgcolor = "#ecf0f7" width = "130">

		</td>
		<td >
      <table width="100%" border="0" cellspacing="1" cellpadding="2">
       
       
        <tr>
          <!-- ### SEARCH RESULT QUERY OUTPUT ::: BEGIN ### -->    
          <td align="middle" background="<%= C_BKGRND3 %>"  bgcolor="<%= C_BGCOLOR3 %>" class = "body"> <h2><%= txtCatName %></h2>
		  
		  <% If trim(txtCatName) = "Driving Sunglasses" then%>
				<span class = "body" align = "center">Our signature driving sunglasses have ultra-clear, copper lenses that filter out 100% of UVA, UVB and blue-light rays giving you superb clarity and depth perception.  The built in glare reducer changes in all weather conditions allowing your eyes to feel relaxed and unstrained in high sun as well as low-light areas.  Every pair comes with a <a href = "Warranty.asp" class = "body">life time warranty</a> that covers any damage that may occur.</span>
		<%end if%>


 <% If trim(txtCatName) = "Fashion Sunglasses" then%>
				<span class = "body" align = "center">
Al l of our fashion sunglasses block out 100% of UVA and UVB to give you total sun protection and come with various lens tinting and colors to match any preference you may have.  Our fashion sunglasses are the most up to date styles you can find so you are virtually guaranteed to look great in any one you choose.</span>
		<%end if%>


 <% If trim(txtCatName) = "Polarized Lenses" then%>
				<span class = "body" align = "center">
Polarized sunglasses are excellent for reducing glare off highly reflective surfaces such as water, ice, snow and automobiles.  Fisherman and outdoor enthusiasts love these types of lenses because they actually allow you to see clearly into water and spot the fish!</span>
		<%end if%>



 <% If trim(txtCatName) = "Kids Sunglasses" then%>
				<span class = "body" align = "center">
Research has shown that children need eye protection even more than adults do as they are still developing.  All of our kid’s glasses block 100% UVA and UVB and keep your child’s eyes safe.  Even the pastel or colored lenses will completely protect their eyes from damaging UV rays while still being fun to wear.</span>
		<%end if%>



 <% If trim(txtCatName) = "Clip-Ons" then%>
				<span class = "body" align = "center">
DON’T KNOW YOUR SIZE?  HERE’S THE SOLUTION!<br>
If you are having trouble figuring out what millimeter size will fit your glasses just follow these simple instructions: Trace around your frames on a piece of paper and send it to us along with your e-mail, address and frame color desired (our address can be found at the bottom of this page or on our contact page).  We can then fit your glasses exactly and send you the appropriate size.  If you have any questions just e-mail us and we’ll help you sort out any difficulty.</span>
		<%end if%>



 <% If trim(txtCatName) = "Specials" then%>
				<span class = "body" align = "center">
We like to offer specials and great deals to our customers as a way for them to save money and thank you for your business.  All of the sunglasses on this page block out 100% UVA and UVB and any that have our <a href = "Warranty.asp" class = "body">driving lenses are fully guaranteed</a>.  Check back to our site periodically as these will be changing on a regular basis. </span>
		<%end if%>




		  
		  
		  </td>
          <!-- ### SEARCH RESULT QUERY OUTPUT ::: END ### -->            
        </tr>
           <%If trim(sNextLevel) <> ""   Then%> 
           
        <tr>

         <td align="middle" background="<%= C_BKGRND3 %>"  bgcolor="<%= C_BGCOLOR3 %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" SIZE="<%= C_FONTSIZE3-1 %>">
           <form name=Drilldown>
           <select size="1" name="subcat" style="<%= C_FORMDESIGN %>" onchange="drillmore(this.options[this.options.selectedIndex].value)" >
             <option value="Drill me">Refine Search</option><%= sNextLevel %>
           </select>
        </form>
         </td>
        
        </tr>
        
          <%End if%>

        
        <tr>
          <td background="<%= C_BKGRND4 %>"  bgcolor="<%= C_BGCOLOR4 %>">
            <table border="0" width="100%">
              <tr>
	   <td width="100%"><p align="right"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 - 1 %>">
           
       <%
        If iNumOfPages <> 1 And iNumOfPages <> 0 Then  Response.Write bottomPaging(iPage, iPageSize, iSearchRecordCount, iNumOfPages, "Search")
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
        & "<td><center><font face=" & C_FONTFACE4 & " color=" & C_FONTCOLOR4 & " SIZE=" & C_FONTSIZE4 + 2 & ">Sorry, No Matching Records Returned!</font></center></td></tr>" _
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
                    txtImagePath = arrProduct(2, iRec)
                Else
                    txtImagePath = ""
                End If
      			icounter = 1 

%>				
			  

                
                <table border="0" width="100%" background="<%= C_BKGRND4 %>" >
					
                 <form method="post" name="<%= arrProduct(0, iRec)%>" action="<%= C_HomePath %>addproduct.asp" onSubmit="this.QUANTITY.quantityBox=true;return sfCheck(this);">
                  <input TYPE="hidden" NAME="PRODUCT_ID" VALUE="<%= arrProduct(0, iRec)%>">         
                
                  <tr>

                    <% If iDesign = "1" Then %>            
                    <td width="30%" align="center" valign = "top"><% If Trim(arrProduct(3, iRec)) <> "" Then %><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><% End If %><%If txtImagePath <> "" Then%><img border="1" valign = "top" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link <%End If%><% If Trim(arrProduct(3, iRec)) <> "" Then %></a><% End If %><br>
                    </td>
                    <% ElseIf iDesign = "3" And (iDesignCounter / 2) = Int(iDesignCounter / 2) Then%>
		            <td width="30%" align="center" valign = "top"><% If Trim(arrProduct(3, iRec)) <> "" Then %><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><% End If %><%If txtImagePath <> "" Then%><br><img valign = "top" border="1" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link<%End If%><% If Trim(arrProduct(3, iRec)) <> "" Then %></a><% End If %><br>
                    </td>
                    <% End If %>
                    <td width="70%" valign="top"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" SIZE="<%= C_FONTSIZE4 %>">
                      <b><%= C_ProductID %>:</b>&nbsp;<%= arrProduct(0, iRec) %>&nbsp;&nbsp;&nbsp;
                      <b><%= C_CategoryNameS %>:</b>&nbsp;<%if Application("AppName")="StoreFrontAE" then
                                                               Response.write getfullpath(arrProduct(7, iRec),0,iSubCat)
                                                            else   
                                                             Response.write  arrProduct(7, iRec)
                                                            end if 
                                                               %><br>
                      <b><font size="<%= C_FONTSIZE4 + 1 %>"><%= arrProduct(1, iRec) %></font></b><br>
                      <b><%= C_Description %>:</b>&nbsp;<%If arrProduct(11, iRec) <> "" Then%><%= arrProduct(11, iRec) %><%Else%><%= arrProduct(8, iRec) %><%End If%><br>
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
			%>
				  <% SearchResults_GetProductInventory arrProduct(0, iRec) 'SFAE %>								
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
								<input type="image" name="AddProduct" border="0" src="<%= C_BTN03 %>" alt="Add To Cart">
						<br>	
								
                      <% If iSaveCartActive = 1 Then
                      if Application("AppName")="StoreFrontAE" then%>
                      <input type="image" name="SaveCart" border="0" src="<%= C_BTN02 %>" alt="Add to Wish List">
                      <%else%>
                      <input type="image" name="SaveCart" border="0" src="<%= C_BTN02 %>" alt="Save To Cart">
                      <%end if%>
                      <%
        End if
        If iEmailActive = 1 Then
        %>
                      <a href="javascript:emailFriend('<%= server.urlencode(arrProduct(0, iRec)) %>')"><img border="0" src="<%= C_BTN24 %>" alt="Email a Friend"></a><br>
					   <div align ="center"><a href= "<%= C_HomePath %>order.asp"><img src= "<%= C_BTN10 %>" border="0" align="center"  alt="Check Out" ></a></div>
						
							
					
                      <% End If %>
                      </center></p>
                    </td>
                    <%  If iDesign = "2" Then %>            
		            <td width="30%" align="center" valign = "top"><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><%If txtImagePath <> "" Then%><br><img border="1" valign = "top"src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link<%End If%></a>	</td><br>
                    </td>
                    <%  ElseIf iDesign = "3" And (iDesignCounter / 2) <> Int(iDesignCounter / 2) Then %>
		            <td width="30%" align="center" valign = "top"><% If Trim(arrProduct(3, iRec)) <> "" Then %><a href="<%= replace(arrProduct(3, iRec)," ","+") %>"><% End If %><%If txtImagePath <> "" Then%><br><img border="1" valign = "top" src="<%= txtImagePath %>"><%ElseIf Trim(arrProduct(3, iRec)) <> "" Then %>Link<%End If%><% If Trim(arrProduct(3, iRec)) <> "" Then %></a><% End If %><br>
                   
				
                 
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
                        </font></p>
                      </td>
                    </tr>
                  </table>
    </td>
	</tr>
	
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
                    <form method="get" action="cssearch_results.asp"  name="drilMe"> 
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
























