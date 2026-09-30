
<html>
<head>

<%  PageName = "Artists" %>
<!--#Include virtual="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
<META name="description" content="<%= SEODescription %> ">
<META name="keywords" content="<%= SEOKeyword1 %>, 
<%=SEOKeyword2%>, 
<%=SEOKeyword3 %>,
<%=SEOKeyword4 %>, 
<%=SEOKeyword5 %>, 
<%=SEOKeyword6 %>,  
<%=SEOKeyword7 %>, 
<%=SEOKeyword8 %>, 
<%=SEOKeyword9 %>, 
<%=SEOKeyword10 %>, 
<%=SEOKeyword11 %>, 
 <%=SEOKeyword12 %>, 
 <%=SEOKeyword13 %>, 
 <%=SEOKeyword14 %>, 
 <%=SEOKeyword15 %>, 
 <%=SEOKeyword16 %>, 
 <%=SEOKeyword17 %>, 
 <%=SEOKeyword18 %>, 
 <%=SEOKeyword19 %>, 
 <%=SEOKeyword20 %> ">


<meta name="author" content="WebArtists.biz">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">

<% Sort=request.form("Sort")  %>
</head>


<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" width = "720">
				<td class = "body" align ="left">
					<h1>Barn Artisans</h1>
				</td>
			</tr>
		<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>





<%


Search = ""




If Len(State) =2 Then
  Search = "and CustState= '" & State & "'"
End If 

Order = " order by CustLastName"
If Len(Sort) > 3  Then
  Order = "  order by " & Sort & ""
End If 


 	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" '& _ 
	' Get marketing text for the top of the page:
     
	sql = "SELECT * from sfCustomers where ActiveMember = true and not custid=14   " & Search & Order  
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 
   If rs.eof Then %>
	<br>	<table border = "0" width = "600"  align = "center" background = "images/background.jpg">
					<tr>
						<td ><center>Sorry, we have no artists that fit your search criteria. <br>
						Please try different criteria.
						</td>
					</tr>
		</table>

 <%  End if
row = "odd"
 While  Not rs.eof  
    If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if

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
	custPhone = rs("custPhone")
	custphone2 = rs("custphone2")
	custFax = rs("custFax")
	custAccountID = rs("custAccountID")
	custEmail = rs("custEmail")
	custdescription = rs("custdescription")
	CustMedia = rs("CustMedia")

 If row = "even" Then %>
	<table border = "0" width = "720"  align = "center" bgcolor = "#E8CFB0">
<% Else %>
	<table border = "0" width = "720"  align = "center" bgcolor = "#F6EEE3">
<% End If %>
	<tr>
		<td >

<table>
	<tr>
		<td width = "150"  align = "center" valign = "middle" >
			<% if Len(Logo) > 2 Then %>
				<Table border="1" bordercolor = "Black"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" ><tr><td><table cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" >
				   <tr><td width = "100" height = "100" align = "center" valign = "middle" bgcolor = "white"><a href = "Ourgallery.asp?CustID=<%=CustID%>" class = "body"><img src = "/Uploads/<%=Logo %>" border = "0" width = "100"></a></td></tr></table></td></tr></table>
			<% End If %>
		</td>
		<td class = "body" valign = "top">
			
			
			
			
			
			<% If Len(custFirstName) > 2 Then %>
				<b><%=custFirstName%></b>  
			<% End If %>
				<% If Len(custLastName) > 2 Then %>
				<b><%=custLastName%></b>  
			<% End If %>
			<br>
			<% If Len(CustMedia) > 2 Then %>
				Media: <%=CustMedia%></b><br>
			<% End If %>

			
			
			<% If Len(weblink) > 3 Then %>
					<a href = "http://<%=Weblink%>" class = "body" target = "blank">Go to Website</a>  <br>
			<% End If %>
			<a href = "OurGallery.asp?CustID=<%=CustID%>" class = "body">View Artisan Pages</big></a><br><br>
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
 <br>
 <!--#Include virtual="Footer.asp"--> 
</body>
</html>

