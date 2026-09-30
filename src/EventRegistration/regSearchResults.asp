<html>

<head>
<!--#Include file="GlobalVariables.asp"-->


<%
iSubject=request.form("Subject") 
If Len(iSubject) < 3 then
	iSubject= Request.QueryString("Subject") 
End If

iState=request.form("State") 
iZip= Request.form("Zip") 
iRegion=request.form("Region") 


'response.write(iSubject)

	CatID=request.form("CatID") 
	If Len(CatID) < 3 then
		CatID= Request.QueryString("CatID") 
	End If


If Len(CatID) < 1 then
   CatID = 0


End If 
'response.write("CatID=")
'Response.write(CatID)
'Response.write("<br>")
%>


<% dim buttonimages(20)
dim buttontitle(20) 
Dim sSize(200)
Dim sExtraCost(200)
Dim cColor(200)
Dim Description
%>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> Store</title>
<META name="description" content="<%= WebSiteName %> Store">
<META name="keywords" content="<%= WebSiteName %> Store">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 

<!--#Include file="RegHeader2.asp"--> 
<%

 sql = "select * from Registrants where regcuistID =" & session("regcustID")
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
		RegFirstName = rs("RegFirstName")
		RegLastName = rs("RegLastName")
		CoRegFirstName = rs("CoRegFirstName")
		CoRegLastName= rs("CoRegLastName")
		sEvent= rs("Event")
		RegEventMonth= rs("RegEventMonth")
		RegEventDay= rs("RegEventDay")
		RegEventYear= rs("RegEventYear")
		regcuistID = rs("regcuistID")
	End If 
If Len(regcuistID)> 0 Then


Else
	response.redirect("registryhome.asp")

End If 

%>
<table border = "0" width = "790" align = "right"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td width = "500" valign = "top">
<table border = "0" width = "500" align = "center"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
  <tr>
    <td class ="body" valign = "top" >
	<h1>Add to Your Registry</h1>



   </td>
    </tr>
	<tr>	<td bgcolor = "black" height = "1"><img src = "images/px.gif" height = "0" width = "0"></td></tr>
	<tr>
		<td class = "body">
			Search by Product Categories:<br>
<%
				Dim CategoryIDList(100)
				Dim CategoryNameList(100)
				subject = "For Sale"

				SCounter = 0
					
					sql = "select * from SFCategories  order by CatName  ;"

			'response.write(sql)
					Set rs = Server.CreateObject("ADODB.Recordset")
					 rs.Open sql, conn, 3, 3 

					While not rs.eof 
						SCounter = SCounter +1 
						
						CategoryIDList(SCounter) = rs("CatID")
						CategoryNameList(SCounter) = rs("CatName")
						'RESPONSE.WRITE(CategoryNameList(SCounter) )
					 rs.movenext
					Wend
					FinalCount = SCounter
				
				rs.Close


		SCounter = 0
		While Scounter < FinalCount
							SCounter = SCounter +1  
							
						
							sql = "select * from sfProducts where ProdSellStore = Yes and prodCategoryId = " & CategoryIDList(SCounter) & ";"
							'response.write(sql)
							Set rs = Server.CreateObject("ADODB.Recordset")
							rs.Open sql, conn, 3, 3 
							
						If rs.recordcount > 1 then
						%>
					
				&nbsp;&nbsp;&nbsp;&nbsp;<a href = "regSearchResults.asp?CatID=<%=CategoryIDList(SCounter)%>" class = "body"><%=CategoryNameList(SCounter)%> (<%=rs.recordcount%>)</a> <br>


		
		<% End if
		
		Wend
		SCounter = 0
%>
		</td>
	</tr>
	</table>

<a name="top"></a>
				<%


				SCounter = 0
					

					sql = "select * from sfCategories ;"

			'response.write(sql)
					Set rs = Server.CreateObject("ADODB.Recordset")
					 rs.Open sql, conn, 3, 3 

					While not rs.eof 
						SCounter = SCounter +1 
						
						CategoryIDList(SCounter) = rs("CatID")
						CategoryNameList(SCounter) = rs("CatName")
						'RESPONSE.WRITE(CategoryNameList(SCounter) )
					 rs.movenext
					Wend
					FinalCount = SCounter
				
				rs.Close

		SCounter = 0

						Dim CategoryProdIDArray(1000)
						Dim SubCategoryIDArray (1000)
						Dim CPCounter


					' Get marketing text for the top of the page:


						ExtraSearch  = ""
						If Len(CatID) > 0 And Not(CatID = 0) then
							ExtraSearch  =  ExtraSearch & " and (Products.CategoryID = " & CatID & ") "
						End if


						If Len(iState) > 0 And Not(Trim(iState) ="Any") then
							ExtraSearch  = ExtraSearch & " and (Products.ProdState = '" & iState & "' ) "
						End If
				
						If Len(iZip) > 0 then
							ExtraSearch  =  ExtraSearch & " and (left(Products.Prodzip,5) = " & Left(izip,5) & ") "
						End if


						sql = "select * from sfStandardShipping where  valID = 1"

						Set rs = Server.CreateObject("ADODB.Recordset")
						rs.Open sql, conn, 3, 3   
							If Not rs.eof Then
								valdefaultRate = rs("valdefaultRate")
								valBaseRate = rs("valBaseRate")
								valAddedRate = rs("valAddedRate")
							End if

						rs.close



						sql = "SELECT  * FROM sfCategories WHERE  catID = " & catID   
						Set rs = Server.CreateObject("ADODB.Recordset")
						rs.Open sql, conn, 3, 3   
							If Not rs.eof Then
								CategoryName = rs("CatName")
							End if

							rs.close

     						sql = "SELECT  * FROM sfProducts, sfCategories WHERE  sfProducts.prodCategoryId = sfCategories.CatID  and sfCategories.CatID = " & catID & " order by sfProducts.prodCategoryId, ProdPrice DESC " 
					

						
						'response.write (sql)
						
						Set rs = Server.CreateObject("ADODB.Recordset")
						rs.Open sql, conn, 3, 3   
						
					
						CPCounter = 0
						If Not rs.eof Then
							CategoryCount = rs.recordcount
							While Not rs.eof 
								CPCounter = CPCounter +1
								CategoryProdIDArray(CPCounter) = rs("ProdID")
								rs.movenext
							Wend
				
						FinalCPCounter = CPCounter
						Else 
							FinalCPCounter = 0
						End If 
				%>
				

