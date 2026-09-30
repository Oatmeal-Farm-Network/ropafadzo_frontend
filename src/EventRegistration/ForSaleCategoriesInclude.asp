<h1><%=TempCategoryType%> Categories</h1>
<h2>Maintain Categories & Sub-Categories</h2><br>


<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   >
	<tr>
		<td width = "300"  height = "300" class = "body" valign = "top">
		<H2>Existing Categories / Sub-Categories<br>
			<img src = "images/underline.jpg" width = "280"></H2>

					<% 
Dim CategoryID(100,100)
Dim CategoryName(100,100)

Dim SubCategoryID(100)
Dim SubCategoryName(100)

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 

			 sql = "select * from Categories where categorytype = '" & TempCategoryType & "' order by Categoryname " 
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

CatCounter= 0
SubCatCounter2 = 0
While CatCounter < FinalCatCounter
	CatCounter= CatCounter +1 %>
   
			<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  ><tr><td> <form action= 'EditCategory.asp' method = "post" style="margin-bottom:0;" >
			<div style="display: inline;">
			<input name="categoryname" value ="<%= CategoryName(CatCounter,0) %>"  size = "20">
			<input name="categorytype" value ="category"  type="hidden">
			<input name="TempCategoryType" value ="<%=TempCategoryType%>"  type="hidden">
				<input name="categoryID" value ="<%=CategoryID(CatCounter,0)%>"  type="hidden">
			<input type=submit value = "submit"  class = "small" ></div>
			</form>
		</td>
		</tr>
		</table>
		

	<% sql = "select * from SubCategories where CategoryID = " & CategoryID(CatCounter,0) & " order by SubCategoryname "
			'response.write(sql2)
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
	If Not rs.eof Then
	SubCatCounter= 0
	While Not rs.eof
		SubCatCounter= SubCatCounter +1
		SubCatCounter2 = SubCatCounter2  +1
		CategoryID(CatCounter,SubCatCounter) = rs("SubCategoryID") 
		CategoryName(CatCounter,SubCatCounter) = rs("SubCategoryName") 

'response.write(CategoryName(CatCounter,SubCatCounter) )
		SubCategoryID(SubCatCounter2) = rs("SubCategoryID") 
		SubCategoryName(SubCatCounter2) = rs("SubCategoryName") %>
	
		<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  ><tr><td><form action= 'EditCategory.asp' method = "post" style="margin-bottom:0;" ><div style="display: inline;"><img src = "images/SubLine.jpg" height = "16">
		<input name="TempCategoryType" value ="<%=TempCategoryType%>"  type="hidden">
		<input name="categoryname" value ="<%= CategoryName(CatCounter,SubCatCounter) %>"  size = "30">
		<input name="categorytype" value ="subcategory"  type="hidden">
		<input name="categoryID" value ="<%=SubCategoryID(SubCatCounter2)%>"  type="hidden">
		<input type=submit value = "submit"  class = "small" ></div></form></td></tr></table>
		<% rs.movenext
	wend
	End If 
wend

FinalSubCatCounter2 = SubCatCounter2
   		FinalSubCatCounter = CatCounter
%>



		</td>
		<td width = "5" align = "center"><img src = "images/underline.jpg" width = "1" height = "100%"> </td>
		<td width = "300"   class = "body" valign = "top">
			<h2>Add Categories & Sub-Categories
			<img src = "images/underline.jpg" width = "280" ></H2>

			<b>Add a New Category</b><br>
			<form action= 'AddCategoryhandleform.asp' method = "post">
				<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" >
				<tr>
						<td width = "200" class = "body" align = "right">
							New Category:
					</td>
					<td class = "body">
							<input name="NewCategory" size = "30">
							<input name="CategoryType" type = "hidden" Value = "<%=TempCategoryType%>">
					</td>
			</tr>
			<tr>
					<td  align = "center" valign = "middle" colspan = "2" class = "body">
						<input type=submit value = "Add Category" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
					</td>
			</tr>
			</table>
			</form>


<b>Add a New Sub-Category</b>
<form action= 'AddSubCategoryHandleform.asp' method = "post">
	<input name="CategoryType" type = "hidden" Value = "<%=TempCategoryType%>">
				<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" >
				
			<tr>
					<td width = "140" class = "body" align = "right">
							Category:
					</td>
					<td class = "body" >
							<select size="1" name="CategoryID">	
							<option  value= "" selected>select a category</option>
						<%	CatCounter = 0 
								While CatCounter < (FinalCatCounter +1) 
								CatCounter = CatCounter +1 
						%>
								 <option  value="<%= CategoryID(CatCounter,0) %>"><%= CategoryName(CatCounter,0) %></option>
	
							<% 
							Wend %>
							</select>
					</td>
			</tr>
			<tr>
					<td width = "200" class = "body" align = "right">
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

<h1><center>Warning! </center></h1>
<b>When you delete a category or subcategory you will loose all products with that category! Even if you create a new category with the same name, the old products will not automatically be reassigned!</b><br><br>

			<b>Delete a Category</b>
<form action= 'DeleteCategoryHandleform.asp' method = "post">
	<input name="CategoryType" type = "hidden" Value = "<%=TempCategoryType%>">
	<input   name="DeleteCategoryType" type = "hidden" value = "Category">	
				<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" >
				
			<tr>
					<td width = "140" class = "body" align = "right">
							Category:
					</td>
					<td class = "body" >
							<select size="1" name="CategoryID">	
							<option  value= "" selected>select a category</option>
						<%	CatCounter = 0 
								While CatCounter < (FinalCatCounter +1) 
								CatCounter = CatCounter +1 
						%>
								 <option  value="<%= CategoryID(CatCounter,0) %>"><%= CategoryName(CatCounter,0) %></option>
	
							<% 
							Wend %>
							</select>
					</td>
			</tr>
		
			<tr>
					<td  align = "center" valign = "middle" colspan = "2">
						<input type=submit value = "Delete a Category" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
					</td>
			</tr>
			</table>
			</form>



			<b>Delete a Sub-Category</b>
<form action= 'DeleteCategoryHandleform.asp' method = "post">
	<input name="CategoryType" type = "hidden" Value = "<%=TempCategoryType%>">
	<input name="DeleteCategoryType" type = "hidden"   value = "SubCategory">	
				<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" >
				
			<tr>
					<td width = "200" class = "body" align = "right">
							Sub-Category:
					</td>
					<td class = "body" >
					
							<select size="1" name="CategoryID">	
							<option  value= "" selected>select a category</option>
						<%	SubCatCounter2 = 0 
								While SubCatCounter2 < (FinalSubCatCounter2 +1) 
								SubCatCounter2 = SubCatCounter2 +1 
						%>
								 <option  value="<%= SubCategoryID(SubCatCounter2) %>"><%= SubCategoryName(SubCatCounter2) %></option>
	
							<% 
							Wend %>
							</select>
					</td>
			</tr>
		
			<tr>
					<td  align = "center" valign = "middle" colspan = "2">
						<input type=submit value = "Delete a Sub-Category" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
					</td>
			</tr>
			</table>
			</form>

		
   </td>
   </tr>
   <tr>
      <td>



			
		</td>
	</tr>
</table>