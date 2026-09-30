 <table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"    width = "750">
	<tr>
		<td class = "body" valign = "top"  >

			<a name="Add"></a>
			<h1>Create an Ad</h1>
			<H2>Step 3: Review Ad<br>
			<img src = "images/underline.jpg" width = "750"></H2>
			Please review your ad below, and make any changes. If it looks good then select the "Publish Ad" button.
			<br><br>
		</td>
	</tr>
</table>
 
 <%

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" 
	sql2 = "select * from Ads, Categories,  Photos  where Ads.ID = Photos.ID and Categories.CategoryID = Ads.CategoryID  and  Ads.ID = " & session("ID") & ";"

'response.write(sql2)
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
AdType= rs2("AdType")
StartDate= rs2("StartDate")
EndDate= rs2("EndDate")
ProductName= rs2("ProductName")
Category= rs2("CategoryName")

Price= rs2("Price")
Description= rs2("Description")
QuantityAvailable= rs2("QuantityAvailable")
Photo1= rs2("Photo1")

'Response.write(AdType)

sql2 = "select * from Ads, SubCategories where SubCategories.CategoryID = Ads.SubCategoryID and  Ads.ID = " & session("ID") & ";"

'response.write(sql2)
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 

If rs2.eof Then
	SubCategory= "No Sub Category"
else
	SubCategory= rs2("SubCategoryName")
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


str1 = WhyOnABH
str2 = vblf
If InStr(str1,str2) > 0 Then
	WhyOnABH= Replace(str1, str2 , "</br>")
End If  

str1 = WhyOnABH
str2 = vbtab
If InStr(str1,str2) > 0 Then
	WhyOnABH= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  
%>

<table    cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"    width = "750"  border = "0" >
	<tr>
	   <td class = "body">Ad Type: 
			<% if AdType="ClassifiedAd" Then %>
					  Classified Ad
				<%   End If
				    if AdType="BarterAd" Then %>
					   Barter Ad
				<%   End If
				    if AdType="WantAd" Then %>
					   Want Ad
				<%   End If
				    if AdType="NPDWA" Then %>
						Non-Profit Donation Want Ad
				<%   End If
				%>
					<br>
		</td>
	</tr>
</table>
<table    cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"    width = "750" bgcolor = "#edf2e4" border = "1" bordercolor = "#628038">
	<tr>
	   <td>
	   <br>
	   <table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"    width = "720">
		<tr>
		<td class = "body" valign = "top" width = "420"  >
			
			Item Name: <%=ProductName%><br>
			Category: <%=Category%><br>
			<% If Len(SubCategoryID) > 1 then  %>
					Sub-Category:<%=SubCategoryID%><br>
			<% End If %> 
			<% If Not(SubCategory= "No SubCategory") then  %>
					Sub-Category:<%=SubCategory%><br>
			<% End If %> 


			
			<% If AdType = "ClassifiedAd" then %>
				Price: <%=Price%><br>
				Quantity Available: <%=QuantityAvailable%><br>
			<% End If %>
			Description: <%=Description%><br><br>
		</td>
		<td width = "300">
			<% If Len(Photo1) < 2 And   Len(Photo1) < 75 then%>
				<img src = "/Uploads/<%=Photo1%>" width = "300">
			<% End If %>
		</td>
	</tr>
</table>
	</td>
	</tr>
</table>

<% rs2.close
	   %>