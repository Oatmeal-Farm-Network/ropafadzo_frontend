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

<!--#Include file="RegHeader2.asp"--> 
<!--#Include file="Scripts.asp"--> 
	<form  action="RegEditlist.asp" method="post">
<table border = "0" width = "790" align = "right"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td class ="body" valign = "top" >
			<h1>Your Registry List</h1>
		</td>
	</tr>
	<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
	<tr>
		<td>
			<a href = "RegManageHome.asp" class = "body">Add items to your registry</a>
		</td>
   </tr>
  <tr>
	   <td valign = "top" class = "body" ><br>
	  
		
			

				
						
					<% sql = "select sfProducts.*, RegistryItems.*, sfcategories.CatName from SFProducts, RegistryItems, sfcategories where sfProducts.ProdID = RegistryItems.ProdID and sfcategories.catID = sfProducts.prodCategoryID and RegcustID = " & session("regcustID")

		'response.write(sql)
					Set rs = Server.CreateObject("ADODB.Recordset")
					 rs.Open sql, conn, 3, 3 
					 If rs.eof Then %>
					 0 Items selected

					<% Else %>
					 <div align = "right"><input type=submit   border="0" name="submit"  class = "regsubmit2" Value = "Save Changes" ></div>
					<table border="0" cellspacing="5" cellpadding="5" leftmargin="5" topmargin="5" marginwidth="5" marginheight="5"  align = "center"  valign ="top"  width = "750">

			<tr bgcolor = "burlywood">
				<td class = "body" align = "center">Item</td>
				<td class = "body" align = "center" width = "100">Item Number</td>
				<td class = "body" align = "center">Price</td>
				<td class = "body" align = "center" width = "100"># Requested</td>
				<td class = "body" align = "center" width = "90">Still Needed</td>
				<td class = "body" align = "center" width = "100"></td>
			</tr>
					<%
						count = 1
						While not rs.eof 
							 %>
					
					<tr>
						<td class = "body" ><b><%= rs("prodName") %></b></td>
						<td class = "body" align = "center"><%= rs("sfProducts.prodID") %>
						<input type="hidden" name="ProdID(<%=count%>)"  value = "<%= rs("sfProducts.prodID") %>">
						</td>
						<td class = "body" align = "center"><%= FormatCurrency(rs("prodPrice")) %></td>
						<td class = "body" align = "center"><input type="text" name="RequestedNumber(<%=count%>)" size ="2" value = "<%= rs("RequestedNumber") %>"></td>
						<td class = "body" align = "center"><%= rs("RequestedNumber") - rs("PurchasedNumber") %></td>
						<td class = "body" align = "center"><INPUT TYPE=CHECKBOX NAME="Delete(<%=count%>)"> Delete</td>
					</tr>


					<%
					count = count + 1
					rs.movenext
					Wend
					TotalCount = count - 1 %>


</table>
					<div align = "right">
					<input type="hidden" name="TotalCount"  value = "<%= TotalCount %>">
		
					<input type=submit   border="0" name="submit"  class = "regsubmit2" Value = "Save Changes" ></div>
					</form>

					<%
					End If 
					%>

					
		
		
		<br><br><br>
   	</td>
</tr>
</table>

 <!--#Include file="Footer.asp"--> 
</body>
</html>

