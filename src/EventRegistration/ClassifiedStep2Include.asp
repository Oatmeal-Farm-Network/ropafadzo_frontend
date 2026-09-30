<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"    width = "630">
	<tr>
		<td class = "body" valign = "top"  ><h1>Create an Ad - Step 3: Confirm Text<a name="Add"></a>
			<img src = "images/underline.jpg" width = "600"></h1>
			<blockquote>Please make sure that all of the information that you entered is correct.</blockquote>
		</td>
	</tr>
</table>



 <%

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password= ;" 
	sql2 = "select * from Products, Categories where  Categories.CategoryID = Products.CategoryID  and  Products.ID = " & session("ID") & ";"


	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
AdType= rs2("AdType")
ProductName= rs2("ProdName")
Category= rs2("CategoryName")
CategoryID= rs2("Products.CategoryID")
SubCategoryID= rs2("SubCategoryID")
AdType= rs2("AdType")

Price= rs2("ProdPrice")
Description= rs2("ProdDescription")
QuantityAvailable= rs2("ProdQuantityAvailable")

ProdCity  = rs2("ProdCity")
ProdState  = rs2("ProdState")
ProdZip  = rs2("ProdZip")
ProdPartofTown  = rs2("ProdPartofTown")
ProdYear  = rs2("ProdYear")
ProdMake  = rs2("ProdMake")
ProdModel  = rs2("ProdModel")
ProdCondition  = rs2("ProdCondition")
ProdColor  = rs2("ProdColor")


'Response.write(AdType)

sql2 = "select * from products, SubCategories where SubCategories.SubCategoryID = Products.SubCategoryID and  Products.ID = " & session("ID") & ";"

'response.write(sql2)
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 

If rs2.eof Then
	SubCategory= "No Sub Category"
else
	SubCategory= rs2("SubCategoryName")
End If 

If Price = "0" Then
	Price = ""
End If 

str1 = Description
str2 = vblf
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , "</br>")
End If  

str1 = Description
str2 = vbtab
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  


%>


<table    cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"    width = "450" bgcolor = "#edf2e4" border = "1" bordercolor = "#628038">
	
	<tr>
	   <td class = "body">Ad Type: 
			<% if AdType="For Sale" Then %>
					  For Sale
				<%   End If
				    if AdType="Barter" Then %>
					   Barter Ad
				<%   End If
				    if AdType="WantAd" Then %>
					   Want Ad
				<%   End If
				    if AdType="Donation" Then %>
						Non-Profit Donation Want Ad
				<%   End If
				%>
					<br>
		</td>
	</tr>
	<tr>
	   <td valign = "top">
	   <table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"    width = "450">
		<tr>
			<td  class = "body" align = "right">
					Item Name:
			</td>
			<td>&nbsp;</td>
			<td class = "body">
				<b><%=ProductName%></b>
			</td>
		</tr>
		<tr>
			<td  class = "body" align = "right">
					Category: 
			</td>
			<td>&nbsp;</td>
			<td class = "body">
				<%=Category%>
			</td>
		</tr>
		<% If Not(SubCategory= "No SubCategory") then  %>
		<tr>
			<td  class = "body" align = "right">
					Sub-Category:
			</td>
			<td>&nbsp;</td>
			<td class = "body">
				<%=SubCategory%>
			</td>
		</tr>
		<% End If %> 
		
		
		<% If AdType = "For Sale" then %>
		<tr>
			<td  class = "body" align = "right">
					Price:
			</td>
			<td>&nbsp;</td>
			<td class = "body">
				 <%=Price%>
			</td>
		</tr>

		<tr>
			<td  class = "body" align = "right">
					Quantity Available: 
			</td>
			<td>&nbsp;</td>
			<td class = "body">
				 <%=QuantityAvailable%>
			</td>
		</tr>

		<% End If %>
		

		<tr>
		<% If Category = "Vehicles" Or Category = "Vehicle Parts"Then %> 
			<tr>
				<td  class = "body" align = "right">
				Year:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdYear %>
		</td>
	</tr>
	<tr>
	<td  class = "body" align = "right">
			Make:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdMake %>
		</td>
	</tr>
	<tr>
	<td  class = "body" align = "right" size = "30">
			Model:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdModel  %>
		</td>
	</tr>
	<% End if%>

	
	<% If AdType = "For Sale" Then %> 
	<tr>
	<td  class = "body" align = "right" >
			Price:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdPrice %>
		</td>
	</tr>
	<% End if%>
	

   <% If AdType = "Barter" Then %> 
	<tr>
	<td  class = "body" align = "right">
			Estimated Value:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdPrice %>
		</td>
	</tr>
	<% End if%>
	
<% If AdType = "For Sale"  Or Subject = "Barter"  Or Subject = "WantAd"Then %> 
	<tr>
	<td  class = "body" align = "right">
			Condition:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdCondition %>
		</td>
	</tr>
	

<tr>
	<td  class = "body" align = "right">
			Color:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdColor %>
		</td>
	</tr>
<% End If %>

<% If AdType= "For Sale"  Or AdType = "Barter" Then %> 
	<tr>
	<td  class = "body" align = "right">
			Quantity Available:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdQuantityAvailable %>
		</td>
	</tr>

	


<tr>
	<td  class = "body" align = "center" colspan = "3">
			<br><b>Your Product Can be Found at:</b>
		</td>
	</tr>
<tr>
	<td  class = "body" align = "right">
			City:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdCity%>
		</td>
	</tr>
	<tr>
	<td  class = "body" align = "right">
			State:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdState%>
		</td>
	</tr>
<tr>
	<td  class = "body" align = "right">
			Part of Town:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdPartOfTown%>
		</td>
	</tr>
<tr>
	<td  class = "body" align = "right">
			Postal Code:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=ProdZip%>
		</td>
	</tr>
	<% End If %>

<tr>
	<td  class = "body" align = "right" valign = "top">
			Description:
		</td>
		<td>&nbsp;</td>
		<td class = "body">
			<%=Description%>
		</td>
	</tr>
</table>

<%

rs2.close
	   %>

		</td>
	</tr>
</table>



<form action= 'javascript:history.go(-1)' method = "post">
<input name="box1" type = "hidden" value = "<%=CategoryID%>">
<input name="box2ID" type = "hidden" value = "<%=SubCategoryID%>">
<input name="AdType" type = "hidden" value = "<%=AdType%>">

			<input type=submit value = "<--Go Back and make Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "310" class = "menu" >
			</form>
		
<form action= 'PlaceClassifiedAdStep3.asp' method = "post">
<input name="box1" type = "hidden" value = "<%=CategoryID%>">
<input name="box2ID" type = "hidden" value = "<%=SubCategoryID%>">
<input name="AdType" type = "hidden" value = "<%=AdType%>">

			<input type=submit value = "Proceed to the Next Step -->" style="background-image: url('images/background.jpg'); border-width:1px" size = "310" class = "menu" >
			</form>
		


		

<br><br><br>