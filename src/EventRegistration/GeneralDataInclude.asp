<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td class = "body">
			 <H2>List of All Products<br>
			<img src = "images/underline.jpg"></H2>
			To make changes to your data, make your changes in the table below then select the "Submit Changes" button at the bottom of the page.<br><br>
	<%  SortName = Sort
			If Sort = "ProdName" Then
				SortName = "Name"
			End If 
			If Sort = "CatName" Then
				SortName = "Category"
			End If 
			If Sort = "ProdPrice" Then
				SortName = "Price"
			End If 
				If Sort = "ProdQuantityAvailable" Then
				SortName = "QTY Available"
			End If 
			
			
			
			%>
				<form action= 'Generaldata.asp' method = "post">
						<b>Sort By:</b> <Select  name="Sort">
								<option value="<%=Sort%>" selected><%=SortName%></option>
								<option value="ProdName" >Name</option>
								<option  value= "CatName">Category</option>
								<option  value= "Prodprice">Price</option>
								<option  value= "ProdQuantityAvailable">QTY Available</option>
								  </select>
								  <input type=submit value = "Sort" style="background-image: url('images/Background.jpg'); border-style: solid; border-color: #404040; border-width: 1"  class = "Menu" width = "148"  >&nbsp;
		</td>
	</tr>
</table>
</form>

<%
conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select * from sfProducts, sfCategories where sfProducts.ProdCategoryID = sfCategories.CatID order by " & Sort

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
	 
	 
	 Dim ProdName(10000)
	 Dim AdType(10000)
	 Dim Category(10000)
	 Dim CategoryID(10000)
	 Dim ProdPrice(10000) 
	 Dim ProdQuantityAvailable(10000)
	 Dim ProdCity(10000) 
	 Dim ProdState(10000)
	 Dim ProdZip(10000) 
	 Dim ProdPartofTown(10000)
	 Dim ProdYear(10000) 
	 Dim ProdMake(10000) 
	 Dim ProdModel(10000) 
	 Dim ProdCondition(10000) 
	 Dim ProdColor(10000)  
	 Dim ProdStartDate(10000)  
	 Dim ProdEndDate(10000)  
	  Dim ProdWeight(10000)  
	 Dim ID(10000) 

	
	
	
		

Recordcount = rs.RecordCount +1
%>

<table border = "1" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<th class = "body">Name</th>

		<th class = "body">Category</th>
		<th class = "body">Price</th>
			<th class = "body">Weight</th>
		<th class = "body">QTY Available</th>
		
	
	</tr>
	
<%
 While  Not rs.eof    
		ProdName(rowcount)=rs("ProdName") 
	
		Category(rowcount)=rs("CatName")
		CategoryID(rowcount)=rs("prodCategoryId")

		ProdPrice(rowcount) =rs("ProdPrice")
		ProdQuantityAvailable(rowcount)=rs("ProdQuantityAvailable")
		ProdWeight(rowcount)=rs("ProdWeight")

		ID(rowcount) =rs("ProdID")



%>

	<form action= 'GeneralDataHandleForm.asp' method = "post">
	<tr  >
		
		<td >
			<input type = "hidden" name="ID(<%=rowcount%>)" value= "<%=  ID( rowcount)%>">
		
		    <input name="ProdName(<%=rowcount%>)" value= "<%= ProdName( rowcount)%>" size = "50"></td>
		
		
		
		<td class = "body" align = "right">
			<%=Category(rowcount)%>
	</td>
	
		<td class = "body" align = "right">$<input name="ProdPrice(<%=rowcount%>)" value="<%=ProdPrice( rowcount)%>" size = "10"></td>
		<td class = "body" align = "right"><input name="Prodweight(<%=rowcount%>)" value="<%=Prodweight( rowcount)%>" size = "10"></td>
		<td class = "body" align = "right"><input name="ProdQuantityAvailable(<%=rowcount%>)" value="<%=ProdQuantityAvailable( rowcount)%>" size = "5"></td>


		
		</tr>
<%
		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	rs.close
  set rs=nothing
  set conn = nothing
%>

<tr>
		<td colspan = "16" align = "center" valign = "middle">
			<img src = "images/underline.jpg"><br>
			<Input type = Hidden name='TotalCount' value = <%=TotalCount%> >
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
			</form>
		</td>
</tr>
</table>
