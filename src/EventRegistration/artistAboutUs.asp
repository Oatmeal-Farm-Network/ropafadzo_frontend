<% SetLocale("en-us") 

CustID=Request.QueryString("CustID") 

%>
<html>

<head>
<!--#Include virtual="GlobalVariables.asp"-->

<%conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
			Set rs = Server.CreateObject("ADODB.Recordset")
			
			sql = "select  SfCustomers.* from SFCustomers where SFCustomers.custID= " & CustID
				'response.write(sql)
				rs.Open sql, conn, 3, 3
				If not rs.eof then
				 WebLink = rs("WebLink")
				 'response.write(WebLink)
				
					AboutUsPageImage = rs("AboutUsPageImage")
					AboutUsHeading = rs("AboutUsHeading")
				   custFirstName = rs("custFirstName")
				    custSlogan = rs("custSlogan")
				   custMiddleInitial  = rs("custMiddleInitial")
					custLastName  = rs("custLastName")
					custCompany   = rs("custCompany")
					custAddr1  = rs("custAddr1")
					custAddr2  = rs("custAddr2")
					custCity  = rs("custCity")
					custState   = rs("custState")
					custZip   = rs("custZip")
					custCountry   = rs("custCountry")
					custPhone   = rs("custPhone")
					custPhone2   = rs("custPhone2")
					custFAX   = rs("custFAX")
					Logo   = rs("Logo")
					Header   = rs("Header")
				AboutUsDescription   = rs("AboutUsDescription")


					str1 = WebLink
					str2 = "http://"
					If InStr(str1,str2) > 0 Then
							WebLink= Replace(str1,  str2, "")
					End If 

				rs.close
			End If 
			%>
<title>Contact <%= custCompany %></title>
<meta name="description" content="<%= custCompany %> About Us Page at ArtistanBarn.Org">
<META name="keywords" content="<%= custCompany %>">
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">



</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include virtual="Header.asp"-->

<!--#Include virtual="ArtistHeader.asp"-->
 <table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = "700">
	<tr>
	     <td class = "body"  >		
		   <% If Len(AboutUsHeading) > 1 Then %>
			<h1><%=AboutUsHeading%></h1>
			<% Else %>
				<br><h1>About Us</h1>
			<% End if %>
		</td>
	</tr>
	<tr>
		<td  class = "body"><% If Len(AboutUsPageImage) > 2 then%><img src = "<%=AboutUsPageImage%>" align = "right" width = "300"><% End If %>
			<%=AboutUsDescription%><br><br>
		</td>
	</tr>
</table>
	</td>
	</tr>
</table>
 <!--#Include virtual="Footer.asp"--> 
</body>
</html>