<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "500" >
	<tr>
	    <td class = "body"  align = "left"   valign = "top"><br>
<b><%=CategoryName%> for Sale</b>
									</td>
					</tr>	
					<tr>
						<td colspan = "2"   height = "2"  background = "images/Underline.jpg"><img src = "images/px.gif". height = "2"></td>
					</tr>
					<tr>
						<td>
				
		


	<%  If FinalCPCounter  > 0 Then 
	
		SCounter = 0
		'While SCounter < (FinalCount)  
		SCounter = SCounter +1 
		'response.write("FinalCount =")
		'response.write(FinalCount)
		'response.write("SCounter =")
		'response.write(SCounter)
		If Len(CategoryNameList(SCounter)) > 2 then
		%>
		 	

					


				

				<a name="<%= CatID %>"></a>
						<!--#Include file="regProductsDetailInclude.asp"--> 
						<br><br>	

				<% Else %>
						<table border = "0" width = "500"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "left" >
							<tr>
								<td class = "body">We do not currently have any <%=CategoryNameList(SCounter)%>  available. Please check back later.
								</td>
							</tr>
						</table>
					
			<%End if 	
		'Wend%>
<br><br>
<div align = "center"><a href = "#top" class ="body">&nbsp;Return to the top of this page</a></div><br><br>

<% End If %>

							</td>
							</tr>
						</table>
</td>

   <td valign = "top" class = "body" width = "170"><br>
		<table border="1" bordercolor = "burlywood" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  bgcolor = "#F0E1CF" height = "100">
			
				<tr>
				<td  valign = "top" class = "body" width = "170" bgcolor = "burlywood">
					<h2><center>Your Registry</center></h2>
				</td>
			</tr>
			<tr>
				<td  valign = "top" class = "body" width = "170" >
					<b><%=RegFirstName%>&nbsp;<%=RegLastName%>
<% If Len(CoRegFirstName) > 1 Or Len(CoRegLastName)>1 Then %>
	& <%=CoRegFirstName%>&nbsp;<%=CoRegLastName%>
<% End If %></b><br>

<%=sEvent%><br>
<%=RegEventMonth%>/<%=RegEventDay%>/<%=RegEventYear%><br>
<br>
				</td>
			</tr>
			
			
			
			
			
			
			
			
			
			<tr>
				<td  valign = "top" class = "body" width = "170" bgcolor = "burlywood">
					<h2><center>Items</center></h2>
				</td>
			</tr>
			<tr>
				<td class = "body">
						
					<% sql = "select sfProducts.*, RegistryItems.*, sfcategories.CatName from SFProducts, RegistryItems, sfcategories where sfProducts.ProdID = RegistryItems.ProdID and sfcategories.catID = sfProducts.prodCategoryID and ProdSellStore = Yes and RegcustID = " & session("regcustID")

		'response.write(sql)
					Set rs = Server.CreateObject("ADODB.Recordset")
					 rs.Open sql, conn, 3, 3 
					 If rs.eof Then %>
					 0 Items selected

					<% Else %>
						<center><a href = "RegList.asp" class = "small">Edit Registry List </a></center><br>
					<% While not rs.eof %>
					<center><img src = "/uploads/Artwork/<%=rs("prodImageSmallPath")%>" width = "50" align = "center"><br>
						<font class = "small"><b><%= rs("prodName") %></b><br>
						Category: <%= rs("CatName") %><br>
						Quantity Requested:<%= rs("RequestedNumber") %><br>
<br></font></center>



					<% rs.movenext
					Wend
					End If 
					%>

					<br>
					<br>
				<center><a href = "RegList.asp" class = "small">Edit Registry List </a></center>
				</td>
			</tr>
		</table>
   	</td>
</tr>
</table>

 <!--#Include file="Footer.asp"--> 
</body>
</html>

