<html>

<head>
<!--#Include file="GlobalVariables.asp"-->
<!--#Include file="Scripts.asp"-->

<% dim buttonimages(20)
dim buttontitle(20) 
Dim sSize(200)
Dim sExtraCost(200)
Dim cColor(200)
Dim Description
%>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> Classifieds Ads</title>
<META name="description" content="<%= WebSiteName %> Barter Ads">
<META name="keywords" content="<%= WebSiteName %> Barter Ads">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"-->
<a name="top"></a>

<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"    width = "630">
	<tr>
		<td class = "body" valign = "top"  ><h1>Products for Sale
			<img src = "images/underline.jpg" width = "600"></h1>
			<blockquote>Below are a list of product categories. Click on any of the categories below to see a list of related products.</blockquote>
		</td>
	</tr>
</table>
			
      
			<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "630">

				<%
				Dim CategoryIDList(100)
				Dim CategoryNameList(100)
				subject = "For Sale"

				SCounter = 0
					conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
					"Data Source=" & server.mappath(databasepath) & ";" & _
					"User Id=;Password=;" 

					sql = "select * from Categories where CategoryType = 'For Sale' order by CategoryName  ;"

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
		While Scounter < FinalCount
		         %>




			<tr>
				<td class = "body"  width = "50%" valign = "top">
					<% While Scounter < (FinalCount/2 )
							SCounter = SCounter +1  
							
						
							sql = "select * from Products where Adtype = '" &  subject   & "' and DateDiff('d', Now, ProdStartDate) < 1 and CategoryID = " & CategoryIDList(SCounter) & " and  ProdApproved = True;"
							'response.write(sql)
							Set rs = Server.CreateObject("ADODB.Recordset")
							rs.Open sql, conn, 3, 3 
							If Not(rs.eof) then
								ProdStartdate = rs("ProdStartDate")
							Else
								ProdStartdate = "1/2/2008"
							End If 
						
						%>
				
				
				
				
				&nbsp;<a href = "SearchResults.asp?CatID=<%=CategoryIDList(SCounter)%>&Subject=<%=subject %>" class = "body"><%=CategoryNameList(SCounter)%></a> (<%=rs.recordcount %>)<br>
				
				<% Wend %>
				</td>
				
				<td class = "body" width = "50%" valign = "top">
				<% rs.close	
				
				
				while Scounter < FinalCount 
							SCounter = SCounter +1  
							
						
							sql = "select * from Products where Adtype = '" &  subject   & "' and DateDiff('d', Now, ProdStartDate) < 1 and CategoryID = " & CategoryIDList(SCounter) & " and ProdApproved = true;"
							'response.write(sql)
							Set rs = Server.CreateObject("ADODB.Recordset")
							rs.Open sql, conn, 3, 3 
							If Not(rs.eof) then
								ProdStartdate = rs("ProdStartDate")
							Else
								ProdStartdate = "1/2/2008"
							End If 
							%>

				&nbsp;<a href = "SearchResults.asp?CatID=<%=CategoryIDList(SCounter)%>&Subject=<%=subject %>" class = "body"><%=CategoryNameList(SCounter)%></a> (<%=rs.recordcount %>)<br>
					


					 <% Wend %>
					</td>
				  
			</tr>
		
		<% Wend




		SCounter = 0
%>


		</table>

<br>



 <!--#Include file="Footer.asp"--> 
</body>
</html>