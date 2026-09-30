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
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="<%=Style%>">

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<a name="top"></a>
				<%
				Dim CategoryIDList(100)
				Dim CategoryNameList(100)

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

     						sql = "SELECT  * FROM sfProducts, sfCategories WHERE  sfProducts.prodCategoryId = sfCategories.CatID and ProdSellStore = true and sfCategories.CatID = " & catID & " order by sfProducts.prodCategoryId, ProdPrice DESC " 
					

						
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
				
<!--#Include file="Header.asp"-->
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "700" height = "200">
	<tr>
	    <td class = "body"  align = "left"   valign = "top">
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "700" >
	<tr>
	    <td class = "body"  align = "left"  height = "83" valign = "top"><br>
			<table border = "0" width = "700"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
					<tr>
			       
									<td ><h1><%=CategoryName%> for Sale</h1>
									</td>
									<td align = "right" valign = "bottom">
									<form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
										<input type="hidden" name="cmd" value="_cart">
										<input type="hidden" name="business" value="jhartwig@clearwire.net">
									
										<input type="hidden" name="display" value="1">
										<input type="image" src="images/ShoppingCart.gif" alt="Submit button" border="0" name="submit"  Value = "View Cart" height = "30" ></td>
					</tr>	</form>
					<tr>
						<td colspan = "2"   height = "2"  background = "images/Underline.jpg"><img src = "images/px.gif". height = "2"></td>
					</tr>
               		<tr>
						<td colspan = "2"   height = "5"  class = "body" >
						<% If FinalCPCounter  = 0 Then %>
								&nbsp;&nbsp;Sorry, there are <% = FinalCPCounter %> results for that category.
						
							<% End if%>
									<% If FinalCPCounter  = 1 Then %>			
						&nbsp;&nbsp;<% = FinalCPCounter %> Result
							<% End If %>

						<% If FinalCPCounter  > 1 Then %>			
						&nbsp;&nbsp;<% = FinalCPCounter %> Results
							<% End If %>
						</td>
					</tr>
				</table>
				
		


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
						<!--#Include file="ProductsDetailInclude.asp"--> 
						<br><br>	

				<% Else %>
						<table border = "0" width = "700"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
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
 <!--#Include file="Footer.asp"--> 
</body>
</html>

