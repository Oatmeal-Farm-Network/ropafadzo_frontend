<html>

<head>
<!--#Include file="GlobalVariables.asp"-->

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
<META name="description" content="<%= WebSiteName %> Classified Ads">
<META name="keywords" content="<%= WebSiteName %> Classified Adss">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="style.css">

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<a name="top"></a>
				<%
				Dim CategoryIDList(100)
				Dim CategoryNameList(100)

				SCounter = 0
					conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
					"Data Source=" & server.mappath(databasepath) & ";" & _
					"User Id=;Password=;" 

					sql = "select * from Categories ;"

			'response.write(sql)
					Set rs = Server.CreateObject("ADODB.Recordset")
					 rs.Open sql, conn, 3, 3 

					While not rs.eof 
						SCounter = SCounter +1 
						
						CategoryIDList(SCounter) = rs("CategoryID")
						CategoryNameList(SCounter) = rs("CategoryName")
						'RESPONSE.WRITE(CategoryNameList(SCounter) )
					 rs.movenext
					Wend
					FinalCount = SCounter
				
				rs.Close

		SCounter = 0
%>
<!--#Include file="Header.asp"-->
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "600">
	<tr>
	    <td class = "body"  align = "center"  height = "83">
			<br><h1>The Shop at the Barn</h1>
				
       
	<%
	SCounter = 0
		While SCounter < (FinalCount)  
		SCounter = SCounter +1
			If Len(CategoryNameList(SCounter)) > 2 Then %>
				<a href = "#<%=CategoryNameList(SCounter)%>" class ="body"><%=CategoryNameList(SCounter)%></a>
				<% If SCounter < (FinalCount  ) Then %>  
						|
		<%		  End If 
			End If
		Wend 
		%>
  </td>
		</tr>
	</table>
<br>

	<%	SCounter = 0
		While SCounter < (FinalCount)  
		SCounter = SCounter +1 
		'response.write("FinalCount =")
		'response.write(FinalCount)
		'response.write("SCounter =")
		'response.write(SCounter)
		If Len(CategoryNameList(SCounter)) > 2 then
		%>
		 	


			<table border = "0" width = "600"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
			<tr>
				<td colspan = "2"   height = "30"  background = "images/Underline.jpg">
					<H2><%=CategoryNameList(SCounter)%><br></H2>
				</td>
			</tr>
			<tr>
			</table>

				<% 	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" '& _ 
						' Get marketing text for the top of the page:
     
						sql = "SELECT  * FROM Products, Categories WHERE Products.CategoryID = Categories.CategoryID and  (CategoryName = '" & CategoryNameList(SCounter) & "') order by ProdPrice DESC " 
						response.write (sql)
						Set rs = Server.CreateObject("ADODB.Recordset")
						rs.Open sql, conn, 3, 3   
						If Not rs.eof then
				%>

				<a name="<%=CategoryNameList(SCounter)%>"></a>
						<!--#Include file="ProductsDetailInclude.asp"--> 
						<br><br>	

				<% Else %>
						<table border = "0" width = "600"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
							<tr>
								<td class = "body">We do not currently have any <%=CategoryNameList(SCounter)%>  available. Please check back later.
								</td>
							</tr>
						</table>
			<% End if 
		End if 
				
		Wend%>
<br><br>
<div align = "center"><a href = "#top" class ="body">&nbsp;Return to the top of this page</a></div><br><br>


 <!--#Include file="Footer.asp"--> 
</body>
</html>