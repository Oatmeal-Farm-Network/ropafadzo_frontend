<% SetLocale("en-us") 

CustID = 2 

Country=request.form("Country") 
Region=request.form("Region") 
State=request.form("State") 
Sort=request.form("Sort") 

If Len(Country) < 3 then
	Country= Request.QueryString("Country") 
End if
  If Len(Region) < 3 then
	Region= Request.QueryString("Region") 
End if
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<!--#Include file="GlobalVariables.asp"-->

<title><%= WebSiteName %> - Alpaca Ranches</title>
<meta name="description" content="List of Alpaca Ranches">
<META name="keywords" content="Alpaca Ranches, <%= WebSiteName %>, <%= Breed %>Alpacas, alpacas, alpaca,  female alpacas, male alpacas">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="/AlpacaRanchQuest/ARQStyle.css">


</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include virtual="/AlpacaRanchquest/Header.asp"-->
<br><h1><% If Len(Region) > 1 Then %>
						<%=Region%>&nbsp;
					<% End If %>Ranches</h1>

<form action= 'Ranches.asp' method = "post">
				  	
					<table border = "0" width = "600"  align = "center" bgcolor="#BECAE4">
					<tr>
						<td class = "body">	<table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   width = "600" align = "center">

		
						<tr>
						<td class = "body"><b>Search By Region:</b>
							</td>
								<td class = "body">
							  <select  name="Region">
							  <% If Region = "Any"  Or Len(Region) < 3 Then %>
									<option value="Any" selected>Any</option>
								<% Else %>
										<option value="<% = Region %>" selected><% = Region %></option>
										<option value="Any" >Any</option>
								<% End If %>
							 	<option  value= "Northeast" >US-Northeast</option>
								<option  value= "Midwest">US-Midwest</option>
								<option value= "South">US-South</option>
								<option  value= "West">US-West</option>
								<option  value= "Canada">Canada</option>
							  </select>
							</td>
							
					
							<td class = "body"><b>Sort By:</b>
							</td>
							<td class = "body" colspan = "3"> 
							<select  name="Sort">
								<option value="Any" selected>Any</option>
								<option  value= "CustCompany" >Ranch Name</option>
								<option  value= "CustState">State</option>
							  </select>
							</td>
		
							<td colspan = "3" align = "center">

			
								<input type=submit value = "Search" style="background-image: url('images/Background.jpg'); border-style: solid; border-color: #404040; border-width: 1"  class = "Menu" width = "148"  >&nbsp;
							</td>
						</tr>
					</table>
		</td>
						</tr>
					</table>
		  </form>

<%


Search = ""

If Country = "USA" Or Country = "CAN"  Then
  Search = "and CustCountry= '" & Country & "'"
End If 



If region = "Northeast" Then
	Search = "and (custState = 'ME' or custState = 'NH' or custState = 'VT' or custState = 'MA' or custState = 'RI' or custState = 'CT' or custState = 'NY' or custState = 'PA' or custState = 'NJ' )" 
End If 

If region = "Midwest" Then
	Search = "and (custState = 'WI' or custState = 'MI' or custState = 'IL' or custState = 'IN' or custState = 'OH' or custState = 'ND' or custState = 'SD' or custState = 'NE' or custState = 'KS'  or custState = 'MN' or custState = 'IA' or custState = 'MO')" 
End If 

 If region = "Southern" Then
	Search = "and (custState = 'DE' or custState = 'MD' or custState = 'DC' or custState = 'VA' or custState = 'WV' or custState = 'NC' or custState = 'SC' or custState = 'GA' or custState = 'FL'  or custState = 'KY' or custState = 'TN' or custState = 'MS' or custState = 'AL' or custState = 'OK' or custState = 'TX' or custState = 'AR' or custState = 'LA')" 
End If 

  
 If region = "Western" Or region = "west" Then
	Search = "and (custState = 'ID' or custState = 'MT' or custState = 'WY' or custState = 'NV' or custState = 'UT' or custState = 'CO' or custState = 'AZ' or custState = 'NM'  or custState = 'WA' or custState = 'OR' or custState = 'CA' or custState = 'HI')" 
