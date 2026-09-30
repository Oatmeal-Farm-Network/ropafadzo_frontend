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
<html>

<head>
<!--#Include file="GlobalVariables.asp"-->

<title><%= WebSiteName %> - Alpaca Ranches</title>
<meta name="description" content="List of Alpaca Ranches">
<META name="keywords" content="Alpaca Ranches, <%= WebSiteName %>, <%= Breed %>Alpacas, alpacas, alpaca,  female alpacas, male alpacas">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">


</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"-->
<br><h1>Advanced Search</h1>

<form action= 'Ranches.asp' method = "post">
				  	
					<table border = "0" width = "600"  align = "center" background = "images/background.jpg">
					<tr>
						<td ><center><b>Search For Alpaca Ranchess</b></center>
					<table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   width = "400" align = "center">

						<tr>
							<td class = "body">
							</td>
							<td class = "body"><b>Country</b>
							</td>
							<td class = "body"><b>Region</b>
							</td>
						<% '	<td class = "body"><b>State / Province</b>
							'</td>
						'</tr>
						%>
						<tr>
						<td class = "body"><b>Search By:</b>
							</td>
							<td class = "body"><% = Country %>
							  <select  name="Country">
								<% If Country = "Any"  Or Len(Country) < 3 Then %>
									<option value="Any" selected>Any</option>
								<% Else %>
										<option value="<% = Country %>" selected><% = Country %></option>
										<option value="Any" >Any</option>
								<% End If %>
								<option  value= "USA" >United States</option>
								<option  value= "CAN">Canada</option>
							  </select>
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
							<% '<td class = "body">
								'<select size="1" name="State">
								' If State = "Any" Then 
								 '	<option value="Any" selected>Any</option>
								' Else 
								 '		<option value="<% = State " selected><% = State </option>
									 '	<option value="Any" >Any</option>
								 'End If 
								'	<option value="AL"> Alabama </option>
									'<option  value="AK"> Alaska </option>
									'<option  value="AZ"> Arizona </option>
									'<option  value="AR"> Arkansas </option>
									'<option  value="CA"> California </option>
									'<option  value="CO"> Colorado </option>
									'<option  value="CT"> Connecticut </option>
									'<option  value="DE"> Delaware </option>
									'<option  value="DC"> District of Columbia </option>
									'<option  value="FL"> Florida</option>
								'	<option  value="GA"> Georgia </option>
									'<option  value="HI"> Hawaii </option>
								'	<option  value="ID"> Idaho </option>
									'<option  value="IL"> Illinois </option>
									'<option  value="IN"> Indiana </option>
									'<option  value="IA"> Iowa </option>
									'<option  value="KS"> Kansas </option>
									'<option  value="KY"> Kentucky </option>
									'<option  value="LA"> Louisiana </option>
									'<option  value="ME"> Maine </option>
									'<option  value="MD"> Maryland </option>
									'<option  value="MA"> Massachusetts </option>
								'	<option  value="MI"> Michigan </option>
									'<option  value="MN"> Minnesota </option>
								'	<option  value="MS"> Mississippi </option>
								'	<option  value="MO"> Missouri </option>
								'	<option  value="MT"> Montana </option>
								'	<option  value="NE"> Nebraska </option>
								'	<option  value="NV"> Nevada </option>
								'	<option  value="NH"> New Hampshire </option>
								'	<option  value="NJ"> New Jersey </option>
								'	<option  value="NM"> New Mexico </option>
								'	<option  value="NY"> New York </option>
								'	<option  value="NC"> North Carolina </option>
								'	<option  value="ND"> North Dakota </option>
								'	<option  value="OH"> Ohio </option>
								'	<option  value="OK"> Oklahoma </option>
								'	<option  value="OR"> Oregon </option>
								'	<option  value="PA"> Pennsylvania </option>
								'	<option  value="RI"> Rhode Island </option>
								'	<option  value="SC"> South Carolina </option>
								'	<option  value="SD"> South Dakota </option>
								'	<option  value="TN"> Tennessee </option>
								'	<option  value="TX"> Texas </option>
								'	<option  value="UT"> Utaha </option>
								'	<option  value="VT"> Vermont </option>
								'	<option  value="VA"> Virginia </option>
								'	<option  value="WA"> Washington </option>
								'	<option  value="WV"> West Virginia </option>
								'	<option  value="WI"> Wisconsin </option>
								'	<option  value="WY"> Wyoming </option>
								'	<option  value=""></option>
								'	<option  value="ON"> Ontario </option>
								'	<option  value="QC"> Qebec </option>
								'	<option  value="BC"> British Columbia </option>
								'	<option  value="AB"> Alberta </option>
								'	<option  value="MB"> Manitoba </option>
								'	<option  value="SK"> Saskatchewan </option>
								'	<option  value="NS"> Nova Scotia </option>
								'	<option  value="NB"> New Brunswick </option>
								'	<option  value="NL"> Newfoundland & Labrador </option>
								'	<option  value="PE"> Prince Edward Island </option>
								'	<option  value="NT"> Northwest Territories </option>
								'	<option  value="YK"> Yukon </option>
								'	<option  value="NU"> Nunavut </option>
							'	</select>
							'</td>
						'<tr>%>
						<tr>
							<td class = "body"><b>Sort By:</b>
							</td>
							<td class = "body" colspan = "3"> 
							<select  name="Sort">
								<option value="Any" selected>Any</option>
								<option  value= "CustCompany" >Ranch Name</option>
								<option  value= "CustState">State</option>
								  </select>
							</td>
						</tr>
						<tr>
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

 If region = "South" Then
	Search = "and (custState = 'DE' or custState = 'MD' or custState = 'DC' or custState = 'VA' or custState = 'WV' or custState = 'NC' or custState = 'SC' or custState = 'GA' or custState = 'FL'  or custState = 'KY' or custState = 'TN' or custState = 'MS' or custState = 'AL' or custState = 'OK' or custState = 'TX' or custState = 'AR' or custState = 'LA')" 
End If 

  
 If region = "West" Then
	Search = "and (custState = 'ID' or custState = 'MT' or custState = 'WY' or custState = 'NV' or custState = 'UT' or custState = 'CO' or custState = 'AZ' or custState = 'NM' or custState = 'AK'  or custState = 'WA' or custState = 'OR' or custState = 'CA' or custState = 'HI')" 
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
End If 


 	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" '& _ 
	' Get marketing text for the top of the page:
     
	sql = "SELECT * from sfCustomers where accesslevel = 1  " & Search & Order 
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 
   If rs.eof Then %>
		<table border = "0" width = "600"  align = "center" background = "images/background.jpg">
					<tr>
						<td ><center>Sorry, we have no ranches that fit your search criteria. <br>
						Please try different criteria.
						</td>
					</tr>
		</table>

 <%  End if


	rs.close
	Set Conn = Nothing

 %>
 <!--#Include file="Footer.asp"--> 
</body>
</html>

