<html>
<head>

<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Place a Classified Ad</title>
<link rel="shortcut icon" href="/LittleShrew.ico" /> 
<link rel="icon" href="http://www.GreenShrew.com/LittleShrew.ico" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<h1>Maintain Categories & Sub-Categories</h1>


<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "765" >
	<tr>
		<td width = "380"  height = "300" class = "body" valign = "top">
		<H2>Existing Categories & Sub-Categories<br>
			<img src = "images/underline.jpg" width = "380"></H2>

					<% 
Dim CategoryID(100,100)
Dim CategoryName(100,100)

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 

			 sql = "select * from Categories" 
			'response.write(sql2)
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
	CatCounter= 0
	 While Not rs.eof 
		CatCounter = CatCounter + 1
		CategoryID(CatCounter,0) = rs("CategoryID")
		CategoryName(CatCounter,0) = rs("CategoryName")
'response.write(CategoryName(CatCounter,0))
		rs.movenext
	Wend
		FinalCatCounter = CatCounter




 sql = "select * from SubCategories" 
			'response.write(sql2)
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
	CatCounter= 0
	LatestCategory = rs("CategoryID")
While CatCounter < (FinalCatCounter +1) 
   CatCounter = CatCounter +1 
	SubCatCounter = 0
	%>
	  <%= CategoryName(CatCounter,0) %><br>
  
	<% While  Not rs.eof And LatestCategory = CatCounter
		SubCatCounter = SubCatCounter+ 1
		CategoryID(CatCounter,SubCatCounter) = rs("SubCategoryID")
		CategoryName(CatCounter,SubCatCounter) = rs("SubCategoryName")
	%>
	  &nbsp;&nbsp;<%= CategoryName(CatCounter,SubCatCounter) %><br>
  
	<%
			LatestCategory = rs("CategoryID")
		rs.movenext
	Wend

wend
'response.write(Varieties)

   		FinalSubCatCounter = CatCounter
%>



		</td>
		<td width = "5" align = "center"><img src = "images/underline.jpg" width = "1" height = "100%"> </td>
		<td width = "380"  height = "300" class = "body" valign = "top">
			<h2>Add Categories & Sub-Categories
			<img src = "images/underline.jpg" width = "380" ></H2>

			<b>Add a New Category</b><br>
			<form action= 'AddCategoryhandleform.asp' method = "post">
				<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" >
				<tr>
						<td width = "140" class = "body" align = "right">
							New Category:
					</td>
					<td class = "body">
							<input name="NewCategory" size = "30">
					</td>
			</tr>
			<tr>
					<td  align = "center" valign = "middle" colspan = "2" class = "body">
						<input type=submit value = "Add Category" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
					</td>
			</tr>
			</table>
			</form>

<br><br>
<b>Add a New Sub-Category</b>
<form action= 'AddSubCategory.asp' method = "post">
				<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" >
				
			<tr>
					<td width = "140" class = "body" align = "right">
							Category:
					</td>
					<td class = "body" >
							<select size="1" name="Category">	
							<option  value= "" selected>select a category</option>
						<%	CatCounter = 0 
								While CatCounter < (FinalCatCounter +1) 
								CatCounter = CatCounter +1 
						%>
								 <option  value="<%= Categoryid(CatCounter,0) %>"><%= CategoryName(CatCounter,0) %></option>
	
							<% 
							Wend %>
							</select>
					</td>
			</tr>
			<tr>
					<td width = "140" class = "body" align = "right">
							New Sub-Category:
					</td>
					<td class = "body">
							<input name="NewSubCategory" size = "30">
					</td>
			</tr>

			
			<tr>
					<td  align = "center" valign = "middle" colspan = "2">
						<input type=submit value = "Add Sub-Category" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
					</td>
			</tr>
			</table>
			</form>
		</td>
	</tr>
</table>
	


<br><br><br>
<!--#Include file="Footer.asp"--> </Body>
</HTML>