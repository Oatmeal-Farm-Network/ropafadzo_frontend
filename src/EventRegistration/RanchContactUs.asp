<% SetLocale("en-us") 

CustID=Request.QueryString("CustID") 

%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<!--#Include file="GlobalVariables.asp"-->

<% conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
			Set rs = Server.CreateObject("ADODB.Recordset")
			
			sql = "select  SfCustomers.* from SFCustomers where SFCustomers.custID= " & CustID
				'response.write(sql)
				rs.Open sql, conn, 3, 3
				If not rs.eof then
				 WebLink = rs("WebLink")
				 'response.write(WebLink)
				
				'	RanchHomeImage = rs("RanchHomeImage")
				'	RanchHomeHeading = rs("RanchHomeHeading")
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
				RanchHomeText   = rs("RanchHomeText")
					CustEmail   = rs("CustEmail")


					str1 = WebLink
					str2 = "http://"
					If InStr(str1,str2) > 0 Then
							WebLink= Replace(str1,  str2, "")
					End If 

				rs.close
			End If 
			%>
<title>Contact <%= custCompany %></title>
<meta name="description" content="<%= custCompany %> Contact Us Page at Alpaca Ranch Quest">
<META name="keywords" content="<%= custCompany %>, <%= custCompany %> Alpacas, <%= Slogan %>, <%= Breed %>Alpacas, alpacas, alpaca,  female alpacas, male alpacas">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="ARQstyle.css">



</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="scripts.asp"-->
<!--#Include file="RanchHeader.asp"-->
 <table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = "600">
	<tr>
	     <td class = "body"  colspan = "2">	<br>	
		  <h1>Contact <%= custCompany %></h1>
		</td>
	</tr>
	<tr>
		<td  class = "body" valign = "top">
		<font color = "<%=PageTextColor%>">
		<% If Len(ContactUsPageImage) > 2 then%><img src = "<%=ContactUsPageImage%>" align = "right" width = "300"><% End If %>
			Please contact us at:</font>
				<table>
					<tr>
					  <td width = "50">&nbsp;</td>
					  <td class = "body">
				<font color = "<%=PageTextColor%>">
							<b><%=custCompany%></b><br>
							<% If Len(custSlogan) > 1 Then %>
				       <%= custSlogan%><br>
					  <% end if %>
							<b><%=custFirstName%></b><br>
							<% If Len(Weblink) > 1 Then %>
									<a href = "http://<%=Weblink%>" class = "body" target = "blank" rel="nofollow" ><font color = "<%=PageTextColor%>"><%=Weblink%></font></a><br>
							<% End If %>
							<% If Len(custPhone) > 1 Then %>
									Phone 1: 	<%=custPhone%><br>
							<% End If %>
							<% If Len(custphone2) > 1 Then %>
									Phone 2: 	<%=custPhone2%><br>
							<% End If %>
							<% If Len(custFAX) > 1 Then %>
									Fax: 	<%=custFAX%><br>
							<% End If %>
							<% If Len(custAddr1) > 1 Then %>
									<%=custAddr1%><br>
							<% End If %>
							<% If Len(custAddr2) > 1 Then %>
									<%=custAddr2%><br>
							<% End If %>
							<%=custCity%>,&nbsp;<%=custState%>&nbsp;<%=custCountry%>&nbsp;<%=custZip%><br><br><br><br></font>
							</td>
						</tr>
					</table>
		</td>
		</tr>
		<tr>
		<td class = "body">
<font color = "<%=PageTextColor%>">
		<% if len(custEmail) > 7 Then %>
		Also you can use the form below to contact us:
		    <!--#Include file="ContactRanch.asp"--> 
       <% End If %></font>
		  </td>
	</tr>
</table>

 <!--#Include file="RanchFooter.asp"--> 
</body>
</html>