End If 
 
 



 If region = "Canada" Then
	Search = "and (custState = 'ON' or custState = 'QC' or custState = 'BC' or custState = 'AB' or custState = 'MB' or custState = 'SK' or custState = 'NS' or custState = 'NB' or custState = 'NL'  or custState = 'PE' or custState = 'NT' or  custState = 'YK' or custState = 'NU' )" 
End If 

If Len(State) =2 Then
  Search = "and CustState= '" & State & "'"
End If 

Order = " "
If Len(Sort) > 3  Then
  Order = "  order by " & Sort & ""
Else
     Order = "  order by custcompany"
End If 


 	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" '& _ 
	' Get marketing text for the top of the page:
     
	sql = "SELECT * from sfCustomers where len(custfirstname) > 1 and accesslevel = 1 and not(custId = 110 or custid =109)   " & Search & Order 
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 
   If rs.eof Then %>
		<table border = "0" width = "600"  align = "center" >
					<tr>
						<td ><center>Sorry, we have no ranches that fit your search criteria. <br>
						Please try different criteria.
						</td>
					</tr>
		</table>

 <%  End if

While Not rs.eof 
    CustID = rs("CustID")
	Logo = rs("Logo")
	Weblink = rs("Weblink")
	custFirstName = rs("custFirstName")
	custMiddleInitial = rs("custMiddleInitial")
	custLastName = rs("custLastName")
	custCompany = rs("custCompany")
	custAddr1 = rs("custAddr1")
	custAddr2 = rs("custAddr2")
	custCity = rs("custCity")
	custState = rs("custState")
	custZip = rs("custZip")
	custCountry = rs("custCountry")
	custPhone = rs("custPhone")
	custphone2 = rs("custphone2")
	custFax = rs("custFax")
	custAccountID = rs("custAccountID")
	custEmail = rs("custEmail")

%><br>
<table border = "0" width = "600" height ="200" align = "center" background = "images/GandBBackground.jpg">
	<tr>
		<td >
<table>
	<tr>
		<td width = "200" align = "center" >
			<% if Len(Logo) > 2 Then %>
				<a href = "OurHerd.asp?CustID=<%=CustID%>" class = "body"><img src = "/Uploads/Logos/<%=Logo %>" border = "0" height = "100"></a>
			<% End If %>
		</td>
		<td class = "body"> <br>
			<% If Len(custCompany) > 2 Then %>
				<h2><%=custCompany%></h2>
			<% End If %>
			<% If Len(custFirstName) > 2 Then %>
				<b><%=custFirstName%></b>  <br>
			<% End If %>
			
			<% If Len(custAddr1) > 2 Then %>
				<%=custAddr1%> <br> 
			<% End If %>
			<% If Len(custAddr2) > 2 Then %>
				<%=custAddr2%> <br>
			<% End If %>
			<%=custCity%>, <%=custState%>&nbsp; <%=custCountry%> &nbsp;<%=custZip%> <br>
			<% If Len(custPhone) > 2 Then %>
				Phone: <%=custPhone%> <br>
			<% End If %>
			<% If Len(custPhone2) > 2 Then %>
				Phone 2: <%=custPhone2%> <br>
			<% End If %>
				<% If Len(custFax) > 2 Then %>
				FAX: <%=custFax%> <br>
			<% End If %>
			<a href = "http://<%=Weblink%>" class = "body" target = "blank"><%=Weblink%></a>  <br>
			<a href = "OurHerd.asp?CustID=<%=CustID%>" class = "body">Click Here To View Their Farm Page</big></a>
		</td>
	</tr>
</table>
		</td>
	</tr>
</table>



 <% 
   rs.movenext
	wend
	rs.close
	Set Conn = Nothing

 %>
 <br> <br>
 <!--#Include virtual="/AlpacaRanchquest/Footer.asp"--> 
</body>
</html>

